"""
ZameenLink Flask Backend API
ML-powered property price prediction with scam detection
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
from flasgger import Swagger, swag_from
import pandas as pd
import pickle
import json
import os
from geopy.distance import geodesic

from utils.scam_detector import detect_scam, detect_scam_enhanced
from utils.emi_calculator import calculate_emi
from retrain_scheduler import start_scheduler, start_retrain_async, get_retrain_status
from config import (
    API_HOST, API_PORT, DEBUG_MODE,
    FEATURE_COLUMNS, DATASET_FILE,
    BEST_MODEL_FILE, MODEL_METRICS_FILE, ZONE_BASE_PRICES
)

app = Flask(__name__)
CORS(app)  # Enable CORS for React frontend

# Swagger configuration
swagger_config = {
    "headers": [],
    "specs": [
        {
            "endpoint": 'apispec',
            "route": '/apispec.json',
            "rule_filter": lambda rule: True,
            "model_filter": lambda tag: True,
        }
    ],
    "static_url_path": "/flasgger_static",
    "swagger_ui": True,
    "specs_route": "/api/docs"
}

swagger_template = {
    "swagger": "2.0",
    "info": {
        "title": "ZameenLink API",
        "description": "ML-powered property price prediction and scam detection API for Bhopal real estate",
        "version": "1.0.0",
        "contact": {
            "name": "ZameenLink",
            "email": "support@zameenlink.com"
        }
    },
    "host": f"{API_HOST}:{API_PORT}",
    "basePath": "/",
    "schemes": ["http", "https"],
    "tags": [
        {
            "name": "Health",
            "description": "Health check endpoints"
        },
        {
            "name": "Properties",
            "description": "Property data endpoints"
        },
        {
            "name": "Prediction",
            "description": "ML prediction endpoints"
        },
        {
            "name": "Analytics",
            "description": "Analytics and metrics endpoints"
        }
    ]
}

swagger = Swagger(app, config=swagger_config, template=swagger_template)

# Application state (mutable dictionary for hot-reloading after retrain)
app_state = {
    'df': None,
    'model': None,
    'metrics': {}
}

# Load data and model on startup
print("Loading dataset and ML model...")
try:
    app_state['df'] = pd.read_csv(DATASET_FILE)
    print(f"✓ Loaded {len(app_state['df'])} properties")
    
    with open(BEST_MODEL_FILE, 'rb') as f:
        app_state['model'] = pickle.load(f)
    print(f"✓ Loaded model: {BEST_MODEL_FILE}")
    
    with open(MODEL_METRICS_FILE, 'r') as f:
        app_state['metrics'] = json.load(f)
    print(f"✓ Loaded metrics for {len(app_state['metrics'])} models")
    
    # Start auto-retrain scheduler
    start_scheduler(app_state)
    
except Exception as e:
    print(f"❌ Error loading data/model: {e}")
    print("Please run 'python model/train_model.py' first!")


@app.route('/api/health', methods=['GET'])
def health_check():
    """
    Health check endpoint
    ---
    tags:
      - Health
    summary: Check API health status
    description: Returns the current status of the API, model loading status, and number of properties loaded
    responses:
      200:
        description: API is healthy
        schema:
          type: object
          properties:
            status:
              type: string
              example: healthy
            model:
              type: string
              example: Random Forest loaded
            properties:
              type: integer
              example: 300
    """
    return jsonify({
        'status': 'healthy',
        'model': 'Random Forest loaded' if app_state['model'] else 'No model loaded',
        'properties': len(app_state['df']) if app_state['df'] is not None else 0
    })


@app.route('/api/properties', methods=['GET'])
def get_all_properties():
    """
    Get all properties for map display
    ---
    tags:
      - Properties
    summary: Retrieve property listings
    description: Get a list of properties with optional filtering by area and limit
    parameters:
      - name: limit
        in: query
        type: integer
        default: 100
        description: Maximum number of properties to return
      - name: area
        in: query
        type: string
        description: Filter properties by area name (e.g., Arera Colony)
    responses:
      200:
        description: Successfully retrieved properties
        schema:
          type: object
          properties:
            count:
              type: integer
              example: 100
            properties:
              type: array
              items:
                type: object
                properties:
                  property_id:
                    type: string
                  area_name:
                    type: string
                  latitude:
                    type: number
                  longitude:
                    type: number
                  plot_size_sqft:
                    type: integer
                  bhk:
                    type: integer
                  property_age_years:
                    type: integer
                  actual_fair_value:
                    type: number
      500:
        description: Dataset not loaded
    """
    if app_state['df'] is None:
        return jsonify({'error': 'Dataset not loaded'}), 500
    
    import random
    
    AMENITIES_POOL = [
        "Close to Hospital", "Close to Park", "Close to Market", "Close to School",
        "Less Crowded", "More Crowded", "Excellent Ventilation", "Pet Friendly",
        "24/7 Water Supply", "Power Backup", "High Security", "Gated Community",
        "Gymnasium", "Swimming Pool", "Club House", "Kids Play Area",
        "Vaastu Compliant", "Corner Property", "Main Road Facing", "Garden Facing"
    ]

    limit = int(request.args.get('limit', 1000))
    area = request.args.get('area', None)
    
    filtered_df = app_state['df']
    if area:
        filtered_df = app_state['df'][app_state['df']['area_name'] == area]
    
    properties = filtered_df.head(limit).to_dict(orient='records')
    
    # Inject deterministic amenities
    for p in properties:
        random.seed(p.get('property_id', 0))
        num_amenities = random.randint(5, 9)
        
        prop_type = "Commercial space" if p.get('zone_type') == 'commercial' else "Residential property"
        bhk_str = f"{p.get('bhk', 1)} BHK" if p.get('zone_type') != 'commercial' else f"{p.get('plot_size_sqft')} sq.ft"
        
        p['description_text'] = f"A well-maintained {bhk_str} {prop_type.lower()} located in the prime area of {p.get('area_name', 'Bhopal')}. " \
                                f"It offers excellent connectivity, modern aesthetics, and a comfortable lifestyle."
        
        p['amenities'] = random.sample(AMENITIES_POOL, num_amenities)
        
    random.seed() # reset seed
    
    return jsonify({
        'count': len(properties),
        'properties': properties
    })


@app.route('/api/areas', methods=['GET'])
def get_areas():
    """
    Get list of all areas with property counts
    ---
    tags:
      - Properties
    summary: Get area statistics
    description: Returns a list of all areas with property counts and average prices
    responses:
      200:
        description: Successfully retrieved area statistics
        schema:
          type: array
          items:
            type: object
            properties:
              area_name:
                type: string
                example: Arera Colony
              property_count:
                type: integer
                example: 25
              avg_price:
                type: number
                example: 8500000
      500:
        description: Dataset not loaded
    """
    if app_state['df'] is None:
        return jsonify({'error': 'Dataset not loaded'}), 500
    
    area_stats = app_state['df'].groupby('area_name').agg({
        'property_id': 'count',
        'actual_fair_value': 'mean'
    }).reset_index()
    
    area_stats.columns = ['area_name', 'property_count', 'avg_price']
    
    return jsonify(area_stats.to_dict(orient='records'))


@app.route('/api/predict', methods=['POST'])
def predict_price():
    """
    Predict property price and detect scams
    ---
    tags:
      - Prediction
    summary: Predict property price using ML
    description: Predicts fair market value for a property and performs scam detection against listed price
    parameters:
      - name: body
        in: body
        required: true
        schema:
          type: object
          required:
            - latitude
            - longitude
            - plot_size_sqft
            - bhk
            - property_age_years
          properties:
            latitude:
              type: number
              example: 23.2313
            longitude:
              type: number
              example: 77.4326
            plot_size_sqft:
              type: integer
              example: 1200
            bhk:
              type: integer
              example: 3
            property_age_years:
              type: integer
              example: 5
            dist_railway_station_km:
              type: number
              example: 3.5
            dist_airport_km:
              type: number
              example: 12.0
            dist_city_center_km:
              type: number
              example: 2.1
            dist_db_mall_km:
              type: number
              example: 1.5
            dist_aiims_km:
              type: number
              example: 4.2
            zone_price_index:
              type: number
              example: 8.5
            listed_price:
              type: number
              description: Optional - for scam detection
              example: 10000000
    responses:
      200:
        description: Successfully predicted price
        schema:
          type: object
          properties:
            predicted_fair_value:
              type: number
              example: 8500000
            price_per_sqft:
              type: number
              example: 7083.33
            scam_analysis:
              type: object
              properties:
                risk_level:
                  type: string
                  example: MEDIUM
                deviation_percent:
                  type: number
                  example: 17.65
                message:
                  type: string
            nearby_properties:
              type: array
            model_confidence:
              type: object
      400:
        description: Invalid request data
      500:
        description: Model not loaded
    """
    if app_state['model'] is None:
        return jsonify({'error': 'Model not loaded'}), 500
    
    try:
        data = request.json
        
        # Extract features in correct order
        features = [data.get(col, 0) for col in FEATURE_COLUMNS]
        
        # Predict
        predicted_price = app_state['model'].predict([features])[0]
        
        # Scam detection
        scam_analysis = {'risk_level': 'UNKNOWN'}
        if 'listed_price' in data and data['listed_price'] > 0:
            description = data.get('description', None)
            image_urls = data.get('image_urls', [])
            image_count = data.get('image_count', len(image_urls))
            
            scam_analysis = detect_scam_enhanced(
                data['listed_price'], 
                predicted_price,
                description=description,
                image_data=image_urls if image_urls else None,
                image_count=image_count
            )
        
        # Find nearby properties for comparison
        if app_state['df'] is not None and 'latitude' in data and 'longitude' in data:
            property_location = (data['latitude'], data['longitude'])
            
            # Calculate distances
            df_copy = app_state['df'].copy()
            df_copy['distance_from_query'] = df_copy.apply(
                lambda row: geodesic(
                    property_location,
                    (row['latitude'], row['longitude'])
                ).kilometers,
                axis=1
            )
            
            nearby = df_copy.nsmallest(5, 'distance_from_query')[
                ['property_id', 'area_name', 'actual_fair_value', 'plot_size_sqft', 'distance_from_query']
            ].to_dict(orient='records')
        else:
            nearby = []
        
        return jsonify({
            'predicted_fair_value': round(predicted_price, 2),
            'price_per_sqft': round(predicted_price / data.get('plot_size_sqft', 1), 2),
            'scam_analysis': scam_analysis,
            'nearby_properties': nearby,
            'model_confidence': {
                'r2_score': app_state['metrics'].get('Random Forest', {}).get('r2_score', 0),
                'avg_error': app_state['metrics'].get('Random Forest', {}).get('mae', 0)
            }
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 400


@app.route('/api/heatmap', methods=['GET'])
def get_heatmap_data():
    """
    Get price heatmap data
    ---
    tags:
      - Analytics
    summary: Get heatmap visualization data
    description: Returns coordinates and price per sqft for heatmap visualization
    responses:
      200:
        description: Successfully retrieved heatmap data
        schema:
          type: object
          properties:
            heatmap_points:
              type: array
              items:
                type: array
                items:
                  type: number
              example: [[23.2313, 77.4326, 7083.33]]
            max_price:
              type: number
              example: 15000
            min_price:
              type: number
              example: 3000
      500:
        description: Dataset not loaded
    """
    if app_state['df'] is None:
        return jsonify({'error': 'Dataset not loaded'}), 500
    
    heatmap_data = app_state['df'].apply(
        lambda row: [
            row['latitude'],
            row['longitude'],
            row['actual_fair_value'] / row['plot_size_sqft']
        ],
        axis=1
    ).tolist()
    
    return jsonify({
        'heatmap_points': heatmap_data[:200],  # Limit for performance
        'max_price': float(app_state['df']['actual_fair_value'].max() / app_state['df']['plot_size_sqft'].min()),
        'min_price': float(app_state['df']['actual_fair_value'].min() / app_state['df']['plot_size_sqft'].max())
    })


@app.route('/api/metrics', methods=['GET'])
def get_model_metrics():
    """
    Get model comparison metrics
    ---
    tags:
      - Analytics
    summary: Get ML model performance metrics
    description: Returns performance metrics for all trained models (Linear Regression, Random Forest, XGBoost)
    responses:
      200:
        description: Successfully retrieved metrics
        schema:
          type: object
          additionalProperties:
            type: object
            properties:
              r2_score:
                type: number
                example: 0.8615
              rmse:
                type: number
                example: 2485306.24
              mae:
                type: number
                example: 1958220.11
    """
    return jsonify(app_state['metrics'])


@app.route('/api/emi', methods=['POST'])
def calculate_emi_endpoint():
    """
    Calculate EMI
    ---
    tags:
      - Analytics
    summary: Calculate EMI and amortization schedule
    parameters:
      - name: body
        in: body
        required: true
        schema:
          type: object
          properties:
            principal:
              type: number
            annual_rate:
              type: number
            tenure_years:
              type: integer
            down_payment_percent:
              type: number
    responses:
      200:
        description: EMI calculation successful
    """
    data = request.json
    principal = data.get('principal', 0)
    annual_rate = data.get('annual_rate', 8.5)
    tenure_years = data.get('tenure_years', 20)
    down_payment_percent = data.get('down_payment_percent', 20)
    
    result = calculate_emi(principal, annual_rate, tenure_years, down_payment_percent)
    return jsonify(result)


@app.route('/api/trends', methods=['GET'])
def get_price_trends():
    """
    Get price trends for an area
    ---
    tags:
      - Analytics
    summary: Generate quarterly price trends for an area
    parameters:
      - name: area
        in: query
        type: string
        required: true
    responses:
      200:
        description: Price trends generated
    """
    area = request.args.get('area')
    if not area:
        return jsonify({'error': 'Area parameter required'}), 400
        
    base_price = ZONE_BASE_PRICES.get(area, 5000)
    
    # Generate 8 quarters of simulated historical data
    # (Using a realistic upward trend with some noise)
    import random
    import math
    
    trends = []
    current_price = base_price * 0.85  # Start from 2 years ago (15% lower)
    
    quarters = ['Q3 2024', 'Q4 2024', 'Q1 2025', 'Q2 2025', 'Q3 2025', 'Q4 2025', 'Q1 2026', 'Q2 2026']
    
    for i, q in enumerate(quarters):
        # Base growth + random noise
        growth = 1.015 + (random.random() * 0.02)
        if i > 0:
            current_price *= growth
            
        trends.append({
            'quarter': q,
            'price_per_sqft': round(current_price)
        })
        
    # Ensure current base price is the latest
    trends[-1]['price_per_sqft'] = base_price
    
    return jsonify({
        'area': area,
        'current_price': base_price,
        'growth_2yr': round(((base_price / (base_price * 0.85)) - 1) * 100, 1),
        'history': trends
    })


@app.route('/api/retrain', methods=['POST'])
def trigger_retrain():
    """
    Trigger manual model retraining
    ---
    tags:
      - Analytics
    summary: Start background model retraining
    responses:
      200:
        description: Retrain started
    """
    result = start_retrain_async(app_state)
    return jsonify(result)


@app.route('/api/retrain/status', methods=['GET'])
def retrain_status():
    """
    Get model retraining status
    ---
    tags:
      - Analytics
    summary: Get background model retraining status
    responses:
      200:
        description: Current status
    """
    status = get_retrain_status()
    # Also attach the current live metrics so UI can compare
    status['current_metrics'] = app_state['metrics']
    return jsonify(status)


if __name__ == '__main__':
    print("\n" + "="*60)
    print("ZAMEENLINK BACKEND API")
    print("="*60)
    print(f"Starting server on http://{API_HOST}:{API_PORT}")
    print(f"API Documentation: http://{API_HOST}:{API_PORT}/api/docs")
    print("Press CTRL+C to stop")
    print("="*60 + "\n")
    
    app.run(debug=DEBUG_MODE, host=API_HOST, port=API_PORT)

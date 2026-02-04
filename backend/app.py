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

from utils.scam_detector import detect_scam
from config import (
    API_HOST, API_PORT, DEBUG_MODE,
    FEATURE_COLUMNS, DATASET_FILE,
    BEST_MODEL_FILE, MODEL_METRICS_FILE
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

# Load data and model on startup
print("Loading dataset and ML model...")
try:
    df = pd.read_csv(DATASET_FILE)
    print(f"✓ Loaded {len(df)} properties")
    
    with open(BEST_MODEL_FILE, 'rb') as f:
        model = pickle.load(f)
    print(f"✓ Loaded model: {BEST_MODEL_FILE}")
    
    with open(MODEL_METRICS_FILE, 'r') as f:
        metrics = json.load(f)
    print(f"✓ Loaded metrics for {len(metrics)} models")
    
except Exception as e:
    print(f"❌ Error loading data/model: {e}")
    print("Please run 'python model/train_model.py' first!")
    df = None
    model = None
    metrics = {}


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
        'model': 'Random Forest loaded' if model else 'No model loaded',
        'properties': len(df) if df is not None else 0
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
    if df is None:
        return jsonify({'error': 'Dataset not loaded'}), 500
    
    limit = int(request.args.get('limit', 100))
    area = request.args.get('area', None)
    
    filtered_df = df
    if area:
        filtered_df = df[df['area_name'] == area]
    
    properties = filtered_df.head(limit).to_dict(orient='records')
    
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
    if df is None:
        return jsonify({'error': 'Dataset not loaded'}), 500
    
    area_stats = df.groupby('area_name').agg({
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
    if model is None:
        return jsonify({'error': 'Model not loaded'}), 500
    
    try:
        data = request.json
        
        # Extract features in correct order
        features = [data.get(col, 0) for col in FEATURE_COLUMNS]
        
        # Predict
        predicted_price = model.predict([features])[0]
        
        # Scam detection
        scam_analysis = {'risk_level': 'UNKNOWN'}
        if 'listed_price' in data and data['listed_price'] > 0:
            scam_analysis = detect_scam(data['listed_price'], predicted_price)
        
        # Find nearby properties for comparison
        if df is not None and 'latitude' in data and 'longitude' in data:
            property_location = (data['latitude'], data['longitude'])
            
            # Calculate distances
            df_copy = df.copy()
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
                'r2_score': metrics.get('Random Forest', {}).get('r2_score', 0),
                'avg_error': metrics.get('Random Forest', {}).get('mae', 0)
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
    if df is None:
        return jsonify({'error': 'Dataset not loaded'}), 500
    
    heatmap_data = df.apply(
        lambda row: [
            row['latitude'],
            row['longitude'],
            row['actual_fair_value'] / row['plot_size_sqft']
        ],
        axis=1
    ).tolist()
    
    return jsonify({
        'heatmap_points': heatmap_data[:200],  # Limit for performance
        'max_price': float(df['actual_fair_value'].max() / df['plot_size_sqft'].min()),
        'min_price': float(df['actual_fair_value'].min() / df['plot_size_sqft'].max())
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
    return jsonify(metrics)


if __name__ == '__main__':
    print("\n" + "="*60)
    print("ZAMEENLINK BACKEND API")
    print("="*60)
    print(f"Starting server on http://{API_HOST}:{API_PORT}")
    print(f"API Documentation: http://{API_HOST}:{API_PORT}/api/docs")
    print("Press CTRL+C to stop")
    print("="*60 + "\n")
    
    app.run(debug=DEBUG_MODE, host=API_HOST, port=API_PORT)

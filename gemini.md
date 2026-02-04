# COMPLETE ML-Based Property Price Predictor - Bhopal (Final Year Capstone Project)

## PROJECT CONTEXT
This is a final year engineering capstone project that MUST demonstrate actual Machine Learning implementation, not just a prototype. The project will be evaluated by academic panel who will check for: proper ML methodology, model comparison, accuracy metrics, feature engineering, and end-to-end implementation.

Timeline: Working demo needed in 2 days, full project in 6-8 weeks.

---

## CRITICAL REQUIREMENTS - READ CAREFULLY

### MUST HAVES (Non-Negotiable):
1. ✅ THREE ML models trained and compared: Linear Regression, Random Forest, XGBoost
2. ✅ Proper train-test split (80-20) with documented metrics (R², RMSE, MAE)
3. ✅ Real feature engineering with distance calculations (not just lat/lng)
4. ✅ Complete working web application (React frontend + Flask backend)
5. ✅ Scam detection algorithm based on price deviation
6. ✅ Deployment-ready code with setup instructions
7. ✅ Professional UI with interactive map and price heatmap
8. ✅ Well-documented code for academic evaluation

### MUST NOT:
❌ Use only algorithmic simulation without actual ML models
❌ Skip model comparison or metrics calculation
❌ Create frontend-only prototype without ML backend
❌ Use unrealistic random data (must use zone-based realistic synthetic data)
❌ Skip distance-based features (critical for property pricing)

---

## COMPLETE TECH STACK

### Backend:
- **Language**: Python 3.9+
- **Framework**: Flask 2.3.0
- **ML Libraries**: 
  - scikit-learn 1.3.0 (Linear Regression, Random Forest)
  - xgboost 2.0.0 (XGBoost Regressor)
  - pandas 2.0.0 (data manipulation)
  - numpy 1.24.0 (numerical computing)
  - geopy 2.3.0 (distance calculations)
- **Model Persistence**: pickle
- **CORS**: flask-cors 4.0.0

### Frontend:
- **Framework**: React 18.2.0 with Vite
- **Map Library**: react-leaflet 4.2.1 + leaflet 1.9.4
- **HTTP Client**: axios 1.6.0
- **Charting**: recharts 2.10.0 (for analytics/metrics visualization)
- **Styling**: Tailwind CSS 3.4.0
- **Icons**: lucide-react 0.263.1

### Deployment:
- **Frontend**: Vercel (free tier)
- **Backend**: Railway or Render (free tier)
- **Database**: SQLite for demo, PostgreSQL for production (optional)

---

## COMPLETE FILE STRUCTURE
````
bhopal-property-predictor/
├── backend/
│   ├── app.py                          # Main Flask application
│   ├── requirements.txt                # Python dependencies
│   ├── model/
│   │   ├── train_model.py             # ML training script
│   │   ├── data_generator.py          # Synthetic data generation
│   │   ├── feature_engineering.py     # Distance calculations & features
│   │   ├── bhopal_properties.csv      # Generated dataset (250+ rows)
│   │   ├── linear_regression.pkl      # Saved LR model
│   │   ├── random_forest.pkl          # Saved RF model (best)
│   │   ├── xgboost_model.pkl          # Saved XGB model
│   │   └── model_metrics.json         # R², RMSE, MAE for all models
│   ├── utils/
│   │   ├── scam_detector.py           # Scam detection logic
│   │   └── landmarks.py               # Bhopal landmarks coordinates
│   └── config.py                       # Configuration constants
│
├── frontend/
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── index.html
│   ├── src/
│   │   ├── App.jsx                    # Main app component
│   │   ├── main.jsx                   # Entry point
│   │   ├── components/
│   │   │   ├── MapView.jsx           # Leaflet map with markers
│   │   │   ├── PropertyMarker.jsx    # Individual property marker
│   │   │   ├── PredictionPanel.jsx   # Side panel with prediction details
│   │   │   ├── ScamAlert.jsx         # Scam warning component
│   │   │   ├── PriceHeatmap.jsx      # Heatmap overlay
│   │   │   ├── ComparisonTable.jsx   # Nearby properties comparison
│   │   │   ├── Analytics.jsx         # Model metrics visualization
│   │   │   └── SearchBar.jsx         # Area search functionality
│   │   ├── api/
│   │   │   └── apiClient.js          # Axios API calls
│   │   ├── utils/
│   │   │   └── helpers.js            # Utility functions
│   │   └── styles/
│   │       └── globals.css           # Global styles
│
├── docs/
│   ├── SETUP.md                       # Installation instructions
│   ├── API_DOCUMENTATION.md           # API endpoints documentation
│   ├── MODEL_METHODOLOGY.md           # ML methodology explanation
│   └── DEPLOYMENT.md                  # Deployment guide
│
└── README.md                          # Project overview
````

---

## DETAILED IMPLEMENTATION SPECIFICATIONS

### 1. DATA GENERATION (backend/model/data_generator.py)

**Realistic Bhopal Zones with Base Prices:**
````python
BHOPAL_ZONES = {
    "Arera Colony": {
        "base_price_per_sqft": 8500,
        "lat_center": 23.2313,
        "lng_center": 77.4326,
        "variance": 1500,
        "zone_type": "premium_residential"
    },
    "MP Nagar": {
        "base_price_per_sqft": 7000,
        "lat_center": 23.2332,
        "lng_center": 77.4343,
        "variance": 1200,
        "zone_type": "commercial"
    },
    "Kolar Road": {
        "base_price_per_sqft": 3500,
        "lat_center": 23.1746,
        "lng_center": 77.4137,
        "variance": 500,
        "zone_type": "budget"
    },
    "Indrapuri": {
        "base_price_per_sqft": 4200,
        "lat_center": 23.2484,
        "lng_center": 77.4654,
        "variance": 600,
        "zone_type": "residential"
    },
    "Ayodhya Bypass": {
        "base_price_per_sqft": 2800,
        "lat_center": 23.2721,
        "lng_center": 77.4691,
        "variance": 400,
        "zone_type": "developing"
    },
    "Shahpura": {
        "base_price_per_sqft": 5500,
        "lat_center": 23.1987,
        "lng_center": 77.4289,
        "variance": 800,
        "zone_type": "residential"
    },
    "Hoshangabad Road": {
        "base_price_per_sqft": 6200,
        "lat_center": 23.2156,
        "lng_center": 77.4673,
        "variance": 900,
        "zone_type": "commercial"
    },
    "Bairagarh": {
        "base_price_per_sqft": 3200,
        "lat_center": 23.2615,
        "lng_center": 77.3421,
        "variance": 450,
        "zone_type": "budget"
    }
}
````

**Major Bhopal Landmarks for Distance Calculation:**
````python
BHOPAL_LANDMARKS = {
    "railway_station": {"lat": 23.2685, "lng": 77.4113, "name": "Bhopal Junction"},
    "airport": {"lat": 23.2875, "lng": 77.3374, "name": "Raja Bhoj Airport"},
    "city_center": {"lat": 23.2599, "lng": 77.4126, "name": "New Market"},
    "db_mall": {"lat": 23.2420, "lng": 77.4356, "name": "DB City Mall"},
    "aiims": {"lat": 23.2330, "lng": 77.4060, "name": "AIIMS Bhopal"},
    "manit": {"lat": 23.2156, "lng": 77.4126, "name": "MANIT College"},
    "upper_lake": {"lat": 23.2494, "lng": 77.4050, "name": "Upper Lake"},
    "lower_lake": {"lat": 23.2329, "lng": 77.3663, "name": "Lower Lake"}
}
````

**Data Generation Logic:**
- Generate 250-300 property records
- For each property:
  - Random zone selection from BHOPAL_ZONES
  - Lat/Lng randomized ±0.01 degrees from zone center (~1km radius)
  - Plot size: Random between 800-3500 sq ft
  - Bedrooms (BHK): Random 1-5
  - Property age: Random 0-20 years
  - Base price calculation:
````
    price_per_sqft = zone_base_price + random_normal(0, zone_variance)
    
    Adjustments:
    - If BHK > 3: +500/sqft
    - If age < 5: +800/sqft (new property premium)
    - If age > 15: -600/sqft (depreciation)
    
    actual_fair_value = plot_size * price_per_sqft
    
    Scam simulation (10% of properties):
    listed_price = actual_fair_value * 1.35 (if is_scam else actual_fair_value)
````

**CSV Output Schema:**
````
property_id, area_name, latitude, longitude, plot_size_sqft, bhk, property_age_years, 
listed_price, actual_fair_value, zone_type, has_parking, has_garden
````

---

### 2. FEATURE ENGINEERING (backend/model/feature_engineering.py)

**Calculate Distance Features using Haversine Formula:**
````python
from geopy.distance import geodesic

def calculate_distances(property_lat, property_lng, landmarks):
    """
    Calculate distances from property to all landmarks
    Returns: dict with distances in kilometers
    """
    property_location = (property_lat, property_lng)
    distances = {}
    
    for landmark_name, landmark_data in landmarks.items():
        landmark_location = (landmark_data['lat'], landmark_data['lng'])
        distance_km = geodesic(property_location, landmark_location).kilometers
        distances[f'dist_{landmark_name}_km'] = round(distance_km, 2)
    
    return distances
````

**Final Feature Set for ML Models (11 features):**
````python
FEATURE_COLUMNS = [
    'latitude',                    # Geographic coordinate
    'longitude',                   # Geographic coordinate
    'plot_size_sqft',             # Property size
    'bhk',                        # Number of bedrooms
    'property_age_years',         # Age in years
    'dist_railway_station_km',    # Distance to railway
    'dist_airport_km',            # Distance to airport
    'dist_city_center_km',        # Distance to New Market
    'dist_db_mall_km',            # Distance to mall
    'dist_aiims_km',              # Distance to hospital
    'zone_price_index'            # Normalized zone pricing (0-10 scale)
]

TARGET_COLUMN = 'actual_fair_value'  # What we're predicting
````

**Zone Price Index Calculation:**
````python
def calculate_zone_price_index(base_price_per_sqft):
    """
    Normalize zone prices to 0-10 scale
    Min price in Bhopal: ₹2800/sqft (Ayodhya Bypass)
    Max price in Bhopal: ₹8500/sqft (Arera Colony)
    """
    min_price = 2800
    max_price = 8500
    index = ((base_price_per_sqft - min_price) / (max_price - min_price)) * 10
    return round(index, 2)
````

---

### 3. ML MODEL TRAINING (backend/model/train_model.py)

**Complete Training Pipeline:**
````python
import pandas as pd
import numpy as np
import pickle
import json
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression
from sklearn.ensemble import RandomForestRegressor
from xgboost import XGBRegressor
from sklearn.metrics import r2_score, mean_squared_error, mean_absolute_error
from data_generator import generate_bhopal_data
from feature_engineering import add_distance_features

# Step 1: Generate and prepare data
print("Generating synthetic Bhopal property data...")
df = generate_bhopal_data(n_properties=300)
df = add_distance_features(df)  # Add distance columns
df.to_csv('bhopal_properties.csv', index=False)
print(f"Generated {len(df)} properties")

# Step 2: Prepare features and target
FEATURE_COLUMNS = [
    'latitude', 'longitude', 'plot_size_sqft', 'bhk', 'property_age_years',
    'dist_railway_station_km', 'dist_airport_km', 'dist_city_center_km',
    'dist_db_mall_km', 'dist_aiims_km', 'zone_price_index'
]

X = df[FEATURE_COLUMNS]
y = df['actual_fair_value']

# Step 3: Train-test split
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

print(f"\nTraining set: {len(X_train)} properties")
print(f"Testing set: {len(X_test)} properties")

# Step 4: Train and evaluate models
models = {
    'Linear Regression': LinearRegression(),
    'Random Forest': RandomForestRegressor(
        n_estimators=100, 
        max_depth=15, 
        random_state=42
    ),
    'XGBoost': XGBRegressor(
        n_estimators=100, 
        max_depth=7, 
        learning_rate=0.1, 
        random_state=42
    )
}

results = {}

for model_name, model in models.items():
    print(f"\n{'='*50}")
    print(f"Training {model_name}...")
    
    # Train
    model.fit(X_train, y_train)
    
    # Predict
    y_pred = model.predict(X_test)
    
    # Metrics
    r2 = r2_score(y_test, y_pred)
    rmse = np.sqrt(mean_squared_error(y_test, y_pred))
    mae = mean_absolute_error(y_test, y_pred)
    
    results[model_name] = {
        'r2_score': round(r2, 4),
        'rmse': round(rmse, 2),
        'mae': round(mae, 2)
    }
    
    print(f"R² Score: {r2:.4f}")
    print(f"RMSE: ₹{rmse:,.2f}")
    print(f"MAE: ₹{mae:,.2f}")
    
    # Save model
    filename = model_name.lower().replace(' ', '_') + '.pkl'
    with open(filename, 'wb') as f:
        pickle.dump(model, f)
    print(f"Model saved: {filename}")

# Step 5: Save metrics comparison
with open('model_metrics.json', 'w') as f:
    json.dump(results, f, indent=2)

# Step 6: Determine best model
best_model = max(results.items(), key=lambda x: x[1]['r2_score'])
print(f"\n{'='*50}")
print(f"BEST MODEL: {best_model[0]}")
print(f"R² Score: {best_model[1]['r2_score']}")
print("This model will be used for predictions in production")
````

**Expected Output:**
````
==================================================
Training Linear Regression...
R² Score: 0.7234
RMSE: ₹285,432.15
MAE: ₹198,567.89

==================================================
Training Random Forest...
R² Score: 0.8756
RMSE: ₹165,234.78
MAE: ₹112,345.67

==================================================
Training XGBoost...
R² Score: 0.8612
RMSE: ₹178,901.23
MAE: ₹125,678.90

==================================================
BEST MODEL: Random Forest
R² Score: 0.8756
````

---

### 4. SCAM DETECTION (backend/utils/scam_detector.py)
````python
def detect_scam(listed_price, predicted_fair_value):
    """
    Analyzes price deviation and returns risk assessment
    
    Args:
        listed_price: Price shown in listing
        predicted_fair_value: ML model's prediction
    
    Returns:
        dict with risk_level, deviation_percent, message
    """
    if listed_price <= 0 or predicted_fair_value <= 0:
        return {
            'risk_level': 'UNKNOWN',
            'deviation_percent': 0,
            'message': 'Invalid price data'
        }
    
    deviation = ((listed_price - predicted_fair_value) / predicted_fair_value) * 100
    
    if deviation > 30:
        risk = 'CRITICAL'
        message = '⚠️ SCAM ALERT: Property is severely overpriced. Avoid this deal!'
        color = '#DC2626'  # Red
    elif deviation > 20:
        risk = 'HIGH'
        message = '⚠️ HIGH RISK: Price is significantly above market rate'
        color = '#EA580C'  # Orange
    elif deviation > 10:
        risk = 'MEDIUM'
        message = '⚡ CAUTION: Slightly overpriced, negotiate strongly'
        color = '#F59E0B'  # Yellow
    elif deviation > -5:
        risk = 'LOW'
        message = '✓ FAIR PRICE: Within acceptable market range'
        color = '#10B981'  # Green
    else:
        risk = 'BARGAIN'
        message = '⭐ GREAT DEAL: Price below market average!'
        color = '#3B82F6'  # Blue
    
    return {
        'risk_level': risk,
        'deviation_percent': round(deviation, 1),
        'message': message,
        'color': color,
        'is_scam': deviation > 20
    }
````

---

### 5. FLASK BACKEND API (backend/app.py)
````python
from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import pickle
import json
from utils.scam_detector import detect_scam

app = Flask(__name__)
CORS(app)  # Allow React frontend

# Load data and best model
df = pd.read_csv('model/bhopal_properties.csv')
with open('model/random_forest.pkl', 'rb') as f:
    model = pickle.load(f)

with open('model/model_metrics.json', 'r') as f:
    metrics = json.load(f)

FEATURE_COLUMNS = [
    'latitude', 'longitude', 'plot_size_sqft', 'bhk', 'property_age_years',
    'dist_railway_station_km', 'dist_airport_km', 'dist_city_center_km',
    'dist_db_mall_km', 'dist_aiims_km', 'zone_price_index'
]

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({'status': 'healthy', 'model': 'Random Forest loaded'})

@app.route('/api/properties', methods=['GET'])
def get_all_properties():
    """
    Get all properties for map display
    Query params: ?limit=50&area=Arera Colony
    """
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
    """Get list of all areas with property counts"""
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
    
    Request body:
    {
        "latitude": 23.2313,
        "longitude": 77.4326,
        "plot_size_sqft": 1200,
        "bhk": 3,
        "property_age_years": 5,
        "dist_railway_station_km": 3.5,
        "dist_airport_km": 12.0,
        "dist_city_center_km": 2.1,
        "dist_db_mall_km": 1.5,
        "dist_aiims_km": 4.2,
        "zone_price_index": 8.5,
        "listed_price": 10000000  # Optional, for scam detection
    }
    """
    try:
        data = request.json
        
        # Extract features in correct order
        features = [data[col] for col in FEATURE_COLUMNS]
        
        # Predict
        predicted_price = model.predict([features])[0]
        
        # Scam detection
        scam_analysis = {'risk_level': 'UNKNOWN'}
        if 'listed_price' in data and data['listed_price'] > 0:
            scam_analysis = detect_scam(data['listed_price'], predicted_price)
        
        # Find nearby properties for comparison
        property_location = (data['latitude'], data['longitude'])
        df['distance_from_query'] = df.apply(
            lambda row: geodesic(
                property_location, 
                (row['latitude'], row['longitude'])
            ).kilometers,
            axis=1
        )
        
        nearby = df.nsmallest(5, 'distance_from_query')[
            ['property_id', 'area_name', 'actual_fair_value', 'plot_size_sqft', 'distance_from_query']
        ].to_dict(orient='records')
        
        return jsonify({
            'predicted_fair_value': round(predicted_price, 2),
            'price_per_sqft': round(predicted_price / data['plot_size_sqft'], 2),
            'scam_analysis': scam_analysis,
            'nearby_properties': nearby,
            'model_confidence': {
                'r2_score': metrics['Random Forest']['r2_score'],
                'avg_error': metrics['Random Forest']['mae']
            }
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@app.route('/api/heatmap', methods=['GET'])
def get_heatmap_data():
    """
    Get price heatmap data
    Returns: List of [lat, lng, price_per_sqft]
    """
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
    """Get model comparison metrics"""
    return jsonify(metrics)

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
````

---

### 6. REACT FRONTEND - COMPLETE IMPLEMENTATION

**App.jsx (Main Component):**
````jsx
import React, { useState, useEffect } from 'react';
import MapView from './components/MapView';
import PredictionPanel from './components/PredictionPanel';
import Analytics from './components/Analytics';
import SearchBar from './components/SearchBar';
import { fetchProperties, fetchMetrics } from './api/apiClient';

function App() {
  const [properties, setProperties] = useState([]);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [showHeatmap, setShowHeatmap] = useState(false);
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [propsData, metricsData] = await Promise.all([
        fetchProperties(),
        fetchMetrics()
      ]);
      setProperties(propsData.properties);
      setMetrics(metricsData);
      setLoading(false);
    } catch (error) {
      console.error('Failed to load data:', error);
      setLoading(false);
    }
  };

  const handlePropertyClick = (property) => {
    setSelectedProperty(property);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-lg text-gray-700">Loading Bhopal Properties...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Bhopal Property Price Predictor</h1>
              <p className="text-sm text-indigo-100">ML-Powered Scam Detection System</p>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowHeatmap(!showHeatmap)}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  showHeatmap 
                    ? 'bg-white text-indigo-600' 
                    : 'bg-indigo-700 hover:bg-indigo-800'
                }`}
              >
                {showHeatmap ? '🗺️ Hide Heatmap' : '🔥 Show Heatmap'}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Map Section */}
        <div className="flex-1 relative">
          <SearchBar onSearch={(area) => console.log('Search:', area)} />
          <MapView
            properties={properties}
            onPropertyClick={handlePropertyClick}
            selectedProperty={selectedProperty}
            showHeatmap={showHeatmap}
          />
        </div>

        {/* Side Panel */}
        {selectedProperty && (
          <PredictionPanel
            property={selectedProperty}
            prediction={prediction}
            onClose={() => {
              setSelectedProperty(null);
              setPrediction(null);
            }}
            onPredict={setPrediction}
          />
        )}
      </div>

      {/* Analytics Footer */}
      {metrics && (
        <Analytics metrics={metrics} />
      )}
    </div>
  );
}

export default App;
````

**MapView.jsx (Leaflet Map):**
````jsx
import React, { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet.heat';
import PropertyMarker from './PropertyMarker';
import PriceHeatmap from './PriceHeatmap';

// Fix Leaflet default marker icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

const BHOPAL_CENTER = [23.2599, 77.4126];

// Custom marker icons based on price range
const createCustomIcon = (pricePerSqft) => {
  let color = '#10B981'; // Green (cheap)
  if (pricePerSqft > 7000) color = '#DC2626'; // Red (expensive)
  else if (pricePerSqft > 5000) color = '#F59E0B'; // Yellow (moderate)
  
  return L.divIcon({
    className: 'custom-marker',
    html: `
      <div style="
        background-color: ${color};
        width: 24px;
        height: 24px;
        border-radius: 50%;
        border: 3px solid white;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        cursor: pointer;
      "></div>
    `,
    iconSize: [24, 24],
    iconAnchor: [12, 12]
  });
};

function MapView({ properties, onPropertyClick, selectedProperty, showHeatmap }) {
  return (
    <MapContainer
      center={BHOPAL_CENTER}
      zoom={12}
      className="w-full h-full"
      zoomControl={true}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {/* Heatmap Layer */}
      {showHeatmap && <PriceHeatmap properties={properties} />}

      {/* Property Markers */}
      {properties.map((property) => {
        const pricePerSqft = property.actual_fair_value / property.plot_size_sqft;
        const isSelected = selectedProperty?.property_id === property.property_id;
        
        return (
          <Marker
            key={property.property_id}
            position={[property.latitude, property.longitude]}
            icon={createCustomIcon(pricePerSqft)}
            eventHandlers={{
              click: () => onPropertyClick(property)
            }}
          >
            <Popup>
              <div className="p-2">
                <h3 className="font-bold text-lg">{property.area_name}</h3>
                <p className="text-sm text-gray-600">{property.bhk} BHK • {property.plot_size_sqft} sq ft</p>
                <p className="text-lg font-semibold text-indigo-600 mt-2">
                  ₹{(property.actual_fair_value / 100000).toFixed(2)}L
                </p>
                <p className="text-xs text-gray-500">₹{pricePerSqft.toFixed(0)}/sq ft</p>
              </div>
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
}

export default MapView;
````

**PredictionPanel.jsx (Side Panel):**
````jsx
import React, { useState, useEffect } from 'react';
import { X, AlertTriangle, CheckCircle, TrendingUp } from 'lucide-react';
import { predictPrice } from '../api/apiClient';
import ScamAlert from './ScamAlert';
import ComparisonTable from './ComparisonTable';

function PredictionPanel({ property, prediction, onClose, onPredict }) {
  const [loading, setLoading] = useState(false);
  const [listedPrice, setListedPrice] = useState(property.listed_price || '');

  useEffect(() => {
    if (property && !prediction) {
      fetchPrediction();
    }
  }, [property]);

  const fetchPrediction = async () => {
    setLoading(true);
    try {
      const result = await predictPrice({
        ...property,
        listed_price: listedPrice || property.listed_price
      });
      onPredict(result);
    } catch (error) {
      console.error('Prediction failed:', error);
    }
    setLoading(false);
  };

  const pricePerSqft = property.actual_fair_value / property.plot_size_sqft;

  return (
    <div className="w-96 bg-white shadow-2xl overflow-y-auto">
      {/* Header */}
      <div className="sticky top-0 bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-4 flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold">{property.area_name}</h2>
          <p className="text-sm text-indigo-100">Property #{property.property_id}</p>
        </div>
        <button onClick={onClose} className="hover:bg-white/20 p-2 rounded-lg transition">
          <X size={24} />
        </button>
      </div>

      {/* Property Details */}
      <div className="p-4 border-b">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-gray-500">Plot Size</p>
            <p className="text-lg font-semibold">{property.plot_size_sqft} sq ft</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Bedrooms</p>
            <p className="text-lg font-semibold">{property.bhk} BHK</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Property Age</p>
            <p className="text-lg font-semibold">{property.property_age_years} years</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Zone Type</p>
            <p className="text-lg font-semibold capitalize">{property.zone_type}</p>
          </div>
        </div>
      </div>

      {/* Prediction Results */}
      {loading ? (
        <div className="p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Analyzing property...</p>
        </div>
      ) : prediction ? (
        <div className="p-4 space-y-4">
          {/* Scam Alert */}
          {prediction.scam_analysis && (
            <ScamAlert analysis={prediction.scam_analysis} />
          )}

          {/* Predicted Price */}
          <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">ML Predicted Fair Value</p>
            <p className="text-3xl font-bold text-indigo-600">
              ₹{(prediction.predicted_fair_value / 100000).toFixed(2)}L
            </p>
            <p className="text-sm text-gray-500 mt-1">
              ₹{prediction.price_per_sqft.toFixed(0)}/sq ft
            </p>
          </div>

          {/* Model Confidence */}
          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle size={20} className="text-green-600" />
              <span className="font-semibold text-green-800">Model Confidence</span>
            </div>
            <p className="text-sm text-gray-700">
              R² Score: <span className="font-semibold">{prediction.model_confidence.r2_score}</span> (87.6% accuracy)
            </p>
            <p className="text-sm text-gray-700">
              Avg Error: ±₹{(prediction.model_confidence.avg_error / 1000).toFixed(0)}K
            </p>
          </div>

          {/* Nearby Comparisons */}
          {prediction.nearby_properties && (
            <div>
              <h3 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                <TrendingUp size={18} />
                Nearby Properties
              </h3>
              <ComparisonTable properties={prediction.nearby_properties} />
            </div>
          )}
        </div>
      ) : (
        <div className="p-4">
          <button
            onClick={fetchPrediction}
            className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition"
          >
            Get Price Prediction
          </button>
        </div>
      )}
    </div>
  );
}

export default PredictionPanel;
````

**ScamAlert.jsx:**
````jsx
import React from 'react';
import { AlertTriangle, AlertCircle, CheckCircle, Star } from 'lucide-react';

function ScamAlert({ analysis }) {
  const getIcon = () => {
    switch (analysis.risk_level) {
      case 'CRITICAL': return <AlertTriangle size={24} />;
      case 'HIGH': return <AlertCircle size={24} />;
      case 'MEDIUM': return <AlertCircle size={20} />;
      case 'LOW': return <CheckCircle size={20} />;
      case 'BARGAIN': return <Star size={20} />;
      default: return null;
    }
  };

  return (
    <div
      className="p-4 rounded-lg border-2"
      style={{
        backgroundColor: `${analysis.color}15`,
        borderColor: analysis.color
      }}
    >
      <div className="flex items-start gap-3">
        <div style={{ color: analysis.color }}>
          {getIcon()}
        </div>
        <div className="flex-1">
          <p className="font-semibold" style={{ color: analysis.color }}>
            {analysis.risk_level} RISK
          </p>
          <p className="text-sm text-gray-700 mt-1">{analysis.message}</p>
          <p className="text-xs text-gray-500 mt-2">
            Price deviation: <span className="font-semibold">{analysis.deviation_percent}%</span> from market average
          </p>
        </div>
      </div>
    </div>
  );
}

export default ScamAlert;
````

**ComparisonTable.jsx:**
````jsx
import React from 'react';

function ComparisonTable({ properties }) {
  return (
    <div className="overflow-hidden rounded-lg border border-gray-200">
      <table className="min-w-full divide-y divide-gray-200 text-sm">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Area</th>
            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Size</th>
            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Distance</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {properties.map((prop, idx) => (
            <tr key={idx} className="hover:bg-gray-50">
              <td className="px-3 py-2 whitespace-nowrap text-gray-900">{prop.area_name}</td>
              <td className="px-3 py-2 whitespace-nowrap text-gray-600">{prop.plot_size_sqft} sqft</td>
              <td className="px-3 py-2 whitespace-nowrap text-indigo-600 font-semibold">
                ₹{(prop.actual_fair_value / 100000).toFixed(1)}L
              </td>
              <td className="px-3 py-2 whitespace-nowrap text-gray-500 text-xs">
                {prop.distance_from_query.toFixed(2)} km
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ComparisonTable;
````

**Analytics.jsx (Model Metrics Display):**
````jsx
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

function Analytics({ metrics }) {
  const chartData = Object.entries(metrics).map(([name, values]) => ({
    name: name,
    'R² Score': (values.r2_score * 100).toFixed(1),
    'RMSE (₹L)': (values.rmse / 100000).toFixed(1),
    'MAE (₹L)': (values.mae / 100000).toFixed(1)
  }));

  return (
    <div className="bg-white border-t shadow-lg">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-semibold text-gray-800">Model Performance Comparison</h3>
          <span className="text-xs text-gray-500">Lower error = Better accuracy</span>
        </div>
        
        <ResponsiveContainer width="100%" height={150}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" style={{ fontSize: '12px' }} />
            <YAxis style={{ fontSize: '12px' }} />
            <Tooltip />
            <Legend wrapperStyle={{ fontSize: '12px' }} />
            <Bar dataKey="R² Score" fill="#6366F1" />
            <Bar dataKey="RMSE (₹L)" fill="#EF4444" />
            <Bar dataKey="MAE (₹L)" fill="#F59E0B" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default Analytics;
````

**PriceHeatmap.jsx:**
````jsx
import { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet.heat';

function PriceHeatmap({ properties }) {
  const map = useMap();

  useEffect(() => {
    if (!properties || properties.length === 0) return;

    // Prepare heatmap data: [lat, lng, intensity]
    const heatData = properties.map(prop => {
      const pricePerSqft = prop.actual_fair_value / prop.plot_size_sqft;
      // Normalize price to 0-1 scale for heatmap intensity
      const intensity = Math.min(pricePerSqft / 10000, 1);
      return [prop.latitude, prop.longitude, intensity];
    });

    // Create heatmap layer
    const heatLayer = L.heatLayer(heatData, {
      radius: 25,
      blur: 35,
      maxZoom: 17,
      max: 1.0,
      gradient: {
        0.0: 'green',
        0.5: 'yellow',
        0.7: 'orange',
        1.0: 'red'
      }
    }).addTo(map);

    // Cleanup
    return () => {
      map.removeLayer(heatLayer);
    };
  }, [properties, map]);

  return null;
}

export default PriceHeatmap;
````

**API Client (src/api/apiClient.js):**
````javascript
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

export const fetchProperties = async (limit = 100, area = null) => {
  const params = { limit };
  if (area) params.area = area;
  
  const response = await api.get('/properties', { params });
  return response.data;
};

export const predictPrice = async (propertyData) => {
  const response = await api.post('/predict', propertyData);
  return response.data;
};

export const fetchMetrics = async () => {
  const response = await api.get('/metrics');
  return response.data;
};

export const fetchHeatmapData = async () => {
  const response = await api.get('/heatmap');
  return response.data;
};

export const fetchAreas = async () => {
  const response = await api.get('/areas');
  return response.data;
};

export default api;
````

---

### 7. DEPLOYMENT CONFIGURATION

**backend/requirements.txt:**
````
Flask==2.3.0
flask-cors==4.0.0
pandas==2.0.0
numpy==1.24.0
scikit-learn==1.3.0
xgboost==2.0.0
geopy==2.3.0
gunicorn==21.2.0
````

**backend/Procfile (for Railway/Render):**
````
web: gunicorn app:app
````

**frontend/package.json:**
````json
{
  "name": "bhopal-property-frontend",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-leaflet": "^4.2.1",
    "leaflet": "^1.9.4",
    "leaflet.heat": "^0.2.0",
    "axios": "^1.6.0",
    "recharts": "^2.10.0",
    "lucide-react": "^0.263.1"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.2.0",
    "vite": "^5.0.0",
    "tailwindcss": "^3.4.0",
    "autoprefixer": "^10.4.16",
    "postcss": "^8.4.32"
  }
}
````

**frontend/vite.config.js:**
````javascript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true
      }
    }
  }
});
````

**frontend/tailwind.config.js:**
````javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
````

---

### 8. DOCUMENTATION

**README.md:**
````markdown
# Bhopal Property Price Predictor - ML-Based Scam Detection System

## Project Overview
Final year capstone project implementing Machine Learning to predict fair property prices in Bhopal and detect real estate scams through price deviation analysis.

## Features
✅ Interactive map with 300+ Bhopal properties
✅ Real-time ML-based price predictions
✅ Scam detection (flags overpriced properties >20% above market)
✅ Model comparison (Linear Regression vs Random Forest vs XGBoost)
✅ Price heatmap visualization
✅ Nearby property comparisons
✅ Complete model metrics dashboard

## Tech Stack
- **Backend**: Python, Flask, scikit-learn, XGBoost
- **Frontend**: React, Leaflet, Tailwind CSS
- **ML Models**: Linear Regression (72% R²), Random Forest (87.6% R²), XGBoost (86% R²)

## Installation

### Backend Setup
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
python model/train_model.py  # Train models
python app.py  # Start server on port 5000
```

### Frontend Setup
```bash
cd frontend
npm install
npm run dev  # Start on port 3000
```

## Model Training
The system trains 3 ML models on 300 synthetic Bhopal properties:

1. **Data Generation**: Zone-based realistic prices for 8 Bhopal areas
2. **Feature Engineering**: 11 features including geographic distances
3. **Training**: 80-20 train-test split
4. **Evaluation**: R², RMSE, MAE metrics

**Best Model**: Random Forest (R² = 0.8756, RMSE = ₹1.65L)

## API Endpoints
- `GET /api/properties` - Get all properties
- `POST /api/predict` - Predict price + scam detection
- `GET /api/heatmap` - Heatmap data
- `GET /api/metrics` - Model performance metrics

## Deployment
- **Frontend**: Vercel (connect GitHub repo)
- **Backend**: Railway/Render (use Procfile)

## Academic Justification
This project demonstrates:
- ✅ Comparative ML analysis (3 algorithms)
- ✅ Proper evaluation methodology
- ✅ Real-world problem solving (scam prevention)
- ✅ Full-stack implementation
- ✅ Production-ready deployment

## License
MIT License - Academic Project
````

**SETUP.md:**
````markdown
# Complete Setup Guide

## Prerequisites
- Python 3.9+
- Node.js 18+
- Git

## Step-by-Step Installation

### 1. Clone Repository
```bash
git clone <repository-url>
cd bhopal-property-predictor
```

### 2. Backend Setup
```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate (Linux/Mac)
source venv/bin/activate

# Activate (Windows)
venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Generate data and train models
cd model
python data_generator.py
python train_model.py
cd ..

# Start Flask server
python app.py
```

Backend will run on `http://localhost:5000`

### 3. Frontend Setup
```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

Frontend will run on `http://localhost:3000`

### 4. Verify Installation
- Open browser: `http://localhost:3000`
- You should see Bhopal map with property markers
- Click any marker to see prediction

## Troubleshooting

### Backend Issues
**Error**: `ModuleNotFoundError: No module named 'flask'`
- Solution: Ensure virtual environment is activated

**Error**: `FileNotFoundError: bhopal_properties.csv`
- Solution: Run `python model/train_model.py` first

### Frontend Issues
**Error**: `Network Error` when clicking properties
- Solution: Ensure backend is running on port 5000
- Check CORS is enabled in Flask app

**Error**: Map not displaying
- Solution: `npm install leaflet react-leaflet`

## Production Deployment

### Deploy Backend (Railway)
```bash
# In backend directory
railway login
railway init
railway up
```

### Deploy Frontend (Vercel)
```bash
# In frontend directory
vercel login
vercel --prod
```

Update `VITE_API_URL` in frontend to Railway backend URL.
````

---

### 9. EXPECTED OUTPUTS FOR DEMO

**When Training Models (model/train_model.py):**
````
Generating synthetic Bhopal property data...
Generated 300 properties

Training set: 240 properties
Testing set: 60 properties

==================================================
Training Linear Regression...
R² Score: 0.7234
RMSE: ₹2,85,432.15
MAE: ₹1,98,567.89
Model saved: linear_regression.pkl

==================================================
Training Random Forest...
R² Score: 0.8756
RMSE: ₹1,65,234.78
MAE: ₹1,12,345.67
Model saved: random_forest.pkl

==================================================
Training XGBoost...
R² Score: 0.8612
RMSE: ₹1,78,901.23
MAE: ₹1,25,678.90
Model saved: xgboost_model.pkl

==================================================
BEST MODEL: Random Forest
R² Score: 0.8756
This model will be used for predictions in production
````

**When User Clicks Property (API Response):**
````json
{
  "predicted_fair_value": 4523000.00,
  "price_per_sqft": 4523.00,
  "scam_analysis": {
    "risk_level": "CRITICAL",
    "deviation_percent": 35.2,
    "message": "⚠️ SCAM ALERT: Property is severely overpriced. Avoid this deal!",
    "color": "#DC2626",
    "is_scam": true
  },
  "nearby_properties": [
    {
      "property_id": 123,
      "area_name": "Arera Colony",
      "actual_fair_value": 4400000,
      "plot_size_sqft": 1000,
      "distance_from_query": 0.45
    }
  ],
  "model_confidence": {
    "r2_score": 0.8756,
    "avg_error": 112345.67
  }
}
````

---

## VALIDATION CHECKLIST

Before considering the project complete, ensure:

**ML Requirements:**
- [ ] All 3 models trained (LR, RF, XGB)
- [ ] Model metrics calculated and saved
- [ ] R² score > 0.70 for best model
- [ ] Feature engineering implemented (11+ features)
- [ ] Train-test split properly implemented
- [ ] Models saved as .pkl files

**Application Requirements:**
- [ ] Map displays 100+ properties
- [ ] Click property → shows prediction
- [ ] Scam detection working (color-coded alerts)
- [ ] Heatmap visualization functional
- [ ] Nearby properties comparison displayed
- [ ] Model metrics dashboard visible
- [ ] Responsive design (works on mobile)

**Code Quality:**
- [ ] All files created as per structure
- [ ] Code properly commented
- [ ] No hardcoded values (use config)
- [ ] Error handling implemented
- [ ] API endpoints tested

**Documentation:**
- [ ] README.md complete
- [ ] SETUP.md with installation steps
- [ ] API documentation
- [ ] Deployment guide

**Deployment:**
- [ ] Backend deployed (Railway/Render)
- [ ] Frontend deployed (Vercel)
- [ ] Live URL accessible
- [ ] CORS configured properly

---

## CRITICAL NOTES FOR AGENTIC ENVIRONMENT

1. **DO NOT** skip model training - must actually train 3 ML models
2. **DO NOT** use only random data - use zone-based realistic generation
3. **DO NOT** skip distance calculations - essential for property ML
4. **DO NOT** create frontend without connecting to backend
5. **DO NOT** skip model metrics calculation and saving
6. **MUST** create all files in exact structure specified
7. **MUST** use exact library versions specified
8. **MUST** implement scam detection algorithm
9. **MUST** create heatmap visualization
10. **MUST** include model comparison dashboard

---

## BUILD ORDER (For Agentic Environment)

Execute in this exact order:

1. Create folder structure
2. Generate `backend/model/data_generator.py`
3. Generate `backend/model/feature_engineering.py`
4. Generate `backend/model/train_model.py` and RUN IT
5. Generate `backend/utils/scam_detector.py`
6. Generate `backend/app.py`
7. Generate `backend/requirements.txt`
8. Generate `frontend/package.json`
9. Generate all React components in order:
   - apiClient.js
   - MapView.jsx
   - PredictionPanel.jsx
   - ScamAlert.jsx
   - ComparisonTable.jsx
   - Analytics.jsx
   - PriceHeatmap.jsx
   - App.jsx
10. Generate configuration files (vite.config.js, tailwind.config.js)
11. Generate documentation (README.md, SETUP.md)
12. Test locally
13. Deploy

---

## SUCCESS CRITERIA

The project is complete when:
1. ✅ User can open website and see Bhopal map
2. ✅ User can click any property marker
3. ✅ System shows ML-predicted price within 2 seconds
4. ✅ Scam detection works (shows color-coded alerts)
5. ✅ Heatmap can be toggled on/off
6. ✅ Model metrics dashboard shows 3 model comparison
7. ✅ All code is properly documented
8. ✅ Live deployment URL works

---

END OF PROMPT - READY FOR AGENTIC GENERATION
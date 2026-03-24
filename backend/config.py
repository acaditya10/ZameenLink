"""
Configuration constants for ZameenLink backend
"""

# API Configuration
import os

# API Settings
# API Settings
API_HOST = os.environ.get('HOST', '0.0.0.0')
API_PORT = int(os.environ.get('PORT', 5000))
DEBUG_MODE = os.environ.get('FLASK_DEBUG', 'False').lower() == 'true'

# Paths
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
BEST_MODEL_FILE = os.path.join(BASE_DIR, 'model', 'random_forest.pkl')
MODEL_METRICS_FILE = os.path.join(BASE_DIR, 'model', 'model_metrics.json')
DATASET_FILE = os.path.join(BASE_DIR, 'model', 'bhopal_properties.csv')

# Feature columns (must match training)
FEATURE_COLUMNS = [
    'latitude',
    'longitude',
    'plot_size_sqft',
    'bhk',
    'property_age_years',
    'floor_number',
    'furnishing_semi',
    'furnishing_fully',
    'rera_registered',
    'dist_railway_station_km',
    'dist_airport_km',
    'dist_city_center_km',
    'dist_db_mall_km',
    'dist_aiims_km',
    'zone_price_index'
]

TARGET_COLUMN = 'actual_fair_value'

# Bhopal center coordinates
BHOPAL_CENTER = {
    'lat': 23.2599,
    'lng': 77.4126
}

# Base prices for trend simulation
ZONE_BASE_PRICES = {
    "Arera Colony": 8500,
    "Shamla Hills": 9200,
    "Bawadia Kalan": 7800,
    "Raisen Road": 7500,
    "MP Nagar": 7000,
    "Bittan Market": 6800,
    "DB City Road": 7200,
    "Kolar Road": 4500,
    "Hoshangabad Road": 5200,
    "Ayodhya Bypass": 4200,
    "Misrod": 3800,
    "Danish Kunj": 4300,
    "Katara Hills": 4100,
    "Awadhpuri": 3900,
    "Bairagarh": 3500,
    "Karond": 3200,
    "Bhanpur": 3100,
    "Piplani": 4000,
    "Govindpura": 4500,
    "Jahangirabad": 3800,
    "Nehru Nagar": 5500,
    "Indrapuri": 4800,
    "Anand Nagar": 4200
}

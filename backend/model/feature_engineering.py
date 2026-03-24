"""
Feature Engineering for Property Price Prediction
Calculates distance-based features and zone price index
"""

import pandas as pd
import numpy as np
from geopy.distance import geodesic
import sys
import os

# Add parent directory to path for imports
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from utils.landmarks import BHOPAL_LANDMARKS


def calculate_distances(property_lat, property_lng, landmarks):
    """
    Calculate distances from property to all landmarks
    
    Args:
        property_lat: Property latitude
        property_lng: Property longitude
        landmarks: Dictionary of landmarks with lat/lng
    
    Returns:
        Dictionary with distances in kilometers
    """
    property_location = (property_lat, property_lng)
    distances = {}
    
    for landmark_name, landmark_data in landmarks.items():
        landmark_location = (landmark_data['lat'], landmark_data['lng'])
        distance_km = geodesic(property_location, landmark_location).kilometers
        distances[f'dist_{landmark_name}_km'] = round(distance_km, 2)
    
    return distances


def calculate_zone_price_index(base_price_per_sqft):
    """
    Normalize zone prices to 0-10 scale
    
    Args:
        base_price_per_sqft: Base price per square foot
    
    Returns:
        Normalized index (0-10)
    """
    # Min and max prices in Bhopal
    min_price = 2800  # Ayodhya Bypass
    max_price = 8500  # Arera Colony
    
    index = ((base_price_per_sqft - min_price) / (max_price - min_price)) * 10
    return round(max(0, min(10, index)), 2)


# Zone base prices for index calculation
ZONE_BASE_PRICES = {
    "Arera Colony": 8500,
    "MP Nagar": 7000,
    "Kolar Road": 3500,
    "Indrapuri": 4200,
    "Ayodhya Bypass": 2800,
    "Shahpura": 5500,
    "Hoshangabad Road": 6200,
    "Bairagarh": 3200
}


def add_distance_features(df):
    """
    Add distance features to property dataframe
    
    Args:
        df: DataFrame with property data
    
    Returns:
        DataFrame with added distance features
    """
    print("Calculating distance features...")
    
    # Calculate distances for each property
    distance_features = []
    
    for idx, row in df.iterrows():
        distances = calculate_distances(row['latitude'], row['longitude'], BHOPAL_LANDMARKS)
        distance_features.append(distances)
    
    # Convert to DataFrame and merge
    distance_df = pd.DataFrame(distance_features)
    df = pd.concat([df, distance_df], axis=1)
    
    # Add zone price index
    df['zone_price_index'] = df['area_name'].map(
        lambda x: calculate_zone_price_index(ZONE_BASE_PRICES.get(x, 5000))
    )
    
    # Encode furnishing_status as binary columns
    if 'furnishing_status' in df.columns:
        df['furnishing_semi'] = (df['furnishing_status'] == 'semi-furnished').astype(int)
        df['furnishing_fully'] = (df['furnishing_status'] == 'fully-furnished').astype(int)
    else:
        df['furnishing_semi'] = 0
        df['furnishing_fully'] = 0
    
    # Ensure rera_registered is int
    if 'rera_registered' in df.columns:
        df['rera_registered'] = df['rera_registered'].astype(int)
    else:
        df['rera_registered'] = 0
    
    # Ensure floor_number exists
    if 'floor_number' not in df.columns:
        df['floor_number'] = 0
    
    engineered_count = len(distance_df.columns) + 4  # zone_price_index + furnishing_semi + furnishing_fully + rera encoding
    print(f"✓ Added {engineered_count} engineered features")
    print(f"  - {len(distance_df.columns)} distance features")
    print(f"  - 1 zone price index")
    print(f"  - 2 furnishing encodings")
    print(f"  - 1 RERA encoding")
    
    return df


# Feature columns for ML models
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


if __name__ == "__main__":
    # Test feature engineering
    print("Testing feature engineering...")
    
    # Load sample data
    if os.path.exists("bhopal_properties.csv"):
        df = pd.read_csv("bhopal_properties.csv")
        df = add_distance_features(df)
        
        print("\nFeature columns:")
        print(FEATURE_COLUMNS)
        
        print("\nSample with features:")
        print(df[FEATURE_COLUMNS + [TARGET_COLUMN]].head())
        
        # Save enhanced data
        df.to_csv("bhopal_properties_with_features.csv", index=False)
        print("\n✓ Enhanced data saved to bhopal_properties_with_features.csv")
    else:
        print("Error: bhopal_properties.csv not found. Run data_generator.py first.")

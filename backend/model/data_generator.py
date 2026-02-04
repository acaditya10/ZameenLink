"""
Bhopal Property Data Generator
Generates realistic synthetic property data for 8 Bhopal zones
"""

import pandas as pd
import numpy as np
from datetime import datetime

# Bhopal zones with realistic pricing
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


def generate_bhopal_data(n_properties=300, scam_percentage=0.10):
    """
    Generate realistic synthetic property data for Bhopal
    
    Args:
        n_properties: Number of properties to generate
        scam_percentage: Percentage of properties to mark as overpriced scams
    
    Returns:
        pandas DataFrame with property data
    """
    np.random.seed(42)  # For reproducibility
    
    properties = []
    property_id = 1
    
    for _ in range(n_properties):
        # Randomly select a zone
        zone_name = np.random.choice(list(BHOPAL_ZONES.keys()))
        zone = BHOPAL_ZONES[zone_name]
        
        # Generate coordinates within zone (±0.01 degrees ≈ 1km radius)
        latitude = zone["lat_center"] + np.random.uniform(-0.01, 0.01)
        longitude = zone["lng_center"] + np.random.uniform(-0.01, 0.01)
        
        # Generate property characteristics
        plot_size_sqft = np.random.randint(800, 3500)
        bhk = np.random.choice([1, 2, 3, 4, 5], p=[0.1, 0.3, 0.35, 0.2, 0.05])
        property_age_years = np.random.randint(0, 21)
        has_parking = np.random.choice([True, False], p=[0.7, 0.3])
        has_garden = np.random.choice([True, False], p=[0.4, 0.6])
        
        # Calculate base price per sqft with variance
        price_per_sqft = zone["base_price_per_sqft"] + np.random.normal(0, zone["variance"])
        
        # Apply adjustments
        if bhk > 3:
            price_per_sqft += 500  # Premium for larger properties
        
        if property_age_years < 5:
            price_per_sqft += 800  # New property premium
        elif property_age_years > 15:
            price_per_sqft -= 600  # Depreciation
        
        if has_parking:
            price_per_sqft += 200
        
        if has_garden:
            price_per_sqft += 300
        
        # Ensure price doesn't go negative
        price_per_sqft = max(price_per_sqft, 1500)
        
        # Calculate actual fair value
        actual_fair_value = plot_size_sqft * price_per_sqft
        
        # Determine if this is a scam property
        is_scam = np.random.random() < scam_percentage
        
        if is_scam:
            # Overpriced by 30-40%
            listed_price = actual_fair_value * np.random.uniform(1.30, 1.40)
        else:
            # Normal variation ±5%
            listed_price = actual_fair_value * np.random.uniform(0.95, 1.05)
        
        properties.append({
            "property_id": property_id,
            "area_name": zone_name,
            "latitude": round(latitude, 6),
            "longitude": round(longitude, 6),
            "plot_size_sqft": plot_size_sqft,
            "bhk": bhk,
            "property_age_years": property_age_years,
            "listed_price": round(listed_price, 2),
            "actual_fair_value": round(actual_fair_value, 2),
            "zone_type": zone["zone_type"],
            "has_parking": has_parking,
            "has_garden": has_garden
        })
        
        property_id += 1
    
    df = pd.DataFrame(properties)
    
    print(f"Generated {len(df)} properties across {len(BHOPAL_ZONES)} zones")
    print(f"Scam properties: {df['listed_price'].gt(df['actual_fair_value'] * 1.2).sum()}")
    print(f"\nZone distribution:")
    print(df['area_name'].value_counts())
    
    return df


if __name__ == "__main__":
    # Generate data
    df = generate_bhopal_data(n_properties=300)
    
    # Save to CSV
    output_file = "bhopal_properties.csv"
    df.to_csv(output_file, index=False)
    print(f"\n✓ Data saved to {output_file}")
    
    # Display sample
    print("\nSample properties:")
    print(df.head())
    
    # Statistics
    print("\nPrice Statistics:")
    print(f"Average fair value: ₹{df['actual_fair_value'].mean():,.2f}")
    print(f"Min fair value: ₹{df['actual_fair_value'].min():,.2f}")
    print(f"Max fair value: ₹{df['actual_fair_value'].max():,.2f}")

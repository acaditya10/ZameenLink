"""
Bhopal Property Data Generator
Generates realistic synthetic property data for 8 Bhopal zones
"""

import pandas as pd
import numpy as np
from datetime import datetime

# Bhopal zones with realistic pricing (20+ areas across the city)
BHOPAL_ZONES = {
    # Premium Residential Areas
    "Arera Colony": {
        "base_price_per_sqft": 8500,
        "lat_center": 23.2313,
        "lng_center": 77.4326,
        "variance": 1500,
        "zone_type": "premium_residential"
    },
    "Shamla Hills": {
        "base_price_per_sqft": 9200,
        "lat_center": 23.2445,
        "lng_center": 77.4156,
        "variance": 1600,
        "zone_type": "premium_residential"
    },
    "Bawadia Kalan": {
        "base_price_per_sqft": 7800,
        "lat_center": 23.2089,
        "lng_center": 77.4512,
        "variance": 1400,
        "zone_type": "premium_residential"
    },
    "Raisen Road": {
        "base_price_per_sqft": 7500,
        "lat_center": 23.1856,
        "lng_center": 77.4423,
        "variance": 1300,
        "zone_type": "premium_residential"
    },
    
    # Commercial Areas
    "MP Nagar": {
        "base_price_per_sqft": 7000,
        "lat_center": 23.2332,
        "lng_center": 77.4343,
        "variance": 1200,
        "zone_type": "commercial"
    },
    "DB City Road": {
        "base_price_per_sqft": 6800,
        "lat_center": 23.2298,
        "lng_center": 77.4389,
        "variance": 1100,
        "zone_type": "commercial"
    },
    "Danish Kunj": {
        "base_price_per_sqft": 6500,
        "lat_center": 23.2178,
        "lng_center": 77.4512,
        "variance": 1000,
        "zone_type": "commercial"
    },
    "Bittan Market": {
        "base_price_per_sqft": 6300,
        "lat_center": 23.2567,
        "lng_center": 77.4234,
        "variance": 950,
        "zone_type": "commercial"
    },
    "Hoshangabad Road": {
        "base_price_per_sqft": 6200,
        "lat_center": 23.2156,
        "lng_center": 77.4673,
        "variance": 900,
        "zone_type": "commercial"
    },
    
    # Residential Areas
    "Shahpura": {
        "base_price_per_sqft": 5500,
        "lat_center": 23.1987,
        "lng_center": 77.4289,
        "variance": 800,
        "zone_type": "residential"
    },
    "Katara Hills": {
        "base_price_per_sqft": 5200,
        "lat_center": 23.1923,
        "lng_center": 77.4512,
        "variance": 750,
        "zone_type": "residential"
    },
    "Govindpura": {
        "base_price_per_sqft": 4800,
        "lat_center": 23.2678,
        "lng_center": 77.4789,
        "variance": 700,
        "zone_type": "residential"
    },
    "Nehru Nagar": {
        "base_price_per_sqft": 4500,
        "lat_center": 23.2412,
        "lng_center": 77.4523,
        "variance": 650,
        "zone_type": "residential"
    },
    "Indrapuri": {
        "base_price_per_sqft": 4200,
        "lat_center": 23.2484,
        "lng_center": 77.4654,
        "variance": 600,
        "zone_type": "residential"
    },
    "Misrod": {
        "base_price_per_sqft": 4000,
        "lat_center": 23.1678,
        "lng_center": 77.5123,
        "variance": 550,
        "zone_type": "residential"
    },
    
    # Budget & Developing Areas
    "Kolar Road": {
        "base_price_per_sqft": 3500,
        "lat_center": 23.1746,
        "lng_center": 77.4137,
        "variance": 500,
        "zone_type": "budget"
    },
    "Bairagarh": {
        "base_price_per_sqft": 3200,
        "lat_center": 23.2615,
        "lng_center": 77.3421,
        "variance": 450,
        "zone_type": "budget"
    },
    "Jahangirabad": {
        "base_price_per_sqft": 3000,
        "lat_center": 23.2523,
        "lng_center": 77.4012,
        "variance": 400,
        "zone_type": "budget"
    },
    "Piplani": {
        "base_price_per_sqft": 2900,
        "lat_center": 23.2089,
        "lng_center": 77.4912,
        "variance": 380,
        "zone_type": "budget"
    },
    "Anand Nagar": {
        "base_price_per_sqft": 2850,
        "lat_center": 23.2734,
        "lng_center": 77.4423,
        "variance": 370,
        "zone_type": "budget"
    },
    "Ayodhya Bypass": {
        "base_price_per_sqft": 2800,
        "lat_center": 23.2721,
        "lng_center": 77.4691,
        "variance": 400,
        "zone_type": "developing"
    }
}

# Water body boundaries (Upper Lake and Lower Lake)
# Properties should NOT be generated in these areas
WATER_BODIES = {
    "Upper Lake": {
        "lat_min": 23.20,
        "lat_max": 23.27,
        "lng_min": 77.31,
        "lng_max": 77.38
    },
    "Lower Lake": {
        "lat_min": 23.24,
        "lat_max": 23.27,
        "lng_min": 77.40,
        "lng_max": 77.43
    }
}


def is_in_water_body(lat, lng):
    """
    Check if coordinates fall within any water body boundaries
    
    Args:
        lat: Latitude coordinate
        lng: Longitude coordinate
    
    Returns:
        bool: True if coordinates are in water, False otherwise
    """
    for water_body, bounds in WATER_BODIES.items():
        if (bounds["lat_min"] <= lat <= bounds["lat_max"] and 
            bounds["lng_min"] <= lng <= bounds["lng_max"]):
            return True
    return False


def generate_bhopal_data(n_properties=1000, scam_percentage=0.10):
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
        
        # Generate coordinates within zone, avoiding water bodies
        # Try up to 10 times to find a valid location
        max_attempts = 10
        for attempt in range(max_attempts):
            latitude = zone["lat_center"] + np.random.uniform(-0.01, 0.01)
            longitude = zone["lng_center"] + np.random.uniform(-0.01, 0.01)
            
            # Check if coordinates are in water
            if not is_in_water_body(latitude, longitude):
                break
            
            # If last attempt and still in water, use zone center (guaranteed safe)
            if attempt == max_attempts - 1:
                latitude = zone["lat_center"]
                longitude = zone["lng_center"]
        
        # Generate property characteristics
        plot_size_sqft = np.random.randint(800, 3500)
        bhk = np.random.choice([1, 2, 3, 4, 5], p=[0.1, 0.3, 0.35, 0.2, 0.05])
        property_age_years = np.random.randint(0, 21)
        has_parking = np.random.choice([True, False], p=[0.7, 0.3])
        has_garden = np.random.choice([True, False], p=[0.4, 0.6])
        
        # New features: floor, furnishing, RERA
        # Floor number: higher in commercial/premium zones
        if zone["zone_type"] in ("commercial", "premium_residential"):
            # 3 * 0.02 (0.06) + 10 * 0.04 (0.4) + 8 * 0.05 (0.4) + 5 * 0.028 (0.14) = 1.0
            floor_number = np.random.choice(range(0, 26), p=[0.02]*3 + [0.04]*10 + [0.05]*8 + [0.028]*5)
        else:
            floor_number = np.random.choice(range(0, 11), p=[0.15, 0.15, 0.15, 0.12, 0.10, 0.08, 0.07, 0.06, 0.05, 0.04, 0.03])
        
        # Furnishing status: premium zones more likely to be furnished
        if zone["zone_type"] == "premium_residential":
            furnishing_status = np.random.choice(["unfurnished", "semi-furnished", "fully-furnished"], p=[0.15, 0.35, 0.50])
        elif zone["zone_type"] == "commercial":
            furnishing_status = np.random.choice(["unfurnished", "semi-furnished", "fully-furnished"], p=[0.20, 0.40, 0.40])
        elif zone["zone_type"] == "residential":
            furnishing_status = np.random.choice(["unfurnished", "semi-furnished", "fully-furnished"], p=[0.35, 0.40, 0.25])
        else:  # budget / developing
            furnishing_status = np.random.choice(["unfurnished", "semi-furnished", "fully-furnished"], p=[0.55, 0.30, 0.15])
        
        # RERA registration: newer & premium properties more likely
        rera_prob = 0.7 if property_age_years < 5 else (0.4 if property_age_years < 10 else 0.2)
        if zone["zone_type"] in ("premium_residential", "commercial"):
            rera_prob = min(rera_prob + 0.2, 0.95)
        rera_registered = np.random.random() < rera_prob
        
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
        
        # Floor premium: 2-3% per floor above ground
        if floor_number > 0:
            floor_premium = price_per_sqft * (0.02 * min(floor_number, 15))
            price_per_sqft += floor_premium
        
        # Furnishing premium
        if furnishing_status == "semi-furnished":
            price_per_sqft += 400
        elif furnishing_status == "fully-furnished":
            price_per_sqft += 800
        
        # RERA premium: 5% for registered properties
        if rera_registered:
            price_per_sqft *= 1.05
        
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
            "floor_number": int(floor_number),
            "furnishing_status": furnishing_status,
            "rera_registered": bool(rera_registered),
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
    df = generate_bhopal_data(n_properties=1000)
    
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

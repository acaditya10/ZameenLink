"""
ML Model Training Script
Trains and compares Linear Regression, Random Forest, and XGBoost models
"""

import pandas as pd
import numpy as np
import pickle
import json
import os
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression
from sklearn.ensemble import RandomForestRegressor
from xgboost import XGBRegressor
from sklearn.metrics import r2_score, mean_squared_error, mean_absolute_error

# Import data generator and feature engineering
from data_generator import generate_bhopal_data
from feature_engineering import add_distance_features, FEATURE_COLUMNS, TARGET_COLUMN


def train_models():
    """
    Complete ML training pipeline
    """
    print("="*60)
    print("ZAMEENLINK - ML MODEL TRAINING PIPELINE")
    print("="*60)
    
    # Define output directory (same as script location)
    output_dir = os.path.dirname(os.path.abspath(__file__))
    
    # Step 1: Generate and prepare data
    print("\n[1/5] Generating synthetic Bhopal property data...")
    df = generate_bhopal_data(n_properties=300)
    
    print("\n[2/5] Engineering features (distance calculations)...")
    df = add_distance_features(df)
    
    # Save complete dataset
    csv_path = os.path.join(output_dir, 'bhopal_properties.csv')
    df.to_csv(csv_path, index=False)
    print(f"✓ Complete dataset saved to {csv_path}")
    
    # Step 2: Prepare features and target
    print("\n[3/5] Preparing features and target variable...")
    X = df[FEATURE_COLUMNS]
    y = df[TARGET_COLUMN]
    
    print(f"Features: {len(FEATURE_COLUMNS)}")
    print(f"Samples: {len(df)}")
    print(f"Target: {TARGET_COLUMN}")
    
    # Step 3: Train-test split
    print("\n[4/5] Splitting data (80% train, 20% test)...")
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42
    )
    
    print(f"Training set: {len(X_train)} properties")
    print(f"Testing set: {len(X_test)} properties")
    
    # Step 4: Train and evaluate models
    print("\n[5/5] Training and evaluating models...")
    print("="*60)
    
    models = {
        'Linear Regression': LinearRegression(),
        'Random Forest': RandomForestRegressor(
            n_estimators=100,
            max_depth=15,
            random_state=42,
            n_jobs=-1
        ),
        'XGBoost': XGBRegressor(
            n_estimators=100,
            max_depth=7,
            learning_rate=0.1,
            random_state=42,
            n_jobs=-1
        )
    }
    
    results = {}
    
    for model_name, model in models.items():
        print(f"\n{'='*60}")
        print(f"Training {model_name}...")
        print(f"{'='*60}")
        
        # Train
        model.fit(X_train, y_train)
        
        # Predict
        y_pred = model.predict(X_test)
        
        # Calculate metrics
        r2 = r2_score(y_test, y_pred)
        rmse = np.sqrt(mean_squared_error(y_test, y_pred))
        mae = mean_absolute_error(y_test, y_pred)
        
        results[model_name] = {
            'r2_score': round(r2, 4),
            'rmse': round(rmse, 2),
            'mae': round(mae, 2)
        }
        
        print(f"R² Score:  {r2:.4f} ({r2*100:.2f}% accuracy)")
        print(f"RMSE:      ₹{rmse:,.2f}")
        print(f"MAE:       ₹{mae:,.2f}")
        
        # Save model
        filename = model_name.lower().replace(' ', '_') + '.pkl'
        model_path = os.path.join(output_dir, filename)
        with open(model_path, 'wb') as f:
            pickle.dump(model, f)
        print(f"✓ Model saved: {model_path}")
    
    # Step 5: Save metrics comparison
    print(f"\n{'='*60}")
    print("SAVING RESULTS")
    print(f"{'='*60}")
    
    metrics_path = os.path.join(output_dir, 'model_metrics.json')
    with open(metrics_path, 'w') as f:
        json.dump(results, f, indent=2)
    print(f"✓ Metrics saved to {metrics_path}")
    
    # Determine best model
    best_model = max(results.items(), key=lambda x: x[1]['r2_score'])
    
    print(f"\n{'='*60}")
    print("BEST MODEL")
    print(f"{'='*60}")
    print(f"Model:     {best_model[0]}")
    print(f"R² Score:  {best_model[1]['r2_score']}")
    print(f"RMSE:      ₹{best_model[1]['rmse']:,.2f}")
    print(f"MAE:       ₹{best_model[1]['mae']:,.2f}")
    print("\nThis model will be used for predictions in production")
    
    print(f"\n{'='*60}")
    print("TRAINING COMPLETE!")
    print(f"{'='*60}")
    print("\nGenerated files:")
    print(f"  - {csv_path}")
    print("  - [Models saved to same directory]")
    print(f"  - {metrics_path}")
    
    return results


if __name__ == "__main__":
    try:
        results = train_models()
    except Exception as e:
        print(f"\n❌ Error during training: {e}")
        import traceback
        traceback.print_exc()

# ZameenLink - Comprehensive Feature List

ZameenLink is an advanced Machine Learning-based property price prediction system for Bhopal with integrated scam detection. Below is a detailed breakdown of all the features available in the project.

## 🤖 Core Machine Learning Features
- **Multi-Model Support**: The system trains and evaluates three distinct machine learning models:
  - Linear Regression
  - Random Forest (Best performing model)
  - XGBoost
- **Real-Time Property Valuation**: Predicts fair market prices instantly using 11 engineered features (including property attributes and distances to key landmarks).
- **Model Metrics Dashboard**: Provides an analytical view to compare the performance metrics (R² Score, RMSE, MAE) of all three models.
- **Automated Feature Engineering**: Calculates real-world metrics like distance to essential landmarks to improve prediction accuracy.

## 🛡️ Scam Detection & Risk Analysis
- **Smart Scam Detection**: Automatically flags properties that are significantly overpriced compared to their predicted fair market value.
- **Categorized Risk Levels**: Classifies property listings into five intuitive risk categories based on price deviation:
  - **CRITICAL**: >30% deviation (Severe overpricing - warns users to avoid).
  - **HIGH**: 20-30% deviation (Significantly overpriced).
  - **MEDIUM**: 10-20% deviation (Slightly overpriced - suggests negotiation).
  - **LOW**: -5% to 10% deviation (Fair market price).
  - **BARGAIN**: <-5% deviation (Below market average, indicating a good deal).
  
## 🗺️ Interactive Map & Visualization
- **Leaflet-Based Interactive Map**: A dynamic mapping interface detailing over 300 properties across Bhopal.
- **Color-Coded Markers**: Visual indicators for property value assessments directly on the map:
  - **Green**: Lower priced / Bargain
  - **Yellow**: Moderately priced / Fair price
  - **Red**: Highly priced / Overpriced
- **Instant Map Predictions**: Users can click on any property marker on the map to instantly view its predicted price, location details, and scam analysis.
- **Property Price Heatmap**: A toggleable visual layer that shows the geographical distribution and concentration of property prices.

## 🔍 Property Comparison & Analysis
- **Nearby Comparisons**: Automatically identifies and displays the 5 nearest properties in the geographic vicinity.
- **Comparative Metrics**: Shows distance, size (sq. ft.), and price of neighboring properties to help users validate the AI's predictions against actual market listings.
- **Price Breakdown**: Provides detailed insights such as the calculated price per square foot.

## 💻 User Interface & Experience
- **Responsive Component Design**: The UI is built with React and Tailwind CSS, ensuring a seamless experience across desktop, tablet, and mobile devices.
- **Intuitive Side Panel**: A dedicated prediction panel that cleanly organizes prediction results, scam alerts, and neighborhood comparisons.
- **Progressive Web App (PWA) Ready**: Designed to be installable and accessible like a native application, enhancing accessibility.

## ⚙️ Backend & Architecture Features
- **RESTful API Engine**: A Flask-powered backend exposing dedicated endpoints for robust data access:
  - `/api/predict`: Handles price prediction and scam detection logic.
  - `/api/properties`: Fetches all property listings.
  - `/api/heatmap`: Provides geographical pricing data for heatmap rendering.
  - `/api/metrics`: Delivers live model evaluation statistics.
  - `/api/health`: Provides system health checks.
- **Realistic Synthetic Data Generation**: Includes a custom data generator that creates realistic Bhopal property datasets (with realistic locations and price ranges) for model training and testing.

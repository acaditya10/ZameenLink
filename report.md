# ZameenLink Project - Comprehensive Technical Report

**Date Prepared:** March 2026  
**Project Name:** ZameenLink  
**Purpose:** ML-Based Property Price Predictor and Real Estate Analysis Tool for Bhopal.

## 1. Project Overview
ZameenLink is a comprehensive real estate platform specifically tailored for Bhopal. It uses machine learning to predict property prices, assess risk via scam detection algorithms, and provides interactive visualizations such as maps, heatmaps, and trend charts. 

## 2. System Architecture

ZameenLink uses a modern decoupled architecture:
- **Backend**: A Python Flask application serving RESTful APIs, handling data processing, machine learning predictions, and custom analytics.
- **Frontend**: A React single-page application (SPA) built with Vite, styled with TailwindCSS, and integrated with Leaflet for map visualizations and Recharts for analytics.
- **Data Source**: A synthetic dataset generated via custom scripts to closely mimic Bhopal's real estate market dynamics.

### 2.1 Technology Stack
**Backend Stack:**
- **Language**: Python 3.9+
- **Framework**: Flask (Core API), Flask-CORS (Cross-Origin), Flasgger (Swagger UI Documentation)
- **Data processing**: Pandas, NumPy
- **Machine Learning**: Scikit-Learn (Linear Regression, Random Forest), XGBoost 2.0.3
- **Geolocation**: Geopy 2.4.1 (Distance calculations)
- **Job Scheduling**: APScheduler (For background model retraining)

**Frontend Stack:**
- **Framework & Build**: React 18.2.0, Vite 5.0.8, Vite PWA Plugin
- **Styling**: Tailwind CSS 3.4.0, PostCSS, Autoprefixer
- **Map Library**: react-leaflet 4.2.1, leaflet 1.9.4, leaflet.heat
- **Data Visualization**: Recharts 2.15.4
- **State/Auth/DB**: Firebase 12.11.0
- **HTTP Client**: Axios

## 3. Core Features & Capabilities

### 3.1 Machine Learning Pipeline
The backend features a resilient ML pipeline encompassing:
1. **Data Generation** (`data_generator.py`): Creates 300+ realistic properties in Bhopal with detailed attributes.
2. **Feature Engineering** (`feature_engineering.py`): Calculates proximity to key landmarks (Railway Station, Airport, City Center, DB Mall, AIIMS) using Geopy.
3. **Model Training** (`train_model.py`): Trains three distinct models: Linear Regression, Random Forest (best performer, default model), and XGBoost.
4. **Auto-Retraining** (`retrain_scheduler.py`): Async scheduling mechanism to trigger model retraining and swap models in-memory securely.

### 3.2 Scam Detection Engine
Located in `backend/utils/scam_detector.py`, the scam engine performs risk categorization using composite analysis:
- **Price Deviation (50% weight)**: Calculates difference between Listed Price and ML Predicted Fair Value.
- **Text/NLP Analysis (30% weight)**: Analyzes descriptions via `nlp_analyzer.py` for red flags ("urgent sale", "cash only").
- **Image Analysis (20% weight)**: Uses `image_analyzer.py` heuristics based on image metadata/counts.
- **Risk Levels**: CRITICAL, HIGH, MEDIUM, LOW, BARGAIN, SUSPICIOUSLY LOW.

### 3.3 Interactive Map & Heatmap
- Implemented using React Leaflet (`MapView.jsx`).
- Properties are plotted as colored markers based on price assessments.
- Real-time heatmaps (`PriceHeatmap.jsx`) visually indicate property price concentrations using the `leaflet.heat` plugin.

### 3.4 Interactive UI Panels
- **Prediction Panel** (`PredictionPanel.jsx`): Shows comprehensive summaries for individual properties including ML prediction, scam alerts, and 5 nearest neighboring properties.
- **Profile Panel** (`ProfilePanel.jsx`): User-specific dashboard for tracking saved properties and prediction history.
- **Analytics & Trends**: Compares R² metrics of models (`Analytics.jsx`), tracks quarterly locality price trends (`PriceTrendChart.jsx`), and includes a real-time EMI Calculator (`EMICalculator.jsx`).

## 4. Backend API Documentation
The API documentation is accessible via Swagger UI at `http://localhost:5000/api/docs`. 

### Key Endpoints:
- `GET /api/health`: Validates system health, model load status, and property count.
- `GET /api/properties`: Fetches paginated properties. Supports filtering by `area`.
- `GET /api/areas`: Retrieves aggregated analytics for all areas (counts, avg prices).
- `POST /api/predict`: Core endpoint. Expects payload with `latitude`, `longitude`, `plot_size_sqft`, `bhk`, `property_age_years` and automatically generates predicted price, scam probability, and comparable neighbors.
- `GET /api/heatmap`: Delivers lightweight array of coordinates and price indices for map rendering.
- `GET /api/metrics`: Exposes RMSE, MAE, and R² scores for all loaded ML models.
- `POST /api/emi`: Input principal, rate, tenure, and down payment to receive amortization schedules.
- `GET /api/trends`: Outputs historic and future quarterly price projections per area.
- `POST /api/retrain` & `GET /api/retrain/status`: Manages synchronous and asynchronous ML model retraining tasks.

## 5. Directory Structure & Key Files

### Root 
- `FEATURES.md`: Detailed business logic and feature highlights.
- `QUICKSTART.md` / `README.md`: Instructions to build and operate the project.
- `docs/SETUP.md`: Elaborate deployment info.

### Backend (`/backend`)
- `app.py`: The Main Flask API configuration and route handler.
- `config.py`: Hardcoded hyperparameters, column schemas, and application constants.
- `setup.bat`: Windows helper initialization script.
- `/model`: Contains `.pkl` binaries, `.json` metrics, and Python ML pipelines.
- `/utils`: Helper classes including scammers, EMIs, and local landmarks metadata.

### Frontend (`/frontend/src`)
- `App.jsx` / `main.jsx`: SPA entry points.
- `/components`: 18 highly reusable React components (Maps, Panels, Skeletons, Auth forms).
- `/api`: API Axios wrapper client (`apiClient.js`).
- `/contexts`: React Context API wrappers for global state.
- `/services`: Helper services and Firebase integrations (`firebase.js`, `firestoreService.js`).

## 6. How it Operates (Workflow)
1. **Startup**: Flask loads the `random_forest.pkl` model and `.csv` properties into `app_state`. React binds to the API on port 5000.
2. **User Interaction**: User visits `localhost:3000`, sees Map View. Left Panel (`FilterPanel`) enables searching. 
3. **Execution**: Clicking a property triggers `PredictionPanel`. The frontend sends property attributes to `POST /api/predict`. 
4. **Processing**: Flask passes attributes to the random forest model, evaluates scam risk on the listed price versus predicted price, calculates geodesic distance to find nearest neighbors, and packages the JSON.
5. **Presentation**: React displays results, formats currency (₹), and conditionally paints the scam alerts (CRITICAL -> safe).

## 7. Next Steps & Customization
- **Database Integration**: Replace `.csv` with a proper database (PostgreSQL or MongoDB) for persisting user-generated listings.
- **Production ML**: Integrate real property dataset feeds substituting the `data_generator.py` script.
- **Authentication Improvements**: Fortify the current Firebase implementations on `AuthPrompt.jsx`.

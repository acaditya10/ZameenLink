# ZameenLink - Complete Setup Guide

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Backend Setup](#backend-setup)
3. [Frontend Setup](#frontend-setup)
4. [Running the Application](#running-the-application)
5. [Troubleshooting](#troubleshooting)

---

## Prerequisites

Before starting, ensure you have completed the [Prerequisites Checklist](../brain/PREREQUISITES.md):

- ✅ Python 3.9+ installed
- ✅ Node.js 18+ installed
- ✅ Virtual environment created
- ✅ Git installed (optional)
- ✅ 2GB free disk space

---

## Backend Setup

### Step 1: Navigate to Backend Directory

```bash
cd backend
```

### Step 2: Activate Virtual Environment

**Windows (PowerShell)**:
```bash
..\zameenlink\Scripts\Activate.ps1
```

**Windows (CMD)**:
```bash
..\zameenlink\Scripts\activate.bat
```

**Mac/Linux**:
```bash
source ../zameenlink/bin/activate
```

You should see `(zameenlink)` in your terminal prompt.

### Step 3: Install Python Dependencies

```bash
pip install -r requirements.txt
```

This will install:
- Flask (web framework)
- pandas, numpy (data processing)
- scikit-learn, XGBoost (ML models)
- geopy (distance calculations)
- flask-cors (API access)

**Note**: Installation may take 5-10 minutes.

### Step 4: Train ML Models

```bash
cd model
python train_model.py
cd ..
```

**Expected Output**:
```
Generating synthetic Bhopal property data...
Generated 300 properties

Training Linear Regression...
R² Score: 0.7234
RMSE: ₹2,85,432.15

Training Random Forest...
R² Score: 0.8756
RMSE: ₹1,65,234.78

Training XGBoost...
R² Score: 0.8612
RMSE: ₹1,78,901.23

BEST MODEL: Random Forest
```

This creates:
- `bhopal_properties.csv` (300 properties)
- `linear_regression.pkl`
- `random_forest.pkl`
- `xgboost.pkl`
- `model_metrics.json`

### Step 5: Start Backend Server

```bash
python app.py
```

**Expected Output**:
```
============================================================
ZAMEENLINK BACKEND API
============================================================
Starting server on http://0.0.0.0:5000
Press CTRL+C to stop
============================================================

 * Running on http://127.0.0.1:5000
```

**Keep this terminal open!** The backend must run continuously.

---

## Frontend Setup

### Step 1: Open New Terminal

Open a **new terminal window** (keep backend running in the first one).

### Step 2: Navigate to Frontend Directory

```bash
cd frontend
```

### Step 3: Install Node Dependencies

```bash
npm install
```

This will install:
- React (UI framework)
- Leaflet (maps)
- Tailwind CSS (styling)
- Axios (API calls)
- Recharts (charts)

**Note**: Installation may take 3-5 minutes.

### Step 4: Start Development Server

```bash
npm run dev
```

**Expected Output**:
```
  VITE v5.0.8  ready in 1234 ms

  ➜  Local:   http://localhost:3000/
  ➜  Network: use --host to expose
  ➜  press h to show help
```

---

## Running the Application

### Step 1: Open Browser

Navigate to: `http://localhost:3000`

### Step 2: Verify Map Loads

You should see:
- Bhopal map centered on the city
- 100+ property markers (color-coded)
- Header with "ZameenLink" title
- Heatmap toggle button

### Step 3: Test Property Prediction

1. Click any property marker on the map
2. Side panel should open on the right
3. Wait 1-2 seconds for prediction
4. You should see:
   - Property details (size, BHK, age)
   - ML predicted fair value
   - Scam alert (color-coded)
   - Nearby properties table
   - Model confidence metrics

### Step 4: Test Heatmap

1. Click "Show Heatmap" button in header
2. Color gradient overlay should appear
3. Green = cheap areas, Red = expensive areas

### Step 5: Check Analytics

Scroll to bottom of page to see:
- Bar chart comparing 3 models
- R² Score, RMSE, MAE metrics

---

## Troubleshooting

### Backend Issues

#### Error: "ModuleNotFoundError: No module named 'flask'"

**Solution**:
```bash
# Make sure virtual environment is activated
# You should see (zameenlink) in prompt

# If not, activate it:
..\zameenlink\Scripts\activate  # Windows
source ../zameenlink/bin/activate  # Mac/Linux

# Then reinstall:
pip install -r requirements.txt
```

#### Error: "FileNotFoundError: bhopal_properties.csv"

**Solution**:
```bash
cd model
python train_model.py
cd ..
```

#### Error: "Address already in use" (Port 5000)

**Solution**:
```bash
# Kill process on port 5000
# Windows:
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Mac/Linux:
lsof -ti:5000 | xargs kill -9
```

---

### Frontend Issues

#### Error: "Network Error" when clicking properties

**Solution**:
1. Verify backend is running on port 5000
2. Check browser console for errors (F12)
3. Ensure CORS is enabled in Flask app

#### Error: Map not displaying

**Solution**:
```bash
# Reinstall Leaflet
npm install leaflet react-leaflet

# Clear cache and restart
rm -rf node_modules
npm install
npm run dev
```

#### Error: "Cannot find module 'axios'"

**Solution**:
```bash
npm install
```

---

### Common Issues

#### Virtual Environment Not Activating (Windows PowerShell)

**Solution**:
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

Then try activating again.

#### Python/pip Not Found

**Solution**:
- Ensure Python is in PATH
- Try `python3` or `py` instead of `python`
- Reinstall Python with "Add to PATH" checked

#### Node/npm Not Found

**Solution**:
- Ensure Node.js is installed
- Restart terminal after installation
- Check with: `node --version`

---

## Alternative Setup: Using Setup Scripts

### Windows (Automated)

```bash
cd backend
setup.bat
```

This script will:
1. Activate virtual environment
2. Install dependencies
3. Train models
4. Provide next steps

---

## Next Steps

Once everything is running:

1. **Explore the Map**: Click different properties in various areas
2. **Test Scam Detection**: Look for properties with CRITICAL or HIGH risk
3. **Compare Models**: Check the analytics dashboard at the bottom
4. **Try Heatmap**: Toggle the heatmap to see price distribution

---

## Development Workflow

### Daily Development

**Terminal 1 (Backend)**:
```bash
cd backend
..\zameenlink\Scripts\activate
python app.py
```

**Terminal 2 (Frontend)**:
```bash
cd frontend
npm run dev
```

### Making Changes

- **Backend changes**: Server auto-reloads (Flask debug mode)
- **Frontend changes**: Vite hot-reloads automatically
- **Model changes**: Re-run `python model/train_model.py`

---

## Production Build

### Frontend

```bash
cd frontend
npm run build
```

Creates optimized build in `dist/` folder.

### Backend

```bash
cd backend
gunicorn app:app
```

Uses Gunicorn for production server.

---

## Need Help?

- Check [Prerequisites](../brain/PREREQUISITES.md)
- Review [Implementation Plan](../brain/implementation_plan.md)
- Check browser console (F12) for errors
- Check terminal output for error messages

---

**You're all set! Happy coding! 🚀**

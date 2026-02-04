@echo off
REM ZameenLink Backend Setup Script for Windows

echo ========================================
echo ZAMEENLINK BACKEND SETUP
echo ========================================
echo.

echo [1/4] Activating virtual environment...
call ..\zameenlink\Scripts\activate
if errorlevel 1 (
    echo ERROR: Failed to activate virtual environment
    echo Please make sure you're in the backend directory
    pause
    exit /b 1
)
echo Virtual environment activated!
echo.

echo [2/4] Installing Python dependencies...
echo This may take 5-10 minutes...
pip install Flask flask-cors pandas numpy scikit-learn xgboost geopy gunicorn
if errorlevel 1 (
    echo ERROR: Failed to install dependencies
    pause
    exit /b 1
)
echo Dependencies installed successfully!
echo.

echo [3/4] Training ML models...
cd model
python train_model.py
if errorlevel 1 (
    echo ERROR: Failed to train models
    cd ..
    pause
    exit /b 1
)
cd ..
echo Models trained successfully!
echo.

echo [4/4] Setup complete!
echo.
echo ========================================
echo NEXT STEPS:
echo ========================================
echo 1. Start the backend server:
echo    python app.py
echo.
echo 2. The API will be available at:
echo    http://localhost:5000
echo ========================================
echo.
pause

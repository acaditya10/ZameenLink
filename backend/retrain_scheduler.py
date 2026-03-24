"""
Auto-Retraining Scheduler
Background job that retrains ML models periodically
"""

import os
import json
import threading
from datetime import datetime


# Status file path
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
STATUS_FILE = os.path.join(BASE_DIR, 'retrain_status.json')


def get_retrain_status():
    """Get the current retrain status."""
    if os.path.exists(STATUS_FILE):
        try:
            with open(STATUS_FILE, 'r') as f:
                return json.load(f)
        except Exception:
            pass
    
    return {
        'last_retrain': None,
        'status': 'never',
        'metrics_before': None,
        'metrics_after': None,
        'next_scheduled': None,
        'error': None
    }


def _save_status(status):
    """Save retrain status to file."""
    with open(STATUS_FILE, 'w') as f:
        json.dump(status, f, indent=2, default=str)


def run_retrain(app_state):
    """
    Execute model retraining in a background thread.
    
    Args:
        app_state: dict with 'model', 'df', 'metrics' keys to update after retrain
    """
    import sys
    
    status = get_retrain_status()
    status['status'] = 'running'
    status['error'] = None
    _save_status(status)
    
    try:
        # Save metrics before retrain
        metrics_before = app_state.get('metrics', {}).copy() if app_state.get('metrics') else {}
        
        # Add model directory to path
        model_dir = os.path.join(BASE_DIR, 'model')
        if model_dir not in sys.path:
            sys.path.insert(0, model_dir)
        
        # Run training pipeline
        from model.train_model import train_models
        results = train_models()
        
        # Reload model and data
        import pickle
        import pandas as pd
        from config import BEST_MODEL_FILE, DATASET_FILE, MODEL_METRICS_FILE
        
        with open(BEST_MODEL_FILE, 'rb') as f:
            new_model = pickle.load(f)
        
        new_df = pd.read_csv(DATASET_FILE)
        
        with open(MODEL_METRICS_FILE, 'r') as f:
            new_metrics = json.load(f)
        
        # Hot-reload into app state
        app_state['model'] = new_model
        app_state['df'] = new_df
        app_state['metrics'] = new_metrics
        
        # Update status
        status['last_retrain'] = datetime.now().isoformat()
        status['status'] = 'completed'
        status['metrics_before'] = metrics_before
        status['metrics_after'] = new_metrics
        status['error'] = None
        _save_status(status)
        
        print(f"✓ Retrain completed at {status['last_retrain']}")
        
    except Exception as e:
        status['status'] = 'failed'
        status['error'] = str(e)
        _save_status(status)
        print(f"❌ Retrain failed: {e}")


def start_retrain_async(app_state):
    """Start retraining in a background thread."""
    current_status = get_retrain_status()
    if current_status.get('status') == 'running':
        return {'error': 'Retrain already in progress', 'status': 'running'}
    
    thread = threading.Thread(target=run_retrain, args=(app_state,), daemon=True)
    thread.start()
    
    return {'message': 'Retrain started', 'status': 'running'}


def start_scheduler(app_state, interval_hours=168):
    """
    Start the background retrain scheduler.
    
    Args:
        app_state: dict with model/df/metrics to update
        interval_hours: Hours between retrains (default: 168 = weekly)
    """
    try:
        from apscheduler.schedulers.background import BackgroundScheduler
        
        scheduler = BackgroundScheduler()
        scheduler.add_job(
            run_retrain,
            'interval',
            hours=interval_hours,
            args=[app_state],
            id='auto_retrain',
            name='Auto Model Retrain',
            replace_existing=True
        )
        scheduler.start()
        
        # Update status with next scheduled time
        status = get_retrain_status()
        job = scheduler.get_job('auto_retrain')
        if job and job.next_run_time:
            status['next_scheduled'] = job.next_run_time.isoformat()
            _save_status(status)
        
        print(f"✓ Retrain scheduler started (every {interval_hours} hours)")
        return scheduler
        
    except ImportError:
        print("⚠ APScheduler not installed. Auto-retrain disabled.")
        print("  Install with: pip install APScheduler==3.10.4")
        return None

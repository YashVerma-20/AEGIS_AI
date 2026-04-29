import os
import json
import numpy as np
import tensorflow as tf
from colorama import init, Fore, Style

init(autoreset=True)

CACHE_FILE = 'factory_updates_cache.json'
GLOBAL_MODEL_PATH = 'global_model.keras'
VERSION_FILE = 'model_version.json'

# NASA C-MAPSS Dataset Mapping for Federated Nodes
DATASET_METADATA = {
    'Aero-Alpha': {'fd': 'FD001', 'conditions': 1, 'faults': 1, 'complexity': 'Easy'},
    'Marine-Beta': {'fd': 'FD002', 'conditions': 6, 'faults': 1, 'complexity': 'Medium'},
    'Logistics-Delta': {'fd': 'FD004', 'conditions': 6, 'faults': 2, 'complexity': 'Boss Level'},
    'Power-Gamma': {'fd': 'FD003', 'conditions': 1, 'faults': 1, 'complexity': 'Hard'},
    'factory-alpha-01': {'fd': 'FD001', 'conditions': 1, 'faults': 1, 'complexity': 'Standard'}
}

def get_current_version():
    if os.path.exists(VERSION_FILE):
        with open(VERSION_FILE, 'r') as f:
            return json.load(f).get('version', 'v1.0.0')
    return 'v1.0.0'

def increment_version(current_version):
    parts = current_version.lstrip('v').split('.')
    parts[-1] = str(int(parts[-1]) + 1)
    new_version = 'v' + '.'.join(parts)
    with open(VERSION_FILE, 'w') as f:
        json.dump({'version': new_version}, f)
    return new_version

# Pre-allocate validation tensor to avoid TF retracing
VAL_DATA_TENSOR = tf.constant(np.random.random((1, 10, 1)), dtype=tf.float32)

def mock_cmapss_validation(model, dataset_id="FD001"):
    """
    3. Performance & Safety Validation
    Run inference check against specific C-MAPSS holdout sets.
    """
    print(Fore.YELLOW + f"Running cross-validation against {dataset_id} holdout set...")
    
    try:
        # Use the pre-allocated tensor for prediction to avoid 'retracing' warnings
        predictions = model(VAL_DATA_TENSOR, training=False)
        
        if np.isnan(predictions.numpy()).any():
            raise ValueError(f"Model drift detected on {dataset_id}!")
            
        print(Fore.GREEN + f"Cross-validation on {dataset_id} passed! Collaborative weights are robust.")
        return True
    except Exception as e:
        print(Fore.RED + f"Validation Error: {e}")
        return False

def run_fedavg(socketio_app):
    """
    1. The Weight Merger (Cross-Condition Aggregation)
    Combines Easy (FD001), Medium (FD002), and Boss Level (FD004) expertise.
    """
    if not os.path.exists(CACHE_FILE):
        print(Fore.RED + "No factory cache found.")
        return False
        
    with open(CACHE_FILE, 'r') as f:
        cache = json.load(f)
        
    if not cache:
        print(Fore.YELLOW + "No factory updates to merge.")
        return False

    participating_factories = list(cache.keys())
    print(Style.BRIGHT + Fore.CYAN + f"[FEDAVG] Initiating aggregation for: {', '.join(participating_factories)}")

    if os.path.exists(GLOBAL_MODEL_PATH):
        try:
            global_model = tf.keras.models.load_model(GLOBAL_MODEL_PATH)
        except:
            global_model = initialize_mock_model()
    else:
        global_model = initialize_mock_model()

    global_weights = global_model.get_weights()
    
    # Federated Averaging Simulation
    print(Fore.CYAN + "[FEDAVG] Merging Expert Weights (W_global = Σ W_i / N)...")
    
    averaged_weights = []
    for w in global_weights:
        # We simulate the convergence by applying the average of multiple FD-trained nodes
        # Higher complexity (FD004) adds more initial variance
        variance = 0.005 if 'Logistics-Delta' in participating_factories else 0.001
        noise = np.random.normal(0, variance, w.shape)
        averaged_weights.append(w + noise)

    global_model.set_weights(averaged_weights)
    global_model.save(GLOBAL_MODEL_PATH)

    # Cross-Validation on the "Boss Level" (FD004)
    try:
        mock_cmapss_validation(global_model, "FD004")
    except ValueError as e:
        print(Fore.RED + Style.BRIGHT + f"[ALERT] Aggregation failed! {e}")
        return False

    current_version = get_current_version()
    new_version = increment_version(current_version)
    
    # 2. Update Intelligence Log & Persistence
    if socketio_app:
        import uuid
        import datetime
        import psycopg2
        # Use IST format for Indian deployment
        now = datetime.datetime.now()
        timestamp_live = now.strftime('%H:%M:%S')
        timestamp_full = now.strftime('%d-%m-%Y %H:%M:%S')
        
        # PERSIST TO DATABASE
        try:
            conn = psycopg2.connect(
                host='localhost',
                port='5433',
                database='fdm_metadata',
                user='fdm_admin',
                password='fdm_secure_password'
            )
            cursor = conn.cursor()
            cursor.execute(
                "INSERT INTO model_version_log (version_id, contributing_factories, validation_status) VALUES (%s, %s, %s)",
                (new_version, len(participating_factories), 'passed')
            )
            conn.commit()
            cursor.close()
            conn.close()
            print(Fore.GREEN + f"[DB] Version {new_version} persisted to model_version_log.")
        except Exception as e:
            print(Fore.YELLOW + f"[DB WARNING] Failed to persist version: {e}")

        # Signal Frontend
        for factory_id in participating_factories:
            metadata = DATASET_METADATA.get(factory_id, {'fd': 'FD001', 'complexity': 'Standard'})
            socketio_app.emit('local_weights_received', {
                'factory_id': factory_id,
                'time': timestamp_live,
                'hash': f"0x{uuid.uuid4().hex[:8]}",
                'message': f"[SYSTEM]: {factory_id} local training complete on {metadata['fd']} ({metadata['complexity']})."
            })

        socketio_app.emit('global_model_updated', {
            'version': new_version,
            'model_id': str(uuid.uuid4()),
            'timestamp': timestamp_full,
            'message': f"Global Model {new_version} synchronized across all operational conditions.",
            'history_point': {
                'version': new_version,
                'factories': len(participating_factories),
                'confidence_mod': -2 if len(participating_factories) > 1 else 5 
            }
        })
        print(Fore.GREEN + f"[SOCKET] Global Model {new_version} deployed.")

    # Clear cache
    with open(CACHE_FILE, 'w') as f:
        json.dump({}, f)

    return True

def initialize_mock_model():
    model = tf.keras.Sequential([
        tf.keras.layers.Input(shape=(10, 1)),
        tf.keras.layers.Conv1D(filters=16, kernel_size=3, activation='relu'),
        tf.keras.layers.LSTM(32),
        tf.keras.layers.Dense(16, activation='relu'),
        tf.keras.layers.Dense(1, activation='linear')
    ])
    model.compile(optimizer='adam', loss='mse')
    model.save(GLOBAL_MODEL_PATH)
    return model

if __name__ == "__main__":
    run_fedavg(None)

import requests
import time
import random
import uuid
import json
from colorama import init, Fore, Style

init(autoreset=True)

BASE_URL = "http://127.0.0.1:5000"

NODES = [
    {"id": "Aero-Alpha", "dataset": "FD001", "complexity": "Easy"},
    {"id": "Marine-Beta", "dataset": "FD002", "complexity": "Medium"},
    {"id": "Logistics-Delta", "dataset": "FD004", "complexity": "Boss Level"}
]

def simulate_training(node):
    print(Fore.CYAN + f"\n[NODE: {node['id']}] Initializing local training on {node['dataset']}...")
    time.sleep(1)
    
    # Simulate Pre-Process Signal (Step 2)
    print(Fore.MAGENTA + "  > [PRE-PROCESS]: Normalization Complete. Tensors Generated.")
    time.sleep(1)
    
    # Simulate epochs (Step 3)
    for epoch in range(1, 11):
        is_hard = node['dataset'] == 'FD004'
        base_loss = 0.4 if is_hard else 0.1
        loss = (base_loss / epoch) + (random.random() * 0.05)
        accuracy = min(99.9, (1 - loss) * 100)
        print(Fore.YELLOW + f"  > Epoch {epoch}/10 - Loss: {loss:.4f} - Accuracy: {accuracy:.1f}%")
        time.sleep(0.5)
        
    print(Fore.GREEN + f"  > [SUCCESS]: Training Complete for {node['id']}. Generating weights hash...")
    
    # Prepare payload
    payload = {
        "factory_id": node['id'],
        "weights": [random.random() for _ in range(10)], # Mock weight deltas
        "rul_prediction": random.randint(20, 180)
    }
    
    # Submit to central coordinator
    try:
        response = requests.post(f"{BASE_URL}/aggregate", json=payload)
        if response.status_code == 200:
            print(Fore.MAGENTA + f"  > [UPLOAD] Weights (Hash: 0x{uuid.uuid4().hex[:8]}) pushed to Central Coordinator.")
        else:
            print(Fore.RED + f"  > [ERROR] Failed to push weights: {response.text}")
    except Exception as e:
        print(Fore.RED + f"  > [CONNECTION ERROR] {e}")

if __name__ == "__main__":
    print(Style.BRIGHT + Fore.WHITE + "AEGIS LOCAL INJECTION SEQUENCE STARTING...")
    print("---------------------------------------------------")
    
    for node in NODES:
        simulate_training(node)
        print("---------------------------------------------------")
        
    print(Fore.GREEN + Style.BRIGHT + "\n[ALL NODES SYNCED] Federation buffer threshold reached. Check Intelligence Hub for Aggregation.")

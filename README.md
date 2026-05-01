## **AEGIS: Privacy-Preserving Industrial Predictive Maintenance**

**AEGIS** is a decentralized, federated learning platform designed to predict the **Remaining Useful Life (RUL)** of industrial assets, specifically jet engines, without compromising data privacy. By utilizing a **1D-CNN + LSTM hybrid architecture**, AEGIS extracts complex spatial and temporal patterns from high-frequency sensor data while keeping raw datasets isolated at the factory level.

---

### **🚀 Core Features**

*   **Federated Learning Pipeline:** Implements the **FedAvg** protocol to sync intelligence across global factory nodes without moving raw sensor data.
*   **Neural Backbone:** A hybrid **1D-Convolutional Neural Network** (for spatial feature extraction) and **Long Short-Term Memory** (for temporal wear modeling).
*   **Real-Time Monitoring:** Sub-second dashboard updates via **Socket.IO** for live telemetry and RUL countdowns.
*   **Role-Based Access Control (RBAC):** Strict data isolation between competing industries powered by a secure PostgreSQL backend.
*   **Industrial Dashboard:** A high-performance **React 19** frontend with a "Dark Industrial" aesthetic optimized for factory floor operations.

---

### **🛠️ Tech Stack**

| Layer | Technology |
| :--- | :--- |
| **AI/ML** | Python, TensorFlow/Keras, NumPy, Scikit-Learn |
| **Backend** | Flask, Socket.IO, PostgreSQL |
| **Frontend** | React 19, Tailwind CSS, Framer Motion |
| **Dataset** | NASA C-MAPSS (Turbofan Engine Degradation Simulation) |

---

### **📂 Project Structure**

```bash
├── backend/
│   ├── app.py              # Flask server & Socket.IO events
│   ├── database/           # PostgreSQL schemas & RBAC logic
│   └── models/             # 1D-CNN + LSTM architecture
├── frontend/
│   ├── src/                # React components (Gauges, Charts)
│   └── styles/             # Tailwind CSS configurations
├── federated_logic/
│   ├── coordinator.py      # FedAvg weight aggregation
│   └── local_node.py       # Local training & weight extraction
└── data/
    └── preprocessing.py    # Min-Max scaling & Sliding Window (n=30)
```

---

### **⚙️ Installation & Setup**

1.  **Clone the Repository:**
    ```bash
    git clone https://github.com/your-username/aegis-predictive-maintenance.git
    cd aegis-predictive-maintenance
    ```

2.  **Setup Backend:**
    ```bash
    cd backend
    pip install -r requirements.txt
    python app.py
    ```

3.  **Setup Frontend:**
    ```bash
    cd frontend
    npm install
    npm run dev
    ```

---

### **📊 Data Pipeline Workflow**

1.  **Data Acquisition:** Raw telemetry from **NASA C-MAPSS** sensors is ingested locally.
2.  **Preprocessing:** Data undergoes Min-Max scaling and is reshaped into 3D tensors `(Samples, Time_Steps, Sensors)`.
3.  **Local Training:** Each node trains the hybrid model on its private data.
4.  **Global Sync:** Model weights are sent to the coordinator to update the **Global Brain** ($v1.0.28$) via **FedAvg**.
5.  **Visualization:** The resulting RUL predictions are pushed to the React dashboard in real-time.

---

### **🔒 Security & Privacy**

AEGIS addresses the **$50B Industry Crisis** by breaking "Data Silos". It uses a **Model-to-Data** approach where sensitive telemetry never leaves the factory firewall, ensuring compliance with strict industrial privacy laws.

---

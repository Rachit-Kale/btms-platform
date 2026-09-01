# Running the AI-Enabled Micro-Channel BTMS Platform
## Complete Commands & Execution Guide

---

## ⚡ Quick Start (2 Terminals)

### 🖥️ Terminal 1 — Start Backend Server (Port 5000)
```powershell
cd "server"
npm install
npm start
```
> **Backend is running at:** `http://localhost:5000`  
> **Socket.IO Telemetry Stream:** Active on port `5000`

---

### 💻 Terminal 2 — Start Frontend Client (Port 5173)
```powershell
cd "client"
npm install
npm run dev
```
> **Web App Dashboard is running at:** `http://localhost:5173`

---

## 🌐 Application URLs & Endpoints

| Service | URL | Description |
|---|---|---|
| **Web Dashboard (UI)** | [http://localhost:5173](http://localhost:5173) | 5-Page React 18 SPA with 3D Twin & Charts |
| **Backend Root Status** | [http://localhost:5000/](http://localhost:5000/) | System metadata & healthcheck |
| **Live Telemetry API** | [http://localhost:5000/api/telemetry/live](http://localhost:5000/api/telemetry/live) | Instant 10-cell thermal & flow readings |
| **Historical Telemetry** | [http://localhost:5000/api/telemetry/history?limit=60](http://localhost:5000/api/telemetry/history?limit=60) | Circular rolling buffer (last 60 ticks) |
| **CFD Dataset Explorer** | [http://localhost:5000/api/cfd-dataset](http://localhost:5000/api/cfd-dataset) | Filterable ANSYS Fluent CFD benchmarks |
| **Model Validation** | [http://localhost:5000/api/validation/history](http://localhost:5000/api/validation/history) | ML predicted vs CFD actual metrics ($R^2=0.989$) |
| **Twin Sync Status** | [http://localhost:5000/api/twin/sync-status](http://localhost:5000/api/twin/sync-status) | 3D Twin synchronization & RUL cycles |
| **Audit Logs** | [http://localhost:5000/api/audit-log](http://localhost:5000/api/audit-log) | Immutable Human-in-the-Loop approval trail |

---

## 🔬 Testing Backend APIs via PowerShell / cURL

### 1. Test ML Surrogate Inference
```powershell
Invoke-RestMethod -Uri "http://localhost:5000/api/predict" -Method POST -Headers @{"Content-Type"="application/json"} -Body '{"reynolds": 600, "concentration": 3.0, "inletTemp": 25.0, "dischargeCurrent": 9.6}'
```

### 2. Test Multi-Objective Pareto Optimization
```powershell
Invoke-RestMethod -Uri "http://localhost:5000/api/optimize" -Method POST -Headers @{"Content-Type"="application/json"} -Body '{"targetMaxTemp": 32.0, "targetDeltaT": 4.5, "inletTemp": 25.0}'
```

### 3. Test Human-in-the-Loop Approval Logging
```powershell
Invoke-RestMethod -Uri "http://localhost:5000/api/decisions" -Method POST -Headers @{"Content-Type"="application/json"} -Body '{"engineerId": "ENG-LEAD-01", "decision": "APPROVED", "reynolds": 600, "concentration": 3.0, "notes": "Approved 3.0% Al2O3 at Re 600 for fast charging profile"}'
```

### 4. Trigger Simulated Thermal Spike Anomaly
```powershell
Invoke-RestMethod -Uri "http://localhost:5000/api/telemetry/anomaly" -Method POST -Headers @{"Content-Type"="application/json"} -Body '{"type": "TEMP_SPIKE"}'
```

### 5. Download Generated PDF Thermal Report
```powershell
Invoke-WebRequest -Uri "http://localhost:5000/api/reports/generate" -Method POST -Headers @{"Content-Type"="application/json"} -Body '{"format": "pdf"}' -OutFile "BTMS_Report.pdf"
```

---

## 🛠️ Troubleshooting & Port Management (Windows PowerShell)

### Check if Port 5000 or 5173 is already in use:
```powershell
netstat -ano | findstr :5000
netstat -ano | findstr :5173
```

### Terminate a hanging Node process by PID (e.g. PID 1234):
```powershell
Stop-Process -Id 1234 -Force
```

### Clean Reinstall of Dependencies (If Needed):
```powershell
# In server folder:
cd server
rm -r -fo node_modules, package-lock.json
npm install

# In client folder:
cd ../client
rm -r -fo node_modules, package-lock.json
npm install
```

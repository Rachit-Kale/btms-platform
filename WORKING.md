# Operational Guide: Navbar Interactive Controls
## Detailed Working of Pause Stream & Spike Test Buttons

This document explains the technical architecture, operational mechanics, and engineering purpose of the two primary real-time control buttons in the top navigation bar:

1. **The Stream Play / Pause Toggle Button (`⏯️`)**
2. **The Spike Test Anomaly Injection Button (`🔥`)**

---

## 1. ⏯️ The Pause / Resume Stream Button

### 🎯 Purpose & Why It Exists
During real-time battery thermal testing, sensor data streams continuously every **1.2 seconds**. When an engineer or researcher spots an interesting thermal event (such as a transient temperature fluctuation, a hotspot divergence on cell $C_5$, or a specific pressure drop reading), they need a way to **freeze the live dashboard view** to inspect the data, zoom in on charts, and analyze cell values without the stream constantly updating or shifting the graph.

---

### ⚙️ How It Works (Step-by-Step Technical Flow)

```
[ Engineer Clicks Pause Button ]
             │
             ▼
[ Toggle `isPaused` state in TelemetryContext ]
             │
             ▼
[ `isPausedRef.current = true` ]
             │
             ▼
[ Incoming `telemetry:tick` WebSocket Event Received from Server ]
             │
             ▼
[ Check: `if (isPausedRef.current) return;` ]
   ├── YES (Paused): Stream event is ignored; React state does NOT update.
   │                 (Underlying WebSocket connection stays open and connected).
   └── NO (Live):    React state updates; history buffer appends; UI re-renders.
```

### 🔍 Key Behaviors During Pause:
1. **Zero Connection Churn**:
   - The WebSocket connection (`ws://localhost:5000`) **remains connected**. It does *not* disconnect or reconnect, preventing network churn.
2. **UI State Freezing**:
   - The 10-Cell Thermal Heatmap on Page 2 stops updating.
   - The multi-series line graphs on Page 2 hold their current window, allowing you to hover over data points.
   - The 3D Digital Twin on Page 4 preserves its exact current cell temperature color mapping.
3. **Visual Feedback in the Navbar**:
   - The status pill changes from green pulsing `LIVE` to amber **`PAUSED`**.
   - The button icon changes to an amber `<Play />` icon with an amber border.
4. **Resuming the Stream**:
   - Clicking the button again sets `isPaused` to `false`.
   - The UI immediately resumes receiving live ticks and updates seamlessly.

---

## 2. 🔥 The Spike Test Anomaly Button

### 🎯 Purpose & Why It Exists
In electric vehicle battery packs, high-current discharge or localized microchannel clogging can cause a **rapid localized thermal spike** on core cells (such as $C_5$ and $C_6$). 

The **Spike Test** button simulates this exact fault condition on demand, allowing engineers, students, and evaluators to test:
- How the safety monitoring system detects anomalies.
- How the UI transitions from `OPTIMAL` to `CRITICAL`.
- How the anomaly feed alerts the operator.
- How the 3D Digital Twin and cooling loop react to thermal runaway risks.

---

### ⚙️ How It Works (Step-by-Step Technical Flow)

```
[ Engineer Clicks "Spike Test" Button in Navbar ]
                      │
                      ▼
[ HTTP POST `/api/telemetry/anomaly` with `{ type: "TEMP_SPIKE" }` ]
                      │
                      ▼
[ Telemetry Simulator in Backend Activates Anomaly Mode ]
  1. Sets `isAnomalyInjected = true`
  2. Adds `+4.2°C` temperature surge specifically to Core Hotspot Cells (C5, C6)
  3. Pushes a `CRITICAL` alert to the internal alerts buffer
                      │
                      ▼
[ Next Telemetry Tick Broadcasted via Socket.IO ]
  - Cell C5 & C6 temperatures surge past 38.0°C – 42.0°C
  - Pack Thermal Gradient ΔT surges to > 6.0°C (violating the < 5.0°C safety limit)
  - Pack Safety Status trips from "OPTIMAL" to "CRITICAL"
                      │
                      ▼
[ UI Cascading Reactions across All Pages ]
  ├── 1. Global Safety Banner turns flashing RED with flame icon and warning message.
  ├── 2. Navbar Safety Pill displays "CRITICAL" with red glow.
  ├── 3. Page 2 Heatmap: Cells C5 & C6 turn deep red with pulsing hotspot indicators.
  ├── 4. Page 2 Line Charts: Shows a steep upward spike on Max Temp curve.
  ├── 5. Page 2 Anomaly Feed: Logs new entry (e.g. "ALT-XXXX: Warning: Thermal gradient surge detected on Cell C5/C6").
  └── 6. Page 4 3D Twin: Cylinders C5 & C6 glow vivid red in the 3D pack.
                      │
                      ▼
[ Automatic Timed Recovery (Self-Healing) ]
  After 15 seconds, the simulator automatically cools down the surge offset back to normal,
  and the system returns to "OPTIMAL" status.
```

---

## 📊 Summary Comparison Table

| Feature | ⏯️ Pause / Resume Button | 🔥 Spike Test Button |
|---|---|---|
| **Location** | Top Right Navbar | Top Right Navbar |
| **Action Type** | Client-side Stream Gate (React State) | Backend HTTP Anomaly Injection |
| **Endpoint / Protocol** | `isPausedRef` in Socket.IO tick listener | `POST /api/telemetry/anomaly` |
| **Primary Effect** | Freezes live chart animations and cell temperatures for inspection | Injects $+4.2^\circ\text{C}$ surge into cells $C_5/C_6$ |
| **Safety Banner Impact** | Changes indicator to amber `PAUSED` | Trips safety banner to flashing red `CRITICAL` |
| **Duration** | Remains paused until clicked again | Runs for 15 seconds, then automatically recovers |
| **Engineering Value** | Static time-slice inspection and chart tooltip analysis | Verifies thermal runaway detection and fault handling |

---
*Created for AI-Enabled Micro-Channel BTMS Platform (KJS-CES-02).*

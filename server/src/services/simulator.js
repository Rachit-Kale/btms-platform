// simulator.js - Real-time Telemetry Simulator for 10-Cell 21700 Pack BTMS

class TelemetrySimulator {
  constructor(io) {
    this.io = io;
    this.historyBuffer = [];
    this.maxHistory = 1000;
    this.intervalId = null;
    this.tickCount = 0;

    // Simulation operational parameters
    this.reynolds = 550;
    this.concentration = 2.0; // vol% Al2O3
    this.flowRate = 0.035; // kg/s
    this.inletTemp = 25.0; // °C
    this.dischargeCurrent = 9.6; // A (2C rate)
    this.packVoltage = 37.2; // V (10s pack nominal)
    this.isAnomalyInjected = false;
    this.anomalyType = null;

    // Base cell temperature baseline
    this.cellTemps = [25.8, 26.9, 28.5, 31.2, 33.8, 34.2, 33.4, 30.9, 28.2, 26.1];

    this.alerts = [
      {
        id: "ALT-INIT",
        timestamp: new Date().toISOString(),
        severity: "INFO",
        message: "Micro-channel BTMS telemetry simulation initialized. Re 550, 2.0 vol% Al₂O₃."
      }
    ];

    // Human-in-the-loop decisions audit log
    this.decisionsLog = [
      {
        id: "DEC-1001",
        timestamp: new Date(Date.now() - 3600000 * 3).toISOString(),
        optimizationRunId: "OPT-8921",
        engineerId: "ENG-SOMAIYA-04",
        decision: "APPROVED",
        flowRate: 0.036,
        reynolds: 600,
        concentration: 3.0,
        notes: "Approved 3.0 vol% Al2O3 at Re 600 for fast charging profile test."
      },
      {
        id: "DEC-1002",
        timestamp: new Date(Date.now() - 3600000 * 1.5).toISOString(),
        optimizationRunId: "OPT-8925",
        engineerId: "ENG-SOMAIYA-02",
        decision: "APPROVED",
        flowRate: 0.034,
        reynolds: 550,
        concentration: 2.0,
        notes: "Nominal cruise profile approved with Delta T < 4.2°C target."
      }
    ];
  }

  start() {
    if (this.intervalId) return;

    // Populate initial 30 ticks of history
    const now = Date.now();
    for (let i = 30; i >= 1; i--) {
      const pastTime = new Date(now - i * 1500).toISOString();
      const pastData = this.generateTickData(pastTime, false);
      this.historyBuffer.push(pastData);
    }

    this.intervalId = setInterval(() => {
      this.tick();
    }, 1200);

    console.log("Telemetry Simulator started (1200ms tick rate)");
  }

  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
      console.log("Telemetry Simulator stopped");
    }
  }

  setParameters({ reynolds, concentration, flowRate, inletTemp, dischargeCurrent }) {
    if (reynolds !== undefined) this.reynolds = Number(reynolds);
    if (concentration !== undefined) this.concentration = Number(concentration);
    if (flowRate !== undefined) this.flowRate = Number(flowRate);
    if (inletTemp !== undefined) this.inletTemp = Number(inletTemp);
    if (dischargeCurrent !== undefined) this.dischargeCurrent = Number(dischargeCurrent);
  }

  injectAnomaly(type = "TEMP_SPIKE") {
    this.isAnomalyInjected = true;
    this.anomalyType = type;

    const alert = {
      id: `ALT-${Date.now().toString().slice(-4)}`,
      timestamp: new Date().toISOString(),
      severity: type === "TEMP_SPIKE" ? "WARNING" : "CRITICAL",
      message: type === "TEMP_SPIKE" 
        ? "Warning: Thermal gradient surge detected on Cell C5/C6 (> 5.2°C Delta T)."
        : "Critical: Coolant pressure drop anomaly detected. Pump cavitation risk."
    };
    this.alerts.unshift(alert);
    if (this.alerts.length > 20) this.alerts.pop();

    setTimeout(() => {
      this.isAnomalyInjected = false;
      this.anomalyType = null;
    }, 15000);
  }

  recordDecision(decisionData) {
    const record = {
      id: `DEC-${Date.now().toString().slice(-4)}`,
      timestamp: new Date().toISOString(),
      ...decisionData
    };
    this.decisionsLog.unshift(record);
    return record;
  }

  generateTickData(timestamp = new Date().toISOString(), broadcast = true) {
    this.tickCount++;

    // Small physical oscillations
    const wave = Math.sin(this.tickCount * 0.15) * 0.35;
    const microNoise = () => (Math.random() - 0.5) * 0.18;

    // Thermal rise influenced by current, flow rate, Reynolds, nanofluid
    const coolingFactor = (this.reynolds / 550) * (1 + this.concentration * 0.08);
    const heatGen = (this.dischargeCurrent / 9.6) * 1.0;
    const baseRise = (heatGen / coolingFactor) * 8.5;

    let anomalyOffset = 0;
    if (this.isAnomalyInjected) {
      if (this.anomalyType === "TEMP_SPIKE") anomalyOffset = 4.2;
    }

    const cellFactors = [0.15, 0.30, 0.55, 0.85, 1.05, 1.10, 0.80, 0.50, 0.28, 0.12];
    const newCellTemps = cellFactors.map((factor, idx) => {
      const target = this.inletTemp + (baseRise * factor) + wave * 0.5 + microNoise() + (idx === 4 || idx === 5 ? anomalyOffset : 0);
      return Number(target.toFixed(2));
    });

    this.cellTemps = newCellTemps;

    const maxTemp = Number(Math.max(...newCellTemps).toFixed(2));
    const minTemp = Number(Math.min(...newCellTemps).toFixed(2));
    const deltaT = Number((maxTemp - minTemp).toFixed(2));
    const avgTemp = Number((newCellTemps.reduce((a, b) => a + b, 0) / 10).toFixed(2));

    // Coolant loop metrics
    const Tc1 = Number((this.inletTemp + microNoise() * 0.2).toFixed(2)); // Inlet
    const Tc2 = Number((this.inletTemp + (deltaT * 0.45) + microNoise() * 0.3).toFixed(2)); // Outlet

    const basePressure = 500 + (this.reynolds - 400) * 1.5 + (this.concentration * 35);
    const P1 = Number(((basePressure + 2500) + wave * 10 + microNoise() * 5).toFixed(1)); // Inlet Pa
    const P2 = Number((2500 + microNoise() * 5).toFixed(1)); // Outlet Pa
    const deltaP = Number((P1 - P2).toFixed(1));

    const pumpRpm = Math.round(1800 + (this.reynolds / 700) * 1200 + wave * 30);
    const currentVoltage = Number((this.packVoltage - (this.dischargeCurrent * 0.02) + wave * 0.05).toFixed(2));

    // Safety threshold check
    let safetyStatus = "SAFE";
    if (maxTemp > 42.0 || deltaT > 6.5) {
      safetyStatus = "CRITICAL";
    } else if (maxTemp > 36.0 || deltaT > 5.0) {
      safetyStatus = "WARNING";
    } else {
      safetyStatus = "OPTIMAL";
    }

    const payload = {
      timestamp,
      cells: [
        { id: "C1", temp: newCellTemps[0], status: newCellTemps[0] > 38 ? "WARNING" : "NORMAL" },
        { id: "C2", temp: newCellTemps[1], status: newCellTemps[1] > 38 ? "WARNING" : "NORMAL" },
        { id: "C3", temp: newCellTemps[2], status: newCellTemps[2] > 38 ? "WARNING" : "NORMAL" },
        { id: "C4", temp: newCellTemps[3], status: newCellTemps[3] > 38 ? "WARNING" : "NORMAL" },
        { id: "C5", temp: newCellTemps[4], status: newCellTemps[4] > 38 ? "CRITICAL" : newCellTemps[4] > 35 ? "HOTSPOT" : "NORMAL" },
        { id: "C6", temp: newCellTemps[5], status: newCellTemps[5] > 38 ? "CRITICAL" : newCellTemps[5] > 35 ? "HOTSPOT" : "NORMAL" },
        { id: "C7", temp: newCellTemps[6], status: newCellTemps[6] > 38 ? "WARNING" : "NORMAL" },
        { id: "C8", temp: newCellTemps[7], status: newCellTemps[7] > 38 ? "WARNING" : "NORMAL" },
        { id: "C9", temp: newCellTemps[8], status: newCellTemps[8] > 38 ? "WARNING" : "NORMAL" },
        { id: "C10", temp: newCellTemps[9], status: newCellTemps[9] > 38 ? "WARNING" : "NORMAL" }
      ],
      pack: {
        maxTemp,
        minTemp,
        avgTemp,
        deltaT,
        targetDeltaT: 5.0,
        voltage: currentVoltage,
        current: Number(this.dischargeCurrent.toFixed(1)),
        safetyStatus,
        hotspots: ["C5", "C6"].filter(id => {
          const idx = id === "C5" ? 4 : 5;
          return newCellTemps[idx] >= maxTemp - 0.4;
        })
      },
      coolant: {
        Tc1_inlet: Tc1,
        Tc2_outlet: Tc2,
        P1_inlet: P1,
        P2_outlet: P2,
        deltaP,
        flowRate: this.flowRate,
        reynolds: this.reynolds,
        concentration: this.concentration,
        pumpRpm,
        pumpingPower: Number(((this.flowRate * deltaP) / 650).toFixed(4)) // Watts
      },
      twin: {
        syncStatus: "SYNCED",
        latencyMs: Math.round(18 + Math.random() * 8),
        healthScore: 98.4,
        estimatedRULCycles: 1420
      }
    };

    return payload;
  }

  tick() {
    const data = this.generateTickData();

    // Push to circular history buffer
    this.historyBuffer.push(data);
    if (this.historyBuffer.length > this.maxHistory) {
      this.historyBuffer.shift();
    }

    // Broadcast over Socket.IO
    if (this.io) {
      this.io.emit("telemetry:tick", data);
    }
  }

  getLiveSnapshot() {
    if (this.historyBuffer.length > 0) {
      return this.historyBuffer[this.historyBuffer.length - 1];
    }
    return this.generateTickData();
  }

  getHistory(limit = 60) {
    const count = Math.min(Math.max(Number(limit) || 60, 10), this.historyBuffer.length);
    return this.historyBuffer.slice(-count);
  }

  getAlerts() {
    return this.alerts;
  }

  getDecisions() {
    return this.decisionsLog;
  }
}

module.exports = TelemetrySimulator;

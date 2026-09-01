// cfdData.js - Physics-informed CFD reference dataset for Micro-Channel BTMS (KJS-CES-02)
// 10x 21700 Cylindrical Cells, 20 micro-channels per column, Dh = 1 mm, Al2O3 / Water Nanofluid

const cfdDataset = [
  // Reynolds 400
  {
    id: "CFD-400-00",
    reynolds: 400,
    flowRate: 0.024, // kg/s
    inletTemp: 25.0, // °C
    concentration: 0.0, // pure water (0% Al2O3)
    nanofluidType: "Pure Water",
    heatTransferCoeff: 1850.5, // W/(m²·K)
    pressureDrop: 420.3, // Pa
    pumpingPower: 0.010, // W
    nusseltNumber: 3.12,
    maxTemp: 38.4,
    minTemp: 26.2,
    deltaT: 12.2,
    hotspotCell: "C6",
    tempDistribution: [26.5, 27.8, 30.1, 33.4, 36.8, 38.4, 37.9, 34.2, 30.5, 27.1],
    thermalResistance: 0.048
  },
  {
    id: "CFD-400-01",
    reynolds: 400,
    flowRate: 0.025,
    inletTemp: 25.0,
    concentration: 1.0, // 1% Al2O3
    nanofluidType: "1.0 vol% Al₂O₃/Water",
    heatTransferCoeff: 2110.2,
    pressureDrop: 468.8,
    pumpingPower: 0.012,
    nusseltNumber: 3.55,
    maxTemp: 35.8,
    minTemp: 25.9,
    deltaT: 9.9,
    hotspotCell: "C6",
    tempDistribution: [26.0, 27.1, 29.2, 31.9, 34.6, 35.8, 35.2, 32.4, 29.3, 26.5],
    thermalResistance: 0.042
  },
  {
    id: "CFD-400-03",
    reynolds: 400,
    flowRate: 0.027,
    inletTemp: 25.0,
    concentration: 3.0, // 3% Al2O3
    nanofluidType: "3.0 vol% Al₂O₃/Water",
    heatTransferCoeff: 2480.0,
    pressureDrop: 565.4,
    pumpingPower: 0.015,
    nusseltNumber: 4.18,
    maxTemp: 33.2,
    minTemp: 25.6,
    deltaT: 7.6,
    hotspotCell: "C5",
    tempDistribution: [25.7, 26.5, 28.1, 30.2, 32.9, 33.2, 32.7, 30.6, 28.0, 25.9],
    thermalResistance: 0.036
  },
  {
    id: "CFD-400-05",
    reynolds: 400,
    flowRate: 0.029,
    inletTemp: 25.0,
    concentration: 5.0, // 5% Al2O3
    nanofluidType: "5.0 vol% Al₂O₃/Water",
    heatTransferCoeff: 2790.6,
    pressureDrop: 698.2,
    pumpingPower: 0.020,
    nusseltNumber: 4.70,
    maxTemp: 31.5,
    minTemp: 25.4,
    deltaT: 6.1,
    hotspotCell: "C5",
    tempDistribution: [25.5, 26.0, 27.3, 29.0, 31.2, 31.5, 31.0, 29.4, 27.2, 25.6],
    thermalResistance: 0.032
  },

  // Reynolds 500
  {
    id: "CFD-500-00",
    reynolds: 500,
    flowRate: 0.030,
    inletTemp: 25.0,
    concentration: 0.0,
    nanofluidType: "Pure Water",
    heatTransferCoeff: 2180.4,
    pressureDrop: 545.0,
    pumpingPower: 0.016,
    nusseltNumber: 3.68,
    maxTemp: 35.6,
    minTemp: 25.8,
    deltaT: 9.8,
    hotspotCell: "C6",
    tempDistribution: [25.9, 26.9, 28.8, 31.5, 34.3, 35.6, 35.0, 32.1, 29.0, 26.3],
    thermalResistance: 0.041
  },
  {
    id: "CFD-500-01",
    reynolds: 500,
    flowRate: 0.031,
    inletTemp: 25.0,
    concentration: 1.0,
    nanofluidType: "1.0 vol% Al₂O₃/Water",
    heatTransferCoeff: 2490.8,
    pressureDrop: 610.2,
    pumpingPower: 0.019,
    nusseltNumber: 4.20,
    maxTemp: 33.1,
    minTemp: 25.6,
    deltaT: 7.5,
    hotspotCell: "C6",
    tempDistribution: [25.7, 26.4, 27.9, 30.0, 32.3, 33.1, 32.6, 30.4, 28.1, 25.9],
    thermalResistance: 0.036
  },
  {
    id: "CFD-500-03",
    reynolds: 500,
    flowRate: 0.034,
    inletTemp: 25.0,
    concentration: 3.0,
    nanofluidType: "3.0 vol% Al₂O₃/Water",
    heatTransferCoeff: 2920.5,
    pressureDrop: 738.0,
    pumpingPower: 0.025,
    nusseltNumber: 4.93,
    maxTemp: 30.8,
    minTemp: 25.4,
    deltaT: 5.4,
    hotspotCell: "C5",
    tempDistribution: [25.5, 25.9, 27.0, 28.7, 30.5, 30.8, 30.3, 28.9, 27.1, 25.6],
    thermalResistance: 0.030
  },
  {
    id: "CFD-500-05",
    reynolds: 500,
    flowRate: 0.036,
    inletTemp: 25.0,
    concentration: 5.0,
    nanofluidType: "5.0 vol% Al₂O₃/Water",
    heatTransferCoeff: 3290.0,
    pressureDrop: 912.4,
    pumpingPower: 0.033,
    nusseltNumber: 5.55,
    maxTemp: 29.2,
    minTemp: 25.3,
    deltaT: 3.9,
    hotspotCell: "C5",
    tempDistribution: [25.3, 25.6, 26.4, 27.7, 29.0, 29.2, 28.8, 27.9, 26.5, 25.4],
    thermalResistance: 0.027
  },

  // Reynolds 600
  {
    id: "CFD-600-00",
    reynolds: 600,
    flowRate: 0.036,
    inletTemp: 25.0,
    concentration: 0.0,
    nanofluidType: "Pure Water",
    heatTransferCoeff: 2510.3,
    pressureDrop: 685.0,
    pumpingPower: 0.025,
    nusseltNumber: 4.24,
    maxTemp: 33.4,
    minTemp: 25.6,
    deltaT: 7.8,
    hotspotCell: "C6",
    tempDistribution: [25.7, 26.4, 27.9, 30.1, 32.5, 33.4, 32.8, 30.6, 28.2, 25.9],
    thermalResistance: 0.035
  },
  {
    id: "CFD-600-01",
    reynolds: 600,
    flowRate: 0.037,
    inletTemp: 25.0,
    concentration: 1.0,
    nanofluidType: "1.0 vol% Al₂O₃/Water",
    heatTransferCoeff: 2860.0,
    pressureDrop: 765.0,
    pumpingPower: 0.028,
    nusseltNumber: 4.83,
    maxTemp: 31.2,
    minTemp: 25.4,
    deltaT: 5.8,
    hotspotCell: "C6",
    tempDistribution: [25.5, 26.0, 27.2, 28.9, 30.7, 31.2, 30.8, 29.2, 27.4, 25.6],
    thermalResistance: 0.031
  },
  {
    id: "CFD-600-03",
    reynolds: 600,
    flowRate: 0.040,
    inletTemp: 25.0,
    concentration: 3.0,
    nanofluidType: "3.0 vol% Al₂O₃/Water",
    heatTransferCoeff: 3350.2,
    pressureDrop: 928.0,
    pumpingPower: 0.037,
    nusseltNumber: 5.65,
    maxTemp: 29.1,
    minTemp: 25.3,
    deltaT: 3.8,
    hotspotCell: "C5",
    tempDistribution: [25.3, 25.6, 26.4, 27.7, 28.9, 29.1, 28.7, 27.8, 26.5, 25.4],
    thermalResistance: 0.026
  },
  {
    id: "CFD-600-05",
    reynolds: 600,
    flowRate: 0.043,
    inletTemp: 25.0,
    concentration: 5.0,
    nanofluidType: "5.0 vol% Al₂O₃/Water",
    heatTransferCoeff: 3770.8,
    pressureDrop: 1148.0,
    pumpingPower: 0.049,
    nusseltNumber: 6.36,
    maxTemp: 27.8,
    minTemp: 25.2,
    deltaT: 2.6,
    hotspotCell: "C5",
    tempDistribution: [25.2, 25.4, 25.9, 26.8, 27.6, 27.8, 27.5, 26.9, 26.0, 25.3],
    thermalResistance: 0.023
  },

  // Reynolds 700
  {
    id: "CFD-700-00",
    reynolds: 700,
    flowRate: 0.042,
    inletTemp: 25.0,
    concentration: 0.0,
    nanofluidType: "Pure Water",
    heatTransferCoeff: 2820.0,
    pressureDrop: 835.0,
    pumpingPower: 0.035,
    nusseltNumber: 4.76,
    maxTemp: 31.6,
    minTemp: 25.4,
    deltaT: 6.2,
    hotspotCell: "C6",
    tempDistribution: [25.5, 26.1, 27.3, 29.1, 31.0, 31.6, 31.1, 29.5, 27.6, 25.7],
    thermalResistance: 0.031
  },
  {
    id: "CFD-700-01",
    reynolds: 700,
    flowRate: 0.044,
    inletTemp: 25.0,
    concentration: 1.0,
    nanofluidType: "1.0 vol% Al₂O₃/Water",
    heatTransferCoeff: 3210.5,
    pressureDrop: 935.0,
    pumpingPower: 0.041,
    nusseltNumber: 5.42,
    maxTemp: 29.7,
    minTemp: 25.3,
    deltaT: 4.4,
    hotspotCell: "C6",
    tempDistribution: [25.3, 25.7, 26.6, 28.0, 29.4, 29.7, 29.3, 28.2, 26.9, 25.5],
    thermalResistance: 0.027
  },
  {
    id: "CFD-700-03",
    reynolds: 700,
    flowRate: 0.047,
    inletTemp: 25.0,
    concentration: 3.0,
    nanofluidType: "3.0 vol% Al₂O₃/Water",
    heatTransferCoeff: 3760.0,
    pressureDrop: 1130.0,
    pumpingPower: 0.053,
    nusseltNumber: 6.35,
    maxTemp: 27.9,
    minTemp: 25.2,
    deltaT: 2.7,
    hotspotCell: "C5",
    tempDistribution: [25.2, 25.4, 26.0, 27.0, 27.8, 27.9, 27.6, 26.9, 26.1, 25.3],
    thermalResistance: 0.023
  },
  {
    id: "CFD-700-05",
    reynolds: 700,
    flowRate: 0.050,
    inletTemp: 25.0,
    concentration: 5.0,
    nanofluidType: "5.0 vol% Al₂O₃/Water",
    heatTransferCoeff: 4230.0,
    pressureDrop: 1410.0,
    pumpingPower: 0.071,
    nusseltNumber: 7.14,
    maxTemp: 26.8,
    minTemp: 25.1,
    deltaT: 1.7,
    hotspotCell: "C5",
    tempDistribution: [25.1, 25.3, 25.6, 26.2, 26.7, 26.8, 26.6, 26.1, 25.5, 25.2],
    thermalResistance: 0.020
  }
];

// Validation checkpoints historical log for Page 5 (Predicted vs Actual CFD)
const validationCheckpoints = [
  { checkpoint: "v0.8-baseline", date: "2026-06-15", r2: 0.942, mae: 0.74, rmse: 0.96, samplesCount: 150 },
  { checkpoint: "v0.9-nanofluid-update", date: "2026-07-05", r2: 0.968, mae: 0.52, rmse: 0.68, samplesCount: 320 },
  { checkpoint: "v1.0-cfd-calibrated", date: "2026-08-10", r2: 0.989, mae: 0.28, rmse: 0.39, samplesCount: 650 }
];

module.exports = {
  cfdDataset,
  validationCheckpoints
};

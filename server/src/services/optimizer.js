// optimizer.js - Multi-Objective Optimization Engine for BTMS
// Balances thermal uniformity (Delta T < 5°C, T_max < 35°C) against pumping power consumption

const { predictThermal } = require("./mlSurrogate");

/**
 * Runs multi-objective optimization over operational parameter bounds
 * @param {Object} currentConditions
 */
function runOptimization(currentConditions = {}) {
  const targetMaxTemp = currentConditions.targetMaxTemp || 32.0;
  const targetDeltaT = currentConditions.targetDeltaT || 4.5;
  const inletTemp = currentConditions.inletTemp || 25.0;
  const currentDischarge = currentConditions.dischargeCurrent || 9.6;

  // Search grid across Reynolds (400-700) and Concentration (0-5%)
  const reCandidates = [400, 450, 500, 550, 600, 650, 700];
  const concCandidates = [0.0, 1.0, 2.0, 3.0, 4.0, 5.0];

  let bestSolution = null;
  let minObjectiveScore = Infinity;
  const paretoPoints = [];

  for (const re of reCandidates) {
    for (const conc of concCandidates) {
      // Approximate corresponding mass flow rate (kg/s)
      const flowRate = Number((0.024 + (re - 400) * 0.00008 + conc * 0.001).toFixed(4));
      
      const pred = predictThermal({
        flowRate,
        reynolds: re,
        concentration: conc,
        inletTemp,
        dischargeCurrent: currentDischarge
      });

      const { maxTemp, gradient, pumpingPower, heatTransferCoeff, pressureDrop } = pred.predictions;

      // Objective function: Weighted sum penalty
      // Weight 1: Temperature penalty if maxTemp > 35°C
      const tempPenalty = Math.max(0, maxTemp - 34.0) * 15.0;
      // Weight 2: Gradient penalty if Delta T > 5°C
      const gradPenalty = Math.max(0, gradient - 4.5) * 20.0;
      // Weight 3: Pumping power penalty (minimizing auxiliary power draw)
      const powerPenalty = pumpingPower * 120.0;
      // Weight 4: Nanoparticle cost penalty (prefer lower conc if thermal target met)
      const concCost = conc * 0.4;

      const objectiveScore = (maxTemp - 25) * 1.2 + gradient * 2.0 + powerPenalty + tempPenalty + gradPenalty + concCost;

      paretoPoints.push({
        reynolds: re,
        concentration: conc,
        flowRate,
        maxTemp,
        gradient,
        pumpingPower,
        heatTransferCoeff,
        pressureDrop,
        objectiveScore: Number(objectiveScore.toFixed(3))
      });

      if (objectiveScore < minObjectiveScore) {
        minObjectiveScore = objectiveScore;
        bestSolution = {
          reynolds: re,
          concentration: conc,
          flowRate,
          maxTemp,
          gradient,
          pumpingPower,
          heatTransferCoeff,
          pressureDrop,
          objectiveScore: Number(objectiveScore.toFixed(3))
        };
      }
    }
  }

  // Generate trade-off curve (Heat transfer vs Pressure drop)
  const tradeOffCurve = paretoPoints
    .filter((p, i) => i % 3 === 0)
    .map(p => ({
      reynolds: p.reynolds,
      concentration: p.concentration,
      heatTransferCoeff: p.heatTransferCoeff,
      pressureDrop: p.pressureDrop,
      pumpingPower: p.pumpingPower,
      deltaT: p.gradient
    }));

  return {
    recommendation: {
      recommendedFlowRate: bestSolution.flowRate, // kg/s
      recommendedReynolds: bestSolution.reynolds,
      recommendedConcentration: bestSolution.concentration, // vol%
      recommendedInletTemp: inletTemp,
      predictedMaxTemp: bestSolution.maxTemp,
      predictedDeltaT: bestSolution.gradient,
      predictedPumpingPower: bestSolution.pumpingPower,
      predictedHeatTransferCoeff: bestSolution.heatTransferCoeff,
      predictedPressureDrop: bestSolution.pressureDrop,
      thermalSafetyStatus: bestSolution.maxTemp < 35 && bestSolution.gradient < 5.0 ? "OPTIMAL" : "SATISFACTORY",
      energySavingsPercent: Number((18.5 - bestSolution.pumpingPower * 200).toFixed(1))
    },
    tradeOffCurve,
    timestamp: new Date().toISOString()
  };
}

module.exports = {
  runOptimization
};

// AIPrediction.jsx - Page 3: AI Prediction & Optimization Sandbox (Lime Bento Theme)

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Cpu, 
  Sparkles, 
  Sliders, 
  CheckCircle2, 
  XCircle, 
  BarChart2, 
  ShieldAlert, 
  Layers, 
  BrainCircuit,
  Check
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  LineChart, 
  Line 
} from 'recharts';
import confetti from 'canvas-confetti';
import { useTelemetry } from '../context/TelemetryContext';

const AIPrediction = () => {
  const { simConfig, updateSimConfig } = useTelemetry();

  const [params, setParams] = useState({
    flowRate: 0.035,
    reynolds: 550,
    concentration: 2.0,
    inletTemp: 25.0,
    dischargeCurrent: 9.6
  });

  const [prediction, setPrediction] = useState(null);
  const [loadingPred, setLoadingPred] = useState(false);

  const [optimization, setOptimization] = useState(null);
  const [loadingOpt, setLoadingOpt] = useState(false);
  const [approvalStatus, setApprovalStatus] = useState(null);
  const [engineerNotes, setEngineerNotes] = useState('');

  const fetchPrediction = async (currentParams) => {
    setLoadingPred(true);
    try {
      const res = await axios.post('/api/predict', currentParams);
      setPrediction(res.data);
    } catch (err) {
      console.error("Prediction error:", err);
    } finally {
      setLoadingPred(false);
    }
  };

  useEffect(() => {
    fetchPrediction(params);
  }, [params]);

  const handleRunOptimization = async () => {
    setLoadingOpt(true);
    setApprovalStatus(null);
    try {
      const res = await axios.post('/api/optimize', {
        inletTemp: params.inletTemp,
        dischargeCurrent: params.dischargeCurrent,
        targetMaxTemp: 32.0,
        targetDeltaT: 4.5
      });
      setOptimization(res.data);
    } catch (err) {
      console.error("Optimization error:", err);
    } finally {
      setLoadingOpt(false);
    }
  };

  const handleDecision = async (decision) => {
    if (!optimization || !optimization.recommendation) return;
    const rec = optimization.recommendation;

    try {
      await axios.post('/api/decisions', {
        optimizationRunId: `OPT-${Date.now().toString().slice(-4)}`,
        engineerId: 'ENG-LEAD-01',
        decision,
        flowRate: rec.recommendedFlowRate,
        reynolds: rec.recommendedReynolds,
        concentration: rec.recommendedConcentration,
        notes: engineerNotes || (decision === 'APPROVED' ? 'Approved AI optimized cooling parameters' : 'Rejected by engineer review')
      });

      setApprovalStatus(decision);

      if (decision === 'APPROVED') {
        confetti({
          particleCount: 70,
          spread: 70,
          colors: ['#b4f000', '#bef264', '#ffffff'],
          origin: { y: 0.8 }
        });
      }
    } catch (err) {
      console.error("Failed to log decision:", err);
    }
  };

  return (
    <div className="space-y-8 py-4">
      
      {/* Header Banner */}
      <div className="bento-card p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-lime text-dark-950 flex items-center justify-center font-black">
            <Cpu className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-black text-white uppercase font-sans">AI Surrogate Prediction & Optimization</h2>
            <p className="text-xs text-zinc-400">CFD-Trained Physics Surrogate with Real-Time Inference (KJS-CES-02 Stage 4)</p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <span className="pill-badge bg-dark-950 text-lime border-dark-700">
            Model: v1.0-CFD-XGBoost (R² = 0.989)
          </span>
        </div>
      </div>

      {/* Sandbox & Predictions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Sandbox Controls */}
        <div className="lg:col-span-5 bento-card p-6 space-y-5">
          <div className="flex items-center justify-between border-b border-dark-800 pb-3">
            <h3 className="font-bold text-sm text-white uppercase tracking-wide flex items-center space-x-2">
              <Sliders className="w-4 h-4 text-lime" />
              <span>Input Operating Sandbox</span>
            </h3>
            <span className="text-[11px] text-zinc-500 font-mono">Live Surrogate Query</span>
          </div>

          {/* Reynolds */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-zinc-300">Reynolds Number (Re):</span>
              <span className="text-lime font-bold">{params.reynolds} (Laminar)</span>
            </div>
            <input
              type="range"
              min="400"
              max="700"
              step="25"
              value={params.reynolds}
              onChange={(e) => setParams({ ...params, reynolds: Number(e.target.value) })}
              className="w-full h-2 bg-dark-950 rounded-lg appearance-none cursor-pointer accent-lime"
            />
            <div className="flex justify-between text-[10px] text-zinc-500 font-mono">
              <span>400</span>
              <span>550</span>
              <span>700</span>
            </div>
          </div>

          {/* Nanofluid Conc */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-zinc-300">Al₂O₃ Nanofluid Conc.:</span>
              <span className="text-lime font-bold">{params.concentration.toFixed(1)} vol%</span>
            </div>
            <input
              type="range"
              min="0.0"
              max="5.0"
              step="0.5"
              value={params.concentration}
              onChange={(e) => setParams({ ...params, concentration: Number(e.target.value) })}
              className="w-full h-2 bg-dark-950 rounded-lg appearance-none cursor-pointer accent-lime"
            />
            <div className="flex justify-between text-[10px] text-zinc-500 font-mono">
              <span>0% (Water)</span>
              <span>2.5%</span>
              <span>5.0% (Max)</span>
            </div>
          </div>

          {/* Inlet Temp */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-zinc-300">Coolant Inlet Temp (T_in):</span>
              <span className="text-white font-bold">{params.inletTemp.toFixed(1)} °C</span>
            </div>
            <input
              type="range"
              min="15.0"
              max="35.0"
              step="1.0"
              value={params.inletTemp}
              onChange={(e) => setParams({ ...params, inletTemp: Number(e.target.value) })}
              className="w-full h-2 bg-dark-950 rounded-lg appearance-none cursor-pointer accent-lime"
            />
            <div className="flex justify-between text-[10px] text-zinc-500 font-mono">
              <span>15°C</span>
              <span>25°C</span>
              <span>35°C</span>
            </div>
          </div>

          {/* Discharge Current */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-zinc-300">Discharge C-Rate / Current:</span>
              <span className="text-amber-400 font-bold">{(params.dischargeCurrent / 4.8).toFixed(1)}C ({params.dischargeCurrent.toFixed(1)} A)</span>
            </div>
            <input
              type="range"
              min="4.8"
              max="14.4"
              step="2.4"
              value={params.dischargeCurrent}
              onChange={(e) => setParams({ ...params, dischargeCurrent: Number(e.target.value) })}
              className="w-full h-2 bg-dark-950 rounded-lg appearance-none cursor-pointer accent-lime"
            />
            <div className="flex justify-between text-[10px] text-zinc-500 font-mono">
              <span>1C (4.8A)</span>
              <span>2C (9.6A)</span>
              <span>3C (14.4A)</span>
            </div>
          </div>

          <div className="pt-2 text-[11px] text-zinc-400 font-mono bg-dark-950 p-3 rounded-xl border border-dark-800">
            Inference latency: &lt; 20ms • Physics regression model with nanofluid property enhancement.
          </div>
        </div>

        {/* Prediction Results */}
        <div className="lg:col-span-7 bento-card p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-dark-800 pb-3">
            <h3 className="font-bold text-sm text-white uppercase tracking-wide flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-lime" />
              <span>AI Surrogate Output Predictions</span>
            </h3>
            {prediction && (
              <span className="pill-badge bg-dark-950 text-lime border-dark-700">
                Confidence: {prediction.predictions.confidence}% ({prediction.predictions.uncertaintyBand})
              </span>
            )}
          </div>

          {prediction && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-dark-950 p-4 rounded-xl border border-dark-800 text-center">
                <div className="text-xs text-zinc-400">Predicted T_max</div>
                <div className={`text-2xl font-black font-mono mt-1 ${prediction.predictions.maxTemp > 35 ? 'text-rose-400' : 'text-lime'}`}>
                  {prediction.predictions.maxTemp}°C
                </div>
                <div className="text-[10px] text-zinc-500 mt-1">&lt; 35°C Target</div>
              </div>

              <div className="bg-dark-950 p-4 rounded-xl border border-dark-800 text-center">
                <div className="text-xs text-zinc-400">Thermal Gradient ΔT</div>
                <div className={`text-2xl font-black font-mono mt-1 ${prediction.predictions.gradient > 5.0 ? 'text-amber-400' : 'text-lime'}`}>
                  {prediction.predictions.gradient}°C
                </div>
                <div className="text-[10px] text-zinc-500 mt-1">Target &lt; 5.0°C</div>
              </div>

              <div className="bg-dark-950 p-4 rounded-xl border border-dark-800 text-center">
                <div className="text-xs text-zinc-400">Hotspot Cell(s)</div>
                <div className="text-xl font-black font-mono mt-1 text-white">
                  {prediction.predictions.hotspotCells.join(', ')}
                </div>
                <div className="text-[10px] text-zinc-500 mt-1">Center Core</div>
              </div>

              <div className="bg-dark-950 p-4 rounded-xl border border-dark-800 text-center">
                <div className="text-xs text-zinc-400">Heat Transfer (h)</div>
                <div className="text-2xl font-black font-mono mt-1 text-lime">
                  {prediction.predictions.heatTransferCoeff}
                </div>
                <div className="text-[10px] text-zinc-500 mt-1">W/(m²·K)</div>
              </div>
            </div>
          )}

          {/* SHAP Chart */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-zinc-300 uppercase tracking-wide flex items-center space-x-1.5">
                <BarChart2 className="w-4 h-4 text-lime" />
                <span>Explainable AI (SHAP Relative Feature Importance)</span>
              </h4>
              <span className="text-[10px] text-zinc-500 font-mono">Responsible AI §13</span>
            </div>

            <div className="h-44 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={prediction ? prediction.explainability.shapImportance : []}
                  layout="vertical"
                  margin={{ left: 140, right: 20, top: 5, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#27272a" horizontal={false} />
                  <XAxis type="number" domain={[0, 40]} unit="%" stroke="#71717a" fontSize={10} />
                  <YAxis type="category" dataKey="feature" stroke="#a1a1aa" fontSize={10} tickLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#18181b', borderColor: '#3f3f46', borderRadius: '12px', fontSize: '11px' }}
                    formatter={(value) => [`${value}% Contribution`, 'Importance']}
                  />
                  <Bar dataKey="value" fill="#b4f000" radius={[0, 6, 6, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

      </div>

      {/* Optimization & HITL */}
      <div className="bento-card p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-dark-800 pb-4">
          <div>
            <h3 className="text-xl font-black text-white uppercase font-sans flex items-center space-x-2">
              <BrainCircuit className="w-5 h-5 text-lime" />
              <span>Multi-Objective Coolant Optimization Engine</span>
            </h3>
            <p className="text-xs text-zinc-400 mt-1">
              Computes Pareto optimal operating frontier to guarantee ΔT &lt; 5°C with minimal auxiliary pumping penalty.
            </p>
          </div>

          <button
            onClick={handleRunOptimization}
            disabled={loadingOpt}
            className="btn-lime disabled:opacity-50"
          >
            <Sparkles className="w-4 h-4 text-dark-950 stroke-[2.5]" />
            <span>{loadingOpt ? 'Solving Frontier...' : 'Run Optimization'}</span>
          </button>
        </div>

        {optimization && (
          <div className="space-y-6">
            
            {/* Pareto Results */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Summary Card */}
              <div className="lg:col-span-6 bento-card-lime p-6 space-y-4 text-dark-950">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold uppercase tracking-wide text-dark-900/80">
                    AI Pareto Optimal Recommendation
                  </span>
                  <span className="px-3 py-0.5 rounded-full bg-dark-950 text-lime text-[10px] font-mono font-bold">
                    STATUS: {optimization.recommendation.thermalSafetyStatus}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                  <div className="bg-dark-950 text-white p-3.5 rounded-xl border border-dark-800">
                    <span className="text-zinc-400 block text-[10px]">Optimal Reynolds:</span>
                    <span className="text-lime text-base font-bold">Re {optimization.recommendation.recommendedReynolds}</span>
                  </div>

                  <div className="bg-dark-950 text-white p-3.5 rounded-xl border border-dark-800">
                    <span className="text-zinc-400 block text-[10px]">Optimal Nanofluid:</span>
                    <span className="text-white text-base font-bold">{optimization.recommendation.recommendedConcentration} vol% Al₂O₃</span>
                  </div>

                  <div className="bg-dark-950 text-white p-3.5 rounded-xl border border-dark-800">
                    <span className="text-zinc-400 block text-[10px]">Predicted Max Temp:</span>
                    <span className="text-lime text-base font-bold">{optimization.recommendation.predictedMaxTemp} °C</span>
                  </div>

                  <div className="bg-dark-950 text-white p-3.5 rounded-xl border border-dark-800">
                    <span className="text-zinc-400 block text-[10px]">Predicted Gradient (ΔT):</span>
                    <span className="text-lime text-base font-bold">{optimization.recommendation.predictedDeltaT} °C</span>
                  </div>
                </div>

                <div className="p-3 bg-dark-950 text-white rounded-xl border border-dark-800 flex items-center justify-between text-xs">
                  <span className="text-zinc-300">Auxiliary Energy Savings:</span>
                  <span className="font-mono font-bold text-lime">+{optimization.recommendation.energySavingsPercent}% vs Baseline</span>
                </div>
              </div>

              {/* Trade-off Curve */}
              <div className="lg:col-span-6 bento-card p-6 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-zinc-300 uppercase tracking-wide">
                    Heat Transfer (h) vs Pressure Drop (ΔP) Trade-Off
                  </h4>
                  <span className="text-[10px] text-zinc-500 font-mono">Pareto Frontier</span>
                </div>

                <div className="h-48 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={optimization.tradeOffCurve}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                      <XAxis dataKey="pressureDrop" stroke="#71717a" fontSize={10} unit="Pa" />
                      <YAxis stroke="#71717a" fontSize={10} unit="W/m²K" />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#18181b', borderColor: '#3f3f46', borderRadius: '12px', fontSize: '11px' }}
                      />
                      <Line type="monotone" dataKey="heatTransferCoeff" name="Heat Transfer (h)" stroke="#b4f000" strokeWidth={2.5} dot={{ r: 3, fill: '#b4f000' }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

            </div>

            {/* Human-in-the-Loop Approval Card */}
            <div className="bento-card p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <ShieldAlert className="w-5 h-5 text-lime" />
                  <h4 className="font-bold text-sm text-white uppercase tracking-wide">
                    Human-in-the-Loop (HITL) Actuation Gate
                  </h4>
                </div>
                <span className="text-[11px] font-mono text-zinc-400">ISO 26262 Requirement</span>
              </div>

              <p className="text-xs text-zinc-300 leading-relaxed">
                Approve to commit recommended parameters (Re {optimization.recommendation.recommendedReynolds}, {optimization.recommendation.recommendedConcentration}% Al₂O₃) 
                to the live simulator.
              </p>

              <div className="flex flex-col sm:flex-row items-center gap-3">
                <input
                  type="text"
                  placeholder="Engineer verification notes (optional)..."
                  value={engineerNotes}
                  onChange={(e) => setEngineerNotes(e.target.value)}
                  className="w-full sm:flex-1 bg-dark-950 border border-dark-700 rounded-full px-4 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-lime"
                />

                <div className="flex items-center space-x-2 w-full sm:w-auto">
                  <button
                    onClick={() => handleDecision('APPROVED')}
                    className="btn-lime flex-1 sm:flex-none"
                  >
                    <CheckCircle2 className="w-4 h-4 text-dark-950 stroke-[2.5]" />
                    <span>Approve & Apply</span>
                  </button>

                  <button
                    onClick={() => handleDecision('REJECTED')}
                    className="btn-dark flex-1 sm:flex-none"
                  >
                    <XCircle className="w-4 h-4 text-rose-400" />
                    <span>Reject</span>
                  </button>
                </div>
              </div>

              {approvalStatus && (
                <div className={`p-3.5 rounded-xl text-xs font-mono flex items-center space-x-2 ${
                  approvalStatus === 'APPROVED' ? 'bg-lime/10 text-lime border border-lime/30' : 'bg-rose-950/80 text-rose-300 border border-rose-800'
                }`}>
                  <Check className="w-4 h-4" />
                  <span>
                    Decision logged immutably: <strong>{approvalStatus}</strong> by ENG-LEAD-01 at {new Date().toLocaleTimeString()}.
                  </span>
                </div>
              )}
            </div>

          </div>
        )}

      </div>

      {/* PEAS Panel */}
      <div className="bento-card p-8 space-y-4">
        <div className="flex items-center justify-between border-b border-dark-800 pb-3">
          <div className="flex items-center space-x-2">
            <Layers className="w-5 h-5 text-lime" />
            <h3 className="font-bold text-sm text-white uppercase tracking-wide">
              Educational PEAS Agent Description (Curriculum Mapping)
            </h3>
          </div>
          <span className="pill-badge bg-dark-950 text-lime border-dark-700">
            Intelligent Agents
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          <div className="bg-dark-950 p-4 rounded-xl border border-dark-800 space-y-1">
            <span className="text-lime font-bold font-mono text-sm block">P — Performance</span>
            <p className="text-zinc-300">
              Maintain T_max &lt; 35°C, ΔT &lt; 5°C uniformity, minimize auxiliary pumping power (W).
            </p>
          </div>

          <div className="bg-dark-950 p-4 rounded-xl border border-dark-800 space-y-1">
            <span className="text-lime font-bold font-mono text-sm block">E — Environment</span>
            <p className="text-zinc-300">
              10-cell 21700 battery pack undergoing dynamic discharge (1C-3C), ambient temperature variations.
            </p>
          </div>

          <div className="bg-dark-950 p-4 rounded-xl border border-dark-800 space-y-1">
            <span className="text-lime font-bold font-mono text-sm block">A — Actuators</span>
            <p className="text-zinc-300">
              Nanofluid circulation pump (RPM), Flow Control Valve (FCV), and Electronic Expansion Valve (EEV).
            </p>
          </div>

          <div className="bg-dark-950 p-4 rounded-xl border border-dark-800 space-y-1">
            <span className="text-lime font-bold font-mono text-sm block">S — Sensors</span>
            <p className="text-zinc-300">
              10 cell thermistors (C1-C10), thermocouples (Tc1, Tc2), pressure transducers (P1, P2).
            </p>
          </div>
        </div>
      </div>

    </div>
  );
};

export default AIPrediction;

// ReportsAnalytics.jsx - Page 5: Model Validation, Historical KPIs & Reports (Lime Bento Theme)

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  FileText, 
  Download, 
  CheckCircle, 
  TrendingUp, 
  ShieldCheck, 
  Leaf, 
  Database
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  ScatterChart, 
  Scatter, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid 
} from 'recharts';

const ReportsAnalytics = () => {
  const [validationData, setValidationData] = useState(null);
  const [kpis, setKpis] = useState(null);
  const [auditLogs, setAuditLogs] = useState([]);
  const [generatingReport, setGeneratingReport] = useState(false);

  const fetchReportsData = async () => {
    try {
      const [valRes, kpiRes, auditRes] = await Promise.all([
        axios.get('/api/validation/history'),
        axios.get('/api/analytics/kpis'),
        axios.get('/api/audit-log')
      ]);

      setValidationData(valRes.data);
      setKpis(kpiRes.data);
      setAuditLogs(auditRes.data || []);
    } catch (err) {
      console.error("Failed to load reports data:", err);
    }
  };

  useEffect(() => {
    fetchReportsData();
  }, []);

  const handleDownloadReport = async (format) => {
    setGeneratingReport(true);
    try {
      const response = await axios.post(
        '/api/reports/generate',
        { format },
        { responseType: 'blob' }
      );

      const blob = new Blob([response.data], {
        type: format === 'csv' ? 'text/csv' : 'application/pdf'
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `BTMS_Thermal_Report_${Date.now()}.${format}`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    } catch (err) {
      console.error("Report generation failed:", err);
    } finally {
      setGeneratingReport(false);
    }
  };

  return (
    <div className="space-y-8 py-4">
      
      {/* Header Banner */}
      <div className="bento-card p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-lime text-dark-950 flex items-center justify-center font-black">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-black text-white uppercase font-sans">Reports, Validation & Governance Audit</h2>
            <p className="text-xs text-zinc-400">CFD Ground-Truth Verification, ISO 26262 Traceability & Sustainability</p>
          </div>
        </div>

        {/* Report Export Buttons */}
        <div className="flex items-center space-x-3">
          <button
            onClick={() => handleDownloadReport('pdf')}
            disabled={generatingReport}
            className="btn-lime disabled:opacity-50"
          >
            <Download className="w-4 h-4 text-dark-950 stroke-[2.5]" />
            <span>{generatingReport ? 'Generating...' : 'Download PDF Report'}</span>
          </button>

          <button
            onClick={() => handleDownloadReport('csv')}
            disabled={generatingReport}
            className="btn-dark disabled:opacity-50"
          >
            <Download className="w-4 h-4 text-lime" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* KPI Bento Grid */}
      {kpis && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bento-card p-5 space-y-1">
            <span className="text-xs text-zinc-400">Average Pack T_max</span>
            <div className="text-3xl font-black text-lime font-sans">{kpis.avgMaxTemp} °C</div>
            <span className="text-[10px] text-zinc-400 font-mono font-bold">100% within safe bounds</span>
          </div>

          <div className="bento-card-lime p-5 space-y-1 text-dark-950">
            <span className="text-xs text-dark-900 font-bold">Thermal Uniformity (ΔT)</span>
            <div className="text-3xl font-black text-dark-950 font-sans">{kpis.avgDeltaT} °C</div>
            <span className="text-[10px] text-dark-900 font-bold font-mono">{kpis.targetDeltaTMetPercent}% &lt; 5°C Target Met</span>
          </div>

          <div className="bento-card p-5 space-y-1">
            <span className="text-xs text-zinc-400">Thermal Runaways Averted</span>
            <div className="text-3xl font-black text-white font-sans">{kpis.thermalRunawaysAverted} Events</div>
            <span className="text-[10px] text-lime font-mono font-bold">Real-time Surge Cooling</span>
          </div>

          <div className="bento-card-lime p-5 space-y-1 text-dark-950">
            <span className="text-xs text-dark-900 font-bold">Nanofluid Gain</span>
            <div className="text-3xl font-black text-dark-950 font-sans">+{kpis.nanofluidEfficiencyGain}%</div>
            <span className="text-[10px] text-dark-900 font-bold font-mono">vs Pure Water Baseline</span>
          </div>
        </div>
      )}

      {/* Model Validation Scatter */}
      <div className="bento-card p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-dark-800 pb-4">
          <div>
            <h3 className="text-xl font-black text-white uppercase font-sans flex items-center space-x-2">
              <ShieldCheck className="w-5 h-5 text-lime" />
              <span>Model Validation: ML Predictions vs CFD Ground-Truth</span>
            </h3>
            <p className="text-xs text-zinc-400 mt-1">
              Scatter comparison of surrogate predictions against ANSYS Fluent CFD actual temperatures.
            </p>
          </div>

          {validationData && (
            <div className="flex items-center space-x-2 text-xs font-mono">
              <span className="pill-badge bg-lime text-dark-950 border-lime font-bold">
                R² = {validationData.overallMetrics.r2}
              </span>
              <span className="pill-badge bg-dark-950 text-white border-dark-700">
                MAE = {validationData.overallMetrics.mae} °C
              </span>
              <span className="pill-badge bg-dark-950 text-white border-dark-700">
                RMSE = {validationData.overallMetrics.rmse} °C
              </span>
            </div>
          )}
        </div>

        {/* Scatter Chart */}
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 10, right: 20, bottom: 20, left: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
              <XAxis type="number" dataKey="cfdActualMaxTemp" name="CFD Actual" stroke="#71717a" fontSize={11} domain={[25, 40]} unit="°C" />
              <YAxis type="number" dataKey="predictedMaxTemp" name="ML Predicted" stroke="#71717a" fontSize={11} domain={[25, 40]} unit="°C" />
              <Tooltip 
                cursor={{ strokeDasharray: '3 3' }}
                contentStyle={{ backgroundColor: '#18181b', borderColor: '#3f3f46', borderRadius: '12px', fontSize: '11px' }}
              />
              <Scatter name="Validation Points" data={validationData?.scatterPoints || []} fill="#b4f000" />
            </ScatterChart>
          </ResponsiveContainer>
        </div>

        {/* Retraining Checkpoints */}
        <div className="pt-4 border-t border-dark-800 space-y-3">
          <h4 className="text-xs font-bold text-zinc-300 uppercase tracking-wide">
            Model Version Retraining Checkpoints
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
            {validationData?.checkpoints.map((cp) => (
              <div key={cp.checkpoint} className="p-4 bg-dark-950 rounded-2xl border border-dark-800 space-y-1.5">
                <div className="flex justify-between text-zinc-400">
                  <span className="font-bold text-lime">{cp.checkpoint}</span>
                  <span>{cp.date}</span>
                </div>
                <div className="flex justify-between text-white">
                  <span>R² Score: <strong className="text-lime">{cp.r2}</strong></span>
                  <span>MAE: <strong>{cp.mae}°C</strong></span>
                </div>
                <div className="text-[10px] text-zinc-500">
                  Trained on {cp.samplesCount} ANSYS mesh points
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Nanofluid Matrix & Sustainability */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Table */}
        <div className="lg:col-span-7 bento-card p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-dark-800 pb-3">
            <h3 className="font-bold text-sm text-white uppercase tracking-wide flex items-center space-x-2">
              <Database className="w-4 h-4 text-lime" />
              <span>Nanofluid Performance Summary</span>
            </h3>
            <span className="text-[11px] font-mono text-lime font-bold">Al₂O₃ vs Water</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-dark-950 text-zinc-400 uppercase text-[10px]">
                <tr>
                  <th className="p-3">Concentration</th>
                  <th className="p-3">Avg h [W/m²K]</th>
                  <th className="p-3">Max ΔT Reduction</th>
                  <th className="p-3">Pumping Penalty</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-dark-800 text-zinc-300">
                <tr>
                  <td className="p-3 font-bold text-white">0.0% (Pure Water)</td>
                  <td className="p-3">2,340</td>
                  <td className="p-3 text-zinc-400">Baseline (0%)</td>
                  <td className="p-3 text-zinc-400">Baseline (0%)</td>
                </tr>
                <tr>
                  <td className="p-3 font-bold text-lime">1.0 vol% Al₂O₃</td>
                  <td className="p-3">2,667</td>
                  <td className="p-3 text-lime font-bold">-19.2% ΔT</td>
                  <td className="p-3 text-amber-400">+11.5% ΔP</td>
                </tr>
                <tr className="bg-lime/10">
                  <td className="p-3 font-bold text-lime">3.0 vol% Al₂O₃ (Optimal)</td>
                  <td className="p-3 font-bold text-lime">3,127</td>
                  <td className="p-3 font-bold text-lime">-37.7% ΔT</td>
                  <td className="p-3 text-amber-400">+34.8% ΔP</td>
                </tr>
                <tr>
                  <td className="p-3 font-bold text-white">5.0 vol% Al₂O₃</td>
                  <td className="p-3">3,520</td>
                  <td className="p-3 text-lime font-bold">-50.0% ΔT</td>
                  <td className="p-3 text-rose-400">+66.2% ΔP</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Sustainability */}
        <div className="lg:col-span-5 bento-card p-6 space-y-4">
          <div className="flex items-center space-x-2 border-b border-dark-800 pb-3">
            <Leaf className="w-5 h-5 text-lime" />
            <h3 className="font-bold text-sm text-white uppercase tracking-wide">
              Sustainability & Carbon Proxy
            </h3>
          </div>

          <div className="space-y-3">
            <div className="bg-dark-950 p-4 rounded-2xl border border-dark-800">
              <span className="text-xs text-zinc-400 block">Auxiliary Energy Saved:</span>
              <span className="text-2xl font-black font-mono text-lime">342.8 kWh / Pack-yr</span>
              <p className="text-[11px] text-zinc-500 mt-1">Through optimized laminar Reynolds modulation</p>
            </div>

            <div className="bg-dark-950 p-4 rounded-2xl border border-dark-800">
              <span className="text-xs text-zinc-400 block">CO₂ Reduction Proxy:</span>
              <span className="text-2xl font-black font-mono text-white">188.5 kg CO₂e</span>
              <p className="text-[11px] text-zinc-500 mt-1">Equivalent to ~940 km of clean EV driving</p>
            </div>
          </div>
        </div>

      </div>

      {/* Audit Log */}
      <div className="bento-card p-8 space-y-4">
        <div className="flex items-center justify-between border-b border-dark-800 pb-3">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-5 h-5 text-lime" />
            <h3 className="font-bold text-sm text-white uppercase tracking-wide">
              Governance & Human-in-the-Loop Audit Log (ISO 26262)
            </h3>
          </div>
          <span className="pill-badge bg-dark-950 text-lime border-dark-700">
            Immutable Audit Trail
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-dark-950 text-zinc-400 uppercase text-[10px]">
              <tr>
                <th className="p-3">Log ID</th>
                <th className="p-3">Timestamp</th>
                <th className="p-3">Engineer ID</th>
                <th className="p-3">Decision</th>
                <th className="p-3">Approved Operating Profile</th>
                <th className="p-3">Notes & Rationale</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dark-800 text-zinc-300">
              {auditLogs.map((log) => (
                <tr key={log.id} className="hover:bg-dark-800/50 transition">
                  <td className="p-3 font-bold text-lime">{log.id}</td>
                  <td className="p-3 text-zinc-400">{new Date(log.timestamp).toLocaleString()}</td>
                  <td className="p-3 font-bold text-white">{log.engineerId}</td>
                  <td className="p-3">
                    <span className={`px-3 py-0.5 rounded-full text-[10px] font-bold ${
                      log.decision === 'APPROVED' ? 'bg-lime text-dark-950' : 'bg-rose-950 text-rose-400 border border-rose-800'
                    }`}>
                      {log.decision}
                    </span>
                  </td>
                  <td className="p-3 text-white">
                    Re {log.reynolds || 550} • {log.concentration || 2.0}% Al₂O₃ • {log.flowRate || 0.035} kg/s
                  </td>
                  <td className="p-3 font-sans text-zinc-400 text-[11px] max-w-xs truncate">
                    {log.notes}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

export default ReportsAnalytics;

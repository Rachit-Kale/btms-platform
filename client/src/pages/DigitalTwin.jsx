// DigitalTwin.jsx - Page 4: 3D Digital Twin & CFD Performance Explorer (Lime Bento Theme)

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Layers, 
  Database, 
  Activity, 
  Cpu
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid 
} from 'recharts';
import Twin3DCanvas from '../components/Twin3DCanvas';
import RefrigerationLoopSvg from '../components/RefrigerationLoopSvg';
import { useTelemetry } from '../context/TelemetryContext';

const DigitalTwin = () => {
  const { telemetry, selectedCell, setSelectedCell } = useTelemetry();

  const [cfdData, setCfdData] = useState([]);
  const [selectedReynolds, setSelectedReynolds] = useState('');
  const [selectedConc, setSelectedConc] = useState('');
  const [syncInfo, setSyncInfo] = useState(null);
  const [loadingCfd, setLoadingCfd] = useState(false);

  const fetchCfdDataset = async () => {
    setLoadingCfd(true);
    try {
      let query = [];
      if (selectedReynolds) query.push(`reynolds=${selectedReynolds}`);
      if (selectedConc) query.push(`concentration=${selectedConc}`);
      const qs = query.length > 0 ? `?${query.join('&')}` : '';

      const [cfdRes, syncRes] = await Promise.all([
        axios.get(`/api/cfd-dataset${qs}`),
        axios.get('/api/twin/sync-status')
      ]);

      setCfdData(cfdRes.data.dataset || []);
      setSyncInfo(syncRes.data);
    } catch (err) {
      console.error("Failed to load CFD dataset:", err);
    } finally {
      setLoadingCfd(false);
    }
  };

  useEffect(() => {
    fetchCfdDataset();
  }, [selectedReynolds, selectedConc]);

  const cellTemps = telemetry?.cells ? telemetry.cells.map(c => c.temp) : [];

  return (
    <div className="space-y-8 py-4">
      
      {/* Header Banner */}
      <div className="bento-card p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-lime text-dark-950 flex items-center justify-center font-black">
            <Layers className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-black text-white uppercase font-sans">Digital Twin & CFD Explorer</h2>
            <p className="text-xs text-zinc-400">3D Synchronized Pack Model & ANSYS Fluent CFD Baseline Repository</p>
          </div>
        </div>

        {/* Sync Status Pill */}
        <div className="flex items-center space-x-2.5 bg-dark-950 px-4 py-2 rounded-full border border-dark-800">
          <div className="w-2.5 h-2.5 rounded-full bg-lime animate-ping" />
          <div className="text-xs font-mono">
            <span className="text-zinc-400">Twin Sync: </span>
            <span className="text-lime font-bold">LOCKED (&lt; 20ms)</span>
          </div>
        </div>
      </div>

      {/* 3D Visualizer & Health */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* 3D Three.js */}
        <div className="lg:col-span-8">
          <Twin3DCanvas 
            cellTemps={cellTemps} 
            selectedCell={selectedCell} 
            onSelectCell={setSelectedCell} 
          />
        </div>

        {/* RUL & Health Index */}
        <div className="lg:col-span-4 bento-card p-6 space-y-4">
          <div className="flex items-center space-x-2 border-b border-dark-800 pb-3">
            <Activity className="w-5 h-5 text-lime" />
            <h3 className="font-bold text-sm text-white uppercase tracking-wide">
              Digital Twin Health & RUL
            </h3>
          </div>

          <div className="bg-dark-950 p-4 rounded-xl border border-dark-800 space-y-3">
            <div className="flex justify-between items-center text-xs">
              <span className="text-zinc-400">Pack Health Index:</span>
              <span className="font-mono font-bold text-lime">98.4% (EXCELLENT)</span>
            </div>
            <div className="w-full h-2.5 bg-dark-800 rounded-full overflow-hidden">
              <div className="w-[98.4%] h-full bg-lime rounded-full" />
            </div>

            <div className="pt-2 flex justify-between items-center text-xs border-t border-dark-800 font-mono">
              <span className="text-zinc-400">Est. Remaining Life:</span>
              <span className="font-bold text-white">1,420 Cycles</span>
            </div>

            <div className="flex justify-between items-center text-xs font-mono">
              <span className="text-zinc-400">Thermal Stress Factor:</span>
              <span className="font-bold text-zinc-300">0.08 / 1.0 (Low)</span>
            </div>
          </div>

          {/* Sync Metadata */}
          <div className="space-y-2 text-xs font-mono">
            <div className="flex justify-between p-2.5 rounded-xl bg-dark-950 border border-dark-800">
              <span className="text-zinc-400">Active Cells:</span>
              <span className="text-white font-bold">10 / 10 Cells</span>
            </div>
            <div className="flex justify-between p-2.5 rounded-xl bg-dark-950 border border-dark-800">
              <span className="text-zinc-400">Microchannels:</span>
              <span className="text-white font-bold">200 Channels (Dh = 1mm)</span>
            </div>
            <div className="flex justify-between p-2.5 rounded-xl bg-dark-950 border border-dark-800">
              <span className="text-zinc-400">Coolant Fluid:</span>
              <span className="text-lime font-bold">{telemetry?.coolant?.concentration || 2.0} vol% Al₂O₃</span>
            </div>
          </div>
        </div>

      </div>

      {/* Refrigeration Loop */}
      <RefrigerationLoopSvg />

      {/* CFD Database Explorer */}
      <div className="bento-card p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-dark-800 pb-4">
          <div>
            <h3 className="text-xl font-black text-white uppercase font-sans flex items-center space-x-2">
              <Database className="w-5 h-5 text-lime" />
              <span>CFD Performance Database Explorer</span>
            </h3>
            <p className="text-xs text-zinc-400 mt-1">
              Filter pre-generated ANSYS Fluent CFD simulations across Reynolds numbers (400–700) and Nanofluid concentrations (0–5%).
            </p>
          </div>

          {/* Filter Bar */}
          <div className="flex flex-wrap items-center gap-3">
            <select
              value={selectedReynolds}
              onChange={(e) => setSelectedReynolds(e.target.value)}
              className="bg-zinc-950 border border-dark-700 text-xs text-zinc-200 px-3.5 py-2 rounded-full font-mono focus:outline-none focus:border-lime"
            >
              <option value="">All Reynolds Numbers</option>
              <option value="400">Re 400</option>
              <option value="500">Re 500</option>
              <option value="600">Re 600</option>
              <option value="700">Re 700</option>
            </select>

            <select
              value={selectedConc}
              onChange={(e) => setSelectedConc(e.target.value)}
              className="bg-zinc-950 border border-dark-700 text-xs text-zinc-200 px-3.5 py-2 rounded-full font-mono focus:outline-none focus:border-lime"
            >
              <option value="">All Concentrations</option>
              <option value="0">0.0 vol% (Pure Water)</option>
              <option value="1">1.0 vol% Al₂O₃</option>
              <option value="3">3.0 vol% Al₂O₃</option>
              <option value="5">5.0 vol% Al₂O₃</option>
            </select>
          </div>
        </div>

        {/* CFD Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-dark-950 text-zinc-400 uppercase text-[10px]">
              <tr>
                <th className="p-3">Run ID</th>
                <th className="p-3">Reynolds</th>
                <th className="p-3">Nanofluid</th>
                <th className="p-3">Flow Rate (kg/s)</th>
                <th className="p-3">h [W/(m²·K)]</th>
                <th className="p-3">ΔP (Pa)</th>
                <th className="p-3">P_pump (W)</th>
                <th className="p-3">Max Temp (°C)</th>
                <th className="p-3">ΔT Gradient (°C)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dark-800 text-zinc-300">
              {cfdData.map((row) => (
                <tr key={row.id} className="hover:bg-dark-800/50 transition">
                  <td className="p-3 font-bold text-lime">{row.id}</td>
                  <td className="p-3">Re {row.reynolds}</td>
                  <td className="p-3 text-white">{row.nanofluidType}</td>
                  <td className="p-3">{row.flowRate}</td>
                  <td className="p-3 font-bold text-lime">{row.heatTransferCoeff}</td>
                  <td className="p-3 text-purple-300">{row.pressureDrop}</td>
                  <td className="p-3">{row.pumpingPower}</td>
                  <td className={`p-3 font-bold ${row.maxTemp > 35 ? 'text-rose-400' : 'text-white'}`}>
                    {row.maxTemp}°C
                  </td>
                  <td className={`p-3 font-bold ${row.deltaT > 5.0 ? 'text-amber-400' : 'text-lime'}`}>
                    {row.deltaT}°C
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Comparison Bar Chart */}
        <div className="space-y-3 pt-4 border-t border-dark-800">
          <h4 className="text-xs font-bold text-zinc-300 uppercase tracking-wide">
            Heat Transfer Coefficient (h) Comparison Across Filtered Runs
          </h4>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={cfdData} margin={{ top: 10, right: 20, left: 0, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                <XAxis dataKey="id" stroke="#71717a" fontSize={10} />
                <YAxis stroke="#71717a" fontSize={10} unit=" W/m²K" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#18181b', borderColor: '#3f3f46', borderRadius: '12px', fontSize: '11px' }}
                />
                <Bar dataKey="heatTransferCoeff" name="Heat Transfer Coeff (h)" fill="#b4f000" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

    </div>
  );
};

export default DigitalTwin;

// Dashboard.jsx - Page 2: Live Monitoring Dashboard (Lime Bento Theme)

import React, { useState } from 'react';
import { 
  Activity, 
  Thermometer, 
  Gauge, 
  Zap, 
  AlertTriangle, 
  Flame, 
  CheckCircle, 
  Clock, 
  RotateCcw, 
  Filter,
  BarChart3,
  TrendingUp,
  Cpu,
  Radio
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  Legend 
} from 'recharts';
import { useTelemetry } from '../context/TelemetryContext';

const Dashboard = () => {
  const { 
    telemetry, 
    history, 
    alerts, 
    selectedCell, 
    setSelectedCell,
    simConfig,
    updateSimConfig,
    injectAnomaly
  } = useTelemetry();

  const [activeChartTab, setActiveChartTab] = useState('temps');
  const [timeRange, setTimeRange] = useState('live');

  if (!telemetry || !telemetry.pack) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-3">
          <div className="w-12 h-12 border-4 border-lime border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-zinc-300 font-mono text-sm">Streaming live BTMS telemetry over Socket.IO...</p>
        </div>
      </div>
    );
  }

  const { cells, pack, coolant } = telemetry;

  const chartData = history.map((item, idx) => {
    const time = new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const selectedCellObj = item.cells ? item.cells.find(c => c.id === selectedCell) : null;

    return {
      index: idx,
      time,
      T_max: item.pack?.maxTemp,
      T_avg: item.pack?.avgTemp,
      T_min: item.pack?.minTemp,
      deltaT: item.pack?.deltaT,
      Tc1_inlet: item.coolant?.Tc1_inlet,
      Tc2_outlet: item.coolant?.Tc2_outlet,
      P1_inlet: item.coolant?.P1_inlet,
      P2_outlet: item.coolant?.P2_outlet,
      deltaP: item.coolant?.deltaP,
      voltage: item.pack?.voltage,
      current: item.pack?.current,
      selectedCellTemp: selectedCellObj ? selectedCellObj.temp : undefined
    };
  });

  const getHeatmapColor = (temp, isSelected) => {
    let bg = 'bg-lime/10 border-lime/30 text-lime';
    if (temp >= 38.0) {
      bg = 'bg-rose-950/90 border-rose-500 text-rose-300';
    } else if (temp >= 34.0) {
      bg = 'bg-amber-950/80 border-amber-500/60 text-amber-300';
    }
    if (isSelected) {
      bg += ' ring-2 ring-lime scale-105 shadow-lime-glow';
    }
    return bg;
  };

  return (
    <div className="space-y-6 py-4">
      
      {/* Top Header Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bento-card p-5">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-lime text-dark-950 flex items-center justify-center font-black">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-extrabold text-white text-lg uppercase font-sans">Live 10-Cell Telemetry Stream</h2>
            <p className="text-xs text-zinc-400">Sampling Rate: 1.2s • Socket.IO High-Speed Channel</p>
          </div>
        </div>

        {/* Time-Range Selector */}
        <div className="flex items-center space-x-1.5 bg-dark-950 p-1.5 rounded-full border border-dark-800">
          {['live', '1h', '24h'].map(r => (
            <button
              key={r}
              onClick={() => setTimeRange(r)}
              className={`px-3.5 py-1 rounded-full text-xs font-mono font-bold transition ${
                timeRange === r 
                  ? 'bg-lime text-dark-950 shadow-sm' 
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              {r.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* 10-Cell Thermal Heatmap Grid */}
      <div className="bento-card p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="font-bold text-sm text-white uppercase tracking-wide flex items-center space-x-2">
              <Thermometer className="w-4 h-4 text-lime" />
              <span>10-Cell 21700 Thermal Heatmap Grid</span>
            </h3>
            <p className="text-xs text-zinc-400 mt-0.5">
              Click any cell to drill into its dedicated time-series curve and micro-channel gradient.
            </p>
          </div>

          <div className="flex items-center space-x-3 text-xs font-mono">
            <div className="flex items-center space-x-1.5">
              <span className="w-3 h-3 rounded bg-lime" />
              <span className="text-zinc-400">&lt; 34°C (Normal)</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="w-3 h-3 rounded bg-amber-500" />
              <span className="text-zinc-400">34–38°C (Warm)</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="w-3 h-3 rounded bg-rose-500" />
              <span className="text-zinc-400">&gt; 38°C (Hotspot)</span>
            </div>
          </div>
        </div>

        {/* 10 Cells */}
        <div className="grid grid-cols-2 sm:grid-cols-5 lg:grid-cols-10 gap-3">
          {cells.map((cell) => {
            const isSelected = selectedCell === cell.id;
            const isHotspot = cell.temp >= pack.maxTemp - 0.4;
            const colorClass = getHeatmapColor(cell.temp, isSelected);

            return (
              <div
                key={cell.id}
                onClick={() => setSelectedCell(cell.id)}
                className={`p-3.5 rounded-2xl border cursor-pointer transition-all duration-200 ${colorClass}`}
              >
                <div className="flex items-center justify-between text-xs font-mono font-bold">
                  <span>{cell.id}</span>
                  {isHotspot && (
                    <span className="w-2 h-2 rounded-full bg-rose-400 animate-ping" title="Hotspot Cell" />
                  )}
                </div>

                <div className="mt-2 text-xl font-black font-mono text-center">
                  {cell.temp}°C
                </div>

                <div className="mt-1 text-[10px] text-center opacity-80 uppercase font-mono font-bold">
                  {isHotspot ? 'HOTSPOT' : cell.temp > 34 ? 'WARM' : 'NORMAL'}
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Drilldown Banner */}
        <div className="p-3.5 bg-dark-950 rounded-xl border border-dark-800 flex items-center justify-between text-xs font-mono">
          <div className="flex items-center space-x-2">
            <span className="text-zinc-400">Active Drilldown:</span>
            <span className="text-dark-950 font-bold bg-lime px-2.5 py-0.5 rounded-full">
              Cell {selectedCell}
            </span>
            <span className="text-zinc-400">
              Current Temp: <strong className="text-white font-bold">{cells.find(c => c.id === selectedCell)?.temp || 28.0}°C</strong>
            </span>
          </div>
          <span className="text-zinc-500 hidden sm:inline">
            Interface: Microchannel Column #{selectedCell.replace('C', '')}
          </span>
        </div>
      </div>

      {/* Real-time Dynamic Charts */}
      <div className="bento-card p-6 space-y-4">
        
        {/* Chart View Switcher */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-dark-800 pb-3">
          <div className="flex items-center space-x-2">
            <TrendingUp className="w-5 h-5 text-lime" />
            <h3 className="font-bold text-sm text-white uppercase tracking-wide">
              Real-Time Dynamic Telemetry Charts
            </h3>
          </div>

          <div className="flex items-center space-x-1.5 bg-dark-950 p-1 rounded-full border border-dark-800">
            <button
              onClick={() => setActiveChartTab('temps')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition ${
                activeChartTab === 'temps'
                  ? 'bg-lime text-dark-950'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              Battery & Cell Temps
            </button>

            <button
              onClick={() => setActiveChartTab('coolant')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition ${
                activeChartTab === 'coolant'
                  ? 'bg-lime text-dark-950'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              Coolant Loop (Tc1, Tc2, ΔP)
            </button>

            <button
              onClick={() => setActiveChartTab('electrical')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition ${
                activeChartTab === 'electrical'
                  ? 'bg-lime text-dark-950'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              Voltage & Current
            </button>
          </div>
        </div>

        {/* Chart Viewport */}
        <div className="h-72 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            {activeChartTab === 'temps' ? (
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                <XAxis dataKey="time" stroke="#71717a" fontSize={11} tickLine={false} />
                <YAxis stroke="#71717a" fontSize={11} domain={['auto', 'auto']} unit="°C" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#18181b', borderColor: '#3f3f46', borderRadius: '12px', fontSize: '12px' }}
                />
                <Legend wrapperStyle={{ fontSize: '12px' }} />
                <Line type="monotone" dataKey="T_max" name="Max Temp (T_max)" stroke="#f43f5e" strokeWidth={2.5} dot={false} isAnimationActive={false} />
                <Line type="monotone" dataKey="T_avg" name="Avg Temp (T_avg)" stroke="#b4f000" strokeWidth={2.5} dot={false} isAnimationActive={false} />
                <Line type="monotone" dataKey="T_min" name="Min Temp (T_min)" stroke="#38bdf8" strokeWidth={2} dot={false} isAnimationActive={false} />
                <Line type="monotone" dataKey="selectedCellTemp" name={`Selected (${selectedCell})`} stroke="#f59e0b" strokeWidth={2} strokeDasharray="4 2" dot={false} isAnimationActive={false} />
              </LineChart>
            ) : activeChartTab === 'coolant' ? (
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                <XAxis dataKey="time" stroke="#71717a" fontSize={11} tickLine={false} />
                <YAxis yAxisId="temp" stroke="#b4f000" fontSize={11} unit="°C" />
                <YAxis yAxisId="pres" orientation="right" stroke="#c084fc" fontSize={11} unit="Pa" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#18181b', borderColor: '#3f3f46', borderRadius: '12px', fontSize: '12px' }}
                />
                <Legend wrapperStyle={{ fontSize: '12px' }} />
                <Line yAxisId="temp" type="monotone" dataKey="Tc1_inlet" name="Coolant Inlet (T_c1)" stroke="#b4f000" strokeWidth={2.5} dot={false} isAnimationActive={false} />
                <Line yAxisId="temp" type="monotone" dataKey="Tc2_outlet" name="Coolant Outlet (T_c2)" stroke="#f59e0b" strokeWidth={2.5} dot={false} isAnimationActive={false} />
                <Line yAxisId="pres" type="monotone" dataKey="deltaP" name="Pressure Drop (ΔP)" stroke="#c084fc" strokeWidth={2} dot={false} isAnimationActive={false} />
              </LineChart>
            ) : (
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                <XAxis dataKey="time" stroke="#71717a" fontSize={11} tickLine={false} />
                <YAxis yAxisId="volt" stroke="#b4f000" fontSize={11} unit="V" domain={[30, 42]} />
                <YAxis yAxisId="curr" orientation="right" stroke="#f59e0b" fontSize={11} unit="A" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#18181b', borderColor: '#3f3f46', borderRadius: '12px', fontSize: '12px' }}
                />
                <Legend wrapperStyle={{ fontSize: '12px' }} />
                <Line yAxisId="volt" type="monotone" dataKey="voltage" name="Pack Voltage (V)" stroke="#b4f000" strokeWidth={2.5} dot={false} isAnimationActive={false} />
                <Line yAxisId="curr" type="monotone" dataKey="current" name="Discharge Current (A)" stroke="#f59e0b" strokeWidth={2} dot={false} isAnimationActive={false} />
              </LineChart>
            )}
          </ResponsiveContainer>
        </div>
      </div>

      {/* Sensor Readings Table & Anomaly Feed (Bento Grid) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Table */}
        <div className="lg:col-span-7 bento-card p-6 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-white uppercase tracking-wide">
              Live Sensor Telemetry Matrix
            </h3>
            <span className="text-[11px] font-mono text-zinc-400">10 Cell Sensors + 6 Flow Transducers</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-dark-950 text-zinc-400 uppercase text-[10px]">
                <tr>
                  <th className="p-3">Parameter</th>
                  <th className="p-3">Live Value</th>
                  <th className="p-3">Nominal Range</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-dark-800 text-zinc-300">
                <tr>
                  <td className="p-3 font-sans font-medium text-white">Max Cell Temp (T_max)</td>
                  <td className="p-3 font-bold text-lime">{pack.maxTemp} °C</td>
                  <td className="p-3 text-zinc-500">15.0 – 35.0 °C</td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 rounded-full bg-lime/10 text-lime text-[10px] font-bold">NORMAL</span>
                  </td>
                </tr>
                <tr>
                  <td className="p-3 font-sans font-medium text-white">Thermal Gradient (ΔT)</td>
                  <td className={`p-3 font-bold ${pack.deltaT > 5.0 ? 'text-amber-400' : 'text-lime'}`}>
                    {pack.deltaT} °C
                  </td>
                  <td className="p-3 text-zinc-500">&lt; 5.0 °C Target</td>
                  <td className="p-3">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${pack.deltaT > 5.0 ? 'bg-amber-500/10 text-amber-400' : 'bg-lime/10 text-lime'}`}>
                      {pack.deltaT > 5.0 ? 'WARNING' : 'PASS'}
                    </span>
                  </td>
                </tr>
                <tr>
                  <td className="p-3 font-sans font-medium text-white">Coolant Inlet (T_c1) / Outlet (T_c2)</td>
                  <td className="p-3 font-bold text-white">{coolant.Tc1_inlet}°C / {coolant.Tc2_outlet}°C</td>
                  <td className="p-3 text-zinc-500">ΔT_coolant ~ 3.5°C</td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 rounded-full bg-lime/10 text-lime text-[10px] font-bold">NOMINAL</span>
                  </td>
                </tr>
                <tr>
                  <td className="p-3 font-sans font-medium text-white">Pressure Drop (ΔP)</td>
                  <td className="p-3 font-bold text-purple-300">{coolant.deltaP} Pa</td>
                  <td className="p-3 text-zinc-500">400 – 1500 Pa</td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 rounded-full bg-lime/10 text-lime text-[10px] font-bold">OPTIMAL</span>
                  </td>
                </tr>
                <tr>
                  <td className="p-3 font-sans font-medium text-white">Auxiliary Pump Power</td>
                  <td className="p-3 font-bold text-white">{coolant.pumpingPower} W</td>
                  <td className="p-3 text-zinc-500">&lt; 0.100 W</td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 rounded-full bg-lime/10 text-lime text-[10px] font-bold">EFFICIENT</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Anomaly Feed */}
        <div className="lg:col-span-5 bento-card p-6 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-white uppercase tracking-wide flex items-center space-x-2">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              <span>Anomaly Detection Feed</span>
            </h3>
            <button
              onClick={() => injectAnomaly('TEMP_SPIKE')}
              className="text-[11px] font-mono font-bold text-rose-400 hover:text-rose-300 underline"
            >
              + Trigger Anomaly
            </button>
          </div>

          <div className="space-y-2.5 max-h-64 overflow-y-auto pr-1">
            {alerts && alerts.length > 0 ? (
              alerts.map((alt) => (
                <div
                  key={alt.id}
                  className={`p-3.5 rounded-xl border text-xs ${
                    alt.severity === 'CRITICAL'
                      ? 'bg-rose-950/80 border-rose-700 text-rose-200'
                      : alt.severity === 'WARNING'
                      ? 'bg-amber-950/80 border-amber-700 text-amber-200'
                      : 'bg-dark-950 border-dark-800 text-zinc-300'
                  }`}
                >
                  <div className="flex items-center justify-between text-[10px] font-mono opacity-80 mb-1">
                    <span className="font-bold">{alt.id}</span>
                    <span>{new Date(alt.timestamp).toLocaleTimeString()}</span>
                  </div>
                  <p className="font-sans leading-snug">{alt.message}</p>
                </div>
              ))
            ) : (
              <p className="text-zinc-500 text-xs py-4 text-center">No active anomalies detected.</p>
            )}
          </div>
        </div>

      </div>

    </div>
  );
};

export default Dashboard;

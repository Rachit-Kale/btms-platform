// RefrigerationLoopSvg.jsx - Interactive BTMS Refrigeration Loop (Lime Bento Theme)

import React, { useState } from 'react';
import { Gauge, Thermometer, RefreshCw } from 'lucide-react';
import { useTelemetry } from '../context/TelemetryContext';

const RefrigerationLoopSvg = () => {
  const { telemetry } = useTelemetry();
  const [activeNode, setActiveNode] = useState(null);

  const coolant = telemetry?.coolant || {
    Tc1_inlet: 25.0,
    Tc2_outlet: 28.8,
    P1_inlet: 3020,
    P2_outlet: 2500,
    deltaP: 520,
    reynolds: 550,
    concentration: 2.0,
    flowRate: 0.035,
    pumpRpm: 2750
  };

  const nodes = [
    {
      id: 'compressor',
      name: 'Vapor Compressor',
      x: 180,
      y: 70,
      desc: 'Compresses refrigerant vapor, raising pressure and temperature.',
      metric: 'Pressure Ratio: 3.4 : 1'
    },
    {
      id: 'condenser',
      name: 'Air-Cooled Condenser',
      x: 480,
      y: 70,
      desc: 'Rejects heat to ambient air, condensing refrigerant to high-pressure liquid.',
      metric: 'T_cond = 48.5°C'
    },
    {
      id: 'expansion',
      name: 'Electronic Expansion Valve (EEV)',
      x: 480,
      y: 260,
      desc: 'Throttles high-pressure liquid refrigerant, creating cold 2-phase fluid.',
      metric: 'Opening: 42%'
    },
    {
      id: 'evaporator',
      name: 'Secondary Chiller / Evaporator',
      x: 330,
      y: 260,
      desc: 'Exchanges heat between cold refrigerant and Al₂O₃/water nanofluid loop.',
      metric: 'Chiller COP: 4.1'
    },
    {
      id: 'pump',
      name: 'Nanofluid Pump & FCV',
      x: 140,
      y: 260,
      desc: 'Maintains regulated mass flow rate (0.01-0.08 kg/s) across micro-channels.',
      metric: `RPM: ${coolant.pumpRpm} | Flow: ${coolant.flowRate} kg/s`
    },
    {
      id: 'battery_hx',
      name: '10-Cell Micro-channel Heat Sink',
      x: 140,
      y: 430,
      desc: '20 microchannels/column (Dh=1mm) directly cooling 21700 battery pack.',
      metric: `T_c1 = ${coolant.Tc1_inlet}°C → T_c2 = ${coolant.Tc2_outlet}°C`
    }
  ];

  return (
    <div className="bento-card p-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-dark-800 pb-4">
        <div className="flex items-center space-x-2">
          <RefreshCw className="w-5 h-5 text-lime" />
          <h3 className="text-xl font-black text-white uppercase font-sans">
            Refrigeration & Micro-Channel Cooling Loop (Fig. 2)
          </h3>
        </div>
        <span className="pill-badge bg-dark-950 text-lime border-dark-700">
          Two-Loop Thermal Architecture
        </span>
      </div>

      <div className="relative w-full overflow-x-auto">
        <svg viewBox="0 0 640 520" className="w-full h-auto min-w-[580px] bg-dark-950 rounded-2xl p-4 border border-dark-800">
          {/* Primary Refrigeration Loop (Top) */}
          <rect x="130" y="40" width="380" height="200" fill="none" stroke="#3f3f46" strokeWidth="2.5" strokeDasharray="6,4" rx="16" />
          <text x="320" y="32" textAnchor="middle" fill="#a1a1aa" fontSize="10" fontWeight="bold">PRIMARY REFRIGERATION CYCLE (R134a / R1234yf)</text>

          {/* Secondary Nanofluid Loop (Bottom) */}
          <rect x="80" y="240" width="310" height="240" fill="none" stroke="#b4f000" strokeWidth="2.5" rx="16" />
          <text x="235" y="500" textAnchor="middle" fill="#b4f000" fontSize="10" fontWeight="bold">SECONDARY NANOFLUID LOOP (Al₂O₃ / Water)</text>

          {/* Node 1: Compressor */}
          <g transform="translate(140, 50)" className="cursor-pointer" onClick={() => setActiveNode('compressor')}>
            <circle cx="40" cy="20" r="28" fill="#18181b" stroke="#b4f000" strokeWidth="2" />
            <text x="40" y="23" textAnchor="middle" fill="#ffffff" fontSize="9" fontWeight="bold">COMPRESSOR</text>
          </g>

          {/* Node 2: Condenser */}
          <g transform="translate(440, 50)" className="cursor-pointer" onClick={() => setActiveNode('condenser')}>
            <rect x="0" y="0" width="80" height="40" rx="8" fill="#18181b" stroke="#f43f5e" strokeWidth="2" />
            <text x="40" y="23" textAnchor="middle" fill="#fda4af" fontSize="9" fontWeight="bold">CONDENSER</text>
          </g>

          {/* Node 3: Expansion Valve */}
          <g transform="translate(450, 240)" className="cursor-pointer" onClick={() => setActiveNode('expansion')}>
            <polygon points="10,0 50,40 10,40 50,0" fill="#18181b" stroke="#f59e0b" strokeWidth="2" />
            <text x="30" y="55" textAnchor="middle" fill="#fcd34d" fontSize="9" fontWeight="bold">EEV VALVE</text>
          </g>

          {/* Node 4: Chiller / Evaporator */}
          <g transform="translate(280, 230)" className="cursor-pointer" onClick={() => setActiveNode('evaporator')}>
            <rect x="0" y="0" width="100" height="60" rx="8" fill="#18181b" stroke="#b4f000" strokeWidth="2" />
            <text x="50" y="26" textAnchor="middle" fill="#b4f000" fontSize="10" fontWeight="bold">CHILLER / HX</text>
            <text x="50" y="42" textAnchor="middle" fill="#71717a" fontSize="8">Fluid Coupling</text>
          </g>

          {/* Node 5: Coolant Pump */}
          <g transform="translate(90, 240)" className="cursor-pointer" onClick={() => setActiveNode('pump')}>
            <circle cx="35" cy="20" r="24" fill="#18181b" stroke="#b4f000" strokeWidth="2" />
            <text x="35" y="24" textAnchor="middle" fill="#d9f99d" fontSize="9" fontWeight="bold">PUMP / FCV</text>
          </g>

          {/* Node 6: Battery Pack HX */}
          <g transform="translate(90, 390)" className="cursor-pointer" onClick={() => setActiveNode('battery_hx')}>
            <rect x="0" y="0" width="280" height="70" rx="10" fill="#141417" stroke="#27272a" strokeWidth="2" />
            <text x="140" y="24" textAnchor="middle" fill="#ffffff" fontSize="11" fontWeight="bold">
              21700 BATTERY PACK (10 CELLS)
            </text>
            <text x="140" y="42" textAnchor="middle" fill="#b4f000" fontSize="9">
              20 Microchannels / Column • Dh = 1 mm
            </text>

            {[...Array(10)].map((_, i) => (
              <rect
                key={i}
                x={18 + i * 25}
                y={48}
                width="16"
                height="12"
                rx="3"
                fill={i === 4 || i === 5 ? '#f43f5e' : '#b4f000'}
                opacity="0.9"
              />
            ))}
          </g>

          {/* Inlet & Outlet Probes */}
          <g transform="translate(95, 340)">
            <rect x="0" y="0" width="90" height="32" rx="6" fill="#09090b" stroke="#b4f000" strokeWidth="1" />
            <text x="8" y="14" fill="#b4f000" fontSize="9" fontWeight="bold">T_c1: {coolant.Tc1_inlet}°C</text>
            <text x="8" y="26" fill="#a1a1aa" fontSize="8" fontFamily="monospace">P1: {coolant.P1_inlet} Pa</text>
          </g>

          <g transform="translate(265, 340)">
            <rect x="0" y="0" width="90" height="32" rx="6" fill="#09090b" stroke="#f59e0b" strokeWidth="1" />
            <text x="8" y="14" fill="#f59e0b" fontSize="9" fontWeight="bold">T_c2: {coolant.Tc2_outlet}°C</text>
            <text x="8" y="26" fill="#a1a1aa" fontSize="8" fontFamily="monospace">P2: {coolant.P2_outlet} Pa</text>
          </g>
        </svg>
      </div>

      {/* Node Info Box */}
      <div className="p-4 bg-dark-950 rounded-2xl border border-dark-800 flex items-center justify-between text-xs">
        <div>
          <span className="text-zinc-400">Selected Node: </span>
          <span className="text-lime font-bold">
            {nodes.find(n => n.id === activeNode)?.name || 'Hover/Click any loop component for live telemetry'}
          </span>
          <p className="text-zinc-400 text-[11px] mt-0.5">
            {nodes.find(n => n.id === activeNode)?.desc || 'Click components on the diagram to inspect thermodynamic states.'}
          </p>
        </div>
        {activeNode && (
          <span className="bg-dark-900 text-lime font-mono px-3 py-1.5 rounded-full border border-dark-700">
            {nodes.find(n => n.id === activeNode)?.metric}
          </span>
        )}
      </div>
    </div>
  );
};

export default RefrigerationLoopSvg;

// Home.jsx - Page 1: Bento-Grid Overview & Architecture

import React, { useState } from 'react';
import { 
  Zap, 
  ArrowRight, 
  Activity, 
  Cpu, 
  Layers, 
  FileText, 
  ShieldCheck, 
  Thermometer, 
  CheckCircle2, 
  Sparkles,
  Info,
  Check,
  TrendingDown,
  Compass
} from 'lucide-react';

const Home = ({ setActiveTab }) => {
  const [selectedArchStep, setSelectedArchStep] = useState(2);

  const architectureSteps = [
    {
      step: "01",
      title: "Sensors & CFD Ingestion",
      desc: "Streams 10-cell thermistors, coolant inlet/outlet temps (T_c1, T_c2), pressures (P1, P2), mass flow, and current/voltage.",
      isLime: false
    },
    {
      step: "02",
      title: "Data Preprocessing",
      desc: "Filters high-frequency electrical noise, verifies physical limits, and detects sensor dropouts or thermal surges.",
      isLime: true
    },
    {
      step: "03",
      title: "AI Surrogate Engine",
      desc: "Trained on ANSYS Fluent CFD simulations to infer max pack temp, hotspot cells, and thermal gradient within 20ms.",
      isLime: false
    },
    {
      step: "04",
      title: "Digital Twin Sync",
      desc: "Maintains a synchronized 3D thermal state representation and calculates remaining useful life (RUL) stress cycles.",
      isLime: true
    },
    {
      step: "05",
      title: "Pareto Optimization",
      desc: "Multi-objective engine balances cooling performance (ΔT < 5°C) against pumping power consumption.",
      isLime: false
    },
    {
      step: "06",
      title: "Human-in-the-Loop Gate",
      desc: "Thermal engineers review and approve/reject AI parameter adjustments before sending control signals.",
      isLime: true
    },
    {
      step: "07",
      title: "Cooling Actuation & UI",
      desc: "Modulates pump RPM, flow control valve (FCV), and electronic expansion valve (EEV) while streaming live telemetry.",
      isLime: false
    }
  ];

  const objectives = [
    "Design and simulate an Al₂O₃/water nanofluid micro-channel cooling jacket for a 10-cell 21700 pack.",
    "Maintain maximum cell temperature below 35°C and pack thermal gradient ΔT < 5°C during rapid discharge.",
    "Deploy a lightweight surrogate machine learning model providing real-time thermal inference (<500ms).",
    "Implement multi-objective optimization to minimize parasitic coolant pumping power consumption.",
    "Deliver a synchronized Digital Twin platform with human-in-the-loop governance and verifiable audit trails."
  ];

  return (
    <div className="space-y-12 py-6">
      
      {/* Hero Section styled with bold typography & lime accent cards */}
      <section className="relative rounded-3xl overflow-hidden bg-dark-900 border border-dark-700/80 p-8 sm:p-14">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          
          {/* Tag Pill */}
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-lime/10 text-lime border border-lime/30 text-xs font-mono font-bold">
            <Sparkles className="w-3.5 h-3.5 text-lime" />
            <span>KJS-CES-02 Research • Somaiya Vidyavihar University</span>
          </div>

          {/* Big Bold Headline */}
          <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white uppercase font-sans leading-none">
            Your Battery Thermal <br />
            <span className="text-lime font-black underline decoration-lime/40">Management, Handled.</span>
          </h1>

          <p className="max-w-2xl mx-auto text-zinc-300 text-sm sm:text-base leading-relaxed font-sans">
            A state-of-the-art digital twin, CFD-calibrated surrogate machine learning engine, 
            and real-time monitoring platform for 10-cell 21700 cylindrical EV battery packs with 
            Al₂O₃/water nanofluid micro-channel cooling.
          </p>

          {/* Action CTAs */}
          <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={() => setActiveTab('dashboard')}
              className="btn-lime"
            >
              <Activity className="w-4 h-4 text-dark-950 stroke-[2.5]" />
              <span>Launch Live Dashboard</span>
              <ArrowRight className="w-4 h-4 text-dark-950 stroke-[2.5]" />
            </button>

            <button
              onClick={() => setActiveTab('ai')}
              className="btn-dark"
            >
              <Cpu className="w-4 h-4 text-lime" />
              <span>AI Prediction Sandbox</span>
            </button>

            <button
              onClick={() => setActiveTab('twin')}
              className="btn-dark"
            >
              <Layers className="w-4 h-4 text-lime" />
              <span>Explore 3D Digital Twin</span>
            </button>
          </div>

        </div>
      </section>

      {/* 4 Stat Bento Tiles (Alternating Lime and Dark cards) */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Tile 1: Lime Card */}
        <div className="bento-card-lime p-6 space-y-2">
          <div className="flex justify-between items-center text-xs font-mono font-bold uppercase tracking-wider text-dark-900/80">
            <span>Thermal Target</span>
            <span className="w-2 h-2 rounded-full bg-dark-950" />
          </div>
          <div className="text-3xl font-black text-dark-950 font-sans">&lt; 5.0 °C</div>
          <p className="text-xs text-dark-900 font-semibold">Strict pack-wide thermal uniformity limit</p>
        </div>

        {/* Tile 2: Dark Card */}
        <div className="bento-card p-6 space-y-2">
          <div className="flex justify-between items-center text-xs font-mono text-zinc-400 uppercase tracking-wider">
            <span>Operating Range</span>
            <Thermometer className="w-4 h-4 text-lime" />
          </div>
          <div className="text-3xl font-black text-white font-sans">15–45 °C</div>
          <p className="text-xs text-zinc-400">Optimum lithium-ion electrochemical window</p>
        </div>

        {/* Tile 3: Lime Card */}
        <div className="bento-card-lime p-6 space-y-2">
          <div className="flex justify-between items-center text-xs font-mono font-bold uppercase tracking-wider text-dark-900/80">
            <span>Reynolds Number</span>
            <span className="w-2 h-2 rounded-full bg-dark-950" />
          </div>
          <div className="text-3xl font-black text-dark-950 font-sans">Re 400–700</div>
          <p className="text-xs text-dark-900 font-semibold">Laminar microchannel flow regime</p>
        </div>

        {/* Tile 4: Dark Card */}
        <div className="bento-card p-6 space-y-2">
          <div className="flex justify-between items-center text-xs font-mono text-zinc-400 uppercase tracking-wider">
            <span>Pack Architecture</span>
            <ShieldCheck className="w-4 h-4 text-lime" />
          </div>
          <div className="text-3xl font-black text-white font-sans">10× 21700</div>
          <p className="text-xs text-zinc-400">20 microchannels / column (Dh = 1mm)</p>
        </div>

      </section>

      {/* Problem Statement Card & Objectives (Bento Grid) */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Problem Statement Card */}
        <div className="lg:col-span-6 bento-card p-8 space-y-4">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-dark-800 text-lime border border-dark-700 text-xs font-mono font-bold uppercase">
            <Info className="w-3.5 h-3.5 text-lime" />
            <span>Problem Statement & Context</span>
          </div>

          <h2 className="text-2xl font-bold text-white font-sans">
            Thermal Runaway Mitigation in High-Discharge Packs
          </h2>

          <p className="text-zinc-300 text-sm leading-relaxed">
            Lithium-ion battery packs in electric vehicles generate intense localized heat during fast-charge 
            and high-current driving cycles. Non-uniform thermal distribution degrades battery life, drops 
            coulombic efficiency, and risks triggering catastrophic thermal runaway.
          </p>

          <p className="text-zinc-300 text-sm leading-relaxed">
            Conventional air cooling cannot dissipate high heat flux densities. This research integrates an 
            <strong> Al₂O₃/water nanofluid micro-channel cooling jacket</strong> combined with a 
            <strong> surrogate machine learning predictor</strong> and <strong>digital twin telemetry</strong> to 
            maintain strict temperature uniformity while minimizing auxiliary pump parasitic loads.
          </p>

          <div className="pt-4 border-t border-dark-800 grid grid-cols-2 gap-3 text-xs font-mono">
            <div className="bg-dark-950 p-3 rounded-xl border border-dark-800">
              <span className="text-zinc-400 block text-[10px]">Coolant Formulation:</span>
              <span className="text-lime font-bold">Al₂O₃ / Water (0–5 vol%)</span>
            </div>
            <div className="bg-dark-950 p-3 rounded-xl border border-dark-800">
              <span className="text-zinc-400 block text-[10px]">Microchannel Specs:</span>
              <span className="text-lime font-bold">20 channels / col (Dh = 1mm)</span>
            </div>
          </div>
        </div>

        {/* Research Objectives */}
        <div className="lg:col-span-6 bento-card p-8 space-y-4">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-dark-800 text-lime border border-dark-700 text-xs font-mono font-bold uppercase">
            <CheckCircle2 className="w-3.5 h-3.5 text-lime" />
            <span>Research Objectives (KJS-CES-02 §8)</span>
          </div>

          <h2 className="text-2xl font-bold text-white font-sans">
            Core Engineering Objectives
          </h2>

          <ul className="space-y-3 pt-2">
            {objectives.map((obj, i) => (
              <li key={i} className="flex items-start space-x-3 text-sm text-zinc-300">
                <span className="w-6 h-6 rounded-full bg-lime text-dark-950 flex-shrink-0 flex items-center justify-center text-xs font-black font-mono mt-0.5">
                  {i + 1}
                </span>
                <span className="leading-snug">{obj}</span>
              </li>
            ))}
          </ul>
        </div>

      </section>

      {/* 7-Stage Cyber-Physical Architecture Pipeline (Bento Style) */}
      <section className="bento-card p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-dark-800 pb-4">
          <div>
            <h3 className="text-2xl font-black text-white uppercase font-sans">
              7-Stage Cyber-Physical Architecture
            </h3>
            <p className="text-xs text-zinc-400 mt-1">
              Interactive pipeline from sensor ingestion to human-in-the-loop actuation.
            </p>
          </div>
          <span className="pill-badge bg-dark-800 text-lime border-dark-700">
            KJS-CES-02 Architecture Flow
          </span>
        </div>

        {/* Step Buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
          {architectureSteps.map((s, idx) => (
            <button
              key={s.step}
              onClick={() => setSelectedArchStep(idx)}
              className={`p-4 rounded-2xl border text-left transition-all duration-200 ${
                selectedArchStep === idx
                  ? 'bg-lime text-dark-950 border-lime shadow-lime-glow font-bold scale-105'
                  : 'bg-dark-950 border-dark-800 text-zinc-400 hover:bg-dark-800 hover:text-white'
              }`}
            >
              <div className={`text-[10px] font-mono font-black ${selectedArchStep === idx ? 'text-dark-950/70' : 'text-zinc-500'}`}>
                STAGE {s.step}
              </div>
              <div className="font-bold text-xs mt-1 truncate">{s.title}</div>
            </button>
          ))}
        </div>

        {/* Detail Box */}
        <div className="p-5 bg-dark-950 rounded-2xl border border-dark-800 flex items-start space-x-4">
          <div className="w-12 h-12 rounded-xl bg-lime text-dark-950 flex items-center justify-center font-black text-base font-mono flex-shrink-0">
            {architectureSteps[selectedArchStep].step}
          </div>
          <div>
            <h4 className="font-bold text-white text-base font-sans">{architectureSteps[selectedArchStep].title}</h4>
            <p className="text-zinc-300 text-xs mt-1 leading-relaxed">{architectureSteps[selectedArchStep].desc}</p>
          </div>
        </div>
      </section>

      {/* Battery Pack Geometry Schematic (Fig. 1) */}
      <section className="bento-card p-8 space-y-6">
        <div>
          <h3 className="text-2xl font-black text-white uppercase font-sans">
            Battery Pack & Micro-Channel Geometry (Fig. 1)
          </h3>
          <p className="text-xs text-zinc-400 mt-1">
            Cross-sectional schematic of 10× 21700 cells inside aluminum jacket with nanofluid channels.
          </p>
        </div>

        <div className="w-full bg-dark-950 p-6 rounded-2xl border border-dark-800 overflow-x-auto">
          <svg viewBox="0 0 700 240" className="w-full h-auto min-w-[620px]">
            {/* Aluminum Casing */}
            <rect x="30" y="20" width="640" height="200" rx="16" fill="#141417" stroke="#27272a" strokeWidth="2" />
            <text x="350" y="42" textAnchor="middle" fill="#b4f000" fontSize="11" fontWeight="bold" letterSpacing="1" fontFamily="sans-serif">
              MICRO-CHANNEL COOLING JACKET — 20 CHANNELS / COLUMN (Dh = 1.0 mm)
            </text>

            {/* In/Out markers */}
            <path d="M 40 120 L 70 120" stroke="#b4f000" strokeWidth="3" />
            <text x="55" y="105" textAnchor="middle" fill="#b4f000" fontSize="10" fontWeight="bold">Inlet (T_c1)</text>

            <path d="M 630 120 L 660 120" stroke="#f59e0b" strokeWidth="3" />
            <text x="645" y="105" textAnchor="middle" fill="#f59e0b" fontSize="10" fontWeight="bold">Outlet (T_c2)</text>

            {/* 10 Cells */}
            {[
              { id: 'C1', x: 100, y: 75, temp: '26.5°C' },
              { id: 'C2', x: 210, y: 75, temp: '27.8°C' },
              { id: 'C3', x: 320, y: 75, temp: '30.1°C' },
              { id: 'C4', x: 430, y: 75, temp: '33.4°C' },
              { id: 'C5', x: 540, y: 75, temp: '36.8°C (Hotspot)' },
              { id: 'C6', x: 540, y: 155, temp: '38.4°C (Hotspot)' },
              { id: 'C7', x: 430, y: 155, temp: '34.2°C' },
              { id: 'C8', x: 320, y: 155, temp: '30.5°C' },
              { id: 'C9', x: 210, y: 155, temp: '28.0°C' },
              { id: 'C10', x: 100, y: 155, temp: '26.8°C' },
            ].map((cell) => {
              const isHotspot = cell.id === 'C5' || cell.id === 'C6';
              return (
                <g key={cell.id} transform={`translate(${cell.x}, ${cell.y})`}>
                  <rect x="-35" y="-18" width="70" height="36" rx="18" fill={isHotspot ? '#3f0f15' : '#1f2e05'} stroke={isHotspot ? '#f43f5e' : '#b4f000'} strokeWidth="1.5" />
                  <circle cx="0" cy="0" r="14" fill={isHotspot ? '#e11d48' : '#84cc16'} />
                  <text x="0" y="4" textAnchor="middle" fill="#ffffff" fontSize="9" fontWeight="bold">
                    {cell.id}
                  </text>
                  <text x="0" y="26" textAnchor="middle" fill={isHotspot ? '#fda4af' : '#d9f99d'} fontSize="8" fontFamily="monospace">
                    {cell.temp}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
      </section>

      {/* 4 Navigation Cards */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div 
          onClick={() => setActiveTab('dashboard')}
          className="bento-card p-6 hover:border-lime/60 cursor-pointer transition-all duration-300 group"
        >
          <div className="w-10 h-10 rounded-xl bg-lime text-dark-950 flex items-center justify-center mb-4 group-hover:scale-110 transition font-black">
            <Activity className="w-5 h-5" />
          </div>
          <h4 className="text-base font-bold text-white group-hover:text-lime transition">
            Live Monitoring
          </h4>
          <p className="text-xs text-zinc-400 mt-2">
            Real-time thermal heatmap, multi-series Recharts live stream, sensor table, and anomaly alerts.
          </p>
        </div>

        <div 
          onClick={() => setActiveTab('ai')}
          className="bento-card p-6 hover:border-lime/60 cursor-pointer transition-all duration-300 group"
        >
          <div className="w-10 h-10 rounded-xl bg-lime text-dark-950 flex items-center justify-center mb-4 group-hover:scale-110 transition font-black">
            <Cpu className="w-5 h-5" />
          </div>
          <h4 className="text-base font-bold text-white group-hover:text-lime transition">
            AI & Optimization
          </h4>
          <p className="text-xs text-zinc-400 mt-2">
            Surrogate ML inference, SHAP feature importance, Pareto trade-off curves, and HITL approvals.
          </p>
        </div>

        <div 
          onClick={() => setActiveTab('twin')}
          className="bento-card p-6 hover:border-lime/60 cursor-pointer transition-all duration-300 group"
        >
          <div className="w-10 h-10 rounded-xl bg-lime text-dark-950 flex items-center justify-center mb-4 group-hover:scale-110 transition font-black">
            <Layers className="w-5 h-5" />
          </div>
          <h4 className="text-base font-bold text-white group-hover:text-lime transition">
            Digital Twin & CFD
          </h4>
          <p className="text-xs text-zinc-400 mt-2">
            3D Three.js pack visualizer, interactive refrigeration loop schematic, and filterable CFD dataset.
          </p>
        </div>

        <div 
          onClick={() => setActiveTab('reports')}
          className="bento-card p-6 hover:border-lime/60 cursor-pointer transition-all duration-300 group"
        >
          <div className="w-10 h-10 rounded-xl bg-lime text-dark-950 flex items-center justify-center mb-4 group-hover:scale-110 transition font-black">
            <FileText className="w-5 h-5" />
          </div>
          <h4 className="text-base font-bold text-white group-hover:text-lime transition">
            Reports & Validation
          </h4>
          <p className="text-xs text-zinc-400 mt-2">
            Predicted vs. CFD actual scatter plots, R² validation, immutable audit logs, and PDF/CSV export.
          </p>
        </div>

      </section>

    </div>
  );
};

export default Home;

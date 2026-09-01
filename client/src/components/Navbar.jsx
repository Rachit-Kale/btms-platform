// Navbar.jsx - Sleek Header Bar & Floating Bottom React Bits Dock Navigation

import React from 'react';
import { 
  Zap, 
  Activity, 
  Cpu, 
  Layers, 
  FileText, 
  Wifi, 
  Play, 
  Pause, 
  Flame,
  Radio,
  Sliders
} from 'lucide-react';
import { useTelemetry } from '../context/TelemetryContext';
import { Dock, DockItem, DockIcon, DockLabel } from './Dock';

const Navbar = ({ activeTab, setActiveTab }) => {
  const { telemetry, connected, isPaused, setIsPaused, injectAnomaly } = useTelemetry();

  const navItems = [
    { id: 'home', label: 'Overview', icon: Zap },
    { id: 'dashboard', label: 'Live Monitor', icon: Activity },
    { id: 'ai', label: 'AI & Optimization', icon: Cpu },
    { id: 'twin', label: 'Digital Twin', icon: Layers },
    { id: 'reports', label: 'Reports & Audit', icon: FileText },
  ];

  const safetyStatus = telemetry?.pack?.safetyStatus || 'OPTIMAL';

  return (
    <>
      {/* Top Header Bar */}
      <header className="sticky top-0 z-40 bg-[#09090b]/90 backdrop-blur-md border-b border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            
            {/* Left: Brand & Attribution */}
            <div className="flex items-center space-x-3.5 cursor-pointer" onClick={() => setActiveTab('home')}>
              <div className="w-10 h-10 rounded-2xl bg-lime flex items-center justify-center shadow-lime-sm text-zinc-950 font-black">
                <Zap className="w-5 h-5 text-zinc-950 fill-zinc-950" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="font-extrabold text-lg tracking-tight text-white uppercase font-sans">
                    BTMS <span className="text-lime font-black">Platform</span>
                  </span>
                  <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded-full bg-zinc-900 text-lime border border-zinc-800">
                    KJS-CES-02
                  </span>
                </div>
                <p className="text-[11px] text-zinc-400 font-medium">AI & Nanofluid Digital Twin</p>
              </div>
            </div>

            {/* Right: Operational Status & System Controls */}
            <div className="flex items-center space-x-3">
              
              {/* AI Surrogate Model Badge */}
              <div className="hidden xl:flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-zinc-900 text-[11px] font-mono text-zinc-300 border border-zinc-800">
                <Cpu className="w-3.5 h-3.5 text-lime" />
                <span>v1.0-CFD-XGBoost</span>
              </div>

              {/* Flow Regime Badge */}
              <div className="hidden md:flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-zinc-900 text-[11px] font-mono text-zinc-300 border border-zinc-800">
                <span className="text-zinc-500">Regime:</span>
                <span className="text-lime font-bold">Re {telemetry?.coolant?.reynolds || 550}</span>
              </div>

              {/* Global Safety Indicator Pill */}
              <div className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full text-xs font-mono font-bold border ${
                safetyStatus === 'OPTIMAL' 
                  ? 'bg-lime/10 text-lime border-lime/30' 
                  : safetyStatus === 'WARNING'
                  ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                  : 'bg-rose-500/10 text-rose-400 border-rose-500/30 animate-pulse'
              }`}>
                <div className={`w-2 h-2 rounded-full ${
                  safetyStatus === 'OPTIMAL' ? 'bg-lime' : safetyStatus === 'WARNING' ? 'bg-amber-400' : 'bg-rose-500'
                }`} />
                <span>{safetyStatus}</span>
              </div>

              {/* Socket Live Stream Status */}
              <div className="hidden sm:flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-zinc-900 text-[11px] font-mono text-zinc-300 border border-zinc-800">
                <span className={`w-2 h-2 rounded-full ${!connected ? 'bg-rose-500' : isPaused ? 'bg-amber-400' : 'bg-lime animate-ping'}`} />
                <span className={isPaused ? 'text-amber-400 font-bold' : ''}>{!connected ? 'OFFLINE' : isPaused ? 'PAUSED' : 'LIVE'}</span>
              </div>

              {/* Stream Play/Pause Toggle */}
              <button
                onClick={() => setIsPaused(!isPaused)}
                title={isPaused ? "Resume Live Stream" : "Pause Live Stream"}
                className={`p-2.5 rounded-full border transition ${
                  isPaused 
                    ? 'bg-amber-500/10 text-amber-400 border-amber-500/40 hover:bg-amber-500/20' 
                    : 'bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white border-zinc-800'
                }`}
              >
                {isPaused ? <Play className="w-3.5 h-3.5 text-amber-400 fill-amber-400" /> : <Pause className="w-3.5 h-3.5 text-zinc-300" />}
              </button>

              {/* Spike Anomaly Test Button */}
              <button
                onClick={() => injectAnomaly('TEMP_SPIKE')}
                title="Inject Thermal Spike Anomaly"
                className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs font-bold transition"
              >
                <Flame className="w-3.5 h-3.5" />
                <span className="hidden md:inline">Spike Test</span>
              </button>
            </div>

          </div>
        </div>
      </header>

      {/* Floating Bottom Navigation Dock (React Bits Dock) */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 pointer-events-auto">
        <Dock magnification={56} distance={130} panelHeight={56}>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <DockItem
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                isActive={isActive}
              >
                <DockIcon>
                  <Icon className={`w-4 h-4 ${isActive ? 'text-zinc-950 stroke-[2.5]' : 'text-zinc-300'}`} />
                </DockIcon>
                <DockLabel>{item.label}</DockLabel>
              </DockItem>
            );
          })}
        </Dock>
      </div>
    </>
  );
};

export default Navbar;

// SafetyBanner.jsx - High-Contrast Pack Thermal Status Banner

import React from 'react';
import { ShieldCheck, AlertTriangle, Flame } from 'lucide-react';
import { useTelemetry } from '../context/TelemetryContext';

const SafetyBanner = () => {
  const { telemetry } = useTelemetry();

  if (!telemetry || !telemetry.pack) return null;

  const { maxTemp, minTemp, deltaT, safetyStatus, hotspots } = telemetry.pack;
  const isOptimal = safetyStatus === 'OPTIMAL';
  const isWarning = safetyStatus === 'WARNING';
  const isCritical = safetyStatus === 'CRITICAL';

  return (
    <div className={`w-full py-2.5 px-4 sm:px-6 transition-all duration-300 border-b ${
      isCritical
        ? 'bg-rose-950/90 border-rose-600 text-rose-200'
        : isWarning
        ? 'bg-amber-950/80 border-amber-500/50 text-amber-200'
        : 'bg-dark-900 border-dark-800 text-zinc-300'
    }`}>
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs">
        
        {/* Status icon & Statement */}
        <div className="flex items-center space-x-3">
          {isCritical ? (
            <Flame className="w-5 h-5 text-rose-400 animate-bounce" />
          ) : isWarning ? (
            <AlertTriangle className="w-5 h-5 text-amber-400 animate-pulse" />
          ) : (
            <div className="w-5 h-5 rounded-full bg-lime/20 text-lime flex items-center justify-center">
              <ShieldCheck className="w-3.5 h-3.5 text-lime" />
            </div>
          )}

          <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-3">
            <span className="font-extrabold tracking-wide uppercase font-sans text-white">
              {isCritical ? 'CRITICAL THERMAL SPIKE' : isWarning ? 'GRADIENT WARNING' : '10-CELL PACK OPERATIONAL'}
            </span>
            <span className="text-[11px] text-zinc-400">
              {isCritical
                ? `Core temperature exceeds 42.0°C. Nanofluid cooling override engaged.`
                : isWarning
                ? `Pack thermal gradient ΔT = ${deltaT}°C exceeds target (< 5.0°C).`
                : `Active cooling at Re ${telemetry.coolant?.reynolds || 550}, ${telemetry.coolant?.concentration || 2.0} vol% Al₂O₃.`}
            </span>
          </div>
        </div>

        {/* Live Indicator Pills */}
        <div className="flex items-center space-x-3 font-mono text-xs">
          <div className="flex items-center space-x-1.5 bg-dark-950 px-3 py-1 rounded-full border border-dark-700">
            <span className="text-zinc-400">T_max:</span>
            <span className={`font-bold ${maxTemp > 38 ? 'text-rose-400' : 'text-lime'}`}>{maxTemp}°C</span>
          </div>

          <div className="flex items-center space-x-1.5 bg-dark-950 px-3 py-1 rounded-full border border-dark-700">
            <span className="text-zinc-400">ΔT:</span>
            <span className={`font-bold ${deltaT > 5.0 ? 'text-amber-400' : 'text-lime'}`}>{deltaT}°C</span>
            <span className="text-[10px] text-zinc-500">(&lt;5°C)</span>
          </div>

          {hotspots && hotspots.length > 0 && (
            <div className="hidden md:flex items-center space-x-1.5 bg-rose-950 text-rose-300 px-3 py-1 rounded-full border border-rose-800">
              <span>Hotspots:</span>
              <span className="font-bold">{hotspots.join(', ')}</span>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default SafetyBanner;

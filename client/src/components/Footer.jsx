// Footer.jsx - Deep Matte Black & Lime Project Footer (Matching Reference Image)

import React from 'react';
import { ExternalLink, CheckCircle, Zap } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="mt-20 border-t border-dark-800 bg-black text-zinc-400 text-xs py-14 overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Main Columns */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Col 1: Brand & Attribution */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center space-x-2.5">
              <div className="w-7 h-7 rounded-lg bg-lime flex items-center justify-center text-dark-950 font-black">
                <Zap className="w-4 h-4 text-dark-950 fill-dark-950" />
              </div>
              <span className="font-extrabold text-white text-base tracking-tight font-sans uppercase">
                BTMS <span className="text-lime">Platform</span>
              </span>
              <span className="bg-dark-900 text-lime px-2 py-0.5 rounded-full text-[10px] font-mono border border-dark-800 font-bold">
                KJS-CES-02
              </span>
            </div>

            <p className="text-zinc-400 text-xs leading-relaxed max-w-md">
              Translating advanced thermal CFD simulation, Al₂O₃/water nanofluid thermodynamics, 
              surrogate machine learning prediction, and digital twin monitoring into a modern 
              engineering operations platform for 21700 cylindrical EV battery packs.
            </p>

            <p className="text-[11px] text-zinc-500 font-mono">
              Source: Somaiya Vidyavihar University — Framework for AI Use Case Integration
            </p>
          </div>

          {/* Col 2: System Specs */}
          <div>
            <h4 className="font-bold text-white text-xs uppercase tracking-wider mb-3 font-sans">
              System Specifications
            </h4>
            <ul className="space-y-2 text-zinc-400 text-xs font-mono">
              <li className="flex items-center space-x-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-lime" />
                <span>10× 21700 Cylindrical Cells</span>
              </li>
              <li className="flex items-center space-x-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-lime" />
                <span>20 Microchannels / Column</span>
              </li>
              <li className="flex items-center space-x-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-lime" />
                <span>Dh = 1.0 mm Hydraulic Dia</span>
              </li>
              <li className="flex items-center space-x-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-lime" />
                <span>Re 400–700 (Laminar)</span>
              </li>
              <li className="flex items-center space-x-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-lime" />
                <span>Al₂O₃ / Water (0–5.0 vol%)</span>
              </li>
            </ul>
          </div>

          {/* Col 3: Governance */}
          <div>
            <h4 className="font-bold text-white text-xs uppercase tracking-wider mb-3 font-sans">
              Governance & Safety
            </h4>
            <ul className="space-y-2 text-zinc-400 text-xs">
              <li className="flex items-center space-x-2">
                <CheckCircle className="w-3.5 h-3.5 text-lime" />
                <span>Human-in-the-Loop Gate</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle className="w-3.5 h-3.5 text-lime" />
                <span>SHAP Explainability</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle className="w-3.5 h-3.5 text-lime" />
                <span>CFD Calibrated R² &gt; 0.98</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle className="w-3.5 h-3.5 text-lime" />
                <span>ISO 26262 Audit Trail</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-dark-800 flex flex-col sm:flex-row items-center justify-between text-[11px] text-zinc-500 font-mono">
          <p>© 2026 AI-Enabled BTMS Team • Somaiya Vidyavihar University.</p>
          <div className="flex items-center space-x-4 mt-3 sm:mt-0">
            <span>Model: v1.0-CFD-XGBoost</span>
            <span className="text-lime font-bold">Latency: &lt; 20ms</span>
            <span className="text-white">Status: Operational</span>
          </div>
        </div>

        {/* Big Watermark Title at very bottom matching image */}
        <div className="pt-6 select-none opacity-10 text-center font-black text-6xl sm:text-9xl text-white tracking-tighter uppercase font-sans pointer-events-none">
          BTMS ONE
        </div>

      </div>
    </footer>
  );
};

export default Footer;

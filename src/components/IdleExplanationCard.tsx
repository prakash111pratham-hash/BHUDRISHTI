import React from 'react';
import { Zap, Eye, ArrowRight, Sparkles } from 'lucide-react';

interface IdleExplanationCardProps {
  onQuickStart: () => void;
}

export const IdleExplanationCard: React.FC<IdleExplanationCardProps> = ({ onQuickStart }) => {
  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-3">
      <div
        data-testid="idle_explanation_card"
        className="bg-[#0C172A] rounded-2xl border border-[#182C4D] p-5 md:p-6 shadow-xl text-white"
      >
        <div className="flex items-center gap-3 mb-3">
          <div className="w-11 h-11 rounded-xl overflow-hidden border border-[#00B0FF]/60 bg-[#0A1628] flex-shrink-0 flex items-center justify-center shadow-[0_0_10px_rgba(0,176,255,0.3)]">
            <img
              src="/assets/img_india_sat_scan.jpg"
              alt="BHUदृष्टि India Satellite Logo"
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <h3 className="text-[16px] font-bold text-white flex items-center gap-2">
              <span>BHUदृष्टि (Earth-Vision AI)</span>
              <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-[#00E5FF]/10 text-[#00E5FF] border border-[#00E5FF]/30 font-bold">
                LEVEL-2A BOA READY
              </span>
            </h3>
            <p className="text-[11px] font-semibold text-[#00E5FF] font-mono">
              Copernicus Sentinel-2 & ISRO Multi-Spectral Remote Sensing
            </p>
          </div>
        </div>

        <p className="text-[13px] leading-relaxed text-slate-300 mb-4">
          Multi-spectral orbital satellite imagery captures vital surface dynamics across agriculture,
          urban boundaries, and water bodies. BHUदृष्टि processes high-resolution orthophoto rasters
          into Level-2A Earth Observation reports with biophysical indices (NDVI, NDWI, NDBI, LST) and
          Google Maps ground truth synchronization.
        </p>

        {/* Feature Badges */}
        <div className="grid grid-cols-2 gap-3 mb-5">
          <div className="flex items-center gap-2 bg-[#101F38] border border-[#182C4D] rounded-xl p-2.5">
            <Zap className="w-4 h-4 text-[#00E676]" />
            <div>
              <span className="text-[11px] font-bold text-[#00E676] block">Zero GPU VRAM</span>
              <span className="text-[10px] text-slate-400">Client-grounded inference</span>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-[#101F38] border border-[#182C4D] rounded-xl p-2.5">
            <Eye className="w-4 h-4 text-[#00E5FF]" />
            <div>
              <span className="text-[11px] font-bold text-[#00E5FF] block">Google Maps Grounding</span>
              <span className="text-[10px] text-slate-400">Authentic geospatial coords</span>
            </div>
          </div>
        </div>

        {/* Quick Start Button */}
        <button
          onClick={onQuickStart}
          data-testid="quick_start_analysis_button"
          className="w-full h-11 bg-gradient-to-r from-[#0088D1] to-[#00B0FF] hover:from-[#0077B6] hover:to-[#0088D1] text-white rounded-xl font-bold text-[13px] flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(0,176,255,0.4)] transition-all cursor-pointer"
        >
          <Sparkles className="w-4 h-4" />
          <span>Generate Level-2A Earth Observation Report</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

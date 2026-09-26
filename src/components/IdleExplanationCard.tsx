import React from 'react';
import { Zap, Eye, ArrowRight } from 'lucide-react';

interface IdleExplanationCardProps {
  onQuickStart: () => void;
}

export const IdleExplanationCard: React.FC<IdleExplanationCardProps> = ({ onQuickStart }) => {
  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-3">
      <div
        data-testid="idle_explanation_card"
        className="bg-white rounded-2xl border border-[#D0E4F8] p-5 md:p-6 shadow-sm"
      >
        <div className="flex items-center gap-3 mb-3">
          <div className="w-11 h-11 rounded-xl overflow-hidden border border-[#0288D1]/60 bg-white flex-shrink-0">
            <img
              src="/assets/img_bhu_drishti_icon.jpg"
              alt="BHUदृष्टि Logo"
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <h3 className="text-[16px] font-bold text-[#0A2239]">
              BHUदृष्टि (Earth-Vision AI)
            </h3>
            <p className="text-[11px] font-semibold text-[#0288D1]">
              Vision-Language Remote Sensing
            </p>
          </div>
        </div>

        <p className="text-[13px] leading-relaxed text-[#43607E] mb-4">
          Multi-spectral orbital satellite imagery captures vital surface dynamics across agriculture,
          urban boundaries, and water bodies. BHUदृष्टि processes high-resolution orthophoto rasters
          into Level-2A Earth Observation reports with biophysical indices (NDVI, NDWI, NDBI, LST) and
          Google Maps ground truth synchronization.
        </p>

        {/* Feature Badges */}
        <div className="grid grid-cols-2 gap-3 mb-5">
          <div className="flex items-center gap-2 bg-[#F0F7FF] border border-[#D0E4F8] rounded-xl p-2.5">
            <Zap className="w-4 h-4 text-[#2E7D32]" />
            <div>
              <span className="text-[11px] font-bold text-[#2E7D32] block">Zero GPU VRAM</span>
              <span className="text-[10px] text-[#708FAE]">Client-grounded inference</span>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-[#F0F7FF] border border-[#D0E4F8] rounded-xl p-2.5">
            <Eye className="w-4 h-4 text-[#0288D1]" />
            <div>
              <span className="text-[11px] font-bold text-[#0288D1] block">Maps Grounding</span>
              <span className="text-[10px] text-[#708FAE]">Geospatial coordinates</span>
            </div>
          </div>
        </div>

        {/* Quick Start Button */}
        <button
          onClick={onQuickStart}
          data-testid="quick_start_analysis_button"
          className="w-full h-11 bg-[#0288D1] hover:bg-[#0277BD] text-white rounded-xl font-bold text-[13px] flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
        >
          <span>Generate Earth Observation Report</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

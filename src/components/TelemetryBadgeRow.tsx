import React from 'react';
import { Cpu, Radio, Sparkles, Layers } from 'lucide-react';

interface TelemetryBadgeRowProps {
  gsdResolution: string;
  spectralModeLabel: string;
}

export const TelemetryBadgeRow: React.FC<TelemetryBadgeRowProps> = ({
  gsdResolution,
  spectralModeLabel
}) => {
  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-2 flex items-center gap-2 overflow-x-auto text-[11px] select-none scrollbar-none">
      {/* Zero GPU load badge - CSS selector 1 */}
      <div className="flex items-center gap-1.5 bg-white border border-[#2E7D32]/40 rounded-xl px-3 py-1.5 shadow-2xs flex-shrink-0 transition-all hover:border-[#2E7D32]">
        <span className="w-2 h-2 rounded-full bg-[#2E7D32] animate-pulse" />
        <Cpu className="w-3.5 h-3.5 text-[#2E7D32]" />
        <span className="font-semibold text-[#2E7D32] tracking-wide font-mono">0 MB Local GPU</span>
      </div>

      {/* GSD Resolution - CSS selector 2 */}
      <div className="flex items-center gap-1.5 bg-white border border-[#0288D1]/40 rounded-xl px-3 py-1.5 shadow-2xs flex-shrink-0 transition-all hover:border-[#0288D1]">
        <Radio className="w-3.5 h-3.5 text-[#0288D1]" />
        <span className="font-semibold text-[#0288D1] font-mono tracking-tight">GSD {gsdResolution}</span>
      </div>

      {/* Cloud Vision Encoded - CSS selector 3 */}
      <div className="flex items-center gap-1.5 bg-white border border-[#E65100]/40 rounded-xl px-3 py-1.5 shadow-2xs flex-shrink-0 transition-all hover:border-[#E65100]">
        <Sparkles className="w-3.5 h-3.5 text-[#E65100]" />
        <span className="font-semibold text-[#E65100] tracking-tight">Gemini 3.8 Flash Vision</span>
      </div>

      {/* Current Band Label - CSS selector 4 */}
      <div className="flex items-center gap-1.5 bg-[#F0F7FF] border border-[#0288D1]/30 rounded-xl px-3 py-1.5 text-[#0A2239] font-medium flex-shrink-0 truncate transition-all hover:border-[#0288D1]">
        <Layers className="w-3.5 h-3.5 text-[#0288D1]" />
        <span className="font-mono text-[11px] text-[#43607E]">Band: <strong className="text-[#0288D1]">{spectralModeLabel}</strong></span>
      </div>
    </div>
  );
};

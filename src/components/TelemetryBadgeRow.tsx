import React from 'react';
import { Cpu, Radio, Sparkles, Layers, SlidersHorizontal } from 'lucide-react';

interface TelemetryBadgeRowProps {
  gsdResolution: string;
  spectralModeLabel: string;
  showSplitLens?: boolean;
  onToggleSplitLens?: () => void;
}

export const TelemetryBadgeRow: React.FC<TelemetryBadgeRowProps> = ({
  gsdResolution,
  spectralModeLabel,
  showSplitLens,
  onToggleSplitLens
}) => {
  return (
    <div className="w-full max-w-[1520px] mx-auto px-4 py-2 flex items-center justify-between gap-2 overflow-x-auto text-[11px] select-none scrollbar-none">
      {/* Left Badges Group */}
      <div className="flex items-center gap-2 flex-shrink-0">
        {/* Zero GPU load badge */}
        <div className="flex items-center gap-1.5 bg-[#0A1628] border border-[#00E676]/40 rounded-lg px-2.5 py-1 shadow-xs transition-all">
          <span className="w-1.5 h-1.5 rounded-full bg-[#00E676] animate-pulse" />
          <Cpu className="w-3.5 h-3.5 text-[#00E676]" />
          <span className="font-semibold text-[#00E676] tracking-wide font-mono">0 MB Local GPU</span>
        </div>

        {/* GSD Resolution */}
        <div className="flex items-center gap-1.5 bg-[#0A1628] border border-[#00B0FF]/40 rounded-lg px-2.5 py-1 shadow-xs transition-all">
          <Radio className="w-3.5 h-3.5 text-[#00B0FF]" />
          <span className="font-semibold text-[#00B0FF] font-mono tracking-tight">GSD {gsdResolution}</span>
        </div>

        {/* Cloud Vision Model Badge */}
        <div className="flex items-center gap-1.5 bg-[#0A1628] border border-[#FF8F00]/40 rounded-lg px-2.5 py-1 shadow-xs transition-all">
          <Sparkles className="w-3.5 h-3.5 text-[#FF8F00]" />
          <span className="font-semibold text-[#FF8F00] tracking-tight">Gemini 2.5 Flash (Vision)</span>
        </div>

        {/* Current Band Label */}
        <div className="flex items-center gap-1.5 bg-[#0A1628] border border-[#00B0FF]/30 rounded-lg px-2.5 py-1 text-slate-200 font-medium flex-shrink-0 truncate">
          <Layers className="w-3.5 h-3.5 text-[#00B0FF]" />
          <span className="font-mono text-[11px] text-slate-300">
            Band: <strong className="text-[#00E5FF]">{spectralModeLabel}</strong>
          </span>
        </div>
      </div>

      {/* Right Action: Open Split-Lens Spectral Slider */}
      {onToggleSplitLens && (
        <button
          onClick={onToggleSplitLens}
          className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs sm:text-sm font-bold border-2 transition-all cursor-pointer flex-shrink-0 active:scale-95 shadow-md ${
            showSplitLens
              ? 'bg-[#7C4DFF] text-white border-[#B388FF] shadow-[0_0_18px_rgba(124,77,255,0.6)]'
              : 'bg-[#101F38] text-[#B388FF] border-[#7C4DFF]/60 hover:bg-[#7C4DFF]/25 hover:border-[#B388FF]'
          }`}
          title="Toggle interactive side-by-side dual band comparison slider"
        >
          <SlidersHorizontal className="w-4 h-4 text-[#B388FF]" />
          <span>{showSplitLens ? '✕ Close Split-Lens Slider' : 'Open Split-Lens Spectral Slider'}</span>
        </button>
      )}
    </div>
  );
};

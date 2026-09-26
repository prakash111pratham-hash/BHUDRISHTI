import React from 'react';
import { SPECTRAL_MODES, SpectralBandModeKey } from '../types';

interface SpectralModeSelectorProps {
  selectedMode: SpectralBandModeKey;
  onModeSelected: (mode: SpectralBandModeKey) => void;
}

export const SpectralModeSelector: React.FC<SpectralModeSelectorProps> = ({
  selectedMode,
  onModeSelected
}) => {
  const currentModeInfo = SPECTRAL_MODES[selectedMode];

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-2">
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-[11px] font-bold text-[#708FAE] tracking-wider uppercase">
          SPECTRAL BAND SIMULATION
        </span>
        <span className="text-[11px] font-mono font-medium text-[#0288D1]">
          {currentModeInfo.bandCombination}
        </span>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
        {(Object.keys(SPECTRAL_MODES) as SpectralBandModeKey[]).map((key) => {
          const mode = SPECTRAL_MODES[key];
          const isSelected = selectedMode === key;

          return (
            <button
              key={key}
              onClick={() => onModeSelected(key)}
              data-testid={`spectral_mode_${key.toLowerCase()}`}
              className={`flex-shrink-0 px-3.5 py-2 rounded-xl text-left border transition-all ${
                isSelected
                  ? 'bg-[#0288D1]/12 border-[#0288D1] shadow-xs'
                  : 'bg-white border-[#D0E4F8] hover:border-[#0288D1]/50'
              }`}
            >
              <div
                className={`text-[12px] font-semibold ${
                  isSelected ? 'text-[#0288D1]' : 'text-[#0A2239]'
                }`}
              >
                {mode.label}
              </div>
              <div className="text-[10px] text-[#708FAE] font-mono mt-0.5">
                {mode.bandCombination}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

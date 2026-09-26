import React from 'react';
import { Globe, Key, Bookmark } from 'lucide-react';

interface NavbarProps {
  savedCount: number;
  hasCustomKey: boolean;
  onOpenCinematic: () => void;
  onOpenApiKey: () => void;
  onOpenHistory: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  savedCount,
  hasCustomKey,
  onOpenCinematic,
  onOpenApiKey,
  onOpenHistory
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#D0E4F8] px-4 py-3 shadow-xs">
      <div className="max-w-5xl mx-auto flex items-center justify-between">
        {/* Brand identity */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg overflow-hidden border border-[#0288D1]/60 shadow-xs flex-shrink-0 bg-white">
            <img
              src="/assets/img_bhu_drishti_icon.jpg"
              alt="BHUदृष्टि Logo"
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="text-[17px] font-bold tracking-tight text-[#0A2239] leading-tight">
                BHUदृष्टि
              </h1>
              <span className="text-[10px] font-semibold text-[#0288D1] bg-[#0288D1]/10 px-1.5 py-0.5 rounded-sm">
                v1.0
              </span>
            </div>
            <p className="text-[10px] text-[#708FAE] font-medium leading-none mt-0.5">
              Earth-Vision AI • Satellite Telemetry
            </p>
          </div>
        </div>

        {/* Action icons */}
        <div className="flex items-center gap-1">
          {/* Re-launch cinematic opening */}
          <button
            onClick={onOpenCinematic}
            data-testid="launch_cinematic_opening_button"
            className="p-2 rounded-lg text-[#0288D1] hover:bg-[#F0F7FF] transition-colors relative"
            title="Cinematic Opening Scan"
            aria-label="Cinematic Opening Scan"
          >
            <Globe className="w-5 h-5" />
          </button>

          {/* API Key settings */}
          <button
            onClick={onOpenApiKey}
            data-testid="open_api_key_dialog_button"
            className={`p-2 rounded-lg transition-colors ${
              hasCustomKey
                ? 'text-[#2E7D32] hover:bg-[#E8F5E9]'
                : 'text-[#0288D1] hover:bg-[#F0F7FF]'
            }`}
            title="Gemini API Configuration"
            aria-label="API Key Configuration"
          >
            <Key className="w-5 h-5" />
          </button>

          {/* Saved analyses */}
          <button
            onClick={onOpenHistory}
            data-testid="open_history_sheet_button"
            className="p-2 rounded-lg text-[#43607E] hover:bg-[#F0F7FF] transition-colors relative"
            title="Saved Analyses"
            aria-label="Saved Analyses"
          >
            <Bookmark className="w-5 h-5" />
            {savedCount > 0 && (
              <span className="absolute top-1 right-1 bg-[#0288D1] text-white text-[9px] font-bold px-1.5 py-0.2 rounded-full min-w-[16px] text-center shadow-xs">
                {savedCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};

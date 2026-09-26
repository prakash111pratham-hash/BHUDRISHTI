import React, { useState } from 'react';
import {
  Globe,
  Key,
  Bookmark,
  Hammer,
  Compass,
  Clock,
  FileText,
  Bot,
  SlidersHorizontal,
  X,
  Radar,
  Sparkles,
  ChevronRight
} from 'lucide-react';
import { ActivePage } from '../types';

interface NavbarProps {
  activePage: ActivePage;
  onSelectPage: (page: ActivePage) => void;
  savedCount: number;
  hasCustomKey: boolean;
  onOpenCinematic: () => void;
  onOpenApiKey: () => void;
  onOpenHistory: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activePage,
  onSelectPage,
  savedCount,
  hasCustomKey,
  onOpenCinematic,
  onOpenApiKey,
  onOpenHistory
}) => {
  const [isHammerDrawerOpen, setIsHammerDrawerOpen] = useState<boolean>(false);

  const pages = [
    {
      id: 'CONSOLE' as ActivePage,
      label: 'Mission Console',
      icon: Compass,
      desc: 'Satellite Viewport, Split-Lens, Tap-to-Inspect, Query Bar'
    },
    {
      id: 'TEMPORAL' as ActivePage,
      label: 'Temporal Lab',
      icon: Clock,
      desc: '3D Time-Lapse & Environmental Simulator (Flood / Drought / Sprawl)'
    },
    {
      id: 'DOSSIER' as ActivePage,
      label: 'Intelligence Dossier',
      icon: FileText,
      desc: 'Exportable Classified Dossier Card & Voice Audio Briefing'
    },
    {
      id: 'ASSISTANTS' as ActivePage,
      label: 'Orbital Assistants',
      icon: Bot,
      desc: 'Rover Drishti-1 Robot Chatbot & Multi-Year Re-Visit Comparator'
    }
  ];

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#D0E4F8] px-4 py-2.5 shadow-xs">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-2">
          {/* Brand Identity */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl overflow-hidden border border-[#0288D1]/60 shadow-xs flex-shrink-0 bg-white">
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
                <span className="text-[10px] font-semibold text-[#0288D1] bg-[#0288D1]/10 px-1.5 py-0.5 rounded-md font-mono">
                  PRO
                </span>
              </div>
              <p className="text-[10px] text-[#708FAE] font-medium leading-none mt-0.5">
                ISRO & Sentinel Remote Sensing AI
              </p>
            </div>
          </div>

          {/* Center Page Tabs (Desktop) */}
          <nav className="hidden lg:flex items-center gap-1 bg-[#F0F7FF] p-1 rounded-xl border border-[#D0E4F8]">
            {pages.map((p) => {
              const Icon = p.icon;
              const isActive = activePage === p.id;
              return (
                <button
                  key={p.id}
                  onClick={() => onSelectPage(p.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#0288D1] text-white shadow-xs'
                      : 'text-[#43607E] hover:text-[#0A2239] hover:bg-white/60'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{p.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Action Icons including Hammer */}
          <div className="flex items-center gap-1.5">
            {/* The User-Requested HAMMER Button for rapid page navigation */}
            <button
              onClick={() => setIsHammerDrawerOpen(true)}
              className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition-all cursor-pointer hover:scale-105 active:scale-95"
              title="Mission Operations Hammer: Jump to any page"
            >
              <Hammer className="w-4 h-4" />
              <span className="hidden sm:inline font-mono">Operations Hammer</span>
            </button>

            {/* Re-launch 3D Cinematic Opening Screen */}
            <button
              onClick={onOpenCinematic}
              data-testid="launch_cinematic_opening_button"
              className="p-2 rounded-xl text-[#0288D1] hover:bg-[#F0F7FF] transition-colors relative"
              title="Play 3D Earth Cinematic Loading Screen"
              aria-label="Cinematic Opening Scan"
            >
              <Globe className="w-4.5 h-4.5" />
            </button>

            {/* API Key Settings */}
            <button
              onClick={onOpenApiKey}
              className={`p-2 rounded-xl transition-colors relative ${
                hasCustomKey ? 'text-[#2E7D32] hover:bg-[#E8F5E9]' : 'text-[#708FAE] hover:bg-[#F0F7FF]'
              }`}
              title="Custom Gemini API Key"
              aria-label="API Key Settings"
            >
              <Key className="w-4.5 h-4.5" />
            </button>

            {/* Saved Missions Drawer */}
            <button
              onClick={onOpenHistory}
              className="p-2 rounded-xl text-[#0288D1] hover:bg-[#F0F7FF] transition-colors relative"
              title="Mission History Archive"
              aria-label="Saved Analyses"
            >
              <Bookmark className="w-4.5 h-4.5" />
              {savedCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-[#E65100] text-white rounded-full text-[9px] font-bold flex items-center justify-center">
                  {savedCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Page Switcher Ribbon (Below header on small screens) */}
        <div className="lg:hidden flex items-center gap-1 overflow-x-auto pt-2 scrollbar-none">
          {pages.map((p) => {
            const Icon = p.icon;
            const isActive = activePage === p.id;
            return (
              <button
                key={p.id}
                onClick={() => onSelectPage(p.id)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold flex items-center gap-1 flex-shrink-0 transition-all ${
                  isActive
                    ? 'bg-[#0288D1] text-white shadow-xs'
                    : 'bg-[#F0F7FF] text-[#43607E] border border-[#D0E4F8]'
                }`}
              >
                <Icon className="w-3 h-3" />
                <span>{p.label}</span>
              </button>
            );
          })}
        </div>
      </header>

      {/* OPERATIONS HAMMER MODAL DRAWER */}
      {isHammerDrawerOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border-2 border-orange-400 rounded-3xl p-6 max-w-lg w-full shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            {/* Hammer Header */}
            <div className="flex items-center justify-between pb-4 border-b border-[#E3F2FD]">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 text-white shadow-md">
                  <Hammer className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-[#0A2239] flex items-center gap-2">
                    <span>Mission Operations Hammer</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-orange-100 text-orange-800">
                      RAPID LAUNCHER
                    </span>
                  </h3>
                  <p className="text-xs text-[#708FAE]">
                    Switch between all 4 specialized geospatial intelligence workstations
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsHammerDrawerOpen(false)}
                className="p-2 rounded-xl text-[#708FAE] hover:bg-[#F0F7FF] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Workstation Options */}
            <div className="space-y-2.5 py-4">
              {pages.map((p) => {
                const Icon = p.icon;
                const isSelected = activePage === p.id;
                return (
                  <button
                    key={p.id}
                    onClick={() => {
                      onSelectPage(p.id);
                      setIsHammerDrawerOpen(false);
                    }}
                    className={`w-full p-3.5 rounded-2xl border text-left flex items-center justify-between gap-3 transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#E0F2FE] border-[#0288D1] shadow-xs'
                        : 'bg-[#F8FAFC] border-[#E2E8F0] hover:bg-[#F0F7FF] hover:border-[#D0E4F8]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`p-2.5 rounded-xl ${
                          isSelected ? 'bg-[#0288D1] text-white' : 'bg-white text-[#0288D1] shadow-2xs'
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="font-bold text-xs text-[#0A2239] flex items-center gap-1.5">
                          <span>{p.label}</span>
                          {isSelected && (
                            <span className="text-[9px] font-mono font-bold text-[#0288D1] bg-[#0288D1]/10 px-1.5 py-0.2 rounded-sm">
                              CURRENT
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-[#708FAE] mt-0.5 line-clamp-1">
                          {p.desc}
                        </div>
                      </div>
                    </div>

                    <ChevronRight className="w-4 h-4 text-[#708FAE]" />
                  </button>
                );
              })}
            </div>

            {/* Quick Actions Footer */}
            <div className="pt-3 border-t border-[#E3F2FD] flex items-center justify-between text-xs">
              <button
                onClick={() => {
                  setIsHammerDrawerOpen(false);
                  onOpenCinematic();
                }}
                className="text-[#0288D1] font-bold flex items-center gap-1 hover:underline"
              >
                <Globe className="w-3.5 h-3.5" />
                <span>Re-play 3D Earth Loading Screen</span>
              </button>

              <button
                onClick={() => setIsHammerDrawerOpen(false)}
                className="px-4 py-2 bg-[#0A2239] hover:bg-[#1E3A5F] text-white rounded-xl font-bold cursor-pointer transition-colors"
              >
                Close Hammer
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

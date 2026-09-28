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
  X,
  ChevronRight,
  Radar,
  Sparkles,
  Layers
} from 'lucide-react';
import { ActivePage } from '../types';

interface NavbarProps {
  activePage: ActivePage;
  onSelectPage: (page: ActivePage) => void;
  savedCount: number;
  hasCustomKey: boolean;
  onOpenCinematic?: () => void;
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
      <header className="sticky top-0 z-40 bg-[#08101E]/95 backdrop-blur-md border-b border-[#14233D] px-4 py-2.5 shadow-md">
        <div className="max-w-[1520px] mx-auto flex items-center justify-between gap-3">
          {/* Brand Identity: BHUदृष्टि */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full overflow-hidden border border-[#00B0FF]/70 shadow-[0_0_10px_rgba(0,176,255,0.4)] flex-shrink-0 bg-[#0A1628] flex items-center justify-center">
              <img
                src="/assets/img_india_sat_scan.jpg"
                alt="BHUदृष्टि India Satellite Logo"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex items-center gap-2">
              <h1 className="text-[17px] font-black tracking-wide text-white font-sans">
                BHUदृष्टि
              </h1>
              <span className="text-[9px] font-bold text-[#00E5FF] bg-[#00E5FF]/15 border border-[#00E5FF]/40 px-1.5 py-0.5 rounded font-mono">
                PRO
              </span>
            </div>
          </div>

          {/* Center Page Tabs */}
          <nav className="hidden lg:flex items-center gap-1.5 bg-[#0C172A] p-1 rounded-xl border border-[#182C4D]">
            {pages.map((p) => {
              const Icon = p.icon;
              const isActive = activePage === p.id;
              return (
                <button
                  key={p.id}
                  onClick={() => onSelectPage(p.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#0088D1] text-white shadow-[0_0_12px_rgba(0,136,209,0.5)]'
                      : 'text-slate-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{p.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Action Icons including 3-Line Menu (replacing Operations Hammer) */}
          <div className="flex items-center gap-2">
            {/* The 3-Line Menu Button matching user's screenshot with same functionality */}
            <button
              onClick={() => setIsHammerDrawerOpen(true)}
              className="p-2 rounded-xl bg-[#101F38] hover:bg-[#182C4D] border border-[#1C3660] hover:border-[#00E5FF]/50 transition-all cursor-pointer flex items-center justify-center shadow-xs active:scale-95"
              title="Workstation Launcher Menu"
              aria-label="Workstation Launcher Menu"
            >
              <div className="w-5 h-3.5 flex flex-col justify-between items-center">
                <span className="w-full h-[2.5px] bg-white rounded-full block" />
                <span className="w-full h-[2.5px] bg-white rounded-full block" />
                <span className="w-full h-[2.5px] bg-white rounded-full block" />
              </div>
            </button>

            {/* Saved Missions Drawer */}
            <button
              onClick={onOpenHistory}
              className="p-1.5 rounded-lg text-slate-300 hover:text-[#00E5FF] hover:bg-white/5 transition-colors relative"
              title="Mission History Archive"
              aria-label="Saved Analyses"
            >
              <Bookmark className="w-4 h-4" />
              {savedCount > 0 && (
                <span className="absolute top-0.5 right-0.5 w-3.5 h-3.5 bg-[#FF6F00] text-white rounded-full text-[8px] font-bold flex items-center justify-center">
                  {savedCount}
                </span>
              )}
            </button>

            {/* Replay Cinematic Video Opening */}
            {onOpenCinematic && (
              <button
                onClick={onOpenCinematic}
                className="p-1.5 rounded-lg text-slate-300 hover:text-[#00E5FF] hover:bg-white/5 transition-colors relative"
                title="Play BHUदृष्टि Opening Video"
                aria-label="Play Opening Video"
              >
                <Globe className="w-4 h-4" />
              </button>
            )}

            {/* API Key Settings */}
            <button
              onClick={onOpenApiKey}
              className={`p-1.5 rounded-lg transition-colors relative ${
                hasCustomKey
                  ? 'text-[#00E676] hover:bg-emerald-950/40'
                  : 'text-slate-300 hover:text-[#00E5FF] hover:bg-white/5'
              }`}
              title="Custom Gemini API Key"
              aria-label="API Key Settings"
            >
              <Key className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Mobile Page Switcher Ribbon */}
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
                    ? 'bg-[#0088D1] text-white shadow-xs'
                    : 'bg-[#0C172A] text-slate-300 border border-[#182C4D]'
                }`}
              >
                <Icon className="w-3 h-3" />
                <span>{p.label}</span>
              </button>
            );
          })}
        </div>
      </header>

      {/* WORKSTATION LAUNCHER MODAL DRAWER */}
      {isHammerDrawerOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0C172A] border border-[#00E5FF]/40 rounded-3xl p-6 max-w-lg w-full shadow-2xl text-white animate-in fade-in zoom-in-95 duration-200">
            {/* Drawer Header */}
            <div className="flex items-center justify-between pb-4 border-b border-[#1C3254]">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-[#0088D1] text-white shadow-lg flex items-center justify-center">
                  <div className="w-5 h-3.5 flex flex-col justify-between items-center">
                    <span className="w-full h-[2px] bg-white rounded-full block" />
                    <span className="w-full h-[2px] bg-white rounded-full block" />
                    <span className="w-full h-[2px] bg-white rounded-full block" />
                  </div>
                </div>
                <div>
                  <h3 className="font-bold text-base text-white flex items-center gap-2">
                    <span>BHUदृष्टि Workstations</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#00E5FF]/15 text-[#00E5FF] border border-[#00E5FF]/40">
                      RAPID LAUNCHER
                    </span>
                  </h3>
                  <p className="text-xs text-slate-400">
                    Switch between all 4 specialized geospatial intelligence workstations
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsHammerDrawerOpen(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
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
                        ? 'bg-[#0088D1]/20 border-[#00B0FF] shadow-[0_0_15px_rgba(0,176,255,0.2)]'
                        : 'bg-[#101F38] border-[#1C3254] hover:bg-[#162B4D] hover:border-[#284978]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`p-2.5 rounded-xl ${
                          isSelected ? 'bg-[#0088D1] text-white' : 'bg-[#0C172A] text-[#00E5FF]'
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="font-bold text-xs text-white flex items-center gap-1.5">
                          <span>{p.label}</span>
                          {isSelected && (
                            <span className="text-[9px] font-mono font-bold text-[#00E5FF] bg-[#00E5FF]/10 px-1.5 py-0.2 rounded-sm">
                              CURRENT
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">
                          {p.desc}
                        </div>
                      </div>
                    </div>

                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </button>
                );
              })}
            </div>

            {/* Quick Actions Footer */}
            <div className="pt-3 border-t border-[#1C3254] flex items-center justify-between text-xs">
              {onOpenCinematic ? (
                <button
                  onClick={() => {
                    setIsHammerDrawerOpen(false);
                    onOpenCinematic();
                  }}
                  className="text-[#00E5FF] font-bold flex items-center gap-1.5 hover:underline cursor-pointer"
                >
                  <Globe className="w-3.5 h-3.5" />
                  <span>Replay Opening Video</span>
                </button>
              ) : (
                <span className="text-slate-400 font-mono text-[11px]">
                  BHUदृष्टि Geospatial Systems Active
                </span>
              )}

              <button
                onClick={() => setIsHammerDrawerOpen(false)}
                className="px-4 py-2 bg-[#101F38] hover:bg-[#162B4D] text-white rounded-xl font-bold cursor-pointer transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

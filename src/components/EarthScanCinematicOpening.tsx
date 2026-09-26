import React, { useState, useEffect, useRef } from 'react';
import { ArrowRight, Crosshair, Radar, Volume2, VolumeX } from 'lucide-react';

interface EarthScanCinematicOpeningProps {
  onEnterApp: () => void;
}

export const EarthScanCinematicOpening: React.FC<EarthScanCinematicOpeningProps> = ({
  onEnterApp
}) => {
  const [progress, setProgress] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const [videoError, setVideoError] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    // Attempt autoplay
    if (videoRef.current) {
      videoRef.current.play().catch(() => {
        // Autoplay may require mute
        if (videoRef.current) {
          videoRef.current.muted = true;
          videoRef.current.play().catch(() => {});
        }
      });
    }

    const duration = 5000;
    const intervalTime = 50;
    const increment = 100 / (duration / intervalTime);

    const timer = setInterval(() => {
      setProgress((prev) => {
        const next = prev + increment;
        if (next >= 100) {
          clearInterval(timer);
          setTimeout(() => {
            onEnterApp();
          }, 700);
          return 100;
        }
        return next;
      });
    }, intervalTime);

    return () => clearInterval(timer);
  }, [onEnterApp]);

  const getPhaseText = (pct: number) => {
    const intPct = Math.min(100, Math.round(pct));
    if (intPct < 25) return `DOWNLINKING ORBITAL TELEMETRY... ${intPct}%`;
    if (intPct < 50) return `FOCUSING INDIAN SUBCONTINENT GRID... ${intPct}%`;
    if (intPct < 75) return `ACQUIRING 3D MULTI-SPECTRAL RASTER... ${intPct}%`;
    if (intPct < 100) return `CALIBRATING LEVEL-2A SENSOR MATRIX... ${intPct}%`;
    return 'MISSION READY • INITIALIZING CONSOLE';
  };

  return (
    <div
      data-testid="earth_scan_cinematic_opening"
      className="fixed inset-0 z-50 flex flex-col justify-between bg-black text-white select-none overflow-hidden"
    >
      {/* Background Video Player */}
      <div className="absolute inset-0 z-0">
        {!videoError ? (
          <video
            ref={videoRef}
            src="/assets/bhu_drishti_opening.mp4"
            poster="/assets/img_india_sat_scan.jpg"
            autoPlay
            loop
            muted={isMuted}
            playsInline
            onError={() => setVideoError(true)}
            className="w-full h-full object-cover opacity-90 scale-105"
          />
        ) : (
          <img
            src="/assets/img_india_sat_scan.jpg"
            alt="Earth Scan Opening"
            className="w-full h-full object-cover opacity-90 scale-105"
          />
        )}

        {/* Cinematic Vignette Overlay */}
        <div className="absolute inset-0 bg-radial from-transparent via-black/30 to-black/85 pointer-events-none" />
        
        {/* Subtle Orbital Coordinates Grid */}
        <div
          className="absolute inset-0 opacity-20 pointer-events-none"
          style={{
            backgroundImage:
              'linear-gradient(#00B0FF 1px, transparent 1px), linear-gradient(90deg, #00B0FF 1px, transparent 1px)',
            backgroundSize: '48px 48px'
          }}
        />
      </div>

      {/* Sweeping Laser Beam Animation */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-10">
        <div className="laser-scan-line absolute left-0 right-0 h-1 bg-[#00B0FF] shadow-[0_0_25px_#00B0FF,0_0_50px_#00B0FF]">
          <div className="absolute -top-16 left-0 right-0 h-16 bg-gradient-to-t from-[#00B0FF]/30 to-transparent" />
          <div className="absolute -bottom-16 left-0 right-0 h-16 bg-gradient-to-b from-[#00B0FF]/30 to-transparent" />
        </div>
      </div>

      {/* Top HUD Header */}
      <div className="relative z-20 p-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl overflow-hidden border border-[#00B0FF] bg-black/70 backdrop-blur-md shadow-lg shadow-[#00B0FF]/20">
            <img
              src="/assets/img_bhu_drishti_icon.jpg"
              alt="BHUदृष्टि Logo"
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <h1 className="text-[18px] font-bold tracking-wider text-white flex items-center gap-2">
              <span>BHUदृष्टि</span>
              <span className="text-[10px] font-mono text-[#00B0FF] border border-[#00B0FF]/50 px-1.5 py-0.5 rounded-sm">
                ORBITAL AI
              </span>
            </h1>
            <p className="text-[10px] text-[#00B0FF] font-mono tracking-widest uppercase">
              Earth-Vision Remote Sensing Downlink
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 font-mono text-[11px] text-[#00B0FF] bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-xl border border-[#00B0FF]/30">
            <Radar className="w-4 h-4 animate-spin text-[#00B0FF]" />
            <span>20.5937° N, 78.9629° E (INDIA GRID)</span>
          </div>

          <button
            onClick={() => setIsMuted(!isMuted)}
            className="p-2 rounded-xl bg-black/60 backdrop-blur-md border border-[#00B0FF]/30 text-[#00B0FF] hover:bg-[#00B0FF]/20 transition-colors"
            title={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Center Cinematic Title: "Bhu Drishti" matching uploaded video */}
      <div className="relative z-20 flex-1 flex flex-col items-center justify-center pointer-events-none px-4 text-center">
        {/* Outlined Stylized Typography from Video */}
        <div className="relative mb-3 animate-pulse">
          <div className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-white via-[#E0F2FE] to-white drop-shadow-[0_0_20px_rgba(0,176,255,0.8)] font-sans">
            Bhu Drishti
          </div>
          <div className="text-xs md:text-sm font-mono text-[#00B0FF] tracking-[0.4em] uppercase mt-2 drop-shadow-md">
            भू-दृष्टि • EARTH OBSERVATION SYNTHESIS
          </div>
        </div>

        {/* Reticle Targeting */}
        <div className="relative w-44 h-44 md:w-56 md:h-56 rounded-full border border-[#00B0FF]/30 flex items-center justify-center mt-2">
          <div className="w-24 h-24 rounded-full border border-dashed border-[#00B0FF]/60 animate-spin" style={{ animationDuration: '20s' }} />
          <Crosshair className="w-10 h-10 text-[#00B0FF] opacity-90" />
          <div className="absolute top-2 left-1/2 -translate-x-1/2 text-[9px] font-mono text-[#00B0FF] bg-black/60 px-2 py-0.5 rounded-full border border-[#00B0FF]/30">
            RADAR LOCK: ACTIVE
          </div>
        </div>
      </div>

      {/* Bottom Telemetry HUD and Action */}
      <div className="relative z-20 p-6 max-w-3xl mx-auto w-full">
        <div className="bg-black/80 backdrop-blur-lg border border-[#00B0FF]/40 rounded-2xl p-5 shadow-2xl">
          {/* Phase text */}
          <div className="flex items-center justify-between text-[12px] font-mono font-bold text-[#00B0FF] mb-2 tracking-wide">
            <span className="truncate">{getPhaseText(progress)}</span>
            <span className="ml-2 font-mono">{Math.round(progress)}%</span>
          </div>

          {/* Progress bar */}
          <div className="w-full h-2.5 rounded-full bg-white/20 overflow-hidden mb-4 shadow-inner">
            <div
              className="h-full bg-gradient-to-r from-[#00B0FF] via-[#00E676] to-[#00B0FF] transition-all duration-100 ease-out shadow-[0_0_12px_#00B0FF]"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Enter button */}
          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-2 text-[11px] text-white/70 font-mono hidden sm:flex">
              <span className="w-2 h-2 rounded-full bg-[#00E676] animate-ping" />
              <span>ISRO & Sentinel Sensor Stream Active</span>
            </div>

            <button
              onClick={onEnterApp}
              className="ml-auto px-6 py-2.5 bg-[#00B0FF] hover:bg-[#0288D1] text-white text-[12px] font-bold rounded-xl flex items-center gap-2 shadow-lg shadow-[#00B0FF]/40 transition-all cursor-pointer hover:scale-[1.02]"
            >
              <span>Enter Mission Console</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

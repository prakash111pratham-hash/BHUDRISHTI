import React, { useEffect, useRef, useState } from 'react';
import { ArrowRight, Radar, Terminal, Volume2, VolumeX, Shield, Crosshair } from 'lucide-react';
import { playMissionRadioChime } from '../utils/audioBriefing';

interface EarthScanCinematicOpeningProps {
  onEnterApp: () => void;
}

export const EarthScanCinematicOpening: React.FC<EarthScanCinematicOpeningProps> = ({
  onEnterApp
}) => {
  const [progress, setProgress] = useState<number>(0);
  const [isAudioMuted, setIsAudioMuted] = useState<boolean>(true);
  const [isVideoLoaded, setIsVideoLoaded] = useState<boolean>(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Auto-play the uploaded video
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(() => {
        // Autoplay policy fallback: mute and play
        if (videoRef.current) {
          videoRef.current.muted = true;
          videoRef.current.play().catch(() => {});
        }
      });
    }

    // 6.5s cinematic intro scan
    const duration = 6500;
    const intervalTime = 40;
    const increment = 100 / (duration / intervalTime);

    const timer = setInterval(() => {
      setProgress((prev) => {
        const next = prev + increment;
        if (next >= 100) {
          clearInterval(timer);
          playMissionRadioChime().catch(() => {});
          setTimeout(() => {
            onEnterApp();
          }, 800);
          return 100;
        }
        return next;
      });
    }, intervalTime);

    return () => clearInterval(timer);
  }, [onEnterApp]);

  const getStatusText = () => {
    const intPct = Math.min(100, Math.round(progress));
    if (intPct < 25) return `INITIALIZING SATELLITE TELEMETRY... ${intPct}%`;
    if (intPct < 55) return `DOWNLINKING 3D EARTH ROTATION MATRIX... ${intPct}%`;
    if (intPct < 85) return `SWEEP-SCANNING INDIAN SUBCONTINENT GRID... ${intPct}%`;
    if (intPct < 100) return `CALIBRATING LEVEL-2A SURFACE SENSORS... ${intPct}%`;
    return 'MISSION READY • LAUNCHING CONSOLE... 100%';
  };

  return (
    <div
      data-testid="earth_scan_cinematic_opening"
      className="fixed inset-0 z-50 flex flex-col justify-between bg-black text-white select-none overflow-hidden"
    >
      {/* 1. Main Background Video (The user's uploaded Earth rotation video) */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <video
          ref={videoRef}
          src="/assets/bhu_drishti_opening.mp4"
          poster="/assets/img_india_sat_scan.jpg"
          autoPlay
          loop
          muted={isAudioMuted}
          playsInline
          onLoadedData={() => setIsVideoLoaded(true)}
          className="w-full h-full object-cover scale-105"
        />

        {/* Cinematic Vignette Overlay */}
        <div className="absolute inset-0 bg-radial from-transparent via-black/25 to-black/85 pointer-events-none" />

        {/* Faint Digital Grid Lines */}
        <div
          className="absolute inset-0 opacity-15 pointer-events-none"
          style={{
            backgroundImage:
              'linear-gradient(#00E5FF 1px, transparent 1px), linear-gradient(90deg, #00E5FF 1px, transparent 1px)',
            backgroundSize: '54px 54px'
          }}
        />
      </div>

      {/* 2. Prominent Horizontal Glowing Scanning Beam (Neon Cyan Laser) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-10">
        <div
          className="laser-scan-line absolute left-0 right-0 h-1 bg-[#00E5FF] shadow-[0_0_25px_#00E5FF,0_0_50px_#00E5FF]"
          style={{
            boxShadow: '0 0 15px #00E5FF, 0 0 30px #00E5FF, 0 0 60px #00B0FF'
          }}
        >
          {/* Laser particle light trails */}
          <div className="absolute -top-16 left-0 right-0 h-16 bg-gradient-to-t from-[#00E5FF]/25 to-transparent pointer-events-none" />
          <div className="absolute -bottom-16 left-0 right-0 h-16 bg-gradient-to-b from-[#00E5FF]/25 to-transparent pointer-events-none" />

          {/* Running telemetry data along laser beam */}
          <div className="absolute -top-5 left-8 text-[9px] font-mono text-[#00E5FF] opacity-80 flex items-center gap-4">
            <span>SCAN_VECTOR: AZIMUTH 142.8°</span>
            <span className="hidden sm:inline">GSD: 0.3M/PX</span>
            <span className="hidden md:inline">BAND: B4-B3-B2 BOA</span>
            <span className="text-[#00E676]">20.5937° N, 78.9629° E</span>
          </div>
        </div>
      </div>

      {/* 3. Top Tech Overlay Header */}
      <div className="relative z-20 p-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl overflow-hidden border-2 border-[#00B0FF] bg-black/75 backdrop-blur-md shadow-[0_0_20px_rgba(0,176,255,0.4)] flex items-center justify-center">
            <img
              src="/assets/img_bhu_drishti_icon.jpg"
              alt="BHUदृष्टि Logo"
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-black tracking-widest text-white flex items-center gap-2 drop-shadow-[0_0_15px_rgba(0,176,255,0.8)]">
              <span>BHUदृष्टि</span>
              <span className="text-[10px] font-mono text-[#00E5FF] border border-[#00E5FF]/60 px-2 py-0.5 rounded-md bg-[#00E5FF]/10">
                Earth-Vision AI
              </span>
            </h1>
            <p className="text-[11px] text-[#00E5FF] font-mono tracking-widest uppercase">
              ISRO & Sentinel Autonomous Downlink
            </p>
          </div>
        </div>

        {/* Right HUD chips */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2.5 font-mono text-xs text-[#00E5FF] bg-black/70 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-[#00E5FF]/40 shadow-lg">
            <Radar className="w-4 h-4 animate-spin text-[#00E5FF]" />
            <span>ORBIT: 786 KM • INCLINATION: 98.6°</span>
          </div>

          <button
            onClick={() => {
              const newMuted = !isAudioMuted;
              setIsAudioMuted(newMuted);
              if (videoRef.current) {
                videoRef.current.muted = newMuted;
              }
            }}
            className="p-2.5 rounded-xl bg-black/70 backdrop-blur-md border border-[#00E5FF]/40 text-[#00E5FF] hover:bg-[#00E5FF]/20 transition-colors cursor-pointer"
            title={isAudioMuted ? 'Unmute Audio' : 'Mute Audio'}
          >
            {isAudioMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* 4. Center Outlined "Bhu Drishti" Title matching user's uploaded video */}
      <div className="relative z-20 flex-1 flex flex-col items-center justify-center pointer-events-none px-4 text-center">
        {/* Outlined Stylized Typography from Video Frame */}
        <div className="relative transform transition-transform duration-1000 scale-100 md:scale-105">
          <h2
            className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-serif font-light tracking-wide select-none drop-shadow-[0_0_30px_rgba(0,176,255,0.4)]"
            style={{
              WebkitTextStroke: '1.5px rgba(255, 255, 255, 0.88)',
              color: 'transparent',
              textShadow: '0 0 25px rgba(0, 176, 255, 0.5), 0 0 50px rgba(0, 176, 255, 0.2)'
            }}
          >
            Bhu Drishti
          </h2>

          <div className="text-xs sm:text-sm font-mono text-[#00E5FF] tracking-[0.35em] uppercase mt-2 opacity-90 drop-shadow-[0_0_10px_#00E5FF]">
            भू-दृष्टि • EARTH OBSERVATION SYNTHESIS
          </div>
        </div>

        {/* Targeting Reticle Rings */}
        <div className="relative w-48 h-48 md:w-60 md:h-60 rounded-full border border-[#00E5FF]/25 flex items-center justify-center mt-6">
          <div
            className="w-28 h-28 rounded-full border border-dashed border-[#00E5FF]/60 animate-spin"
            style={{ animationDuration: '22s' }}
          />
          <Crosshair className="w-8 h-8 text-[#00E5FF] opacity-90" />
          <div className="absolute top-2 left-1/2 -translate-x-1/2 text-[9px] font-mono text-[#00E5FF] bg-black/60 px-2.5 py-0.5 rounded-full border border-[#00E5FF]/30 whitespace-nowrap">
            RADAR LOCK: ACTIVE
          </div>
        </div>
      </div>

      {/* 5. Bottom Loading Telemetry Status Bar & Action */}
      <div className="relative z-20 p-6 max-w-4xl mx-auto w-full">
        <div className="bg-black/85 backdrop-blur-xl border border-[#00E5FF]/50 rounded-3xl p-6 shadow-[0_0_35px_rgba(0,176,255,0.25)]">
          {/* Neon Glow Status Title */}
          <div className="flex items-center justify-between text-xs md:text-sm font-mono font-bold text-[#00E5FF] mb-2.5 tracking-wider drop-shadow-[0_0_12px_#00E5FF]">
            <span className="flex items-center gap-2 truncate">
              <Terminal className="w-4 h-4 text-[#00E5FF] animate-pulse" />
              <span>{getStatusText()}</span>
            </span>
            <span className="font-mono text-base ml-2">{Math.round(progress)}%</span>
          </div>

          {/* Neon Glowing Progress Bar */}
          <div className="w-full h-3 rounded-full bg-slate-900 border border-[#00E5FF]/40 overflow-hidden mb-4 p-0.5 shadow-inner">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#00E5FF] via-[#00E676] to-[#00E5FF] transition-all duration-75 ease-out shadow-[0_0_15px_#00E5FF,0_0_30px_#00E676]"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Bottom Actions */}
          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-2 text-xs font-mono text-slate-300 hidden sm:flex">
              <span className="w-2.5 h-2.5 rounded-full bg-[#00E676] animate-ping" />
              <span>Level-2A Multi-Spectral Surface Synthesis Active</span>
            </div>

            <button
              onClick={onEnterApp}
              className="ml-auto px-6 py-3 bg-gradient-to-r from-[#0288D1] to-[#00B0FF] hover:from-[#0277BD] hover:to-[#0288D1] text-white text-xs md:text-sm font-bold rounded-2xl flex items-center gap-2.5 shadow-[0_0_20px_rgba(0,176,255,0.4)] transition-all cursor-pointer hover:scale-105 active:scale-95"
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

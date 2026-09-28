import React, { useRef, useState, useEffect } from 'react';
import { FastForward, Sparkles } from 'lucide-react';

interface EarthScanCinematicOpeningProps {
  onEnterApp: () => void;
}

export const EarthScanCinematicOpening: React.FC<EarthScanCinematicOpeningProps> = ({
  onEnterApp
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isShaking, setIsShaking] = useState<boolean>(false);
  const [flashStage, setFlashStage] = useState<'none' | 'flash' | 'fade'>('none');
  const [hasStarted, setHasStarted] = useState<boolean>(false);
  const flashTriggeredRef = useRef<boolean>(false);

  // Trigger the white flash and app entrance
  const executeWhiteFlashTransition = () => {
    if (flashTriggeredRef.current) return;
    flashTriggeredRef.current = true;

    // Phase 1: Pure white burst expands over viewport
    setFlashStage('flash');

    // Phase 2: Fade from white to reveal the dashboard cleanly
    setTimeout(() => {
      setFlashStage('fade');
      setTimeout(() => {
        onEnterApp();
      }, 650);
    }, 220);
  };

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Handle time updates to trigger shake in the last part and white flash before ending
    const handleTimeUpdate = () => {
      const currentTime = video.currentTime;
      const duration = video.duration || 6;

      // Shake effect kicks in during the intense spacecraft flyby (last ~1.8 seconds)
      if (currentTime >= 3.8 && currentTime < duration) {
        if (!isShaking) setIsShaking(true);
      }

      // White flash right as video concludes (~0.45s before end)
      if (duration > 0 && currentTime >= duration - 0.45) {
        executeWhiteFlashTransition();
      }
    };

    const handleVideoEnded = () => {
      executeWhiteFlashTransition();
    };

    const handlePlay = () => {
      setHasStarted(true);
    };

    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('ended', handleVideoEnded);
    video.addEventListener('play', handlePlay);

    // Auto-play attempt
    video.play().catch(() => {
      // If browser blocks autoplay with sound, it's muted anyway, but handle any edge case
      video.muted = true;
      video.play().catch(() => {});
    });

    // Keyboard shortcut to skip intro
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.key === ' ' || e.key === 'Enter') {
        executeWhiteFlashTransition();
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    // Failsafe timer (if video fails to load or stalled, automatically transition after 6.5s)
    const failsafeTimer = setTimeout(() => {
      executeWhiteFlashTransition();
    }, 6500);

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('ended', handleVideoEnded);
      video.removeEventListener('play', handlePlay);
      window.removeEventListener('keydown', handleKeyDown);
      clearTimeout(failsafeTimer);
    };
  }, []);

  return (
    <div
      className={`fixed inset-0 z-[100] flex items-center justify-center overflow-hidden select-none transition-colors duration-300 ${
        flashStage === 'fade' ? 'bg-transparent pointer-events-none' : 'bg-black'
      }`}
    >
      {/* High-Quality Video Container with Camera Shake in the final moments */}
      <div
        className={`relative w-full h-full flex items-center justify-center transition-transform duration-75 ${
          isShaking ? 'cinematic-shake' : ''
        }`}
      >
        <video
          ref={videoRef}
          src="/assets/bhu_drishti_opening.mp4"
          playsInline
          autoPlay
          muted
          preload="auto"
          className="w-full h-full object-cover object-center filter contrast-[1.04] brightness-[1.02]"
        />

        {/* Ambient Thruster Glow during shake */}
        {isShaking && (
          <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-amber-500/10 via-transparent to-cyan-500/10 mix-blend-screen animate-pulse" />
        )}

        {/* Cinematic Vignette Framing */}
        <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_120px_rgba(0,0,0,0.7)]" />
      </div>

      {/* Top Controls: Skip Button */}
      <div className="absolute top-6 right-6 z-20 flex items-center gap-3">
        <button
          onClick={executeWhiteFlashTransition}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-black/50 hover:bg-black/80 border border-white/20 hover:border-cyan-400 text-xs font-mono font-medium text-slate-200 hover:text-white backdrop-blur-md transition-all shadow-lg cursor-pointer group"
          title="Skip to Dashboard (Esc)"
        >
          <span>Skip Intro</span>
          <FastForward className="w-3.5 h-3.5 text-cyan-400 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>

      {/* Subtle Bottom Mission Telemetry Indicator */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 px-3.5 py-1 rounded-full bg-black/40 border border-white/10 backdrop-blur-md text-[11px] font-mono text-cyan-300/80 tracking-widest uppercase">
        <Sparkles className="w-3 h-3 text-cyan-400 animate-spin" />
        <span>BHUदृष्टि • ORBITAL INITIATION</span>
      </div>

      {/* Pure White Flash Transition Overlay */}
      {flashStage !== 'none' && (
        <div
          className={`fixed inset-0 z-[110] bg-white pointer-events-none transition-opacity ${
            flashStage === 'flash'
              ? 'opacity-100 duration-100 ease-in'
              : 'opacity-0 duration-700 ease-out'
          }`}
        />
      )}
    </div>
  );
};

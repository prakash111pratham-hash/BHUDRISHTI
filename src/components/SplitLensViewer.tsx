import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Eye, Layers, Compass, SlidersHorizontal, Maximize2 } from 'lucide-react';
import { SatelliteScene } from '../types';

interface SplitLensViewerProps {
  scene: SatelliteScene;
  onClose?: () => void;
}

export const SplitLensViewer: React.FC<SplitLensViewerProps> = ({ scene, onClose }) => {
  const [sliderPos, setSliderPos] = useState<number>(50); // percentage 0 to 100
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const updateDivider = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const pct = Math.max(5, Math.min(95, (x / rect.width) * 100));
    setSliderPos(pct);
  }, []);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    updateDivider(e.clientX);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    if (e.touches[0]) {
      updateDivider(e.touches[0].clientX);
    }
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      updateDivider(e.clientX);
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isDragging || !e.touches[0]) return;
      updateDivider(e.touches[0].clientX);
    };

    const handleEnd = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleEnd);
      window.addEventListener('touchmove', handleTouchMove, { passive: true });
      window.addEventListener('touchend', handleEnd);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleEnd);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleEnd);
    };
  }, [isDragging, updateDivider]);

  return (
    <div id="split-lens-section" className="w-full bg-[#0C172A] border-2 border-[#7C4DFF]/50 rounded-3xl p-4 md:p-5 shadow-[0_0_30px_rgba(124,77,255,0.25)] text-white animate-in fade-in duration-200">
      {/* Header bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#1C3254] mb-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-[#7C4DFF]/20 text-[#B388FF] border border-[#7C4DFF]/40">
            <SlidersHorizontal className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <span>Split-Lens Spectral Comparator</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#7C4DFF]/20 text-[#B388FF] border border-[#7C4DFF]/40">
                ACTIVE DUAL-BAND
              </span>
            </h3>
            <p className="text-[11px] text-slate-400">
              Drag the vertical divider to contrast True Color (RGB) against live False-Color NIR/NDVI Heatmap
            </p>
          </div>
        </div>

        {/* Legend & Close Button */}
        <div className="flex items-center gap-2.5">
          <div className="hidden sm:flex items-center gap-2 text-[10px] font-mono">
            <span className="flex items-center gap-1 text-[#00E676] bg-[#00E676]/10 px-2 py-0.5 rounded-md border border-[#00E676]/30 font-bold">
              <span className="w-2 h-2 rounded-full bg-[#00E676]" /> Canopy (NDVI)
            </span>
            <span className="flex items-center gap-1 text-[#00E5FF] bg-[#00E5FF]/10 px-2 py-0.5 rounded-md border border-[#00E5FF]/30 font-bold">
              <span className="w-2 h-2 rounded-full bg-[#00E5FF]" /> Water (NDWI)
            </span>
          </div>

          {onClose && (
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl bg-[#101F38] hover:bg-[#182C4D] text-slate-400 hover:text-white border border-[#1C3660] transition-colors cursor-pointer"
              title="Close Split-Lens View"
            >
              <span className="text-xs font-bold px-2 py-0.5 flex items-center gap-1">
                <span>✕ Close Slider</span>
              </span>
            </button>
          )}
        </div>
      </div>

      {/* Interactive Split-Lens Container */}
      <div
        ref={containerRef}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        className="relative w-full h-[320px] md:h-[420px] rounded-2xl overflow-hidden select-none cursor-ew-resize border border-[#1C3660] bg-[#030812] shadow-inner"
      >
        {/* Layer 2: False-Color NIR / NDVI Heatmap (Underneath, full width) */}
        <div className="absolute inset-0 w-full h-full overflow-hidden">
          <img
            src={scene.imageSrc}
            alt="False-Color Infrared NDVI Heatmap"
            className="w-full h-full object-cover"
            style={{
              filter: 'sepia(0.6) hue-rotate(290deg) saturate(2.8) contrast(1.25) brightness(1.05)'
            }}
            draggable={false}
          />

          {/* Right side HUD chip */}
          <div className="absolute top-3 right-3 bg-black/75 backdrop-blur-md border border-[#E65100]/60 rounded-xl px-2.5 py-1 text-[11px] font-mono text-white flex items-center gap-1.5 shadow-md">
            <span className="w-2 h-2 rounded-full bg-[#00E676] animate-pulse" />
            <span className="text-[#00E676] font-bold">NIR / NDVI Heatmap</span>
            <span className="text-white/60">({Math.round(100 - sliderPos)}%)</span>
          </div>
        </div>

        {/* Layer 1: True Color Natural Photo (Clipped on right by slider percentage) */}
        <div
          className="absolute inset-0 h-full overflow-hidden"
          style={{ width: `${sliderPos}%` }}
        >
          <div
            className="relative h-full"
            style={{
              width: containerRef.current ? `${containerRef.current.clientWidth}px` : '100vw'
            }}
          >
            <img
              src={scene.imageSrc}
              alt="True Color Natural Photo"
              className="w-full h-full object-cover"
              draggable={false}
            />

            {/* Left side HUD chip */}
            <div className="absolute top-3 left-3 bg-black/75 backdrop-blur-md border border-[#00B0FF]/60 rounded-xl px-2.5 py-1 text-[11px] font-mono text-white flex items-center gap-1.5 shadow-md">
              <span className="w-2 h-2 rounded-full bg-[#00B0FF]" />
              <span className="text-[#00B0FF] font-bold">True Color (RGB)</span>
              <span className="text-white/60">({Math.round(sliderPos)}%)</span>
            </div>
          </div>
        </div>

        {/* Vertical Divider Handle Line */}
        <div
          className="absolute top-0 bottom-0 w-[2px] bg-white shadow-[0_0_12px_#00B0FF,0_0_24px_#00B0FF] pointer-events-none"
          style={{ left: `${sliderPos}%` }}
        >
          {/* Centered Circular Grab Button */}
          <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-9 h-9 rounded-full bg-white text-[#0A2239] shadow-xl border-2 border-[#00B0FF] flex items-center justify-center font-bold text-xs pointer-events-auto cursor-ew-resize hover:scale-110 active:scale-95 transition-transform">
            <span className="text-[10px] tracking-tighter">◀▶</span>
          </div>

          {/* Top Divider Tag */}
          <div className="absolute top-2 -translate-x-1/2 bg-[#00B0FF] text-white text-[9px] font-mono font-bold px-1.5 py-0.5 rounded-sm shadow-sm whitespace-nowrap">
            {Math.round(sliderPos)}% SPLIT
          </div>
        </div>

        {/* Bottom Coordinates Chip */}
        <div className="absolute bottom-3 left-3 bg-black/70 backdrop-blur-md border border-white/20 rounded-lg px-2.5 py-1 text-[10px] font-mono text-white/90">
          <span>{scene.coordinates}</span>
          <span className="text-white/50 ml-2">• GSD {scene.gsdResolution}</span>
        </div>
      </div>

      {/* Preset Slider Position Buttons */}
      <div className="flex items-center justify-between gap-2 mt-3 pt-2 text-[11px]">
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setSliderPos(20)}
            className={`px-2.5 py-1 rounded-lg border font-mono transition-colors ${
              sliderPos === 20 ? 'bg-[#0288D1] text-white border-[#0288D1]' : 'bg-[#F0F7FF] text-[#0288D1] border-[#D0E4F8]'
            }`}
          >
            20% True Color
          </button>
          <button
            onClick={() => setSliderPos(50)}
            className={`px-2.5 py-1 rounded-lg border font-mono transition-colors ${
              sliderPos === 50 ? 'bg-[#0288D1] text-white border-[#0288D1]' : 'bg-[#F0F7FF] text-[#0288D1] border-[#D0E4F8]'
            }`}
          >
            50/50 Dual Lens
          </button>
          <button
            onClick={() => setSliderPos(80)}
            className={`px-2.5 py-1 rounded-lg border font-mono transition-colors ${
              sliderPos === 80 ? 'bg-[#0288D1] text-white border-[#0288D1]' : 'bg-[#F0F7FF] text-[#0288D1] border-[#D0E4F8]'
            }`}
          >
            80% True Color
          </button>
        </div>

        <span className="text-[11px] text-[#708FAE] font-mono hidden sm:inline">
          ISRO Cartosat / Sentinel-2 Coregistered
        </span>
      </div>
    </div>
  );
};

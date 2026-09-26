import React, { useState, useRef, useEffect } from 'react';
import { ZoomIn, ZoomOut, RotateCcw, Crosshair, Radar, Maximize2, Sparkles, CheckCircle2 } from 'lucide-react';
import { SatelliteScene, SpectralBandModeKey } from '../types';

interface SatelliteViewportProps {
  scene: SatelliteScene;
  spectralMode: SpectralBandModeKey;
  isRadarScanActive: boolean;
  onToggleRadarScan: () => void;
}

export const SatelliteViewport: React.FC<SatelliteViewportProps> = ({
  scene,
  spectralMode,
  isRadarScanActive,
  onToggleRadarScan
}) => {
  const [scale, setScale] = useState<number>(1);
  const [position, setPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [imageLoaded, setImageLoaded] = useState<boolean>(false);

  const containerRef = useRef<HTMLDivElement>(null);

  // Reset zoom and pan whenever target scene changes
  useEffect(() => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
    setImageLoaded(false);
  }, [scene.id]);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPosition({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const zoomFactor = 0.15;
    const newScale = e.deltaY < 0 ? Math.min(4.5, scale + zoomFactor) : Math.max(0.7, scale - zoomFactor);
    setScale(newScale);
  };

  const handleZoomIn = () => setScale((prev) => Math.min(4.5, prev + 0.3));
  const handleZoomOut = () => setScale((prev) => Math.max(0.7, prev - 0.3));
  const handleResetZoom = () => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  };

  // Spectral Band Filter simulation
  const getFilterStyle = (): React.CSSProperties => {
    switch (spectralMode) {
      case 'FALSE_COLOR_IR':
        return {
          filter: 'sepia(0.55) hue-rotate(295deg) saturate(2.4) contrast(1.15)'
        };
      case 'NDVI_CONTRAST':
        return {
          filter: 'saturate(2.2) contrast(1.2) brightness(1.05)'
        };
      case 'RADAR_SURFACE':
        return {
          filter: 'grayscale(1) contrast(1.5) brightness(0.92)'
        };
      case 'TRUE_COLOR':
      default:
        return {
          filter: 'none' // Raw authentic real sensor image
        };
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-2">
      <div
        ref={containerRef}
        data-testid="satellite_viewport"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
        className="relative w-full h-[340px] md:h-[420px] rounded-2xl overflow-hidden border-[1.5px] border-[#D0E4F8] bg-[#0A2239] shadow-md select-none cursor-grab active:cursor-grabbing"
      >
        {/* Real Interactive High-Resolution Satellite Image (CSS selector 5) */}
        <div
          className="w-full h-full transition-transform duration-75 ease-out flex items-center justify-center relative overflow-hidden"
          style={{
            transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
            transformOrigin: 'center center',
            willChange: 'transform'
          }}
        >
          <img
            src={scene.imageSrc}
            alt={scene.title}
            onLoad={() => setImageLoaded(true)}
            className="w-full h-full object-cover pointer-events-none select-none"
            style={{
              ...getFilterStyle(),
              imageRendering: 'auto'
            }}
            draggable={false}
          />
        </div>

        {/* Central Targeting Reticle */}
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
          <div className="relative w-14 h-14 flex items-center justify-center opacity-75">
            <div className="w-8 h-8 rounded-full border border-[#00B0FF] shadow-xs" />
            <div className="absolute w-10 h-[1.5px] bg-[#00B0FF]" />
            <div className="absolute h-10 w-[1.5px] bg-[#00B0FF]" />
            <div className="absolute -top-4 text-[9px] font-mono font-bold text-[#00B0FF] tracking-wider">
              CENTER TILE
            </div>
          </div>
        </div>

        {/* Radar Scanning Sweep Overlay */}
        {isRadarScanActive && (
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="radar-sweep-line absolute left-0 right-0 h-1 bg-[#00B0FF] shadow-[0_0_18px_#00B0FF,0_0_36px_#00B0FF]">
              <div className="absolute -top-12 left-0 right-0 h-12 bg-gradient-to-t from-[#00B0FF]/25 to-transparent pointer-events-none" />
            </div>
          </div>
        )}

        {/* Real Sensor Telemetry Chip (Top-Left) */}
        <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-md border border-[#D0E4F8] rounded-xl px-3 py-1.5 shadow-sm text-[10px] md:text-[11px] font-mono text-[#0A2239] max-w-[85%] truncate flex items-center gap-2">
          <CheckCircle2 className="w-3.5 h-3.5 text-[#2E7D32] flex-shrink-0" />
          <span className="font-bold text-[#0A2239]">{scene.coordinates}</span>
          <span className="text-[#708FAE] hidden sm:inline">• {scene.satellitePlatform}</span>
          <span className="text-[#0288D1] font-semibold hidden md:inline">• REAL ORTHOPHOTO</span>
        </div>

        {/* Viewport Control Bar (Bottom-Right) */}
        <div className="absolute bottom-3 right-3 flex items-center gap-1.5 bg-white/95 backdrop-blur-md border border-[#D0E4F8] rounded-xl p-1 shadow-md">
          {/* Zoom In */}
          <button
            onClick={handleZoomIn}
            className="p-1.5 rounded-lg text-[#0A2239] hover:bg-[#F0F7FF] transition-colors"
            title="Zoom In"
            aria-label="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </button>

          {/* Zoom Out */}
          <button
            onClick={handleZoomOut}
            className="p-1.5 rounded-lg text-[#0A2239] hover:bg-[#F0F7FF] transition-colors"
            title="Zoom Out"
            aria-label="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>

          {/* Reset Zoom & Pan */}
          <button
            onClick={handleResetZoom}
            className="p-1.5 rounded-lg text-[#0A2239] hover:bg-[#F0F7FF] transition-colors"
            title="Reset Zoom (100% Real Scale)"
            aria-label="Reset Zoom"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <div className="w-[1px] h-4 bg-[#D0E4F8] mx-0.5" />

          {/* Toggle Radar Sweep Animation */}
          <button
            onClick={onToggleRadarScan}
            data-testid="toggle_radar_button"
            className={`p-1.5 rounded-lg transition-colors ${
              isRadarScanActive
                ? 'text-[#0288D1] bg-[#0288D1]/10 font-bold'
                : 'text-[#708FAE] hover:bg-[#F0F7FF]'
            }`}
            title={isRadarScanActive ? 'Disable Radar Scan' : 'Enable Radar Scan'}
            aria-label="Toggle Radar"
          >
            <Radar className="w-4 h-4" />
          </button>
        </div>

        {/* Zoom Factor Readout Pill (Bottom-Left) */}
        <div className="absolute bottom-3 left-3 bg-[#0A2239]/80 backdrop-blur-md border border-[#00B0FF]/40 rounded-lg px-2.5 py-1 text-[10px] font-mono text-[#00B0FF] font-semibold">
          MAG: {scale.toFixed(1)}x {scale === 1 ? '(1:1 SENSOR TILE)' : ''}
        </div>
      </div>
    </div>
  );
};

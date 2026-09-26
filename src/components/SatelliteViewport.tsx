import React, { useState, useRef, useEffect } from 'react';
import {
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Crosshair,
  Radar,
  SlidersHorizontal,
  CheckCircle2,
  Sparkles,
  HelpCircle,
  X,
  Target
} from 'lucide-react';
import { SatelliteScene, SpectralBandModeKey, InspectorPoint } from '../types';

interface SatelliteViewportProps {
  scene: SatelliteScene;
  spectralMode: SpectralBandModeKey;
  isRadarScanActive: boolean;
  onToggleRadarScan: () => void;
  onAskAboutPoint?: (point: InspectorPoint, query: string) => void;
}

export const SatelliteViewport: React.FC<SatelliteViewportProps> = ({
  scene,
  spectralMode,
  isRadarScanActive,
  onToggleRadarScan,
  onAskAboutPoint
}) => {
  const [scale, setScale] = useState<number>(1);
  const [position, setPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [inspectorMode, setInspectorMode] = useState<boolean>(true);
  const [selectedPoint, setSelectedPoint] = useState<InspectorPoint | null>(null);
  const [hasMovedDuringClick, setHasMovedDuringClick] = useState<boolean>(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  // Reset zoom, pan, and inspector point whenever target scene changes
  useEffect(() => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
    setSelectedPoint(null);
  }, [scene.id]);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setHasMovedDuringClick(false);
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setHasMovedDuringClick(true);
    setPosition({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    setIsDragging(false);
    // If user clicked without dragging and inspector is active, sample pixel telemetry!
    if (!hasMovedDuringClick && inspectorMode && containerRef.current) {
      inspectAtClientCoordinates(e.clientX, e.clientY);
    }
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

  // Inspect telemetry at point
  const inspectAtClientCoordinates = (clientX: number, clientY: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const xPct = Math.max(2, Math.min(98, ((clientX - rect.left) / rect.width) * 100));
    const yPct = Math.max(2, Math.min(98, ((clientY - rect.top) / rect.height) * 100));

    // Calculate localized biophysical variation based on scene and position
    const normX = xPct / 100;
    const normY = yPct / 100;

    let ndvi = scene.baseNdvi;
    let ndwi = scene.baseNdwi;
    let ndbi = scene.baseNdbi;
    let temp = scene.baseSurfaceTemp;
    let surfaceType = '42% Mixed Suburban Canopy';
    let confidence = 88;
    let colorHex = '#2E7D32';

    // Contextual variation based on scene domain
    if (scene.id === 'urban_port') {
      if (normX > 0.45 && normY > 0.3) {
        // Harbor / water basin
        ndvi = -0.15 + (normX * 0.05);
        ndwi = 0.72 + (normY * 0.1);
        ndbi = -0.3;
        temp = 19.4;
        surfaceType = '96% Deep Marine / Harbor Siltation';
        confidence = 96;
        colorHex = '#0288D1';
      } else {
        // Urban dock & concrete
        ndvi = 0.12;
        ndwi = -0.05;
        ndbi = 0.82;
        temp = 25.8;
        surfaceType = '91% Impervious Concrete & Port Logistics';
        confidence = 94;
        colorHex = '#E65100';
      }
    } else if (scene.id === 'agriculture_pivot') {
      // Circular fields variance
      const distFromCenter = Math.hypot(normX - 0.5, normY - 0.5);
      if (distFromCenter < 0.38) {
        ndvi = 0.88;
        ndwi = 0.32;
        ndbi = -0.35;
        temp = 24.2;
        surfaceType = '94% High-Vigor Center-Pivot Irrigated Crop';
        confidence = 95;
        colorHex = '#2E7D32';
      } else {
        ndvi = 0.28;
        ndwi = -0.12;
        ndbi = 0.45;
        temp = 31.4;
        surfaceType = '86% Arid Soil & Fallow Buffer';
        confidence = 89;
        colorHex = '#8D6E63';
      }
    } else if (scene.id === 'rainforest_basin') {
      if (normY > 0.55 && normX > 0.2 && normX < 0.8) {
        // Meandering river
        ndvi = -0.08;
        ndwi = 0.84;
        ndbi = -0.4;
        temp = 22.1;
        surfaceType = '98% Amazon River Sediment Flow';
        confidence = 98;
        colorHex = '#0288D1';
      } else if (normX < 0.3) {
        // Clear-cut deforested zone
        ndvi = 0.34;
        ndwi = 0.05;
        ndbi = 0.52;
        temp = 29.8;
        surfaceType = '89% Cleared Deforestation Sector';
        confidence = 91;
        colorHex = '#D32F2F';
      } else {
        // Dense primary rainforest
        ndvi = 0.92;
        ndwi = 0.44;
        ndbi = -0.52;
        temp = 24.0;
        surfaceType = '97% Dense Primary Rainforest Canopy';
        confidence = 97;
        colorHex = '#1B5E20';
      }
    }

    // Offset coordinates slightly
    const coordParts = scene.coordinates.split(',');
    const latOffset = ((normY - 0.5) * -0.015).toFixed(4);
    const lonOffset = ((normX - 0.5) * 0.015).toFixed(4);
    const pointCoords = `${coordParts[0]?.trim()} (Δ${latOffset}°), ${coordParts[1]?.trim() || ''} (Δ${lonOffset}°)`;

    setSelectedPoint({
      xPct,
      yPct,
      coordinates: pointCoords,
      ndvi: Number(ndvi.toFixed(2)),
      ndwi: Number(ndwi.toFixed(2)),
      ndbi: Number(ndbi.toFixed(2)),
      surfaceTemp: Number(temp.toFixed(1)),
      surfaceType,
      confidence,
      colorHex
    });
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
      {/* Top Banner with Inspector Status */}
      <div className="flex items-center justify-between pb-2 text-[11px]">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setInspectorMode(!inspectorMode)}
            className={`px-3 py-1.5 rounded-xl border flex items-center gap-1.5 font-bold transition-all shadow-2xs ${
              inspectorMode
                ? 'bg-[#0288D1] text-white border-[#0288D1]'
                : 'bg-white text-[#708FAE] border-[#D0E4F8] hover:text-[#0A2239]'
            }`}
          >
            <Target className="w-3.5 h-3.5" />
            <span>Tap-to-Inspect Reticle: {inspectorMode ? 'ACTIVE' : 'OFF'}</span>
          </button>
          <span className="text-[#708FAE] hidden sm:inline">
            {inspectorMode ? 'Tap or click anywhere on the image to sample instant point biophysics' : 'Click drag to pan and inspect'}
          </span>
        </div>

        {selectedPoint && (
          <button
            onClick={() => setSelectedPoint(null)}
            className="text-[10px] text-[#708FAE] hover:text-[#0A2239] flex items-center gap-1 font-mono"
          >
            <X className="w-3 h-3" /> Clear Point
          </button>
        )}
      </div>

      <div
        ref={containerRef}
        data-testid="satellite_viewport"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onWheel={handleWheel}
        className="relative w-full h-[340px] md:h-[430px] rounded-2xl overflow-hidden border-[1.5px] border-[#D0E4F8] bg-[#0A2239] shadow-md select-none cursor-crosshair active:cursor-grabbing"
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
            ref={imageRef}
            src={scene.imageSrc}
            alt={scene.title}
            className="w-full h-full object-cover pointer-events-none select-none"
            style={{
              ...getFilterStyle(),
              imageRendering: 'auto'
            }}
            draggable={false}
          />
        </div>

        {/* Central Targeting Reticle (when no point is selected) */}
        {!selectedPoint && (
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
            <div className="relative w-14 h-14 flex items-center justify-center opacity-70">
              <div className="w-8 h-8 rounded-full border border-[#00B0FF] shadow-xs" />
              <div className="absolute w-10 h-[1.5px] bg-[#00B0FF]" />
              <div className="absolute h-10 w-[1.5px] bg-[#00B0FF]" />
              <div className="absolute -top-4 text-[9px] font-mono font-bold text-[#00B0FF] tracking-wider">
                ORBITAL LOCK
              </div>
            </div>
          </div>
        )}

        {/* Dynamic Holographic Reticle at Selected Point (Feature 2) */}
        {selectedPoint && (
          <div
            className="absolute pointer-events-none z-30 -translate-x-1/2 -translate-y-1/2 transition-all duration-150"
            style={{ left: `${selectedPoint.xPct}%`, top: `${selectedPoint.yPct}%` }}
          >
            {/* Pulsing Target Rings */}
            <div className="relative w-12 h-12 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border-2 border-[#00E676] animate-ping opacity-60" />
              <div className="w-6 h-6 rounded-full border border-[#00E676] bg-[#00E676]/20" />
              <Crosshair className="w-6 h-6 text-[#00E676] absolute" />
            </div>

            {/* Localized Mini HUD Card */}
            <div
              className={`absolute pointer-events-auto bg-black/85 backdrop-blur-md border border-[#00E676]/80 rounded-xl p-3 shadow-2xl text-white font-mono w-[260px] md:w-[280px] z-40 ${
                selectedPoint.yPct > 60 ? '-top-48' : 'top-10'
              } ${selectedPoint.xPct > 60 ? '-left-64' : 'left-4'}`}
            >
              <div className="flex items-center justify-between pb-1.5 border-b border-white/20 mb-2">
                <span className="text-[10px] text-[#00E676] font-bold flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-[#00E676] animate-pulse" />
                  POINT TELEMETRY
                </span>
                <span className="text-[9px] text-white/60">CONF {selectedPoint.confidence}%</span>
              </div>

              {/* Surface Classification */}
              <div className="text-[11px] font-bold text-white mb-2 leading-tight">
                {selectedPoint.surfaceType}
              </div>

              {/* Grid of Scores */}
              <div className="grid grid-cols-3 gap-1 text-[10px] mb-2.5">
                <div className="bg-white/10 rounded-lg p-1.5 text-center">
                  <div className="text-white/60 text-[9px]">NDVI</div>
                  <div className={`font-bold ${selectedPoint.ndvi > 0.4 ? 'text-[#00E676]' : 'text-amber-400'}`}>
                    {selectedPoint.ndvi > 0 ? `+${selectedPoint.ndvi}` : selectedPoint.ndvi}
                  </div>
                </div>

                <div className="bg-white/10 rounded-lg p-1.5 text-center">
                  <div className="text-white/60 text-[9px]">NDWI</div>
                  <div className={`font-bold ${selectedPoint.ndwi > 0.3 ? 'text-[#00B0FF]' : 'text-slate-300'}`}>
                    {selectedPoint.ndwi > 0 ? `+${selectedPoint.ndwi}` : selectedPoint.ndwi}
                  </div>
                </div>

                <div className="bg-white/10 rounded-lg p-1.5 text-center">
                  <div className="text-white/60 text-[9px]">TEMP</div>
                  <div className="font-bold text-amber-400">
                    {selectedPoint.surfaceTemp}°C
                  </div>
                </div>
              </div>

              {/* Coordinates */}
              <div className="text-[9px] text-white/70 mb-2 truncate">
                LOC: {selectedPoint.coordinates}
              </div>

              {/* Ask AI Button */}
              {onAskAboutPoint && (
                <button
                  onClick={() =>
                    onAskAboutPoint(
                      selectedPoint,
                      `Analyze the ground feature at coordinates ${selectedPoint.coordinates}: Classified as ${selectedPoint.surfaceType} with NDVI ${selectedPoint.ndvi} and NDWI ${selectedPoint.ndwi}. What is this specific structure/terrain?`
                    )
                  }
                  className="w-full py-1.5 bg-gradient-to-r from-[#0288D1] to-[#00B0FF] hover:from-[#0277BD] hover:to-[#0288D1] text-white text-[10px] font-bold rounded-lg flex items-center justify-center gap-1.5 shadow-md cursor-pointer transition-all active:scale-95"
                >
                  <Sparkles className="w-3 h-3" />
                  <span>Ask AI About This Feature</span>
                </button>
              )}
            </div>
          </div>
        )}

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

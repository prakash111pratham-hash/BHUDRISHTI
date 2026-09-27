import React, { useState, useRef } from 'react';
import {
  Compass,
  Radio,
  Sparkles,
  Layers,
  MoreHorizontal,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  Target,
  Crosshair,
  Search,
  Send,
  SlidersHorizontal,
  Check,
  Shield,
  Activity,
  FileText,
  Clock,
  MessageSquare,
  Bot,
  MapPin,
  ExternalLink,
  Eye,
  Info
} from 'lucide-react';
import {
  InspectorPoint,
  SatelliteScene,
  SpectralBandModeKey,
  SPECTRAL_MODES
} from '../types';
import { BiophysicsInspectorModal } from './BiophysicsInspectorModal';
import { GeminiMultiTurnChat } from './GeminiMultiTurnChat';
import { GoogleMapsLocationDrawer } from './GoogleMapsLocationDrawer';

interface CommandConsoleDashboardProps {
  scene: SatelliteScene;
  allScenes: SatelliteScene[];
  onSelectScene: (scene: SatelliteScene) => void;
  spectralMode: SpectralBandModeKey;
  onSelectSpectralMode: (mode: SpectralBandModeKey) => void;
  userQuery: string;
  onQueryChange: (q: string) => void;
  onAnalyze: (q?: string) => void;
  isAnalyzing: boolean;
  onAskAboutPoint?: (point: InspectorPoint, query: string) => void;
  onCustomImageSelected?: (dataUrl: string, name: string) => void;
  customApiKey?: string;
}

export const CommandConsoleDashboard: React.FC<CommandConsoleDashboardProps> = ({
  scene,
  allScenes,
  onSelectScene,
  spectralMode,
  onSelectSpectralMode,
  userQuery,
  onQueryChange,
  onAnalyze,
  isAnalyzing,
  onAskAboutPoint,
  onCustomImageSelected,
  customApiKey
}) => {
  const [scale, setScale] = useState<number>(1);
  const [position, setPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [selectedPoint, setSelectedPoint] = useState<InspectorPoint | null>(null);
  const [hasMovedDuringClick, setHasMovedDuringClick] = useState<boolean>(false);

  // Layers popover state (bottom-left of map)
  const [showLayersBox, setShowLayersBox] = useState<boolean>(true);
  const [layerNdvi, setLayerNdvi] = useState<boolean>(true);
  const [layerSar, setLayerSar] = useState<boolean>(false);
  const [layerThermal, setLayerThermal] = useState<boolean>(false);
  const [showOtherLayers, setShowOtherLayers] = useState<boolean>(false);
  const [layerPanchromatic, setLayerPanchromatic] = useState<boolean>(false);

  // Modals & Panels
  const [showBiophysicsModal, setShowBiophysicsModal] = useState<boolean>(false);
  const [showGoogleMapsModal, setShowGoogleMapsModal] = useState<boolean>(false);
  const [activeBottomMode, setActiveBottomMode] = useState<'QUERY' | 'CHAT'>('QUERY');

  // Right column collapsible accordions
  const [openAccordion, setOpenAccordion] = useState<string>('LOG');
  const [sceneDropdownOpen, setSceneDropdownOpen] = useState<boolean>(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Spectral filter based on active layers / spectral mode
  const getFilterStyle = (): React.CSSProperties => {
    if (layerThermal) {
      return { filter: 'hue-rotate(180deg) saturate(2.5) contrast(1.3)' };
    }
    if (layerNdvi || spectralMode === 'NDVI_CONTRAST') {
      return { filter: 'saturate(2.2) contrast(1.2) brightness(1.05)' };
    }
    if (layerSar || spectralMode === 'RADAR_SURFACE') {
      return { filter: 'grayscale(1) contrast(1.5) brightness(0.92)' };
    }
    if (spectralMode === 'FALSE_COLOR_IR') {
      return { filter: 'sepia(0.55) hue-rotate(295deg) saturate(2.4) contrast(1.15)' };
    }
    if (layerPanchromatic) {
      return { filter: 'contrast(1.35) brightness(1.1)' };
    }
    return { filter: 'none' };
  };

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
    if (!hasMovedDuringClick && containerRef.current) {
      inspectAtClientCoordinates(e.clientX, e.clientY);
    }
  };

  const inspectAtClientCoordinates = (clientX: number, clientY: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const xPct = Math.max(2, Math.min(98, ((clientX - rect.left) / rect.width) * 100));
    const yPct = Math.max(2, Math.min(98, ((clientY - rect.top) / rect.height) * 100));

    const normX = xPct / 100;
    const normY = yPct / 100;

    let ndvi = scene.baseNdvi;
    let ndwi = scene.baseNdwi;
    let surfaceType = '';
    let confidence = 93;

    // Tailored detection based on scene
    if (scene.id === 'mumbai_port' || scene.title.includes('Port')) {
      if (normX > 0.45 && normY > 0.3) {
        ndvi = -0.15;
        ndwi = 0.76;
        surfaceType = '96% Deep Navigational Harbor & Water Sediment Plume';
        confidence = 96;
      } else if (normX > 0.35 && normY > 0.5) {
        ndvi = 0.08;
        ndwi = -0.04;
        surfaceType = '92% Container Freight Terminal & Gantry Crane Berth';
        confidence = 94;
      } else {
        ndvi = 0.16;
        ndwi = -0.08;
        surfaceType = '91% Coastal Highway Grid & High-Density Commercial Core';
        confidence = 92;
      }
    } else if (scene.id === 'powai_urban' || scene.title.includes('Powai')) {
      if (normX > 0.45 && normY > 0.4) {
        ndvi = -0.18;
        ndwi = 0.68;
        surfaceType = '94% Powai Lake Surface & Watershed Boundary';
        confidence = 95;
      } else if (normX < 0.35 && normY > 0.5) {
        ndvi = 0.64;
        ndwi = -0.12;
        surfaceType = '90% Sanjay Gandhi National Park Ridge & Forest Canopy';
        confidence = 91;
      } else {
        ndvi = 0.24;
        ndwi = -0.05;
        surfaceType = '92% Multi-Story Residential Apartment Blocks & Infrastructure';
        confidence = 93;
      }
    } else if (scene.id === 'agriculture_pivot') {
      ndvi = normX > 0.4 ? 0.78 : 0.22;
      ndwi = 0.28;
      surfaceType = normX > 0.4 ? '95% Active Center-Pivot Irrigated Crop Circle' : '88% Harvested / Fallow Soil';
    } else {
      ndvi = scene.baseNdvi;
      ndwi = scene.baseNdwi;
      surfaceType = `${scene.title} Terrain Unit`;
    }

    const coordParts = scene.coordinates.split(',');
    const latOffset = ((normY - 0.5) * -0.012).toFixed(4);
    const lonOffset = ((normX - 0.5) * 0.012).toFixed(4);
    const pointCoords = `${coordParts[0]?.trim()} (Δ${latOffset}°), ${coordParts[1]?.trim() || ''} (Δ${lonOffset}°)`;

    const pointData: InspectorPoint = {
      xPct,
      yPct,
      coordinates: pointCoords,
      ndvi: Number(ndvi.toFixed(2)),
      ndwi: Number(ndwi.toFixed(2)),
      ndbi: scene.baseNdbi,
      surfaceTemp: scene.baseSurfaceTemp,
      surfaceType,
      confidence,
      colorHex: '#00B0FF'
    };

    setSelectedPoint(pointData);
    setShowBiophysicsModal(true);
  };

  const handleZoomIn = () => setScale((s) => Math.min(3.5, s + 0.3));
  const handleZoomOut = () => setScale((s) => Math.max(0.7, s - 0.3));
  const handleResetView = () => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
    setSelectedPoint(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && onCustomImageSelected) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target?.result as string;
        onCustomImageSelected(dataUrl, file.name);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="w-full max-w-[1520px] mx-auto px-4 py-2">
      {/* ===================== SCENE QUICK-SWITCH TABS BAR ===================== */}
      {/* Allows users to easily switch between Mumbai Port and Mumbai Powai without hiding details */}
      <div className="mb-3 flex items-center justify-between gap-2 overflow-x-auto no-scrollbar bg-[#08101E] border border-[#182C4D] p-1.5 rounded-2xl">
        <div className="flex items-center gap-1.5 min-w-0">
          <span className="text-[11px] font-mono text-[#00E5FF] px-2.5 py-1 font-bold flex items-center gap-1.5 flex-shrink-0">
            <Compass className="w-3.5 h-3.5" />
            <span>ORBITAL SCENES:</span>
          </span>

          {allScenes.map((s) => {
            const isSelected = s.id === scene.id;
            return (
              <button
                key={s.id}
                onClick={() => {
                  onSelectScene(s);
                  handleResetView();
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 flex-shrink-0 cursor-pointer ${
                  isSelected
                    ? 'bg-gradient-to-r from-[#0088D1] to-[#00B0FF] text-white shadow-[0_0_12px_rgba(0,176,255,0.4)]'
                    : 'bg-[#101F38] hover:bg-[#162D52] text-slate-300 hover:text-white border border-[#182C4D]'
                }`}
              >
                <span>{s.title}</span>
                <span className="text-[10px] font-mono opacity-80 hidden md:inline">
                  ({s.coordinates.split(',')[0]})
                </span>
                {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />}
              </button>
            );
          })}
        </div>

        <button
          onClick={() => fileInputRef.current?.click()}
          className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-[#101F38] hover:bg-[#162D52] text-[#00E5FF] border border-[#00E5FF]/30 transition-all flex items-center gap-1 flex-shrink-0 cursor-pointer"
        >
          <span>+ Upload Image</span>
        </button>
      </div>

      {/* 3-Column Command Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 items-start">
        
        {/* ===================== LEFT COLUMN (lg:col-span-3) ===================== */}
        <div className="lg:col-span-3 space-y-3">
          {/* Card 1: REAL TIME TELEMETRY */}
          <div className="bg-[#0C172A] border border-[#182C4D] rounded-2xl p-4 shadow-sm text-white">
            <div className="flex items-center justify-between pb-2.5 border-b border-[#182C4D] mb-3">
              <h2 className="text-xs font-bold tracking-wider text-slate-200 uppercase font-mono">
                REAL TIME TELEMETRY
              </h2>
              <MoreHorizontal className="w-4 h-4 text-slate-400" />
            </div>

            <div className="flex items-center justify-between text-xs font-mono text-slate-300 mb-3">
              <span className="text-[#00E676] font-semibold">GSD {scene.gsdResolution}</span>
              <span className="text-slate-400">Spectral 8-Band</span>
            </div>

            {/* Sensor Progress Bar */}
            <div className="mb-4">
              <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
                <span>Optical synthesis sensor</span>
                <span className="text-[#00E5FF] font-mono font-bold">100%</span>
              </div>
              <div className="w-full h-1.5 bg-[#101F38] rounded-full overflow-hidden border border-[#182C4D]">
                <div className="h-full bg-gradient-to-r from-[#0088D1] to-[#00E5FF] w-full" />
              </div>
            </div>

            {/* 8-Band Spectral Table */}
            <div className="space-y-1.5 text-xs font-mono">
              <div className="flex items-center justify-between bg-[#101F38] px-2 py-1.5 rounded-lg border border-[#182C4D]">
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#0088D1]" />
                  <span>True Color (RGB)</span>
                </span>
                <span className="text-slate-400">Active BOA</span>
              </div>

              <div className="flex items-center justify-between bg-[#101F38] px-2 py-1.5 rounded-lg border border-[#182C4D]">
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#00E676]" />
                  <span>NIR - Red Edge</span>
                </span>
                <span className="text-slate-400">0.84 µm (B8)</span>
              </div>

              <div className="flex items-center justify-between bg-[#101F38] px-2 py-1.5 rounded-lg border border-[#182C4D]">
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#FF5252]" />
                  <span>True-Red (NIR)</span>
                </span>
                <span className="text-slate-400">0.66 µm (B4)</span>
              </div>

              <div className="flex items-center justify-between bg-[#101F38] px-2 py-1.5 rounded-lg border border-[#182C4D]">
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#FFAB00]" />
                  <span>SWIR - Moisture</span>
                </span>
                <span className="text-slate-400">B11-B8A</span>
              </div>

              <div className="flex items-center justify-between bg-[#101F38] px-2 py-1.5 rounded-lg border border-[#182C4D]">
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#00E5FF]" />
                  <span>Classification</span>
                </span>
                <span className="text-[#00E5FF] font-bold">8-Band Matrix</span>
              </div>

              <div className="flex items-center justify-between bg-[#101F38] px-2 py-1.5 rounded-lg border border-[#182C4D]">
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#00E676]" />
                  <span>Flash Vision</span>
                </span>
                <span className="text-[#00E676] font-bold">&gt; 0.94 Precision</span>
              </div>
            </div>
          </div>

          {/* Card 2: PROCESSING LOGS */}
          <div className="bg-[#0C172A] border border-[#182C4D] rounded-2xl p-4 shadow-sm text-white">
            <div className="flex items-center justify-between pb-2.5 border-b border-[#182C4D] mb-3">
              <h2 className="text-xs font-bold tracking-wider text-slate-200 uppercase font-mono">
                PROCESSING LOGS
              </h2>
              <MoreHorizontal className="w-4 h-4 text-slate-400" />
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="flex items-start gap-2.5">
                <span className="w-2 h-2 rounded-full bg-[#00E676] mt-1 flex-shrink-0 animate-pulse" />
                <div className="min-w-0">
                  <div className="font-bold text-white truncate">{scene.title}</div>
                  <div className="text-[10px] text-slate-400 font-mono">27 Jan 2026, 1:37 PM</div>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#00E676] mt-0.5 flex-shrink-0" />
                <div className="min-w-0">
                  <div className="text-slate-200 font-medium truncate">Radiometric Calibration (TOA &rarr; BOA)</div>
                  <div className="text-[10px] text-slate-400 font-mono">21 Jan 2026, 5:38 AM</div>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#00E676] mt-0.5 flex-shrink-0" />
                <div className="min-w-0">
                  <div className="text-slate-200 font-medium truncate">GSD {scene.gsdResolution} Orthorectification</div>
                  <div className="text-[10px] text-slate-400 font-mono">21 Jan 2026, 2:36 PM</div>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#00E676] mt-0.5 flex-shrink-0" />
                <div className="min-w-0">
                  <div className="text-slate-200 font-medium truncate">Cloud Masking: 0.0% occlusion</div>
                  <div className="text-[10px] text-slate-400 font-mono">21 Jan 2026, 3:32 PM</div>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#00E676] mt-0.5 flex-shrink-0" />
                <div className="min-w-0">
                  <div className="text-slate-200 font-medium truncate">Bio-Physical Index Precomputation</div>
                  <div className="text-[10px] text-slate-400 font-mono">21 Jan 2026, 5:38 PM</div>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#00E676] mt-0.5 flex-shrink-0" />
                <div className="min-w-0">
                  <div className="text-slate-200 font-medium truncate">Flash Model Ready for Query</div>
                  <div className="text-[10px] text-slate-400 font-mono">21 Jan 2026, 6:37 PM</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ===================== CENTER COLUMN (lg:col-span-6) ===================== */}
        <div className="lg:col-span-6 space-y-3">
          {/* Main Map Viewport Card */}
          <div className="bg-[#0C172A] border border-[#182C4D] rounded-2xl overflow-hidden shadow-md">
            {/* Header: Location & Scene Selector */}
            <div className="p-3.5 bg-[#08101E] border-b border-[#182C4D] flex items-center justify-between gap-2 relative">
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-2.5 h-2.5 rounded-full bg-[#0088D1] border border-[#00E5FF] flex-shrink-0" />
                
                {/* Scene Dropdown Trigger */}
                <div className="relative">
                  <button
                    onClick={() => setSceneDropdownOpen(!sceneDropdownOpen)}
                    className="text-sm font-bold text-white flex items-center gap-1.5 hover:text-[#00E5FF] transition-colors cursor-pointer"
                  >
                    <span className="truncate">{scene.title}</span>
                    <ChevronDown className="w-4 h-4 text-slate-400" />
                  </button>

                  {/* Dropdown Menu */}
                  {sceneDropdownOpen && (
                    <div className="absolute top-8 left-0 z-50 bg-[#0C172A] border border-[#182C4D] rounded-xl shadow-2xl p-1.5 w-64 text-xs text-white">
                      {allScenes.map((s) => (
                        <button
                          key={s.id}
                          onClick={() => {
                            onSelectScene(s);
                            setSceneDropdownOpen(false);
                            handleResetView();
                          }}
                          className={`w-full text-left px-3 py-2 rounded-lg font-medium transition-colors flex items-center justify-between ${
                            s.id === scene.id ? 'bg-[#0088D1] text-white font-bold' : 'hover:bg-white/5 text-slate-200'
                          }`}
                        >
                          <span className="truncate">{s.title}</span>
                          {s.id === scene.id && <Check className="w-3.5 h-3.5" />}
                        </button>
                      ))}

                      <div className="border-t border-[#182C4D] mt-1 pt-1">
                        <button
                          onClick={() => {
                            fileInputRef.current?.click();
                            setSceneDropdownOpen(false);
                          }}
                          className="w-full text-left px-3 py-2 rounded-lg text-[#00E5FF] hover:bg-white/5 font-semibold"
                        >
                          + Upload Custom Satellite Image
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Three dots menu */}
              <button
                onClick={() => fileInputRef.current?.click()}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
                title="Upload custom image"
              >
                <MoreHorizontal className="w-4 h-4" />
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>

            {/* Sub-bar: Given Details of the Image matching user screenshot */}
            <div className="px-3.5 py-2 bg-[#0A1424] border-b border-[#14233D] text-[11px] font-mono text-slate-300 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 truncate">
                <Compass className="w-3.5 h-3.5 text-[#00E5FF] flex-shrink-0" />
                <span className="font-bold text-white tracking-wide">
                  {scene.detectedLocation ? scene.detectedLocation.coordinates : scene.coordinates}
                </span>
                <span className="text-slate-400">• {scene.satellitePlatform}</span>
              </div>

              <div className="flex items-center gap-2.5 flex-shrink-0">
                <button
                  onClick={() => setShowGoogleMapsModal(true)}
                  className="text-[#00E676] hover:text-[#00E676]/80 font-bold hover:underline flex items-center gap-1 cursor-pointer"
                  title="View exact extracted coordinates and live Google Map"
                >
                  <MapPin className="w-3.5 h-3.5" />
                  <span>• Google Maps Location</span>
                </button>

                <button
                  onClick={() => setShowBiophysicsModal(true)}
                  className="text-[#00E5FF] hover:text-[#00E5FF]/80 font-bold hover:underline flex items-center gap-1 cursor-pointer"
                  title="Open detailed biophysical sample breakdown"
                >
                  <span>• Sample point biophysics</span>
                </button>
              </div>
            </div>

            {/* The Satellite Viewport Display */}
            <div
              ref={containerRef}
              data-testid="satellite_viewport"
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              className="relative w-full h-[360px] md:h-[430px] bg-[#030812] overflow-hidden select-none cursor-crosshair active:cursor-grabbing"
            >
              {/* Floating Google Maps Extracted GPS Chip */}
              <button
                onClick={() => setShowGoogleMapsModal(true)}
                className="absolute top-3 right-3 z-20 px-3 py-1.5 rounded-xl bg-[#08101E]/90 hover:bg-[#0C172A] border border-[#00E5FF]/40 text-xs font-mono font-bold text-white shadow-lg backdrop-blur-md flex items-center gap-2 hover:border-[#00E5FF] transition-all cursor-pointer group"
                title="Click to view interactive Google Map and extracted landmarks"
              >
                <div className="w-2 h-2 rounded-full bg-[#00E676] animate-pulse" />
                <MapPin className="w-3.5 h-3.5 text-[#00E5FF]" />
                <span className="text-[#00E5FF] group-hover:underline">
                  {scene.detectedLocation ? scene.detectedLocation.coordinates : scene.coordinates}
                </span>
                <ExternalLink className="w-3 h-3 text-slate-400 group-hover:text-white" />
              </button>
              {/* Image transform container */}
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
                  style={getFilterStyle()}
                  draggable={false}
                  className="w-full h-full object-cover pointer-events-none select-none"
                />

                {/* False-Color Visual Layer Overlays */}
                {layerNdvi && (
                  <div
                    className="absolute inset-0 pointer-events-none mix-blend-color-dodge opacity-25"
                    style={{
                      backgroundImage:
                        'radial-gradient(circle at 60% 40%, rgba(0, 230, 118, 0.45) 0%, transparent 65%)'
                    }}
                  />
                )}

                {layerSar && (
                  <div
                    className="absolute inset-0 pointer-events-none mix-blend-overlay opacity-30"
                    style={{
                      backgroundImage:
                        'radial-gradient(circle at 35% 65%, rgba(255, 171, 0, 0.5) 0%, transparent 70%)'
                    }}
                  />
                )}

                {/* Inspected Point Reticle Pin */}
                {selectedPoint && (
                  <div
                    className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-none z-20"
                    style={{
                      left: `${selectedPoint.xPct}%`,
                      top: `${selectedPoint.yPct}%`
                    }}
                  >
                    <div className="relative flex items-center justify-center">
                      <div className="w-8 h-8 rounded-full border border-[#00E5FF] animate-ping opacity-60 absolute" />
                      <div className="w-5 h-5 rounded-full border-2 border-white shadow-[0_0_10px_#00E5FF] flex items-center justify-center bg-[#0088D1]/80">
                        <div className="w-1.5 h-1.5 rounded-full bg-white" />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Floating Bottom-Left: "Layers" Widget matching screenshot */}
              <div className="absolute bottom-3 left-3 z-30">
                <div className="bg-[#0A1628]/95 backdrop-blur-md border border-[#182C4D] rounded-xl p-3 shadow-2xl text-xs w-48 text-white">
                  <div
                    onClick={() => setShowLayersBox(!showLayersBox)}
                    className="flex items-center justify-between font-bold text-slate-200 cursor-pointer select-none mb-2"
                  >
                    <div className="flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5 text-[#00E5FF]" />
                      <span>Layers</span>
                    </div>
                    <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${showLayersBox ? 'rotate-180' : ''}`} />
                  </div>

                  {showLayersBox && (
                    <div className="space-y-2 pt-1 border-t border-[#182C4D]/80">
                      {/* Checkbox 1: NDVI Contrast */}
                      <label className="flex items-center gap-2 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={layerNdvi}
                          onChange={(e) => setLayerNdvi(e.target.checked)}
                          className="w-3.5 h-3.5 rounded bg-[#101F38] border-[#1C3660] text-[#00E676] focus:ring-0 cursor-pointer accent-[#00E676]"
                        />
                        <span className="w-2 h-2 rounded-full bg-[#00E676] flex-shrink-0" />
                        <span className="text-slate-200 font-medium">NDVI Contrast</span>
                      </label>

                      {/* Checkbox 2: Synthetic SAR */}
                      <label className="flex items-center gap-2 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={layerSar}
                          onChange={(e) => setLayerSar(e.target.checked)}
                          className="w-3.5 h-3.5 rounded bg-[#101F38] border-[#1C3660] text-[#FFAB00] focus:ring-0 cursor-pointer accent-[#FFAB00]"
                        />
                        <span className="w-2 h-2 rounded-full bg-[#FFAB00] flex-shrink-0" />
                        <span className="text-slate-200 font-medium">Synthetic SAR</span>
                      </label>

                      {/* Checkbox 3: Thermal IR */}
                      <label className="flex items-center gap-2 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={layerThermal}
                          onChange={(e) => setLayerThermal(e.target.checked)}
                          className="w-3.5 h-3.5 rounded bg-[#101F38] border-[#1C3660] text-[#FF5252] focus:ring-0 cursor-pointer accent-[#FF5252]"
                        />
                        <span className="w-2 h-2 rounded-full bg-slate-500 flex-shrink-0" />
                        <span className="text-slate-400 font-medium">Thermal IR</span>
                      </label>

                      {/* Other layers button */}
                      <div className="pt-1.5 border-t border-[#182C4D]/60">
                        <button
                          onClick={() => setShowOtherLayers(!showOtherLayers)}
                          className="text-[10px] text-slate-400 hover:text-white transition-colors cursor-pointer flex items-center justify-between w-full font-mono"
                        >
                          <span>Other layers</span>
                          <span>{showOtherLayers ? '▴' : '▾'}</span>
                        </button>

                        {showOtherLayers && (
                          <div className="mt-1 space-y-1 pl-1">
                            <label className="flex items-center gap-1.5 cursor-pointer text-[10px] text-slate-300">
                              <input
                                type="checkbox"
                                checked={layerPanchromatic}
                                onChange={(e) => setLayerPanchromatic(e.target.checked)}
                                className="w-3 h-3 accent-[#00B0FF]"
                              />
                              <span>Panchromatic Edge</span>
                            </label>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Floating Bottom-Right: Orthophoto Scale Text matching user screenshot */}
              <div className="absolute bottom-3 right-14 z-30 hidden sm:block">
                <div className="bg-[#0A1628]/90 backdrop-blur-md border border-[#182C4D] px-3 py-1 rounded-xl text-[11px] font-mono text-slate-300 shadow-lg">
                  High-resolution orthophoto / {scene.gsdResolution.includes('0.33') ? '0.33m' : '0.30m'}, India
                </div>
              </div>

              {/* Floating Right Controls (Target, Zoom+, Zoom-) matching user screenshot */}
              <div className="absolute top-1/2 -translate-y-1/2 right-3 z-30 flex flex-col gap-2">
                <button
                  onClick={handleResetView}
                  className="w-8 h-8 rounded-xl bg-[#0A1628]/90 hover:bg-[#101F38] border border-[#182C4D] text-[#00E5FF] flex items-center justify-center shadow-lg transition-colors cursor-pointer active:scale-95"
                  title="Reset viewport / Center reticle"
                >
                  <Target className="w-4 h-4" />
                </button>

                <button
                  onClick={() => setShowGoogleMapsModal(true)}
                  className="w-8 h-8 rounded-xl bg-[#0A1628]/90 hover:bg-[#101F38] border border-[#00E676]/40 text-[#00E676] flex items-center justify-center shadow-lg transition-colors cursor-pointer active:scale-95"
                  title="Google Maps Location & Coordinates"
                >
                  <MapPin className="w-4 h-4" />
                </button>

                <button
                  onClick={handleZoomIn}
                  className="w-8 h-8 rounded-xl bg-[#0A1628]/90 hover:bg-[#101F38] border border-[#182C4D] text-white flex items-center justify-center shadow-lg transition-colors cursor-pointer active:scale-95"
                  title="Zoom In"
                >
                  <ZoomIn className="w-4 h-4" />
                </button>

                <button
                  onClick={handleZoomOut}
                  className="w-8 h-8 rounded-xl bg-[#0A1628]/90 hover:bg-[#101F38] border border-[#182C4D] text-white flex items-center justify-center shadow-lg transition-colors cursor-pointer active:scale-95"
                  title="Zoom Out"
                >
                  <ZoomOut className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Lower Panel Mode Switcher: Geospatial Spectral Query VS Gemini Multi-Turn Chatbot */}
          <div className="flex items-center justify-between bg-[#08101E] border border-[#182C4D] p-1 rounded-xl text-xs font-bold">
            <button
              onClick={() => setActiveBottomMode('QUERY')}
              className={`flex-1 py-1.5 rounded-lg flex items-center justify-center gap-2 transition-all cursor-pointer ${
                activeBottomMode === 'QUERY'
                  ? 'bg-[#0088D1] text-white shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Radio className="w-3.5 h-3.5" />
              <span>GEOSPATIAL SPECTRAL QUERY</span>
            </button>

            <button
              onClick={() => setActiveBottomMode('CHAT')}
              className={`flex-1 py-1.5 rounded-lg flex items-center justify-center gap-2 transition-all cursor-pointer ${
                activeBottomMode === 'CHAT'
                  ? 'bg-[#0088D1] text-white shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Bot className="w-3.5 h-3.5" />
              <span>GEMINI MULTI-TURN CHATBOT</span>
              <span className="text-[9px] font-mono px-1 py-0.2 bg-[#00E676]/20 text-[#00E676] rounded">
                LIVE
              </span>
            </button>
          </div>

          {/* Mode 1: Geospatial Spectral Query Card */}
          {activeBottomMode === 'QUERY' && (
            <div className="bg-[#0C172A] border border-[#182C4D] rounded-2xl p-4 shadow-sm text-white">
              <div className="flex items-center justify-between pb-2.5 border-b border-[#182C4D] mb-3">
                <div className="flex items-center gap-2">
                  <Radio className="w-4 h-4 text-[#00E5FF]" />
                  <h2 className="text-xs font-bold tracking-wider text-slate-200 uppercase font-mono">
                    SPECTRAL QUERY ANALYSIS
                  </h2>
                </div>
                <span className="text-[10px] font-mono text-[#00E676] bg-[#00E676]/10 px-2 py-0.5 rounded border border-[#00E676]/30">
                  GEMINI 3.8 FLASH READY
                </span>
              </div>

              {/* Preset Query Chips */}
              <div className="flex flex-wrap gap-1.5 mb-3.5">
                {scene.defaultQuerySuggestions.map((suggestion, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      onQueryChange(suggestion);
                      onAnalyze(suggestion);
                    }}
                    className="px-2.5 py-1 bg-[#101F38] hover:bg-[#162D52] border border-[#1C3660] hover:border-[#0088D1] rounded-lg text-xs text-slate-200 transition-all cursor-pointer text-left font-medium"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>

              {/* Input Bar & Process Scene Button */}
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={userQuery}
                    onChange={(e) => onQueryChange(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && onAnalyze()}
                    placeholder="e.g. Summarize land cover and water boundaries in plain words..."
                    className="w-full bg-[#101F38] border border-[#1C3660] rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-[#0088D1] transition-colors"
                  />
                </div>

                <button
                  onClick={() => onAnalyze()}
                  disabled={isAnalyzing}
                  className="px-5 py-2.5 bg-gradient-to-r from-[#0088D1] to-[#00B0FF] hover:from-[#0077B6] hover:to-[#0088D1] text-white text-xs font-bold rounded-xl flex items-center gap-2 shadow-[0_0_15px_rgba(0,176,255,0.4)] transition-all cursor-pointer flex-shrink-0 active:scale-95 disabled:opacity-50"
                >
                  <Radio className={`w-3.5 h-3.5 ${isAnalyzing ? 'animate-spin' : ''}`} />
                  <span>{isAnalyzing ? 'Processing...' : 'Process Scene'}</span>
                </button>
              </div>
            </div>
          )}

          {/* Mode 2: Multi-Turn Gemini Chatbot */}
          {activeBottomMode === 'CHAT' && (
            <GeminiMultiTurnChat
              scene={scene}
              customApiKey={customApiKey}
            />
          )}
        </div>

        {/* ===================== RIGHT COLUMN (lg:col-span-3) ===================== */}
        <div className="lg:col-span-3 space-y-3">
          <div className="bg-[#0C172A] border border-[#182C4D] rounded-2xl p-4 shadow-sm text-white">
            <div className="flex items-center justify-between pb-2.5 border-b border-[#182C4D] mb-3">
              <h2 className="text-xs font-bold tracking-wider text-slate-200 uppercase font-mono">
                PROCESSING
              </h2>
              <MoreHorizontal className="w-4 h-4 text-slate-400" />
            </div>

            {/* Selected Scene & Layers Breakdown */}
            <div className="space-y-2 text-xs font-mono">
              <div className="flex items-center justify-between bg-[#101F38] p-2.5 rounded-xl border border-[#182C4D]">
                <div className="flex items-center gap-2 truncate">
                  <span className="w-2 h-2 rounded-full bg-[#00E676] flex-shrink-0" />
                  <span className="font-bold text-white truncate">{scene.title}</span>
                </div>
                <span className="text-[10px] text-slate-400 flex-shrink-0">Level-2A</span>
              </div>

              <div className="flex items-center justify-between bg-[#101F38] p-2.5 rounded-xl border border-[#182C4D]">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#00E676] flex-shrink-0" />
                  <span className="text-slate-200">NDVI Contrast</span>
                </div>
                <span className="text-[10px] text-slate-400">B4-B3-B2</span>
              </div>

              <div className="flex items-center justify-between bg-[#101F38] p-2.5 rounded-xl border border-[#182C4D]">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#00E676] flex-shrink-0" />
                  <span className="text-slate-200">NDVI Contrast</span>
                </div>
                <span className="text-[10px] text-slate-400">(NIR-Red)/(NIR+Red)</span>
              </div>

              <div className="flex items-center justify-between bg-[#101F38] p-2.5 rounded-xl border border-[#182C4D]">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-slate-500 flex-shrink-0" />
                  <span className="text-slate-400">Synthetic SAR</span>
                </div>
                <span className="text-[10px] text-slate-400">VV/VH Polarized</span>
              </div>
            </div>

            {/* Collapsible Sub-sections */}
            <div className="mt-4 pt-3 border-t border-[#182C4D] space-y-2 text-xs">
              {/* Accordion 1: Processing Log */}
              <div className="border border-[#182C4D] rounded-xl overflow-hidden bg-[#101F38]">
                <button
                  onClick={() => setOpenAccordion(openAccordion === 'LOG' ? '' : 'LOG')}
                  className="w-full p-2.5 text-left flex items-center justify-between font-bold text-slate-200 cursor-pointer"
                >
                  <span className="flex items-center gap-1.5">
                    {openAccordion === 'LOG' ? <ChevronDown className="w-3.5 h-3.5 text-[#00E5FF]" /> : <ChevronRight className="w-3.5 h-3.5 text-slate-400" />}
                    <span>Processing log</span>
                  </span>
                </button>
                {openAccordion === 'LOG' && (
                  <div className="px-3 pb-2.5 text-[11px] text-slate-400 font-mono">
                    Processing: {scene.title}
                  </div>
                )}
              </div>

              {/* Accordion 2: Processing Layers */}
              <div className="border border-[#182C4D] rounded-xl overflow-hidden bg-[#101F38]">
                <button
                  onClick={() => setOpenAccordion(openAccordion === 'LAYERS' ? '' : 'LAYERS')}
                  className="w-full p-2.5 text-left flex items-center justify-between font-bold text-slate-200 cursor-pointer"
                >
                  <span className="flex items-center gap-1.5">
                    {openAccordion === 'LAYERS' ? <ChevronDown className="w-3.5 h-3.5 text-[#00E5FF]" /> : <ChevronRight className="w-3.5 h-3.5 text-slate-400" />}
                    <span>Processing layers!</span>
                  </span>
                </button>
                {openAccordion === 'LAYERS' && (
                  <div className="px-3 pb-2.5 text-[11px] text-slate-400 font-mono space-y-1">
                    <div>• Layer 1: Bottom-of-Atmosphere (BOA) Reflectance</div>
                    <div>• Layer 2: Coregistered True-Color Swath</div>
                  </div>
                )}
              </div>

              {/* Accordion 3: Processing logs */}
              <div className="border border-[#182C4D] rounded-xl overflow-hidden bg-[#101F38]">
                <button
                  onClick={() => setOpenAccordion(openAccordion === 'ALL_LOGS' ? '' : 'ALL_LOGS')}
                  className="w-full p-2.5 text-left flex items-center justify-between font-bold text-slate-200 cursor-pointer"
                >
                  <span className="flex items-center gap-1.5">
                    {openAccordion === 'ALL_LOGS' ? <ChevronDown className="w-3.5 h-3.5 text-[#00E5FF]" /> : <ChevronRight className="w-3.5 h-3.5 text-slate-400" />}
                    <span>Processing logs</span>
                  </span>
                </button>
                {openAccordion === 'ALL_LOGS' && (
                  <div className="px-3 pb-2.5 text-[11px] text-slate-400 font-mono">
                    All telemetry logs synchronized with ISRO & Sentinel repositories.
                  </div>
                )}
              </div>
            </div>

            {/* Bottom Sentinel Telemetry Tag */}
            <div className="mt-4 pt-3 border-t border-[#182C4D] flex items-center justify-between text-[11px] font-mono text-slate-400">
              <span className="flex items-center gap-1.5 text-[#00E676]">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Sentinel telemetry</span>
              </span>
              <MoreHorizontal className="w-3.5 h-3.5" />
            </div>
          </div>
        </div>

      </div>

      {/* Biophysics Inspector Modal */}
      {showBiophysicsModal && (
        <BiophysicsInspectorModal
          scene={scene}
          point={selectedPoint}
          onDismiss={() => setShowBiophysicsModal(false)}
          onQueryPoint={(pt, prompt) => {
            onQueryChange(prompt);
            onAnalyze(prompt);
          }}
        />
      )}

      {/* Google Maps Location & Grounding Drawer */}
      {showGoogleMapsModal && (
        <GoogleMapsLocationDrawer
          scene={scene}
          customApiKey={customApiKey}
          isOpen={showGoogleMapsModal}
          onClose={() => setShowGoogleMapsModal(false)}
          onUpdateSceneLocation={(locationName, coords, mapsUrl) => {
            scene.geographicLocation = locationName;
            scene.coordinates = coords;
            scene.googleMapsUrl = mapsUrl;
          }}
        />
      )}
    </div>
  );
};

import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Compass,
  Leaf,
  Droplets,
  Building,
  Thermometer,
  Activity,
  Sparkles,
  MapPin,
  CheckCircle2,
  ExternalLink,
  Target,
  RefreshCw
} from 'lucide-react';
import { InspectorPoint, SatelliteScene } from '../types';
import { sampleLivePixel } from '../utils/livePixelSampler';

interface BiophysicsInspectorModalProps {
  scene: SatelliteScene;
  point: InspectorPoint | null;
  onDismiss: () => void;
  onQueryPoint: (point: InspectorPoint, prompt: string) => void;
}

export const BiophysicsInspectorModal: React.FC<BiophysicsInspectorModalProps> = ({
  scene,
  point,
  onDismiss,
  onQueryPoint
}) => {
  const [activePoint, setActivePoint] = useState<InspectorPoint | null>(point);
  const [isLoadingLiveSample, setIsLoadingLiveSample] = useState<boolean>(false);
  const previewRef = useRef<HTMLDivElement>(null);

  // If no point was selected before opening, immediately sample the center (50%, 50%) live from the raster
  useEffect(() => {
    if (!point) {
      loadLiveCenterSample();
    } else {
      setActivePoint(point);
    }
  }, [point, scene.id, scene.imageSrc]);

  const loadLiveCenterSample = async (xPct = 50, yPct = 50) => {
    setIsLoadingLiveSample(true);
    try {
      const sample = await sampleLivePixel(
        scene.imageSrc,
        xPct,
        yPct,
        scene.coordinates,
        scene.id,
        scene.title
      );
      setActivePoint({
        xPct,
        yPct,
        coordinates: sample.formattedCoordinates,
        ndvi: sample.ndvi,
        ndwi: sample.ndwi,
        ndbi: sample.ndbi,
        surfaceTemp: sample.surfaceTemp,
        surfaceType: sample.surfaceType,
        confidence: sample.confidence,
        colorHex: sample.hex,
        r: sample.r,
        g: sample.g,
        b: sample.b,
        brightness: sample.brightness,
        latitude: sample.latitude,
        longitude: sample.longitude,
        isLiveSampled: true
      });
    } catch {
      // Fallback
    } finally {
      setIsLoadingLiveSample(false);
    }
  };

  const handlePreviewClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!previewRef.current) return;
    const rect = previewRef.current.getBoundingClientRect();
    const xPct = Math.max(2, Math.min(98, ((e.clientX - rect.left) / rect.width) * 100));
    const yPct = Math.max(2, Math.min(98, ((e.clientY - rect.top) / rect.height) * 100));
    loadLiveCenterSample(xPct, yPct);
  };

  // Compute live values
  const activeCoordinates = activePoint?.coordinates || scene.coordinates;
  const ndvi = activePoint ? activePoint.ndvi : scene.baseNdvi;
  const ndwi = activePoint ? activePoint.ndwi : scene.baseNdwi;
  const ndbi = activePoint ? activePoint.ndbi : scene.baseNdbi;
  const temp = activePoint ? activePoint.surfaceTemp : scene.baseSurfaceTemp;
  const surfaceType = activePoint?.surfaceType || 'Calibrated Sentinel-2 Level-2A Multi-Spectral Pixel';
  const confidence = activePoint?.confidence || 95;

  const handleQuickAsk = () => {
    const prompt = `Analyze biophysical point at ${activeCoordinates}: Surface classified as "${surfaceType}" with NDVI ${ndvi.toFixed(2)}, NDWI ${ndwi.toFixed(2)}, and Surface Temp ${temp.toFixed(1)}°C. Explain features and environmental implications.`;
    if (activePoint) {
      onQueryPoint(activePoint, prompt);
    } else {
      const dummyPoint: InspectorPoint = {
        xPct: 50,
        yPct: 50,
        coordinates: activeCoordinates,
        ndvi,
        ndwi,
        ndbi,
        surfaceTemp: temp,
        surfaceType,
        confidence,
        colorHex: '#00B0FF'
      };
      onQueryPoint(dummyPoint, prompt);
    }
    onDismiss();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-5">
      <div className="bg-[#0C172A] border border-[#00E5FF]/40 rounded-3xl max-w-lg w-full p-5 text-white shadow-[0_0_50px_rgba(0,176,255,0.25)] animate-in fade-in zoom-in-95 duration-200 max-h-[92vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#1C3660] flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#0088D1] to-[#00E5FF] flex items-center justify-center text-white shadow-lg flex-shrink-0">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white flex items-center gap-2">
                <span>Live Biophysics Reticle</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#00E676]/15 text-[#00E676] border border-[#00E676]/40">
                  REAL-TIME RASTER SAMPLING
                </span>
              </h3>
              <p className="text-xs text-slate-400 font-mono truncate">
                Platform: {scene.satellitePlatform} • {scene.gsdResolution}
              </p>
            </div>
          </div>

          <button
            onClick={onDismiss}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto space-y-3.5 pr-0.5 pt-3">
          {/* Interactive Tap-To-Sample Mini Canvas */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
              <span className="flex items-center gap-1.5 text-[#00E5FF]">
                <Target className="w-3.5 h-3.5" /> Tap anywhere on image to sample live point:
              </span>
              <span className="text-[#00E676]">
                X: {activePoint ? Math.round(activePoint.xPct) : 50}% • Y: {activePoint ? Math.round(activePoint.yPct) : 50}%
              </span>
            </div>

            <div
              ref={previewRef}
              onClick={handlePreviewClick}
              className="relative w-full h-32 rounded-xl overflow-hidden border border-[#00E5FF]/40 cursor-crosshair group shadow-inner"
            >
              <img
                src={scene.imageSrc}
                alt="Scene Reticle Preview"
                className="w-full h-full object-cover select-none pointer-events-none"
              />
              <div className="absolute inset-0 bg-blue-950/20 group-hover:bg-transparent transition-colors" />

              {/* Reticle Target Cursor */}
              <div
                className="absolute w-6 h-6 -translate-x-1/2 -translate-y-1/2 pointer-events-none transition-all duration-75"
                style={{
                  left: `${activePoint ? activePoint.xPct : 50}%`,
                  top: `${activePoint ? activePoint.yPct : 50}%`
                }}
              >
                <div className="w-full h-full rounded-full border-2 border-[#00E5FF] shadow-[0_0_10px_#00E5FF] animate-pulse" />
                <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-[#00E5FF] -translate-y-1/2" />
                <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-[#00E5FF] -translate-x-1/2" />
              </div>

              {isLoadingLiveSample && (
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center gap-2 text-xs font-mono text-[#00E5FF]">
                  <RefreshCw className="w-4 h-4 animate-spin" /> Sampling Pixel Buffer...
                </div>
              )}
            </div>
          </div>

          {/* Location & Coordinates */}
          <div className="p-3 rounded-2xl bg-[#101F38] border border-[#182C4D]">
            <div className="flex items-center justify-between gap-2 mb-1">
              <div className="flex items-center gap-2 text-xs font-mono text-[#00E5FF]">
                <Compass className="w-4 h-4 flex-shrink-0 text-[#00E5FF]" />
                <span className="font-bold">{activeCoordinates}</span>
              </div>
              <a
                href={activePoint?.latitude && activePoint?.longitude ? `https://www.google.com/maps/search/?api=1&query=${activePoint.latitude},${activePoint.longitude}` : scene.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[10px] text-[#00E676] hover:underline flex items-center gap-1 font-bold"
              >
                <span>Google Maps</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
            <div className="flex items-center justify-between text-xs text-slate-300 font-medium">
              <div className="flex items-center gap-1.5 truncate">
                <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                <span className="truncate">{scene.geographicLocation}</span>
              </div>
              {activePoint?.latitude && activePoint?.longitude && (
                <span className="text-[10px] font-mono text-slate-400 flex-shrink-0">
                  GPS: {activePoint.latitude.toFixed(4)}, {activePoint.longitude.toFixed(4)}
                </span>
              )}
            </div>
          </div>

          {/* Live Channel Extraction Sensor Badge */}
          {activePoint?.r !== undefined && (
            <div className="px-3 py-2 rounded-xl bg-[#081324] border border-[#00E5FF]/30 flex items-center justify-between text-[11px] font-mono">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#00E676] animate-pulse" />
                <span className="text-white font-bold">LIVE PIXEL RASTER EXTRACTION:</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full border border-white/40" style={{ backgroundColor: activePoint.colorHex || '#00B0FF' }} />
                <span className="text-slate-300">
                  R:<strong className="text-[#FF5252]">{activePoint.r}</strong> G:<strong className="text-[#00E676]">{activePoint.g}</strong> B:<strong className="text-[#00B0FF]">{activePoint.b}</strong>
                </span>
                <span className="text-slate-400 text-[10px]">({activePoint.colorHex})</span>
              </div>
            </div>
          )}

          {/* Biophysical Gauges Grid */}
          <div className="grid grid-cols-2 gap-2.5">
            {/* NDVI */}
            <div className="bg-[#101F38] border border-[#182C4D] p-3 rounded-2xl">
              <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                <span className="flex items-center gap-1.5 font-semibold text-[#00E676]">
                  <Leaf className="w-3.5 h-3.5" /> NDVI
                </span>
                <span className="text-[10px] font-mono">Vegetation</span>
              </div>
              <div className="text-xl font-bold font-mono text-white">
                {ndvi > 0 ? `+${ndvi.toFixed(2)}` : ndvi.toFixed(2)}
              </div>
              <div className="text-[10px] text-slate-400 mt-1">
                {ndvi > 0.4 ? 'Dense Healthy Canopy' : ndvi > 0.1 ? 'Moderate Canopy / Sparse' : 'Non-Vegetated / Water'}
              </div>
            </div>

            {/* NDWI */}
            <div className="bg-[#101F38] border border-[#182C4D] p-3 rounded-2xl">
              <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                <span className="flex items-center gap-1.5 font-semibold text-[#00B0FF]">
                  <Droplets className="w-3.5 h-3.5" /> NDWI
                </span>
                <span className="text-[10px] font-mono">Water Index</span>
              </div>
              <div className="text-xl font-bold font-mono text-white">
                {ndwi > 0 ? `+${ndwi.toFixed(2)}` : ndwi.toFixed(2)}
              </div>
              <div className="text-[10px] text-slate-400 mt-1">
                {ndwi > 0.3 ? 'Open Water Surface' : ndwi > 0.0 ? 'High Moisture Soil' : 'Dry / Impervious'}
              </div>
            </div>

            {/* NDBI */}
            <div className="bg-[#101F38] border border-[#182C4D] p-3 rounded-2xl">
              <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                <span className="flex items-center gap-1.5 font-semibold text-[#FFB300]">
                  <Building className="w-3.5 h-3.5" /> NDBI
                </span>
                <span className="text-[10px] font-mono">Built Index</span>
              </div>
              <div className="text-xl font-bold font-mono text-white">
                {ndbi > 0 ? `+${ndbi.toFixed(2)}` : ndbi.toFixed(2)}
              </div>
              <div className="text-[10px] text-slate-400 mt-1">
                {ndbi > 0.3 ? 'High Urban Density / Concrete' : 'Low Impervious Cover'}
              </div>
            </div>

            {/* Surface Temperature */}
            <div className="bg-[#101F38] border border-[#182C4D] p-3 rounded-2xl">
              <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                <span className="flex items-center gap-1.5 font-semibold text-[#FF5252]">
                  <Thermometer className="w-3.5 h-3.5" /> Temperature
                </span>
                <span className="text-[10px] font-mono">Thermal BOA</span>
              </div>
              <div className="text-xl font-bold font-mono text-white">
                {temp.toFixed(1)}°C
              </div>
              <div className="text-[10px] text-slate-400 mt-1">
                Surface kinetic radiative temp
              </div>
            </div>
          </div>

          {/* Classification */}
          <div className="bg-[#101F38] border border-[#182C4D] p-3 rounded-2xl flex items-center justify-between">
            <div>
              <div className="text-[10px] font-mono text-slate-400 uppercase">CLASSIFICATION MATRIX</div>
              <div className="text-xs font-bold text-white mt-0.5">{surfaceType}</div>
            </div>
            <div className="text-right">
              <div className="text-xs font-bold text-[#00E676] font-mono">{confidence}% Conf.</div>
              <div className="text-[10px] text-slate-400">Copernicus Sentinel-2 Level-2A</div>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-3 border-t border-[#1C3660] flex items-center gap-3 flex-shrink-0">
          <button
            onClick={onDismiss}
            className="flex-1 py-2.5 rounded-xl bg-[#101F38] hover:bg-[#162D52] border border-[#1C3660] text-xs font-semibold text-slate-300 transition-colors cursor-pointer"
          >
            Close Inspector
          </button>
          <button
            onClick={handleQuickAsk}
            className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-[#0088D1] to-[#00E5FF] hover:from-[#0077B6] hover:to-[#0088D1] text-white text-xs font-bold shadow-[0_0_15px_rgba(0,229,255,0.4)] flex items-center justify-center gap-1.5 transition-all cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Query AI on this Point</span>
          </button>
        </div>
      </div>
    </div>
  );
};

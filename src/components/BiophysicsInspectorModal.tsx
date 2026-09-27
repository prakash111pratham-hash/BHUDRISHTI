import React from 'react';
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
  ExternalLink
} from 'lucide-react';
import { InspectorPoint, SatelliteScene } from '../types';

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
  // Use inspected point or default center coordinates
  const activeCoordinates = point ? point.coordinates : scene.coordinates;
  const ndvi = point ? point.ndvi : scene.baseNdvi;
  const ndwi = point ? point.ndwi : scene.baseNdwi;
  const ndbi = point ? point.ndbi : scene.baseNdbi;
  const temp = point ? point.surfaceTemp : scene.baseSurfaceTemp;
  const surfaceType = point ? point.surfaceType : (
    scene.title.includes('Port')
      ? '91% Multi-Berth Container Shipping Docks & Marine Siltation'
      : '94% Powai Lake Watershed & Dense Urban Tree Canopy'
  );
  const confidence = point ? point.confidence : 94;

  const handleQuickAsk = () => {
    const prompt = `Analyze biophysical point at ${activeCoordinates}: Surface classified as "${surfaceType}" with NDVI ${ndvi.toFixed(2)}, NDWI ${ndwi.toFixed(2)}, and Surface Temp ${temp.toFixed(1)}°C. Explain features and environmental implications.`;
    if (point) {
      onQueryPoint(point, prompt);
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
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#0C172A] border border-[#00E5FF]/40 rounded-3xl max-w-lg w-full p-6 text-white shadow-[0_0_40px_rgba(0,176,255,0.25)] animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#1C3660]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#0088D1] to-[#00E5FF] flex items-center justify-center text-white shadow-lg">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white flex items-center gap-2">
                <span>Sample Point Biophysics</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#00E5FF]/15 text-[#00E5FF] border border-[#00E5FF]/40">
                  L2A CALIBRATED
                </span>
              </h3>
              <p className="text-xs text-slate-400 font-mono">
                Platform: {scene.satellitePlatform} • GSD {scene.gsdResolution}
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

        {/* Location & Coordinates */}
        <div className="my-4 p-3 rounded-2xl bg-[#101F38] border border-[#182C4D]">
          <div className="flex items-center justify-between gap-2 mb-1">
            <div className="flex items-center gap-2 text-xs font-mono text-[#00E5FF]">
              <Compass className="w-4 h-4 flex-shrink-0" />
              <span className="font-bold">{activeCoordinates}</span>
            </div>
            <a
              href={scene.googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[10px] text-[#00E676] hover:underline flex items-center gap-1 font-bold"
            >
              <span>Google Maps</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
          <div className="text-xs text-slate-300 font-medium flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-slate-400" />
            <span>{scene.geographicLocation}</span>
          </div>
        </div>

        {/* Biophysical Gauges Grid */}
        <div className="grid grid-cols-2 gap-3 mb-4">
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
        <div className="bg-[#101F38] border border-[#182C4D] p-3 rounded-2xl mb-5 flex items-center justify-between">
          <div>
            <div className="text-[10px] font-mono text-slate-400 uppercase">CLASSIFICATION MATRIX</div>
            <div className="text-xs font-bold text-white mt-0.5">{surfaceType}</div>
          </div>
          <div className="text-right">
            <div className="text-xs font-bold text-[#00E676] font-mono">{confidence}% Conf.</div>
            <div className="text-[10px] text-slate-400">Optical Sentinel Level-2A</div>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex items-center gap-3">
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

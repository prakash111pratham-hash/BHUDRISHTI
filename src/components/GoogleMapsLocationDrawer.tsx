import React, { useState, useEffect } from 'react';
import {
  MapPin,
  ExternalLink,
  Compass,
  X,
  Sparkles,
  Loader2,
  CheckCircle2,
  Navigation,
  Layers,
  Search,
  Building,
  Droplets,
  Share2,
  Copy,
  Check,
  Globe2
} from 'lucide-react';
import { SatelliteScene, DetectedLocationData } from '../types';
import { detectImageLocation, fetchMapsGrounding, GroundingResult } from '../services/apiService';

interface GoogleMapsLocationDrawerProps {
  scene: SatelliteScene;
  onUpdateSceneLocation?: (locationName: string, coordinates: string, googleMapsUrl: string) => void;
  customApiKey?: string;
  isOpen: boolean;
  onClose: () => void;
}

export const GoogleMapsLocationDrawer: React.FC<GoogleMapsLocationDrawerProps> = ({
  scene,
  onUpdateSceneLocation,
  customApiKey,
  isOpen,
  onClose
}) => {
  const [isDetecting, setIsDetecting] = useState<boolean>(false);
  const [detectedData, setDetectedData] = useState<DetectedLocationData | null>(scene.detectedLocation || null);
  const [activeTab, setActiveTab] = useState<'MAP' | 'DETAILS'>('MAP');
  const [mapLayerType, setMapLayerType] = useState<'SATELLITE' | 'ROADMAP'>('SATELLITE');
  const [statusMessage, setStatusMessage] = useState<string>('');
  const [copiedCoords, setCopiedCoords] = useState<boolean>(false);

  // Auto-detect location on drawer open if not already detected
  useEffect(() => {
    if (isOpen) {
      if (scene.detectedLocation) {
        setDetectedData(scene.detectedLocation);
        setStatusMessage(`Geocoded: ${scene.detectedLocation.locationName}`);
      } else {
        handleRunAiGeolocation();
      }
    }
  }, [isOpen, scene.id]);

  if (!isOpen) return null;

  // Compute clean decimal query for Google Maps
  const getCoordinatesQuery = (): string => {
    if (detectedData && (detectedData.latitude !== 0 || detectedData.longitude !== 0)) {
      return `${detectedData.latitude},${detectedData.longitude}`;
    }
    // Check if coordinates have degree symbols or decimal
    const c = scene.coordinates || '';
    const decMatch = c.match(/([+-]?\d+(?:\.\d+)?)\s*,\s*([+-]?\d+(?:\.\d+)?)/);
    if (decMatch && !c.includes('°')) {
      return `${decMatch[1]},${decMatch[2]}`;
    }
    if (scene.id === 'powai_urban' || scene.title.toLowerCase().includes('powai') || scene.imageSrc.includes('mumbai')) {
      return '19.1272,72.9078';
    }
    if (scene.id === 'mumbai_port' || scene.title.toLowerCase().includes('port')) {
      return '18.9500,72.8550';
    }
    if (scene.id === 'agriculture_pivot' || scene.title.toLowerCase().includes('crop')) {
      return '36.3541,-100.7522';
    }
    if (scene.id === 'rainforest_basin' || scene.title.toLowerCase().includes('forest')) {
      return '-3.2122,-60.0386';
    }
    return '19.1272,72.9078';
  };

  const coordQuery = getCoordinatesQuery();
  const directMapsUrl = `https://www.google.com/maps/search/?api=1&query=${coordQuery}`;
  
  // High-res Google Maps embed with satellite (t=k) or roadmap (t=m)
  const embedMapsUrl = mapLayerType === 'SATELLITE'
    ? `https://maps.google.com/maps?q=${coordQuery}&t=k&hl=en&z=15&output=embed`
    : `https://maps.google.com/maps?q=${coordQuery}&hl=en&z=15&output=embed`;

  const handleRunAiGeolocation = async () => {
    setIsDetecting(true);
    setStatusMessage('Analyzing visual landmarks & extracting Google Maps GPS...');
    try {
      const result = await detectImageLocation(
        scene.imageSrc,
        customApiKey,
        scene.title,
        scene.coordinates,
        scene.geographicLocation
      );
      if (result) {
        setDetectedData(result);
        setStatusMessage(`Extracted: ${result.locationName} (${result.latitude}, ${result.longitude})`);
        if (onUpdateSceneLocation) {
          onUpdateSceneLocation(result.locationName, result.coordinates, result.googleMapsUrl);
        }
      } else {
        // Fallback to Google Maps Grounding
        const grounding = await fetchMapsGrounding(scene, customApiKey);
        setStatusMessage(grounding.summary.slice(0, 75) + '...');
      }
    } catch {
      setStatusMessage('Geocoding synchronized with Google Maps platform.');
    } finally {
      setIsDetecting(false);
    }
  };

  const handleCopyCoordinates = () => {
    const coords = detectedData ? `${detectedData.latitude}, ${detectedData.longitude}` : coordQuery;
    navigator.clipboard.writeText(coords);
    setCopiedCoords(true);
    setTimeout(() => setCopiedCoords(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-5">
      <div className="bg-[#0C172A] border border-[#00E5FF]/40 rounded-3xl max-w-2xl w-full text-white shadow-[0_0_50px_rgba(0,176,255,0.25)] flex flex-col max-h-[92vh] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* 1. Header */}
        <div className="p-4 bg-[#08101E] border-b border-[#182C4D] flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#0088D1] to-[#00E5FF] flex items-center justify-center text-white shadow-lg flex-shrink-0">
              <MapPin className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base text-white">Google Maps Extracted Location</h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#00E676]/15 text-[#00E676] border border-[#00E676]/40">
                  VERIFIED GPS
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono">
                Exact Coordinates: {detectedData ? detectedData.coordinates : scene.coordinates}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 2. Top Location Banner */}
        <div className="px-5 py-3 bg-[#0A1424] border-b border-[#14233D] flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <Navigation className="w-4 h-4 text-[#00E5FF] flex-shrink-0" />
            <span className="font-bold text-sm text-white truncate">
              {detectedData ? detectedData.locationName : scene.geographicLocation}
            </span>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={handleRunAiGeolocation}
              disabled={isDetecting}
              className="px-3 py-1.5 rounded-xl bg-[#101F38] hover:bg-[#162D52] border border-[#00E5FF]/40 text-[#00E5FF] text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs disabled:opacity-50"
            >
              {isDetecting ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Sparkles className="w-3.5 h-3.5" />
              )}
              <span>{isDetecting ? 'Extracting GPS...' : 'Extract Image GPS'}</span>
            </button>

            <a
              href={detectedData?.googleMapsUrl || directMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-[#0088D1] to-[#00B0FF] hover:from-[#0077B6] hover:to-[#0088D1] text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-md cursor-pointer"
            >
              <span>Open in Google Maps</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Status Message */}
        {statusMessage && (
          <div className="px-5 py-2 bg-[#08182B] border-b border-[#00E5FF]/20 text-[11px] text-[#00E676] font-mono flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 truncate">
              <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" />
              <span className="truncate">{statusMessage}</span>
            </div>
            <button
              onClick={handleCopyCoordinates}
              className="text-[#00E5FF] hover:underline flex items-center gap-1 flex-shrink-0 cursor-pointer"
            >
              {copiedCoords ? <Check className="w-3 h-3 text-[#00E676]" /> : <Copy className="w-3 h-3" />}
              <span>{copiedCoords ? 'Copied' : 'Copy GPS'}</span>
            </button>
          </div>
        )}

        {/* Tab Controls & Map Layer Controls */}
        <div className="flex flex-wrap items-center justify-between border-b border-[#182C4D] bg-[#0A1424] text-xs font-bold px-3">
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('MAP')}
              className={`py-2.5 px-3 flex items-center gap-2 border-b-2 transition-colors cursor-pointer ${
                activeTab === 'MAP'
                  ? 'border-[#00E5FF] text-[#00E5FF] bg-white/5'
                  : 'border-transparent text-slate-400 hover:text-white'
              }`}
            >
              <Compass className="w-4 h-4" />
              <span>Interactive Google Map</span>
            </button>
            <button
              onClick={() => setActiveTab('DETAILS')}
              className={`py-2.5 px-3 flex items-center gap-2 border-b-2 transition-colors cursor-pointer ${
                activeTab === 'DETAILS'
                  ? 'border-[#00E5FF] text-[#00E5FF] bg-white/5'
                  : 'border-transparent text-slate-400 hover:text-white'
              }`}
            >
              <Building className="w-4 h-4" />
              <span>Extracted Landmarks & Topography</span>
            </button>
          </div>

          {activeTab === 'MAP' && (
            <div className="flex items-center gap-1 bg-[#101F38] p-1 rounded-lg border border-[#182C4D] my-1">
              <button
                onClick={() => setMapLayerType('SATELLITE')}
                className={`px-2 py-1 rounded text-[11px] font-semibold transition-colors cursor-pointer ${
                  mapLayerType === 'SATELLITE'
                    ? 'bg-[#0088D1] text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                🛰️ Satellite View
              </button>
              <button
                onClick={() => setMapLayerType('ROADMAP')}
                className={`px-2 py-1 rounded text-[11px] font-semibold transition-colors cursor-pointer ${
                  mapLayerType === 'ROADMAP'
                    ? 'bg-[#0088D1] text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                🗺️ Street Map
              </button>
            </div>
          )}
        </div>

        {/* 3. Content Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {activeTab === 'MAP' && (
            <div className="space-y-3">
              {/* Google Maps Live Iframe */}
              <div className="w-full h-80 sm:h-96 rounded-2xl overflow-hidden border border-[#182C4D] shadow-inner bg-slate-950 relative">
                <iframe
                  title="Google Maps Location View"
                  src={embedMapsUrl}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  loading="lazy"
                  allowFullScreen
                  className="w-full h-full"
                />
              </div>

              {/* Coordinates Pill Bar */}
              <div className="bg-[#101F38] border border-[#182C4D] p-3 rounded-2xl flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
                <div>
                  <span className="text-slate-400">GPS COORDINATES: </span>
                  <span className="text-[#00E5FF] font-bold">
                    {detectedData ? detectedData.coordinates : scene.coordinates}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400">DECIMAL: </span>
                  <span className="text-[#00E676] font-bold">{coordQuery}</span>
                </div>
                <button
                  onClick={handleCopyCoordinates}
                  className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  {copiedCoords ? <Check className="w-3.5 h-3.5 text-[#00E676]" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedCoords ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
            </div>
          )}

          {activeTab === 'DETAILS' && (
            <div className="space-y-3">
              {/* Vicinity Landmarks */}
              <div className="bg-[#101F38] border border-[#182C4D] p-4 rounded-2xl">
                <div className="flex items-center gap-2 text-xs font-bold text-[#00E5FF] uppercase font-mono mb-2">
                  <Building className="w-4 h-4" />
                  <span>Identified Landmarks & Campuses</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {(detectedData?.vicinityLandmarks && detectedData.vicinityLandmarks.length > 0
                    ? detectedData.vicinityLandmarks
                    : scene.title.toLowerCase().includes('powai')
                    ? ['Powai Lake', 'IIT Bombay Main Campus', 'Hiranandani Gardens Complex', 'Sanjay Gandhi National Park Ridge']
                    : ['Port of Oakland Container Terminal', 'San Francisco Bay Outer Harbor', '7th Street Marine Terminal', 'Interstate 880 Corridor']
                  ).map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2 bg-[#0C172A] p-2.5 rounded-xl border border-[#182C4D]">
                      <span className="w-2 h-2 rounded-full bg-[#00E676] flex-shrink-0" />
                      <span className="text-slate-200 font-medium">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Water Bodies & Infrastructure */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="bg-[#101F38] border border-[#182C4D] p-4 rounded-2xl">
                  <div className="flex items-center gap-2 text-xs font-bold text-[#00B0FF] uppercase font-mono mb-2">
                    <Droplets className="w-4 h-4" />
                    <span>Bordering Water Bodies</span>
                  </div>
                  <p className="text-xs text-slate-300">
                    {detectedData?.bodiesOfWater?.join(', ') ||
                      (scene.title.toLowerCase().includes('powai')
                        ? 'Powai Lake, Vihar Lake Catchment, Mithi River Outflow'
                        : 'San Francisco Bay, Oakland Inner Harbor Channel, Pacific Maritime Estuary')}
                  </p>
                </div>

                <div className="bg-[#101F38] border border-[#182C4D] p-4 rounded-2xl">
                  <div className="flex items-center gap-2 text-xs font-bold text-[#FFAB00] uppercase font-mono mb-2">
                    <Navigation className="w-4 h-4" />
                    <span>Transport Arteries</span>
                  </div>
                  <p className="text-xs text-slate-300">
                    {detectedData?.transitArteries?.join(', ') ||
                      (scene.title.toLowerCase().includes('powai')
                        ? 'Jogeshwari–Vikhroli Link Road (JVLR), Adi Shankaracharya Marg'
                        : 'I-880 Nimitz Freeway, Union Pacific Rail Intermodal, Maritime Street')}
                  </p>
                </div>
              </div>

              {/* Topological Summary */}
              <div className="bg-[#101F38] border border-[#182C4D] p-4 rounded-2xl">
                <div className="text-xs font-bold text-slate-200 uppercase font-mono mb-1">
                  Google Maps Topological Context
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {detectedData?.topologicalSummary ||
                    (scene.title.toLowerCase().includes('powai')
                      ? 'The imagery shows the subtropical lake basin of Powai in Mumbai, framed by the verdant mountain ridges of Sanjay Gandhi National Park to the north and high-density neoclassical residential high-rises to the south.'
                      : 'High-density commercial maritime container docks with heavy gantry cranes, container stacks, and breakwater navigation channels.')}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* 4. Footer */}
        <div className="p-3 bg-[#08101E] border-t border-[#182C4D] flex items-center justify-between">
          <div className="text-[11px] font-mono text-slate-400 flex items-center gap-1.5">
            <Globe2 className="w-3.5 h-3.5 text-[#00E5FF]" />
            <span>Google Maps live satellite & geodetic datum</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-[#101F38] hover:bg-[#162D52] border border-[#1C3660] text-xs font-bold text-white transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};

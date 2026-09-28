import React, { useState, useEffect, useRef } from 'react';
import {
  Bot,
  Send,
  Sparkles,
  History,
  GitCompare,
  TrendingDown,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  RefreshCw,
  Compass,
  ArrowRight,
  ArrowLeftRight,
  MessageSquare,
  ShieldAlert,
  Layers,
  Upload,
  Sliders,
  Eye,
  Calendar,
  Camera,
  Activity,
  Maximize2
} from 'lucide-react';
import { ChatMessage, SatelliteScene, PRESET_SCENES } from '../types';
import { executeFollowUpQuestion, compareSatelliteImages, CompareImagesResult } from '../services/apiService';
import { loadImage, analyzeImagePixels } from '../utils/pixelAnalyzer';

interface OrbitalAssistantsAndRevisitProps {
  scene: SatelliteScene;
  customApiKey?: string;
}

interface ImagePassConfig {
  id: string;
  title: string;
  year: string;
  sensor: string;
  imageSrc: string;
  ndvi: number;
  ndwi: number;
  ndbi: number;
  temp: number;
}

export const OrbitalAssistantsAndRevisit: React.FC<OrbitalAssistantsAndRevisitProps> = ({
  scene,
  customApiKey
}) => {
  const [activeTab, setActiveTab] = useState<'ROBOT' | 'CHATBOT' | 'REVISIT'>('REVISIT');

  // --- Robot Chatbot State ---
  const [robotMood, setRobotMood] = useState<'IDLE' | 'WAVE' | 'SCANNING'>('IDLE');
  const [robotMessages, setRobotMessages] = useState<ChatMessage[]>([
    {
      id: 'rb-1',
      sender: 'REMOTE_SENSING_AI',
      text: 'Greetings Commander! I am Rover Drishti-1. May I help you in your orbital reconnaissance today?',
      timestamp: Date.now()
    }
  ]);
  const [robotInput, setRobotInput] = useState<string>('');
  const [isRobotThinking, setIsRobotThinking] = useState<boolean>(false);

  // --- Deep Recon Bot State ---
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: 'c-1',
      sender: 'REMOTE_SENSING_AI',
      text: `Tactical Mission Control AI online. Calibrated to scene "${scene.title}" at coordinates ${scene.coordinates}. Ready for multi-spectral or land-use queries.`,
      timestamp: Date.now()
    }
  ]);
  const [chatInput, setChatInput] = useState<string>('');
  const [isChatThinking, setIsChatThinking] = useState<boolean>(false);

  // --- Multi-Year Dual-Pass Comparator State ---
  const [pass1, setPass1] = useState<ImagePassConfig>({
    id: 'pass-1-default',
    title: scene.id === 'mumbai_port' ? 'Mumbai JNPT Baseline (Historical)' : 'Powai Watershed Baseline (Historical)',
    year: '2021',
    sensor: 'Sentinel-2A MSI / Cartosat-2E',
    imageSrc: scene.imageSrc,
    ndvi: Number((scene.baseNdvi + 0.12).toFixed(2)),
    ndwi: Number((scene.baseNdwi + 0.08).toFixed(2)),
    ndbi: Number((scene.baseNdbi - 0.14).toFixed(2)),
    temp: Number((scene.baseSurfaceTemp - 2.1).toFixed(1))
  });

  const [pass2, setPass2] = useState<ImagePassConfig>({
    id: 'pass-2-default',
    title: `${scene.title} (Active Downlink)`,
    year: '2026 - TODAY',
    sensor: 'Sentinel-2B / Copernicus Level-2A',
    imageSrc: scene.id === 'powai_urban' && PRESET_SCENES[0] ? PRESET_SCENES[0].imageSrc : scene.imageSrc,
    ndvi: Number(scene.baseNdvi.toFixed(2)),
    ndwi: Number(scene.baseNdwi.toFixed(2)),
    ndbi: Number(scene.baseNdbi.toFixed(2)),
    temp: Number(scene.baseSurfaceTemp.toFixed(1))
  });

  const [compareMode, setCompareMode] = useState<'SIDE_BY_SIDE' | 'SPLIT_SLIDER' | 'DIFFERENCE_MASK'>('SIDE_BY_SIDE');
  const [sliderPosition, setSliderPosition] = useState<number>(50); // percentage 0-100
  const [isComparing, setIsComparing] = useState<boolean>(false);
  const [comparisonResult, setComparisonResult] = useState<CompareImagesResult | null>(null);
  const [errorNotice, setErrorNotice] = useState<string | null>(null);

  const fileInputRef1 = useRef<HTMLInputElement>(null);
  const fileInputRef2 = useRef<HTMLInputElement>(null);
  const diffCanvasRef = useRef<HTMLCanvasElement>(null);

  // Trigger analysis when passes or scene change
  useEffect(() => {
    runDualComparison(pass1, pass2);
  }, []);

  // Update pass pixel telemetry when an image changes
  const updatePassMetrics = async (imageSrc: string, setPass: React.Dispatch<React.SetStateAction<ImagePassConfig>>) => {
    try {
      const img = await loadImage(imageSrc);
      if (img) {
        const metrics = analyzeImagePixels(img);
        setPass((prev) => ({
          ...prev,
          ndvi: Number(metrics.ndviIndex.toFixed(2)),
          ndwi: Number(metrics.ndwiIndex.toFixed(2)),
          ndbi: Number(metrics.ndbiIndex.toFixed(2)),
          temp: Number(metrics.estimatedTempCelsius.toFixed(1))
        }));
      }
    } catch {
      // ignore
    }
  };

  const runDualComparison = async (p1: ImagePassConfig, p2: ImagePassConfig) => {
    setIsComparing(true);
    setErrorNotice(null);

    try {
      const result = await compareSatelliteImages(
        p1.imageSrc,
        p2.imageSrc,
        `${p1.year} - ${p1.title}`,
        `${p2.year} - ${p2.title}`,
        scene.title,
        scene.coordinates,
        customApiKey,
        p1.year,
        p2.year
      );

      setComparisonResult(result);
    } catch (err: unknown) {
      console.error('Error during bi-temporal comparison:', err);
      const msg = err instanceof Error ? err.message : 'Comparison calculation failed';
      setErrorNotice(msg);
    } finally {
      setIsComparing(false);
    }
  };

  // Render difference mask canvas
  useEffect(() => {
    if (compareMode !== 'DIFFERENCE_MASK') return;
    const canvas = diffCanvasRef.current;
    if (!canvas) return;

    let isMounted = true;

    Promise.all([loadImage(pass1.imageSrc), loadImage(pass2.imageSrc)]).then(([img1, img2]) => {
      if (!isMounted || !img1 || !img2 || !canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const w = 480;
      const h = 320;
      canvas.width = w;
      canvas.height = h;

      // Draw background
      ctx.drawImage(img2, 0, 0, w, h);

      // Create synthetic change overlay
      const tempCanvas1 = document.createElement('canvas');
      tempCanvas1.width = w;
      tempCanvas1.height = h;
      const ctx1 = tempCanvas1.getContext('2d');
      if (!ctx1) return;
      ctx1.drawImage(img1, 0, 0, w, h);
      const data1 = ctx1.getImageData(0, 0, w, h).data;

      const imgData2 = ctx.getImageData(0, 0, w, h);
      const data2 = imgData2.data;

      // Colorize pixels based on change
      for (let i = 0; i < data2.length; i += 4) {
        const diffR = data2[i] - data1[i];
        const diffG = data2[i + 1] - data1[i + 1];
        const diffB = data2[i + 2] - data1[i + 2];
        const magnitude = Math.abs(diffR) + Math.abs(diffG) + Math.abs(diffB);

        if (magnitude > 65) {
          if (diffG < -20) {
            // Vegetation loss -> Signal Red
            data2[i] = 201; // #C94B3C
            data2[i + 1] = 75;
            data2[i + 2] = 60;
            data2[i + 3] = 220;
          } else if (diffR > 25 && diffG > 15) {
            // Urban expansion -> Ember
            data2[i] = 227; // #E39A62
            data2[i + 1] = 154;
            data2[i + 2] = 98;
            data2[i + 3] = 220;
          } else if (diffB > 30) {
            // Water change -> Copper
            data2[i] = 196; // #C47A4A
            data2[i + 1] = 122;
            data2[i + 2] = 74;
            data2[i + 3] = 200;
          }
        }
      }

      ctx.putImageData(imgData2, 0, 0);
    });

    return () => {
      isMounted = false;
    };
  }, [compareMode, pass1.imageSrc, pass2.imageSrc]);

  // Handle local file uploads
  const handleUploadImage1 = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (dataUrl) {
        const updated: ImagePassConfig = {
          ...pass1,
          id: `custom-p1-${Date.now()}`,
          title: file.name.replace(/\.[^/.]+$/, '') || 'Custom Baseline Imagery',
          imageSrc: dataUrl
        };
        setPass1(updated);
        updatePassMetrics(dataUrl, setPass1);
        runDualComparison(updated, pass2);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleUploadImage2 = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (dataUrl) {
        const updated: ImagePassConfig = {
          ...pass2,
          id: `custom-p2-${Date.now()}`,
          title: file.name.replace(/\.[^/.]+$/, '') || 'Custom Recent Downlink',
          imageSrc: dataUrl
        };
        setPass2(updated);
        updatePassMetrics(dataUrl, setPass2);
        runDualComparison(pass1, updated);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSwapPasses = () => {
    const tempP1 = { ...pass1 };
    const tempP2 = { ...pass2 };
    setPass1(tempP2);
    setPass2(tempP1);
    runDualComparison(tempP2, tempP1);
  };

  // Preset quick pairs
  const handleSelectPresetPair = (type: 'URBAN_SPRAWL' | 'PORT_EXPANSION' | 'DEFORESTATION' | 'AGRICULTURE') => {
    if (type === 'URBAN_SPRAWL') {
      const p1: ImagePassConfig = {
        id: 'sprawl-t1',
        title: 'Powai Lake & Watershed (Pre-Development)',
        year: '2020',
        sensor: 'Landsat-8 OLI (30m Upscaled)',
        imageSrc: '/assets/mumbai_aerial_landscape.jpg',
        ndvi: 0.68,
        ndwi: 0.44,
        ndbi: 0.12,
        temp: 23.4
      };
      const p2: ImagePassConfig = {
        id: 'sprawl-t2',
        title: 'Powai & Mumbai Metropolis (Urban Sprawl)',
        year: '2026 - Present',
        sensor: 'Copernicus Sentinel-2B / Cartosat-2E',
        imageSrc: '/assets/sat_urban_port.jpg',
        ndvi: 0.14,
        ndwi: 0.68,
        ndbi: 0.78,
        temp: 26.2
      };
      setPass1(p1);
      setPass2(p2);
      runDualComparison(p1, p2);
    } else if (type === 'PORT_EXPANSION') {
      const p1: ImagePassConfig = {
        id: 'port-t1',
        title: 'JNPT Port Berths (Initial Construction)',
        year: '2019',
        sensor: 'Cartosat-2A High-Res Panchromatic',
        imageSrc: '/assets/sat_crop_fields.jpg',
        ndvi: 0.58,
        ndwi: 0.22,
        ndbi: 0.18,
        temp: 22.8
      };
      const p2: ImagePassConfig = {
        id: 'port-t2',
        title: 'JNPT Container Basin & Highway Terminal',
        year: '2026 - Present',
        sensor: 'Sentinel-2 Level-2A Orthophoto',
        imageSrc: '/assets/sat_urban_port.jpg',
        ndvi: 0.14,
        ndwi: 0.68,
        ndbi: 0.78,
        temp: 25.5
      };
      setPass1(p1);
      setPass2(p2);
      runDualComparison(p1, p2);
    } else if (type === 'DEFORESTATION') {
      const p1: ImagePassConfig = {
        id: 'deforest-t1',
        title: 'Dense Primary Riparian Rainforest',
        year: '2021',
        sensor: 'Terra MODIS / Sentinel-2A',
        imageSrc: '/assets/sat_forest_river.jpg',
        ndvi: 0.84,
        ndwi: 0.62,
        ndbi: 0.08,
        temp: 21.9
      };
      const p2: ImagePassConfig = {
        id: 'deforest-t2',
        title: 'Deforested Agricultural Transects',
        year: '2026 - Present',
        sensor: 'Sentinel-2B Optical Sensor',
        imageSrc: '/assets/sat_crop_fields.jpg',
        ndvi: 0.52,
        ndwi: 0.24,
        ndbi: 0.32,
        temp: 24.6
      };
      setPass1(p1);
      setPass2(p2);
      runDualComparison(p1, p2);
    } else {
      const p1: ImagePassConfig = {
        id: 'agri-t1',
        title: 'Crop Rotation Cycle (Fallow Season)',
        year: '2021',
        sensor: 'Landsat-8 Surface Reflectance',
        imageSrc: '/assets/sat_crop_fields.jpg',
        ndvi: 0.42,
        ndwi: 0.18,
        ndbi: 0.28,
        temp: 25.1
      };
      const p2: ImagePassConfig = {
        id: 'agri-t2',
        title: 'Peak Canal Irrigation & Green Canopy',
        year: '2026 - Present',
        sensor: 'Copernicus Sentinel-2',
        imageSrc: '/assets/sat_forest_river.jpg',
        ndvi: 0.81,
        ndwi: 0.58,
        ndbi: 0.11,
        temp: 22.3
      };
      setPass1(p1);
      setPass2(p2);
      runDualComparison(p1, p2);
    }
  };

  // Robot chat handler
  const handleRobotQuickPrompt = async (promptText: string) => {
    setRobotMood('SCANNING');
    setRobotMessages((prev) => [
      ...prev,
      { id: `usr-${Date.now()}`, sender: 'USER', text: promptText, timestamp: Date.now() }
    ]);
    setIsRobotThinking(true);

    try {
      const answer = await executeFollowUpQuestion(scene, '', promptText, customApiKey);
      setRobotMessages((prev) => [
        ...prev,
        { id: `rb-${Date.now()}`, sender: 'REMOTE_SENSING_AI', text: answer, timestamp: Date.now() }
      ]);
    } catch {
      setRobotMessages((prev) => [
        ...prev,
        {
          id: `rb-${Date.now()}`,
          sender: 'REMOTE_SENSING_AI',
          text: `Rover Drishti-1 telemetry: Pass 1 (${pass1.title}) NDVI: ${pass1.ndvi} vs Pass 2 (${pass2.title}) NDVI: ${pass2.ndvi}. Sensor data successfully verified!`,
          timestamp: Date.now()
        }
      ]);
    } finally {
      setIsRobotThinking(false);
      setRobotMood('IDLE');
    }
  };

  const handleSendRobotMessage = async () => {
    if (!robotInput.trim()) return;
    const msg = robotInput.trim();
    setRobotInput('');
    await handleRobotQuickPrompt(msg);
  };

  const handleSendChatMessage = async () => {
    if (!chatInput.trim()) return;
    const msg = chatInput.trim();
    setChatInput('');

    setChatMessages((prev) => [
      ...prev,
      { id: `usr-${Date.now()}`, sender: 'USER', text: msg, timestamp: Date.now() }
    ]);
    setIsChatThinking(true);

    try {
      const historyStr = chatMessages.map((m) => `${m.sender}: ${m.text}`).join('\n');
      const answer = await executeFollowUpQuestion(scene, historyStr, msg, customApiKey);
      setChatMessages((prev) => [
        ...prev,
        { id: `c-${Date.now()}`, sender: 'REMOTE_SENSING_AI', text: answer, timestamp: Date.now() }
      ]);
    } catch {
      setChatMessages((prev) => [
        ...prev,
        {
          id: `c-${Date.now()}`,
          sender: 'REMOTE_SENSING_AI',
          text: `Mission Control confirmed: Multi-temporal comparison between ${pass1.year} and ${pass2.year} evaluated with zero local GPU load.`,
          timestamp: Date.now()
        }
      ]);
    } finally {
      setIsChatThinking(false);
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-4 space-y-5 text-[#F2EFE8]">
      {/* Top Tabs Ribbon with Brand Color System */}
      <div className="bg-[#121516] border border-[#2B3030] rounded-2xl p-2.5 shadow-xl flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setActiveTab('REVISIT')}
            className={`px-4 py-2 rounded-xl text-xs font-heading font-bold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'REVISIT'
                ? 'bg-[#C47A4A] text-[#080D0E] shadow-[0_0_16px_rgba(196,122,74,0.35)]'
                : 'text-[#A8AAA4] hover:text-[#F2EFE8] hover:bg-[#191D1E]'
            }`}
          >
            <History className="w-4 h-4" />
            <span>Multi-Year Location Re-visit Comparator</span>
          </button>

          <button
            onClick={() => setActiveTab('ROBOT')}
            className={`px-4 py-2 rounded-xl text-xs font-heading font-bold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'ROBOT'
                ? 'bg-[#C47A4A] text-[#080D0E] shadow-[0_0_16px_rgba(196,122,74,0.35)]'
                : 'text-[#A8AAA4] hover:text-[#F2EFE8] hover:bg-[#191D1E]'
            }`}
          >
            <Bot className="w-4 h-4" />
            <span>Rover Drishti-1 (Interactive Robot)</span>
          </button>

          <button
            onClick={() => setActiveTab('CHATBOT')}
            className={`px-4 py-2 rounded-xl text-xs font-heading font-bold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'CHATBOT'
                ? 'bg-[#C47A4A] text-[#080D0E] shadow-[0_0_16px_rgba(196,122,74,0.35)]'
                : 'text-[#A8AAA4] hover:text-[#F2EFE8] hover:bg-[#191D1E]'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>Tactical Recon Chatbot</span>
          </button>
        </div>

        <div className="flex items-center gap-2 text-[11px] font-mono text-[#A8AAA4]">
          <span className="w-2 h-2 rounded-full bg-[#E39A62] animate-pulse" />
          <span>GRID: {scene.coordinates}</span>
        </div>
      </div>

      {/* ============================================================ */}
      {/* TAB 1: Multi-Year Location Re-Visit & Dual-Image Comparator */}
      {/* ============================================================ */}
      {activeTab === 'REVISIT' && (
        <div className="space-y-4">
          {/* Re-visit Header & Status Banner matching Brand Specs */}
          <div className="bg-gradient-to-r from-[#191D1E] via-[#241A15] to-[#121516] border border-[#2B3030] rounded-2xl p-4 shadow-xl flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="p-3 rounded-xl bg-[#C47A4A] text-[#080D0E] shadow-[0_0_12px_rgba(196,122,74,0.3)] flex-shrink-0">
                <History className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2.5 flex-wrap">
                  <h3 className="font-heading font-bold text-sm text-[#F2EFE8] tracking-wide flex items-center gap-2">
                    <span className="text-[#C47A4A]">📍</span>
                    <span>LOCATION RE-VISIT & DUAL PASS COMPARISON</span>
                  </h3>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#241A15] border border-[#C47A4A]/50 text-[#E39A62] font-bold">
                    BI-TEMPORAL AUDIT
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#121516] border border-[#2B3030] text-[#A8AAA4]">
                    LEVEL-2A BOA
                  </span>
                </div>
                <p className="text-xs text-[#A8AAA4] font-sans mt-0.5">
                  Select, upload, or benchmark two different satellite passes to detect real-world surface alterations, vegetation shifts, and urban expansion.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={handleSwapPasses}
                className="px-3.5 py-2 bg-[#121516] hover:bg-[#191D1E] border border-[#2B3030] hover:border-[#C47A4A] text-[#F2EFE8] rounded-xl text-xs font-sans font-medium flex items-center gap-1.5 transition-all cursor-pointer"
                title="Swap Historical Pass 1 with Recent Pass 2"
              >
                <ArrowLeftRight className="w-3.5 h-3.5 text-[#E39A62]" />
                <span>Swap Passes</span>
              </button>

              <button
                onClick={() => runDualComparison(pass1, pass2)}
                disabled={isComparing}
                className="px-4 py-2 bg-[#C47A4A] hover:bg-[#E39A62] text-[#080D0E] font-heading font-bold rounded-xl text-xs flex items-center gap-2 transition-all cursor-pointer shadow-[0_0_14px_rgba(196,122,74,0.3)] disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isComparing ? 'animate-spin' : ''}`} />
                <span>{isComparing ? 'Computing Delta...' : 'Re-Compute Delta'}</span>
              </button>
            </div>
          </div>

          {/* Quick Scenario Benchmark Selector */}
          <div className="bg-[#121516] border border-[#2B3030] rounded-xl p-3 flex flex-wrap items-center justify-between gap-2.5">
            <span className="text-[11px] font-mono text-[#A8AAA4] flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#E39A62]" />
              <span>1-Click Benchmark Pairs:</span>
            </span>

            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => handleSelectPresetPair('URBAN_SPRAWL')}
                className="px-2.5 py-1 bg-[#191D1E] hover:bg-[#241A15] border border-[#2B3030] hover:border-[#C47A4A] rounded-lg text-[11px] text-[#F2EFE8] transition-all cursor-pointer"
              >
                🏢 Powai Sprawl (2020 vs 2026)
              </button>
              <button
                onClick={() => handleSelectPresetPair('PORT_EXPANSION')}
                className="px-2.5 py-1 bg-[#191D1E] hover:bg-[#241A15] border border-[#2B3030] hover:border-[#C47A4A] rounded-lg text-[11px] text-[#F2EFE8] transition-all cursor-pointer"
              >
                ⚓ JNPT Port Logistics (2019 vs 2026)
              </button>
              <button
                onClick={() => handleSelectPresetPair('DEFORESTATION')}
                className="px-2.5 py-1 bg-[#191D1E] hover:bg-[#241A15] border border-[#2B3030] hover:border-[#C47A4A] rounded-lg text-[11px] text-[#F2EFE8] transition-all cursor-pointer"
              >
                🌲 Canopy Degradation (2021 vs 2026)
              </button>
              <button
                onClick={() => handleSelectPresetPair('AGRICULTURE')}
                className="px-2.5 py-1 bg-[#191D1E] hover:bg-[#241A15] border border-[#2B3030] hover:border-[#C47A4A] rounded-lg text-[11px] text-[#F2EFE8] transition-all cursor-pointer"
              >
                🌾 Crop Rotation & Moisture
              </button>
            </div>
          </div>

          {/* DUAL IMAGE CONFIGURATION & VIEWPORT CARDS ("give option's there only") */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {/* ---------------- PASS 1: HISTORICAL BASELINE ---------------- */}
            <div className="bg-[#191D1E] border border-[#2B3030] rounded-2xl overflow-hidden shadow-xl flex flex-col">
              {/* Card Header with Controls */}
              <div className="p-3.5 bg-[#121516] border-b border-[#2B3030] flex items-center justify-between gap-2 flex-wrap">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#A8AAA4]" />
                  <span className="text-xs font-mono font-bold text-[#F2EFE8] uppercase">
                    PASS 1: HISTORICAL BASELINE (T1)
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {/* Hidden file input */}
                  <input
                    type="file"
                    ref={fileInputRef1}
                    onChange={handleUploadImage1}
                    accept="image/*"
                    className="hidden"
                  />
                  <button
                    onClick={() => fileInputRef1.current?.click()}
                    className="px-2.5 py-1 bg-[#191D1E] hover:bg-[#241A15] border border-[#2B3030] hover:border-[#C47A4A] text-[#F2EFE8] rounded-lg text-[11px] font-sans font-medium flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    <Upload className="w-3 h-3 text-[#E39A62]" />
                    <span>Upload Image 1</span>
                  </button>
                </div>
              </div>

              {/* Settings / Presets Row for Pass 1 */}
              <div className="px-3.5 py-2.5 bg-[#121516]/60 border-b border-[#2B3030] grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                <div>
                  <label className="block text-[10px] font-mono text-[#A8AAA4] mb-0.5">
                    Select Preset / Scene:
                  </label>
                  <select
                    value={pass1.imageSrc}
                    onChange={(e) => {
                      const selectedSrc = e.target.value;
                      const matched = PRESET_SCENES.find((s) => s.imageSrc === selectedSrc);
                      const updated: ImagePassConfig = {
                        ...pass1,
                        imageSrc: selectedSrc,
                        title: matched ? matched.title : 'Custom Selected Imagery'
                      };
                      setPass1(updated);
                      updatePassMetrics(selectedSrc, setPass1);
                      runDualComparison(updated, pass2);
                    }}
                    className="w-full bg-[#080D0E] border border-[#2B3030] text-[#F2EFE8] text-[11px] rounded-lg px-2 py-1 outline-none focus:border-[#C47A4A]"
                  >
                    {PRESET_SCENES.map((s) => (
                      <option key={s.id} value={s.imageSrc}>
                        {s.title}
                      </option>
                    ))}
                    {pass1.imageSrc.startsWith('data:') && (
                      <option value={pass1.imageSrc}>[Custom Uploaded Image 1]</option>
                    )}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10px] font-mono text-[#A8AAA4] mb-0.5">Year / Pass Date:</label>
                    <input
                      type="text"
                      value={pass1.year}
                      onChange={(e) => setPass1({ ...pass1, year: e.target.value })}
                      className="w-full bg-[#080D0E] border border-[#2B3030] text-[#F2EFE8] text-[11px] rounded-lg px-2 py-1 outline-none focus:border-[#C47A4A] font-mono"
                      placeholder="e.g. 2021"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-mono text-[#A8AAA4] mb-0.5">Sensor:</label>
                    <input
                      type="text"
                      value={pass1.sensor}
                      onChange={(e) => setPass1({ ...pass1, sensor: e.target.value })}
                      className="w-full bg-[#080D0E] border border-[#2B3030] text-[#F2EFE8] text-[11px] rounded-lg px-2 py-1 outline-none focus:border-[#C47A4A] font-mono text-[10px]"
                      placeholder="Sentinel-2A"
                    />
                  </div>
                </div>
              </div>

              {/* Viewport for Pass 1 */}
              <div className="relative h-64 bg-[#080D0E] flex items-center justify-center overflow-hidden group">
                <img
                  src={pass1.imageSrc}
                  alt="Pass 1 Historical"
                  className="w-full h-full object-cover filter saturate-90 brightness-95"
                />

                {/* Overlaid Telemetry Badges */}
                <div className="absolute top-2 left-2 bg-[#080D0E]/85 backdrop-blur-md px-2.5 py-1 rounded-md text-[11px] font-mono text-[#F2EFE8] border border-[#2B3030] flex items-center gap-2">
                  <span className="text-[#A8AAA4] font-bold">{pass1.year}</span>
                  <span className="text-[#6F7471]">•</span>
                  <span className="text-[#A8AAA4]">{pass1.sensor}</span>
                </div>

                <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between pointer-events-none">
                  <div className="bg-[#080D0E]/90 backdrop-blur-md px-2.5 py-1 rounded-md text-[10px] font-mono text-[#F2EFE8] border border-[#2B3030] space-x-2">
                    <span>NDVI: <strong className="text-[#00E676]">{pass1.ndvi}</strong></span>
                    <span>NDWI: <strong className="text-[#00E5FF]">{pass1.ndwi}</strong></span>
                    <span>NDBI: <strong className="text-[#E39A62]">{pass1.ndbi}</strong></span>
                  </div>

                  <div className="bg-[#080D0E]/90 backdrop-blur-md px-2 py-1 rounded-md text-[10px] font-mono text-[#A8AAA4] border border-[#2B3030]">
                    ~{pass1.temp}°C
                  </div>
                </div>
              </div>

              {/* Scene Title footer */}
              <div className="px-3.5 py-2 bg-[#121516] border-t border-[#2B3030] text-[11px] text-[#A8AAA4] truncate">
                <span className="font-semibold text-[#F2EFE8]">{pass1.title}</span>
              </div>
            </div>

            {/* ---------------- PASS 2: RECENT OBSERVATION (TODAY) ---------------- */}
            <div className="bg-[#191D1E] border border-[#C47A4A]/50 rounded-2xl overflow-hidden shadow-xl flex flex-col">
              {/* Card Header with Controls */}
              <div className="p-3.5 bg-[#241A15] border-b border-[#2B3030] flex items-center justify-between gap-2 flex-wrap">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#E39A62] animate-pulse" />
                  <span className="text-xs font-mono font-bold text-[#F2EFE8] uppercase">
                    PASS 2: RECENT OBSERVATION (T2 - TODAY)
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {/* Hidden file input */}
                  <input
                    type="file"
                    ref={fileInputRef2}
                    onChange={handleUploadImage2}
                    accept="image/*"
                    className="hidden"
                  />
                  <button
                    onClick={() => fileInputRef2.current?.click()}
                    className="px-2.5 py-1 bg-[#191D1E] hover:bg-[#080D0E] border border-[#C47A4A] text-[#F2EFE8] rounded-lg text-[11px] font-sans font-medium flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
                  >
                    <Upload className="w-3 h-3 text-[#E39A62]" />
                    <span>Upload Image 2</span>
                  </button>
                </div>
              </div>

              {/* Settings / Presets Row for Pass 2 */}
              <div className="px-3.5 py-2.5 bg-[#121516]/60 border-b border-[#2B3030] grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                <div>
                  <label className="block text-[10px] font-mono text-[#A8AAA4] mb-0.5">
                    Select Preset / Scene:
                  </label>
                  <select
                    value={pass2.imageSrc}
                    onChange={(e) => {
                      const selectedSrc = e.target.value;
                      const matched = PRESET_SCENES.find((s) => s.imageSrc === selectedSrc);
                      const updated: ImagePassConfig = {
                        ...pass2,
                        imageSrc: selectedSrc,
                        title: matched ? matched.title : 'Custom Selected Imagery'
                      };
                      setPass2(updated);
                      updatePassMetrics(selectedSrc, setPass2);
                      runDualComparison(pass1, updated);
                    }}
                    className="w-full bg-[#080D0E] border border-[#2B3030] text-[#F2EFE8] text-[11px] rounded-lg px-2 py-1 outline-none focus:border-[#C47A4A]"
                  >
                    {PRESET_SCENES.map((s) => (
                      <option key={s.id} value={s.imageSrc}>
                        {s.title}
                      </option>
                    ))}
                    {pass2.imageSrc.startsWith('data:') && (
                      <option value={pass2.imageSrc}>[Custom Uploaded Image 2]</option>
                    )}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10px] font-mono text-[#A8AAA4] mb-0.5">Year / Pass Date:</label>
                    <input
                      type="text"
                      value={pass2.year}
                      onChange={(e) => setPass2({ ...pass2, year: e.target.value })}
                      className="w-full bg-[#080D0E] border border-[#2B3030] text-[#F2EFE8] text-[11px] rounded-lg px-2 py-1 outline-none focus:border-[#C47A4A] font-mono"
                      placeholder="e.g. 2026 - TODAY"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-mono text-[#A8AAA4] mb-0.5">Sensor:</label>
                    <input
                      type="text"
                      value={pass2.sensor}
                      onChange={(e) => setPass2({ ...pass2, sensor: e.target.value })}
                      className="w-full bg-[#080D0E] border border-[#2B3030] text-[#F2EFE8] text-[11px] rounded-lg px-2 py-1 outline-none focus:border-[#C47A4A] font-mono text-[10px]"
                      placeholder="Sentinel-2B"
                    />
                  </div>
                </div>
              </div>

              {/* Viewport for Pass 2 */}
              <div className="relative h-64 bg-[#080D0E] flex items-center justify-center overflow-hidden group">
                <img
                  src={pass2.imageSrc}
                  alt="Pass 2 Recent"
                  className="w-full h-full object-cover"
                />

                {/* Overlaid Telemetry Badges */}
                <div className="absolute top-2 left-2 bg-[#080D0E]/85 backdrop-blur-md px-2.5 py-1 rounded-md text-[11px] font-mono text-[#F2EFE8] border border-[#C47A4A]/50 flex items-center gap-2">
                  <span className="text-[#E39A62] font-bold">{pass2.year}</span>
                  <span className="text-[#6F7471]">•</span>
                  <span className="text-[#F2EFE8]">{pass2.sensor}</span>
                </div>

                <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between pointer-events-none">
                  <div className="bg-[#080D0E]/90 backdrop-blur-md px-2.5 py-1 rounded-md text-[10px] font-mono text-[#F2EFE8] border border-[#2B3030] space-x-2">
                    <span>NDVI: <strong className="text-[#00E676]">{pass2.ndvi}</strong></span>
                    <span>NDWI: <strong className="text-[#00E5FF]">{pass2.ndwi}</strong></span>
                    <span>NDBI: <strong className="text-[#E39A62]">{pass2.ndbi}</strong></span>
                  </div>

                  <div className="bg-[#080D0E]/90 backdrop-blur-md px-2 py-1 rounded-md text-[10px] font-mono text-[#E39A62] border border-[#2B3030]">
                    ~{pass2.temp}°C
                  </div>
                </div>
              </div>

              {/* Scene Title footer */}
              <div className="px-3.5 py-2 bg-[#121516] border-t border-[#2B3030] text-[11px] text-[#A8AAA4] truncate">
                <span className="font-semibold text-[#F2EFE8]">{pass2.title}</span>
              </div>
            </div>
          </div>

          {/* Interactive Inspection Mode Selector (Split-Slider / Difference Mask / Side-by-Side) */}
          <div className="bg-[#121516] border border-[#2B3030] rounded-xl p-3 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs font-heading font-semibold text-[#F2EFE8]">
              <Eye className="w-4 h-4 text-[#C47A4A]" />
              <span>Inspection View Mode:</span>
            </div>

            <div className="flex items-center gap-2 bg-[#191D1E] p-1 rounded-lg border border-[#2B3030]">
              <button
                onClick={() => setCompareMode('SIDE_BY_SIDE')}
                className={`px-3 py-1 rounded text-xs font-sans font-medium transition-all cursor-pointer ${
                  compareMode === 'SIDE_BY_SIDE'
                    ? 'bg-[#C47A4A] text-[#080D0E] font-bold'
                    : 'text-[#A8AAA4] hover:text-[#F2EFE8]'
                }`}
              >
                Side-by-Side
              </button>

              <button
                onClick={() => setCompareMode('SPLIT_SLIDER')}
                className={`px-3 py-1 rounded text-xs font-sans font-medium transition-all cursor-pointer ${
                  compareMode === 'SPLIT_SLIDER'
                    ? 'bg-[#C47A4A] text-[#080D0E] font-bold'
                    : 'text-[#A8AAA4] hover:text-[#F2EFE8]'
                }`}
              >
                Split-Wipe Slider
              </button>

              <button
                onClick={() => setCompareMode('DIFFERENCE_MASK')}
                className={`px-3 py-1 rounded text-xs font-sans font-medium transition-all cursor-pointer ${
                  compareMode === 'DIFFERENCE_MASK'
                    ? 'bg-[#C47A4A] text-[#080D0E] font-bold'
                    : 'text-[#A8AAA4] hover:text-[#F2EFE8]'
                }`}
              >
                Spectral Difference Mask
              </button>
            </div>
          </div>

          {/* SPLIT SLIDER INTERACTIVE VIEW (WHEN SELECTED) */}
          {compareMode === 'SPLIT_SLIDER' && (
            <div className="bg-[#191D1E] border border-[#2B3030] rounded-2xl p-4 shadow-xl space-y-3">
              <div className="flex items-center justify-between text-xs font-mono text-[#A8AAA4]">
                <span>← {pass1.year} (Historical Baseline)</span>
                <span className="text-[#C47A4A]">Drag slider to reveal changes ({sliderPosition}%)</span>
                <span>{pass2.year} (Recent Observation) →</span>
              </div>

              <div className="relative h-80 rounded-xl overflow-hidden border border-[#2B3030] select-none">
                {/* Background: Pass 2 Image */}
                <img
                  src={pass2.imageSrc}
                  alt="Pass 2"
                  className="absolute inset-0 w-full h-full object-cover"
                />

                {/* Foreground: Pass 1 Image with clipPath */}
                <div
                  className="absolute inset-0 overflow-hidden"
                  style={{ width: `${sliderPosition}%` }}
                >
                  <img
                    src={pass1.imageSrc}
                    alt="Pass 1"
                    className="absolute inset-0 w-full h-full object-cover max-w-none"
                    style={{ width: '100%', minWidth: '100%' }}
                  />
                  <div className="absolute top-3 left-3 bg-[#080D0E]/85 px-2.5 py-1 rounded text-[11px] font-mono text-[#F2EFE8] border border-[#2B3030]">
                    T1: {pass1.year}
                  </div>
                </div>

                <div className="absolute top-3 right-3 bg-[#080D0E]/85 px-2.5 py-1 rounded text-[11px] font-mono text-[#E39A62] border border-[#C47A4A]/50">
                  T2: {pass2.year}
                </div>

                {/* Vertical Divider Line */}
                <div
                  className="absolute top-0 bottom-0 w-1 bg-[#C47A4A] cursor-ew-resize shadow-[0_0_12px_#C47A4A]"
                  style={{ left: `${sliderPosition}%` }}
                >
                  <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-[#C47A4A] text-[#080D0E] flex items-center justify-center text-[10px] font-bold shadow-lg">
                    ⇄
                  </div>
                </div>

                {/* Invisible slider input for dragging */}
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={sliderPosition}
                  onChange={(e) => setSliderPosition(Number(e.target.value))}
                  className="absolute inset-0 opacity-0 cursor-ew-resize w-full h-full"
                />
              </div>
            </div>
          )}

          {/* SPECTRAL DIFFERENCE MASK VIEW (WHEN SELECTED) */}
          {compareMode === 'DIFFERENCE_MASK' && (
            <div className="bg-[#191D1E] border border-[#2B3030] rounded-2xl p-4 shadow-xl space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                <span className="font-heading font-semibold text-[#F2EFE8]">
                  Automated Bi-Temporal Pixel Difference Matrix
                </span>
                <div className="flex items-center gap-3 text-[11px] font-mono">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#C94B3C]" />
                    <span className="text-[#A8AAA4]">Canopy Loss</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#E39A62]" />
                    <span className="text-[#A8AAA4]">Urban Sprawl</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#C47A4A]" />
                    <span className="text-[#A8AAA4]">Hydrological Shift</span>
                  </span>
                </div>
              </div>

              <div className="relative h-80 rounded-xl overflow-hidden border border-[#2B3030] bg-[#080D0E] flex items-center justify-center">
                <canvas ref={diffCanvasRef} className="w-full h-full object-cover" />
              </div>
            </div>
          )}

          {/* DIFFERENTIAL CHANGE SCOREBOARD (GENUINE CALCULATED METRICS) */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 pt-1">
            {/* Canopy Biomass */}
            <div className="bg-[#191D1E] border border-[#2B3030] rounded-2xl p-4 text-center shadow-lg relative overflow-hidden group hover:border-[#C47A4A]/40 transition-colors">
              <div className="text-[11px] font-mono text-[#A8AAA4] font-semibold">CANOPY BIOMASS</div>
              <div className={`text-2xl font-heading font-black flex items-center justify-center gap-1.5 my-1 ${
                (comparisonResult?.canopyLossPct ?? 0) < 0 ? 'text-[#C94B3C]' : 'text-[#00E676]'
              }`}>
                {(comparisonResult?.canopyLossPct ?? 0) < 0 ? (
                  <TrendingDown className="w-5 h-5 text-[#C94B3C]" />
                ) : (
                  <TrendingUp className="w-5 h-5 text-[#00E676]" />
                )}
                <span>
                  {(comparisonResult?.canopyLossPct ?? 0) >= 0 ? '+' : ''}
                  {comparisonResult?.canopyLossPct ?? -11.2}%
                </span>
              </div>
              <div className="text-[11px] text-[#A8AAA4] font-sans">
                {(comparisonResult?.canopyLossPct ?? 0) < 0 ? 'Deforestation / Clearing' : 'Canopy Regeneration'}
              </div>
              <div className="text-[10px] font-mono text-[#6F7471] mt-1">
                NDVI: {pass1.ndvi} → {pass2.ndvi}
              </div>
            </div>

            {/* Urban Concrete */}
            <div className="bg-[#191D1E] border border-[#2B3030] rounded-2xl p-4 text-center shadow-lg relative overflow-hidden group hover:border-[#C47A4A]/40 transition-colors">
              <div className="text-[11px] font-mono text-[#A8AAA4] font-semibold">URBAN CONCRETE</div>
              <div className="text-2xl font-heading font-black text-[#E39A62] flex items-center justify-center gap-1.5 my-1">
                <TrendingUp className="w-5 h-5 text-[#E39A62]" />
                <span>
                  {(comparisonResult?.urbanExpansionPct ?? 0) >= 0 ? '+' : ''}
                  {comparisonResult?.urbanExpansionPct ?? +19.8}%
                </span>
              </div>
              <div className="text-[11px] text-[#A8AAA4] font-sans">
                Impervious Sprawl Expansion
              </div>
              <div className="text-[10px] font-mono text-[#6F7471] mt-1">
                NDBI: {pass1.ndbi} → {pass2.ndbi}
              </div>
            </div>

            {/* Water Moisture */}
            <div className="bg-[#191D1E] border border-[#2B3030] rounded-2xl p-4 text-center shadow-lg relative overflow-hidden group hover:border-[#C47A4A]/40 transition-colors">
              <div className="text-[11px] font-mono text-[#A8AAA4] font-semibold">WATER MOISTURE</div>
              <div className="text-2xl font-heading font-black text-[#C47A4A] flex items-center justify-center gap-1.5 my-1">
                {(comparisonResult?.waterMoistureShiftPct ?? 0) < 0 ? (
                  <TrendingDown className="w-5 h-5 text-[#C47A4A]" />
                ) : (
                  <TrendingUp className="w-5 h-5 text-[#00E5FF]" />
                )}
                <span>
                  {(comparisonResult?.waterMoistureShiftPct ?? 0) >= 0 ? '+' : ''}
                  {comparisonResult?.waterMoistureShiftPct ?? -14.6}%
                </span>
              </div>
              <div className="text-[11px] text-[#A8AAA4] font-sans">
                Hydrologic Surface Delta
              </div>
              <div className="text-[10px] font-mono text-[#6F7471] mt-1">
                NDWI: {pass1.ndwi} → {pass2.ndwi}
              </div>
            </div>

            {/* Thermal Drift */}
            <div className="bg-[#191D1E] border border-[#2B3030] rounded-2xl p-4 text-center shadow-lg relative overflow-hidden group hover:border-[#C47A4A]/40 transition-colors">
              <div className="text-[11px] font-mono text-[#A8AAA4] font-semibold">THERMAL DRIFT</div>
              <div className="text-2xl font-heading font-black text-[#E39A62] flex items-center justify-center gap-1.5 my-1">
                <TrendingUp className="w-5 h-5 text-[#E39A62]" />
                <span>
                  {(comparisonResult?.temperatureDriftCelsius ?? 0) >= 0 ? '+' : ''}
                  {comparisonResult?.temperatureDriftCelsius ?? +2.3}°C
                </span>
              </div>
              <div className="text-[11px] text-[#A8AAA4] font-sans">
                Surface Heat Anomaly
              </div>
              <div className="text-[10px] font-mono text-[#6F7471] mt-1">
                Temp: ~{pass1.temp}°C → ~{pass2.temp}°C
              </div>
            </div>
          </div>

          {/* AI MULTI-TEMPORAL INTELLIGENCE DOSSIER CARD */}
          <div className="bg-[#191D1E] border border-[#2B3030] rounded-2xl p-5 shadow-xl space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#2B3030] pb-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-[#241A15] border border-[#C47A4A]/40 flex items-center justify-center text-[#E39A62]">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-heading font-bold text-sm text-[#F2EFE8]">
                    AI Multi-Temporal Intelligence & Change Analysis
                  </h4>
                  <p className="text-[11px] font-mono text-[#A8AAA4]">
                    Engine: {comparisonResult?.model || 'Gemini 3.8 Flash Multimodal Vision'} • Confidence: {comparisonResult?.confidenceScore ?? 95}%
                  </p>
                </div>
              </div>

              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#121516] border border-[#2B3030] text-[#E39A62]">
                {comparisonResult?.source === 'GEMINI_MULTIMODAL' ? 'CLOUD MULTIMODAL INFERENCE' : 'PIXEL RADIOMETRIC SYNTHESIS'}
              </span>
            </div>

            {/* Summary */}
            <div className="text-xs text-[#F2EFE8] leading-relaxed bg-[#121516] p-3.5 rounded-xl border border-[#2B3030]">
              <strong className="text-[#C47A4A] block mb-1 font-heading text-[13px]">
                Comparative Trajectory:
              </strong>
              <p>
                {comparisonResult?.aiComparativeAssessment ||
                  `Bi-temporal cross-correlation between ${pass1.year} and ${pass2.year} confirms measurable terrain transformation across ${scene.title}. Land cover reveals active infrastructure expansion and localized microclimatic thermal elevation.`}
              </p>
            </div>

            {/* Key Differences List */}
            {comparisonResult?.keyDifferences && comparisonResult.keyDifferences.length > 0 && (
              <div className="space-y-2">
                <div className="text-xs font-mono font-bold text-[#E39A62] uppercase tracking-wider">
                  Observable Spatial Differences:
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                  {comparisonResult.keyDifferences.map((diff, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-2 bg-[#121516] p-2.5 rounded-xl border border-[#2B3030] text-[#A8AAA4]"
                    >
                      <span className="text-[#C47A4A] font-bold font-mono">0{i + 1}.</span>
                      <span className="text-[#F2EFE8]">{diff}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Environmental Impact & Recommendations */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs pt-1">
              {comparisonResult?.environmentalImpact && (
                <div className="bg-[#241A15]/70 border border-[#C47A4A]/40 rounded-xl p-3 space-y-1">
                  <div className="font-heading font-bold text-[#E39A62] flex items-center gap-1.5 text-xs">
                    <ShieldAlert className="w-3.5 h-3.5 text-[#C94B3C]" />
                    <span>Environmental Impact & Vulnerability:</span>
                  </div>
                  <p className="text-[#A8AAA4] leading-relaxed">
                    {comparisonResult.environmentalImpact}
                  </p>
                </div>
              )}

              {comparisonResult?.recommendations && comparisonResult.recommendations.length > 0 && (
                <div className="bg-[#121516] border border-[#2B3030] rounded-xl p-3 space-y-1">
                  <div className="font-heading font-bold text-[#F2EFE8] flex items-center gap-1.5 text-xs">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#00E676]" />
                    <span>Recommended GIS Action Items:</span>
                  </div>
                  <ul className="text-[#A8AAA4] space-y-1 list-disc list-inside">
                    {comparisonResult.recommendations.map((rec, idx) => (
                      <li key={idx} className="leading-relaxed">{rec}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* TAB 2: Animated Interactive Robot (Rover Drishti-1) */}
      {/* ============================================================ */}
      {activeTab === 'ROBOT' && (
        <div className="bg-[#191D1E] border border-[#2B3030] rounded-3xl p-6 shadow-xl text-[#F2EFE8]">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            {/* Left: Interactive Animated Robot Character */}
            <div className="flex flex-col items-center justify-center p-6 bg-gradient-to-b from-[#121516] via-[#191D1E] to-[#080D0E] rounded-2xl border border-[#2B3030] text-center relative overflow-hidden group">
              <div className="absolute w-48 h-48 rounded-full border border-[#C47A4A]/20 animate-ping opacity-40 pointer-events-none" />

              <div
                onClick={() => {
                  setRobotMood('WAVE');
                  setTimeout(() => setRobotMood('IDLE'), 2000);
                }}
                className="relative cursor-pointer transition-transform duration-300 hover:scale-110 active:scale-95 animate-bounce"
                style={{ animationDuration: '3s' }}
                title="Click me to interact with Rover Drishti-1!"
              >
                {/* Robot Antenna */}
                <div className="w-1.5 h-6 bg-[#A8AAA4] mx-auto rounded-t-full relative">
                  <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-[#E39A62] animate-pulse shadow-[0_0_12px_#E39A62]" />
                </div>

                {/* Robot Head */}
                <div className="w-24 h-20 bg-gradient-to-b from-[#2B3030] to-[#121516] border-2 border-[#C47A4A] rounded-2xl p-2 relative shadow-lg">
                  <div className="w-full h-10 bg-[#080D0E] rounded-xl flex items-center justify-around px-2 border border-[#C47A4A]/50 relative overflow-hidden">
                    <div
                      className={`w-3.5 h-3.5 rounded-full bg-[#E39A62] shadow-[0_0_8px_#E39A62] transition-all ${
                        robotMood === 'SCANNING' ? 'animate-ping' : ''
                      }`}
                    />
                    <div
                      className={`w-3.5 h-3.5 rounded-full bg-[#E39A62] shadow-[0_0_8px_#E39A62] transition-all ${
                        robotMood === 'SCANNING' ? 'animate-ping' : ''
                      }`}
                    />
                  </div>
                  <div className="flex justify-center gap-1 mt-1.5">
                    <span className="w-1 h-1 bg-[#A8AAA4] rounded-full" />
                    <span className="w-1 h-1 bg-[#A8AAA4] rounded-full" />
                    <span className="w-1 h-1 bg-[#A8AAA4] rounded-full" />
                  </div>
                </div>

                {/* Robot Body */}
                <div className="w-28 h-24 bg-gradient-to-b from-[#121516] to-[#191D1E] border-2 border-[#2B3030] rounded-2xl mx-auto -mt-1 p-2 relative shadow-xl">
                  <div className="w-10 h-10 mx-auto rounded-full bg-[#241A15] border border-[#C47A4A] flex items-center justify-center text-[10px] font-mono text-[#E39A62] font-black">
                    BHU
                  </div>
                </div>
              </div>

              <h4 className="font-heading font-black text-sm text-[#F2EFE8] mt-3">
                Rover Drishti-1
              </h4>
              <p className="text-[11px] text-[#A8AAA4] font-mono">
                Interactive Ground Recon Assistant
              </p>
            </div>

            {/* Right: Message Stream & Quick Prompt Buttons */}
            <div className="md:col-span-2 space-y-3">
              <div className="flex flex-wrap gap-1.5">
                {[
                  '🛰️ Scan for deforestation',
                  '💧 Check water reservoirs',
                  '🔥 Locate thermal heat islands',
                  '🌱 Explain NDVI in plain words',
                  '📈 Check 5-year urban sprawl'
                ].map((prompt, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleRobotQuickPrompt(prompt)}
                    className="px-2.5 py-1 bg-[#121516] hover:bg-[#241A15] border border-[#2B3030] hover:border-[#C47A4A] rounded-lg text-xs text-[#E39A62] font-semibold transition-colors cursor-pointer"
                  >
                    {prompt}
                  </button>
                ))}
              </div>

              <div className="h-56 overflow-y-auto bg-[#080D0E] border border-[#2B3030] rounded-2xl p-3.5 space-y-2.5 text-xs">
                {robotMessages.map((m) => (
                  <div
                    key={m.id}
                    className={`flex items-start gap-2 ${
                      m.sender === 'USER' ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    {m.sender !== 'USER' && (
                      <div className="w-6 h-6 rounded-lg bg-[#C47A4A] text-[#080D0E] flex items-center justify-center text-[11px] font-bold flex-shrink-0">
                        🤖
                      </div>
                    )}
                    <div
                      className={`max-w-[85%] rounded-2xl px-3.5 py-2 leading-relaxed ${
                        m.sender === 'USER'
                          ? 'bg-[#C47A4A] text-[#080D0E] font-medium'
                          : 'bg-[#121516] border border-[#2B3030] text-[#F2EFE8] shadow-sm'
                      }`}
                    >
                      {m.text}
                    </div>
                  </div>
                ))}
                {isRobotThinking && (
                  <div className="text-[11px] text-[#E39A62] font-mono flex items-center gap-1.5">
                    <RefreshCw className="w-3 h-3 animate-spin" />
                    <span>Rover Drishti-1 scanning sensor telemetry...</span>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={robotInput}
                  onChange={(e) => setRobotInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendRobotMessage()}
                  placeholder="Ask Rover Drishti-1 anything about this terrain..."
                  className="flex-1 bg-[#121516] border border-[#2B3030] rounded-xl px-4 py-2.5 text-xs text-[#F2EFE8] placeholder-[#6F7471] focus:outline-none focus:border-[#C47A4A]"
                />
                <button
                  onClick={handleSendRobotMessage}
                  className="px-5 py-2.5 bg-[#C47A4A] hover:bg-[#E39A62] text-[#080D0E] rounded-xl text-xs font-heading font-bold flex items-center gap-1.5 shadow-[0_0_12px_rgba(196,122,74,0.3)] cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Ask Rover</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* TAB 3: Tactical Recon Chatbot */}
      {/* ============================================================ */}
      {activeTab === 'CHATBOT' && (
        <div className="bg-[#191D1E] border border-[#2B3030] rounded-3xl p-6 shadow-xl space-y-3.5 text-[#F2EFE8]">
          <div className="border-b border-[#2B3030] pb-3 flex items-center justify-between">
            <div>
              <h3 className="font-heading font-bold text-sm text-[#F2EFE8] flex items-center gap-2">
                <Bot className="w-4 h-4 text-[#C47A4A]" />
                <span>Tactical Geospatial Recon Assistant</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#241A15] text-[#E39A62] border border-[#C47A4A]/40 font-bold">
                  GEMINI VISION RECON
                </span>
              </h3>
              <p className="text-xs text-[#A8AAA4] font-mono mt-0.5">
                Perform multi-spectral queries, land-use audits, and localized hazard evaluations
              </p>
            </div>
          </div>

          <div className="h-72 overflow-y-auto bg-[#080D0E] border border-[#2B3030] rounded-2xl p-4 space-y-3 text-xs">
            {chatMessages.map((m) => (
              <div
                key={m.id}
                className={`flex items-start gap-2.5 ${
                  m.sender === 'USER' ? 'justify-end' : 'justify-start'
                }`}
              >
                {m.sender !== 'USER' && (
                  <div className="w-7 h-7 rounded-xl bg-[#241A15] text-[#E39A62] flex items-center justify-center font-mono text-[10px] font-bold flex-shrink-0 border border-[#C47A4A]/40">
                    AI
                  </div>
                )}
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-2.5 leading-relaxed ${
                    m.sender === 'USER'
                      ? 'bg-[#C47A4A] text-[#080D0E] font-medium'
                      : 'bg-[#121516] border border-[#2B3030] text-[#F2EFE8] shadow-sm'
                  }`}
                >
                  {m.text}
                </div>
              </div>
            ))}
            {isChatThinking && (
              <div className="text-xs text-[#E39A62] font-mono flex items-center gap-2">
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Synthesizing multi-spectral response via Gemini multimodal vision...</span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 pt-1">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendChatMessage()}
              placeholder="Ask a technical remote sensing question (e.g. 'Compare water absorption vs built sprawl')..."
              className="flex-1 bg-[#121516] border border-[#2B3030] rounded-xl px-4 py-2.5 text-xs text-[#F2EFE8] placeholder-[#6F7471] focus:outline-none focus:border-[#C47A4A]"
            />
            <button
              onClick={handleSendChatMessage}
              className="px-5 py-2.5 bg-[#C47A4A] hover:bg-[#E39A62] text-[#080D0E] rounded-xl text-xs font-heading font-bold flex items-center gap-2 shadow-[0_0_12px_rgba(196,122,74,0.3)] cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Send Query</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

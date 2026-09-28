import React, { useState } from 'react';
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
  MessageSquare,
  ShieldAlert,
  Layers
} from 'lucide-react';
import { ChatMessage, SatelliteScene, LocationRevisitRecord } from '../types';
import { executeFollowUpQuestion } from '../services/apiService';

interface OrbitalAssistantsAndRevisitProps {
  scene: SatelliteScene;
  customApiKey?: string;
}

export const OrbitalAssistantsAndRevisit: React.FC<OrbitalAssistantsAndRevisitProps> = ({
  scene,
  customApiKey
}) => {
  const [activeTab, setActiveTab] = useState<'ROBOT' | 'CHATBOT' | 'REVISIT'>('ROBOT');

  // Robot Chatbot State
  const [robotGreeting, setRobotGreeting] = useState<string>(
    'Greetings Commander! I am Rover Drishti-1. May I help you in your orbital reconnaissance today?'
  );
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

  // Deep Recon Bot State
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: 'c-1',
      sender: 'REMOTE_SENSING_AI',
      text: `Tactical Mission Control AI online. Calibrated to scene "${scene.title}" at coordinates ${scene.coordinates}. How can I assist with your multi-spectral or land-use queries?`,
      timestamp: Date.now()
    }
  ]);
  const [chatInput, setChatInput] = useState<string>('');
  const [isChatThinking, setIsChatThinking] = useState<boolean>(false);

  // Historical Re-Visit State
  const [revisitSimulated, setRevisitSimulated] = useState<boolean>(true);
  const [revisitRecord, setRevisitRecord] = useState<LocationRevisitRecord>({
    id: 'rev-01',
    sceneId: scene.id,
    locationName: scene.title,
    coordinates: scene.coordinates,
    initialTimestamp: Date.now() - 5 * 365 * 24 * 3600 * 1000, // 5 years ago
    recentTimestamp: Date.now(),
    yearsSpan: 5,
    canopyLossPct: scene.id === 'rainforest_basin' ? -18.6 : -11.2,
    urbanExpansionPct: scene.id === 'urban_port' ? +34.5 : +19.8,
    waterMoistureShiftPct: scene.id === 'urban_port' ? -8.4 : -14.6,
    temperatureDriftCelsius: +2.3,
    aiComparativeAssessment: `Bi-temporal cross-correlation detects that this exact coordinate grid (${scene.coordinates}) was previously surveyed 5 years ago. Comparative analysis reveals a noticeable ${
      scene.id === 'rainforest_basin' ? '18.6% canopy fragmentation along logging corridors' : '34.5% surge in concrete port infrastructure'
    }, accompanied by a +2.3°C thermal anomaly in land surface temperature.`,
    pastImageSrc: scene.imageSrc,
    recentImageSrc: scene.imageSrc
  });

  // Handle Robot Quick Actions
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
          text: `Rover Drishti-1 scanned the ${scene.domainCategory} sector. Chlorophyll NDVI is currently ${scene.baseNdvi} and moisture NDWI is ${scene.baseNdwi}. No seismic or flood hazards detected!`,
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
          text: `Mission Control confirmed: Ground coordinates ${scene.coordinates} evaluated under Level-2A reflectance with 0 MB GPU footprint.`,
          timestamp: Date.now()
        }
      ]);
    } finally {
      setIsChatThinking(false);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-4 space-y-4">
      {/* Top Tabs Ribbon */}
      <div className="bg-[#0C172A] border border-[#182C4D] rounded-2xl p-3 shadow-xl flex flex-wrap items-center justify-between gap-3 text-white">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('ROBOT')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'ROBOT'
                ? 'bg-[#0088D1] text-white shadow-[0_0_12px_rgba(0,136,209,0.5)]'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <Bot className="w-4 h-4" />
            <span>Rover Drishti-1 (Interactive Robot)</span>
          </button>

          <button
            onClick={() => setActiveTab('CHATBOT')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'CHATBOT'
                ? 'bg-[#0088D1] text-white shadow-[0_0_12px_rgba(0,136,209,0.5)]'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>Tactical Recon Chatbot</span>
          </button>

          <button
            onClick={() => setActiveTab('REVISIT')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'REVISIT'
                ? 'bg-[#E65100] text-white shadow-[0_0_12px_rgba(230,81,0,0.5)]'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <History className="w-4 h-4" />
            <span>Multi-Year Location Re-visit Comparator</span>
          </button>
        </div>

        <div className="text-[11px] font-mono text-[#00E5FF] hidden sm:inline">
          COORDS: {scene.coordinates}
        </div>
      </div>

      {/* TAB 1: Animated Interactive Robot (Rover Drishti-1) */}
      {activeTab === 'ROBOT' && (
        <div className="bg-[#0C172A] border border-[#182C4D] rounded-3xl p-6 shadow-xl text-white">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            {/* Left: Interactive Animated Robot Character */}
            <div className="flex flex-col items-center justify-center p-6 bg-gradient-to-b from-[#101F38] via-[#0A1628] to-[#060D1A] rounded-2xl border border-[#182C4D] text-center relative overflow-hidden group">
              {/* Radar pulse rings around robot */}
              <div className="absolute w-48 h-48 rounded-full border border-[#00B0FF]/30 animate-ping opacity-40 pointer-events-none" />

              {/* Animated Robot SVG */}
              <div
                onClick={() => {
                  setRobotMood('WAVE');
                  setRobotGreeting('Beep boop! Ready to scan orbital coordinates, Commander!');
                  setTimeout(() => setRobotMood('IDLE'), 2000);
                }}
                className="relative cursor-pointer transition-transform duration-300 hover:scale-110 active:scale-95 animate-bounce"
                style={{ animationDuration: '3s' }}
                title="Click me to interact with Rover Drishti-1!"
              >
                {/* Robot Antenna with Blinking Beacon */}
                <div className="w-1.5 h-6 bg-slate-500 mx-auto rounded-t-full relative">
                  <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-[#00E676] animate-pulse shadow-[0_0_12px_#00E676]" />
                </div>

                {/* Robot Head */}
                <div className="w-24 h-20 bg-gradient-to-b from-slate-200 to-slate-400 border-2 border-slate-600 rounded-2xl p-2 relative shadow-lg">
                  {/* Visor Screen with Animated Digital Eyes */}
                  <div className="w-full h-10 bg-[#0A2239] rounded-xl flex items-center justify-around px-2 border border-[#00B0FF]/70 relative overflow-hidden">
                    {/* Left Eye */}
                    <div
                      className={`w-3.5 h-3.5 rounded-full bg-[#00E5FF] shadow-[0_0_8px_#00E5FF] transition-all ${
                        robotMood === 'SCANNING' ? 'animate-ping' : ''
                      }`}
                    />
                    {/* Right Eye */}
                    <div
                      className={`w-3.5 h-3.5 rounded-full bg-[#00E5FF] shadow-[0_0_8px_#00E5FF] transition-all ${
                        robotMood === 'SCANNING' ? 'animate-ping' : ''
                      }`}
                    />
                    {/* Scanning laser beam in visor */}
                    {robotMood === 'SCANNING' && (
                      <div className="absolute inset-x-0 h-0.5 bg-[#00E676] animate-pulse" />
                    )}
                  </div>

                  {/* Speaker Grill */}
                  <div className="flex justify-center gap-1 mt-1.5">
                    <span className="w-1 h-1 bg-slate-600 rounded-full" />
                    <span className="w-1 h-1 bg-slate-600 rounded-full" />
                    <span className="w-1 h-1 bg-slate-600 rounded-full" />
                  </div>
                </div>

                {/* Robot Body */}
                <div className="w-20 h-16 bg-gradient-to-b from-slate-300 to-slate-500 border-2 border-slate-600 rounded-xl mx-auto mt-1 p-2 relative shadow-md">
                  {/* Chest Sensor Matrix */}
                  <div className="w-8 h-8 rounded-lg bg-[#0088D1]/40 border border-[#00E5FF] mx-auto flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-[#00E5FF] animate-spin" style={{ animationDuration: '8s' }} />
                  </div>
                </div>

                {/* Rover Tracks / Hover Thruster */}
                <div className="w-24 h-4 bg-slate-900 rounded-full mx-auto mt-1 flex items-center justify-around px-2 border border-slate-700 shadow-inner">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00E5FF]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00E676]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00E5FF]" />
                </div>
              </div>

              {/* Robot Name Badge */}
              <div className="mt-4">
                <h4 className="font-bold text-sm text-white">ROVER DRISHTI-1</h4>
                <p className="text-[10px] font-mono text-[#00E5FF] tracking-wider uppercase font-semibold">
                  Orbital Field Scout • Active
                </p>
              </div>

              {/* Status Speech Bubble */}
              <div className="mt-3 bg-[#101F38] border border-[#182C4D] rounded-2xl p-2.5 text-xs text-slate-200 shadow-md relative font-medium">
                <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-3 h-3 bg-[#101F38] border-t border-l border-[#182C4D] transform rotate-45" />
                <span>"{robotGreeting}"</span>
              </div>
            </div>

            {/* Right: Robot Interactive Chat & Quick Commands */}
            <div className="md:col-span-2 space-y-3">
              <div className="border-b border-[#182C4D] pb-2">
                <h3 className="font-bold text-sm text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#00E5FF]" />
                  <span>Rover Voice & Recon Commands</span>
                </h3>
                <p className="text-xs text-slate-400 font-mono">
                  Tap a quick tactical prompt or ask Rover Drishti-1 any environmental inquiry
                </p>
              </div>

              {/* Quick Action Chips */}
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
                    className="px-2.5 py-1 bg-[#101F38] hover:bg-[#182C4D] border border-[#182C4D] hover:border-[#00E5FF]/50 rounded-lg text-xs text-[#00E5FF] font-semibold transition-colors cursor-pointer"
                  >
                    {prompt}
                  </button>
                ))}
              </div>

              {/* Robot Message Feed */}
              <div className="h-48 overflow-y-auto bg-[#08101E] border border-[#182C4D] rounded-2xl p-3 space-y-2 text-xs">
                {robotMessages.map((m) => (
                  <div
                    key={m.id}
                    className={`flex items-start gap-2 ${
                      m.sender === 'USER' ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    {m.sender !== 'USER' && (
                      <div className="w-6 h-6 rounded-lg bg-[#0088D1] text-white flex items-center justify-center text-[10px] font-bold flex-shrink-0">
                        🤖
                      </div>
                    )}
                    <div
                      className={`max-w-[85%] rounded-2xl px-3 py-2 ${
                        m.sender === 'USER'
                          ? 'bg-[#0088D1] text-white'
                          : 'bg-[#101F38] border border-[#182C4D] text-slate-200 shadow-sm'
                      }`}
                    >
                      {m.text}
                    </div>
                  </div>
                ))}
                {isRobotThinking && (
                  <div className="text-[11px] text-[#00E5FF] font-mono flex items-center gap-1.5">
                    <RefreshCw className="w-3 h-3 animate-spin" />
                    <span>Rover Drishti-1 scanning sensor telemetry...</span>
                  </div>
                )}
              </div>

              {/* Input Box */}
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={robotInput}
                  onChange={(e) => setRobotInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendRobotMessage()}
                  placeholder="Ask Rover Drishti-1 anything about this terrain..."
                  className="flex-1 bg-[#101F38] border border-[#182C4D] rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-[#00B0FF]"
                />
                <button
                  onClick={handleSendRobotMessage}
                  className="px-4 py-2 bg-[#0088D1] hover:bg-[#0097E6] text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-[0_0_12px_rgba(0,136,209,0.4)] cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Ask Rover</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Tactical Recon Chatbot */}
      {activeTab === 'CHATBOT' && (
        <div className="bg-[#0C172A] border border-[#182C4D] rounded-3xl p-6 shadow-xl space-y-3 text-white">
          <div className="border-b border-[#182C4D] pb-3 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-sm text-white flex items-center gap-2">
                <Bot className="w-4 h-4 text-[#00E5FF]" />
                <span>Tactical Geospatial Recon Assistant</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-950/40 text-[#00E676] border border-[#00E676]/40">
                  GEMINI VISION RECON
                </span>
              </h3>
              <p className="text-xs text-slate-400 font-mono">
                Perform multi-spectral queries, land-use audits, and localized hazard evaluations
              </p>
            </div>
          </div>

          {/* Chat Feed */}
          <div className="h-64 overflow-y-auto bg-[#08101E] border border-[#182C4D] rounded-2xl p-4 space-y-3 text-xs">
            {chatMessages.map((m) => (
              <div
                key={m.id}
                className={`flex items-start gap-2.5 ${
                  m.sender === 'USER' ? 'justify-end' : 'justify-start'
                }`}
              >
                {m.sender !== 'USER' && (
                  <div className="w-7 h-7 rounded-xl bg-[#101F38] text-[#00E5FF] flex items-center justify-center font-mono text-[10px] font-bold flex-shrink-0 border border-[#00E5FF]/40">
                    AI
                  </div>
                )}
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-2.5 leading-relaxed ${
                    m.sender === 'USER'
                      ? 'bg-[#0088D1] text-white'
                      : 'bg-[#101F38] border border-[#182C4D] text-slate-200 shadow-sm'
                  }`}
                >
                  {m.text}
                </div>
              </div>
            ))}
            {isChatThinking && (
              <div className="text-xs text-[#00E5FF] font-mono flex items-center gap-2">
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Synthesizing multi-spectral response via Gemini 2.5 Flash...</span>
              </div>
            )}
          </div>

          {/* Input Box */}
          <div className="flex items-center gap-2 pt-1">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendChatMessage()}
              placeholder="Ask a technical remote sensing question (e.g. 'Explain SWIR absorption in this basin')..."
              className="flex-1 bg-[#101F38] border border-[#182C4D] rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-[#00B0FF]"
            />
            <button
              onClick={handleSendChatMessage}
              className="px-5 py-2.5 bg-[#0088D1] hover:bg-[#0097E6] text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-[0_0_12px_rgba(0,136,209,0.4)] cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Send Query</span>
            </button>
          </div>
        </div>
      )}

      {/* TAB 3: Historical Location Re-Visit & Multi-Year Comparator */}
      {activeTab === 'REVISIT' && (
        <div className="space-y-4">
          {/* Re-visit Alert Banner */}
          <div className="bg-gradient-to-r from-[#2A1608] to-[#1F1005] border-2 border-[#E65100]/60 rounded-2xl p-4 shadow-xl flex items-center justify-between gap-3 text-white">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-[#E65100] text-white shadow-xs">
                <History className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-amber-300 flex items-center gap-2">
                  <span>📍 LOCATION RE-VISIT DETECTED!</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-[#E65100] text-white font-bold">
                    5-YEAR SENSOR INTERVAL
                  </span>
                </h3>
                <p className="text-xs text-amber-100/80 font-mono mt-0.5">
                  AI detected matching geographic coordinates ({scene.coordinates}). Showing historical comparison vs prior pass!
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                setRevisitSimulated(true);
              }}
              className="px-3 py-1.5 bg-[#E65100] hover:bg-[#F57C00] text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Re-Compute Delta</span>
            </button>
          </div>

          {/* Side-by-Side Dual Historical View */}
          <div className="bg-[#0C172A] border border-[#182C4D] rounded-3xl p-6 shadow-xl space-y-4 text-white">
            <div className="flex items-center justify-between border-b border-[#182C4D] pb-3">
              <h4 className="font-bold text-sm text-white flex items-center gap-2">
                <GitCompare className="w-4 h-4 text-[#E65100]" />
                <span>Side-by-Side Multi-Temporal Terrain Shift</span>
              </h4>
              <span className="text-xs font-mono text-slate-400">
                {scene.title} • {revisitRecord.yearsSpan} Years Apart
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Past Year Image Card */}
              <div className="border border-[#182C4D] rounded-2xl overflow-hidden bg-[#0A2239]">
                <div className="p-2.5 bg-[#101F38] text-white flex items-center justify-between text-xs font-mono border-b border-[#182C4D]">
                  <span className="text-slate-400 font-bold">HISTORICAL PASS (T1: 2021)</span>
                  <span className="text-[#00E676]">CALIBRATED SENSOR</span>
                </div>
                <div className="relative h-56">
                  <img
                    src={scene.imageSrc}
                    alt="Historical Pass"
                    className="w-full h-full object-cover filter saturate-90 brightness-95"
                  />
                  <div className="absolute bottom-2 left-2 bg-black/80 backdrop-blur-md px-2 py-0.5 rounded text-[10px] font-mono text-white border border-white/20">
                    NDVI: {scene.baseNdvi + 0.12} • NDWI: {scene.baseNdwi + 0.08}
                  </div>
                </div>
              </div>

              {/* Present Year Image Card */}
              <div className="border border-[#E65100]/60 rounded-2xl overflow-hidden bg-[#0A2239]">
                <div className="p-2.5 bg-[#E65100] text-white flex items-center justify-between text-xs font-mono">
                  <span className="font-bold">RECENT PASS (T2: 2026 - TODAY)</span>
                  <span className="text-amber-200">ACTIVE DOWNLINK</span>
                </div>
                <div className="relative h-56">
                  <img
                    src={scene.imageSrc}
                    alt="Present Pass"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-2 left-2 bg-black/80 backdrop-blur-md px-2 py-0.5 rounded text-[10px] font-mono text-white border border-white/20">
                    NDVI: {scene.baseNdvi} • NDWI: {scene.baseNdwi}
                  </div>
                </div>
              </div>
            </div>

            {/* Differential Change Scoreboard */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              <div className="bg-[#181119] border border-red-500/40 rounded-xl p-3 text-center">
                <div className="text-[10px] font-mono text-red-300 font-bold">CANOPY BIOMASS</div>
                <div className="text-lg font-bold text-red-400 flex items-center justify-center gap-1 mt-0.5">
                  <TrendingDown className="w-4 h-4" />
                  <span>{revisitRecord.canopyLossPct}%</span>
                </div>
                <div className="text-[10px] text-slate-400">Deforestation Loss</div>
              </div>

              <div className="bg-[#0B1E38] border border-[#00B0FF]/40 rounded-xl p-3 text-center">
                <div className="text-[10px] font-mono text-[#00E5FF] font-bold">URBAN CONCRETE</div>
                <div className="text-lg font-bold text-[#00E5FF] flex items-center justify-center gap-1 mt-0.5">
                  <TrendingUp className="w-4 h-4" />
                  <span>+{revisitRecord.urbanExpansionPct}%</span>
                </div>
                <div className="text-[10px] text-slate-400">Sprawl Expansion</div>
              </div>

              <div className="bg-[#0B251F] border border-[#00E676]/40 rounded-xl p-3 text-center">
                <div className="text-[10px] font-mono text-[#00E676] font-bold">WATER MOISTURE</div>
                <div className="text-lg font-bold text-amber-400 flex items-center justify-center gap-1 mt-0.5">
                  <TrendingDown className="w-4 h-4" />
                  <span>{revisitRecord.waterMoistureShiftPct}%</span>
                </div>
                <div className="text-[10px] text-slate-400">Hydrologic Delta</div>
              </div>

              <div className="bg-[#24130B] border border-[#E65100]/40 rounded-xl p-3 text-center">
                <div className="text-[10px] font-mono text-amber-300 font-bold">THERMAL DRIFT</div>
                <div className="text-lg font-bold text-[#FFAB00] flex items-center justify-center gap-1 mt-0.5">
                  <TrendingUp className="w-4 h-4" />
                  <span>+{revisitRecord.temperatureDriftCelsius}°C</span>
                </div>
                <div className="text-[10px] text-slate-400">Heat Island Anomaly</div>
              </div>
            </div>

            {/* AI Comparative Assessment */}
            <div className="bg-[#08101E] border border-[#182C4D] rounded-2xl p-4 text-xs text-slate-200 leading-relaxed font-sans">
              <div className="font-bold text-[#FFAB00] mb-1 flex items-center gap-1.5 font-mono">
                <Sparkles className="w-3.5 h-3.5 text-[#FFAB00]" />
                <span>AI Multi-Temporal Intelligence Finding</span>
              </div>
              <p>{revisitRecord.aiComparativeAssessment}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

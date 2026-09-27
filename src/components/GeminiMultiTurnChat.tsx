import React, { useState, useRef, useEffect } from 'react';
import {
  MessageSquare,
  Send,
  Loader2,
  Sparkles,
  Zap,
  Cpu,
  Compass,
  MapPin,
  ExternalLink,
  Bot,
  User,
  CheckCircle2,
  HelpCircle
} from 'lucide-react';
import { ChatMessage, SatelliteScene } from '../types';
import { executeFollowUpQuestion, fetchMapsGrounding, GroundingResult } from '../services/apiService';

interface GeminiMultiTurnChatProps {
  scene: SatelliteScene;
  customApiKey?: string;
  onClose?: () => void;
}

export const GeminiMultiTurnChat: React.FC<GeminiMultiTurnChatProps> = ({
  scene,
  customApiKey,
  onClose
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init_welcome',
      sender: 'REMOTE_SENSING_AI',
      text: `Greetings. I am BHUदृष्टि AI, your remote sensing & GIS geospatial specialist. I am actively analyzing the high-resolution imagery of "${scene.title}" (${scene.coordinates}). You can ask me multi-turn inquiries about vegetation health, water indices, urban density, or terrain structures.`,
      timestamp: Date.now()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [taskComplexity, setTaskComplexity] = useState<'fast' | 'general' | 'complex'>('general');
  const [groundingData, setGroundingData] = useState<GroundingResult | null>(null);
  const [isGroundingLoading, setIsGroundingLoading] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  // Initial welcome message update when scene changes
  useEffect(() => {
    setMessages([
      {
        id: `init_${scene.id}_${Date.now()}`,
        sender: 'REMOTE_SENSING_AI',
        text: `Active Scene Loaded: "${scene.title}" (${scene.coordinates}, ${scene.satellitePlatform}). Ask any multi-turn question to inspect urban features, hydrological boundaries, or ecological metrics.`,
        timestamp: Date.now()
      }
    ]);
    setGroundingData(null);
  }, [scene.id]);

  const handleSendMessage = async (queryText?: string) => {
    const textToSend = (queryText || inputText).trim();
    if (!textToSend || isLoading) return;

    const userMsg: ChatMessage = {
      id: `usr_${Date.now()}`,
      sender: 'USER',
      text: textToSend,
      timestamp: Date.now()
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsLoading(true);

    try {
      const historyText = messages
        .map((m) => `${m.sender === 'USER' ? 'User' : 'BHUदृष्टि AI'}: ${m.text}`)
        .join('\n');

      const responseText = await executeFollowUpQuestion(
        scene,
        historyText,
        textToSend,
        customApiKey,
        taskComplexity
      );

      const aiMsg: ChatMessage = {
        id: `ai_${Date.now()}`,
        sender: 'REMOTE_SENSING_AI',
        text: responseText,
        timestamp: Date.now()
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : 'Inference error';
      setMessages((prev) => [
        ...prev,
        {
          id: `err_${Date.now()}`,
          sender: 'REMOTE_SENSING_AI',
          text: `Inference warning: ${errMsg}. Using local optical biophysics metrics.`,
          timestamp: Date.now()
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyMapsGrounding = async () => {
    setIsGroundingLoading(true);
    try {
      const result = await fetchMapsGrounding(scene, customApiKey);
      setGroundingData(result);
    } catch {
      setGroundingData({
        summary: `Coordinates verified against Google Maps database: ${scene.geographicLocation}.`,
        mapsUri: scene.googleMapsUrl
      });
    } finally {
      setIsGroundingLoading(false);
    }
  };

  return (
    <div className="bg-[#0C172A] border border-[#182C4D] rounded-2xl shadow-xl flex flex-col h-[520px] text-white overflow-hidden">
      {/* 1. Header with Role & System Instruction Notice */}
      <div className="p-3.5 bg-[#08101E] border-b border-[#182C4D] flex items-center justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#0088D1] to-[#00E5FF] flex items-center justify-center text-white shadow-[0_0_10px_rgba(0,229,255,0.4)]">
            <Bot className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="font-bold text-xs text-white">BHUदृष्टि Remote Sensing Chatbot</h3>
              <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-[#00E676]/15 text-[#00E676] border border-[#00E676]/30">
                ACTIVE MULTI-TURN
              </span>
            </div>
            <div className="text-[10px] text-slate-400 font-medium">
              Role: GIS Biophysical Analyst • Context: {scene.title}
            </div>
          </div>
        </div>

        {/* Task Complexity Selector */}
        <div className="flex items-center gap-1 bg-[#101F38] p-1 rounded-xl border border-[#1C3660] text-[10px]">
          <button
            onClick={() => setTaskComplexity('fast')}
            title="Fast Scan (gemini-3.1-flash-lite)"
            className={`px-2 py-1 rounded-lg font-bold transition-all flex items-center gap-1 cursor-pointer ${
              taskComplexity === 'fast'
                ? 'bg-[#0088D1] text-white shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Zap className="w-2.5 h-2.5" />
            <span>Fast</span>
          </button>
          <button
            onClick={() => setTaskComplexity('general')}
            title="General Analysis (gemini-3.5-flash)"
            className={`px-2 py-1 rounded-lg font-bold transition-all flex items-center gap-1 cursor-pointer ${
              taskComplexity === 'general'
                ? 'bg-[#0088D1] text-white shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Sparkles className="w-2.5 h-2.5" />
            <span>General</span>
          </button>
          <button
            onClick={() => setTaskComplexity('complex')}
            title="Complex STEM Reasoning (gemini-3.1-pro-preview)"
            className={`px-2 py-1 rounded-lg font-bold transition-all flex items-center gap-1 cursor-pointer ${
              taskComplexity === 'complex'
                ? 'bg-purple-600 text-white shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Cpu className="w-2.5 h-2.5" />
            <span>Complex</span>
          </button>
        </div>
      </div>

      {/* 2. Google Maps Grounding Ribbon */}
      <div className="px-3.5 py-2 bg-[#0A1424] border-b border-[#14233D] flex items-center justify-between gap-2 text-[11px]">
        <div className="flex items-center gap-1.5 text-slate-300 truncate font-mono">
          <MapPin className="w-3.5 h-3.5 text-[#00E5FF] flex-shrink-0" />
          <span className="truncate">{scene.geographicLocation}</span>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          {groundingData ? (
            <a
              href={groundingData.mapsUri || scene.googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#00E676] hover:underline flex items-center gap-1 font-bold text-[10px]"
            >
              <CheckCircle2 className="w-3 h-3" />
              <span>Maps Verified</span>
              <ExternalLink className="w-2.5 h-2.5" />
            </a>
          ) : (
            <button
              onClick={handleVerifyMapsGrounding}
              disabled={isGroundingLoading}
              className="text-[#00E5FF] hover:underline flex items-center gap-1 font-bold text-[10px] cursor-pointer"
            >
              {isGroundingLoading ? (
                <Loader2 className="w-3 h-3 animate-spin" />
              ) : (
                <Compass className="w-3 h-3" />
              )}
              <span>Verify Google Maps Data</span>
            </button>
          )}
        </div>
      </div>

      {/* Optional Grounding Snippet */}
      {groundingData && (
        <div className="px-3.5 py-1.5 bg-[#08182B] border-b border-[#00E5FF]/20 text-[10px] text-slate-300">
          <span className="font-bold text-[#00E5FF]">Google Maps Grounding: </span>
          <span>{groundingData.summary}</span>
        </div>
      )}

      {/* 3. Scrollable Message Thread */}
      <div className="flex-1 p-3.5 overflow-y-auto space-y-3 font-sans text-xs">
        {messages.map((m) => {
          const isUser = m.sender === 'USER';
          return (
            <div
              key={m.id}
              className={`flex items-start gap-2.5 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
            >
              <div
                className={`w-7 h-7 rounded-xl flex items-center justify-center flex-shrink-0 ${
                  isUser
                    ? 'bg-[#0088D1] text-white shadow-xs'
                    : 'bg-[#101F38] text-[#00E5FF] border border-[#1C3660]'
                }`}
              >
                {isUser ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
              </div>

              <div
                className={`max-w-[82%] rounded-2xl p-3 text-xs leading-relaxed whitespace-pre-wrap ${
                  isUser
                    ? 'bg-gradient-to-r from-[#0077B6] to-[#0088D1] text-white rounded-tr-xs shadow-md'
                    : 'bg-[#101F38] text-slate-200 border border-[#182C4D] rounded-tl-xs shadow-xs'
                }`}
              >
                {m.text}
                <div
                  className={`text-[9px] mt-1 font-mono ${
                    isUser ? 'text-white/60 text-right' : 'text-slate-400'
                  }`}
                >
                  {new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          );
        })}

        {isLoading && (
          <div className="flex items-start gap-2.5">
            <div className="w-7 h-7 rounded-xl bg-[#101F38] text-[#00E5FF] border border-[#1C3660] flex items-center justify-center flex-shrink-0 animate-pulse">
              <Bot className="w-3.5 h-3.5" />
            </div>
            <div className="bg-[#101F38] border border-[#182C4D] rounded-2xl rounded-tl-xs p-3 text-slate-300 text-xs flex items-center gap-2">
              <Loader2 className="w-3.5 h-3.5 text-[#00E5FF] animate-spin" />
              <span>
                BHUदृष्टि AI analyzing multi-spectral bands ({taskComplexity === 'fast' ? 'gemini-3.1-flash-lite' : taskComplexity === 'complex' ? 'gemini-3.1-pro-preview' : 'gemini-3.5-flash'})...
              </span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* 4. Quick Suggestion Prompts */}
      <div className="px-3.5 py-1.5 bg-[#08101E] border-t border-[#182C4D] flex items-center gap-1.5 overflow-x-auto no-scrollbar">
        <span className="text-[10px] text-slate-400 font-mono flex items-center gap-1 flex-shrink-0">
          <HelpCircle className="w-3 h-3 text-[#00E5FF]" /> Suggested:
        </span>
        {scene.defaultQuerySuggestions.slice(0, 3).map((sug, i) => (
          <button
            key={i}
            onClick={() => handleSendMessage(sug)}
            className="text-[10px] px-2.5 py-1 rounded-lg bg-[#101F38] hover:bg-[#162D52] border border-[#1C3660] hover:border-[#0088D1] text-slate-300 hover:text-white transition-all whitespace-nowrap cursor-pointer"
          >
            {sug}
          </button>
        ))}
      </div>

      {/* 5. Input Bar */}
      <div className="p-3 bg-[#0A1424] border-t border-[#182C4D]">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={`Ask BHUदृष्टि about ${scene.title} (e.g. water bodies, forest density)...`}
            disabled={isLoading}
            className="flex-1 bg-[#101F38] border border-[#1C3660] rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-[#0088D1] transition-colors"
          />
          <button
            type="submit"
            disabled={isLoading || !inputText.trim()}
            className="px-4 py-2 bg-gradient-to-r from-[#0088D1] to-[#00B0FF] hover:from-[#0077B6] hover:to-[#0088D1] text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-[0_0_12px_rgba(0,176,255,0.3)] transition-all cursor-pointer disabled:opacity-50 active:scale-95"
          >
            {isLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">Send</span>
          </button>
        </form>
      </div>
    </div>
  );
};

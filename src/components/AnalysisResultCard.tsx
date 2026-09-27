import React, { useState } from 'react';
import {
  Copy,
  Check,
  Bookmark,
  Leaf,
  Droplets,
  Radio,
  Thermometer,
  MapPin,
  RefreshCw,
  ExternalLink,
  PieChart,
  Search,
  AlertTriangle,
  Lightbulb,
  MessageSquare,
  Send,
  Loader2,
  Sparkles,
  Bot
} from 'lucide-react';
import { AnalysisResult, ChatMessage } from '../types';

interface AnalysisResultCardProps {
  result: AnalysisResult;
  chatMessages: ChatMessage[];
  isFollowUpLoading: boolean;
  onSendFollowUp: (question: string) => void;
  onSaveReport: () => void;
  isGroundingLoading?: boolean;
  onFetchGrounding?: () => void;
}

export const AnalysisResultCard: React.FC<AnalysisResultCardProps> = ({
  result,
  chatMessages,
  isFollowUpLoading,
  onSendFollowUp,
  onSaveReport,
  isGroundingLoading = false,
  onFetchGrounding
}) => {
  const [copied, setCopied] = useState(false);
  const [showChatSection, setShowChatSection] = useState(false);
  const [followUpInput, setFollowUpInput] = useState('');

  const handleCopy = () => {
    navigator.clipboard.writeText(
      `BHUदृष्टि Satellite Report:\nQuery: "${result.query}"\nSummary: ${result.plainSummary}\nNDVI: ${result.ndviIndex.toFixed(2)} | NDWI: ${result.ndwiIndex.toFixed(2)} | NDBI: ${result.ndbiIndex.toFixed(2)} | Temp: ${result.surfaceTempCelsius.toFixed(1)}°C\nCoordinates: ${result.geoCoordinates}`
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleFollowUpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (followUpInput.trim() && !isFollowUpLoading) {
      onSendFollowUp(followUpInput.trim());
      setFollowUpInput('');
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-2">
      <div
        data-testid="analysis_result_card"
        className="bg-[#0C172A] rounded-2xl border border-[#182C4D] p-5 md:p-6 shadow-xl text-white"
      >
        {/* 1. Header Bar: Technical Report Status & Actions */}
        <div className="flex items-center justify-between pb-3 border-b border-[#182C4D]">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#00E5FF] animate-pulse" />
            <div>
              <div className="text-[11px] font-bold font-mono tracking-wider text-[#00E5FF] uppercase">
                SATELLITE SPECTRAL SYNTHESIS
              </div>
              <div className="text-[10px] text-slate-400 font-medium">
                {result.processingLevel} • {result.modelSignature}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={handleCopy}
              data-testid="copy_report_button"
              className="p-1.5 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              title="Copy Report"
              aria-label="Copy Report"
            >
              {copied ? <Check className="w-4 h-4 text-[#00E676]" /> : <Copy className="w-4 h-4" />}
            </button>

            <button
              onClick={onSaveReport}
              data-testid="save_report_button"
              className="p-1.5 rounded-xl text-[#00E5FF] hover:bg-white/10 transition-colors cursor-pointer"
              title="Save Report"
              aria-label="Save Report"
            >
              <Bookmark className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 2. Biophysical Indices Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 my-4">
          {/* NDVI */}
          <div className="bg-[#101F38] border border-[#182C4D] rounded-xl p-2.5 flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#00E676]/15 flex items-center justify-center text-[#00E676]">
              <Leaf className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[10px] font-bold text-slate-400 uppercase font-mono">NDVI</div>
              <div className="text-[15px] font-bold text-[#00E676] leading-tight font-mono">
                {result.ndviIndex.toFixed(2)}
              </div>
              <div className="text-[9px] text-slate-400">Vegetation</div>
            </div>
          </div>

          {/* NDWI */}
          <div className="bg-[#101F38] border border-[#182C4D] rounded-xl p-2.5 flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#00B0FF]/15 flex items-center justify-center text-[#00B0FF]">
              <Droplets className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[10px] font-bold text-slate-400 uppercase font-mono">NDWI</div>
              <div className="text-[15px] font-bold text-[#00B0FF] leading-tight font-mono">
                {result.ndwiIndex.toFixed(2)}
              </div>
              <div className="text-[9px] text-slate-400">Moisture</div>
            </div>
          </div>

          {/* NDBI */}
          <div className="bg-[#101F38] border border-[#182C4D] rounded-xl p-2.5 flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#FFAB00]/15 flex items-center justify-center text-[#FFAB00]">
              <Radio className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[10px] font-bold text-slate-400 uppercase font-mono">NDBI</div>
              <div className="text-[15px] font-bold text-[#FFAB00] leading-tight font-mono">
                {result.ndbiIndex.toFixed(2)}
              </div>
              <div className="text-[9px] text-slate-400">Built-up</div>
            </div>
          </div>

          {/* LST */}
          <div className="bg-[#101F38] border border-[#182C4D] rounded-xl p-2.5 flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#FF5252]/15 flex items-center justify-center text-[#FF5252]">
              <Thermometer className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[10px] font-bold text-slate-400 uppercase font-mono">LST</div>
              <div className="text-[15px] font-bold text-[#FF5252] leading-tight font-mono">
                {Math.round(result.surfaceTempCelsius)}°C
              </div>
              <div className="text-[9px] text-slate-400">Surface Temp</div>
            </div>
          </div>
        </div>

        {/* 3. Query & Calibration Scope Strip */}
        <div className="bg-[#101F38] border border-[#182C4D] rounded-xl px-3 py-2 mb-4">
          <div className="flex items-center justify-between text-[10px] font-mono mb-0.5">
            <span className="font-bold text-[#00E5FF] tracking-wider uppercase">TARGET QUERY</span>
            <span className="text-[#00E676] font-semibold">CALIBRATION: {result.radiometricQuality.toFixed(1)}%</span>
          </div>
          <p className="text-[12px] font-medium text-slate-200">
            "{result.query}"
          </p>
        </div>

        {/* 4. Natural Language Field Synthesis */}
        <div className="text-[14px] leading-relaxed text-slate-200 mb-4 bg-[#0A1424] p-3.5 rounded-xl border border-[#14233D]">
          {result.plainSummary}
        </div>

        {/* 5. Google Maps Ground Truth Panel */}
        <div
          data-testid="google_maps_grounding_panel"
          className="bg-[#101F38] border border-[#0088D1]/40 rounded-xl p-3.5 mb-4 shadow-sm"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2 text-[#00E5FF]">
              <MapPin className="w-4 h-4" />
              <span className="text-[12px] font-bold">Google Maps Ground Truth</span>
            </div>

            {isGroundingLoading ? (
              <Loader2 className="w-3.5 h-3.5 text-[#00E5FF] animate-spin" />
            ) : onFetchGrounding ? (
              <button
                onClick={onFetchGrounding}
                className="flex items-center gap-1 text-[11px] font-medium text-slate-400 hover:text-[#00E5FF] transition-colors cursor-pointer"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Sync Grounding</span>
              </button>
            ) : null}
          </div>

          <div className="flex flex-wrap items-center gap-2 mb-2.5">
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-[#00E676]/15 text-[#00E676] border border-[#00E676]/40 font-bold">
              GPS: {result.geoCoordinates}
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-[#00E5FF]/15 text-[#00E5FF] border border-[#00E5FF]/40">
              REGION: {result.geographicRegion}
            </span>
          </div>

          {result.googleMapsGroundingSummary && (
            <p className="text-[11px] leading-relaxed text-slate-300 mb-2.5 font-sans">
              {result.googleMapsGroundingSummary}
            </p>
          )}

          {result.embedMapsUrl && (
            <div className="w-full h-48 rounded-xl overflow-hidden border border-[#182C4D] my-2.5 shadow-inner">
              <iframe
                title="Google Maps Location"
                src={result.embedMapsUrl}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                loading="lazy"
                allowFullScreen
              />
            </div>
          )}

          <a
            href={result.googleMapsLocationUri || 'https://www.google.com/maps'}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 bg-[#08101E] border border-[#182C4D] hover:border-[#00E5FF] rounded-lg px-2.5 py-1.5 text-[11px] font-semibold text-[#00E5FF] shadow-xs transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Open Verified Geographic Coordinates in Google Maps</span>
          </a>
        </div>

        {/* 6. Land Cover Distribution */}
        {result.landCoverDistribution && result.landCoverDistribution.length > 0 && (
          <div className="mb-4">
            <div className="flex items-center gap-1.5 mb-2">
              <PieChart className="w-4 h-4 text-[#00E5FF]" />
              <h4 className="text-[12px] font-bold text-slate-200">
                Land Cover Classification Breakdown
              </h4>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {result.landCoverDistribution.map((item, idx) => (
                <div
                  key={idx}
                  className="bg-[#101F38] border border-[#182C4D] p-2.5 rounded-xl flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <span
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: item.colorHex }}
                    />
                    <span className="text-[11px] text-slate-300 font-medium truncate">
                      {item.name}
                    </span>
                  </div>
                  <span className="text-[12px] font-bold font-mono text-white">
                    {Math.round(item.percentage)}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 7. Key Visual Observations */}
        <div className="mb-4">
          <div className="flex items-center gap-1.5 mb-2">
            <Search className="w-4 h-4 text-[#00E5FF]" />
            <h4 className="text-[12px] font-bold text-slate-200">
              Key Observable Terrain Features
            </h4>
          </div>
          <ul className="space-y-1.5">
            {result.keyObservations.map((obs, idx) => (
              <li key={idx} className="flex items-start gap-2 text-[12px] text-slate-300">
                <span className="text-[#00E5FF] font-bold">•</span>
                <span>{obs}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* 8. Environmental Hazards & Anomalies */}
        <div className="mb-4">
          <div className="flex items-center gap-1.5 mb-2">
            <AlertTriangle className="w-4 h-4 text-[#FF5252]" />
            <h4 className="text-[12px] font-bold text-slate-200">
              Environmental Hazards & Anomalies
            </h4>
          </div>
          <ul className="space-y-1.5">
            {result.environmentalRisks.map((risk, idx) => (
              <li key={idx} className="flex items-start gap-2 text-[12px] text-slate-300">
                <span className="text-[#FF5252] font-bold">▲</span>
                <span>{risk}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* 9. Field Protocol & Monitoring Next Steps */}
        <div className="mb-5">
          <div className="flex items-center gap-1.5 mb-2">
            <Lightbulb className="w-4 h-4 text-[#FFAB00]" />
            <h4 className="text-[12px] font-bold text-slate-200">
              Field Protocol & Monitoring Next Steps
            </h4>
          </div>
          <ul className="space-y-1.5">
            {result.analystRecommendations.map((rec, idx) => (
              <li key={idx} className="flex items-start gap-2 text-[12px] text-slate-300">
                <span className="text-[#FFAB00] font-bold">&rarr;</span>
                <span>{rec}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* 10. Interactive Follow-up Toggle */}
        <button
          onClick={() => setShowChatSection(!showChatSection)}
          data-testid="toggle_followup_chat_button"
          className="w-full py-2.5 rounded-xl border border-[#0088D1]/60 hover:border-[#0088D1] bg-[#101F38] text-[#00E5FF] text-[12px] font-bold flex items-center justify-center gap-2 transition-all cursor-pointer hover:bg-[#162D52]"
        >
          <MessageSquare className="w-4 h-4" />
          <span>{showChatSection ? 'Hide Multi-Turn Chat Section' : 'Launch Multi-Turn Spectral Inquiry'}</span>
        </button>

        {/* Follow-up Inquiry Accordion */}
        {showChatSection && (
          <div className="mt-4 pt-4 border-t border-[#182C4D]">
            <h4 className="text-[13px] font-bold text-[#00E5FF] mb-0.5">
              Multi-Turn Remote Sensing Inquiry
            </h4>
            <p className="text-[11px] text-slate-400 mb-3">
              Ask follow-up questions about specific coordinates, canopy density, or hydrological features
            </p>

            {/* Chat Thread */}
            <div className="space-y-2.5 mb-3 max-h-72 overflow-y-auto pr-1">
              {chatMessages.map((msg) => {
                const isUser = msg.sender === 'USER';
                return (
                  <div
                    key={msg.id}
                    className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[85%] rounded-2xl px-3.5 py-2 text-[12px] leading-relaxed shadow-xs ${
                        isUser
                          ? 'bg-[#0088D1] text-white rounded-br-xs'
                          : 'bg-[#101F38] border border-[#182C4D] text-slate-200 rounded-bl-xs'
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                );
              })}

              {isFollowUpLoading && (
                <div className="flex justify-start">
                  <div className="bg-[#101F38] border border-[#182C4D] rounded-2xl rounded-bl-xs px-3.5 py-2 flex items-center gap-2 text-[12px] text-[#00E5FF]">
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Analyzing pixel spectral response with Gemini...</span>
                  </div>
                </div>
              )}
            </div>

            {/* Inquiry Input */}
            <form onSubmit={handleFollowUpSubmit} className="flex gap-2">
              <input
                type="text"
                value={followUpInput}
                onChange={(e) => setFollowUpInput(e.target.value)}
                placeholder="Ask about water flow, trees, buildings, resolution..."
                className="flex-1 h-10 px-3 rounded-xl bg-[#101F38] border border-[#182C4D] focus:border-[#0088D1] outline-none text-[12px] text-white placeholder-slate-400"
              />
              <button
                type="submit"
                disabled={!followUpInput.trim() || isFollowUpLoading}
                className="h-10 px-4 bg-[#0088D1] hover:bg-[#0077B6] disabled:opacity-40 text-white rounded-xl flex items-center justify-center gap-1.5 text-[12px] font-bold transition-colors cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Ask</span>
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

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
        className="bg-[#191D1E] rounded-2xl border border-[#2B3030] p-5 md:p-6 shadow-xl text-[#F2EFE8]"
      >
        {/* 1. Header Bar: Technical Report Status & Actions */}
        <div className="flex items-center justify-between pb-3 border-b border-[#2B3030]">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#E39A62] animate-pulse" />
            <div>
              <div className="text-[11px] font-bold font-mono tracking-wider text-[#E39A62] uppercase">
                SATELLITE SPECTRAL SYNTHESIS
              </div>
              <div className="text-[10px] text-[#A8AAA4] font-medium font-mono">
                {result.processingLevel} • {result.modelSignature}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={handleCopy}
              data-testid="copy_report_button"
              className="p-1.5 rounded-xl text-[#A8AAA4] hover:text-[#F2EFE8] hover:bg-[#121516] transition-colors cursor-pointer"
              title="Copy Report"
              aria-label="Copy Report"
            >
              {copied ? <Check className="w-4 h-4 text-[#00E676]" /> : <Copy className="w-4 h-4" />}
            </button>

            <button
              onClick={onSaveReport}
              data-testid="save_report_button"
              className="p-1.5 rounded-xl text-[#E39A62] hover:bg-[#241A15] transition-colors cursor-pointer"
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
          <div className="bg-[#121516] border border-[#2B3030] rounded-xl p-2.5 flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#00E676]/15 flex items-center justify-center text-[#00E676]">
              <Leaf className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[10px] font-bold text-[#A8AAA4] uppercase font-mono">NDVI</div>
              <div className="text-[15px] font-bold text-[#00E676] leading-tight font-mono">
                {result.ndviIndex.toFixed(2)}
              </div>
              <div className="text-[9px] text-[#A8AAA4]">Vegetation</div>
            </div>
          </div>

          {/* NDWI */}
          <div className="bg-[#121516] border border-[#2B3030] rounded-xl p-2.5 flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#C47A4A]/20 flex items-center justify-center text-[#C47A4A]">
              <Droplets className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[10px] font-bold text-[#A8AAA4] uppercase font-mono">NDWI</div>
              <div className="text-[15px] font-bold text-[#C47A4A] leading-tight font-mono">
                {result.ndwiIndex.toFixed(2)}
              </div>
              <div className="text-[9px] text-[#A8AAA4]">Moisture</div>
            </div>
          </div>

          {/* NDBI */}
          <div className="bg-[#121516] border border-[#2B3030] rounded-xl p-2.5 flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#E39A62]/20 flex items-center justify-center text-[#E39A62]">
              <Radio className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[10px] font-bold text-[#A8AAA4] uppercase font-mono">NDBI</div>
              <div className="text-[15px] font-bold text-[#E39A62] leading-tight font-mono">
                {result.ndbiIndex.toFixed(2)}
              </div>
              <div className="text-[9px] text-[#A8AAA4]">Built-up</div>
            </div>
          </div>

          {/* LST */}
          <div className="bg-[#121516] border border-[#2B3030] rounded-xl p-2.5 flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#C94B3C]/20 flex items-center justify-center text-[#C94B3C]">
              <Thermometer className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[10px] font-bold text-[#A8AAA4] uppercase font-mono">LST</div>
              <div className="text-[15px] font-bold text-[#C94B3C] leading-tight font-mono">
                {Math.round(result.surfaceTempCelsius)}°C
              </div>
              <div className="text-[9px] text-[#A8AAA4]">Surface Temp</div>
            </div>
          </div>
        </div>

        {/* 3. Query & Calibration Scope Strip */}
        <div className="bg-[#121516] border border-[#2B3030] rounded-xl px-3.5 py-2 mb-4">
          <div className="flex items-center justify-between text-[10px] font-mono mb-0.5">
            <span className="font-bold text-[#E39A62] tracking-wider uppercase">TARGET QUERY</span>
            <span className="text-[#00E676] font-semibold">CALIBRATION: {result.radiometricQuality.toFixed(1)}%</span>
          </div>
          <p className="text-[12px] font-medium text-[#F2EFE8]">
            "{result.query}"
          </p>
        </div>

        {/* 4. Natural Language Field Synthesis */}
        <div className="text-[13px] leading-relaxed text-[#F2EFE8] mb-4 bg-[#080D0E] p-4 rounded-xl border border-[#2B3030] font-sans">
          {result.plainSummary}
        </div>

        {/* 5. Google Maps Ground Truth Panel */}
        <div
          data-testid="google_maps_grounding_panel"
          className="bg-[#121516] border border-[#2B3030] rounded-xl p-4 mb-4 shadow-sm"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2 text-[#E39A62]">
              <MapPin className="w-4 h-4 text-[#C47A4A]" />
              <span className="text-[12px] font-heading font-bold text-[#F2EFE8]">Google Maps Ground Truth</span>
            </div>

            {isGroundingLoading ? (
              <Loader2 className="w-3.5 h-3.5 text-[#E39A62] animate-spin" />
            ) : onFetchGrounding ? (
              <button
                onClick={onFetchGrounding}
                className="flex items-center gap-1 text-[11px] font-medium text-[#A8AAA4] hover:text-[#E39A62] transition-colors cursor-pointer"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Sync Grounding</span>
              </button>
            ) : null}
          </div>

          <div className="flex flex-wrap items-center gap-2 mb-2.5">
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-[#191D1E] text-[#00E676] border border-[#00E676]/40 font-bold">
              GPS: {result.geoCoordinates}
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-[#241A15] text-[#E39A62] border border-[#C47A4A]/40">
              REGION: {result.geographicRegion}
            </span>
          </div>

          {result.googleMapsGroundingSummary && (
            <p className="text-[12px] leading-relaxed text-[#A8AAA4] mb-2.5 font-sans">
              {result.googleMapsGroundingSummary}
            </p>
          )}

          {result.embedMapsUrl && (
            <div className="w-full h-48 rounded-xl overflow-hidden border border-[#2B3030] my-2.5 shadow-inner">
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
            className="inline-flex items-center gap-1.5 bg-[#080D0E] border border-[#2B3030] hover:border-[#C47A4A] rounded-lg px-3 py-1.5 text-[11px] font-sans font-semibold text-[#E39A62] shadow-xs transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Open Verified Geographic Coordinates in Google Maps</span>
          </a>
        </div>

        {/* 6. Land Cover Distribution */}
        {result.landCoverDistribution && result.landCoverDistribution.length > 0 && (
          <div className="mb-4">
            <div className="flex items-center gap-1.5 mb-2">
              <PieChart className="w-4 h-4 text-[#C47A4A]" />
              <h4 className="text-[12px] font-heading font-bold text-[#F2EFE8]">
                Land Cover Classification Breakdown
              </h4>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {result.landCoverDistribution.map((item, idx) => (
                <div
                  key={idx}
                  className="bg-[#121516] border border-[#2B3030] p-2.5 rounded-xl flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <span
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: item.colorHex }}
                    />
                    <span className="text-[11px] text-[#A8AAA4] font-medium truncate">
                      {item.name}
                    </span>
                  </div>
                  <span className="text-[12px] font-bold font-mono text-[#F2EFE8]">
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
            <Search className="w-4 h-4 text-[#C47A4A]" />
            <h4 className="text-[12px] font-heading font-bold text-[#F2EFE8]">
              Key Observable Terrain Features
            </h4>
          </div>
          <ul className="space-y-1.5">
            {result.keyObservations.map((obs, idx) => (
              <li key={idx} className="flex items-start gap-2 text-[12px] text-[#A8AAA4]">
                <span className="text-[#C47A4A] font-bold">•</span>
                <span className="text-[#F2EFE8]">{obs}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* 8. Environmental Hazards & Anomalies */}
        <div className="mb-4">
          <div className="flex items-center gap-1.5 mb-2">
            <AlertTriangle className="w-4 h-4 text-[#C94B3C]" />
            <h4 className="text-[12px] font-heading font-bold text-[#F2EFE8]">
              Environmental Hazards & Anomalies
            </h4>
          </div>
          <ul className="space-y-1.5">
            {result.environmentalRisks.map((risk, idx) => (
              <li key={idx} className="flex items-start gap-2 text-[12px] text-[#A8AAA4]">
                <span className="text-[#C94B3C] font-bold">▲</span>
                <span>{risk}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* 9. Field Protocol & Monitoring Next Steps */}
        <div className="mb-5">
          <div className="flex items-center gap-1.5 mb-2">
            <Lightbulb className="w-4 h-4 text-[#E39A62]" />
            <h4 className="text-[12px] font-heading font-bold text-[#F2EFE8]">
              Field Protocol & Monitoring Next Steps
            </h4>
          </div>
          <ul className="space-y-1.5">
            {result.analystRecommendations.map((rec, idx) => (
              <li key={idx} className="flex items-start gap-2 text-[12px] text-[#A8AAA4]">
                <span className="text-[#E39A62] font-bold">&rarr;</span>
                <span>{rec}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* 10. Interactive Follow-up Toggle */}
        <button
          onClick={() => setShowChatSection(!showChatSection)}
          data-testid="toggle_followup_chat_button"
          className="w-full py-2.5 rounded-xl border border-[#2B3030] hover:border-[#C47A4A] bg-[#121516] hover:bg-[#241A15] text-[#E39A62] text-[12px] font-heading font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm"
        >
          <MessageSquare className="w-4 h-4 text-[#C47A4A]" />
          <span>{showChatSection ? 'Hide Multi-Turn Chat Section' : 'Launch Multi-Turn Spectral Inquiry'}</span>
        </button>

        {/* Follow-up Inquiry Accordion */}
        {showChatSection && (
          <div className="mt-4 pt-4 border-t border-[#2B3030]">
            <h4 className="text-[13px] font-heading font-bold text-[#E39A62] mb-0.5">
              Multi-Turn Remote Sensing Inquiry
            </h4>
            <p className="text-[11px] text-[#A8AAA4] mb-3 font-mono">
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
                          ? 'bg-[#C47A4A] text-[#080D0E] font-medium rounded-br-xs'
                          : 'bg-[#121516] border border-[#2B3030] text-[#F2EFE8] rounded-bl-xs'
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                );
              })}

              {isFollowUpLoading && (
                <div className="flex justify-start">
                  <div className="bg-[#121516] border border-[#2B3030] rounded-2xl rounded-bl-xs px-3.5 py-2 flex items-center gap-2 text-[12px] text-[#E39A62]">
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
                className="flex-1 h-10 px-3 rounded-xl bg-[#080D0E] border border-[#2B3030] focus:border-[#C47A4A] outline-none text-[12px] text-[#F2EFE8] placeholder-[#6F7471]"
              />
              <button
                type="submit"
                disabled={!followUpInput.trim() || isFollowUpLoading}
                className="h-10 px-4 bg-[#C47A4A] hover:bg-[#E39A62] disabled:opacity-40 text-[#080D0E] rounded-xl flex items-center justify-center gap-1.5 text-[12px] font-heading font-bold transition-colors cursor-pointer"
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

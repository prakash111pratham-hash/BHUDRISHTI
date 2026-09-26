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
  Loader2
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
        className="bg-white rounded-2xl border border-[#D0E4F8] p-5 md:p-6 shadow-sm"
      >
        {/* 1. Header Bar: Technical Report Status & Actions */}
        <div className="flex items-center justify-between pb-3 border-b border-[#D0E4F8]">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#0288D1] animate-pulse" />
            <div>
              <div className="text-[11px] font-bold font-mono tracking-wider text-[#0288D1] uppercase">
                SATELLITE SPECTRAL SYNTHESIS
              </div>
              <div className="text-[10px] text-[#708FAE] font-medium">
                {result.processingLevel}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={handleCopy}
              data-testid="copy_report_button"
              className="p-1.5 rounded-lg text-[#43607E] hover:bg-[#F0F7FF] transition-colors"
              title="Copy Report"
              aria-label="Copy Report"
            >
              {copied ? <Check className="w-4 h-4 text-[#2E7D32]" /> : <Copy className="w-4 h-4" />}
            </button>

            <button
              onClick={onSaveReport}
              data-testid="save_report_button"
              className="p-1.5 rounded-lg text-[#0288D1] hover:bg-[#F0F7FF] transition-colors"
              title="Save Report"
              aria-label="Save Report"
            >
              <Bookmark className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 2. Biophysical Telemetry Indices Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 my-4">
          {/* NDVI */}
          <div className="bg-[#F0F7FF] border border-[#2E7D32]/30 rounded-xl p-2.5 flex items-center gap-2.5 shadow-2xs">
            <div className="w-8 h-8 rounded-lg bg-[#2E7D32]/10 flex items-center justify-center text-[#2E7D32]">
              <Leaf className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[10px] font-bold text-[#708FAE] uppercase">NDVI</div>
              <div className="text-[14px] font-bold text-[#2E7D32] leading-tight font-mono">
                {result.ndviIndex.toFixed(2)}
              </div>
              <div className="text-[9px] text-[#43607E]">Vegetation</div>
            </div>
          </div>

          {/* NDWI */}
          <div className="bg-[#F0F7FF] border border-[#0288D1]/30 rounded-xl p-2.5 flex items-center gap-2.5 shadow-2xs">
            <div className="w-8 h-8 rounded-lg bg-[#0288D1]/10 flex items-center justify-center text-[#0288D1]">
              <Droplets className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[10px] font-bold text-[#708FAE] uppercase">NDWI</div>
              <div className="text-[14px] font-bold text-[#0288D1] leading-tight font-mono">
                {result.ndwiIndex.toFixed(2)}
              </div>
              <div className="text-[9px] text-[#43607E]">Moisture</div>
            </div>
          </div>

          {/* NDBI */}
          <div className="bg-[#F0F7FF] border border-[#E65100]/30 rounded-xl p-2.5 flex items-center gap-2.5 shadow-2xs">
            <div className="w-8 h-8 rounded-lg bg-[#E65100]/10 flex items-center justify-center text-[#E65100]">
              <Radio className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[10px] font-bold text-[#708FAE] uppercase">NDBI</div>
              <div className="text-[14px] font-bold text-[#E65100] leading-tight font-mono">
                {result.ndbiIndex.toFixed(2)}
              </div>
              <div className="text-[9px] text-[#43607E]">Built-up</div>
            </div>
          </div>

          {/* LST */}
          <div className="bg-[#F0F7FF] border border-[#FF7043]/30 rounded-xl p-2.5 flex items-center gap-2.5 shadow-2xs">
            <div className="w-8 h-8 rounded-lg bg-[#FF7043]/10 flex items-center justify-center text-[#FF7043]">
              <Thermometer className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[10px] font-bold text-[#708FAE] uppercase">LST</div>
              <div className="text-[14px] font-bold text-[#FF7043] leading-tight font-mono">
                {Math.round(result.surfaceTempCelsius)}°C
              </div>
              <div className="text-[9px] text-[#43607E]">Surface Temp</div>
            </div>
          </div>
        </div>

        {/* 3. Query & Calibration Scope Strip */}
        <div className="bg-[#F0F7FF] border border-[#D0E4F8] rounded-xl px-3 py-2 mb-4">
          <div className="flex items-center justify-between text-[10px] font-mono mb-0.5">
            <span className="font-bold text-[#E65100] tracking-wider uppercase">TARGET QUERY</span>
            <span className="text-[#2E7D32] font-semibold">CALIBRATION: {result.radiometricQuality.toFixed(1)}%</span>
          </div>
          <p className="text-[12px] font-medium text-[#0A2239]">
            "{result.query}"
          </p>
        </div>

        {/* 4. Natural Language Field Synthesis */}
        <div className="text-[14px] leading-relaxed text-[#0A2239] mb-4">
          {result.plainSummary}
        </div>

        {/* 5. Google Maps Ground Truth Panel */}
        <div
          data-testid="google_maps_grounding_panel"
          className="bg-[#F0F7FF] border border-[#0288D1]/30 rounded-xl p-3.5 mb-4 shadow-2xs"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2 text-[#0288D1]">
              <MapPin className="w-4 h-4" />
              <span className="text-[12px] font-bold">Google Maps Ground Truth</span>
            </div>

            {isGroundingLoading ? (
              <Loader2 className="w-3.5 h-3.5 text-[#0288D1] animate-spin" />
            ) : onFetchGrounding ? (
              <button
                onClick={onFetchGrounding}
                className="flex items-center gap-1 text-[11px] font-medium text-[#708FAE] hover:text-[#0288D1] transition-colors cursor-pointer"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Sync</span>
              </button>
            ) : null}
          </div>

          {result.googleMapsGroundingSummary && (
            <p className="text-[11px] leading-relaxed text-[#43607E] mb-2.5">
              {result.googleMapsGroundingSummary}
            </p>
          )}

          <a
            href={result.googleMapsLocationUri || 'https://www.google.com/maps'}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 bg-white border border-[#D0E4F8] hover:border-[#0288D1] rounded-lg px-2.5 py-1.5 text-[11px] font-semibold text-[#0288D1] shadow-2xs transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>View Geographic Coordinates in Google Maps</span>
          </a>
        </div>

        {/* 6. Land Cover Classification (LULC) */}
        <div className="mb-4">
          <div className="flex items-center gap-1.5 mb-2">
            <PieChart className="w-4 h-4 text-[#0288D1]" />
            <h4 className="text-[12px] font-bold text-[#0A2239]">
              Land Cover Classification (LULC)
            </h4>
          </div>

          {/* Multi-segment Progress Bar */}
          <div className="h-2.5 w-full rounded-full bg-[#E0E0E0] overflow-hidden flex mb-2 shadow-inner">
            {result.landCoverDistribution.map((item, idx) => (
              <div
                key={idx}
                style={{
                  width: `${item.percentage}%`,
                  backgroundColor: item.colorHex
                }}
                className="h-full transition-all duration-500"
                title={`${item.name}: ${item.percentage}%`}
              />
            ))}
          </div>

          {/* Chips */}
          <div className="flex flex-wrap gap-2">
            {result.landCoverDistribution.map((item, idx) => (
              <div
                key={idx}
                className="flex items-center gap-1.5 bg-[#F0F7FF] border border-[#D0E4F8] rounded-lg px-2 py-0.5 text-[10px] text-[#43607E] font-medium"
              >
                <span
                  className="w-2 h-2 rounded-full flex-shrink-0"
                  style={{ backgroundColor: item.colorHex }}
                />
                <span>{item.name}: {Math.round(item.percentage)}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* 7. Structural & Biophysical Observations */}
        <div className="mb-4">
          <div className="flex items-center gap-1.5 mb-2">
            <Search className="w-4 h-4 text-[#0288D1]" />
            <h4 className="text-[12px] font-bold text-[#0A2239]">
              Structural & Biophysical Observations
            </h4>
          </div>
          <ul className="space-y-1.5">
            {result.keyObservations.map((obs, idx) => (
              <li key={idx} className="flex items-start gap-2 text-[12px] text-[#43607E]">
                <span className="text-[#0288D1] font-bold">•</span>
                <span>{obs}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* 8. Environmental Hazards & Anomalies */}
        <div className="mb-4">
          <div className="flex items-center gap-1.5 mb-2">
            <AlertTriangle className="w-4 h-4 text-[#D32F2F]" />
            <h4 className="text-[12px] font-bold text-[#0A2239]">
              Environmental Hazards & Anomalies
            </h4>
          </div>
          <ul className="space-y-1.5">
            {result.environmentalRisks.map((risk, idx) => (
              <li key={idx} className="flex items-start gap-2 text-[12px] text-[#43607E]">
                <span className="text-[#D32F2F] font-bold">▲</span>
                <span>{risk}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* 9. Field Protocol & Monitoring Next Steps */}
        <div className="mb-5">
          <div className="flex items-center gap-1.5 mb-2">
            <Lightbulb className="w-4 h-4 text-[#E65100]" />
            <h4 className="text-[12px] font-bold text-[#0A2239]">
              Field Protocol & Monitoring Next Steps
            </h4>
          </div>
          <ul className="space-y-1.5">
            {result.analystRecommendations.map((rec, idx) => (
              <li key={idx} className="flex items-start gap-2 text-[12px] text-[#43607E]">
                <span className="text-[#E65100] font-bold">→</span>
                <span>{rec}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* 10. Interactive Follow-up Toggle */}
        <button
          onClick={() => setShowChatSection(!showChatSection)}
          data-testid="toggle_followup_chat_button"
          className="w-full py-2.5 rounded-xl border border-[#0288D1]/60 hover:border-[#0288D1] bg-[#F0F7FF] text-[#0288D1] text-[12px] font-bold flex items-center justify-center gap-2 transition-all cursor-pointer"
        >
          <MessageSquare className="w-4 h-4" />
          <span>{showChatSection ? 'Hide Spectral Inquiry Console' : 'Launch Target Feature Inquiry'}</span>
        </button>

        {/* Follow-up Inquiry Accordion */}
        {showChatSection && (
          <div className="mt-4 pt-4 border-t border-[#D0E4F8]">
            <h4 className="text-[13px] font-bold text-[#0288D1] mb-0.5">
              Spectral Telemetry Inquiry
            </h4>
            <p className="text-[11px] text-[#708FAE] mb-3">
              Query localized spectral boundaries, canopy density, or hydrological flow in this orthophoto
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
                      className={`max-w-[85%] rounded-2xl px-3.5 py-2 text-[12px] leading-relaxed shadow-2xs ${
                        isUser
                          ? 'bg-[#0288D1] text-white rounded-br-xs'
                          : 'bg-[#F0F7FF] border border-[#D0E4F8] text-[#0A2239] rounded-bl-xs'
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                );
              })}

              {isFollowUpLoading && (
                <div className="flex justify-start">
                  <div className="bg-[#F0F7FF] border border-[#D0E4F8] rounded-2xl rounded-bl-xs px-3.5 py-2 flex items-center gap-2 text-[12px] text-[#0288D1]">
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Analyzing pixel spectral response...</span>
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
                className="flex-1 h-10 px-3 rounded-xl bg-white border border-[#D0E4F8] focus:border-[#0288D1] outline-none text-[12px] text-[#0A2239]"
              />
              <button
                type="submit"
                disabled={!followUpInput.trim() || isFollowUpLoading}
                className="h-10 px-4 bg-[#0288D1] hover:bg-[#0277BD] disabled:bg-[#0288D1]/40 text-white rounded-xl flex items-center justify-center gap-1.5 text-[12px] font-bold transition-colors cursor-pointer disabled:cursor-not-allowed"
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

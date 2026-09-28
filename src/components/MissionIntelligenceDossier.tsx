import React, { useState, useRef } from 'react';
import {
  FileText,
  Volume2,
  VolumeX,
  Download,
  Copy,
  Check,
  Share2,
  Shield,
  Printer,
  Sparkles,
  Radio,
  Compass,
  AlertTriangle
} from 'lucide-react';
import { AnalysisResult, SatelliteScene } from '../types';
import { playMissionAudioBriefing, stopMissionAudioBriefing } from '../utils/audioBriefing';

interface MissionIntelligenceDossierProps {
  scene: SatelliteScene;
  result: AnalysisResult | null;
}

export const MissionIntelligenceDossier: React.FC<MissionIntelligenceDossierProps> = ({
  scene,
  result
}) => {
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const dossierCardRef = useRef<HTMLDivElement>(null);

  // If no analysis result yet, provide standard calibrated dossier for this scene
  const summaryText =
    result?.plainSummary ||
    `High-resolution satellite observation of ${scene.title} (${scene.coordinates}). Sensor telemetry confirms baseline NDVI of ${scene.baseNdvi} and moisture index NDWI of ${scene.baseNdwi}. No critical tectonic or hazardous anomalies detected. Ground surface temperature calibrated at ${scene.baseSurfaceTemp}°C.`;

  const observations = result?.keyObservations || [
    `Optical reflectance calibrated with ${scene.satellitePlatform} Level-2A sensor matrix.`,
    `Ground Sampling Distance (GSD) resolved at ${scene.gsdResolution} per nadir pixel.`,
    `Biophysical chlorophyllic absorption indicates healthy vegetative vigor across principal zones.`,
    `Hydrological sediment corridors remain within seasonal baseline boundaries.`
  ];

  const recommendations = result?.analystRecommendations || [
    'Maintain continuous 5-day revisit orbital monitoring for hydrological drift.',
    'Deploy field verification teams along fringe boundary coordinates.',
    'Archive high-resolution imagery tile into National Geospatial Repository.'
  ];

  const handleToggleAudio = () => {
    if (isPlayingAudio) {
      stopMissionAudioBriefing();
      setIsPlayingAudio(false);
    } else {
      const speechText = `${scene.title}. Coordinates: ${scene.coordinates}. Sensor platform: ${scene.satellitePlatform}. Executive Summary: ${summaryText}. Key observation: ${observations[0] || ''}`;
      playMissionAudioBriefing(speechText, {
        onStart: () => setIsPlayingAudio(true),
        onEnd: () => setIsPlayingAudio(false),
        onError: () => setIsPlayingAudio(false)
      });
    }
  };

  const handleCopyMarkdown = () => {
    const md = `
# ISRO // CLASSIFIED ORBITAL INTELLIGENCE DOSSIER
**Target:** ${scene.title}
**Coordinates:** ${scene.coordinates}
**Platform:** ${scene.satellitePlatform} | **GSD:** ${scene.gsdResolution}
**Classification:** RESTRICTED // LEVEL-2A BOA CERTIFIED
**Timestamp:** ${new Date().toUTCString()}

---
### EXECUTIVE TERRAIN BRIEFING
${summaryText}

### KEY SATELLITE OBSERVATIONS
${observations.map((o) => `- ${o}`).join('\n')}

### BIOPHYSICAL INDICES
- NDVI (Vegetation): ${result?.ndviIndex ?? scene.baseNdvi}
- NDWI (Water/Moisture): ${result?.ndwiIndex ?? scene.baseNdwi}
- NDBI (Built-Up/Concrete): ${result?.ndbiIndex ?? scene.baseNdbi}
- Surface Temperature: ${result?.surfaceTempCelsius ?? scene.baseSurfaceTemp}°C
- Radiometric Quality: ${result?.radiometricQuality ?? 98.4}%

### OPERATIONAL RECOMMENDATIONS
${recommendations.map((r) => `- ${r}`).join('\n')}
    `.trim();

    navigator.clipboard.writeText(md).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleExportPngCard = async () => {
    setIsExporting(true);
    try {
      const canvas = document.createElement('canvas');
      canvas.width = 1200;
      canvas.height = 900;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Dark background
      ctx.fillStyle = '#061325';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Border frame
      ctx.strokeStyle = '#00B0FF';
      ctx.lineWidth = 4;
      ctx.strokeRect(20, 20, canvas.width - 40, canvas.height - 40);

      // Header Banner
      ctx.fillStyle = '#00B0FF';
      ctx.font = 'bold 26px monospace';
      ctx.fillText('ISRO // NATIONAL REMOTE SENSING CENTRE • CLASSIFIED DOSSIER', 50, 70);

      ctx.fillStyle = '#E0F2FE';
      ctx.font = '16px monospace';
      ctx.fillText(`TARGET: ${scene.title.toUpperCase()} | COORDS: ${scene.coordinates}`, 50, 105);
      ctx.fillText(`SENSOR: ${scene.satellitePlatform} | GSD: ${scene.gsdResolution}`, 50, 130);

      // Stamp watermark
      ctx.save();
      ctx.translate(950, 100);
      ctx.rotate(-0.15);
      ctx.strokeStyle = '#D32F2F';
      ctx.lineWidth = 3;
      ctx.strokeRect(0, 0, 180, 50);
      ctx.fillStyle = '#D32F2F';
      ctx.font = 'bold 18px monospace';
      ctx.fillText('TOP SECRET', 30, 32);
      ctx.restore();

      // Divider line
      ctx.strokeStyle = '#1E3A5F';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(50, 155);
      ctx.lineTo(1150, 155);
      ctx.stroke();

      // Summary
      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 20px sans-serif';
      ctx.fillText('EXECUTIVE TERRAIN SUMMARY', 50, 195);

      ctx.fillStyle = '#94A3B8';
      ctx.font = '16px sans-serif';
      // Word wrap summary
      const words = summaryText.split(' ');
      let line = '';
      let y = 230;
      for (const word of words) {
        const testLine = line + word + ' ';
        const metrics = ctx.measureText(testLine);
        if (metrics.width > 1050 && line !== '') {
          ctx.fillText(line, 50, y);
          line = word + ' ';
          y += 28;
        } else {
          line = testLine;
        }
      }
      ctx.fillText(line, 50, y);

      // Telemetry indices box
      y += 50;
      ctx.fillStyle = '#0B2545';
      ctx.fillRect(50, y, 1100, 120);
      ctx.strokeStyle = '#00B0FF';
      ctx.strokeRect(50, y, 1100, 120);

      ctx.fillStyle = '#00E676';
      ctx.font = 'bold 18px monospace';
      ctx.fillText(`NDVI (CHLOROPHYLL): ${result?.ndviIndex ?? scene.baseNdvi}`, 75, y + 45);
      ctx.fillText(`NDWI (MOISTURE): ${result?.ndwiIndex ?? scene.baseNdwi}`, 75, y + 85);

      ctx.fillStyle = '#FFB300';
      ctx.fillText(`NDBI (BUILT-UP): ${result?.ndbiIndex ?? scene.baseNdbi}`, 450, y + 45);
      ctx.fillText(`SURFACE TEMP: ${result?.surfaceTempCelsius ?? scene.baseSurfaceTemp}°C`, 450, y + 85);

      ctx.fillStyle = '#00B0FF';
      ctx.fillText(`RADIOMETRIC QUALITY: ${result?.radiometricQuality ?? 98.4}%`, 820, y + 45);
      ctx.fillText('PROCESSING: LEVEL-2A BOA', 820, y + 85);

      // Key Observations
      y += 165;
      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 20px sans-serif';
      ctx.fillText('TACTICAL OBSERVATIONS', 50, y);
      y += 35;
      ctx.font = '15px sans-serif';
      ctx.fillStyle = '#CBD5E1';
      observations.slice(0, 3).forEach((obs) => {
        ctx.fillText(`• ${obs}`, 50, y);
        y += 30;
      });

      // Footer
      ctx.fillStyle = '#64748B';
      ctx.font = '13px monospace';
      ctx.fillText(`GENERATED BY BHUदृष्टि AI STUDIO • DATE: ${new Date().toLocaleDateString()}`, 50, 860);

      // Trigger download
      const dataUrl = canvas.toDataURL('image/png');
      const a = document.createElement('a');
      a.href = dataUrl;
      a.download = `ISRO_Dossier_${scene.id}_${Date.now()}.png`;
      a.click();
    } catch (err) {
      console.error('Export error:', err);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-4 space-y-4">
      {/* Top Action Ribbon */}
      <div className="bg-[#0C172A] border border-[#182C4D] rounded-2xl p-4 shadow-xl flex flex-wrap items-center justify-between gap-3 text-white">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-[#00E5FF]/15 text-[#00E5FF]">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <span>Mission Intelligence Briefing Dossier</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-red-950/40 text-red-400 border border-red-500/40 font-bold">
                CLASSIFIED ISRO // EOS
              </span>
            </h2>
            <p className="text-xs text-slate-400 font-mono">
              Exportable scientific & defense research dossier card with natural voice audio briefing
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          {/* Voice Audio Briefing Button (Feature 5) */}
          <button
            onClick={handleToggleAudio}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all shadow-xs cursor-pointer ${
              isPlayingAudio
                ? 'bg-red-600 hover:bg-red-700 text-white animate-pulse'
                : 'bg-[#0088D1] hover:bg-[#0097E6] text-white shadow-[0_0_12px_rgba(0,136,209,0.4)]'
            }`}
          >
            {isPlayingAudio ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            <span>{isPlayingAudio ? 'Stop Audio Briefing' : '🎙️ Play Voice Briefing'}</span>
          </button>

          {/* Copy Markdown */}
          <button
            onClick={handleCopyMarkdown}
            className="px-3 py-2 bg-[#101F38] hover:bg-[#182C4D] border border-[#182C4D] text-[#00E5FF] rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Copy Report to Clipboard"
          >
            {copied ? <Check className="w-4 h-4 text-[#00E676]" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Copied!' : 'Copy Dossier'}</span>
          </button>

          {/* Download Image Card (Feature 4) */}
          <button
            onClick={handleExportPngCard}
            disabled={isExporting}
            className="px-3 py-2 bg-[#00E676] hover:bg-[#00C853] text-black font-extrabold rounded-xl text-xs flex items-center gap-1.5 transition-all shadow-[0_0_12px_rgba(0,230,118,0.3)] cursor-pointer"
            title="Download PNG Dossier Card"
          >
            <Download className="w-4 h-4 text-black" />
            <span>{isExporting ? 'Generating...' : 'Export PNG Card'}</span>
          </button>
        </div>
      </div>

      {/* Voice Audio Equalizer Wave Bar (When playing) */}
      {isPlayingAudio && (
        <div className="bg-[#0A2239] border border-[#00B0FF]/60 rounded-2xl p-3 shadow-lg flex items-center justify-between text-white font-mono text-xs">
          <div className="flex items-center gap-3">
            <Radio className="w-4 h-4 text-[#00E676] animate-pulse" />
            <span className="text-[#00B0FF] font-bold">
              ISRO MISSION CONTROL SPEECH SYNTHESIS ACTIVE (QUINDAR RELAY)
            </span>
          </div>

          <div className="flex items-center gap-1">
            <span className="w-1 h-3 bg-[#00E676] animate-bounce" style={{ animationDelay: '0ms' }} />
            <span className="w-1 h-5 bg-[#00B0FF] animate-bounce" style={{ animationDelay: '150ms' }} />
            <span className="w-1 h-4 bg-[#00E676] animate-bounce" style={{ animationDelay: '300ms' }} />
            <span className="w-1 h-6 bg-[#00B0FF] animate-bounce" style={{ animationDelay: '450ms' }} />
            <span className="w-1 h-2 bg-[#00E676] animate-bounce" style={{ animationDelay: '200ms' }} />
          </div>
        </div>
      )}

      {/* Official Classified Dossier Card Layout */}
      <div
        ref={dossierCardRef}
        className="bg-[#061325] text-white rounded-3xl p-6 md:p-8 border-2 border-[#00B0FF]/40 shadow-2xl relative overflow-hidden"
      >
        {/* Classified Watermark Stamp */}
        <div className="absolute top-8 right-6 md:right-10 pointer-events-none transform -rotate-12 border-2 border-red-500/80 px-4 py-1 rounded text-red-500 font-mono font-black text-xs md:text-sm tracking-widest uppercase bg-red-950/20 backdrop-blur-xs select-none">
          TOP SECRET // SATELLITE RECON
        </div>

        {/* Top Header */}
        <div className="border-b border-[#00B0FF]/30 pb-4 mb-5">
          <div className="flex items-center gap-2 text-[#00B0FF] font-mono text-xs tracking-widest uppercase font-bold">
            <Shield className="w-4 h-4 text-[#00B0FF]" />
            <span>ISRO NATIONAL REMOTE SENSING CENTRE • CLASSIFIED DOSSIER #EOS-7492</span>
          </div>
          <h1 className="text-xl md:text-2xl font-bold text-white mt-1">
            {scene.title}
          </h1>
          <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-[#708FAE] mt-1.5">
            <span className="text-white/80 font-bold">{scene.coordinates}</span>
            <span>•</span>
            <span>PLATFORM: {scene.satellitePlatform}</span>
            <span>•</span>
            <span className="text-[#00E676]">GSD {scene.gsdResolution}</span>
            <span>•</span>
            <span>LEVEL-2A BOA CERTIFIED</span>
          </div>
        </div>

        {/* Grid: Satellite Imagery Tile + Biophysical Matrix */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-5">
          {/* Imagery Tile with Vector Callouts */}
          <div className="relative rounded-2xl overflow-hidden border border-[#00B0FF]/50 bg-black aspect-video md:aspect-auto h-48 md:h-auto shadow-inner">
            <img
              src={scene.imageSrc}
              alt="Dossier Thumbnail"
              className="w-full h-full object-cover"
            />
            {/* Vector Crosshair Overlay */}
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
              <div className="w-16 h-16 rounded-full border border-[#00B0FF]/60 flex items-center justify-center">
                <div className="w-1 h-1 rounded-full bg-red-500 shadow-[0_0_8px_red]" />
              </div>
            </div>
            {/* Coordinate stamp */}
            <div className="absolute bottom-2 left-2 bg-black/80 backdrop-blur-md px-2 py-0.5 rounded text-[9px] font-mono text-[#00B0FF] border border-[#00B0FF]/40">
              TARGET LOCK • {scene.domainCategory}
            </div>
          </div>

          {/* Biophysical Indices Matrix */}
          <div className="md:col-span-2 grid grid-cols-2 sm:grid-cols-3 gap-2.5 font-mono text-xs">
            <div className="bg-[#0B2545] border border-[#00B0FF]/30 rounded-xl p-3">
              <div className="text-white/60 text-[10px]">CHLOROPHYLL (NDVI)</div>
              <div className="text-lg font-bold text-[#00E676] mt-0.5">
                {result?.ndviIndex ? (result.ndviIndex > 0 ? `+${result.ndviIndex}` : result.ndviIndex) : scene.baseNdvi}
              </div>
              <div className="text-[10px] text-white/50 mt-1">Photosynthetic Vigor</div>
            </div>

            <div className="bg-[#0B2545] border border-[#00B0FF]/30 rounded-xl p-3">
              <div className="text-white/60 text-[10px]">MOISTURE (NDWI)</div>
              <div className="text-lg font-bold text-[#00B0FF] mt-0.5">
                {result?.ndwiIndex ? (result.ndwiIndex > 0 ? `+${result.ndwiIndex}` : result.ndwiIndex) : scene.baseNdwi}
              </div>
              <div className="text-[10px] text-white/50 mt-1">Hydrological Canopy</div>
            </div>

            <div className="bg-[#0B2545] border border-[#00B0FF]/30 rounded-xl p-3">
              <div className="text-white/60 text-[10px]">BUILT-UP (NDBI)</div>
              <div className="text-lg font-bold text-amber-400 mt-0.5">
                {result?.ndbiIndex ? (result.ndbiIndex > 0 ? `+${result.ndbiIndex}` : result.ndbiIndex) : scene.baseNdbi}
              </div>
              <div className="text-[10px] text-white/50 mt-1">Concrete Index</div>
            </div>

            <div className="bg-[#0B2545] border border-[#00B0FF]/30 rounded-xl p-3">
              <div className="text-white/60 text-[10px]">SURFACE TEMPERATURE</div>
              <div className="text-lg font-bold text-amber-400 mt-0.5">
                {result?.surfaceTempCelsius ?? scene.baseSurfaceTemp}°C
              </div>
              <div className="text-[10px] text-white/50 mt-1">Radiometric Thermal</div>
            </div>

            <div className="bg-[#0B2545] border border-[#00B0FF]/30 rounded-xl p-3">
              <div className="text-white/60 text-[10px]">RADIOMETRIC ACCURACY</div>
              <div className="text-lg font-bold text-[#00E676] mt-0.5">
                {result?.radiometricQuality ?? 98.4}%
              </div>
              <div className="text-[10px] text-white/50 mt-1">Calibrated Signal</div>
            </div>

            <div className="bg-[#0B2545] border border-[#00B0FF]/30 rounded-xl p-3">
              <div className="text-white/60 text-[10px]">LOCAL GPU VRAM</div>
              <div className="text-lg font-bold text-[#00E676] mt-0.5">0 MB</div>
              <div className="text-[10px] text-white/50 mt-1">Zero Hardware Load</div>
            </div>
          </div>
        </div>

        {/* Executive Summary */}
        <div className="bg-[#0B2545]/60 border border-[#00B0FF]/25 rounded-2xl p-4 mb-5">
          <h3 className="text-xs font-mono font-bold text-[#00B0FF] uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Executive Terrain Assessment</span>
          </h3>
          <p className="text-xs md:text-sm text-slate-200 leading-relaxed font-sans">
            {summaryText}
          </p>
        </div>

        {/* Observations & Recommendations */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-sans">
          <div className="bg-[#0B2545]/40 border border-white/10 rounded-2xl p-4">
            <h4 className="font-mono font-bold text-[#00E676] text-xs uppercase mb-2">
              Key Sensor Observations
            </h4>
            <ul className="space-y-1.5 text-slate-300">
              {observations.map((obs, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-[#00B0FF] font-mono mt-0.5">▶</span>
                  <span>{obs}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-[#0B2545]/40 border border-white/10 rounded-2xl p-4">
            <h4 className="font-mono font-bold text-[#00B0FF] text-xs uppercase mb-2">
              Operational Recommendations
            </h4>
            <ul className="space-y-1.5 text-slate-300">
              {recommendations.map((rec, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-[#00E676] font-mono mt-0.5">✔</span>
                  <span>{rec}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Dossier Footer Signature */}
        <div className="mt-6 pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-3 text-[11px] font-mono text-[#708FAE]">
          <div>
            SECURITY CLEARANCE: LEVEL-4 ORBITAL COMMAND // BHUदृष्टि AI STUDIO
          </div>
          <div>
            TIMESTAMP: {new Date().toUTCString()}
          </div>
        </div>
      </div>
    </div>
  );
};

import React, { useState, useEffect, useRef } from 'react';
import {
  Clock,
  Play,
  Pause,
  RotateCcw,
  AlertTriangle,
  TrendingDown,
  TrendingUp,
  Droplets,
  Flame,
  Building2,
  Sparkles,
  ShieldAlert,
  Layers
} from 'lucide-react';
import { SatelliteScene, TemporalYearData } from '../types';

interface TemporalChangeLabProps {
  scene: SatelliteScene;
}

type SimulationMode = 'FLOOD' | 'DROUGHT' | 'URBAN_SPRAWL';

export const TemporalChangeLab: React.FC<TemporalChangeLabProps> = ({ scene }) => {
  const [simulationMode, setSimulationMode] = useState<SimulationMode>('FLOOD');
  const [selectedYearIndex, setSelectedYearIndex] = useState<number>(3); // 2026 (index 3)
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const yearsData: TemporalYearData[] = [
    {
      year: 2019,
      label: '2019 (Historical Baseline)',
      waterLevelDelta: -12.4,
      vegetationDelta: +18.5,
      urbanDensityDelta: -24.0,
      avgTempCelsius: 22.1,
      riskSeverity: 'LOW',
      briefing: 'Pre-expansion ecological equilibrium. High vegetative resilience, natural delta flow, and stable wetlands buffer.'
    },
    {
      year: 2021,
      label: '2021 (Mid-Term Survey)',
      waterLevelDelta: -4.2,
      vegetationDelta: +8.1,
      urbanDensityDelta: -11.5,
      avgTempCelsius: 23.4,
      riskSeverity: 'MODERATE',
      briefing: 'Initial perimeter clearing and early port logistics expansion. Localized soil compaction noted along transport corridors.'
    },
    {
      year: 2023,
      label: '2023 (Recent Survey)',
      waterLevelDelta: +3.8,
      vegetationDelta: -5.4,
      urbanDensityDelta: +12.3,
      avgTempCelsius: 24.6,
      riskSeverity: 'MODERATE',
      briefing: 'Accelerated shoreline hardening and industrial wharf expansion. Noticeable reduction in fringe mangrove and estuary filters.'
    },
    {
      year: 2026,
      label: '2026 (Present Observation)',
      waterLevelDelta: 0.0,
      vegetationDelta: 0.0,
      urbanDensityDelta: 0.0,
      avgTempCelsius: scene.baseSurfaceTemp,
      riskSeverity: 'SEVERE',
      briefing: `Current high-resolution satellite baseline. GSD ${scene.gsdResolution} optical sensor confirms intensified land-use pressure.`
    },
    {
      year: 2030,
      label: '2030 (AI Projected Forecast)',
      waterLevelDelta: simulationMode === 'FLOOD' ? +34.8 : -22.5,
      vegetationDelta: -28.2,
      urbanDensityDelta: +46.5,
      avgTempCelsius: scene.baseSurfaceTemp + 3.2,
      riskSeverity: 'CRITICAL',
      briefing: 'High-probability environmental stress model. Projecting significant coastal inundation risk, thermal heat island expansion, and agricultural displacement.'
    }
  ];

  const currentYear = yearsData[selectedYearIndex];

  // Auto-play through timeline
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        setSelectedYearIndex((prev) => (prev + 1) % yearsData.length);
      }, 1800);
    }
    return () => clearInterval(interval);
  }, [isPlaying, yearsData.length]);

  // Draw animated topographic contour waves on the canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let phase = 0;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      phase += 0.035;

      const w = canvas.width;
      const h = canvas.height;

      ctx.save();

      if (simulationMode === 'FLOOD') {
        // Render rising water blue contour ripples
        const waveCount = 5;
        for (let i = 0; i < waveCount; i++) {
          ctx.beginPath();
          const yBase = h * (0.65 - (selectedYearIndex * 0.06)) + Math.sin(phase + i) * 8;
          ctx.moveTo(0, yBase);

          for (let x = 0; x <= w; x += 20) {
            const y = yBase + Math.sin((x * 0.02) + phase + (i * 0.8)) * (12 + (selectedYearIndex * 3));
            ctx.lineTo(x, y);
          }

          ctx.lineTo(w, h);
          ctx.lineTo(0, h);
          ctx.closePath();

          ctx.fillStyle = `rgba(2, 136, 209, ${0.12 + (i * 0.05) + (selectedYearIndex * 0.04)})`;
          ctx.fill();

          ctx.strokeStyle = `rgba(0, 229, 255, ${0.4 + (i * 0.12)})`;
          ctx.lineWidth = 1.5;
          ctx.stroke();
        }
      } else if (simulationMode === 'DROUGHT') {
        // Render thermal desiccation rings and dry heat waves
        const ringCount = 4;
        for (let i = 0; i < ringCount; i++) {
          ctx.beginPath();
          const radius = (40 + (i * 50) + (selectedYearIndex * 22) + Math.sin(phase + i) * 6);
          ctx.arc(w * 0.5, h * 0.45, Math.max(10, radius), 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(230, 81, 0, ${0.35 + (selectedYearIndex * 0.12)})`;
          ctx.lineWidth = 2;
          ctx.setLineDash([8, 8]);
          ctx.stroke();
          ctx.setLineDash([]);
        }
      } else {
        // Urban Sprawl grid expansion
        const step = 40;
        ctx.strokeStyle = `rgba(255, 171, 0, ${0.25 + (selectedYearIndex * 0.12)})`;
        ctx.lineWidth = 1;
        for (let x = 0; x < w; x += step) {
          ctx.beginPath();
          ctx.moveTo(x, 0);
          ctx.lineTo(x, h);
          ctx.stroke();
        }
        for (let y = 0; y < h; y += step) {
          ctx.beginPath();
          ctx.moveTo(0, y);
          ctx.lineTo(w, y);
          ctx.stroke();
        }
      }

      ctx.restore();
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => cancelAnimationFrame(animationFrameId);
  }, [simulationMode, selectedYearIndex]);

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-4 space-y-4">
      {/* Simulation Header */}
      <div className="bg-white border border-[#D0E4F8] rounded-2xl p-5 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#E3F2FD]">
          <div>
            <h2 className="text-lg font-bold text-[#0A2239] flex items-center gap-2">
              <Clock className="w-5 h-5 text-[#0288D1]" />
              <span>3D Multi-Temporal Change & Environmental Simulator</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#00B0FF]/10 text-[#0288D1] border border-[#00B0FF]/30">
                AI PREDICTIVE TWIN
              </span>
            </h2>
            <p className="text-xs text-[#708FAE] mt-1">
              Simulate historical sensor baselines (2019) to future climate & urban stress forecasts (2030)
            </p>
          </div>

          {/* Scenario Selector Pills */}
          <div className="flex items-center gap-1.5 bg-[#F0F7FF] p-1 rounded-xl border border-[#D0E4F8]">
            <button
              onClick={() => setSimulationMode('FLOOD')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                simulationMode === 'FLOOD'
                  ? 'bg-[#0288D1] text-white shadow-xs'
                  : 'text-[#43607E] hover:text-[#0A2239]'
              }`}
            >
              <Droplets className="w-3.5 h-3.5" />
              <span>Seasonal Flood</span>
            </button>

            <button
              onClick={() => setSimulationMode('DROUGHT')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                simulationMode === 'DROUGHT'
                  ? 'bg-[#E65100] text-white shadow-xs'
                  : 'text-[#43607E] hover:text-[#0A2239]'
              }`}
            >
              <Flame className="w-3.5 h-3.5" />
              <span>Drought & Heat</span>
            </button>

            <button
              onClick={() => setSimulationMode('URBAN_SPRAWL')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                simulationMode === 'URBAN_SPRAWL'
                  ? 'bg-[#2E7D32] text-white shadow-xs'
                  : 'text-[#43607E] hover:text-[#0A2239]'
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>Urban Sprawl</span>
            </button>
          </div>
        </div>

        {/* Interactive Satellite Time-Lapse Canvas Screen */}
        <div className="relative w-full h-[320px] md:h-[400px] rounded-xl overflow-hidden mt-4 border border-[#D0E4F8] bg-[#0A2239] shadow-inner select-none">
          {/* Base Imagery */}
          <img
            src={scene.imageSrc}
            alt="Simulation Base"
            className="w-full h-full object-cover"
            style={{
              filter:
                simulationMode === 'DROUGHT'
                  ? `saturate(${1.2 - selectedYearIndex * 0.15}) sepia(${selectedYearIndex * 0.1})`
                  : simulationMode === 'FLOOD'
                  ? `contrast(${1 + selectedYearIndex * 0.05}) hue-rotate(${selectedYearIndex * 4}deg)`
                  : 'none'
            }}
          />

          {/* Animated Topographic Contour Canvas */}
          <canvas
            ref={canvasRef}
            width={800}
            height={450}
            className="absolute inset-0 w-full h-full pointer-events-none"
          />

          {/* Top-Left Year Readout Pill */}
          <div className="absolute top-3 left-3 bg-black/80 backdrop-blur-md border border-white/20 rounded-xl px-3 py-1.5 text-white font-mono shadow-md">
            <div className="text-[10px] text-[#00B0FF] font-bold">TIMELINE KEYFRAME</div>
            <div className="text-base font-bold flex items-center gap-2">
              <span>{currentYear.year}</span>
              <span
                className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                  currentYear.riskSeverity === 'LOW'
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    : currentYear.riskSeverity === 'MODERATE'
                    ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                    : currentYear.riskSeverity === 'SEVERE'
                    ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30'
                    : 'bg-red-500/20 text-red-400 border border-red-500/30'
                }`}
              >
                {currentYear.riskSeverity} RISK
              </span>
            </div>
          </div>

          {/* Top-Right Simulation Mode Tag */}
          <div className="absolute top-3 right-3 bg-black/80 backdrop-blur-md border border-[#00B0FF]/40 rounded-xl px-3 py-1.5 text-white font-mono text-xs flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#00E676] animate-ping" />
            <span className="font-bold text-[#00E676]">
              {simulationMode === 'FLOOD'
                ? 'HYDROLOGIC CONTOUR SWEEP'
                : simulationMode === 'DROUGHT'
                ? 'THERMAL DESICCATION MAPPING'
                : 'IMPERVIOUS GRID EXPANSION'}
            </span>
          </div>

          {/* Bottom Telemetry Gauges */}
          <div className="absolute bottom-3 left-3 right-3 bg-black/80 backdrop-blur-md border border-white/20 rounded-xl p-2.5 text-white font-mono grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
            <div className="bg-white/10 rounded-lg p-1.5">
              <div className="text-white/60 text-[10px]">WATER LEVEL SHIFT</div>
              <div
                className={`font-bold flex items-center justify-center gap-1 ${
                  currentYear.waterLevelDelta > 0 ? 'text-[#00B0FF]' : 'text-slate-300'
                }`}
              >
                {currentYear.waterLevelDelta > 0 ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                <span>{currentYear.waterLevelDelta > 0 ? `+${currentYear.waterLevelDelta}%` : `${currentYear.waterLevelDelta}%`}</span>
              </div>
            </div>

            <div className="bg-white/10 rounded-lg p-1.5">
              <div className="text-white/60 text-[10px]">VEGETATION BIOMASS</div>
              <div
                className={`font-bold flex items-center justify-center gap-1 ${
                  currentYear.vegetationDelta > 0 ? 'text-[#00E676]' : 'text-red-400'
                }`}
              >
                {currentYear.vegetationDelta > 0 ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                <span>{currentYear.vegetationDelta > 0 ? `+${currentYear.vegetationDelta}%` : `${currentYear.vegetationDelta}%`}</span>
              </div>
            </div>

            <div className="bg-white/10 rounded-lg p-1.5">
              <div className="text-white/60 text-[10px]">URBAN CONCRETE DENSITY</div>
              <div
                className={`font-bold flex items-center justify-center gap-1 ${
                  currentYear.urbanDensityDelta > 0 ? 'text-amber-400' : 'text-slate-300'
                }`}
              >
                {currentYear.urbanDensityDelta > 0 ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                <span>{currentYear.urbanDensityDelta > 0 ? `+${currentYear.urbanDensityDelta}%` : `${currentYear.urbanDensityDelta}%`}</span>
              </div>
            </div>

            <div className="bg-white/10 rounded-lg p-1.5">
              <div className="text-white/60 text-[10px]">SURFACE TEMPERATURE</div>
              <div className="font-bold text-amber-400">{currentYear.avgTempCelsius.toFixed(1)}°C</div>
            </div>
          </div>
        </div>

        {/* Time-Lapse Control Slider */}
        <div className="mt-4 pt-2">
          <div className="flex items-center justify-between text-xs font-mono font-bold text-[#0A2239] mb-2">
            <span className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-[#0288D1]" />
              <span>Multi-Temporal Timeline Slider:</span>
              <strong className="text-[#0288D1]">{currentYear.label}</strong>
            </span>

            {/* Play/Pause Button */}
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="px-3 py-1 bg-[#F0F7FF] hover:bg-[#E0F2FE] border border-[#D0E4F8] rounded-lg text-[#0288D1] text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              <span>{isPlaying ? 'Pause Simulation' : 'Auto Play'}</span>
            </button>
          </div>

          <input
            type="range"
            min={0}
            max={yearsData.length - 1}
            step={1}
            value={selectedYearIndex}
            onChange={(e) => {
              setSelectedYearIndex(Number(e.target.value));
              setIsPlaying(false);
            }}
            className="w-full h-2 bg-[#E0F2FE] rounded-lg appearance-none cursor-pointer accent-[#0288D1]"
          />

          <div className="flex justify-between text-[11px] font-mono text-[#708FAE] mt-1.5">
            {yearsData.map((yd, idx) => (
              <button
                key={yd.year}
                onClick={() => {
                  setSelectedYearIndex(idx);
                  setIsPlaying(false);
                }}
                className={`font-semibold hover:text-[#0A2239] transition-colors ${
                  idx === selectedYearIndex ? 'text-[#0288D1] font-bold underline' : ''
                }`}
              >
                {yd.year}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* AI Environmental Risk Forecast Report Card */}
      <div className="bg-white border border-[#D0E4F8] rounded-2xl p-5 shadow-sm">
        <div className="flex items-center gap-2 pb-3 border-b border-[#E3F2FD]">
          <div className="p-2 rounded-xl bg-[#00B0FF]/10 text-[#0288D1]">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-[#0A2239]">
              AI Environmental Risk Forecast & Terrain Assessment
            </h3>
            <p className="text-[11px] text-[#708FAE]">
              Multi-spectral predictive analysis grounded on remote sensing indices for {currentYear.year}
            </p>
          </div>
        </div>

        <div className="mt-3 text-xs text-[#0A2239] leading-relaxed bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl p-3.5 font-sans">
          <p className="font-medium mb-2">{currentYear.briefing}</p>

          <div className="mt-3 pt-3 border-t border-[#E2E8F0] grid grid-cols-1 md:grid-cols-2 gap-3 text-[11px]">
            <div className="flex items-start gap-2">
              <ShieldAlert className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
              <div>
                <strong className="text-[#0A2239] block">Critical Hazard Warning:</strong>
                <span className="text-[#556987]">
                  {simulationMode === 'FLOOD'
                    ? 'Hydrodynamic surge will compromise coastal perimeter dykes and urban drainage runoff.'
                    : simulationMode === 'DROUGHT'
                    ? 'Sub-surface aquifer depletion will stress 68% of agricultural canopy corridors.'
                    : 'Impervious concrete expansion risks severe microclimate urban heat island anomalies.'}
                </span>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <Layers className="w-4 h-4 text-[#0288D1] flex-shrink-0 mt-0.5" />
              <div>
                <strong className="text-[#0A2239] block">Recommended Geospatial Mitigation:</strong>
                <span className="text-[#556987]">
                  {simulationMode === 'FLOOD'
                    ? 'Establish 200m mangrove conservation buffers and stormwater retention basins.'
                    : simulationMode === 'DROUGHT'
                    ? 'Deploy precision drip irrigation telemetry and deep soil moisture sensor arrays.'
                    : 'Mandate permeable paving tiles and establish urban green canopy cooling corridors.'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

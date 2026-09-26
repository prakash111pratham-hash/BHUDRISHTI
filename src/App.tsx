import React, { useState, useEffect } from 'react';
import {
  ActivePage,
  AnalysisRecord,
  AnalysisResult,
  ChatMessage,
  InspectorPoint,
  PRESET_SCENES,
  SatelliteScene,
  SpectralBandModeKey,
  SPECTRAL_MODES
} from './types';
import {
  clearAllSavedAnalyses,
  deleteSavedAnalysis,
  executeFollowUpQuestion,
  executeSceneAnalysis,
  fetchMapsGrounding,
  getSavedAnalyses,
  getStoredApiKey,
  saveAnalysisRecord,
  setStoredApiKey
} from './services/apiService';
import { Navbar } from './components/Navbar';
import { TelemetryBadgeRow } from './components/TelemetryBadgeRow';
import { SatelliteViewport } from './components/SatelliteViewport';
import { SplitLensViewer } from './components/SplitLensViewer';
import { SpectralModeSelector } from './components/SpectralModeSelector';
import { SceneSelectorRow } from './components/SceneSelectorRow';
import { QueryConsole } from './components/QueryConsole';
import { IdleExplanationCard } from './components/IdleExplanationCard';
import { AnalyzingStateCard, ErrorStateCard } from './components/AnalyzingStateCard';
import { AnalysisResultCard } from './components/AnalysisResultCard';
import { SavedAnalysesSheet } from './components/SavedAnalysesSheet';
import { ApiKeyDialog } from './components/ApiKeyDialog';
import { EarthScanCinematicOpening } from './components/EarthScanCinematicOpening';
import { TemporalChangeLab } from './components/TemporalChangeLab';
import { MissionIntelligenceDossier } from './components/MissionIntelligenceDossier';
import { OrbitalAssistantsAndRevisit } from './components/OrbitalAssistantsAndRevisit';

export function App() {
  const [activePage, setActivePage] = useState<ActivePage>('CONSOLE');
  const [scenes, setScenes] = useState<SatelliteScene[]>(PRESET_SCENES);
  const [currentScene, setCurrentScene] = useState<SatelliteScene>(PRESET_SCENES[0]);
  const [spectralMode, setSpectralMode] = useState<SpectralBandModeKey>('TRUE_COLOR');
  const [analysisStatus, setAnalysisStatus] = useState<'idle' | 'analyzing' | 'success' | 'error'>('idle');
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [userQuery, setUserQuery] = useState<string>('');
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [isFollowUpLoading, setIsFollowUpLoading] = useState<boolean>(false);
  const [isRadarScanActive, setIsRadarScanActive] = useState<boolean>(true);
  const [customApiKey, setCustomApiKey] = useState<string>(getStoredApiKey());
  const [savedAnalyses, setSavedAnalyses] = useState<AnalysisRecord[]>(getSavedAnalyses());
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isGroundingLoading, setIsGroundingLoading] = useState<boolean>(false);
  const [showCinematicOpening, setShowCinematicOpening] = useState<boolean>(true);
  const [showHistorySheet, setShowHistorySheet] = useState<boolean>(false);
  const [showApiKeyDialog, setShowApiKeyDialog] = useState<boolean>(false);
  const [showSplitLens, setShowSplitLens] = useState<boolean>(false);

  // Auto-dismiss toast after 3 seconds
  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => setToastMessage(null), 3500);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  const handleSelectScene = (scene: SatelliteScene) => {
    setCurrentScene(scene);
    setAnalysisStatus('idle');
    setAnalysisResult(null);
    setChatMessages([]);
    setUserQuery('');
  };

  const handleSaveApiKey = (key: string) => {
    setCustomApiKey(key);
    setStoredApiKey(key);
    setToastMessage('Gemini API Key saved');
  };

  const handleCustomImageSelected = (dataUrl: string, name: string) => {
    const customScene: SatelliteScene = {
      id: `custom_${Date.now()}`,
      title: name.replace(/\.[^/.]+$/, '') || 'User Imported Imagery',
      subtitle: 'Custom user satellite / aerial high-resolution scene',
      imageSrc: dataUrl,
      isCustom: true,
      coordinates: '20°35\'12"N, 78°57\'45"E (Imported Grid)',
      gsdResolution: '0.3 m/px High-Res',
      satellitePlatform: 'Custom Optical Aerial/Satellite Sensor',
      defaultQuerySuggestions: [
        'Explain what is visible in this image in simple language',
        'Identify water bodies, vegetation, and built structures',
        'Estimate land cover distribution and density',
        'Detect any notable features, roads, or anomalies'
      ],
      domainCategory: 'Custom Geospatial Survey',
      geographicLocation: 'User Defined Coordinates',
      googleMapsUrl: 'https://www.google.com/maps',
      baseNdvi: 0.65,
      baseNdwi: 0.35,
      baseNdbi: 0.18,
      baseSurfaceTemp: 24.5
    };

    setScenes((prev) => [customScene, ...prev]);
    setCurrentScene(customScene);
    setAnalysisStatus('idle');
    setAnalysisResult(null);
    setToastMessage(`Imported "${customScene.title}". Ready for AI inspection.`);
  };

  const handleRunAnalysis = async (queryToRun?: string) => {
    const prompt = (queryToRun || userQuery).trim();
    if (!prompt) {
      setToastMessage('Please enter an observation query');
      return;
    }

    setAnalysisStatus('analyzing');
    setErrorMessage('');
    setChatMessages([]);

    try {
      const result = await executeSceneAnalysis(
        currentScene,
        prompt,
        spectralMode,
        customApiKey
      );
      setAnalysisResult(result);
      setAnalysisStatus('success');

      // Auto-save analysis
      const updatedRecords = saveAnalysisRecord(
        currentScene,
        prompt,
        result,
        SPECTRAL_MODES[spectralMode].label
      );
      setSavedAnalyses(updatedRecords);
    } catch (err: unknown) {
      console.error('Analysis error:', err);
      const msg = err instanceof Error ? err.message : 'Analysis failed. Please check connection.';
      setErrorMessage(msg);
      setAnalysisStatus('error');
    }
  };

  // Trigger analysis for a tapped point
  const handleAskAboutPoint = (point: InspectorPoint, query: string) => {
    setUserQuery(query);
    setActivePage('CONSOLE');
    handleRunAnalysis(query);
  };

  const handleFetchGrounding = async () => {
    if (!analysisResult) return;
    setIsGroundingLoading(true);
    try {
      const uri = await fetchMapsGrounding(
        currentScene,
        customApiKey
      );
      setAnalysisResult((prev) =>
        prev
          ? {
              ...prev,
              googleMapsLocationUri: uri,
              googleMapsGroundingSummary: `Verified coordinates against Google Maps Platform database: ${currentScene.geographicLocation}.`
            }
          : null
      );
      setToastMessage('Google Maps coordinate grounding verified.');
    } catch {
      setToastMessage('Unable to fetch live grounding link.');
    } finally {
      setIsGroundingLoading(false);
    }
  };

  const handleSendFollowUp = async (question: string) => {
    if (!analysisResult) return;
    const userMsg: ChatMessage = {
      id: `usr_${Date.now()}`,
      sender: 'USER',
      text: question,
      timestamp: Date.now()
    };
    setChatMessages((prev) => [...prev, userMsg]);
    setIsFollowUpLoading(true);

    try {
      const conversationHistory = chatMessages
        .map((m) => `${m.sender}: ${m.text}`)
        .join('\n');
      const answer = await executeFollowUpQuestion(
        currentScene,
        conversationHistory,
        question,
        customApiKey
      );
      const aiMsg: ChatMessage = {
        id: `ai_${Date.now()}`,
        sender: 'REMOTE_SENSING_AI',
        text: answer,
        timestamp: Date.now()
      };
      setChatMessages((prev) => [...prev, aiMsg]);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Inference error';
      const errorMsg: ChatMessage = {
        id: `err_${Date.now()}`,
        sender: 'REMOTE_SENSING_AI',
        text: `Unable to process follow-up: ${msg}`,
        timestamp: Date.now()
      };
      setChatMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsFollowUpLoading(false);
    }
  };

  const handleSaveReport = () => {
    if (!analysisResult) return;
    const updated = saveAnalysisRecord(
      currentScene,
      analysisResult.query,
      analysisResult,
      SPECTRAL_MODES[spectralMode].label
    );
    setSavedAnalyses(updated);
    setToastMessage('Analysis report saved to local records.');
  };

  const handleDeleteSaved = (id: number) => {
    const updated = deleteSavedAnalysis(id);
    setSavedAnalyses(updated);
  };

  const handleClearAllHistory = () => {
    const updated = clearAllSavedAnalyses();
    setSavedAnalyses(updated);
    setToastMessage('All saved records cleared.');
  };

  return (
    <div className="min-h-screen bg-[#F0F7FF] text-[#0A2239] pb-12 flex flex-col font-sans">
      {/* Navigation Top Bar with Operations Hammer */}
      <Navbar
        activePage={activePage}
        onSelectPage={(p) => setActivePage(p)}
        savedCount={savedAnalyses.length}
        hasCustomKey={Boolean(customApiKey)}
        onOpenCinematic={() => setShowCinematicOpening(true)}
        onOpenApiKey={() => setShowApiKeyDialog(true)}
        onOpenHistory={() => setShowHistorySheet(true)}
      />

      <main className="flex-1 w-full flex flex-col items-center">
        {/* PAGE 1: MISSION CONSOLE */}
        {activePage === 'CONSOLE' && (
          <div className="w-full flex flex-col items-center">
            {/* Live Telemetry Badges */}
            <TelemetryBadgeRow
              gsdResolution={currentScene.gsdResolution}
              spectralModeLabel={SPECTRAL_MODES[spectralMode].label}
            />

            {/* Split-Lens Toggle Ribbon */}
            <div className="w-full max-w-5xl mx-auto px-4 pt-1 flex items-center justify-between text-xs">
              <span className="text-[#708FAE] font-mono font-medium">
                SATELLITE WORKSTATION // {currentScene.satellitePlatform}
              </span>

              <button
                onClick={() => setShowSplitLens(!showSplitLens)}
                className={`px-3 py-1 rounded-xl border text-xs font-bold transition-all shadow-2xs cursor-pointer ${
                  showSplitLens
                    ? 'bg-[#0288D1] text-white border-[#0288D1]'
                    : 'bg-white text-[#0288D1] border-[#D0E4F8] hover:bg-[#F0F7FF]'
                }`}
              >
                {showSplitLens ? 'Show Standard Viewport' : '🛰️ Open Split-Lens Spectral Slider'}
              </button>
            </div>

            {/* Standard Viewport or Split-Lens Slider */}
            {!showSplitLens ? (
              <SatelliteViewport
                scene={currentScene}
                spectralMode={spectralMode}
                isRadarScanActive={isRadarScanActive}
                onToggleRadarScan={() => setIsRadarScanActive((prev) => !prev)}
                onAskAboutPoint={handleAskAboutPoint}
              />
            ) : (
              <div className="w-full max-w-5xl mx-auto px-4 py-2">
                <SplitLensViewer scene={currentScene} />
              </div>
            )}

            {/* Spectral Band Simulation Selector */}
            <SpectralModeSelector
              selectedMode={spectralMode}
              onModeSelected={(mode) => setSpectralMode(mode)}
            />

            {/* Target Scene Selector Row */}
            <SceneSelectorRow
              scenes={scenes}
              selectedScene={currentScene}
              onSceneSelected={handleSelectScene}
              onCustomImageSelected={handleCustomImageSelected}
            />

            {/* AI Remote Sensing Query Console */}
            <QueryConsole
              userQuery={userQuery}
              onQueryChange={(q) => setUserQuery(q)}
              suggestions={currentScene.defaultQuerySuggestions}
              isAnalyzing={analysisStatus === 'analyzing'}
              onAnalyze={handleRunAnalysis}
            />

            {/* Result State Section */}
            {analysisStatus === 'idle' && (
              <IdleExplanationCard
                onQuickStart={() =>
                  handleRunAnalysis(currentScene.defaultQuerySuggestions[0])
                }
              />
            )}

            {analysisStatus === 'analyzing' && <AnalyzingStateCard />}

            {analysisStatus === 'success' && analysisResult && (
              <AnalysisResultCard
                result={analysisResult}
                chatMessages={chatMessages}
                isFollowUpLoading={isFollowUpLoading}
                onSendFollowUp={handleSendFollowUp}
                onSaveReport={handleSaveReport}
                isGroundingLoading={isGroundingLoading}
                onFetchGrounding={handleFetchGrounding}
              />
            )}

            {analysisStatus === 'error' && (
              <ErrorStateCard
                errorMessage={errorMessage}
                onRetry={() => handleRunAnalysis()}
              />
            )}
          </div>
        )}

        {/* PAGE 2: TEMPORAL LAB */}
        {activePage === 'TEMPORAL' && (
          <div className="w-full flex flex-col items-center">
            {/* Target Scene Selector Row */}
            <SceneSelectorRow
              scenes={scenes}
              selectedScene={currentScene}
              onSceneSelected={handleSelectScene}
              onCustomImageSelected={handleCustomImageSelected}
            />

            {/* 3D Multi-Temporal Change & Environmental Simulator */}
            <TemporalChangeLab scene={currentScene} />
          </div>
        )}

        {/* PAGE 3: INTELLIGENCE DOSSIER */}
        {activePage === 'DOSSIER' && (
          <div className="w-full flex flex-col items-center">
            {/* Target Scene Selector Row */}
            <SceneSelectorRow
              scenes={scenes}
              selectedScene={currentScene}
              onSceneSelected={handleSelectScene}
              onCustomImageSelected={handleCustomImageSelected}
            />

            {/* Classified ISRO Research Dossier & Voice Audio Briefing */}
            <MissionIntelligenceDossier
              scene={currentScene}
              result={analysisResult}
            />
          </div>
        )}

        {/* PAGE 4: ORBITAL ASSISTANTS & MULTI-YEAR REVISIT */}
        {activePage === 'ASSISTANTS' && (
          <div className="w-full flex flex-col items-center">
            {/* Target Scene Selector Row */}
            <SceneSelectorRow
              scenes={scenes}
              selectedScene={currentScene}
              onSceneSelected={handleSelectScene}
              onCustomImageSelected={handleCustomImageSelected}
            />

            {/* Rover Drishti-1 Robot Chatbot + Deep Recon AI + Historical Revisit */}
            <OrbitalAssistantsAndRevisit
              scene={currentScene}
              customApiKey={customApiKey}
            />
          </div>
        )}
      </main>

      {/* Slide-over Sheet for Saved Analyses */}
      {showHistorySheet && (
        <SavedAnalysesSheet
          records={savedAnalyses}
          onDismiss={() => setShowHistorySheet(false)}
          onDeleteRecord={handleDeleteSaved}
          onClearAll={handleClearAllHistory}
        />
      )}

      {/* API Key Dialog */}
      {showApiKeyDialog && (
        <ApiKeyDialog
          currentCustomKey={customApiKey}
          onKeySaved={handleSaveApiKey}
          onDismiss={() => setShowApiKeyDialog(false)}
        />
      )}

      {/* Cinematic 3D Earth Scan Opening Overlay */}
      {showCinematicOpening && (
        <EarthScanCinematicOpening
          onEnterApp={() => setShowCinematicOpening(false)}
        />
      )}

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-[#0A2239] text-white px-4 py-2.5 rounded-xl shadow-xl text-[12px] font-medium animate-in fade-in slide-in-from-bottom-2 duration-150 border border-[#D0E4F8]/20 flex items-center gap-2">
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}

export default App;

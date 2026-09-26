import React, { useState, useEffect } from 'react';
import {
  AnalysisRecord,
  AnalysisResult,
  ChatMessage,
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
import { SpectralModeSelector } from './components/SpectralModeSelector';
import { SceneSelectorRow } from './components/SceneSelectorRow';
import { QueryConsole } from './components/QueryConsole';
import { IdleExplanationCard } from './components/IdleExplanationCard';
import { AnalyzingStateCard, ErrorStateCard } from './components/AnalyzingStateCard';
import { AnalysisResultCard } from './components/AnalysisResultCard';
import { SavedAnalysesSheet } from './components/SavedAnalysesSheet';
import { ApiKeyDialog } from './components/ApiKeyDialog';
import { EarthScanCinematicOpening } from './components/EarthScanCinematicOpening';

export function App() {
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
      title: name.replace(/\.[^/.]+$/, '') || 'User Imported Image',
      subtitle: 'Custom user satellite / aerial high-resolution scene',
      imageSrc: dataUrl,
      isCustom: true,
      coordinates: 'Optical Coordinates (Verified)',
      gsdResolution: 'High-Res Native',
      satellitePlatform: 'Optical Aerial/Satellite Sensor',
      defaultQuerySuggestions: [
        'Explain what is visible in this image in simple language',
        'Identify water bodies, vegetation, and built structures',
        'Estimate land cover distribution and density',
        'Detect any notable features, roads, or anomalies'
      ],
      domainCategory: 'Custom Import',
      geographicLocation: 'User Defined Target Coordinate',
      googleMapsUrl: 'https://www.google.com/maps',
      baseNdvi: 0.5,
      baseNdwi: 0.2,
      baseNdbi: 0.1,
      baseSurfaceTemp: 24.5
    };

    setScenes((prev) => [customScene, ...prev]);
    setCurrentScene(customScene);
    setChatMessages([]);
    setUserQuery('Explain what is visible in this image in simple language');

    // Instantly trigger analysis on custom image
    runAnalysisWithQuery(customScene, 'Explain what is visible in this image in simple language');
  };

  const runAnalysisWithQuery = async (sceneToAnalyze: SatelliteScene, queryToUse: string) => {
    setUserQuery(queryToUse);
    setAnalysisStatus('analyzing');
    setErrorMessage('');

    try {
      const result = await executeSceneAnalysis(
        sceneToAnalyze,
        queryToUse,
        SPECTRAL_MODES[spectralMode].label,
        customApiKey || undefined
      );

      setAnalysisResult(result);
      setAnalysisStatus('success');
      setChatMessages([
        {
          id: `welcome_${Date.now()}`,
          sender: 'REMOTE_SENSING_AI',
          text: `Telemetry processed for query: "${queryToUse}". ${result.plainSummary.slice(0, 200)}... Ask any follow-up question below about your image.`,
          timestamp: Date.now()
        }
      ]);
    } catch (err: any) {
      console.error('Analysis failed:', err);
      setErrorMessage(err?.message || 'Failed to complete remote sensing analysis');
      setAnalysisStatus('error');
    }
  };

  const handleRunAnalysis = (queryOverride?: string) => {
    const query =
      queryOverride ||
      (userQuery.trim() ? userQuery.trim() : currentScene.defaultQuerySuggestions[0]);
    runAnalysisWithQuery(currentScene, query);
  };

  const handleFetchGrounding = async () => {
    if (!analysisResult) return;
    setIsGroundingLoading(true);

    try {
      const groundingText = await fetchMapsGrounding(currentScene, customApiKey || undefined);
      setAnalysisResult((prev) =>
        prev
          ? {
              ...prev,
              googleMapsGroundingSummary: groundingText,
              googleMapsLocationUri: currentScene.googleMapsUrl,
              geographicRegion: currentScene.geographicLocation
            }
          : null
      );
    } catch (err) {
      console.warn('Grounding fetch error:', err);
    } finally {
      setIsGroundingLoading(false);
    }
  };

  const handleSendFollowUp = async (question: string) => {
    if (!question.trim()) return;

    const userMsg: ChatMessage = {
      id: `user_${Date.now()}`,
      sender: 'USER',
      text: question.trim(),
      timestamp: Date.now()
    };

    const newThread = [...chatMessages, userMsg];
    setChatMessages(newThread);
    setIsFollowUpLoading(true);

    try {
      const historyContext = newThread
        .slice(-4)
        .map((m) => `${m.sender}: ${m.text}`)
        .join('\n');

      const answer = await executeFollowUpQuestion(
        currentScene,
        historyContext,
        question.trim(),
        customApiKey || undefined
      );

      const aiMsg: ChatMessage = {
        id: `ai_${Date.now()}`,
        sender: 'REMOTE_SENSING_AI',
        text: answer,
        timestamp: Date.now()
      };
      setChatMessages((prev) => [...prev, aiMsg]);
    } catch (err: any) {
      const errorMsg: ChatMessage = {
        id: `err_${Date.now()}`,
        sender: 'REMOTE_SENSING_AI',
        text: `Unable to process follow-up: ${err?.message || 'Inference error'}`,
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
      {/* Navigation Top Bar */}
      <Navbar
        savedCount={savedAnalyses.length}
        hasCustomKey={Boolean(customApiKey)}
        onOpenCinematic={() => setShowCinematicOpening(true)}
        onOpenApiKey={() => setShowApiKeyDialog(true)}
        onOpenHistory={() => setShowHistorySheet(true)}
      />

      <main className="flex-1 w-full flex flex-col items-center">
        {/* Live Telemetry Badges */}
        <TelemetryBadgeRow
          gsdResolution={currentScene.gsdResolution}
          spectralModeLabel={SPECTRAL_MODES[spectralMode].label}
        />

        {/* Interactive High-Res Satellite Viewport */}
        <SatelliteViewport
          scene={currentScene}
          spectralMode={spectralMode}
          isRadarScanActive={isRadarScanActive}
          onToggleRadarScan={() => setIsRadarScanActive((prev) => !prev)}
        />

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

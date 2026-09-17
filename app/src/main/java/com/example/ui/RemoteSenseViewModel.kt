package com.example.ui

import android.app.Application
import android.net.Uri
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.viewModelScope
import com.example.data.local.AnalysisRecord
import com.example.data.local.RemoteSenseDatabase
import com.example.data.model.AnalysisResult
import com.example.data.model.ChatMessage
import com.example.data.model.MessageSender
import com.example.data.model.PresetSatelliteScenes
import com.example.data.model.SatelliteScene
import com.example.data.model.SpectralBandMode
import com.example.data.repository.RemoteSenseRepository
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.SharingStarted
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.stateIn
import kotlinx.coroutines.launch

sealed interface AnalysisUiState {
    data object Idle : AnalysisUiState
    data object Analyzing : AnalysisUiState
    data class Success(val result: AnalysisResult) : AnalysisUiState
    data class Error(val message: String) : AnalysisUiState
}

class RemoteSenseViewModel(application: Application) : AndroidViewModel(application) {

    private val prefs = application.getSharedPreferences("bhu_drishti_prefs", android.content.Context.MODE_PRIVATE)
    private val repository: RemoteSenseRepository

    init {
        val db = RemoteSenseDatabase.getDatabase(application)
        repository = RemoteSenseRepository(db.analysisDao())
    }

    val savedAnalyses: StateFlow<List<AnalysisRecord>> = repository.savedAnalyses
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())

    private val _scenes = MutableStateFlow(PresetSatelliteScenes.all)
    val scenes: StateFlow<List<SatelliteScene>> = _scenes.asStateFlow()

    private val _currentScene = MutableStateFlow(PresetSatelliteScenes.all.first())
    val currentScene: StateFlow<SatelliteScene> = _currentScene.asStateFlow()

    private val _spectralMode = MutableStateFlow(SpectralBandMode.TRUE_COLOR)
    val spectralMode: StateFlow<SpectralBandMode> = _spectralMode.asStateFlow()

    private val _analysisState = MutableStateFlow<AnalysisUiState>(AnalysisUiState.Idle)
    val analysisState: StateFlow<AnalysisUiState> = _analysisState.asStateFlow()

    private val _userQueryText = MutableStateFlow("")
    val userQueryText: StateFlow<String> = _userQueryText.asStateFlow()

    private val _chatMessages = MutableStateFlow<List<ChatMessage>>(emptyList())
    val chatMessages: StateFlow<List<ChatMessage>> = _chatMessages.asStateFlow()

    private val _isFollowUpLoading = MutableStateFlow(false)
    val isFollowUpLoading: StateFlow<Boolean> = _isFollowUpLoading.asStateFlow()

    private val _isRadarScanActive = MutableStateFlow(true)
    val isRadarScanActive: StateFlow<Boolean> = _isRadarScanActive.asStateFlow()

    private val _customApiKey = MutableStateFlow(prefs.getString("custom_gemini_api_key", "") ?: "")
    val customApiKey: StateFlow<String> = _customApiKey.asStateFlow()

    private val _saveStatusMessage = MutableStateFlow<String?>(null)
    val saveStatusMessage: StateFlow<String?> = _saveStatusMessage.asStateFlow()

    private val _isGroundingLoading = MutableStateFlow(false)
    val isGroundingLoading: StateFlow<Boolean> = _isGroundingLoading.asStateFlow()

    fun selectScene(scene: SatelliteScene) {
        _currentScene.value = scene
        _analysisState.value = AnalysisUiState.Idle
        _chatMessages.value = emptyList()
        _userQueryText.value = ""
    }

    fun setSpectralMode(mode: SpectralBandMode) {
        _spectralMode.value = mode
    }

    fun onQueryChange(newQuery: String) {
        _userQueryText.value = newQuery
    }

    fun setCustomApiKey(key: String) {
        val trimmed = key.trim()
        _customApiKey.value = trimmed
        prefs.edit().putString("custom_gemini_api_key", trimmed).apply()
    }

    fun toggleRadarScan() {
        _isRadarScanActive.value = !_isRadarScanActive.value
    }

    fun clearSaveStatusMessage() {
        _saveStatusMessage.value = null
    }

    fun setCustomImage(uri: Uri) {
        val customScene = SatelliteScene(
            id = "custom_${System.currentTimeMillis()}",
            title = "User Imported Image",
            subtitle = "Custom user satellite / aerial high-resolution scene",
            customUri = uri,
            coordinates = "Optical Coordinates (Verified)",
            gsdResolution = "High-Res Native",
            satellitePlatform = "Optical Aerial/Satellite Sensor",
            defaultQuerySuggestions = listOf(
                "Explain what is visible in this image in simple language",
                "Identify water bodies, vegetation, and built structures",
                "Estimate land cover distribution and density",
                "Detect any notable features, roads, or anomalies"
            ),
            domainCategory = "Custom Import"
        )
        _scenes.value = listOf(customScene) + PresetSatelliteScenes.all
        _currentScene.value = customScene
        _chatMessages.value = emptyList()
        _userQueryText.value = ""
        // Proactively analyze the newly inserted image so the user gets instant feedback
        runAnalysis("Explain what is visible in this image in simple language")
    }

    fun runAnalysis(queryOverride: String? = null) {
        val query = queryOverride ?: _userQueryText.value.takeIf { it.isNotBlank() }
            ?: _currentScene.value.defaultQuerySuggestions.first()

        _userQueryText.value = query
        _analysisState.value = AnalysisUiState.Analyzing

        viewModelScope.launch {
            try {
                val result = repository.analyzeScene(
                    context = getApplication(),
                    scene = _currentScene.value,
                    query = query,
                    spectralMode = _spectralMode.value.label,
                    customApiKey = _customApiKey.value.takeIf { it.isNotBlank() }
                )
                _analysisState.value = AnalysisUiState.Success(result)
                _chatMessages.value = listOf(
                    ChatMessage(
                        sender = MessageSender.REMOTE_SENSING_AI,
                        text = "Telemetry processed for query: \"$query\". ${result.plainSummary.take(200)}... Ask any follow-up question below about your image."
                    )
                )
            } catch (e: Exception) {
                _analysisState.value = AnalysisUiState.Error(
                    e.localizedMessage ?: "Failed to complete remote sensing analysis"
                )
            }
        }
    }

    fun fetchLiveMapsGrounding() {
        val currentState = _analysisState.value
        if (currentState !is AnalysisUiState.Success) return
        val scene = _currentScene.value

        _isGroundingLoading.value = true
        viewModelScope.launch {
            try {
                val groundingText = repository.getMapsGrounding(
                    coordinates = scene.coordinates,
                    locationTitle = scene.title,
                    customApiKey = _customApiKey.value.takeIf { it.isNotBlank() }
                )
                val updatedResult = currentState.result.copy(
                    googleMapsGroundingSummary = groundingText,
                    googleMapsLocationUri = scene.googleMapsUrl,
                    geographicRegion = scene.geographicLocation
                )
                _analysisState.value = AnalysisUiState.Success(updatedResult)
            } catch (e: Exception) {
                // Keep existing grounding summary
            } finally {
                _isGroundingLoading.value = false
            }
        }
    }

    fun sendFollowUpQuestion(question: String) {
        if (question.isBlank()) return
        val currentList = _chatMessages.value.toMutableList()
        val userMsg = ChatMessage(sender = MessageSender.USER, text = question)
        currentList.add(userMsg)
        _chatMessages.value = currentList
        _isFollowUpLoading.value = true

        viewModelScope.launch {
            try {
                val conversationSummary = currentList.takeLast(4).joinToString("\n") {
                    "${it.sender}: ${it.text}"
                }
                val answer = repository.askFollowUp(
                    context = getApplication(),
                    scene = _currentScene.value,
                    history = conversationSummary,
                    question = question,
                    customApiKey = _customApiKey.value.takeIf { it.isNotBlank() }
                )
                val aiMsg = ChatMessage(sender = MessageSender.REMOTE_SENSING_AI, text = answer)
                _chatMessages.value = _chatMessages.value + aiMsg
            } catch (e: Exception) {
                val errorMsg = ChatMessage(
                    sender = MessageSender.REMOTE_SENSING_AI,
                    text = "Unable to process follow-up: ${e.localizedMessage ?: "Network error"}"
                )
                _chatMessages.value = _chatMessages.value + errorMsg
            } finally {
                _isFollowUpLoading.value = false
            }
        }
    }

    fun saveCurrentAnalysis() {
        val state = _analysisState.value
        if (state !is AnalysisUiState.Success) return

        viewModelScope.launch {
            try {
                val scene = _currentScene.value
                repository.saveAnalysis(
                    sceneTitle = scene.title,
                    coordinates = scene.coordinates,
                    query = state.result.query,
                    result = state.result,
                    spectralMode = _spectralMode.value.label
                )
                _saveStatusMessage.value = "Analysis report saved to local records."
            } catch (e: Exception) {
                _saveStatusMessage.value = "Failed to save record: ${e.localizedMessage}"
            }
        }
    }

    fun deleteSavedAnalysis(id: Long) {
        viewModelScope.launch {
            repository.deleteSavedAnalysis(id)
        }
    }

    fun clearAllHistory() {
        viewModelScope.launch {
            repository.clearAllHistory()
        }
    }
}

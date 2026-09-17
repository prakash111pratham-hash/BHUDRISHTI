package com.example

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.activity.viewModels
import androidx.compose.animation.AnimatedVisibility
import androidx.compose.animation.fadeIn
import androidx.compose.animation.fadeOut
import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.res.painterResource
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Bookmark
import androidx.compose.material.icons.filled.Info
import androidx.compose.material.icons.filled.Key
import androidx.compose.material.icons.filled.Psychology
import androidx.compose.material.icons.filled.Public
import androidx.compose.material.icons.filled.Replay
import androidx.compose.material.icons.filled.Sensors
import androidx.compose.material.icons.filled.Speed
import androidx.compose.material.icons.filled.Visibility
import androidx.compose.material3.Badge
import androidx.compose.material3.BadgedBox
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Scaffold
import androidx.compose.material3.SnackbarHost
import androidx.compose.material3.SnackbarHostState
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.material3.TopAppBar
import androidx.compose.material3.TopAppBarDefaults
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.ui.AnalysisUiState
import com.example.ui.RemoteSenseViewModel
import com.example.ui.components.AnalysisResultCard
import com.example.ui.components.ApiKeyDialog
import com.example.ui.components.EarthScanCinematicOpening
import com.example.ui.components.QueryConsole
import com.example.ui.components.SatelliteViewport
import com.example.ui.components.SavedAnalysesSheet
import com.example.ui.components.SceneSelectorRow
import com.example.ui.components.SpectralModeSelector
import com.example.ui.components.TelemetryBadgeRow
import com.example.ui.theme.MyApplicationTheme
import com.example.ui.theme.NdviGreen
import com.example.ui.theme.OrbitNavyBorder
import com.example.ui.theme.OrbitNavyCard
import com.example.ui.theme.OrbitNavyDark
import com.example.ui.theme.OrbitNavySurface
import com.example.ui.theme.SatelliteCyan
import com.example.ui.theme.TelemetryAmber
import com.example.ui.theme.TextPrimary
import com.example.ui.theme.TextSecondary
import com.example.ui.theme.TextTertiary
import com.example.ui.theme.WarningRed

class MainActivity : ComponentActivity() {

    private val viewModel: RemoteSenseViewModel by viewModels()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContent {
            MyApplicationTheme {
                RemoteSenseApp(viewModel = viewModel)
            }
        }
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun RemoteSenseApp(viewModel: RemoteSenseViewModel) {
    val scenes by viewModel.scenes.collectAsState()
    val currentScene by viewModel.currentScene.collectAsState()
    val spectralMode by viewModel.spectralMode.collectAsState()
    val analysisState by viewModel.analysisState.collectAsState()
    val userQuery by viewModel.userQueryText.collectAsState()
    val chatMessages by viewModel.chatMessages.collectAsState()
    val isFollowUpLoading by viewModel.isFollowUpLoading.collectAsState()
    val isRadarScanActive by viewModel.isRadarScanActive.collectAsState()
    val savedAnalyses by viewModel.savedAnalyses.collectAsState()
    val saveMessage by viewModel.saveStatusMessage.collectAsState()
    val customApiKey by viewModel.customApiKey.collectAsState()
    val isGroundingLoading by viewModel.isGroundingLoading.collectAsState()

    var showCinematicOpening by remember { mutableStateOf(true) }
    var showHistorySheet by remember { mutableStateOf(false) }
    var showApiKeyDialog by remember { mutableStateOf(false) }
    val snackbarHostState = remember { SnackbarHostState() }

    LaunchedEffect(saveMessage) {
        saveMessage?.let { msg ->
            snackbarHostState.showSnackbar(msg)
            viewModel.clearSaveStatusMessage()
        }
    }

    Box(modifier = Modifier.fillMaxSize()) {
        Scaffold(
            modifier = Modifier.fillMaxSize(),
            containerColor = OrbitNavyDark,
            snackbarHost = { SnackbarHost(snackbarHostState) },
            topBar = {
                TopAppBar(
                    title = {
                        Row(
                            verticalAlignment = Alignment.CenterVertically,
                            horizontalArrangement = Arrangement.spacedBy(10.dp)
                        ) {
                            Box(
                                modifier = Modifier
                                    .size(36.dp)
                                    .clip(RoundedCornerShape(8.dp))
                                    .background(Color.White)
                                    .border(1.dp, SatelliteCyan.copy(alpha = 0.6f), RoundedCornerShape(8.dp)),
                                contentAlignment = Alignment.Center
                            ) {
                                Image(
                                    painter = painterResource(id = R.drawable.img_bhu_drishti_icon),
                                    contentDescription = "BHUदृष्टि Logo",
                                    modifier = Modifier.fillMaxSize(),
                                    contentScale = ContentScale.Crop
                                )
                            }
                            Column {
                                Text(
                                    text = "BHUदृष्टि",
                                    style = MaterialTheme.typography.titleMedium,
                                    color = TextPrimary,
                                    fontWeight = FontWeight.Bold,
                                    fontSize = 17.sp
                                )
                                Text(
                                    text = "Earth-Vision AI • Satellite Telemetry",
                                    style = MaterialTheme.typography.labelSmall,
                                    color = TextTertiary,
                                    fontSize = 10.sp
                                )
                            }
                        }
                    },
                    actions = {
                        // Re-launch cinematic 3D Earth scan
                        IconButton(
                            onClick = { showCinematicOpening = true },
                            modifier = Modifier.testTag("launch_cinematic_opening_button")
                        ) {
                            Icon(
                                imageVector = Icons.Default.Public,
                                contentDescription = "Cinematic Opening Scan",
                                tint = SatelliteCyan,
                                modifier = Modifier.size(20.dp)
                            )
                        }

                        // API Key Dialog button
                        IconButton(
                            onClick = { showApiKeyDialog = true },
                            modifier = Modifier.testTag("open_api_key_dialog_button")
                        ) {
                            Icon(
                                imageVector = Icons.Default.Key,
                                contentDescription = "API Key Configuration",
                                tint = if (customApiKey.isNotBlank()) NdviGreen else SatelliteCyan,
                                modifier = Modifier.size(20.dp)
                            )
                        }

                        // Saved records history button with badge
                        IconButton(
                            onClick = { showHistorySheet = true },
                            modifier = Modifier.testTag("open_history_sheet_button")
                        ) {
                            BadgedBox(
                                badge = {
                                    if (savedAnalyses.isNotEmpty()) {
                                        Badge(
                                            containerColor = SatelliteCyan,
                                            contentColor = Color.White
                                        ) {
                                            Text("${savedAnalyses.size}", fontSize = 9.sp)
                                        }
                                    }
                                }
                            ) {
                                Icon(
                                    imageVector = Icons.Default.Bookmark,
                                    contentDescription = "Saved Analyses",
                                    tint = TextSecondary,
                                    modifier = Modifier.size(20.dp)
                                )
                            }
                        }
                    },
                    colors = TopAppBarDefaults.topAppBarColors(
                        containerColor = OrbitNavySurface,
                        titleContentColor = TextPrimary
                    )
                )
            }
        ) { innerPadding ->
        LazyColumn(
            modifier = Modifier
                .fillMaxSize()
                .padding(innerPadding),
            contentPadding = PaddingValues(bottom = 32.dp)
        ) {
            // Live Telemetry badges
            item {
                TelemetryBadgeRow(
                    gsdResolution = currentScene.gsdResolution,
                    spectralModeLabel = spectralMode.label
                )
            }

            // Interactive High-Res Satellite Viewport
            item {
                SatelliteViewport(
                    scene = currentScene,
                    spectralMode = spectralMode,
                    isRadarScanActive = isRadarScanActive,
                    onToggleRadarScan = { viewModel.toggleRadarScan() }
                )
            }

            // Spectral Band Simulation Selector
            item {
                SpectralModeSelector(
                    selectedMode = spectralMode,
                    onModeSelected = { viewModel.setSpectralMode(it) }
                )
            }

            // Scene Selector Row
            item {
                SceneSelectorRow(
                    scenes = scenes,
                    selectedScene = currentScene,
                    onSceneSelected = { viewModel.selectScene(it) },
                    onCustomImageSelected = { viewModel.setCustomImage(it) }
                )
            }

            // AI Remote Sensing Query Console
            item {
                QueryConsole(
                    userQuery = userQuery,
                    onQueryChange = { viewModel.onQueryChange(it) },
                    suggestions = currentScene.defaultQuerySuggestions,
                    isAnalyzing = analysisState is AnalysisUiState.Analyzing,
                    onAnalyze = { viewModel.runAnalysis(it) }
                )
            }

            // Result State Section
            item {
                when (val state = analysisState) {
                    is AnalysisUiState.Idle -> {
                        IdleExplanationCard(onQuickStart = {
                            viewModel.runAnalysis(currentScene.defaultQuerySuggestions.first())
                        })
                    }
                    is AnalysisUiState.Analyzing -> {
                        AnalyzingStateCard()
                    }
                    is AnalysisUiState.Success -> {
                        AnalysisResultCard(
                            result = state.result,
                            chatMessages = chatMessages,
                            isFollowUpLoading = isFollowUpLoading,
                            onSendFollowUp = { viewModel.sendFollowUpQuestion(it) },
                            onSaveReport = { viewModel.saveCurrentAnalysis() },
                            isGroundingLoading = isGroundingLoading,
                            onFetchGrounding = { viewModel.fetchLiveMapsGrounding() }
                        )
                    }
                    is AnalysisUiState.Error -> {
                        ErrorStateCard(
                            errorMessage = state.message,
                            onRetry = { viewModel.runAnalysis() }
                        )
                    }
                }
            }
        }
    }

    // Modal Sheet for Saved Analyses
    if (showHistorySheet) {
        SavedAnalysesSheet(
            records = savedAnalyses,
            onDismiss = { showHistorySheet = false },
            onDeleteRecord = { viewModel.deleteSavedAnalysis(it) },
            onClearAll = { viewModel.clearAllHistory() }
        )
    }

    // API Key Dialog
    if (showApiKeyDialog) {
        ApiKeyDialog(
            currentCustomKey = customApiKey,
            onKeySaved = { viewModel.setCustomApiKey(it) },
            onDismiss = { showApiKeyDialog = false }
        )
    }

    // Futuristic 3D Earth Scan Opening Overlay
    if (showCinematicOpening) {
        EarthScanCinematicOpening(
            onEnterApp = { showCinematicOpening = false }
        )
    }
    }
}

@Composable
fun IdleExplanationCard(onQuickStart: () -> Unit) {
    Card(
        colors = CardDefaults.cardColors(containerColor = OrbitNavyCard),
        shape = RoundedCornerShape(16.dp),
        border = androidx.compose.foundation.BorderStroke(1.dp, OrbitNavyBorder),
        modifier = Modifier
            .fillMaxWidth()
            .padding(horizontal = 16.dp, vertical = 8.dp)
            .testTag("idle_explanation_card")
    ) {
        Column(modifier = Modifier.padding(18.dp)) {
            Row(
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.spacedBy(12.dp)
            ) {
                Image(
                    painter = painterResource(id = R.drawable.img_bhu_drishti_icon),
                    contentDescription = "BHUदृष्टि Logo",
                    modifier = Modifier
                        .size(44.dp)
                        .clip(RoundedCornerShape(10.dp))
                        .border(1.dp, SatelliteCyan.copy(alpha = 0.6f), RoundedCornerShape(10.dp)),
                    contentScale = ContentScale.Crop
                )
                Column {
                    Text(
                        text = "BHUदृष्टि (Earth-Vision AI)",
                        style = MaterialTheme.typography.titleMedium,
                        color = TextPrimary,
                        fontWeight = FontWeight.Bold
                    )
                    Text(
                        text = "Vision-Language Remote Sensing",
                        style = MaterialTheme.typography.labelSmall,
                        color = SatelliteCyan,
                        fontSize = 11.sp
                    )
                }
            }

            Spacer(modifier = Modifier.height(10.dp))

            Text(
                text = "Multi-spectral orbital satellite imagery captures vital surface dynamics across agriculture, urban boundaries, and water bodies. BHUदृष्टि processes high-resolution orthophoto rasters into Level-2A Earth Observation reports with biophysical indices (NDVI, NDWI, NDBI, LST) and Google Maps ground truth synchronization.",
                style = MaterialTheme.typography.bodyMedium,
                color = TextSecondary,
                fontSize = 13.sp,
                lineHeight = 19.sp
            )

            Spacer(modifier = Modifier.height(14.dp))

            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(10.dp)
            ) {
                Row(
                    modifier = Modifier
                        .weight(1f)
                        .clip(RoundedCornerShape(8.dp))
                        .background(OrbitNavyDark)
                        .padding(8.dp),
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.spacedBy(6.dp)
                ) {
                    Icon(
                        imageVector = Icons.Default.Speed,
                        contentDescription = null,
                        tint = NdviGreen,
                        modifier = Modifier.size(16.dp)
                    )
                    Text(
                        text = "Zero GPU VRAM",
                        style = MaterialTheme.typography.labelSmall,
                        color = NdviGreen,
                        fontSize = 11.sp
                    )
                }

                Row(
                    modifier = Modifier
                        .weight(1f)
                        .clip(RoundedCornerShape(8.dp))
                        .background(OrbitNavyDark)
                        .padding(8.dp),
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.spacedBy(6.dp)
                ) {
                    Icon(
                        imageVector = Icons.Default.Visibility,
                        contentDescription = null,
                        tint = SatelliteCyan,
                        modifier = Modifier.size(16.dp)
                    )
                    Text(
                        text = "Maps Grounding",
                        style = MaterialTheme.typography.labelSmall,
                        color = SatelliteCyan,
                        fontSize = 11.sp
                    )
                }
            }

            Spacer(modifier = Modifier.height(14.dp))

            Button(
                onClick = onQuickStart,
                colors = ButtonDefaults.buttonColors(
                    containerColor = SatelliteCyan,
                    contentColor = Color.White
                ),
                shape = RoundedCornerShape(10.dp),
                modifier = Modifier
                    .fillMaxWidth()
                    .testTag("quick_start_analysis_button")
            ) {
                Text("Generate Earth Observation Report", fontWeight = FontWeight.Bold)
            }
        }
    }
}

@Composable
fun AnalyzingStateCard() {
    Card(
        colors = CardDefaults.cardColors(containerColor = OrbitNavyCard),
        shape = RoundedCornerShape(16.dp),
        border = androidx.compose.foundation.BorderStroke(1.dp, SatelliteCyan.copy(alpha = 0.5f)),
        modifier = Modifier
            .fillMaxWidth()
            .padding(horizontal = 16.dp, vertical = 8.dp)
            .testTag("analyzing_state_card")
    ) {
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .padding(24.dp),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            CircularProgressIndicator(
                color = SatelliteCyan,
                strokeWidth = 3.dp,
                modifier = Modifier.size(36.dp)
            )

            Spacer(modifier = Modifier.height(16.dp))

            Text(
                text = "Processing Remote Sensing Model...",
                style = MaterialTheme.typography.titleMedium,
                color = TextPrimary,
                fontWeight = FontWeight.Bold
            )

            Spacer(modifier = Modifier.height(6.dp))

            Text(
                text = "Vision encoding orthophoto pixels • Text encoding query • Zero GPU memory strain",
                style = MaterialTheme.typography.bodySmall,
                color = TextSecondary,
                fontSize = 12.sp,
                textAlign = androidx.compose.ui.text.style.TextAlign.Center
            )
        }
    }
}

@Composable
fun ErrorStateCard(errorMessage: String, onRetry: () -> Unit) {
    Card(
        colors = CardDefaults.cardColors(containerColor = OrbitNavyCard),
        shape = RoundedCornerShape(16.dp),
        border = androidx.compose.foundation.BorderStroke(1.dp, WarningRed.copy(alpha = 0.5f)),
        modifier = Modifier
            .fillMaxWidth()
            .padding(horizontal = 16.dp, vertical = 8.dp)
            .testTag("error_state_card")
    ) {
        Column(modifier = Modifier.padding(18.dp)) {
            Text(
                text = "Analysis Error",
                style = MaterialTheme.typography.titleMedium,
                color = WarningRed,
                fontWeight = FontWeight.Bold
            )
            Spacer(modifier = Modifier.height(6.dp))
            Text(
                text = errorMessage,
                style = MaterialTheme.typography.bodySmall,
                color = TextSecondary,
                fontSize = 12.sp
            )
            Spacer(modifier = Modifier.height(12.dp))
            Button(
                onClick = onRetry,
                colors = ButtonDefaults.buttonColors(
                    containerColor = SatelliteCyan,
                    contentColor = Color.White
                ),
                shape = RoundedCornerShape(8.dp)
            ) {
                Icon(
                    imageVector = Icons.Default.Replay,
                    contentDescription = null,
                    modifier = Modifier.size(16.dp)
                )
                Spacer(modifier = Modifier.width(6.dp))
                Text("Retry Analysis")
            }
        }
    }
}


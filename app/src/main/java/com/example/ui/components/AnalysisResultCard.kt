package com.example.ui.components

import android.content.ClipData
import android.content.ClipboardManager
import android.content.Context
import android.content.Intent
import android.net.Uri
import android.widget.Toast
import androidx.compose.animation.AnimatedVisibility
import androidx.compose.animation.core.animateFloatAsState
import androidx.compose.animation.core.tween
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.OpenInNew
import androidx.compose.material.icons.automirrored.filled.Send
import androidx.compose.material.icons.filled.BookmarkBorder
import androidx.compose.material.icons.filled.ContentCopy
import androidx.compose.material.icons.filled.Eco
import androidx.compose.material.icons.filled.Info
import androidx.compose.material.icons.filled.Lightbulb
import androidx.compose.material.icons.filled.LocationOn
import androidx.compose.material.icons.filled.PieChart
import androidx.compose.material.icons.filled.QuestionAnswer
import androidx.compose.material.icons.filled.Refresh
import androidx.compose.material.icons.filled.Search
import androidx.compose.material.icons.filled.Sensors
import androidx.compose.material.icons.filled.Thermostat
import androidx.compose.material.icons.filled.Warning
import androidx.compose.material.icons.filled.WaterDrop
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedButton
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.OutlinedTextFieldDefaults
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.data.model.AnalysisResult
import com.example.data.model.ChatMessage
import com.example.data.model.MessageSender
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

/**
 * Technical Earth Observation & Geospatial Ground Station Report.
 * Displays authoritative remote sensing telemetry, biophysical indices (NDVI, NDWI, NDBI, LST),
 * Google Maps ground truth integration, LULC classifications, and spectral feature observations.
 */
@Composable
fun AnalysisResultCard(
    result: AnalysisResult,
    chatMessages: List<ChatMessage>,
    isFollowUpLoading: Boolean,
    onSendFollowUp: (String) -> Unit,
    onSaveReport: () -> Unit,
    modifier: Modifier = Modifier,
    isGroundingLoading: Boolean = false,
    onFetchGrounding: (() -> Unit)? = null
) {
    val context = LocalContext.current
    var followUpInput by remember { mutableStateOf("") }
    var showChatSection by remember { mutableStateOf(false) }

    Column(
        modifier = modifier
            .fillMaxWidth()
            .padding(horizontal = 16.dp, vertical = 8.dp)
    ) {
        // Main Ground Station Card
        Surface(
            color = OrbitNavyCard,
            shape = RoundedCornerShape(16.dp),
            border = androidx.compose.foundation.BorderStroke(1.dp, OrbitNavyBorder),
            modifier = Modifier
                .fillMaxWidth()
                .testTag("analysis_result_card")
        ) {
            Column(modifier = Modifier.padding(16.dp)) {
                // 1. Header Bar: Technical Report Status & Actions
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Row(
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.spacedBy(8.dp)
                    ) {
                        Box(
                            modifier = Modifier
                                .size(8.dp)
                                .clip(CircleShape)
                                .background(SatelliteCyan)
                        )
                        Column {
                            Text(
                                text = "SATELLITE SPECTRAL SYNTHESIS",
                                style = MaterialTheme.typography.labelSmall,
                                color = SatelliteCyan,
                                fontSize = 11.sp,
                                letterSpacing = 1.2.sp,
                                fontWeight = FontWeight.Bold,
                                fontFamily = FontFamily.Monospace
                            )
                            Text(
                                text = result.processingLevel,
                                style = MaterialTheme.typography.labelSmall,
                                color = TextTertiary,
                                fontSize = 9.sp
                            )
                        }
                    }

                    Row(verticalAlignment = Alignment.CenterVertically) {
                        IconButton(
                            onClick = {
                                val clipboard = context.getSystemService(Context.CLIPBOARD_SERVICE) as ClipboardManager
                                val clip = ClipData.newPlainText("Remote Sensing Analysis", result.plainSummary)
                                clipboard.setPrimaryClip(clip)
                                Toast.makeText(context, "Analysis report copied to clipboard", Toast.LENGTH_SHORT).show()
                            },
                            modifier = Modifier.size(32.dp).testTag("copy_report_button")
                        ) {
                            Icon(
                                imageVector = Icons.Default.ContentCopy,
                                contentDescription = "Copy Report",
                                tint = TextSecondary,
                                modifier = Modifier.size(16.dp)
                            )
                        }

                        IconButton(
                            onClick = onSaveReport,
                            modifier = Modifier.size(32.dp).testTag("save_report_button")
                        ) {
                            Icon(
                                imageVector = Icons.Default.BookmarkBorder,
                                contentDescription = "Save Report",
                                tint = SatelliteCyan,
                                modifier = Modifier.size(18.dp)
                            )
                        }
                    }
                }

                Spacer(modifier = Modifier.height(10.dp))

                // 2. Biophysical Telemetry Indices Grid
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(6.dp)
                ) {
                    BiophysicalIndexBadge(
                        label = "NDVI",
                        value = String.format("%.2f", result.ndviIndex),
                        description = "Vegetation",
                        accentColor = NdviGreen,
                        icon = Icons.Default.Eco,
                        modifier = Modifier.weight(1f)
                    )
                    BiophysicalIndexBadge(
                        label = "NDWI",
                        value = String.format("%.2f", result.ndwiIndex),
                        description = "Moisture",
                        accentColor = SatelliteCyan,
                        icon = Icons.Default.WaterDrop,
                        modifier = Modifier.weight(1f)
                    )
                    BiophysicalIndexBadge(
                        label = "NDBI",
                        value = String.format("%.2f", result.ndbiIndex),
                        description = "Built-up",
                        accentColor = TelemetryAmber,
                        icon = Icons.Default.Sensors,
                        modifier = Modifier.weight(1f)
                    )
                    BiophysicalIndexBadge(
                        label = "LST",
                        value = "${result.surfaceTempCelsius.toInt()}°C",
                        description = "Surface Temp",
                        accentColor = Color(0xFFFF7043),
                        icon = Icons.Default.Thermostat,
                        modifier = Modifier.weight(1f)
                    )
                }

                Spacer(modifier = Modifier.height(12.dp))

                // 3. Query & Coordinate Scope Strip
                Column(
                    modifier = Modifier
                        .fillMaxWidth()
                        .clip(RoundedCornerShape(8.dp))
                        .background(OrbitNavyDark.copy(alpha = 0.8f))
                        .border(0.5.dp, OrbitNavyBorder, RoundedCornerShape(8.dp))
                        .padding(horizontal = 10.dp, vertical = 8.dp)
                ) {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Text(
                            text = "TARGET QUERY",
                            color = TelemetryAmber,
                            fontSize = 9.sp,
                            fontWeight = FontWeight.Bold,
                            fontFamily = FontFamily.Monospace,
                            letterSpacing = 1.sp
                        )
                        Text(
                            text = "CALIBRATION: ${result.radiometricQuality}%",
                            color = NdviGreen,
                            fontSize = 9.sp,
                            fontFamily = FontFamily.Monospace
                        )
                    }
                    Spacer(modifier = Modifier.height(2.dp))
                    Text(
                        text = "\"${result.query}\"",
                        style = MaterialTheme.typography.bodySmall,
                        color = TextPrimary,
                        fontSize = 12.sp,
                        fontWeight = FontWeight.Medium
                    )
                }

                Spacer(modifier = Modifier.height(12.dp))

                // 4. Natural Language Field Synthesis
                Text(
                    text = result.plainSummary,
                    style = MaterialTheme.typography.bodyMedium,
                    color = TextPrimary,
                    lineHeight = 22.sp,
                    fontSize = 14.sp
                )

                Spacer(modifier = Modifier.height(14.dp))

                // 5. Google Maps Ground Truth & Geospatial Context Panel
                Surface(
                    color = OrbitNavyDark,
                    shape = RoundedCornerShape(10.dp),
                    border = androidx.compose.foundation.BorderStroke(1.dp, SatelliteCyan.copy(alpha = 0.35f)),
                    modifier = Modifier.fillMaxWidth().testTag("google_maps_grounding_panel")
                ) {
                    Column(modifier = Modifier.padding(12.dp)) {
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Row(
                                verticalAlignment = Alignment.CenterVertically,
                                horizontalArrangement = Arrangement.spacedBy(6.dp)
                            ) {
                                Icon(
                                    imageVector = Icons.Default.LocationOn,
                                    contentDescription = "Google Maps Grounding",
                                    tint = Color(0xFF1976D2),
                                    modifier = Modifier.size(16.dp)
                                )
                                Text(
                                    text = "Google Maps Ground Truth",
                                    style = MaterialTheme.typography.labelSmall,
                                    color = Color(0xFF1565C0),
                                    fontWeight = FontWeight.Bold,
                                    fontSize = 11.sp
                                )
                            }

                            if (isGroundingLoading) {
                                CircularProgressIndicator(
                                    color = SatelliteCyan,
                                    strokeWidth = 2.dp,
                                    modifier = Modifier.size(14.dp)
                                )
                            } else if (onFetchGrounding != null) {
                                Row(
                                    verticalAlignment = Alignment.CenterVertically,
                                    modifier = Modifier
                                        .clickable { onFetchGrounding() }
                                        .padding(4.dp)
                                ) {
                                    Icon(
                                        imageVector = Icons.Default.Refresh,
                                        contentDescription = "Refresh Grounding",
                                        tint = TextTertiary,
                                        modifier = Modifier.size(14.dp)
                                    )
                                    Spacer(modifier = Modifier.width(2.dp))
                                    Text(
                                        text = "Sync",
                                        color = TextTertiary,
                                        fontSize = 10.sp
                                    )
                                }
                            }
                        }

                        if (!result.googleMapsGroundingSummary.isNullOrBlank()) {
                            Spacer(modifier = Modifier.height(6.dp))
                            Text(
                                text = result.googleMapsGroundingSummary,
                                style = MaterialTheme.typography.bodySmall,
                                color = TextSecondary,
                                fontSize = 11.sp,
                                lineHeight = 16.sp
                            )
                        }

                        Spacer(modifier = Modifier.height(8.dp))

                        // Open in Google Maps Action Button
                        val mapUrl = result.googleMapsLocationUri ?: "https://www.google.com/maps"
                        Row(
                            modifier = Modifier
                                .clip(RoundedCornerShape(6.dp))
                                .background(Color(0xFFE1F5FE))
                                .border(1.dp, Color(0xFFB3E5FC), RoundedCornerShape(6.dp))
                                .clickable {
                                    try {
                                        val intent = Intent(Intent.ACTION_VIEW, Uri.parse(mapUrl))
                                        context.startActivity(intent)
                                    } catch (e: Exception) {
                                        Toast.makeText(context, "Opening Google Maps link...", Toast.LENGTH_SHORT).show()
                                    }
                                }
                                .padding(horizontal = 10.dp, vertical = 6.dp),
                            verticalAlignment = Alignment.CenterVertically,
                            horizontalArrangement = Arrangement.spacedBy(6.dp)
                        ) {
                            Icon(
                                imageVector = Icons.AutoMirrored.Filled.OpenInNew,
                                contentDescription = "Open in Google Maps",
                                tint = SatelliteCyan,
                                modifier = Modifier.size(13.dp)
                            )
                            Text(
                                text = "View Geographic Coordinates in Google Maps",
                                style = MaterialTheme.typography.labelSmall,
                                color = SatelliteCyan,
                                fontWeight = FontWeight.SemiBold,
                                fontSize = 10.sp
                            )
                        }
                    }
                }

                Spacer(modifier = Modifier.height(14.dp))

                // 6. Land Cover Distribution Section (LULC Standard)
                Row(
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.spacedBy(6.dp)
                ) {
                    Icon(
                        imageVector = Icons.Default.PieChart,
                        contentDescription = null,
                        tint = SatelliteCyan,
                        modifier = Modifier.size(15.dp)
                    )
                    Text(
                        text = "Land Cover Classification (LULC)",
                        style = MaterialTheme.typography.titleSmall,
                        color = TextPrimary,
                        fontSize = 12.sp,
                        fontWeight = FontWeight.SemiBold
                    )
                }

                Spacer(modifier = Modifier.height(6.dp))

                // Multi-segment progress bar
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(8.dp)
                        .clip(RoundedCornerShape(4.dp))
                        .background(OrbitNavyDark)
                ) {
                    result.landCoverDistribution.forEach { item ->
                        val animatedWeight by animateFloatAsState(
                            targetValue = item.percentage,
                            animationSpec = tween(600),
                            label = "weight"
                        )
                        Box(
                            modifier = Modifier
                                .weight(animatedWeight.coerceAtLeast(1f))
                                .height(8.dp)
                                .background(Color(item.colorHex))
                        )
                    }
                }

                Spacer(modifier = Modifier.height(6.dp))

                // Legend chips
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    result.landCoverDistribution.forEach { item ->
                        Row(
                            verticalAlignment = Alignment.CenterVertically,
                            horizontalArrangement = Arrangement.spacedBy(4.dp)
                        ) {
                            Box(
                                modifier = Modifier
                                    .size(7.dp)
                                    .clip(CircleShape)
                                    .background(Color(item.colorHex))
                            )
                            Text(
                                text = "${item.name}: ${item.percentage.toInt()}%",
                                style = MaterialTheme.typography.labelSmall,
                                color = TextSecondary,
                                fontSize = 10.sp
                            )
                        }
                    }
                }

                Spacer(modifier = Modifier.height(14.dp))

                // 7. Key Observations & Structures
                Row(
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.spacedBy(6.dp)
                ) {
                    Icon(
                        imageVector = Icons.Default.Search,
                        contentDescription = null,
                        tint = SatelliteCyan,
                        modifier = Modifier.size(15.dp)
                    )
                    Text(
                        text = "Structural & Biophysical Observations",
                        style = MaterialTheme.typography.titleSmall,
                        color = TextPrimary,
                        fontSize = 12.sp,
                        fontWeight = FontWeight.SemiBold
                    )
                }

                Spacer(modifier = Modifier.height(6.dp))

                result.keyObservations.forEach { obs ->
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(vertical = 2.dp),
                        verticalAlignment = Alignment.Top
                    ) {
                        Text(
                            text = "• ",
                            color = SatelliteCyan,
                            fontSize = 12.sp,
                            fontWeight = FontWeight.Bold
                        )
                        Text(
                            text = obs,
                            style = MaterialTheme.typography.bodySmall,
                            color = TextSecondary,
                            lineHeight = 17.sp,
                            fontSize = 12.sp
                        )
                    }
                }

                Spacer(modifier = Modifier.height(12.dp))

                // 8. Environmental Vulnerabilities & Hazards
                Row(
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.spacedBy(6.dp)
                ) {
                    Icon(
                        imageVector = Icons.Default.Warning,
                        contentDescription = null,
                        tint = WarningRed,
                        modifier = Modifier.size(15.dp)
                    )
                    Text(
                        text = "Environmental Hazards & Anomalies",
                        style = MaterialTheme.typography.titleSmall,
                        color = TextPrimary,
                        fontSize = 12.sp,
                        fontWeight = FontWeight.SemiBold
                    )
                }

                Spacer(modifier = Modifier.height(6.dp))

                result.environmentalRisks.forEach { risk ->
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(vertical = 2.dp),
                        verticalAlignment = Alignment.Top
                    ) {
                        Text(
                            text = "▲ ",
                            color = WarningRed,
                            fontSize = 9.sp,
                            modifier = Modifier.padding(top = 2.dp)
                        )
                        Text(
                            text = risk,
                            style = MaterialTheme.typography.bodySmall,
                            color = TextSecondary,
                            lineHeight = 17.sp,
                            fontSize = 12.sp
                        )
                    }
                }

                Spacer(modifier = Modifier.height(12.dp))

                // 9. Recommended Next Steps for Analysts
                Row(
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.spacedBy(6.dp)
                ) {
                    Icon(
                        imageVector = Icons.Default.Lightbulb,
                        contentDescription = null,
                        tint = TelemetryAmber,
                        modifier = Modifier.size(15.dp)
                    )
                    Text(
                        text = "Field Protocol & Monitoring Next Steps",
                        style = MaterialTheme.typography.titleSmall,
                        color = TextPrimary,
                        fontSize = 12.sp,
                        fontWeight = FontWeight.SemiBold
                    )
                }

                Spacer(modifier = Modifier.height(6.dp))

                result.analystRecommendations.forEach { rec ->
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(vertical = 2.dp),
                        verticalAlignment = Alignment.Top
                    ) {
                        Text(
                            text = "→ ",
                            color = TelemetryAmber,
                            fontSize = 12.sp,
                            fontWeight = FontWeight.Bold
                        )
                        Text(
                            text = rec,
                            style = MaterialTheme.typography.bodySmall,
                            color = TextSecondary,
                            lineHeight = 17.sp,
                            fontSize = 12.sp
                        )
                    }
                }

                Spacer(modifier = Modifier.height(14.dp))

                // 10. Interactive Follow-up Toggle
                OutlinedButton(
                    onClick = { showChatSection = !showChatSection },
                    colors = ButtonDefaults.outlinedButtonColors(
                        contentColor = SatelliteCyan
                    ),
                    border = androidx.compose.foundation.BorderStroke(1.dp, SatelliteCyan.copy(alpha = 0.5f)),
                    shape = RoundedCornerShape(10.dp),
                    modifier = Modifier
                        .fillMaxWidth()
                        .testTag("toggle_followup_chat_button")
                ) {
                    Icon(
                        imageVector = Icons.Default.QuestionAnswer,
                        contentDescription = null,
                        modifier = Modifier.size(15.dp)
                    )
                    Spacer(modifier = Modifier.width(8.dp))
                    Text(
                        text = if (showChatSection) "Hide Spectral Inquiry Console" else "Launch Target Feature Inquiry",
                        fontSize = 12.sp
                    )
                }
            }
        }

        // Interactive Inquiry Accordion
        AnimatedVisibility(visible = showChatSection) {
            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(top = 10.dp)
                    .clip(RoundedCornerShape(14.dp))
                    .background(OrbitNavySurface)
                    .border(1.dp, OrbitNavyBorder, RoundedCornerShape(14.dp))
                    .padding(12.dp)
            ) {
                Text(
                    text = "Spectral Telemetry Inquiry",
                    style = MaterialTheme.typography.titleSmall,
                    color = SatelliteCyan,
                    fontSize = 13.sp
                )
                Text(
                    text = "Query localized spectral boundaries, canopy density, or hydrological flow in this orthophoto",
                    style = MaterialTheme.typography.bodySmall,
                    color = TextTertiary,
                    fontSize = 11.sp
                )

                Spacer(modifier = Modifier.height(10.dp))

                // Inquiry thread
                chatMessages.forEach { msg ->
                    val isUser = msg.sender == MessageSender.USER
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(vertical = 4.dp),
                        horizontalArrangement = if (isUser) Arrangement.End else Arrangement.Start
                    ) {
                        Box(
                            modifier = Modifier
                                .fillMaxWidth(0.85f)
                                .clip(
                                    RoundedCornerShape(
                                        topStart = 12.dp,
                                        topEnd = 12.dp,
                                        bottomStart = if (isUser) 12.dp else 2.dp,
                                        bottomEnd = if (isUser) 2.dp else 12.dp
                                    )
                                )
                                .background(if (isUser) SatelliteCyan.copy(alpha = 0.2f) else OrbitNavyCard)
                                .border(
                                    1.dp,
                                    if (isUser) SatelliteCyan.copy(alpha = 0.4f) else OrbitNavyBorder,
                                    RoundedCornerShape(12.dp)
                                )
                                .padding(10.dp)
                        ) {
                            Text(
                                text = msg.text,
                                style = MaterialTheme.typography.bodySmall,
                                color = if (isUser) TextPrimary else TextSecondary,
                                fontSize = 12.sp,
                                lineHeight = 18.sp
                            )
                        }
                    }
                }

                if (isFollowUpLoading) {
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(vertical = 6.dp),
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.spacedBy(8.dp)
                    ) {
                        CircularProgressIndicator(
                            color = SatelliteCyan,
                            strokeWidth = 2.dp,
                            modifier = Modifier.size(16.dp)
                        )
                        Text(
                            text = "Analyzing spatial coordinates and spectral indices...",
                            style = MaterialTheme.typography.labelSmall,
                            color = TextTertiary,
                            fontSize = 11.sp
                        )
                    }
                }

                Spacer(modifier = Modifier.height(8.dp))

                // Input field
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.spacedBy(6.dp)
                ) {
                    OutlinedTextField(
                        value = followUpInput,
                        onValueChange = { followUpInput = it },
                        placeholder = {
                            Text("e.g. What explains the water turbidity variance?", fontSize = 12.sp, color = TextTertiary)
                        },
                        colors = OutlinedTextFieldDefaults.colors(
                            focusedBorderColor = SatelliteCyan,
                            unfocusedBorderColor = OrbitNavyBorder,
                            focusedTextColor = TextPrimary,
                            unfocusedTextColor = TextPrimary
                        ),
                        singleLine = true,
                        modifier = Modifier
                            .weight(1f)
                            .testTag("follow_up_input_field")
                    )

                    IconButton(
                        onClick = {
                            if (followUpInput.isNotBlank() && !isFollowUpLoading) {
                                val text = followUpInput.trim()
                                followUpInput = ""
                                onSendFollowUp(text)
                            }
                        },
                        enabled = followUpInput.isNotBlank() && !isFollowUpLoading,
                        modifier = Modifier
                            .size(46.dp)
                            .clip(RoundedCornerShape(10.dp))
                            .background(if (followUpInput.isNotBlank()) SatelliteCyan else OrbitNavyCard)
                            .testTag("send_follow_up_button")
                    ) {
                        Icon(
                            imageVector = Icons.AutoMirrored.Filled.Send,
                            contentDescription = "Send Follow-up Question",
                            tint = if (followUpInput.isNotBlank()) Color.White else TextTertiary,
                            modifier = Modifier.size(18.dp)
                        )
                    }
                }
            }
        }
    }
}

/**
 * Compact high-tech biophysical index chip (NDVI, NDWI, NDBI, LST).
 */
@Composable
private fun BiophysicalIndexBadge(
    label: String,
    value: String,
    description: String,
    accentColor: Color,
    icon: ImageVector,
    modifier: Modifier = Modifier
) {
    Box(
        modifier = modifier
            .clip(RoundedCornerShape(8.dp))
            .background(OrbitNavyDark)
            .border(0.5.dp, OrbitNavyBorder, RoundedCornerShape(8.dp))
            .padding(horizontal = 6.dp, vertical = 6.dp)
    ) {
        Column(horizontalAlignment = Alignment.CenterHorizontally, modifier = Modifier.fillMaxWidth()) {
            Row(
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.spacedBy(3.dp)
            ) {
                Icon(
                    imageVector = icon,
                    contentDescription = null,
                    tint = accentColor,
                    modifier = Modifier.size(11.dp)
                )
                Text(
                    text = label,
                    fontSize = 9.sp,
                    color = TextSecondary,
                    fontWeight = FontWeight.Bold,
                    fontFamily = FontFamily.Monospace
                )
            }
            Spacer(modifier = Modifier.height(2.dp))
            Text(
                text = value,
                fontSize = 12.sp,
                color = accentColor,
                fontWeight = FontWeight.Bold,
                fontFamily = FontFamily.Monospace
            )
            Text(
                text = description,
                fontSize = 8.sp,
                color = TextTertiary,
                maxLines = 1
            )
        }
    }
}

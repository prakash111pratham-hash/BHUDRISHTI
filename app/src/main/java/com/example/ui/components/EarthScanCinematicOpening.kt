package com.example.ui.components

import androidx.compose.animation.AnimatedVisibility
import androidx.compose.animation.core.Animatable
import androidx.compose.animation.core.FastOutSlowInEasing
import androidx.compose.animation.core.LinearEasing
import androidx.compose.animation.core.RepeatMode
import androidx.compose.animation.core.animateFloat
import androidx.compose.animation.core.infiniteRepeatable
import androidx.compose.animation.core.rememberInfiniteTransition
import androidx.compose.animation.core.tween
import androidx.compose.animation.fadeIn
import androidx.compose.animation.fadeOut
import androidx.compose.foundation.Canvas
import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowForward
import androidx.compose.material.icons.filled.GpsFixed
import androidx.compose.material.icons.filled.Public
import androidx.compose.material.icons.filled.Radar
import androidx.compose.material.icons.filled.Sensors
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableFloatStateOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.drawscope.Stroke
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.R
import com.example.ui.theme.NdviGreen
import com.example.ui.theme.OrbitNavyBorder
import com.example.ui.theme.OrbitNavyDark
import com.example.ui.theme.SatelliteCyan
import com.example.ui.theme.TelemetryAmber
import com.example.ui.theme.TextPrimary
import com.example.ui.theme.TextSecondary
import com.example.ui.theme.TextTertiary
import kotlinx.coroutines.delay

/**
 * Cinematic 3D Earth scan loading screen and animation still for BHUदृष्टि.
 * Features:
 * - Central 3D Earth image displaying transition from cybernetic wireframe to lived-in organic landscapes and urban grids.
 * - Prominent animated glowing horizontal scanning beam (neon cyan laser) sweeping downwards through the globe.
 * - Dynamic data particle trails, laser bloom, and scanning telemetry lines.
 * - Tech camera HUD overlay with 'BHUदृष्टि - Earth-Vision AI' and glowing loading status bar.
 * - Transitions smoothly into the main Earth Observation console.
 */
@Composable
fun EarthScanCinematicOpening(
    onEnterApp: () -> Unit,
    modifier: Modifier = Modifier
) {
    // Progress animation from 0f to 1f over ~4.5 seconds
    val progress = remember { Animatable(0f) }
    var currentPhaseText by remember { mutableStateOf("INITIALIZING SATELLITE TELEMETRY... 12%") }

    // Laser sweep continuous animation
    val infiniteTransition = rememberInfiniteTransition(label = "earth_laser_sweep")
    val laserSweepPosition by infiniteTransition.animateFloat(
        initialValue = 0.28f,
        targetValue = 0.72f,
        animationSpec = infiniteRepeatable(
            animation = tween(durationMillis = 2400, easing = LinearEasing),
            repeatMode = RepeatMode.Reverse
        ),
        label = "laser_y"
    )
    val pulseGlow by infiniteTransition.animateFloat(
        initialValue = 0.7f,
        targetValue = 1.0f,
        animationSpec = infiniteRepeatable(
            animation = tween(durationMillis = 900, easing = FastOutSlowInEasing),
            repeatMode = RepeatMode.Reverse
        ),
        label = "pulse_glow"
    )

    LaunchedEffect(Unit) {
        // Animate progression through telemetry checkpoints
        progress.animateTo(
            targetValue = 1.0f,
            animationSpec = tween(durationMillis = 4200, easing = FastOutSlowInEasing)
        ) {
            val pct = (value * 100).toInt()
            currentPhaseText = when {
                pct < 25 -> "INITIALIZING ISRO & SENTINEL DOWNLINK... $pct%"
                pct in 25..49 -> "TARGETING INDIAN SUBCONTINENT GRID... $pct%"
                pct in 50..75 -> "SCANNING 3D TOPOGRAPHY OF INDIA... $pct%"
                pct in 76..99 -> "SYNCHRONIZING HIMALAYAN TO COASTAL CORRIDORS... $pct%"
                else -> "INDIA SCAN COMPLETE • MISSION CONSOLE READY"
            }
        }
        delay(600)
        onEnterApp()
    }

    Box(
        modifier = modifier
            .fillMaxSize()
            .background(
                Brush.verticalGradient(
                    colors = listOf(
                        Color(0xFFE3F2FD),
                        Color(0xFFFFFFFF),
                        Color(0xFFEDF6FD)
                    )
                )
            )
            .testTag("earth_scan_cinematic_opening")
    ) {
        // 1. India Map Satellite Scan Image
        Image(
            painter = painterResource(id = R.drawable.img_india_sat_scan),
            contentDescription = "India Satellite Multispectral Scan Opening",
            modifier = Modifier.fillMaxSize(),
            contentScale = ContentScale.Crop
        )

        // 2. Dynamic Neon Sky-Blue Laser Beam & Particle Overlay Canvas
        Canvas(
            modifier = Modifier.fillMaxSize()
        ) {
            val width = size.width
            val height = size.height

            // Calculate active horizontal laser scan position
            val laserY = height * laserSweepPosition

            // Horizontal sky-blue scanning laser with soft atmospheric bloom
            val laserCoreHeight = 3.dp.toPx()
            val laserGlowHeight = 26.dp.toPx()

            // Outer laser glow aura
            drawRect(
                brush = Brush.verticalGradient(
                    colors = listOf(
                        Color.Transparent,
                        SatelliteCyan.copy(alpha = 0.22f * pulseGlow),
                        Color(0xFF00B0FF).copy(alpha = 0.55f * pulseGlow),
                        SatelliteCyan.copy(alpha = 0.22f * pulseGlow),
                        Color.Transparent
                    ),
                    startY = laserY - laserGlowHeight,
                    endY = laserY + laserGlowHeight
                ),
                topLeft = Offset(0f, laserY - laserGlowHeight),
                size = androidx.compose.ui.geometry.Size(width, laserGlowHeight * 2)
            )

            // Inner electric laser beam line
            drawLine(
                brush = Brush.horizontalGradient(
                    colors = listOf(
                        Color.Transparent,
                        SatelliteCyan.copy(alpha = 0.85f),
                        Color.White,
                        Color(0xFF80D8FF),
                        Color.Transparent
                    )
                ),
                start = Offset(0f, laserY),
                end = Offset(width, laserY),
                strokeWidth = laserCoreHeight
            )

            // Light particle sparks emitted along laser beam
            val particleCount = 30
            for (i in 0 until particleCount) {
                val seed = (i * 97 + (laserSweepPosition * 1000).toInt()) % 1000
                val px = width * (seed / 1000f)
                val pyOffset = ((i * 31) % 40) - 20
                val pAlpha = ((i % 5) + 1) * 0.18f * pulseGlow
                val pRadius = ((i % 3) + 1.5f).dp.toPx()

                drawCircle(
                    color = if (i % 2 == 0) Color.White.copy(alpha = pAlpha) else Color(0xFF00B0FF).copy(alpha = pAlpha),
                    radius = pRadius,
                    center = Offset(px, laserY + pyOffset)
                )
            }

            // Tech HUD grid tick marks on left and right borders
            val tickSpacing = 28.dp.toPx()
            val tickCount = (height / tickSpacing).toInt()
            for (i in 0..tickCount) {
                val y = i * tickSpacing
                val isMajor = i % 4 == 0
                val tickWidth = if (isMajor) 14.dp.toPx() else 6.dp.toPx()
                val tickAlpha = if (isMajor) 0.5f else 0.2f

                // Left tick
                drawLine(
                    color = SatelliteCyan.copy(alpha = tickAlpha),
                    start = Offset(0f, y),
                    end = Offset(tickWidth, y),
                    strokeWidth = 1.dp.toPx()
                )
                // Right tick
                drawLine(
                    color = SatelliteCyan.copy(alpha = tickAlpha),
                    start = Offset(width - tickWidth, y),
                    end = Offset(width, y),
                    strokeWidth = 1.dp.toPx()
                )
            }
        }

        // 3. Tech HUD Corners
        HudCornerBrackets()

        // 4. Top Header & Glowing Progress Bar
        Column(
            modifier = Modifier
                .align(Alignment.TopCenter)
                .fillMaxWidth()
                .padding(horizontal = 20.dp, vertical = 44.dp),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            // App Title Emblem with India indicator
            Row(
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.spacedBy(8.dp),
                modifier = Modifier
                    .clip(RoundedCornerShape(20.dp))
                    .background(Color.White.copy(alpha = 0.95f))
                    .border(1.5.dp, SatelliteCyan.copy(alpha = 0.8f), RoundedCornerShape(20.dp))
                    .padding(horizontal = 16.dp, vertical = 6.dp)
            ) {
                Box(
                    modifier = Modifier
                        .size(10.dp)
                        .clip(CircleShape)
                        .background(SatelliteCyan)
                )
                Text(
                    text = "BHUदृष्टि • India Orbital Scan",
                    style = MaterialTheme.typography.titleSmall,
                    color = TextPrimary,
                    fontWeight = FontWeight.Bold,
                    letterSpacing = 1.2.sp,
                    fontSize = 14.sp
                )
            }

            Spacer(modifier = Modifier.height(10.dp))

            // Status readout
            Text(
                text = currentPhaseText,
                style = MaterialTheme.typography.labelSmall,
                color = Color.White,
                fontWeight = FontWeight.Bold,
                letterSpacing = 1.2.sp,
                fontSize = 11.sp,
                fontFamily = FontFamily.Monospace,
                textAlign = TextAlign.Center,
                modifier = Modifier
                    .clip(RoundedCornerShape(6.dp))
                    .background(SatelliteCyan.copy(alpha = 0.88f))
                    .padding(horizontal = 12.dp, vertical = 3.dp)
            )

            Spacer(modifier = Modifier.height(8.dp))

            // Progress Bar
            Box(
                modifier = Modifier
                    .fillMaxWidth(0.85f)
                    .height(7.dp)
                    .clip(RoundedCornerShape(4.dp))
                    .background(Color.White.copy(alpha = 0.9f))
                    .border(1.dp, SatelliteCyan.copy(alpha = 0.6f), RoundedCornerShape(4.dp))
            ) {
                Box(
                    modifier = Modifier
                        .fillMaxWidth(progress.value)
                        .height(7.dp)
                        .background(
                            Brush.horizontalGradient(
                                colors = listOf(
                                    SatelliteCyan,
                                    Color(0xFF00B0FF),
                                    Color(0xFF80D8FF)
                                )
                            )
                        )
                )
            }

            Spacer(modifier = Modifier.height(8.dp))

            // Live Floating Telemetry Readout Strip
            Row(
                modifier = Modifier
                    .fillMaxWidth(0.85f)
                    .clip(RoundedCornerShape(8.dp))
                    .background(Color.White.copy(alpha = 0.95f))
                    .border(1.dp, OrbitNavyBorder, RoundedCornerShape(8.dp))
                    .padding(horizontal = 10.dp, vertical = 5.dp),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(
                    text = "ZONE: INDIA 8°-37°N",
                    color = TextPrimary,
                    fontWeight = FontWeight.SemiBold,
                    fontSize = 9.sp,
                    fontFamily = FontFamily.Monospace
                )
                Text(
                    text = "GSD: 0.30m/px",
                    color = NdviGreen,
                    fontWeight = FontWeight.Bold,
                    fontSize = 9.sp,
                    fontFamily = FontFamily.Monospace
                )
                Text(
                    text = "BAND: VNIR+SWIR",
                    color = TelemetryAmber,
                    fontWeight = FontWeight.Bold,
                    fontSize = 9.sp,
                    fontFamily = FontFamily.Monospace
                )
            }
        }

        // 5. Bottom Navigation Control Strip
        Column(
            modifier = Modifier
                .align(Alignment.BottomCenter)
                .fillMaxWidth()
                .padding(horizontal = 24.dp, vertical = 36.dp),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            // Telemetry stream chip
            Row(
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.spacedBy(6.dp),
                modifier = Modifier
                    .clip(RoundedCornerShape(8.dp))
                    .background(Color.White.copy(alpha = 0.95f))
                    .border(1.dp, OrbitNavyBorder, RoundedCornerShape(8.dp))
                    .padding(horizontal = 12.dp, vertical = 6.dp)
            ) {
                Icon(
                    imageVector = Icons.Default.Sensors,
                    contentDescription = null,
                    tint = SatelliteCyan,
                    modifier = Modifier.size(14.dp)
                )
                Text(
                    text = "ISRO & Sentinel-2 Downlink Synced • India Optical Mesh Ready",
                    style = MaterialTheme.typography.labelSmall,
                    color = TextPrimary,
                    fontWeight = FontWeight.Medium,
                    fontSize = 10.sp,
                    fontFamily = FontFamily.Monospace
                )
            }

            Spacer(modifier = Modifier.height(14.dp))

            // Action Button: Instant Enter / Proceed
            Button(
                onClick = onEnterApp,
                colors = ButtonDefaults.buttonColors(
                    containerColor = SatelliteCyan,
                    contentColor = Color.White
                ),
                shape = RoundedCornerShape(12.dp),
                modifier = Modifier
                    .fillMaxWidth(0.9f)
                    .height(48.dp)
                    .testTag("enter_orbital_console_button")
            ) {
                Row(
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    Text(
                        text = if (progress.value < 1f) "ENTER MISSION CONSOLE" else "LAUNCH INDIA OBSERVATION CONSOLE",
                        fontWeight = FontWeight.Bold,
                        fontSize = 13.sp,
                        letterSpacing = 1.sp
                    )
                    Icon(
                        imageVector = Icons.AutoMirrored.Filled.ArrowForward,
                        contentDescription = "Enter App",
                        modifier = Modifier.size(16.dp)
                    )
                }
            }
        }
    }
}

/**
 * Camera HUD corner brackets indicating orbital tracking viewfinder.
 */
@Composable
private fun HudCornerBrackets() {
    Canvas(modifier = Modifier.fillMaxSize()) {
        val bracketSize = 24.dp.toPx()
        val margin = 20.dp.toPx()
        val bracketColor = SatelliteCyan.copy(alpha = 0.45f)
        val strokeWidth = 2.dp.toPx()

        // Top-Left
        drawLine(bracketColor, Offset(margin, margin), Offset(margin + bracketSize, margin), strokeWidth)
        drawLine(bracketColor, Offset(margin, margin), Offset(margin, margin + bracketSize), strokeWidth)

        // Top-Right
        drawLine(bracketColor, Offset(size.width - margin, margin), Offset(size.width - margin - bracketSize, margin), strokeWidth)
        drawLine(bracketColor, Offset(size.width - margin, margin), Offset(size.width - margin, margin + bracketSize), strokeWidth)

        // Bottom-Left
        drawLine(bracketColor, Offset(margin, size.height - margin), Offset(margin + bracketSize, size.height - margin), strokeWidth)
        drawLine(bracketColor, Offset(margin, size.height - margin), Offset(margin, size.height - margin - bracketSize), strokeWidth)

        // Bottom-Right
        drawLine(bracketColor, Offset(size.width - margin, size.height - margin), Offset(size.width - margin - bracketSize, size.height - margin), strokeWidth)
        drawLine(bracketColor, Offset(size.width - margin, size.height - margin), Offset(size.width - margin, size.height - margin - bracketSize), strokeWidth)
    }
}

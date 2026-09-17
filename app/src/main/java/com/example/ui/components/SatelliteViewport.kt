package com.example.ui.components

import androidx.compose.animation.core.LinearEasing
import androidx.compose.animation.core.RepeatMode
import androidx.compose.animation.core.animateFloat
import androidx.compose.animation.core.infiniteRepeatable
import androidx.compose.animation.core.rememberInfiniteTransition
import androidx.compose.animation.core.tween
import androidx.compose.foundation.Canvas
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.gestures.detectTransformGestures
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.CropFree
import androidx.compose.material.icons.filled.GpsFixed
import androidx.compose.material.icons.filled.Radar
import androidx.compose.material.icons.filled.RestartAlt
import androidx.compose.material.icons.filled.ZoomIn
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableFloatStateOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.clipToBounds
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.ColorFilter
import androidx.compose.ui.graphics.ColorMatrix
import androidx.compose.ui.graphics.graphicsLayer
import androidx.compose.ui.input.pointer.pointerInput
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import coil.compose.AsyncImage
import com.example.data.model.SatelliteScene
import com.example.data.model.SpectralBandMode
import com.example.ui.theme.NdviGreen
import com.example.ui.theme.OrbitNavyBorder
import com.example.ui.theme.OrbitNavyCard
import com.example.ui.theme.OrbitNavyDark
import com.example.ui.theme.OrbitNavySurface
import com.example.ui.theme.SatelliteCyan
import com.example.ui.theme.TextPrimary

@Composable
fun SatelliteViewport(
    scene: SatelliteScene,
    spectralMode: SpectralBandMode,
    isRadarScanActive: Boolean,
    onToggleRadarScan: () -> Unit,
    modifier: Modifier = Modifier
) {
    var scale by remember { mutableFloatStateOf(1.0f) }
    var offsetX by remember { mutableFloatStateOf(0f) }
    var offsetY by remember { mutableFloatStateOf(0f) }

    val infiniteTransition = rememberInfiniteTransition(label = "radarScan")
    val scanProgress by infiniteTransition.animateFloat(
        initialValue = 0f,
        targetValue = 1f,
        animationSpec = infiniteRepeatable(
            animation = tween(durationMillis = 2800, easing = LinearEasing),
            repeatMode = RepeatMode.Restart
        ),
        label = "scanLine"
    )

    // Compute ColorFilter according to Remote Sensing spectral band
    val colorFilter: ColorFilter? = remember(spectralMode) {
        when (spectralMode) {
            SpectralBandMode.TRUE_COLOR -> null
            SpectralBandMode.FALSE_COLOR_IR -> {
                // NIR false color: swaps green/red channels and enhances infrared vegetation in red/crimson
                val matrix = ColorMatrix(
                    floatArrayOf(
                        0.2f, 1.8f, 0.1f, 0f, 20f,
                        0.8f, 0.2f, 0.1f, 0f, 0f,
                        0.1f, 0.2f, 0.9f, 0f, 0f,
                        0f, 0f, 0f, 1f, 0f
                    )
                )
                ColorFilter.colorMatrix(matrix)
            }
            SpectralBandMode.NDVI_CONTRAST -> {
                // NDVI contrast: boosts vibrant greens and deep earth tones for vegetation stress mapping
                val matrix = ColorMatrix().apply {
                    setToSaturation(1.85f)
                }
                ColorFilter.colorMatrix(matrix)
            }
            SpectralBandMode.RADAR_SURFACE -> {
                // SAR synthetic radar: high-contrast backscatter grayscale
                val matrix = ColorMatrix().apply {
                    setToSaturation(0f)
                }
                ColorFilter.colorMatrix(matrix)
            }
        }
    }

    Box(
        modifier = modifier
            .fillMaxWidth()
            .height(280.dp)
            .padding(horizontal = 16.dp, vertical = 6.dp)
            .clip(RoundedCornerShape(16.dp))
            .border(1.5.dp, OrbitNavyBorder, RoundedCornerShape(16.dp))
            .background(OrbitNavyDark)
            .testTag("satellite_viewport")
            .clipToBounds()
    ) {
        // Pannable and Zoomable Image Viewport
        Box(
            modifier = Modifier
                .fillMaxSize()
                .pointerInput(Unit) {
                    detectTransformGestures { _, pan, zoom, _ ->
                        scale = (scale * zoom).coerceIn(1.0f, 4.5f)
                        val maxOffset = (scale - 1f) * 450f
                        offsetX = (offsetX + pan.x).coerceIn(-maxOffset, maxOffset)
                        offsetY = (offsetY + pan.y).coerceIn(-maxOffset, maxOffset)
                    }
                }
        ) {
            AsyncImage(
                model = scene.customUri ?: scene.resId,
                contentDescription = "Satellite Imagery for ${scene.title}",
                contentScale = ContentScale.Crop,
                colorFilter = colorFilter,
                modifier = Modifier
                    .fillMaxSize()
                    .graphicsLayer(
                        scaleX = scale,
                        scaleY = scale,
                        translationX = offsetX,
                        translationY = offsetY
                    )
            )

            // Radar Scanning Sweep Overlay (if active)
            if (isRadarScanActive) {
                Canvas(modifier = Modifier.fillMaxSize()) {
                    val y = size.height * scanProgress
                    drawLine(
                        color = SatelliteCyan.copy(alpha = 0.85f),
                        start = Offset(0f, y),
                        end = Offset(size.width, y),
                        strokeWidth = 2.5.dp.toPx()
                    )
                    // Glow gradient behind the scan line
                    drawRect(
                        color = SatelliteCyan.copy(alpha = 0.08f),
                        topLeft = Offset(0f, (y - 35.dp.toPx()).coerceAtLeast(0f)),
                        size = androidx.compose.ui.geometry.Size(size.width, 35.dp.toPx())
                    )
                }
            }

            // Central Targeting Reticle
            Canvas(
                modifier = Modifier
                    .size(40.dp)
                    .align(Alignment.Center)
            ) {
                val stroke = 1.2.dp.toPx()
                val reticleColor = SatelliteCyan.copy(alpha = 0.6f)
                val c = size.width / 2f
                drawLine(reticleColor, Offset(c - 14.dp.toPx(), c), Offset(c + 14.dp.toPx(), c), stroke)
                drawLine(reticleColor, Offset(c, c - 14.dp.toPx()), Offset(c, c + 14.dp.toPx()), stroke)
                drawCircle(reticleColor, radius = 8.dp.toPx(), style = androidx.compose.ui.graphics.drawscope.Stroke(stroke))
            }
        }

        // Top Left Coordinates Overlay Chip
        Surface(
            color = OrbitNavySurface.copy(alpha = 0.92f),
            shape = RoundedCornerShape(8.dp),
            border = androidx.compose.foundation.BorderStroke(1.dp, OrbitNavyBorder),
            modifier = Modifier
                .align(Alignment.TopStart)
                .padding(10.dp)
        ) {
            Text(
                text = "${scene.coordinates} • ${scene.satellitePlatform}",
                color = TextPrimary,
                style = MaterialTheme.typography.labelSmall,
                fontSize = 10.sp,
                modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp)
            )
        }

        // Top Right Zoom Level Indicator & Radar toggle
        Box(
            modifier = Modifier
                .align(Alignment.TopEnd)
                .padding(10.dp)
        ) {
            Surface(
                color = OrbitNavySurface.copy(alpha = 0.92f),
                shape = RoundedCornerShape(8.dp),
                border = androidx.compose.foundation.BorderStroke(1.dp, OrbitNavyBorder)
            ) {
                Text(
                    text = "${String.format("%.1fx", scale)} ZOOM",
                    color = SatelliteCyan,
                    style = MaterialTheme.typography.labelSmall,
                    fontSize = 10.sp,
                    fontWeight = androidx.compose.ui.text.font.FontWeight.Bold,
                    modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp)
                )
            }
        }

        // Bottom Controls Overlay (Reset Zoom, Toggle Radar, Spectral info)
        Surface(
            color = OrbitNavySurface.copy(alpha = 0.92f),
            shape = RoundedCornerShape(10.dp),
            border = androidx.compose.foundation.BorderStroke(1.dp, OrbitNavyBorder),
            modifier = Modifier
                .align(Alignment.BottomEnd)
                .padding(10.dp)
        ) {
            androidx.compose.foundation.layout.Row(
                verticalAlignment = Alignment.CenterVertically,
                modifier = Modifier.padding(4.dp)
            ) {
                if (scale > 1.05f || offsetX != 0f || offsetY != 0f) {
                    IconButton(
                        onClick = {
                            scale = 1.0f
                            offsetX = 0f
                            offsetY = 0f
                        },
                        modifier = Modifier
                            .size(32.dp)
                            .testTag("reset_zoom_button")
                    ) {
                        Icon(
                            imageVector = Icons.Default.RestartAlt,
                            contentDescription = "Reset Zoom",
                            tint = SatelliteCyan,
                            modifier = Modifier.size(18.dp)
                        )
                    }
                }

                IconButton(
                    onClick = onToggleRadarScan,
                    modifier = Modifier
                        .size(32.dp)
                        .testTag("toggle_radar_button")
                ) {
                    Icon(
                        imageVector = Icons.Default.Radar,
                        contentDescription = "Toggle Radar Sweep",
                        tint = if (isRadarScanActive) SatelliteCyan else TextPrimary.copy(alpha = 0.35f),
                        modifier = Modifier.size(18.dp)
                    )
                }
            }
        }
    }
}

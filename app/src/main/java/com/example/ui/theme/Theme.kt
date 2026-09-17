package com.example.ui.theme

import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.lightColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.ui.graphics.Color

private val LightColorScheme = lightColorScheme(
    primary = SatelliteCyan,
    onPrimary = Color.White,
    primaryContainer = Color(0xFFE1F5FE),
    onPrimaryContainer = Color(0xFF01579B),
    secondary = NdviGreen,
    onSecondary = Color.White,
    secondaryContainer = NdviGreenSoft,
    onSecondaryContainer = NdviGreenDim,
    tertiary = TelemetryAmber,
    onTertiary = Color.White,
    background = OrbitNavyDark,
    onBackground = TextPrimary,
    surface = OrbitNavySurface,
    onSurface = TextPrimary,
    surfaceVariant = Color(0xFFF4F9FF),
    onSurfaceVariant = TextSecondary,
    outline = OrbitNavyBorder
)

@Composable
fun MyApplicationTheme(
    darkTheme: Boolean = false,
    dynamicColor: Boolean = false,
    content: @Composable () -> Unit,
) {
    MaterialTheme(
        colorScheme = LightColorScheme,
        typography = Typography,
        content = content
    )
}

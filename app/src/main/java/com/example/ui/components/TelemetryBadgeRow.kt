package com.example.ui.components

import androidx.compose.animation.core.RepeatMode
import androidx.compose.animation.core.animateFloat
import androidx.compose.animation.core.infiniteRepeatable
import androidx.compose.animation.core.rememberInfiniteTransition
import androidx.compose.animation.core.tween
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.CloudDone
import androidx.compose.material.icons.filled.Memory
import androidx.compose.material.icons.filled.Sensors
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.alpha
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.ui.theme.NdviGreen
import com.example.ui.theme.OrbitNavyBorder
import com.example.ui.theme.OrbitNavyCard
import com.example.ui.theme.SatelliteCyan
import com.example.ui.theme.TelemetryAmber

@Composable
fun TelemetryBadgeRow(
    gsdResolution: String,
    spectralModeLabel: String,
    modifier: Modifier = Modifier
) {
    val infiniteTransition = rememberInfiniteTransition(label = "pulse")
    val pulseAlpha by infiniteTransition.animateFloat(
        initialValue = 0.4f,
        targetValue = 1.0f,
        animationSpec = infiniteRepeatable(
            animation = tween(1200),
            repeatMode = RepeatMode.Reverse
        ),
        label = "pulseAlpha"
    )

    Row(
        modifier = modifier
            .fillMaxWidth()
            .padding(horizontal = 16.dp, vertical = 6.dp),
        horizontalArrangement = Arrangement.spacedBy(8.dp),
        verticalAlignment = Alignment.CenterVertically
    ) {
        // Zero GPU Load Badge
        Row(
            modifier = Modifier
                .clip(RoundedCornerShape(8.dp))
                .background(OrbitNavyCard)
                .border(1.dp, NdviGreen.copy(alpha = 0.4f), RoundedCornerShape(8.dp))
                .padding(horizontal = 8.dp, vertical = 5.dp),
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.spacedBy(5.dp)
        ) {
            Box(
                modifier = Modifier
                    .size(7.dp)
                    .clip(CircleShape)
                    .background(NdviGreen)
                    .alpha(pulseAlpha)
            )
            Icon(
                imageVector = Icons.Default.Memory,
                contentDescription = null,
                tint = NdviGreen,
                modifier = Modifier.size(13.dp)
            )
            Text(
                text = "0 MB Local GPU",
                style = MaterialTheme.typography.labelSmall,
                color = NdviGreen,
                fontSize = 11.sp
            )
        }

        // GSD Resolution
        Row(
            modifier = Modifier
                .clip(RoundedCornerShape(8.dp))
                .background(OrbitNavyCard)
                .border(1.dp, OrbitNavyBorder, RoundedCornerShape(8.dp))
                .padding(horizontal = 8.dp, vertical = 5.dp),
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.spacedBy(5.dp)
        ) {
            Icon(
                imageVector = Icons.Default.Sensors,
                contentDescription = null,
                tint = SatelliteCyan,
                modifier = Modifier.size(13.dp)
            )
            Text(
                text = "GSD $gsdResolution",
                style = MaterialTheme.typography.labelSmall,
                color = SatelliteCyan,
                fontSize = 11.sp
            )
        }

        // Cloud Vision Encoded
        Row(
            modifier = Modifier
                .weight(1f, fill = false)
                .clip(RoundedCornerShape(8.dp))
                .background(OrbitNavyCard)
                .border(1.dp, OrbitNavyBorder, RoundedCornerShape(8.dp))
                .padding(horizontal = 8.dp, vertical = 5.dp),
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.spacedBy(5.dp)
        ) {
            Icon(
                imageVector = Icons.Default.CloudDone,
                contentDescription = null,
                tint = TelemetryAmber,
                modifier = Modifier.size(13.dp)
            )
            Text(
                text = "Cloud Vision AI",
                style = MaterialTheme.typography.labelSmall,
                color = TelemetryAmber,
                fontSize = 11.sp,
                maxLines = 1
            )
        }
    }
}

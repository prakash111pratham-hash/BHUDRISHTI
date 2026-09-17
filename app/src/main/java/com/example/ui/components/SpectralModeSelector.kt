package com.example.ui.components

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.data.model.SpectralBandMode
import com.example.ui.theme.NdviGreen
import com.example.ui.theme.OrbitNavyBorder
import com.example.ui.theme.OrbitNavyCard
import com.example.ui.theme.OrbitNavyDark
import com.example.ui.theme.SatelliteCyan
import com.example.ui.theme.TextPrimary
import com.example.ui.theme.TextSecondary
import com.example.ui.theme.TextTertiary

@Composable
fun SpectralModeSelector(
    selectedMode: SpectralBandMode,
    onModeSelected: (SpectralBandMode) -> Unit,
    modifier: Modifier = Modifier
) {
    Column(
        modifier = modifier
            .fillMaxWidth()
            .padding(horizontal = 16.dp, vertical = 4.dp)
    ) {
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Text(
                text = "SPECTRAL BAND SIMULATION",
                style = MaterialTheme.typography.labelSmall,
                color = TextTertiary,
                fontSize = 11.sp,
                letterSpacing = 1.sp
            )
            Text(
                text = selectedMode.bandCombination,
                style = MaterialTheme.typography.labelSmall,
                color = SatelliteCyan,
                fontSize = 11.sp
            )
        }

        LazyRow(
            horizontalArrangement = Arrangement.spacedBy(8.dp),
            contentPadding = PaddingValues(vertical = 6.dp),
            modifier = Modifier.fillMaxWidth()
        ) {
            items(SpectralBandMode.entries.toTypedArray()) { mode ->
                val isSelected = mode == selectedMode
                Box(
                    modifier = Modifier
                        .clip(RoundedCornerShape(10.dp))
                        .background(if (isSelected) SatelliteCyan.copy(alpha = 0.15f) else OrbitNavyCard)
                        .border(
                            width = 1.dp,
                            color = if (isSelected) SatelliteCyan else OrbitNavyBorder,
                            shape = RoundedCornerShape(10.dp)
                        )
                        .clickable { onModeSelected(mode) }
                        .padding(horizontal = 12.dp, vertical = 7.dp)
                        .testTag("spectral_mode_${mode.name.lowercase()}")
                ) {
                    Column {
                        Text(
                            text = mode.label,
                            style = MaterialTheme.typography.labelMedium,
                            color = if (isSelected) SatelliteCyan else TextPrimary,
                            fontSize = 12.sp
                        )
                    }
                }
            }
        }
    }
}

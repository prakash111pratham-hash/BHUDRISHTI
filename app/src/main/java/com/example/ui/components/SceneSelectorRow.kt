package com.example.ui.components

import android.net.Uri
import androidx.activity.compose.rememberLauncherForActivityResult
import androidx.activity.result.PickVisualMediaRequest
import androidx.activity.result.contract.ActivityResultContracts
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.AddPhotoAlternate
import androidx.compose.material.icons.filled.CheckCircle
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import coil.compose.AsyncImage
import com.example.data.model.SatelliteScene
import com.example.ui.theme.NdviGreen
import com.example.ui.theme.OrbitNavyBorder
import com.example.ui.theme.OrbitNavyCard
import com.example.ui.theme.OrbitNavyDark
import com.example.ui.theme.SatelliteCyan
import com.example.ui.theme.TextPrimary
import com.example.ui.theme.TextSecondary
import com.example.ui.theme.TextTertiary

@Composable
fun SceneSelectorRow(
    scenes: List<SatelliteScene>,
    selectedScene: SatelliteScene,
    onSceneSelected: (SatelliteScene) -> Unit,
    onCustomImageSelected: (Uri) -> Unit,
    modifier: Modifier = Modifier
) {
    val photoPickerLauncher = rememberLauncherForActivityResult(
        contract = ActivityResultContracts.PickVisualMedia()
    ) { uri: Uri? ->
        if (uri != null) {
            onCustomImageSelected(uri)
        }
    }

    Column(
        modifier = modifier
            .fillMaxWidth()
            .padding(vertical = 4.dp)
    ) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = 16.dp),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Text(
                text = "TARGET SATELLITE SCENES",
                style = MaterialTheme.typography.labelSmall,
                color = TextTertiary,
                fontSize = 11.sp,
                letterSpacing = 1.sp
            )
            Text(
                text = "${scenes.size} Scenes Ready",
                style = MaterialTheme.typography.labelSmall,
                color = SatelliteCyan,
                fontSize = 11.sp
            )
        }

        Spacer(modifier = Modifier.height(6.dp))

        LazyRow(
            horizontalArrangement = Arrangement.spacedBy(10.dp),
            contentPadding = PaddingValues(horizontal = 16.dp),
            modifier = Modifier.fillMaxWidth()
        ) {
            // Upload Custom Button
            item {
                Box(
                    modifier = Modifier
                        .width(135.dp)
                        .height(115.dp)
                        .clip(RoundedCornerShape(12.dp))
                        .background(OrbitNavyDark)
                        .border(1.dp, OrbitNavyBorder, RoundedCornerShape(12.dp))
                        .clickable {
                            photoPickerLauncher.launch(
                                PickVisualMediaRequest(ActivityResultContracts.PickVisualMedia.ImageOnly)
                            )
                        }
                        .padding(10.dp)
                        .testTag("upload_satellite_tile_button"),
                    contentAlignment = Alignment.Center
                ) {
                    Column(
                        horizontalAlignment = Alignment.CenterHorizontally,
                        verticalArrangement = Arrangement.Center
                    ) {
                        Icon(
                            imageVector = Icons.Default.AddPhotoAlternate,
                            contentDescription = "Upload Custom Satellite Image",
                            tint = SatelliteCyan,
                            modifier = Modifier.size(28.dp)
                        )
                        Spacer(modifier = Modifier.height(6.dp))
                        Text(
                            text = "Import Tile",
                            style = MaterialTheme.typography.labelMedium,
                            color = TextPrimary,
                            fontSize = 12.sp
                        )
                        Text(
                            text = "Photo Picker",
                            style = MaterialTheme.typography.labelSmall,
                            color = TextSecondary,
                            fontSize = 10.sp
                        )
                    }
                }
            }

            // Preset scenes
            items(scenes) { scene ->
                val isSelected = scene.id == selectedScene.id
                Box(
                    modifier = Modifier
                        .width(170.dp)
                        .height(115.dp)
                        .clip(RoundedCornerShape(12.dp))
                        .background(OrbitNavyCard)
                        .border(
                            width = if (isSelected) 1.8.dp else 1.dp,
                            color = if (isSelected) SatelliteCyan else OrbitNavyBorder,
                            shape = RoundedCornerShape(12.dp)
                        )
                        .clickable { onSceneSelected(scene) }
                        .testTag("scene_card_${scene.id}")
                ) {
                    AsyncImage(
                        model = scene.customUri ?: scene.resId,
                        contentDescription = scene.title,
                        contentScale = ContentScale.Crop,
                        modifier = Modifier
                            .fillMaxWidth()
                            .height(65.dp)
                    )

                    // Scrim gradient overlay on text
                    Box(
                        modifier = Modifier
                            .fillMaxWidth()
                            .height(50.dp)
                            .align(Alignment.BottomCenter)
                            .background(OrbitNavyCard)
                            .padding(horizontal = 8.dp, vertical = 6.dp)
                    ) {
                        Column {
                            Text(
                                text = scene.title,
                                style = MaterialTheme.typography.labelMedium,
                                color = if (isSelected) SatelliteCyan else TextPrimary,
                                fontSize = 11.sp,
                                maxLines = 1
                            )
                            Text(
                                text = scene.domainCategory,
                                style = MaterialTheme.typography.labelSmall,
                                color = TextSecondary,
                                fontSize = 10.sp,
                                maxLines = 1
                            )
                        }
                    }

                    if (isSelected) {
                        Icon(
                            imageVector = Icons.Default.CheckCircle,
                            contentDescription = "Selected",
                            tint = SatelliteCyan,
                            modifier = Modifier
                                .size(18.dp)
                                .align(Alignment.TopEnd)
                                .padding(3.dp)
                        )
                    }
                }
            }
        }
    }
}

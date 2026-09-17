package com.example.data.local

import androidx.room.Entity
import androidx.room.PrimaryKey

@Entity(tableName = "satellite_analyses")
data class AnalysisRecord(
    @PrimaryKey(autoGenerate = true)
    val id: Long = 0,
    val sceneTitle: String,
    val coordinates: String,
    val queryPrompt: String,
    val plainSummary: String,
    val observationsJson: String,
    val landCoverJson: String,
    val spectralBand: String,
    val timestamp: Long = System.currentTimeMillis()
)

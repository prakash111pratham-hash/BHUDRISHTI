package com.example.data.model

data class LandCoverCategory(
    val name: String,
    val percentage: Float,
    val colorHex: Long
)

data class AnalysisResult(
    val query: String,
    val plainSummary: String,
    val keyObservations: List<String>,
    val landCoverDistribution: List<LandCoverCategory>,
    val environmentalRisks: List<String>,
    val analystRecommendations: List<String>,
    val localGpuMemoryMb: Int = 0,
    val cloudLatencyMs: Long = 850L,
    val modelSignature: String = "Sentinel-2 MSI / Landsat-9 OLI-2 (Multimodal Vision)",
    val timestamp: Long = System.currentTimeMillis(),
    val ndviIndex: Float = 0.68f,
    val ndwiIndex: Float = 0.32f,
    val ndbiIndex: Float = -0.18f,
    val surfaceTempCelsius: Float = 25.4f,
    val radiometricQuality: Float = 98.7f,
    val processingLevel: String = "Level-2A (Bottom-of-Atmosphere Reflectance)",
    val geoCoordinates: String = "",
    val geographicRegion: String = "",
    val googleMapsLocationUri: String? = null,
    val googleMapsGroundingSummary: String? = null
)

data class ChatMessage(
    val id: String = java.util.UUID.randomUUID().toString(),
    val sender: MessageSender,
    val text: String,
    val timestamp: Long = System.currentTimeMillis()
)

enum class MessageSender {
    USER,
    REMOTE_SENSING_AI
}

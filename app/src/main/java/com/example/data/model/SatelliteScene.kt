package com.example.data.model

import android.net.Uri
import com.example.R

enum class SpectralBandMode(
    val label: String,
    val description: String,
    val bandCombination: String
) {
    TRUE_COLOR(
        label = "True Color (RGB)",
        description = "Natural visible red, green, and blue spectrum as seen by human eye",
        bandCombination = "B4-B3-B2"
    ),
    FALSE_COLOR_IR(
        label = "False Color (NIR)",
        description = "Near-Infrared band highlights photosynthetic health and vegetation biomass in red",
        bandCombination = "B8-B4-B3"
    ),
    NDVI_CONTRAST(
        label = "NDVI Contrast",
        description = "Normalized Difference Vegetation Index isolating chlorophyllic vigor vs bare terrain",
        bandCombination = "(NIR-Red)/(NIR+Red)"
    ),
    RADAR_SURFACE(
        label = "Synthetic SAR",
        description = "Simulated high-frequency radar surface roughness & moisture backscatter",
        bandCombination = "VV/VH Polarized"
    )
}

data class SatelliteScene(
    val id: String,
    val title: String,
    val subtitle: String,
    val resId: Int? = null,
    val customUri: Uri? = null,
    val coordinates: String,
    val gsdResolution: String,
    val satellitePlatform: String,
    val defaultQuerySuggestions: List<String>,
    val domainCategory: String,
    val geographicLocation: String = "Global Observation Target",
    val googleMapsUrl: String = "https://www.google.com/maps",
    val baseNdvi: Float = 0.50f,
    val baseNdwi: Float = 0.20f,
    val baseNdbi: Float = 0.10f,
    val baseSurfaceTemp: Float = 24.5f
)

object PresetSatelliteScenes {
    val all = listOf(
        SatelliteScene(
            id = "urban_port",
            title = "Metropolis Port & Estuary",
            subtitle = "Coastal urban development, shipping harbor & marine siltation",
            resId = R.drawable.sat_urban_port,
            coordinates = "37°46'30\"N, 122°18'22\"W",
            gsdResolution = "0.3 m/px",
            satellitePlatform = "WorldView-3 / Sentinel-2 MSI",
            defaultQuerySuggestions = listOf(
                "Summarize urban sprawl and port logistics in plain words",
                "Detect water sediment plumes and vessel wakes in the harbor",
                "Estimate ratio of industrial vs residential density",
                "Assess coastal flooding risk and shoreline erosion"
            ),
            domainCategory = "Urban & Coastal",
            geographicLocation = "Port of Oakland & San Francisco Bay, California, USA",
            googleMapsUrl = "https://www.google.com/maps/search/?api=1&query=37.7750,-122.3061",
            baseNdvi = 0.18f,
            baseNdwi = 0.62f,
            baseNdbi = 0.74f,
            baseSurfaceTemp = 21.8f
        ),
        SatelliteScene(
            id = "agriculture_pivot",
            title = "Center-Pivot Farmlands",
            subtitle = "Intensive agricultural crop circles & irrigation networks",
            resId = R.drawable.sat_crop_fields,
            coordinates = "36°21'15\"N, 100°45'08\"W",
            gsdResolution = "0.5 m/px",
            satellitePlatform = "Landsat-9 OLI-2 / Sentinel-2A",
            defaultQuerySuggestions = listOf(
                "Analyze crop health and irrigation uniformity across circles",
                "Identify unplanted or stressed agricultural sectors",
                "Explain the vegetation density in simple layman language",
                "Detect water table stress and soil moisture variances"
            ),
            domainCategory = "Agriculture & NDVI",
            geographicLocation = "High Plains Ogallala Aquifer, Texas-Oklahoma, USA",
            googleMapsUrl = "https://www.google.com/maps/search/?api=1&query=36.3541,-100.7522",
            baseNdvi = 0.81f,
            baseNdwi = 0.14f,
            baseNdbi = -0.22f,
            baseSurfaceTemp = 28.3f
        ),
        SatelliteScene(
            id = "rainforest_basin",
            title = "Tropical Canopy & Delta",
            subtitle = "Rainforest river basin, logging access corridors & deforestation",
            resId = R.drawable.sat_forest_river,
            coordinates = "03°12'44\"S, 60°02'19\"W",
            gsdResolution = "0.4 m/px",
            satellitePlatform = "PlanetScope / Sentinel-2 SWIR",
            defaultQuerySuggestions = listOf(
                "Explain the deforestation boundary in simple natural language",
                "Evaluate river sedimentation and erosion along the banks",
                "Identify illegal logging roads or clearcut corridors",
                "Calculate remaining dense canopy vs cleared land"
            ),
            domainCategory = "Forestry & Climate",
            geographicLocation = "Amazon Basin River Confluence, Amazonas, Brazil",
            googleMapsUrl = "https://www.google.com/maps/search/?api=1&query=-3.2122,-60.0386",
            baseNdvi = 0.89f,
            baseNdwi = 0.48f,
            baseNdbi = -0.45f,
            baseSurfaceTemp = 25.1f
        )
    )
}

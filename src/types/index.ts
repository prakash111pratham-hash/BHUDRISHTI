export type SpectralBandModeKey = 
  | 'TRUE_COLOR' 
  | 'FALSE_COLOR_IR' 
  | 'NDVI_CONTRAST' 
  | 'RADAR_SURFACE';

export interface SpectralBandMode {
  key: SpectralBandModeKey;
  label: string;
  description: string;
  bandCombination: string;
}

export const SPECTRAL_MODES: Record<SpectralBandModeKey, SpectralBandMode> = {
  TRUE_COLOR: {
    key: 'TRUE_COLOR',
    label: 'True Color (RGB)',
    description: 'Natural visible red, green, and blue spectrum as seen by human eye',
    bandCombination: 'B4-B3-B2'
  },
  FALSE_COLOR_IR: {
    key: 'FALSE_COLOR_IR',
    label: 'False Color (NIR)',
    description: 'Near-Infrared band highlights photosynthetic health and vegetation biomass in red',
    bandCombination: 'B8-B4-B3'
  },
  NDVI_CONTRAST: {
    key: 'NDVI_CONTRAST',
    label: 'NDVI Contrast',
    description: 'Normalized Difference Vegetation Index isolating chlorophyllic vigor vs bare terrain',
    bandCombination: '(NIR-Red)/(NIR+Red)'
  },
  RADAR_SURFACE: {
    key: 'RADAR_SURFACE',
    label: 'Synthetic SAR',
    description: 'Simulated high-frequency radar surface roughness & moisture backscatter',
    bandCombination: 'VV/VH Polarized'
  }
};

export interface SatelliteScene {
  id: string;
  title: string;
  subtitle: string;
  imageSrc: string;
  isCustom?: boolean;
  coordinates: string;
  gsdResolution: string;
  satellitePlatform: string;
  defaultQuerySuggestions: string[];
  domainCategory: string;
  geographicLocation: string;
  googleMapsUrl: string;
  baseNdvi: number;
  baseNdwi: number;
  baseNdbi: number;
  baseSurfaceTemp: number;
}

export const PRESET_SCENES: SatelliteScene[] = [
  {
    id: 'urban_port',
    title: 'Metropolis Port & Estuary',
    subtitle: 'Coastal urban development, shipping harbor & marine siltation',
    imageSrc: '/assets/sat_urban_port.jpg',
    coordinates: '37°46\'30"N, 122°18\'22"W',
    gsdResolution: '0.3 m/px',
    satellitePlatform: 'WorldView-3 / Sentinel-2 MSI',
    defaultQuerySuggestions: [
      'Summarize urban sprawl and port logistics in plain words',
      'Detect water sediment plumes and vessel wakes in the harbor',
      'Estimate ratio of industrial vs residential density',
      'Assess coastal flooding risk and shoreline erosion'
    ],
    domainCategory: 'Urban & Coastal',
    geographicLocation: 'Port of Oakland & San Francisco Bay, California, USA',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=37.7750,-122.3061',
    baseNdvi: 0.18,
    baseNdwi: 0.62,
    baseNdbi: 0.74,
    baseSurfaceTemp: 21.8
  },
  {
    id: 'agriculture_pivot',
    title: 'Center-Pivot Farmlands',
    subtitle: 'Intensive agricultural crop circles & irrigation networks',
    imageSrc: '/assets/sat_crop_fields.jpg',
    coordinates: '36°21\'15"N, 100°45\'08"W',
    gsdResolution: '0.5 m/px',
    satellitePlatform: 'Landsat-9 OLI-2 / Sentinel-2A',
    defaultQuerySuggestions: [
      'Analyze crop health and irrigation uniformity across circles',
      'Identify unplanted or stressed agricultural sectors',
      'Explain the vegetation density in simple layman language',
      'Detect water table stress and soil moisture variances'
    ],
    domainCategory: 'Agriculture & NDVI',
    geographicLocation: 'High Plains Ogallala Aquifer, Texas-Oklahoma, USA',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=36.3541,-100.7522',
    baseNdvi: 0.81,
    baseNdwi: 0.14,
    baseNdbi: -0.22,
    baseSurfaceTemp: 28.3
  },
  {
    id: 'rainforest_basin',
    title: 'Tropical Canopy & Delta',
    subtitle: 'Rainforest river basin, logging access corridors & deforestation',
    imageSrc: '/assets/sat_forest_river.jpg',
    coordinates: '03°12\'44"S, 60°02\'19"W',
    gsdResolution: '0.4 m/px',
    satellitePlatform: 'PlanetScope / Sentinel-2 SWIR',
    defaultQuerySuggestions: [
      'Explain the deforestation boundary in simple natural language',
      'Evaluate river sedimentation and erosion along the banks',
      'Identify illegal logging roads or clearcut corridors',
      'Calculate remaining dense canopy vs cleared land'
    ],
    domainCategory: 'Forestry & Climate',
    geographicLocation: 'Amazon Basin River Confluence, Amazonas, Brazil',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=-3.2122,-60.0386',
    baseNdvi: 0.89,
    baseNdwi: 0.48,
    baseNdbi: -0.45,
    baseSurfaceTemp: 25.1
  }
];

export interface LandCoverCategory {
  name: string;
  percentage: number;
  colorHex: string;
}

export interface AnalysisResult {
  query: string;
  plainSummary: string;
  keyObservations: string[];
  landCoverDistribution: LandCoverCategory[];
  environmentalRisks: string[];
  analystRecommendations: string[];
  localGpuMemoryMb: number;
  cloudLatencyMs: number;
  modelSignature: string;
  timestamp: number;
  ndviIndex: number;
  ndwiIndex: number;
  ndbiIndex: number;
  surfaceTempCelsius: number;
  radiometricQuality: number;
  processingLevel: string;
  geoCoordinates: string;
  geographicRegion: string;
  googleMapsLocationUri: string | null;
  googleMapsGroundingSummary: string | null;
}

export interface ChatMessage {
  id: string;
  sender: 'USER' | 'REMOTE_SENSING_AI';
  text: string;
  timestamp: number;
}

export interface AnalysisRecord {
  id: number;
  sceneTitle: string;
  coordinates: string;
  queryPrompt: string;
  plainSummary: string;
  observationsJson: string;
  landCoverJson: string;
  spectralBand: string;
  timestamp: number;
}

export type ActivePage = 'CONSOLE' | 'TEMPORAL' | 'DOSSIER' | 'ASSISTANTS';

export interface InspectorPoint {
  xPct: number;
  yPct: number;
  coordinates: string;
  ndvi: number;
  ndwi: number;
  ndbi: number;
  surfaceTemp: number;
  surfaceType: string;
  confidence: number;
  colorHex: string;
}

export interface TemporalYearData {
  year: number;
  label: string;
  waterLevelDelta: number; // percentage change relative to baseline
  vegetationDelta: number;
  urbanDensityDelta: number;
  avgTempCelsius: number;
  riskSeverity: 'LOW' | 'MODERATE' | 'SEVERE' | 'CRITICAL';
  briefing: string;
}

export interface LocationRevisitRecord {
  id: string;
  sceneId: string;
  locationName: string;
  coordinates: string;
  initialTimestamp: number;
  recentTimestamp: number;
  yearsSpan: number;
  canopyLossPct: number;
  urbanExpansionPct: number;
  waterMoistureShiftPct: number;
  temperatureDriftCelsius: number;
  aiComparativeAssessment: string;
  pastImageSrc: string;
  recentImageSrc: string;
}

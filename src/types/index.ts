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

export interface DetectedLocationData {
  locationName: string;
  coordinates: string;
  latitude: number;
  longitude: number;
  googleMapsUrl: string;
  embedUrl: string;
  satelliteEmbedUrl?: string;
  vicinityLandmarks: string[];
  bodiesOfWater: string[];
  transitArteries: string[];
  topologicalSummary: string;
}

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
  embedMapsUrl?: string;
  satelliteEmbedUrl?: string;
  detectedLocation?: DetectedLocationData;
  baseNdvi: number;
  baseNdwi: number;
  baseNdbi: number;
  baseSurfaceTemp: number;
}

export const PRESET_SCENES: SatelliteScene[] = [
  {
    id: 'mumbai_port',
    title: 'Mumbai Port & Estuary',
    subtitle: 'Coastal container shipping logistics, marine siltation & urban bay',
    imageSrc: '/assets/sat_urban_port.jpg',
    coordinates: '18°57\'00"N, 72°51\'18"E',
    gsdResolution: '0.33 m/px',
    satellitePlatform: 'WorldView-3 / Sentinel-2 MSI',
    defaultQuerySuggestions: [
      'Summarize urban sprawl and port logistics in plain words',
      'Detect water sediment plumes and vessel wakes in the harbor',
      'Estimate ratio of industrial vs residential density',
      'Complex: spectral query'
    ],
    domainCategory: 'Urban & Coastal Marine',
    geographicLocation: 'Mumbai Port & Coastal Estuary, Maharashtra, India',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=18.9500,72.8550',
    embedMapsUrl: 'https://maps.google.com/maps?q=18.9500,72.8550&hl=en&z=14&output=embed',
    satelliteEmbedUrl: 'https://maps.google.com/maps?q=18.9500,72.8550&t=k&hl=en&z=14&output=embed',
    detectedLocation: {
      locationName: 'Mumbai Port Trust & Harbor Basin, Mumbai, Maharashtra 400001, India',
      coordinates: '18°57\'00"N, 72°51\'18"E',
      latitude: 18.9500,
      longitude: 72.8550,
      googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=18.9500,72.8550',
      embedUrl: 'https://maps.google.com/maps?q=18.9500,72.8550&hl=en&z=14&output=embed',
      satelliteEmbedUrl: 'https://maps.google.com/maps?q=18.9500,72.8550&t=k&hl=en&z=14&output=embed',
      vicinityLandmarks: ['Mumbai Port Trust Outer Basin', 'Indira Dock', 'Gateway of India Approach', 'Elephanta Channel'],
      bodiesOfWater: ['Thane Creek', 'Arabian Sea Harbor', 'Mumbai Harbor Channel'],
      transitArteries: ['Eastern Freeway', 'P D\'Mello Road', 'Harbour Railway Line'],
      topologicalSummary: 'Deepwater container terminal and breakwater logistics harbor with estuarine tidal flats and urban maritime waterfront.'
    },
    baseNdvi: 0.18,
    baseNdwi: 0.62,
    baseNdbi: 0.74,
    baseSurfaceTemp: 21.8
  },
  {
    id: 'powai_urban',
    title: 'Mumbai Powai & Urban Canopy',
    subtitle: 'Elevated urban canopy, residential high-rises & Powai lake watershed',
    imageSrc: '/assets/mumbai_aerial_landscape.jpg',
    coordinates: '19°07\'38"N, 72°54\'28"E',
    gsdResolution: '0.30 m/px',
    satellitePlatform: 'WorldView-3 / Sentinel-2 MSI',
    defaultQuerySuggestions: [
      'Summarize residential buildings and tree canopy in simple words',
      'Detect water body boundaries of Powai lake and hills in the background',
      'Estimate ratio of dense green forest canopy vs built structures',
      'Assess atmospheric haze and urban vegetation distribution'
    ],
    domainCategory: 'Urban & Environmental Canopy',
    geographicLocation: 'Powai, Sanjay Gandhi National Park Ridge, Mumbai, Maharashtra, India',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=19.1272,72.9078',
    embedMapsUrl: 'https://maps.google.com/maps?q=19.1272,72.9078&hl=en&z=14&output=embed',
    satelliteEmbedUrl: 'https://maps.google.com/maps?q=19.1272,72.9078&t=k&hl=en&z=14&output=embed',
    detectedLocation: {
      locationName: 'Powai Lake & Hiranandani Gardens, Powai, Mumbai, Maharashtra 400076, India',
      coordinates: '19°07\'38"N, 72°54\'28"E',
      latitude: 19.1272,
      longitude: 72.9078,
      googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=19.1272,72.9078',
      embedUrl: 'https://maps.google.com/maps?q=19.1272,72.9078&hl=en&z=14&output=embed',
      satelliteEmbedUrl: 'https://maps.google.com/maps?q=19.1272,72.9078&t=k&hl=en&z=14&output=embed',
      vicinityLandmarks: ['Powai Lake', 'IIT Bombay Main Campus', 'Hiranandani Gardens Complex', 'Sanjay Gandhi National Park Ridge'],
      bodiesOfWater: ['Powai Lake', 'Vihar Lake Catchment', 'Mithi River Outflow'],
      transitArteries: ['Jogeshwari–Vikhroli Link Road (JVLR)', 'Adi Shankaracharya Marg'],
      topologicalSummary: 'Subtropical freshwater lake basin framed by dense urban high-rise towers and Sanjay Gandhi National Park basalt ridges.'
    },
    baseNdvi: 0.48,
    baseNdwi: 0.52,
    baseNdbi: 0.36,
    baseSurfaceTemp: 23.4
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
    embedMapsUrl: 'https://maps.google.com/maps?q=36.3541,-100.7522&hl=en&z=14&output=embed',
    satelliteEmbedUrl: 'https://maps.google.com/maps?q=36.3541,-100.7522&t=k&hl=en&z=14&output=embed',
    detectedLocation: {
      locationName: 'Ogallala Aquifer Center-Pivot Farmlands, Perryton, Texas 79070, USA',
      coordinates: '36°21\'15"N, 100°45\'08"W',
      latitude: 36.3541,
      longitude: -100.7522,
      googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=36.3541,-100.7522',
      embedUrl: 'https://maps.google.com/maps?q=36.3541,-100.7522&hl=en&z=14&output=embed',
      satelliteEmbedUrl: 'https://maps.google.com/maps?q=36.3541,-100.7522&t=k&hl=en&z=14&output=embed',
      vicinityLandmarks: ['Perryton High Plains Elevators', 'Canadian River Basin Plains', 'Ogallala Aquifer Wellheads'],
      bodiesOfWater: ['Wolf Creek Watershed', 'Playa Lake Depressions'],
      transitArteries: ['US Highway 83', 'Texas State Highway 15', 'County Farm Roads'],
      topologicalSummary: 'Geometric circular center-pivot irrigated crop fields forming high-contrast circular agronomic mosaics on flat high plains.'
    },
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
    embedMapsUrl: 'https://maps.google.com/maps?q=-3.2122,-60.0386&hl=en&z=14&output=embed',
    satelliteEmbedUrl: 'https://maps.google.com/maps?q=-3.2122,-60.0386&t=k&hl=en&z=14&output=embed',
    detectedLocation: {
      locationName: 'Rio Negro & Amazon River Basin, Manaus, Amazonas 69000-000, Brazil',
      coordinates: '03°12\'44"S, 60°02\'19"W',
      latitude: -3.2122,
      longitude: -60.0386,
      googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=-3.2122,-60.0386',
      embedUrl: 'https://maps.google.com/maps?q=-3.2122,-60.0386&hl=en&z=14&output=embed',
      satelliteEmbedUrl: 'https://maps.google.com/maps?q=-3.2122,-60.0386&t=k&hl=en&z=14&output=embed',
      vicinityLandmarks: ['Encontro das Águas Confluence', 'Anavilhanas Archipelago Margin', 'Adolpho Ducke Forest Reserve'],
      bodiesOfWater: ['Rio Negro', 'Amazon River (Rio Solimões)', 'Tarumã-Açu River'],
      transitArteries: ['AM-070 Highway', 'Manaus Floating Port Terminal', 'Rio Negro Bridge'],
      topologicalSummary: 'Dense primary tropical rainforest canopy intersected by high-sediment river corridors and dendritic drainage tributaries.'
    },
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
  embedMapsUrl?: string;
  detectedLocation?: DetectedLocationData;
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

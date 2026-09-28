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
    title: 'Mumbai JNPT Port & Container Basin',
    subtitle: 'Nadir top-down orthophoto: Container docks, gantry cranes & marine fairway',
    imageSrc: '/assets/sat_urban_port.jpg',
    coordinates: '18°56\'54"N, 72°56\'58"E',
    gsdResolution: '0.33 m/px',
    satellitePlatform: 'Copernicus Sentinel-2 / High-Res Orthophoto',
    defaultQuerySuggestions: [
      'Summarize container berths, vessel docks, and port logistics in plain words',
      'Detect water sediment plumes and vessel wakes in the harbor fairway',
      'Estimate ratio of paved industrial container storage vs water basin',
      'Assess ship berthing capacity and gantry crane operations'
    ],
    domainCategory: 'Urban & Coastal Marine',
    geographicLocation: 'Jawaharlal Nehru Port (JNPT), Mumbai Harbour, Maharashtra, India',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=18.9490,72.9490',
    embedMapsUrl: 'https://maps.google.com/maps?q=18.9490,72.9490&hl=en&z=14&output=embed',
    satelliteEmbedUrl: 'https://maps.google.com/maps?q=18.9490,72.9490&t=k&hl=en&z=14&output=embed',
    detectedLocation: {
      locationName: 'Jawaharlal Nehru Port Trust (JNPT) & Container Harbor, Navi Mumbai, Maharashtra 400707, India',
      coordinates: '18°56\'54"N, 72°56\'58"E',
      latitude: 18.9490,
      longitude: 72.9490,
      googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=18.9490,72.9490',
      embedUrl: 'https://maps.google.com/maps?q=18.9490,72.9490&hl=en&z=14&output=embed',
      satelliteEmbedUrl: 'https://maps.google.com/maps?q=18.9490,72.9490&t=k&hl=en&z=14&output=embed',
      vicinityLandmarks: ['JNPT Main Container Terminal Berths', 'Nhava Sheva Rail Freight Corridor', 'Elephanta Navigation Channel', 'Mumbai Port Trust Outer Roads'],
      bodiesOfWater: ['Thane Creek / Elephanta Channel', 'Arabian Sea Harbor', 'Nhava Creek Basin'],
      transitArteries: ['Port Access Freeway', 'Dedicated Freight Corridor (DFC)', 'JNPT Expressway'],
      topologicalSummary: 'Strict 90° nadir satellite orthophoto of India’s premier container port, showing docked cargo vessels, container yards, and tidal estuarine waters.'
    },
    baseNdvi: 0.14,
    baseNdwi: 0.68,
    baseNdbi: 0.78,
    baseSurfaceTemp: 22.4
  },
  {
    id: 'powai_urban',
    title: 'Mumbai Powai & Urban Canopy',
    subtitle: 'Nadir orthophoto: Powai Lake freshwater basin, IIT Bombay campus & green ridge',
    imageSrc: '/assets/mumbai_aerial_landscape.jpg',
    coordinates: '19°07\'38"N, 72°54\'28"E',
    gsdResolution: '0.30 m/px',
    satellitePlatform: 'Copernicus Sentinel-2 / Cartosat-2E',
    defaultQuerySuggestions: [
      'Summarize residential buildings and tree canopy in simple words',
      'Detect water body boundaries of Powai lake and hills in the background',
      'Estimate ratio of dense green forest canopy vs built structures',
      'Assess atmospheric haze and urban vegetation distribution'
    ],
    domainCategory: 'Urban & Environmental Canopy',
    geographicLocation: 'Powai Lake & IIT Bombay, Mumbai, Maharashtra 400076, India',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=19.1272,72.9078',
    embedMapsUrl: 'https://maps.google.com/maps?q=19.1272,72.9078&hl=en&z=15&output=embed',
    satelliteEmbedUrl: 'https://maps.google.com/maps?q=19.1272,72.9078&t=k&hl=en&z=15&output=embed',
    detectedLocation: {
      locationName: 'Powai Lake & Hiranandani Gardens, Powai, Mumbai, Maharashtra 400076, India',
      coordinates: '19°07\'38"N, 72°54\'28"E',
      latitude: 19.1272,
      longitude: 72.9078,
      googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=19.1272,72.9078',
      embedUrl: 'https://maps.google.com/maps?q=19.1272,72.9078&hl=en&z=15&output=embed',
      satelliteEmbedUrl: 'https://maps.google.com/maps?q=19.1272,72.9078&t=k&hl=en&z=15&output=embed',
      vicinityLandmarks: ['Powai Lake Freshwater Basin', 'IIT Bombay Main Academic Area', 'Hiranandani Complex Towers', 'Sanjay Gandhi National Park Foothills'],
      bodiesOfWater: ['Powai Lake Basin', 'Vihar Lake Catchment Canal', 'Mithi River Drainage Outflow'],
      transitArteries: ['Jogeshwari–Vikhroli Link Road (JVLR)', 'Adi Shankaracharya Marg', 'Saki Vihar Road'],
      topologicalSummary: 'High-resolution vertical nadir satellite orthophoto over Powai freshwater reservoir framed by IIT Bombay forested campus and dense urban infrastructure.'
    },
    baseNdvi: 0.48,
    baseNdwi: 0.52,
    baseNdbi: 0.36,
    baseSurfaceTemp: 23.4
  },
  {
    id: 'agriculture_pivot',
    title: 'Punjab Agricultural Breadbasket',
    subtitle: 'Nadir orthophoto: Irrigated wheat-paddy mosaics & canal networks, Ludhiana',
    imageSrc: '/assets/sat_crop_fields.jpg',
    coordinates: '30°54\'04"N, 75°51\'26"E',
    gsdResolution: '0.40 m/px',
    satellitePlatform: 'ISRO Cartosat / Sentinel-2 MSI',
    defaultQuerySuggestions: [
      'Analyze crop health and irrigation uniformity across agricultural parcels',
      'Identify unplanted or fallow soil sectors across the canal zone',
      'Explain the vegetation chlorophyll density in simple layman terms',
      'Detect canal moisture variance and agricultural parcel boundaries'
    ],
    domainCategory: 'Agriculture & NDVI',
    geographicLocation: 'Ludhiana Agricultural District, Punjab 141004, India',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=30.9010,75.8573',
    embedMapsUrl: 'https://maps.google.com/maps?q=30.9010,75.8573&hl=en&z=14&output=embed',
    satelliteEmbedUrl: 'https://maps.google.com/maps?q=30.9010,75.8573&t=k&hl=en&z=14&output=embed',
    detectedLocation: {
      locationName: 'Ludhiana Agro-Ecosystem, Grand Trunk Road Belt, Punjab, India',
      coordinates: '30°54\'04"N, 75°51\'26"E',
      latitude: 30.9010,
      longitude: 75.8573,
      googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=30.9010,75.8573',
      embedUrl: 'https://maps.google.com/maps?q=30.9010,75.8573&hl=en&z=14&output=embed',
      satelliteEmbedUrl: 'https://maps.google.com/maps?q=30.9010,75.8573&t=k&hl=en&z=14&output=embed',
      vicinityLandmarks: ['Punjab Agricultural University Fields', 'Sutlej River Basin Canal Branch', 'Ludhiana Agronomic Research Tract'],
      bodiesOfWater: ['Sirhind Canal Feeder', 'Sutlej River Plain Drainage', 'Irrigation Distribution Channels'],
      transitArteries: ['National Highway 44 (GT Road)', 'Ludhiana Bypass Expressway', 'State Highway 11'],
      topologicalSummary: 'Top-down nadir orthophoto showing the rich alluvial agricultural belt of Punjab, capturing dense rectangular crop parcels, canal distributaries, and fertile farmsteads.'
    },
    baseNdvi: 0.74,
    baseNdwi: 0.22,
    baseNdbi: -0.18,
    baseSurfaceTemp: 26.8
  },
  {
    id: 'rainforest_basin',
    title: 'Sundarbans Mangrove Delta',
    subtitle: 'Nadir orthophoto: Tidal mangrove forest canopy & estuarine delta channels',
    imageSrc: '/assets/sat_forest_river.jpg',
    coordinates: '21°56\'59"N, 88°54\'01"E',
    gsdResolution: '0.45 m/px',
    satellitePlatform: 'ISRO Oceansat-3 / Sentinel-2 SWIR',
    defaultQuerySuggestions: [
      'Explain the mangrove forest boundary and tidal estuarine channels',
      'Evaluate river sedimentation and erosion along the delta banks',
      'Identify mangrove canopy density vs tidal mudflats',
      'Calculate ratio of dense mangrove canopy vs estuarine waterways'
    ],
    domainCategory: 'Forestry & Coastal Ecology',
    geographicLocation: 'Sundarbans National Park & Biosphere Reserve, West Bengal 743370, India',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=21.9497,88.9004',
    embedMapsUrl: 'https://maps.google.com/maps?q=21.9497,88.9004&hl=en&z=13&output=embed',
    satelliteEmbedUrl: 'https://maps.google.com/maps?q=21.9497,88.9004&t=k&hl=en&z=13&output=embed',
    detectedLocation: {
      locationName: 'Sundarbans UNESCO World Heritage Delta, South 24 Parganas, West Bengal, India',
      coordinates: '21°56\'59"N, 88°54\'01"E',
      latitude: 21.9497,
      longitude: 88.9004,
      googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=21.9497,88.9004',
      embedUrl: 'https://maps.google.com/maps?q=21.9497,88.9004&hl=en&z=13&output=embed',
      satelliteEmbedUrl: 'https://maps.google.com/maps?q=21.9497,88.9004&t=k&hl=en&z=13&output=embed',
      vicinityLandmarks: ['Sundarbans Tiger Reserve Core', 'Sajnekhali Bird Sanctuary', 'Matla River Estuary', 'Piramal Island Mangrove Reach'],
      bodiesOfWater: ['Matla Estuarine Channel', 'Bidya River Basin', 'Bay of Bengal Tidal Creek System'],
      transitArteries: ['Canning Estuarine Ferry Channel', 'Delta Waterway Route 1', 'Gosaba Marine Access'],
      topologicalSummary: 'Nadir satellite orthophoto of the world\'s largest mangrove delta ecosystem, detailing dense halophytic mangrove canopy, tidal distributaries, and estuarine sediment channels.'
    },
    baseNdvi: 0.82,
    baseNdwi: 0.61,
    baseNdbi: -0.38,
    baseSurfaceTemp: 24.6
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
  r?: number;
  g?: number;
  b?: number;
  brightness?: number;
  latitude?: number;
  longitude?: number;
  isLiveSampled?: boolean;
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
  keyDifferences?: string[];
  confidenceScore?: number;
}

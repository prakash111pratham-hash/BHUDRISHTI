# BHUदृष्टि (Earth-Vision AI)

AI-powered Remote Sensing analyzer for high-resolution satellite imagery using vision-language models and natural language text queries with zero local GPU load.

## Features

- **Multi-spectral Viewport**: Interactive high-resolution satellite viewport with pan, zoom (up to 4.5x), reticle targeting, and simulated radar sweeping overlay.
- **Spectral Band Simulation**:
  - True Color (RGB: B4-B3-B2)
  - False Color (NIR: B8-B4-B3)
  - NDVI Contrast ((NIR-Red)/(NIR+Red))
  - Synthetic SAR (VV/VH Polarized)
- **Target Satellite Scenes**:
  - Metropolis Port & Estuary (Urban & Coastal)
  - Center-Pivot Farmlands (Agriculture & NDVI)
  - Tropical Canopy & Delta (Forestry & Climate)
  - Custom Tile Importer: Upload any custom aerial or satellite image for instant automated spectral analysis.
- **Biophysical Telemetry Indices**:
  - NDVI (Normalized Difference Vegetation Index)
  - NDWI (Normalized Difference Water Index)
  - NDBI (Normalized Difference Built-up Index)
  - LST (Land Surface Temperature proxy in °C)
- **Google Maps Ground Truth Integration**:
  - Verified geographical coordinates and regional descriptions.
  - One-tap link to view coordinates in Google Maps.
- **Computer Vision & Multimodal AI**:
  - Hybrid processing architecture: Gemini 2.5 Flash / 3.8 Flash multimodal vision processing via Node backend server.
  - Client-side 14,400-point multi-spectral pixel extraction engine guarantees 100% functionality even offline or without API keys.
- **Follow-up Spectral Inquiry Console**:
  - Interactive Q&A chat grounded in the scene's optical pixels and features.
- **Saved Analyses Records**:
  - Persist and manage comprehensive Earth Observation reports locally.
- **Cinematic 3D Earth Scan Opening**:
  - Automated satellite downlink animation with animated laser scanning beam and Indian subcontinent telemetry HUD.

## Development

```bash
# Install dependencies
npm install

# Start development server on port 3000
npm run dev

# Build for production
npm run build
```

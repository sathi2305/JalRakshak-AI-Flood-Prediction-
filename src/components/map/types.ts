export type RiskSeverity = 'very-high' | 'high' | 'moderate' | 'low';

export interface FloodRegionProperties {
  regionId: string;
  regionName: string;
  state: string;
  basin: string;
  riskLevel: RiskSeverity;
  rainfallMm: number | null;
  riverLevelM: number | null;
  dangerLevelM: number | null;
  observedAt: string;
  source: string;
  isSimulated: boolean;
  statusText?: string;
}

export interface FloodRegionFeature {
  type: 'Feature';
  properties: FloodRegionProperties;
  geometry: {
    type: 'Polygon';
    coordinates: number[][][]; // GeoJSON [lng, lat] format
  };
}

export interface FloodRegionFeatureCollection {
  type: 'FeatureCollection';
  features: FloodRegionFeature[];
}

export type BasemapMode = 'satellite' | 'terrain' | 'standard';
export type BasemapType = 'satellite' | 'terrain' | 'standard';

export interface SatelliteConstellation {
  id: string;
  name: string;
  agency: string;
  sensor: string;
  orbit: string;
  resolution: string;
  coverage: string;
  passTime: string;
  color: string;
}

export const SATELLITE_CONSTELLATIONS: SatelliteConstellation[] = [
  {
    id: 'sentinel-1',
    name: 'Copernicus Sentinel-1 SAR',
    agency: 'ESA / Copernicus',
    sensor: 'C-Band Synthetic Aperture Radar',
    orbit: '693 km Sun-Synchronous Polar',
    resolution: '10m All-Weather Inundation',
    coverage: 'Global / Indian Subcontinent',
    passTime: 'Live Telemetry (Pass 8m ago)',
    color: '#00D2FF',
  },
  {
    id: 'nasa-gpm',
    name: 'NASA GPM Core Observatory',
    agency: 'NASA / JAXA',
    sensor: 'Dual-frequency Precipitation Radar (DPR)',
    orbit: '407 km Non-Sun-Synchronous (65° incl)',
    resolution: '0.1° IMERG Precipitation Grid',
    coverage: 'Global Tropics & Mid-Latitudes',
    passTime: 'Live Downlink (14m ago)',
    color: '#38BDF8',
  },
  {
    id: 'isro-eos04',
    name: 'ISRO EOS-04 (RISAT-1A)',
    agency: 'ISRO / NRSC',
    sensor: 'C-Band Active Microwave Radar',
    orbit: '529 km Polar Low-Earth Orbit',
    resolution: '3m–50m Flood Vector Swath',
    coverage: 'India & South Asian Catchments',
    passTime: 'Downlinked at Shadnagar Earth Station',
    color: '#F59E0B',
  },
  {
    id: 'insat-3dr',
    name: 'INSAT-3DR Geostationary',
    agency: 'ISRO / IMD',
    sensor: 'Multi-spectral Imager & Sounder',
    orbit: '35,786 km Geostationary (74° E)',
    resolution: '1km Cloud & Water Vapor Thermal',
    coverage: 'Full Indian Ocean Disk',
    passTime: 'Continuous 15-min Scan Cycle',
    color: '#A855F7',
  },
];

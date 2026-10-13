import React, { useState } from 'react';
import { DistrictRisk, RiskSeverity } from '../../types/flood';
import {
  FloodRiskMap,
  BasemapType,
  SATELLITE_CONSTELLATIONS,
  SatelliteConstellation,
} from '../dashboard/FloodRiskMap';
import { PersistentMapLegend } from '../map/PersistentMapLegend';
import { ThemeToggleButton } from '../../context/ThemeContext';
import {
  Layers,
  Mountain,
  Satellite,
  Map as MapIcon,
  Flame,
  AlertOctagon,
  Eye,
  Crosshair,
  Droplets,
  Waves,
  ShieldAlert,
  Compass,
  Sliders,
  CheckCircle2,
  Globe,
  Radio,
  Wifi,
  Sparkles,
  Zap,
  Palette,
} from 'lucide-react';

interface FloodMapViewProps {
  districts: DistrictRisk[];
}

export const FloodMapView: React.FC<FloodMapViewProps> = ({ districts }) => {
  const [selectedDistrict, setSelectedDistrict] = useState<DistrictRisk | null>(districts[0]);
  const [selectedBasin, setSelectedBasin] = useState<string>('all');
  const [selectedRiskFilter, setSelectedRiskFilter] = useState<RiskSeverity | 'all'>('all');

  // Layer control states
  const [basemap, setBasemap] = useState<BasemapType>('satellite'); // Default to Satellite for global observation!
  const [showHeatmap, setShowHeatmap] = useState<boolean>(true);
  const [showHazardZones, setShowHazardZones] = useState<boolean>(true);
  const [selectedConstellation, setSelectedConstellation] = useState<SatelliteConstellation>(
    SATELLITE_CONSTELLATIONS[0]
  );
  const [isSatelliteLinked, setIsSatelliteLinked] = useState<boolean>(true);

  // Identified flood zones dataset
  const identifiedFloodZones = [
    {
      id: 'fz-1',
      districtId: 'd-1',
      name: 'Kamrup Metropolitan (Guwahati)',
      basin: 'Brahmaputra Basin',
      state: 'Assam',
      status: 'CONFIRMED ACTIVE FLOOD',
      severity: 'very-high',
      inundationAreaKm2: 42.5,
      waterLevelAboveDanger: 2.4,
      affectedPanchayats: 38,
      populationImpacted: 420000,
      coordinates: [26.1445, 91.7362] as [number, number],
      hazardType: 'Mainstem Embankment Overspill & Urban Backwater',
    },
    {
      id: 'fz-2',
      districtId: 'd-2',
      name: 'Dibrugarh Valley',
      basin: 'Brahmaputra Basin',
      state: 'Assam',
      status: 'CONFIRMED ACTIVE FLOOD',
      severity: 'very-high',
      inundationAreaKm2: 28.1,
      waterLevelAboveDanger: 1.1,
      affectedPanchayats: 24,
      populationImpacted: 280000,
      coordinates: [27.4728, 94.912] as [number, number],
      hazardType: 'Riparian Lowland Inundation & Soil Saturation Surge',
    },
    {
      id: 'fz-3',
      districtId: 'd-6',
      name: 'Wayanad Mountain Slope',
      basin: 'Kabini / Cauvery Basin',
      state: 'Kerala',
      status: 'FLASH FLOOD SURGE DETECTED',
      severity: 'very-high',
      inundationAreaKm2: 14.8,
      waterLevelAboveDanger: 0.7,
      affectedPanchayats: 16,
      populationImpacted: 88000,
      coordinates: [11.6854, 76.132] as [number, number],
      hazardType: 'High-Velocity Torrential Streamflow & Slope Runoff',
    },
    {
      id: 'fz-4',
      districtId: 'd-4',
      name: 'Patna & Digha Riverfront',
      basin: 'Ganga Basin',
      state: 'Bihar',
      status: 'FLOODPLAIN CREST DETECTED',
      severity: 'high',
      inundationAreaKm2: 18.4,
      waterLevelAboveDanger: 0.6,
      affectedPanchayats: 21,
      populationImpacted: 520000,
      coordinates: [25.5941, 85.1376] as [number, number],
      hazardType: 'Riverfront Spillway & Tributary Confluence Surge',
    },
    {
      id: 'fz-5',
      districtId: 'd-10',
      name: 'Yamuna Khadar Lowland',
      basin: 'Yamuna Basin',
      state: 'Delhi NCR',
      status: 'EMBANKMENT WATCH',
      severity: 'high',
      inundationAreaKm2: 9.6,
      waterLevelAboveDanger: 0.47,
      affectedPanchayats: 9,
      populationImpacted: 95000,
      coordinates: [28.6139, 77.209] as [number, number],
      hazardType: 'Low-Lying Khadar Floodplain Inundation',
    },
  ];

  const riverBasins = [
    'all',
    'Brahmaputra Basin',
    'Ganga Basin',
    'Yamuna Basin',
    'Godavari Basin',
    'Mahanadi Basin',
    'Tapi Basin',
    'Cauvery Basin',
  ];

  const districtCounts = {
    'very-high': districts.filter((d) => d.riskCategory === 'very-high').length,
    high: districts.filter((d) => d.riskCategory === 'high').length,
    moderate: districts.filter((d) => d.riskCategory === 'moderate').length,
    low: districts.filter((d) => d.riskCategory === 'low').length,
  };

  const filteredDistricts = districts.filter((d) => {
    const matchesBasin =
      selectedBasin === 'all' ||
      d.riverBasin.toLowerCase().includes(selectedBasin.toLowerCase());
    const matchesRisk =
      selectedRiskFilter === 'all' || d.riskCategory === selectedRiskFilter;
    return matchesBasin && matchesRisk;
  });

  const handleFlyToZone = (coords: [number, number], districtId: string) => {
    const found = districts.find((d) => d.id === districtId);
    if (found) {
      setSelectedDistrict(found);
    }
  };

  return (
    <div className="space-y-4 max-w-[1600px] mx-auto">
      {/* 1. GLOBAL SATELLITE CONNECTION STATUS BAR */}
      <div className="bg-[#10294B] dark:bg-[#0A1B33] text-white rounded-xl p-4 border border-[#1C3E6B] dark:border-[#1E3A60] shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#00D2FF] to-[#1769E8] flex items-center justify-center text-white shadow-inner shrink-0">
            <Globe className="w-5 h-5 text-white animate-spin" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-white tracking-tight">
                Global Satellite Earth Observation Network
              </h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                TELEMETRY CONNECTED
              </span>
            </div>
            <p className="text-xs text-[#8FAAC8] mt-0.5">
              Multi-mission orbital downlink: ESA Sentinel-1 SAR, NASA GPM Precipitation, and ISRO RISAT Radar feeds
            </p>
          </div>
        </div>

        {/* Constellation Selector Buttons */}
        <div className="flex flex-wrap items-center gap-1.5 text-xs">
          {SATELLITE_CONSTELLATIONS.map((sat) => {
            const isActive = selectedConstellation.id === sat.id;
            return (
              <button
                key={sat.id}
                onClick={() => {
                  setSelectedConstellation(sat);
                  setBasemap('satellite'); // Activate satellite tiles automatically
                }}
                className={`px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 transition-all text-xs border ${
                  isActive
                    ? 'bg-[#1769E8] text-white border-[#2A82FF] shadow-sm'
                    : 'bg-[#15345E] text-[#B2CAE5] border-[#224A80] hover:bg-[#1C4275] hover:text-white'
                }`}
              >
                <Radio className={`w-3 h-3 ${isActive ? 'text-[#00D2FF] animate-pulse' : 'text-[#8AAECF]'}`} />
                <span>{sat.name.split(' ')[0]}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. LAYER CONTROL COMPONENT STRIP WITH THEME BUTTON FORMAT */}
      <div className="bg-white dark:bg-[#11223B] rounded-xl border border-[#D9E6F5] dark:border-[#1F3A60] p-3.5 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#EBF3FE] dark:bg-[#183459] text-[#1769E8] dark:text-[#60A5FA] flex items-center justify-center font-bold">
            <Layers className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-[#142E53] dark:text-white leading-none">
                Geospatial Layer Control & Thermal Overlays
              </h3>
              <span className="text-[10px] uppercase font-bold text-[#1769E8] dark:text-[#60A5FA] bg-[#EBF3FE] dark:bg-[#183459] px-2 py-0.5 rounded border border-[#BFDBFE] dark:border-[#204473]">
                Leaflet Layer Control Active
              </span>
            </div>
            <p className="text-[11px] text-[#5B7395] dark:text-[#94A3B8] mt-1">
              Toggle between standard street map, satellite imagery, and topographic base layers using the interactive Leaflet layer control
            </p>
          </div>
        </div>

        {/* Basemap, Overlay & Theme Quick Switches */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          {/* Basemap Selector */}
          <div className="flex items-center bg-[#F3F8FD] dark:bg-[#0D1E36] p-1 rounded-lg border border-[#D9E6F5] dark:border-[#1F3A60] gap-1">
            <button
              onClick={() => setBasemap('standard')}
              className={`px-2.5 py-1 rounded-md font-semibold flex items-center gap-1.5 transition-all ${
                basemap === 'standard'
                  ? 'bg-white dark:bg-[#1769E8] text-[#1769E8] dark:text-white shadow-xs'
                  : 'text-[#5B7395] dark:text-[#8FAAC8] hover:text-[#142E53] dark:hover:text-white'
              }`}
            >
              <MapIcon className="w-3.5 h-3.5" />
              <span>Standard Street Map</span>
            </button>

            <button
              onClick={() => setBasemap('satellite')}
              className={`px-2.5 py-1 rounded-md font-semibold flex items-center gap-1.5 transition-all ${
                basemap === 'satellite'
                  ? 'bg-white dark:bg-[#1769E8] text-[#1769E8] dark:text-white shadow-xs'
                  : 'text-[#5B7395] dark:text-[#8FAAC8] hover:text-[#142E53] dark:hover:text-white'
              }`}
            >
              <Satellite className="w-3.5 h-3.5 text-[#1769E8] dark:text-white" />
              <span>Satellite Imagery</span>
            </button>

            <button
              onClick={() => setBasemap('terrain')}
              className={`px-2.5 py-1 rounded-md font-semibold flex items-center gap-1.5 transition-all ${
                basemap === 'terrain'
                  ? 'bg-white dark:bg-[#1769E8] text-[#1769E8] dark:text-white shadow-xs'
                  : 'text-[#5B7395] dark:text-[#8FAAC8] hover:text-[#142E53] dark:hover:text-white'
              }`}
            >
              <Mountain className="w-3.5 h-3.5" />
              <span>Topographic Base Layer</span>
            </button>
          </div>

          {/* Heatmap Toggle Pill */}
          <button
            onClick={() => setShowHeatmap(!showHeatmap)}
            className={`px-3 py-1.5 rounded-lg border font-semibold flex items-center gap-1.5 transition-all ${
              showHeatmap
                ? 'bg-[#FEE2E2] dark:bg-[#450A0A] text-[#F5222D] dark:text-[#FCA5A5] border-[#FCA5A5] dark:border-[#991B1B]'
                : 'bg-white dark:bg-[#0D1E36] text-[#5B7395] dark:text-[#8FAAC8] border-[#D9E6F5] dark:border-[#1F3A60] hover:bg-[#F8FAFC]'
            }`}
          >
            <Flame className="w-3.5 h-3.5 text-[#F5222D]" />
            <span>Heatmap Overlay: {showHeatmap ? 'ON' : 'OFF'}</span>
          </button>

          {/* Inundation Zones Toggle Pill */}
          <button
            onClick={() => setShowHazardZones(!showHazardZones)}
            className={`px-3 py-1.5 rounded-lg border font-semibold flex items-center gap-1.5 transition-all ${
              showHazardZones
                ? 'bg-[#EBF3FE] dark:bg-[#16365D] text-[#1769E8] dark:text-[#60A5FA] border-[#BFDBFE] dark:border-[#2563EB]'
                : 'bg-white dark:bg-[#0D1E36] text-[#5B7395] dark:text-[#8FAAC8] border-[#D9E6F5] dark:border-[#1F3A60] hover:bg-[#F8FAFC]'
            }`}
          >
            <AlertOctagon className="w-3.5 h-3.5" />
            <span>Hazard Inundation: {showHazardZones ? 'ON' : 'OFF'}</span>
          </button>

          {/* Theme Selector (Button format) */}
          <div className="flex items-center gap-1.5 pl-1.5 border-l border-[#D9E6F5] dark:border-[#1F3A60]">
            <span className="hidden xl:inline text-[11px] font-semibold text-[#5B7395] dark:text-[#8FAAC8]">
              Theme:
            </span>
            <ThemeToggleButton variant="segmented" />
          </div>
        </div>
      </div>

      {/* 3. BASIN FILTER BAR */}
      <div className="bg-white dark:bg-[#11223B] px-3.5 py-2 rounded-xl border border-[#D9E6F5] dark:border-[#1F3A60] shadow-xs flex items-center gap-2 overflow-x-auto text-xs">
        <span className="font-semibold text-[#8499B5] whitespace-nowrap text-[11px] uppercase tracking-wider">
          Filter River Basin:
        </span>
        {riverBasins.map((basin) => (
          <button
            key={basin}
            onClick={() => setSelectedBasin(basin)}
            className={`px-2.5 py-1 rounded-md text-xs font-semibold whitespace-nowrap transition-colors ${
              selectedBasin === basin
                ? 'bg-[#1769E8] text-white shadow-xs'
                : 'bg-[#F3F8FD] dark:bg-[#0D1E36] text-[#5B7395] dark:text-[#8FAAC8] hover:text-[#142E53] dark:hover:text-white hover:bg-[#EBF3FE]'
            }`}
          >
            {basin === 'all' ? 'All Basins' : basin.replace(' Basin', '')}
          </button>
        ))}

        {selectedRiskFilter !== 'all' && (
          <div className="ml-auto flex items-center gap-1 shrink-0">
            <span className="text-[10px] text-[#8499B5]">Risk Filter:</span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#1769E8] text-white uppercase">
              {selectedRiskFilter}
            </span>
            <button
              onClick={() => setSelectedRiskFilter('all')}
              className="text-[10px] text-[#1769E8] dark:text-[#60A5FA] hover:underline font-semibold ml-1"
            >
              Clear
            </button>
          </div>
        )}
      </div>

      {/* 4. MAIN GEOSPATIAL MAP & FLOOD IDENTIFICATION WORKSPACE */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        {/* LEFT COLUMN: THE INTERACTIVE MAP WITH PERSISTENT BOTTOM-LEFT LEGEND */}
        <div className="lg:col-span-8 space-y-4">
          <FloodRiskMap
            districts={filteredDistricts}
            selectedDistrict={selectedDistrict}
            onSelectDistrict={(d) => setSelectedDistrict(d)}
            heightClass="h-[520px] lg:h-[620px]"
            initialBasemap={basemap}
            initialShowHeatmap={showHeatmap}
            enableLeafletLayerControl={true}
            customLegend={
              <PersistentMapLegend
                districtCounts={districtCounts}
                activeFilter={selectedRiskFilter}
                onFilterChange={(sev) => setSelectedRiskFilter(sev)}
              />
            }
          />

          {/* Active Satellite Telemetry Specification Readout Strip */}
          <div className="bg-white dark:bg-[#11223B] rounded-xl border border-[#D9E6F5] dark:border-[#1F3A60] p-4 shadow-xs grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-2.5 bg-[#FAFDFE] dark:bg-[#0E2038] rounded-lg border border-[#EDF4FC] dark:border-[#1C3A60]">
              <span className="text-[10px] text-[#8499B5] uppercase font-bold block">
                Active Satellite
              </span>
              <span className="text-sm font-bold text-[#10294B] dark:text-white font-mono mt-0.5 block truncate">
                {selectedConstellation.name}
              </span>
              <span className="text-[10px] text-[#1769E8] dark:text-[#60A5FA] font-medium">{selectedConstellation.agency}</span>
            </div>

            <div className="p-2.5 bg-[#FAFDFE] dark:bg-[#0E2038] rounded-lg border border-[#EDF4FC] dark:border-[#1C3A60]">
              <span className="text-[10px] text-[#8499B5] uppercase font-bold block">
                Radar Sensor / Swath
              </span>
              <span className="text-sm font-bold text-[#142E53] dark:text-white font-mono mt-0.5 block truncate">
                {selectedConstellation.sensor.split(' ')[0]} SAR
              </span>
              <span className="text-[10px] text-[#5B7395] dark:text-[#94A3B8]">Res: {selectedConstellation.resolution.split(' ')[0]}</span>
            </div>

            <div className="p-2.5 bg-[#FAFDFE] dark:bg-[#0E2038] rounded-lg border border-[#EDF4FC] dark:border-[#1C3A60]">
              <span className="text-[10px] text-[#8499B5] uppercase font-bold block">
                Orbit Altitude
              </span>
              <span className="text-sm font-bold text-[#8B5CF6] font-mono mt-0.5 block truncate">
                {selectedConstellation.orbit.split(' ')[0]} {selectedConstellation.orbit.split(' ')[1]}
              </span>
              <span className="text-[10px] text-[#5B7395] dark:text-[#94A3B8]">Sun-Synchronous</span>
            </div>

            <div className="p-2.5 bg-[#FAFDFE] dark:bg-[#0E2038] rounded-lg border border-[#EDF4FC] dark:border-[#1C3A60]">
              <span className="text-[10px] text-[#8499B5] uppercase font-bold block">
                Downlink Station
              </span>
              <span className="text-sm font-bold text-[#16B83F] font-mono mt-0.5 block truncate">
                ISRO Shadnagar
              </span>
              <span className="text-[10px] text-[#16B83F] font-semibold">● 100% Signal Lock</span>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: FLOOD IDENTIFICATION & HAZARD DETECTION DOSSIER */}
        <div className="lg:col-span-4 space-y-4">
          {/* FLOOD IDENTIFICATION CARD */}
          <div className="bg-white dark:bg-[#11223B] rounded-xl border border-[#D9E6F5] dark:border-[#1F3A60] shadow-xs p-4 space-y-3.5">
            <div className="flex items-center justify-between border-b border-[#EDF4FC] dark:border-[#1F3A60] pb-2.5">
              <div className="flex items-center gap-2">
                <AlertOctagon className="w-4 h-4 text-[#F5222D]" />
                <h3 className="text-sm font-bold text-[#142E53] dark:text-white">
                  Flood Identification & Hazard Detection
                </h3>
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider bg-[#FEE2E2] dark:bg-[#450A0A] text-[#F5222D] dark:text-[#FCA5A5] px-2 py-0.5 rounded border border-[#FCA5A5] dark:border-[#991B1B]">
                5 Active Zones
              </span>
            </div>

            <p className="text-[11px] text-[#5B7395] dark:text-[#94A3B8] leading-relaxed">
              Automated flood inundation identification synthesizing satellite radar swaths with CWC river gauge thresholds:
            </p>

            {/* List of Identified Flood Zones */}
            <div className="space-y-2.5 max-h-[500px] overflow-y-auto pr-1">
              {identifiedFloodZones.map((zone) => {
                const isSelected = selectedDistrict?.id === zone.districtId;

                return (
                  <div
                    key={zone.id}
                    onClick={() => handleFlyToZone(zone.coordinates, zone.districtId)}
                    className={`p-3 rounded-xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'border-[#1769E8] bg-[#F4F8FE] dark:bg-[#142D4E] shadow-xs ring-1 ring-[#1769E8]/30'
                        : 'border-[#EDF4FC] dark:border-[#1C3A60] bg-[#FAFDFE] dark:bg-[#0E2038] hover:border-[#1769E8]/40 hover:bg-white dark:hover:bg-[#132A4B]'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span
                          className={`inline-block px-1.5 py-0.5 rounded text-[9px] font-extrabold uppercase tracking-wider mb-1 ${
                            zone.severity === 'very-high'
                              ? 'bg-[#FEE2E2] dark:bg-[#450A0A] text-[#F5222D] dark:text-[#FCA5A5] border border-[#FCA5A5] dark:border-[#991B1B]'
                              : 'bg-[#FFEDD5] dark:bg-[#431407] text-[#FF9418] dark:text-[#FDBA74] border border-[#FDBA74] dark:border-[#9A3412]'
                          }`}
                        >
                          {zone.status}
                        </span>
                        <h4 className="text-xs font-bold text-[#142E53] dark:text-white leading-tight">
                          {zone.name}
                        </h4>
                        <div className="text-[10px] text-[#5B7395] dark:text-[#8FAAC8] mt-0.5">
                          {zone.state} · {zone.basin}
                        </div>
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleFlyToZone(zone.coordinates, zone.districtId);
                        }}
                        className="p-1.5 rounded-lg bg-white dark:bg-[#15345E] border border-[#D9E6F5] dark:border-[#224A80] text-[#1769E8] dark:text-[#60A5FA] hover:bg-[#EBF3FE] dark:hover:bg-[#1C4275] transition-colors shrink-0 shadow-2xs"
                        title="Locate on Map"
                      >
                        <Crosshair className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="text-[11px] text-[#5B7395] dark:text-[#94A3B8] mt-2 pt-1.5 border-t border-[#EDF4FC] dark:border-[#1C3A60] space-y-1">
                      <div className="flex justify-between">
                        <span className="text-[#8499B5]">Identified Inundation:</span>
                        <strong className="text-[#142E53] dark:text-white font-mono">{zone.inundationAreaKm2} km²</strong>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#8499B5]">Water Breach Above Danger:</span>
                        <strong className="text-[#F5222D] font-mono font-bold">+{zone.waterLevelAboveDanger} m</strong>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#8499B5]">Impacted Population:</span>
                        <strong className="text-[#142E53] dark:text-white font-mono">{zone.populationImpacted.toLocaleString()}</strong>
                      </div>
                    </div>

                    <div className="mt-2 text-[10px] text-[#8499B5] bg-white dark:bg-[#0B1728] p-1.5 rounded border border-[#EDF4FC] dark:border-[#1C3A60]">
                      <strong className="text-[#5B7395] dark:text-[#94A3B8]">Hazard Dynamic:</strong> {zone.hazardType}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* SATELLITE RADAR SENSOR SPECIFICATION CARD */}
          <div className="bg-white dark:bg-[#11223B] rounded-xl border border-[#D9E6F5] dark:border-[#1F3A60] shadow-xs p-4 space-y-2.5">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-[#F59E0B]" />
              <h4 className="text-xs font-bold text-[#142E53] dark:text-white uppercase tracking-wider">
                Synthetic Aperture Radar (SAR) Capabilities
              </h4>
            </div>
            <p className="text-[11px] text-[#5B7395] dark:text-[#94A3B8] leading-relaxed">
              Unlike optical satellite photography blinded by heavy monsoon cloud cover, C-band SAR microwaves penetrate dense clouds and night conditions to identify standing flood water through specular radar reflection.
            </p>
            <div className="pt-1.5 flex items-center justify-between text-[11px] font-mono text-[#1769E8] dark:text-[#60A5FA]">
              <span>Radar Frequency: 5.405 GHz</span>
              <span>Polarization: VV + VH</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

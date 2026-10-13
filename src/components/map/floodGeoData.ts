import { FloodRegionFeatureCollection } from './types';

export const indiaFloodRiskGeoData: FloodRegionFeatureCollection = {
  type: 'FeatureCollection',
  features: [
    // 1. Red: Very High - Brahmaputra Valley (Upper & Central Assam)
    {
      type: 'Feature',
      properties: {
        regionId: 'reg-brahmaputra',
        regionName: 'Brahmaputra Flood Plain (Kamrup & Dibrugarh)',
        state: 'Assam',
        basin: 'Brahmaputra Basin',
        riskLevel: 'very-high',
        rainfallMm: 184.5,
        riverLevelM: 78.4,
        dangerLevelM: 76.0,
        observedAt: '10 mins ago',
        source: 'CWC Telemetry & IMD Radar',
        isSimulated: true,
        statusText: 'WATER LEVEL 2.4m ABOVE DANGER MARK',
      },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [89.8, 26.0],
            [90.6, 26.3],
            [91.8, 26.2],
            [92.8, 26.6],
            [94.2, 27.2],
            [95.4, 27.6],
            [95.8, 27.4],
            [95.2, 27.0],
            [94.0, 26.8],
            [92.6, 26.2],
            [91.4, 25.9],
            [90.0, 25.8],
            [89.8, 26.0],
          ],
        ],
      },
    },

    // 2. Red: Very High - Western Ghats / Kabini Headwaters (Wayanad)
    {
      type: 'Feature',
      properties: {
        regionId: 'reg-wayanad',
        regionName: 'Western Ghats Catchment (Wayanad)',
        state: 'Kerala',
        basin: 'Kabini / Chaliyar Basin',
        riskLevel: 'very-high',
        rainfallMm: 172.5,
        riverLevelM: 68.2,
        dangerLevelM: 67.5,
        observedAt: '14 mins ago',
        source: 'SDMA Kerala & IMD AWS',
        isSimulated: true,
        statusText: 'FLASH FLOOD & SLOPE RUNOFF CRITICAL',
      },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [75.9, 11.5],
            [76.3, 11.5],
            [76.4, 11.9],
            [76.0, 11.9],
            [75.8, 11.7],
            [75.9, 11.5],
          ],
        ],
      },
    },

    // 3. Orange: High - Middle Ganga Basin (Bihar)
    {
      type: 'Feature',
      properties: {
        regionId: 'reg-ganga',
        regionName: 'Middle Ganga Basin (Patna & Bhagalpur)',
        state: 'Bihar',
        basin: 'Ganga Basin',
        riskLevel: 'high',
        rainfallMm: 135.4,
        riverLevelM: 50.8,
        dangerLevelM: 50.2,
        observedAt: '8 mins ago',
        source: 'Central Water Commission (CWC)',
        isSimulated: true,
        statusText: 'CREST SURGE +0.6m ABOVE DANGER MARK',
      },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [84.4, 25.6],
            [85.4, 25.8],
            [86.8, 25.5],
            [87.5, 25.3],
            [87.3, 25.1],
            [86.2, 25.1],
            [85.0, 25.3],
            [84.4, 25.6],
          ],
        ],
      },
    },

    // 4. Orange: High - Upper Yamuna Basin (Delhi NCR)
    {
      type: 'Feature',
      properties: {
        regionId: 'reg-yamuna',
        regionName: 'Yamuna Floodplain (Delhi & Haryana Reach)',
        state: 'Delhi NCR',
        basin: 'Yamuna Basin',
        riskLevel: 'high',
        rainfallMm: 74.0,
        riverLevelM: 205.8,
        dangerLevelM: 205.33,
        observedAt: '11 mins ago',
        source: 'CWC Delhi Flood Control',
        isSimulated: true,
        statusText: 'WARNING LEVEL EXCEEDED AT OLD RAILWAY BRIDGE',
      },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [76.9, 28.9],
            [77.4, 28.9],
            [77.5, 28.4],
            [77.1, 28.4],
            [76.9, 28.9],
          ],
        ],
      },
    },

    // 5. Orange: High - Godavari Delta Reach (Andhra Pradesh)
    {
      type: 'Feature',
      properties: {
        regionId: 'reg-godavari',
        regionName: 'Godavari Delta (Rajahmundry & Dowleswaram)',
        state: 'Andhra Pradesh',
        basin: 'Godavari Basin',
        riskLevel: 'high',
        rainfallMm: 96.0,
        riverLevelM: 14.8,
        dangerLevelM: 15.0,
        observedAt: '22 mins ago',
        source: 'Andhra Pradesh WRD & CWC',
        isSimulated: true,
        statusText: 'FIRST WARNING FLAG HOISTED (9.8 LAKH CUSECS)',
      },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [81.4, 17.3],
            [82.2, 17.1],
            [82.1, 16.5],
            [81.5, 16.6],
            [81.4, 17.3],
          ],
        ],
      },
    },

    // 6. Yellow: Moderate - Mahanadi Catchment (Odisha)
    {
      type: 'Feature',
      properties: {
        regionId: 'reg-mahanadi',
        regionName: 'Mahanadi Basin (Cuttack & Sambalpur)',
        state: 'Odisha',
        basin: 'Mahanadi Basin',
        riskLevel: 'moderate',
        rainfallMm: 88.5,
        riverLevelM: 24.2,
        dangerLevelM: 25.0,
        observedAt: '25 mins ago',
        source: 'Odisha SDMA & CWC',
        isSimulated: true,
        statusText: 'CONTROLLED DISCHARGE FROM HIRAKUD DAM',
      },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [83.8, 21.6],
            [84.9, 21.1],
            [86.0, 20.6],
            [86.3, 20.2],
            [85.6, 20.1],
            [84.5, 20.5],
            [83.8, 21.6],
          ],
        ],
      },
    },

    // 7. Yellow: Moderate - Tapi & Narmada Lower Reaches (Gujarat)
    {
      type: 'Feature',
      properties: {
        regionId: 'reg-tapi',
        regionName: 'Tapi & Narmada Reach (Surat & Bharuch)',
        state: 'Gujarat',
        basin: 'Tapi Basin',
        riskLevel: 'moderate',
        rainfallMm: 68.0,
        riverLevelM: 8.6,
        dangerLevelM: 9.5,
        observedAt: '30 mins ago',
        source: 'Gujarat WRD',
        isSimulated: true,
        statusText: 'UKAI DAM OUTFLOW UNDER REGULATION',
      },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [72.6, 21.6],
            [73.5, 21.5],
            [73.3, 20.9],
            [72.6, 21.0],
            [72.6, 21.6],
          ],
        ],
      },
    },

    // 8. Green: Low - Cauvery Basin Lower Reach (Tamil Nadu)
    {
      type: 'Feature',
      properties: {
        regionId: 'reg-cauvery',
        regionName: 'Cauvery Delta (Tiruchirappalli & Thanjavur)',
        state: 'Tamil Nadu',
        basin: 'Cauvery Basin',
        riskLevel: 'low',
        rainfallMm: 22.4,
        riverLevelM: 18.2,
        dangerLevelM: 22.0,
        observedAt: '40 mins ago',
        source: 'Tamil Nadu WRD',
        isSimulated: true,
        statusText: 'FLOW REGULAR WITHIN EMBANKMENT CHANNELS',
      },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [78.2, 11.2],
            [79.5, 11.2],
            [79.8, 10.6],
            [78.5, 10.6],
            [78.2, 11.2],
          ],
        ],
      },
    },

    // 9. Green: Low - Deccan Central Plateau (Karnataka / Telangana Interior)
    {
      type: 'Feature',
      properties: {
        regionId: 'reg-deccan',
        regionName: 'Deccan Plateau Central Basin',
        state: 'Karnataka / Telangana',
        basin: 'Krishna Tributaries',
        riskLevel: 'low',
        rainfallMm: 18.0,
        riverLevelM: 12.0,
        dangerLevelM: 16.5,
        observedAt: '45 mins ago',
        source: 'Central Hydrological Network',
        isSimulated: true,
        statusText: 'NORMAL POST-MONSOON RESIDUAL INFLOW',
      },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [76.0, 15.5],
            [78.5, 16.5],
            [79.0, 15.0],
            [76.8, 14.2],
            [76.0, 15.5],
          ],
        ],
      },
    },
  ],
};

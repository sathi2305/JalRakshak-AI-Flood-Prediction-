import React, { useEffect, useRef, useState, useCallback } from 'react';
import L from 'leaflet';
import { DistrictRisk } from '../../types/flood';
import { BasemapMode, FloodRegionFeature } from './types';
import { indiaFloodRiskGeoData } from './floodGeoData';
import { FloodMapLegend } from './FloodMapLegend';
import { FloodMapControls } from './FloodMapControls';
import { FloodMapStatus } from './FloodMapStatus';

interface FloodRiskMapProps {
  districts?: DistrictRisk[];
  selectedDistrict?: DistrictRisk | null;
  onSelectDistrict?: (district: DistrictRisk) => void;
  heightClass?: string;
  initialBasemap?: BasemapMode;
  initialShowOverlays?: boolean;
  initialShowHeatmap?: boolean;
  enableLeafletLayerControl?: boolean;
  hideDefaultLegend?: boolean;
  customLegend?: React.ReactNode;
}

export const FloodRiskMap: React.FC<FloodRiskMapProps> = ({
  districts = [],
  selectedDistrict = null,
  onSelectDistrict,
  heightClass = 'h-[360px] lg:h-[400px]',
  initialBasemap = 'satellite',
  initialShowOverlays = true,
  initialShowHeatmap,
  enableLeafletLayerControl = true,
  hideDefaultLegend = false,
  customLegend,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  // Basemap Tile Layers Refs
  const standardStreetLayerRef = useRef<L.TileLayer | null>(null);
  const satelliteLayerRef = useRef<L.TileLayer | null>(null);
  const satelliteLabelsLayerRef = useRef<L.TileLayer | null>(null);
  const topographicLayerRef = useRef<L.TileLayer | null>(null);

  // Overlays Refs
  const geoJsonLayerRef = useRef<L.GeoJSON | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const layerControlRef = useRef<L.Control.Layers | null>(null);

  const [basemap, setBasemap] = useState<BasemapMode>(initialBasemap);
  const [showOverlays, setShowOverlays] = useState<boolean>(
    initialShowHeatmap !== undefined ? initialShowHeatmap : initialShowOverlays
  );
  const [lastUpdated] = useState<string>('Oct 13, 2026 05:45 UTC · CWC & IMD Telemetry');

  // Center on India
  const initialCenter: [number, number] = [22.5, 79.0];
  const initialZoom = 4.8;

  // Color mapping based on risk severity
  const getRiskColors = (riskLevel: string) => {
    switch (riskLevel) {
      case 'very-high':
        return {
          color: '#F5222D', // Red
          fillColor: '#EF4444',
          fillOpacity: 0.38,
        };
      case 'high':
        return {
          color: '#FF9418', // Orange
          fillColor: '#F97316',
          fillOpacity: 0.34,
        };
      case 'moderate':
        return {
          color: '#FFD52A', // Yellow
          fillColor: '#EAB308',
          fillOpacity: 0.30,
        };
      case 'low':
      default:
        return {
          color: '#16B83F', // Green
          fillColor: '#22C55E',
          fillOpacity: 0.25,
        };
    }
  };

  // 1. Initialize Leaflet Map with Basemap Layers & Layer Control
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: initialCenter,
      zoom: initialZoom,
      zoomControl: false,
      attributionControl: true,
      minZoom: 4,
      maxZoom: 17,
      zoomAnimation: true,
      fadeAnimation: true,
      markerZoomAnimation: true,
      zoomSnap: 0.5,
      zoomDelta: 0.5,
      wheelPxPerZoomLevel: 100,
    });

    // 1. Standard Street Map (OpenStreetMap)
    const standardStreet = L.tileLayer(
      'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      {
        maxZoom: 19,
        attribution: '&copy; OpenStreetMap contributors',
      }
    );

    // 2. Satellite Imagery (Esri World Imagery)
    const satelliteImagery = L.tileLayer(
      'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
      {
        maxZoom: 18,
        attribution: '&copy; Esri World Imagery',
      }
    );

    // Satellite geographic boundaries & place labels overlay
    const satelliteLabels = L.tileLayer(
      'https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}',
      {
        maxZoom: 18,
        opacity: 0.85,
      }
    );

    // 3. Topographic Base Layer (Esri World Topo Map)
    const topographicBase = L.tileLayer(
      'https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}',
      {
        maxZoom: 18,
        attribution: '&copy; Esri World Topo Map',
      }
    );

    standardStreetLayerRef.current = standardStreet;
    satelliteLayerRef.current = satelliteImagery;
    satelliteLabelsLayerRef.current = satelliteLabels;
    topographicLayerRef.current = topographicBase;

    // Attach initial active base layer
    if (initialBasemap === 'terrain') {
      topographicBase.addTo(map);
    } else if (initialBasemap === 'standard') {
      standardStreet.addTo(map);
    } else {
      satelliteImagery.addTo(map);
      satelliteLabels.addTo(map);
    }

    // Overlay groups
    const markersGroup = L.layerGroup().addTo(map);
    markersLayerRef.current = markersGroup;

    // 4. Interactive Leaflet Layer Control
    if (enableLeafletLayerControl) {
      const baseMaps = {
        'Standard Street Map': standardStreet,
        'Satellite Imagery': satelliteImagery,
        'Topographic Base Layer': topographicBase,
      };

      const overlayMaps: { [key: string]: L.Layer } = {
        'River Gauge Stations': markersGroup,
      };

      const layerControl = L.control.layers(baseMaps, overlayMaps, {
        position: 'topright',
        collapsed: true,
      }).addTo(map);

      layerControlRef.current = layerControl;

      // Synchronize map state when user clicks radio buttons inside Leaflet layer control
      map.on('baselayerchange', (e: any) => {
        if (e.name === 'Satellite Imagery') {
          setBasemap('satellite');
          if (!map.hasLayer(satelliteLabels)) {
            satelliteLabels.addTo(map);
          }
        } else if (e.name === 'Topographic Base Layer') {
          setBasemap('terrain');
          if (map.hasLayer(satelliteLabels)) {
            map.removeLayer(satelliteLabels);
          }
        } else if (e.name === 'Standard Street Map') {
          setBasemap('standard');
          if (map.hasLayer(satelliteLabels)) {
            map.removeLayer(satelliteLabels);
          }
        }
      });
    }

    mapInstanceRef.current = map;

    // Force map to adapt immediately to container layout
    setTimeout(() => {
      map.invalidateSize();
    }, 120);

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // 2. Container Resize Observer
  useEffect(() => {
    const container = mapContainerRef.current;
    if (!container) return;

    const resizeObserver = new ResizeObserver(() => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.invalidateSize();
      }
    });

    resizeObserver.observe(container);

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  // Sync with prop changes from external layer control or preset switches
  useEffect(() => {
    if (initialBasemap) {
      setBasemap(initialBasemap);
    }
  }, [initialBasemap]);

  useEffect(() => {
    if (initialShowHeatmap !== undefined) {
      setShowOverlays(initialShowHeatmap);
    }
  }, [initialShowHeatmap]);

  // 3. Basemap switching synchronization with smooth cross-fade
  useEffect(() => {
    const map = mapInstanceRef.current;
    const standard = standardStreetLayerRef.current;
    const satellite = satelliteLayerRef.current;
    const satLabels = satelliteLabelsLayerRef.current;
    const topo = topographicLayerRef.current;

    if (!map || !standard || !satellite || !topo) return;

    // Helper for smooth cross-fading layers
    const transitionLayers = (toAdd: L.TileLayer[], toRemove: L.TileLayer[]) => {
      toAdd.forEach((layer) => {
        if (!map.hasLayer(layer)) {
          layer.addTo(map);
        }
      });
      // Short delay allows the incoming tile layer to mount before removing old layers, preventing grey flashes
      const timer = setTimeout(() => {
        toRemove.forEach((layer) => {
          if (map.hasLayer(layer)) {
            map.removeLayer(layer);
          }
        });
      }, 180);
      return () => clearTimeout(timer);
    };

    if (basemap === 'satellite') {
      const cleanup = transitionLayers(
        satLabels ? [satellite, satLabels] : [satellite],
        [standard, topo]
      );
      return cleanup;
    } else if (basemap === 'terrain') {
      const cleanup = transitionLayers(
        [topo],
        satLabels ? [satellite, satLabels, standard] : [satellite, standard]
      );
      return cleanup;
    } else {
      const cleanup = transitionLayers(
        [standard],
        satLabels ? [satellite, satLabels, topo] : [satellite, topo]
      );
      return cleanup;
    }
  }, [basemap]);

  // 4. Render GeoJSON Flood-Risk Overlays (Red, Orange, Yellow, Green)
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (geoJsonLayerRef.current) {
      if (layerControlRef.current) {
        layerControlRef.current.removeLayer(geoJsonLayerRef.current);
      }
      map.removeLayer(geoJsonLayerRef.current);
      geoJsonLayerRef.current = null;
    }

    if (!showOverlays) return;

    const geoJsonLayer = L.geoJSON(indiaFloodRiskGeoData as any, {
      style: (feature) => {
        const risk = feature?.properties?.riskLevel || 'low';
        const { color, fillColor, fillOpacity } = getRiskColors(risk);
        return {
          color: color,
          weight: 2,
          opacity: 0.9,
          fillColor: fillColor,
          fillOpacity: fillOpacity,
          dashArray: '3, 4',
        };
      },
      onEachFeature: (feature, layer) => {
        const props = feature.properties as FloodRegionFeature['properties'];
        const { color } = getRiskColors(props.riskLevel);

        // Hover highlight interaction
        layer.on({
          mouseover: (e) => {
            const l = e.target;
            l.setStyle({
              weight: 3.5,
              dashArray: '',
              fillOpacity: 0.55,
            });
            l.bringToFront();
          },
          mouseout: (e) => {
            geoJsonLayer.resetStyle(e.target);
          },
          click: () => {
            const matched = districts.find(
              (d) => d.riverBasin.includes(props.basin) || props.regionName.includes(d.name)
            );
            if (matched && onSelectDistrict) {
              onSelectDistrict(matched);
            }
          },
        });

        // Popup content matching exact requirements
        const isBreached =
          props.riverLevelM !== null &&
          props.dangerLevelM !== null &&
          props.riverLevelM >= props.dangerLevelM;

        const popupContent = `
          <div style="font-family: inherit; font-size: 11px; min-width: 220px; padding: 2px;">
            <div style="display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid rgba(226, 232, 240, 0.6); padding-bottom: 6px; margin-bottom: 6px;">
              <strong style="font-size: 13px; font-weight: 700; color: inherit;">${props.regionName}</strong>
              <span style="background-color: ${color}; color: #ffffff; font-size: 9px; font-weight: 800; text-transform: uppercase; padding: 2px 7px; border-radius: 9999px; letter-spacing: 0.04em;">
                ${props.riskLevel.replace('-', ' ')}
              </span>
            </div>

            <div style="font-size: 11px; opacity: 0.8; margin-bottom: 6px;">
              <span>${props.state} · ${props.basin}</span>
            </div>

            <div style="background: rgba(241, 245, 249, 0.6); border: 1px solid rgba(226, 232, 240, 0.8); border-radius: 8px; padding: 6px 8px; margin-top: 6px; display: grid; grid-template-columns: 1fr 1fr; gap: 6px;">
              <div>
                <span style="opacity: 0.7; font-size: 10px; display: block; font-weight: 500;">24h Rainfall:</span>
                <strong style="color: #1769E8; font-family: monospace; font-size: 12px;">${props.rainfallMm !== null ? props.rainfallMm + ' mm' : 'N/A'}</strong>
              </div>
              <div>
                <span style="opacity: 0.7; font-size: 10px; display: block; font-weight: 500;">River Gauge:</span>
                <strong style="color: #8B5CF6; font-family: monospace; font-size: 12px;">${props.riverLevelM !== null ? props.riverLevelM + ' m' : 'N/A'}</strong>
              </div>
            </div>

            ${
              props.dangerLevelM !== null
                ? `<div style="margin-top: 6px; font-size: 10px; font-weight: 700; color: ${isBreached ? '#F5222D' : '#16B83F'}; display: flex; align-items: center; gap: 4px;">
                    <span>${isBreached ? '⚠️ DANGER MARK EXCEEDED' : '✓ Safe Gauge Level'}</span>
                    <span style="opacity: 0.75; font-weight: normal;">(${props.dangerLevelM}m threshold)</span>
                   </div>`
                : ''
            }

            <div style="margin-top: 8px; padding-top: 6px; border-top: 1px solid rgba(226, 232, 240, 0.6); display: flex; justify-content: space-between; align-items: center; font-size: 10px; opacity: 0.75;">
              <span>Source: <strong>${props.source}</strong></span>
              <span style="color: #1769E8; font-weight: 600;">${props.isSimulated ? 'Simulation' : '● Live Feed'}</span>
            </div>
          </div>
        `;

        layer.bindPopup(popupContent, {
          maxWidth: 310,
          className: 'flood-premium-popup',
          autoPan: true,
          autoPanPadding: [40, 40],
          closeButton: true,
        });
      },
    }).addTo(map);

    geoJsonLayerRef.current = geoJsonLayer;

    // Add to Leaflet layer control as overlay
    if (layerControlRef.current) {
      layerControlRef.current.addOverlay(geoJsonLayer, 'Flood Risk Overlays (GeoJSON)');
    }
  }, [showOverlays, districts, onSelectDistrict]);

  // 5. Render District Pins
  useEffect(() => {
    const map = mapInstanceRef.current;
    const markersGroup = markersLayerRef.current;
    if (!map || !markersGroup) return;

    markersGroup.clearLayers();

    if (!showOverlays || districts.length === 0) return;

    districts.forEach((d) => {
      const { color } = getRiskColors(d.riskCategory);
      const isSelected = selectedDistrict?.id === d.id;

      const customIcon = L.divIcon({
        className: 'flood-marker-pin',
        html: `
          <div style="position: relative; display: flex; align-items: center; justify-content: center; width: 28px; height: 28px; cursor: pointer;">
            ${
              d.riskCategory === 'very-high'
                ? `<span style="position: absolute; width: 28px; height: 28px; border-radius: 9999px; background-color: ${color}; opacity: 0.45; animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;"></span>`
                : ''
            }
            <div style="
              width: ${isSelected ? '22px' : '16px'};
              height: ${isSelected ? '22px' : '16px'};
              border-radius: 9999px;
              background-color: ${color};
              border: 2px solid #ffffff;
              box-shadow: 0 2px 6px rgba(0,0,0,0.5);
              transition: all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
            "></div>
          </div>
        `,
        iconSize: [28, 28],
        iconAnchor: [14, 14],
      });

      const marker = L.marker(d.coordinates, { icon: customIcon });

      marker.on('click', () => {
        if (onSelectDistrict) {
          onSelectDistrict(d);
        }
      });

      marker.bindTooltip(
        `<div style="font-family: inherit; font-size: 11px; font-weight: 600; color: #10294B;">
          <div>${d.name}</div>
          <div style="color: ${color}; font-weight: bold;">${d.riskCategory.toUpperCase()} RISK (${d.riskScore}/100)</div>
        </div>`,
        { direction: 'top', offset: [0, -10] }
      );

      marker.addTo(markersGroup);
    });
  }, [districts, showOverlays, selectedDistrict, onSelectDistrict]);

  // Center on selected district if clicked externally with smooth flyTo animation
  useEffect(() => {
    if (selectedDistrict && mapInstanceRef.current) {
      mapInstanceRef.current.flyTo(selectedDistrict.coordinates, 8, {
        duration: 1.25,
        easeLinearity: 0.25,
        animate: true,
      });
    }
  }, [selectedDistrict]);

  // Map Controls callbacks with animated transitions
  const handleZoomIn = useCallback(() => {
    mapInstanceRef.current?.zoomIn(1, { animate: true });
  }, []);

  const handleZoomOut = useCallback(() => {
    mapInstanceRef.current?.zoomOut(1, { animate: true });
  }, []);

  const handleResetView = useCallback(() => {
    mapInstanceRef.current?.flyTo(initialCenter, initialZoom, {
      duration: 1.25,
      easeLinearity: 0.25,
      animate: true,
    });
  }, []);

  const handleLocate = useCallback(() => {
    if (selectedDistrict && mapInstanceRef.current) {
      mapInstanceRef.current.flyTo(selectedDistrict.coordinates, 8, {
        duration: 1.25,
        easeLinearity: 0.25,
        animate: true,
      });
    } else if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([26.1445, 91.7362], 7, {
        duration: 1.25,
        easeLinearity: 0.25,
        animate: true,
      });
    }
  }, [selectedDistrict]);

  const handleToggleBasemap = useCallback(() => {
    setBasemap((prev) => {
      if (prev === 'satellite') return 'terrain';
      if (prev === 'terrain') return 'standard';
      return 'satellite';
    });
  }, []);

  const handleToggleOverlays = useCallback(() => {
    setShowOverlays((prev) => !prev);
  }, []);

  return (
    <div className="bg-white rounded-xl border border-[#D9E6F5] shadow-[0_2px_8px_rgba(20,46,83,0.04)] overflow-hidden flex flex-col relative">
      {/* Map Viewport */}
      <div className={`relative w-full ${heightClass}`}>
        <div ref={mapContainerRef} className="w-full h-full" />

        {/* 1. Dark Translucent Title Badge in top-left */}
        <FloodMapStatus lastUpdated={lastUpdated} isSimulated={true} />

        {/* 2. Vertical Zoom and Reset Controls in top-right (positioned under Leaflet layer control) */}
        <FloodMapControls
          onZoomIn={handleZoomIn}
          onZoomOut={handleZoomOut}
          onResetView={handleResetView}
          onLocate={handleLocate}
          basemap={basemap}
          onToggleBasemap={handleToggleBasemap}
          hasLeafletLayerControl={enableLeafletLayerControl}
        />

        {/* 3. Risk Legend in bottom-left */}
        {customLegend ? (
          customLegend
        ) : !hideDefaultLegend ? (
          <FloodMapLegend
            showOverlays={showOverlays}
            onToggleOverlays={handleToggleOverlays}
          />
        ) : null}
      </div>
    </div>
  );
};

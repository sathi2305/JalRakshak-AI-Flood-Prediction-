import React, { useState } from 'react';
import { DashboardSummary, DistrictRisk, FloodAlert, DataSourceStatus, RecommendedAction, TrendDataPoint } from '../../types/flood';
import { RainfallKpiCard } from '../dashboard/RainfallKpiCard';
import { RiverLevelKpiCard } from '../dashboard/RiverLevelKpiCard';
import { FloodRiskKpiCard } from '../dashboard/FloodRiskKpiCard';
import { AffectedAreasKpiCard } from '../dashboard/AffectedAreasKpiCard';
import { FloodRiskMap } from '../dashboard/FloodRiskMap';
import { FloodAlertCard } from '../dashboard/FloodAlertCard';
import { RainfallRiverTrendChart } from '../dashboard/RainfallRiverTrendChart';
import { DistrictRiskScoreBarChart } from '../dashboard/DistrictRiskScoreBarChart';
import { DistrictRiskTable } from '../dashboard/DistrictRiskTable';
import { RecentAlertsPanel } from '../dashboard/RecentAlertsPanel';
import { DataSourcesPanel } from '../dashboard/DataSourcesPanel';
import { RecommendedActionsPanel } from '../dashboard/RecommendedActionsPanel';
import { BarChart3, Table as TableIcon } from 'lucide-react';

interface DashboardViewProps {
  summary: DashboardSummary;
  districts: DistrictRisk[];
  alerts: FloodAlert[];
  trend24h: TrendDataPoint[];
  trend7d: TrendDataPoint[];
  dataSources: DataSourceStatus[];
  actions: RecommendedAction[];
  onDispatchAlert: (alertId: string) => void;
  onRefreshDataSources: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  summary,
  districts,
  alerts,
  trend24h,
  trend7d,
  dataSources,
  actions,
  onDispatchAlert,
  onRefreshDataSources,
}) => {
  const [selectedDistrict, setSelectedDistrict] = useState<DistrictRisk | null>(districts[0] || null);
  const [districtViewMode, setDistrictViewMode] = useState<'chart' | 'table'>('chart');

  const activeCriticalAlert = alerts.find((a) => a.severity === 'very-high') || alerts[0];

  return (
    <div className="space-y-4 max-w-[1600px] mx-auto">
      {/* 1. Four KPI Cards in a Single Horizontal Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        <RainfallKpiCard data={summary.rainfall24h} />
        <RiverLevelKpiCard data={summary.riverLevel} />
        <FloodRiskKpiCard data={summary.floodRisk} />
        <AffectedAreasKpiCard data={summary.affectedAreas} />
      </div>

      {/* 2. Main Central Layout: Left Column and Right Column */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        {/* LEFT COLUMN: Large Map, District Risk Overview (Bar Chart & Table), Recent Alerts & Data Sources */}
        <div className="lg:col-span-7 xl:col-span-7 space-y-4">
          {/* Large India & Global Geospatial Flood-Risk Map */}
          <FloodRiskMap
            districts={districts}
            selectedDistrict={selectedDistrict}
            onSelectDistrict={(d) => setSelectedDistrict(d)}
            heightClass="h-[360px] lg:h-[400px]"
          />

          {/* District Risk Overview with Recharts Bar Chart & Table Switcher */}
          <div className="space-y-2">
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-[#142E53] uppercase tracking-wider">
                  District Risk Vulnerability
                </span>
                <span className="text-[11px] text-[#5B7395]">
                  ({districts.length} Monitored Catchments)
                </span>
              </div>

              {/* Segmented control: Chart vs Table */}
              <div className="flex items-center bg-[#EDF4FC] p-0.5 rounded-lg border border-[#D9E6F5] text-xs">
                <button
                  onClick={() => setDistrictViewMode('chart')}
                  className={`px-3 py-1 rounded-md font-semibold flex items-center gap-1.5 transition-all ${
                    districtViewMode === 'chart'
                      ? 'bg-white text-[#1769E8] shadow-xs'
                      : 'text-[#5B7395] hover:text-[#142E53]'
                  }`}
                >
                  <BarChart3 className="w-3.5 h-3.5" />
                  <span>Risk Score Bar Chart</span>
                </button>

                <button
                  onClick={() => setDistrictViewMode('table')}
                  className={`px-3 py-1 rounded-md font-semibold flex items-center gap-1.5 transition-all ${
                    districtViewMode === 'table'
                      ? 'bg-white text-[#1769E8] shadow-xs'
                      : 'text-[#5B7395] hover:text-[#142E53]'
                  }`}
                >
                  <TableIcon className="w-3.5 h-3.5" />
                  <span>Data Table</span>
                </button>
              </div>
            </div>

            {/* Render Recharts Bar Chart or Table */}
            {districtViewMode === 'chart' ? (
              <DistrictRiskScoreBarChart
                districts={districts}
                selectedDistrict={selectedDistrict}
                onSelectDistrict={(d) => setSelectedDistrict(d)}
              />
            ) : (
              <DistrictRiskTable
                districts={districts}
                selectedDistrict={selectedDistrict}
                onSelectDistrict={(d) => setSelectedDistrict(d)}
              />
            )}
          </div>

          {/* Recent Alerts & Data Sources in a 2-column strip under the table/chart */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <RecentAlertsPanel
              alerts={alerts}
              onSelectAlert={(alert) => {
                const matched = districts.find((d) => d.name.includes(alert.location.split(',')[0]));
                if (matched) setSelectedDistrict(matched);
              }}
            />
            <DataSourcesPanel
              dataSources={dataSources}
              onRefresh={onRefreshDataSources}
            />
          </div>
        </div>

        {/* RIGHT COLUMN: Flood Alert, Rainfall & River Trend Chart, Recommended Actions */}
        <div className="lg:col-span-5 xl:col-span-5 space-y-4">
          {/* Flood Alert Card (Upper Right) */}
          {activeCriticalAlert && (
            <FloodAlertCard
              alert={activeCriticalAlert}
              onDispatchAlert={onDispatchAlert}
            />
          )}

          {/* Rainfall & River Level Trend Chart (Below Alert) */}
          <RainfallRiverTrendChart
            data24h={trend24h}
            data7d={trend7d}
          />

          {/* Recommended Actions Panel (Lower Right) */}
          <RecommendedActionsPanel
            actions={actions}
          />
        </div>
      </div>
    </div>
  );
};

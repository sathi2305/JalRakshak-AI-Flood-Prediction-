import React, { useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  ReferenceLine,
} from 'recharts';
import { DistrictRisk } from '../../types/flood';
import { BarChart3, ArrowUpDown, ShieldAlert, Droplets, Waves } from 'lucide-react';

interface DistrictRiskScoreBarChartProps {
  districts: DistrictRisk[];
  selectedDistrict: DistrictRisk | null;
  onSelectDistrict: (district: DistrictRisk) => void;
}

export const DistrictRiskScoreBarChart: React.FC<DistrictRiskScoreBarChartProps> = ({
  districts,
  selectedDistrict,
  onSelectDistrict,
}) => {
  const [sortBy, setSortBy] = useState<'risk' | 'rainfall' | 'river'>('risk');

  // Sort districts
  const sortedDistricts = [...districts].sort((a, b) => {
    if (sortBy === 'risk') return b.riskScore - a.riskScore;
    if (sortBy === 'rainfall') return b.rainfall24h - a.rainfall24h;
    if (sortBy === 'river') return (b.riverLevel - b.dangerLevel) - (a.riverLevel - a.dangerLevel);
    return 0;
  });

  const getBarColor = (score: number) => {
    if (score >= 75) return '#F5222D'; // Very High
    if (score >= 50) return '#FF9418'; // High
    if (score >= 25) return '#FFD52A'; // Moderate
    return '#16B83F'; // Low
  };

  // Format short label for X-axis
  const formatShortName = (name: string) => {
    return name
      .replace(' Metropolitan (Guwahati)', ' (GHY)')
      .replace(' / Delhi Border', ' (Delhi)')
      .replace(' (Rajahmundry)', ' (RJY)')
      .slice(0, 14);
  };

  return (
    <div className="bg-white rounded-xl border border-[#D9E6F5] shadow-[0_2px_8px_rgba(20,46,83,0.04)] overflow-hidden flex flex-col p-4">
      {/* Header & Sorters */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3 pb-2.5 border-b border-[#EDF4FC]">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-[#EBF3FE] text-[#1769E8] flex items-center justify-center">
            <BarChart3 className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-[#142E53]">
              District Flood Risk Score Comparison
            </h3>
            <p className="text-[11px] text-[#5B7395]">
              Cross-district vulnerability index (0–100) calibrated with CWC danger thresholds
            </p>
          </div>
        </div>

        {/* Sort Controls */}
        <div className="flex items-center gap-1.5 text-xs">
          <span className="text-[#8499B5] text-[11px] font-medium flex items-center gap-1">
            <ArrowUpDown className="w-3 h-3" />
            Sort:
          </span>
          <div className="flex items-center bg-[#EDF4FC] p-0.5 rounded-lg border border-[#D9E6F5]">
            <button
              onClick={() => setSortBy('risk')}
              className={`px-2 py-0.5 rounded-md font-semibold text-xs transition-colors ${
                sortBy === 'risk'
                  ? 'bg-white text-[#1769E8] shadow-xs'
                  : 'text-[#5B7395] hover:text-[#142E53]'
              }`}
            >
              Risk Score
            </button>
            <button
              onClick={() => setSortBy('rainfall')}
              className={`px-2 py-0.5 rounded-md font-semibold text-xs transition-colors ${
                sortBy === 'rainfall'
                  ? 'bg-white text-[#1769E8] shadow-xs'
                  : 'text-[#5B7395] hover:text-[#142E53]'
              }`}
            >
              24h Rain
            </button>
            <button
              onClick={() => setSortBy('river')}
              className={`px-2 py-0.5 rounded-md font-semibold text-xs transition-colors ${
                sortBy === 'river'
                  ? 'bg-white text-[#1769E8] shadow-xs'
                  : 'text-[#5B7395] hover:text-[#142E53]'
              }`}
            >
              Danger Buffer
            </button>
          </div>
        </div>
      </div>

      {/* Recharts Bar Chart Container */}
      <div className="w-full h-64 sm:h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={sortedDistricts}
            margin={{ top: 15, right: 12, left: -18, bottom: 45 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#EDF4FC" />
            <XAxis
              dataKey="name"
              tickFormatter={formatShortName}
              angle={-32}
              textAnchor="end"
              interval={0}
              height={50}
              tick={{ fill: '#5B7395', fontSize: 10, fontWeight: 500 }}
              axisLine={{ stroke: '#D9E6F5' }}
              tickLine={false}
            />
            <YAxis
              domain={[0, 100]}
              tick={{ fill: '#5B7395', fontSize: 10, fontWeight: 600 }}
              axisLine={{ stroke: '#D9E6F5' }}
              tickLine={false}
              unit=" pts"
            />
            <Tooltip
              cursor={{ fill: '#F1F5F9', opacity: 0.6 }}
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload as DistrictRisk;
                  const isBreached = data.riverLevel >= data.dangerLevel;
                  const buffer = (data.riverLevel - data.dangerLevel).toFixed(1);

                  return (
                    <div className="bg-[#10294B] text-white p-3 rounded-xl text-xs shadow-2xl border border-[#234B7D] min-w-[210px]">
                      <div className="font-bold text-sm text-white border-b border-[#204473] pb-1.5 mb-2 flex items-center justify-between">
                        <span>{data.name}</span>
                        <span
                          className="px-1.5 py-0.5 rounded text-[10px] font-bold uppercase text-white"
                          style={{ backgroundColor: getBarColor(data.riskScore) }}
                        >
                          {data.riskCategory}
                        </span>
                      </div>

                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between text-[#8FAAC8]">
                          <span>State & Basin:</span>
                          <strong className="text-white">{data.state} · {data.riverBasin}</strong>
                        </div>

                        <div className="flex items-center justify-between text-[#8FAAC8]">
                          <span className="flex items-center gap-1 text-[#F5222D]">
                            <ShieldAlert className="w-3.5 h-3.5" />
                            Risk Index:
                          </span>
                          <strong className="font-mono text-base font-black text-white">
                            {data.riskScore} / 100
                          </strong>
                        </div>

                        <div className="flex items-center justify-between text-[#8FAAC8]">
                          <span className="flex items-center gap-1 text-[#60A5FA]">
                            <Droplets className="w-3.5 h-3.5" />
                            24h Rainfall:
                          </span>
                          <strong className="font-mono text-white">
                            {data.rainfall24h} mm
                          </strong>
                        </div>

                        <div className="flex items-center justify-between text-[#8FAAC8]">
                          <span className="flex items-center gap-1 text-[#C084FC]">
                            <Waves className="w-3.5 h-3.5" />
                            River Gauge:
                          </span>
                          <strong className="font-mono text-white">
                            {data.riverLevel} m
                          </strong>
                        </div>

                        <div className="mt-1 pt-1.5 border-t border-[#204473] text-[10px] flex items-center justify-between">
                          <span className="text-[#8FAAC8]">Danger Threshold:</span>
                          <span className={isBreached ? 'text-[#FCA5A5] font-bold' : 'text-[#86EFAC]'}>
                            {isBreached ? `+${buffer}m OVER DANGER` : `Safe (${data.dangerLevel}m)`}
                          </span>
                        </div>

                        <div className="text-[10px] text-[#60A5FA] pt-1 text-center font-medium italic">
                          Click bar to locate on live map
                        </div>
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />

            {/* Reference Threshold Lines */}
            <ReferenceLine
              y={75}
              stroke="#F5222D"
              strokeDasharray="4 4"
              strokeWidth={1.5}
              label={{
                value: 'Critical Threshold (75+)',
                fill: '#F5222D',
                fontSize: 10,
                position: 'insideTopRight',
              }}
            />
            <ReferenceLine
              y={50}
              stroke="#FF9418"
              strokeDasharray="4 4"
              strokeWidth={1.2}
              label={{
                value: 'High Risk (50+)',
                fill: '#FF9418',
                fontSize: 10,
                position: 'insideTopRight',
              }}
            />

            <Bar
              dataKey="riskScore"
              radius={[5, 5, 0, 0]}
              maxBarSize={32}
              className="cursor-pointer transition-opacity duration-200"
            >
              {sortedDistricts.map((entry) => {
                const isSelected = selectedDistrict?.id === entry.id;
                return (
                  <Cell
                    key={`cell-${entry.id}`}
                    fill={getBarColor(entry.riskScore)}
                    stroke={isSelected ? '#10294B' : 'transparent'}
                    strokeWidth={isSelected ? 2.5 : 0}
                    opacity={selectedDistrict ? (isSelected ? 1.0 : 0.75) : 0.95}
                    onClick={() => onSelectDistrict(entry)}
                  />
                );
              })}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Legend & Active Selection Summary */}
      <div className="mt-2 pt-2 border-t border-[#EDF4FC] flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-3 text-[11px] text-[#5B7395]">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#F5222D]" />
            <span>Very High (&ge;75)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#FF9418]" />
            <span>High (50–74)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#FFD52A]" />
            <span>Moderate (25–49)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#16B83F]" />
            <span>Low (&lt;25)</span>
          </div>
        </div>

        {selectedDistrict && (
          <div className="text-[11px] text-[#142E53] font-medium bg-[#F3F8FD] px-2.5 py-1 rounded-md border border-[#D9E6F5]">
            Selected: <strong className="text-[#1769E8]">{selectedDistrict.name}</strong> ({selectedDistrict.riskScore}/100)
          </div>
        )}
      </div>
    </div>
  );
};

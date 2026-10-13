import React, { useState } from 'react';
import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import { TrendDataPoint } from '../../types/flood';
import { BarChart3 } from 'lucide-react';

interface RainfallRiverTrendChartProps {
  data24h: TrendDataPoint[];
  data7d: TrendDataPoint[];
}

export const RainfallRiverTrendChart: React.FC<RainfallRiverTrendChartProps> = ({
  data24h,
  data7d,
}) => {
  const [timeframe, setTimeframe] = useState<'24h' | '7d'>('24h');
  const currentData = timeframe === '24h' ? data24h : data7d;

  return (
    <div className="bg-white rounded-xl p-4 border border-[#D9E6F5] shadow-[0_2px_8px_rgba(20,46,83,0.04)] flex flex-col justify-between">
      {/* Chart Header & Controls */}
      <div className="flex items-center justify-between gap-2 mb-3">
        <div>
          <div className="flex items-center gap-1.5">
            <h3 className="text-sm font-bold text-[#142E53]">
              Rainfall & River Level Trend
            </h3>
          </div>
          <p className="text-[11px] text-[#5B7395] mt-0.5">
            Dual-telemetry correlation (IMD AWS & CWC Gauge)
          </p>
        </div>

        {/* Timeframe switcher */}
        <div className="flex items-center bg-[#EDF4FC] p-0.5 rounded-lg border border-[#D9E6F5] text-xs">
          <button
            onClick={() => setTimeframe('24h')}
            className={`px-2.5 py-1 rounded-md font-semibold transition-all ${
              timeframe === '24h'
                ? 'bg-white text-[#1769E8] shadow-xs'
                : 'text-[#5B7395] hover:text-[#142E53]'
            }`}
          >
            24h
          </button>
          <button
            onClick={() => setTimeframe('7d')}
            className={`px-2.5 py-1 rounded-md font-semibold transition-all ${
              timeframe === '7d'
                ? 'bg-white text-[#1769E8] shadow-xs'
                : 'text-[#5B7395] hover:text-[#142E53]'
            }`}
          >
            7 Days
          </button>
        </div>
      </div>

      {/* Chart Area */}
      <div className="w-full h-56">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={currentData}
            margin={{ top: 8, right: 12, left: -14, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#EDF4FC" />
            <XAxis
              dataKey="time"
              tick={{ fill: '#5B7395', fontSize: 10, fontWeight: 500 }}
              axisLine={{ stroke: '#D9E6F5' }}
              tickLine={false}
            />
            {/* Left Axis: Rainfall (mm) */}
            <YAxis
              yAxisId="rain"
              orientation="left"
              tick={{ fill: '#1769E8', fontSize: 10, fontWeight: 600 }}
              axisLine={{ stroke: '#D9E6F5' }}
              tickLine={false}
              domain={[0, 'dataMax + 30']}
              unit="mm"
            />
            {/* Right Axis: River Level (m) */}
            <YAxis
              yAxisId="river"
              orientation="right"
              tick={{ fill: '#8B5CF6', fontSize: 10, fontWeight: 600 }}
              axisLine={{ stroke: '#D9E6F5' }}
              tickLine={false}
              domain={[70, 80]}
              unit="m"
            />
            <Tooltip
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-[#10294B] text-white p-2.5 rounded-lg text-xs shadow-xl border border-[#1C3E6B]">
                      <div className="font-bold text-[#8FAAC8] border-b border-[#214A82] pb-1 mb-1.5">
                        Time: {label}
                      </div>
                      <div className="flex items-center justify-between gap-4 py-0.5">
                        <span className="text-[#60A5FA] flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-xs bg-[#1769E8]" />
                          Rainfall:
                        </span>
                        <strong className="font-mono text-white">{payload[0]?.value} mm</strong>
                      </div>
                      <div className="flex items-center justify-between gap-4 py-0.5">
                        <span className="text-[#C084FC] flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-[#8B5CF6]" />
                          River Level:
                        </span>
                        <strong className="font-mono text-white">{payload[1]?.value} m</strong>
                      </div>
                      <div className="mt-1 pt-1 border-t border-[#214A82] text-[10px] text-[#FCA5A5]">
                        Danger Mark: 76.0 m
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Legend
              verticalAlign="top"
              align="right"
              height={28}
              iconSize={8}
              wrapperStyle={{ fontSize: '11px', top: -8 }}
              formatter={(value) => {
                if (value === 'rainfall') return <span style={{ color: '#1769E8', fontWeight: 600 }}>Rainfall (mm)</span>;
                if (value === 'riverLevel') return <span style={{ color: '#8B5CF6', fontWeight: 600 }}>River Level (m)</span>;
                return value;
              }}
            />

            {/* Reference Line for Danger Mark on river axis */}
            <ReferenceLine
              yAxisId="river"
              y={76.0}
              stroke="#F5222D"
              strokeDasharray="4 4"
              strokeWidth={1.5}
              label={{
                value: 'Danger Mark 76m',
                fill: '#F5222D',
                fontSize: 10,
                position: 'insideTopRight',
              }}
            />

            {/* Blue bars for rainfall */}
            <Bar
              yAxisId="rain"
              dataKey="rainfall"
              fill="#1769E8"
              radius={[4, 4, 0, 0]}
              maxBarSize={28}
              name="rainfall"
            />
            {/* Purple line for river level */}
            <Line
              yAxisId="river"
              type="monotone"
              dataKey="riverLevel"
              stroke="#8B5CF6"
              strokeWidth={2.5}
              dot={{ r: 3, fill: '#8B5CF6', stroke: '#FFFFFF', strokeWidth: 1.5 }}
              activeDot={{ r: 5, fill: '#8B5CF6' }}
              name="riverLevel"
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

import React from 'react';
import { CloudRain, TrendingUp } from 'lucide-react';
import { DashboardSummary } from '../../types/flood';

interface RainfallKpiCardProps {
  data: DashboardSummary['rainfall24h'];
}

export const RainfallKpiCard: React.FC<RainfallKpiCardProps> = ({ data }) => {
  return (
    <div className="bg-white rounded-xl p-4 border border-[#D9E6F5] shadow-[0_2px_8px_rgba(20,46,83,0.04)] flex flex-col justify-between transition-all hover:border-[#1769E8]/40">
      <div className="flex items-start justify-between">
        <div>
          <span className="text-xs font-semibold text-[#5B7395] tracking-wide uppercase">
            Total Rainfall (24h)
          </span>
          <div className="flex items-baseline gap-1.5 mt-1.5">
            <span className="text-2xl lg:text-3xl font-extrabold text-[#142E53] tabular-nums tracking-tight">
              {data.value}
            </span>
            <span className="text-sm font-semibold text-[#5B7395]">{data.unit}</span>
          </div>
        </div>
        <div className="w-10 h-10 rounded-lg bg-[#EBF3FE] text-[#1769E8] flex items-center justify-center shrink-0">
          <CloudRain className="w-5 h-5" />
        </div>
      </div>

      <div className="mt-3 pt-2.5 border-t border-[#EDF4FC] flex items-center justify-between text-xs">
        <div className="flex items-center gap-1 text-[#F5222D] font-medium">
          <TrendingUp className="w-3.5 h-3.5" />
          <span>+{data.changePct}% vs norm</span>
        </div>
        <span className="text-[#8499B5]">{data.latestObservation}</span>
      </div>
    </div>
  );
};

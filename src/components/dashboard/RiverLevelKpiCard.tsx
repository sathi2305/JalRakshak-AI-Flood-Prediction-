import React from 'react';
import { Waves, AlertTriangle } from 'lucide-react';
import { DashboardSummary } from '../../types/flood';

interface RiverLevelKpiCardProps {
  data: DashboardSummary['riverLevel'];
}

export const RiverLevelKpiCard: React.FC<RiverLevelKpiCardProps> = ({ data }) => {
  const isAboveDanger = data.aboveDanger > 0;

  return (
    <div className="bg-white rounded-xl p-4 border border-[#D9E6F5] shadow-[0_2px_8px_rgba(20,46,83,0.04)] flex flex-col justify-between transition-all hover:border-[#1769E8]/40">
      <div className="flex items-start justify-between">
        <div>
          <span className="text-xs font-semibold text-[#5B7395] tracking-wide uppercase">
            River Water Level
          </span>
          <div className="flex items-baseline gap-1.5 mt-1.5">
            <span className="text-2xl lg:text-3xl font-extrabold text-[#142E53] tabular-nums tracking-tight">
              {data.current}
            </span>
            <span className="text-sm font-semibold text-[#5B7395]">{data.unit}</span>
          </div>
        </div>
        <div className="w-10 h-10 rounded-lg bg-[#F3E8FF] text-[#8B5CF6] flex items-center justify-center shrink-0">
          <Waves className="w-5 h-5" />
        </div>
      </div>

      <div className="mt-3 pt-2.5 border-t border-[#EDF4FC] flex items-center justify-between text-xs">
        <div className="flex items-center gap-1 text-[#F5222D] font-semibold">
          <AlertTriangle className="w-3.5 h-3.5" />
          <span>
            {isAboveDanger ? `+${data.aboveDanger}m above danger` : 'Within safe limits'}
          </span>
        </div>
        <span className="text-[#8499B5] truncate max-w-[110px]" title={data.gaugeStation}>
          {data.river}
        </span>
      </div>
    </div>
  );
};

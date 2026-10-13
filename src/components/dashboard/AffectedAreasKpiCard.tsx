import React from 'react';
import { MapPin, Home } from 'lucide-react';
import { DashboardSummary } from '../../types/flood';

interface AffectedAreasKpiCardProps {
  data: DashboardSummary['affectedAreas'];
}

export const AffectedAreasKpiCard: React.FC<AffectedAreasKpiCardProps> = ({ data }) => {
  return (
    <div className="bg-white rounded-xl p-4 border border-[#D9E6F5] shadow-[0_2px_8px_rgba(20,46,83,0.04)] flex flex-col justify-between transition-all hover:border-[#1769E8]/40">
      <div className="flex items-start justify-between">
        <div>
          <span className="text-xs font-semibold text-[#5B7395] tracking-wide uppercase">
            Affected Areas
          </span>
          <div className="flex items-baseline gap-1.5 mt-1.5">
            <span className="text-2xl lg:text-3xl font-extrabold text-[#142E53] tabular-nums tracking-tight">
              {data.districtCount}
            </span>
            <span className="text-sm font-semibold text-[#5B7395]">Districts</span>
          </div>
        </div>
        <div className="w-10 h-10 rounded-lg bg-[#FFEDD5] text-[#FF9418] flex items-center justify-center shrink-0">
          <MapPin className="w-5 h-5" />
        </div>
      </div>

      <div className="mt-3 pt-2.5 border-t border-[#EDF4FC] flex items-center justify-between text-xs">
        <span className="text-[#FF9418] font-semibold">
          {data.riversExceedingDanger} Rivers Exceeding Danger
        </span>
        <span className="text-[#8499B5] flex items-center gap-1">
          <Home className="w-3 h-3 text-[#1769E8]" />
          <span>{data.activeReliefCamps} Camps Active</span>
        </span>
      </div>
    </div>
  );
};

import React from 'react';
import { ShieldAlert, Info } from 'lucide-react';
import { DashboardSummary } from '../../types/flood';

interface FloodRiskKpiCardProps {
  data: DashboardSummary['floodRisk'];
}

export const FloodRiskKpiCard: React.FC<FloodRiskKpiCardProps> = ({ data }) => {
  const getBadgeStyle = (category: string) => {
    switch (category) {
      case 'very-high':
        return 'text-[#F5222D] bg-[#FEE2E2] border-[#FCA5A5]';
      case 'high':
        return 'text-[#FF9418] bg-[#FFEDD5] border-[#FDBA74]';
      case 'moderate':
        return 'text-[#CA8A04] bg-[#FEF9C3] border-[#FDE047]';
      default:
        return 'text-[#16B83F] bg-[#DCFCE7] border-[#86EFAC]';
    }
  };

  const formatCategory = (cat: string) => {
    switch (cat) {
      case 'very-high':
        return 'Very High';
      case 'high':
        return 'High Risk';
      case 'moderate':
        return 'Moderate';
      default:
        return 'Low Risk';
    }
  };

  return (
    <div className="bg-white rounded-xl p-4 border border-[#D9E6F5] shadow-[0_2px_8px_rgba(20,46,83,0.04)] flex flex-col justify-between transition-all hover:border-[#1769E8]/40">
      <div className="flex items-start justify-between">
        <div>
          <span className="text-xs font-semibold text-[#5B7395] tracking-wide uppercase">
            Flood Risk Level
          </span>
          <div className="flex items-baseline gap-2 mt-1.5">
            <span className="text-2xl lg:text-3xl font-extrabold text-[#F5222D] tracking-tight">
              {formatCategory(data.category)}
            </span>
            <span className="text-sm font-bold text-[#5B7395] font-mono tabular-nums">
              ({data.score}/100)
            </span>
          </div>
        </div>
        <div className="w-10 h-10 rounded-lg bg-[#FEE2E2] text-[#F5222D] flex items-center justify-center shrink-0">
          <ShieldAlert className="w-5 h-5" />
        </div>
      </div>

      <div className="mt-3 pt-2.5 border-t border-[#EDF4FC] flex items-center justify-between text-xs">
        <span className="text-[#F5222D] font-semibold">
          {data.highRiskDistrictCount} Districts on Alert
        </span>
        <span className="text-[#8499B5] flex items-center gap-1">
          <Info className="w-3 h-3" />
          <span>Real-time CWC Index</span>
        </span>
      </div>
    </div>
  );
};

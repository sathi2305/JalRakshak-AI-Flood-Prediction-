import React, { useState } from 'react';
import { DistrictRisk } from '../../types/flood';
import { Search, TrendingUp, TrendingDown, Minus, ChevronRight, Eye } from 'lucide-react';

interface DistrictRiskTableProps {
  districts: DistrictRisk[];
  selectedDistrict: DistrictRisk | null;
  onSelectDistrict: (district: DistrictRisk) => void;
}

export const DistrictRiskTable: React.FC<DistrictRiskTableProps> = ({
  districts,
  selectedDistrict,
  onSelectDistrict,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredDistricts = districts.filter(
    (d) =>
      d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.state.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.riverBasin.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'rising':
        return <TrendingUp className="w-3.5 h-3.5 text-[#F5222D]" />;
      case 'falling':
        return <TrendingDown className="w-3.5 h-3.5 text-[#16B83F]" />;
      default:
        return <Minus className="w-3.5 h-3.5 text-[#CA8A04]" />;
    }
  };

  const getCategoryBadge = (cat: string) => {
    switch (cat) {
      case 'very-high':
        return (
          <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-[#FEE2E2] text-[#F5222D] border border-[#FCA5A5] uppercase whitespace-nowrap">
            Very High
          </span>
        );
      case 'high':
        return (
          <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-[#FFEDD5] text-[#FF9418] border border-[#FDBA74] uppercase whitespace-nowrap">
            High Risk
          </span>
        );
      case 'moderate':
        return (
          <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-[#FEF9C3] text-[#CA8A04] border border-[#FDE047] uppercase whitespace-nowrap">
            Moderate
          </span>
        );
      default:
        return (
          <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-[#DCFCE7] text-[#16B83F] border border-[#86EFAC] uppercase whitespace-nowrap">
            Low Risk
          </span>
        );
    }
  };

  return (
    <div className="bg-white rounded-xl border border-[#D9E6F5] shadow-[0_2px_8px_rgba(20,46,83,0.04)] overflow-hidden flex flex-col">
      {/* Table Header with Search */}
      <div className="px-4 py-3 border-b border-[#EDF4FC] flex flex-wrap items-center justify-between gap-2 bg-[#FAFDFE]">
        <div>
          <h3 className="text-sm font-bold text-[#142E53]">
            District Risk Overview
          </h3>
          <p className="text-[11px] text-[#5B7395]">
            Real-time vulnerability & hydrologic threshold monitoring
          </p>
        </div>

        {/* Search Input */}
        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-[#8499B5]" />
          <input
            type="text"
            placeholder="Search district, state, river..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8 pr-3 py-1 text-xs rounded-lg border border-[#D9E6F5] bg-white text-[#142E53] placeholder-[#8499B5] focus:outline-none focus:border-[#1769E8] w-48 sm:w-60"
          />
        </div>
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto max-h-[290px] overflow-y-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead className="bg-[#F8FAFC] text-[#5B7395] text-[11px] font-semibold sticky top-0 z-10 border-b border-[#EDF4FC]">
            <tr>
              <th className="py-2.5 px-3">District & State</th>
              <th className="py-2.5 px-3">River Basin</th>
              <th className="py-2.5 px-3 text-right">24h Rain</th>
              <th className="py-2.5 px-3 text-right">River Level</th>
              <th className="py-2.5 px-3 text-center">Trend</th>
              <th className="py-2.5 px-3 text-center">Risk Level</th>
              <th className="py-2.5 px-3 text-center">Inspect</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#EDF4FC]">
            {filteredDistricts.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-6 text-xs text-[#8499B5]">
                  No districts match your search query.
                </td>
              </tr>
            ) : (
              filteredDistricts.map((d) => {
                const isSelected = selectedDistrict?.id === d.id;
                const buffer = (d.riverLevel - d.dangerLevel).toFixed(1);
                const isAbove = d.riverLevel >= d.dangerLevel;

                return (
                  <tr
                    key={d.id}
                    onClick={() => onSelectDistrict(d)}
                    className={`cursor-pointer transition-colors ${
                      isSelected
                        ? 'bg-[#EBF3FE] font-medium'
                        : 'hover:bg-[#F8FAFC]'
                    }`}
                  >
                    <td className="py-2.5 px-3 text-[#142E53]">
                      <div className="font-semibold text-xs leading-tight">{d.name}</div>
                      <div className="text-[10px] text-[#5B7395]">{d.state}</div>
                    </td>
                    <td className="py-2.5 px-3 text-[#5B7395] text-xs">
                      {d.riverBasin}
                    </td>
                    <td className="py-2.5 px-3 text-right text-[#142E53] font-mono tabular-nums">
                      {d.rainfall24h} mm
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono tabular-nums">
                      <div className="text-[#142E53]">{d.riverLevel} m</div>
                      <div className={`text-[10px] ${isAbove ? 'text-[#F5222D] font-bold' : 'text-[#5B7395]'}`}>
                        {isAbove ? `+${buffer}m danger` : `danger: ${d.dangerLevel}m`}
                      </div>
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      <div className="flex items-center justify-center gap-1">
                        {getTrendIcon(d.trend)}
                        <span className="capitalize text-[11px] text-[#5B7395]">
                          {d.trend}
                        </span>
                      </div>
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      {getCategoryBadge(d.riskCategory)}
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectDistrict(d);
                        }}
                        className="p-1 rounded text-[#5B7395] hover:text-[#1769E8] hover:bg-white transition-colors"
                        title="Locate on Map"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

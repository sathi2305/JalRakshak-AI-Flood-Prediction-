import React, { useState } from 'react';
import { ShieldAlert, ChevronDown, ChevronUp, Layers, Info, Filter } from 'lucide-react';
import { RiskSeverity } from '../../types/flood';

interface RiskLevelInfo {
  severity: RiskSeverity;
  label: string;
  colorHex: string;
  badgeBg: string;
  badgeBorder: string;
  badgeText: string;
  glowColor: string;
  description: string;
  threshold: string;
  actionGuideline: string;
}

export const RISK_LEVEL_CONFIG: RiskLevelInfo[] = [
  {
    severity: 'very-high',
    label: 'Very High Risk',
    colorHex: '#F5222D',
    badgeBg: 'bg-[#FEE2E2] dark:bg-[#450A0A]/70',
    badgeBorder: 'border-[#FCA5A5] dark:border-[#991B1B]',
    badgeText: 'text-[#F5222D] dark:text-[#FCA5A5]',
    glowColor: 'shadow-[0_0_10px_rgba(245,34,45,0.4)]',
    description: 'Critical inundation breaching embankment danger level. Severe flash flood or river surge.',
    threshold: 'Water Level > Danger Mark (+1.0m) · 24h Rain > 150mm',
    actionGuideline: 'Immediate evacuation advisories & NDRF rapid deployment required',
  },
  {
    severity: 'high',
    label: 'High Risk',
    colorHex: '#FF9418',
    badgeBg: 'bg-[#FFEDD5] dark:bg-[#431407]/70',
    badgeBorder: 'border-[#FDBA74] dark:border-[#9A3412]',
    badgeText: 'text-[#FF9418] dark:text-[#FDBA74]',
    glowColor: 'shadow-[0_0_10px_rgba(255,148,24,0.4)]',
    description: 'Severe flood danger nearing critical threshold. Embankments under high hydraulic stress.',
    threshold: 'Water Level > Warning Mark (+0.5m) · 24h Rain > 100mm',
    actionGuideline: 'Staging disaster response units & flood barrier reinforcement',
  },
  {
    severity: 'moderate',
    label: 'Moderate Risk',
    colorHex: '#FFD52A',
    badgeBg: 'bg-[#FEF9C3] dark:bg-[#422006]/70',
    badgeBorder: 'border-[#FDE047] dark:border-[#A16207]',
    badgeText: 'text-[#B45309] dark:text-[#FDE047]',
    glowColor: 'shadow-[0_0_10px_rgba(255,213,42,0.35)]',
    description: 'Advisory watch stage. Tributaries swelling steadily from catchment monsoon precipitation.',
    threshold: 'Water Level Approaching Warning Mark · 24h Rain > 65mm',
    actionGuideline: 'Continuous telemetry surveillance & reservoir outflow regulation',
  },
  {
    severity: 'low',
    label: 'Low Risk',
    colorHex: '#16B83F',
    badgeBg: 'bg-[#DCFCE7] dark:bg-[#052E16]/70',
    badgeBorder: 'border-[#86EFAC] dark:border-[#166534]',
    badgeText: 'text-[#16B83F] dark:text-[#86EFAC]',
    glowColor: 'shadow-[0_0_10px_rgba(22,184,63,0.35)]',
    description: 'Hydrological safe baseline. River discharges safely within standard drainage capacities.',
    threshold: 'Normal River Gauge Level · Normal Catchment Runoff',
    actionGuideline: 'Standard automated telemetry polling and routine watershed watch',
  },
];

interface PersistentMapLegendProps {
  districtCounts?: Partial<Record<RiskSeverity, number>>;
  activeFilter?: RiskSeverity | 'all';
  onFilterChange?: (severity: RiskSeverity | 'all') => void;
  className?: string;
  defaultExpanded?: boolean;
}

export const PersistentMapLegend: React.FC<PersistentMapLegendProps> = ({
  districtCounts = {
    'very-high': 3,
    high: 2,
    moderate: 2,
    low: 4,
  },
  activeFilter = 'all',
  onFilterChange,
  className = '',
  defaultExpanded = true,
}) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(defaultExpanded);
  const [showThresholds, setShowThresholds] = useState<boolean>(false);

  return (
    <div
      className={`absolute bottom-3 left-3 z-[450] max-w-[340px] w-[calc(100%-24px)] sm:w-[340px] transition-all duration-200 select-none ${className}`}
    >
      <div className="bg-[#10294B]/92 dark:bg-[#0A1A30]/95 backdrop-blur-md text-white rounded-xl border border-[#2B5488]/80 dark:border-[#204473] shadow-2xl overflow-hidden ring-1 ring-white/10">
        {/* Top Header / Bar */}
        <div className="px-3 py-2 bg-[#0C223E]/90 dark:bg-[#071324]/90 border-b border-[#204473] flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-md bg-[#1769E8] flex items-center justify-center text-white shrink-0 shadow-xs">
              <ShieldAlert className="w-3.5 h-3.5" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-white uppercase tracking-wider block leading-tight">
                Flood Risk Severity Legend
              </span>
              <span className="text-[9px] text-[#8FAAC8] block leading-none">
                National Hydrological Classification
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1">
            {/* Quick threshold toggle */}
            <button
              type="button"
              onClick={() => setShowThresholds(!showThresholds)}
              className={`p-1 rounded text-[10px] font-semibold transition-colors flex items-center gap-1 ${
                showThresholds
                  ? 'text-[#00D2FF] bg-[#1769E8]/30'
                  : 'text-[#8FAAC8] hover:text-white hover:bg-white/10'
              }`}
              title={showThresholds ? 'Hide Thresholds' : 'Show Sensor Thresholds'}
            >
              <Info className="w-3 h-3" />
            </button>

            {/* Collapse/Expand Toggle */}
            <button
              type="button"
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-1 rounded text-[#8FAAC8] hover:text-white hover:bg-white/10 transition-colors"
              title={isExpanded ? 'Collapse Legend' : 'Expand Legend'}
              aria-label={isExpanded ? 'Collapse legend' : 'Expand legend'}
            >
              {isExpanded ? (
                <ChevronDown className="w-3.5 h-3.5" />
              ) : (
                <ChevronUp className="w-3.5 h-3.5" />
              )}
            </button>
          </div>
        </div>

        {/* Content Body */}
        {isExpanded ? (
          <div className="p-2.5 space-y-2 max-h-[360px] overflow-y-auto">
            {RISK_LEVEL_CONFIG.map((item) => {
              const isCurrentActive =
                activeFilter === 'all' || activeFilter === item.severity;
              const count = districtCounts[item.severity] ?? 0;

              return (
                <div
                  key={item.severity}
                  onClick={() => {
                    if (onFilterChange) {
                      onFilterChange(
                        activeFilter === item.severity ? 'all' : item.severity
                      );
                    }
                  }}
                  className={`p-2 rounded-lg border transition-all cursor-pointer ${
                    activeFilter === item.severity
                      ? 'bg-[#1769E8]/25 border-[#3A82EE] ring-1 ring-[#1769E8]'
                      : 'bg-[#122A4E]/60 dark:bg-[#0D223F]/60 border-[#204473]/70 hover:bg-[#15345E] hover:border-[#2B578C]'
                  } ${!isCurrentActive ? 'opacity-50' : 'opacity-100'}`}
                >
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <div className="flex items-center gap-2">
                      {/* Color indicator pill */}
                      <span
                        className={`w-3.5 h-3.5 rounded-sm shrink-0 ${item.glowColor}`}
                        style={{ backgroundColor: item.colorHex }}
                      />
                      <span className="text-xs font-bold text-white tracking-tight">
                        {item.label}
                      </span>
                    </div>

                    {/* District Count Pill */}
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${item.badgeBg} ${item.badgeBorder} ${item.badgeText}`}
                    >
                      {count} {count === 1 ? 'Zone' : 'Zones'}
                    </span>
                  </div>

                  {/* Text description matching design system */}
                  <p className="text-[11px] text-[#C5D7EF] leading-snug pl-[22px]">
                    {item.description}
                  </p>

                  {/* Sensor telemetry threshold breakdown if toggled */}
                  {showThresholds && (
                    <div className="mt-1.5 pt-1 border-t border-white/10 text-[10px] pl-[22px] space-y-0.5">
                      <div className="text-[#93C5FD] font-mono">
                        <span className="text-[#8FAAC8]">Criteria: </span>
                        {item.threshold}
                      </div>
                      <div className="text-[#E2E8F0] italic">
                        <span className="text-[#8FAAC8] not-italic">Action: </span>
                        {item.actionGuideline}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}

            {/* Bottom active filter indicator bar */}
            {onFilterChange && activeFilter !== 'all' && (
              <div className="pt-1 flex items-center justify-between text-[10px] text-[#8FAAC8]">
                <span>Filtered by: <strong className="text-white uppercase">{activeFilter}</strong></span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onFilterChange('all');
                  }}
                  className="text-[#00D2FF] hover:underline font-semibold"
                >
                  Reset All
                </button>
              </div>
            )}
          </div>
        ) : (
          /* Sleek Compact Horizontal Strip when collapsed */
          <div className="p-2 flex items-center justify-between gap-1.5 text-xs">
            {RISK_LEVEL_CONFIG.map((item) => (
              <button
                key={item.severity}
                type="button"
                onClick={() => {
                  if (onFilterChange) {
                    onFilterChange(
                      activeFilter === item.severity ? 'all' : item.severity
                    );
                  }
                }}
                className={`flex-1 py-1 px-1 rounded flex items-center justify-center gap-1 transition-all ${
                  activeFilter === item.severity
                    ? 'bg-white/20 ring-1 ring-white/50'
                    : 'hover:bg-white/10'
                }`}
                title={`${item.label}: ${item.description}`}
              >
                <span
                  className="w-2.5 h-2.5 rounded-xs shrink-0"
                  style={{ backgroundColor: item.colorHex }}
                />
                <span className="text-[10px] font-bold text-white truncate">
                  {item.label.split(' ')[0]}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

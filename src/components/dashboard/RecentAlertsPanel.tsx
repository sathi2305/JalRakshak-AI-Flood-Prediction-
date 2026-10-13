import React, { useState } from 'react';
import { FloodAlert } from '../../types/flood';
import { BellRing, Clock, AlertTriangle, ShieldCheck } from 'lucide-react';

interface RecentAlertsPanelProps {
  alerts: FloodAlert[];
  onSelectAlert?: (alert: FloodAlert) => void;
}

export const RecentAlertsPanel: React.FC<RecentAlertsPanelProps> = ({
  alerts,
  onSelectAlert,
}) => {
  const [filterSeverity, setFilterSeverity] = useState<string>('all');

  const filtered = alerts.filter((a) => {
    if (filterSeverity === 'all') return true;
    return a.severity === filterSeverity;
  });

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'very-high':
        return (
          <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-[#FEE2E2] text-[#F5222D] border border-[#FCA5A5] uppercase shrink-0">
            Critical
          </span>
        );
      case 'high':
        return (
          <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-[#FFEDD5] text-[#FF9418] border border-[#FDBA74] uppercase shrink-0">
            Warning
          </span>
        );
      case 'moderate':
        return (
          <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-[#FEF9C3] text-[#CA8A04] border border-[#FDE047] uppercase shrink-0">
            Advisory
          </span>
        );
      default:
        return (
          <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-[#DCFCE7] text-[#16B83F] border border-[#86EFAC] uppercase shrink-0">
            Normal
          </span>
        );
    }
  };

  return (
    <div className="bg-white rounded-xl border border-[#D9E6F5] shadow-[0_2px_8px_rgba(20,46,83,0.04)] overflow-hidden flex flex-col h-full">
      {/* Panel Header */}
      <div className="px-4 py-3 border-b border-[#EDF4FC] flex items-center justify-between gap-2 bg-[#FAFDFE]">
        <div className="flex items-center gap-1.5">
          <BellRing className="w-4 h-4 text-[#1769E8]" />
          <h3 className="text-sm font-bold text-[#142E53]">Recent Alerts</h3>
        </div>

        {/* Severity filter pills */}
        <div className="flex items-center gap-1 text-[11px]">
          <button
            onClick={() => setFilterSeverity('all')}
            className={`px-2 py-0.5 rounded font-medium transition-colors ${
              filterSeverity === 'all'
                ? 'bg-[#1769E8] text-white'
                : 'text-[#5B7395] hover:text-[#142E53]'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilterSeverity('very-high')}
            className={`px-2 py-0.5 rounded font-medium transition-colors ${
              filterSeverity === 'very-high'
                ? 'bg-[#F5222D] text-white'
                : 'text-[#5B7395] hover:text-[#F5222D]'
            }`}
          >
            Critical
          </button>
        </div>
      </div>

      {/* Alert Feed List */}
      <div className="divide-y divide-[#EDF4FC] overflow-y-auto max-h-[260px] p-2 space-y-1">
        {filtered.map((alert) => (
          <div
            key={alert.id}
            onClick={() => onSelectAlert && onSelectAlert(alert)}
            className="p-2.5 rounded-lg hover:bg-[#F8FAFC] transition-colors cursor-pointer border border-transparent hover:border-[#D9E6F5]"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2">
                {getSeverityBadge(alert.severity)}
                <h4 className="text-xs font-bold text-[#142E53] leading-tight">
                  {alert.title}
                </h4>
              </div>
              <span className="text-[10px] text-[#8499B5] flex items-center gap-1 shrink-0">
                <Clock className="w-3 h-3" />
                <span>{alert.broadcastTime}</span>
              </span>
            </div>

            <p className="text-[11px] text-[#5B7395] mt-1.5 line-clamp-2 leading-relaxed">
              {alert.description}
            </p>

            <div className="flex items-center justify-between text-[10px] text-[#8499B5] mt-2 pt-1.5 border-t border-[#F1F5F9]">
              <span>Location: <strong className="text-[#142E53]">{alert.location}</strong></span>
              <span>Source: <strong className="text-[#142E53]">{alert.source}</strong></span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

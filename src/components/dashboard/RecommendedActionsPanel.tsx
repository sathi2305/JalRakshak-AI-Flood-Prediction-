import React from 'react';
import { RecommendedAction } from '../../types/flood';
import { LifeBuoy, PhoneCall, ShieldAlert, ExternalLink, CheckCircle } from 'lucide-react';

interface RecommendedActionsPanelProps {
  actions: RecommendedAction[];
  onActionComplete?: (id: string) => void;
}

export const RecommendedActionsPanel: React.FC<RecommendedActionsPanelProps> = ({
  actions,
  onActionComplete,
}) => {
  const getPriorityBadge = (priority: number) => {
    switch (priority) {
      case 1:
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-[#FEE2E2] text-[#F5222D] border border-[#FCA5A5] uppercase">
            Priority 1 · Immediate
          </span>
        );
      case 2:
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-[#FFEDD5] text-[#FF9418] border border-[#FDBA74] uppercase">
            Priority 2 · Urgent
          </span>
        );
      default:
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-[#FEF9C3] text-[#CA8A04] border border-[#FDE047] uppercase">
            Priority 3 · Advisory
          </span>
        );
    }
  };

  return (
    <div className="bg-white rounded-xl border border-[#D9E6F5] shadow-[0_2px_8px_rgba(20,46,83,0.04)] overflow-hidden flex flex-col justify-between">
      {/* Header */}
      <div className="px-4 py-3 border-b border-[#EDF4FC] flex items-center justify-between gap-2 bg-[#FAFDFE]">
        <div className="flex items-center gap-1.5">
          <LifeBuoy className="w-4 h-4 text-[#1769E8]" />
          <h3 className="text-sm font-bold text-[#142E53]">
            Recommended Actions
          </h3>
        </div>
        <span className="text-[10px] font-semibold text-[#1769E8] bg-[#EBF3FE] px-2 py-0.5 rounded border border-[#BFDBFE]">
          Standard Operating Protocols
        </span>
      </div>

      {/* Action Items List */}
      <div className="p-3 divide-y divide-[#EDF4FC] overflow-y-auto max-h-[300px] space-y-2">
        {actions.map((act) => (
          <div key={act.id} className="pt-2 first:pt-0">
            <div className="flex items-center justify-between gap-2 mb-1.5">
              {getPriorityBadge(act.priority)}
              <span className="text-[10px] text-[#8499B5]">{act.timestamp}</span>
            </div>

            <h4 className="text-xs font-bold text-[#142E53] leading-snug">
              {act.title}
            </h4>

            <p className="text-[11px] text-[#5B7395] mt-1 leading-relaxed">
              {act.actionText}
            </p>

            <div className="mt-2.5 p-2 bg-[#F8FAFC] rounded-lg border border-[#EDF4FC] flex items-center justify-between text-[11px]">
              <div>
                <span className="text-[#8499B5] text-[10px] block">Coordinating Agency:</span>
                <span className="font-semibold text-[#142E53] text-[11px]">{act.agency}</span>
              </div>
              <div className="text-right">
                <span className="text-[#8499B5] text-[10px] block">Helpline:</span>
                <span className="font-bold text-[#1769E8] font-mono text-[11px] flex items-center gap-1 justify-end">
                  <PhoneCall className="w-3 h-3" />
                  {act.contactNumber}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Official Emergency Links Bar */}
      <div className="p-3 bg-[#FAFDFE] border-t border-[#EDF4FC] flex items-center justify-between text-[11px]">
        <div className="text-[#5B7395]">
          Central Water Commission & NDMA Guidelines
        </div>
        <div className="flex items-center gap-2">
          <a
            href="https://cwc.gov.in"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#1769E8] hover:underline flex items-center gap-1 font-semibold"
          >
            <span>CWC Portal</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    </div>
  );
};

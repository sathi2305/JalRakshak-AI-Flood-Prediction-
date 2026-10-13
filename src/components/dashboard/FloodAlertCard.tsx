import React, { useState } from 'react';
import { AlertCircle, Clock, Send, ShieldAlert, CheckCircle2, ChevronRight } from 'lucide-react';
import { FloodAlert } from '../../types/flood';

interface FloodAlertCardProps {
  alert: FloodAlert;
  onDispatchAlert?: (alertId: string) => void;
}

export const FloodAlertCard: React.FC<FloodAlertCardProps> = ({
  alert,
  onDispatchAlert,
}) => {
  const [isDispatched, setIsDispatched] = useState(false);

  const handleDispatch = () => {
    setIsDispatched(true);
    if (onDispatchAlert) {
      onDispatchAlert(alert.id);
    }
    setTimeout(() => setIsDispatched(false), 4000);
  };

  return (
    <div className="bg-white rounded-xl border-2 border-[#F5222D]/80 shadow-[0_4px_16px_rgba(245,34,45,0.08)] overflow-hidden flex flex-col justify-between">
      {/* Alert Header Banner */}
      <div className="bg-gradient-to-r from-[#F5222D] to-[#DC2626] px-4 py-2.5 text-white flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-white animate-ping" />
          <span className="text-xs font-extrabold uppercase tracking-wider">
            Critical Flood Alert · Red Warning
          </span>
        </div>
        <span className="text-[11px] font-mono text-white/90 flex items-center gap-1">
          <Clock className="w-3 h-3" />
          <span>{alert.broadcastTime}</span>
        </span>
      </div>

      {/* Main Alert Body */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="text-base font-bold text-[#142E53] leading-snug">
                {alert.title}
              </h3>
              <p className="text-xs font-semibold text-[#F5222D] mt-0.5">
                {alert.location}
              </p>
            </div>
            <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-[#FEE2E2] text-[#F5222D] border border-[#FCA5A5] uppercase shrink-0">
              Active Warning
            </span>
          </div>

          <p className="text-xs text-[#5B7395] leading-relaxed mt-2.5">
            {alert.description}
          </p>

          {/* Critical Hydrological Stats Strip */}
          <div className="grid grid-cols-2 gap-2 mt-3.5 p-2.5 bg-[#FFF5F5] rounded-lg border border-[#FEE2E2]">
            <div>
              <span className="text-[10px] uppercase font-bold text-[#991B1B] block">
                Water Level Above Danger
              </span>
              <span className="text-base font-black text-[#F5222D] font-mono tabular-nums">
                +{alert.waterLevelAboveDanger} m
              </span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-[#991B1B] block">
                Forecast Rain (18h)
              </span>
              <span className="text-base font-black text-[#142E53] font-mono tabular-nums">
                {alert.predictedRainfall18h} mm
              </span>
            </div>
          </div>
        </div>

        {/* Action Dispatcher Footer */}
        <div className="mt-4 pt-3 border-t border-[#EDF4FC] flex items-center justify-between gap-2">
          <div className="text-[11px] text-[#8499B5]">
            Source: <strong className="text-[#142E53]">{alert.source}</strong>
          </div>

          <button
            onClick={handleDispatch}
            disabled={isDispatched}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all shadow-xs ${
              isDispatched
                ? 'bg-[#16B83F] text-white'
                : 'bg-[#F5222D] hover:bg-[#D32029] text-white active:scale-98'
            }`}
          >
            {isDispatched ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>SMS Dispatched</span>
              </>
            ) : (
              <>
                <Send className="w-3.5 h-3.5" />
                <span>Broadcast Alert</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

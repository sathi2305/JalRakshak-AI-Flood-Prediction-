import React from 'react';
import { ShieldAlert, Clock, Radio } from 'lucide-react';

interface FloodMapStatusProps {
  lastUpdated?: string;
  isSimulated?: boolean;
}

export const FloodMapStatus: React.FC<FloodMapStatusProps> = ({
  lastUpdated = 'Oct 13, 2026 · CWC & IMD Synced',
  isSimulated = true,
}) => {
  return (
    <>
      {/* 1. Dark translucent title badge in the top-left */}
      <div className="absolute top-3 left-3 z-[400] select-none pointer-events-none">
        <div className="bg-black/75 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/15 text-white shadow-xl flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-[#F5222D] animate-ping" />
          <span className="text-xs font-bold tracking-tight text-white uppercase">
            Flood Risk Map
          </span>
          {isSimulated && (
            <span className="text-[9px] uppercase font-semibold px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
              Demo Mode
            </span>
          )}
        </div>
      </div>

      {/* 2. Small map-update timestamp in the bottom-right */}
      <div className="absolute bottom-3 right-3 z-[400] select-none pointer-events-none">
        <div className="bg-black/70 backdrop-blur-md px-2.5 py-1 rounded-md border border-white/10 text-white/90 text-[10px] font-mono shadow-lg flex items-center gap-1.5">
          <Clock className="w-3 h-3 text-[#38BDF8]" />
          <span>Updated: {lastUpdated}</span>
        </div>
      </div>
    </>
  );
};

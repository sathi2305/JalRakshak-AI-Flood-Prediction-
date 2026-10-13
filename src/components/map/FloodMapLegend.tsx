import React from 'react';
import { Eye, EyeOff } from 'lucide-react';

interface FloodMapLegendProps {
  showOverlays: boolean;
  onToggleOverlays: () => void;
}

export const FloodMapLegend: React.FC<FloodMapLegendProps> = ({
  showOverlays,
  onToggleOverlays,
}) => {
  return (
    <div className="absolute bottom-3 left-3 z-[400] bg-black/75 backdrop-blur-md p-2.5 rounded-lg border border-white/15 text-white text-[11px] shadow-xl select-none min-w-[130px]">
      <div className="flex items-center justify-between gap-3 mb-2 pb-1.5 border-b border-white/15">
        <span className="font-bold text-[10px] uppercase tracking-wider text-white/90">
          Flood Risk Level
        </span>
        <button
          onClick={onToggleOverlays}
          className="text-white/70 hover:text-white transition-colors p-0.5"
          title={showOverlays ? 'Hide Risk Overlays' : 'Show Risk Overlays'}
        >
          {showOverlays ? <Eye className="w-3 h-3 text-[#1769E8]" /> : <EyeOff className="w-3 h-3 text-white/40" />}
        </button>
      </div>

      <div className="space-y-1.5">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-xs bg-[#F5222D] shadow-xs shrink-0" />
          <span className="font-medium text-white/95">Very High</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-xs bg-[#FF9418] shadow-xs shrink-0" />
          <span className="font-medium text-white/95">High</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-xs bg-[#FFD52A] shadow-xs shrink-0" />
          <span className="font-medium text-white/95">Moderate</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-xs bg-[#16B83F] shadow-xs shrink-0" />
          <span className="font-medium text-white/95">Low</span>
        </div>
      </div>
    </div>
  );
};

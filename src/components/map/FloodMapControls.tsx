import React from 'react';
import { Plus, Minus, RotateCcw, Crosshair, Layers, Satellite, Mountain } from 'lucide-react';
import { BasemapMode } from './types';

interface FloodMapControlsProps {
  onZoomIn: () => void;
  onZoomOut: () => void;
  onResetView: () => void;
  onLocate: () => void;
  basemap: BasemapMode;
  onToggleBasemap: () => void;
  hasLeafletLayerControl?: boolean;
}

export const FloodMapControls: React.FC<FloodMapControlsProps> = ({
  onZoomIn,
  onZoomOut,
  onResetView,
  onLocate,
  basemap,
  onToggleBasemap,
  hasLeafletLayerControl = true,
}) => {
  return (
    <div
      className={`absolute ${
        hasLeafletLayerControl ? 'top-[52px]' : 'top-3'
      } right-3 z-[400] flex flex-col gap-1.5 select-none`}
    >
      {/* Zoom in / out button group */}
      <div className="bg-white rounded-lg shadow-md border border-[#D9E6F5] overflow-hidden flex flex-col">
        <button
          onClick={onZoomIn}
          className="w-8 h-8 flex items-center justify-center text-[#142E53] hover:bg-[#F3F8FD] active:bg-[#EBF3FE] transition-colors"
          title="Zoom In"
          aria-label="Zoom In"
        >
          <Plus className="w-4 h-4 font-bold" />
        </button>
        <div className="h-px bg-[#EDF4FC]" />
        <button
          onClick={onZoomOut}
          className="w-8 h-8 flex items-center justify-center text-[#142E53] hover:bg-[#F3F8FD] active:bg-[#EBF3FE] transition-colors"
          title="Zoom Out"
          aria-label="Zoom Out"
        >
          <Minus className="w-4 h-4 font-bold" />
        </button>
      </div>

      {/* Reset view control below zoom */}
      <button
        onClick={onResetView}
        className="w-8 h-8 bg-white rounded-lg shadow-md border border-[#D9E6F5] flex items-center justify-center text-[#142E53] hover:bg-[#F3F8FD] hover:text-[#1769E8] active:bg-[#EBF3FE] transition-colors"
        title="Reset to India View"
        aria-label="Reset Map"
      >
        <RotateCcw className="w-3.5 h-3.5" />
      </button>

      {/* Locate selected district / target control */}
      <button
        onClick={onLocate}
        className="w-8 h-8 bg-white rounded-lg shadow-md border border-[#D9E6F5] flex items-center justify-center text-[#142E53] hover:bg-[#F3F8FD] hover:text-[#1769E8] active:bg-[#EBF3FE] transition-colors"
        title="Locate Selected District"
        aria-label="Locate Region"
      >
        <Crosshair className="w-3.5 h-3.5" />
      </button>

      {/* Satellite vs Terrain toggle control */}
      <button
        onClick={onToggleBasemap}
        className="w-8 h-8 bg-white rounded-lg shadow-md border border-[#D9E6F5] flex items-center justify-center text-[#142E53] hover:bg-[#F3F8FD] hover:text-[#1769E8] active:bg-[#EBF3FE] transition-colors"
        title={basemap === 'satellite' ? 'Switch to Terrain Basemap' : 'Switch to Satellite Basemap'}
        aria-label="Toggle Basemap"
      >
        {basemap === 'satellite' ? (
          <Satellite className="w-3.5 h-3.5 text-[#1769E8]" />
        ) : (
          <Mountain className="w-3.5 h-3.5 text-[#142E53]" />
        )}
      </button>
    </div>
  );
};

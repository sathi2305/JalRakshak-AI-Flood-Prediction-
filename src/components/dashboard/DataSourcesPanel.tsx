import React from 'react';
import { DataSourceStatus } from '../../types/flood';
import { Database, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';

interface DataSourcesPanelProps {
  dataSources: DataSourceStatus[];
  onRefresh?: () => void;
}

export const DataSourcesPanel: React.FC<DataSourcesPanelProps> = ({
  dataSources,
  onRefresh,
}) => {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'connected':
        return (
          <span className="flex items-center gap-1 text-[10px] font-semibold text-[#16B83F] bg-[#DCFCE7] px-2 py-0.5 rounded-full border border-[#86EFAC]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#16B83F]" />
            Connected
          </span>
        );
      case 'simulated':
        return (
          <span className="flex items-center gap-1 text-[10px] font-semibold text-[#1769E8] bg-[#EBF3FE] px-2 py-0.5 rounded-full border border-[#BFDBFE]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#1769E8]" />
            Simulated
          </span>
        );
      case 'stale':
        return (
          <span className="flex items-center gap-1 text-[10px] font-semibold text-[#CA8A04] bg-[#FEF9C3] px-2 py-0.5 rounded-full border border-[#FDE047]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#CA8A04]" />
            Stale (2h)
          </span>
        );
      default:
        return (
          <span className="flex items-center gap-1 text-[10px] font-semibold text-[#F5222D] bg-[#FEE2E2] px-2 py-0.5 rounded-full border border-[#FCA5A5]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#F5222D]" />
            Unavailable
          </span>
        );
    }
  };

  return (
    <div className="bg-white rounded-xl border border-[#D9E6F5] shadow-[0_2px_8px_rgba(20,46,83,0.04)] overflow-hidden flex flex-col h-full">
      {/* Header */}
      <div className="px-4 py-3 border-b border-[#EDF4FC] flex items-center justify-between gap-2 bg-[#FAFDFE]">
        <div className="flex items-center gap-1.5">
          <Database className="w-4 h-4 text-[#1769E8]" />
          <h3 className="text-sm font-bold text-[#142E53]">Data Sources</h3>
        </div>
        <button
          onClick={onRefresh}
          className="text-xs text-[#5B7395] hover:text-[#1769E8] flex items-center gap-1 p-1 rounded hover:bg-[#F3F8FD] transition-colors"
          title="Verify Telemetry Connections"
        >
          <RefreshCw className="w-3 h-3" />
          <span>Sync Status</span>
        </button>
      </div>

      {/* Source Feed Grid */}
      <div className="p-3 divide-y divide-[#EDF4FC] overflow-y-auto max-h-[260px]">
        {dataSources.map((source) => (
          <div key={source.id} className="py-2.5 first:pt-1 last:pb-1">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h4 className="text-xs font-bold text-[#142E53]">
                  {source.name}
                </h4>
                <div className="text-[11px] text-[#5B7395]">
                  {source.dataType}
                </div>
              </div>
              {getStatusBadge(source.status)}
            </div>

            <div className="flex items-center justify-between text-[10px] text-[#8499B5] mt-1.5 pt-1">
              <span>Coverage: <strong className="text-[#5B7395]">{source.coverage}</strong></span>
              <span>Latency: <strong className="font-mono text-[#5B7395]">{source.latency}</strong></span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

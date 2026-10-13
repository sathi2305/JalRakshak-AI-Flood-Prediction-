import React, { useState } from 'react';
import { FloodAlert, RiskSeverity } from '../../types/flood';
import {
  BellRing,
  Search,
  Send,
  AlertTriangle,
  Clock,
  ShieldAlert,
  CheckCircle2,
  Filter,
} from 'lucide-react';

interface AlertsViewProps {
  alerts: FloodAlert[];
  onDispatchAlert: (alertId: string) => void;
}

export const AlertsView: React.FC<AlertsViewProps> = ({
  alerts,
  onDispatchAlert,
}) => {
  const [search, setSearch] = useState('');
  const [severityFilter, setSeverityFilter] = useState<string>('all');
  const [selectedAlert, setSelectedAlert] = useState<FloodAlert | null>(alerts[0] || null);
  const [broadcastModalOpen, setBroadcastModalOpen] = useState(false);
  const [broadcastSuccess, setBroadcastSuccess] = useState(false);

  const filtered = alerts.filter((a) => {
    const matchesSearch =
      a.title.toLowerCase().includes(search.toLowerCase()) ||
      a.location.toLowerCase().includes(search.toLowerCase()) ||
      a.riverBasin.toLowerCase().includes(search.toLowerCase());
    const matchesSeverity =
      severityFilter === 'all' || a.severity === severityFilter;
    return matchesSearch && matchesSeverity;
  });

  const handleSimulateBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    setBroadcastSuccess(true);
    setTimeout(() => {
      setBroadcastSuccess(false);
      setBroadcastModalOpen(false);
    }, 2500);
  };

  const getSeverityBadge = (sev: RiskSeverity) => {
    switch (sev) {
      case 'very-high':
        return (
          <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-[#FEE2E2] text-[#F5222D] border border-[#FCA5A5] uppercase">
            Critical Red Alert
          </span>
        );
      case 'high':
        return (
          <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-[#FFEDD5] text-[#FF9418] border border-[#FDBA74] uppercase">
            Orange Warning
          </span>
        );
      case 'moderate':
        return (
          <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-[#FEF9C3] text-[#CA8A04] border border-[#FDE047] uppercase">
            Yellow Advisory
          </span>
        );
      default:
        return (
          <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-[#DCFCE7] text-[#16B83F] border border-[#86EFAC] uppercase">
            Green Watch
          </span>
        );
    }
  };

  return (
    <div className="space-y-4 max-w-[1600px] mx-auto">
      {/* Header bar */}
      <div className="bg-white p-4 rounded-xl border border-[#D9E6F5] shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <BellRing className="w-5 h-5 text-[#1769E8]" />
          <div>
            <h2 className="text-base font-bold text-[#142E53]">
              Flood Warning & Alert Operations Center
            </h2>
            <p className="text-xs text-[#5B7395]">
              Real-time multi-agency bulletins, threshold breach notifications & public advisory dispatch
            </p>
          </div>
        </div>

        <button
          onClick={() => setBroadcastModalOpen(true)}
          className="px-3.5 py-2 rounded-lg text-xs font-semibold bg-[#1769E8] hover:bg-[#1258C5] text-white flex items-center gap-2 transition-all shadow-xs"
        >
          <Send className="w-3.5 h-3.5" />
          <span>Simulate Emergency Alert Dispatch</span>
        </button>
      </div>

      {/* Main Grid: Alert List + Detail Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left Column: Filter & List */}
        <div className="lg:col-span-5 space-y-3">
          {/* Search & Filter Toolbar */}
          <div className="bg-white p-3 rounded-xl border border-[#D9E6F5] space-y-2.5">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-[#8499B5]" />
              <input
                type="text"
                placeholder="Search alerts by district, river, keyword..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border border-[#D9E6F5] bg-white text-[#142E53] placeholder-[#8499B5] focus:outline-none focus:border-[#1769E8]"
              />
            </div>

            <div className="flex items-center gap-1.5 text-xs">
              <span className="text-[#8499B5] text-[11px] font-semibold">Filter:</span>
              {(['all', 'very-high', 'high', 'moderate'] as const).map((sev) => (
                <button
                  key={sev}
                  onClick={() => setSeverityFilter(sev)}
                  className={`px-2 py-0.5 rounded text-[11px] font-medium capitalize transition-colors ${
                    severityFilter === sev
                      ? 'bg-[#1769E8] text-white font-bold'
                      : 'bg-[#F1F5F9] text-[#5B7395] hover:text-[#142E53]'
                  }`}
                >
                  {sev === 'all' ? 'All' : sev.replace('-', ' ')}
                </button>
              ))}
            </div>
          </div>

          {/* List */}
          <div className="space-y-2 max-h-[640px] overflow-y-auto">
            {filtered.map((alert) => {
              const isSelected = selectedAlert?.id === alert.id;
              return (
                <div
                  key={alert.id}
                  onClick={() => setSelectedAlert(alert)}
                  className={`bg-white rounded-xl p-3.5 border transition-all cursor-pointer ${
                    isSelected
                      ? 'border-[#1769E8] shadow-sm ring-1 ring-[#1769E8]/20'
                      : 'border-[#D9E6F5] hover:border-[#1769E8]/40'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    {getSeverityBadge(alert.severity)}
                    <span className="text-[10px] text-[#8499B5] flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {alert.broadcastTime}
                    </span>
                  </div>

                  <h3 className="text-xs font-bold text-[#142E53] mt-2 leading-snug">
                    {alert.title}
                  </h3>
                  <p className="text-[11px] text-[#5B7395] mt-1">
                    {alert.location} · {alert.riverBasin}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Selected Alert Detailed Dossier */}
        <div className="lg:col-span-7">
          {selectedAlert ? (
            <div className="bg-white rounded-xl border border-[#D9E6F5] p-5 shadow-xs space-y-4">
              <div className="flex items-start justify-between gap-3 border-b border-[#EDF4FC] pb-3.5">
                <div>
                  <div className="flex items-center gap-2">
                    {getSeverityBadge(selectedAlert.severity)}
                    <span className="text-xs font-mono text-[#8499B5]">{selectedAlert.id}</span>
                  </div>
                  <h3 className="text-lg font-bold text-[#142E53] mt-2">
                    {selectedAlert.title}
                  </h3>
                  <p className="text-xs font-medium text-[#1769E8] mt-0.5">
                    {selectedAlert.location}
                  </p>
                </div>

                <button
                  onClick={() => onDispatchAlert(selectedAlert.id)}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#F5222D] hover:bg-[#D32029] text-white flex items-center gap-1.5 transition-all shadow-xs shrink-0"
                >
                  <Send className="w-3 h-3" />
                  <span>Broadcast SMS</span>
                </button>
              </div>

              {/* Description */}
              <div className="p-3 bg-[#F8FAFC] rounded-lg border border-[#EDF4FC]">
                <h4 className="text-xs font-bold text-[#142E53] mb-1">
                  Hydrological Advisory Statement
                </h4>
                <p className="text-xs text-[#5B7395] leading-relaxed">
                  {selectedAlert.description}
                </p>
              </div>

              {/* Technical Telemetry Markers */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-3 rounded-lg border border-[#EDF4FC] bg-white">
                  <span className="text-[10px] text-[#8499B5] uppercase font-bold block">
                    Water Level Above Danger
                  </span>
                  <span className="text-base font-extrabold text-[#F5222D] font-mono mt-1 block">
                    +{selectedAlert.waterLevelAboveDanger} m
                  </span>
                </div>
                <div className="p-3 rounded-lg border border-[#EDF4FC] bg-white">
                  <span className="text-[10px] text-[#8499B5] uppercase font-bold block">
                    Forecast Rainfall (18h)
                  </span>
                  <span className="text-base font-extrabold text-[#1769E8] font-mono mt-1 block">
                    {selectedAlert.predictedRainfall18h} mm
                  </span>
                </div>
                <div className="p-3 rounded-lg border border-[#EDF4FC] bg-white">
                  <span className="text-[10px] text-[#8499B5] uppercase font-bold block">
                    Issuing Authority
                  </span>
                  <span className="text-xs font-bold text-[#142E53] mt-1 block">
                    {selectedAlert.source}
                  </span>
                </div>
              </div>

              {/* Impacted Districts */}
              <div>
                <h4 className="text-xs font-bold text-[#142E53] mb-2">
                  Impacted Subdivisions & Panchayats
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {selectedAlert.affectedDistricts.map((dist, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-md text-xs font-medium bg-[#EBF3FE] text-[#1769E8] border border-[#BFDBFE]"
                    >
                      {dist}
                    </span>
                  ))}
                </div>
              </div>

              {/* Official Disclaimer */}
              <div className="p-3 bg-[#FFFBEB] rounded-lg border border-[#FDE68A] text-xs text-[#92400E] flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0 text-[#D97706] mt-0.5" />
                <p>
                  <strong>Disclaimer:</strong> Jai Rakshak is an AI decision-support prototype. Official emergency orders, evacuation mandates, and relief disbursements are executed exclusively by the District Magistrate and State Disaster Management Authorities.
                </p>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-[#D9E6F5] p-12 text-center text-xs text-[#8499B5]">
              Select an alert from the feed to view full hydrological parameters and dispatch actions.
            </div>
          )}
        </div>
      </div>

      {/* Broadcast Modal Simulator */}
      {broadcastModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#10294B]/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full border border-[#D9E6F5] shadow-2xl overflow-hidden p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-[#EDF4FC] pb-3">
              <div className="flex items-center gap-2">
                <Send className="w-4 h-4 text-[#1769E8]" />
                <h3 className="text-sm font-bold text-[#142E53]">
                  Simulate Emergency CAP Broadcast
                </h3>
              </div>
              <button
                onClick={() => setBroadcastModalOpen(false)}
                className="text-[#8499B5] hover:text-[#142E53] text-sm"
              >
                ✕
              </button>
            </div>

            {broadcastSuccess ? (
              <div className="py-6 text-center space-y-2">
                <CheckCircle2 className="w-10 h-10 text-[#16B83F] mx-auto animate-bounce" />
                <h4 className="text-sm font-bold text-[#142E53]">
                  Emergency Broadcast Dispatched Successfully!
                </h4>
                <p className="text-xs text-[#5B7395]">
                  Simulated Cell Broadcast & SMS Gateway dispatched to 14,200 recipients in flood sectors.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSimulateBroadcast} className="space-y-3.5 text-xs">
                <div>
                  <label className="font-semibold text-[#142E53] block mb-1">
                    Target Geo-fence
                  </label>
                  <input
                    type="text"
                    defaultValue="Kamrup Metro, Barpeta, Nalbari (Buffer: 15km)"
                    className="w-full p-2 rounded-lg border border-[#D9E6F5] bg-white text-[#142E53]"
                  />
                </div>

                <div>
                  <label className="font-semibold text-[#142E53] block mb-1">
                    Alert Level
                  </label>
                  <select className="w-full p-2 rounded-lg border border-[#D9E6F5] bg-white text-[#142E53]">
                    <option>RED ALERT — Immediate Relocation Advised</option>
                    <option>ORANGE WARNING — High Precaution Required</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-[#142E53] block mb-1">
                    SMS Message Body (CAP Compliant)
                  </label>
                  <textarea
                    rows={3}
                    defaultValue="JAI RAKSHAK FLOOD ALERT: Brahmaputra water level critical (+2.4m). Low-lying sectors 4 & 7 relocate to school shelters immediately. NDRF Helpline: 1078."
                    className="w-full p-2 rounded-lg border border-[#D9E6F5] bg-white text-[#142E53]"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setBroadcastModalOpen(false)}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold text-[#5B7395] hover:bg-[#F1F5F9]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 rounded-lg text-xs font-semibold bg-[#F5222D] hover:bg-[#D32029] text-white flex items-center gap-1.5"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Send Broadcast</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

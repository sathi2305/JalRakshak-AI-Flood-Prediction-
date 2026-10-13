import React, { useState } from 'react';
import { Settings, Database, Bell, Shield, Phone, Save, CheckCircle2, RotateCcw, Palette } from 'lucide-react';
import { ThemeToggleButton } from '../../context/ThemeContext';

interface SettingsViewProps {
  isSimulated: boolean;
  onToggleSimulated: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  isSimulated,
  onToggleSimulated,
}) => {
  const [pollInterval, setPollInterval] = useState('5m');
  const [enableSoundAlerts, setEnableSoundAlerts] = useState(true);
  const [rainfallThreshold, setRainfallThreshold] = useState('64.5');
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  return (
    <div className="space-y-4 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="bg-white dark:bg-[#11223B] p-4 rounded-xl border border-[#D9E6F5] dark:border-[#1F3A60] shadow-xs flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <Settings className="w-5 h-5 text-[#1769E8]" />
          <div>
            <h2 className="text-base font-bold text-[#142E53] dark:text-white">
              System Configuration & Telemetry Feeds
            </h2>
            <p className="text-xs text-[#5B7395] dark:text-[#94A3B8]">
              Sensor network polling cadence, hydrological danger thresholds, theme preferences, and official directory
            </p>
          </div>
        </div>

        {saveSuccess && (
          <span className="text-xs font-semibold text-[#16B83F] flex items-center gap-1.5 bg-[#DCFCE7] dark:bg-[#052E16] px-3 py-1.5 rounded-lg border border-[#86EFAC] dark:border-[#166534]">
            <CheckCircle2 className="w-4 h-4" />
            <span>Preferences Saved</span>
          </span>
        )}
      </div>

      <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left Column: Data Feeds & Operation Mode */}
        <div className="lg:col-span-7 space-y-4">
          {/* Theme & Display Mode */}
          <div className="bg-white dark:bg-[#11223B] rounded-xl border border-[#D9E6F5] dark:border-[#1F3A60] p-5 shadow-xs space-y-4">
            <h3 className="text-xs font-bold text-[#142E53] dark:text-white uppercase tracking-wider flex items-center gap-1.5">
              <Palette className="w-4 h-4 text-[#1769E8]" />
              <span>Interface Theme & Display Mode</span>
            </h3>

            <div className="p-3.5 rounded-lg border border-[#EDF4FC] dark:border-[#1E3A60] bg-[#FAFDFE] dark:bg-[#0D1E36] flex flex-wrap items-center justify-between gap-3">
              <div>
                <h4 className="text-xs font-bold text-[#142E53] dark:text-white">
                  Color Theme (Button Format)
                </h4>
                <p className="text-[11px] text-[#5B7395] dark:text-[#94A3B8] mt-0.5">
                  Toggle between high-contrast tactical Dark mode and crisp standard Light mode.
                </p>
              </div>

              {/* Segmented Button Format */}
              <ThemeToggleButton variant="segmented" />
            </div>
          </div>

          {/* Operation Mode */}
          <div className="bg-white dark:bg-[#11223B] rounded-xl border border-[#D9E6F5] dark:border-[#1F3A60] p-5 shadow-xs space-y-4">
            <h3 className="text-xs font-bold text-[#142E53] dark:text-white uppercase tracking-wider flex items-center gap-1.5">
              <Database className="w-4 h-4 text-[#1769E8]" />
              <span>Data Stream Mode</span>
            </h3>

            <div className="p-3.5 rounded-lg border border-[#EDF4FC] dark:border-[#1E3A60] bg-[#FAFDFE] dark:bg-[#0D1E36] flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-[#142E53] dark:text-white">
                  Demonstration / Simulation Mode
                </h4>
                <p className="text-[11px] text-[#5B7395] mt-0.5">
                  When enabled, uses realistic curated hydrological vectors for Hackathon demonstrations without requiring external cloud tokens.
                </p>
              </div>
              <button
                type="button"
                onClick={onToggleSimulated}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  isSimulated ? 'bg-[#1769E8]' : 'bg-[#CBD5E1]'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    isSimulated ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {/* Polling Cadence */}
            <div>
              <label className="text-xs font-semibold text-[#142E53] block mb-1">
                Telemetry Synchronization Cadence
              </label>
              <select
                value={pollInterval}
                onChange={(e) => setPollInterval(e.target.value)}
                className="w-full text-xs p-2 rounded-lg border border-[#D9E6F5] bg-white text-[#142E53]"
              >
                <option value="1m">1 Minute (Rapid Tactical Stream)</option>
                <option value="5m">5 Minutes (Standard CWC Station Polling)</option>
                <option value="15m">15 Minutes (Low Bandwidth)</option>
                <option value="60m">1 Hour (Consolidated)</option>
              </select>
            </div>

            {/* Heavy Rain Trigger Level */}
            <div>
              <label className="text-xs font-semibold text-[#142E53] block mb-1">
                IMD Heavy Rainfall Trigger Threshold (mm / 24h)
              </label>
              <input
                type="number"
                value={rainfallThreshold}
                onChange={(e) => setRainfallThreshold(e.target.value)}
                className="w-full text-xs p-2 rounded-lg border border-[#D9E6F5] bg-white text-[#142E53]"
              />
              <span className="text-[10px] text-[#8499B5] mt-1 block">
                Standard IMD criteria: 64.5mm (Heavy), 115.6mm (Very Heavy), 204.4mm (Extremely Heavy)
              </span>
            </div>
          </div>

          {/* Connected Data Providers Status */}
          <div className="bg-white rounded-xl border border-[#D9E6F5] p-5 shadow-xs space-y-3">
            <h3 className="text-xs font-bold text-[#142E53] uppercase tracking-wider">
              Connected Telemetry Integrations
            </h3>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between p-2.5 bg-[#F8FAFC] rounded-lg border border-[#EDF4FC]">
                <div>
                  <span className="font-bold text-[#142E53] block">India Meteorological Department (AWS)</span>
                  <span className="text-[11px] text-[#5B7395]">Precipitation, Doppler Radar & Wind Shear</span>
                </div>
                <span className="text-[#16B83F] font-bold text-[11px]">ACTIVE · REST API</span>
              </div>

              <div className="flex items-center justify-between p-2.5 bg-[#F8FAFC] rounded-lg border border-[#EDF4FC]">
                <div>
                  <span className="font-bold text-[#142E53] block">Central Water Commission (CWC) Telemetry</span>
                  <span className="text-[11px] text-[#5B7395]">National River Gauge Stations & Dam Inflow</span>
                </div>
                <span className="text-[#16B83F] font-bold text-[11px]">ACTIVE · MQTT STREAM</span>
              </div>

              <div className="flex items-center justify-between p-2.5 bg-[#F8FAFC] rounded-lg border border-[#EDF4FC]">
                <div>
                  <span className="font-bold text-[#142E53] block">NASA GPM IMERG Gridded Precipitation</span>
                  <span className="text-[11px] text-[#5B7395]">30-minute calibrated satellite constellation</span>
                </div>
                <span className="text-[#16B83F] font-bold text-[11px]">ACTIVE · GEO-JSON</span>
              </div>

              <div className="flex items-center justify-between p-2.5 bg-[#F8FAFC] rounded-lg border border-[#EDF4FC]">
                <div>
                  <span className="font-bold text-[#142E53] block">NRSC / ISRO Bhuvan Inundation Vector Feeds</span>
                  <span className="text-[11px] text-[#5B7395]">RISAT-1A Synthetic Aperture Radar Inundation</span>
                </div>
                <span className="text-[#1769E8] font-bold text-[11px]">SIMULATED CACHE</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Emergency Helpline Directory & Project Info */}
        <div className="lg:col-span-5 space-y-4">
          {/* Emergency Directory */}
          <div className="bg-white rounded-xl border border-[#D9E6F5] p-5 shadow-xs space-y-3">
            <h3 className="text-xs font-bold text-[#142E53] uppercase tracking-wider flex items-center gap-1.5">
              <Phone className="w-4 h-4 text-[#1769E8]" />
              <span>National Disaster Hotline Directory</span>
            </h3>

            <div className="space-y-2 text-xs">
              <div className="p-2.5 bg-[#FFF5F5] rounded-lg border border-[#FEE2E2] flex items-center justify-between">
                <div>
                  <span className="font-bold text-[#991B1B] block">NDRF National 24/7 Helpline</span>
                  <span className="text-[10px] text-[#5B7395]">All-India Disaster Response Coordination</span>
                </div>
                <span className="text-base font-black text-[#F5222D] font-mono">1078</span>
              </div>

              <div className="p-2.5 bg-[#F8FAFC] rounded-lg border border-[#EDF4FC] flex items-center justify-between">
                <div>
                  <span className="font-bold text-[#142E53] block">Central Water Commission (Flood Room)</span>
                  <span className="text-[10px] text-[#5B7395]">Hydrological Crisis Wing, New Delhi</span>
                </div>
                <span className="text-xs font-bold text-[#1769E8] font-mono">011-26106523</span>
              </div>

              <div className="p-2.5 bg-[#F8FAFC] rounded-lg border border-[#EDF4FC] flex items-center justify-between">
                <div>
                  <span className="font-bold text-[#142E53] block">Assam State Disaster Authority (ASDMA)</span>
                  <span className="text-[10px] text-[#5B7395]">Brahmaputra Flood Cell, Dispur</span>
                </div>
                <span className="text-xs font-bold text-[#1769E8] font-mono">1070 / 1079</span>
              </div>

              <div className="p-2.5 bg-[#F8FAFC] rounded-lg border border-[#EDF4FC] flex items-center justify-between">
                <div>
                  <span className="font-bold text-[#142E53] block">Bihar State Disaster Authority (BSDMA)</span>
                  <span className="text-[10px] text-[#5B7395]">Ganga & Kosi Emergency Cell, Patna</span>
                </div>
                <span className="text-xs font-bold text-[#1769E8] font-mono">0612-2547232</span>
              </div>
            </div>
          </div>

          {/* Hackathon Attribution Card */}
          <div className="bg-[#10294B] text-white rounded-xl p-5 shadow-xs space-y-2.5 border border-[#1C3E6B]">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#60A5FA] bg-[#1769E8]/30 px-2 py-0.5 rounded border border-[#1769E8]/40">
              Hack Era 1.0 by Erazone
            </span>
            <h4 className="text-sm font-bold text-white">
              Jai Rakshak — AI Flood Prediction Tool
            </h4>
            <p className="text-[11px] text-[#8FAAC8] leading-relaxed">
              Engineered as a comprehensive flood prediction, geospatial surveillance, and early warning solution addressing climate resilience and community preparedness across India.
            </p>
            <div className="pt-2 border-t border-[#1C3E6B] text-[10px] text-[#6B8EB8] flex items-center justify-between">
              <span>Stack: React + TS + Tailwind + Leaflet</span>
              <span>Python FastAPI / CWC Specs</span>
            </div>
          </div>

          {/* Save button */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-2.5 rounded-lg text-xs font-bold bg-[#1769E8] hover:bg-[#1258C5] text-white flex items-center justify-center gap-2 transition-all shadow-sm"
            >
              <Save className="w-4 h-4" />
              <span>Save System Settings</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

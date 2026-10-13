import React from 'react';
import { Shield, Bell, Radio, AlertTriangle } from 'lucide-react';
import { ThemeToggleButton } from '../../context/ThemeContext';

interface AppHeaderProps {
  onNotificationClick?: () => void;
  unreadCount?: number;
  isSimulated?: boolean;
  onToggleSimulated?: () => void;
}

export const AppHeader: React.FC<AppHeaderProps> = ({
  onNotificationClick,
  unreadCount = 3,
  isSimulated = false,
  onToggleSimulated,
}) => {
  return (
    <header className="w-full bg-[#10294B] text-white border-b border-[#1C3E6B] px-4 lg:px-6 py-2.5 flex items-center justify-between shrink-0 z-30 shadow-sm">
      {/* Brand Zone */}
      <div className="flex items-center gap-3">
        {/* Shield / Water Wave Logo */}
        <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#1769E8] to-[#0A449C] flex items-center justify-center shadow-inner border border-[#2B7FFF]/40 text-white shrink-0">
          <div className="relative">
            <Shield className="w-5 h-5 text-white" strokeWidth={2.2} />
            <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-[#16B83F] border border-[#10294B]" />
          </div>
        </div>

        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-bold tracking-tight text-white leading-none">
              Jai Rakshak
            </h1>
            <span className="text-[10px] uppercase font-semibold tracking-wider px-1.5 py-0.5 rounded bg-[#1769E8]/30 text-[#60A5FA] border border-[#1769E8]/40">
              GoI · NDRF
            </span>
          </div>
          <p className="text-xs text-[#8FAAC8] font-normal leading-tight mt-0.5">
            AI-Powered Flood Prediction & Early Warning System
          </p>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Theme mode button toggle */}
        <ThemeToggleButton variant="button" />

        {/* Live / Simulated Telemetry Mode Switch */}
        <button
          onClick={onToggleSimulated}
          title="Toggle between Live Telemetry and Simulation Mode"
          className={`hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-medium transition-colors border ${
            isSimulated
              ? 'bg-amber-950/40 text-amber-300 border-amber-600/50 hover:bg-amber-900/50'
              : 'bg-emerald-950/40 text-emerald-300 border-emerald-600/50 hover:bg-emerald-900/50'
          }`}
        >
          <Radio className={`w-3.5 h-3.5 ${isSimulated ? 'animate-pulse text-amber-400' : 'text-emerald-400'}`} />
          <span>{isSimulated ? 'Simulation Mode' : 'Live Feeds Active'}</span>
        </button>

        {/* Official Emergency Contact badge */}
        <div className="hidden lg:flex items-center gap-1.5 text-xs text-[#9BB5D5] bg-[#15345E] px-2.5 py-1 rounded border border-[#214A82]">
          <AlertTriangle className="w-3.5 h-3.5 text-[#FF9418]" />
          <span>NDRF 24x7: <strong className="text-white font-mono">1078</strong></span>
        </div>

        {/* Notification Bell */}
        <button
          onClick={onNotificationClick}
          className="relative p-2 rounded-lg text-[#9BB5D5] hover:text-white hover:bg-[#1C3E6B] transition-colors focus:outline-none focus:ring-2 focus:ring-[#1769E8]"
          aria-label="View Flood Alerts"
        >
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-[#F5222D] text-white text-[10px] font-bold flex items-center justify-center shadow">
              {unreadCount}
            </span>
          )}
        </button>
      </div>
    </header>
  );
};

import React from 'react';
import {
  LayoutDashboard,
  Map,
  Activity,
  BellRing,
  FileBarChart2,
  Settings,
  ShieldCheck,
  LifeBuoy,
} from 'lucide-react';

export type NavItemKey =
  | 'dashboard'
  | 'flood-map'
  | 'risk-analysis'
  | 'alerts'
  | 'reports'
  | 'settings';

interface SidebarProps {
  activeTab: NavItemKey;
  onSelectTab: (tab: NavItemKey) => void;
  alertCount?: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  alertCount = 3,
}) => {
  const navItems = [
    {
      id: 'dashboard' as NavItemKey,
      label: 'Dashboard',
      icon: LayoutDashboard,
    },
    {
      id: 'flood-map' as NavItemKey,
      label: 'Flood Map',
      icon: Map,
    },
    {
      id: 'risk-analysis' as NavItemKey,
      label: 'Risk Analysis',
      icon: Activity,
    },
    {
      id: 'alerts' as NavItemKey,
      label: 'Alerts',
      icon: BellRing,
      badge: alertCount > 0 ? alertCount : undefined,
    },
    {
      id: 'reports' as NavItemKey,
      label: 'Reports',
      icon: FileBarChart2,
    },
    {
      id: 'settings' as NavItemKey,
      label: 'Settings',
      icon: Settings,
    },
  ];

  return (
    <aside className="w-56 lg:w-60 bg-[#10294B] text-white flex flex-col justify-between shrink-0 border-r border-[#1C3E6B] select-none h-full">
      {/* Navigation List */}
      <div className="py-4 px-3 space-y-1">
        <div className="px-3 pb-2 text-[10px] uppercase font-bold tracking-wider text-[#6B8EB8]">
          Navigation
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all ${
                isActive
                  ? 'bg-[#1769E8] text-white shadow-sm font-semibold'
                  : 'text-[#B2CAE5] hover:text-white hover:bg-[#163761]'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon
                  className={`w-4 h-4 shrink-0 ${
                    isActive ? 'text-white' : 'text-[#8AAECF]'
                  }`}
                  strokeWidth={isActive ? 2.3 : 1.8}
                />
                <span className="whitespace-nowrap">{item.label}</span>
              </div>
              {item.badge !== undefined && (
                <span
                  className={`px-1.5 py-0.5 text-[11px] font-bold rounded-full ${
                    isActive
                      ? 'bg-white text-[#1769E8]'
                      : 'bg-[#F5222D] text-white'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Bottom Shield Branding & Status Card */}
      <div className="p-3 m-3 rounded-lg bg-[#0C203B] border border-[#1C3C68] text-xs">
        <div className="flex items-center gap-2 text-white font-semibold mb-1">
          <ShieldCheck className="w-4 h-4 text-[#16B83F]" />
          <span>Surveillance Active</span>
        </div>
        <p className="text-[11px] text-[#86A3C4] leading-relaxed">
          National Hydrological Sentinel telemetry synced with CWC & IMD radar.
        </p>
        <div className="mt-2.5 pt-2 border-t border-[#18365E] flex items-center justify-between text-[10px] text-[#86A3C4]">
          <span>NDRF Early Warning</span>
          <span className="text-emerald-400 font-mono font-medium">99.8% Up</span>
        </div>
      </div>
    </aside>
  );
};

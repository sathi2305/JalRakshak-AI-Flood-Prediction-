import React, { useState, useEffect } from 'react';
import { AppHeader } from './components/common/AppHeader';
import { Sidebar, NavItemKey } from './components/common/Sidebar';
import { DashboardView } from './components/pages/DashboardView';
import { FloodMapView } from './components/pages/FloodMapView';
import { RiskAnalysisView } from './components/pages/RiskAnalysisView';
import { AlertsView } from './components/pages/AlertsView';
import { ReportsView } from './components/pages/ReportsView';
import { SettingsView } from './components/pages/SettingsView';
import {
  initialDashboardSummary,
  districtsData,
  recentAlertsData,
  trend24hData,
  trend7dData,
  dataSourcesData,
  recommendedActionsData,
} from './data/mockData';
import { CheckCircle2, AlertTriangle, X } from 'lucide-react';
import { ThemeProvider } from './context/ThemeContext';

export default function App() {
  const [activeTab, setActiveTab] = useState<NavItemKey>('dashboard');
  const [isSimulated, setIsSimulated] = useState<boolean>(false);
  const [summary, setSummary] = useState(initialDashboardSummary);
  const [districts, setDistricts] = useState(districtsData);
  const [alerts, setAlerts] = useState(recentAlertsData);
  const [dataSources, setDataSources] = useState(dataSourcesData);
  const [actions, setActions] = useState(recommendedActionsData);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  const handleToggleSimulated = () => {
    setIsSimulated((prev) => {
      const next = !prev;
      showToast(
        next
          ? 'Simulation Mode active: Using curated multi-basin hydrological vectors.'
          : 'Live Feeds active: Synced with IMD & CWC national telemetry.'
      );
      return next;
    });
  };

  const handleDispatchAlert = (alertId: string) => {
    showToast(`Emergency alert broadcast successfully dispatched for ${alertId}.`);
  };

  const handleRefreshDataSources = () => {
    showToast('Data source telemetry connections verified: 4 of 4 feeds healthy.');
  };

  return (
    <ThemeProvider>
      <div className="flex flex-col h-screen w-screen overflow-hidden bg-[#F3F8FD] dark:bg-[#0B1728] text-[#142E53] dark:text-[#E2E8F0] transition-colors duration-200">
        {/* 1. Dark Navy Top Header */}
        <AppHeader
          isSimulated={isSimulated}
          onToggleSimulated={handleToggleSimulated}
          unreadCount={alerts.filter((a) => a.severity === 'very-high').length}
          onNotificationClick={() => setActiveTab('alerts')}
        />

        {/* 2. Main Workspace Layout: Sidebar + Viewport */}
        <div className="flex flex-1 overflow-hidden">
          {/* Dark Navy Sidebar */}
          <Sidebar
            activeTab={activeTab}
            onSelectTab={setActiveTab}
            alertCount={alerts.filter((a) => a.severity === 'very-high').length}
          />

          {/* Dynamic Workspace Container */}
          <main className="flex-1 overflow-y-auto p-4 lg:p-6 bg-[#F3F8FD] dark:bg-[#0B1728] transition-colors duration-200">
            {activeTab === 'dashboard' && (
              <DashboardView
                summary={summary}
                districts={districts}
                alerts={alerts}
                trend24h={trend24hData}
                trend7d={trend7dData}
                dataSources={dataSources}
                actions={actions}
                onDispatchAlert={handleDispatchAlert}
                onRefreshDataSources={handleRefreshDataSources}
              />
            )}

            {activeTab === 'flood-map' && <FloodMapView districts={districts} />}

            {activeTab === 'risk-analysis' && <RiskAnalysisView />}

            {activeTab === 'alerts' && (
              <AlertsView alerts={alerts} onDispatchAlert={handleDispatchAlert} />
            )}

            {activeTab === 'reports' && (
              <ReportsView districts={districts} alerts={alerts} summary={summary} />
            )}

            {activeTab === 'settings' && (
              <SettingsView
                isSimulated={isSimulated}
                onToggleSimulated={handleToggleSimulated}
              />
            )}
          </main>
        </div>

        {/* Floating System Toast */}
        {toastMessage && (
          <div className="fixed bottom-5 right-5 z-50 bg-[#10294B] text-white px-4 py-3 rounded-xl border border-[#2B5488] shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-4 duration-200 text-xs">
            <CheckCircle2 className="w-4 h-4 text-[#16B83F] shrink-0" />
            <span className="font-medium">{toastMessage}</span>
            <button
              onClick={() => setToastMessage(null)}
              className="text-[#8FAAC8] hover:text-white ml-1"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>
    </ThemeProvider>
  );
}

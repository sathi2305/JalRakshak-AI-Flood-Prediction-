import React, { useState } from 'react';
import { DistrictRisk, FloodAlert, DashboardSummary } from '../../types/flood';
import { FileBarChart2, Download, Printer, CheckCircle, ShieldCheck, AlertCircle } from 'lucide-react';

interface ReportsViewProps {
  districts: DistrictRisk[];
  alerts: FloodAlert[];
  summary: DashboardSummary;
}

export const ReportsView: React.FC<ReportsViewProps> = ({
  districts,
  alerts,
  summary,
}) => {
  const [reportType, setReportType] = useState<'daily-sitrep' | 'basin-vulnerability'>('daily-sitrep');
  const [isExporting, setIsExporting] = useState(false);

  const handleExportCSV = () => {
    setIsExporting(true);
    // Build CSV content
    const headers = 'District,State,River Basin,24h Rain (mm),River Level (m),Danger Level (m),Risk Score,Risk Category,Trend,Population at Risk\n';
    const rows = districts
      .map(
        (d) =>
          `"${d.name}","${d.state}","${d.riverBasin}",${d.rainfall24h},${d.riverLevel},${d.dangerLevel},${d.riskScore},"${d.riskCategory}","${d.trend}",${d.populationAtRisk}`
      )
      .join('\n');

    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Jai_Rakshak_Flood_Report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setTimeout(() => setIsExporting(false), 1200);
  };

  const handlePrint = () => {
    window.print();
  };

  const highRiskDistricts = districts.filter(
    (d) => d.riskCategory === 'very-high' || d.riskCategory === 'high'
  );

  return (
    <div className="space-y-4 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="bg-white p-4 rounded-xl border border-[#D9E6F5] shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <FileBarChart2 className="w-5 h-5 text-[#1769E8]" />
          <div>
            <h2 className="text-base font-bold text-[#142E53]">
              Flood Situation Reports (SITREP) & Analytics
            </h2>
            <p className="text-xs text-[#5B7395]">
              Standardized disaster management situational dossiers for NDMA, CWC & State EOC
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            disabled={isExporting}
            className="px-3.5 py-2 rounded-lg text-xs font-semibold bg-[#1769E8] hover:bg-[#1258C5] text-white flex items-center gap-1.5 transition-all shadow-xs"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{isExporting ? 'Generating CSV...' : 'Export Data (CSV)'}</span>
          </button>
          <button
            onClick={handlePrint}
            className="px-3 py-2 rounded-lg text-xs font-semibold border border-[#D9E6F5] bg-white text-[#142E53] hover:bg-[#F8FAFC] flex items-center gap-1.5 transition-all shadow-xs"
          >
            <Printer className="w-3.5 h-3.5 text-[#5B7395]" />
            <span>Print Report</span>
          </button>
        </div>
      </div>

      {/* Main Dossier Card */}
      <div className="bg-white rounded-xl border border-[#D9E6F5] p-6 shadow-xs space-y-6">
        {/* Document Header */}
        <div className="border-b border-[#EDF4FC] pb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#1769E8] bg-[#EBF3FE] px-2 py-0.5 rounded border border-[#BFDBFE]">
              OFFICIAL SITUATION REPORT · SITREP #142
            </span>
            <h3 className="text-xl font-bold text-[#142E53] mt-2">
              National Monsoonal Flood Vulnerability Assessment
            </h3>
            <p className="text-xs text-[#5B7395]">
              Generated automatically on {new Date().toLocaleDateString('en-IN', { dateStyle: 'full' })} at{' '}
              {new Date().toLocaleTimeString()}
            </p>
          </div>

          <div className="text-right text-xs">
            <span className="text-[#8499B5] block">Issuing Framework:</span>
            <span className="font-bold text-[#142E53]">Jai Rakshak AI Surveillance System</span>
            <span className="text-[11px] text-[#16B83F] font-semibold block">Data Integrity Verified</span>
          </div>
        </div>

        {/* Executive Summary Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
          <div className="p-3 bg-[#F8FAFC] rounded-lg border border-[#EDF4FC]">
            <span className="text-[10px] text-[#8499B5] uppercase font-bold block">
              Monitored River Basins
            </span>
            <span className="text-xl font-black text-[#142E53] font-mono mt-0.5 block">
              8 Major Basins
            </span>
          </div>
          <div className="p-3 bg-[#F8FAFC] rounded-lg border border-[#EDF4FC]">
            <span className="text-[10px] text-[#8499B5] uppercase font-bold block">
              Districts in Red/Orange Alert
            </span>
            <span className="text-xl font-black text-[#F5222D] font-mono mt-0.5 block">
              {highRiskDistricts.length} Districts
            </span>
          </div>
          <div className="p-3 bg-[#F8FAFC] rounded-lg border border-[#EDF4FC]">
            <span className="text-[10px] text-[#8499B5] uppercase font-bold block">
              Gauges Over Danger Mark
            </span>
            <span className="text-xl font-black text-[#FF9418] font-mono mt-0.5 block">
              {summary.affectedAreas.riversExceedingDanger} River Gages
            </span>
          </div>
          <div className="p-3 bg-[#F8FAFC] rounded-lg border border-[#EDF4FC]">
            <span className="text-[10px] text-[#8499B5] uppercase font-bold block">
              Operational Relief Camps
            </span>
            <span className="text-xl font-black text-[#16B83F] font-mono mt-0.5 block">
              {summary.affectedAreas.activeReliefCamps} Centers
            </span>
          </div>
        </div>

        {/* Critical Vulnerability Table */}
        <div className="space-y-3">
          <h4 className="text-sm font-bold text-[#142E53]">
            High Priority Flood Inundation Sectors
          </h4>

          <div className="overflow-x-auto border border-[#EDF4FC] rounded-lg">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-[#F8FAFC] text-[#5B7395] font-semibold border-b border-[#EDF4FC]">
                <tr>
                  <th className="py-2 px-3">District</th>
                  <th className="py-2 px-3">Basin</th>
                  <th className="py-2 px-3 text-right">Rainfall (24h)</th>
                  <th className="py-2 px-3 text-right">River Gauge</th>
                  <th className="py-2 px-3 text-center">Danger Status</th>
                  <th className="py-2 px-3 text-right">Pop. at Risk</th>
                  <th className="py-2 px-3 text-center">Severity</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EDF4FC]">
                {highRiskDistricts.map((d) => (
                  <tr key={d.id} className="hover:bg-[#FAFDFE]">
                    <td className="py-2.5 px-3 font-semibold text-[#142E53]">
                      {d.name} ({d.state})
                    </td>
                    <td className="py-2.5 px-3 text-[#5B7395]">{d.riverBasin}</td>
                    <td className="py-2.5 px-3 text-right font-mono">{d.rainfall24h} mm</td>
                    <td className="py-2.5 px-3 text-right font-mono">{d.riverLevel} m</td>
                    <td className="py-2.5 px-3 text-center font-bold text-[#F5222D]">
                      {d.riverLevel >= d.dangerLevel
                        ? `+${(d.riverLevel - d.dangerLevel).toFixed(1)}m breached`
                        : 'At threshold'}
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono">
                      {d.populationAtRisk.toLocaleString()}
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#FEE2E2] text-[#F5222D] uppercase">
                        {d.riskCategory}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Tactical Recommendation Checklist */}
        <div className="p-4 bg-[#FAFDFE] rounded-xl border border-[#EDF4FC] space-y-2 text-xs">
          <h4 className="font-bold text-[#142E53]">
            Key Tactical Recommendations for State Emergency Operations Centres (SEOC)
          </h4>
          <ul className="space-y-1.5 text-[#5B7395]">
            <li className="flex items-start gap-2">
              <CheckCircle className="w-3.5 h-3.5 text-[#16B83F] shrink-0 mt-0.5" />
              <span>Continue mandatory 24/7 embankment patrol along Brahmaputra right bank (Kamrup to Dhubri).</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-3.5 h-3.5 text-[#16B83F] shrink-0 mt-0.5" />
              <span>Position quick-reaction medical teams and mobile chlorine disinfection kits in lower Assam relief schools.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-3.5 h-3.5 text-[#16B83F] shrink-0 mt-0.5" />
              <span>Synchronize reservoir sluice discharge schedules between Hirakud Dam authorities and Odisha Revenue Disaster unit.</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

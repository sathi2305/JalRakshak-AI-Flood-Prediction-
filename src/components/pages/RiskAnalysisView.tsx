import React, { useState, useMemo } from 'react';
import { calculateFloodRisk, RiskEngineInput } from '../../risk_engine/riskCalculator';
import { Activity, Sliders, ShieldAlert, AlertTriangle, FileText, CheckCircle2, Info } from 'lucide-react';

export const RiskAnalysisView: React.FC = () => {
  // Sandbox state
  const [rainfall24h, setRainfall24h] = useState<number>(142.8);
  const [rainfallTrend, setRainfallTrend] = useState<'rising' | 'stable' | 'falling'>('rising');
  const [riverLevel, setRiverLevel] = useState<number>(78.4);
  const [dangerLevel, setDangerLevel] = useState<number>(76.0);
  const [soilMoisturePct, setSoilMoisturePct] = useState<number>(82);
  const [drainageCapacity, setDrainageCapacity] = useState<number>(45);

  const riskResult = useMemo(() => {
    return calculateFloodRisk({
      rainfall24h,
      rainfallTrend,
      riverLevel,
      dangerLevel,
      soilMoisturePct,
      drainageCapacityMmPerDay: drainageCapacity,
    });
  }, [rainfall24h, rainfallTrend, riverLevel, dangerLevel, soilMoisturePct, drainageCapacity]);

  return (
    <div className="space-y-4 max-w-[1600px] mx-auto">
      {/* View Header */}
      <div className="bg-white p-4 rounded-xl border border-[#D9E6F5] shadow-xs flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <Activity className="w-5 h-5 text-[#1769E8]" />
          <div>
            <h2 className="text-base font-bold text-[#142E53]">
              Hydrological Risk Assessment Engine
            </h2>
            <p className="text-xs text-[#5B7395]">
              Deterministic rule-based mathematical scoring model calibrated to Central Water Commission thresholds
            </p>
          </div>
        </div>
        <span className="text-xs font-mono font-semibold bg-[#EBF3FE] text-[#1769E8] px-3 py-1 rounded-lg border border-[#BFDBFE]">
          Model v1.4 · Deterministic
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left: Interactive Sandbox Calculator */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-white rounded-xl border border-[#D9E6F5] p-5 shadow-xs space-y-5">
            <div className="flex items-center justify-between border-b border-[#EDF4FC] pb-3">
              <div className="flex items-center gap-2">
                <Sliders className="w-4 h-4 text-[#1769E8]" />
                <h3 className="text-sm font-bold text-[#142E53]">
                  Interactive Parameter Simulation Sandbox
                </h3>
              </div>
              <span className="text-[11px] text-[#5B7395]">Real-time Calculation</span>
            </div>

            {/* Slider 1: 24h Rainfall */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <label className="font-semibold text-[#142E53]">24-Hour Cumulative Rainfall (mm)</label>
                <span className="font-mono font-bold text-[#1769E8]">{rainfall24h} mm</span>
              </div>
              <input
                type="range"
                min="0"
                max="300"
                step="1"
                value={rainfall24h}
                onChange={(e) => setRainfall24h(parseFloat(e.target.value))}
                className="w-full accent-[#1769E8] cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-[#8499B5]">
                <span>0 mm (Normal)</span>
                <span>64.5 mm (Heavy)</span>
                <span>115.6 mm (Very Heavy)</span>
                <span>204+ mm (Extremely Heavy)</span>
              </div>
            </div>

            {/* Selector: Rainfall Trend */}
            <div className="space-y-1.5">
              <label className="font-semibold text-[#142E53] text-xs">Precipitation Trend Horizon</label>
              <div className="grid grid-cols-3 gap-2">
                {(['rising', 'stable', 'falling'] as const).map((trend) => (
                  <button
                    key={trend}
                    onClick={() => setRainfallTrend(trend)}
                    className={`py-1.5 px-3 rounded-lg text-xs font-semibold capitalize transition-all border ${
                      rainfallTrend === trend
                        ? 'bg-[#1769E8] text-white border-[#1769E8] shadow-xs'
                        : 'bg-[#F8FAFC] text-[#5B7395] border-[#D9E6F5] hover:bg-[#EDF4FC]'
                    }`}
                  >
                    {trend}
                  </button>
                ))}
              </div>
            </div>

            {/* Slider 2: River Water Level */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <label className="font-semibold text-[#142E53]">Observed River Water Level (meters)</label>
                <span className="font-mono font-bold text-[#8B5CF6]">{riverLevel} m</span>
              </div>
              <input
                type="range"
                min="70"
                max="82"
                step="0.1"
                value={riverLevel}
                onChange={(e) => setRiverLevel(parseFloat(e.target.value))}
                className="w-full accent-[#8B5CF6] cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-[#8499B5]">
                <span>70.0 m (Base)</span>
                <span>74.0 m (Warning Mark)</span>
                <span className="text-[#F5222D] font-bold">76.0 m (Danger Mark)</span>
                <span>82.0 m (Extreme Crest)</span>
              </div>
            </div>

            {/* Danger Mark Reference Input */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <label className="font-semibold text-[#142E53]">Official Gauge Danger Threshold (meters)</label>
                <span className="font-mono font-bold text-[#F5222D]">{dangerLevel} m</span>
              </div>
              <input
                type="range"
                min="70"
                max="80"
                step="0.5"
                value={dangerLevel}
                onChange={(e) => setDangerLevel(parseFloat(e.target.value))}
                className="w-full accent-[#F5222D] cursor-pointer"
              />
            </div>

            {/* Slider 3: Antecedent Soil Moisture % */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <label className="font-semibold text-[#142E53]">Antecedent Soil Moisture Saturation (%)</label>
                <span className="font-mono font-bold text-[#CA8A04]">{soilMoisturePct}%</span>
              </div>
              <input
                type="range"
                min="10"
                max="100"
                step="1"
                value={soilMoisturePct}
                onChange={(e) => setSoilMoisturePct(parseInt(e.target.value))}
                className="w-full accent-[#CA8A04] cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-[#8499B5]">
                <span>10% (Dry Substrate)</span>
                <span>50% (Medium)</span>
                <span>80%+ (High Runoff Risk)</span>
                <span>100% (Fully Saturated)</span>
              </div>
            </div>

            {/* Slider 4: Catchment Drainage Capacity */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <label className="font-semibold text-[#142E53]">Catchment Drainage Index (mm/day capacity)</label>
                <span className="font-mono font-bold text-[#16B83F]">{drainageCapacity} mm/day</span>
              </div>
              <input
                type="range"
                min="20"
                max="100"
                step="5"
                value={drainageCapacity}
                onChange={(e) => setDrainageCapacity(parseInt(e.target.value))}
                className="w-full accent-[#16B83F] cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Right: Calculated Result & Transparent Factor Weights */}
        <div className="lg:col-span-6 space-y-4">
          {/* Output Score Card */}
          <div
            className="rounded-xl border-2 p-5 shadow-sm text-white"
            style={{
              backgroundColor:
                riskResult.riskCategory === 'very-high'
                  ? '#B91C1C'
                  : riskResult.riskCategory === 'high'
                  ? '#C2410C'
                  : riskResult.riskCategory === 'moderate'
                  ? '#A16207'
                  : '#15803D',
              borderColor: riskResult.colorHex,
            }}
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[11px] uppercase font-bold tracking-wider text-white/80">
                  Calculated Risk Index
                </span>
                <h3 className="text-3xl font-black mt-1">
                  {riskResult.categoryLabel}
                </h3>
              </div>
              <div className="text-right">
                <span className="text-4xl font-black font-mono tabular-nums">
                  {riskResult.riskScore}
                </span>
                <span className="text-lg font-bold text-white/80"> / 100</span>
              </div>
            </div>

            <p className="text-xs text-white/90 mt-3 pt-3 border-t border-white/20">
              Evaluated at {new Date(riskResult.calculatedAt).toLocaleTimeString()} · Calibrated to CWC Standard Flood Protocols
            </p>
          </div>

          {/* Factor Contribution Breakdown */}
          <div className="bg-white rounded-xl border border-[#D9E6F5] p-5 shadow-xs space-y-3.5">
            <h4 className="text-xs font-bold text-[#142E53] uppercase tracking-wider">
              Weight Distribution & Sub-Component Scores
            </h4>

            {/* River Level Score */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-[#142E53] font-semibold">
                  1. River Gauge Breach (Weight 45%)
                </span>
                <span className="font-mono text-[#8B5CF6] font-bold">
                  {riskResult.factors.riverScore} / 100
                </span>
              </div>
              <div className="w-full bg-[#F1F5F9] h-2 rounded-full overflow-hidden">
                <div
                  className="bg-[#8B5CF6] h-full rounded-full transition-all duration-300"
                  style={{ width: `${riskResult.factors.riverScore}%` }}
                />
              </div>
            </div>

            {/* Rainfall Score */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-[#142E53] font-semibold">
                  2. Precipitation Magnitude (Weight 35%)
                </span>
                <span className="font-mono text-[#1769E8] font-bold">
                  {riskResult.factors.rainfallScore} / 100
                </span>
              </div>
              <div className="w-full bg-[#F1F5F9] h-2 rounded-full overflow-hidden">
                <div
                  className="bg-[#1769E8] h-full rounded-full transition-all duration-300"
                  style={{ width: `${riskResult.factors.rainfallScore}%` }}
                />
              </div>
            </div>

            {/* Soil Saturation Score */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-[#142E53] font-semibold">
                  3. Soil Moisture Saturation (Weight 15%)
                </span>
                <span className="font-mono text-[#CA8A04] font-bold">
                  {riskResult.factors.soilScore} / 100
                </span>
              </div>
              <div className="w-full bg-[#F1F5F9] h-2 rounded-full overflow-hidden">
                <div
                  className="bg-[#CA8A04] h-full rounded-full transition-all duration-300"
                  style={{ width: `${riskResult.factors.soilScore}%` }}
                />
              </div>
            </div>

            {/* Drainage Deficit Penalty */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-[#142E53] font-semibold">
                  4. Drainage Inefficiency Deficit (Weight 5%)
                </span>
                <span className="font-mono text-[#F5222D] font-bold">
                  {riskResult.factors.drainagePenalty} / 100
                </span>
              </div>
              <div className="w-full bg-[#F1F5F9] h-2 rounded-full overflow-hidden">
                <div
                  className="bg-[#F5222D] h-full rounded-full transition-all duration-300"
                  style={{ width: `${riskResult.factors.drainagePenalty}%` }}
                />
              </div>
            </div>
          </div>

          {/* Model Transparency & Rationale */}
          <div className="bg-white rounded-xl border border-[#D9E6F5] p-5 shadow-xs space-y-3">
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#142E53]">
              <FileText className="w-4 h-4 text-[#1769E8]" />
              <span>Assessment Rationale</span>
            </div>
            <ul className="space-y-1.5 text-xs text-[#5B7395]">
              {riskResult.rationale.map((r, i) => (
                <li key={i} className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#1769E8] shrink-0 mt-0.5" />
                  <span>{r}</span>
                </li>
              ))}
            </ul>

            <div className="mt-3 pt-3 border-t border-[#EDF4FC]">
              <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#DC2626] mb-1">
                <Info className="w-3.5 h-3.5" />
                <span>Deterministic Model Boundaries & Scientific Limitations</span>
              </div>
              <ul className="space-y-1 text-[11px] text-[#8499B5]">
                {riskResult.limitations.map((lim, i) => (
                  <li key={i}>• {lim}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

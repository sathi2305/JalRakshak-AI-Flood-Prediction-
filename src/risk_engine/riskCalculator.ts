import { RiskSeverity } from '../types/flood';

export interface RiskEngineInput {
  rainfall24h: number; // in mm
  rainfallTrend: 'rising' | 'stable' | 'falling';
  riverLevel: number; // in meters
  dangerLevel: number; // in meters
  soilMoisturePct?: number; // 0-100% saturation
  drainageCapacityMmPerDay?: number; // mm/day drainage rate
}

export interface RiskFactorBreakdown {
  rainfallScore: number;
  rainfallContributionPct: number;
  riverScore: number;
  riverContributionPct: number;
  soilScore: number;
  soilContributionPct: number;
  drainagePenalty: number;
}

export interface RiskEngineResult {
  riskScore: number; // 0 to 100
  riskCategory: RiskSeverity;
  categoryLabel: string;
  colorHex: string;
  factors: RiskFactorBreakdown;
  rationale: string[];
  limitations: string[];
  calculatedAt: string;
  modelType: 'Hydrological-Rule-Engine-v1.4';
}

/**
 * Transparent hydrological rule-based flood risk assessment engine.
 * Calibrated against Central Water Commission (CWC) danger thresholds and
 * Indian Meteorological Department (IMD) heavy rainfall criteria:
 * - Isolated Heavy Rain: 64.5 - 115.5 mm
 * - Very Heavy Rain: 115.6 - 204.4 mm
 * - Extremely Heavy Rain: > 204.4 mm
 */
export function calculateFloodRisk(input: RiskEngineInput): RiskEngineResult {
  const {
    rainfall24h,
    rainfallTrend,
    riverLevel,
    dangerLevel,
    soilMoisturePct = 65,
    drainageCapacityMmPerDay = 50,
  } = input;

  // 1. Rainfall Component (Weight: 35%)
  // Normalized from 0 mm (score 0) to 250 mm (score 100)
  let rawRainScore = Math.min(100, (rainfall24h / 220) * 100);
  if (rainfallTrend === 'rising') rawRainScore = Math.min(100, rawRainScore * 1.15);
  else if (rainfallTrend === 'falling') rawRainScore *= 0.9;

  // 2. River Level Component (Weight: 45%)
  // Calculates how close or exceeding the river is relative to danger mark
  // Below danger mark by >2m -> low; At danger mark -> 70; >1.5m above danger -> 100
  const bufferFromDanger = riverLevel - dangerLevel;
  let rawRiverScore = 0;
  if (bufferFromDanger >= 2.0) {
    rawRiverScore = 100;
  } else if (bufferFromDanger >= 1.0) {
    rawRiverScore = 88 + (bufferFromDanger - 1.0) * 12;
  } else if (bufferFromDanger >= 0) {
    rawRiverScore = 70 + bufferFromDanger * 18;
  } else if (bufferFromDanger >= -1.0) {
    rawRiverScore = 45 + (bufferFromDanger + 1.0) * 25;
  } else if (bufferFromDanger >= -2.5) {
    rawRiverScore = 20 + (bufferFromDanger + 2.5) * 16.6;
  } else {
    rawRiverScore = Math.max(0, 15 + (bufferFromDanger + 2.5) * 5);
  }

  // 3. Soil Saturation Component (Weight: 15%)
  // High soil moisture prevents infiltration, accelerating surface runoff
  const rawSoilScore = Math.min(100, Math.max(0, soilMoisturePct));

  // 4. Drainage Inefficiency Penalty (Weight: 5%)
  const drainageDeficit = Math.max(0, rainfall24h - drainageCapacityMmPerDay);
  const rawDrainageScore = Math.min(100, (drainageDeficit / 100) * 100);

  // Composite Weighted Score
  const weightedScore = Math.round(
    rawRainScore * 0.35 +
    rawRiverScore * 0.45 +
    rawSoilScore * 0.15 +
    rawDrainageScore * 0.05
  );

  const clampedScore = Math.min(100, Math.max(0, weightedScore));

  let riskCategory: RiskSeverity = 'low';
  let categoryLabel = 'Low Risk';
  let colorHex = '#16B83F';

  if (clampedScore >= 75) {
    riskCategory = 'very-high';
    categoryLabel = 'Very High Risk';
    colorHex = '#F5222D';
  } else if (clampedScore >= 50) {
    riskCategory = 'high';
    categoryLabel = 'High Risk';
    colorHex = '#FF9418';
  } else if (clampedScore >= 25) {
    riskCategory = 'moderate';
    categoryLabel = 'Moderate Risk';
    colorHex = '#FFD52A';
  }

  const rationale: string[] = [];
  if (bufferFromDanger > 0) {
    rationale.push(`River gauge (${riverLevel.toFixed(1)}m) has breached official danger mark (${dangerLevel.toFixed(1)}m) by +${bufferFromDanger.toFixed(1)}m.`);
  } else {
    rationale.push(`River gauge (${riverLevel.toFixed(1)}m) is within safety tolerance of danger mark (${dangerLevel.toFixed(1)}m).`);
  }

  if (rainfall24h >= 115) {
    rationale.push(`Extremely high 24h precipitation recorded (${rainfall24h.toFixed(1)}mm), exceeding absorption thresholds.`);
  } else if (rainfall24h >= 64) {
    rationale.push(`Moderate to heavy rainfall (${rainfall24h.toFixed(1)}mm) contributing to high catchment inflow.`);
  }

  if (soilMoisturePct > 80) {
    rationale.push(`Catchment soil is heavily saturated (${soilMoisturePct}%), leading to nearly 100% overland runoff.`);
  }

  const limitations = [
    'Based on transparent deterministic hydrological thresholds; not an unverified black-box neural forecast.',
    'Actual local backwater flooding depends on embankment integrity and upstream reservoir release schedules.',
    'Direct evacuation orders must originate solely from District Disaster Management Authorities (DDMA) and NDRF.',
  ];

  return {
    riskScore: clampedScore,
    riskCategory,
    categoryLabel,
    colorHex,
    factors: {
      rainfallScore: Math.round(rawRainScore),
      rainfallContributionPct: 35,
      riverScore: Math.round(rawRiverScore),
      riverContributionPct: 45,
      soilScore: Math.round(rawSoilScore),
      soilContributionPct: 15,
      drainagePenalty: Math.round(rawDrainageScore),
    },
    rationale,
    limitations,
    calculatedAt: new Date().toISOString(),
    modelType: 'Hydrological-Rule-Engine-v1.4',
  };
}

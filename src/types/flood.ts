export type RiskSeverity = 'very-high' | 'high' | 'moderate' | 'low';

export interface DistrictRisk {
  id: string;
  name: string;
  state: string;
  riverBasin: string;
  rainfall24h: number; // mm
  riverLevel: number; // m
  dangerLevel: number; // m
  riskScore: number; // 0-100
  riskCategory: RiskSeverity;
  trend: 'rising' | 'stable' | 'falling';
  coordinates: [number, number]; // [lat, lng]
  populationAtRisk: number;
  reliefCampsActive: number;
  lastUpdated: string;
}

export interface FloodAlert {
  id: string;
  severity: RiskSeverity;
  title: string;
  location: string;
  description: string;
  riverBasin: string;
  waterLevelAboveDanger: number; // in meters
  predictedRainfall18h: number; // in mm
  affectedDistricts: string[];
  broadcastTime: string;
  source: string;
  status: 'active' | 'monitoring' | 'resolved';
}

export interface TrendDataPoint {
  time: string;
  rainfall: number; // mm
  riverLevel: number; // m
  dangerMark: number; // m
}

export interface DataSourceStatus {
  id: string;
  name: string;
  organization: string;
  status: 'connected' | 'stale' | 'unavailable' | 'simulated';
  latency: string;
  lastSync: string;
  coverage: string;
  dataType: string;
}

export interface RecommendedAction {
  id: string;
  priority: 1 | 2 | 3;
  title: string;
  actionText: string;
  agency: string;
  targetArea: string;
  contactNumber: string;
  timestamp: string;
}

export interface DashboardSummary {
  rainfall24h: {
    value: number;
    unit: string;
    changePct: number;
    historicalAverage: number;
    latestObservation: string;
  };
  riverLevel: {
    current: number;
    dangerMark: number;
    unit: string;
    gaugeStation: string;
    river: string;
    aboveDanger: number;
    latestObservation: string;
  };
  floodRisk: {
    category: RiskSeverity;
    score: number;
    highRiskDistrictCount: number;
    assessmentTime: string;
  };
  affectedAreas: {
    districtCount: number;
    riversExceedingDanger: number;
    activeReliefCamps: number;
    criteria: string;
  };
}

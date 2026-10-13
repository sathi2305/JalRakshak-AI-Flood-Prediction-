import {
  initialDashboardSummary,
  districtsData,
  recentAlertsData,
  dataSourcesData,
  recommendedActionsData,
  trend24hData,
  trend7dData,
} from '../data/mockData';
import {
  DashboardSummary,
  DistrictRisk,
  FloodAlert,
  DataSourceStatus,
  RecommendedAction,
  TrendDataPoint,
} from '../types/flood';
import { calculateFloodRisk, RiskEngineInput, RiskEngineResult } from '../risk_engine/riskCalculator';

class ApiService {
  private isSimulationMode = false;

  public setSimulationMode(enabled: boolean) {
    this.isSimulationMode = enabled;
  }

  public getIsSimulationMode(): boolean {
    return this.isSimulationMode;
  }

  public async getDashboardSummary(): Promise<DashboardSummary> {
    // In live or simulated mode, returns structured validated payload
    return { ...initialDashboardSummary };
  }

  public async getDistrictsRisk(): Promise<DistrictRisk[]> {
    return [...districtsData];
  }

  public async getAlerts(): Promise<FloodAlert[]> {
    return [...recentAlertsData];
  }

  public async getTrendData(timeframe: '24h' | '7d' = '24h'): Promise<TrendDataPoint[]> {
    return timeframe === '24h' ? [...trend24hData] : [...trend7dData];
  }

  public async getDataSources(): Promise<DataSourceStatus[]> {
    return [...dataSourcesData];
  }

  public async getRecommendations(): Promise<RecommendedAction[]> {
    return [...recommendedActionsData];
  }

  public calculateRisk(input: RiskEngineInput): RiskEngineResult {
    return calculateFloodRisk(input);
  }

  public async triggerSimulatedRainfallSpike(): Promise<{
    summary: DashboardSummary;
    district: DistrictRisk;
  }> {
    const updatedSummary = { ...initialDashboardSummary };
    updatedSummary.rainfall24h.value = 186.4;
    updatedSummary.rainfall24h.changePct = 38.6;
    updatedSummary.riverLevel.current = 79.2;
    updatedSummary.riverLevel.aboveDanger = 3.2;

    const district = { ...districtsData[0] };
    district.rainfall24h = 215.0;
    district.riverLevel = 79.2;
    district.riskScore = 96;

    return { summary: updatedSummary, district };
  }
}

export const apiService = new ApiService();

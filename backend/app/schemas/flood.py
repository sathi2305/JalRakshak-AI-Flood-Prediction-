from pydantic import BaseModel, Field
from typing import List, Optional, Literal


class RainfallSummary(BaseModel):
    value: float = Field(..., description="Cumulative 24h rainfall in millimeters")
    unit: str = "mm"
    changePct: float
    historicalAverage: float
    latestObservation: str


class RiverLevelSummary(BaseModel):
    current: float = Field(..., description="Observed water level in meters")
    dangerMark: float = Field(..., description="Official danger threshold in meters")
    unit: str = "m"
    gaugeStation: str
    river: str
    aboveDanger: float
    latestObservation: str


class FloodRiskSummary(BaseModel):
    category: Literal["very-high", "high", "moderate", "low"]
    score: int = Field(..., ge=0, le=100)
    highRiskDistrictCount: int
    assessmentTime: str


class AffectedAreasSummary(BaseModel):
    districtCount: int
    riversExceedingDanger: int
    activeReliefCamps: int
    criteria: str


class DashboardSummaryResponse(BaseModel):
    rainfall24h: RainfallSummary
    riverLevel: RiverLevelSummary
    floodRisk: FloodRiskSummary
    affectedAreas: AffectedAreasSummary


class DistrictRiskModel(BaseModel):
    id: str
    name: str
    state: str
    riverBasin: str
    rainfall24h: float
    riverLevel: float
    dangerLevel: float
    riskScore: int
    riskCategory: Literal["very-high", "high", "moderate", "low"]
    trend: Literal["rising", "stable", "falling"]
    coordinates: List[float]
    populationAtRisk: int
    reliefCampsActive: int
    lastUpdated: str


class FloodAlertModel(BaseModel):
    id: str
    severity: Literal["very-high", "high", "moderate", "low"]
    title: str
    location: str
    description: str
    riverBasin: str
    waterLevelAboveDanger: float
    predictedRainfall18h: float
    affectedDistricts: List[str]
    broadcastTime: str
    source: str
    status: Literal["active", "monitoring", "resolved"]


class DataSourceStatusModel(BaseModel):
    id: str
    name: str
    organization: str
    status: Literal["connected", "stale", "unavailable", "simulated"]
    latency: str
    lastSync: str
    coverage: str
    dataType: str


class RecommendedActionModel(BaseModel):
    id: str
    priority: int = Field(..., ge=1, le=3)
    title: str
    actionText: str
    agency: str
    targetArea: str
    contactNumber: str
    timestamp: str


class RiskAssessmentRequest(BaseModel):
    rainfall24h: float = Field(..., ge=0, description="24h rainfall in mm")
    rainfallTrend: Literal["rising", "stable", "falling"] = "stable"
    riverLevel: float = Field(..., ge=0, description="Observed river gauge in meters")
    dangerLevel: float = Field(..., gt=0, description="Official danger threshold in meters")
    soilMoisturePct: Optional[float] = Field(65.0, ge=0, le=100)
    drainageCapacityMmPerDay: Optional[float] = Field(50.0, ge=0)


class RiskFactorBreakdown(BaseModel):
    rainfallScore: int
    rainfallContributionPct: int
    riverScore: int
    riverContributionPct: int
    soilScore: int
    soilContributionPct: int
    drainagePenalty: int


class RiskAssessmentResponse(BaseModel):
    riskScore: int
    riskCategory: Literal["very-high", "high", "moderate", "low"]
    categoryLabel: str
    colorHex: str
    factors: RiskFactorBreakdown
    rationale: List[str]
    limitations: List[str]
    calculatedAt: str
    modelType: str

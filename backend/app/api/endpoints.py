from fastapi import APIRouter, HTTPException, Query
from typing import List, Optional

from backend.app.schemas.flood import (
    DashboardSummaryResponse,
    DistrictRiskModel,
    FloodAlertModel,
    DataSourceStatusModel,
    RecommendedActionModel,
    RiskAssessmentRequest,
    RiskAssessmentResponse,
)
from backend.app.services.flood_service import flood_service
from backend.app.risk_engine.engine import calculate_flood_risk

router = APIRouter()


@router.get("/health")
def get_health():
    return {
        "status": "healthy",
        "service": "Jai Rakshak Flood Prediction Core",
        "version": "1.0.0",
        "simulation_mode": True,
    }


@router.get("/dashboard/summary", response_model=DashboardSummaryResponse)
def get_dashboard_summary():
    return flood_service.get_dashboard_summary()


@router.get("/weather/current")
def get_current_weather():
    summary = flood_service.get_dashboard_summary()
    return {
        "precipitation_24h_mm": summary.rainfall24h.value,
        "historical_norm_mm": summary.rainfall24h.historicalAverage,
        "trend_pct": summary.rainfall24h.changePct,
        "observation_time": summary.rainfall24h.latestObservation,
        "source": "India Meteorological Department (IMD AWS)",
    }


@router.get("/weather/history")
def get_weather_history():
    return {
        "timeframe": "7-day precipitation profile",
        "observations": [
            {"day": "Day 1", "rainfall_mm": 35.0},
            {"day": "Day 2", "rainfall_mm": 48.0},
            {"day": "Day 3", "rainfall_mm": 72.0},
            {"day": "Day 4", "rainfall_mm": 110.0},
            {"day": "Day 5", "rainfall_mm": 130.0},
            {"day": "Day 6", "rainfall_mm": 155.0},
            {"day": "Today", "rainfall_mm": 142.8},
        ],
        "source": "IMD Gridded Historical Archive",
    }


@router.get("/river-levels")
def get_river_levels():
    summary = flood_service.get_dashboard_summary()
    return {
        "gauge_station": summary.riverLevel.gaugeStation,
        "river": summary.riverLevel.river,
        "current_level_m": summary.riverLevel.current,
        "danger_mark_m": summary.riverLevel.dangerMark,
        "buffer_m": summary.riverLevel.aboveDanger,
        "status": "DANGER LEVEL EXCEEDED" if summary.riverLevel.aboveDanger > 0 else "NORMAL",
        "source": "Central Water Commission (CWC)",
    }


@router.get("/flood-risk")
def get_flood_risk_overview():
    summary = flood_service.get_dashboard_summary()
    return {
        "risk_category": summary.floodRisk.category,
        "risk_score": summary.floodRisk.score,
        "districts_on_alert": summary.floodRisk.highRiskDistrictCount,
        "assessment_model": "Hydrological-Rule-Engine-v1.4",
        "timestamp": summary.floodRisk.assessmentTime,
    }


@router.post("/flood-risk/calculate", response_model=RiskAssessmentResponse)
def run_risk_calculation(request: RiskAssessmentRequest):
    return calculate_flood_risk(request)


@router.get("/flood-risk/regions/{region_id}", response_model=DistrictRiskModel)
def get_region_risk(region_id: str):
    district = flood_service.get_district_by_id(region_id)
    if not district:
        raise HTTPException(status_code=404, detail="Region not found")
    return district


@router.get("/alerts", response_model=List[FloodAlertModel])
def get_alerts(severity: Optional[str] = Query(None, description="Filter by severity")):
    return flood_service.get_alerts(severity)


@router.get("/alerts/{alert_id}", response_model=FloodAlertModel)
def get_alert_by_id(alert_id: str):
    alert = flood_service.get_alert_by_id(alert_id)
    if not alert:
        raise HTTPException(status_code=404, detail="Alert not found")
    return alert


@router.get("/districts/risk", response_model=List[DistrictRiskModel])
def get_districts_risk():
    return flood_service.get_districts()


@router.get("/data-sources/status", response_model=List[DataSourceStatusModel])
def get_data_sources_status():
    return flood_service.get_data_sources()


@router.get("/recommendations", response_model=List[RecommendedActionModel])
def get_recommendations():
    return flood_service.get_recommendations()

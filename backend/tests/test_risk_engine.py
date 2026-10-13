import pytest
from backend.app.schemas.flood import RiskAssessmentRequest
from backend.app.risk_engine.engine import calculate_flood_risk


def test_extreme_flood_risk_classification():
    """Verify that heavy rainfall exceeding danger level results in very-high risk."""
    req = RiskAssessmentRequest(
        rainfall24h=190.0,
        rainfallTrend="rising",
        riverLevel=78.5,
        dangerLevel=76.0,
        soilMoisturePct=95.0,
        drainageCapacityMmPerDay=40.0,
    )
    result = calculate_flood_risk(req)
    assert result.riskCategory == "very-high"
    assert result.riskScore >= 75
    assert len(result.rationale) >= 2
    assert "breached official danger mark" in result.rationale[0]


def test_low_risk_classification():
    """Verify that minimal rainfall and safe river level returns low risk."""
    req = RiskAssessmentRequest(
        rainfall24h=12.0,
        rainfallTrend="falling",
        riverLevel=68.0,
        dangerLevel=76.0,
        soilMoisturePct=30.0,
        drainageCapacityMmPerDay=60.0,
    )
    result = calculate_flood_risk(req)
    assert result.riskCategory == "low"
    assert result.riskScore < 25


def test_moderate_risk_classification():
    """Verify intermediate conditions yield moderate risk category."""
    req = RiskAssessmentRequest(
        rainfall24h=55.0,
        rainfallTrend="stable",
        riverLevel=74.5,
        dangerLevel=76.0,
        soilMoisturePct=60.0,
    )
    result = calculate_flood_risk(req)
    assert result.riskCategory in ["moderate", "high"]
    assert 25 <= result.riskScore <= 74


def test_soil_saturation_factor():
    """Verify that saturated soil increases the composite risk score."""
    dry_req = RiskAssessmentRequest(
        rainfall24h=70.0,
        rainfallTrend="stable",
        riverLevel=75.0,
        dangerLevel=76.0,
        soilMoisturePct=15.0,
    )
    saturated_req = RiskAssessmentRequest(
        rainfall24h=70.0,
        rainfallTrend="stable",
        riverLevel=75.0,
        dangerLevel=76.0,
        soilMoisturePct=95.0,
    )
    dry_result = calculate_flood_risk(dry_req)
    sat_result = calculate_flood_risk(saturated_req)
    assert sat_result.riskScore > dry_result.riskScore

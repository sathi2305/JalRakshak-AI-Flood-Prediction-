from datetime import datetime, timezone
from backend.app.schemas.flood import (
    RiskAssessmentRequest,
    RiskAssessmentResponse,
    RiskFactorBreakdown,
)


def calculate_flood_risk(request: RiskAssessmentRequest) -> RiskAssessmentResponse:
    """
    Transparent rule-based flood risk assessment engine.
    Calibrated against Central Water Commission (CWC) danger levels and
    Indian Meteorological Department (IMD) heavy rainfall categories.
    """
    # 1. Rainfall Component (Weight: 35%)
    raw_rain_score = min(100.0, (request.rainfall24h / 220.0) * 100.0)
    if request.rainfallTrend == "rising":
        raw_rain_score = min(100.0, raw_rain_score * 1.15)
    elif request.rainfallTrend == "falling":
        raw_rain_score = raw_rain_score * 0.9

    # 2. River Level Component (Weight: 45%)
    buffer_from_danger = request.riverLevel - request.dangerLevel
    if buffer_from_danger >= 2.0:
        raw_river_score = 100.0
    elif buffer_from_danger >= 1.0:
        raw_river_score = 88.0 + (buffer_from_danger - 1.0) * 12.0
    elif buffer_from_danger >= 0.0:
        raw_river_score = 70.0 + buffer_from_danger * 18.0
    elif buffer_from_danger >= -1.0:
        raw_river_score = 45.0 + (buffer_from_danger + 1.0) * 25.0
    elif buffer_from_danger >= -2.5:
        raw_river_score = 20.0 + (buffer_from_danger + 2.5) * 16.6
    else:
        raw_river_score = max(0.0, 15.0 + (buffer_from_danger + 2.5) * 5.0)

    # 3. Soil Saturation Component (Weight: 15%)
    soil_pct = request.soilMoisturePct if request.soilMoisturePct is not None else 65.0
    raw_soil_score = min(100.0, max(0.0, soil_pct))

    # 4. Drainage Inefficiency Penalty (Weight: 5%)
    drainage_cap = request.drainageCapacityMmPerDay if request.drainageCapacityMmPerDay is not None else 50.0
    drainage_deficit = max(0.0, request.rainfall24h - drainage_cap)
    raw_drainage_score = min(100.0, (drainage_deficit / 100.0) * 100.0)

    # Weighted calculation
    weighted_score = round(
        raw_rain_score * 0.35 +
        raw_river_score * 0.45 +
        raw_soil_score * 0.15 +
        raw_drainage_score * 0.05
    )
    clamped_score = min(100, max(0, weighted_score))

    if clamped_score >= 75:
        category = "very-high"
        label = "Very High Risk"
        color = "#F5222D"
    elif clamped_score >= 50:
        category = "high"
        label = "High Risk"
        color = "#FF9418"
    elif clamped_score >= 25:
        category = "moderate"
        label = "Moderate Risk"
        color = "#FFD52A"
    else:
        category = "low"
        label = "Low Risk"
        color = "#16B83F"

    rationale = []
    if buffer_from_danger > 0:
        rationale.append(
            f"River gauge ({request.riverLevel:.1f}m) has breached official danger mark "
            f"({request.dangerLevel:.1f}m) by +{buffer_from_danger:.1f}m."
        )
    else:
        rationale.append(
            f"River gauge ({request.riverLevel:.1f}m) is within safety margins of danger threshold "
            f"({request.dangerLevel:.1f}m)."
        )

    if request.rainfall24h >= 115.6:
        rationale.append(
            f"Very heavy precipitation recorded ({request.rainfall24h:.1f}mm), saturating local catchments."
        )
    elif request.rainfall24h >= 64.5:
        rationale.append(
            f"Heavy rainfall ({request.rainfall24h:.1f}mm) contributing to accelerated runoff."
        )

    if soil_pct > 80:
        rationale.append(f"Catchment soil moisture is high ({soil_pct:.0f}%), promoting immediate overland flow.")

    limitations = [
        "Assessment is deterministic and rule-based; it is not a black-box deep learning forecast.",
        "Local backwater flood depth is subject to structural embankment integrity and dam release hydrographs.",
        "Authoritative evacuation directives must originate solely from District Disaster Management Authorities.",
    ]

    return RiskAssessmentResponse(
        riskScore=clamped_score,
        riskCategory=category,
        categoryLabel=label,
        colorHex=color,
        factors=RiskFactorBreakdown(
            rainfallScore=int(round(raw_rain_score)),
            rainfallContributionPct=35,
            riverScore=int(round(raw_river_score)),
            riverContributionPct=45,
            soilScore=int(round(raw_soil_score)),
            soilContributionPct=15,
            drainagePenalty=int(round(raw_drainage_score)),
        ),
        rationale=rationale,
        limitations=limitations,
        calculatedAt=datetime.now(timezone.utc).isoformat(),
        modelType="Hydrological-Rule-Engine-v1.4",
    )

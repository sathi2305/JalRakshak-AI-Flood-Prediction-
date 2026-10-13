import pytest
from fastapi.testclient import TestClient
from backend.app.main import app

client = TestClient(app)


def test_health_endpoint():
    response = client.get("/api/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert "service" in data


def test_dashboard_summary_endpoint():
    response = client.get("/api/dashboard/summary")
    assert response.status_code == 200
    data = response.json()
    assert "rainfall24h" in data
    assert "riverLevel" in data
    assert "floodRisk" in data
    assert "affectedAreas" in data
    assert data["rainfall24h"]["unit"] == "mm"
    assert data["riverLevel"]["current"] > 0


def test_alerts_filtering_endpoint():
    response = client.get("/api/alerts?severity=very-high")
    assert response.status_code == 200
    alerts = response.json()
    assert len(alerts) >= 1
    for a in alerts:
        assert a["severity"] == "very-high"


def test_risk_calculation_api():
    payload = {
        "rainfall24h": 160.0,
        "rainfallTrend": "rising",
        "riverLevel": 78.0,
        "dangerLevel": 76.0,
        "soilMoisturePct": 85.0,
        "drainageCapacityMmPerDay": 40.0,
    }
    response = client.post("/api/flood-risk/calculate", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["riskCategory"] in ["very-high", "high"]
    assert "factors" in data
    assert "rationale" in data

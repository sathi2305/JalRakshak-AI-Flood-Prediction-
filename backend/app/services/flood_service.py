from typing import List, Optional
from backend.app.schemas.flood import (
    DashboardSummaryResponse,
    RainfallSummary,
    RiverLevelSummary,
    FloodRiskSummary,
    AffectedAreasSummary,
    DistrictRiskModel,
    FloodAlertModel,
    DataSourceStatusModel,
    RecommendedActionModel,
)


class FloodDataService:
    def get_dashboard_summary(self) -> DashboardSummaryResponse:
        return DashboardSummaryResponse(
            rainfall24h=RainfallSummary(
                value=142.8,
                unit="mm",
                changePct=24.3,
                historicalAverage=114.9,
                latestObservation="10 mins ago",
            ),
            riverLevel=RiverLevelSummary(
                current=78.4,
                dangerMark=76.0,
                unit="m",
                gaugeStation="Pandu Station, Guwahati",
                river="Brahmaputra River",
                aboveDanger=2.4,
                latestObservation="5 mins ago",
            ),
            floodRisk=FloodRiskSummary(
                category="very-high",
                score=84,
                highRiskDistrictCount=18,
                assessmentTime="Live Automated Assessment",
            ),
            affectedAreas=AffectedAreasSummary(
                districtCount=18,
                riversExceedingDanger=4,
                activeReliefCamps=142,
                criteria="Districts exceeding composite risk index >= 65",
            ),
        )

    def get_districts(self) -> List[DistrictRiskModel]:
        return [
            DistrictRiskModel(
                id="d-1",
                name="Kamrup Metropolitan (Guwahati)",
                state="Assam",
                riverBasin="Brahmaputra Basin",
                rainfall24h=184.5,
                riverLevel=78.4,
                dangerLevel=76.0,
                riskScore=92,
                riskCategory="very-high",
                trend="rising",
                coordinates=[26.1445, 91.7362],
                populationAtRisk=420000,
                reliefCampsActive=38,
                lastUpdated="10 mins ago",
            ),
            DistrictRiskModel(
                id="d-2",
                name="Dibrugarh",
                state="Assam",
                riverBasin="Brahmaputra Basin",
                rainfall24h=198.2,
                riverLevel=106.8,
                dangerLevel=105.7,
                riskScore=89,
                riskCategory="very-high",
                trend="rising",
                coordinates=[27.4728, 94.912],
                populationAtRisk=280000,
                reliefCampsActive=24,
                lastUpdated="15 mins ago",
            ),
            DistrictRiskModel(
                id="d-4",
                name="Patna",
                state="Bihar",
                riverBasin="Ganga Basin",
                rainfall24h=135.4,
                riverLevel=50.8,
                dangerLevel=50.2,
                riskScore=78,
                riskCategory="high",
                trend="rising",
                coordinates=[25.5941, 85.1376],
                populationAtRisk=520000,
                reliefCampsActive=21,
                lastUpdated="8 mins ago",
            ),
            DistrictRiskModel(
                id="d-6",
                name="Wayanad",
                state="Kerala",
                riverBasin="Kabini / Cauvery Basin",
                rainfall24h=172.5,
                riverLevel=68.2,
                dangerLevel=67.5,
                riskScore=82,
                riskCategory="very-high",
                trend="rising",
                coordinates=[11.6854, 76.132],
                populationAtRisk=88000,
                reliefCampsActive=16,
                lastUpdated="14 mins ago",
            ),
        ]

    def get_district_by_id(self, district_id: str) -> Optional[DistrictRiskModel]:
        for d in self.get_districts():
            if d.id == district_id:
                return d
        return None

    def get_alerts(self, severity: Optional[str] = None) -> List[FloodAlertModel]:
        alerts = [
            FloodAlertModel(
                id="ALT-1092",
                severity="very-high",
                title="Severe Inundation Warning — Brahmaputra Overflow",
                location="Kamrup Metropolitan, Assam",
                description="Brahmaputra water level 2.4m above critical danger threshold (78.4m). Low-lying areas under threat.",
                riverBasin="Brahmaputra Basin",
                waterLevelAboveDanger=2.4,
                predictedRainfall18h=110.0,
                affectedDistricts=["Kamrup Metro", "Barpeta", "Nalbari"],
                broadcastTime="12 mins ago",
                source="CWC Telemetry & IMD AWS",
                status="active",
            ),
            FloodAlertModel(
                id="ALT-1090",
                severity="high",
                title="Ganga Rising Above Warning Mark",
                location="Digha Ghat, Patna, Bihar",
                description="Inflow accelerating crest. Dike patrolling intensified.",
                riverBasin="Ganga Basin",
                waterLevelAboveDanger=0.6,
                predictedRainfall18h=55.0,
                affectedDistricts=["Patna", "Vaishali"],
                broadcastTime="1 hour ago",
                source="Central Water Commission (CWC)",
                status="active",
            ),
        ]
        if severity:
            return [a for a in alerts if a.severity == severity]
        return alerts

    def get_alert_by_id(self, alert_id: str) -> Optional[FloodAlertModel]:
        for a in self.get_alerts():
            if a.id == alert_id:
                return a
        return None

    def get_data_sources(self) -> List[DataSourceStatusModel]:
        return [
            DataSourceStatusModel(
                id="src-1",
                name="India Meteorological Dept (IMD)",
                organization="Ministry of Earth Sciences, GoI",
                status="connected",
                latency="1.2m",
                lastSync="Just now",
                coverage="740+ Doppler Radars & AWS",
                dataType="Precipitation & Nowcasting",
            ),
            DataSourceStatusModel(
                id="src-2",
                name="Central Water Commission (CWC)",
                organization="Ministry of Jal Shakti, GoI",
                status="connected",
                latency="3.4m",
                lastSync="4 mins ago",
                coverage="1,280 River Gauge Stations",
                dataType="Hydrological Levels & Discharge",
            ),
        ]

    def get_recommendations(self) -> List[RecommendedActionModel]:
        return [
            RecommendedActionModel(
                id="act-1",
                priority=1,
                title="Immediate Evacuation of Riverine Lowlands",
                actionText="Execute phased relocation for residents in Pandu Ghat & Saraighat floodplains to identified school relief camps.",
                agency="Kamrup Metro DDMA & NDRF 1st Bn",
                targetArea="Guwahati Urban Flood Zone",
                contactNumber="1078 (National Helpline)",
                timestamp="Issued 25 mins ago",
            ),
            RecommendedActionModel(
                id="act-2",
                priority=2,
                title="Pre-positioning NDRF Motorized Rescue Boats",
                actionText="Station 14 inflatable motorized boats at Tezpur and Guwahati ghats.",
                agency="National Disaster Response Force (NDRF)",
                targetArea="Brahmaputra Lower Reach",
                contactNumber="0361-2237221",
                timestamp="Issued 1 hour ago",
            ),
        ]


flood_service = FloodDataService()

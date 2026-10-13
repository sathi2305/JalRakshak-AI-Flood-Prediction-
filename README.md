# JAI RAKSHAK — AI-Powered Flood Prediction & Early Warning System

> **Official Problem Statement:** AI-Powered Flood Prediction Tool  
> **Event:** Hack Era 1.0 by Erazone  
> **System Architecture:** React 19 + TypeScript + Vite + Tailwind CSS + Leaflet GIS + Python FastAPI + Hydrological Risk Engine

---

## 1. Executive Summary

**JAI RAKSHAK** ("Protector of the Waters") is an AI-powered flood surveillance, geospatial vulnerability assessment, and multi-agency early warning platform designed for India's monsoonal flood crisis.

By harmonizing precipitation telemetry from the **India Meteorological Department (IMD)**, river gauge and reservoir discharge telemetry from the **Central Water Commission (CWC)**, and high-resolution satellite raster observations from **NASA GPM & ISRO Bhuvan**, Jai Rakshak provides automated, transparent decision support for the **National Disaster Response Force (NDRF)** and State Disaster Management Authorities (SDMA).

---

## 2. Key Capabilities & Features

1. **Pixel-Perfect Authoritative Command Dashboard**
   - Dark navy command header (`#10294B`) with official emblem, NDRF 24x7 emergency hotline badge, and unread critical alert indicator.
   - 4 High-Density Key Performance Indicator (KPI) cards:
     - **Total Rainfall (24h):** Real-time cumulative precipitation vs historical norm.
     - **River Water Level:** Real-time gauge vs official Danger Threshold.
     - **Flood Risk Level:** Composite hydrological vulnerability score (0–100).
     - **Affected Areas:** Monitored districts and rivers breaching safety marks.

2. **Interactive India Geospatial Flood-Risk Map**
   - Real interactive Leaflet GIS map centered on India.
   - Dynamic risk markers with color coding:
     - 🔴 **Very High Risk** (`#F5222D`)
     - 🟠 **High Risk** (`#FF9418`)
     - 🟡 **Moderate Risk** (`#FFD52A`)
     - 🟢 **Low Risk** (`#16B83F`)
   - Interactive popups, risk radius buffers, quick district locator, and basin filters (Brahmaputra, Ganga, Yamuna, Godavari, Mahanadi, Tapi, Cauvery).

3. **Dual-Telemetry Trend Chart**
   - Synchronized dual-axis visualization showing **Rainfall (blue bars)** and **River Level (purple line)** alongside the red dashed **Danger Mark (76.0m)**.
   - 24-hour and 7-day retrospective analysis.

4. **Transparent Hydrological Risk Engine**
   - Multi-factor deterministic scoring without black-box hallucination:
     - **River Gauge Breach:** 45% Weight
     - **24h Precipitation Intensity:** 35% Weight
     - **Antecedent Soil Moisture Saturation:** 15% Weight
     - **Catchment Drainage Deficit:** 5% Weight
   - Interactive parameter sandbox allowing disaster managers to simulate what-if storm surges.

5. **Common Alerting Protocol (CAP) Emergency Broadcaster**
   - Simulated geofenced SMS and Cell Broadcast dissemination for impacted subdivisions.

6. **Automated Situation Report (SITREP) Generator**
   - Generates official vulnerability briefings with one-click **CSV Data Export** and **Print-Ready Dossiers**.

---

## 3. Windows Setup & Run Instructions (Beginner-Friendly PowerShell)

### Prerequisites
- [Node.js](https://nodejs.org/) (version 18 or 20 LTS recommended)
- [Python](https://www.python.org/downloads/) (version 3.10+ recommended)
- Git for Windows

### Step 1: Open PowerShell in the Project Root
```powershell
# Verify versions
node --version
npm --version
python --version
```

### Step 2: Frontend Installation & Startup
```powershell
# 1. Install frontend dependencies
npm install

# 2. Launch the Vite development server (runs on Port 3000)
npm run dev
```
Open your browser at `http://localhost:3000`.

### Step 3: Python Backend Installation & Startup (Optional)
```powershell
# 1. Navigate to the backend directory
cd backend

# 2. Create a virtual environment
python -m venv venv

# 3. Activate the virtual environment
.\venv\Scripts\Activate.ps1

# 4. Install backend dependencies
pip install -r requirements.txt

# 5. Launch the FastAPI server
uvicorn backend.app.main:app --reload --port 8000
```
API Documentation will be live at `http://localhost:8000/docs`.

### Step 4: Run Automated Tests
```powershell
# Frontend TypeScript check
npm run lint

# Backend pytest execution
pytest backend/tests/
```

---

## 4. API Endpoints Reference

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Service health status & telemetry health |
| `GET` | `/api/dashboard/summary` | Consolidated 4-card KPI summary & latest timestamps |
| `GET` | `/api/weather/current` | Current IMD AWS rainfall observations |
| `GET` | `/api/weather/history` | Historical 7-day catchment precipitation |
| `GET` | `/api/river-levels` | CWC river gauge stations & danger thresholds |
| `GET` | `/api/flood-risk` | Active composite vulnerability index |
| `POST` | `/api/flood-risk/calculate` | Run transparent risk score engine on custom inputs |
| `GET` | `/api/alerts` | Multi-agency warning bulletins (filter by severity) |
| `GET` | `/api/districts/risk` | Full district table with GIS coordinates & trends |
| `GET` | `/api/data-sources/status` | Ingestion status for IMD, CWC, NASA GPM & ISRO |
| `GET` | `/api/recommendations` | Standard Operating Protocols (SOPs) & helplines |

---

## 5. Hack Era 1.0 — Six-Slide Presentation Outline

- **Slide 1: Title & Vision**
  - *Title:* JAI RAKSHAK: AI-Powered Flood Prediction & Early Warning System
  - *Subtitle:* Monsoonal flood resilience through unified hydrological intelligence
  - *Team:* Hack Era 1.0 Finalists · Track: AI-Powered Flood Prediction Tool
  - *Key takeaway:* Reducing flood loss of life through sub-hourly telemetry convergence.

- **Slide 2: The Core Problem**
  - India suffers annual monsoonal flood damages exceeding ₹10,000 Crores.
  - Data siloing: Weather forecasts (IMD), river gauges (CWC), and satellite maps (ISRO) are traditionally segmented across separate portals.
  - Lack of transparent early warnings: Communities receive flood notices only after water reaches settlement perimeters.

- **Slide 3: Technical Innovation & Architecture**
  - Unified multi-source telemetry adapter layer.
  - Deterministic hydrological risk scoring (Rainfall 35%, Gauge Breach 45%, Soil Saturation 15%, Drainage Deficit 5%).
  - Real interactive Leaflet GIS visualization with zero mock images.

- **Slide 4: Live Command Operations & Demonstration**
  - Exact reference command dashboard matching NDRF field operational workflows.
  - Interactive "What-If" storm surge simulation sandbox.
  - CAP-compliant alert broadcasting to notify vulnerable panchayats in < 60 seconds.

- **Slide 5: Impact & Real-World Feasibility**
  - Covers 8 major Indian river basins (Brahmaputra, Ganga, Yamuna, Godavari, Krishna, Mahanadi, Tapi, Cauvery).
  - Open data compliance: Designed to consume published open APIs without private cloud vendor lock-in.
  - Accessible via low-bandwidth devices.

- **Slide 6: Roadmap & Scale**
  - Phase 1 (Completed): Unified dashboard, deterministic risk engine, Leaflet GIS, and FastAPI backend.
  - Phase 2: Incorporation of hydrodynamic 2D HEC-RAS flood inundation modeling.
  - Phase 3: Offline PWA integration and hyper-local vernacular SMS dispatch in Hindi, Assamese, Bengali, and Malayalam.

---

## 6. Demonstration Video Script (2-Minute Pitch)

- **[0:00 - 0:20] The Hook & Mission**
  *(Camera on Jai Rakshak Dashboard)*
  "Every monsoon, rising waters in the Brahmaputra and Ganga basins displace millions. Traditional disaster response struggles with fragmented telemetry. Today, we present **Jai Rakshak** — a unified AI-powered early warning command system for Hack Era 1.0."

- **[0:20 - 0:45] The Command Dashboard**
  *(Cursor moves across KPI cards)*
  "Our central dashboard gives disaster commanders four immediate KPI metrics: 24-hour cumulative rainfall, river water levels relative to official danger thresholds, the composite flood risk index, and the count of vulnerable districts."

- **[0:45 - 1:15] Interactive Geospatial Surveillance & Trends**
  *(Demonstrates zooming in on Kamrup Metro and clicking station pin)*
  "On the interactive India map, station pins pulse based on severity. Clicking on Kamrup Metro in Guwahati instantly updates our dual-series trend chart, correlating rising rainfall bars with river gauge breaches above the 76-meter danger mark."

- **[1:15 - 1:40] Transparent Risk Engine Sandbox**
  *(Navigates to Risk Analysis view, moves sliders)*
  "Unlike opaque black boxes, Jai Rakshak features a transparent, deterministic hydrological engine. Managers can adjust rainfall, river height, or soil saturation in real time to simulate impending storm surges and inspect contributing factor weights."

- **[1:40 - 2:00] Rapid Action & Official Integration**
  *(Shows alert dispatch modal and CSV SITREP export)*
  "When an emergency threshold is breached, commanders can dispatch CAP-compliant SMS alerts and export standardized Situation Reports for NDMA. Jai Rakshak turns raw telemetry into life-saving preparedness."

---

## 7. Instructions for Creating a Lightweight Submission ZIP (< 50 MB)

Run this PowerShell command in the project directory:

```powershell
# Exclude heavy folders (node_modules, virtual envs, build artifacts)
$exclude = @("node_modules", "dist", "venv", ".git", ".aistudio")
Get-ChildItem -Path . -Exclude $exclude | Compress-Archive -DestinationPath "Jai_Rakshak_Submission.zip"
```
The resulting archive will be **under 5 MB**, well below the 50 MB hackathon limit!

---

## 8. Safety & Data Integrity Disclaimer

*Jai Rakshak is an engineering prototype developed for Hack Era 1.0 by Erazone. In actual emergency scenarios, evacuation orders and disaster relief instructions must strictly originate from verified local District Magistrates, the National Disaster Management Authority (NDMA), and the Central Water Commission (CWC).*

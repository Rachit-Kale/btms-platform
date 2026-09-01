# Product Requirements Document (PRD)
## AI-Enabled Micro-channel Battery Thermal Management System (BTMS) — Web Platform

| Field | Detail |
|---|---|
| Use Case Reference | KJS-CES-02 |
| Document Owner | Product / Engineering Team |
| Source | Somaiya Vidyavihar University — Framework for AI Use Case Integration in Curriculum Delivery |
| Target Stack | MERN (MongoDB, Express.js, React with JSX, Node.js) |
| Page Count | 5 |
| Version | 1.0 |
| Date | August 19, 2026 |

---

## 1. Purpose & Background

Lithium-ion battery packs in EVs generate significant heat during charge/discharge cycles. Non-uniform thermal distribution reduces battery life, efficiency, and safety, and can trigger thermal runaway. The underlying research (KJS-CES-02) developed a **micro-channel heat exchanger BTMS** using Al₂O₃/water nanofluids, combined with **CFD simulation, machine learning prediction, and a digital twin**, to keep 21700 cylindrical cell packs within safe operating temperatures while minimizing pumping power.

This PRD translates that research use case into a **web application** that lets engineers, researchers, and students visualize, monitor, and interact with the BTMS concept: ingesting sensor/simulation data, displaying AI-driven thermal predictions, running "what-if" optimization, and reviewing a digital twin of the battery pack.

Because a production vehicle deployment is out of scope for a demo/education-oriented website, the platform will operate on **simulated/replayed sensor data and a lightweight surrogate ML model** trained offline on CFD-generated data, with an architecture that supports later replacement with real hardware feeds.

---

## 2. Goals & Success Metrics

**Primary goals**
1. Provide an intuitive dashboard that visualizes real-time (simulated) battery thermal behavior across the 10-cell pack.
2. Surface AI-based predictions (max temperature, hotspot cells, thermal gradient) with confidence indicators.
3. Let users run coolant-parameter optimization ("what-if" scenarios: flow rate, Reynolds number, nanofluid concentration) and see predicted outcomes.
4. Present a digital-twin visualization synced with the simulated sensor stream.
5. Provide a reports/analytics view for historical trends, model validation (predicted vs. CFD/experimental), and exportable reports.

**Success metrics**
- Dashboard updates within 1–2s of new simulated sensor tick (near real-time feel).
- AI prediction panel returns a result in < 500 ms (simulated inference).
- Users can complete an optimization scenario (select params → get recommendation) in ≤ 3 clicks.
- Model validation view shows prediction error (MAE/RMSE) trending, refreshed per dataset upload.
- Positive usability feedback from thermal engineering / academic stakeholders (qualitative, via pilot review).

---

## 3. Target Users / Personas

| Persona | Needs |
|---|---|
| **Thermal/Battery Engineer** | Monitor cell temps, review AI hotspot predictions, validate against CFD, human-in-the-loop approval of cooling recommendations. |
| **Researcher / Academic (AI&DS, Mechanical)** | Explore CFD dataset, inspect model accuracy, run optimization experiments for coursework/research. |
| **Student (Lab/CA/IA use)** | Interact with a simplified agent-based BTMS demo (maps to "Artificial Intelligence" course module: intelligent agents, PEAS). |
| **EV Manufacturer / Industry Stakeholder** | High-level view of expected outcomes, safety indicators, sustainability metrics. |

---

## 4. Scope

**In scope (v1 website)**
- 5-page React SPA with simulated real-time data, AI prediction service (mock/lightweight model), digital twin visualization, historical reports.
- MERN backend to store sensor readings, prediction logs, optimization runs, and validation datasets.
- Role-agnostic single login tier (or no-auth demo mode) — see Section 9.

**Out of scope (v1)**
- Real hardware/sensor integration (design allows for it later).
- Full ANSYS Fluent CFD execution inside the app (CFD results are pre-generated and uploaded/imported as datasets).
- Production-grade ML training pipeline (training happens offline; app only serves inference).
- ISO 26262 certification / real vehicle BMS integration.

---

## 5. Information Architecture — 5 Pages

```
1. Home / Overview
2. Live Monitoring Dashboard
3. AI Prediction & Optimization
4. Digital Twin & CFD Explorer
5. Reports, Validation & Analytics
```

Global elements: persistent top navbar (5 tabs + logo), safety-status banner (green/amber/red), footer with use-case attribution.

---

### Page 1 — Home / Overview

**Purpose:** Orient the user, explain the system, and route to the right page.

**Sections & Components**
- Hero banner: title, one-line problem statement, "Enter Dashboard" CTA.
- Problem Statement card (from use case §6).
- System architecture diagram (Sensors → Preprocessing → AI Prediction → Digital Twin → Optimization → Cooling Control → Dashboard), built as an interactive SVG/React diagram component.
- "Battery Pack Geometry" schematic (10× 21700 cells, 20 microchannels/column, Dh = 1mm) — static/interactive SVG matching Fig. 1.
- Objectives list (5 objectives from use case §8).
- Key stat tiles: `ΔT target < 5°C`, `Operating range 15–45°C`, `Reynolds 400–700`, `Cells: 10`.
- Link cards to the other 4 pages.

**Data needs:** Static content (JSON config), no live data required.

---

### Page 2 — Live Monitoring Dashboard

**Purpose:** Real-time (simulated) view of pack thermal & flow status — the primary operational screen.

**Sections & Components**
- Safety status banner (derived from max cell temp vs. thresholds).
- Cell grid (10 cells, C1–C10) as a heatmap component — color-coded by current temperature, click a cell to see its time-series.
- Line charts (Recharts): Battery temperature, coolant inlet/outlet temperature (T_c1/T_c2), pressure (P1/P2), flow rate, voltage, current — multi-series, live-updating.
- Current readings summary table (latest values per sensor).
- Anomaly/alert feed (list of flagged anomalies from Data Preprocessing stage, e.g., sudden ΔT spike, sensor dropout).
- Time-range selector (Live / Last 1h / Last 24h / Custom).

**Data needs:** `GET /api/telemetry/live` (WebSocket or polling), `GET /api/telemetry/history?range=`.

**Data source (v1):** A Node.js simulator service replays/generates CFD-informed synthetic telemetry via cron/interval job, pushed over Socket.IO.

---

### Page 3 — AI Prediction & Optimization

**Purpose:** Show ML-based thermal prediction and let users run coolant optimization scenarios ("what-if" analysis) — maps to Stage 4 (AI/ML Integration) and Step 6 (Optimization Engine).

**Sections & Components**
- Prediction panel: given current/selected operating conditions, model outputs — predicted max battery temperature, predicted hotspot cell(s), predicted thermal gradient, confidence/uncertainty band.
- Explainability panel: feature-importance bar chart (e.g., flow rate, inlet temp, nanoparticle concentration, discharge current) — supports the "Responsible AI / explainable recommendations" governance requirement.
- Optimization form (interactive controls): sliders/inputs for coolant flow rate, Reynolds number (400–700), nanofluid (Al₂O₃) concentration, inlet coolant temperature.
- "Run Optimization" → recommendation card: optimal parameter set, predicted ΔT, predicted pumping power, trade-off chart (heat transfer vs. pressure drop).
- Human-in-the-loop control: "Approve" / "Reject" button before a recommendation is (simulated to be) applied to the cooling control step — logs engineer decision.
- Agent view (optional, education-focused): simplified PEAS (Performance, Environment, Actuators, Sensors) panel describing the cooling-control agent, tying to the IT course "Artificial Intelligence" module mapping.

**Data needs:**
- `POST /api/predict` → `{ maxTemp, hotspotCells[], gradient, confidence }`
- `POST /api/optimize` → `{ recommendedFlowRate, recommendedReynolds, recommendedConcentration, predictedDeltaT, predictedPumpingPower }`
- `POST /api/decisions` (store human-in-the-loop approvals)

**Model note:** v1 backend serves a lightweight regression/gradient-boosted surrogate model (trained offline on the CFD dataset, Reynolds 400–700) exposed via a Python microservice or a Node-native inference (e.g., ONNX Runtime) behind `/api/predict`.

---

### Page 4 — Digital Twin & CFD Explorer

**Purpose:** Visual, explorable representation of the physical battery pack + cooling system, and access to the CFD performance database — maps to Stage 2, Stage 5.

**Sections & Components**
- 3D/2D battery pack visualizer (Three.js or styled SVG cross-section) showing 10 cells + microchannel casing, color-mapped to live or historical temperature.
- Loop schematic (matches Fig. 2): expansion device → condenser → compressor → evaporator → coolant tanks → battery pack w/ microchannel HX → FCV/pump — interactive, hoverable nodes showing T_c1, T_c2, P1, P2.
- CFD dataset browser: filter by Reynolds number, coolant flow rate, microchannel geometry, inlet temperature, nanoparticle concentration; view resulting heat-transfer coefficient / pressure drop / temperature distribution (table + chart).
- "Sync status" indicator: shows last synchronization time between simulated sensors and digital twin model.
- Remaining-useful-life / predictive-maintenance widget (simple estimated indicator based on cumulative cycles + thermal stress, per use case Digital Twin outputs).

**Data needs:** `GET /api/cfd-dataset?reynolds=&flowRate=&geometry=&concentration=`, `GET /api/twin/sync-status`.

---

### Page 5 — Reports, Validation & Analytics

**Purpose:** Historical analytics, model validation vs. experiment/CFD, exportable reports — maps to Stage 6 (Experimental Validation), governance "Model Validation & Reliability".

**Sections & Components**
- Model validation chart: predicted vs. actual/CFD temperature scatter + MAE/RMSE trend over time (retraining checkpoints).
- Historical KPI trend cards: avg. max temp, ΔT uniformity, coolant consumption, energy consumption, thermal-runaway alert count — over selectable period.
- Nanofluid performance summary table (best concentration, max heat-transfer coefficient, min pumping power — per use case Expected Output "e").
- Report generator: select date range + metrics → generate downloadable PDF/CSV report (uses Node service, e.g., `pdfkit`).
- Governance/audit log: list of human-in-the-loop approvals/rejections (from Page 3) with timestamps and engineer notes, for traceability/compliance (ISO 26262-aligned documentation trail).
- Sustainability panel: estimated energy savings / emissions-reduction proxy from optimized cooling vs. baseline.

**Data needs:** `GET /api/analytics/kpis`, `GET /api/validation/history`, `GET /api/audit-log`, `POST /api/reports/generate`.

---

## 6. Functional Requirements Summary

| # | Requirement | Priority |
|---|---|---|
| FR1 | Display simulated live telemetry for 10 cells + coolant loop, updating ≤2s latency | Must |
| FR2 | Heatmap visualization of per-cell temperature | Must |
| FR3 | AI prediction endpoint returns max temp, hotspot cells, gradient, confidence | Must |
| FR4 | Optimization engine returns recommended coolant params + trade-off data | Must |
| FR5 | Human-in-the-loop approval workflow for AI recommendations, logged | Must |
| FR6 | Digital twin visualization synced to telemetry state | Should |
| FR7 | CFD dataset browsing/filtering | Should |
| FR8 | Historical analytics & KPI dashboards | Must |
| FR9 | Model validation (predicted vs. actual) view | Should |
| FR10 | Exportable PDF/CSV reports | Could |
| FR11 | Anomaly/alert detection & feed | Should |
| FR12 | Safety status banner (green/amber/red thresholds) | Must |

---

## 7. Non-Functional Requirements

- **Performance:** Dashboard charts render smoothly with ≥1000 buffered data points (windowed/virtualized rendering); API p95 latency < 300 ms.
- **Scalability:** Backend supports multiple simulated "battery pack" instances (multi-tenant ready) for future scale-up per Operational Challenge (j) Scalability.
- **Security & Privacy:** Controlled access to research datasets/industrial data (role-based access in v2); TLS for all API traffic; sensor/simulation data encrypted at rest in MongoDB.
- **Reliability:** Graceful handling of simulated sensor dropout (matches Operational Challenge (d) Sensor Accuracy/Reliability) — UI shows "stale data" indicator.
- **Explainability:** Every AI recommendation must display contributing factors (Responsible AI governance requirement).
- **Auditability:** All optimization runs and human decisions are logged immutably (append-only collection) for regulatory traceability.
- **Accessibility:** WCAG 2.1 AA — color-blind-safe heatmap palette (avoid pure red/green only), keyboard-navigable controls.
- **Responsiveness:** Desktop-first (engineering dashboard), tablet-friendly; mobile view degrades to summary cards.

---

## 8. Technical Architecture (MERN)

```
┌────────────────────────┐        WebSocket/HTTP        ┌──────────────────────────┐
│  React (JSX) Frontend  │ <───────────────────────────> │  Node.js + Express API   │
│  - 5 route pages       │                                │  - REST endpoints        │
│  - Recharts / SVG /    │                                │  - Socket.IO server      │
│    Three.js visuals    │                                │  - Auth middleware       │
│  - React Query/Context │                                │  - Prediction service    │
└────────────────────────┘                                │    (calls model service) │
                                                            └──────────┬───────────────┘
                                                                       │
                                                       ┌───────────────┴───────────────┐
                                                       │                                │
                                             ┌─────────▼─────────┐          ┌──────────▼───────────┐
                                             │  MongoDB (Atlas)   │          │  ML Inference Service │
                                             │  - telemetry        │          │  (Python/Flask or     │
                                             │  - predictions       │          │  ONNX via Node)       │
                                             │  - optimization_runs │          │  Offline-trained on   │
                                             │  - cfd_dataset        │          │  CFD dataset          │
                                             │  - decisions/audit    │          └───────────────────────┘
                                             │  - reports            │
                                             └────────────────────────┘
```

**Frontend**
- React 18 + JSX, React Router (5 routes), Context/Redux Toolkit for global telemetry state.
- Charting: Recharts (time series, scatter for validation). 3D/visual: Three.js (or React Three Fiber) or hand-built SVG for the pack cross-section.
- Real-time: Socket.IO-client subscribing to telemetry channel.
- Styling: Tailwind CSS (utility-first, matches modern dashboard aesthetics).

**Backend**
- Node.js + Express REST API; Socket.IO server for live push.
- Telemetry Simulator service (interval job) generating physically-plausible synthetic readings seeded from the CFD dataset ranges (Re 400–700, 15–45 °C range, etc.).
- Prediction Service: thin Express controller calling either (a) an embedded lightweight JS model (e.g., regression coefficients exported from offline training) or (b) a Python microservice via internal HTTP for a more complex model (e.g., scikit-learn/XGBoost).
- Report generation via `pdfkit`/`csv-writer`.

**Database (MongoDB) — core collections**

| Collection | Key Fields |
|---|---|
| `telemetry` | timestamp, cellId, cellTemp, coolantInTemp, coolantOutTemp, pressureIn, pressureOut, flowRate, voltage, current |
| `predictions` | timestamp, inputSnapshot, maxTempPred, hotspotCells[], gradient, confidence, modelVersion |
| `optimizationRuns` | timestamp, inputParams{flowRate, reynolds, concentration, inletTemp}, recommendedParams, predictedDeltaT, predictedPumpingPower |
| `decisions` | timestamp, optimizationRunId, engineerId, decision(approve/reject), notes |
| `cfdDataset` | reynolds, flowRate, geometryId, inletTemp, concentration, heatTransferCoeff, pressureDrop, tempDistribution |
| `validationRecords` | timestamp, predictedTemp, actualTemp(CFD/experimental), error, modelVersion |
| `reports` | timestamp, rangeStart, rangeEnd, metrics[], fileUrl |

**Deployment**
- Frontend: static build served via CDN or Node/Express static hosting.
- Backend: containerized (Docker) Node service; MongoDB Atlas managed cluster.
- CI/CD: GitHub Actions → build/test → deploy.

---

## 9. Authentication & Roles (v1 lightweight)

- v1: single "demo" access mode (no login) for academic/demo use, OR simple JWT-based login (Engineer / Student / Admin) if pilot requires per-persona access.
- v2 (future): RBAC — Engineer (full access + approvals), Student/Researcher (read + optimization sandbox, no approval rights), Admin (dataset upload, model version management).

---

## 10. Governance & Responsible-AI Alignment (mapped from use case §13)

| Governance Area | How the Website Addresses It |
|---|---|
| AI Security & Trustworthiness | Validation page compares predictions vs. CFD/experimental; model accuracy thresholds shown before any recommendation is highlighted as "reliable". |
| Responsible AI | Explainability panel on Page 3 (feature importance) for every recommendation. |
| Human-in-the-Loop | Mandatory Approve/Reject step before an optimization recommendation is logged as "applied". |
| Model Validation & Reliability | Dedicated validation view (Page 5) with MAE/RMSE trend and retraining checkpoints. |
| Digital Twin Governance | Sync-status indicator on Page 4 shows time since last sensor↔twin sync. |
| Privacy & Data Protection | TLS, encrypted-at-rest storage, access controls for datasets. |
| Sustainability & Environmental Impact | KPI cards for coolant/energy consumption savings on Page 5. |

---

## 11. Milestones (Suggested)

| Phase | Deliverable | Duration |
|---|---|---|
| 1 | Repo scaffold (MERN), design system, Page 1 (Home) | 1 week |
| 2 | Telemetry simulator + Page 2 (Live Dashboard) with Socket.IO | 2 weeks |
| 3 | Offline model training + `/api/predict` + `/api/optimize` + Page 3 | 2 weeks |
| 4 | Digital twin visualization + CFD dataset import + Page 4 | 2 weeks |
| 5 | Analytics, validation, reports + Page 5 | 1.5 weeks |
| 6 | QA, accessibility pass, deployment | 1 week |

---

## 12. Risks & Mitigations (mapped from use case Operational Challenges)

| Risk | Mitigation |
|---|---|
| Simulated data diverges from real physical behavior | Seed simulator strictly from CFD dataset ranges (Re 400–700, 15–45°C); label all data as "simulated" in UI. |
| Model overfits to lab-like synthetic data (generalization) | Track prediction error over time on Page 5; support periodic retraining upload. |
| Users over-trust AI recommendations | Enforce human-in-the-loop approval gate; show confidence bands, not just point predictions. |
| Scalability to multiple packs/vehicles | Design telemetry schema with `packId`/`vehicleId` from day one. |
| Data security for industrial partner datasets | RBAC + encrypted storage roadmap (Section 9). |

---

## 13. Open Questions

1. Should Page 3's ML model be a real trained model (needs CFD dataset export) or a rule-based mock for v1?
2. Is authentication required for the pilot, or is a public demo acceptable?
3. Should the digital twin be full 3D (Three.js) or a stylized 2D schematic for v1 (faster to build, still informative)?
4. Who supplies the CFD dataset export (CSV/JSON) for seeding `cfdDataset` and training the surrogate model?

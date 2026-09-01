# Comprehensive System Documentation
## AI-Enabled Micro-Channel Battery Thermal Management System (BTMS) — Web Platform

**Use Case Reference:** KJS-CES-02  
**Institution:** Somaiya Vidyavihar University — Framework for AI Use Case Integration in Curriculum Delivery  
**Target Architecture:** Full-Stack MERN (Node.js, Express, React with Vite & Tailwind CSS, Socket.IO, Three.js, Recharts, Framer Motion)

---

## 📑 Table of Contents
1. [Executive Summary & System Purpose](#1-executive-summary--system-purpose)
2. [High-Level Architecture & Data Flow](#2-high-level-architecture--data-flow)
3. [File Tree & Directory Layout](#3-file-tree--directory-layout)
4. [Deep Dive File-by-File Documentation (What, Where, Why, How)](#4-deep-dive-file-by-file-documentation)
   - [A. Root Files](#a-root-files)
   - [B. Backend (`/server`) Files](#b-backend-server-files)
   - [C. Frontend Configuration & Setup (`/client`)](#c-frontend-configuration--setup-client)
   - [D. Frontend State & Context (`/client/src/context`)](#d-frontend-state--context)
   - [E. Frontend Reusable Components (`/client/src/components`)](#e-frontend-reusable-components)
   - [F. Frontend Pages (`/client/src/pages`)](#f-frontend-pages)
5. [Operational Guide: Running & Testing](#5-operational-guide-running--testing)
6. [Governance, Safety & Responsible AI](#6-governance-safety--responsible-ai)

---

## 1. Executive Summary & System Purpose

High-discharge lithium-ion battery packs (such as $10\times 21700$ cylindrical cells) generate significant localized heat during rapid charge/discharge cycles. Without active cooling, temperature gradients ($\Delta T > 5^\circ\text{C}$) and peak temperatures ($T_{max} > 35^\circ\text{C}$) degrade battery cycle life and risk triggering catastrophic thermal runaway.

This platform implements an **AI-enabled cyber-physical thermal management platform**:
- Utilizes an **$\text{Al}_2\text{O}_3$/water nanofluid micro-channel heat exchanger** ($D_h = 1.0\,\text{mm}$, 20 channels/column).
- Operates a **physics-calibrated Machine Learning surrogate model** trained on ANSYS Fluent CFD simulation data (Reynolds 400–700).
- Runs **real-time Socket.IO telemetry streaming** across 10 cylindrical cells and 6 flow transducers.
- Executes **multi-objective Pareto optimization** balancing heat transfer enhancement against parasitic auxiliary pumping power.
- Delivers an interactive **3D Three.js Digital Twin**, **2D refrigeration cycle schematic**, and an **ISO 26262-compliant Human-in-the-Loop audit logging system**.

---

## 2. High-Level Architecture & Data Flow

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                                 CLIENT (React 18 + Vite)                               │
│                                                                                        │
│  ┌───────────────────────┐   ┌───────────────────────────┐   ┌──────────────────────┐  │
│  │ Top Header Navbar     │   │ Dynamic Safety Alert Bar  │   │ Floating Bottom Dock │  │
│  └───────────────────────┘   └───────────────────────────┘   └──────────────────────┘  │
│                                                                                        │
│  ┌────────────────────┬────────────────────┬────────────────────────────────────────┐  │
│  │ 1. Home / Overview │ 2. Live Monitoring │ 3. AI Prediction & Optimization        │  │
│  ├────────────────────┴────────────────────┼────────────────────────────────────────┤  │
│  │ 4. Digital Twin & CFD Explorer          │ 5. Reports, Validation & Audit Trail   │  │
│  └─────────────────────────────────────────┴────────────────────────────────────────┘  │
│                                      ▲                                                 │
└──────────────────────────────────────┼─────────────────────────────────────────────────┘
                                       │ WebSocket (Socket.IO) & HTTP REST
┌──────────────────────────────────────▼─────────────────────────────────────────────────┐
│                               BACKEND (Node.js + Express)                              │
│                                                                                        │
│  ┌─────────────────────────┐  ┌──────────────────────────┐  ┌───────────────────────┐  │
│  │  Telemetry Simulator    │  │  ML Surrogate Inference  │  │  Pareto Optimizer     │  │
│  │  (10 Cells + Loop T/P)  │  │  (XGBoost / Regression)  │  │  (Min ΔT vs Pump W)   │  │
│  └─────────────────────────┘  └──────────────────────────┘  └───────────────────────┘  │
│  ┌─────────────────────────┐  ┌──────────────────────────┐  ┌───────────────────────┐  │
│  │  CFD Physics Database   │  │  Report Generator        │  │  Immutable Audit Log  │  │
│  │  (Re 400-700, Al2O3)    │  │  (PDFKit / CSV Writer)   │  │  (Human-in-the-Loop)  │  │
│  └─────────────────────────┘  └──────────────────────────┘  └───────────────────────┘  │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 3. File Tree & Directory Layout

```
Battery Thermal Management System/
├── BTMS_Website_PRD.md                  # Product Requirements Document (PRD)
├── DOCUMENTATION.md                     # Comprehensive Master Documentation (This file)
│
├── server/                              # Node.js + Express Backend
│   ├── package.json                     # Server dependencies & scripts
│   └── src/
│       ├── server.js                    # Express + Socket.IO server entrypoint
│       ├── physics/
│       │   └── cfdData.js               # Physics-informed CFD dataset (Re 400-700, 0-5% Al2O3)
│       ├── routes/
│       │   └── api.js                   # REST API routes for telemetry, ML, optimization, reports
│       └── services/
│           ├── mlSurrogate.js           # ML surrogate inference & SHAP explainability
│           ├── optimizer.js             # Multi-objective Pareto optimization engine
│           ├── simulator.js             # Real-time 10-cell telemetry & anomaly generator
│           └── reportService.js         # PDFKit report & CSV export generator
│
└── client/                              # Modern React 18 + Vite Frontend
    ├── package.json                     # Frontend dependencies (React, Three.js, Recharts, Framer)
    ├── vite.config.js                   # Vite configuration with proxy to backend port 5000
    ├── tailwind.config.js               # Tailwind CSS theme (Neon Lime & Matte Black Bento)
    ├── postcss.config.js                # PostCSS setup
    ├── index.html                       # HTML5 entry with Plus Jakarta Sans & JetBrains Mono
    └── src/
        ├── main.jsx                     # React DOM root render
        ├── App.jsx                      # Main layout, routing state, top header, bottom dock
        ├── index.css                    # Bento grid utilities, custom scrollbars, neon lime theme
        ├── context/
        │   └── TelemetryContext.jsx     # Global Socket.IO state, live buffer & config dispatch
        ├── components/
        │   ├── Navbar.jsx               # Top header bar (stats, status, controls) + bottom dock mount
        │   ├── Dock.jsx                 # React Bits Dock with framer-motion magnification physics
        │   ├── SafetyBanner.jsx         # Dynamic thermal gradient and runaway safety alert bar
        │   ├── Footer.jsx               # Matte black footer with watermark & academic attribution
        │   ├── Twin3DCanvas.jsx         # Three.js 3D cylindrical pack visualizer & particle stream
        │   └── RefrigerationLoopSvg.jsx # Interactive 2D refrigeration & nanofluid loop (Fig. 2)
        └── pages/
            ├── Home.jsx                 # Page 1: Overview, stat tiles, architecture, geometry
            ├── Dashboard.jsx            # Page 2: 10-cell heatmap, multi-series charts, sensor table
            ├── AIPrediction.jsx         # Page 3: ML surrogate sandbox, SHAP chart, Pareto HITL
            ├── DigitalTwin.jsx          # Page 4: 3D visualizer, loop schematic, CFD dataset filter
            └── ReportsAnalytics.jsx     # Page 5: Model validation scatter, PDF/CSV download, audit log
```

---

## 4. Deep Dive File-by-File Documentation

---

### A. Root Files

#### 1. `BTMS_Website_PRD.md`
- **What:** Product Requirements Document defining the functional, technical, and governance requirements of the BTMS web platform.
- **Where:** `BTMS_Website_PRD.md` (Project root)
- **Why:** Serves as the single source of truth for research integration (KJS-CES-02), specifying cell dimensions, flow parameters, 5-page information architecture, and ISO 26262 compliance.
- **How:** Read by engineering teams and AI pair programmers to guide system specifications, API contracts, and milestone execution.

#### 2. `DOCUMENTATION.md`
- **What:** The comprehensive master architectural and operational documentation for the entire project.
- **Where:** `DOCUMENTATION.md` (Project root)
- **Why:** Explains the purpose, location, reasoning, and inner mechanics of every file across backend and frontend for developers, students, and researchers.
- **How:** Organizes the system into structured sections with code explanations and run instructions.

---

### B. Backend (`/server`) Files

#### 1. `server/package.json`
- **What:** Node.js package definition declaring backend scripts and runtime dependencies.
- **Where:** `server/package.json`
- **Why:** Manages libraries: `express` (REST server), `socket.io` (real-time telemetry websocket), `cors` (cross-origin resource sharing), `pdfkit` (PDF generation), and `dotenv`.
- **How:** Run via `npm install` and started with `npm start` (`node src/server.js`) or `npm run dev` (`nodemon src/server.js`).

#### 2. `server/src/server.js`
- **What:** Main backend server entry point initializing Express, HTTP server, and Socket.IO.
- **Where:** `server/src/server.js`
- **Why:** Centralizes HTTP and WebSocket listeners on a single port (5000) and mounts the API router and Telemetry Simulator.
- **How:**
  ```javascript
  const app = express();
  const server = http.createServer(app);
  const io = new Server(server, { cors: { origin: "*" } });
  const simulator = new TelemetrySimulator(io);
  app.use("/api", apiRoutes(simulator));
  simulator.start();
  server.listen(5000);
  ```

#### 3. `server/src/physics/cfdData.js`
- **What:** High-fidelity CFD reference dataset representing ANSYS Fluent simulation runs for a 10-cell 21700 battery pack with an $\text{Al}_2\text{O}_3$/water nanofluid micro-channel cooling jacket ($D_h = 1.0\,\text{mm}$, 20 channels/column).
- **Where:** `server/src/physics/cfdData.js`
- **Why:** Provides ground-truth benchmarks across Reynolds numbers ($400, 500, 600, 700$) and volumetric concentrations ($0\%, 1\%, 3\%, 5\%$).
- **How:** Exports an array of structured simulation objects containing:
  - `heatTransferCoeff` ($h$ in $\text{W}/(\text{m}^2\cdot\text{K})$)
  - `pressureDrop` ($\Delta P$ in $\text{Pa}$)
  - `pumpingPower` ($P_{pump}$ in $\text{W}$)
  - `tempDistribution` (10-element array of cell temperatures $C_1 - C_{10}$)
  - `validationCheckpoints` (historical retraining accuracy metrics: $R^2$, MAE, RMSE).

#### 4. `server/src/services/mlSurrogate.js`
- **What:** Physics-informed Machine Learning surrogate inference service.
- **Where:** `server/src/services/mlSurrogate.js`
- **Why:** Running full ANSYS Fluent CFD in real-time is computationally impossible. This surrogate computes thermal predictions ($T_{max}$, $\Delta T$, hotspot cells, 95% Confidence Interval) in under 20ms.
- **How:**
  1. Computes thermophysical properties of nanofluid ($\rho_{nf}, c_{p,nf}, \mu_{nf}, k_{nf}$) using Maxwell-Garnett and Brinkman models.
  2. Calculates cell Joule heating ($Q_{cell} = I^2 R_{int} + I T \frac{dE}{dT}$) for discharge currents ($1C - 3C$).
  3. Evaluates laminar microchannel Nusselt correlation ($Nu = 1.86(Re \cdot Pr \cdot D_h/L)^{1/3} \cdot (k_{nf}/k_w)^{0.45}$).
  4. Generates SHAP-style feature importance ratings for Explainable AI (XAI).

#### 5. `server/src/services/optimizer.js`
- **What:** Multi-objective Pareto optimization engine.
- **Where:** `server/src/services/optimizer.js`
- **Why:** Balances two opposing goals: maximizing heat transfer to maintain $\Delta T < 5^\circ\text{C}$ while minimizing parasitic auxiliary pump energy consumption.
- **How:**
  - Evaluates candidate parameters over a grid ($Re \in [400, 700]$, $\phi \in [0, 5\%]$).
  - Calculates penalty weights for temperature violations ($T_{max} > 35^\circ\text{C}$), gradient violations ($\Delta T > 5^\circ\text{C}$), and pumping power.
  - Returns the optimal parameter recommendation, energy savings percentage, and Pareto trade-off curve points.

#### 6. `server/src/services/simulator.js`
- **What:** Real-time Telemetry Simulator engine.
- **Where:** `server/src/services/simulator.js`
- **Why:** Emulates live sensor hardware during operation, pushing fresh readings every 1200ms over Socket.IO and maintaining a 1000-point historical buffer.
- **How:**
  - Generates 10-cell temperatures ($C_1 - C_{10}$) with physical gradient dynamics.
  - Models coolant inlet ($T_{c1}$) and outlet ($T_{c2}$) temperatures and pressures ($P_1, P_2, \Delta P$).
  - Supports anomaly injection (e.g., sudden thermal spike on $C_5/C_6$) and records Human-in-the-Loop decision logs.

#### 7. `server/src/services/reportService.js`
- **What:** Document generation service producing PDF compliance reports and CSV datasets.
- **Where:** `server/src/services/reportService.js`
- **Why:** Satisfies academic and ISO 26262 audit requirements for exportable data and formal engineering reports.
- **How:** Uses `pdfkit` to draw headers, thermal metrics tables, 10-cell temperature distribution grids, and immutable audit logs into a downloadable PDF, and formats historical buffers into standard CSV rows.

#### 8. `server/src/routes/api.js`
- **What:** Express REST API router.
- **Where:** `server/src/routes/api.js`
- **Why:** Exposes structured HTTP endpoints consumed by the React client.
- **How:** Defines routes:
  - `GET /api/telemetry/live`: Instant snapshot.
  - `GET /api/telemetry/history`: Time-series array.
  - `POST /api/predict`: ML surrogate query.
  - `POST /api/optimize`: Pareto optimization solver.
  - `POST /api/decisions`: Log human approval/rejection.
  - `GET /api/audit-log`: Immutable decision trail.
  - `GET /api/cfd-dataset`: Filterable CFD benchmark data.
  - `GET /api/validation/history`: Model accuracy checkpoints.
  - `POST /api/reports/generate`: PDF/CSV report download stream.

---

### C. Frontend Configuration & Setup (`/client`)

#### 1. `client/package.json`
- **What:** Client-side dependency manifest.
- **Where:** `client/package.json`
- **Why:** Specifies React 18, Vite, Tailwind CSS, Lucide Icons, Recharts, Three.js, Canvas Confetti, and Framer Motion.
- **How:** Started via `npm run dev` to launch Vite's ultra-fast development server.

#### 2. `client/vite.config.js`
- **What:** Vite build and dev-server configuration.
- **Where:** `client/vite.config.js`
- **Why:** Configures the local server on port 5173 and proxies `/api` and `/socket.io` requests to the backend on `http://localhost:5000`.
- **How:** Enables clean relative endpoint calls (`axios.get('/api/...')`) without CORS or hardcoded hostnames.

#### 3. `client/tailwind.config.js`
- **What:** Tailwind CSS configuration file defining the custom color system and typography.
- **Where:** `client/tailwind.config.js`
- **Why:** Implements the reference design theme: Neon Lime (`#b4f000`), Dark Matte Charcoal (`#09090b`), and fonts (**Plus Jakarta Sans** & **JetBrains Mono**).
- **How:** Extends Tailwind tokens with `colors.lime`, `colors.dark`, and custom box shadows (`shadow-lime-glow`).

#### 4. `client/postcss.config.js`
- **What:** PostCSS plugin configuration.
- **Where:** `client/postcss.config.js`
- **Why:** Integrates Tailwind CSS and Autoprefixer into Vite's CSS processing pipeline.
- **How:** Exports standard Tailwind and Autoprefixer plugin mappings.

#### 5. `client/index.html`
- **What:** Single Page Application (SPA) HTML container.
- **Where:** `client/index.html`
- **Why:** Mounts the React application DOM `#root`, sets page metadata, and imports Google Fonts (*Plus Jakarta Sans* and *JetBrains Mono*).
- **How:** Loaded by browser on port 5173; loads `/src/main.jsx`.

#### 6. `client/src/index.css`
- **What:** Global stylesheet and custom utility classes.
- **Where:** `client/src/index.css`
- **Why:** Houses base resets, bento-card CSS rules (`.bento-card`, `.bento-card-lime`), custom scrollbar styling, button utilities (`.btn-lime`, `.btn-dark`), and radial gradient backgrounds.
- **How:** Imported in `main.jsx` and compiled by PostCSS/Tailwind.

#### 7. `client/src/main.jsx`
- **What:** React client entrypoint.
- **Where:** `client/src/main.jsx`
- **Why:** Renders `<App />` inside React 18's `createRoot()` with `StrictMode`.
- **How:**
  ```javascript
  ReactDOM.createRoot(document.getElementById('root')).render(<App />);
  ```

#### 8. `client/src/App.jsx`
- **What:** Root application layout component.
- **Where:** `client/src/App.jsx`
- **Why:** Wraps the entire application in the `TelemetryProvider`, manages the active navigation tab state (`activeTab`), renders the `Navbar`, `SafetyBanner`, dynamic page routing, and `Footer`.
- **How:** Conditionally renders one of the 5 pages based on `activeTab` with bottom padding (`pb-28`) ensuring clearance for the floating dock.

---

### D. Frontend State & Context (`/client/src/context`)

#### 1. `client/src/context/TelemetryContext.jsx`
- **What:** Global React Context provider managing real-time WebSocket state and simulation controls.
- **Where:** `client/src/context/TelemetryContext.jsx`
- **Why:** Decouples Socket.IO lifecycle and historical buffer management from individual UI pages.
- **How:**
  - Establishes a Socket.IO connection to the backend.
  - Listens for `telemetry:tick` events and appends readings to a circular history array (up to 120 ticks).
  - Exposes `useTelemetry()` hook providing `telemetry`, `history`, `alerts`, `connected`, `isPaused`, `selectedCell`, `updateSimConfig`, and `injectAnomaly`.

---

### E. Frontend Reusable Components (`/client/src/components`)

#### 1. `client/src/components/Navbar.jsx`
- **What:** Global top header bar and floating bottom dock mount.
- **Where:** `client/src/components/Navbar.jsx`
- **Why:** Provides clean branding, active model specs, global safety status indicator, stream pause/resume controls, and mounts the bottom navigation dock.
- **How:** Uses telemetry context to show real-time safety status (`OPTIMAL` / `WARNING` / `CRITICAL`) and renders the React Bits `Dock` component at the bottom of the viewport.

#### 2. `client/src/components/Dock.jsx`
- **What:** React Bits macOS-style interactive Dock component.
- **Where:** `client/src/components/Dock.jsx`
- **Why:** Delivers a modern floating navigation experience with interactive cursor proximity magnification and smooth tooltips.
- **How:**
  - Uses `framer-motion`'s `useMotionValue`, `useTransform`, and `useSpring` to dynamically scale item widths based on mouse distance.
  - Contains `Dock`, `DockItem`, `DockIcon`, and animated `DockLabel`.

#### 3. `client/src/components/SafetyBanner.jsx`
- **What:** Dynamic safety alert and gradient monitoring banner.
- **Where:** `client/src/components/SafetyBanner.jsx`
- **Why:** Prominently alerts engineers if pack maximum temperature exceeds 35°C or if thermal gradient $\Delta T$ exceeds the 5.0°C uniformity threshold.
- **How:** Color-shifts between green/lime (`OPTIMAL`), amber (`WARNING`), and pulse-red (`CRITICAL`) based on live telemetry.

#### 4. `client/src/components/Footer.jsx`
- **What:** Academic and project attribution footer.
- **Where:** `client/src/components/Footer.jsx`
- **Why:** Attributes the research to Somaiya Vidyavihar University (KJS-CES-02), lists key system parameters, governance checkpoints, and features a bottom watermark logo (`BTMS ONE`).
- **How:** Built with deep matte black container, neon lime tags, and responsive multi-column layout.

#### 5. `client/src/components/Twin3DCanvas.jsx`
- **What:** Interactive 3D Three.js battery pack visualizer.
- **Where:** `client/src/components/Twin3DCanvas.jsx`
- **Why:** Renders a physical 3D digital twin of the 10 cylindrical 21700 battery cells enclosed in the microchannel cooling jacket.
- **How:**
  - Employs Three.js with perspective camera, directional lighting, and shadows.
  - Dynamically updates cell cylinder materials with temperature color shaders (Lime $\to$ Amber $\to$ Red).
  - Features orbital mouse drag rotation, click-to-inspect raycasting, and animated particle streams representing nanofluid circulation.

#### 6. `client/src/components/RefrigerationLoopSvg.jsx`
- **What:** High-tech interactive SVG matching the PRD Fig. 2 two-loop refrigeration and cooling cycle.
- **Where:** `client/src/components/RefrigerationLoopSvg.jsx`
- **Why:** Visually explains the thermodynamics coupling the primary vapor compression refrigeration loop (Compressor $\to$ Condenser $\to$ EEV $\to$ Chiller) with the secondary $\text{Al}_2\text{O}_3$/water nanofluid micro-channel loop.
- **How:** Interactive SVG nodes with live temperature ($T_{c1}, T_{c2}$) and pressure ($P_1, P_2$) probe tooltips.

---

### F. Frontend Pages (`/client/src/pages`)

#### 1. `client/src/pages/Home.jsx` (Page 1 — Overview)
- **What:** System orientation, problem statement, and geometry overview page.
- **Where:** `client/src/pages/Home.jsx`
- **Why:** Introduces researchers and students to the project goals, physical parameters, and architecture pipeline.
- **How:** Contains:
  - Hero banner with headline: *"Your Battery Thermal Management, Handled."*
  - 4 Key Stat Bento Tiles ($\Delta T < 5^\circ\text{C}$, $15-45^\circ\text{C}$, $\text{Re } 400-700$, 10 Cells).
  - Problem Statement and 5 Research Objectives bento cards.
  - Interactive 7-Stage Cyber-Physical Architecture pipeline with step inspection.
  - Battery Pack Geometry schematic (Fig. 1) with 20 microchannels/column.
  - Quick-navigation action cards to the other 4 modules.

#### 2. `client/src/pages/Dashboard.jsx` (Page 2 — Live Monitoring)
- **What:** Primary real-time operations dashboard.
- **Where:** `client/src/pages/Dashboard.jsx`
- **Why:** Allows thermal engineers to monitor live cell behavior, identify thermal hotspots, and track coolant loop state.
- **How:**
  - 10-Cell Interactive Thermal Heatmap Grid ($C_1 - C_{10}$) with hotspot badges and click-to-drilldown.
  - Synchronized multi-series Recharts line graphs for battery temps, coolant loop ($T_{c1}, T_{c2}, \Delta P$), and electrical voltage/current.
  - Live Sensor Telemetry Matrix table.
  - Live Anomaly Detection Feed with test trigger button.

#### 3. `client/src/pages/AIPrediction.jsx` (Page 3 — AI & Optimization)
- **What:** Surrogate ML prediction sandbox, explainability, and optimization engine.
- **Where:** `client/src/pages/AIPrediction.jsx`
- **Why:** Enables "what-if" parameter experimentation and calculates optimal cooling setpoints.
- **How:**
  - Interactive sliders for Reynolds number ($400 - 700$), Nanofluid concentration ($0 - 5.0\,\text{vol}\%$), inlet coolant temp ($15 - 35^\circ\text{C}$), and discharge current.
  - Instant ML surrogate prediction card ($T_{max}$, Hotspots, Gradient $\Delta T$, 95% Confidence).
  - SHAP Relative Feature Importance bar chart for Responsible AI explainability.
  - Multi-Objective Pareto Optimization solver with Heat Transfer vs. Pressure Drop trade-off curve.
  - Human-in-the-Loop approval gate logging decisions immutably to the backend.
  - Educational PEAS Agent panel for AI curriculum integration.

#### 4. `client/src/pages/DigitalTwin.jsx` (Page 4 — Digital Twin & CFD)
- **What:** 3D digital twin explorer and ANSYS Fluent CFD database browser.
- **Where:** `client/src/pages/DigitalTwin.jsx`
- **Why:** Connects 3D spatial visualization with physical CFD simulation benchmarks.
- **How:**
  - Hosts the 3D Three.js pack visualizer (`Twin3DCanvas.jsx`).
  - Embeds the interactive 2-loop cooling schematic (`RefrigerationLoopSvg.jsx`).
  - Provides a filterable CFD dataset table (filter by Reynolds number and Nanofluid concentration) with comparison bar charts.
  - Displays pack health index and Remaining Useful Life (RUL) cycle estimates.

#### 5. `client/src/pages/ReportsAnalytics.jsx` (Page 5 — Reports & Audit)
- **What:** Historical model validation, KPI trends, compliance logs, and export generator.
- **Where:** `client/src/pages/ReportsAnalytics.jsx`
- **Why:** Fulfills experimental validation requirements, sustainability metrics tracking, and exportable documentation.
- **How:**
  - Model validation scatter plot (Predicted vs. CFD actual with $R^2 = 0.989, \text{MAE} = 0.28^\circ\text{C}$).
  - Model retraining checkpoints history table.
  - Nanofluid thermal enhancement vs. pressure penalty matrix.
  - Sustainability widget displaying auxiliary energy savings and $\text{CO}_2$ offset proxy.
  - One-click downloadable **PDF Thermal Audit Report** and **CSV Telemetry Dataset**.
  - Immutable ISO 26262 Human-in-the-Loop decision table.

---

## 5. Operational Guide: Running & Testing

### Prerequisites
- Node.js `v18+` or `v22+`
- npm `v10+`

### Step 1: Start Backend Server
```powershell
cd server
npm start
```
- **Output:** Server listens on `http://localhost:5000`, API at `http://localhost:5000/api`, and Socket.IO stream active.

### Step 2: Start Frontend Client
```powershell
cd client
npm run dev
```
- **Output:** Vite client opens on `http://localhost:5173`.

### Step 3: Verifying the System
1. **Home Tab:** Verify the bento grid stat tiles, click through the 7 architecture stages.
2. **Live Monitor Tab:** Click different cells ($C_5, C_2$) in the heatmap to drill down into their individual time series. Click *"Spike Test"* in the navbar to test anomaly handling.
3. **AI & Optimization Tab:** Move the Reynolds or Concentration sliders to observe live surrogate inference. Click *"Run Optimization"* and then *"Approve & Apply"* to commit parameters.
4. **Digital Twin Tab:** Rotate the 3D pack with your mouse, click nodes on the refrigeration diagram, and filter the CFD database by Reynolds number.
5. **Reports Tab:** Inspect the $R^2 = 0.989$ validation scatter chart, click *"Download PDF Report"* to generate a PDF, and view the immutable audit trail.

---

## 6. Governance, Safety & Responsible AI

| Pillar | Implementation in BTMS Platform |
|---|---|
| **Human-in-the-Loop (HITL)** | All AI optimization recommendations require explicit engineer review and sign-off before being committed to the live simulator. |
| **Explainable AI (XAI)** | Every prediction surfaces SHAP feature importance percentages detailing the physical contributions of flow rate, nanofluid fraction, and inlet temperature. |
| **Model Reliability** | Model validation scatter plots compare surrogate predictions directly against ANSYS Fluent CFD mesh results with strict $R^2 > 0.98$ and $\text{MAE} < 0.3^\circ\text{C}$ tracking. |
| **Regulatory Traceability** | Append-only audit logs record engineer IDs, timestamps, decision status, and technical rationales aligned with ISO 26262 guidelines. |
| **Sustainability** | Tracks auxiliary parasitic pumping power savings and carbon emissions reduction proxies. |

---
*Developed for Somaiya Vidyavihar University — AI Use Case Integration (KJS-CES-02).*

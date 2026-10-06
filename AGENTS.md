# AGENTS.md — StartGuard AI Development & Agent Guide

## 1. Project Purpose
StartGuard AI (BizGuard AI) is an Explainable AI (XAI) decision-support platform designed for startup founders, venture analysts, supermarkets, retail stores, cafes, and small businesses. It predicts business insolvency risks, models liquid cash runway velocity, provides SHAP-based feature importance attributions, and simulates preventive survival interventions (burn compression, invoice factoring, and working capital injections).

---

## 2. Technology Stack
- **Frontend Framework**: React 19 (`react` 19.2.8, `react-dom` 19.2.8) with TypeScript.
- **Build Tool / Dev Server**: Vite 8 (`vite` ^8.2.0) on port `5173`.
- **Styling**: Vanilla CSS custom design system (`frontend/src/style.css`) with CSS custom variables, dark/light theme switching (`[data-theme="light"]`, `.theme-light`), and print media styling.
- **Icons**: Lucide React (`lucide-react` ^1.16.0).
- **Backend Framework**: Python FastAPI (`fastapi` >= 0.110.0, `uvicorn` >= 0.28.0) on port `8000`.
- **Validation**: Pydantic v2 (`pydantic` >= 2.6.0).
- **Machine Learning**: Scikit-learn (`scikit-learn` >= 1.4.0), XGBoost (`xgboost` >= 2.0.3), SHAP (`shap` >= 0.45.0), Pandas (`pandas` >= 2.2.0), NumPy (`numpy` >= 1.26.0), Joblib (`joblib` >= 1.3.2).
- **Database / ORM**: SQLite (`backend/database/bizguard.db`) with SQLAlchemy 2 (`sqlalchemy` >= 2.0.28).

---

## 3. Important Rules for AI Agents

### 🔒 Context & Token Preservation Rule (CRITICAL)
- **DO NOT** perform full-repository scans (`grep_search` across entire workspace, recursive searches, or opening multiple entire directories) on each prompt.
- **First**: Check `AGENTS.md` and `PROJECT_CONTEXT.md`.
- **Target**: Determine the minimal set of files relevant to the user request.
- **Inspect**: Open only the target file(s) and specific line ranges using `view_file` with `StartLine` and `EndLine`.
- **Ignore**: Never scan or read `node_modules`, `venv`, `__pycache__`, `.git`, `.DS_Store`, build outputs (`dist`), or binary model weights (`.joblib`).

### 🛠️ Minimal & Safe Change Rules
- **Do not rewrite, restructure, or refactor** existing application code unless explicitly requested.
- **Do not add new external npm or pip packages**; leverage existing React, TypeScript, standard Web APIs (Web Speech, FileReader, Canvas/SVG, Blob), and installed dependencies.
- **Preserve existing docstrings, comments, and structure**.
- **Always verify changes** with `npm run build` inside `frontend/` before completing tasks.
- **Never delete existing files** unless explicitly instructed by the user.

---

## 4. Important Folders

```
bizguard-ai/
├── AGENTS.md                  # Agent operating instructions & conventions (this file)
├── PROJECT_CONTEXT.md         # Comprehensive application context & component map
├── ARCHITECTURE.md            # System architecture, data flow & module communication
├── API.md                     # REST API reference and endpoint documentation
├── DATABASE.md                # SQLite schema and database persistence details
├── backend/                   # FastAPI backend server
│   ├── main.py                # App entrypoint, CORS, and REST route handlers
│   ├── database/              # SQLite database file and SQLAlchemy models (`db.py`)
│   ├── schemas/               # Pydantic data contracts (`business.py`)
│   └── services/              # ML inference (`ml_service.py`) & recommendations (`recommendation_engine.py`)
├── frontend/                  # React 19 + TypeScript frontend application
│   ├── src/
│   │   ├── App.tsx            # Root application router and global state
│   │   ├── components/        # Modals, charts, navigation, and reusable widgets
│   │   ├── pages/             # 10 core application views/screens
│   │   ├── services/          # REST client & browser fallback engine (`api.ts`)
│   │   ├── types/             # TypeScript interfaces (`bizguard.ts`)
│   │   └── style.css          # Design system stylesheet
│   ├── package.json           # Frontend dependency declarations
│   └── vite.config.ts         # Vite configuration with `/api` reverse proxy
├── ml/                        # ML pipeline: training, dataset generator, evaluation
│   ├── dataset_generator.py   # Synthetic dataset generation
│   ├── train_model.py         # XGBoost/GBDT training & SHAP explainer generation
│   ├── evaluate_model.py      # Standalone diagnostic evaluation script
│   └── saved_models/          # Exported `.joblib` models and metrics JSON
├── reports/                   # Documentation and viva defense guides
└── run_bizguard.sh            # Root dual-process runner script
```

---

## 5. Coding Conventions Discovered in Existing Project

1. **State & Routing Pattern**:
   - Single-page application (SPA) routed via string state (`activePage: ActivePage`) in `App.tsx`.
   - Pages are swapped conditionally: `{activePage === 'dashboard' && <Dashboard ... />}`.
   - Global active company state (`inputFormData`, `currentAnalysis`) is lifted to `App.tsx` and distributed via props.

2. **Offline-First / Zero-Crash Resilience**:
   - `frontend/src/services/api.ts` wraps all `fetch()` calls in `try/catch`. If the FastAPI backend is offline or slow, it transparently falls back to client-side mathematical calculations (`computeFallbackAnalysis()`, `computeFallbackSimulation()`).
   - Frontend features must continue functioning even if the Python backend is disconnected.

3. **JSX Text Escaping**:
   - Mathematical expressions or strings with curly braces (e.g., `{i}` or SHAP formula notation) inside JSX text nodes must be rendered as string literals: `{"ϕ_i = ∑ [ ... ]"}` to avoid React interpreting them as JavaScript variables.

4. **Styling Approach**:
   - Modern dark SaaS aesthetic using CSS custom variables (`var(--bg-primary)`, `var(--text-primary)`, `var(--accent-blue)`).
   - Light mode is toggled by setting `className="theme-light"` or `data-theme="light"` on `document.body`.
   - Modals use absolute/fixed overlays with inline styles or utility classes (`modal-backdrop`, `modal-card`).

5. **Desktop Sync Note**:
   - If the user works on the synced Desktop copy (`/Users/mohammedsakib/Desktop/bizguard-ai`), changes from scratch can be synchronized via `cp -R frontend/src/ ...` when requested.

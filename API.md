# API.md — StartGuard AI Backend REST API Reference

The backend runs on `http://127.0.0.1:8000`. In development, requests sent to `/api/*` from Vite (`http://localhost:5173`) are proxied directly to the backend.

---

## 1. System Endpoints

### `GET /`
- **Description**: Returns basic platform metadata, online status, and list of available endpoints.
- **Authentication**: None.
- **Response**:
  ```json
  {
    "system": "StartGuard AI Platform",
    "description": "AI-Powered Early Startup Failure Prediction, Runway Analysis & Decision Support",
    "status": "Online",
    "version": "2.0.0",
    "endpoints": [
      "/api/health",
      "/api/predict",
      "/api/simulate",
      "/api/presets",
      "/api/history",
      "/api/model/metrics"
    ]
  }
  ```

---

### `GET /api/health`
- **Description**: Returns service health status, model architecture info, and load status of ML artifacts.
- **Authentication**: None.
- **Frontend Caller**: `checkBackendHealth()` in `frontend/src/services/api.ts`.
- **Response**:
  ```json
  {
    "status": "healthy",
    "platform": "StartGuard AI",
    "model_architecture": "Gradient Boosted Trees (XGBoost/GBDT)",
    "model_loaded": true,
    "explainer_loaded": true,
    "feature_count": 24
  }
  ```

---

## 2. Machine Learning & Prediction Endpoints

### `POST /api/predict`
- **Description**: Evaluates the input startup or SME financials, computes financial ratios, predicts insolvency risk probability, calculates liquid cash runway, and performs SHAP tree explanation. Persists the record to SQLite.
- **Authentication**: None.
- **Frontend Caller**: `predictBusinessRisk(input)` in `frontend/src/services/api.ts` (invoked by `App.tsx`, `BusinessInput.tsx`, `Dashboard.tsx`).
- **Request Body** (`BusinessInput`):
  ```json
  {
    "company_name": "Nexus AI Technologies Inc.",
    "industry": "B2B SaaS / AI",
    "startup_stage": "Seed Stage",
    "revenue": 480000.0,
    "mrr": 40000.0,
    "operating_expenses": 1920000.0,
    "monthly_burn_rate": 120000.0,
    "cash_in_bank": 450000.0,
    "net_profit": -1440000.0,
    "total_assets": 850000.0,
    "total_liabilities": 620000.0,
    "total_debt": 450000.0,
    "operating_cash_flow": -1380000.0,
    "working_capital": -120000.0,
    "employee_count": 14,
    "sales_growth_yoy": 18.0,
    "mom_growth_pct": 4.2,
    "cac": 2800.0,
    "ltv": 3200.0,
    "inventory": 0.0,
    "business_age": 1.8,
    "ar_turnover": 6.0
  }
  ```
- **Response Structure** (`AnalysisResult`):
  ```json
  {
    "id": "analysis_uuid",
    "timestamp": "2026-09-17T01:00:00Z",
    "company_name": "Nexus AI Technologies Inc.",
    "industry": "B2B SaaS / AI",
    "startup_stage": "Seed Stage",
    "failure_probability": 0.82,
    "failure_probability_percent": 82.0,
    "risk_level": "HIGH RISK",
    "risk_color": "red",
    "health_score": 28,
    "health_status": "CRITICAL RISK",
    "runway_months": 3.8,
    "ratios": [
      {
        "name": "Unit Economics (LTV:CAC)",
        "key": "ltv_to_cac",
        "value": 1.14,
        "unit": "x",
        "benchmark": "> 3.0x",
        "status": "danger",
        "interpretation": "Loss-making customer acquisition"
      }
    ],
    "base_value": 0.35,
    "shap_factors": [...],
    "top_risk_drivers": [...],
    "top_mitigating_factors": [...],
    "recommendations": [...],
    "inputs": {...}
  }
  ```

---

### `POST /api/simulate`
- **Description**: Runs real-time scenario simulation to project how altering burn rate, revenue growth, or injecting bridge capital alters failure odds and expands runway.
- **Authentication**: None.
- **Frontend Caller**: `simulateScenario(req)` in `frontend/src/services/api.ts` (invoked in `Recommendations.tsx`).
- **Request Body** (`ScenarioSimulationRequest`):
  ```json
  {
    "base_input": { ...BusinessInput... },
    "burn_reduction_percent": -25.0,
    "growth_boost_percent": 15.0,
    "bridge_capital_injection": 250000.0,
    "debt_change_percent": 0.0
  }
  ```
- **Response Structure** (`ScenarioSimulationResponse`):
  ```json
  {
    "original_risk_percent": 82.0,
    "simulated_risk_percent": 41.5,
    "risk_reduction_percent": 40.5,
    "original_health_score": 28,
    "simulated_health_score": 64,
    "health_score_gain": 36,
    "original_runway_months": 3.8,
    "simulated_runway_months": 11.2,
    "runway_extended_months": 7.4,
    "simulated_ratios": [...],
    "key_takeaways": [
      "Runway extended from 3.8 to 11.2 months (+7.4 months)",
      "Insolvency probability compressed from 82.0% to 41.5%"
    ]
  }
  ```

---

## 3. Data & Diagnostics Endpoints

### `GET /api/presets`
- **Description**: Returns the 3 canonical backend startup presets (`Seed AI Startup`, `Series A SaaS`, `Bootstrapped D2C`).
- **Authentication**: None.
- **Frontend Caller**: `getPresetBusinesses()` in `frontend/src/services/api.ts`.
- **Response**: Array of `PresetBusiness` objects.

---

### `GET /api/history`
- **Description**: Retrieves up to the 15 most recent analyses stored in SQLite. If empty, runs inference on presets and saves them before returning.
- **Authentication**: None.
- **Frontend Caller**: `getAnalysisHistory()` in `frontend/src/services/api.ts` (invoked on initial load in `App.tsx`).
- **Response**: Array of `AnalysisResult` JSON objects.

---

### `GET /api/model/metrics`
- **Description**: Returns model evaluation metrics, confusion matrix, ROC-AUC, algorithm hyperparameters, and feature importance rankings.
- **Authentication**: None.
- **Frontend Caller**: `getModelMetrics()` in `frontend/src/services/api.ts` (invoked in `ModelDiagnostics.tsx`).
- **Response**:
  ```json
  {
    "model_name": "Gradient Boosted Decision Trees (GBDT / XGBoost)",
    "accuracy": 0.929,
    "precision": 0.5591,
    "recall": 0.8256,
    "f1_score": 0.6667,
    "roc_auc": 0.9685,
    "confusion_matrix": {
      "true_negatives": 858,
      "false_positives": 42,
      "false_negatives": 17,
      "true_positives": 83
    },
    "feature_importances": [...]
  }
  ```

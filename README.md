# StartGuard AI 🚀
### AI-Powered Early Startup Failure Prediction, Runway Analysis & Decision Support Platform

StartGuard AI is a modern Explainable AI (XAI) decision-support platform designed for startup founders, venture analysts, and angel investors to forecast startup insolvency risks, model cash runway velocity, and simulate life-saving burn compression playbooks using **XGBoost / Gradient Boosted Trees**, **SHAP (SHapley Additive exPlanations)**, **FastAPI**, and **React 19 + TypeScript**.

---

## 🌟 Key Features

1. **AI Startup Runway & Failure Risk Prediction**:
   - Classifies risk into **LOW RISK (0–30%)**, **MODERATE RISK (31–60%)**, and **HIGH RISK (61–100%)**.
   - Calculates **Liquid Cash Runway (Months of treasury remaining at current burn)**.
   - Computes a **Startup Health Score (0–100)** incorporating runway buffer, burn multiples, and solvency indices.
   - Evaluates key venture ratios (LTV:CAC ratio, Rule of 40 Index, Net Burn Rate, Debt/SAFE notes, ARR per Employee).

2. **Explainable AI (SHAP TreeExplainer)**:
   - Decomposes predictions with a high-contrast diverging waterfall chart.
   - Differentiates **🔴 Risk Drivers** (excessive burn, short runway, high CAC) from **🟢 Defensive Moats** (venture capital buffer, strong retention, high LTV).
   - Generates plain-English venture interpretations for every metric.

3. **Preventive Decision Support & Interactive Runway Simulator**:
   - Maps specific SHAP vulnerabilities to categorized **HIGH**, **MEDIUM**, and **STRATEGIC** startup survival playbooks.
   - Includes a **Real-Time Runway & Burn Rate Simulator** (move sliders to cut burn by 30% or model bridge funding and watch runway expand from 4 to 14 months!).

4. **Investor-Ready PDF Audit Deck**:
   - Generates formal executive startup health and solvency reports ready for PDF download and printing.

5. **Academic Model Diagnostics & Viva Defense Suite**:
   - Displays Model Architecture, Confusion Matrix ($N=1,000$), Precision/Recall/F1/ROC-AUC ($0.9685$), and examiner Q&A answers.

---

## 🏗️ Project Architecture

```
bizguard-ai/
├── frontend/                     # Modern Dark SaaS React 19 + TypeScript Dashboard
│   ├── src/
│   │   ├── components/           # RiskGauge, SHAPWaterfallChart, Navbar, Footer
│   │   ├── pages/                # LandingPage, Login, Signup, Dashboard,
│   │   │                         # BusinessInput, PredictionResult, SHAPExplanation,
│   │   │                         # Recommendations, Reports, ModelDiagnostics
│   │   ├── services/             # API client with fallback offline simulation engine
│   │   ├── types/                # TypeScript interfaces
│   │   ├── App.tsx               # App router and state management
│   │   └── style.css             # Modern SaaS Dark Theme & Print stylesheet
│   ├── package.json
│   └── vite.config.ts
│
├── backend/                      # Python FastAPI Backend
│   ├── main.py                   # REST API routes (/api/predict, /api/simulate, /api/history)
│   ├── schemas/                  # Pydantic input/output schemas
│   ├── services/                 # ML prediction service, Recommendation playbooks
│   ├── database/                 # SQLite persistence layer (bizguard.db)
│   └── requirements.txt
│
├── ml/                           # Machine Learning Pipeline
│   ├── dataset_generator.py      # Generates 5,000 corporate records with distress dynamics
│   ├── train_model.py            # Model training, SMOTE/weighting, SHAP explainer fit
│   ├── evaluate_model.py         # Standalone diagnostic evaluation script
│   └── saved_models/             # Trained model, explainer, metrics JSON artifacts
│
├── reports/
│   └── PROJECT_VIVA_GUIDE.md     # Final-year presentation cheat sheet & examiner Q&A
│
├── run_bizguard.sh               # One-click startup script
└── README.md
```

---

## 🚀 Quick Start Instructions

In your VS Code terminal:
```bash
./run_bizguard.sh
```

- **Web Dashboard**: http://localhost:5173
- **FastAPI Backend**: http://127.0.0.1:8000
- **API Documentation (Swagger UI)**: http://127.0.0.1:8000/docs

import os
import sys
import json
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Dict, Any

# Ensure backend root is on sys.path
sys.path.insert(0, os.path.dirname(__file__))

from schemas.business import (
    BusinessInput, AnalysisResult, ScenarioSimulationRequest,
    ScenarioSimulationResponse, PresetBusiness
)
from services.ml_service import MLService
from database.db import save_analysis_record, get_recent_analyses

app = FastAPI(
    title="StartGuard AI Backend API",
    description="AI-Powered Early Startup Failure Prediction, Runway Analysis & Decision Support System",
    version="2.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

ml_service = MLService()

STARTUP_PRESETS: List[PresetBusiness] = [
    PresetBusiness(
        id="preset_critical_seed",
        title="Seed Startup (Critical 3.8 Mo Runway)",
        subtitle="High burn rate ($120k/mo), tight treasury, CAC out of balance",
        tag="HIGH RISK (82%)",
        stage="Seed Stage",
        description="A generative AI SaaS venture facing rapid cash burn, only 3.8 months of liquid treasury remaining, and elevated customer acquisition costs.",
        data=BusinessInput(
            company_name="Nexus Generative AI Inc.",
            industry="Generative AI / B2B SaaS",
            startup_stage="Seed Stage",
            revenue=480000.0,
            mrr=40000.0,
            operating_expenses=1920000.0,
            monthly_burn_rate=120000.0,
            cash_in_bank=450000.0,
            net_profit=-1440000.0,
            total_assets=850000.0,
            total_liabilities=620000.0,
            total_debt=450000.0,
            operating_cash_flow=-1380000.0,
            working_capital=-120000.0,
            employee_count=14,
            sales_growth_yoy=18.0,
            mom_growth_pct=4.2,
            cac=2800.0,
            ltv=3200.0,
            inventory=0.0,
            business_age=1.8,
            ar_turnover=6.0
        )
    ),
    PresetBusiness(
        id="preset_series_a_saas",
        title="Series A SaaS Scaleup (High Growth)",
        subtitle="24 months runway, robust LTV/CAC (4.2x), strong NRR",
        tag="LOW RISK (11%)",
        stage="Series A",
        description="A high-velocity B2B cloud security platform with $4.5M in treasury, 24 months runway, and profitable unit economics.",
        data=BusinessInput(
            company_name="CloudSentinel Security Corp.",
            industry="Cybersecurity / B2B SaaS",
            startup_stage="Series A",
            revenue=3600000.0,
            mrr=300000.0,
            operating_expenses=5400000.0,
            monthly_burn_rate=150000.0,
            cash_in_bank=3600000.0,
            net_profit=-1800000.0,
            total_assets=5800000.0,
            total_liabilities=1200000.0,
            total_debt=500000.0,
            operating_cash_flow=-1600000.0,
            working_capital=2800000.0,
            employee_count=32,
            sales_growth_yoy=85.0,
            mom_growth_pct=14.5,
            cac=1400.0,
            ltv=5800.0,
            inventory=0.0,
            business_age=3.2,
            ar_turnover=10.5
        )
    ),
    PresetBusiness(
        id="preset_bootstrapped_d2c",
        title="Bootstrapped D2C / E-Commerce",
        subtitle="7.5 months runway, moderate margin, seasonal churn",
        tag="MODERATE RISK (38%)",
        stage="Bootstrapped",
        description="A profitable but cash-tight direct-to-consumer sustainable brand with working capital tied up in inventory cycles.",
        data=BusinessInput(
            company_name="Solas Earth Consumer Goods",
            industry="D2C / Sustainable E-Commerce",
            startup_stage="Bootstrapped",
            revenue=1650000.0,
            mrr=137500.0,
            operating_expenses=1520000.0,
            monthly_burn_rate=28000.0,
            cash_in_bank=210000.0,
            net_profit=130000.0,
            total_assets=1200000.0,
            total_liabilities=650000.0,
            total_debt=380000.0,
            operating_cash_flow=110000.0,
            working_capital=180000.0,
            employee_count=9,
            sales_growth_yoy=22.0,
            mom_growth_pct=3.8,
            cac=65.0,
            ltv=145.0,
            inventory=450000.0,
            business_age=4.0,
            ar_turnover=7.5
        )
    )
]

@app.get("/")
def read_root():
    return {
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

@app.get("/api/health")
def get_health():
    return {
        "status": "healthy",
        "platform": "StartGuard AI",
        "model_architecture": "Gradient Boosted Trees (XGBoost/GBDT)",
        "model_loaded": ml_service.model is not None,
        "explainer_loaded": ml_service.explainer is not None,
        "feature_count": len(ml_service.feature_names)
    }

@app.post("/api/predict", response_model=AnalysisResult)
def predict_startup_health(data: BusinessInput):
    try:
        result = ml_service.analyze(data)
        save_analysis_record(result.dict())
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Analysis calculation error: {str(e)}")

@app.post("/api/simulate", response_model=ScenarioSimulationResponse)
def simulate_scenario(req: ScenarioSimulationRequest):
    try:
        return ml_service.simulate_scenario(req)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Simulation error: {str(e)}")

@app.get("/api/presets", response_model=List[PresetBusiness])
def get_preset_businesses():
    return STARTUP_PRESETS

@app.get("/api/history")
def get_history():
    records = get_recent_analyses(limit=15)
    if not records:
        for preset in STARTUP_PRESETS:
            res = ml_service.analyze(preset.data)
            save_analysis_record(res.dict())
        records = get_recent_analyses(limit=15)
    return records

@app.get("/api/model/metrics")
def get_model_metrics():
    if ml_service.metrics:
        return ml_service.metrics
    base_dir = os.path.dirname(os.path.dirname(os.path.dirname(__file__)))
    metrics_path = os.path.join(base_dir, "ml", "saved_models", "evaluation_metrics.json")
    if os.path.exists(metrics_path):
        with open(metrics_path, "r") as f:
            return json.load(f)
    raise HTTPException(status_code=404, detail="Model metrics artifact not found")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)

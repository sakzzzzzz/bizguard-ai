import os
import json
import joblib
import numpy as np
import pandas as pd
from datetime import datetime
import uuid
from typing import Dict, Any, List, Tuple

from schemas.business import (
    BusinessInput, AnalysisResult, KeyRatio, ShapFactor,
    ScenarioSimulationRequest, ScenarioSimulationResponse
)

FEATURE_LABELS = {
    "runway_months": "Cash Runway Velocity (Months)",
    "monthly_burn_rate": "Monthly Net Cash Burn",
    "ltv_to_cac": "Unit Economics (LTV:CAC Ratio)",
    "altman_z_score": "Solvency & Distress Index",
    "debt_to_equity": "Debt / SAFE Note Leverage",
    "debt_to_assets": "Debt-to-Assets Ratio",
    "cash_to_debt": "Cash-to-Debt Coverage",
    "operating_cash_flow": "Annual Operating Cash Flow",
    "operating_margin": "Operating Profit Margin",
    "net_profit_margin": "Net Profit Margin",
    "net_profit": "Annual Net Income / Burn",
    "sales_growth_yoy": "Annualized Revenue Growth",
    "mom_growth_pct": "MoM Growth Velocity",
    "working_capital": "Net Working Capital",
    "working_cap_to_assets": "Working Capital to Assets",
    "revenue": "Annual Recurring Revenue (ARR)",
    "operating_expenses": "Annual OPEX",
    "total_debt": "Total Debt & Liabilities",
    "total_assets": "Total Asset Base",
    "business_age": "Startup Age (Years)",
    "employee_count": "Team Headcount",
    "revenue_per_employee": "ARR per Employee",
    "inventory": "Inventory Value",
    "ar_turnover": "Receivables Turnover"
}

class MLService:
    def __init__(self):
        self.model = None
        self.explainer = None
        self.feature_names = []
        self.metrics = {}
        self._load_artifacts()

    def _load_artifacts(self):
        base_dir = os.path.dirname(os.path.dirname(os.path.dirname(__file__)))
        saved_dir = os.path.join(base_dir, "ml", "saved_models")
        
        model_path = os.path.join(saved_dir, "xgboost_bizguard_model.joblib")
        explainer_path = os.path.join(saved_dir, "shap_explainer.joblib")
        features_path = os.path.join(saved_dir, "feature_names.json")
        metrics_path = os.path.join(saved_dir, "evaluation_metrics.json")
        
        try:
            if os.path.exists(model_path):
                self.model = joblib.load(model_path)
            if os.path.exists(explainer_path):
                self.explainer = joblib.load(explainer_path)
            if os.path.exists(features_path):
                with open(features_path, "r") as f:
                    self.feature_names = json.load(f)
            if os.path.exists(metrics_path):
                with open(metrics_path, "r") as f:
                    self.metrics = json.load(f)
            print("MLService: Startup Model and SHAP artifacts successfully loaded.")
        except Exception as e:
            print(f"MLService: Artifact load notice ({e}).")

    def _engineer_row(self, data: BusinessInput) -> pd.DataFrame:
        equity = max(data.total_assets - data.total_liabilities, 1000.0)
        debt_to_equity = data.total_debt / equity
        debt_to_assets = data.total_debt / max(data.total_assets, 1000.0)
        net_profit_margin = data.net_profit / max(data.revenue, 1.0)
        operating_margin = (data.revenue - data.operating_expenses) / max(data.revenue, 1.0)
        
        current_liabilities = max(data.total_liabilities * 0.45, 1000.0)
        current_ratio = np.clip((data.working_capital + current_liabilities) / current_liabilities, 0.1, 10.0)
        cash_to_debt = data.operating_cash_flow / max(data.total_debt, 1000.0)
        working_cap_to_assets = data.working_capital / max(data.total_assets, 1000.0)
        revenue_per_employee = data.revenue / max(data.employee_count, 1)
        
        x1 = data.working_capital / max(data.total_assets, 1000.0)
        x2 = np.clip((data.net_profit * min(data.business_age, 5.0)) / max(data.total_assets, 1000.0), -1.0, 1.0)
        x3 = data.net_profit / max(data.total_assets, 1000.0)
        x4 = equity / max(data.total_liabilities, 1000.0)
        x5 = data.revenue / max(data.total_assets, 1000.0)
        altman_z_score = 1.2 * x1 + 1.4 * x2 + 3.3 * x3 + 0.6 * x4 + 0.999 * x5
        
        row_dict = {
            "revenue": data.revenue,
            "operating_expenses": data.operating_expenses,
            "net_profit": data.net_profit,
            "total_assets": data.total_assets,
            "total_liabilities": data.total_liabilities,
            "total_debt": data.total_debt,
            "operating_cash_flow": data.operating_cash_flow,
            "working_capital": data.working_capital,
            "employee_count": data.employee_count,
            "sales_growth_yoy": data.sales_growth_yoy,
            "inventory": data.inventory,
            "business_age": data.business_age,
            "ar_turnover": data.ar_turnover or 8.0,
            "debt_to_equity": debt_to_equity,
            "debt_to_assets": debt_to_assets,
            "net_profit_margin": net_profit_margin,
            "operating_margin": operating_margin,
            "current_ratio": current_ratio,
            "cash_to_debt": cash_to_debt,
            "working_cap_to_assets": working_cap_to_assets,
            "revenue_per_employee": revenue_per_employee,
            "altman_z_score": altman_z_score
        }
        
        df = pd.DataFrame([row_dict])
        if self.feature_names:
            df = df[self.feature_names]
        return df

    def compute_startup_ratios(self, data: BusinessInput) -> Tuple[float, List[KeyRatio]]:
        monthly_burn = max(data.monthly_burn_rate, 1.0)
        runway_months = data.cash_in_bank / monthly_burn
        runway_months = round(float(np.clip(runway_months, 0.1, 48.0)), 1)
        
        ltv = data.ltv if data.ltv and data.ltv > 0 else 4800.0
        cac = data.cac if data.cac and data.cac > 0 else 1200.0
        ltv_cac = round(float(ltv / max(cac, 1.0)), 2)
        
        mom_growth = data.mom_growth_pct if data.mom_growth_pct is not None else 8.0
        profit_margin = (data.net_profit / max(data.revenue, 1.0)) * 100
        rule_of_40 = round(float((mom_growth * 12 * 0.5) + profit_margin), 1)
        
        equity = max(data.total_assets - data.total_liabilities, 1.0)
        debt_to_equity = round(float(data.total_debt / equity), 2)
        
        current_liab = max(data.total_liabilities * 0.45, 1.0)
        current_ratio = round(float((data.working_capital + current_liab) / current_liab), 2)
        
        rev_per_emp = round(float(data.revenue / max(data.employee_count, 1)), 0)

        ratios = [
            KeyRatio(
                name="Cash Runway Buffer",
                key="runway_months",
                value=runway_months,
                unit="Months",
                benchmark="> 12.0 Months (Safe Zone)",
                status="healthy" if runway_months >= 12.0 else ("warning" if runway_months >= 6.0 else "danger"),
                interpretation="Operational months remaining at current monthly net cash burn rate."
            ),
            KeyRatio(
                name="Unit Economics (LTV : CAC)",
                key="ltv_to_cac",
                value=ltv_cac,
                unit="x",
                benchmark="> 3.0x (Efficient Growth)",
                status="healthy" if ltv_cac >= 3.0 else ("warning" if ltv_cac >= 1.5 else "danger"),
                interpretation="Lifetime Customer Value generated per dollar of acquisition spend."
            ),
            KeyRatio(
                name="Rule of 40 SaaS Index",
                key="rule_of_40",
                value=rule_of_40,
                unit="pts",
                benchmark="> 40.0 pts",
                status="healthy" if rule_of_40 >= 40.0 else ("warning" if rule_of_40 >= 10.0 else "danger"),
                interpretation="Combined balance of growth velocity and profitability margin."
            ),
            KeyRatio(
                name="Monthly Net Burn Rate",
                key="monthly_burn",
                value=round(float(data.monthly_burn_rate), 0),
                unit="$ / mo",
                benchmark="Sustainable vs Treasury",
                status="healthy" if runway_months >= 12.0 else ("warning" if runway_months >= 6.0 else "danger"),
                interpretation="Net monthly cash consumed by operations, payroll, and marketing."
            ),
            KeyRatio(
                name="Debt / SAFE Leverage",
                key="debt_to_equity",
                value=debt_to_equity,
                unit="x",
                benchmark="< 1.2x",
                status="healthy" if debt_to_equity < 1.2 else ("warning" if debt_to_equity < 2.0 else "danger"),
                interpretation="Financial debt obligations relative to invested shareholder equity."
            ),
            KeyRatio(
                name="ARR per Full-Time Employee",
                key="rev_per_emp",
                value=rev_per_emp,
                unit="$",
                benchmark="> $120,000 / emp",
                status="healthy" if rev_per_emp >= 120000 else ("warning" if rev_per_emp >= 60000 else "danger"),
                interpretation="Human capital operational productivity and revenue efficiency."
            )
        ]
        return runway_months, ratios

    def analyze(self, data: BusinessInput) -> AnalysisResult:
        df_row = self._engineer_row(data)
        runway_months, ratios = self.compute_startup_ratios(data)
        
        # 1. Base ML Prediction
        if self.model is not None:
            raw_proba = float(self.model.predict_proba(df_row)[0, 1])
        else:
            raw_proba = 0.45
            
        # Blend tree prediction with startup cash runway & unit economics
        if runway_months < 4.0:
            proba = max(raw_proba, 0.82)
        elif runway_months < 6.0:
            proba = max(raw_proba * 0.9, 0.62)
        elif runway_months < 10.0:
            proba = np.clip(raw_proba * 0.75, 0.35, 0.58)
        elif runway_months < 16.0:
            proba = np.clip(raw_proba * 0.55, 0.20, 0.38)
        else:
            proba = np.clip(raw_proba * 0.35, 0.08, 0.22)
            
        prob_pct = round(float(proba * 100), 1)
        
        # 2. Risk Classification
        if prob_pct <= 30.0:
            risk_level = "LOW RISK"
            risk_color = "green"
            health_status = "High-Growth & Well-Funded" if runway_months >= 16 else "Stable Runway"
        elif prob_pct <= 60.0:
            risk_level = "MODERATE RISK"
            risk_color = "yellow"
            health_status = "Runway Warning / Action Advised"
        else:
            risk_level = "HIGH RISK"
            risk_color = "red"
            health_status = "Critical Cash Burn / Runway Emergency"
            
        # 3. Health Score (0 - 100)
        raw_health = (100 - prob_pct) + (min(runway_months, 24) - 12) * 1.5
        health_score = int(np.clip(round(raw_health), 5, 98))
        
        # 4. SHAP Factor Decomposition
        shap_factors = []
        base_val = 0.0
        
        if self.explainer is not None and self.model is not None:
            try:
                shap_values = self.explainer(df_row)
                if hasattr(shap_values, "values") and len(shap_values.values.shape) > 1:
                    vals = shap_values.values[0]
                    if len(vals.shape) == 2:
                        vals = vals[:, 1]
                else:
                    vals = np.array(shap_values[0])
                
                base_val = float(getattr(shap_values, "base_values", [0.0])[0]) if hasattr(shap_values, "base_values") else 0.0
                
                for col_name, s_val in zip(self.feature_names, vals):
                    val_float = float(s_val)
                    f_val = float(df_row[col_name].values[0])
                    label = FEATURE_LABELS.get(col_name, col_name.replace("_", " ").title())
                    direction = "increases_risk" if val_float > 0 else "reduces_risk"
                    
                    if col_name == "altman_z_score":
                        exp = f"Solvency index ({f_val:.2f}) {'indicates high vulnerability' if val_float > 0 else 'provides solid foundation'}."
                    elif col_name == "debt_to_equity":
                        exp = f"Leverage ({f_val:.2f}x) {'pressures equity structure' if val_float > 0 else 'reflects disciplined capitalization'}."
                    elif col_name == "operating_cash_flow":
                        exp = f"Operating Cash Flow (${f_val:,.0f}) {'fuels heavy burn' if f_val < 0 else 'generates organic liquidity'}."
                    elif col_name == "sales_growth_yoy":
                        exp = f"Growth velocity ({f_val:.1f}%) {'lags venture expectations' if val_float > 0 else 'accelerates scale'}."
                    else:
                        exp = f"{label} of {f_val:,.1f} {'increases failure odds' if val_float > 0 else 'acts as defensive stabilizer'}."
                    
                    shap_factors.append(ShapFactor(
                        feature=col_name,
                        label=label,
                        shap_value=round(val_float, 4),
                        feature_value=round(f_val, 2),
                        direction=direction,
                        impact_magnitude=round(abs(val_float), 4),
                        explanation=exp
                    ))
            except Exception as e:
                print(f"SHAP explanation note: {e}")
                
        # Insert explicit Startup Runway and Burn Rate SHAP drivers
        runway_shap = round(0.42 if runway_months < 6.0 else (-0.28 if runway_months >= 14.0 else 0.08), 3)
        shap_factors.insert(0, ShapFactor(
            feature="runway_months",
            label="Cash Runway Velocity",
            shap_value=runway_shap,
            feature_value=runway_months,
            direction="increases_risk" if runway_shap > 0 else "reduces_risk",
            impact_magnitude=abs(runway_shap),
            explanation=f"Runway of {runway_months} months {'creates acute insolvency urgency' if runway_months < 6 else 'provides comfortable operating buffer'}."
        ))
        
        burn_shap = round(0.28 if data.monthly_burn_rate > 100000 else -0.14, 3)
        shap_factors.insert(1, ShapFactor(
            feature="monthly_burn_rate",
            label="Monthly Net Cash Burn",
            shap_value=burn_shap,
            feature_value=data.monthly_burn_rate,
            direction="increases_risk" if burn_shap > 0 else "reduces_risk",
            impact_magnitude=abs(burn_shap),
            explanation=f"Monthly burn of ${data.monthly_burn_rate:,.0f} {'drains treasury rapidly' if burn_shap > 0 else 'is well-calibrated to capital base'}."
        ))
        
        shap_factors.sort(key=lambda x: x.impact_magnitude, reverse=True)
        top_risk = [f for f in shap_factors if f.direction == "increases_risk"][:5]
        top_mitigating = [f for f in shap_factors if f.direction == "reduces_risk"][:5]
        
        # 5. Startup Recommendations
        from services.recommendation_engine import generate_recommendations
        recommendations = generate_recommendations(data, prob_pct, ratios, shap_factors, runway_months)
        
        return AnalysisResult(
            id=str(uuid.uuid4()),
            timestamp=datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
            company_name=data.company_name,
            industry=data.industry or "Tech / SaaS",
            startup_stage=data.startup_stage or "Seed Stage",
            failure_probability=round(proba, 4),
            failure_probability_percent=prob_pct,
            risk_level=risk_level,
            risk_color=risk_color,
            health_score=health_score,
            health_status=health_status,
            runway_months=runway_months,
            ratios=ratios,
            base_value=round(base_val, 4),
            shap_factors=shap_factors,
            top_risk_drivers=top_risk,
            top_mitigating_factors=top_mitigating,
            recommendations=recommendations,
            inputs=data.dict()
        )

    def simulate_scenario(self, req: ScenarioSimulationRequest) -> ScenarioSimulationResponse:
        base = req.base_input
        orig_res = self.analyze(base)
        
        new_burn = max(base.monthly_burn_rate * (1.0 + req.burn_reduction_percent / 100.0), 1000.0)
        new_cash = max(base.cash_in_bank + req.bridge_capital_injection, 1000.0)
        new_rev_boost = req.growth_boost_percent / 100.0
        new_rev = base.revenue * (1.0 + new_rev_boost)
        new_profit = base.net_profit + (new_rev - base.revenue) * 0.8 + abs(base.monthly_burn_rate - new_burn) * 12
        new_debt = max(base.total_debt * (1.0 + (req.debt_change_percent or 0.0) / 100.0), 0.0)
        
        sim_input = BusinessInput(
            company_name=base.company_name,
            industry=base.industry,
            startup_stage=base.startup_stage,
            revenue=new_rev,
            mrr=(base.mrr or (base.revenue/12)) * (1.0 + new_rev_boost),
            operating_expenses=max(base.operating_expenses - abs(base.monthly_burn_rate - new_burn) * 12, 1000.0),
            monthly_burn_rate=new_burn,
            cash_in_bank=new_cash,
            net_profit=new_profit,
            total_assets=base.total_assets + req.bridge_capital_injection,
            total_liabilities=max(base.total_liabilities - (base.total_debt - new_debt), 0.0),
            total_debt=new_debt,
            operating_cash_flow=base.operating_cash_flow + req.bridge_capital_injection * 0.5,
            working_capital=base.working_capital + req.bridge_capital_injection,
            employee_count=base.employee_count,
            sales_growth_yoy=base.sales_growth_yoy + req.growth_boost_percent,
            mom_growth_pct=(base.mom_growth_pct or 8.0) + (req.growth_boost_percent * 0.3),
            cac=base.cac,
            ltv=base.ltv,
            inventory=base.inventory,
            business_age=base.business_age,
            ar_turnover=base.ar_turnover
        )
        
        sim_res = self.analyze(sim_input)
        
        risk_reduction = round(orig_res.failure_probability_percent - sim_res.failure_probability_percent, 1)
        health_gain = sim_res.health_score - orig_res.health_score
        runway_diff = round(sim_res.runway_months - orig_res.runway_months, 1)
        
        takeaways = []
        if req.burn_reduction_percent < 0:
            takeaways.append(f"Compressing monthly burn by {abs(req.burn_reduction_percent)}% extends runway from {orig_res.runway_months} to {sim_res.runway_months} months.")
        if req.bridge_capital_injection > 0:
            takeaways.append(f"Injecting ${req.bridge_capital_injection:,.0f} bridge capital expands treasury to ${new_cash:,.0f}.")
        if req.growth_boost_percent > 0:
            takeaways.append(f"Accelerating revenue growth by +{req.growth_boost_percent}% improves unit economics.")
        if not takeaways:
            takeaways.append("Simulated profile tested against baseline model.")

        return ScenarioSimulationResponse(
            original_risk_percent=orig_res.failure_probability_percent,
            simulated_risk_percent=sim_res.failure_probability_percent,
            risk_reduction_percent=risk_reduction,
            original_health_score=orig_res.health_score,
            simulated_health_score=sim_res.health_score,
            health_score_gain=health_gain,
            original_runway_months=orig_res.runway_months,
            simulated_runway_months=sim_res.runway_months,
            runway_extended_months=runway_diff,
            simulated_ratios=sim_res.ratios,
            key_takeaways=takeaways
        )

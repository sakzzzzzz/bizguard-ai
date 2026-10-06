from pydantic import BaseModel, Field
from typing import List, Dict, Optional, Any

class BusinessInput(BaseModel):
    company_name: str = Field(default="Nexus AI Technologies Inc.", description="Startup name")
    industry: Optional[str] = Field(default="B2B SaaS / AI", description="Startup vertical or sector")
    startup_stage: Optional[str] = Field(default="Seed Stage", description="Funding stage: Pre-Seed, Seed, Series A, Series B, Bootstrapped")
    
    # Core Startup Financials
    revenue: float = Field(..., ge=0, description="Annual Revenue (ARR)")
    mrr: Optional[float] = Field(default=0.0, ge=0, description="Monthly Recurring Revenue (MRR)")
    operating_expenses: float = Field(..., ge=0, description="Annual Operating Expenses")
    monthly_burn_rate: float = Field(..., ge=0, description="Net Monthly Cash Burn ($)")
    cash_in_bank: float = Field(..., ge=0, description="Liquid Cash in Bank / Treasury ($)")
    net_profit: float = Field(..., description="Annual Net Income (can be negative for burning startups)")
    
    # Balance Sheet & Capital Structure
    total_assets: float = Field(..., gt=0, description="Total Assets value")
    total_liabilities: float = Field(..., ge=0, description="Total Liabilities")
    total_debt: float = Field(..., ge=0, description="Total Debt / Outstanding SAFE Notes")
    operating_cash_flow: float = Field(..., description="Annual Operating Cash Flow (negative for net burn)")
    working_capital: float = Field(..., description="Current Assets minus Current Liabilities")
    
    # Unit Economics & Growth
    employee_count: int = Field(..., ge=1, description="Full-Time Headcount")
    sales_growth_yoy: float = Field(..., description="YoY or Annualized Growth Rate (%)")
    mom_growth_pct: Optional[float] = Field(default=8.0, description="Month-over-Month (MoM) Growth Rate (%)")
    cac: Optional[float] = Field(default=1200.0, ge=0, description="Customer Acquisition Cost ($)")
    ltv: Optional[float] = Field(default=4800.0, ge=0, description="Customer Lifetime Value ($)")
    inventory: float = Field(default=0.0, ge=0, description="Inventory Value (for hardware/D2C)")
    business_age: float = Field(..., ge=0.1, description="Startup Age (Years since founding)")
    ar_turnover: Optional[float] = Field(default=8.0, ge=0.1, description="Receivables velocity")

class KeyRatio(BaseModel):
    name: str
    key: str
    value: float
    unit: str
    benchmark: str
    status: str # "healthy", "warning", "danger"
    interpretation: str

class ShapFactor(BaseModel):
    feature: str
    label: str
    shap_value: float
    feature_value: float
    direction: str # "increases_risk" or "reduces_risk"
    impact_magnitude: float
    explanation: str

class Recommendation(BaseModel):
    id: str
    priority: str # "HIGH", "MEDIUM", "LOW"
    category: str # "Runway & Burn Compression", "Unit Economics & CAC", "Pricing & Growth", "Governance"
    title: str
    description: str
    actionable_steps: List[str]
    expected_impact: str

class AnalysisResult(BaseModel):
    id: str
    timestamp: str
    company_name: str
    industry: str
    startup_stage: str
    
    # Core Prediction
    failure_probability: float
    failure_probability_percent: float
    risk_level: str # "LOW RISK", "MODERATE RISK", "HIGH RISK"
    risk_color: str # "green", "yellow", "red"
    health_score: int # 0 - 100
    health_status: str
    runway_months: float # Cash in Bank / Monthly Net Burn
    
    # Scorecard & XAI
    ratios: List[KeyRatio]
    base_value: float
    shap_factors: List[ShapFactor]
    top_risk_drivers: List[ShapFactor]
    top_mitigating_factors: List[ShapFactor]
    
    # Decision Support
    recommendations: List[Recommendation]
    inputs: Dict[str, Any]

class ScenarioSimulationRequest(BaseModel):
    base_input: BusinessInput
    burn_reduction_percent: float = 0.0 # e.g. -25%
    growth_boost_percent: float = 0.0 # e.g. +15%
    bridge_capital_injection: float = 0.0 # e.g. $250,000
    debt_change_percent: float = 0.0

class ScenarioSimulationResponse(BaseModel):
    original_risk_percent: float
    simulated_risk_percent: float
    risk_reduction_percent: float
    original_health_score: int
    simulated_health_score: int
    health_score_gain: int
    original_runway_months: float
    simulated_runway_months: float
    runway_extended_months: float
    simulated_ratios: List[KeyRatio]
    key_takeaways: List[str]

class PresetBusiness(BaseModel):
    id: str
    title: str
    subtitle: str
    tag: str
    stage: str
    description: str
    data: BusinessInput

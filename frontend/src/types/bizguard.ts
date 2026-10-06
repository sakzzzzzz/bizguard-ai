export interface BusinessInput {
  company_name: string;
  industry?: string;
  startup_stage?: string; // Pre-Seed, Seed, Series A, Series B, Bootstrapped, Supermarket, Retail, Cafe, Manufacturing
  business_type?: 'tech_startup' | 'supermarket' | 'retail_shop' | 'cafe_restaurant' | 'manufacturing_sme';
  revenue: number; // ARR or Annual Gross Sales
  mrr?: number;
  operating_expenses: number;
  monthly_burn_rate: number;
  cash_in_bank: number;
  net_profit: number;
  total_assets: number;
  total_liabilities: number;
  total_debt: number;
  operating_cash_flow: number;
  working_capital: number;
  employee_count: number;
  sales_growth_yoy: number;
  mom_growth_pct?: number;
  cac?: number;
  ltv?: number;
  inventory?: number;
  business_age: number;
  ar_turnover?: number;
  // Retail & Supermarket additions
  daily_cash_inflow?: number;
  daily_upi_card_inflow?: number;
  upcoming_supplier_dues_7d?: number;
  inventory_turnover_days?: number;
  deadstock_percent?: number;
  accounts_receivable_delay_days?: number;
}

export interface KeyRatio {
  name: string;
  key: string;
  value: number;
  unit: string;
  benchmark: string;
  status: 'healthy' | 'warning' | 'danger';
  interpretation: string;
}

export interface ShapFactor {
  feature: string;
  label: string;
  shap_value: number;
  feature_value: number;
  direction: 'increases_risk' | 'reduces_risk';
  impact_magnitude: number;
  explanation: string;
}

export interface Recommendation {
  id: string;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  category: string;
  title: string;
  description: string;
  actionable_steps: string[];
  expected_impact: string;
}

export interface AnalysisResult {
  id: string;
  timestamp: string;
  company_name: string;
  industry: string;
  startup_stage: string;
  business_type?: BusinessSector;
  failure_probability: number;
  failure_probability_percent: number;
  risk_level: 'LOW RISK' | 'MODERATE RISK' | 'HIGH RISK';
  risk_color: 'green' | 'yellow' | 'red';
  health_score: number;
  health_status: string;
  runway_months: number;
  ratios: KeyRatio[];
  base_value: number;
  shap_factors: ShapFactor[];
  top_risk_drivers: ShapFactor[];
  top_mitigating_factors: ShapFactor[];
  recommendations: Recommendation[];
  inputs: Record<string, any>;
}

export interface PresetBusiness {
  id: string;
  title: string;
  subtitle: string;
  tag: string;
  stage: string;
  sector: BusinessSector;
  description: string;
  data: BusinessInput;
}

export interface ScenarioSimulationRequest {
  base_input: BusinessInput;
  burn_reduction_percent: number;
  growth_boost_percent: number;
  bridge_capital_injection: number;
  debt_change_percent?: number;
}

export interface ScenarioSimulationResponse {
  original_risk_percent: number;
  simulated_risk_percent: number;
  risk_reduction_percent: number;
  original_health_score: number;
  simulated_health_score: number;
  health_score_gain: number;
  original_runway_months: number;
  simulated_runway_months: number;
  runway_extended_months: number;
  simulated_ratios: KeyRatio[];
  key_takeaways: string[];
}

export interface ModelMetrics {
  model_name: string;
  algorithm_params: Record<string, any>;
  accuracy: number;
  precision: number;
  recall: number;
  f1_score: number;
  roc_auc: number;
  confusion_matrix: {
    true_negatives: number;
    false_positives: number;
    false_negatives: number;
    true_positives: number;
  };
  feature_importances: Array<{ feature: string; importance: number }>;
  roc_curve: Array<{ fpr: number; tpr: number }>;
  sample_counts: {
    total_samples: number;
    train_samples: number;
    test_samples: number;
    positive_rate_percent: number;
  };
}

// -------------------------------------------------------------
// Commercial & Real-Time Operational Types
// -------------------------------------------------------------
export type BusinessSector = 
  | 'tech_startup' 
  | 'supermarket' 
  | 'retail_shop' 
  | 'cafe_restaurant' 
  | 'manufacturing_sme';

export interface PosSettlement {
  date: string;
  cashInDrawer: number;
  digitalUpiCard: number;
  supplierPaidToday: number;
  dailyWagesExpenses: number;
  totalInflow: number;
  totalOutflow: number;
  netDailyMargin: number;
  footfallCount: number;
  notes?: string;
}

export interface SupplierDue {
  id: string;
  vendorName: string;
  category: string;
  amountDue: number;
  dueDate: string;
  daysRemaining: number;
  status: 'critical' | 'due_soon' | 'healthy';
}

export interface InventoryHealth {
  valuation: number;
  turnoverDays: number;
  deadstockPercent: number;
  capitalLocked: number;
  spoilageRisk: 'low' | 'moderate' | 'high';
}

export interface DailyCashForecast {
  dayLabel: string;
  date: string;
  projectedInflow: number;
  scheduledOutflow: number;
  netDayCash: number;
  projectedEndingBalance: number;
  isShortfall: boolean;
}

export interface LiveAlert {
  id: string;
  timestamp: string;
  channel: 'whatsapp' | 'push_alarm' | 'sms';
  title: string;
  message: string;
  severity: 'critical' | 'warning' | 'success' | 'info';
}

export interface LedgerDailyEntry {
  id: string;
  date: string;
  sales: number;
  expenses: number;
  netCash: number;
  footfallOrCustomers?: number;
  cashPortion?: number;
  digitalPortion?: number;
  notes?: string;
}

export interface LedgerMonthlyEntry {
  id: string;
  month: string;
  sales: number;
  payroll: number;
  marketing: number;
  cloudOrInventory: number;
  totalExpenses: number;
  netBurnOrProfit: number;
  endingCash: number;
  momGrowthPct: number;
}

export interface YearlyProjection {
  yearLabel: string;
  projectedSales: number;
  projectedExpenses: number;
  projectedEndingCash: number;
  runwayMonths: number;
  failureRiskPercent: number;
}

export type BusinessMode = 'tech_startup' | 'traditional_business';

export type ActivePage = 
  | 'landing' 
  | 'login' 
  | 'signup' 
  | 'dashboard' 
  | 'input' 
  | 'ledger'
  | 'prediction' 
  | 'shap' 
  | 'recommendations' 
  | 'reports' 
  | 'diagnostics';

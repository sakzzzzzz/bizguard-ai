import React, { useState, useEffect } from 'react';
import { ActivePage, BusinessInput as BusinessInputType, PresetBusiness } from '../types/bizguard';
import { STARTUP_PRESETS } from '../services/api';
import {
  Calculator,
  DollarSign,
  Rocket,
  Layers,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Activity,
  Clock,
  Flame,
  CheckCircle2
} from 'lucide-react';

interface BusinessInputProps {
  initialData?: BusinessInputType;
  companies?: PresetBusiness[];
  setActivePage: (page: ActivePage) => void;
  onSubmitAnalysis: (data: BusinessInputType) => Promise<void>;
  onOpenCreateCompany?: () => void;
}

export const BusinessInput: React.FC<BusinessInputProps> = ({
  initialData,
  companies = STARTUP_PRESETS,
  setActivePage,
  onSubmitAnalysis,
  onOpenCreateCompany
}) => {
  const defaultValues: BusinessInputType = initialData || {
    company_name: 'Nexus Generative AI Inc.',
    industry: 'Generative AI / B2B SaaS',
    startup_stage: 'Seed Stage',
    revenue: 480000,
    mrr: 40000,
    operating_expenses: 1920000,
    monthly_burn_rate: 120000,
    cash_in_bank: 450000,
    net_profit: -1440000,
    total_assets: 850000,
    total_liabilities: 620000,
    total_debt: 450000,
    operating_cash_flow: -1380000,
    working_capital: -120000,
    employee_count: 14,
    sales_growth_yoy: 18.0,
    mom_growth_pct: 4.2,
    cac: 2800,
    ltv: 3200,
    inventory: 0,
    business_age: 1.8,
    ar_turnover: 6.0
  };

  const [formData, setFormData] = useState<BusinessInputType>(defaultValues);
  const [activeTab, setActiveTab] = useState<'capital' | 'unit_econ'>('capital');
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const handleChange = (field: keyof BusinessInputType, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: typeof prev[field] === 'number' ? (parseFloat(value) || 0) : value
    }));
  };

  const handleApplyPreset = (preset: PresetBusiness) => {
    setFormData(preset.data);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSubmitAnalysis(formData);
      setActivePage('prediction');
    } catch (err) {
      alert('Error running startup analysis. Please check your inputs.');
    } finally {
      setLoading(false);
    }
  };

  // Live Auto-Computed Startup Ratios
  const liveMonthlyBurn = Math.max(formData.monthly_burn_rate, 1);
  const liveRunway = Math.round((formData.cash_in_bank / liveMonthlyBurn) * 10) / 10;
  const liveLtvCac = Math.round(((formData.ltv || 4800) / Math.max(formData.cac || 1200, 1)) * 100) / 100;
  const liveEquity = Math.max(formData.total_assets - formData.total_liabilities, 1000);
  const liveDebtToEquity = Math.round((formData.total_debt / liveEquity) * 100) / 100;
  const liveRuleOf40 = Math.round(((formData.mom_growth_pct || 8) * 12 * 0.5 + (formData.net_profit / Math.max(formData.revenue, 1)) * 100) * 10) / 10;
  const liveRevPerEmp = Math.round(formData.revenue / Math.max(formData.employee_count, 1));

  return (
    <div className="page-wrapper">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28, flexWrap: 'wrap', gap: 14 }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: '#60a5fa', fontWeight: 800, fontSize: 11, letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 6 }}>
            <Calculator size={14} /> Financial & Operational Analysis
          </div>
          <h1 style={{ fontSize: 32, fontWeight: 800, color: '#ffffff' }}>Input Business Financial Data</h1>
          <p style={{ color: '#94a3b8', fontSize: 15 }}>
            Analyze cash runway, unit economics, and failure probability using trained XGBoost and SHAP models.
          </p>
        </div>

        {onOpenCreateCompany && (
          <button className="btn-primary" onClick={onOpenCreateCompany} style={{ padding: '10px 20px', fontSize: 13.5 }}>
            + Quick Add New Business
          </button>
        )}
      </div>

      {/* 1-CLICK PRESET STARTUP CASE STUDIES */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
          <span style={{ fontSize: 12, fontWeight: 700, color: '#cbd5e1' }}>
            💡 Select Active Startup Profile to Audit or Modify:
          </span>
          {onOpenCreateCompany && (
            <button
              onClick={onOpenCreateCompany}
              style={{ background: 'transparent', color: '#60a5fa', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}
            >
              + Add Custom Venture
            </button>
          )}
        </div>
        <div className="grid-3">
          {companies.map((p) => {
            const isSelected = formData.company_name === p.data.company_name;
            return (
              <div
                key={p.id}
                className={`preset-card ${isSelected ? 'active' : ''}`}
                onClick={() => handleApplyPreset(p)}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                    <strong style={{ fontSize: 14, color: '#ffffff' }}>{p.title || p.data.company_name}</strong>
                    <span className={`risk-level-tag ${p.id.includes('critical') ? 'tag-red' : p.id.includes('series_a') ? 'tag-green' : 'tag-yellow'}`} style={{ fontSize: 10, padding: '2px 8px' }}>
                      {p.tag || p.stage}
                    </span>
                  </div>
                  <p style={{ fontSize: 12, color: '#94a3b8', lineHeight: 1.5, marginBottom: 10 }}>{p.description}</p>
                </div>
                <div style={{ fontSize: 11.5, fontWeight: 700, color: isSelected ? '#60a5fa' : '#64748b' }}>
                  {isSelected ? '✓ Profile Loaded' : 'Click to Load →'}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* FORM AND LIVE RATIO DUAL-COLUMN */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 0.8fr', gap: 28, alignItems: 'flex-start' }}>
        {/* INPUT FORM */}
        <div className="card">
          <div className="tabs-header">
            <button
              type="button"
              className={`tab-btn ${activeTab === 'capital' ? 'active' : ''}`}
              onClick={() => setActiveTab('capital')}
            >
              <Clock size={16} style={{ display: 'inline', marginRight: 6 }} /> Treasury, Burn & Runway
            </button>
            <button
              type="button"
              className={`tab-btn ${activeTab === 'unit_econ' ? 'active' : ''}`}
              onClick={() => setActiveTab('unit_econ')}
            >
              <Rocket size={16} style={{ display: 'inline', marginRight: 6 }} /> Unit Economics & Growth
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            {/* GENERAL BUSINESS INFO */}
            <div className="grid-2" style={{ marginBottom: 18 }}>
              <div className="input-field-group">
                <label>Business Name</label>
                <input
                  type="text"
                  className="form-control"
                  value={formData.company_name}
                  onChange={(e) => handleChange('company_name', e.target.value)}
                  required
                />
              </div>
              <div className="input-field-group">
                <label>Industry</label>
                <select
                  className="form-control"
                  value={formData.industry || 'Technology / AI'}
                  onChange={(e) => {
                    const val = e.target.value;
                    handleChange('industry', val);
                    if (val.includes('Retail')) handleChange('business_type', 'retail_shop');
                    else if (val.includes('Supermarket')) handleChange('business_type', 'supermarket');
                    else if (val.includes('Cafe') || val.includes('Restaurant')) handleChange('business_type', 'cafe_restaurant');
                    else if (val.includes('Manufacturing')) handleChange('business_type', 'manufacturing_sme');
                    else handleChange('business_type', 'tech_startup');
                  }}
                  style={{ background: '#1e293b' }}
                >
                  <option value="Technology / AI">Technology / AI</option>
                  <option value="Retail">Retail</option>
                  <option value="Supermarket">Supermarket</option>
                  <option value="Cafe / Restaurant">Cafe / Restaurant</option>
                  <option value="Manufacturing">Manufacturing</option>
                  <option value="Other SME">Other SME</option>
                </select>
              </div>
            </div>

            {/* TAB 1: CAPITAL, BURN & RUNWAY */}
            {activeTab === 'capital' && (
              <div>
                <div className="grid-2">
                  <div className="input-field-group">
                    <label>Cash in Bank Treasury ($)</label>
                    <input
                      type="number"
                      step="any"
                      className="form-control"
                      value={formData.cash_in_bank}
                      onChange={(e) => handleChange('cash_in_bank', e.target.value)}
                      required
                    />
                    <div className="help-text">Total liquid cash reserves available in bank.</div>
                  </div>

                  <div className="input-field-group">
                    <label>Monthly Net Cash Burn ($ / mo)</label>
                    <input
                      type="number"
                      step="any"
                      className="form-control"
                      value={formData.monthly_burn_rate}
                      onChange={(e) => handleChange('monthly_burn_rate', e.target.value)}
                      required
                    />
                    <div className="help-text">Net monthly cash loss (OPEX minus Revenue).</div>
                  </div>
                </div>

                <div className="grid-2">
                  <div className="input-field-group">
                    <label>Total Outstanding Debt & SAFE Notes ($)</label>
                    <input
                      type="number"
                      step="any"
                      className="form-control"
                      value={formData.total_debt}
                      onChange={(e) => handleChange('total_debt', e.target.value)}
                      required
                    />
                    <div className="help-text">Total venture debt, credit lines, and notes.</div>
                  </div>

                  <div className="input-field-group">
                    <label>Annual Operating Expenses ($ / yr)</label>
                    <input
                      type="number"
                      step="any"
                      className="form-control"
                      value={formData.operating_expenses}
                      onChange={(e) => handleChange('operating_expenses', e.target.value)}
                      required
                    />
                    <div className="help-text">Annual payroll, cloud hosting, and sales OPEX.</div>
                  </div>
                </div>

                <div className="grid-2">
                  <div className="input-field-group">
                    <label>Total Assets Valuation ($)</label>
                    <input
                      type="number"
                      step="any"
                      className="form-control"
                      value={formData.total_assets}
                      onChange={(e) => handleChange('total_assets', e.target.value)}
                      required
                    />
                    <div className="help-text">Cash, equipment, and capitalized IP assets.</div>
                  </div>

                  <div className="input-field-group">
                    <label>Total Liabilities ($)</label>
                    <input
                      type="number"
                      step="any"
                      className="form-control"
                      value={formData.total_liabilities}
                      onChange={(e) => handleChange('total_liabilities', e.target.value)}
                      required
                    />
                    <div className="help-text">Payables, notes, and debt obligations.</div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: UNIT ECONOMICS & GROWTH */}
            {activeTab === 'unit_econ' && (
              <div>
                <div className="grid-2">
                  <div className="input-field-group">
                    <label>Annual Recurring Revenue / ARR ($)</label>
                    <input
                      type="number"
                      step="any"
                      className="form-control"
                      value={formData.revenue}
                      onChange={(e) => handleChange('revenue', e.target.value)}
                      required
                    />
                    <div className="help-text">Current Annualized Run-Rate (MRR x 12).</div>
                  </div>

                  <div className="input-field-group">
                    <label>MoM Growth Velocity (%)</label>
                    <input
                      type="number"
                      step="any"
                      className="form-control"
                      value={formData.mom_growth_pct || 8.0}
                      onChange={(e) => handleChange('mom_growth_pct', e.target.value)}
                      required
                    />
                    <div className="help-text">Month-over-month revenue growth rate.</div>
                  </div>
                </div>

                <div className="grid-2">
                  <div className="input-field-group">
                    <label>Customer Acquisition Cost / CAC ($)</label>
                    <input
                      type="number"
                      step="any"
                      className="form-control"
                      value={formData.cac || 1200}
                      onChange={(e) => handleChange('cac', e.target.value)}
                      required
                    />
                    <div className="help-text">Blended marketing & sales spend per acquired customer.</div>
                  </div>

                  <div className="input-field-group">
                    <label>Customer Lifetime Value / LTV ($)</label>
                    <input
                      type="number"
                      step="any"
                      className="form-control"
                      value={formData.ltv || 4800}
                      onChange={(e) => handleChange('ltv', e.target.value)}
                      required
                    />
                    <div className="help-text">Gross profit contribution per customer lifetime.</div>
                  </div>
                </div>

                <div className="grid-2">
                  <div className="input-field-group">
                    <label>Full-Time Team Headcount</label>
                    <input
                      type="number"
                      className="form-control"
                      value={formData.employee_count}
                      onChange={(e) => handleChange('employee_count', e.target.value)}
                      required
                    />
                    <div className="help-text">Founders and full-time employees.</div>
                  </div>

                  <div className="input-field-group">
                    <label>Startup Operating Age (Years)</label>
                    <input
                      type="number"
                      step="any"
                      className="form-control"
                      value={formData.business_age}
                      onChange={(e) => handleChange('business_age', e.target.value)}
                      required
                    />
                    <div className="help-text">Years since venture founding.</div>
                  </div>
                </div>
              </div>
            )}

            <div style={{ marginTop: 26, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontSize: 12.5, color: '#94a3b8' }}>
                Indicators evaluated using XGBoost risk classification & SHAP explainability.
              </div>
              <button
                type="submit"
                className="btn-primary"
                disabled={loading}
                style={{ padding: '12px 28px', fontSize: 14.5, fontWeight: 700 }}
              >
                {loading ? (
                  <span>Analyzing with XGBoost & SHAP...</span>
                ) : (
                  <>
                    <Sparkles size={16} /> Run Business Risk Analysis <ArrowRight size={16} />
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* RIGHT: REAL-TIME STARTUP RATIO MONITOR */}
        <div className="card" style={{ background: 'rgba(15, 23, 42, 0.95)', border: '1px solid rgba(59, 130, 246, 0.3)' }}>
          <div className="card-header">
            <div className="card-title">
              <Activity size={18} color="#60a5fa" />
              <span>Live Runway & Unit Economics</span>
            </div>
            <span style={{ fontSize: 11, background: 'rgba(59, 130, 246, 0.2)', color: '#93c5fd', padding: '2px 8px', borderRadius: 4, fontWeight: 700 }}>
              Live Computed
            </span>
          </div>

          <p style={{ fontSize: 12.5, color: '#94a3b8', marginBottom: 16 }}>
            As you adjust variables, startup solvency indicators update in real-time:
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ padding: '12px 14px', background: 'rgba(255, 255, 255, 0.02)', borderRadius: 8, border: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#ffffff' }}>Liquid Cash Runway</div>
                <div style={{ fontSize: 11, color: '#94a3b8' }}>Cash in Bank / Monthly Burn</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{ fontFamily: 'JetBrains Mono', fontSize: 16, fontWeight: 800, color: liveRunway < 6 ? '#ef4444' : liveRunway < 12 ? '#f59e0b' : '#10b981' }}>
                  {liveRunway} Mos
                </span>
                <div style={{ fontSize: 10, fontWeight: 800, color: liveRunway < 6 ? '#ef4444' : liveRunway < 12 ? '#f59e0b' : '#10b981' }}>
                  {liveRunway < 6 ? '🔴 CRITICAL BURN' : liveRunway < 12 ? '🟡 WARNING ZONE' : '🟢 SAFE RUNWAY'}
                </div>
              </div>
            </div>

            <div style={{ padding: '12px 14px', background: 'rgba(255, 255, 255, 0.02)', borderRadius: 8, border: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#ffffff' }}>Unit Economics (LTV:CAC)</div>
                <div style={{ fontSize: 11, color: '#94a3b8' }}>Target &gt; 3.0x</div>
              </div>
              <span style={{ fontFamily: 'JetBrains Mono', fontSize: 15, fontWeight: 800, color: liveLtvCac >= 3 ? '#10b981' : '#ef4444' }}>
                {liveLtvCac.toFixed(2)}x
              </span>
            </div>

            <div style={{ padding: '12px 14px', background: 'rgba(255, 255, 255, 0.02)', borderRadius: 8, border: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#ffffff' }}>Rule of 40 SaaS Index</div>
                <div style={{ fontSize: 11, color: '#94a3b8' }}>Growth % + Margin %</div>
              </div>
              <span style={{ fontFamily: 'JetBrains Mono', fontSize: 15, fontWeight: 800, color: liveRuleOf40 >= 40 ? '#10b981' : '#f59e0b' }}>
                {liveRuleOf40.toFixed(1)} pts
              </span>
            </div>

            <div style={{ padding: '12px 14px', background: 'rgba(255, 255, 255, 0.02)', borderRadius: 8, border: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#ffffff' }}>ARR per Team Member</div>
                <div style={{ fontSize: 11, color: '#94a3b8' }}>Headcount efficiency</div>
              </div>
              <span style={{ fontFamily: 'JetBrains Mono', fontSize: 15, fontWeight: 800 }}>
                ${liveRevPerEmp.toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

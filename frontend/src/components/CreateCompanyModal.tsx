import React, { useState } from 'react';
import { BusinessInput, PresetBusiness } from '../types/bizguard';
import { X, PlusCircle, Building2, DollarSign, Rocket, Sparkles, Clock, Flame } from 'lucide-react';

interface CreateCompanyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddCompany: (company: PresetBusiness) => void;
}

export const CreateCompanyModal: React.FC<CreateCompanyModalProps> = ({
  isOpen,
  onClose,
  onAddCompany
}) => {
  const [name, setName] = useState('');
  const [industry, setIndustry] = useState('B2B SaaS / Enterprise Tech');
  const [stage, setStage] = useState('Seed Stage');
  const [cashInBank, setCashInBank] = useState(500000);
  const [monthlyBurn, setMonthlyBurn] = useState(80000);
  const [revenue, setRevenue] = useState(360000);
  const [cac, setCac] = useState(1800);
  const [ltv, setLtv] = useState(4800);
  const [momGrowth, setMomGrowth] = useState(10.0);
  const [employees, setEmployees] = useState(8);
  const [totalDebt, setTotalDebt] = useState(200000);

  if (!isOpen) return null;

  const estRunway = Math.round((cashInBank / Math.max(monthlyBurn, 1)) * 10) / 10;
  const estLtvCac = Math.round((ltv / Math.max(cac, 1)) * 100) / 100;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      alert('Please enter a company name.');
      return;
    }

    const opex = monthlyBurn * 12 + revenue * 0.4;
    const netProfit = revenue - opex;
    const assets = cashInBank + 150000;
    const liabilities = totalDebt + 50000;

    const newCompanyData: BusinessInput = {
      company_name: name.trim(),
      industry,
      startup_stage: stage,
      revenue,
      mrr: Math.round(revenue / 12),
      operating_expenses: opex,
      monthly_burn_rate: monthlyBurn,
      cash_in_bank: cashInBank,
      net_profit: netProfit,
      total_assets: assets,
      total_liabilities: liabilities,
      total_debt: totalDebt,
      operating_cash_flow: netProfit * 0.9,
      working_capital: cashInBank - totalDebt * 0.4,
      employee_count: employees,
      sales_growth_yoy: momGrowth * 12 * 0.6,
      mom_growth_pct: momGrowth,
      cac,
      ltv,
      inventory: 0,
      business_age: 1.5,
      ar_turnover: 8.0
    };

    const newPreset: PresetBusiness = {
      id: `custom_${Date.now()}`,
      title: `${name.trim()} (${stage})`,
      subtitle: `${estRunway} mo runway · $${(monthlyBurn / 1000).toFixed(0)}k/mo burn`,
      tag: estRunway < 6 ? 'HIGH RISK' : estRunway < 12 ? 'MODERATE RISK' : 'LOW RISK',
      stage,
      description: `Custom startup created in ${industry} with $${(cashInBank / 1000).toFixed(0)}k in bank treasury.`,
      data: newCompanyData
    };

    onAddCompany(newPreset);
    onClose();
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.75)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: 20
    }}>
      <div className="card" style={{
        width: '100%',
        maxWidth: 680,
        maxHeight: '90vh',
        overflowY: 'auto',
        background: '#0f172a',
        border: '1px solid rgba(59, 130, 246, 0.3)',
        boxShadow: '0 25px 60px rgba(0, 0, 0, 0.8)',
        padding: 32,
        borderRadius: 20
      }}>
        {/* MODAL HEADER */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-subtle)', paddingBottom: 16, marginBottom: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 34, height: 34, borderRadius: 10, background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <PlusCircle size={20} color="#ffffff" />
            </div>
            <div>
              <h2 style={{ fontSize: 20, fontWeight: 800, color: '#ffffff' }}>Add New Startup / Company</h2>
              <div style={{ fontSize: 12, color: '#94a3b8' }}>Create a custom venture profile to audit with XGBoost & SHAP</div>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{ background: 'transparent', color: '#94a3b8', padding: 6, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <X size={20} />
          </button>
        </div>

        {/* LIVE RUNWAY PREVIEW BAR */}
        <div style={{ background: 'rgba(59, 130, 246, 0.08)', border: '1px solid rgba(59, 130, 246, 0.25)', borderRadius: 12, padding: '12px 18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 22 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Clock size={16} color="#60a5fa" />
            <span style={{ fontSize: 13, color: '#cbd5e1' }}>Est. Liquid Runway:</span>
            <strong style={{ fontSize: 15, color: estRunway < 6 ? '#ef4444' : estRunway < 12 ? '#f59e0b' : '#34d399' }}>
              {estRunway} Months
            </strong>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Sparkles size={16} color="#a78bfa" />
            <span style={{ fontSize: 13, color: '#cbd5e1' }}>Est. Unit Economics (LTV:CAC):</span>
            <strong style={{ fontSize: 15, color: estLtvCac >= 3 ? '#34d399' : '#ef4444' }}>
              {estLtvCac}x
            </strong>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {/* 1. BASIC VENTURE INFO */}
          <div className="grid-2">
            <div className="input-field-group">
              <label>Startup Entity Name *</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. Acuity Robotics Inc."
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                autoFocus
              />
            </div>

            <div className="input-field-group">
              <label>Venture Stage</label>
              <select
                className="form-control"
                value={stage}
                onChange={(e) => setStage(e.target.value)}
                style={{ background: '#1e293b' }}
              >
                <option value="Pre-Seed">Pre-Seed Stage</option>
                <option value="Seed Stage">Seed Stage</option>
                <option value="Series A">Series A</option>
                <option value="Series B+">Series B+</option>
                <option value="Bootstrapped">Bootstrapped / Cash-Flowing</option>
              </select>
            </div>
          </div>

          <div className="grid-2">
            <div className="input-field-group">
              <label>Industry / Sector</label>
              <select
                className="form-control"
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                style={{ background: '#1e293b' }}
              >
                <option value="Generative AI / B2B SaaS">Generative AI / B2B SaaS</option>
                <option value="Cybersecurity / Cloud">Cybersecurity / Cloud</option>
                <option value="FinTech & Payments">FinTech & Payments</option>
                <option value="HealthTech & Bio">HealthTech & Bio</option>
                <option value="D2C / Sustainable E-Commerce">D2C / Sustainable E-Commerce</option>
                <option value="CleanTech & Energy">CleanTech & Energy</option>
                <option value="Enterprise DeepTech">Enterprise DeepTech</option>
              </select>
            </div>

            <div className="input-field-group">
              <label>Full-Time Team Headcount</label>
              <input
                type="number"
                className="form-control"
                value={employees}
                onChange={(e) => setEmployees(parseInt(e.target.value) || 1)}
                min="1"
              />
            </div>
          </div>

          {/* 2. FINANCIAL & RUNWAY METRICS */}
          <div className="grid-2">
            <div className="input-field-group">
              <label>Cash in Bank Treasury ($)</label>
              <input
                type="number"
                className="form-control"
                value={cashInBank}
                onChange={(e) => setCashInBank(parseFloat(e.target.value) || 0)}
                required
              />
            </div>

            <div className="input-field-group">
              <label>Monthly Net Cash Burn ($ / mo)</label>
              <input
                type="number"
                className="form-control"
                value={monthlyBurn}
                onChange={(e) => setMonthlyBurn(parseFloat(e.target.value) || 1)}
                required
              />
            </div>
          </div>

          <div className="grid-2">
            <div className="input-field-group">
              <label>Annual Recurring Revenue / ARR ($)</label>
              <input
                type="number"
                className="form-control"
                value={revenue}
                onChange={(e) => setRevenue(parseFloat(e.target.value) || 0)}
              />
            </div>

            <div className="input-field-group">
              <label>Total Debt & SAFE Notes ($)</label>
              <input
                type="number"
                className="form-control"
                value={totalDebt}
                onChange={(e) => setTotalDebt(parseFloat(e.target.value) || 0)}
              />
            </div>
          </div>

          {/* 3. UNIT ECONOMICS & GROWTH */}
          <div className="grid-3">
            <div className="input-field-group">
              <label>CAC ($)</label>
              <input
                type="number"
                className="form-control"
                value={cac}
                onChange={(e) => setCac(parseFloat(e.target.value) || 1)}
              />
            </div>

            <div className="input-field-group">
              <label>LTV ($)</label>
              <input
                type="number"
                className="form-control"
                value={ltv}
                onChange={(e) => setLtv(parseFloat(e.target.value) || 1)}
              />
            </div>

            <div className="input-field-group">
              <label>MoM Growth (%)</label>
              <input
                type="number"
                step="0.1"
                className="form-control"
                value={momGrowth}
                onChange={(e) => setMomGrowth(parseFloat(e.target.value) || 0)}
              />
            </div>
          </div>

          {/* MODAL FOOTER */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 24, borderTop: '1px solid var(--border-subtle)', paddingTop: 16 }}>
            <button
              type="button"
              className="btn-secondary"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary"
              style={{ padding: '10px 24px' }}
            >
              <Rocket size={16} /> Save & Run AI Audit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

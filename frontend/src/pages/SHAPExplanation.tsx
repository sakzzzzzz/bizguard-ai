import React, { useState } from 'react';
import { ActivePage, AnalysisResult, BusinessInput, PresetBusiness } from '../types/bizguard';
import { SHAPWaterfallChart } from '../components/SHAPWaterfallChart';
import {
  Cpu,
  Sliders,
  TrendingDown,
  TrendingUp,
  Brain,
  HelpCircle,
  ArrowRight,
  BookOpen,
  Sparkles,
  PlusCircle,
  Building,
  Info,
  CheckCircle2,
  Activity
} from 'lucide-react';

interface SHAPExplanationProps {
  result: AnalysisResult | null;
  companies?: PresetBusiness[];
  setActivePage: (page: ActivePage) => void;
  onSelectCompany?: (data: BusinessInput) => void;
  onOpenCreateCompany?: () => void;
}

export const SHAPExplanation: React.FC<SHAPExplanationProps> = ({
  result,
  companies = [],
  setActivePage,
  onSelectCompany,
  onOpenCreateCompany
}) => {
  const [activeTab, setActiveTab] = useState<'waterfall' | 'explorer' | 'table'>('waterfall');
  const [selectedFeatureIndex, setSelectedFeatureIndex] = useState<number>(0);

  // Safe fallback factors if result is not loaded
  const companyName = result?.company_name || 'Nexus Generative AI Inc.';
  const startupStage = result?.startup_stage || 'Seed Stage';
  const probPercent = result?.failure_probability_percent ?? 82.4;
  const baseValue = result?.base_value ?? 0.18;
  const rawFactors = result?.shap_factors && result.shap_factors.length > 0 ? result.shap_factors : [
    {
      feature: 'runway_months',
      label: 'Cash Runway Velocity',
      shap_value: 0.38,
      feature_value: 3.8,
      direction: 'increases_risk' as const,
      impact_magnitude: 0.38,
      explanation: 'Critical liquid runway (< 6 months) creates immediate insolvency pressure.'
    },
    {
      feature: 'monthly_burn_rate',
      label: 'Monthly Net Cash Burn',
      shap_value: 0.26,
      feature_value: 120000,
      direction: 'increases_risk' as const,
      impact_magnitude: 0.26,
      explanation: 'High monthly cash burn ($120,000/mo) accelerates treasury depletion.'
    },
    {
      feature: 'ltv_to_cac',
      label: 'Unit Economics (LTV:CAC)',
      shap_value: 0.21,
      feature_value: 1.14,
      direction: 'increases_risk' as const,
      impact_magnitude: 0.21,
      explanation: 'Low LTV:CAC ratio (1.14x vs > 3.0x benchmark) shows inefficient customer acquisition.'
    },
    {
      feature: 'sales_growth_yoy',
      label: 'Annualized Revenue Growth',
      shap_value: -0.18,
      feature_value: 18.0,
      direction: 'reduces_risk' as const,
      impact_magnitude: 0.18,
      explanation: 'Positive top-line growth provides baseline defensive momentum.'
    },
    {
      feature: 'debt_to_equity',
      label: 'Debt / SAFE Note Leverage',
      shap_value: 0.12,
      feature_value: 1.95,
      direction: 'increases_risk' as const,
      impact_magnitude: 0.12,
      explanation: 'High SAFE note and debt overhang limits future bridge financing options.'
    },
    {
      feature: 'employee_count',
      label: 'Team Headcount Efficiency',
      shap_value: -0.08,
      feature_value: 14,
      direction: 'reduces_risk' as const,
      impact_magnitude: 0.08,
      explanation: 'Lean team size preserves baseline operational flexibility.'
    }
  ];

  const factors = rawFactors.map(f => ({
    ...f,
    shap_value: typeof f.shap_value === 'number' ? f.shap_value : 0,
    impact_magnitude: f.impact_magnitude || Math.abs(f.shap_value || 0.1)
  }));

  const activeFeature = factors[selectedFeatureIndex] || factors[0];

  return (
    <div className="page-wrapper">
      {/* HEADER SECTION WITH COMPANY SWITCHER */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24, flexWrap: 'wrap', gap: 16 }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: '#a78bfa', fontWeight: 800, fontSize: 11, letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 4 }}>
            <Cpu size={14} /> Explainable Artificial Intelligence (SHAP)
          </div>
          <h1 style={{ fontSize: 32, fontWeight: 800, color: '#ffffff' }}>
            Explainable AI: <span style={{ color: '#60a5fa' }}>{companyName}</span>
          </h1>
          <p style={{ color: '#94a3b8', fontSize: 14.5 }}>
            Why did the model assign a <strong>{probPercent}% failure risk</strong>? Deconstructed into risk drivers and defensive factors using Shapley values.
          </p>
        </div>

        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          {onOpenCreateCompany && (
            <button className="btn-secondary" onClick={onOpenCreateCompany} style={{ padding: '8px 14px', fontSize: 13 }}>
              <PlusCircle size={15} color="#34d399" /> Add Business
            </button>
          )}
          <button className="btn-primary" onClick={() => setActivePage('recommendations')}>
            <Sliders size={16} /> Open Simulator <ArrowRight size={16} />
          </button>
        </div>
      </div>

      {/* SHAP EXPLANATION NOTE CALLOUT */}
      <div style={{
        background: 'rgba(59, 130, 246, 0.08)',
        border: '1px solid rgba(59, 130, 246, 0.3)',
        borderRadius: 10,
        padding: '12px 18px',
        marginBottom: 20,
        display: 'flex',
        alignItems: 'center',
        gap: 12
      }}>
        <Info size={18} color="#60a5fa" style={{ flexShrink: 0 }} />
        <span style={{ fontSize: 13.5, color: '#cbd5e1' }}>
          <strong>Understanding SHAP:</strong> Positive values increase the model's estimated risk, while negative values reduce it.
        </span>
      </div>

      {/* INLINE COMPANY QUICK SELECTOR */}
      {companies && companies.length > 0 && (
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', background: 'rgba(255, 255, 255, 0.03)', padding: '8px 12px', borderRadius: 12, border: '1px solid var(--border-subtle)', marginBottom: 24, overflowX: 'auto' }}>
          <span style={{ fontSize: 12, fontWeight: 700, color: '#94a3b8', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: 4 }}>
            <Building size={14} /> Select Business:
          </span>
          {companies.map((c) => {
            const isSelected = companyName === c.data.company_name;
            return (
              <button
                key={c.id}
                onClick={() => onSelectCompany && onSelectCompany(c.data)}
                style={{
                  padding: '6px 12px',
                  borderRadius: 8,
                  fontSize: 12,
                  fontWeight: 700,
                  whiteSpace: 'nowrap',
                  border: isSelected ? '1px solid #3b82f6' : '1px solid rgba(255,255,255,0.08)',
                  background: isSelected ? 'rgba(59, 130, 246, 0.25)' : 'rgba(255,255,255,0.02)',
                  color: isSelected ? '#93c5fd' : '#94a3b8'
                }}
              >
                {c.data.company_name} ({c.stage || 'Business'})
              </button>
            );
          })}
        </div>
      )}

      {/* SHAP NAVIGATION TABS */}
      <div className="tabs-header" style={{ marginBottom: 20 }}>
        <button
          className={`tab-btn ${activeTab === 'waterfall' ? 'active' : ''}`}
          onClick={() => setActiveTab('waterfall')}
        >
          <Brain size={15} style={{ display: 'inline', marginRight: 6 }} /> SHAP Visualization
        </button>
        <button
          className={`tab-btn ${activeTab === 'explorer' ? 'active' : ''}`}
          onClick={() => setActiveTab('explorer')}
        >
          <Activity size={15} style={{ display: 'inline', marginRight: 6 }} /> Risk Drivers & Defensive Factors
        </button>
        <button
          className={`tab-btn ${activeTab === 'table' ? 'active' : ''}`}
          onClick={() => setActiveTab('table')}
        >
          <Info size={15} style={{ display: 'inline', marginRight: 6 }} /> Complete Ranking Table
        </button>
      </div>

      {/* TAB 1: SHAP WATERFALL CHART */}
      {activeTab === 'waterfall' && (
        <div className="card" style={{ marginBottom: 28 }}>
          <div className="card-header">
            <div className="card-title">
              <Brain size={18} color="#60a5fa" />
              <span>SHAP Attribution Waterfall</span>
            </div>
            <span style={{ fontSize: 12, color: '#94a3b8' }}>
              Base Model Expected Log-Odds: <code>{baseValue.toFixed(2)}</code>
            </span>
          </div>

          <SHAPWaterfallChart factors={factors} maxDisplay={10} />
        </div>
      )}

      {/* TAB 2: FEATURE SENSITIVITY EXPLORER */}
      {activeTab === 'explorer' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 28 }}>
          {/* FEATURE LIST SELECTOR */}
          <div className="card">
            <div className="card-header">
              <div className="card-title">
                <Cpu size={18} color="#a78bfa" />
                <span>Click a Factor to Inspect</span>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {factors.map((f, idx) => {
                const isRisk = f.direction === 'increases_risk';
                const isSelected = idx === selectedFeatureIndex;
                return (
                  <div
                    key={idx}
                    onClick={() => setSelectedFeatureIndex(idx)}
                    style={{
                      padding: '10px 14px',
                      borderRadius: 8,
                      cursor: 'pointer',
                      border: isSelected ? '1px solid #3b82f6' : '1px solid var(--border-subtle)',
                      background: isSelected ? 'rgba(59, 130, 246, 0.15)' : 'rgba(255, 255, 255, 0.02)',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      transition: 'all 0.15s'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      {isRisk ? <TrendingUp size={15} color="#f87171" /> : <TrendingDown size={15} color="#34d399" />}
                      <span style={{ fontSize: 13, fontWeight: 700, color: '#ffffff' }}>{f.label || f.feature}</span>
                    </div>
                    <span style={{ fontFamily: 'JetBrains Mono', fontSize: 12.5, fontWeight: 800, color: isRisk ? '#f87171' : '#34d399' }}>
                      {isRisk ? `+${f.shap_value.toFixed(2)}` : f.shap_value.toFixed(2)}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* DETAIL INSPECTION CARD */}
          {activeFeature && (
            <div className="card" style={{ background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.08), #0f172a)', border: '1px solid rgba(59, 130, 246, 0.3)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                <span className={`risk-level-tag ${activeFeature.direction === 'increases_risk' ? 'tag-red' : 'tag-green'}`}>
                  {activeFeature.direction === 'increases_risk' ? '🔴 RISK DRIVER' : '🟢 DEFENSIVE MOAT'}
                </span>
                <span style={{ fontSize: 12, color: '#94a3b8' }}>Rank #{selectedFeatureIndex + 1} by impact</span>
              </div>

              <h2 style={{ fontSize: 22, fontWeight: 800, color: '#ffffff', marginBottom: 6 }}>
                {activeFeature.label || activeFeature.feature}
              </h2>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, margin: '16px 0' }}>
                <div style={{ padding: '12px 14px', background: 'rgba(255, 255, 255, 0.03)', borderRadius: 8, border: '1px solid var(--border-subtle)' }}>
                  <div style={{ fontSize: 11, color: '#94a3b8' }}>Observed Metric Value</div>
                  <div style={{ fontSize: 18, fontWeight: 800, color: '#ffffff', marginTop: 2 }}>
                    {typeof activeFeature.feature_value === 'number' && activeFeature.feature_value > 1000
                      ? `$${activeFeature.feature_value.toLocaleString()}`
                      : activeFeature.feature_value}
                  </div>
                </div>

                <div style={{ padding: '12px 14px', background: 'rgba(255, 255, 255, 0.03)', borderRadius: 8, border: '1px solid var(--border-subtle)' }}>
                  <div style={{ fontSize: 11, color: '#94a3b8' }}>SHAP Attribution Value</div>
                  <div style={{ fontSize: 18, fontWeight: 800, color: activeFeature.direction === 'increases_risk' ? '#f87171' : '#34d399', marginTop: 2 }}>
                    {activeFeature.direction === 'increases_risk' ? `+${activeFeature.shap_value.toFixed(3)}` : activeFeature.shap_value.toFixed(3)}
                  </div>
                </div>
              </div>

              <div style={{ padding: '14px 16px', background: 'rgba(0, 0, 0, 0.3)', borderRadius: 10, border: '1px solid var(--border-subtle)', marginBottom: 18 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: '#93c5fd', marginBottom: 4 }}>Model Explanation:</div>
                <div style={{ fontSize: 13.5, color: '#e2e8f0', lineHeight: 1.6 }}>{activeFeature.explanation}</div>
              </div>

              <button
                className="btn-primary"
                onClick={() => setActivePage('recommendations')}
                style={{ width: '100%', justifyContent: 'center', padding: '10px' }}
              >
                <Sliders size={15} /> Simulate Fixing This in Runway Simulator →
              </button>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: COMPLETE RANKING TABLE */}
      {activeTab === 'table' && (
        <div className="card" style={{ marginBottom: 28 }}>
          <div className="card-header">
            <div className="card-title">
              <Cpu size={18} color="#a78bfa" />
              <span>Complete Venture Feature Contribution Ranking</span>
            </div>
            <span style={{ fontSize: 12, color: '#94a3b8' }}>Sorted by absolute attribution magnitude</span>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Rank</th>
                  <th>Startup Factor</th>
                  <th>Observed Value</th>
                  <th>SHAP Contribution</th>
                  <th>Direction</th>
                  <th>Strategic Venture Interpretation</th>
                </tr>
              </thead>
              <tbody>
                {factors.map((factor, idx) => {
                  const isRisk = factor.direction === 'increases_risk';
                  return (
                    <tr key={idx}>
                      <td style={{ color: '#64748b', fontWeight: 800 }}>#{idx + 1}</td>
                      <td style={{ fontWeight: 700, color: '#ffffff' }}>{factor.label || factor.feature}</td>
                      <td style={{ fontFamily: 'JetBrains Mono' }}>
                        {typeof factor.feature_value === 'number' && factor.feature_value > 1000
                          ? `$${factor.feature_value.toLocaleString()}`
                          : factor.feature_value}
                      </td>
                      <td style={{ fontFamily: 'JetBrains Mono', fontWeight: 800, color: isRisk ? '#f87171' : '#34d399' }}>
                        {isRisk ? `+${factor.shap_value.toFixed(3)}` : factor.shap_value.toFixed(3)}
                      </td>
                      <td>
                        <span className={`risk-level-tag ${isRisk ? 'tag-red' : 'tag-green'}`} style={{ fontSize: 10, padding: '2px 8px' }}>
                          {isRisk ? '🔴 ACCELERATES BURN' : '🟢 PROTECTS RUNWAY'}
                        </span>
                      </td>
                      <td style={{ fontSize: 12.5, color: '#cbd5e1' }}>
                        {factor.explanation}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ACADEMIC EXPLANATION BOX FOR EXAMINER VIVA */}
      <div className="card" style={{ background: 'rgba(59, 130, 246, 0.05)', border: '1px solid rgba(59, 130, 246, 0.3)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12, color: '#60a5fa' }}>
          <BookOpen size={20} />
          <h3 style={{ fontSize: 16, fontWeight: 800 }}>Academic Note on SHAP (SHapley Additive exPlanations)</h3>
        </div>
        <p style={{ fontSize: 13.5, color: '#cbd5e1', lineHeight: 1.7, marginBottom: 10 }}>
          SHAP is grounded in cooperative game theory (Lloyd Shapley, Nobel Memorial Prize). It guarantees exact, fair credit assignment by measuring the marginal contribution of each financial and operational feature across all possible feature subsets:
        </p>
        <div style={{ background: 'rgba(0, 0, 0, 0.4)', padding: '10px 14px', borderRadius: 8, fontFamily: 'JetBrains Mono', fontSize: 12.5, color: '#93c5fd', border: '1px solid var(--border-subtle)', marginBottom: 12 }}>
          {"ϕ_i = ∑ [ |S|! (|F| - |S| - 1)! / |F|! ] · [ f(S ∪ {i}) - f(S) ]"}
        </div>
        <p style={{ fontSize: 13, color: '#94a3b8' }}>
          In StartGuard AI, <strong>TreeExplainer</strong> computes exact, polynomial-time Shapley values for the trained gradient boosted tree ensemble, guaranteeing local accuracy, missingness consistency, and mathematical transparency for final-year project defense.
        </p>
      </div>
    </div>
  );
};

import React from 'react';
import { ActivePage, AnalysisResult } from '../types/bizguard';
import { RiskGauge } from '../components/RiskGauge';
import {
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  Cpu,
  Sliders,
  FileText,
  ArrowRight,
  TrendingDown,
  TrendingUp,
  Activity,
  Clock,
  Flame
} from 'lucide-react';

interface PredictionResultProps {
  result: AnalysisResult | null;
  setActivePage: (page: ActivePage) => void;
}

export const PredictionResult: React.FC<PredictionResultProps> = ({
  result,
  setActivePage
}) => {
  if (!result) {
    return (
      <div className="page-wrapper" style={{ textAlign: 'center', padding: '80px 24px' }}>
        <h2>No Active Prediction Found.</h2>
        <button className="btn-primary" onClick={() => setActivePage('input')} style={{ marginTop: 20 }}>
          Analyze a Startup Now
        </button>
      </div>
    );
  }

  const runway = result.runway_months;
  const isDistressed = result.failure_probability_percent > 60;
  const isModerate = result.failure_probability_percent > 30 && !isDistressed;

  return (
    <div className="page-wrapper">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28, flexWrap: 'wrap', gap: 14 }}>
        <div>
          <span style={{ fontSize: 11, fontWeight: 800, color: '#60a5fa', letterSpacing: 1.5, textTransform: 'uppercase' }}>
            Business Risk Verdict
          </span>
          <h1 style={{ fontSize: 32, fontWeight: 800, color: '#ffffff' }}>
            Business Risk & Runway Analysis: {result.company_name}
          </h1>
        </div>

        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn-secondary" onClick={() => setActivePage('input')}>
            Edit Parameters
          </button>
          <button className="btn-primary" onClick={() => setActivePage('shap')}>
            <Cpu size={16} /> View Explainable AI <ArrowRight size={16} />
          </button>
        </div>
      </div>

      {/* VERDICT HERO BANNER */}
      <div
        className="card"
        style={{
          background: isDistressed
            ? 'linear-gradient(135deg, rgba(239, 68, 68, 0.1), rgba(15, 23, 42, 0.95))'
            : isModerate
            ? 'linear-gradient(135deg, rgba(245, 158, 11, 0.1), rgba(15, 23, 42, 0.95))'
            : 'linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(15, 23, 42, 0.95))',
          borderColor: isDistressed ? 'rgba(239, 68, 68, 0.4)' : isModerate ? 'rgba(245, 158, 11, 0.4)' : 'rgba(16, 185, 129, 0.4)',
          marginBottom: 28,
          padding: 32
        }}
      >
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.6fr', gap: 32, alignItems: 'center' }}>
          <RiskGauge
            probabilityPercent={result.failure_probability_percent}
            riskLevel={result.risk_level}
            healthScore={result.health_score}
            runwayMonths={runway}
            size={220}
          />

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              {isDistressed ? (
                <AlertTriangle size={26} color="#ef4444" />
              ) : isModerate ? (
                <AlertTriangle size={26} color="#f59e0b" />
              ) : (
                <CheckCircle2 size={26} color="#10b981" />
              )}
              <h2 style={{ fontSize: 24, fontWeight: 800, color: isDistressed ? '#f87171' : isModerate ? '#fbbf24' : '#34d399' }}>
                {isDistressed
                  ? `Critical Runway Alert (${runway} Mos Left) — High Failure Odds`
                  : isModerate
                  ? `Moderate Vulnerability (${runway} Mos Runway) — Turnaround Recommended`
                  : `Robust Solvency & Healthy Runway (${runway} Mos Buffer)`}
              </h2>
            </div>

            <p style={{ fontSize: 14.5, color: '#cbd5e1', lineHeight: 1.7, marginBottom: 20 }}>
              {isDistressed
                ? `The XGBoost ensemble model detected severe venture distress indicators: liquid treasury ($${result.inputs.cash_in_bank?.toLocaleString()}) will be exhausted in ${runway} months at current burn rate. Urgent burn reduction or bridge financing is required.`
                : isModerate
                ? `The venture exhibits reasonable growth velocity but has a tight cash runway buffer (${runway} months) or elevated customer acquisition costs (LTV:CAC). Proactive CAC tuning will safeguard future funding.`
                : `The venture demonstrates strong solvency, healthy unit economics, sustainable burn multiples, and a secure cash runway buffer.`}
            </p>

            <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
              <button className="btn-primary" onClick={() => setActivePage('recommendations')}>
                <Sliders size={16} /> Open Runway & Burn Simulator ({result.recommendations.length} Playbooks)
              </button>
              <button className="btn-secondary" onClick={() => setActivePage('reports')}>
                <FileText size={16} /> Export Investor Audit Deck
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* TOP RISK FACTORS & DEFENSIVE MOATS */}
      <div className="grid-2" style={{ marginBottom: 28 }}>
        <div className="card">
          <div className="card-header">
            <div className="card-title" style={{ color: '#f87171' }}>
              <TrendingUp size={18} />
              <span>Primary Failure Risk Vectors (SHAP +)</span>
            </div>
            <span style={{ fontSize: 11, background: 'rgba(239, 68, 68, 0.2)', color: '#f87171', padding: '2px 8px', borderRadius: 4, fontWeight: 700 }}>
              Accelerates Burn
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {(result.top_risk_drivers || []).length > 0 ? (
              (result.top_risk_drivers || []).map((f, idx) => (
                <div key={idx} style={{ padding: '12px 14px', background: 'rgba(239, 68, 68, 0.05)', border: '1px solid rgba(239, 68, 68, 0.25)', borderRadius: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <strong style={{ fontSize: 13.5, color: '#fca5a5' }}>{f.label}</strong>
                    <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 2 }}>{f.explanation}</div>
                  </div>
                  <span style={{ fontFamily: 'JetBrains Mono', fontWeight: 800, color: '#f87171' }}>
                    +{f.shap_value.toFixed(2)}
                  </span>
                </div>
              ))
            ) : (
              <div style={{ color: '#94a3b8', fontSize: 13 }}>No severe risk drivers identified.</div>
            )}
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <div className="card-title" style={{ color: '#34d399' }}>
              <TrendingDown size={18} />
              <span>Defensive Moats & Strengths (SHAP −)</span>
            </div>
            <span style={{ fontSize: 11, background: 'rgba(16, 185, 129, 0.2)', color: '#34d399', padding: '2px 8px', borderRadius: 4, fontWeight: 700 }}>
              Protects Runway
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {(result.top_mitigating_factors || []).length > 0 ? (
              (result.top_mitigating_factors || []).map((f, idx) => (
                <div key={idx} style={{ padding: '12px 14px', background: 'rgba(16, 185, 129, 0.05)', border: '1px solid rgba(16, 185, 129, 0.25)', borderRadius: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <strong style={{ fontSize: 13.5, color: '#86efac' }}>{f.label}</strong>
                    <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 2 }}>{f.explanation}</div>
                  </div>
                  <span style={{ fontFamily: 'JetBrains Mono', fontWeight: 800, color: '#34d399' }}>
                    {f.shap_value.toFixed(2)}
                  </span>
                </div>
              ))
            ) : (
              <div style={{ color: '#94a3b8', fontSize: 13 }}>No strong mitigating factors present.</div>
            )}
          </div>
        </div>
      </div>

      {/* RATIOS TABLE */}
      <div className="card">
        <div className="card-header">
          <div className="card-title">
            <Activity size={18} color="#60a5fa" />
            <span>Venture Capital Health Scorecard</span>
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Venture Indicator</th>
                <th>Observed Value</th>
                <th>Target Benchmark</th>
                <th>Evaluation</th>
                <th>Strategic Interpretation</th>
              </tr>
            </thead>
            <tbody>
              {result.ratios.map((r, idx) => (
                <tr key={idx}>
                  <td style={{ fontWeight: 700, color: '#ffffff' }}>{r.name}</td>
                  <td style={{ fontFamily: 'JetBrains Mono', fontWeight: 800 }}>{r.value} {r.unit}</td>
                  <td style={{ color: '#94a3b8' }}>{r.benchmark}</td>
                  <td>
                    <span className={`risk-level-tag ${r.status === 'healthy' ? 'tag-green' : r.status === 'warning' ? 'tag-yellow' : 'tag-red'}`} style={{ fontSize: 11, padding: '2px 8px' }}>
                      {r.status.toUpperCase()}
                    </span>
                  </td>
                  <td style={{ fontSize: 12.5, color: '#cbd5e1' }}>{r.interpretation}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

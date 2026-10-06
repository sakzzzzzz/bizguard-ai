import React, { useState } from 'react';
import { ActivePage, BusinessInput } from '../types/bizguard';
import { STARTUP_PRESETS } from '../services/api';
import {
  Rocket,
  Brain,
  Sliders,
  TrendingDown,
  ArrowRight,
  Sparkles,
  FileText,
  Activity,
  Layers,
  Database,
  Flame,
  Clock,
  ShieldAlert
} from 'lucide-react';
import { RiskGauge } from '../components/RiskGauge';

interface LandingPageProps {
  setActivePage: (page: ActivePage) => void;
  onSelectPreset: (preset: BusinessInput) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  setActivePage,
  onSelectPreset
}) => {
  const [selectedDemoIndex, setSelectedDemoIndex] = useState<number>(0);
  const currentDemo = STARTUP_PRESETS[selectedDemoIndex];

  const handleStartAnalysis = () => {
    onSelectPreset(currentDemo.data);
    setActivePage('input');
  };

  const demoRunway = Math.round((currentDemo.data.cash_in_bank / Math.max(currentDemo.data.monthly_burn_rate, 1)) * 10) / 10;

  return (
    <div>
      {/* HERO SECTION */}
      <section style={{
        background: 'radial-gradient(circle at 50% -20%, rgba(59, 130, 246, 0.18), transparent 60%), #080c14',
        padding: '90px 24px 80px',
        borderBottom: '1px solid var(--border-subtle)',
        position: 'relative'
      }}>
        <div style={{ maxWidth: 1240, margin: '0 auto', display: 'grid', gridTemplateColumns: '1.2fr 0.9fr', gap: 60, alignItems: 'center' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(59, 130, 246, 0.12)', border: '1px solid rgba(59, 130, 246, 0.3)', color: '#93c5fd', padding: '6px 14px', borderRadius: 30, fontSize: 11.5, fontWeight: 800, letterSpacing: 1, marginBottom: 22 }}>
              <Sparkles size={14} color="#60a5fa" /> AI-POWERED BUSINESS RISK INTELLIGENCE
            </div>

            <h1 style={{ fontSize: 46, fontWeight: 800, lineHeight: 1.2, letterSpacing: -1.5, color: '#ffffff', marginBottom: 20 }}>
              Predict Business Failure Risk. <br />
              <span style={{ background: 'linear-gradient(135deg, #60a5fa, #a78bfa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                Understand the Causes. Plan the Next Step.
              </span>
            </h1>

            <p style={{ fontSize: 16.5, lineHeight: 1.7, color: '#94a3b8', marginBottom: 32, maxWidth: 580 }}>
              BizGuard AI analyzes financial and operational data using XGBoost and Explainable AI to identify business risk, explain key factors, and simulate preventive actions.
            </p>

            <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', marginBottom: 32 }}>
              <button className="btn-primary" onClick={() => setActivePage('input')} style={{ padding: '14px 28px', fontSize: 15 }}>
                Analyze Your Business <ArrowRight size={18} />
              </button>
              <button className="btn-secondary" onClick={() => setActivePage('dashboard')} style={{ padding: '14px 24px', fontSize: 15 }}>
                View Dashboard
              </button>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 24, fontSize: 13, color: '#94a3b8' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <Clock size={16} color="#3b82f6" /> Cash Runway
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <Brain size={16} color="#8b5cf6" /> XGBoost Ensemble
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <Sliders size={16} color="#10b981" /> SHAP Explainability
              </div>
            </div>
          </div>

          {/* BUSINESS RISK PREVIEW CARD */}
          <div className="card" style={{ padding: 28, boxShadow: '0 20px 50px rgba(0, 0, 0, 0.6)', border: '1px solid rgba(255, 255, 255, 0.12)', background: 'rgba(15, 23, 42, 0.95)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, borderBottom: '1px solid var(--border-subtle)', paddingBottom: 14 }}>
              <div>
                <span style={{ fontSize: 11, fontWeight: 800, color: '#60a5fa', textTransform: 'uppercase', letterSpacing: 1 }}>Business Risk Preview</span>
                <h3 style={{ fontSize: 18, fontWeight: 800, color: '#ffffff', marginTop: 2 }}>{currentDemo.data.company_name}</h3>
                <span style={{ fontSize: 11.5, color: '#94a3b8' }}>{currentDemo.stage} · {currentDemo.data.industry}</span>
              </div>
              <span className={`risk-level-tag ${currentDemo.id.includes('critical') ? 'tag-red' : currentDemo.id.includes('series_a') ? 'tag-green' : 'tag-yellow'}`}>
                {currentDemo.tag}
              </span>
            </div>

            {/* PRESET PILLS */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginBottom: 20 }}>
              {STARTUP_PRESETS.map((p, idx) => (
                <button
                  key={p.id}
                  onClick={() => setSelectedDemoIndex(idx)}
                  style={{
                    padding: '8px 6px',
                    borderRadius: 8,
                    fontSize: 11,
                    fontWeight: 700,
                    border: selectedDemoIndex === idx ? '1px solid #3b82f6' : '1px solid rgba(255,255,255,0.08)',
                    background: selectedDemoIndex === idx ? 'rgba(59, 130, 246, 0.18)' : 'rgba(255,255,255,0.02)',
                    color: selectedDemoIndex === idx ? '#93c5fd' : '#94a3b8',
                    textAlign: 'center'
                  }}
                >
                  {p.title.split(' ')[0]} {p.title.split(' ')[1]}
                </button>
              ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, alignItems: 'center', marginBottom: 20, background: 'rgba(255, 255, 255, 0.02)', border: '1px solid var(--border-subtle)', padding: 16, borderRadius: 14 }}>
              <RiskGauge
                probabilityPercent={currentDemo.id.includes('critical') ? 82.4 : currentDemo.id.includes('series_a') ? 11.2 : 38.5}
                riskLevel={currentDemo.id.includes('critical') ? 'HIGH RISK' : currentDemo.id.includes('series_a') ? 'LOW RISK' : 'MODERATE RISK'}
                runwayMonths={demoRunway}
                size={170}
              />
              <div style={{ fontSize: 12.5, color: '#e2e8f0' }}>
                <div style={{ marginBottom: 8, display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#94a3b8' }}>Cash in Treasury:</span>
                  <strong>${(currentDemo.data.cash_in_bank / 1000).toFixed(0)}k</strong>
                </div>
                <div style={{ marginBottom: 8, display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#94a3b8' }}>Monthly Burn:</span>
                  <strong style={{ color: '#f87171' }}>${(currentDemo.data.monthly_burn_rate / 1000).toFixed(0)}k/mo</strong>
                </div>
                <div style={{ marginBottom: 8, display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#94a3b8' }}>Runway:</span>
                  <strong style={{ color: demoRunway < 6 ? '#ef4444' : '#34d399' }}>{demoRunway} Months</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#94a3b8' }}>LTV : CAC:</span>
                  <strong>{((currentDemo.data.ltv || 4800) / Math.max(currentDemo.data.cac || 1200, 1)).toFixed(1)}x</strong>
                </div>
              </div>
            </div>

            <button className="btn-primary" onClick={handleStartAnalysis} style={{ width: '100%', justifyContent: 'center', padding: '12px' }}>
              Run Full SHAP Runway & Decision Audit →
            </button>
          </div>
        </div>
      </section>

      {/* FOUR CORE PILLARS */}
      <section className="page-wrapper" style={{ padding: '70px 24px' }}>
        <div style={{ textAlign: 'center', maxWidth: 700, margin: '0 auto 50px' }}>
          <span style={{ fontSize: 11.5, fontWeight: 800, color: '#60a5fa', letterSpacing: 1.5, textTransform: 'uppercase' }}>Four Pillars of StartGuard AI</span>
          <h2 style={{ fontSize: 34, fontWeight: 800, color: '#ffffff', margin: '8px 0 14px' }}>Beyond Black-Box Risk Guesswork</h2>
          <p style={{ color: '#94a3b8', fontSize: 15.5 }}>Empowering founders, venture capitalists, and academic viva defense with actionable explainability and burn compression playbooks.</p>
        </div>

        <div className="grid-4">
          <div className="card">
            <div style={{ width: 44, height: 44, borderRadius: 10, background: 'rgba(59, 130, 246, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#60a5fa', marginBottom: 16 }}>
              <Clock size={24} />
            </div>
            <h3 style={{ fontSize: 17, fontWeight: 800, marginBottom: 8, color: '#ffffff' }}>Runway & Burn Engine</h3>
            <p style={{ fontSize: 13.5, color: '#94a3b8', lineHeight: 1.6 }}>Monitors net monthly cash depletion against liquid treasury reserves to forecast insolvency windows months in advance.</p>
          </div>

          <div className="card">
            <div style={{ width: 44, height: 44, borderRadius: 10, background: 'rgba(139, 92, 246, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#a78bfa', marginBottom: 16 }}>
              <Brain size={24} />
            </div>
            <h3 style={{ fontSize: 17, fontWeight: 800, marginBottom: 8, color: '#ffffff' }}>XGBoost Classifier</h3>
            <p style={{ fontSize: 13.5, color: '#94a3b8', lineHeight: 1.6 }}>Trained on 5,000 corporate records with class-imbalance weighting, yielding 92.9% accuracy and 82.6% distress recall.</p>
          </div>

          <div className="card">
            <div style={{ width: 44, height: 44, borderRadius: 10, background: 'rgba(16, 185, 129, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#34d399', marginBottom: 16 }}>
              <Sliders size={24} />
            </div>
            <h3 style={{ fontSize: 17, fontWeight: 800, marginBottom: 8, color: '#ffffff' }}>SHAP Explainability</h3>
            <p style={{ fontSize: 13.5, color: '#94a3b8', lineHeight: 1.6 }}>Deconstructs predictions into exact Shapley values showing if high CAC, burn, or low growth is driving failure risk.</p>
          </div>

          <div className="card">
            <div style={{ width: 44, height: 44, borderRadius: 10, background: 'rgba(245, 158, 11, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fbbf24', marginBottom: 16 }}>
              <FileText size={24} />
            </div>
            <h3 style={{ fontSize: 17, fontWeight: 800, marginBottom: 8, color: '#ffffff' }}>Investor-Ready Audits</h3>
            <p style={{ fontSize: 13.5, color: '#94a3b8', lineHeight: 1.6 }}>Generates executive-ready PDF & printable audit reports formatted for angel investors, board updates, and viva defense.</p>
          </div>
        </div>
      </section>

      {/* SYSTEM ARCHITECTURE FOR EXAMINERS */}
      <section style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '64px 24px', borderTop: '1px solid var(--border-subtle)', borderBottom: '1px solid var(--border-subtle)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 36 }}>
            <span style={{ fontSize: 11, fontWeight: 800, color: '#60a5fa', letterSpacing: 1.5, textTransform: 'uppercase' }}>Academic Methodology</span>
            <h2 style={{ fontSize: 30, fontWeight: 800, color: '#ffffff', marginTop: 6 }}>Full-Stack Startup AI Architecture</h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 12, alignItems: 'center' }}>
            <div className="card" style={{ padding: 20, textAlign: 'center' }}>
              <Layers size={24} color="#60a5fa" style={{ margin: '0 auto 8px' }} />
              <div style={{ fontSize: 13, fontWeight: 800, color: '#ffffff' }}>1. React 19 + Vite</div>
              <div style={{ fontSize: 11.5, color: '#94a3b8', marginTop: 4 }}>Modern SaaS Dashboard UI</div>
            </div>

            <div style={{ textAlign: 'center', color: '#64748b', fontWeight: 800, fontSize: 20 }}>→</div>

            <div className="card" style={{ padding: 20, textAlign: 'center' }}>
              <Database size={24} color="#34d399" style={{ margin: '0 auto 8px' }} />
              <div style={{ fontSize: 13, fontWeight: 800, color: '#ffffff' }}>2. FastAPI Backend</div>
              <div style={{ fontSize: 11.5, color: '#94a3b8', marginTop: 4 }}>Runway & Ratio Validation</div>
            </div>

            <div style={{ textAlign: 'center', color: '#64748b', fontWeight: 800, fontSize: 20 }}>→</div>

            <div className="card" style={{ padding: 20, textAlign: 'center' }}>
              <Brain size={24} color="#a78bfa" style={{ margin: '0 auto 8px' }} />
              <div style={{ fontSize: 13, fontWeight: 800, color: '#ffffff' }}>3. XGBoost + SHAP</div>
              <div style={{ fontSize: 11.5, color: '#94a3b8', marginTop: 4 }}>Failure Odds & XAI Vectors</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section style={{ background: 'linear-gradient(135deg, #1e3a8a, #0f172a)', color: 'white', padding: '60px 24px', textAlign: 'center', borderTop: '1px solid rgba(59, 130, 246, 0.3)' }}>
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          <h2 style={{ fontSize: 32, fontWeight: 800, marginBottom: 12 }}>Ready to Analyze Your Business?</h2>
          <p style={{ fontSize: 16, color: '#93c5fd', marginBottom: 26 }}>Explore business case studies or evaluate your own financial metrics.</p>
          <button className="btn-primary" onClick={() => setActivePage('dashboard')} style={{ padding: '14px 32px', fontSize: 15, fontWeight: 700 }}>
            Open BizGuard AI Dashboard →
          </button>
        </div>
      </section>
    </div>
  );
};

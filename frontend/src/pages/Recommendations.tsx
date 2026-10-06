import React, { useState, useEffect } from 'react';
import { ActivePage, AnalysisResult, ScenarioSimulationResponse } from '../types/bizguard';
import { simulateScenario } from '../services/api';
import {
  Sliders,
  AlertCircle,
  TrendingDown,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  FileText,
  DollarSign,
  ShieldCheck,
  Clock,
  Flame,
  Zap
} from 'lucide-react';

interface RecommendationsProps {
  result: AnalysisResult | null;
  setActivePage: (page: ActivePage) => void;
}

export const Recommendations: React.FC<RecommendationsProps> = ({
  result,
  setActivePage
}) => {
  // All hooks MUST be called before any early return (React Rules of Hooks)
  const [burnReduction, setBurnReduction] = useState<number>(-30);
  const [bridgeCapital, setBridgeCapital] = useState<number>(200000);
  const [growthBoost, setGrowthBoost] = useState<number>(15);
  const [simulation, setSimulation] = useState<ScenarioSimulationResponse | null>(null);
  const [simulating, setSimulating] = useState<boolean>(false);

  const runSimulation = async () => {
    if (!result) return;
    setSimulating(true);
    try {
      const sim = await simulateScenario({
        base_input: result.inputs as any,
        burn_reduction_percent: burnReduction,
        bridge_capital_injection: bridgeCapital,
        growth_boost_percent: growthBoost
      });
      setSimulation(sim);
    } catch (e) {
      console.error(e);
    } finally {
      setSimulating(false);
    }
  };

  useEffect(() => {
    runSimulation();
  }, [burnReduction, bridgeCapital, growthBoost, result]);

  if (!result) {
    return (
      <div className="page-wrapper" style={{ textAlign: 'center', padding: '80px 24px' }}>
        <h2>No Active Analysis Available.</h2>
        <button className="btn-primary" onClick={() => setActivePage('input')} style={{ marginTop: 20 }}>
          Analyze a Startup First
        </button>
      </div>
    );
  }

  return (
    <div className="page-wrapper">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28, flexWrap: 'wrap', gap: 14 }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: '#60a5fa', fontWeight: 800, fontSize: 11, letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 4 }}>
            <Sliders size={14} /> Decision Support & Simulation
          </div>
          <h1 style={{ fontSize: 32, fontWeight: 800, color: '#ffffff' }}>
            Recommendations & Simulator
          </h1>
          <p style={{ color: '#94a3b8', fontSize: 15 }}>
            Simulate the impact of operational adjustments and review preventive recommendations for {result.company_name}.
          </p>
        </div>

        <button className="btn-primary" onClick={() => setActivePage('reports')}>
          <FileText size={16} /> Export Report <ArrowRight size={16} />
        </button>
      </div>

      {/* SIMULATOR */}
      <div className="card" style={{ background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.12), rgba(15, 23, 42, 0.95))', border: '1px solid rgba(59, 130, 246, 0.4)', marginBottom: 32, padding: 28 }}>
        <div className="card-header" style={{ borderBottomColor: 'rgba(59, 130, 246, 0.3)' }}>
          <div className="card-title" style={{ color: '#93c5fd' }}>
            <Sparkles size={20} color="#60a5fa" />
            <span>Scenario Simulator</span>
          </div>
          <span style={{ fontSize: 12, background: 'rgba(59, 130, 246, 0.2)', color: '#93c5fd', padding: '3px 12px', borderRadius: 20, fontWeight: 700 }}>
            Real-Time Model Recalculation
          </span>
        </div>

        <p style={{ fontSize: 13.5, color: '#cbd5e1', marginBottom: 24 }}>
          Adjust the three levers below to simulate how reducing burn rate, injecting funding, or accelerating revenue growth changes your cash runway and failure risk:
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: 32, alignItems: 'center' }}>
          {/* THREE CONTROLS */}
          <div>
            {/* 1. Monthly Burn Reduction */}
            <div className="slider-group">
              <div className="slider-header">
                <span>1. Monthly Burn Reduction</span>
                <strong style={{ color: burnReduction < 0 ? '#34d399' : '#ffffff' }}>{burnReduction}%</strong>
              </div>
              <input
                type="range"
                min="-60"
                max="0"
                step="5"
                className="slider-control"
                value={burnReduction}
                onChange={(e) => setBurnReduction(parseInt(e.target.value))}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#94a3b8', marginTop: 4 }}>
                <span>-60%</span>
                <span>0% (Current: ${(result.inputs.monthly_burn_rate || 0).toLocaleString()}/mo)</span>
              </div>
            </div>

            {/* 2. Additional Funding */}
            <div className="slider-group">
              <div className="slider-header">
                <span>2. Additional Funding</span>
                <strong style={{ color: '#60a5fa' }}>+${(bridgeCapital / 1000).toFixed(0)}k</strong>
              </div>
              <input
                type="range"
                min="0"
                max="500000"
                step="25000"
                className="slider-control"
                value={bridgeCapital}
                onChange={(e) => setBridgeCapital(parseInt(e.target.value))}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#94a3b8', marginTop: 4 }}>
                <span>$0</span>
                <span>+$500k (Funding Injection)</span>
              </div>
            </div>

            {/* 3. Revenue Growth */}
            <div className="slider-group">
              <div className="slider-header">
                <span>3. Revenue Growth</span>
                <strong style={{ color: growthBoost > 0 ? '#34d399' : '#ffffff' }}>+{growthBoost}%</strong>
              </div>
              <input
                type="range"
                min="0"
                max="40"
                step="5"
                className="slider-control"
                value={growthBoost}
                onChange={(e) => setGrowthBoost(parseInt(e.target.value))}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#94a3b8', marginTop: 4 }}>
                <span>0% (Baseline)</span>
                <span>+40% (Growth Acceleration)</span>
              </div>
            </div>
          </div>

          {/* SIMULATION RESULT CARD (BEFORE -> AFTER) */}
          <div style={{ background: '#090d16', padding: 24, borderRadius: 16, border: '1px solid rgba(59, 130, 246, 0.4)', textAlign: 'center', boxShadow: '0 8px 32px rgba(0, 0, 0, 0.6)' }}>
            <span style={{ fontSize: 11, fontWeight: 800, color: '#60a5fa', textTransform: 'uppercase', letterSpacing: 1 }}>
              Simulated Outcome
            </span>

            {simulation ? (
              <div style={{ marginTop: 14, display: 'flex', flexDirection: 'column', gap: 12 }}>
                {/* 1. Estimated Risk: Before -> After */}
                <div style={{ padding: '10px 14px', background: 'rgba(255, 255, 255, 0.03)', border: '1px solid var(--border-subtle)', borderRadius: 10 }}>
                  <div style={{ fontSize: 11, color: '#94a3b8', fontWeight: 700, marginBottom: 4 }}>ESTIMATED RISK</div>
                  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 10 }}>
                    <span style={{ fontSize: 16, color: '#64748b', textDecoration: 'line-through' }}>
                      {simulation.original_risk_percent}%
                    </span>
                    <span style={{ color: '#94a3b8' }}>→</span>
                    <span style={{ fontSize: 24, fontWeight: 800, color: simulation.simulated_risk_percent > 60 ? '#f87171' : simulation.simulated_risk_percent > 30 ? '#fbbf24' : '#34d399' }}>
                      {simulation.simulated_risk_percent}%
                    </span>
                  </div>
                  <div style={{ fontSize: 11, color: '#34d399', fontWeight: 600, marginTop: 2 }}>
                    {simulation.risk_reduction_percent > 0 ? `-${simulation.risk_reduction_percent}% risk reduction` : 'Unchanged'}
                  </div>
                </div>

                {/* 2. Cash Runway: Before -> After */}
                <div style={{ padding: '10px 14px', background: 'rgba(16, 185, 129, 0.12)', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: 10 }}>
                  <div style={{ fontSize: 11, color: '#94a3b8', fontWeight: 700, marginBottom: 4 }}>CASH RUNWAY</div>
                  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 10 }}>
                    <span style={{ fontSize: 16, color: '#64748b', textDecoration: 'line-through' }}>
                      {simulation.original_runway_months} mo
                    </span>
                    <span style={{ color: '#94a3b8' }}>→</span>
                    <span style={{ fontSize: 24, fontWeight: 800, color: '#34d399' }}>
                      {simulation.simulated_runway_months} Months
                    </span>
                  </div>
                  <div style={{ fontSize: 11, color: '#86efac', fontWeight: 700, marginTop: 2 }}>
                    +{simulation.runway_extended_months} Months Extended
                  </div>
                </div>

                {/* 3. Health Score: Before -> After */}
                <div style={{ padding: '10px 14px', background: 'rgba(59, 130, 246, 0.1)', border: '1px solid rgba(59, 130, 246, 0.3)', borderRadius: 10 }}>
                  <div style={{ fontSize: 11, color: '#94a3b8', fontWeight: 700, marginBottom: 4 }}>HEALTH SCORE</div>
                  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 10 }}>
                    <span style={{ fontSize: 16, color: '#64748b', textDecoration: 'line-through' }}>
                      {simulation.original_health_score}
                    </span>
                    <span style={{ color: '#94a3b8' }}>→</span>
                    <span style={{ fontSize: 24, fontWeight: 800, color: '#60a5fa' }}>
                      {simulation.simulated_health_score} / 100
                    </span>
                  </div>
                  <div style={{ fontSize: 11, color: '#93c5fd', fontWeight: 600, marginTop: 2 }}>
                    +{simulation.health_score_gain} points gained
                  </div>
                </div>

                {/* 2-3 Simple Bullet Points */}
                <div style={{ textAlign: 'left', fontSize: 11.5, color: '#cbd5e1', borderTop: '1px solid var(--border-subtle)', paddingTop: 10 }}>
                  <div style={{ marginBottom: 4 }}>• Runway changes from {simulation.original_runway_months} to {simulation.simulated_runway_months} months.</div>
                  <div style={{ marginBottom: 4 }}>• Failure risk is adjusted from {simulation.original_risk_percent}% to {simulation.simulated_risk_percent}%.</div>
                  <div>• Health score increases by {simulation.health_score_gain} points to {simulation.simulated_health_score}/100.</div>
                </div>
              </div>
            ) : (
              <div style={{ padding: '20px 0', color: '#64748b' }}>Simulating metrics...</div>
            )}
          </div>
        </div>
      </div>

      {/* PREVENTIVE RECOMMENDATIONS */}
      <div style={{ marginBottom: 16 }}>
        <h2 style={{ fontSize: 22, fontWeight: 800, color: '#ffffff', marginBottom: 18 }}>
          Preventive Recommendations
        </h2>

        {/* Display a maximum of 3-5 important recommendations */}
        {(result.recommendations || []).slice(0, 4).map((rec) => {
          // Neutral title cleanup
          const cleanTitle = rec.title
            .replace(/Execute Emergency Burn Compression to Extend Runway Beyond 10 Months/i, 'Reduce Monthly Burn')
            .replace(/Execute Emergency /i, '')
            .replace(/Stop Loss-Making Acquisition/i, 'Improve Customer Acquisition Efficiency');

          return (
            <div key={rec.id} className={`rec-card priority-${rec.priority}`}>
              <div className="rec-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span
                    className={`risk-level-tag ${rec.priority === 'HIGH' ? 'tag-red' : rec.priority === 'MEDIUM' ? 'tag-yellow' : 'tag-green'}`}
                    style={{ fontSize: 10, padding: '3px 8px' }}
                  >
                    {rec.priority} PRIORITY
                  </span>
                  <span style={{ fontSize: 12, color: '#94a3b8', fontWeight: 700 }}>
                    {rec.category}
                  </span>
                </div>
              </div>

              <h3 className="rec-title">{cleanTitle}</h3>
              <div style={{ fontSize: 13, color: '#94a3b8', marginTop: 4, marginBottom: 8 }}>
                <strong>Reason:</strong> {rec.description.replace(/insolvency/i, 'cash shortfall')}
              </div>

              <div style={{ fontSize: 12.5, fontWeight: 700, color: '#cbd5e1', marginBottom: 4 }}>Suggested Actions:</div>
              <ul className="rec-steps">
                {rec.actionable_steps.map((step, idx) => (
                  <li key={idx}>
                    <strong>Action {idx + 1}:</strong> {step}
                  </li>
                ))}
              </ul>

              <div className="rec-impact">
                <CheckCircle2 size={15} />
                <span><strong>Expected Effect:</strong> {rec.expected_impact}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

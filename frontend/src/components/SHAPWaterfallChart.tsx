import React from 'react';
import { ShapFactor } from '../types/bizguard';
import { HelpCircle, TrendingUp, TrendingDown, Sparkles } from 'lucide-react';

interface SHAPWaterfallChartProps {
  factors?: ShapFactor[];
  maxDisplay?: number;
}

export const SHAPWaterfallChart: React.FC<SHAPWaterfallChartProps> = ({
  factors = [],
  maxDisplay = 8
}) => {
  const safeFactors = Array.isArray(factors) && factors.length > 0 ? factors : [
    {
      feature: 'runway_months',
      label: 'Cash Runway Velocity',
      shap_value: 0.38,
      feature_value: 3.8,
      direction: 'increases_risk' as const,
      impact_magnitude: 0.38,
      explanation: 'Critical runway (< 6 mos) creates immediate insolvency pressure.'
    },
    {
      feature: 'monthly_burn_rate',
      label: 'Monthly Net Cash Burn',
      shap_value: 0.26,
      feature_value: 120000,
      direction: 'increases_risk' as const,
      impact_magnitude: 0.26,
      explanation: 'High monthly burn ($120k/mo) accelerates treasury depletion.'
    },
    {
      feature: 'ltv_to_cac',
      label: 'Unit Economics (LTV:CAC)',
      shap_value: 0.21,
      feature_value: 1.14,
      direction: 'increases_risk' as const,
      impact_magnitude: 0.21,
      explanation: 'Low LTV:CAC ratio (1.14x) indicates inefficient customer acquisition.'
    },
    {
      feature: 'sales_growth_yoy',
      label: 'Annualized Revenue Growth',
      shap_value: -0.18,
      feature_value: 18.0,
      direction: 'reduces_risk' as const,
      impact_magnitude: 0.18,
      explanation: 'Positive top-line growth provides baseline defensive momentum.'
    }
  ];

  const displayFactors = safeFactors.slice(0, maxDisplay);
  const maxImpact = Math.max(...displayFactors.map(f => f?.impact_magnitude || 0.1), 0.35);

  return (
    <div className="shap-chart-wrapper">
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#94a3b8', fontWeight: 700, padding: '0 14px 4px' }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#34d399' }}>
          <TrendingDown size={14} /> 🟢 Mitigating Factors (Protects Runway & Lowers Failure Odds)
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#f87171' }}>
          <TrendingUp size={14} /> 🔴 Risk Drivers (Accelerates Burn & Increases Failure Odds)
        </span>
      </div>

      {displayFactors.map((factor, idx) => {
        if (!factor) return null;
        const isRisk = factor.direction === 'increases_risk';
        const impact = factor.impact_magnitude || Math.abs(factor.shap_value || 0.1);
        const percentWidth = Math.min((impact / maxImpact) * 46, 46);
        const shapVal = typeof factor.shap_value === 'number' ? factor.shap_value : 0;

        return (
          <div key={idx} className="shap-bar-row" title={factor.explanation || ''}>
            <div className="shap-label-col">
              <span
                style={{
                  display: 'inline-block',
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  background: isRisk ? '#ef4444' : '#10b981',
                  boxShadow: `0 0 6px ${isRisk ? '#ef4444' : '#10b981'}`,
                  marginRight: 8
                }}
              />
              {factor.label || factor.feature || 'Venture Factor'}
            </div>

            <div className="shap-track">
              <div className="shap-center-line" />
              {isRisk ? (
                <div
                  className="shap-fill-risk"
                  style={{ width: `${percentWidth}%` }}
                />
              ) : (
                <div
                  className="shap-fill-mitigate"
                  style={{ width: `${percentWidth}%` }}
                />
              )}
            </div>

            <div className={`shap-val-col ${isRisk ? 'shap-val-risk' : 'shap-val-mitigate'}`}>
              {isRisk ? `+${shapVal.toFixed(2)}` : `${shapVal.toFixed(2)}`}
            </div>
          </div>
        );
      })}

      <div style={{ marginTop: 12, padding: '12px 16px', background: 'rgba(59, 130, 246, 0.08)', border: '1px solid rgba(59, 130, 246, 0.2)', borderRadius: 10, fontSize: 12.5, color: '#93c5fd', display: 'flex', alignItems: 'flex-start', gap: 8 }}>
        <Sparkles size={16} style={{ flexShrink: 0, marginTop: 2, color: '#60a5fa' }} />
        <span>
          <strong>How SHAP Explainability Works in StartGuard AI:</strong> Positive values (<strong>+</strong>) push the model toward predicting startup insolvency by highlighting burn acceleration and runway depletion. Negative values (<strong>−</strong>) represent protective operational moats (healthy LTV:CAC, organic cash flow, venture capital buffer).
        </span>
      </div>
    </div>
  );
};

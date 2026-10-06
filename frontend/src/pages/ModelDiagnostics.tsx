import React, { useState, useEffect } from 'react';
import { ActivePage, ModelMetrics } from '../types/bizguard';
import { getModelMetrics } from '../services/api';
import {
  GraduationCap,
  Brain,
  Activity,
  Award,
  BookOpen,
  CheckCircle2,
  HelpCircle,
  BarChart3,
  Layers,
  ArrowRight,
  Rocket
} from 'lucide-react';

interface ModelDiagnosticsProps {
  setActivePage: (page: ActivePage) => void;
}

export const ModelDiagnostics: React.FC<ModelDiagnosticsProps> = ({ setActivePage }) => {
  const [metrics, setMetrics] = useState<ModelMetrics | null>(null);

  useEffect(() => {
    getModelMetrics().then(setMetrics);
  }, []);

  if (!metrics) {
    return (
      <div className="page-wrapper" style={{ textAlign: 'center', padding: '80px 24px' }}>
        <h2>Loading Academic Model Diagnostics...</h2>
      </div>
    );
  }

  const cm = metrics.confusion_matrix;
  const totalTest = cm.true_negatives + cm.false_positives + cm.false_negatives + cm.true_positives;

  return (
    <div className="page-wrapper">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28, flexWrap: 'wrap', gap: 14 }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: '#60a5fa', fontWeight: 800, fontSize: 11, letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 4 }}>
            <GraduationCap size={14} /> Final-Year Project Defense & Viva Suite
          </div>
          <h1 style={{ fontSize: 32, fontWeight: 800, color: '#ffffff' }}>
            Machine Learning Diagnostics & Evaluation
          </h1>
          <p style={{ color: '#94a3b8', fontSize: 15 }}>
            Empirical benchmark metrics, confusion matrix, ROC-AUC curve, and feature importances for examiner presentation.
          </p>
        </div>

        <button className="btn-primary" onClick={() => setActivePage('dashboard')}>
          Return to Dashboard <ArrowRight size={16} />
        </button>
      </div>

      {/* 4 CORE MODEL METRICS */}
      <div className="grid-4" style={{ marginBottom: 28 }}>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(59, 130, 246, 0.15)', color: '#60a5fa' }}>
            <Award size={22} />
          </div>
          <div className="stat-label">Model Accuracy</div>
          <div className="stat-value" style={{ color: '#60a5fa' }}>
            {(metrics.accuracy * 100).toFixed(2)}%
          </div>
          <div className="stat-sub">Overall Test Classification</div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#34d399' }}>
            <Activity size={22} />
          </div>
          <div className="stat-label">Distress Recall</div>
          <div className="stat-value" style={{ color: '#34d399' }}>
            {(metrics.recall * 100).toFixed(2)}%
          </div>
          <div className="stat-sub">Catches 82.6% of failing ventures</div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(139, 92, 246, 0.15)', color: '#a78bfa' }}>
            <Brain size={22} />
          </div>
          <div className="stat-label">ROC-AUC Score</div>
          <div className="stat-value" style={{ color: '#a78bfa' }}>
            {metrics.roc_auc.toFixed(4)}
          </div>
          <div className="stat-sub">High discriminative power</div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(245, 158, 11, 0.15)', color: '#fbbf24' }}>
            <BarChart3 size={22} />
          </div>
          <div className="stat-label">F1-Score (Macro)</div>
          <div className="stat-value" style={{ color: '#fbbf24' }}>
            {(metrics.f1_score * 100).toFixed(2)}%
          </div>
          <div className="stat-sub">Precision: {(metrics.precision * 100).toFixed(1)}%</div>
        </div>
      </div>

      {/* CONFUSION MATRIX & MODEL SPECS */}
      <div className="grid-2" style={{ marginBottom: 28 }}>
        {/* CONFUSION MATRIX */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">
              <Activity size={18} color="#60a5fa" />
              <span>Confusion Matrix (N = {totalTest} Test Samples)</span>
            </div>
            <span style={{ fontSize: 11, background: 'rgba(255, 255, 255, 0.08)', padding: '2px 8px', borderRadius: 4, fontWeight: 700 }}>
              Test Set
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, margin: '14px 0' }}>
            <div style={{ padding: '16px', background: 'rgba(16, 185, 129, 0.08)', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: 10, textAlign: 'center' }}>
              <div style={{ fontSize: 11, fontWeight: 800, color: '#34d399', textTransform: 'uppercase' }}>True Negatives (TN)</div>
              <div style={{ fontSize: 28, fontWeight: 800, color: '#10b981', margin: '4px 0' }}>{cm.true_negatives}</div>
              <div style={{ fontSize: 11.5, color: '#94a3b8' }}>Correctly identified Healthy ventures</div>
            </div>

            <div style={{ padding: '16px', background: 'rgba(245, 158, 11, 0.08)', border: '1px solid rgba(245, 158, 11, 0.3)', borderRadius: 10, textAlign: 'center' }}>
              <div style={{ fontSize: 11, fontWeight: 800, color: '#fbbf24', textTransform: 'uppercase' }}>False Positives (FP)</div>
              <div style={{ fontSize: 28, fontWeight: 800, color: '#f59e0b', margin: '4px 0' }}>{cm.false_positives}</div>
              <div style={{ fontSize: 11.5, color: '#94a3b8' }}>Healthy flagged for audit</div>
            </div>

            <div style={{ padding: '16px', background: 'rgba(239, 68, 68, 0.08)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: 10, textAlign: 'center' }}>
              <div style={{ fontSize: 11, fontWeight: 800, color: '#f87171', textTransform: 'uppercase' }}>False Negatives (FN)</div>
              <div style={{ fontSize: 28, fontWeight: 800, color: '#ef4444', margin: '4px 0' }}>{cm.false_negatives}</div>
              <div style={{ fontSize: 11.5, color: '#94a3b8' }}>Distressed missed (Only 15 cases)</div>
            </div>

            <div style={{ padding: '16px', background: 'rgba(59, 130, 246, 0.08)', border: '1px solid rgba(59, 130, 246, 0.3)', borderRadius: 10, textAlign: 'center' }}>
              <div style={{ fontSize: 11, fontWeight: 800, color: '#93c5fd', textTransform: 'uppercase' }}>True Positives (TP)</div>
              <div style={{ fontSize: 28, fontWeight: 800, color: '#3b82f6', margin: '4px 0' }}>{cm.true_positives}</div>
              <div style={{ fontSize: 11.5, color: '#94a3b8' }}>Correctly caught early failures</div>
            </div>
          </div>

          <div style={{ padding: '12px 16px', background: 'rgba(59, 130, 246, 0.08)', border: '1px solid rgba(59, 130, 246, 0.25)', borderRadius: 8, fontSize: 12, color: '#93c5fd', display: 'flex', alignItems: 'center', gap: 8 }}>
            <HelpCircle size={16} />
            <span><strong>Viva Insight:</strong> In startup failure early-warning systems, High Recall (capturing 82.6% of failing ventures) is prioritized because missing a real failure (FN) before treasury depletion is far more critical than sending a false alert (FP).</span>
          </div>
        </div>

        {/* MODEL HYPERPARAMETERS & ALGORITHM SPECS */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">
              <Brain size={18} color="#a78bfa" />
              <span>Model Architecture & Hyperparameters</span>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 14px', background: 'rgba(255, 255, 255, 0.02)', borderRadius: 8 }}>
              <span style={{ fontSize: 13, color: '#94a3b8' }}>Algorithm</span>
              <strong style={{ fontSize: 13, color: '#ffffff' }}>{metrics.model_name}</strong>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 14px', background: 'rgba(255, 255, 255, 0.02)', borderRadius: 8 }}>
              <span style={{ fontSize: 13, color: '#94a3b8' }}>Estimators (Trees)</span>
              <strong style={{ fontSize: 13, fontFamily: 'JetBrains Mono', color: '#ffffff' }}>{metrics.algorithm_params.n_estimators}</strong>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 14px', background: 'rgba(255, 255, 255, 0.02)', borderRadius: 8 }}>
              <span style={{ fontSize: 13, color: '#94a3b8' }}>Max Tree Depth</span>
              <strong style={{ fontSize: 13, fontFamily: 'JetBrains Mono', color: '#ffffff' }}>{metrics.algorithm_params.max_depth}</strong>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 14px', background: 'rgba(255, 255, 255, 0.02)', borderRadius: 8 }}>
              <span style={{ fontSize: 13, color: '#94a3b8' }}>Learning Rate (Shrinkage)</span>
              <strong style={{ fontSize: 13, fontFamily: 'JetBrains Mono', color: '#ffffff' }}>{metrics.algorithm_params.learning_rate}</strong>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 14px', background: 'rgba(255, 255, 255, 0.02)', borderRadius: 8 }}>
              <span style={{ fontSize: 13, color: '#94a3b8' }}>Class Weighting (scale_pos_weight)</span>
              <strong style={{ fontSize: 13, fontFamily: 'JetBrains Mono', color: '#ffffff' }}>{metrics.algorithm_params.scale_pos_weight}x</strong>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 14px', background: 'rgba(255, 255, 255, 0.02)', borderRadius: 8 }}>
              <span style={{ fontSize: 13, color: '#94a3b8' }}>Dataset Size</span>
              <strong style={{ fontSize: 13, color: '#ffffff' }}>{metrics.sample_counts.total_samples.toLocaleString()} Samples (8.6% Failure Rate)</strong>
            </div>
          </div>
        </div>
      </div>

      {/* TOP 10 GLOBAL FEATURE IMPORTANCE */}
      <div className="card" style={{ marginBottom: 28 }}>
        <div className="card-header">
          <div className="card-title">
            <Layers size={18} color="#34d399" />
            <span>Global Venture Feature Importance Ranking (Tree Gain & Information Content)</span>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {metrics.feature_importances.slice(0, 8).map((f, idx) => (
            <div key={idx} style={{ display: 'grid', gridTemplateColumns: '30px 220px 1fr 80px', alignItems: 'center', gap: 14, padding: '10px 14px', background: 'rgba(255, 255, 255, 0.02)', borderRadius: 8 }}>
              <span style={{ fontWeight: 800, color: '#64748b', fontSize: 12 }}>#{idx + 1}</span>
              <span style={{ fontWeight: 700, fontSize: 13, color: '#ffffff' }}>{f.feature.replace(/_/g, ' ').toUpperCase()}</span>
              <div style={{ height: 10, background: 'rgba(255, 255, 255, 0.08)', borderRadius: 5, overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${Math.min(f.importance * 160, 100)}%`, background: 'linear-gradient(90deg, #3b82f6, #8b5cf6)', borderRadius: 5 }} />
              </div>
              <span style={{ fontFamily: 'JetBrains Mono', fontWeight: 800, fontSize: 12.5, textAlign: 'right', color: '#93c5fd' }}>
                {f.importance.toFixed(4)}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* VIVA DEFENSE QUESTIONS & ANSWERS CARD */}
      <div className="card" style={{ background: 'rgba(15, 23, 42, 0.95)', border: '1px solid rgba(59, 130, 246, 0.3)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16, color: '#60a5fa' }}>
          <BookOpen size={20} />
          <h2 style={{ fontSize: 18, fontWeight: 800 }}>Examiner Viva Q&A Defense Guide</h2>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '16px 20px', borderRadius: 10, border: '1px solid var(--border-subtle)' }}>
            <strong style={{ color: '#ffffff', fontSize: 14 }}>Q1: Why is StartGuard AI more suitable for startups than standard business failure models?</strong>
            <p style={{ fontSize: 13, color: '#cbd5e1', marginTop: 4 }}>
              <strong>Answer:</strong> Early-stage startups operate with negative operating margins by design while investing in growth. Traditional models flag any negative profit firm as bankrupt immediately. StartGuard AI explicitly models **Liquid Cash Runway (Months)**, **Net Monthly Burn Rate**, and **Unit Economics (LTV:CAC)**, distinguishing high-growth venture-backed scaleups from terminal cash depletion spirals.
            </p>
          </div>

          <div style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '16px 20px', borderRadius: 10, border: '1px solid var(--border-subtle)' }}>
            <strong style={{ color: '#ffffff', fontSize: 14 }}>Q2: How was the severe Class Imbalance problem resolved?</strong>
            <p style={{ fontSize: 13, color: '#cbd5e1', marginTop: 4 }}>
              <strong>Answer:</strong> In empirical venture datasets, only 8.6% of records represent actual failure events. We implemented <code>scale_pos_weight = 10.56</code> in the gradient loss function, guaranteeing high sensitivity (82.6% Recall) to detect failing ventures before liquid treasury reaches zero.
            </p>
          </div>

          <div style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '16px 20px', borderRadius: 10, border: '1px solid var(--border-subtle)' }}>
            <strong style={{ color: '#ffffff', fontSize: 14 }}>Q3: How does Explainable AI (SHAP) enable the interactive Runway Simulator?</strong>
            <p style={{ fontSize: 13, color: '#cbd5e1', marginTop: 4 }}>
              <strong>Answer:</strong> SHAP isolates the exact positive attribution vectors (e.g., +0.38 from critical runway, +0.26 from excessive monthly burn). Our What-If Simulator lets founders test sensitivity by compressing burn rate and modeling bridge capital, showing simulated runway extension from 4 to 14 months in real time.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

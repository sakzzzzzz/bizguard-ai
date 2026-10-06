import React from 'react';
import { Rocket, Brain, LineChart, Award, Zap } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer style={{ background: '#090d16', color: '#94a3b8', padding: '54px 36px 28px', marginTop: 'auto', borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: 40, paddingBottom: 36, borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: 'white', fontSize: 20, fontWeight: 800, marginBottom: 12 }}>
            <div style={{ width: 28, height: 28, borderRadius: 8, background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Rocket size={16} color="#ffffff" />
            </div>
            <span>Start<span style={{ color: '#60a5fa' }}>Guard</span> AI</span>
          </div>
          <p style={{ fontSize: 13, lineHeight: 1.7, maxWidth: 360, color: '#94a3b8' }}>
            AI-Powered Early Startup Failure Prediction, Runway Analysis & Preventive Decision Support Platform using XGBoost & SHAP Explainable AI.
          </p>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, marginTop: 14, background: 'rgba(59, 130, 246, 0.12)', border: '1px solid rgba(59, 130, 246, 0.3)', padding: '6px 12px', borderRadius: 6, fontSize: 11, color: '#93c5fd' }}>
            <Award size={14} /> Final-Year Engineering & AI Capstone Project
          </div>
        </div>

        <div>
          <h4 style={{ color: 'white', fontSize: 14, fontWeight: 700, marginBottom: 14 }}>Startup AI Engine</h4>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 8, fontSize: 13 }}>
            <li style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Brain size={14} color="#60a5fa" /> XGBoost / GBDT Ensemble</li>
            <li style={{ display: 'flex', alignItems: 'center', gap: 6 }}><LineChart size={14} color="#34d399" /> SHAP TreeExplainer (XAI)</li>
            <li>Runway & Burn Rate Modeling</li>
            <li>Unit Economics (LTV:CAC)</li>
          </ul>
        </div>

        <div>
          <h4 style={{ color: 'white', fontSize: 14, fontWeight: 700, marginBottom: 14 }}>Founder Decision Support</h4>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 8, fontSize: 13 }}>
            <li>Emergency Burn Compression</li>
            <li>Interactive Runway Simulator</li>
            <li>Pricing & Margin Playbooks</li>
            <li>Investor-Ready PDF Audit Deck</li>
          </ul>
        </div>

        <div>
          <h4 style={{ color: 'white', fontSize: 14, fontWeight: 700, marginBottom: 14 }}>Viva Defense Suite</h4>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 8, fontSize: 13 }}>
            <li>Test Accuracy: 92.90%</li>
            <li>Distress Recall: 82.56%</li>
            <li>ROC-AUC Score: 0.9685</li>
            <li>FastAPI + React 19 + TypeScript</li>
          </ul>
        </div>
      </div>

      <div style={{ maxWidth: 1280, margin: '22px auto 0', display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#64748b', flexWrap: 'wrap', gap: 10 }}>
        <div>StartGuard AI © {new Date().getFullYear()} — Startup Solvency & Runway Intelligence System</div>
        <div>Engineered for Venture Analytics & Final-Year Academic Evaluation</div>
      </div>
    </footer>
  );
};

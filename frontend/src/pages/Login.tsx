import React, { useState } from 'react';
import { ActivePage, BusinessInput } from '../types/bizguard';
import { STARTUP_PRESETS } from '../services/api';
import { Rocket, Lock, Mail, ArrowLeft, Sparkles, CheckCircle2, Flame } from 'lucide-react';

interface LoginProps {
  setActivePage: (page: ActivePage) => void;
  onLoginSuccess: (preset?: BusinessInput) => void;
}

export const Login: React.FC<LoginProps> = ({ setActivePage, onLoginSuccess }) => {
  const [email, setEmail] = useState('founder@startguard.ai');
  const [password, setPassword] = useState('demo123');

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLoginSuccess();
  };

  const handleDemoClick = (index: number) => {
    const preset = STARTUP_PRESETS[index];
    onLoginSuccess(preset.data);
  };

  return (
    <div style={{ minHeight: 'calc(100vh - 74px)', display: 'grid', gridTemplateColumns: '1fr 1fr', background: '#080c14' }}>
      {/* LEFT PROMO */}
      <div style={{
        background: 'radial-gradient(circle at 20% 30%, rgba(59, 130, 246, 0.15), transparent 50%), #0f172a',
        color: 'white',
        padding: '60px 48px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        position: 'relative',
        borderRight: '1px solid var(--border-subtle)'
      }}>
        <button
          onClick={() => setActivePage('landing')}
          style={{
            position: 'absolute',
            top: 32,
            left: 48,
            background: 'transparent',
            color: '#94a3b8',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            fontSize: 13,
            fontWeight: 600
          }}
        >
          <ArrowLeft size={16} /> Back to StartGuard AI
        </button>

        <div style={{ maxWidth: 480 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(59, 130, 246, 0.15)', color: '#60a5fa', border: '1px solid rgba(59, 130, 246, 0.3)', padding: '6px 12px', borderRadius: 20, fontSize: 11, fontWeight: 800, letterSpacing: 1, marginBottom: 20 }}>
            <Sparkles size={13} /> FOUNDER RUNWAY & SOLVENCY AI
          </div>

          <h1 style={{ fontSize: 38, fontWeight: 800, lineHeight: 1.2, letterSpacing: -1, marginBottom: 18, color: '#ffffff' }}>
            Protect Your Startup Runway with Explainable AI.
          </h1>

          <p style={{ color: '#94a3b8', fontSize: 15, lineHeight: 1.7, marginBottom: 30 }}>
            Forecast insolvency windows, isolate high-risk burn vectors with SHAP, and test actionable burn compression strategies in real time.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 14, fontSize: 13.5, color: '#e2e8f0' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <CheckCircle2 size={18} color="#10b981" />
              <span>Real-time Cash Runway & Net Burn Rate velocity</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <CheckCircle2 size={18} color="#10b981" />
              <span>XGBoost Gradient Boosted Ensemble (92.9% Accuracy)</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <CheckCircle2 size={18} color="#10b981" />
              <span>SHAP TreeExplainer Unit Economics decomposition</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <CheckCircle2 size={18} color="#10b981" />
              <span>Interactive Runway Extension What-If Simulator</span>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT SIGN IN */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 40 }}>
        <div className="card" style={{ width: '100%', maxWidth: 460, padding: 36, background: '#0f172a', border: '1px solid rgba(255,255,255,0.1)' }}>
          <div style={{ marginBottom: 26 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
              <div style={{ width: 32, height: 32, borderRadius: 8, background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Rocket size={18} color="#ffffff" />
              </div>
              <h2 style={{ fontSize: 24, fontWeight: 800, color: '#ffffff' }}>Sign In to StartGuard</h2>
            </div>
            <p style={{ fontSize: 13.5, color: '#94a3b8' }}>Access your founder intelligence dashboard & audits.</p>
          </div>

          <form onSubmit={handleFormSubmit}>
            <div className="input-field-group">
              <label style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <Mail size={14} /> Founder Email
              </label>
              <input
                type="email"
                className="form-control"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="input-field-group">
              <label style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <Lock size={14} /> Password
              </label>
              <input
                type="password"
                className="form-control"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '12px', marginTop: 10 }}>
              Launch Founder Dashboard →
            </button>
          </form>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10, margin: '24px 0 16px', color: '#64748b', fontSize: 11, fontWeight: 700 }}>
            <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.08)' }} />
            <span>1-CLICK STARTUP PRESETS</span>
            <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.08)' }} />
          </div>

          {/* 1-Click Startup Demo Accounts */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <button
              onClick={() => handleDemoClick(0)}
              className="btn-secondary"
              style={{ justifyContent: 'space-between', padding: '10px 14px', fontSize: 12.5, textAlign: 'left' }}
            >
              <span>🔴 <strong>Seed Stage</strong> (3.8 Mo Runway · 82% Risk)</span>
              <span style={{ color: '#60a5fa', fontWeight: 700 }}>Load Demo →</span>
            </button>

            <button
              onClick={() => handleDemoClick(1)}
              className="btn-secondary"
              style={{ justifyContent: 'space-between', padding: '10px 14px', fontSize: 12.5, textAlign: 'left' }}
            >
              <span>🟢 <strong>Series A SaaS</strong> (24 Mo Runway · 11% Risk)</span>
              <span style={{ color: '#60a5fa', fontWeight: 700 }}>Load Demo →</span>
            </button>

            <button
              onClick={() => handleDemoClick(2)}
              className="btn-secondary"
              style={{ justifyContent: 'space-between', padding: '10px 14px', fontSize: 12.5, textAlign: 'left' }}
            >
              <span>🟡 <strong>Bootstrapped D2C</strong> (7.5 Mo Runway · 38% Risk)</span>
              <span style={{ color: '#60a5fa', fontWeight: 700 }}>Load Demo →</span>
            </button>
          </div>

          <div style={{ marginTop: 22, textAlign: 'center', fontSize: 13, color: '#94a3b8' }}>
            New to StartGuard AI?{' '}
            <button
              onClick={() => setActivePage('signup')}
              style={{ background: 'transparent', color: '#60a5fa', fontWeight: 700 }}
            >
              Create Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

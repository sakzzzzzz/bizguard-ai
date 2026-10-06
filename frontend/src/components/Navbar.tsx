import React, { useEffect, useState } from 'react';
import { ActivePage, BusinessMode } from '../types/bizguard';
import { checkBackendHealth } from '../services/api';
import {
  Rocket,
  LayoutDashboard,
  Calculator,
  Cpu,
  Sliders,
  FileText,
  FileSpreadsheet,
  GraduationCap,
  LogIn,
  LogOut,
  Sparkles,
  Store,
  Layers,
  Sun,
  Moon,
  UploadCloud
} from 'lucide-react';

interface NavbarProps {
  activePage: ActivePage;
  setActivePage: (page: ActivePage) => void;
  isAuthenticated: boolean;
  businessMode?: BusinessMode;
  onToggleBusinessMode?: (mode: BusinessMode) => void;
  onLogout: () => void;
  theme?: 'light' | 'dark';
  onToggleTheme?: () => void;
  onOpenCsvImport?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activePage,
  setActivePage,
  isAuthenticated,
  businessMode = 'tech_startup',
  onToggleBusinessMode,
  onLogout,
  theme = 'dark',
  onToggleTheme,
  onOpenCsvImport
}) => {
  const [backendOnline, setBackendOnline] = useState<boolean>(true);

  useEffect(() => {
    checkBackendHealth().then(setBackendOnline);
    const interval = setInterval(() => {
      checkBackendHealth().then(setBackendOnline);
    }, 15000);
    return () => clearInterval(interval);
  }, []);

  return (
    <nav className="navbar" style={{ height: 'auto', minHeight: 74, padding: '12px 28px', flexWrap: 'wrap', gap: 14 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <div className="nav-brand" onClick={() => setActivePage('landing')}>
          <div style={{ width: 34, height: 34, borderRadius: 10, background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 14px rgba(59, 130, 246, 0.5)' }}>
            <Rocket size={20} color="#ffffff" />
          </div>
          <span style={{ letterSpacing: -0.5 }}>Biz<span style={{ color: '#60a5fa' }}>Guard</span> AI</span>
        </div>
      </div>

      {isAuthenticated && (
        <div className="nav-links" style={{ flexWrap: 'wrap' }}>
          <button
            className={`nav-item ${activePage === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActivePage('dashboard')}
          >
            <LayoutDashboard size={16} /> Dashboard
          </button>

          <button
            className={`nav-item ${activePage === 'input' ? 'active' : ''}`}
            onClick={() => setActivePage('input')}
          >
            <Calculator size={16} /> Analyze Business
          </button>

          <button
            className={`nav-item ${activePage === 'shap' ? 'active' : ''}`}
            onClick={() => setActivePage('shap')}
          >
            <Cpu size={16} /> Explainable AI
          </button>

          <button
            className={`nav-item ${activePage === 'recommendations' ? 'active' : ''}`}
            onClick={() => setActivePage('recommendations')}
          >
            <Sliders size={16} /> Simulator
          </button>

          <button
            className={`nav-item ${activePage === 'ledger' ? 'active' : ''}`}
            onClick={() => setActivePage('ledger')}
            style={{ color: activePage === 'ledger' ? '#60a5fa' : '#34d399' }}
          >
            <FileSpreadsheet size={16} /> Cash Flow Ledger
          </button>

          <button
            className={`nav-item ${activePage === 'reports' ? 'active' : ''}`}
            onClick={() => setActivePage('reports')}
          >
            <FileText size={16} /> Reports
          </button>

          <button
            className={`nav-item ${activePage === 'diagnostics' ? 'active' : ''}`}
            onClick={() => setActivePage('diagnostics')}
          >
            <GraduationCap size={16} /> Diagnostics
          </button>
        </div>
      )}

      <div className="nav-right">
        {/* CSV IMPORT SHORTCUT BUTTON */}
        {onOpenCsvImport && isAuthenticated && (
          <button
            onClick={onOpenCsvImport}
            className="btn-secondary"
            style={{ padding: '6px 12px', fontSize: 11.5, gap: 5, color: '#38bdf8' }}
            title="Import Bank or POS CSV"
          >
            <UploadCloud size={14} /> Import CSV
          </button>
        )}

        {/* SIMPLE DAY / PRO NIGHT MODE TOGGLE BUTTON */}
        {onToggleTheme && (
          <button
            onClick={onToggleTheme}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              padding: '6px 12px',
              borderRadius: 20,
              fontSize: 11.5,
              fontWeight: 700,
              border: '1px solid var(--border-subtle)',
              background: theme === 'light' ? '#ffffff' : 'rgba(255, 255, 255, 0.06)',
              color: theme === 'light' ? '#0f172a' : '#f8fafc',
              cursor: 'pointer',
              boxShadow: theme === 'light' ? '0 2px 8px rgba(0,0,0,0.08)' : 'none',
              transition: 'all 0.2s ease'
            }}
            title={theme === 'light' ? "Switch to Pro Night Mode" : "Switch to Simple Day Mode"}
          >
            {theme === 'light' ? (
              <>
                <Moon size={13} color="#7c3aed" /> <span>🌙 Night Mode</span>
              </>
            ) : (
              <>
                <Sun size={13} color="#f59e0b" /> <span>☀️ Simple Day</span>
              </>
            )}
          </button>
        )}

        <div className={`api-badge ${backendOnline ? '' : 'offline'}`} title={backendOnline ? "FastAPI ML Server Active" : "Local Browser AI Active"}>
          <span className="dot" />
          <span>{backendOnline ? 'XGBoost ML Active' : 'Local AI Engine'}</span>
        </div>

        {isAuthenticated ? (
          <button className="btn-secondary" onClick={onLogout} style={{ padding: '7px 12px', fontSize: 12 }}>
            <LogOut size={14} /> Sign Out
          </button>
        ) : (
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="btn-secondary" onClick={() => setActivePage('login')}>
              <LogIn size={15} /> Sign In
            </button>
            <button className="btn-primary" onClick={() => setActivePage('login')}>
              <Sparkles size={15} /> Launch App
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

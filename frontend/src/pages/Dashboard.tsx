import React, { useState } from 'react';
import { ActivePage, AnalysisResult, BusinessInput, BusinessSector, PosSettlement, PresetBusiness } from '../types/bizguard';
import { STARTUP_PRESETS } from '../services/api';
import { RiskGauge } from '../components/RiskGauge';
import { PosSettlementModal } from '../components/PosSettlementModal';
import { SupplierDuesTracker } from '../components/SupplierDuesTracker';
import { InventoryDeadstockCard } from '../components/InventoryDeadstockCard';
import { CashGapForecastRadar } from '../components/CashGapForecastRadar';
import { WhatsAppAlertSimulator } from '../components/WhatsAppAlertSimulator';
import { InvoiceOcrModal } from '../components/InvoiceOcrModal';
import { WorkingCapitalModal } from '../components/WorkingCapitalModal';
import { CsvImportModal } from '../components/CsvImportModal';
import { BranchPerformanceMatrix } from '../components/BranchPerformanceMatrix';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  Activity,
  Layers,
  ArrowRight,
  ShieldCheck,
  AlertTriangle,
  FileText,
  Sliders,
  Cpu,
  Clock,
  Flame,
  Zap,
  Sparkles,
  PlusCircle,
  ShoppingCart,
  Smartphone,
  CheckCircle2,
  Building2,
  Store,
  Coffee,
  Factory,
  Rocket,
  Calendar,
  Camera,
  Landmark,
  UploadCloud,
  Trash2
} from 'lucide-react';
import { SupplierDue } from '../types/bizguard';

interface DashboardProps {
  currentAnalysis: AnalysisResult | null;
  history: AnalysisResult[];
  companies?: PresetBusiness[];
  setActivePage: (page: ActivePage) => void;
  onSelectPreset: (preset: BusinessInput) => void;
  onSelectHistoryItem: (item: AnalysisResult) => void;
  onOpenCreateCompany?: () => void;
  onDeleteCompany?: (companyName: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  currentAnalysis,
  history,
  companies = STARTUP_PRESETS,
  setActivePage,
  onSelectPreset,
  onSelectHistoryItem,
  onOpenCreateCompany,
  onDeleteCompany
}) => {
  const [isPosModalOpen, setIsPosModalOpen] = useState<boolean>(false);
  const [isWhatsAppModalOpen, setIsWhatsAppModalOpen] = useState<boolean>(false);
  const [isInvoiceOcrOpen, setIsInvoiceOcrOpen] = useState<boolean>(false);
  const [isWorkingCapitalOpen, setIsWorkingCapitalOpen] = useState<boolean>(false);
  const [isCsvModalOpen, setIsCsvModalOpen] = useState<boolean>(false);
  const [posSuccessToast, setPosSuccessToast] = useState<string | null>(null);
  const [injectedCash, setInjectedCash] = useState<number>(0);
  const [ocrInjectedDue, setOcrInjectedDue] = useState<SupplierDue | null>(null);

  if (!currentAnalysis) {
    return (
      <div className="page-wrapper" style={{ textAlign: 'center', padding: '80px 24px' }}>
        <h2>Loading Founder Intelligence Dashboard...</h2>
      </div>
    );
  }

  const runway = currentAnalysis.runway_months;
  const isCriticalRunway = runway < 6.0;
  const isWarningRunway = runway < 12.0 && !isCriticalRunway;
  const effectiveCash = currentAnalysis.inputs.cash_in_bank + injectedCash;

  // Determine current business sector
  const currentSector: BusinessSector = (currentAnalysis.inputs.business_type as BusinessSector) || 'tech_startup';

  const sectorBadges: Record<string, { label: string; icon: any; color: string; bg: string }> = {
    tech_startup: { label: 'Tech Startup', icon: Rocket, color: '#38bdf8', bg: 'rgba(56, 189, 248, 0.15)' },
    supermarket: { label: 'Supermarket / Grocery', icon: ShoppingCart, color: '#34d399', bg: 'rgba(16, 185, 129, 0.15)' },
    retail_shop: { label: 'Retail Apparel / Shop', icon: Store, color: '#fbbf24', bg: 'rgba(245, 158, 11, 0.15)' },
    cafe_restaurant: { label: 'Cafe / Restaurant', icon: Coffee, color: '#f472b6', bg: 'rgba(244, 114, 182, 0.15)' },
    manufacturing_sme: { label: 'SME / Manufacturing', icon: Factory, color: '#a78bfa', bg: 'rgba(167, 139, 250, 0.15)' }
  };

  const currentSectorMeta = sectorBadges[currentSector] || sectorBadges.tech_startup;
  const SectorIcon = currentSectorMeta.icon;

  const handleSaveSettlement = (settlement: PosSettlement) => {
    setPosSuccessToast(`✅ Daily POS Settlement logged: +$${settlement.totalInflow.toLocaleString()} Inflow, Net Margin: +$${settlement.netDailyMargin.toLocaleString()}`);
    setTimeout(() => setPosSuccessToast(null), 6000);
  };

  const handleApplyCashUnlock = (cashAmount: number) => {
    setInjectedCash(prev => prev + cashAmount);
    setPosSuccessToast(`⚡ Clearance Flash Sale Activated: +$${cashAmount.toLocaleString()} injected into Bank Treasury!`);
    setTimeout(() => setPosSuccessToast(null), 6000);
  };

  const handleAddSupplierDueFromOcr = (due: SupplierDue) => {
    // Actually inject the scanned due into the Supplier Dues Tracker
    setOcrInjectedDue(due);
    setPosSuccessToast(`📸 Extracted & Logged Invoice: ${due.vendorName} ($${due.amountDue.toLocaleString()} due ${due.dueDate})`);
    setTimeout(() => setPosSuccessToast(null), 6000);
  };

  const handleInjectWorkingCapital = (amount: number) => {
    setInjectedCash(prev => prev + amount);
    setPosSuccessToast(`🏦 Emergency Working Capital Injected: +$${amount.toLocaleString()} into Bank Treasury! Shortfall resolved.`);
    setTimeout(() => setPosSuccessToast(null), 6000);
  };

  const handleCsvImportSuccess = (_entries: any[], summary: { totalInflow: number; totalOutflow: number; count: number }) => {
    const net = summary.totalInflow - summary.totalOutflow;
    setInjectedCash(prev => prev + net);
    setPosSuccessToast(`📂 Ingested ${summary.count} Bank/POS Transactions (+Net $${net.toLocaleString()})`);
    setTimeout(() => setPosSuccessToast(null), 6000);
  };

  return (
    <div className="page-wrapper">
      {/* SUCCESS NOTIFICATION TOAST */}
      {posSuccessToast && (
        <div style={{
          background: 'linear-gradient(90deg, #065f46, #047857)',
          color: '#ffffff',
          padding: '12px 20px',
          borderRadius: 8,
          marginBottom: 18,
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          boxShadow: '0 4px 15px rgba(4, 120, 87, 0.4)',
          fontSize: '0.88rem',
          fontWeight: 600
        }}>
          <CheckCircle2 size={18} />
          <span>{posSuccessToast}</span>
        </div>
      )}

      {/* RUNWAY ALERT HEADER BANNER */}
      {isCriticalRunway && (
        <div style={{
          background: 'linear-gradient(90deg, rgba(239, 68, 68, 0.2), rgba(239, 68, 68, 0.05))',
          border: '1px solid rgba(239, 68, 68, 0.4)',
          borderRadius: 12,
          padding: '12px 20px',
          marginBottom: 20,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 12
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: '#fca5a5' }}>
            <AlertTriangle size={20} color="#ef4444" />
            <span style={{ fontSize: 13.5, fontWeight: 700 }}>
              <strong>CRITICAL RUNWAY WARNING:</strong> Only {runway} months of cash remaining at current ${currentAnalysis.inputs.monthly_burn_rate?.toLocaleString()}/mo burn rate.
            </span>
          </div>
          <button
            className="btn-primary"
            onClick={() => setActivePage('recommendations')}
            style={{ padding: '6px 14px', fontSize: 12, background: '#ef4444' }}
          >
            Open Burn Simulator →
          </button>
        </div>
      )}

      {/* 5-SECTOR PRESET SELECTOR BAR */}
      <div style={{
        background: '#0f172a',
        border: '1px solid var(--border-subtle)',
        borderRadius: 12,
        padding: '10px 14px',
        marginBottom: 20,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 10
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Building2 size={16} color="#94a3b8" />
          <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Industry Presets:
          </span>
        </div>

        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {companies.map((p) => {
            const isSelected = currentAnalysis.company_name === p.data.company_name;
            const meta = sectorBadges[p.sector || p.data.business_type || 'tech_startup'] || sectorBadges.tech_startup;
            const Icon = meta.icon;

            return (
              <div
                key={p.id}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  borderRadius: 6,
                  border: isSelected ? `1px solid ${meta.color}` : '1px solid #334155',
                  background: isSelected ? meta.bg : '#1e293b',
                  overflow: 'hidden'
                }}
              >
                <button
                  onClick={() => onSelectPreset(p.data)}
                  style={{
                    padding: '5px 8px',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    border: 'none',
                    background: 'transparent',
                    color: isSelected ? '#ffffff' : '#94a3b8',
                    cursor: 'pointer'
                  }}
                >
                  <Icon size={13} color={isSelected ? meta.color : '#94a3b8'} />
                  <span>{p.title.split(' (')[0].split(' - ')[0]}</span>
                </button>
                {onDeleteCompany && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteCompany(p.data.company_name);
                    }}
                    title={`Delete ${p.data.company_name}`}
                    style={{
                      padding: '4px 6px',
                      background: 'transparent',
                      border: 'none',
                      color: '#ef4444',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <Trash2 size={12} />
                  </button>
                )}
              </div>
            );
          })}
        </div>

        {onOpenCreateCompany && (
          <button
            onClick={onOpenCreateCompany}
            className="btn-secondary"
            style={{ padding: '5px 10px', fontSize: '0.75rem', gap: 4 }}
          >
            <PlusCircle size={13} /> + New Business
          </button>
        )}
      </div>

      {/* TOP HEADER & REAL-TIME COMMERCIAL SHORTCUT BUTTONS */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24, flexWrap: 'wrap', gap: 16 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#94a3b8', fontSize: 13, fontWeight: 600, marginBottom: 4 }}>
            <span style={{ 
              background: currentSectorMeta.bg, 
              color: currentSectorMeta.color, 
              padding: '3px 9px', 
              borderRadius: 6, 
              fontSize: 11, 
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: 5
            }}>
              <SectorIcon size={12} /> {currentSectorMeta.label}
            </span>
            <span style={{ color: '#64748b' }}>•</span>
            <span>{currentAnalysis.startup_stage || 'Operating Entity'}</span>
            <span style={{ color: '#64748b' }}>•</span>
            <span style={{ color: '#94a3b8' }}>{currentAnalysis.industry}</span>
          </div>
          <h1 style={{ fontSize: 30, fontWeight: 800, color: '#ffffff', letterSpacing: -0.5, margin: 0 }}>
            {currentAnalysis.company_name}
          </h1>
        </div>

        {/* QUICK ACTION BUTTONS */}
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
          <button
            onClick={() => setIsPosModalOpen(true)}
            style={{
              padding: '8px 14px',
              borderRadius: 8,
              fontSize: '0.82rem',
              fontWeight: 700,
              background: 'linear-gradient(135deg, #10b981, #059669)',
              color: '#ffffff',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              cursor: 'pointer',
              boxShadow: '0 2px 10px rgba(16, 185, 129, 0.3)'
            }}
          >
            <ShoppingCart size={15} /> 🛒 Daily POS Closeout
          </button>

          <button
            onClick={() => setIsWhatsAppModalOpen(true)}
            style={{
              padding: '8px 14px',
              borderRadius: 8,
              fontSize: '0.82rem',
              fontWeight: 700,
              background: 'linear-gradient(135deg, #25D366, #128C7E)',
              color: '#ffffff',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              cursor: 'pointer',
              boxShadow: '0 2px 10px rgba(37, 211, 102, 0.3)'
            }}
          >
            <Smartphone size={15} /> 📱 Live WhatsApp Radar
          </button>

          <button
            onClick={() => setIsInvoiceOcrOpen(true)}
            style={{
              padding: '8px 14px',
              borderRadius: 8,
              fontSize: '0.82rem',
              fontWeight: 700,
              background: 'rgba(16, 185, 129, 0.15)',
              color: '#34d399',
              border: '1px solid rgba(16, 185, 129, 0.35)',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              cursor: 'pointer'
            }}
          >
            <Camera size={15} /> 📸 Scan Invoice
          </button>

          <button
            onClick={() => setIsCsvModalOpen(true)}
            style={{
              padding: '8px 14px',
              borderRadius: 8,
              fontSize: '0.82rem',
              fontWeight: 700,
              background: 'rgba(139, 92, 246, 0.15)',
              color: '#a78bfa',
              border: '1px solid rgba(139, 92, 246, 0.35)',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              cursor: 'pointer'
            }}
          >
            <UploadCloud size={15} /> 📂 Import CSV
          </button>

          <button
            onClick={() => setIsWorkingCapitalOpen(true)}
            style={{
              padding: '8px 14px',
              borderRadius: 8,
              fontSize: '0.82rem',
              fontWeight: 700,
              background: 'rgba(56, 189, 248, 0.15)',
              color: '#38bdf8',
              border: '1px solid rgba(56, 189, 248, 0.35)',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              cursor: 'pointer'
            }}
          >
            <Landmark size={15} /> 🏦 Emergency Capital
          </button>
        </div>
      </div>

      {/* 4 CORE KPI METRIC CARDS */}
      <div className="grid-4" style={{ marginBottom: 24 }}>
        {/* 1. Risk Level */}
        <div className="stat-card">
          <div className="stat-icon" style={{ background: currentAnalysis.risk_color === 'red' ? 'rgba(239, 68, 68, 0.15)' : currentAnalysis.risk_color === 'yellow' ? 'rgba(245, 158, 11, 0.15)' : 'rgba(16, 185, 129, 0.15)', color: currentAnalysis.risk_color === 'red' ? '#f87171' : currentAnalysis.risk_color === 'yellow' ? '#fbbf24' : '#34d399' }}>
            <ShieldCheck size={22} />
          </div>
          <div className="stat-label">Risk Level</div>
          <div className="stat-value" style={{ fontSize: 22, color: currentAnalysis.risk_color === 'red' ? '#f87171' : currentAnalysis.risk_color === 'yellow' ? '#fbbf24' : '#34d399' }}>
            {currentAnalysis.risk_level}
          </div>
          <div className="stat-sub">
            Classification: <strong>{currentAnalysis.health_status}</strong>
          </div>
        </div>

        {/* 2. Failure Risk */}
        <div className="stat-card">
          <div className="stat-icon" style={{ background: currentAnalysis.failure_probability_percent > 60 ? 'rgba(239, 68, 68, 0.15)' : currentAnalysis.failure_probability_percent > 30 ? 'rgba(245, 158, 11, 0.15)' : 'rgba(16, 185, 129, 0.15)', color: currentAnalysis.failure_probability_percent > 60 ? '#f87171' : currentAnalysis.failure_probability_percent > 30 ? '#fbbf24' : '#34d399' }}>
            <Flame size={22} />
          </div>
          <div className="stat-label">Failure Risk</div>
          <div className="stat-value" style={{ color: currentAnalysis.failure_probability_percent > 60 ? '#f87171' : currentAnalysis.failure_probability_percent > 30 ? '#fbbf24' : '#34d399' }}>
            {currentAnalysis.failure_probability_percent.toFixed(1)}%
          </div>
          <div className="stat-sub">
            Probability: <strong>{(currentAnalysis.failure_probability).toFixed(2)} / 1.0</strong>
          </div>
        </div>

        {/* 3. Health Score */}
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(59, 130, 246, 0.15)', color: '#60a5fa' }}>
            <Activity size={22} />
          </div>
          <div className="stat-label">Health Score</div>
          <div className="stat-value" style={{ color: '#60a5fa' }}>
            {currentAnalysis.health_score} <span style={{ fontSize: 16, color: '#94a3b8' }}>/ 100</span>
          </div>
          <div className="stat-sub">
            Status: <strong>{currentAnalysis.health_status}</strong>
          </div>
        </div>

        {/* 4. Cash Runway */}
        <div className="stat-card">
          <div className="stat-icon" style={{ background: isCriticalRunway ? 'rgba(239, 68, 68, 0.15)' : isWarningRunway ? 'rgba(245, 158, 11, 0.15)' : 'rgba(16, 185, 129, 0.15)', color: isCriticalRunway ? '#f87171' : isWarningRunway ? '#fbbf24' : '#34d399' }}>
            <Clock size={22} />
          </div>
          <div className="stat-label">Cash Runway</div>
          <div className="stat-value" style={{ color: isCriticalRunway ? '#f87171' : isWarningRunway ? '#fbbf24' : '#34d399' }}>
            {runway} <span style={{ fontSize: 16, color: '#94a3b8' }}>Months</span>
          </div>
          <div className="stat-sub">
            Treasury: <strong>${(effectiveCash / 1000).toFixed(0)}k in Bank</strong>
          </div>
        </div>
      </div>

      {/* 🚀 REAL-TIME COMMERCIAL OPERATIONS SUITE */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
          <Sparkles size={18} color="#38bdf8" />
          <h2 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 700, color: '#ffffff' }}>
            Real-Time Commercial Operations & Working Capital Radar
          </h2>
          <span style={{ fontSize: '0.75rem', background: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8', padding: '2px 8px', borderRadius: 10, fontWeight: 700 }}>
            COMMERCIAL SUITE
          </span>
        </div>

        <div className="grid-2" style={{ marginBottom: 20 }}>
          {/* 7-Day Ahead AI Cash Gap Predictor */}
          <CashGapForecastRadar
            startingCash={effectiveCash}
            dailyInflowAvg={(currentAnalysis.inputs.daily_cash_inflow || 3200) + (currentAnalysis.inputs.daily_upi_card_inflow || 2400)}
            sector={currentSector}
          />

          {/* Supplier Dues & Liquidity Gap Tracker */}
          <SupplierDuesTracker
            currentCashInBank={effectiveCash}
            dailyInflowAvg={(currentAnalysis.inputs.daily_cash_inflow || 3200) + (currentAnalysis.inputs.daily_upi_card_inflow || 2400)}
            injectedDue={ocrInjectedDue}
          />
        </div>

        {/* Deadstock & Working Capital Lock Card */}
        <InventoryDeadstockCard
          inventoryValuation={currentAnalysis.inputs.inventory || 145000}
          turnoverDays={currentAnalysis.inputs.inventory_turnover_days || 34.5}
          deadstockPercent={currentAnalysis.inputs.deadstock_percent || 22.0}
          sector={currentSector}
          onApplyCashUnlock={handleApplyCashUnlock}
        />
      </div>

      {/* MAIN TWO-COLUMN DASHBOARD GRID: XGBOOST RISK & SHAP */}
      <div className="grid-2" style={{ marginBottom: 28 }}>
        {/* LEFT: RISK DIAL & RUNWAY BREAKDOWN */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">
              <ShieldCheck size={18} color="#3b82f6" />
              <span>XGBoost Insolvency Risk Assessment</span>
            </div>
            <button className="btn-secondary" onClick={() => setActivePage('input')} style={{ padding: '6px 12px', fontSize: 12 }}>
              Edit Metrics
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, alignItems: 'center' }}>
            <RiskGauge
              probabilityPercent={currentAnalysis.failure_probability_percent}
              riskLevel={currentAnalysis.risk_level}
              healthScore={currentAnalysis.health_score}
              runwayMonths={runway}
              size={210}
            />

            <div style={{ fontSize: 13, display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div style={{ padding: '10px 14px', background: 'rgba(255, 255, 255, 0.02)', borderRadius: 8, border: '1px solid var(--border-subtle)' }}>
                <span style={{ color: '#94a3b8', fontSize: 12 }}>Liquid Cash Treasury:</span>
                <div style={{ fontWeight: 800, fontSize: 16, color: '#ffffff' }}>${effectiveCash.toLocaleString()}</div>
              </div>
              <div style={{ padding: '10px 14px', background: 'rgba(255, 255, 255, 0.02)', borderRadius: 8, border: '1px solid var(--border-subtle)' }}>
                <span style={{ color: '#94a3b8', fontSize: 12 }}>Total Debt & Liabilities:</span>
                <div style={{ fontWeight: 800, fontSize: 16, color: '#ffffff' }}>${currentAnalysis.inputs.total_debt.toLocaleString()}</div>
              </div>
              <div style={{ padding: '10px 14px', background: 'rgba(255, 255, 255, 0.02)', borderRadius: 8, border: '1px solid var(--border-subtle)' }}>
                <span style={{ color: '#94a3b8', fontSize: 12 }}>Operating Cash Flow:</span>
                <div style={{ fontWeight: 800, fontSize: 16, color: currentAnalysis.inputs.operating_cash_flow >= 0 ? '#34d399' : '#f87171' }}>
                  ${currentAnalysis.inputs.operating_cash_flow?.toLocaleString()}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT: KEY RISK FACTORS */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">
              <Cpu size={18} color="#a78bfa" />
              <span>Key Risk Factors</span>
            </div>
            <button className="btn-secondary" onClick={() => setActivePage('shap')} style={{ padding: '6px 12px', fontSize: 12 }}>
              Full XAI View →
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {(currentAnalysis.shap_factors || []).slice(0, 4).map((f, idx) => {
              const isRisk = f.direction === 'increases_risk';
              return (
                <div key={idx} style={{ padding: '10px 14px', borderRadius: 8, background: isRisk ? 'rgba(239, 68, 68, 0.05)' : 'rgba(16, 185, 129, 0.05)', border: `1px solid ${isRisk ? 'rgba(239, 68, 68, 0.25)' : 'rgba(16, 185, 129, 0.25)'}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: '#ffffff', display: 'flex', alignItems: 'center', gap: 6 }}>
                      {isRisk ? <TrendingUp size={14} color="#f87171" /> : <TrendingDown size={14} color="#34d399" />}
                      {f.label}
                    </div>
                    <div style={{ fontSize: 11.5, color: '#94a3b8', marginTop: 2 }}>{f.explanation}</div>
                  </div>
                  <div style={{ fontFamily: 'JetBrains Mono', fontSize: 13, fontWeight: 800, color: isRisk ? '#f87171' : '#34d399' }}>
                    {isRisk ? `+${f.shap_value.toFixed(2)}` : `${f.shap_value.toFixed(2)}`}
                  </div>
                </div>
              );
            })}
          </div>

          <div style={{ marginTop: 16, display: 'flex', gap: 10 }}>
            <button className="btn-primary" onClick={() => setActivePage('recommendations')} style={{ flex: 1, justifyContent: 'center', padding: '10px', fontSize: 12.5 }}>
              <Sliders size={15} /> Simulator
            </button>
            <button className="btn-secondary" onClick={() => setActivePage('reports')} style={{ padding: '10px 14px', fontSize: 12.5 }}>
              <FileText size={15} /> Export Report
            </button>
          </div>
        </div>
      </div>

      {/* RATIO SCORECARD */}
      <div className="card" style={{ marginBottom: 28 }}>
        <div className="card-header">
          <div className="card-title">
            <Layers size={18} color="#34d399" />
            <span>Unit Economics & Working Capital Scorecard</span>
          </div>
          <span style={{ fontSize: 12, color: '#94a3b8' }}>Industry benchmark thresholds</span>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Financial Metric</th>
                <th>Observed Value</th>
                <th>Target Benchmark</th>
                <th>Health Status</th>
                <th>Operational Interpretation</th>
              </tr>
            </thead>
            <tbody>
              {currentAnalysis.ratios.map((r, idx) => (
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

      {/* RECENT ANALYSES */}
      <div className="card" id="history-section">
        <div className="card-header">
          <div className="card-title">
            <FileText size={18} color="#60a5fa" />
            <span>Recent Analyses</span>
          </div>
          <span style={{ fontSize: 12, color: '#94a3b8' }}>{history.length} records logged</span>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Timestamp</th>
                <th>Business Name</th>
                <th>Runway</th>
                <th>Failure Probability</th>
                <th>Risk Category</th>
                <th>Health Score</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {history.map((item, idx) => (
                <tr key={idx}>
                  <td style={{ fontSize: 12, color: '#94a3b8' }}>{item.timestamp}</td>
                  <td style={{ fontWeight: 700, color: '#ffffff' }}>{item.company_name}</td>
                  <td style={{ fontFamily: 'JetBrains Mono', fontWeight: 700, color: item.runway_months < 6 ? '#f87171' : '#34d399' }}>
                    {item.runway_months} Mos
                  </td>
                  <td style={{ fontFamily: 'JetBrains Mono', fontWeight: 800, color: item.failure_probability_percent > 60 ? '#f87171' : item.failure_probability_percent > 30 ? '#fbbf24' : '#34d399' }}>
                    {item.failure_probability_percent.toFixed(1)}%
                  </td>
                  <td>
                    <span className={`risk-level-tag ${item.risk_color === 'red' ? 'tag-red' : item.risk_color === 'yellow' ? 'tag-yellow' : 'tag-green'}`} style={{ fontSize: 11, padding: '2px 8px' }}>
                      {item.risk_level}
                    </span>
                  </td>
                  <td><strong>{item.health_score} / 100</strong></td>
                  <td>
                    <button
                      className="btn-secondary"
                      onClick={() => onSelectHistoryItem(item)}
                      style={{ padding: '4px 10px', fontSize: 11 }}
                    >
                      Load Replay →
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* POS SETTLEMENT MODAL */}
      <PosSettlementModal
        isOpen={isPosModalOpen}
        onClose={() => setIsPosModalOpen(false)}
        onSaveSettlement={handleSaveSettlement}
      />

      {/* WHATSAPP ALERTS SIMULATOR MODAL */}
      <WhatsAppAlertSimulator
        isOpen={isWhatsAppModalOpen}
        onClose={() => setIsWhatsAppModalOpen(false)}
        companyName={currentAnalysis.company_name}
        failureRisk={currentAnalysis.failure_probability_percent}
        cashRunwayMonths={runway}
      />

      {/* INVOICE OCR SCANNER MODAL */}
      <InvoiceOcrModal
        isOpen={isInvoiceOcrOpen}
        onClose={() => setIsInvoiceOcrOpen(false)}
        onAddDue={handleAddSupplierDueFromOcr}
      />

      {/* WORKING CAPITAL & FACTORING MODAL */}
      <WorkingCapitalModal
        isOpen={isWorkingCapitalOpen}
        onClose={() => setIsWorkingCapitalOpen(false)}
        liquidityGap={12500}
        onInjectCapital={handleInjectWorkingCapital}
      />

      {/* CSV BANK/POS IMPORT MODAL */}
      <CsvImportModal
        isOpen={isCsvModalOpen}
        onClose={() => setIsCsvModalOpen(false)}
        onImportSuccess={handleCsvImportSuccess}
      />
    </div>
  );
};

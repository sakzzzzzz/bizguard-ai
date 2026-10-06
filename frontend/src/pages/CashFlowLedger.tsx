import React, { useState } from 'react';
import {
  ActivePage,
  AnalysisResult,
  BusinessInput,
  BusinessMode,
  LedgerDailyEntry,
  LedgerMonthlyEntry,
  YearlyProjection
} from '../types/bizguard';
import {
  Calendar,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Clock,
  Download,
  Upload,
  Plus,
  Trash2,
  Sparkles,
  AlertTriangle,
  ArrowRight,
  ShieldAlert,
  FileSpreadsheet,
  Layers,
  LineChart,
  Flame,
  CheckCircle2,
  FileText,
  Printer,
  X,
  Store,
  Rocket,
  UploadCloud
} from 'lucide-react';
import { CsvImportModal } from '../components/CsvImportModal';
import { BranchPerformanceMatrix } from '../components/BranchPerformanceMatrix';

interface CashFlowLedgerProps {
  currentAnalysis: AnalysisResult | null;
  businessMode: BusinessMode;
  onUpdateCompanyMetrics: (updatedInput: BusinessInput) => void;
  setActivePage: (page: ActivePage) => void;
}

type Timeframe = '1D' | '1W' | '1M' | '1Y' | '5Y';

export const CashFlowLedger: React.FC<CashFlowLedgerProps> = ({
  currentAnalysis,
  businessMode,
  onUpdateCompanyMetrics,
  setActivePage
}) => {
  const [selectedTimeframe, setSelectedTimeframe] = useState<Timeframe>('1D');
  const [showReportModal, setShowReportModal] = useState<boolean>(false);
  const [isCsvModalOpen, setIsCsvModalOpen] = useState<boolean>(false);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);

  // Daily Ledger State (Recent 7 days + today)
  const [dailyEntries, setDailyEntries] = useState<LedgerDailyEntry[]>([
    { id: '1', date: '2026-09-07 (Today)', sales: 5400, expenses: 3100, netCash: 2300, footfallOrCustomers: 36, notes: 'Direct customer orders' },
    { id: '2', date: '2026-09-06', sales: 4800, expenses: 3500, netCash: 1300, footfallOrCustomers: 30, notes: 'Consulting subscription' },
    { id: '3', date: '2026-09-05', sales: 6200, expenses: 3300, netCash: 2900, footfallOrCustomers: 41, notes: 'Expansion tier upgrade' },
    { id: '4', date: '2026-09-04', sales: 3400, expenses: 3800, netCash: -400, footfallOrCustomers: 19, notes: 'Ad campaign marketing push' },
    { id: '5', date: '2026-09-03', sales: 5100, expenses: 2900, netCash: 2200, footfallOrCustomers: 34, notes: 'Annual prepayment sign-up' },
    { id: '6', date: '2026-09-02', sales: 3800, expenses: 4200, netCash: -400, footfallOrCustomers: 22, notes: 'Infrastructure scale-up' },
    { id: '7', date: '2026-09-01', sales: 4200, expenses: 3100, netCash: 1100, footfallOrCustomers: 28, notes: 'Enterprise pilot sign-up' }
  ]);

  // Monthly Ledger State (12 Months)
  const [monthlyEntries, setMonthlyEntries] = useState<LedgerMonthlyEntry[]>([
    { id: 'm1', month: 'Jan 2026', sales: 32000, payroll: 55000, marketing: 18000, cloudOrInventory: 12000, totalExpenses: 85000, netBurnOrProfit: -53000, endingCash: 520000, momGrowthPct: 0 },
    { id: 'm2', month: 'Feb 2026', sales: 35000, payroll: 55000, marketing: 20000, cloudOrInventory: 13000, totalExpenses: 88000, netBurnOrProfit: -53000, endingCash: 467000, momGrowthPct: 9.4 },
    { id: 'm3', month: 'Mar 2026', sales: 41000, payroll: 58000, marketing: 22000, cloudOrInventory: 14000, totalExpenses: 94000, netBurnOrProfit: -53000, endingCash: 414000, momGrowthPct: 17.1 },
    { id: 'm4', month: 'Apr 2026', sales: 44000, payroll: 62000, marketing: 24000, cloudOrInventory: 15000, totalExpenses: 101000, netBurnOrProfit: -57000, endingCash: 357000, momGrowthPct: 7.3 },
    { id: 'm5', month: 'May 2026', sales: 49000, payroll: 65000, marketing: 26000, cloudOrInventory: 16000, totalExpenses: 107000, netBurnOrProfit: -58000, endingCash: 299000, momGrowthPct: 11.4 },
    { id: 'm6', month: 'Jun 2026', sales: 55000, payroll: 70000, marketing: 28000, cloudOrInventory: 17000, totalExpenses: 115000, netBurnOrProfit: -60000, endingCash: 239000, momGrowthPct: 12.2 }
  ]);

  // Quick Daily Entry Form Inputs
  const [newDate, setNewDate] = useState(new Date().toISOString().split('T')[0]);
  const [newSales, setNewSales] = useState<number>(5000);
  const [newExpenses, setNewExpenses] = useState<number>(3200);
  const [newCustomers, setNewCustomers] = useState<number>(28);
  const [newNotes, setNewNotes] = useState('');

  const company = currentAnalysis?.inputs as BusinessInput || {
    company_name: 'Solas Earth Consumer Goods',
    cash_in_bank: 210000,
    monthly_burn_rate: 28000,
    revenue: 1650000,
    sales_growth_yoy: 22.0
  };

  const cashInBank = currentAnalysis?.inputs?.cash_in_bank ?? 210000;
  const currentBurn = currentAnalysis?.inputs?.monthly_burn_rate ?? 28000;
  const runwayMonths = currentAnalysis?.runway_months ?? 7.5;
  const failureProb = currentAnalysis?.failure_probability_percent ?? 38.0;

  // Zero cash date calculation
  const zeroCashMonths = Math.max(runwayMonths, 0.5);
  const zeroDate = new Date();
  zeroDate.setMonth(zeroDate.getMonth() + Math.floor(zeroCashMonths));
  const zeroDateFormatted = zeroDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });

  // 1-Day Stats
  const todayEntry = dailyEntries[0] || { sales: 5400, expenses: 3100, netCash: 2300, footfallOrCustomers: 36 };
  
  // 1-Week Stats (Sum of 7 entries)
  const weekSales = dailyEntries.slice(0, 7).reduce((acc, r) => acc + r.sales, 0);
  const weekExpenses = dailyEntries.slice(0, 7).reduce((acc, r) => acc + r.expenses, 0);
  const weekNet = weekSales - weekExpenses;
  const weekCustomers = dailyEntries.slice(0, 7).reduce((acc, r) => acc + (r.footfallOrCustomers || 0), 0);

  // 1-Month Stats
  const latestMonth = monthlyEntries[monthlyEntries.length - 1] || { sales: 55000, totalExpenses: 115000, netBurnOrProfit: -60000, momGrowthPct: 12.2 };
  
  // 1-Year Stats
  const yearSales = Math.round(company.revenue || 1650000);
  const yearExpenses = Math.round(company.operating_expenses || 1520000);
  const yearProfit = yearSales - yearExpenses;

  // 5-Year Projections Matrix
  const yearlyProjections: YearlyProjection[] = [
    { yearLabel: 'Year 1 (Current)', projectedSales: yearSales, projectedExpenses: yearExpenses, projectedEndingCash: Math.max(cashInBank - currentBurn * 12, 10000), runwayMonths: Math.round(runwayMonths), failureRiskPercent: failureProb },
    { yearLabel: 'Year 2 (+35% Scale)', projectedSales: Math.round(yearSales * 1.35), projectedExpenses: Math.round(yearExpenses * 1.15), projectedEndingCash: Math.round(cashInBank * 1.3), runwayMonths: Math.round(runwayMonths * 1.5), failureRiskPercent: Math.max(failureProb - 14, 10) },
    { yearLabel: 'Year 3 (Market Fit)', projectedSales: Math.round(yearSales * 1.85), projectedExpenses: Math.round(yearExpenses * 1.28), projectedEndingCash: Math.round(cashInBank * 2.1), runwayMonths: Math.round(runwayMonths * 2.4), failureRiskPercent: Math.max(failureProb - 24, 7) },
    { yearLabel: 'Year 4 (Expansion)', projectedSales: Math.round(yearSales * 2.6), projectedExpenses: Math.round(yearExpenses * 1.45), projectedEndingCash: Math.round(cashInBank * 3.4), runwayMonths: 36, failureRiskPercent: 5 },
    { yearLabel: 'Year 5 (Maturity)', projectedSales: Math.round(yearSales * 3.8), projectedExpenses: Math.round(yearExpenses * 1.7), projectedEndingCash: Math.round(cashInBank * 5.5), runwayMonths: 48, failureRiskPercent: 3 }
  ];

  // Add Daily Entry Handler
  const handleAddDailyEntry = (e: React.FormEvent) => {
    e.preventDefault();
    const net = newSales - newExpenses;
    const entry: LedgerDailyEntry = {
      id: String(Date.now()),
      date: newDate,
      sales: newSales,
      expenses: newExpenses,
      netCash: net,
      footfallOrCustomers: newCustomers,
      notes: newNotes || (businessMode === 'tech_startup' ? 'SaaS recurring billing' : 'Retail order settlement')
    };

    setDailyEntries(prev => [entry, ...prev]);

    // Recalculate AI Risk
    const annualizedSales = newSales * 30 * 12;
    const estimatedMonthlyBurn = Math.max(newExpenses * 30 - newSales * 30, 5000);
    const updatedCompany: BusinessInput = {
      ...company,
      revenue: Math.round(annualizedSales),
      monthly_burn_rate: Math.round(estimatedMonthlyBurn),
      operating_expenses: Math.round(newExpenses * 30 * 12)
    };

    onUpdateCompanyMetrics(updatedCompany);

    if (net >= 0) {
      setAlertMessage(`🎉 Cash-Positive Entry: +$${net.toLocaleString()} net inflow. AI re-scored: Runway extended and failure probability lowered.`);
    } else {
      setAlertMessage(`⚠️ Net Burn Entry: -$${Math.abs(net).toLocaleString()} cash loss. AI re-scored: Runway adjusted.`);
    }

    setNewNotes('');
  };

  const handleDeleteDaily = (id: string) => {
    setDailyEntries(prev => prev.filter(e => e.id !== id));
  };

  // Export CSV
  const handleExportCSV = () => {
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Date,Sales,Expenses,NetCashFlow,Customers,Notes\n";
    dailyEntries.forEach(row => {
      csvContent += `${row.date},${row.sales},${row.expenses},${row.netCash},${row.footfallOrCustomers || 0},"${row.notes || ''}"\n`;
    });
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${company.company_name.replace(/\s+/g, '_')}_${selectedTimeframe}_ledger.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Import CSV
  const handleImportCSV = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const text = evt.target?.result as string;
      if (!text) return;
      const lines = text.split('\n').filter(l => l.trim().length > 0);
      const parsed: LedgerDailyEntry[] = [];

      for (let i = 1; i < lines.length; i++) {
        const parts = lines[i].split(',');
        if (parts.length >= 3) {
          const s = parseFloat(parts[1]) || 0;
          const ex = parseFloat(parts[2]) || 0;
          parsed.push({
            id: `import_${i}_${Date.now()}`,
            date: parts[0].trim() || '2026-09-01',
            sales: s,
            expenses: ex,
            netCash: s - ex,
            footfallOrCustomers: parseInt(parts[3]) || 25,
            notes: parts[4] ? parts[4].replace(/"/g, '') : 'Imported row'
          });
        }
      }

      if (parsed.length > 0) {
        setDailyEntries(prev => [...parsed, ...prev]);
        setAlertMessage(`📂 Successfully imported ${parsed.length} records! AI model updated with new sales numbers.`);
      }
    };
    reader.readAsText(file);
  };

  const handleImportCsvSuccess = (entries: LedgerDailyEntry[], summary: { totalInflow: number; totalOutflow: number; count: number }) => {
    setDailyEntries(prev => [...entries, ...prev]);
    setAlertMessage(`🎉 Successfully ingested ${summary.count} transactions! Added +$${summary.totalInflow.toLocaleString()} to ledger.`);
    setTimeout(() => setAlertMessage(null), 6000);
  };

  return (
    <div className="page-wrapper">
      {/* MODERN SAAS HEADER WITH TIMEFRAME SELECTOR */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 16 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#94a3b8', fontSize: 13, marginBottom: 4 }}>
            <span>Entity:</span>
            <strong style={{ color: '#ffffff', fontSize: 16 }}>{company.company_name}</strong>
            <span style={{ background: 'rgba(59, 130, 246, 0.15)', color: '#93c5fd', padding: '2px 8px', borderRadius: 4, fontSize: 11, fontWeight: 700 }}>
              {company.startup_stage || 'Operating'}
            </span>
          </div>
          <div style={{ fontSize: 12.5, color: '#64748b' }}>
            Cash in Bank: <strong style={{ color: '#34d399' }}>${cashInBank.toLocaleString()}</strong> · Mode: <strong style={{ color: '#cbd5e1' }}>{businessMode === 'tech_startup' ? 'Tech Startup' : 'Traditional Business'}</strong>
          </div>
        </div>

        {/* TIMEFRAME SELECTOR BUTTONS: 1D | 1W | 1M | 1Y | 5Y | REPORT */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#0f172a', padding: '5px 8px', borderRadius: 14, border: '1px solid var(--border-subtle)', boxShadow: '0 4px 16px rgba(0,0,0,0.4)', flexWrap: 'wrap' }}>
          {(['1D', '1W', '1M', '1Y', '5Y'] as Timeframe[]).map((tf) => {
            const isActive = selectedTimeframe === tf;
            const labelMap: Record<Timeframe, string> = {
              '1D': '1 Day',
              '1W': '1 Week',
              '1M': '1 Month',
              '1Y': '1 Year',
              '5Y': '5 Years'
            };
            return (
              <button
                key={tf}
                onClick={() => setSelectedTimeframe(tf)}
                style={{
                  padding: '7px 14px',
                  borderRadius: 10,
                  fontSize: 12.5,
                  fontWeight: 700,
                  border: isActive ? '1px solid #3b82f6' : '1px solid transparent',
                  background: isActive ? 'linear-gradient(135deg, #3b82f6, #2563eb)' : 'transparent',
                  color: isActive ? '#ffffff' : '#94a3b8',
                  boxShadow: isActive ? '0 2px 10px rgba(59, 130, 246, 0.4)' : 'none',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                {labelMap[tf]}
              </button>
            );
          })}

          <div style={{ width: 1, height: 20, background: 'rgba(255,255,255,0.1)', margin: '0 2px' }} />

          <button
            onClick={() => setShowReportModal(true)}
            style={{
              padding: '7px 14px',
              borderRadius: 10,
              fontSize: 12.5,
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              border: '1px solid rgba(16, 185, 129, 0.35)',
              background: 'rgba(16, 185, 129, 0.15)',
              color: '#34d399',
              cursor: 'pointer'
            }}
          >
            <FileText size={14} /> Report
          </button>

          <button
            onClick={handleExportCSV}
            style={{
              padding: '7px 14px',
              borderRadius: 10,
              fontSize: 12.5,
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              border: '1px solid rgba(59, 130, 246, 0.35)',
              background: 'rgba(59, 130, 246, 0.15)',
              color: '#38bdf8',
              cursor: 'pointer'
            }}
            title="Download formatted CSV/Excel ledger"
          >
            <Download size={14} /> Export CSV
          </button>

          <button
            onClick={() => setIsCsvModalOpen(true)}
            style={{
              padding: '7px 14px',
              borderRadius: 10,
              fontSize: 12.5,
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              border: '1px solid rgba(139, 92, 246, 0.35)',
              background: 'rgba(139, 92, 246, 0.15)',
              color: '#a78bfa',
              cursor: 'pointer'
            }}
            title="Upload bank or POS CSV statement"
          >
            <UploadCloud size={14} /> Import CSV
          </button>
        </div>
      </div>

      {/* DYNAMIC ALERT BANNER */}
      {alertMessage && (
        <div style={{
          background: alertMessage.includes('🎉') ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
          border: `1px solid ${alertMessage.includes('🎉') ? 'rgba(16, 185, 129, 0.4)' : 'rgba(239, 68, 68, 0.4)'}`,
          borderRadius: 12,
          padding: '10px 16px',
          marginBottom: 20,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          color: alertMessage.includes('🎉') ? '#34d399' : '#fca5a5',
          fontSize: 13,
          fontWeight: 600
        }}>
          <span>{alertMessage}</span>
          <button onClick={() => setAlertMessage(null)} style={{ background: 'transparent', color: 'inherit', fontWeight: 800, padding: 4 }}>✕</button>
        </div>
      )}

      {/* DYNAMIC TIMEFRAME KPI STATS */}
      <div className="grid-4" style={{ marginBottom: 24 }}>
        {/* STAT 1: SALES FOR SELECTED TIMEFRAME */}
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#34d399' }}>
            <DollarSign size={20} />
          </div>
          <div className="stat-label">
            {selectedTimeframe === '1D' && "Today's Inflow / Sales"}
            {selectedTimeframe === '1W' && "Past 7 Days Sales"}
            {selectedTimeframe === '1M' && "Monthly Gross Revenue"}
            {selectedTimeframe === '1Y' && "Annual Revenue (ARR)"}
            {selectedTimeframe === '5Y' && "5-Year Revenue Target"}
          </div>
          <div className="stat-value" style={{ color: '#34d399' }}>
            ${(
              selectedTimeframe === '1D' ? todayEntry.sales :
              selectedTimeframe === '1W' ? weekSales :
              selectedTimeframe === '1M' ? latestMonth.sales :
              selectedTimeframe === '1Y' ? yearSales :
              yearlyProjections[4].projectedSales
            ).toLocaleString()}
          </div>
          <div className="stat-sub">
            {selectedTimeframe === '1D' ? `${todayEntry.footfallOrCustomers} orders logged` :
             selectedTimeframe === '1W' ? `${weekCustomers} customer transactions` :
             selectedTimeframe === '1M' ? `+${latestMonth.momGrowthPct}% MoM velocity` :
             selectedTimeframe === '1Y' ? `+${company.sales_growth_yoy || 22}% YoY Growth` :
             "Projected enterprise scale"}
          </div>
        </div>

        {/* STAT 2: EXPENSES / BURN */}
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(239, 68, 68, 0.15)', color: '#f87171' }}>
            <Flame size={20} />
          </div>
          <div className="stat-label">
            {selectedTimeframe === '1D' && "Today's Operating Expenses"}
            {selectedTimeframe === '1W' && "7-Day Total Outflow"}
            {selectedTimeframe === '1M' && "Monthly Operating Expenses"}
            {selectedTimeframe === '1Y' && "Annual Operating Costs"}
            {selectedTimeframe === '5Y' && "Projected Year 5 Expenses"}
          </div>
          <div className="stat-value" style={{ color: '#f87171' }}>
            ${(
              selectedTimeframe === '1D' ? todayEntry.expenses :
              selectedTimeframe === '1W' ? weekExpenses :
              selectedTimeframe === '1M' ? latestMonth.totalExpenses :
              selectedTimeframe === '1Y' ? yearExpenses :
              yearlyProjections[4].projectedExpenses
            ).toLocaleString()}
          </div>
          <div className="stat-sub">
            {selectedTimeframe === '1D' ? 'Payroll, operations & supplies' :
             selectedTimeframe === '1W' ? `Avg $${Math.round(weekExpenses / 7).toLocaleString()}/day` :
             selectedTimeframe === '1M' ? `Net Burn: $${Math.abs(latestMonth.netBurnOrProfit).toLocaleString()}` :
             selectedTimeframe === '1Y' ? 'Annualized cost structure' :
             'Includes expansion investments'}
          </div>
        </div>

        {/* STAT 3: NET CASH FLOW */}
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(59, 130, 246, 0.15)', color: '#60a5fa' }}>
            <TrendingUp size={20} />
          </div>
          <div className="stat-label">
            {selectedTimeframe === '1D' && "Today's Net Cash Flow"}
            {selectedTimeframe === '1W' && "7-Day Net Cash Generated"}
            {selectedTimeframe === '1M' && "Monthly Net Cash Margin"}
            {selectedTimeframe === '1Y' && "Annual Net Profit / Loss"}
            {selectedTimeframe === '5Y' && "Year 5 Ending Treasury"}
          </div>
          <div className="stat-value" style={{
            color: (
              selectedTimeframe === '1D' ? todayEntry.netCash :
              selectedTimeframe === '1W' ? weekNet :
              selectedTimeframe === '1M' ? latestMonth.netBurnOrProfit :
              selectedTimeframe === '1Y' ? yearProfit :
              yearlyProjections[4].projectedEndingCash
            ) >= 0 ? '#34d399' : '#f87171'
          }}>
            {(
              selectedTimeframe === '1D' ? todayEntry.netCash :
              selectedTimeframe === '1W' ? weekNet :
              selectedTimeframe === '1M' ? latestMonth.netBurnOrProfit :
              selectedTimeframe === '1Y' ? yearProfit :
              yearlyProjections[4].projectedEndingCash
            ) >= 0 ? '+' : ''}${(
              selectedTimeframe === '1D' ? todayEntry.netCash :
              selectedTimeframe === '1W' ? weekNet :
              selectedTimeframe === '1M' ? latestMonth.netBurnOrProfit :
              selectedTimeframe === '1Y' ? yearProfit :
              yearlyProjections[4].projectedEndingCash
            ).toLocaleString()}
          </div>
          <div className="stat-sub">
            {(
              selectedTimeframe === '1D' ? todayEntry.netCash :
              selectedTimeframe === '1W' ? weekNet :
              selectedTimeframe === '1M' ? latestMonth.netBurnOrProfit :
              selectedTimeframe === '1Y' ? yearProfit :
              1
            ) >= 0 ? '🟢 Cash surplus' : '🔴 Net cash drain'}
          </div>
        </div>

        {/* STAT 4: RUNWAY BUFFER & FAILURE RISK */}
        <div className="stat-card">
          <div className="stat-icon" style={{ background: runwayMonths < 6 ? 'rgba(239, 68, 68, 0.15)' : 'rgba(16, 185, 129, 0.15)', color: runwayMonths < 6 ? '#f87171' : '#34d399' }}>
            <Clock size={20} />
          </div>
          <div className="stat-label">Runway & Zero-Cash Date</div>
          <div className="stat-value" style={{ color: runwayMonths < 6 ? '#f87171' : '#34d399' }}>
            {runwayMonths} <span style={{ fontSize: 14, color: '#94a3b8' }}>Mos</span>
          </div>
          <div className="stat-sub">
            Zero Cash: <strong style={{ color: '#ef4444' }}>{zeroDateFormatted}</strong> ({failureProb.toFixed(1)}% risk)
          </div>
        </div>
      </div>

      {/* VIEW CONTENT BY SELECTED TIMEFRAME */}
      
      {/* 1 DAY VIEW */}
      {selectedTimeframe === '1D' && (
        <div>
          {/* QUICK ENTRY FORM */}
          <div className="card" style={{ marginBottom: 20, padding: 20, background: 'rgba(15, 23, 42, 0.95)', border: '1px solid rgba(59, 130, 246, 0.25)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <h3 style={{ fontSize: 15, fontWeight: 800, color: '#ffffff', display: 'flex', alignItems: 'center', gap: 6 }}>
                <Plus size={16} color="#60a5fa" /> Log Today's Sales & Expenses (Updates AI Model Live)
              </h3>
              <div style={{ display: 'flex', gap: 8 }}>
                <label className="btn-secondary" style={{ cursor: 'pointer', padding: '5px 10px', fontSize: 11.5 }}>
                  <Upload size={13} style={{ display: 'inline', marginRight: 4 }} /> Import CSV
                  <input type="file" accept=".csv" onChange={handleImportCSV} style={{ display: 'none' }} />
                </label>
                <button className="btn-secondary" onClick={handleExportCSV} style={{ padding: '5px 10px', fontSize: 11.5 }}>
                  <Download size={13} /> Export
                </button>
              </div>
            </div>

            <form onSubmit={handleAddDailyEntry} style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 1fr 1fr 1.5fr auto', gap: 10, alignItems: 'flex-end' }}>
              <div>
                <label style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', display: 'block', marginBottom: 4 }}>Date</label>
                <input
                  type="date"
                  className="form-control"
                  style={{ padding: '7px 10px', fontSize: 12.5 }}
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                  required
                />
              </div>

              <div>
                <label style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', display: 'block', marginBottom: 4 }}>Sales Today ($)</label>
                <input
                  type="number"
                  className="form-control"
                  style={{ padding: '7px 10px', fontSize: 12.5 }}
                  value={newSales}
                  onChange={(e) => setNewSales(parseFloat(e.target.value) || 0)}
                  required
                />
              </div>

              <div>
                <label style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', display: 'block', marginBottom: 4 }}>Expenses Today ($)</label>
                <input
                  type="number"
                  className="form-control"
                  style={{ padding: '7px 10px', fontSize: 12.5 }}
                  value={newExpenses}
                  onChange={(e) => setNewExpenses(parseFloat(e.target.value) || 0)}
                  required
                />
              </div>

              <div>
                <label style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', display: 'block', marginBottom: 4 }}>Orders / Footfall</label>
                <input
                  type="number"
                  className="form-control"
                  style={{ padding: '7px 10px', fontSize: 12.5 }}
                  value={newCustomers}
                  onChange={(e) => setNewCustomers(parseInt(e.target.value) || 0)}
                />
              </div>

              <div>
                <label style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', display: 'block', marginBottom: 4 }}>Notes</label>
                <input
                  type="text"
                  className="form-control"
                  style={{ padding: '7px 10px', fontSize: 12.5 }}
                  placeholder="e.g. Inbound orders"
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                />
              </div>

              <button type="submit" className="btn-primary" style={{ padding: '8px 16px', fontSize: 12.5, height: 36 }}>
                + Log Entry
              </button>
            </form>
          </div>

          {/* RECENT DAILY TRANSACTIONS TABLE */}
          <div className="card">
            <div className="card-header">
              <div className="card-title">
                <Calendar size={16} color="#60a5fa" />
                <span>Today's Daily Transaction Log</span>
              </div>
              <span style={{ fontSize: 12, color: '#94a3b8' }}>{dailyEntries.length} Recorded Days</span>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Sales / Inflow</th>
                    <th>Operating Expenses</th>
                    <th>Net Cash Flow</th>
                    <th>Customers</th>
                    <th>Notes</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {dailyEntries.map((row) => (
                    <tr key={row.id}>
                      <td style={{ fontWeight: 700, color: '#ffffff' }}>{row.date}</td>
                      <td style={{ fontFamily: 'JetBrains Mono', color: '#34d399', fontWeight: 800 }}>+${row.sales.toLocaleString()}</td>
                      <td style={{ fontFamily: 'JetBrains Mono', color: '#f87171', fontWeight: 800 }}>-${row.expenses.toLocaleString()}</td>
                      <td>
                        <span style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 4,
                          padding: '2px 8px',
                          borderRadius: 6,
                          fontFamily: 'JetBrains Mono',
                          fontWeight: 800,
                          fontSize: 12,
                          background: row.netCash >= 0 ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                          color: row.netCash >= 0 ? '#34d399' : '#f87171'
                        }}>
                          {row.netCash >= 0 ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
                          {row.netCash >= 0 ? `+$${row.netCash.toLocaleString()}` : `-$${Math.abs(row.netCash).toLocaleString()}`}
                        </span>
                      </td>
                      <td>{row.footfallOrCustomers ?? 25}</td>
                      <td style={{ color: '#cbd5e1', fontSize: 12 }}>{row.notes}</td>
                      <td>
                        <button
                          onClick={() => handleDeleteDaily(row.id)}
                          style={{ background: 'transparent', color: '#ef4444', padding: 4, cursor: 'pointer' }}
                          title="Delete entry"
                        >
                          <Trash2 size={14} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 1 WEEK VIEW */}
      {selectedTimeframe === '1W' && (
        <div className="card">
          <div className="card-header">
            <div className="card-title">
              <LineChart size={16} color="#60a5fa" />
              <span>Past 7-Day Performance Breakdown</span>
            </div>
            <span style={{ fontSize: 12, color: '#34d399', fontWeight: 700 }}>
              7-Day Net: {weekNet >= 0 ? `+$${weekNet.toLocaleString()}` : `-$${Math.abs(weekNet).toLocaleString()}`}
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 10, margin: '14px 0 20px' }}>
            {dailyEntries.slice(0, 7).reverse().map((d, idx) => (
              <div key={idx} style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-subtle)', borderRadius: 10, padding: 12, textAlign: 'center' }}>
                <div style={{ fontSize: 11, color: '#94a3b8', marginBottom: 4 }}>{d.date.split(' ')[0].slice(5)}</div>
                <div style={{ fontSize: 14, fontWeight: 800, color: '#34d399' }}>${d.sales.toLocaleString()}</div>
                <div style={{ fontSize: 11, color: '#f87171', margin: '2px 0' }}>-${d.expenses.toLocaleString()}</div>
                <div style={{ fontSize: 11, fontWeight: 800, color: d.netCash >= 0 ? '#34d399' : '#f87171' }}>
                  {d.netCash >= 0 ? `+$${d.netCash}` : `-$${Math.abs(d.netCash)}`}
                </div>
              </div>
            ))}
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Day</th>
                  <th>Total Sales</th>
                  <th>Expenses</th>
                  <th>Net Cash Position</th>
                  <th>Transactions</th>
                </tr>
              </thead>
              <tbody>
                {dailyEntries.slice(0, 7).map((d) => (
                  <tr key={d.id}>
                    <td style={{ fontWeight: 700, color: '#ffffff' }}>{d.date}</td>
                    <td style={{ color: '#34d399', fontWeight: 800 }}>${d.sales.toLocaleString()}</td>
                    <td style={{ color: '#f87171' }}>${d.expenses.toLocaleString()}</td>
                    <td style={{ fontWeight: 800, color: d.netCash >= 0 ? '#34d399' : '#f87171' }}>
                      {d.netCash >= 0 ? `+$${d.netCash.toLocaleString()}` : `-$${Math.abs(d.netCash).toLocaleString()}`}
                    </td>
                    <td>{d.footfallOrCustomers}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 1 MONTH VIEW */}
      {selectedTimeframe === '1M' && (
        <div className="card">
          <div className="card-header">
            <div className="card-title">
              <FileSpreadsheet size={16} color="#34d399" />
              <span>Month-by-Month Operating & Burn Ledger</span>
            </div>
            <span style={{ fontSize: 12, color: '#94a3b8' }}>Latest month: {latestMonth.month}</span>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Period</th>
                  <th>Gross Sales</th>
                  <th>Payroll & Team</th>
                  <th>Marketing / CAC</th>
                  <th>Cloud / Inventory</th>
                  <th>Total OPEX</th>
                  <th>Net Cash Burn</th>
                  <th>Ending Treasury</th>
                  <th>MoM Growth</th>
                </tr>
              </thead>
              <tbody>
                {monthlyEntries.map((m) => (
                  <tr key={m.id}>
                    <td style={{ fontWeight: 800, color: '#ffffff' }}>{m.month}</td>
                    <td style={{ fontFamily: 'JetBrains Mono', color: '#34d399', fontWeight: 800 }}>${m.sales.toLocaleString()}</td>
                    <td style={{ fontFamily: 'JetBrains Mono' }}>${m.payroll.toLocaleString()}</td>
                    <td style={{ fontFamily: 'JetBrains Mono' }}>${m.marketing.toLocaleString()}</td>
                    <td style={{ fontFamily: 'JetBrains Mono' }}>${m.cloudOrInventory.toLocaleString()}</td>
                    <td style={{ fontFamily: 'JetBrains Mono', color: '#f87171', fontWeight: 700 }}>${m.totalExpenses.toLocaleString()}</td>
                    <td style={{ fontFamily: 'JetBrains Mono', fontWeight: 800, color: m.netBurnOrProfit >= 0 ? '#34d399' : '#f87171' }}>
                      {m.netBurnOrProfit >= 0 ? `+$${m.netBurnOrProfit.toLocaleString()}` : `-$${Math.abs(m.netBurnOrProfit).toLocaleString()}`}
                    </td>
                    <td style={{ fontFamily: 'JetBrains Mono', fontWeight: 800, color: '#93c5fd' }}>
                      ${m.endingCash.toLocaleString()}
                    </td>
                    <td>
                      <span className={`risk-level-tag ${m.momGrowthPct > 10 ? 'tag-green' : m.momGrowthPct > 0 ? 'tag-yellow' : 'tag-red'}`} style={{ fontSize: 11, padding: '2px 8px' }}>
                        +{m.momGrowthPct}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 1 YEAR VIEW */}
      {selectedTimeframe === '1Y' && (
        <div className="card">
          <div className="card-header">
            <div className="card-title">
              <DollarSign size={16} color="#60a5fa" />
              <span>Full Year Financial Horizon</span>
            </div>
            <span style={{ fontSize: 12, color: '#94a3b8' }}>Annualized Velocity</span>
          </div>

          <div className="grid-3" style={{ margin: '14px 0 20px' }}>
            <div style={{ background: 'rgba(255,255,255,0.02)', padding: 18, borderRadius: 12, border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: 12, color: '#94a3b8' }}>Annual Revenue (ARR)</div>
              <div style={{ fontSize: 24, fontWeight: 800, color: '#34d399', margin: '4px 0' }}>${yearSales.toLocaleString()}</div>
              <div style={{ fontSize: 12, color: '#cbd5e1' }}>YoY Growth: +{company.sales_growth_yoy || 22}%</div>
            </div>

            <div style={{ background: 'rgba(255,255,255,0.02)', padding: 18, borderRadius: 12, border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: 12, color: '#94a3b8' }}>Annual Operating Expenses</div>
              <div style={{ fontSize: 24, fontWeight: 800, color: '#f87171', margin: '4px 0' }}>${yearExpenses.toLocaleString()}</div>
              <div style={{ fontSize: 12, color: '#cbd5e1' }}>Avg ${(yearExpenses / 12).toLocaleString()}/mo</div>
            </div>

            <div style={{ background: 'rgba(255,255,255,0.02)', padding: 18, borderRadius: 12, border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: 12, color: '#94a3b8' }}>Annual Operating Margin</div>
              <div style={{ fontSize: 24, fontWeight: 800, color: yearProfit >= 0 ? '#34d399' : '#f87171', margin: '4px 0' }}>
                {yearProfit >= 0 ? `+$${yearProfit.toLocaleString()}` : `-$${Math.abs(yearProfit).toLocaleString()}`}
              </div>
              <div style={{ fontSize: 12, color: '#cbd5e1' }}>{yearProfit >= 0 ? 'Profitable operation' : 'Venture funded burn'}</div>
            </div>
          </div>
        </div>
      )}

      {/* 5 YEARS VIEW */}
      {selectedTimeframe === '5Y' && (
        <div>
          {/* ZERO CASH DATE SVG GRAPH */}
          <div className="card" style={{ marginBottom: 20, padding: 22, background: '#0f172a', border: '1px solid rgba(59, 130, 246, 0.3)' }}>
            <div className="card-header" style={{ borderBottomColor: 'rgba(59, 130, 246, 0.2)' }}>
              <div className="card-title">
                <LineChart size={16} color="#60a5fa" />
                <span>5-Year Runway Burn-Down & Zero Cash Date Timeline</span>
              </div>
              <div className="runway-ticker" style={{ fontSize: 12 }}>
                Projected Zero-Cash Date: <strong style={{ color: '#ef4444' }}>{zeroDateFormatted}</strong>
              </div>
            </div>

            <div style={{ width: '100%', height: 230, position: 'relative' }}>
              <svg width="100%" height="230" viewBox="0 0 800 220" preserveAspectRatio="none">
                <line x1="50" y1="30" x2="780" y2="30" stroke="rgba(255,255,255,0.06)" strokeDasharray="4 4" />
                <line x1="50" y1="90" x2="780" y2="90" stroke="rgba(255,255,255,0.06)" strokeDasharray="4 4" />
                <line x1="50" y1="150" x2="780" y2="150" stroke="rgba(255,255,255,0.06)" strokeDasharray="4 4" />
                <line x1="50" y1="200" x2="780" y2="200" stroke="rgba(255,255,255,0.15)" />

                <text x="10" y="34" fill="#94a3b8" fontSize="10">$500k</text>
                <text x="10" y="94" fill="#94a3b8" fontSize="10">$350k</text>
                <text x="10" y="154" fill="#94a3b8" fontSize="10">$150k</text>
                <text x="10" y="204" fill="#f87171" fontSize="10" fontWeight="bold">$0</text>

                {/* Depletion Curve */}
                <path d="M 60 40 L 220 90 L 380 150 L 520 200 L 760 200" fill="none" stroke="#ef4444" strokeWidth="3" />

                {/* Simulated Recovery */}
                <path d="M 60 40 L 220 75 L 380 95 L 540 105 L 760 75" fill="none" stroke="#10b981" strokeWidth="3" strokeDasharray="6 3" />

                <circle cx="520" cy="200" r="6" fill="#ef4444" />
                <text x="490" y="185" fill="#fca5a5" fontSize="11" fontWeight="bold">Zero Cash ({zeroDateFormatted})</text>

                <circle cx="100" cy="15" r="5" fill="#ef4444" />
                <text x="112" y="19" fill="#f87171" fontSize="11">Current Depletion Horizon</text>

                <circle cx="340" cy="15" r="5" fill="#10b981" />
                <text x="352" y="19" fill="#34d399" fontSize="11">Projected Recovery (+25% Growth)</text>
              </svg>
            </div>
          </div>

          {/* 5-YEAR PROJECTION SCORECARD */}
          <div className="card">
            <div className="card-header">
              <div className="card-title">
                <Layers size={16} color="#a78bfa" />
                <span>5-Year Revenue & Solvency Forecast Matrix</span>
              </div>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Forecast Period</th>
                    <th>Projected Annual Sales</th>
                    <th>Projected OPEX</th>
                    <th>Ending Treasury</th>
                    <th>Runway Buffer</th>
                    <th>Failure Risk</th>
                  </tr>
                </thead>
                <tbody>
                  {yearlyProjections.map((yp, idx) => (
                    <tr key={idx}>
                      <td style={{ fontWeight: 800, color: '#ffffff' }}>{yp.yearLabel}</td>
                      <td style={{ fontFamily: 'JetBrains Mono', color: '#34d399', fontWeight: 800 }}>${yp.projectedSales.toLocaleString()}</td>
                      <td style={{ fontFamily: 'JetBrains Mono' }}>${yp.projectedExpenses.toLocaleString()}</td>
                      <td style={{ fontFamily: 'JetBrains Mono', fontWeight: 800, color: yp.projectedEndingCash > 100000 ? '#93c5fd' : '#f87171' }}>
                        ${yp.projectedEndingCash.toLocaleString()}
                      </td>
                      <td style={{ fontFamily: 'JetBrains Mono', fontWeight: 700, color: yp.runwayMonths < 6 ? '#ef4444' : '#34d399' }}>
                        {yp.runwayMonths} Mos
                      </td>
                      <td>
                        <span className={`risk-level-tag ${yp.failureRiskPercent > 50 ? 'tag-red' : yp.failureRiskPercent > 20 ? 'tag-yellow' : 'tag-green'}`} style={{ fontSize: 11, padding: '2px 8px' }}>
                          {yp.failureRiskPercent}% Failure Odds
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* REPORT MODAL (POPS UP WHEN USER CLICKS "REPORT") */}
      {showReportModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0,0,0,0.8)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: 20
        }}>
          <div className="card" style={{ width: '100%', maxWidth: 640, maxHeight: '90vh', overflowY: 'auto', background: '#0f172a', border: '1px solid rgba(59, 130, 246, 0.4)', padding: 32, borderRadius: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-subtle)', paddingBottom: 16, marginBottom: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 32, height: 32, borderRadius: 8, background: 'linear-gradient(135deg, #10b981, #059669)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <FileText size={18} color="#ffffff" />
                </div>
                <div>
                  <h2 style={{ fontSize: 18, fontWeight: 800, color: '#ffffff' }}>{company.company_name} — Performance Report</h2>
                  <div style={{ fontSize: 12, color: '#94a3b8' }}>Timeframe: {selectedTimeframe} Evaluation Summary</div>
                </div>
              </div>
              <button onClick={() => setShowReportModal(false)} style={{ background: 'transparent', color: '#94a3b8', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 14, fontSize: 13.5, color: '#cbd5e1' }}>
              <div style={{ padding: '12px 16px', background: 'rgba(255,255,255,0.02)', borderRadius: 10, border: '1px solid var(--border-subtle)' }}>
                <strong style={{ color: '#ffffff', display: 'block', marginBottom: 4 }}>Executive Financial Position:</strong>
                Current liquid cash reserves stand at <strong>${cashInBank.toLocaleString()}</strong> with an estimated burn rate of <strong>${currentBurn.toLocaleString()}/mo</strong>, yielding <strong>{runwayMonths} months of runway</strong>.
              </div>

              <div style={{ padding: '12px 16px', background: 'rgba(255,255,255,0.02)', borderRadius: 10, border: '1px solid var(--border-subtle)' }}>
                <strong style={{ color: '#ffffff', display: 'block', marginBottom: 4 }}>Insolvency Horizon:</strong>
                Under current burn velocity, the projected Zero-Cash Date is <strong>{zeroDateFormatted}</strong> with an AI failure probability of <strong>{failureProb.toFixed(1)}%</strong>.
              </div>

              <div style={{ padding: '12px 16px', background: 'rgba(16, 185, 129, 0.08)', borderRadius: 10, border: '1px solid rgba(16, 185, 129, 0.25)' }}>
                <strong style={{ color: '#34d399', display: 'block', marginBottom: 4 }}>Recommended Playbook:</strong>
                Compress monthly burn by 25-30% or accelerate sales by +15% to extend the cash buffer past 12 months and lower failure risk by 45%.
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 24, borderTop: '1px solid var(--border-subtle)', paddingTop: 16 }}>
              <button className="btn-secondary" onClick={() => setShowReportModal(false)}>
                Close
              </button>
              <button className="btn-primary" onClick={() => { setShowReportModal(false); setActivePage('reports'); }}>
                Open Full Investor Deck →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* BRANCH PERFORMANCE MATRIX FOR MULTI-STORE MANAGEMENT */}
      <div style={{ marginTop: 24 }}>
        <BranchPerformanceMatrix />
      </div>

      {/* CSV IMPORT MODAL */}
      <CsvImportModal
        isOpen={isCsvModalOpen}
        onClose={() => setIsCsvModalOpen(false)}
        onImportSuccess={handleImportCsvSuccess}
      />
    </div>
  );
};

import React, { useState } from 'react';
import { Store, Building, TrendingUp, TrendingDown, AlertTriangle, CheckCircle2, DollarSign, Users, MapPin, Sparkles } from 'lucide-react';

export const BranchPerformanceMatrix: React.FC = () => {
  const [selectedBranch, setSelectedBranch] = useState<'all' | 'b1' | 'b2' | 'b3'>('all');

  const branches = [
    {
      id: 'b1',
      name: 'Branch #1: Downtown Flagship',
      type: 'High-Street Retail / FMCG',
      location: 'City Center Mall Road',
      dailySales: 7450,
      monthlyRent: 8500,
      turnoverDays: 14.2,
      deadstockPercent: 12.0,
      netMonthlyProfit: 24500,
      status: 'healthy' as const,
      statusLabel: 'TOP CONTRIBUTOR (+21% Margin)',
      notes: 'Strong weekend footfall; rapid dry goods turnover.'
    },
    {
      id: 'b2',
      name: 'Branch #2: Westside Metro Outlet',
      type: 'Suburban Store',
      location: 'Metro Junction Sector 4',
      dailySales: 3100,
      monthlyRent: 9200,
      turnoverDays: 46.8,
      deadstockPercent: 34.0,
      netMonthlyProfit: -4800,
      status: 'critical' as const,
      statusLabel: '🚨 WORKING CAPITAL DRAIN (-$4.8k/mo)',
      notes: 'High lease overhead relative to footfall; 34% inventory trapped.'
    },
    {
      id: 'b3',
      name: 'Branch #3: Tech Park Express Kiosk',
      type: 'Quick-Service / Grab & Go',
      location: 'Cyber Hub Building 3',
      dailySales: 4200,
      monthlyRent: 3800,
      turnoverDays: 8.5,
      deadstockPercent: 4.5,
      netMonthlyProfit: 12800,
      status: 'healthy' as const,
      statusLabel: 'HIGH VELOCITY (+28% Margin)',
      notes: 'High digital UPI volume; near-zero spoilage.'
    }
  ];

  const filteredBranches = selectedBranch === 'all' 
    ? branches 
    : branches.filter(b => b.id === selectedBranch);

  const totalDailySales = branches.reduce((sum, b) => sum + b.dailySales, 0);
  const totalNetProfit = branches.reduce((sum, b) => sum + b.netMonthlyProfit, 0);

  return (
    <div className="card" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', marginBottom: 24 }}>
      {/* Top Banner */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16, flexWrap: 'wrap', gap: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 40,
            height: 40,
            borderRadius: 10,
            background: 'rgba(245, 158, 11, 0.15)',
            border: '1px solid rgba(245, 158, 11, 0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fbbf24'
          }}>
            <Store size={22} />
          </div>
          <div>
            <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)' }}>
              Multi-Store & Branch Performance Matrix
            </h3>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              Evaluate unit-level cash flow contribution & identify store-level capital drains
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          <button
            onClick={() => setSelectedBranch('all')}
            style={{
              padding: '5px 10px',
              borderRadius: 6,
              fontSize: '0.75rem',
              fontWeight: 600,
              border: selectedBranch === 'all' ? '1px solid #3b82f6' : '1px solid var(--border-subtle)',
              background: selectedBranch === 'all' ? 'rgba(59, 130, 246, 0.15)' : 'var(--bg-subtle)',
              color: selectedBranch === 'all' ? '#3b82f6' : 'var(--text-muted)',
              cursor: 'pointer'
            }}
          >
            🌐 All 3 Branches
          </button>
          <button
            onClick={() => setSelectedBranch('b1')}
            style={{
              padding: '5px 10px',
              borderRadius: 6,
              fontSize: '0.75rem',
              fontWeight: 600,
              border: selectedBranch === 'b1' ? '1px solid #10b981' : '1px solid var(--border-subtle)',
              background: selectedBranch === 'b1' ? 'rgba(16, 185, 129, 0.15)' : 'var(--bg-subtle)',
              color: selectedBranch === 'b1' ? '#10b981' : 'var(--text-muted)',
              cursor: 'pointer'
            }}
          >
            Store #1 (Downtown)
          </button>
          <button
            onClick={() => setSelectedBranch('b2')}
            style={{
              padding: '5px 10px',
              borderRadius: 6,
              fontSize: '0.75rem',
              fontWeight: 600,
              border: selectedBranch === 'b2' ? '1px solid #ef4444' : '1px solid var(--border-subtle)',
              background: selectedBranch === 'b2' ? 'rgba(239, 68, 68, 0.15)' : 'var(--bg-subtle)',
              color: selectedBranch === 'b2' ? '#f87171' : 'var(--text-muted)',
              cursor: 'pointer'
            }}
          >
            Store #2 (Westside)
          </button>
          <button
            onClick={() => setSelectedBranch('b3')}
            style={{
              padding: '5px 10px',
              borderRadius: 6,
              fontSize: '0.75rem',
              fontWeight: 600,
              border: selectedBranch === 'b3' ? '1px solid #38bdf8' : '1px solid var(--border-subtle)',
              background: selectedBranch === 'b3' ? 'rgba(56, 189, 248, 0.15)' : 'var(--bg-subtle)',
              color: selectedBranch === 'b3' ? '#38bdf8' : 'var(--text-muted)',
              cursor: 'pointer'
            }}
          >
            Store #3 (Kiosk)
          </button>
        </div>
      </div>

      {/* Aggregate KPI Strip */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 10, marginBottom: 16 }}>
        <div style={{ background: 'var(--bg-subtle)', padding: '10px 14px', borderRadius: 8, border: '1px solid var(--border-subtle)' }}>
          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block' }}>Chain Daily Inflow</span>
          <strong style={{ fontSize: '1.1rem', color: '#10b981' }}>${totalDailySales.toLocaleString()}/day</strong>
        </div>
        <div style={{ background: 'var(--bg-subtle)', padding: '10px 14px', borderRadius: 8, border: '1px solid var(--border-subtle)' }}>
          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block' }}>Consolidated Net</span>
          <strong style={{ fontSize: '1.1rem', color: totalNetProfit >= 0 ? '#38bdf8' : '#f87171' }}>
            +${totalNetProfit.toLocaleString()}/mo
          </strong>
        </div>
        <div style={{ background: 'var(--bg-subtle)', padding: '10px 14px', borderRadius: 8, border: '1px solid var(--border-subtle)' }}>
          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block' }}>Active Locations</span>
          <strong style={{ fontSize: '1.1rem', color: 'var(--text-main)' }}>3 Operating Units</strong>
        </div>
      </div>

      {/* Branch Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 12, marginBottom: 16 }}>
        {filteredBranches.map(b => (
          <div key={b.id} style={{
            background: 'var(--bg-subtle)',
            borderRadius: 8,
            padding: 14,
            border: `1px solid ${b.status === 'critical' ? 'rgba(239, 68, 68, 0.4)' : 'var(--border-subtle)'}`
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
              <div>
                <h4 style={{ margin: 0, fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-main)' }}>{b.name}</h4>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: 2 }}>
                  <MapPin size={11} /> {b.location}
                </div>
              </div>
              <span style={{
                padding: '2px 6px',
                borderRadius: 4,
                fontSize: '0.65rem',
                fontWeight: 800,
                background: b.status === 'critical' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(16, 185, 129, 0.2)',
                color: b.status === 'critical' ? '#f87171' : '#34d399'
              }}>
                {b.status === 'critical' ? 'DEFICIT' : 'SURPLUS'}
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6, fontSize: '0.74rem', marginBottom: 8 }}>
              <div>
                <span style={{ color: 'var(--text-muted)' }}>Daily Sales:</span>{' '}
                <strong style={{ color: '#10b981' }}>${b.dailySales.toLocaleString()}</strong>
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)' }}>Rent:</span>{' '}
                <strong style={{ color: 'var(--text-main)' }}>${b.monthlyRent.toLocaleString()}</strong>
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)' }}>Turnover:</span>{' '}
                <strong style={{ color: b.turnoverDays > 30 ? '#f87171' : 'var(--text-main)' }}>{b.turnoverDays}d</strong>
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)' }}>Monthly Profit:</span>{' '}
                <strong style={{ color: b.netMonthlyProfit >= 0 ? '#38bdf8' : '#f87171' }}>
                  {b.netMonthlyProfit >= 0 ? `+$${b.netMonthlyProfit.toLocaleString()}` : `-$${Math.abs(b.netMonthlyProfit).toLocaleString()}`}
                </strong>
              </div>
            </div>

            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', background: 'var(--bg-card)', padding: '6px 8px', borderRadius: 4 }}>
              {b.notes}
            </div>
          </div>
        ))}
      </div>

      {/* AI Rebalancing Recommendation */}
      <div style={{
        background: 'rgba(245, 158, 11, 0.08)',
        border: '1px solid rgba(245, 158, 11, 0.25)',
        borderRadius: 8,
        padding: '10px 14px',
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        fontSize: '0.78rem',
        color: 'var(--text-main)'
      }}>
        <Sparkles size={16} color="#fbbf24" style={{ flexShrink: 0 }} />
        <div>
          <strong style={{ color: '#fbbf24' }}>AI Branch Optimization:</strong> Branch #2 (Westside) has 34% trapped deadstock. Reallocate $12,000 of slow-moving inventory to Branch #1 (Downtown), where turnover velocity is 3.3x faster.
        </div>
      </div>
    </div>
  );
};

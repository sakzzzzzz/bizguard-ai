import React, { useState } from 'react';
import { DailyCashForecast, BusinessSector } from '../types/bizguard';
import { Calendar, AlertTriangle, ShieldCheck, TrendingUp, TrendingDown, ArrowRight, ShieldAlert, Sparkles } from 'lucide-react';

interface CashGapForecastRadarProps {
  startingCash?: number;
  dailyInflowAvg?: number;
  sector?: BusinessSector;
}

export const CashGapForecastRadar: React.FC<CashGapForecastRadarProps> = ({
  startingCash = 28500,
  dailyInflowAvg = 4600,
  sector = 'supermarket'
}) => {
  const [safetyThreshold, setSafetyThreshold] = useState<number>(5000);

  // Generate 7-day projected trajectory
  const dayNames = ['Mon (Today)', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  
  // Custom daily profiles based on real retail/startup cash cycles
  const dailyMultipliers = [1.0, 0.9, 1.1, 1.4, 1.8, 2.1, 1.3]; // Weekend spikes
  const scheduledOutflows = [2200, 3100, 18500, 4200, 9500, 1800, 1200]; // Thu/Fri heavy supplier payments

  let runningBalance = startingCash;
  const forecast: DailyCashForecast[] = dayNames.map((name, i) => {
    const inflow = Math.round(dailyInflowAvg * dailyMultipliers[i]);
    const outflow = scheduledOutflows[i];
    const net = inflow - outflow;
    runningBalance += net;
    return {
      dayLabel: name,
      date: `Day +${i}`,
      projectedInflow: inflow,
      scheduledOutflow: outflow,
      netDayCash: net,
      projectedEndingBalance: runningBalance,
      isShortfall: runningBalance < safetyThreshold
    };
  });

  const shortfallDays = forecast.filter(d => d.isShortfall);
  const minBalanceDay = [...forecast].sort((a, b) => a.projectedEndingBalance - b.projectedEndingBalance)[0];

  // SVG Chart Dimensions
  const chartWidth = 600;
  const chartHeight = 160;
  const paddingX = 40;
  const paddingY = 25;

  const minVal = Math.min(...forecast.map(d => d.projectedEndingBalance), 0);
  const maxVal = Math.max(...forecast.map(d => d.projectedEndingBalance), startingCash * 1.2);
  const range = maxVal - minVal || 1;

  const getX = (idx: number) => paddingX + (idx / (forecast.length - 1)) * (chartWidth - paddingX * 2);
  const getY = (val: number) => chartHeight - paddingY - ((val - minVal) / range) * (chartHeight - paddingY * 2);

  const points = forecast.map((d, i) => `${getX(i)},${getY(d.projectedEndingBalance)}`).join(' ');
  const zeroY = getY(0);
  const thresholdY = getY(safetyThreshold);

  return (
    <div className="card" style={{ background: '#0f172a', border: '1px solid var(--border-subtle)' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ 
            width: 40, 
            height: 40, 
            borderRadius: 10, 
            background: 'rgba(56, 189, 248, 0.15)', 
            border: '1px solid rgba(56, 189, 248, 0.3)',
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            color: '#38bdf8'
          }}>
            <Calendar size={22} />
          </div>
          <div>
            <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-primary)' }}>
              7-Day Ahead AI Cash Gap Predictor
            </h3>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
              Predictive forward liquidity based on POS velocity & scheduled AP invoices
            </span>
          </div>
        </div>

        <div style={{
          padding: '4px 10px',
          borderRadius: 20,
          fontSize: '0.75rem',
          fontWeight: 600,
          background: shortfallDays.length > 0 ? 'rgba(239, 68, 68, 0.2)' : 'rgba(16, 185, 129, 0.2)',
          color: shortfallDays.length > 0 ? '#f87171' : '#34d399',
          border: `1px solid ${shortfallDays.length > 0 ? '#ef4444' : '#10b981'}`
        }}>
          {shortfallDays.length > 0 ? `🚨 ${shortfallDays.length} SHORTFALL DAYS` : '✅ 7 DAYS SOLVENT'}
        </div>
      </div>

      {/* AI Early Warning Banner if shortfall exists */}
      {shortfallDays.length > 0 && (
        <div style={{
          background: 'rgba(239, 68, 68, 0.12)',
          border: '1px solid rgba(239, 68, 68, 0.35)',
          borderRadius: 8,
          padding: '10px 14px',
          marginBottom: 16,
          display: 'flex',
          alignItems: 'center',
          gap: 12
        }}>
          <AlertTriangle size={20} color="#f87171" style={{ flexShrink: 0 }} />
          <div style={{ fontSize: '0.82rem', color: '#fca5a5' }}>
            <strong style={{ color: '#fff' }}>Liquidity Dip on {minBalanceDay.dayLabel}:</strong> Ending cash projected at{' '}
            <strong style={{ color: minBalanceDay.projectedEndingBalance < 0 ? '#f87171' : '#fbbf24' }}>
              ${minBalanceDay.projectedEndingBalance.toLocaleString()}
            </strong>{' '}
            (Below ${safetyThreshold.toLocaleString()} safety buffer). Heavy supplier payout scheduled!
          </div>
        </div>
      )}

      {/* SVG Trajectory Chart */}
      <div style={{ 
        background: '#1e293b', 
        borderRadius: 8, 
        border: '1px solid #334155', 
        padding: '12px 8px 6px 8px', 
        marginBottom: 16,
        overflowX: 'auto'
      }}>
        <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} style={{ width: '100%', height: 'auto', minWidth: 420 }}>
          <defs>
            <linearGradient id="cashFillGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          <line x1={paddingX} y1={getY(safetyThreshold)} x2={chartWidth - paddingX} y2={getY(safetyThreshold)} stroke="#f59e0b" strokeDasharray="3 3" strokeOpacity="0.5" />
          <text x={chartWidth - paddingX} y={getY(safetyThreshold) - 4} fill="#fbbf24" fontSize="9" textAnchor="end">Safety Buffer (${safetyThreshold / 1000}k)</text>

          {minVal < 0 && (
            <>
              <line x1={paddingX} y1={zeroY} x2={chartWidth - paddingX} y2={zeroY} stroke="#ef4444" strokeWidth="1.5" strokeDasharray="4 4" />
              <text x={paddingX} y={zeroY - 4} fill="#ef4444" fontSize="9">Zero Cash Line ($0)</text>
            </>
          )}

          {/* Cash Area fill */}
          <polygon 
            points={`${getX(0)},${chartHeight - paddingY} ${points} ${getX(forecast.length - 1)},${chartHeight - paddingY}`}
            fill="url(#cashFillGrad)"
          />

          {/* Cash Line */}
          <polyline 
            fill="none" 
            stroke="#38bdf8" 
            strokeWidth="2.5" 
            points={points} 
          />

          {/* Dots & Values */}
          {forecast.map((d, i) => {
            const x = getX(i);
            const y = getY(d.projectedEndingBalance);
            const isAlert = d.isShortfall;
            return (
              <g key={i}>
                <circle 
                  cx={x} 
                  cy={y} 
                  r={isAlert ? 6 : 4.5} 
                  fill={isAlert ? '#ef4444' : '#38bdf8'} 
                  stroke="#0f172a" 
                  strokeWidth="2" 
                />
                <text 
                  x={x} 
                  y={y - 10} 
                  fill={isAlert ? '#f87171' : '#e2e8f0'} 
                  fontSize="10" 
                  fontWeight="600" 
                  textAnchor="middle"
                >
                  ${Math.round(d.projectedEndingBalance / 1000)}k
                </text>
                <text 
                  x={x} 
                  y={chartHeight - 8} 
                  fill="var(--text-secondary)" 
                  fontSize="9" 
                  textAnchor="middle"
                >
                  {d.dayLabel.split(' ')[0]}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* 7-Day Matrix Table */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(80px, 1fr))', gap: 6, textAlign: 'center' }}>
        {forecast.map((d, i) => (
          <div key={i} style={{ 
            background: d.isShortfall ? 'rgba(239, 68, 68, 0.1)' : '#1e293b', 
            padding: '8px 4px', 
            borderRadius: 6,
            border: `1px solid ${d.isShortfall ? 'rgba(239, 68, 68, 0.4)' : '#334155'}`
          }}>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', display: 'block', fontWeight: 600 }}>
              {d.dayLabel.split(' ')[0]}
            </span>
            <span style={{ fontSize: '0.68rem', color: '#34d399', display: 'block', margin: '2px 0' }}>
              +${(d.projectedInflow / 1000).toFixed(1)}k
            </span>
            <span style={{ fontSize: '0.68rem', color: '#f87171', display: 'block', marginBottom: 2 }}>
              -${(d.scheduledOutflow / 1000).toFixed(1)}k
            </span>
            <span style={{ 
              fontSize: '0.75rem', 
              fontWeight: 700, 
              color: d.isShortfall ? '#f87171' : '#38bdf8',
              display: 'block',
              borderTop: '1px solid rgba(255,255,255,0.06)',
              paddingTop: 3
            }}>
              ${Math.round(d.projectedEndingBalance / 1000)}k
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

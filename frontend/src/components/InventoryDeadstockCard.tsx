import React, { useState } from 'react';
import { Package, AlertOctagon, TrendingDown, Zap, Tag, CheckCircle, ArrowRight, ShieldAlert } from 'lucide-react';
import { BusinessSector } from '../types/bizguard';

interface InventoryDeadstockCardProps {
  inventoryValuation?: number;
  turnoverDays?: number;
  deadstockPercent?: number;
  sector?: BusinessSector;
  onApplyCashUnlock?: (unlockedCash: number) => void;
}

export const InventoryDeadstockCard: React.FC<InventoryDeadstockCardProps> = ({
  inventoryValuation = 145000,
  turnoverDays = 34.5,
  deadstockPercent = 22.0,
  sector = 'supermarket',
  onApplyCashUnlock
}) => {
  const [clearanceDiscount, setClearanceDiscount] = useState<number>(25);
  const [isUnlocked, setIsUnlocked] = useState<boolean>(false);

  // Sector benchmarks
  const sectorBenchmarks: Record<string, { healthyTurnover: number; criticalTurnover: number; label: string }> = {
    supermarket: { healthyTurnover: 18, criticalTurnover: 35, label: 'FMCG / Grocery' },
    retail_shop: { healthyTurnover: 35, criticalTurnover: 65, label: 'Fashion / Retail' },
    cafe_restaurant: { healthyTurnover: 7, criticalTurnover: 14, label: 'Perishables / Food' },
    manufacturing_sme: { healthyTurnover: 45, criticalTurnover: 80, label: 'Raw Materials & Parts' },
    tech_startup: { healthyTurnover: 30, criticalTurnover: 60, label: 'Hardware / Inventory' }
  };

  const benchmark = sectorBenchmarks[sector] || sectorBenchmarks.supermarket;
  const isHighTurnoverRisk = turnoverDays > benchmark.criticalTurnover;
  const isModerateTurnoverRisk = turnoverDays > benchmark.healthyTurnover;

  // Working capital calculations
  const lockedCapital = Math.round((inventoryValuation * deadstockPercent) / 100);
  const recoveryFactor = (100 - clearanceDiscount) / 100;
  const projectedCashRecovery = Math.round(lockedCapital * recoveryFactor * 0.85); // 85% sell-through assumption

  const handleSimulateFlashSale = () => {
    setIsUnlocked(true);
    if (onApplyCashUnlock) {
      onApplyCashUnlock(projectedCashRecovery);
    }
  };

  // Sample items trapped in deadstock
  const sampleDeadstockItems = [
    { name: 'Slow-Moving Bulk Dry Goods', age: '64 days', locked: Math.round(lockedCapital * 0.42), priority: 'High' },
    { name: 'Unsold Seasonal Apparel & Misc', age: '52 days', locked: Math.round(lockedCapital * 0.35), priority: 'Medium' },
    { name: 'Near-Expiry Packaged Items', age: '38 days', locked: Math.round(lockedCapital * 0.23), priority: 'Urgent' }
  ];

  return (
    <div className="card" style={{ background: '#0f172a', border: '1px solid var(--border-subtle)', position: 'relative', overflow: 'hidden' }}>
      {/* Top Banner */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ 
            width: 40, 
            height: 40, 
            borderRadius: 10, 
            background: 'rgba(239, 68, 68, 0.15)', 
            border: '1px solid rgba(239, 68, 68, 0.3)',
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            color: '#f87171'
          }}>
            <Package size={22} />
          </div>
          <div>
            <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-primary)' }}>
              Deadstock & Working Capital Lock
            </h3>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
              Sector Benchmark: {benchmark.label} (Target: &lt;{benchmark.healthyTurnover}d turnover)
            </span>
          </div>
        </div>

        <div style={{
          padding: '4px 10px',
          borderRadius: 20,
          fontSize: '0.75rem',
          fontWeight: 600,
          background: isHighTurnoverRisk ? 'rgba(239, 68, 68, 0.2)' : isModerateTurnoverRisk ? 'rgba(245, 158, 11, 0.2)' : 'rgba(16, 185, 129, 0.2)',
          color: isHighTurnoverRisk ? '#f87171' : isModerateTurnoverRisk ? '#fbbf24' : '#34d399',
          border: `1px solid ${isHighTurnoverRisk ? '#ef4444' : isModerateTurnoverRisk ? '#f59e0b' : '#10b981'}`
        }}>
          {isHighTurnoverRisk ? '🚨 CAPITAL TRAPPED' : isModerateTurnoverRisk ? '⚠️ ELEVATED TURN' : '✅ HEALTHY VELOCITY'}
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: 12, marginBottom: 18 }}>
        <div style={{ background: '#1e293b', padding: '12px 14px', borderRadius: 8, border: '1px solid #334155' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block', marginBottom: 4 }}>Inventory Turnover</span>
          <span style={{ fontSize: '1.25rem', fontWeight: 700, color: isHighTurnoverRisk ? '#f87171' : 'var(--text-primary)' }}>
            {turnoverDays.toFixed(1)} <span style={{ fontSize: '0.8rem', fontWeight: 400 }}>days</span>
          </span>
          <span style={{ fontSize: '0.7rem', color: isHighTurnoverRisk ? '#f87171' : 'var(--text-secondary)', display: 'block', marginTop: 2 }}>
            {turnoverDays > benchmark.healthyTurnover ? `+${(turnoverDays - benchmark.healthyTurnover).toFixed(1)}d over target` : 'Within safe range'}
          </span>
        </div>

        <div style={{ background: '#1e293b', padding: '12px 14px', borderRadius: 8, border: '1px solid #334155' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block', marginBottom: 4 }}>Deadstock Ratio</span>
          <span style={{ fontSize: '1.25rem', fontWeight: 700, color: deadstockPercent > 15 ? '#fbbf24' : '#34d399' }}>
            {deadstockPercent.toFixed(1)}%
          </span>
          <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', display: 'block', marginTop: 2 }}>
            of total warehouse stock
          </span>
        </div>

        <div style={{ background: 'rgba(239, 68, 68, 0.08)', padding: '12px 14px', borderRadius: 8, border: '1px solid rgba(239, 68, 68, 0.25)' }}>
          <span style={{ fontSize: '0.75rem', color: '#f87171', display: 'block', marginBottom: 4 }}>Trapped Cash Balance</span>
          <span style={{ fontSize: '1.25rem', fontWeight: 700, color: '#f87171' }}>
            ${lockedCapital.toLocaleString()}
          </span>
          <span style={{ fontSize: '0.7rem', color: 'rgba(248, 113, 113, 0.8)', display: 'block', marginTop: 2 }}>
            Illiquid sitting on shelves
          </span>
        </div>
      </div>

      {/* Trapped Categories Table */}
      <div style={{ marginBottom: 18 }}>
        <span style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'block', marginBottom: 8 }}>
          Identified Dead Inventory Batches
        </span>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {sampleDeadstockItems.map((item, idx) => (
            <div key={idx} style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center', 
              padding: '8px 12px', 
              background: '#1e293b', 
              borderRadius: 6,
              fontSize: '0.82rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ 
                  width: 6, 
                  height: 6, 
                  borderRadius: '50%', 
                  background: item.priority === 'Urgent' ? '#ef4444' : item.priority === 'High' ? '#f59e0b' : '#3b82f6' 
                }} />
                <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{item.name}</span>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', background: '#0f172a', padding: '2px 6px', borderRadius: 4 }}>
                  {item.age}
                </span>
              </div>
              <span style={{ fontWeight: 600, color: '#f87171' }}>${item.locked.toLocaleString()} locked</span>
            </div>
          ))}
        </div>
      </div>

      {/* Interactive 1-Click Clearance Flash Sale Simulator */}
      <div style={{ 
        background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.9), rgba(15, 23, 42, 0.95))', 
        border: '1px solid rgba(59, 130, 246, 0.3)', 
        borderRadius: 10, 
        padding: 16 
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Zap size={18} style={{ color: '#38bdf8' }} />
            <span style={{ fontSize: '0.88rem', fontWeight: 600, color: '#e0f2fe' }}>
              Instant Liquidity Unlock: Clearance Flash Sale
            </span>
          </div>
          <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
            Unlocks cash in 48-72h
          </span>
        </div>

        <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', margin: '0 0 12px 0' }}>
          Discount slow-moving deadstock to immediately recover cash to pay urgent supplier dues or extend runway.
        </p>

        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 14 }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>
            Discount: <strong style={{ color: '#38bdf8' }}>{clearanceDiscount}%</strong>
          </span>
          <input 
            type="range" 
            min={10} 
            max={50} 
            step={5}
            value={clearanceDiscount}
            onChange={(e) => {
              setClearanceDiscount(Number(e.target.value));
              setIsUnlocked(false);
            }}
            style={{ flex: 1, accentColor: '#38bdf8', cursor: 'pointer' }}
          />
          <span style={{ 
            fontSize: '0.85rem', 
            fontWeight: 700, 
            color: '#34d399', 
            background: 'rgba(16, 185, 129, 0.1)', 
            padding: '4px 10px', 
            borderRadius: 6,
            border: '1px solid rgba(16, 185, 129, 0.3)',
            whiteSpace: 'nowrap'
          }}>
            +${projectedCashRecovery.toLocaleString()} Cash
          </span>
        </div>

        <button
          type="button"
          onClick={handleSimulateFlashSale}
          disabled={isUnlocked}
          style={{
            width: '100%',
            padding: '9px 16px',
            borderRadius: 6,
            border: 'none',
            background: isUnlocked 
              ? 'rgba(16, 185, 129, 0.2)' 
              : 'linear-gradient(135deg, #0284c7, #2563eb)',
            color: isUnlocked ? '#34d399' : '#fff',
            fontWeight: 600,
            fontSize: '0.82rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            cursor: isUnlocked ? 'default' : 'pointer',
            transition: 'all 0.2s ease'
          }}
        >
          {isUnlocked ? (
            <>
              <CheckCircle size={16} />
              Simulated: +${projectedCashRecovery.toLocaleString()} Injected into Bank Balance!
            </>
          ) : (
            <>
              <Tag size={16} />
              Simulate {clearanceDiscount}% Clearance Sale (Inject +${projectedCashRecovery.toLocaleString()})
            </>
          )}
        </button>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { X, Landmark, DollarSign, ArrowRight, ShieldCheck, Zap, Percent, Clock, CheckCircle2 } from 'lucide-react';

interface WorkingCapitalModalProps {
  isOpen: boolean;
  onClose: () => void;
  liquidityGap?: number;
  onInjectCapital: (amount: number) => void;
}

export const WorkingCapitalModal: React.FC<WorkingCapitalModalProps> = ({
  isOpen,
  onClose,
  liquidityGap = 12500,
  onInjectCapital
}) => {
  const [activeTab, setActiveTab] = useState<'factoring' | 'mca'>('factoring');
  const [advanceRate, setAdvanceRate] = useState<number>(80);
  const [unpaidInvoices, setUnpaidInvoices] = useState<number>(48000);
  const [mcaAmount, setMcaAmount] = useState<number>(20000);

  if (!isOpen) return null;

  // Factoring math
  const grossAdvance = Math.round((unpaidInvoices * advanceRate) / 100);
  const factoringFee = Math.round(grossAdvance * 0.015); // 1.5% fee
  const netFactoringCash = grossAdvance - factoringFee;

  const handleApplyCapital = () => {
    const injected = activeTab === 'factoring' ? netFactoringCash : mcaAmount;
    onInjectCapital(injected);
    onClose();
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.85)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1250,
      padding: 20
    }}>
      <div className="card" style={{
        width: '100%',
        maxWidth: 620,
        maxHeight: '90vh',
        overflowY: 'auto',
        border: '1px solid var(--border-subtle)',
        background: 'var(--bg-card)',
        padding: 24
      }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 40,
              height: 40,
              borderRadius: 10,
              background: 'rgba(56, 189, 248, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#38bdf8'
            }}>
              <Landmark size={22} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-main)' }}>
                Emergency Working Capital & Factoring Bridge
              </h3>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                Immediate non-dilutive liquidity to prevent supplier defaults and cash gaps
              </span>
            </div>
          </div>

          <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>

        {/* Shortfall Alert */}
        <div style={{
          background: 'rgba(239, 68, 68, 0.1)',
          border: '1px solid rgba(239, 68, 68, 0.3)',
          borderRadius: 8,
          padding: '12px 16px',
          marginBottom: 18,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <span style={{ fontSize: '0.75rem', color: '#f87171', display: 'block', fontWeight: 700 }}>
              DETECTED 7-DAY LIQUIDITY DEFICIT
            </span>
            <span style={{ fontSize: '0.82rem', color: 'var(--text-main)' }}>
              Upcoming bills exceed available treasury by:
            </span>
          </div>
          <span style={{ fontSize: '1.3rem', fontWeight: 800, color: '#f87171' }}>
            -${liquidityGap.toLocaleString()}
          </span>
        </div>

        {/* Option Tabs */}
        <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
          <button
            onClick={() => setActiveTab('factoring')}
            style={{
              flex: 1,
              padding: '10px',
              borderRadius: 8,
              fontSize: '0.82rem',
              fontWeight: 700,
              border: activeTab === 'factoring' ? '1px solid #38bdf8' : '1px solid var(--border-subtle)',
              background: activeTab === 'factoring' ? 'rgba(56, 189, 248, 0.15)' : 'var(--bg-subtle)',
              color: activeTab === 'factoring' ? '#38bdf8' : 'var(--text-muted)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6
            }}
          >
            <Zap size={15} /> 1. Invoice Factoring (Fastest)
          </button>

          <button
            onClick={() => setActiveTab('mca')}
            style={{
              flex: 1,
              padding: '10px',
              borderRadius: 8,
              fontSize: '0.82rem',
              fontWeight: 700,
              border: activeTab === 'mca' ? '1px solid #10b981' : '1px solid var(--border-subtle)',
              background: activeTab === 'mca' ? 'rgba(16, 185, 129, 0.15)' : 'var(--bg-subtle)',
              color: activeTab === 'mca' ? '#10b981' : 'var(--text-muted)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6
            }}
          >
            <DollarSign size={15} /> 2. Daily POS Sweep (MCA)
          </button>
        </div>

        {/* Tab 1: Factoring Details */}
        {activeTab === 'factoring' && (
          <div style={{ background: 'var(--bg-subtle)', borderRadius: 10, padding: 16, marginBottom: 20 }}>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '0 0 14px 0' }}>
              Unlock 80%–90% of your outstanding verified B2B client invoices within 24 hours. The lender is repaid when your client settles.
            </p>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12, fontSize: '0.82rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>Eligible Accounts Receivable:</span>
              <strong style={{ color: 'var(--text-main)' }}>${unpaidInvoices.toLocaleString()}</strong>
            </div>

            <div style={{ marginBottom: 14 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', marginBottom: 6 }}>
                <span style={{ color: 'var(--text-muted)' }}>Advance Rate:</span>
                <strong style={{ color: '#38bdf8' }}>{advanceRate}%</strong>
              </div>
              <input
                type="range"
                min={70}
                max={90}
                step={5}
                value={advanceRate}
                onChange={(e) => setAdvanceRate(Number(e.target.value))}
                style={{ width: '100%', accentColor: '#38bdf8', cursor: 'pointer' }}
              />
            </div>

            <div style={{
              background: 'var(--bg-card)',
              borderRadius: 8,
              padding: '12px 14px',
              display: 'grid',
              gridTemplateColumns: '1fr 1fr 1fr',
              gap: 8,
              textAlign: 'center',
              border: '1px solid var(--border-subtle)'
            }}>
              <div>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block' }}>Gross Advance</span>
                <strong style={{ fontSize: '0.95rem', color: 'var(--text-main)' }}>${grossAdvance.toLocaleString()}</strong>
              </div>
              <div>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block' }}>Factoring Fee (1.5%)</span>
                <strong style={{ fontSize: '0.95rem', color: '#f87171' }}>-${factoringFee.toLocaleString()}</strong>
              </div>
              <div>
                <span style={{ fontSize: '0.7rem', color: '#10b981', display: 'block', fontWeight: 700 }}>Immediate Net Cash</span>
                <strong style={{ fontSize: '1.05rem', color: '#10b981' }}>+${netFactoringCash.toLocaleString()}</strong>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: MCA Details */}
        {activeTab === 'mca' && (
          <div style={{ background: 'var(--bg-subtle)', borderRadius: 10, padding: 16, marginBottom: 20 }}>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '0 0 14px 0' }}>
              Merchant Cash Advance: Receive an upfront working capital injection repaid seamlessly via an automated 8% sweep of daily credit card/UPI transactions.
            </p>

            <div style={{ marginBottom: 14 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', marginBottom: 6 }}>
                <span style={{ color: 'var(--text-muted)' }}>Requested Advance Amount:</span>
                <strong style={{ color: '#10b981' }}>${mcaAmount.toLocaleString()}</strong>
              </div>
              <input
                type="range"
                min={10000}
                max={50000}
                step={5000}
                value={mcaAmount}
                onChange={(e) => setMcaAmount(Number(e.target.value))}
                style={{ width: '100%', accentColor: '#10b981', cursor: 'pointer' }}
              />
            </div>

            <div style={{
              background: 'var(--bg-card)',
              borderRadius: 8,
              padding: '12px 14px',
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: 8,
              textAlign: 'center',
              border: '1px solid var(--border-subtle)'
            }}>
              <div>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block' }}>Daily POS Sweep</span>
                <strong style={{ fontSize: '0.95rem', color: 'var(--text-main)' }}>8% of Sales (~$280/day)</strong>
              </div>
              <div>
                <span style={{ fontSize: '0.7rem', color: '#10b981', display: 'block', fontWeight: 700 }}>Immediate Cash Injected</span>
                <strong style={{ fontSize: '1.05rem', color: '#10b981' }}>+${mcaAmount.toLocaleString()}</strong>
              </div>
            </div>
          </div>
        )}

        {/* Action Button */}
        <button
          type="button"
          onClick={handleApplyCapital}
          style={{
            width: '100%',
            padding: '12px',
            borderRadius: 8,
            border: 'none',
            background: 'linear-gradient(135deg, #0284c7, #2563eb)',
            color: '#fff',
            fontWeight: 700,
            fontSize: '0.88rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            cursor: 'pointer',
            boxShadow: '0 4px 15px rgba(2, 132, 199, 0.4)'
          }}
        >
          <CheckCircle2 size={18} />
          Inject +${(activeTab === 'factoring' ? netFactoringCash : mcaAmount).toLocaleString()} Working Capital into Treasury
        </button>
      </div>
    </div>
  );
};

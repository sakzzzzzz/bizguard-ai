import React, { useEffect, useState } from 'react';
import { SupplierDue } from '../types/bizguard';
import { Truck, AlertTriangle, CheckCircle2, Clock, Plus, Trash2, DollarSign } from 'lucide-react';

interface SupplierDuesTrackerProps {
  currentCashInBank: number;
  dailyInflowAvg: number;
  /** A due scanned via the Invoice OCR modal — appended once when it changes */
  injectedDue?: SupplierDue | null;
}

export const SupplierDuesTracker: React.FC<SupplierDuesTrackerProps> = ({
  currentCashInBank,
  dailyInflowAvg = 4800,
  injectedDue
}) => {
  const [dues, setDues] = useState<SupplierDue[]>([
    { id: '1', vendorName: 'Metro FMCG Wholesale Dist.', category: 'Packaged Goods & Beverages', amountDue: 18500, dueDate: 'in 2 days', daysRemaining: 2, status: 'critical' },
    { id: '2', vendorName: 'GreenValley Dairy & Farm', category: 'Dairy, Milk & Fresh Items', amountDue: 7400, dueDate: 'in 4 days', daysRemaining: 4, status: 'due_soon' },
    { id: '3', vendorName: 'Apex Packaging Supplies', category: 'Boxes, Bags & Cartons', amountDue: 3200, dueDate: 'in 6 days', daysRemaining: 6, status: 'due_soon' },
    { id: '4', vendorName: 'National Logistics Carrier', category: 'Freight & Delivery', amountDue: 8900, dueDate: 'in 8 days', daysRemaining: 8, status: 'healthy' }
  ]);

  const [showAddForm, setShowAddForm] = useState<boolean>(false);
  const [newVendor, setNewVendor] = useState('');
  const [newAmount, setNewAmount] = useState<number>(5000);
  const [newCategory, setNewCategory] = useState('Inventory');
  const [newDays, setNewDays] = useState<number>(3);

  // Total 7-day supplier payables
  const total7dDues = dues
    .filter(d => d.daysRemaining <= 7)
    .reduce((sum, d) => sum + d.amountDue, 0);

  // Projected cash in drawer over 7 days
  const projected7dInflow = dailyInflowAvg * 7;
  const projectedCashAvailable = currentCashInBank * 0.4 + projected7dInflow;
  const liquidityGap = total7dDues - projectedCashAvailable;
  const isLiquidityTrap = liquidityGap > 0;

  // Append dues injected from the Invoice OCR modal (id-based de-dupe)
  useEffect(() => {
    if (injectedDue && !dues.some(d => d.id === injectedDue.id)) {
      setDues(prev => [injectedDue, ...prev]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [injectedDue]);

  const handleAddDue = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVendor.trim()) return;
    const newEntry: SupplierDue = {
      id: String(Date.now()),
      vendorName: newVendor.trim(),
      category: newCategory,
      amountDue: newAmount,
      dueDate: `in ${newDays} days`,
      daysRemaining: newDays,
      status: newDays <= 2 ? 'critical' : newDays <= 7 ? 'due_soon' : 'healthy'
    };
    setDues(prev => [...prev, newEntry]);
    setNewVendor('');
    setShowAddForm(false);
  };

  const handleMarkPaid = (id: string) => {
    setDues(prev => prev.filter(d => d.id !== id));
  };

  return (
    <div className="card" style={{ background: '#0f172a', border: '1px solid var(--border-subtle)' }}>
      <div className="card-header">
        <div className="card-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Truck size={18} color="#f59e0b" />
          <span>Supplier Dues & Working Capital Gap Detector</span>
        </div>
        <button
          className="btn-secondary"
          onClick={() => setShowAddForm(!showAddForm)}
          style={{ padding: '5px 12px', fontSize: 11.5 }}
        >
          {showAddForm ? '✕ Close Form' : '+ Add Supplier Invoice'}
        </button>
      </div>

      {/* LIQUIDITY GAP ALARM BANNER */}
      <div style={{
        background: isLiquidityTrap ? 'rgba(239, 68, 68, 0.12)' : 'rgba(16, 185, 129, 0.12)',
        border: `1px solid ${isLiquidityTrap ? 'rgba(239, 68, 68, 0.35)' : 'rgba(16, 185, 129, 0.35)'}`,
        borderRadius: 12,
        padding: '14px 18px',
        marginBottom: 18,
        display: 'flex',
        alignItems: 'flex-start',
        gap: 12
      }}>
        {isLiquidityTrap ? (
          <AlertTriangle size={24} color="#ef4444" style={{ flexShrink: 0, marginTop: 2 }} />
        ) : (
          <CheckCircle2 size={24} color="#10b981" style={{ flexShrink: 0, marginTop: 2 }} />
        )}
        <div>
          <strong style={{ fontSize: 14, color: isLiquidityTrap ? '#f87171' : '#34d399' }}>
            {isLiquidityTrap
              ? `⚠️ LIQUIDITY GAP DETECTED: Projected $${Math.round(liquidityGap).toLocaleString()} Shortfall in 7 Days!`
              : `🟢 SAFE LIQUIDITY BUFFER: Sufficient cash to service all supplier invoices.`}
          </strong>
          <div style={{ fontSize: 12.5, color: '#cbd5e1', marginTop: 4, lineHeight: 1.5 }}>
            {isLiquidityTrap
              ? `Total 7-day supplier distributor payables ($${total7dDues.toLocaleString()}) exceed projected liquid cash ($${Math.round(projectedCashAvailable).toLocaleString()}). Recommended Action: Delay non-perishable restocks or offer 5% upfront weekend cash discount to pull collections forward.`
              : `Projected 7-day store cash inflow ($${Math.round(projectedCashAvailable).toLocaleString()}) comfortably covers all upcoming vendor obligations ($${total7dDues.toLocaleString()}).`}
          </div>
        </div>
      </div>

      {/* ADD FORM */}
      {showAddForm && (
        <form onSubmit={handleAddDue} style={{ background: 'rgba(255,255,255,0.02)', padding: 14, borderRadius: 10, border: '1px solid var(--border-subtle)', marginBottom: 16, display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr 1fr auto', gap: 10, alignItems: 'flex-end' }}>
          <div>
            <label style={{ fontSize: 11, color: '#94a3b8', display: 'block', marginBottom: 4 }}>Vendor / Distributor Name</label>
            <input type="text" className="form-control" style={{ padding: '6px 10px', fontSize: 12 }} placeholder="e.g. Daily Dairy Wholesale" value={newVendor} onChange={e => setNewVendor(e.target.value)} required />
          </div>
          <div>
            <label style={{ fontSize: 11, color: '#94a3b8', display: 'block', marginBottom: 4 }}>Amount Due ($)</label>
            <input type="number" className="form-control" style={{ padding: '6px 10px', fontSize: 12 }} value={newAmount} onChange={e => setNewAmount(parseFloat(e.target.value) || 0)} required />
          </div>
          <div>
            <label style={{ fontSize: 11, color: '#94a3b8', display: 'block', marginBottom: 4 }}>Category</label>
            <input type="text" className="form-control" style={{ padding: '6px 10px', fontSize: 12 }} placeholder="e.g. FMCG / Dairy" value={newCategory} onChange={e => setNewCategory(e.target.value)} />
          </div>
          <div>
            <label style={{ fontSize: 11, color: '#94a3b8', display: 'block', marginBottom: 4 }}>Due in (Days)</label>
            <input type="number" className="form-control" style={{ padding: '6px 10px', fontSize: 12 }} value={newDays} onChange={e => setNewDays(parseInt(e.target.value) || 1)} min="1" max="60" />
          </div>
          <button type="submit" className="btn-primary" style={{ padding: '7px 14px', fontSize: 12, height: 34 }}>
            + Save Due
          </button>
        </form>
      )}

      {/* DUES LIST */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {dues.map((due) => (
          <div key={due.id} style={{
            padding: '10px 14px',
            borderRadius: 8,
            background: due.status === 'critical' ? 'rgba(239, 68, 68, 0.06)' : 'rgba(255, 255, 255, 0.02)',
            border: `1px solid ${due.status === 'critical' ? 'rgba(239, 68, 68, 0.3)' : 'var(--border-subtle)'}`,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 10
          }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <strong style={{ fontSize: 13.5, color: '#ffffff' }}>{due.vendorName}</strong>
                <span style={{ fontSize: 11, color: '#94a3b8' }}>({due.category})</span>
              </div>
              <div style={{ fontSize: 11.5, color: due.daysRemaining <= 2 ? '#f87171' : '#f59e0b', display: 'flex', alignItems: 'center', gap: 4, marginTop: 2 }}>
                <Clock size={12} /> Due {due.dueDate}
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ fontFamily: 'JetBrains Mono', fontSize: 15, fontWeight: 800, color: '#ffffff' }}>
                ${due.amountDue.toLocaleString()}
              </span>
              <button
                onClick={() => handleMarkPaid(due.id)}
                className="btn-secondary"
                style={{ padding: '4px 10px', fontSize: 11, color: '#34d399', borderColor: 'rgba(16, 185, 129, 0.3)' }}
              >
                Mark Paid ✓
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

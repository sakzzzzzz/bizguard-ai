import React, { useState } from 'react';
import { X, Camera, Scan, CheckCircle2, FileText, Sparkles, AlertTriangle, ArrowRight, Upload } from 'lucide-react';
import { SupplierDue } from '../types/bizguard';

interface InvoiceOcrModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddDue: (due: SupplierDue) => void;
}

export const InvoiceOcrModal: React.FC<InvoiceOcrModalProps> = ({
  isOpen,
  onClose,
  onAddDue
}) => {
  const [selectedPreset, setSelectedPreset] = useState<'metro' | 'dairy' | 'packaging'>('metro');
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [vendorName, setVendorName] = useState<string>('Metro FMCG Wholesale Dist.');
  const [amountDue, setAmountDue] = useState<number>(18500);
  const [category, setCategory] = useState<string>('Inventory & Packaged Goods');
  const [daysRemaining, setDaysRemaining] = useState<number>(2);
  const [invoiceNumber, setInvoiceNumber] = useState<string>('INV-2026-9842');

  if (!isOpen) return null;

  const handleSelectPreset = (preset: 'metro' | 'dairy' | 'packaging') => {
    setSelectedPreset(preset);
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      if (preset === 'metro') {
        setVendorName('Metro FMCG Wholesale Dist.');
        setAmountDue(18500);
        setCategory('Packaged Goods & Dry Grocery');
        setDaysRemaining(2);
        setInvoiceNumber('INV-2026-9842');
      } else if (preset === 'dairy') {
        setVendorName('GreenValley Dairy & Farm Produce');
        setAmountDue(4200);
        setCategory('Perishable Dairy & Fresh Produce');
        setDaysRemaining(4);
        setInvoiceNumber('INV-2026-5519');
      } else {
        setVendorName('Apex Industrial Packaging Co.');
        setAmountDue(2150);
        setCategory('Shipping Cartons & Bags');
        setDaysRemaining(7);
        setInvoiceNumber('INV-2026-3104');
      }
    }, 400);
  };

  const handleSaveToDues = (e: React.FormEvent) => {
    e.preventDefault();
    const newEntry: SupplierDue = {
      id: `ocr-${Date.now()}`,
      vendorName,
      category,
      amountDue,
      dueDate: `in ${daysRemaining} days`,
      daysRemaining,
      status: daysRemaining <= 2 ? 'critical' : daysRemaining <= 7 ? 'due_soon' : 'healthy'
    };
    onAddDue(newEntry);
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
        maxWidth: 720,
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
              background: 'rgba(16, 185, 129, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#10b981'
            }}>
              <Scan size={22} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-main)' }}>
                AI Supplier Invoice & Receipt OCR Scanner
              </h3>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                Extract vendor payables instantly from paper bills, PDF invoices, and delivery slips
              </span>
            </div>
          </div>

          <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>

        {/* 1-Click Sample Receipts */}
        <div style={{ marginBottom: 16 }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'block', marginBottom: 8 }}>
            Sample Vendor Invoices (Click to Scan):
          </span>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 8 }}>
            <button
              onClick={() => handleSelectPreset('metro')}
              style={{
                padding: '8px 10px',
                borderRadius: 8,
                fontSize: '0.78rem',
                fontWeight: 600,
                border: selectedPreset === 'metro' ? '1px solid #ef4444' : '1px solid var(--border-subtle)',
                background: selectedPreset === 'metro' ? 'rgba(239, 68, 68, 0.15)' : 'var(--bg-subtle)',
                color: selectedPreset === 'metro' ? '#f87171' : 'var(--text-main)',
                textAlign: 'left',
                cursor: 'pointer'
              }}
            >
              <strong style={{ display: 'block' }}>🧾 Metro Wholesale</strong>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>$18,500 due in 2d (Critical)</span>
            </button>

            <button
              onClick={() => handleSelectPreset('dairy')}
              style={{
                padding: '8px 10px',
                borderRadius: 8,
                fontSize: '0.78rem',
                fontWeight: 600,
                border: selectedPreset === 'dairy' ? '1px solid #f59e0b' : '1px solid var(--border-subtle)',
                background: selectedPreset === 'dairy' ? 'rgba(245, 158, 11, 0.15)' : 'var(--bg-subtle)',
                color: selectedPreset === 'dairy' ? '#fbbf24' : 'var(--text-main)',
                textAlign: 'left',
                cursor: 'pointer'
              }}
            >
              <strong style={{ display: 'block' }}>🥛 GreenValley Dairy</strong>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>$4,200 due in 4d</span>
            </button>

            <button
              onClick={() => handleSelectPreset('packaging')}
              style={{
                padding: '8px 10px',
                borderRadius: 8,
                fontSize: '0.78rem',
                fontWeight: 600,
                border: selectedPreset === 'packaging' ? '1px solid #3b82f6' : '1px solid var(--border-subtle)',
                background: selectedPreset === 'packaging' ? 'rgba(59, 130, 246, 0.15)' : 'var(--bg-subtle)',
                color: selectedPreset === 'packaging' ? '#60a5fa' : 'var(--text-main)',
                textAlign: 'left',
                cursor: 'pointer'
              }}
            >
              <strong style={{ display: 'block' }}>📦 Apex Packaging</strong>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>$2,150 due in 7d</span>
            </button>
          </div>
        </div>

        {/* Visual Simulated Invoice with Bounding Boxes */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 16,
          marginBottom: 20
        }}>
          {/* Left: Invoice Visual Document with OCR Bounding Boxes */}
          <div style={{
            background: '#ffffff',
            color: '#0f172a',
            padding: 16,
            borderRadius: 8,
            border: '1px solid #cbd5e1',
            fontFamily: 'monospace',
            fontSize: '0.72rem',
            lineHeight: 1.5,
            position: 'relative',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #e2e8f0', paddingBottom: 8, marginBottom: 8 }}>
              <div>
                <span style={{ border: '2px solid #3b82f6', background: 'rgba(59, 130, 246, 0.15)', padding: '2px 4px', borderRadius: 3, fontWeight: 'bold' }}>
                  {vendorName}
                </span>
                <div style={{ color: '#64748b', fontSize: '0.65rem' }}>DISTRIBUTION CO.</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{ border: '1px dashed #64748b', padding: '2px 4px', borderRadius: 3 }}>
                  #{invoiceNumber}
                </span>
              </div>
            </div>

            <div style={{ marginBottom: 10, color: '#475569' }}>
              <div>Date: Sep 05, 2026</div>
              <div>
                Payment Terms: <span style={{ border: '2px solid #f59e0b', background: 'rgba(245, 158, 11, 0.15)', padding: '1px 4px', borderRadius: 3, fontWeight: 'bold' }}>
                  NET {daysRemaining} DAYS
                </span>
              </div>
            </div>

            <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: 8, marginTop: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <span>Subtotal:</span>
                <span>${(amountDue * 0.92).toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <span>Tax / GST:</span>
                <span>${(amountDue * 0.08).toFixed(2)}</span>
              </div>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                fontWeight: 'bold', 
                fontSize: '0.82rem',
                border: '2px solid #ef4444',
                background: 'rgba(239, 68, 68, 0.1)',
                padding: '4px 6px',
                borderRadius: 4
              }}>
                <span>TOTAL DUE:</span>
                <span style={{ color: '#dc2626' }}>${amountDue.toLocaleString()}</span>
              </div>
            </div>

            {/* OCR Badge */}
            <div style={{
              position: 'absolute',
              bottom: 8,
              right: 8,
              background: '#10b981',
              color: '#ffffff',
              fontSize: '0.6rem',
              fontWeight: 800,
              padding: '2px 6px',
              borderRadius: 4
            }}>
              ✓ OCR ACCURACY 98.7%
            </div>
          </div>

          {/* Right: Extracted Data Fields Form */}
          <form onSubmit={handleSaveToDues} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div>
              <label style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block', marginBottom: 3 }}>Vendor Name</label>
              <input
                type="text"
                value={vendorName}
                onChange={(e) => setVendorName(e.target.value)}
                style={{ width: '100%', padding: '7px 10px', borderRadius: 6, border: '1px solid var(--border-subtle)', background: 'var(--bg-subtle)', fontSize: '0.8rem' }}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block', marginBottom: 3 }}>Category</label>
              <input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                style={{ width: '100%', padding: '7px 10px', borderRadius: 6, border: '1px solid var(--border-subtle)', background: 'var(--bg-subtle)', fontSize: '0.8rem' }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <div>
                <label style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block', marginBottom: 3 }}>Total Amount Due ($)</label>
                <input
                  type="number"
                  value={amountDue}
                  onChange={(e) => setAmountDue(Number(e.target.value))}
                  style={{ width: '100%', padding: '7px 10px', borderRadius: 6, border: '1px solid var(--border-subtle)', background: 'var(--bg-subtle)', fontSize: '0.8rem', fontWeight: 700, color: '#f87171' }}
                />
              </div>
              <div>
                <label style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block', marginBottom: 3 }}>Days Remaining</label>
                <input
                  type="number"
                  value={daysRemaining}
                  onChange={(e) => setDaysRemaining(Number(e.target.value))}
                  style={{ width: '100%', padding: '7px 10px', borderRadius: 6, border: '1px solid var(--border-subtle)', background: 'var(--bg-subtle)', fontSize: '0.8rem' }}
                />
              </div>
            </div>

            <div style={{
              background: daysRemaining <= 2 ? 'rgba(239, 68, 68, 0.1)' : 'rgba(245, 158, 11, 0.1)',
              border: `1px solid ${daysRemaining <= 2 ? 'rgba(239, 68, 68, 0.3)' : 'rgba(245, 158, 11, 0.3)'}`,
              borderRadius: 6,
              padding: '8px 10px',
              fontSize: '0.72rem',
              color: daysRemaining <= 2 ? '#f87171' : '#fbbf24',
              display: 'flex',
              alignItems: 'center',
              gap: 6
            }}>
              <AlertTriangle size={14} />
              <span>{daysRemaining <= 2 ? '🚨 High priority payable! Shortfall risk imminent.' : '⚠️ Scheduled payable within standard Net 7 terms.'}</span>
            </div>

            <div style={{ marginTop: 'auto', display: 'flex', gap: 8 }}>
              <button
                type="button"
                className="btn-secondary"
                onClick={onClose}
                style={{ flex: 1, padding: '8px', fontSize: '0.8rem', justifyContent: 'center' }}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn-primary"
                style={{ flex: 2, padding: '8px', fontSize: '0.8rem', justifyContent: 'center', gap: 6 }}
              >
                <CheckCircle2 size={15} /> Inject into Dues Tracker
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

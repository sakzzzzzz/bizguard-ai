import React, { useState } from 'react';
import { PosSettlement } from '../types/bizguard';
import { X, DollarSign, Smartphone, Truck, Users, CheckCircle2, AlertTriangle, Calculator, Sparkles, Mic, MicOff, Volume2 } from 'lucide-react';

interface PosSettlementModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveSettlement: (settlement: PosSettlement) => void;
}

export const PosSettlementModal: React.FC<PosSettlementModalProps> = ({
  isOpen,
  onClose,
  onSaveSettlement
}) => {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [cashInDrawer, setCashInDrawer] = useState<number>(3200);
  const [digitalUpiCard, setDigitalUpiCard] = useState<number>(2800);
  const [supplierPaidToday, setSupplierPaidToday] = useState<number>(1800);
  const [dailyWagesExpenses, setDailyWagesExpenses] = useState<number>(600);
  const [footfallCount, setFootfallCount] = useState<number>(145);
  const [notes, setNotes] = useState('');
  const [isListening, setIsListening] = useState<boolean>(false);
  const [voiceToast, setVoiceToast] = useState<string | null>(null);

  if (!isOpen) return null;

  const totalInflow = cashInDrawer + digitalUpiCard;
  const totalOutflow = supplierPaidToday + dailyWagesExpenses;
  const netDailyMargin = totalInflow - totalOutflow;
  const cashVsDigitalRatio = totalInflow > 0 ? Math.round((digitalUpiCard / totalInflow) * 100) : 50;

  // Voice NLP Parser
  const parseVoiceInput = (transcript: string) => {
    setVoiceToast(`🎙️ Heard: "${transcript}"`);

    // Match numbers
    const cashMatch = transcript.match(/(?:cash|drawer)\s*(?:sales|is)?\s*(\d+)/i);
    const digitalMatch = transcript.match(/(?:upi|digital|card)\s*(?:is)?\s*(\d+)/i);
    const supplierMatch = transcript.match(/(?:supplier|wholesale|vendor|paid)\s*(?:is)?\s*(\d+)/i);
    const wagesMatch = transcript.match(/(?:wages|staff|expense|expenses)\s*(?:is)?\s*(\d+)/i);

    if (cashMatch) setCashInDrawer(parseInt(cashMatch[1], 10));
    if (digitalMatch) setDigitalUpiCard(parseInt(digitalMatch[1], 10));
    if (supplierMatch) setSupplierPaidToday(parseInt(supplierMatch[1], 10));
    if (wagesMatch) setDailyWagesExpenses(parseInt(wagesMatch[1], 10));

    setTimeout(() => setVoiceToast(null), 4000);
  };

  const handleStartListening = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      setIsListening(true);
      recognition.onstart = () => setIsListening(true);
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        parseVoiceInput(transcript);
        setIsListening(false);
      };
      recognition.onerror = () => setIsListening(false);
      recognition.onend = () => setIsListening(false);
      recognition.start();
    } else {
      // Browser doesn't support Web Speech API; trigger simulated test
      simulateVoicePreset(1);
    }
  };

  const simulateVoicePreset = (presetNumber: 1 | 2) => {
    setIsListening(true);
    const speech = presetNumber === 1 
      ? "Cash 4500, UPI 3200, paid supplier 1800, staff wages 400"
      : "Cash 6200, digital 4800, paid wholesale 3100, expenses 650";
    
    setTimeout(() => {
      setIsListening(false);
      parseVoiceInput(speech);
    }, 600);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveSettlement({
      date,
      cashInDrawer,
      digitalUpiCard,
      supplierPaidToday,
      dailyWagesExpenses,
      totalInflow,
      totalOutflow,
      netDailyMargin,
      footfallCount,
      notes: notes || 'POS Daily Cash Closeout'
    });
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
      zIndex: 1100,
      padding: 20
    }}>
      <div className="card" style={{
        width: '100%',
        maxWidth: 600,
        maxHeight: '90vh',
        overflowY: 'auto',
        border: '1px solid var(--border-subtle)',
        background: 'var(--bg-card)',
        padding: 24
      }}>
        {/* Modal Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 38,
              height: 38,
              borderRadius: 10,
              background: 'rgba(16, 185, 129, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#10b981'
            }}>
              <Calculator size={20} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-main)' }}>
                End-of-Day POS Settlement
              </h3>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                30-second cash drawer closeout for supermarkets, retail & cafes
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
          >
            <X size={20} />
          </button>
        </div>

        {/* VOICE RECOGNITION / DICTATION BAR */}
        <div style={{
          background: isListening ? 'rgba(239, 68, 68, 0.15)' : 'var(--bg-subtle)',
          border: `1px solid ${isListening ? '#ef4444' : 'var(--border-subtle)'}`,
          borderRadius: 8,
          padding: '10px 14px',
          marginBottom: 16,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 8,
          transition: 'all 0.2s'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <button
              type="button"
              onClick={handleStartListening}
              style={{
                width: 34,
                height: 34,
                borderRadius: '50%',
                background: isListening ? '#ef4444' : '#2563eb',
                color: '#fff',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                boxShadow: isListening ? '0 0 12px #ef4444' : 'none'
              }}
              title="Click to speak your numbers"
            >
              {isListening ? <MicOff size={16} /> : <Mic size={16} />}
            </button>
            <div>
              <strong style={{ fontSize: '0.78rem', color: isListening ? '#f87171' : 'var(--text-main)' }}>
                {isListening ? 'Listening for numbers...' : 'Voice-to-Cashflow Dictation'}
              </strong>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block' }}>
                Speak your sales & expenses hands-free
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 6 }}>
            <button
              type="button"
              onClick={() => simulateVoicePreset(1)}
              style={{
                padding: '4px 8px',
                borderRadius: 6,
                fontSize: '0.68rem',
                fontWeight: 600,
                background: 'var(--bg-card)',
                border: '1px solid var(--border-subtle)',
                color: '#38bdf8',
                cursor: 'pointer'
              }}
            >
              ⚡ Test Voice A ($4.5k)
            </button>
            <button
              type="button"
              onClick={() => simulateVoicePreset(2)}
              style={{
                padding: '4px 8px',
                borderRadius: 6,
                fontSize: '0.68rem',
                fontWeight: 600,
                background: 'var(--bg-card)',
                border: '1px solid var(--border-subtle)',
                color: '#10b981',
                cursor: 'pointer'
              }}
            >
              ⚡ Test Voice B ($6.2k)
            </button>
          </div>
        </div>

        {voiceToast && (
          <div style={{ background: 'rgba(56, 189, 248, 0.15)', border: '1px solid rgba(56, 189, 248, 0.3)', color: '#38bdf8', padding: '6px 12px', borderRadius: 6, fontSize: '0.75rem', marginBottom: 12 }}>
            {voiceToast}
          </div>
        )}

        {/* Live Settlement Summary Banner */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 8,
          background: 'var(--bg-subtle)',
          padding: 12,
          borderRadius: 8,
          marginBottom: 18,
          textAlign: 'center'
        }}>
          <div>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block' }}>Total Gross Inflow</span>
            <strong style={{ fontSize: '1.05rem', color: '#10b981' }}>+${totalInflow.toLocaleString()}</strong>
          </div>
          <div>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block' }}>Today's Outflows</span>
            <strong style={{ fontSize: '1.05rem', color: '#ef4444' }}>-${totalOutflow.toLocaleString()}</strong>
          </div>
          <div>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block' }}>Net Daily Margin</span>
            <strong style={{ fontSize: '1.05rem', color: netDailyMargin >= 0 ? '#38bdf8' : '#f87171' }}>
              ${netDailyMargin.toLocaleString()}
            </strong>
          </div>
        </div>

        {/* Form Inputs */}
        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: 4 }}>
                Settlement Date
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                style={{ width: '100%', padding: '8px 10px', borderRadius: 6, border: '1px solid var(--border-subtle)', background: 'var(--bg-subtle)', fontSize: '0.82rem' }}
              />
            </div>
            <div>
              <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: 4 }}>
                Footfall / Total Orders
              </label>
              <input
                type="number"
                value={footfallCount}
                onChange={(e) => setFootfallCount(Number(e.target.value))}
                style={{ width: '100%', padding: '8px 10px', borderRadius: 6, border: '1px solid var(--border-subtle)', background: 'var(--bg-subtle)', fontSize: '0.82rem' }}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label style={{ fontSize: '0.75rem', color: '#10b981', display: 'flex', alignItems: 'center', gap: 4, marginBottom: 4, fontWeight: 600 }}>
                <DollarSign size={14} /> Cash in Drawer ($)
              </label>
              <input
                type="number"
                value={cashInDrawer}
                onChange={(e) => setCashInDrawer(Number(e.target.value))}
                style={{ width: '100%', padding: '8px 10px', borderRadius: 6, border: '1px solid var(--border-subtle)', background: 'var(--bg-subtle)', fontSize: '0.9rem', fontWeight: 700, color: '#10b981' }}
              />
            </div>
            <div>
              <label style={{ fontSize: '0.75rem', color: '#38bdf8', display: 'flex', alignItems: 'center', gap: 4, marginBottom: 4, fontWeight: 600 }}>
                <Smartphone size={14} /> Digital / UPI / Cards ($)
              </label>
              <input
                type="number"
                value={digitalUpiCard}
                onChange={(e) => setDigitalUpiCard(Number(e.target.value))}
                style={{ width: '100%', padding: '8px 10px', borderRadius: 6, border: '1px solid var(--border-subtle)', background: 'var(--bg-subtle)', fontSize: '0.9rem', fontWeight: 700, color: '#38bdf8' }}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label style={{ fontSize: '0.75rem', color: '#f87171', display: 'flex', alignItems: 'center', gap: 4, marginBottom: 4, fontWeight: 600 }}>
                <Truck size={14} /> Suppliers Paid Today ($)
              </label>
              <input
                type="number"
                value={supplierPaidToday}
                onChange={(e) => setSupplierPaidToday(Number(e.target.value))}
                style={{ width: '100%', padding: '8px 10px', borderRadius: 6, border: '1px solid var(--border-subtle)', background: 'var(--bg-subtle)', fontSize: '0.9rem', fontWeight: 700, color: '#f87171' }}
              />
            </div>
            <div>
              <label style={{ fontSize: '0.75rem', color: '#fbbf24', display: 'flex', alignItems: 'center', gap: 4, marginBottom: 4, fontWeight: 600 }}>
                <Users size={14} /> Staff Wages & Misc Costs ($)
              </label>
              <input
                type="number"
                value={dailyWagesExpenses}
                onChange={(e) => setDailyWagesExpenses(Number(e.target.value))}
                style={{ width: '100%', padding: '8px 10px', borderRadius: 6, border: '1px solid var(--border-subtle)', background: 'var(--bg-subtle)', fontSize: '0.9rem', fontWeight: 700, color: '#fbbf24' }}
              />
            </div>
          </div>

          <div>
            <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: 4 }}>
              Register Notes
            </label>
            <input
              type="text"
              placeholder="e.g. End of day counter closeout, weekend discount rush"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              style={{ width: '100%', padding: '8px 10px', borderRadius: 6, border: '1px solid var(--border-subtle)', background: 'var(--bg-subtle)', fontSize: '0.82rem' }}
            />
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
            <button
              type="button"
              className="btn-secondary"
              onClick={onClose}
              style={{ flex: 1, padding: '10px', fontSize: '0.85rem', justifyContent: 'center' }}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary"
              style={{ flex: 2, padding: '10px', fontSize: '0.85rem', justifyContent: 'center', gap: 6 }}
            >
              <CheckCircle2 size={16} /> Save Settlement & Update Model
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

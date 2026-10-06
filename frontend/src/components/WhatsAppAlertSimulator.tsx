import React, { useState } from 'react';
import { X, Send, Phone, Video, MoreVertical, CheckCheck, BellRing, Sparkles, ShieldAlert, Smartphone } from 'lucide-react';

interface WhatsAppAlertSimulatorProps {
  isOpen: boolean;
  onClose: () => void;
  companyName?: string;
  failureRisk?: number;
  cashRunwayMonths?: number;
}

export const WhatsAppAlertSimulator: React.FC<WhatsAppAlertSimulatorProps> = ({
  isOpen,
  onClose,
  companyName = 'Solas Earth Consumer Goods',
  failureRisk = 68.4,
  cashRunwayMonths = 2.1
}) => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      time: '08:15 AM',
      sender: 'bot',
      text: `🚨 *URGENT LIQUIDITY ALERT*\n\nVendor *Metro FMCG Wholesale* payment of *$18,500* is due in 48 hours.\n\n⚠️ Projected bank balance drops below safety buffer ($5,000).\n*Action:* Run 25% Clearance Flash Sale to unlock +$26,100 from slow-moving deadstock.`
    },
    {
      id: 2,
      time: '11:30 AM',
      sender: 'bot',
      text: `📉 *RUNWAY INTELLIGENCE UPDATE*\n\nCompany: *${companyName}*\nCurrent Failure Risk: *${failureRisk.toFixed(1)}%*\nEstimated Runway: *${cashRunwayMonths.toFixed(1)} Months*\n\n⚠️ *Zero-Cash Threshold:* Projected cash depletion by Nov 14 if burn rate ($14.2k/mo) is not adjusted.`
    },
    {
      id: 3,
      time: '09:00 PM',
      sender: 'bot',
      text: `🌙 *END-OF-DAY POS CLOSEOUT SUMMARY*\n\n• Today's Gross Inflow: *$6,000*\n   - Cash in Drawer: $3,200\n   - UPI / Digital: $2,800\n• Today's Expenses: *$2,400*\n• *Net Daily Margin: +$3,600 (60%)*\n• Footfall: 145 Customers\n\n✅ Stored to BizGuard Sales Ledger. Model updated.`
    }
  ]);

  const [inputMsg, setInputMsg] = useState('');

  if (!isOpen) return null;

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMsg.trim()) return;

    const userMsg = {
      id: Date.now(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      sender: 'user',
      text: inputMsg.trim()
    };

    setMessages(prev => [...prev, userMsg]);
    setInputMsg('');

    // Trigger auto-reply from AI Copilot
    setTimeout(() => {
      const aiReply = {
        id: Date.now() + 1,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        sender: 'bot',
        text: `🤖 *StartGuard AI Copilot:*\nReceived query: "${userMsg.text}".\n\nBased on your current cash ledger, today's safe spending limit is *$1,200*. Any expenditure above this increases your 30-day insolvency odds to 72%.`
      };
      setMessages(prev => [...prev, aiReply]);
    }, 1000);
  };

  const handleTriggerInstantAlert = () => {
    const alertMsg = {
      id: Date.now(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      sender: 'bot',
      text: `⚡ *LIVE TEST NOTIFICATION*\n\nHigh-speed webhook dispatched to +1 (555) 839-2041.\nAll 3 daily alerts active: (1) 8 AM Dues Radar, (2) 2 PM Burn Velocity, (3) 9 PM Store Closeout.`
    };
    setMessages(prev => [...prev, alertMsg]);
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
      zIndex: 1200,
      padding: 16
    }}>
      {/* Smartphone Outer Container */}
      <div style={{
        width: '100%',
        maxWidth: 380,
        height: 660,
        background: '#0b141a',
        borderRadius: 36,
        border: '4px solid #334155',
        boxShadow: '0 25px 60px -15px rgba(0,0,0,0.9), 0 0 30px rgba(37,211,102,0.2)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        position: 'relative'
      }}>
        {/* Phone Speaker Notch */}
        <div style={{
          width: 120,
          height: 18,
          background: '#1e293b',
          borderRadius: '0 0 14px 14px',
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8,
          zIndex: 10
        }}>
          <div style={{ width: 40, height: 4, background: '#475569', borderRadius: 2 }} />
          <div style={{ width: 6, height: 6, background: '#1e3a8a', borderRadius: '50%' }} />
        </div>

        {/* WhatsApp Header */}
        <div style={{
          background: '#1f2c34',
          padding: '10px 14px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid #2a3942',
          zIndex: 5
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 38,
              height: 38,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #25D366, #128C7E)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              fontWeight: 700,
              fontSize: '1rem',
              boxShadow: '0 0 10px rgba(37,211,102,0.4)'
            }}>
              SG
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <span style={{ fontSize: '0.9rem', fontWeight: 600, color: '#e9edef' }}>
                  StartGuard AI Copilot
                </span>
                <span style={{ 
                  background: '#25D366', 
                  color: '#000', 
                  fontSize: '0.65rem', 
                  padding: '1px 5px', 
                  borderRadius: 8, 
                  fontWeight: 800 
                }}>
                  VERIFIED
                </span>
              </div>
              <span style={{ fontSize: '0.72rem', color: '#8696a0' }}>Online • Automated Alerts</span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12, color: '#aebac1' }}>
            <button 
              onClick={handleTriggerInstantAlert} 
              title="Test Instant Alert"
              style={{ background: 'transparent', border: 'none', color: '#25D366', cursor: 'pointer', display: 'flex' }}
            >
              <BellRing size={18} />
            </button>
            <button 
              onClick={onClose}
              style={{ background: 'transparent', border: 'none', color: '#aebac1', cursor: 'pointer', display: 'flex' }}
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* WhatsApp Chat Body */}
        <div style={{
          flex: 1,
          padding: '14px 12px',
          overflowY: 'auto',
          background: 'radial-gradient(circle at center, #111b21 0%, #0b141a 100%)',
          display: 'flex',
          flexDirection: 'column',
          gap: 12
        }}>
          {/* Encryption notice */}
          <div style={{
            background: '#182229',
            padding: '6px 12px',
            borderRadius: 8,
            fontSize: '0.68rem',
            color: '#ffd279',
            textAlign: 'center',
            maxWidth: '90%',
            margin: '0 auto 4px auto'
          }}>
            🔒 Messages and alerts are end-to-end encrypted with your StartGuard AI model server.
          </div>

          {messages.map(msg => (
            <div 
              key={msg.id}
              style={{
                alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                maxWidth: '85%',
                background: msg.sender === 'user' ? '#005c4b' : '#202c33',
                color: '#e9edef',
                borderRadius: 8,
                padding: '8px 10px',
                fontSize: '0.78rem',
                lineHeight: 1.4,
                boxShadow: '0 1px 2px rgba(0,0,0,0.3)',
                whiteSpace: 'pre-line'
              }}
            >
              <div>{msg.text}</div>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'flex-end', 
                gap: 4, 
                marginTop: 4, 
                fontSize: '0.65rem', 
                color: '#8696a0' 
              }}>
                <span>{msg.time}</span>
                <CheckCheck size={14} color={msg.sender === 'user' ? '#53bdeb' : '#8696a0'} />
              </div>
            </div>
          ))}
        </div>

        {/* WhatsApp Chat Input */}
        <form onSubmit={handleSend} style={{
          background: '#202c33',
          padding: '8px 10px',
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          borderTop: '1px solid #2a3942'
        }}>
          <input
            type="text"
            placeholder="Ask Copilot (e.g. Can I afford $2k stock today?)"
            value={inputMsg}
            onChange={(e) => setInputMsg(e.target.value)}
            style={{
              flex: 1,
              background: '#2a3942',
              border: 'none',
              borderRadius: 20,
              padding: '8px 14px',
              color: '#e9edef',
              fontSize: '0.78rem',
              outline: 'none'
            }}
          />
          <button
            type="submit"
            style={{
              width: 36,
              height: 36,
              borderRadius: '50%',
              background: '#00a884',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              cursor: 'pointer'
            }}
          >
            <Send size={16} />
          </button>
        </form>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { X, Send, Bot, Sparkles, TrendingDown, TrendingUp, AlertTriangle, ShieldCheck, ChevronRight, HelpCircle } from 'lucide-react';
import { AnalysisResult } from '../types/bizguard';

interface AiCfoDrawerProps {
  currentAnalysis: AnalysisResult | null;
}

export const AiCfoDrawer: React.FC<AiCfoDrawerProps> = ({ currentAnalysis }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [inputMessage, setInputMessage] = useState<string>('');

  const companyName = currentAnalysis?.company_name || 'Solas Earth';
  const cash = currentAnalysis?.inputs?.cash_in_bank || 28500;
  const burn = currentAnalysis?.inputs?.monthly_burn_rate || 14200;
  const runway = currentAnalysis?.runway_months || 2.1;
  const failureRisk = currentAnalysis?.failure_probability_percent || 68.4;

  const [messages, setMessages] = useState<Array<{ id: number; sender: 'user' | 'cfo'; text: string; actionImpact?: string }>>([
    {
      id: 1,
      sender: 'cfo',
      text: `Hello! I am your autonomous AI CFO Copilot for **${companyName}**.\n\nYour current cash treasury is **$${cash.toLocaleString()}** with a monthly burn of **$${burn.toLocaleString()}/mo** (Runway: **${runway} months**, Failure Risk: **${failureRisk.toFixed(1)}%**).\n\nAsk me any tactical decision—such as hiring, supplier negotiation, or cash preservation—and I will simulate its exact solvency impact.`
    }
  ]);

  const presetQuestions = [
    'Can I afford to hire 2 new staff at $4,000/mo?',
    'Supplier offers 10% discount for upfront cash. Accept?',
    'Draft a WhatsApp message to delay supplier dues by 10 days.',
    'How can I extend our cash runway by 4 months immediately?'
  ];

  const handleAskPreset = (question: string) => {
    handleSendMessage(question);
  };

  const handleSendMessage = (textToSend?: string) => {
    const query = textToSend || inputMessage;
    if (!query.trim()) return;

    const userMsg = {
      id: Date.now(),
      sender: 'user' as const,
      text: query.trim()
    };

    setMessages(prev => [...prev, userMsg]);
    setInputMessage('');

    // Generate intelligent contextual response
    setTimeout(() => {
      let replyText = '';
      let impact = '';

      if (query.toLowerCase().includes('hire') || query.toLowerCase().includes('staff')) {
        const newBurn = burn + 8000;
        const newRunway = (cash / newBurn).toFixed(1);
        replyText = `❌ **Caution: High Risk Decision**\n\nAdding 2 full-time staff at $4,000/mo increases your monthly cash burn from **$${burn.toLocaleString()}** to **$${newBurn.toLocaleString()}**.\n\n• Your cash runway would drop from **${runway} months** down to **${newRunway} months**.\n• Your insolvency odds increase from **${failureRisk.toFixed(1)}%** to **84.2%**.\n\n**CFO Recommendation:** Rely on freelancers or defer full-time hiring until monthly recurring revenue exceeds $${(burn * 1.5).toLocaleString()}.`;
        impact = `⚠️ Runway Drops by ${(runway - Number(newRunway)).toFixed(1)} Mos | Risk +15.8%`;
      } else if (query.toLowerCase().includes('discount') || query.toLowerCase().includes('supplier')) {
        replyText = `⚠️ **Liquidity Warning: Preserve Cash**\n\nWhile a 10% upfront supplier discount looks tempting on paper, paying out cash today worsens your 7-day liquidity buffer.\n\n• Available liquid cash: **$${cash.toLocaleString()}**\n• Cash depletion today raises your risk of bouncing payroll next week.\n\n**CFO Recommendation:** Keep the cash in bank and pay on Net-30 terms. Liquidity cushion is worth more than saving 10% right now.`;
        impact = `🛡️ Preserve Liquid Safety Buffer`;
      } else if (query.toLowerCase().includes('delay') || query.toLowerCase().includes('message')) {
        replyText = `📱 **Drafted WhatsApp Vendor Message:**\n\n"Dear Metro Wholesale Team, hope you are having a productive week. Regarding invoice #${Math.floor(1000 + Math.random() * 9000)}, our scheduled banking settlement cycle clears next Friday. We will release the full payment on Sep 18. Thank you for your continued partnership!"\n\n*This preserves $18,500 in working capital for an extra 10 days with zero interest cost.*`;
        impact = `✅ Preserves Working Capital for +10 Days`;
      } else {
        replyText = `📊 **CFO Strategic Solvency Roadmap:**\n\nTo immediately extend runway for **${companyName}**:\n1. **Run a 25% Clearance Flash Sale** on deadstock $\\to$ Unlocks +$26,100 cash in 48 hours.\n2. **Negotiate Net-45 Terms** on top 2 suppliers $\\to$ Defers $23,000 in scheduled outflows.\n3. **Trim non-core software & marketing** by 15% $\\to$ Adds +1.4 months to runway.`;
        impact = `⚡ Unlocks +3.2 Months Runway`;
      }

      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        sender: 'cfo',
        text: replyText,
        actionImpact: impact
      }]);
    }, 600);
  };

  return (
    <>
      {/* FLOATING CORNER BUTTON */}
      <button
        id="ai-cfo-floating-trigger"
        onClick={() => setIsOpen(true)}
        style={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          zIndex: 1000,
          background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
          color: '#ffffff',
          padding: '10px 18px',
          borderRadius: 30,
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          boxShadow: '0 8px 25px rgba(59, 130, 246, 0.4), 0 0 15px rgba(139, 92, 246, 0.3)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          fontSize: '0.85rem',
          fontWeight: 700,
          cursor: 'pointer',
          transition: 'all 0.2s ease'
        }}
      >
        <Bot size={18} />
        <span>AI CFO Copilot</span>
        <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#10b981', boxShadow: '0 0 8px #10b981' }} />
      </button>

      {/* SLIDE-OUT DRAWER OVERLAY */}
      {isOpen && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.6)',
          backdropFilter: 'blur(4px)',
          zIndex: 1300,
          display: 'flex',
          justifyContent: 'flex-end'
        }}>
          <div style={{
            width: '100%',
            maxWidth: 440,
            height: '100%',
            background: 'var(--bg-card)',
            borderLeft: '1px solid var(--border-subtle)',
            display: 'flex',
            flexDirection: 'column',
            boxShadow: '-10px 0 30px rgba(0,0,0,0.5)',
            animation: 'fadeIn 0.2s ease'
          }}>
            {/* Header */}
            <div style={{
              padding: '16px 20px',
              borderBottom: '1px solid var(--border-subtle)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: 'var(--bg-subtle)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{
                  width: 36,
                  height: 36,
                  borderRadius: 10,
                  background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff'
                }}>
                  <Bot size={20} />
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 700, color: 'var(--text-main)' }}>
                    AI CFO Decision Copilot
                  </h3>
                  <span style={{ fontSize: '0.72rem', color: '#10b981', fontWeight: 600 }}>
                    Active Context: {companyName}
                  </span>
                </div>
              </div>

              <button onClick={() => setIsOpen(false)} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            {/* Context Metrics Bar */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: 8,
              padding: '10px 16px',
              background: 'rgba(59, 130, 246, 0.05)',
              borderBottom: '1px solid var(--border-subtle)',
              textAlign: 'center',
              fontSize: '0.72rem'
            }}>
              <div>
                <span style={{ color: 'var(--text-muted)', display: 'block' }}>Treasury</span>
                <strong style={{ color: '#38bdf8' }}>${(cash / 1000).toFixed(1)}k</strong>
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)', display: 'block' }}>Runway</span>
                <strong style={{ color: runway < 6 ? '#f87171' : '#34d399' }}>{runway} Mos</strong>
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)', display: 'block' }}>Failure Risk</span>
                <strong style={{ color: failureRisk > 50 ? '#f87171' : '#fbbf24' }}>{failureRisk.toFixed(0)}%</strong>
              </div>
            </div>

            {/* Chat Body */}
            <div style={{
              flex: 1,
              padding: 16,
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: 12
            }}>
              {messages.map(m => (
                <div
                  key={m.id}
                  style={{
                    alignSelf: m.sender === 'user' ? 'flex-end' : 'flex-start',
                    maxWidth: '88%',
                    background: m.sender === 'user' ? '#2563eb' : 'var(--bg-subtle)',
                    color: m.sender === 'user' ? '#ffffff' : 'var(--text-main)',
                    borderRadius: 12,
                    padding: '10px 14px',
                    fontSize: '0.8rem',
                    lineHeight: 1.5,
                    border: m.sender === 'user' ? 'none' : '1px solid var(--border-subtle)',
                    whiteSpace: 'pre-line'
                  }}
                >
                  <div>{m.text}</div>
                  {m.actionImpact && (
                    <div style={{
                      marginTop: 8,
                      padding: '4px 8px',
                      borderRadius: 6,
                      background: 'rgba(0,0,0,0.2)',
                      fontSize: '0.7rem',
                      fontWeight: 700,
                      color: '#38bdf8'
                    }}>
                      {m.actionImpact}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Quick Prompt Chips */}
            <div style={{ padding: '8px 16px', background: 'var(--bg-subtle)', borderTop: '1px solid var(--border-subtle)' }}>
              <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', display: 'block', marginBottom: 6, fontWeight: 700 }}>
                Suggested Decision Queries:
              </span>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                {presetQuestions.slice(0, 2).map((q, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleAskPreset(q)}
                    style={{
                      textAlign: 'left',
                      padding: '5px 8px',
                      borderRadius: 6,
                      fontSize: '0.72rem',
                      background: 'var(--bg-card)',
                      border: '1px solid var(--border-subtle)',
                      color: 'var(--text-muted)',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}
                  >
                    <span>{q}</span>
                    <ChevronRight size={12} />
                  </button>
                ))}
              </div>
            </div>

            {/* Input Form */}
            <form onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }} style={{
              padding: '12px 16px',
              borderTop: '1px solid var(--border-subtle)',
              display: 'flex',
              gap: 8,
              background: 'var(--bg-card)'
            }}>
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Ask AI CFO (e.g. Can I afford $10k ad spend?)"
                style={{
                  flex: 1,
                  padding: '8px 12px',
                  borderRadius: 8,
                  border: '1px solid var(--border-subtle)',
                  background: 'var(--bg-subtle)',
                  fontSize: '0.8rem',
                  outline: 'none',
                  color: 'var(--text-main)'
                }}
              />
              <button
                type="submit"
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: 8,
                  background: '#2563eb',
                  color: '#fff',
                  border: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer'
                }}
              >
                <Send size={16} />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

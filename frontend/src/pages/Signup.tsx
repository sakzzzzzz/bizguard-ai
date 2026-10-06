import React, { useState } from 'react';
import { ActivePage } from '../types/bizguard';
import { Rocket, User, Mail, Lock, Building, ArrowLeft } from 'lucide-react';

interface SignupProps {
  setActivePage: (page: ActivePage) => void;
  onSignupSuccess: () => void;
}

export const Signup: React.FC<SignupProps> = ({ setActivePage, onSignupSuccess }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [startup, setStartup] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSignupSuccess();
  };

  return (
    <div style={{ minHeight: 'calc(100vh - 74px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 24px', background: '#080c14' }}>
      <div className="card" style={{ width: '100%', maxWidth: 500, padding: 36, background: '#0f172a', border: '1px solid rgba(255,255,255,0.1)' }}>
        <button
          onClick={() => setActivePage('login')}
          style={{ background: 'transparent', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 600, marginBottom: 20 }}
        >
          <ArrowLeft size={16} /> Back to Sign In
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
          <div style={{ width: 30, height: 30, borderRadius: 8, background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Rocket size={16} color="#ffffff" />
          </div>
          <h2 style={{ fontSize: 24, fontWeight: 800, color: '#ffffff' }}>Create Founder Account</h2>
        </div>
        <p style={{ fontSize: 13.5, color: '#94a3b8', marginBottom: 24 }}>Set up an account to monitor cash runway, burn rate, and solvency risk.</p>

        <form onSubmit={handleSubmit}>
          <div className="input-field-group">
            <label style={{ display: 'flex', alignItems: 'center', gap: 6 }}><User size={14} /> Founder Name</label>
            <input type="text" className="form-control" placeholder="Jane Doe / Alex Rivera" value={name} onChange={e => setName(e.target.value)} required />
          </div>

          <div className="input-field-group">
            <label style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Mail size={14} /> Work Email</label>
            <input type="email" className="form-control" placeholder="founder@yourstartup.com" value={email} onChange={e => setEmail(e.target.value)} required />
          </div>

          <div className="input-field-group">
            <label style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Building size={14} /> Startup Entity / Venture</label>
            <input type="text" className="form-control" placeholder="Nexus AI / CloudMatrix" value={startup} onChange={e => setStartup(e.target.value)} />
          </div>

          <div className="input-field-group">
            <label style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Lock size={14} /> Password</label>
            <input type="password" className="form-control" placeholder="Create a secure password" value={password} onChange={e => setPassword(e.target.value)} required />
          </div>

          <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '12px', marginTop: 10 }}>
            Create Account & Launch →
          </button>
        </form>

        <div style={{ marginTop: 20, textAlign: 'center', fontSize: 13, color: '#94a3b8' }}>
          Already have an account?{' '}
          <button onClick={() => setActivePage('login')} style={{ background: 'transparent', color: '#60a5fa', fontWeight: 700 }}>
            Sign In
          </button>
        </div>
      </div>
    </div>
  );
};

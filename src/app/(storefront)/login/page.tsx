"use client";

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { PUBLISHABLE_KEY } from '@/storefront/lib/medusa';
import { useStore } from '@/storefront/lib/StoreContext';

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { refreshUser } = useStore();

  const handleEmailSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        // Login as customer
        const res = await fetch(`${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://127.0.0.1:9000"}/auth/customer/emailpass`, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'x-publishable-api-key': PUBLISHABLE_KEY
          },
          body: JSON.stringify({ email, password }),
        });
        
        if (!res.ok) {
          throw new Error('Invalid email or password');
        }

        const data = await res.json();
        
        // Save token
        if (data.token) {
          localStorage.setItem('medusa_token', data.token);
        }
        
        await refreshUser();
        router.push('/portal');
      } else {
        // Register Auth Identity
        const authRes = await fetch(`${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://127.0.0.1:9000"}/auth/customer/emailpass/register`, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'x-publishable-api-key': PUBLISHABLE_KEY
          },
          body: JSON.stringify({ email, password }),
        });
        
        if (!authRes.ok) {
          const errData = await authRes.json();
          throw new Error(errData.message || 'Registration failed');
        }

        const authData = await authRes.json();
        const token = authData.token;

        if (token) {
          localStorage.setItem('medusa_token', token);
        }

        // Create Customer Record
        const customerRes = await fetch(`${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://127.0.0.1:9000"}/store/customers`, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'x-publishable-api-key': PUBLISHABLE_KEY,
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            email,
            first_name: firstName,
            last_name: lastName,
          }),
        });

        if (!customerRes.ok) {
          const errData = await customerRes.json();
          throw new Error(errData.message || 'Failed to create customer profile');
        }

        await refreshUser();
        router.push('/portal');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="info-page" style={{ padding: '80px 20px', maxWidth: '500px', margin: '0 auto', minHeight: '60vh' }}>
      <h1 style={{ fontSize: '48px', textTransform: 'uppercase', marginBottom: '8px', fontFamily: "'Barlow Condensed', sans-serif", textAlign: 'center' }}>
        {isLogin ? 'Login' : 'Register'}
      </h1>
      <p style={{ fontSize: '16px', color: 'var(--mid)', lineHeight: 1.6, textAlign: 'center', marginBottom: '32px' }}>
        {isLogin ? 'Welcome back to the inner circle.' : 'Join the Kindard inner circle.'}
      </p>

      {error && <div style={{ color: 'var(--red)', marginBottom: '16px', fontSize: '14px', textAlign: 'center', padding: '10px', background: '#ffe6e6' }}>{error}</div>}

      <form onSubmit={handleEmailSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {!isLogin && (
          <div style={{ display: 'flex', gap: '16px' }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '12px', fontWeight: 600, letterSpacing: '1px' }}>FIRST NAME</label>
              <input 
                type="text" 
                required 
                value={firstName} 
                onChange={e => setFirstName(e.target.value)} 
                style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '0' }}
              />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '12px', fontWeight: 600, letterSpacing: '1px' }}>LAST NAME</label>
              <input 
                type="text" 
                required 
                value={lastName} 
                onChange={e => setLastName(e.target.value)} 
                style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '0' }}
              />
            </div>
          </div>
        )}
        
        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontSize: '12px', fontWeight: 600, letterSpacing: '1px' }}>EMAIL ADDRESS</label>
          <input 
            type="email" 
            required 
            value={email} 
            onChange={e => setEmail(e.target.value)} 
            style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '0' }}
          />
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontSize: '12px', fontWeight: 600, letterSpacing: '1px' }}>PASSWORD</label>
          <input 
            type="password" 
            required 
            value={password} 
            onChange={e => setPassword(e.target.value)} 
            style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '0' }}
          />
        </div>

        <button 
          type="submit" 
          disabled={loading}
          style={{ 
            width: '100%', 
            padding: '16px', 
            background: 'var(--black)', 
            color: 'var(--white)', 
            border: 'none', 
            fontWeight: 700, 
            letterSpacing: '1px', 
            cursor: loading ? 'not-allowed' : 'pointer',
            marginTop: '8px'
          }}
        >
          {loading ? 'PROCESSING...' : (isLogin ? 'SIGN IN' : 'CREATE ACCOUNT')}
        </button>
      </form>

      <div style={{ textAlign: 'center', marginTop: '32px', fontSize: '14px' }}>
        <button 
          onClick={() => setIsLogin(!isLogin)}
          style={{ background: 'none', border: 'none', textDecoration: 'underline', cursor: 'pointer', color: 'var(--mid)', fontWeight: 700 }}
        >
          {isLogin ? "DON'T HAVE AN ACCOUNT? REGISTER" : "ALREADY HAVE AN ACCOUNT? LOGIN"}
        </button>
      </div>

      {!isLogin && (
        <div className="login-benefits" style={{ marginTop: '40px' }}>
          <div className="login-benefit-item" style={{ display: 'flex', gap: '16px', marginBottom: '20px' }}>
            <div className="login-benefit-icon"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="3" width="15" height="13"></rect><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon><circle cx="5.5" cy="18.5" r="2.5"></circle><circle cx="18.5" cy="18.5" r="2.5"></circle></svg></div>
            <div className="login-benefit-text">
              <h4 style={{ margin: '0 0 4px 0', fontSize: '14px' }}>Free Express Shipping</h4>
              <p style={{ margin: 0, fontSize: '13px', color: 'var(--mid)' }}>Members automatically get free express shipping on all orders over $150.</p>
            </div>
          </div>
          <div className="login-benefit-item" style={{ display: 'flex', gap: '16px', marginBottom: '20px' }}>
            <div className="login-benefit-icon"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg></div>
            <div className="login-benefit-text">
              <h4 style={{ margin: '0 0 4px 0', fontSize: '14px' }}>Early Access to Drops</h4>
              <p style={{ margin: 0, fontSize: '13px', color: 'var(--mid)' }}>Get notified 24 hours before new collections go live to the public.</p>
            </div>
          </div>
          <div className="login-benefit-item" style={{ display: 'flex', gap: '16px' }}>
            <div className="login-benefit-icon"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="1 4 1 10 7 10"></polyline><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"></path></svg></div>
            <div className="login-benefit-text">
              <h4 style={{ margin: '0 0 4px 0', fontSize: '14px' }}>Seamless Returns</h4>
              <p style={{ margin: 0, fontSize: '13px', color: 'var(--mid)' }}>Manage all your orders, tracking, and instant returns from your portal.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

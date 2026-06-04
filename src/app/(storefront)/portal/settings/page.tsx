"use client";

import { useState, FormEvent, useEffect } from 'react';
import { useStore } from '@/storefront/lib/StoreContext';
import { PUBLISHABLE_KEY } from '@/storefront/lib/medusa';

export default function PortalSettingsPage() {
  const { user, refreshUser } = useStore();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  
  const [avatarUrl, setAvatarUrl] = useState('');
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  useEffect(() => {
    if (user) {
      setFirstName(user.first_name || '');
      setLastName(user.last_name || '');
      setPhone(user.phone || '');
      if (user.metadata?.avatar_url) {
        setAvatarUrl(user.metadata.avatar_url);
      }
    }
  }, [user]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');

    try {
      const token = localStorage.getItem('medusa_token');
      const res = await fetch(`${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://127.0.0.1:9000"}/store/customers/me`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'x-publishable-api-key': PUBLISHABLE_KEY,
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          first_name: firstName,
          last_name: lastName,
          phone: phone,
          metadata: {
            ...user.metadata,
            avatar_url: avatarUrl
          }
        }),
      });

      if (!res.ok) throw new Error('Failed to update settings');
      
      setMessage('Settings updated successfully!');
      await refreshUser();
    } catch (err: any) {
      setError(err.message || 'An error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '40px', textTransform: 'uppercase', marginBottom: '8px' }}>
        Account Settings
      </h2>
      <p style={{ color: 'var(--mid)', marginBottom: '32px' }}>
        Update your personal information.
      </p>

      {message && <div style={{ padding: '16px', background: '#e6ffe6', color: 'green', marginBottom: '24px' }}>{message}</div>}
      {error && <div style={{ padding: '16px', background: '#ffe6e6', color: 'var(--red)', marginBottom: '24px' }}>{error}</div>}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '400px' }}>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '8px' }}>
          <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: '#eee', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {avatarUrl ? (
              <img src={avatarUrl} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <span style={{ fontSize: '24px', color: '#999' }}>👤</span>
            )}
          </div>
          <div>
            <label style={{ display: 'inline-block', padding: '8px 16px', background: 'var(--black)', color: 'var(--white)', fontSize: '12px', fontWeight: 600, cursor: uploadingAvatar ? 'not-allowed' : 'pointer' }}>
              {uploadingAvatar ? 'UPLOADING...' : 'UPLOAD PHOTO'}
              <input 
                type="file" 
                accept="image/*" 
                style={{ display: 'none' }}
                disabled={uploadingAvatar}
                onChange={async (e) => {
                  if (e.target.files && e.target.files[0]) {
                    setUploadingAvatar(true);
                    const formData = new FormData();
                    formData.append('file', e.target.files[0]);
                    try {
                      const res = await fetch('/api/upload', { method: 'POST', body: formData });
                      const data = await res.json();
                      if (data.success) {
                        setAvatarUrl(data.url);
                        // Save immediately
                        const token = localStorage.getItem('medusa_token');
                        await fetch(`${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://127.0.0.1:9000"}/store/customers/me`, {
                          method: 'POST',
                          headers: { 
                            'Content-Type': 'application/json',
                            'x-publishable-api-key': PUBLISHABLE_KEY,
                            'Authorization': `Bearer ${token}`
                          },
                          body: JSON.stringify({ metadata: { ...user?.metadata, avatar_url: data.url } })
                        });
                        await refreshUser();
                      }
                    } catch (err) {
                      console.error(err);
                    }
                    setUploadingAvatar(false);
                  }
                }}
              />
            </label>
          </div>
        </div>

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

        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontSize: '12px', fontWeight: 600, letterSpacing: '1px' }}>EMAIL ADDRESS</label>
          <input 
            type="email" 
            disabled 
            value={user?.email || ''} 
            style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '0', background: '#f9f9f9', color: '#999' }}
          />
          <p style={{ fontSize: '11px', color: 'var(--mid)', marginTop: '4px' }}>Email cannot be changed directly.</p>
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontSize: '12px', fontWeight: 600, letterSpacing: '1px' }}>PHONE NUMBER</label>
          <input 
            type="tel" 
            value={phone} 
            onChange={e => setPhone(e.target.value)} 
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
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          {loading ? 'SAVING...' : 'SAVE CHANGES'}
        </button>
      </form>
    </div>
  );
}

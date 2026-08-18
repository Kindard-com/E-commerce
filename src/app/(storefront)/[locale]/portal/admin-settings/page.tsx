"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '@/storefront/lib/StoreContext';

export default function AdminSettings() {
  const { isAdmin, authLoading } = useStore();
  const router = useRouter();

  const [settings, setSettings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!authLoading && !isAdmin) {
      router.push('/portal');
      return;
    }
    if (isAdmin) {
      fetch('/api/admin/settings')
        .then(res => res.json())
        .then(data => {
          setSettings(data.settings || []);
          setLoading(false);
        });
    }
  }, [isAdmin, authLoading, router]);

  const handleChange = (key: string, value: string) => {
    setSettings(prev => {
      const idx = prev.findIndex(s => s.setting_key === key);
      if (idx >= 0) {
        const newSet = [...prev];
        newSet[idx].setting_value = value;
        return newSet;
      }
      return [...prev, { setting_key: key, setting_value: value, setting_type: 'text', category: 'general' }];
    });
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage('');
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ updates: settings })
      });
      const data = await res.json();
      if (data.success) {
        setMessage('Settings saved successfully!');
      } else {
        setMessage(`Error: ${data.error}`);
      }
    } catch (err) {
      setMessage('An unexpected error occurred.');
    }
    setSaving(false);
  };

  const getSetting = (key: string) => settings.find(s => s.setting_key === key)?.setting_value || '';

  if (authLoading || !isAdmin) return <div>Checking access...</div>;
  if (loading) return <div>Loading settings...</div>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '32px', textTransform: 'uppercase' }}>Site Settings</h1>
        <button onClick={handleSave} className="btn-primary" disabled={saving}>
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      {message && <div style={{ padding: '12px', background: 'var(--mid)', color: 'var(--white)', marginBottom: '24px' }}>{message}</div>}

      <div style={{ display: 'grid', gap: '32px' }}>
        <div style={{ background: 'var(--white)', border: '1.5px solid var(--black)', padding: '24px', boxShadow: '4px 4px 0 var(--black)' }}>
          <h2 style={{ fontSize: '20px', marginBottom: '16px', borderBottom: '1px solid var(--light)', paddingBottom: '8px' }}>General & URLs</h2>
          <div style={{ display: 'grid', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '4px' }}>Main Website URL</label>
              <input type="text" className="input-field" value={getSetting('site_url')} onChange={e => handleChange('site_url', e.target.value)} />
            </div>
            <div>
              <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '4px' }}>Admin / Backoffice URL</label>
              <input type="text" className="input-field" value={getSetting('admin_url')} onChange={e => handleChange('admin_url', e.target.value)} />
            </div>
          </div>
        </div>
        {/* Marketing Banner */}
        <div style={{ background: 'var(--white)', border: '1.5px solid var(--black)', padding: '24px', boxShadow: '4px 4px 0 var(--black)' }}>
          <h2 style={{ fontSize: '20px', marginBottom: '16px', borderBottom: '1px solid var(--light)', paddingBottom: '8px' }}>Marketing Banner (Ticker)</h2>
          <div style={{ display: 'grid', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '4px' }}>Banner Text (Use | to separate items)</label>
              <input 
                type="text" 
                className="input-field" 
                value={getSetting('marketing_banner_text')} 
                onChange={e => handleChange('marketing_banner_text', e.target.value)} 
                placeholder="FREE SHIPPING OVER $150 | USE CODE: KIND20 FOR 20% OFF"
              />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

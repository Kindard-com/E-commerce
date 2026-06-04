"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '@/storefront/lib/StoreContext';

export default function LegalPagesAdmin() {
  const { isAdmin, authLoading } = useStore();
  const router = useRouter();

  const [pages, setPages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  
  const [selectedType, setSelectedType] = useState('privacy_policy');
  const [editData, setEditData] = useState({ title: '', slug: '', content: '', status: 'published' });

  useEffect(() => {
    if (!authLoading && !isAdmin) {
      router.push('/portal');
      return;
    }
    if (isAdmin) {
      fetch('/api/admin/legal')
        .then(res => res.json())
        .then(data => {
          setPages(data.pages || []);
          loadPage(data.pages || [], 'privacy_policy');
          setLoading(false);
        });
    }
  }, [isAdmin, authLoading, router]);

  const loadPage = (allPages: any[], type: string) => {
    const page = allPages.find((p: any) => p.page_type === type);
    if (page) {
      setEditData({ title: page.title, slug: page.slug, content: page.content, status: page.status });
    } else {
      const defaults: Record<string, any> = {
        privacy_policy: { title: 'Privacy Policy', slug: 'privacy-policy', content: '', status: 'published' },
        terms_of_service: { title: 'Terms of Service', slug: 'terms-of-service', content: '', status: 'published' },
        cookie_settings: { title: 'Cookie Settings', slug: 'cookie-settings', content: '', status: 'published' },
      };
      setEditData(defaults[type] || defaults.privacy_policy);
    }
  };

  const handleTabChange = (type: string) => {
    setSelectedType(type);
    loadPage(pages, type);
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage('');
    try {
      const res = await fetch('/api/admin/legal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ page_type: selectedType, ...editData })
      });
      const data = await res.json();
      if (data.success) {
        setMessage('Page updated successfully!');
      } else {
        setMessage(`Error: ${data.error}`);
      }
    } catch (err) {
      setMessage('An unexpected error occurred.');
    }
    setSaving(false);
  };

  if (authLoading || !isAdmin) return <div>Checking access...</div>;
  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '32px', textTransform: 'uppercase' }}>Legal Pages</h1>
        <button onClick={handleSave} className="btn-primary" disabled={saving}>
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      {message && <div style={{ padding: '12px', background: 'var(--mid)', color: 'var(--white)', marginBottom: '24px' }}>{message}</div>}

      <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
        {['privacy_policy', 'terms_of_service', 'cookie_settings'].map(type => (
          <button 
            key={type}
            onClick={() => handleTabChange(type)}
            style={{ 
              padding: '8px 16px', 
              background: selectedType === type ? 'var(--black)' : 'var(--white)', 
              color: selectedType === type ? 'var(--white)' : 'var(--black)',
              border: '1.5px solid var(--black)',
              cursor: 'pointer',
              textTransform: 'capitalize'
            }}
          >
            {type.replace(/_/g, ' ')}
          </button>
        ))}
      </div>

      <div style={{ background: 'var(--white)', border: '1.5px solid var(--black)', padding: '24px', boxShadow: '4px 4px 0 var(--black)' }}>
        <div style={{ display: 'grid', gap: '16px', marginBottom: '16px' }}>
          <div>
            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '4px' }}>Title</label>
            <input type="text" className="input-field" value={editData.title} onChange={e => setEditData({...editData, title: e.target.value})} />
          </div>
          <div>
            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '4px' }}>URL Slug</label>
            <input type="text" className="input-field" value={editData.slug} onChange={e => setEditData({...editData, slug: e.target.value})} />
          </div>
          <div>
            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '4px' }}>Status</label>
            <select className="input-field" value={editData.status} onChange={e => setEditData({...editData, status: e.target.value})}>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
            </select>
          </div>
        </div>
        <div>
          <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '4px' }}>Markdown Content</label>
          <textarea 
            className="input-field" 
            style={{ minHeight: '400px', fontFamily: 'monospace' }} 
            value={editData.content} 
            onChange={e => setEditData({...editData, content: e.target.value})} 
          />
        </div>
      </div>
    </div>
  );
}

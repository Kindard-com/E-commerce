"use client";

import { useEffect, useState, FormEvent } from 'react';
import { useStore } from '@/storefront/lib/StoreContext';
import { PUBLISHABLE_KEY } from '@/storefront/lib/medusa';
import { GlobalAddressAutocomplete, AddressData } from '@/storefront/components/GlobalAddressAutocomplete';

export default function PortalAddressesPage() {
  const { user } = useStore();
  const [addresses, setAddresses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const [addressData, setAddressData] = useState<AddressData | null>(null);

  const fetchAddresses = () => {
    setLoading(true);
    const token = localStorage.getItem('medusa_token');
    fetch(`${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://127.0.0.1:9000"}/store/customers/me`, {
      headers: {
        'x-publishable-api-key': PUBLISHABLE_KEY,
        'Authorization': `Bearer ${token}`
      }
    })
    .then(res => res.json())
    .then(data => {
      setAddresses(data.customer?.addresses || []);
      setLoading(false);
    })
    .catch(err => {
      setLoading(false);
    });
  };

  useEffect(() => {
    if (!user) return;
    fetchAddresses();
  }, [user]);

  const handleDelete = async (id: string) => {
    const token = localStorage.getItem('medusa_token');
    await fetch(`${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://127.0.0.1:9000"}/store/customers/me/addresses/${id}`, {
      method: 'DELETE',
      headers: {
        'x-publishable-api-key': PUBLISHABLE_KEY,
        'Authorization': `Bearer ${token}`
      }
    });
    fetchAddresses();
  };

  const handleAddSubmit = async () => {
    if (!addressData) return;
    
    setSubmitting(true);
    setError('');

    const token = localStorage.getItem('medusa_token');

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://127.0.0.1:9000"}/store/customers/me/addresses`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-publishable-api-key': PUBLISHABLE_KEY,
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          first_name: addressData.first_name,
          last_name: addressData.last_name,
          company: addressData.company || undefined,
          address_1: addressData.address_1,
          address_2: addressData.address_2 || undefined,
          city: addressData.city,
          province: addressData.province || undefined,
          postal_code: addressData.postal_code,
          country_code: addressData.country_code,
          phone: addressData.phone || undefined,
          metadata: addressData.metadata || {}
        })
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || 'Failed to add address');
      }

      setShowAddForm(false);
      setAddressData(null);
      fetchAddresses();
    } catch (err: any) {
      setError(err.message || 'An error occurred.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <h2 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '40px', textTransform: 'uppercase', marginBottom: '8px' }}>
        Addresses
      </h2>
      <p style={{ color: 'var(--mid)', marginBottom: '32px' }}>
        Manage your shipping and billing addresses.
      </p>
      
      {loading ? (
        <div style={{ padding: '48px 24px', border: '1px solid #ddd', textAlign: 'center' }}>
          <p style={{ color: 'var(--mid)', fontSize: '14px' }}>Loading addresses...</p>
        </div>
      ) : addresses.length === 0 ? (
        <div style={{ padding: '48px 24px', border: '1px solid #ddd', textAlign: 'center' }}>
          <p style={{ color: 'var(--mid)', fontSize: '14px' }}>You have no saved addresses.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '24px' }}>
          {addresses.map(addr => (
            <div key={addr.id} style={{ border: '1px solid #ddd', padding: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <p style={{ fontWeight: 600, marginBottom: '8px' }}>{addr.first_name} {addr.last_name}</p>
                {addr.metadata?.address_verified && (
                  <span style={{ fontSize: '10px', background: '#e6ffed', color: '#1a7f37', padding: '2px 6px', borderRadius: '4px', fontWeight: 600 }}>VERIFIED</span>
                )}
              </div>
              <p style={{ fontSize: '14px', color: 'var(--mid)' }}>{addr.address_1}</p>
              {addr.address_2 && <p style={{ fontSize: '14px', color: 'var(--mid)' }}>{addr.address_2}</p>}
              <p style={{ fontSize: '14px', color: 'var(--mid)' }}>{addr.city}, {addr.province} {addr.postal_code}</p>
              <p style={{ fontSize: '14px', color: 'var(--mid)' }}>{addr.country_code?.toUpperCase()}</p>
              {addr.phone && <p style={{ fontSize: '14px', color: 'var(--mid)', marginTop: '8px' }}>{addr.phone}</p>}
              
              <div style={{ display: 'flex', gap: '16px', marginTop: '16px' }}>
                <button onClick={() => handleDelete(addr.id)} style={{ background: 'none', border: 'none', textDecoration: 'underline', color: 'var(--red)', cursor: 'pointer', fontSize: '12px', fontWeight: 600 }}>DELETE</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {!showAddForm ? (
        <button 
          onClick={() => setShowAddForm(true)}
          style={{ marginTop: '32px', background: 'var(--black)', color: 'var(--white)', border: 'none', padding: '16px 32px', fontWeight: 700, letterSpacing: '1px', cursor: 'pointer' }}
        >
          ADD NEW ADDRESS
        </button>
      ) : (
        <div style={{ marginTop: '48px', padding: '32px', border: '1px solid #ddd', maxWidth: '600px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <h3 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '24px', textTransform: 'uppercase', margin: 0 }}>Add a New Address</h3>
            <button 
              onClick={() => setShowAddForm(false)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '12px', color: 'var(--mid)' }}
            >
              CANCEL
            </button>
          </div>
          
          {error && <div style={{ color: 'var(--red)', marginBottom: '16px', fontSize: '14px', padding: '10px', background: '#ffe6e6' }}>{error}</div>}

          <GlobalAddressAutocomplete 
            onChange={setAddressData}
            onSubmit={handleAddSubmit}
            submitting={submitting}
          />
        </div>
      )}
    </div>
  );
}

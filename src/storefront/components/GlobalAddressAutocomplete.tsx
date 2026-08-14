"use client";

import React, { useState, useEffect, useRef } from 'react';
import { PUBLISHABLE_KEY } from '../lib/medusa';

export type AddressData = {
  email: string;
  first_name: string;
  last_name: string;
  company?: string;
  address_1: string;
  address_2: string;
  city: string;
  province: string;
  postal_code: string;
  country_code: string;
  phone: string;
  metadata?: any;
};

type Props = {
  defaultValues?: Partial<AddressData>;
  onChange: (data: AddressData) => void;
  onSubmit: (e?: React.FormEvent) => void;
  submitLabel?: string;
  submitting?: boolean;
};

const COUNTRIES = [
  { code: 'nl', name: 'Netherlands' },
  { code: 'be', name: 'Belgium' },
  { code: 'de', name: 'Germany' },
  { code: 'fr', name: 'France' },
  { code: 'gb', name: 'United Kingdom' },
  { code: 'us', name: 'United States' },
  { code: 'ch', name: 'Switzerland' },
  { code: 'ae', name: 'United Arab Emirates' },
  { code: 'es', name: 'Spain' },
  { code: 'it', name: 'Italy' },
];

export function GlobalAddressAutocomplete({ defaultValues, onChange, onSubmit, submitLabel = "SAVE ADDRESS", submitting = false }: Props) {
  const [mode, setMode] = useState<'search' | 'manual'>('search');
  
  const [email, setEmail] = useState(defaultValues?.email || '');
  const [firstName, setFirstName] = useState(defaultValues?.first_name || '');
  const [lastName, setLastName] = useState(defaultValues?.last_name || '');
  const [company, setCompany] = useState(defaultValues?.company || '');
  const [address1, setAddress1] = useState(defaultValues?.address_1 || '');
  const [address2, setAddress2] = useState(defaultValues?.address_2 || '');
  const [city, setCity] = useState(defaultValues?.city || '');
  const [province, setProvince] = useState(defaultValues?.province || '');
  const [postalCode, setPostalCode] = useState(defaultValues?.postal_code || '');
  const [countryCode, setCountryCode] = useState(defaultValues?.country_code || 'de');
  const [phone, setPhone] = useState(defaultValues?.phone || '');
  const [metadata, setMetadata] = useState<any>(defaultValues?.metadata || {});

  // Autocomplete state
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  
  // NL/BE specific
  const [lookupPostcode, setLookupPostcode] = useState('');
  const [lookupHouseNumber, setLookupHouseNumber] = useState('');
  const [lookupError, setLookupError] = useState('');

  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    onChange({
      email,
      first_name: firstName,
      last_name: lastName,
      company,
      address_1: address1,
      address_2: address2,
      city,
      province,
      postal_code: postalCode,
      country_code: countryCode,
      phone,
      metadata
    });
  }, [email, firstName, lastName, company, address1, address2, city, province, postalCode, countryCode, phone, metadata]);

  // Handle Autocomplete
  useEffect(() => {
    if (query.length < 3 || mode !== 'search' || (countryCode === 'nl' || countryCode === 'be')) {
      setSuggestions([]);
      return;
    }

    if (debounceTimeout.current) clearTimeout(debounceTimeout.current);

    debounceTimeout.current = setTimeout(async () => {
      setLoadingSuggestions(true);
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://127.0.0.1:9000"}/store/address/autocomplete?query=${encodeURIComponent(query)}&country=${countryCode}`, {
          headers: { 'x-publishable-api-key': PUBLISHABLE_KEY }
        });
        const data = await res.json();
        if (data.suggestions) {
          setSuggestions(data.suggestions);
          setShowSuggestions(true);
        }
      } catch (err) {
        console.error("Autocomplete failed:", err);
      } finally {
        setLoadingSuggestions(false);
      }
    }, 500);

    return () => {
      if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
    };
  }, [query, countryCode, mode]);

  const selectSuggestion = async (place_id: string, description: string) => {
    setQuery(description);
    setShowSuggestions(false);
    
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://127.0.0.1:9000"}/store/address/validate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-publishable-api-key': PUBLISHABLE_KEY },
        body: JSON.stringify({ place_id, country: countryCode })
      });
      const data = await res.json();
      
      if (data.valid && data.address) {
        setAddress1(data.address.address_1 || '');
        setAddress2(data.address.address_2 || '');
        setCity(data.address.city || '');
        setProvince(data.address.province || '');
        setPostalCode(data.address.postal_code || '');
        if (data.address.country_code) setCountryCode(data.address.country_code);
        setMetadata(data.metadata || {});
        setMode('manual'); // switch to manual to let them review
      }
    } catch (err) {
      console.error("Validation failed:", err);
    }
  };

  const doPostcodeLookup = async () => {
    setLookupError('');
    if (!lookupPostcode || !lookupHouseNumber) return;

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://127.0.0.1:9000"}/store/address/postcode-lookup?postcode=${encodeURIComponent(lookupPostcode)}&house_number=${encodeURIComponent(lookupHouseNumber)}&country=${countryCode}`, {
        headers: { 'x-publishable-api-key': PUBLISHABLE_KEY }
      });
      const data = await res.json();
      
      if (data.valid && data.address) {
        setAddress1(data.address.address_1 || '');
        setCity(data.address.city || '');
        setProvince(data.address.province || '');
        setPostalCode(data.address.postal_code || '');
        setMetadata(data.metadata || {});
        setMode('manual');
      } else {
        setLookupError('Address not found. Please enter manually.');
      }
    } catch (err) {
      console.error("Lookup failed:", err);
      setLookupError('Lookup service unavailable.');
    }
  };

  const isNLBE = countryCode === 'nl' || countryCode === 'be';

  return (
    <div className="global-address-form" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      
      <div>
        <label style={{ display: 'block', marginBottom: '8px', fontSize: '12px', fontWeight: 600 }}>EMAIL</label>
        <input required type="email" value={email} onChange={e => setEmail(e.target.value)} style={{ width: '100%', padding: '12px', border: '1px solid #ddd' }} placeholder="your@email.com" />
      </div>

      <div className="form-row">
        <div style={{ flex: 1 }}>
          <label style={{ display: 'block', marginBottom: '8px', fontSize: '12px', fontWeight: 600 }}>FIRST NAME</label>
          <input required type="text" value={firstName} onChange={e => setFirstName(e.target.value)} style={{ width: '100%', padding: '12px', border: '1px solid #ddd' }} />
        </div>
        <div style={{ flex: 1 }}>
          <label style={{ display: 'block', marginBottom: '8px', fontSize: '12px', fontWeight: 600 }}>LAST NAME</label>
          <input required type="text" value={lastName} onChange={e => setLastName(e.target.value)} style={{ width: '100%', padding: '12px', border: '1px solid #ddd' }} />
        </div>
      </div>

      <div>
        <label style={{ display: 'block', marginBottom: '8px', fontSize: '12px', fontWeight: 600 }}>COUNTRY</label>
        <select value={countryCode} onChange={e => setCountryCode(e.target.value)} style={{ width: '100%', padding: '12px', border: '1px solid #ddd', background: '#fff' }}>
          {COUNTRIES.map(c => <option key={c.code} value={c.code}>{c.name}</option>)}
          <option value="other">Other</option>
        </select>
      </div>

      {mode === 'search' ? (
        <div style={{ background: '#f9f9f9', padding: '16px', border: '1px solid #eee' }}>
          <h4 style={{ margin: '0 0 16px 0', fontSize: '14px' }}>Find Your Address</h4>
          
          {isNLBE ? (
            <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-end' }}>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '12px' }}>POSTCODE</label>
                <input type="text" placeholder="1012AB" value={lookupPostcode} onChange={e => setLookupPostcode(e.target.value)} style={{ width: '100%', padding: '12px', border: '1px solid #ddd' }} />
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '12px' }}>HOUSE NO.</label>
                <input type="text" placeholder="10" value={lookupHouseNumber} onChange={e => setLookupHouseNumber(e.target.value)} style={{ width: '100%', padding: '12px', border: '1px solid #ddd' }} />
              </div>
              <button type="button" onClick={doPostcodeLookup} style={{ padding: '12px 24px', background: 'var(--black)', color: 'var(--white)', border: 'none', cursor: 'pointer', fontWeight: 600 }}>
                FIND
              </button>
            </div>
          ) : (
            <div style={{ position: 'relative' }}>
              <input 
                type="text" 
                placeholder="Start typing your street address..." 
                value={query} 
                onChange={e => setQuery(e.target.value)} 
                style={{ width: '100%', padding: '12px', border: '1px solid #ddd' }} 
              />
              {loadingSuggestions && <div style={{ position: 'absolute', right: '12px', top: '12px', fontSize: '12px', color: '#888' }}>Loading...</div>}
              
              {showSuggestions && suggestions.length > 0 && (
                <ul style={{ position: 'absolute', top: '100%', left: 0, right: 0, background: '#fff', border: '1px solid #ddd', zIndex: 10, margin: 0, padding: 0, listStyle: 'none', maxHeight: '200px', overflowY: 'auto', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
                  {suggestions.map(s => (
                    <li 
                      key={s.place_id} 
                      onClick={() => selectSuggestion(s.place_id, s.description)}
                      style={{ padding: '12px', borderBottom: '1px solid #eee', cursor: 'pointer', fontSize: '14px' }}
                    >
                      {s.description}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}

          {lookupError && <p style={{ color: 'var(--red)', fontSize: '12px', marginTop: '8px' }}>{lookupError}</p>}

          <div style={{ marginTop: '16px', textAlign: 'center' }}>
            <button type="button" onClick={() => setMode('manual')} style={{ background: 'none', border: 'none', textDecoration: 'underline', color: 'var(--mid)', cursor: 'pointer', fontSize: '13px' }}>
              Enter address manually instead
            </button>
          </div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', background: '#fafafa', padding: '16px', border: '1px solid #eee' }}>
          
          {metadata?.address_verified && (
            <div style={{ padding: '8px', background: '#e6ffed', color: '#1a7f37', fontSize: '12px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
              Address verified successfully
            </div>
          )}

          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '12px', fontWeight: 600 }}>ADDRESS LINE 1</label>
            <input required type="text" value={address1} onChange={e => setAddress1(e.target.value)} style={{ width: '100%', padding: '12px', border: '1px solid #ddd' }} />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '12px', fontWeight: 600 }}>ADDRESS LINE 2 (OPTIONAL)</label>
            <input type="text" value={address2} onChange={e => setAddress2(e.target.value)} style={{ width: '100%', padding: '12px', border: '1px solid #ddd' }} />
          </div>

          <div className="form-row">
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '12px', fontWeight: 600 }}>CITY</label>
              <input required type="text" value={city} onChange={e => setCity(e.target.value)} style={{ width: '100%', padding: '12px', border: '1px solid #ddd' }} />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '12px', fontWeight: 600 }}>STATE / PROVINCE</label>
              <input type="text" value={province} onChange={e => setProvince(e.target.value)} style={{ width: '100%', padding: '12px', border: '1px solid #ddd' }} />
            </div>
          </div>

          <div className="form-row">
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '12px', fontWeight: 600 }}>ZIP / POSTAL CODE</label>
              <input required type="text" value={postalCode} onChange={e => setPostalCode(e.target.value)} style={{ width: '100%', padding: '12px', border: '1px solid #ddd' }} />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '12px', fontWeight: 600 }}>COMPANY (OPTIONAL)</label>
              <input type="text" value={company} onChange={e => setCompany(e.target.value)} style={{ width: '100%', padding: '12px', border: '1px solid #ddd' }} />
            </div>
          </div>

          <div style={{ marginTop: '8px', textAlign: 'center' }}>
            <button type="button" onClick={() => { setMode('search'); setMetadata({}); }} style={{ background: 'none', border: 'none', textDecoration: 'underline', color: 'var(--mid)', cursor: 'pointer', fontSize: '13px' }}>
              Search address again
            </button>
          </div>
        </div>
      )}

      <div>
        <label style={{ display: 'block', marginBottom: '8px', fontSize: '12px', fontWeight: 600 }}>PHONE (OPTIONAL)</label>
        <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} style={{ width: '100%', padding: '12px', border: '1px solid #ddd' }} />
      </div>

      <div style={{ display: 'flex', gap: '16px', marginTop: '16px' }}>
        <button 
          type="button"
          onClick={onSubmit}
          disabled={submitting || mode === 'search'}
          style={{ flex: 1, padding: '16px', background: 'var(--black)', color: 'var(--white)', border: 'none', fontWeight: 700, cursor: (submitting || mode === 'search') ? 'not-allowed' : 'pointer', opacity: mode === 'search' ? 0.5 : 1 }}
        >
          {submitting ? 'SAVING...' : submitLabel}
        </button>
      </div>
    </div>
  );
}

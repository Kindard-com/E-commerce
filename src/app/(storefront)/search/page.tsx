"use client";

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useStore } from '@/storefront/lib/StoreContext';
import Link from 'next/link';

function SearchResults() {
  const searchParams = useSearchParams();
  const q = searchParams.get('q') || '';
  const { user } = useStore();
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true);
      const headers: Record<string, string> = {};
      if (user) {
        headers['Authorization'] = `Bearer ${user.uid}`;
      }

      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`, { headers });
        const data = await res.json();
        setResults(data.results || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    // Slight debounce for UX
    const timer = setTimeout(fetchResults, 300);
    return () => clearTimeout(timer);
  }, [q, user]);

  return (
    <div style={{ padding: '48px 28px', minHeight: '600px' }}>
      <h2 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 'clamp(32px, 8vw, 48px)', textTransform: 'uppercase', marginBottom: '8px' }}>
        Search Results
      </h2>

      <form action="/search" style={{ display: 'flex', gap: '8px', marginBottom: '32px', maxWidth: '400px' }}>
        <input 
          type="text" 
          name="q" 
          defaultValue={q} 
          placeholder="Search products..." 
          style={{ flex: 1, padding: '12px 16px', border: '1.5px solid var(--black)', fontFamily: "'Barlow Condensed', sans-serif", fontSize: '16px', outline: 'none' }} 
        />
        <button type="submit" className="btn-primary" style={{ padding: '0 20px' }}>
          Search
        </button>
      </form>

      {q && (
        <p style={{ color: 'var(--mid)', marginBottom: '32px' }}>
          Showing results for "{q}"
        </p>
      )}

      {loading ? (
        <p>Loading...</p>
      ) : results.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '64px', border: '1px dashed var(--black)' }}>
          <h3 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '24px', textTransform: 'uppercase', marginBottom: '16px' }}>No results found</h3>
          <p style={{ color: 'var(--mid)', marginBottom: '24px' }}>Try adjusting your search terms or check out our popular items below.</p>
          <Link href="/new-arrivals" className="btn-primary" style={{ display: 'inline-flex' }}>Browse New Arrivals</Link>
        </div>
      ) : (
        <div className="product-grid" style={{ borderTop: '1.5px solid var(--black)', borderLeft: '1.5px solid var(--black)' }}>
          {results.map((product) => (
            <Link href={`/${product.category}`} key={product.id} className="product-card" style={{ textDecoration: 'none', color: 'inherit' }}>
              <div className="product-img">
                <img src={`/img/${product.id}.svg`} alt={product.name} style={{ width: '80%', height: '80%', objectFit: 'contain' }} onError={(e) => { e.currentTarget.style.display = 'none'; }} />
              </div>
              <div className="product-info">
                <div className="product-brand">{product.brand || 'KINDARD'}</div>
                <div className="product-name">{product.name}</div>
                <div className="product-price">€{product.price.toFixed(2)}</div>
                {product.score > 0 && <div style={{ fontSize: '10px', color: 'var(--mid)', marginTop: '4px' }}>Algorithm Match Score: {product.score}</div>}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div style={{ padding: '48px 28px' }}>Loading search engine...</div>}>
      <SearchResults />
    </Suspense>
  );
}

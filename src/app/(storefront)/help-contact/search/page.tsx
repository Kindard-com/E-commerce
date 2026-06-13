import { getPayload } from 'payload';
import configPromise from '@payload-config';
import Link from 'next/link';
import { Search, ArrowLeft } from 'lucide-react';
import React from 'react';

export default async function HelpSearchPage(props: { searchParams: Promise<{ q?: string }> }) {
  const searchParams = await props.searchParams;
  const q = searchParams?.q || '';
  
  let articles: any[] = [];
  
  if (q) {
    try {
      const payload = await getPayload({ config: configPromise });
      const articlesRes = await payload.find({
        collection: 'help-articles',
        where: {
          or: [
            { title: { contains: q } }
          ]
        }
      });
      articles = articlesRes.docs || [];
    } catch (err) {
      console.error("Payload search error", err);
    }
  }

  return (
    <div style={{ backgroundColor: '#fafafa', minHeight: '100vh', paddingBottom: '100px' }}>
      <div style={{ backgroundColor: '#ffffff', borderBottom: '1px solid #eee', padding: '24px 20px' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Link href="/help-contact" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', textDecoration: 'none', color: 'var(--mid)', fontSize: '14px', fontWeight: 500 }}>
            <ArrowLeft size={16} /> Back to Help Center
          </Link>
        </div>
      </div>

      <div style={{ maxWidth: '800px', margin: '48px auto 0', padding: '0 20px' }}>
        <h1 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 'clamp(32px, 8vw, 48px)', textTransform: 'uppercase', marginBottom: '8px' }}>
          Help Center Search
        </h1>
        
        <form action="/help-contact/search" style={{
            display: 'flex',
            alignItems: 'center',
            backgroundColor: '#ffffff',
            borderRadius: '50px',
            padding: '8px 8px 8px 24px',
            boxShadow: '0 8px 24px rgba(0,0,0,0.05)',
            marginBottom: '48px',
            position: 'relative'
          }}>
            <Search color="#9ba3af" size={20} />
            <input 
              type="text" 
              name="q"
              defaultValue={q}
              placeholder="Search for sizing, shipping, returns..."
              style={{
                border: 'none',
                outline: 'none',
                flex: 1,
                padding: '12px 16px',
                fontSize: '16px',
                color: '#333'
              }}
            />
            <button type="submit" style={{
              backgroundColor: '#3b5af2',
              color: '#ffffff',
              border: 'none',
              borderRadius: '40px',
              padding: '12px 32px',
              fontWeight: 600,
              fontSize: '15px',
              cursor: 'pointer'
            }}>
              Search
            </button>
        </form>

        {q && (
          <p style={{ color: 'var(--mid)', marginBottom: '32px' }}>
            Showing help articles for "{q}"
          </p>
        )}

        {q && articles.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '64px', backgroundColor: '#ffffff', borderRadius: '16px', border: '1px dashed #ccc' }}>
            <h3 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '24px', textTransform: 'uppercase', marginBottom: '16px' }}>No articles found</h3>
            <p style={{ color: 'var(--mid)', marginBottom: '24px' }}>We couldn't find any help articles matching your search.</p>
            <Link href="/help-contact" className="btn-primary" style={{ display: 'inline-flex', padding: '12px 24px', backgroundColor: '#111', color: '#fff', textDecoration: 'none', borderRadius: '4px', fontWeight: 600 }}>
              Browse Help Topics
            </Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {articles.map((article: any) => (
              <Link href={`/help-contact/blogs/${article.slug || article.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`} key={article.id} style={{ 
                textDecoration: 'none', 
                color: 'inherit', 
                padding: '24px', 
                backgroundColor: '#ffffff', 
                borderRadius: '12px', 
                boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
                transition: 'transform 0.2s, box-shadow 0.2s',
                display: 'block'
              }} className="help-card">
                <h4 style={{ margin: '0 0 8px 0', fontSize: '20px', color: '#111', fontWeight: 600 }}>{article.title}</h4>
                <p style={{ margin: 0, color: '#3b5af2', fontSize: '14px', fontWeight: 500 }}>Read Article &rarr;</p>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

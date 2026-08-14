import { NextResponse } from 'next/server';
import { neonDb } from '@/storefront/lib/db';
import { fallbackProducts, Product } from '@/storefront/lib/products';
import { loadMedusaProducts } from '@/storefront/lib/load-products';
import crypto from 'crypto';
import { getPayload } from 'payload';
import configPromise from '@payload-config';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q')?.toLowerCase() || '';
  const authHeader = request.headers.get('authorization');
  
  const { products: loadedProducts } = await loadMedusaProducts(100, q || undefined);
  let allProducts: Product[] = loadedProducts;
  if (allProducts.length === 0 && !q) allProducts = fallbackProducts;
  let allArticles: any[] = [];

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
    allArticles = articlesRes.docs || [];
  } catch (err) {
    console.error("Payload search error", err);
  }

  // Basic filtering first
  let results = allProducts.filter(p => 
    p.name.toLowerCase().includes(q) || 
    p.category.toLowerCase().includes(q)
  ).map(p => ({ ...p, score: 0 })); // Initialize with base score

  // If no auth, return basic results + anonymous log
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    results.forEach(r => r.score += 50); // Base match
    
    // Attempt anonymous log
    try {
      await neonDb`
        INSERT INTO search_logs (id, session_id, search_query, result_count, is_logged_in) VALUES (${crypto.randomUUID()}, ${crypto.randomUUID()}, ${q}, ${results.length}, 0)
      `;
    } catch(e) {}

    results.sort((a, b) => b.score - a.score);
    return NextResponse.json({ results, articles: allArticles });
  }

  // Logged-in scoring
  const uid = authHeader.split('Bearer ')[1];
  
  try {
    const userRes = await neonDb`
      SELECT customer_number FROM users WHERE firebase_uid = ${uid}
    `;

    if (userRes.length > 0) {
      const customerNumber = userRes[0].customer_number;

      // Fetch preferences
      const prefRes = await neonDb`
        SELECT * FROM customer_search_preferences WHERE customer_number = ${customerNumber}
      `;

      // Fetch wishlists
      const wishRes = await neonDb`
        SELECT product_id FROM wishlists WHERE customer_number = ${customerNumber}
      `;
      const wishIds = new Set(wishRes.map(r => r.product_id));

      const prefs = prefRes[0] || {};
      const prefCategories = prefs.preferred_categories ? String(prefs.preferred_categories).split(',') : [];

      results.forEach(r => {
        r.score += 50; // Base match

        // Wishlist boost
        if (wishIds.has(r.id)) r.score += 10;
        
        // Category preference boost
        if (prefCategories.includes(r.category)) r.score += 15;

        // In stock
        r.score += 10;
        
        // Popular product (mock condition)
        if (r.price > 50) r.score += 5; 
      });

      // Log the search
      await neonDb`
        INSERT INTO search_logs (id, customer_number, firebase_uid, session_id, search_query, result_count, is_logged_in)
        VALUES (${crypto.randomUUID()}, ${customerNumber}, ${uid}, ${crypto.randomUUID()}, ${q}, ${results.length}, 1)
      `;
    }
  } catch (error) {
    console.error(error);
  }

  results.sort((a, b) => b.score - a.score);
  return NextResponse.json({ results, articles: allArticles });
}

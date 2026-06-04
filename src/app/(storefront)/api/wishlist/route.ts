import { NextResponse } from 'next/server';
import { neonDb } from '@/storefront/lib/db';
import crypto from 'crypto';

// The client sends the Medusa customer ID (user.id) as the Bearer token.
function getCustomerId(authHeader: string | null): string | null {
  if (!authHeader) return null;
  const id = authHeader.split('Bearer ')[1]?.trim();
  if (!id || id.length < 3) return null;
  return id;
}

export async function GET(request: Request) {
  const customerId = getCustomerId(request.headers.get('authorization'));
  if (!customerId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const rows = await neonDb`
      SELECT * FROM wishlists 
      WHERE customer_number = ${customerId} 
      ORDER BY created_at DESC;
    `;
    return NextResponse.json({ wishlist: rows });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const customerId = getCustomerId(request.headers.get('authorization'));
  if (!customerId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { product_id, size, color } = await request.json();
    if (!product_id) return NextResponse.json({ error: 'product_id required' }, { status: 400 });

    // Prevent duplicates for same product
    const existing = await neonDb`
      SELECT id FROM wishlists 
      WHERE customer_number = ${customerId} AND product_id = ${product_id};
    `;
    if (existing.length > 0) {
      return NextResponse.json({ success: true, id: existing[0].id, duplicate: true });
    }

    const id = crypto.randomUUID();
    await neonDb`
      INSERT INTO wishlists (id, customer_number, product_id, size, color) 
      VALUES (${id}, ${customerId}, ${product_id}, ${size || null}, ${color || null});
    `;

    return NextResponse.json({ success: true, id });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const customerId = getCustomerId(request.headers.get('authorization'));
  if (!customerId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { id } = await request.json();
    // Only allow deleting own wishlist items
    await neonDb`DELETE FROM wishlists WHERE id = ${id} AND customer_number = ${customerId};`;
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

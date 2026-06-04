import { NextResponse } from 'next/server';
import { neonDb } from '@/storefront/lib/db';
import crypto from 'crypto';

export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization');
  if (!authHeader) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const uid = authHeader.split('Bearer ')[1];

  try {
    const userRes = await neonDb`SELECT customer_number FROM users WHERE firebase_uid = ${uid}`;
    if (userRes.length === 0) return NextResponse.json({ error: 'User not found' }, { status: 404 });
    const customerNumber = userRes[0].customer_number;

    const rows = await neonDb`SELECT * FROM customer_payment_methods WHERE customer_number = ${customerNumber} ORDER BY created_at DESC;`;
    return NextResponse.json({ paymentMethods: rows });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { firebase_uid, provider, last4, secure_token, expiry } = await request.json();

    const userRes = await neonDb`SELECT customer_number FROM users WHERE firebase_uid = ${firebase_uid}`;

    if (userRes.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const customerNumber = userRes[0].customer_number;
    const id = crypto.randomUUID();

    await neonDb`
      INSERT INTO customer_payment_methods (id, customer_number, provider, secure_token, last4, expiry)
      VALUES (${id}, ${customerNumber}, ${provider}, ${secure_token || 'tok_fake'}, ${last4 || 'XXXX'}, ${expiry || '12/99'});
    `;

    return NextResponse.json({ success: true, id });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}


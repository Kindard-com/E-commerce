import { NextResponse } from 'next/server';
import { neonDb } from '@/storefront/lib/db';

export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const uid = authHeader.split('Bearer ')[1];

  try {
    const userRes = await neonDb`
      SELECT customer_number FROM users WHERE firebase_uid = ${uid}
    `;

    if (userRes.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ customerNumber: userRes[0].customer_number });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

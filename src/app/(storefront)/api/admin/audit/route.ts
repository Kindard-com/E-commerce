import { NextResponse } from 'next/server';
import { neonDb } from '@/storefront/lib/db';
import { verifyAdminSessionToken } from '@/storefront/lib/adminAuth';
import { cookies } from 'next/headers';

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get('kindard_admin_session')?.value;
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  
  const admin = verifyAdminSessionToken(token);
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const res = await neonDb`SELECT * FROM settings_audit_logs ORDER BY created_at DESC LIMIT 100`;
    return NextResponse.json({ logs: res });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

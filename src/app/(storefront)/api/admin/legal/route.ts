import { NextResponse } from 'next/server';
import { neonDb } from '@/storefront/lib/db';
import { verifyAdminSessionToken } from '@/storefront/lib/adminAuth';
import { cookies } from 'next/headers';
import crypto from 'crypto';

export async function GET() {
  try {
    const res = await neonDb`SELECT * FROM legal_pages`;
    return NextResponse.json({ pages: res });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const cookieStore = await cookies();
  const token = cookieStore.get('kindard_admin_session')?.value;
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  
  const admin = verifyAdminSessionToken(token);
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  if (admin.role !== 'owner' && admin.role !== 'admin' && admin.role !== 'editor') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  try {
    const { page_type, title, slug, content, status } = await request.json();

    const oldRes = await neonDb`
      SELECT version FROM legal_pages WHERE page_type = ${page_type}
    `;

    if (oldRes.length > 0) {
      await neonDb`
        UPDATE legal_pages SET title = ${title}, slug = ${slug}, content = ${content}, status = ${status}, version = version + 1, updated_by_admin_number = ${admin.sub}, updated_at = CURRENT_TIMESTAMP WHERE page_type = ${page_type}
      `;
    } else {
      await neonDb`
        INSERT INTO legal_pages (id, page_type, title, slug, content, status, updated_by_admin_number) VALUES (${crypto.randomUUID()}, ${page_type}, ${title}, ${slug}, ${content}, ${status}, ${admin.sub})
      `;
    }

    // Audit log
    await neonDb`
      INSERT INTO settings_audit_logs (id, admin_number, action, setting_key, old_value, new_value) VALUES (${crypto.randomUUID()}, ${admin.sub}, 'UPDATE_LEGAL_PAGE', ${page_type}, ${oldRes.length > 0 ? `v${oldRes[0].version}` : 'none'}, 'updated')
    `;

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

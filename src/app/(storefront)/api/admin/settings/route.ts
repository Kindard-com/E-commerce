import { NextResponse } from 'next/server';
import { neonDb } from '@/storefront/lib/db';
import { verifyAdminSessionToken } from '@/storefront/lib/adminAuth';
import { cookies } from 'next/headers';
import crypto from 'crypto';

async function getAdmin() {
  const cookieStore = await cookies();
  const token = cookieStore.get('kindard_admin_session')?.value;
  if (!token) return null;
  return verifyAdminSessionToken(token);
}

export async function GET() {
  const admin = await getAdmin();
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const res = await neonDb`SELECT * FROM site_settings`;
    return NextResponse.json({ settings: res });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const admin = await getAdmin();
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  if (admin.role !== 'owner' && admin.role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden. Owner or admin role required.' }, { status: 403 });
  }

  try {
    const { updates } = await request.json(); 

    for (const update of updates) {
      const oldRes = await neonDb`
        SELECT setting_value FROM site_settings WHERE setting_key = ${update.setting_key}
      `;
      const oldValue = oldRes.length > 0 ? String(oldRes[0].setting_value) : null;

      if (oldRes.length > 0) {
        await neonDb`
          UPDATE site_settings SET setting_value = ${update.setting_value}, updated_by_admin_number = ${admin.sub}, updated_at = CURRENT_TIMESTAMP WHERE setting_key = ${update.setting_key}
        `;
      } else {
        await neonDb`
          INSERT INTO site_settings (id, setting_key, setting_value, setting_type, category, updated_by_admin_number) VALUES (${crypto.randomUUID()}, ${update.setting_key}, ${update.setting_value}, ${update.setting_type || 'text'}, ${update.category || 'general'}, ${admin.sub})
        `;
      }

      await neonDb`
        INSERT INTO settings_audit_logs (id, admin_number, action, setting_key, old_value, new_value) VALUES (${crypto.randomUUID()}, ${admin.sub}, 'UPDATE_SETTING', ${update.setting_key}, ${oldValue}, ${update.setting_value})
      `;
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

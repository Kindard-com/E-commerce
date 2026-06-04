import { NextResponse } from 'next/server';
import { neonDb } from '@/storefront/lib/db';
import { verifyPassword, createAdminSessionToken } from '@/storefront/lib/adminAuth';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password required' }, { status: 400 });
    }

    if (!email.endsWith('@id.kindard.com')) {
      return NextResponse.json({ error: 'Unauthorized email domain' }, { status: 403 });
    }

    const res = await neonDb`
      SELECT * FROM admin_users WHERE email = ${email}
    `;

    if (res.length === 0) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const admin = res[0];

    if (admin.status !== 'active') {
      return NextResponse.json({ error: 'Admin account inactive' }, { status: 403 });
    }

    const isValid = verifyPassword(password, String(admin.password_hash));
    if (!isValid) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    // Update last login
    await neonDb`
      UPDATE admin_users SET last_login_at = CURRENT_TIMESTAMP WHERE id = ${admin.id}
    `;

    // Create stateless token
    const token = createAdminSessionToken(String(admin.admin_number), email, String(admin.role));

    const response = NextResponse.json({ success: true, redirect: '/portal/admin-settings' });
    
    // Set cookie
    response.cookies.set({
      name: 'kindard_admin_session',
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24, // 24 hours
      path: '/'
    });

    return response;

  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

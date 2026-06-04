import { NextResponse } from 'next/server';
import { verifyAdminSessionToken } from '@/storefront/lib/adminAuth';
import { cookies } from 'next/headers';

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get('kindard_admin_session')?.value;
  
  if (!token) {
    return NextResponse.json({ isAdmin: false });
  }

  const decoded = verifyAdminSessionToken(token);
  if (!decoded) {
    return NextResponse.json({ isAdmin: false });
  }

  return NextResponse.json({ 
    isAdmin: true, 
    adminNumber: decoded.sub,
    email: decoded.email,
    role: decoded.role 
  });
}

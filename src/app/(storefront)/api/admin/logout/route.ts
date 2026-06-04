import { NextResponse } from 'next/server';

export async function POST() {
  const response = NextResponse.json({ success: true, redirect: '/admin-login' });
  response.cookies.set({
    name: 'kindard_admin_session',
    value: '',
    httpOnly: true,
    expires: new Date(0),
    path: '/'
  });
  return response;
}

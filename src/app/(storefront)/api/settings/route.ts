import { NextResponse } from 'next/server';
import { neonDb } from '@/storefront/lib/db';

export async function GET() {
  try {
    const res = await neonDb`SELECT setting_key, setting_value FROM site_settings`;
    const settings: Record<string, string> = {};
    for (const row of res) {
      settings[String(row.setting_key)] = String(row.setting_value);
    }
    return NextResponse.json({ settings });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

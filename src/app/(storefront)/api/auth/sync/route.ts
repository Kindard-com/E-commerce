import { NextResponse } from 'next/server';
import { neonDb } from '@/storefront/lib/db';
import crypto from 'crypto';

function generateCustomerNumber() {
  const randomStr = crypto.randomBytes(3).toString('hex').toUpperCase(); // 6 chars
  return `KIND-${randomStr}-001`;
}

export async function POST(request: Request) {
  try {
    const { uid, email, name, provider, providerUid, photoURL } = await request.json();

    if (!uid || !email) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Check if user already exists
    const existingUser = await neonDb`
      SELECT customer_number FROM users WHERE firebase_uid = ${uid}
    `;

    let customerNumber = '';

    if (existingUser.length > 0) {
      // User exists - update activity log & photo
      customerNumber = existingUser[0].customer_number;

      await neonDb`
        UPDATE users 
        SET profile_image_url = ${photoURL || null}, login_provider = ${provider || 'email'} 
        WHERE customer_number = ${customerNumber}
      `;

      // Log activity
      await neonDb`
        UPDATE activity_logs 
        SET last_login = CURRENT_TIMESTAMP, login_method = ${provider || 'email'} 
        WHERE customer_number = ${customerNumber}
      `;

      return NextResponse.json({ success: true, customerNumber, isNew: false });
    }

    // New user flow
    customerNumber = generateCustomerNumber();
    const cleanProvider = provider || 'email';

    // 1. Create User
    await neonDb`
      INSERT INTO users (customer_number, firebase_uid, email, login_provider, provider_user_id, profile_image_url) 
      VALUES (${customerNumber}, ${uid}, ${email}, ${cleanProvider}, ${providerUid || null}, ${photoURL || null})
    `;

    // 2. Create Customer Profile
    await neonDb`
      INSERT INTO customer_profiles (customer_number, full_name) VALUES (${customerNumber}, ${name || ''})
    `;

    // 3. Create Account Settings
    await neonDb`
      INSERT INTO account_settings (customer_number) VALUES (${customerNumber})
    `;

    // 4. Create Activity Log
    const logId = crypto.randomUUID();
    await neonDb`
      INSERT INTO activity_logs (id, customer_number, login_method) VALUES (${logId}, ${customerNumber}, ${cleanProvider})
    `;

    return NextResponse.json({ success: true, customerNumber, isNew: true });
  } catch (error: any) {
    console.error('Error syncing user to Neon:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

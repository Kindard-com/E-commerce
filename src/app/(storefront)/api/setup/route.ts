import { NextResponse } from 'next/server';
import { neonDb } from '@/storefront/lib/db';
import crypto from 'crypto';

export async function GET() {
  try {
    const settings = [
      { key: 'marketing_banner_text', value: 'NEW ARRIVALS: MINI EXPLORER COLLECTION | FREE SHIPPING OVER $150 | PLAY IN STYLE | MEMBERS GET EARLY ACCESS' },
      { key: 'footer_description', value: 'Premium kidswear. Unmatched comfort, playful energy.\\nMade for the little ones who start trends. Since 2019.' },
      { key: 'footer_copyright', value: '© 2026 Kindard Kids. All rights reserved.' }
    ];

    for (const s of settings) {
      await neonDb`
        INSERT INTO site_settings (id, setting_key, setting_value) 
        VALUES (${crypto.randomUUID()}, ${s.key}, ${s.value})
        ON CONFLICT (setting_key) DO UPDATE SET setting_value = ${s.value}
      `;
    }

    const legal = [
      { type: 'privacy_policy', title: 'Privacy Policy', content: '# Kindard Kids Privacy Policy\n\nAt Kindard Kids, the privacy and security of you and your little ones is our top priority. We use industry-leading security to ensure your data is safe.\n\n## 1. Information We Collect\nWe collect information to help us deliver the best premium kidswear shopping experience. This includes basic account info, shipping details, and shopping preferences.\n\n## 2. How We Use It\nYour information is used strictly to process your orders, provide customer support, and, with your consent, update you on exciting new kids drops.' },
      { type: 'terms_of_service', title: 'Terms of Service', content: '# Kindard Kids Terms of Service\n\nWelcome to Kindard Kids. By using our website, you agree to these terms. Our premium streetwear for children is designed for play, durability, and style.\n\n## 1. Purchases\nAll orders are subject to availability. We reserve the right to cancel any order if an item is out of stock.\n\n## 2. Returns\nWe accept returns on unworn, unwashed children\'s clothing with original tags attached within 30 days of purchase.' }
    ];

    for (const l of legal) {
      await neonDb`
        INSERT INTO legal_pages (id, page_type, title, slug, content) 
        VALUES (${crypto.randomUUID()}, ${l.type}, ${l.title}, ${l.type}, ${l.content})
        ON CONFLICT (page_type) DO UPDATE SET content = ${l.content}
      `;
    }
    
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

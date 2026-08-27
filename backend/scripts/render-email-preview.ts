import { config } from 'dotenv'
import { render } from '@react-email/render'
import React from 'react'
import fs from 'fs'
import path from 'path'
import KindardOrderConfirmationEmail from '../src/emails/KindardOrderConfirmationEmail'

config()

async function main() {
  const frontendUrl = process.env.FRONTEND_URL || 'https://kindard.com'
  const html = await render(
    React.createElement(KindardOrderConfirmationEmail, {
      customerName: 'Erickson Holding',
      orderNumber: '#KND-TEST-88421',
      logoUrl: `${frontendUrl}/img/kindard_icon.png`,
      heroImageUrl: `${frontendUrl}/img/movement_clothing.png`,
      trackingUrl: `${frontendUrl}/orders/test-88421`,
      shopUrl: `${frontendUrl}/new-arrivals`,
      supportEmail: 'orders@kindard.com',
      items: [
        { name: 'Classic Logo Tee', meta: 'Qty: 1 · Size 3-4Y · Blue', price: '€35,00' },
        { name: 'Mini Explorer Hoodie', meta: 'Qty: 1 · Size 3-4Y · Cream', price: '€65,00' },
        { name: 'Playtime Sweat Shorts', meta: 'Qty: 1 · Size 3-4Y · Navy', price: '€30,00' },
      ],
      subtotal: '€130,00',
      shipping: 'Free',
      total: '€130,00',
      shipTo: {
        name: 'Erickson Holding',
        lines: ['Test Street 1', '1000 AB Amsterdam', 'Netherlands'],
      },
      deliveryMethod: 'Standard Shipping',
      deliveryEstimate: 'Est. 2–4 business days',
    })
  )

  const outDir = '/opt/cursor/artifacts'
  fs.mkdirSync(outDir, { recursive: true })
  const outFile = path.join(outDir, 'kindard-order-email-preview.html')
  fs.writeFileSync(outFile, html)
  fs.mkdirSync('/workspace/docs/proof', { recursive: true })
  fs.writeFileSync('/workspace/docs/proof/kindard-order-email-preview.html', html)
  console.log(`Wrote ${outFile} (${html.length} bytes)`)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})

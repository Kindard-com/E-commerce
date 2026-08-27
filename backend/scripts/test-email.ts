import { config } from 'dotenv'
import { render } from '@react-email/render'
import React from 'react'
import KindardOrderConfirmationEmail from '../src/emails/KindardOrderConfirmationEmail'
import { sendMail } from '../src/lib/send-mail'
import nodemailer from 'nodemailer'

config()

async function verifySmtp() {
  const host = process.env.SMTP_HOST
  const port = parseInt(process.env.SMTP_PORT || '587', 10)
  const user = process.env.SMTP_USER
  console.log(`[SMTP] Verifying ${user} @ ${host}:${port} ...`)
  const transporter = nodemailer.createTransport({
    host,
    port,
    secure: process.env.SMTP_SECURE === 'true',
    requireTLS: true,
    auth: {
      user,
      pass: process.env.SMTP_PASS,
    },
  })
  await transporter.verify()
  console.log('[SMTP] Auth OK — server accepted login')
}

async function testEmail() {
  const to = process.argv.slice(2).find((arg) => arg.includes('@')) || process.env.SMTP_USER || 'test@example.com'
  console.log(`[Test] Sending Kindard order confirmation to: ${to}`)

  const frontendUrl = process.env.FRONTEND_URL || 'https://kindard.com'
  const orderNumber = '#KND-TEST-88421'

  await verifySmtp()

  console.log('[Test] Rendering your KindardOrderConfirmationEmail template...')
  const html = await render(
    React.createElement(KindardOrderConfirmationEmail, {
      customerName: 'Erickson Holding',
      orderNumber,
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

  console.log('[Test] Sending via Private Email SMTP...')
  const result = await sendMail({
    to,
    subject: `Your Kindard order confirmation (${orderNumber})`,
    html,
  })

  if (result.success) {
    console.log(`[Test] SUCCESS messageId=${result.messageId}`)
    process.exit(0)
  }

  console.error(`[Test] FAILED: ${result.error}`)
  process.exit(1)
}

testEmail().catch((error) => {
  console.error('[Test] Unexpected error:', error instanceof Error ? error.message : error)
  process.exit(1)
})

import { config } from 'dotenv'
import { render } from '@react-email/render'
import React from 'react'
import KindardOrderConfirmationEmail from '../src/emails/KindardOrderConfirmationEmail'
import { sendMail } from '../src/lib/send-mail'

// Load environment variables from .env
config()

async function testEmail() {
  // Get destination email from args, fallback to SMTP_USER or a default
  const to = process.argv[2] || process.env.SMTP_USER || 'test@example.com'
  console.log(`[Test Script] Preparing to send test email to: ${to}`)

  const frontendUrl = process.env.FRONTEND_URL || 'https://kindard.com'

  try {
    console.log('[Test Script] Rendering React Email template...')
    const html = await render(
      React.createElement(KindardOrderConfirmationEmail, {
        customerName: "CLI Test User",
        orderNumber: "#TEST-CLI-001",
        logoUrl: `${frontendUrl}/img/kindard_icon.png`,
        heroImageUrl: `${frontendUrl}/img/movement_clothing.png`,
        trackingUrl: `${frontendUrl}/orders/test`,
        shopUrl: `${frontendUrl}/new-arrivals`,
        items: [
          { name: 'CLI Test Product', meta: 'Qty: 1', price: '€0.00' },
        ],
        subtotal: '€0.00',
        shipping: 'Free',
        total: '€0.00',
        shipTo: {
          name: 'CLI Test User',
          lines: ['Command Line Avenue 1', 'Terminal City'],
        },
      })
    )

    console.log('[Test Script] Attempting to send email via SMTP...')
    const result = await sendMail({
      to,
      subject: "Your Kindard order confirmation (CLI TEST)",
      html,
    })

    if (result.success) {
      console.log(`[Test Script] Success! Email sent with ID: ${result.messageId}`)
    } else {
      console.error(`[Test Script] Failure. Error: ${result.error}`)
    }
  } catch (error) {
    console.error(`[Test Script] Unexpected error:`, error)
  }
}

testEmail()

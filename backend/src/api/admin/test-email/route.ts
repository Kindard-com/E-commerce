import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { render } from "@react-email/render"
import React from 'react'
import KindardOrderConfirmationEmail from "../../../emails/KindardOrderConfirmationEmail"
import { sendMail } from "../../../lib/send-mail"

export async function POST(
  req: MedusaRequest,
  res: MedusaResponse
) {
  const { to } = req.body as { to?: string }

  if (!to || typeof to !== 'string') {
    return res.status(400).json({
      success: false,
      message: "Please provide a valid 'to' email address in the request body",
    })
  }

  const frontendUrl = process.env.FRONTEND_URL || 'https://kindard.com'

  try {
    const html = await render(
      React.createElement(KindardOrderConfirmationEmail, {
        customerName: "Test Customer",
        orderNumber: "#TEST-0001",
        logoUrl: `${frontendUrl}/img/kindard_icon.png`,
        heroImageUrl: `${frontendUrl}/img/movement_clothing.png`,
        trackingUrl: `${frontendUrl}/orders/test`,
        shopUrl: `${frontendUrl}/new-arrivals`,
        items: [
          { name: 'Kindard Premium Hoodie', meta: 'Qty: 1 · Size M', price: '€49.95' },
        ],
        subtotal: '€49.95',
        shipping: 'Free',
        total: '€49.95',
        shipTo: {
          name: 'Test Customer',
          lines: ['Test Street 123', '1000 AB Test City', 'Netherlands'],
        },
      })
    )

    const result = await sendMail({
      to,
      subject: "Your Kindard order confirmation (TEST)",
      html,
    })

    if (result.success) {
      return res.status(200).json({
        success: true,
        message: "Test email sent successfully",
        recipient: to,
      })
    } else {
      return res.status(500).json({
        success: false,
        message: "Failed to send test email",
        error: result.error,
      })
    }
  } catch (error) {
    console.error(`[Test Email API] Error rendering/sending test email:`, error)
    return res.status(500).json({
      success: false,
      message: "Internal server error while sending test email",
      error: error instanceof Error ? error.message : "Unknown error",
    })
  }
}

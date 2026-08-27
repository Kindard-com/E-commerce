import { type SubscriberConfig, type SubscriberArgs } from "@medusajs/medusa"
import { render } from "@react-email/render"
import React from 'react'
import KindardOrderConfirmationEmail from "../emails/KindardOrderConfirmationEmail"
import { sendMail } from "../lib/send-mail"
import { slackService } from "../lib/slack"
import { salesforceService } from "../lib/salesforce"

export default async function orderPlacedHandler({
  event: { data },
  container,
}: SubscriberArgs<{ id: string }>) {
  const query = container.resolve("query")
  
  let orderResult;
  try {
    const { data: orders } = await query.graph({
      entity: "order",
      fields: [
        "id",
        "display_id",
        "email",
        "total",
        "currency_code",
        "items.*",
        "shipping_address.*",
        "customer.*"
      ],
      filters: {
        id: data.id,
      },
    })
    orderResult = orders;
  } catch (error) {
    console.error(`[Order Subscriber] Failed to query order ${data.id}:`, error)
    return
  }

  const order = orderResult?.[0]
  
  if (!order) {
    console.warn(`[Order Subscriber] Order not found for ID: ${data.id}`)
    return
  }

  // Format currency
  const formatMoney = (amount: number, currencyCode: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currencyCode.toUpperCase(),
    }).format(amount)
  }

  const totalAmount = typeof order.total === 'number' ? order.total : parseFloat(order.total)
  
  // Format Address
  const addr = order.shipping_address
  let addressLines: string[] = []
  if (addr) {
    if (addr.address_1) addressLines.push(addr.address_1)
    if (addr.address_2) addressLines.push(addr.address_2)
    const cityLine = [addr.postal_code, addr.city].filter(Boolean).join(" ")
    if (cityLine) addressLines.push(cityLine)
    if (addr.country_code) addressLines.push(addr.country_code.toUpperCase())
  }

  const shipTo = addr ? {
    name: `${addr.first_name || ''} ${addr.last_name || ''}`.trim() || 'Customer',
    lines: addressLines.length > 0 ? addressLines : ['No address provided'],
  } : { name: 'Customer', lines: [] }

  const customerName = shipTo.name !== 'Customer' ? shipTo.name : (order.customer?.first_name || 'Customer')

  const items = order.items?.map((item: any) => ({
    name: item.product_title || item.title || 'Item',
    meta: `Qty: ${item.quantity} · ${item.variant_title || 'One Size'}`,
    price: formatMoney(typeof item.unit_price === 'number' ? item.unit_price : parseFloat(item.unit_price || 0), order.currency_code || 'EUR')
  })) || []

  const frontendUrl = process.env.FRONTEND_URL || 'https://kindard.com'

  try {
    const html = await render(
      React.createElement(KindardOrderConfirmationEmail, {
        customerName,
        orderNumber: `#${order.display_id || order.id.slice(0, 8)}`,
        logoUrl: `${frontendUrl}/img/kindard_icon.png`,
        heroImageUrl: `${frontendUrl}/img/movement_clothing.png`,
        trackingUrl: `${frontendUrl}/orders/${order.id}`,
        shopUrl: `${frontendUrl}/new-arrivals`,
        supportEmail: process.env.MAIL_REPLY_TO || 'orders@kindard.com',
        items,
        subtotal: formatMoney(totalAmount, order.currency_code || 'EUR'),
        shipping: 'Standard',
        total: formatMoney(totalAmount, order.currency_code || 'EUR'),
        shipTo,
        deliveryMethod: 'Standard Shipping',
        deliveryEstimate: 'Est. 2–4 business days',
      })
    )

    await sendMail({
      to: order.email,
      subject: `Your Kindard order confirmation (#${order.display_id || order.id.slice(0, 8)})`,
      html,
    })

    // Sync to external services
    await slackService.notifyOrder(order)
    await salesforceService.syncOrder(order)
  } catch (error) {
    console.error(`[Order Subscriber] Error rendering/sending email for order ${data.id}:`, error)
  }
}

export const config: SubscriberConfig = {
  event: "order.placed",
}

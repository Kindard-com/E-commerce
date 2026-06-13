export class SlackService {
  private webhookUrl: string | undefined

  constructor() {
    this.webhookUrl = process.env.SLACK_WEBHOOK_URL
  }

  async sendMessage(message: string, blocks?: any[]) {
    if (!this.webhookUrl) {
      console.warn('[SlackService] No SLACK_WEBHOOK_URL defined.')
      return
    }

    try {
      const payload = blocks ? { text: message, blocks } : { text: message }
      
      const response = await fetch(this.webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      if (!response.ok) {
        console.error('[SlackService] Slack API error:', await response.text())
      }
    } catch (error) {
      console.error('[SlackService] Failed to send message:', error)
    }
  }

  async notifyOrder(order: any) {
    const total = typeof order.total === 'number' ? order.total : parseFloat(order.total || 0)
    const formattedTotal = new Intl.NumberFormat('en-US', { style: 'currency', currency: order.currency_code || 'EUR' }).format(total)
    
    await this.sendMessage(`🛍️ New Order Placed! #${order.display_id}`, [
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: `*New Order Placed!*\n*ID:* #${order.display_id}\n*Customer Email:* ${order.email}\n*Total:* ${formattedTotal}`
        }
      }
    ])
  }

  async notifyCustomer(customer: any) {
    await this.sendMessage(`👤 New Customer Registered!`, [
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: `*New Customer!*\n*Name:* ${customer.first_name} ${customer.last_name}\n*Email:* ${customer.email}`
        }
      }
    ])
  }
}

export const slackService = new SlackService()

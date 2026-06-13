export class PayloadSlackService {
  private webhookUrl: string | undefined

  constructor() {
    this.webhookUrl = process.env.SLACK_WEBHOOK_URL
  }

  async sendMessage(message: string, blocks?: any[]) {
    if (!this.webhookUrl) {
      console.warn('[PayloadSlackService] No SLACK_WEBHOOK_URL defined.')
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
        console.error('[PayloadSlackService] Slack API error:', await response.text())
      }
    } catch (error) {
      console.error('[PayloadSlackService] Failed to send message:', error)
    }
  }

  async notifyDocumentUpdate(collection: string, doc: any) {
    if (collection === 'support-tickets') {
      await this.sendMessage(`🎫 New Support Ticket Received!`, [
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: `*New Support Ticket*\n*Subject:* ${doc.subject || 'N/A'}\n*Email:* ${doc.email || doc.customerEmail}\n*Message:* ${doc.message || 'N/A'}`
          }
        }
      ])
    } else if (collection === 'subscribers') {
      await this.sendMessage(`📬 New Newsletter Subscriber!`, [
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: `*New Subscriber*\n*Email:* ${doc.email}`
          }
        }
      ])
    } else {
      // Generic notification
      await this.sendMessage(`📄 Document updated in ${collection}: ID ${doc.id}`)
    }
  }
}

export const payloadSlackService = new PayloadSlackService()

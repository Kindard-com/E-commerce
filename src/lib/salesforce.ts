import jsforce from 'jsforce'

export class PayloadSalesforceService {
  private conn: jsforce.Connection | null = null

  constructor() {
    if (process.env.SF_USERNAME && process.env.SF_PASSWORD && process.env.SF_LOGIN_URL) {
      this.conn = new jsforce.Connection({
        loginUrl: process.env.SF_LOGIN_URL,
      })
    }
  }

  async connect() {
    if (!this.conn) return false
    try {
      await this.conn.login(process.env.SF_USERNAME!, process.env.SF_PASSWORD! + (process.env.SF_TOKEN || ''))
      return true
    } catch (err) {
      console.error('[PayloadSalesforceService] Connection failed:', err)
      return false
    }
  }

  async syncDocument(collection: string, doc: any) {
    if (!this.conn) return
    const connected = await this.connect()
    if (!connected) return

    try {
      if (collection === 'support-tickets') {
        const sfCase = {
          Subject: `Support Ticket: ${doc.subject || doc.id}`,
          Description: doc.message || 'No description provided.',
          Status: 'New',
          Origin: 'Web',
          SuppliedEmail: doc.email || doc.customerEmail
        }
        const result = await this.conn.sobject('Case').create(sfCase)
        console.log('[PayloadSalesforceService] Case synced:', result)
      } else if (collection === 'subscribers') {
        const sfLead = {
          LastName: doc.name || 'Subscriber',
          Email: doc.email,
          Company: 'Individual'
        }
        const result = await this.conn.sobject('Lead').create(sfLead)
        console.log('[PayloadSalesforceService] Lead synced:', result)
      } else {
        console.log(`[PayloadSalesforceService] No mapping for collection ${collection}`)
      }
    } catch (err) {
      console.error(`[PayloadSalesforceService] Sync failed for ${collection}:`, err)
    }
  }
}

export const payloadSalesforceService = new PayloadSalesforceService()

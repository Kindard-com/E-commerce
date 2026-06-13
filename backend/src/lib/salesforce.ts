import jsforce from 'jsforce'

export class SalesforceService {
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
      console.error('[SalesforceService] Connection failed:', err)
      return false
    }
  }

  async syncOrder(order: any) {
    if (!this.conn) return
    const connected = await this.connect()
    if (!connected) return

    try {
      // Create Order in Salesforce
      const sfOrder = {
        Status: 'Draft',
        EffectiveDate: new Date().toISOString().split('T')[0],
        Description: `Order ${order.display_id} from Medusa`,
        // Other mappings would go here depending on their exact Salesforce schema
      }

      const result = await this.conn.sobject('Order').create(sfOrder)
      console.log('[SalesforceService] Order synced:', result)
    } catch (err) {
      console.error('[SalesforceService] Order sync failed:', err)
    }
  }

  async syncCustomer(customer: any) {
    if (!this.conn) return
    const connected = await this.connect()
    if (!connected) return

    try {
      // Create Contact in Salesforce
      const sfContact = {
        FirstName: customer.first_name || 'Unknown',
        LastName: customer.last_name || 'Customer',
        Email: customer.email,
        Phone: customer.phone,
      }

      const result = await this.conn.sobject('Contact').create(sfContact)
      console.log('[SalesforceService] Customer synced:', result)
    } catch (err) {
      console.error('[SalesforceService] Customer sync failed:', err)
    }
  }
}

export const salesforceService = new SalesforceService()

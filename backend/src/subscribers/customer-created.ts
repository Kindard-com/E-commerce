import { type SubscriberConfig, type SubscriberArgs } from "@medusajs/medusa"
import { slackService } from "../lib/slack"
import { salesforceService } from "../lib/salesforce"

export default async function customerCreatedHandler({
  event: { data },
  container,
}: SubscriberArgs<{ id: string }>) {
  const query = container.resolve("query")
  
  let customerResult;
  try {
    const { data: customers } = await query.graph({
      entity: "customer",
      fields: [
        "id",
        "first_name",
        "last_name",
        "email",
        "phone",
      ],
      filters: {
        id: data.id,
      },
    })
    customerResult = customers;
  } catch (error) {
    console.error(`[Customer Subscriber] Failed to query customer ${data.id}:`, error)
    return
  }

  const customer = customerResult?.[0]
  
  if (!customer) {
    console.warn(`[Customer Subscriber] Customer not found for ID: ${data.id}`)
    return
  }

  try {
    await slackService.notifyCustomer(customer)
    await salesforceService.syncCustomer(customer)
  } catch (error) {
    console.error(`[Customer Subscriber] Error syncing customer ${data.id}:`, error)
  }
}

export const config: SubscriberConfig = {
  event: "customer.created",
}

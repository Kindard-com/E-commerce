import { CollectionAfterChangeHook } from 'payload'
import { payloadSlackService } from '../../lib/slack'
import { payloadSalesforceService } from '../../lib/salesforce'

export const syncToExternalServices: CollectionAfterChangeHook = async ({
  doc,
  operation,
  collection
}) => {
  if (operation === 'create' || operation === 'update') {
    try {
      await payloadSlackService.notifyDocumentUpdate(collection.slug, doc)
      await payloadSalesforceService.syncDocument(collection.slug, doc)
    } catch (err) {
      console.error(`[Payload Hook] Error syncing ${collection.slug} doc ${doc.id}:`, err)
    }
  }

  return doc
}

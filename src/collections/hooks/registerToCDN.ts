import type { CollectionAfterChangeHook } from 'payload'

export const registerToCDN: CollectionAfterChangeHook = async ({
  doc, // full document data
  req, // full express request
  operation, // name of the operation ie. 'create', 'update'
}) => {
  if (operation === 'create' || (operation === 'update' && !doc.cdn_hash)) {
    const payloadServerUrl = process.env.PAYLOAD_PUBLIC_SERVER_URL || 'http://localhost:3000'
    const originalUrl = `${payloadServerUrl}${doc.url}`
    
    const cdnUrl = process.env.CDN_BASE_URL || 'http://localhost:3001'
    const adminKey = process.env.CDN_ADMIN_API_KEY || 'secret_admin_key_123'
    
    try {
      const response = await fetch(`${cdnUrl}/api/images/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminKey}`
        },
        body: JSON.stringify({
          original_url: originalUrl,
          mime_type: doc.mimeType,
          size_bytes: doc.filesize,
          is_public: true
        })
      })
      
      if (response.ok) {
        const json = await response.json()
        if (json.hash) {
          // Update the document in Payload to save the CDN hash without triggering hooks infinitely
          await req.payload.update({
            collection: 'media',
            id: doc.id,
            data: {
              cdn_hash: json.hash
            },
            req
          })
          
          return { ...doc, cdn_hash: json.hash }
        }
      } else {
         console.error('Failed to register image to CDN:', await response.text())
      }
    } catch (e) {
       console.error('Error contacting CDN:', e)
    }
  }
  return doc
}

export async function fetchMedusaProducts() {
  try {
    const medusaUrl = process.env.MEDUSA_URL || process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || 'http://127.0.0.1:9000'
    const publishableKey = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || ''
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    }

    if (publishableKey) {
      headers['x-publishable-api-key'] = publishableKey
    }

    const res = await fetch(`${medusaUrl}/store/products?limit=100`, {
      headers,
      next: { revalidate: 60 },
    })

    if (!res.ok) {
      console.error('Failed to fetch Medusa products:', await res.text())
      return []
    }

    const json = await res.json()
    return json.products || []
  } catch (error) {
    console.error('Error fetching Medusa products:', error)
    return []
  }
}

export async function fetchMedusaProducts() {
  try {
    const medusaUrl = process.env.MEDUSA_URL || 'http://127.0.0.1:9000'
    const res = await fetch(`${medusaUrl}/store/products`, {
      headers: {
        'Content-Type': 'application/json',
      },
      next: { revalidate: 60 }, // Cache for 60 seconds
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

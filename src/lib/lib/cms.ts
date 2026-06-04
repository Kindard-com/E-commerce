export async function getCmsContent(handle: string, fallbackData: any = {}) {
  try {
    const url = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://127.0.0.1:9000";
    
    const res = await fetch(`${url}/store/cms/${handle}`, {
      next: { revalidate: 60 } // Cache for 60 seconds
    });

    if (!res.ok) {
      return fallbackData;
    }

    const json = await res.json();
    if (json.content && json.content.data) {
      // Merge with fallback data so missing keys don't break the UI
      return { ...fallbackData, ...json.content.data };
    }

    return fallbackData;
  } catch (error) {
    console.error(`Failed to fetch CMS content for ${handle}:`, error);
    return fallbackData;
  }
}

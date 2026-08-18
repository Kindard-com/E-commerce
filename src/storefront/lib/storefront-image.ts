const LOCAL_IMAGE_HOSTS = new Set(['localhost', '127.0.0.1', '0.0.0.0'])

const LOCAL_IMAGE_PATHS = ['/api/images', '/api/media/file/', '/img/']

export function normalizeStorefrontImage(url?: string | null): string | undefined {
  if (!url) return undefined
  const trimmed = String(url).trim()
  if (!trimmed) return undefined
  if (trimmed.startsWith('/')) return trimmed

  try {
    const parsed = new URL(trimmed)
    const isLocalHost = LOCAL_IMAGE_HOSTS.has(parsed.hostname)
    const isLocalPath = LOCAL_IMAGE_PATHS.some(
      (prefix) => parsed.pathname === prefix || parsed.pathname.startsWith(prefix),
    )
    if (isLocalHost && isLocalPath) {
      return `${parsed.pathname}${parsed.search}`
    }
  } catch {
    return trimmed
  }

  return trimmed
}

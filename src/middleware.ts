import createMiddleware from 'next-intl/middleware'
import { routing } from './i18n/routing'

export default createMiddleware(routing)

export const config = {
  matcher: ['/', '/(en|de|fr|nl|es)/:path*', '/((?!api|admin|img|medusa|_next|_vercel|.*\\..*).*)'],
}

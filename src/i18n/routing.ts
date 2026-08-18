import { defineRouting } from 'next-intl/routing'

export const locales = ['en', 'de', 'fr', 'nl', 'es'] as const
export type AppLocale = (typeof locales)[number]

export const localeNames: Record<AppLocale, string> = {
  en: 'English',
  de: 'Deutsch',
  fr: 'Français',
  nl: 'Nederlands',
  es: 'Español',
}

export const routing = defineRouting({
  locales,
  defaultLocale: 'en',
  localePrefix: 'always',
  localeDetection: true,
  localeCookie: {
    name: 'NEXT_LOCALE',
    maxAge: 60 * 60 * 24 * 365,
  },
})

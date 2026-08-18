import { hasLocale } from 'next-intl'
import { getRequestConfig } from 'next-intl/server'
import { routing } from './routing'
import './global'

const catalogs = {
  en: () => import('../../messages/en.json'),
  de: () => import('../../messages/de.json'),
  fr: () => import('../../messages/fr.json'),
  nl: () => import('../../messages/nl.json'),
  es: () => import('../../messages/es.json'),
}

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale
  const locale = hasLocale(routing.locales, requested) ? requested : routing.defaultLocale

  return {
    locale,
    messages: (await catalogs[locale]()).default,
  }
})

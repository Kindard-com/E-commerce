import { describe, expect, it } from 'vitest'
import { locales, localeNames, routing } from '@/i18n/routing'
import en from '../../messages/en.json'
import de from '../../messages/de.json'
import fr from '../../messages/fr.json'
import nl from '../../messages/nl.json'
import es from '../../messages/es.json'

function flattenKeys(value: unknown, prefix = ''): string[] {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return [prefix]
  return Object.entries(value as Record<string, unknown>).flatMap(([key, nested]) =>
    flattenKeys(nested, prefix ? `${prefix}.${key}` : key),
  )
}

describe('storefront languages', () => {
  it('defines five locale-prefixed languages', () => {
    expect([...locales]).toEqual(['en', 'de', 'fr', 'nl', 'es'])
    expect(routing.defaultLocale).toBe('en')
    expect(routing.localePrefix).toBe('always')
    expect(localeNames.en).toBe('English')
    expect(localeNames.de).toBe('Deutsch')
    expect(localeNames.fr).toBe('Français')
    expect(localeNames.nl).toBe('Nederlands')
    expect(localeNames.es).toBe('Español')
  })

  it('keeps translation files in sync', () => {
    const englishKeys = flattenKeys(en).sort()
    for (const catalog of [de, fr, nl, es]) {
      expect(flattenKeys(catalog).sort()).toEqual(englishKeys)
    }
  })
})

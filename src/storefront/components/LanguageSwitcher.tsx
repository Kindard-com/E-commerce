'use client'

import { useLocale, useTranslations } from 'next-intl'
import { usePathname, useRouter } from '@/i18n/navigation'
import { locales, type AppLocale } from '@/i18n/routing'

export function LanguageSwitcher() {
  const t = useTranslations('lang')
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()

  return (
    <label className="lang-switch-wrap">
      <span className="sr-only">{t('label')}</span>
      <select
        className="lang-switch"
        aria-label={t('label')}
        value={locale}
        onChange={(event) => {
          const nextLocale = event.target.value as AppLocale
          router.replace(pathname, { locale: nextLocale })
        }}
      >
        {locales.map((code) => (
          <option key={code} value={code}>
            {code.toUpperCase()}
          </option>
        ))}
      </select>
    </label>
  )
}

import { getTranslations, setRequestLocale } from 'next-intl/server'
import { Sidebar } from '@/storefront/components/Sidebar'
import { ProductGrid } from '@/storefront/components/ProductGrid'
import { FilterBar } from '@/storefront/components/FilterBar'
import { isMedusaUnavailable, loadMedusaProducts } from '@/storefront/lib/load-products'
import { AutoRefreshFallback } from '@/storefront/components/AutoRefreshFallback'
import type { Metadata } from 'next'
import { routing } from '@/i18n/routing'

type Props = {
  params: Promise<{ locale: string }>
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations({ locale, namespace: 'meta' })
  return {
    title: t('buyTitle'),
    description: t('buyDescription'),
  }
}

export default async function BuyPage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations('buy')
  const { products, source } = await loadMedusaProducts(50)

  return (
    <>
      <section style={{ padding: '48px 28px 12px' }}>
        <h1
          style={{
            fontFamily: "'Barlow Condensed', sans-serif",
            fontSize: '42px',
            textTransform: 'uppercase',
            letterSpacing: '0.04em',
            margin: 0,
          }}
        >
          {t('title')}
        </h1>
        <p style={{ color: 'var(--mid)', marginTop: '8px' }}>{t('subtitle')}</p>
      </section>
      <AutoRefreshFallback isFallback={isMedusaUnavailable(source)} />
      <FilterBar resultCount={products.length} />
      <div className="shop-layout">
        <Sidebar />
        {products.length === 0 ? (
          <p style={{ padding: '24px', color: 'var(--mid)' }}>{t('empty')}</p>
        ) : (
          <ProductGrid products={products} />
        )}
      </div>
    </>
  )
}

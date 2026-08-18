import Image from 'next/image';
import { Metadata } from 'next';
import { Sidebar } from '@/storefront/components/Sidebar';
import { ProductGrid } from '@/storefront/components/ProductGrid';
import { FilterBar } from '@/storefront/components/FilterBar';
import { Link } from '@/i18n/navigation';
import { isMedusaUnavailable, loadMedusaProducts } from '@/storefront/lib/load-products';
import { FaqAccordion } from '@/storefront/components/FaqAccordion';
import { AutoRefreshFallback } from '@/storefront/components/AutoRefreshFallback';
import { getPayload } from 'payload';
import configPromise from '@payload-config';
import { getTranslations, setRequestLocale } from 'next-intl/server';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'meta' });
  return {
    title: t('homeTitle'),
    description: t('homeDescription'),
  };
}

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('home');
  let homeData: any = null
  try {
    const payload = await getPayload({ config: configPromise });
    homeData = await payload.findGlobal({ slug: 'home-page' });
  } catch (error) {
    console.warn('[payload] home-page global unavailable, using defaults', error)
  }
  
  // Safe defaults if the global hasn't been saved in Payload yet
  const hero = homeData?.hero || {
    title: t('heroTitle'),
    subtitle: t('heroSubtitle'),
    ctaText: t('shopTheDrop'),
    ctaUrl: "/buy",
    imageUrl: "/api/images?file=hero_kids_streetwear_1779803641942.png"
  };
  
  const cta = homeData?.ctaSection || {
    title: t('ctaTitle'),
    subtitle: t('ctaSubtitle'),
    buttonText: t('ctaButton'),
    buttonUrl: "/buy"
  };
  
  const faqSection = homeData?.faqSection || {
    title: t('faqTitle'),
    subtitle: t('faqSubtitle'),
    faqs: []
  };
  
  const featuresSection = homeData?.featuresSection || {
    title: t('featuresTitle'),
    subtitle: t('featuresSubtitle'),
    features: []
  };

  const { products, source } = await loadMedusaProducts(20);

  return (
    <>
      <section className="hero">
        <div className="hero-text desktop-only">
          <div className="hero-tag"><span>{t('heroTag')}</span></div>
          <div className="hero-title" style={{ whiteSpace: 'pre-line' }}>{hero.title}</div>
          <p className="hero-sub">{hero.subtitle}</p>
          <div className="hero-cta">
            <Link href={hero.ctaUrl || "/buy"} className="btn-primary">{hero.ctaText}</Link>
            <Link href="/about" className="btn-ghost">{t('whyKindard')}</Link>
          </div>
        </div>
        <div className="hero-img">
          <div className="hero-img-placeholder" style={{ padding: 0, overflow: 'hidden', position: 'relative' }}>
            <Image 
              src={hero.imageUrl || "/api/images?file=hero_kids_streetwear_1779803641942.png"} 
              alt="Kindard Kids" 
              fill 
              priority 
              sizes="(max-width: 768px) 100vw, 50vw"
              style={{ objectFit: 'cover' }} 
            />
          </div>
          <div className="hero-img-tag"><span>{t('newArrival')}</span></div>
          <div className="hero-price-tag"><span>{t('fromPrice')}</span></div>
        </div>
      </section>

      {/* ════════════════════════════════════
           TRUST BAR
           ════════════════════════════════════ */}
      <div className="trust-bar">
        <div className="trust-item"><span className="trust-icon"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="3" width="15" height="13"></rect><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon><circle cx="5.5" cy="18.5" r="2.5"></circle><circle cx="18.5" cy="18.5" r="2.5"></circle></svg></span> {t('trustShipping')}</div>
        <div className="trust-item"><span className="trust-icon"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="1 4 1 10 7 10"></polyline><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"></path></svg></span> {t('trustReturns')}</div>
        <div className="trust-item"><span className="trust-icon"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg></span> {t('trustSecure')}</div>
      </div>

      <AutoRefreshFallback isFallback={isMedusaUnavailable(source)} />
      <FilterBar resultCount={products.length} />
      
      <div className="shop-layout">
        <Sidebar />
        <ProductGrid products={products} />
      </div>

      {/* ════════════════════════════════════
           WHY CHOOSE US
           ════════════════════════════════════ */}
      <section className="cro-section">
        <div className="cro-header">
          <h2 className="cro-title" style={{ whiteSpace: 'pre-line' }}>{featuresSection.title}</h2>
          <p className="cro-subtitle">{featuresSection.subtitle}</p>
        </div>
        <div className="features-grid">
          {featuresSection.features && featuresSection.features.map((feature: any, index: number) => (
            <div className="feature-card" key={index}>
              <div className="feature-image-wrapper">
                <Image src={feature.imageUrl} alt={feature.title} fill style={{ objectFit: 'cover' }} />
              </div>
              <h3 className="feature-title">{feature.title}</h3>
              <p className="feature-text">{feature.description}</p>
            </div>
          ))}
          
          {(!featuresSection.features || featuresSection.features.length === 0) && (
            <>
              <div className="feature-card">
                <div className="feature-image-wrapper">
                  <Image src="/img/quality_clothing.png" alt={t('qualityTitle')} fill style={{ objectFit: 'cover' }} />
                </div>
                <h3 className="feature-title">{t('qualityTitle')}</h3>
                <p className="feature-text">{t('qualityText')}</p>
              </div>
              <div className="feature-card">
                <div className="feature-image-wrapper">
                  <Image src="/img/movement_clothing.png" alt={t('movementTitle')} fill style={{ objectFit: 'cover' }} />
                </div>
                <h3 className="feature-title">{t('movementTitle')}</h3>
                <p className="feature-text">{t('movementText')}</p>
              </div>
              <div className="feature-card">
                <div className="feature-image-wrapper">
                  <Image src="/img/materials_clothing.png" alt={t('materialsTitle')} fill style={{ objectFit: 'cover' }} />
                </div>
                <h3 className="feature-title">{t('materialsTitle')}</h3>
                <p className="feature-text">{t('materialsText')}</p>
              </div>
            </>
          )}
        </div>
      </section>

      {/* ════════════════════════════════════
           FAQ
           ════════════════════════════════════ */}
      <section className="cro-section">
        <div className="cro-header">
          <h2 className="cro-title">{faqSection.title}</h2>
          <p className="cro-subtitle">{faqSection.subtitle}</p>
        </div>
        <FaqAccordion faqs={faqSection.faqs && faqSection.faqs.length > 0 ? faqSection.faqs : [
          { question: "What is your return policy?", answer: "We offer a 30-day satisfaction guarantee. If your little one isn't happy with the fit, you can return unworn, unwashed items with tags attached for a full refund or exchange. Returns are completely free." },
          { question: "How long does shipping take?", answer: "All orders over $150 qualify for free express shipping. Domestic orders typically arrive within 2-4 business days." },
          { question: "Are your materials sustainably sourced?", answer: "Yes. Kindard Kids is committed to the future. Our cotton is 100% organic and ethically sourced." },
          { question: "How do your sizes run?", answer: "Our kids streetwear features a signature oversized fit. We recommend ordering their true age size for the intended baggy look." }
        ]} />
      </section>

      {/* ════════════════════════════════════
           FINAL CTA
           ════════════════════════════════════ */}
      <section className="cta-block">
        <h2 className="cro-title">{cta.title}</h2>
        <p className="cro-subtitle" style={{ marginBottom: '32px' }}>{cta.subtitle}</p>
        <Link href={cta.buttonUrl || "/buy"} className="btn-primary" style={{ border: '2px solid var(--black)', padding: '18px 40px', fontSize: '14px' }}>
          {cta.buttonText}
        </Link>
      </section>
    </>
  );
}

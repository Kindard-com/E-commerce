import type { Metadata, Viewport } from 'next';
import './globals.css';
import { StoreProvider } from '@/storefront/lib/StoreContext';
import { Ticker } from '@/storefront/components/Ticker';
import { Nav } from '@/storefront/components/Nav';
import { Footer } from '@/storefront/components/Footer';
import { CartPanel } from '@/storefront/components/CartPanel';
import { DetailPanel } from '@/storefront/components/DetailPanel';
import { MenuOverlay } from '@/storefront/components/MenuOverlay';
import { MobBottomNav } from '@/storefront/components/MobBottomNav';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,   // prevent iOS auto-zoom on input focus
  userScalable: false,
};

export const metadata: Metadata = {
  title: {
    template: 'Kindard | %s',
    default: 'Kindard',
  },
  description: "KINDARD KIDS — Premium streetwear for the little ones who start trends. Summer Edition 2026.",
  icons: {
    icon: '/img/kindard_icon.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-bs-theme="light">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Ubuntu:wght@400;700&display=swap" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;500;600;700;900&display=swap" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Barlow:wght@300;400;500&display=swap" />
      </head>
      <body suppressHydrationWarning={true}>
        <StoreProvider>
          <Ticker />
          <Nav />
          
          <main>
            {children}
          </main>

          <Footer />

          {/* Slide-over Panels & Overlays */}
          <DetailPanel />
          <CartPanel />
          <MenuOverlay />
          
          {/* Mobile Bottom Navigation */}
          <MobBottomNav />
        </StoreProvider>
      </body>
    </html>
  );
}

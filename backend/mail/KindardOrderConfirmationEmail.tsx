import * as React from 'react';
import {
  Body,
  Button,
  Column,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Link,
  Preview,
  Row,
  Section,
  Text,
  Font
} from '@react-email/components';

type OrderItem = {
  name: string;
  meta?: string;
  price: string;
};

type Address = {
  name: string;
  lines: string[];
};

type KindardOrderConfirmationEmailProps = {
  customerName?: string;
  orderNumber?: string;
  logoUrl?: string;
  heroImageUrl?: string;
  trackingUrl?: string;
  shopUrl?: string;
  supportEmail?: string;
  items?: OrderItem[];
  subtotal?: string;
  shipping?: string;
  total?: string;
  shipTo?: Address;
  deliveryMethod?: string;
  deliveryEstimate?: string;
  unsubscribeUrl?: string;
};

const defaultItems: OrderItem[] = [
  { name: 'Kindard Gift Box — Newborn', meta: 'Qty: 1 · One Size', price: '€49,95' },
  { name: 'Personalised Card', meta: 'Qty: 1', price: '€4,95' },
  { name: 'Gift Wrapping', meta: 'Qty: 1', price: '€2,50' },
];

export default function KindardOrderConfirmationEmail({
  customerName = 'Emma',
  orderNumber = '#KND-20482',
  logoUrl = 'https://www.kindardcloud.com/img/fea8c82ade91d395b084c6e991a712b4',
  heroImageUrl = 'https://www.kindardcloud.com/img/757384df49f09a7b753572039751d50f',
  trackingUrl = 'https://kindard.com/orders/KND-20482',
  shopUrl = 'https://kindard.com/new-arrivals',
  supportEmail = 'hello@kindard.com',
  items = defaultItems,
  subtotal = '€57,40',
  shipping = 'Free',
  total = '€57,40',
  shipTo = {
    name: 'Emma de Vries',
    lines: ['Keizersgracht 315', '1016 EE Amsterdam', 'Netherlands'],
  },
  deliveryMethod = 'Standard Shipping',
  deliveryEstimate = 'Est. 2–4 business days',
  unsubscribeUrl = 'https://kindard.com/unsubscribe',
}: KindardOrderConfirmationEmailProps) {
  return (
    <Html lang="en">
      <Head>
        <Font
          fontFamily="Barlow Condensed"
          fallbackFontFamily="Helvetica"
          webFont={{
            url: 'https://fonts.gstatic.com/s/barlowcondensed/v12/HTxxL3I-JCGChYJ8VI-L6OO_au7B43rT2g.woff2',
            format: 'woff2',
          }}
          fontWeight={700}
          fontStyle="normal"
        />
        <Font
          fontFamily="Barlow Condensed"
          fallbackFontFamily="Helvetica"
          webFont={{
            url: 'https://fonts.gstatic.com/s/barlowcondensed/v12/HTxxL3I-JCGChYJ8VI-L6OO_au7B6x7T2g.woff2',
            format: 'woff2',
          }}
          fontWeight={900}
          fontStyle="normal"
        />
        <Font
          fontFamily="Barlow"
          fallbackFontFamily="Arial"
          webFont={{
            url: 'https://fonts.gstatic.com/s/barlow/v12/76vHK8B45TuvF51X1w.woff2',
            format: 'woff2',
          }}
          fontWeight={300}
          fontStyle="normal"
        />
      </Head>
      <Preview>Your Kindard order is confirmed — we are packing it with care.</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={navSection}>
            <Row>
              <Column>
                <Img src={logoUrl} width="108" alt="Kindard" style={logo} />
              </Column>
              <Column align="right">
                <Text style={orderId}>{orderNumber}</Text>
              </Column>
            </Row>
          </Section>

          <Section style={{ ...heroSection, backgroundImage: `linear-gradient(rgba(17,17,17,0.8), rgba(17,17,17,0.9)), url(${heroImageUrl})` }}>
            <div style={tagWrapper}>
              <Text style={tag}>Order Confirmed</Text>
            </div>
            <Heading style={heroHeading}>YOUR<br />ORDER<br /><span style={heroHeadingEm}>IS IN.</span></Heading>
            <Text style={heroSub}>We've got it — your little one's new gear is being packed with care. Expect a shipping update soon.</Text>
          </Section>

          <Section style={perksSection}>
            <Row>
              <Column align="center">
                <Text style={perkText}>Fast, Free Delivery</Text>
              </Column>
              <Column align="center" style={{ width: '20px' }}><Text style={perkSep}>•</Text></Column>
              <Column align="center">
                <Text style={perkText}>Easy 30-Day Returns</Text>
              </Column>
              <Column align="center" style={{ width: '20px' }}><Text style={perkSep}>•</Text></Column>
              <Column align="center">
                <Text style={perkText}>Safe & Secure Checkout</Text>
              </Column>
            </Row>
          </Section>

          <Section style={contentSection}>
            <Text style={greeting}>Hey {customerName},</Text>
            <Text style={intro}>Thanks for shopping at kindard. Your order is confirmed and already in the queue. We'll send a tracking link the moment it ships.</Text>

            <Section style={orderBox}>
              <Row style={orderHead}>
                <Column><Text style={label}>Order Summary</Text></Column>
                <Column align="right"><Text style={orderNumberText}>{orderNumber}</Text></Column>
              </Row>

              {items.map((item) => (
                <Row key={`${item.name}-${item.price}`} style={itemRow}>
                  <Column>
                    <Text style={itemName}>{item.name}</Text>
                    {item.meta ? <Text style={itemMeta}>{item.meta}</Text> : null}
                  </Column>
                  <Column align="right" style={{ width: '90px' }}>
                    <Text style={itemPrice}>{item.price}</Text>
                  </Column>
                </Row>
              ))}

              <Row style={totalsSection}>
                <Column>
                  <Text style={totalLineLeft}>Subtotal</Text>
                  <Text style={totalLineLeft}>Shipping</Text>
                  <Text style={grandTotalLeft}>Total</Text>
                </Column>
                <Column>
                  <Text style={totalLineRight}>{subtotal}</Text>
                  <Text style={freeShipping}>{shipping}</Text>
                  <Text style={grandTotalRight}>{total}</Text>
                </Column>
              </Row>
            </Section>

            <Row style={infoGrid}>
              <Column style={infoCardLeft}>
                <div style={infoLabelWrapper}><Text style={infoLabel}>Ship To</Text></div>
                <Text style={infoValue}>{shipTo.name}<br />{shipTo.lines.map((line, index) => <React.Fragment key={line}>{line}{index < shipTo.lines.length - 1 ? <br /> : null}</React.Fragment>)}</Text>
              </Column>
              <Column style={infoCardRight}>
                <div style={infoLabelWrapper}><Text style={infoLabel}>Delivery</Text></div>
                <Text style={infoValue}>{deliveryMethod}<br />{deliveryEstimate}<br /><br />Tracking link sent on dispatch.</Text>
              </Column>
            </Row>

            <Row style={buttonRow}>
              <Column style={{ paddingRight: '5px' }}>
                <Button href={trackingUrl} style={primaryButton}>Track Your Order</Button>
              </Column>
              <Column style={{ paddingLeft: '5px' }}>
                <Button href={shopUrl} style={secondaryButton}>Shop More</Button>
              </Column>
            </Row>

            <Text style={helpText}>Questions? <Link href={`mailto:${supportEmail}`} style={textLink}>{supportEmail}</Link></Text>
          </Section>

          <Section style={ctaSection}>
            <Heading style={ctaHeading}>READY TO<br />UPGRADE THEIR<br />WARDROBE?</Heading>
            <Button href={shopUrl} style={ctaButton}>SHOP NEW ARRIVALS</Button>
          </Section>

          <Section style={membersSection}>
            <Text style={memberTag}>Members Only</Text>
            <Heading style={memberHeading}>GET EARLY ACCESS.<br />STAY AHEAD.</Heading>
            <Text style={memberCopy}>Drop alerts, exclusive codes, and zero spam.<br />Join the Kindard inner circle.</Text>
            <Text style={finePrint}>By subscribing you agree to our privacy policy. Unsubscribe anytime.</Text>
          </Section>

          <Section style={footer}>
            <Img src={logoUrl} width="72" alt="Kindard" style={footerLogo} />
            <Text style={footerLinks}>
              <Link href="https://kindard.com/new-arrivals" style={footerLink}>New Arrivals</Link> &nbsp;·&nbsp;{' '}
              <Link href="https://kindard.com/account/orders" style={footerLink}>My Orders</Link> &nbsp;·&nbsp;{' '}
              <Link href="https://kindard.com/returns" style={footerLink}>Returns</Link> &nbsp;·&nbsp;{' '}
              <Link href={`mailto:${supportEmail}`} style={footerLink}>Contact</Link>
            </Text>
            <Text style={footerText}>© 2026 Kindard B.V. · Herengracht 100, Amsterdam · <Link href={unsubscribeUrl} style={footerYl}>Unsubscribe</Link></Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

const main = { backgroundColor: '#d8d8d8', fontFamily: "'Barlow', sans-serif" };
const container = { width: '100%', maxWidth: '620px', margin: '28px auto', backgroundColor: '#ffffff', overflow: 'hidden' };

/* NAV */
const navSection = { padding: '16px 32px', backgroundColor: '#ffffff', borderBottom: '2px solid #111111' };
const logo = { display: 'block' };
const orderId = { margin: 0, fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: '11px', letterSpacing: '1.2px', textTransform: 'uppercase' as const, color: '#111111' };

/* HERO */
const heroSection = { padding: '56px 48px 52px', backgroundColor: '#111111', backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' };
const tagWrapper = { display: 'inline-block', borderLeft: '22px solid #DAFF00', paddingLeft: '8px', marginBottom: '18px' };
const tag = { margin: 0, fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: '11px', letterSpacing: '2px', textTransform: 'uppercase' as const, color: '#DAFF00' };
const heroHeading = { margin: 0, fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 900, fontSize: '80px', lineHeight: '0.86', textTransform: 'uppercase' as const, letterSpacing: '-1.5px', color: '#ffffff' };
const heroHeadingEm = { color: '#DAFF00' };
const heroSub = { margin: '22px 0 0 0', fontSize: '14px', color: 'rgba(255,255,255,0.48)', fontWeight: 300, lineHeight: '1.6', maxWidth: '360px' };

/* PERKS */
const perksSection = { backgroundColor: '#DAFF00', padding: '14px 32px' };
const perkText = { margin: 0, fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: '10px', letterSpacing: '1.4px', textTransform: 'uppercase' as const, color: '#111111' };
const perkSep = { margin: 0, color: 'rgba(0,0,0,0.25)', fontSize: '16px' };

/* BODY */
const contentSection = { padding: '40px 48px 36px' };
const greeting = { margin: '0 0 8px 0', fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 900, fontSize: '24px', textTransform: 'uppercase' as const, color: '#111111' };
const intro = { margin: '0 0 32px 0', fontSize: '14px', color: '#666666', lineHeight: '1.7', fontWeight: 300, paddingLeft: '14px', borderLeft: '3px solid #DAFF00' };

/* ORDER BOX */
const orderBox = { border: '2px solid #111111', width: '100%' };
const orderHead = { backgroundColor: '#111111', width: '100%' };
const label = { margin: 0, padding: '13px 20px', fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: '10px', letterSpacing: '1.8px', textTransform: 'uppercase' as const, color: 'rgba(255,255,255,0.4)' };
const orderNumberText = { margin: 0, padding: '13px 20px', fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 900, fontSize: '14px', letterSpacing: '1px', color: '#DAFF00', textTransform: 'uppercase' as const };
const itemRow = { borderBottom: '1px solid #f0f0f0', width: '100%' };
const itemName = { margin: 0, padding: '14px 0 0 20px', fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: '15px', textTransform: 'uppercase' as const, color: '#111111' };
const itemMeta = { margin: '2px 0 14px 20px', fontSize: '12px', color: '#bbbbbb', fontWeight: 300 };
const itemPrice = { margin: 0, padding: '14px 20px 14px 0', fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 900, fontSize: '16px', color: '#111111' };

const totalsSection = { backgroundColor: '#f8f8f8', borderTop: '2px solid #111111', width: '100%' };
const totalLineLeft = { margin: '0 0 5px 0', padding: '16px 0 0 20px', fontSize: '13px', color: '#888888', fontWeight: 300 };
const grandTotalLeft = { margin: '12px 0 0 0', padding: '12px 0 16px 20px', borderTop: '2px solid #111111', fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 900, fontSize: '20px', textTransform: 'uppercase' as const, color: '#111111' };
const totalLineRight = { margin: '0 0 5px 0', padding: '16px 20px 0 0', fontSize: '13px', color: '#888888', fontWeight: 300, textAlign: 'right' as const };
const freeShipping = { margin: '0 0 5px 0', padding: '0 20px 0 0', fontSize: '13px', color: '#111111', fontWeight: 500, textAlign: 'right' as const };
const grandTotalRight = { margin: '12px 0 0 0', padding: '12px 20px 16px 0', borderTop: '2px solid #111111', fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 900, fontSize: '20px', textTransform: 'uppercase' as const, color: '#111111', textAlign: 'right' as const };

/* INFO GRID */
const infoGrid = { border: '2px solid #111111', marginTop: '32px', marginBottom: '32px', width: '100%' };
const infoCardLeft = { padding: '20px 22px', borderRight: '2px solid #111111', width: '50%', verticalAlign: 'top' as const };
const infoCardRight = { padding: '20px 22px', width: '50%', verticalAlign: 'top' as const };
const infoLabelWrapper = { backgroundColor: '#DAFF00', display: 'inline-block', padding: '2px 8px', marginBottom: '10px' };
const infoLabel = { margin: 0, fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: '10px', letterSpacing: '1.8px', textTransform: 'uppercase' as const, color: '#111111' };
const infoValue = { margin: 0, fontSize: '13px', color: '#555555', fontWeight: 300, lineHeight: '1.65' };

/* BUTTONS */
const buttonRow = { marginBottom: '28px', width: '100%' };
const primaryButton = { display: 'block', backgroundColor: '#111111', color: '#DAFF00', textDecoration: 'none', fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 900, fontSize: '13px', letterSpacing: '2px', textTransform: 'uppercase' as const, padding: '17px', textAlign: 'center' as const };
const secondaryButton = { display: 'block', backgroundColor: 'transparent', color: '#111111', textDecoration: 'none', fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: '13px', letterSpacing: '1.5px', textTransform: 'uppercase' as const, padding: '15px', textAlign: 'center' as const, border: '2px solid #111111' };

const helpText = { textAlign: 'center' as const, fontSize: '12px', color: '#bbbbbb', fontWeight: 300, margin: 0 };
const textLink = { color: '#111111', textDecoration: 'none', fontWeight: 500 };

/* CTA SECTION */
const ctaSection = { backgroundColor: '#DAFF00', padding: '56px 48px', textAlign: 'center' as const };
const ctaHeading = { margin: '0 0 22px 0', fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 900, fontSize: '48px', textTransform: 'uppercase' as const, letterSpacing: '-0.5px', lineHeight: '0.9', color: '#111111' };
const ctaButton = { display: 'inline-block', backgroundColor: '#111111', color: '#ffffff', textDecoration: 'none', fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 900, fontSize: '13px', letterSpacing: '2px', textTransform: 'uppercase' as const, padding: '16px 48px' };

/* MEMBERS */
const membersSection = { backgroundColor: '#111111', padding: '48px' };
const memberTag = { margin: '0 0 10px 0', fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: '11px', letterSpacing: '2px', textTransform: 'uppercase' as const, color: '#DAFF00' };
const memberHeading = { margin: '0 0 12px 0', fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 900, fontSize: '40px', textTransform: 'uppercase' as const, color: '#ffffff', lineHeight: '0.9' };
const memberCopy = { margin: '0 0 22px 0', fontSize: '13px', color: 'rgba(255,255,255,0.38)', fontWeight: 300, lineHeight: '1.5' };
const finePrint = { margin: '10px 0 0 0', fontSize: '11px', color: 'rgba(255,255,255,0.18)' };

/* FOOTER */
const footer = { backgroundColor: '#0d0d0d', padding: '28px 48px', textAlign: 'center' as const, borderTop: '1px solid #1a1a1a' };
const footerLogo = { margin: '0 auto 14px auto', display: 'block', opacity: 0.3 }; 
const footerLinks = { margin: '0 0 14px 0', textAlign: 'center' as const };
const footerLink = { fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: '10px', letterSpacing: '1.2px', textTransform: 'uppercase' as const, color: 'rgba(255,255,255,0.28)', textDecoration: 'none' };
const footerText = { margin: 0, fontSize: '11px', color: 'rgba(255,255,255,0.18)', lineHeight: '1.7', fontWeight: 300 };
const footerYl = { color: '#DAFF00', opacity: 0.5, textDecoration: 'none' };

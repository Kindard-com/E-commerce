import * as React from 'react';
import {
  Body,
  Button,
  Column,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Row,
  Section,
  Text,
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

const TruckIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path d="M3 6.75C3 5.78 3.78 5 4.75 5H14V16H3V6.75Z" stroke="#111111" strokeWidth="1.7" strokeLinejoin="round" />
    <path d="M14 8H17.25L21 12.25V16H14V8Z" stroke="#111111" strokeWidth="1.7" strokeLinejoin="round" />
    <path d="M7.5 19C8.6 19 9.5 18.1 9.5 17C9.5 15.9 8.6 15 7.5 15C6.4 15 5.5 15.9 5.5 17C5.5 18.1 6.4 19 7.5 19Z" stroke="#111111" strokeWidth="1.7" />
    <path d="M17.5 19C18.6 19 19.5 18.1 19.5 17C19.5 15.9 18.6 15 17.5 15C16.4 15 15.5 15.9 15.5 17C15.5 18.1 16.4 19 17.5 19Z" stroke="#111111" strokeWidth="1.7" />
  </svg>
);

const ReturnIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path d="M7.5 7H16C18.76 7 21 9.24 21 12C21 14.76 18.76 17 16 17H8" stroke="#111111" strokeWidth="1.7" strokeLinecap="round" />
    <path d="M8 4L5 7L8 10" stroke="#111111" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M16.5 20H8C5.24 20 3 17.76 3 15C3 12.24 5.24 10 8 10H16" stroke="#111111" strokeWidth="1.7" strokeLinecap="round" opacity="0.45" />
  </svg>
);

const LockIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path d="M7 10V8C7 5.24 9.24 3 12 3C14.76 3 17 5.24 17 8V10" stroke="#111111" strokeWidth="1.7" strokeLinecap="round" />
    <path d="M6.75 10H17.25C18.22 10 19 10.78 19 11.75V19.25C19 20.22 18.22 21 17.25 21H6.75C5.78 21 5 20.22 5 19.25V11.75C5 10.78 5.78 10 6.75 10Z" stroke="#111111" strokeWidth="1.7" strokeLinejoin="round" />
    <path d="M12 15V17" stroke="#111111" strokeWidth="1.7" strokeLinecap="round" />
  </svg>
);

const Perk = ({ icon, text }: { icon: React.ReactNode; text: string }) => (
  <Column style={perkColumn}>
    <table role="presentation" cellPadding="0" cellSpacing="0" border={0} style={{ margin: '0 auto' }}>
      <tbody>
        <tr>
          <td style={perkIconCell}>{icon}</td>
          <td style={perkTextCell}>{text}</td>
        </tr>
      </tbody>
    </table>
  </Column>
);

export default function KindardOrderConfirmationEmail({
  customerName = 'Emma',
  orderNumber = '#KND-20482',
  logoUrl = 'https://kindard.com/assets/img/kindard.svg',
  heroImageUrl = 'https://kindard.com/assets/img/movement_clothing.png',
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
      <Head />
      <Preview>Your Kindard order is confirmed — we are packing it with care.</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={navSection}>
            <Row>
              <Column>
                <Img src={logoUrl} width="128" alt="Kindard" style={logo} />
              </Column>
              <Column align="right">
                <Text style={orderId}>{orderNumber}</Text>
              </Column>
            </Row>
          </Section>

          <Section style={{ ...heroSection, backgroundImage: `linear-gradient(rgba(0,0,0,0.38), rgba(255,255,255,0.92)), url(${heroImageUrl})` }}>
            <Text style={tag}>Order Confirmed</Text>
            <Heading style={heroHeading}>YOUR<br />ORDER<br /><em>IS IN.</em></Heading>
            <Text style={heroSub}>Your little one’s new pieces are now being packed with care. We’ll send your tracking link as soon as the order is on its way.</Text>
          </Section>

          <Section style={perksSection}>
            <Row>
              <Perk icon={<TruckIcon />} text="Fast, Free Delivery" />
              <Perk icon={<ReturnIcon />} text="Easy 30-Day Returns" />
              <Perk icon={<LockIcon />} text="Safe & Secure Checkout" />
            </Row>
          </Section>

          <Section style={contentSection}>
            <Text style={greeting}>Hey {customerName},</Text>
            <Text style={intro}>Thanks for shopping at Kindard. Your order is confirmed and already in the queue. We’ll send a tracking link the moment it ships.</Text>

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

              <Hr style={divider} />
              <Row>
                <Column><Text style={totalLine}>Subtotal</Text></Column>
                <Column align="right"><Text style={totalLine}>{subtotal}</Text></Column>
              </Row>
              <Row>
                <Column><Text style={totalLine}>Shipping</Text></Column>
                <Column align="right"><Text style={freeShipping}>{shipping}</Text></Column>
              </Row>
              <Row>
                <Column><Text style={grandTotal}>Total</Text></Column>
                <Column align="right"><Text style={grandTotal}>{total}</Text></Column>
              </Row>
            </Section>

            <Row style={infoRow}>
              <Column style={infoCard}>
                <Text style={infoLabel}>Ship To</Text>
                <Text style={infoValue}>{shipTo.name}<br />{shipTo.lines.map((line, index) => <React.Fragment key={line}>{line}{index < shipTo.lines.length - 1 ? <br /> : null}</React.Fragment>)}</Text>
              </Column>
              <Column style={infoGap} />
              <Column style={infoCard}>
                <Text style={infoLabel}>Delivery</Text>
                <Text style={infoValue}>{deliveryMethod}<br />{deliveryEstimate}<br /><br />Tracking link sent on dispatch.</Text>
              </Column>
            </Row>

            <Section style={buttonRow}>
              <Button href={trackingUrl} style={primaryButton}>Track Your Order</Button>
              <Button href={shopUrl} style={secondaryButton}>Shop More</Button>
            </Section>

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
            <Button href="https://kindard.com/newsletter" style={memberButton}>Subscribe →</Button>
            <Text style={finePrint}>By subscribing you agree to our privacy policy. Unsubscribe anytime.</Text>
          </Section>

          <Section style={footer}>
            <Img src={logoUrl} width="72" alt="Kindard" style={footerLogo} />
            <Text style={footerLinks}>
              <Link href="https://kindard.com/new-arrivals" style={footerLink}>New Arrivals</Link> ·{' '}
              <Link href="https://kindard.com/account/orders" style={footerLink}>My Orders</Link> ·{' '}
              <Link href="https://kindard.com/returns" style={footerLink}>Returns</Link> ·{' '}
              <Link href={`mailto:${supportEmail}`} style={footerLink}>Contact</Link>
            </Text>
            <Text style={footerText}>© 2026 Kindard B.V. · Herengracht 100, Amsterdam · <Link href={unsubscribeUrl} style={footerLink}>Unsubscribe</Link></Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

const main = { margin: 0, padding: 0, backgroundColor: '#f4f1ea', fontFamily: 'Arial, Helvetica, sans-serif' };
const container = { width: '100%', maxWidth: '640px', margin: '0 auto', backgroundColor: '#ffffff' };
const navSection = { padding: '22px 28px 16px' };
const logo = { display: 'block', border: 0 };
const orderId = { margin: 0, fontSize: '12px', letterSpacing: '0.08em', textTransform: 'uppercase' as const, color: '#111111' };
const heroSection = { padding: '42px 34px 48px', backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' };
const tag = { display: 'inline-block', margin: '0 0 16px', fontSize: '12px', lineHeight: '18px', letterSpacing: '0.08em', textTransform: 'uppercase' as const, color: '#111111', backgroundColor: '#ffffff', borderRadius: '999px', padding: '6px 12px' };
const heroHeading = { margin: '0 0 18px', fontSize: '54px', lineHeight: '50px', letterSpacing: '-0.06em', fontWeight: 900, color: '#111111' };
const heroSub = { margin: 0, maxWidth: '420px', fontSize: '16px', lineHeight: '24px', color: 'rgba(0,0,0,0.62)' };
const perksSection = { padding: '14px 16px', backgroundColor: '#faf8f2', borderTop: '1px solid #ece7dc', borderBottom: '1px solid #ece7dc' };
const perkColumn = { width: '33.33%', textAlign: 'center' as const };
const perkIconCell = { width: '22px', verticalAlign: 'middle', paddingRight: '6px', lineHeight: 0 };
const perkTextCell = { verticalAlign: 'middle', fontSize: '11px', lineHeight: '15px', fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase' as const, color: '#111111', whiteSpace: 'nowrap' as const };
const contentSection = { padding: '34px 28px 28px' };
const greeting = { margin: '0 0 10px', fontSize: '18px', lineHeight: '26px', fontWeight: 700, color: '#111111' };
const intro = { margin: '0 0 24px', fontSize: '15px', lineHeight: '23px', color: '#555555' };
const orderBox = { padding: '20px', border: '1px solid #e8e2d6', borderRadius: '18px', backgroundColor: '#fffdf8' };
const orderHead = { marginBottom: '8px' };
const label = { margin: 0, fontSize: '12px', letterSpacing: '0.08em', textTransform: 'uppercase' as const, fontWeight: 800, color: '#111111' };
const orderNumberText = { margin: 0, fontSize: '13px', fontWeight: 700, color: '#777777' };
const itemRow = { borderTop: '1px solid #eee8dd', paddingTop: '14px', paddingBottom: '14px' };
const itemName = { margin: '0 0 4px', fontSize: '15px', lineHeight: '21px', fontWeight: 700, color: '#111111' };
const itemMeta = { margin: 0, fontSize: '13px', lineHeight: '18px', color: '#777777' };
const itemPrice = { margin: 0, fontSize: '14px', lineHeight: '20px', fontWeight: 700, color: '#111111' };
const divider = { borderColor: '#e8e2d6', margin: '8px 0 12px' };
const totalLine = { margin: '0 0 8px', fontSize: '14px', color: '#555555' };
const freeShipping = { margin: '0 0 8px', fontSize: '14px', color: '#111111', fontWeight: 700 };
const grandTotal = { margin: '10px 0 0', fontSize: '18px', color: '#111111', fontWeight: 900 };
const infoRow = { marginTop: '18px' };
const infoCard = { padding: '18px', backgroundColor: '#f7f4ed', borderRadius: '16px', width: '48%' };
const infoGap = { width: '4%' };
const infoLabel = { margin: '0 0 8px', fontSize: '11px', letterSpacing: '0.08em', textTransform: 'uppercase' as const, fontWeight: 800, color: '#777777' };
const infoValue = { margin: 0, fontSize: '14px', lineHeight: '21px', color: '#111111' };
const buttonRow = { marginTop: '24px', textAlign: 'center' as const };
const primaryButton = { backgroundColor: '#111111', color: '#ffffff', borderRadius: '999px', padding: '14px 24px', fontSize: '13px', fontWeight: 800, textDecoration: 'none', marginRight: '8px' };
const secondaryButton = { backgroundColor: '#ffffff', color: '#111111', border: '1px solid #111111', borderRadius: '999px', padding: '13px 23px', fontSize: '13px', fontWeight: 800, textDecoration: 'none' };
const helpText = { margin: '22px 0 0', textAlign: 'center' as const, fontSize: '13px', color: '#777777' };
const textLink = { color: '#111111', textDecoration: 'underline' };
const ctaSection = { padding: '42px 28px', textAlign: 'center' as const, backgroundColor: '#111111' };
const ctaHeading = { margin: '0 0 20px', fontSize: '34px', lineHeight: '34px', letterSpacing: '-0.04em', fontWeight: 900, color: '#ffffff' };
const ctaButton = { backgroundColor: '#ffffff', color: '#111111', borderRadius: '999px', padding: '14px 24px', fontSize: '12px', fontWeight: 900, letterSpacing: '0.06em', textDecoration: 'none' };
const membersSection = { padding: '38px 28px', textAlign: 'center' as const, backgroundColor: '#f7f4ed' };
const memberTag = { display: 'inline-block', margin: '0 0 12px', fontSize: '11px', letterSpacing: '0.08em', textTransform: 'uppercase' as const, fontWeight: 800, color: '#111111' };
const memberHeading = { margin: '0 0 10px', fontSize: '28px', lineHeight: '30px', letterSpacing: '-0.04em', fontWeight: 900, color: '#111111' };
const memberCopy = { margin: '0 0 18px', fontSize: '14px', lineHeight: '22px', color: '#555555' };
const memberButton = { backgroundColor: '#111111', color: '#ffffff', borderRadius: '999px', padding: '13px 22px', fontSize: '13px', fontWeight: 800, textDecoration: 'none' };
const finePrint = { margin: '16px 0 0', fontSize: '11px', lineHeight: '16px', color: '#888888' };
const footer = { padding: '28px', textAlign: 'center' as const, backgroundColor: '#ffffff' };
const footerLogo = { margin: '0 auto 14px', display: 'block' };
const footerLinks = { margin: '0 0 12px', fontSize: '12px', lineHeight: '18px', color: '#111111' };
const footerLink = { color: '#111111', textDecoration: 'none' };
const footerText = { margin: 0, fontSize: '11px', lineHeight: '17px', color: '#777777' };

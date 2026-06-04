# Kindard React Email template

This is a sender-ready React Email version of the Kindard order confirmation email.

## Install

```bash
npm install @react-email/components react react-dom
npm install -D @react-email/render
```

## Use with Resend / Nodemailer / any mail sender

```tsx
import { render } from '@react-email/render';
import KindardOrderConfirmationEmail from './KindardOrderConfirmationEmail';

const html = await render(
  <KindardOrderConfirmationEmail
    customerName="Emma"
    orderNumber="#KND-20482"
    logoUrl="https://kindard.com/assets/img/kindard.svg"
    heroImageUrl="https://kindard.com/assets/img/movement_clothing.png"
    trackingUrl="https://kindard.com/orders/KND-20482"
    shopUrl="https://kindard.com/new-arrivals"
  />
);

// send `html` with your mail provider
```

## Important for email sending

- Replace local image paths with public HTTPS URLs.
- Keep CSS inline; do not rely on Bootstrap or external CSS files.
- SVG icons are inline, so no emoji icons are used.
- The layout uses React Email components and table-friendly sections for better inbox compatibility.

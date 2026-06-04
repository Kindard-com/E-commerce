<p align="center">
  <a href="https://www.medusajs.com">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://user-images.githubusercontent.com/59018053/229103275-b5e482bb-4601-46e6-8142-244f531cebdb.svg">
    <source media="(prefers-color-scheme: light)" srcset="https://user-images.githubusercontent.com/59018053/229103726-e5b529a3-9b3f-4970-8a1f-c6af37f087bf.svg">
    <img alt="Medusa logo" src="https://user-images.githubusercontent.com/59018053/229103726-e5b529a3-9b3f-4970-8a1f-c6af37f087bf.svg">
    </picture>
  </a>
</p>
<h1 align="center">
  Medusa
</h1>

<h4 align="center">
  <a href="https://docs.medusajs.com">Documentation</a> |
  <a href="https://www.medusajs.com">Website</a>
</h4>

<p align="center">
  Building blocks for digital commerce
</p>
<p align="center">
  <a href="https://github.com/medusajs/medusa/blob/master/CONTRIBUTING.md">
    <img src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat" alt="PRs welcome!" />
  </a>
    <a href="https://www.producthunt.com/posts/medusa"><img src="https://img.shields.io/badge/Product%20Hunt-%231%20Product%20of%20the%20Day-%23DA552E" alt="Product Hunt"></a>
  <a href="https://discord.gg/xpCwq3Kfn8">
    <img src="https://img.shields.io/badge/chat-on%20discord-7289DA.svg" alt="Discord Chat" />
  </a>
  <a href="https://twitter.com/intent/follow?screen_name=medusajs">
    <img src="https://img.shields.io/twitter/follow/medusajs.svg?label=Follow%20@medusajs" alt="Follow @medusajs" />
  </a>
</p>

## Compatibility

This starter is compatible with versions >= 2 of `@medusajs/medusa`. 

## Getting Started

Visit the [Quickstart Guide](https://docs.medusajs.com/learn/installation) to set up a server.

Visit the [Docs](https://docs.medusajs.com/learn/installation#get-started) to learn more about our system requirements.

## What is Medusa

Medusa is a set of commerce modules and tools that allow you to build rich, reliable, and performant commerce applications without reinventing core commerce logic. The modules can be customized and used to build advanced ecommerce stores, marketplaces, or any product that needs foundational commerce primitives. All modules are open-source and freely available on npm.

Learn more about [Medusa’s architecture](https://docs.medusajs.com/learn/introduction/architecture) and [commerce modules](https://docs.medusajs.com/learn/fundamentals/modules/commerce-modules) in the Docs.

## Community & Contributions

The community and core team are available in [GitHub Discussions](https://github.com/medusajs/medusa/discussions), where you can ask for support, discuss roadmap, and share ideas.

Join our [Discord server](https://discord.com/invite/medusajs) to meet other community members.

## Other channels

- [GitHub Issues](https://github.com/medusajs/medusa/issues)
- [Twitter](https://twitter.com/medusajs)
- [LinkedIn](https://www.linkedin.com/company/medusajs)
- [Medusa Blog](https://medusajs.com/blog/)

## Kindard Email System

This project is configured with a fully automated React Email + Nodemailer integration that sends order confirmations to customers directly from the backend.

### Environment variables

Make sure your backend `.env` contains:
```env
DOMAIN=kindard.com
FRONTEND_URL=https://kindard.com
SMTP_HOST=mail.privateemail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=orders@kindard.com
SMTP_PASS=YOUR_REAL_PASSWORD
MAIL_FROM="Kindard Orders <orders@kindard.com>"
MAIL_REPLY_TO=support@kindard.com
```
*Note: Never hardcode these inside the codebase, and do not put them in the Next.js frontend.*

### How automatic order emails work
When a customer places an order via the frontend, the `order.placed` subscriber (`src/subscribers/order-placed.ts`) executes. It queries the newly created order using the Medusa graph API, renders the React Email template (`src/emails/KindardOrderConfirmationEmail.tsx`), and uses Nodemailer to dispatch it.

### How to test email

**1. Using the Test CLI script**
You can run a local test email script without placing an order:
```bash
npm run test:email
# Or specify an email
tsx scripts/test-email.ts your@email.com
```

**2. Using the Admin Endpoint**
Send a POST request to the local backend:
```bash
curl -X POST http://localhost:9000/admin/test-email \
-H "Content-Type: application/json" \
-d '{"to": "your-email@example.com"}'
```

### Common SMTP problems & Debugging
- **Invalid login**: Double-check `SMTP_USER` and `SMTP_PASS` in your `.env`.
- **Connection timeouts**: PrivateEmail usually runs on port `587` with `SMTP_SECURE=false` (STARTTLS) or port `465` with `SMTP_SECURE=true`. If port `587` fails, try `465` and `SMTP_SECURE=true`.
- **Testing Locally**: Ensure the backend is running (`npm run dev`) and watch the terminal logs. The subscriber and the test script output detailed console logs without exposing the password.

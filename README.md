# Kindard E-commerce Platform

This repository contains the complete e-commerce architecture for Kindard Kids, split into three interconnected services:

1. **Kindard Cloud (CDN)** — Serves media and assets.
2. **Payload CMS + Next.js Storefront** — The main storefront and content management system.
3. **Medusa Backend** — The headless commerce engine managing products, orders, and checkout.

GitHub: [Kindard-com/E-commerce](https://github.com/Kindard-com/E-commerce) (public)

> **Security:** never commit real credentials. Copy values from `.env.example` into local `.env` files and rotate any secrets that were ever committed to git history.

---

## Proof (web app + SDK)

Captured from a live local run of the Next.js storefront (`:3000`) and Kindard Cloud CDN (`:3001`).

### Storefront

![Kindard homepage](docs/proof/storefront-home.png)

![New arrivals](docs/proof/storefront-new-arrivals.png)

![Product page](docs/proof/storefront-product.png)

### Payload admin + CDN

![Payload create first user](docs/proof/payload-admin.png)

![CDN health operational](docs/proof/cdn-health.png)

### Demo video

[Watch the storefront demo](docs/proof/kindard-storefront-demo.mp4)

<video src="docs/proof/kindard-storefront-demo.mp4" controls width="800"></video>

### SDK tests

```bash
pnpm install --frozen-lockfile
pnpm run test:unit    # Medusa JS SDK namespaces + product mapper
pnpm run test:sdk     # live smoke test against a running Medusa backend
```

Latest unit result: **3/3 passed** (`docs/proof/sdk-test.json`).

The storefront loads **live Medusa products** through `@medusajs/js-sdk`. The bag, checkout, and customer portal talk to the same backend. Fake catalog items are no longer sold.

---

## Start selling (local)

1. Copy `.env.example` → `.env` and `backend/.env.example` → `backend/.env`.
2. Start Postgres + Redis, then:

```bash
pnpm install --frozen-lockfile
pnpm --dir backend install
pnpm run seed:commerce
```

3. Copy the printed `NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY` and `NEXT_PUBLIC_MEDUSA_SALES_CHANNEL_ID` into `.env`.
4. Run the three services:

```bash
pnpm run dev
```

5. Shop at `http://localhost:3000`, manage products/orders at `http://localhost:9000/app`.

For live Mollie payments set `MOLLIE_API_KEY` in `backend/.env` (redirect URL is `/checkout/complete`). Without it, checkout still creates **real Medusa orders** via the system payment provider so you can operate locally.

---

---

## 🌍 Domain Architecture

When deploying to production, the services should be mapped to the following domains:

- **Storefront & CMS**: `https://kindard.com`
- **CDN (Kindard Cloud)**: `https://kindardcloud.com`
- **Commerce Backend (Medusa)**: `https://ad2.kcms.kopscore.com`

---

## 🚀 Installation & Deployment Guide

### Prerequisites
- Node.js 18+
- pnpm and npm installed
- Turso (LibSQL) database for Payload CMS & CDN
- PostgreSQL database for Medusa (e.g., Neon)
- Redis instance (for Medusa caching/events)

---

### 1. Deploying Kindard Cloud (CDN)
**Target Domain:** `kindardcloud.com`

Kindard Cloud is a high-performance CDN built to serve product images and assets.

**Local Setup:**
```bash
cd kindard-cloud
npm install
```

**Environment Variables (`kindard-cloud/.env`):**
```env
PORT=3001
TURSO_URL=libsql://your-database.turso.io
TURSO_AUTH_TOKEN=your_turso_token
```

**Production Deployment (Vercel / Node.js server):**
1. Point `kindardcloud.com` to your hosting provider.
2. Build and start the server:
```bash
npm run build
npm start
```
*Note: Ensure CORS is configured to allow requests from `kindard.com`.*

---

### 2. Deploying Medusa Backend
**Target Domain:** `ad2.kcms.kopscore.com`

Medusa handles all commerce logic, cart management, and payment integrations (Mollie/Stripe).

**Local Setup:**
```bash
cd backend
pnpm install
```

**Environment Variables (`backend/.env`):**
```env
PORT=9000
STORE_CORS=https://kindard.com
ADMIN_CORS=https://kindard.com,http://localhost:9000
AUTH_CORS=https://kindard.com,http://localhost:9000
JWT_SECRET=your_super_secret_jwt
COOKIE_SECRET=your_super_secret_cookie
DATABASE_URL=postgresql://user:password@host:5432/medusa?sslmode=require
REDIS_URL=redis://localhost:6379
```

**Production Deployment:**
1. Point `ad2.kcms.kopscore.com` to your Medusa hosting server (e.g., Railway, Render, DigitalOcean).
2. Run database migrations:
```bash
pnpm run db:migrate
```
3. Build and start the production server:
```bash
pnpm run build
pnpm run start
```
*The Medusa admin panel will be available at `https://ad2.kcms.kopscore.com/app`.*

---

### 3. Deploying Payload CMS + Next.js Storefront
**Target Domain:** `kindard.com`

This is the Next.js application that contains both the customer-facing storefront and the Payload CMS admin panel.

**Local Setup:**
```bash
# From the root directory
pnpm install --frozen-lockfile
```

**Environment Variables (`.env`):**
```env
# Payload CMS (local SQLite by default)
DATABASE_URL=file:./payload.db

# Medusa Connection
NEXT_PUBLIC_MEDUSA_BACKEND_URL=http://127.0.0.1:9000
NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=pk_from_medusa_api_key_table
NEXT_PUBLIC_MEDUSA_SALES_CHANNEL_ID=sc_from_sales_channel_table

# CDN Connection
CDN_BASE_URL=http://localhost:3001
```

**Production Deployment (Vercel / Netlify / Node server):**
1. Point `kindard.com` to your hosting provider.
2. Build the Next.js application:
```bash
npm run build
```
3. Start the application:
```bash
npm run start
```
*The Storefront will be at `https://kindard.com`.*
*The Payload Admin panel will be at `https://kindard.com/admin`.*

---

## 🛠 Useful Commands for Local Development

To run all three services simultaneously for local development, run the following command from the root directory:

```bash
pnpm run dev
```
*This starts Payload/storefront (port 3000), CDN (port 3001), and Medusa (port 9000) together.*

Medusa auto-installs backend dependencies and runs migrations when started via `scripts/run-medusa.sh`.

```bash
pnpm run test:unit
pnpm run test:sdk
```

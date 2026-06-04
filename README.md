# Kindard E-commerce Platform

This repository contains the complete e-commerce architecture for Kindard Kids, split into three interconnected services:

1. **Kindard Cloud (CDN)** — Serves media and assets.
2. **Payload CMS + Next.js Storefront** — The main storefront and content management system.
3. **Medusa Backend** — The headless commerce engine managing products, orders, and checkout.

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
TURSO_URL=libsql://kindard-cloud-kindard.aws-eu-west-1.turso.io
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
DATABASE_URL=postgresql://neondb_owner:.../neondb?sslmode=require
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
npm install
```

**Environment Variables (`.env`):**
```env
# Payload CMS
DATABASE_URI=libsql://kindard-e-commerce-kindard.aws-eu-west-1.turso.io
DATABASE_AUTH_TOKEN=your_turso_token
PAYLOAD_SECRET=your_payload_secret

# Medusa Connection
NEXT_PUBLIC_MEDUSA_BACKEND_URL=https://ad2.kcms.kopscore.com

# CDN Connection
NEXT_PUBLIC_CDN_URL=https://kindardcloud.com
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
npm run dev
```
*This utilizes concurrently to start Payload (port 3000), CDN (port 3001), and Medusa (port 9000) at the same time.*

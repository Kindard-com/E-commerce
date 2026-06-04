# Kindard Cloud CDN

A backend-only Next.js application that serves as a secure, domain-whitelisted CDN proxy. It stores image metadata, hashes, and domain permissions in a Turso database.

## Features

- **No Public UI**: This app acts as an API and proxy server only.
- **Image Hashing**: Generates unique cryptographic hashes for image URLs (`/img/[hash]`).
- **Domain Whitelisting**: Images can only be fetched by domains registered in the Turso database and explicitly permitted to access a specific image hash.
- **Request Validation**: Verifies `Origin` or `Referer` headers to block hotlinking.
- **Admin API**: Protected routes to register domains, register images, and update permissions.
- **Rate Limiting**: Includes a basic in-memory rate limiter.
- **Access Logs**: Records all fetch attempts asynchronously into the database.

## Prerequisites

- Node.js (v18+)
- Turso account & CLI (for database management)

## Setup Instructions

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Environment Variables**
   Copy the example environment file:
   ```bash
   cp .env.example .env.local
   ```
   Fill in the required variables:
   - `TURSO_DATABASE_URL`: Your Turso database connection URL (e.g., `libsql://your-db.turso.io`).
   - `TURSO_AUTH_TOKEN`: Your Turso access token.
   - `CDN_ADMIN_API_KEY`: A secure random string to protect your admin API endpoints.
   - `CDN_BASE_URL`: The base URL where this CDN will run (e.g., `http://localhost:3000` or `https://cdn.kindardcloud.com`).
   - `IMAGE_STORAGE_BASE_URL`: The origin URL where images are physically stored.

3. **Initialize the Database**
   Run the initialization script to create the necessary tables in Turso:
   ```bash
   npx tsx scripts/init-db.ts
   ```

4. **Run Locally**
   ```bash
   npm run dev
   ```

## Admin API Endpoints

All admin endpoints require an `Authorization` header with the format:
`Authorization: Bearer <CDN_ADMIN_API_KEY>`

### 1. Register a Domain
**POST `/api/domains/register`**
```json
{
  "domain": "kindard.com"
}
```

### 2. Register an Image
**POST `/api/images/register`**
```json
{
  "original_url": "https://storage.provider.com/path/to/image.jpg",
  "mime_type": "image/jpeg",
  "size_bytes": 102400
}
```

### 3. Grant Image Permissions to Domains
**POST `/api/images/permissions`**
```json
{
  "image_hash": "<hash_returned_from_register>",
  "domains": ["kindard.com"]
}
```

## Public Delivery Endpoints

The client must send a valid `Origin` or `Referer` header matching a permitted domain for the requested hash.

### 1. Standard Image Delivery (Legacy)
**GET `/img/[hash]`**

### 2. Generic Asset Delivery (CSS, JS, Media)
**GET `/asset/[hash]`**
Serves the file with the correct `Content-Type` and long-term caching (`Cache-Control: public, max-age=31536000, immutable`).

### 3. Forced Download
**GET `/dl/[hash]`**
Forces the browser to download the file using the `Content-Disposition: attachment` header. Cached for 1 day.

Example:
```bash
curl -H "Referer: https://kindard.com" http://localhost:3000/asset/<hash>
```

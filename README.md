# SAS Academy

SAS Academy is a MERN typing practice app with transcription, dictation, typing settings, WPM scoring, and admin tools.

## Production Build

Build the React client:

```bash
cd client
npm ci
npm run build
```

The deployable static output is created at `client/build`.

## Environment

Create `Server/.env` from `Server/.env.example`:

```bash
cp Server/.env.example Server/.env
```

Set these production values:

```bash
MONGO_URI=your-mongodb-uri
JWT_SECRET=your-long-random-secret
CLIENT_URLS=https://your-domain.com
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

Create the first admin account from environment variables:

```bash
cd Server
ADMIN_EMAIL=admin@example.com ADMIN_PASSWORD=change-this-password npm run create-admin
```

The public admin registration endpoint is disabled after the first admin exists unless `ALLOW_ADMIN_REGISTRATION=true`.

For root compose variables, copy `.env.example` to `.env` if needed:

```bash
cp .env.example .env
```

## Docker Local Run

This starts MongoDB, the Node API, and the production React/Nginx container:

```bash
docker compose up --build
```

Or use the root shortcut:

```bash
npm run docker:up
```

Open:

```text
http://localhost:8080
```

API health check:

```text
http://localhost:5000/api/health
```

## Docker Production Run

Use `docker-compose.prod.yml` when MongoDB is managed externally, such as MongoDB Atlas:

```bash
docker compose -f docker-compose.prod.yml up --build -d
```

Or:

```bash
npm run docker:prod
```

The client container serves the React app with Nginx and proxies:

```text
/api/*     -> server:5000
/uploads/* -> server:5000
```

SPA route refreshes are handled by Nginx and by the deploy files in `client/public`.

## Static Hosting

For Netlify:

- Build command: `npm run build`
- Publish directory: `client/build`
- Use `client/public/_redirects` for SPA fallback.

For Vercel:

- Root directory: `client`
- Build command: `npm run build`
- Output directory: `build`
- `client/vercel.json` handles SPA rewrites and headers.

## SEO

SEO metadata lives in:

- `client/public/index.html`
- `client/public/manifest.json`
- `client/public/robots.txt`
- `client/public/sitemap.xml`

Before launch, replace `https://sasacademy.in` with your final live domain if it differs.

# Backhauls.US Marketplace

Backhauls.US is a production-ready logistics marketplace that helps carriers monetize unused capacity and lets shippers secure
return trips instantly. The application recreates the original Backhauls demo while extending it with synchronized analytics,
API endpoints, Stripe-ready booking stubs, and infrastructure templates.

## Features

- **Interactive map** powered by [`react-simple-maps`](https://www.react-simple-maps.io/) and `framer-motion` with branded price
tags and animated markers.
- **Synchronized table + drawer** keeps map selections, tabular data, and booking details aligned with animated transitions.
- **Instant booking stub** primes Stripe integration and highlights verified carrier credentials.
- **Mock analytics dashboard** built for admins with actionable metrics, subscription upsells, and payout notices.
- **REST-style APIs** that surface listings and orders with Zod validation for new bookings.
- **Prisma schema** covering users, listings, orders, messaging, subscriptions, payouts, and disputes.
- **Docker & Compose** for local development with PostgreSQL and Redis plus GitHub Actions CI.

## Getting started

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Configure environment variables**

   ```bash
   cp .env.example .env.local
   ```

   Update database, Redis, Stripe, and auth credentials as needed.

3. **Run database migrations** (optional demo)

   ```bash
   npx prisma migrate dev
   ```

4. **Start the dev server**

   ```bash
   npm run dev
   ```

   Visit [http://localhost:3000](http://localhost:3000) to explore the marketplace.

## API surface

- `GET /api/listings` – returns the 20 demo listings used across the UI.
- `POST /api/orders` – validates an order payload with Zod and returns a mock order with timeline events.
- `GET /api/orders/:id` – retrieves tracking, ETA, and timeline for an existing mock order.

## Infrastructure

- **Dockerfile**: multi-stage build targeting Node.js 20 and Next.js standalone output.
- **docker-compose**: launches the Next app with PostgreSQL and Redis for local dev parity.
- **GitHub Actions**: CI workflow that installs dependencies, lints, and builds on pushes and PRs.

## Deployment

- **Frontend**: Deploy the Next.js app on [Vercel](https://vercel.com/) with the variables from `.env.example`.
- **Data services**: Provision PostgreSQL & Redis on [Railway](https://railway.app/) (or similar) and update connection strings.
- **Payments**: Enable Stripe test mode credentials and configure webhook delivery to `/api/orders` when wiring live payments.

## Extending the demo

- Replace the mocked auth with [NextAuth](https://next-auth.js.org/) or [Clerk](https://clerk.com/).
- Sync real Stripe payment intent webhooks to transition order state automatically.
- Stream driver pings with WebSockets or Server-Sent Events backed by BullMQ workers and Redis.
- Expand filters with bidding, auction mechanics, and subscription upsell flows.

## License

MIT

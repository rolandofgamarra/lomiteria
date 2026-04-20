# Lomiteria

Monorepo for the Lomiteria system:

- `src/` and `prisma/` contain the backend API.
- `apps/waiter-mobile/` contains the Expo mobile app.
- `apps/cashier-desktop/` contains the cashier desktop web app.
- `CatalogoPrecios/` contains menu catalog images.

## Requirements

- Node.js 20+ recommended
- npm
- SQLite is used by the current Prisma schema

## Project Structure

- Backend API: Express + Prisma + Socket.IO + JWT
- Mobile app: Expo + React Native + Zustand + Axios

## Backend Setup

From the repository root:

```bash
npm install
npm run prisma:generate
npm run db:migrate
npm run db:seed
npm run dev
```

The API listens on `PORT` and defaults to `3000`.

## Backend Environment

Create a `.env` file in the repository root if you want to override the defaults:

```env
PORT=3000
JWT_SECRET=change-me
DATABASE_URL=file:./dev.db
CORS_ORIGINS=*
SOCKET_CORS_ORIGINS=*
```

Defaults are defined in [`src/config/env.ts`](./src/config/env.ts).

## Mobile App Setup

From `apps/waiter-mobile/`:

```bash
npm install
npm start
```

To point the app at a different backend, set Expo public env vars:

```env
EXPO_PUBLIC_BASE_URL=http://localhost:3000
EXPO_PUBLIC_SOCKET_URL=http://localhost:3000
```

If you are testing on a physical device, use a reachable LAN IP or `npm run start:tunnel`.

## Cashier Desktop App

From `apps/cashier-desktop/`:

```bash
npm install
npm run dev
```

Set the API URL when the backend is not running on localhost:

```env
VITE_API_URL=http://localhost:3000
```

The cashier app is the only place where income analytics are shown. It includes:

- weekly revenue
- monthly revenue
- active orders
- payment processing

Demo cashier credentials:

- `cashier1`
- `zarf123`

## Seed Data

The seed script creates:

- `admin` user with password `zarf123`
- `cashier1` user with password `zarf123`
- `waiter1` user with password `zarf123`
- default tables, categories, products, and extras

Run the seed again after resetting the database if you want the demo data restored.

## Useful Scripts

Backend scripts in the root `package.json`:

- `npm run dev` runs the API with file watching.
- `npm start` runs the API once without watching.
- `npm run prisma:generate` regenerates Prisma Client.
- `npm run db:migrate` applies migrations in development.
- `npm run db:deploy` applies migrations in production.
- `npm run db:seed` loads the demo data.

## Deployment Notes

See [`DEPLOYMENT.md`](./DEPLOYMENT.md) for production and hosting notes.

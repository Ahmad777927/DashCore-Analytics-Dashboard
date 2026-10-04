# DashCore — Analytics Dashboard

A full-stack analytics dashboard for revenue, customers, orders and team management. React (Vite) single-page app on the front end, Express + MongoDB API on the back end, with JWT authentication delivered via `httpOnly` cookies.

**Repository:** https://github.com/Ahmad777927/DashCore-Analytics-Dashboard

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Available Scripts](#available-scripts)
- [API Reference](#api-reference)
- [Authentication & Security](#authentication--security)
- [Frontend Routes](#frontend-routes)
- [Development Notes](#development-notes)
- [Production Build & Deployment](#production-build--deployment)
- [Troubleshooting](#troubleshooting)

---

## Features

### Frontend
- **Dashboard overview** with stat cards, quick actions, recent activity and a lazily-loaded revenue chart (Recharts)
- **Customers & Orders** — full CRUD tables backed by MongoDB, merged with a built-in seed dataset
- **Customer detail view**, transactions, analytics, reports, team, billing, health and settings pages
- **Authentication flows** — signup, login (by username *or* email), logout, forgot/reset password
- **Route-level code splitting** — every page and the chart are `React.lazy` chunks
- **Global command palette** (`⌘K` / `Ctrl+K`) for fast navigation
- **Dark / light theme** applied before first paint (no flash of wrong theme)
- **Protected / guest routes** with an auth context that reacts to `401` responses (auto-logout on expired cookie)
- **React Query** for data fetching with sensible `staleTime`, retry and refetch policies
- **Toasts** (react-hot-toast), modals, error boundary and loading screens

### Backend
- **REST API** under `/api` — auth, customers, orders, password reset, health
- **JWT auth in httpOnly cookies** (`dashcore_token`) — no token storage in `localStorage`
- **Input validation** with `express-validator` (password strength, email, money formats, enums)
- **Security hardening**: `helmet` (CSP, etc.), CORS scoped to `/api` with credentials, JSON body limit (`100kb`), `trust proxy` for reverse proxies
- **Rate limiting**: 100 req / 15 min on auth endpoints, stricter 15 req / 15 min on password-reset endpoints
- **Password hashing** with bcrypt (12 rounds) via Mongoose pre-save hook
- **Password-reset emails** via nodemailer/SMTP — falls back to logging the reset link to the console when SMTP is not configured
- **Seed/demo data** served read-only and merged with real MongoDB records (user-created records come first)
- **Graceful shutdown** (SIGINT/SIGTERM → close server → disconnect MongoDB)
- **Serves the built SPA** in production with an SPA fallback to `index.html`

## Tech Stack

| Layer      | Technology |
|------------|------------|
| Frontend   | React 19, Vite 8, React Router 7, TanStack Query 5, Recharts 3, Tailwind CSS 4, lucide-react, react-hot-toast |
| Backend    | Node.js (ESM), Express 4, Mongoose 8, JSONWebToken, bcryptjs, express-validator, express-rate-limit, helmet, cors, cookie-parser, morgan, nodemailer |
| Database   | MongoDB (Atlas or local) |
| Linting    | Oxlint |
| Dev tooling| `concurrently` (run web + API together) |

## Project Structure

```
dashboard/
├── index.html                 # SPA entry (pre-paint theme script)
├── vite.config.js             # Vite config + /api dev proxy → :5001
├── tailwind.config.js
├── postcss.config.js
├── package.json               # Frontend deps + combined scripts
├── public/                    # favicon.svg, icons.svg
├── src/                       # React application
│   ├── App.jsx                # Providers, router, dashboard overview
│   ├── main.jsx
│   ├── components/            # Sidebar, Navbar, StatCard, GlobalSearch, …
│   ├── context/               # Auth, Data, Search, Theme contexts
│   ├── pages/                 # Login, Customers, Orders, Analytics, …
│   │   └── customer-details/  # CustomerDetailsPage
│   ├── services/api.js        # fetch wrapper (credentials: include)
│   └── utils/                 # format.js, searchIndex.js
└── server/                    # Express API
    ├── .env                   # Secrets (git-ignored)
    ├── .env.example           # Documented template
    ├── src/
    │   ├── index.js           # Bootstrap, graceful shutdown
    │   ├── app.js             # createApp() — middleware + routes
    │   ├── config/db.js       # Mongo connection
    │   ├── routes/            # auth, customers, orders, passwordReset
    │   ├── controllers/       # Route handlers
    │   ├── middleware/        # protect (JWT), validate, errorHandler
    │   ├── models/            # User, Customer, Order, PasswordReset
    │   ├── data/seedData.js   # Built-in demo dataset
    │   ├── utils/             # mailer, token, demoFeed
    │   └── scripts/           # resetPassword.js, migrateUsers.js
    └── tmp-purge3.mjs         # One-off dev DB cleanup script
```

## Prerequisites

- **Node.js** 18+ (20+ recommended)
- **npm** 9+
- **MongoDB** — a free [MongoDB Atlas](https://www.mongodb.com/atlas) cluster or a local `mongod`

## Getting Started

```bash
# 1. Clone the repository
git clone https://github.com/Ahmad777927/DashCore-Analytics-Dashboard.git
cd dashboard

# 2. Install frontend dependencies
npm install

# 3. Install backend dependencies
npm --prefix server install

# 4. Configure the server environment
cp server/.env.example server/.env
#    then edit server/.env (at minimum set MONGO_URI and JWT_SECRET)

# 5. Run both frontend and API together
npm run dev:all
```

- Frontend (Vite): **http://localhost:5173**
- API (Express): **http://localhost:5001**
- In development Vite proxies `/api/*` to the Express server, so the auth cookie stays same-origin (no CORS friction).

To run them separately:

```bash
npm run dev          # frontend only
npm run server:dev   # API only (node --watch)
```

## Environment Variables

All configuration lives in `server/.env` (git-ignored; see `server/.env.example`):

| Variable            | Required | Description |
|---------------------|----------|-------------|
| `NODE_ENV`          | no       | `development` / `production` / `test` |
| `PORT`              | no       | API port (default `5001`) |
| `MONGO_URI`         | **yes**  | MongoDB connection string |
| `JWT_SECRET`        | **yes**  | Long random secret for signing tokens |
| `JWT_EXPIRES_IN`    | no       | Token lifetime, e.g. `7d` |
| `CLIENT_URL`        | no       | Allowed CORS origin(s), comma-separated (default `http://localhost:5173`) |
| `COOKIE_NAME`       | no       | Auth cookie name (default `dashcore_token`) |
| `COOKIE_SECURE`     | no       | `true` in production (HTTPS) |
| `COOKIE_SAME_SITE`  | no       | `lax` / `strict` / `none` |
| `APP_URL`           | no       | Base URL for password-reset links |
| `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_USER`, `SMTP_PASS`, `MAIL_FROM` | no | SMTP settings for reset emails. If `SMTP_HOST` is unset, reset links are logged to the server console instead |

> **Never commit `server/.env` or `server/.env.bak`** — both are git-ignored. Only `.env.example` is tracked.

## Available Scripts

### Root (frontend + combined)

| Script | Command | Description |
|--------|---------|-------------|
| `npm run dev` | `vite` | Start Vite dev server on :5173 |
| `npm run build` | `vite build` | Build SPA into `dist/` |
| `npm run preview` | `vite preview` | Preview the production build |
| `npm run lint` | `oxlint` | Lint the frontend |
| `npm run dev:all` | `concurrently …` | Run frontend + API together |
| `npm run server` / `npm start` | `npm --prefix server run start` | Start the API (production) |
| `npm run server:dev` | `npm --prefix server run dev` | Start the API with `--watch` |

### Server (`npm --prefix server run <script>`)

| Script | Description |
|--------|-------------|
| `start` | `node src/index.js` |
| `dev` | `node --watch src/index.js` |
| `reset-password` | `node src/scripts/resetPassword.js <email-or-username> [newPassword]` — reset a user's password from the CLI |
| `migrate:users` | `node src/scripts/migrateUsers.js` — user document migration helper |



## API Reference

Base URL: `/api` (proxied in dev, same-origin in production). All responses are JSON of the shape `{ success, message, … }`.

### Health

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/health` | — | Liveness check `{ status: 'ok', uptime }` |

### Authentication — `/api/auth`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/signup` | — | Create account. Body: `name`, `username`, `email`, `password`, optional `role` (`Administrator` \| `Manager` \| `Member`) |
| POST | `/api/auth/login` | — | Body: `identifier` (username **or** email), `password`. Sets the auth cookie |
| POST | `/api/auth/logout` | — | Clears the auth cookie |
| GET | `/api/auth/me` | ✅ | Current user profile |
| PATCH | `/api/auth/me` | ✅ | Update own `name`, `email`, `department` |
| POST | `/api/auth/forgot-password` | — | Starts a reset (rate-limited). Always returns a generic message (no account enumeration) |
| GET | `/api/auth/reset-password/:token` | — | Verify a reset token |
| POST | `/api/auth/reset-password/:token` | — | Set a new `password` (`confirm` required) |

**Password policy:** minimum 8 characters with at least one lowercase letter, one uppercase letter and one digit. Usernames: 3–30 chars, `a-z 0-9 _ .` only.

### Customers — `/api/customers` (all require auth)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/customers` | List customers (seed + DB records) |
| POST | `/api/customers` | Create — `name`, `email` required; `status` (`Active`/`Inactive`), `joined`, `spend`, `company`, `phone` optional |
| PATCH | `/api/customers/:id` | Partial update |
| DELETE | `/api/customers/:id` | Delete |

### Orders — `/api/orders` (all require auth)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/orders` | List orders (seed + DB records) |
| POST | `/api/orders` | Create — `customer` required; `id`, `date`, `total`, `status` (`Completed`/`Pending`/`Review`/`Failed`) optional |
| PATCH | `/api/orders/:id` | Partial update |
| DELETE | `/api/orders/:id` | Delete |

Money fields are stored as plain numeric strings (`"1234.56"`); the UI formats them as currency.

## Authentication & Security

- **Stateless JWT in an `httpOnly` cookie** — not readable from JS, sent automatically with `credentials: 'include'`
- **bcrypt** hashing (12 rounds) in a Mongoose pre-save hook
- **helmet** with a tailored CSP (allows inline styles for Recharts, `data:`/`blob:`/https images) and `crossOriginEmbedderPolicy` disabled
- **CORS** only on `/api`, only for origins in `CLIENT_URL`, with `credentials: true`; HTML navigations bypass CORS by design
- **Rate limits**: 100 req/15 min on `/api/auth` (auth routes), 15 req/15 min on password-reset routes
- **Validation** on every write endpoint; unknown `/api/*` routes return a JSON 404 before the SPA fallback
- **Body size limit** of 100 KB
- **401 broadcast** — the client dispatches `auth:unauthorized`, and `AuthContext` logs the user out when the cookie expires
- **`trust proxy`** enabled so secure cookies work behind Render/Heroku/Nginx

## Frontend Routes

| Route | Access | Page |
|-------|--------|------|
| `/login`, `/signup` | Guest only | Auth pages |
| `/forgot-password` | Public | Request reset email |
| `/reset-password/:token` | Public | Set a new password |
| `/` | Protected | Dashboard overview |
| `/customers`, `/customers/:id` | Protected | Customer list & detail |
| `/orders` | Protected | Orders table |
| `/transactions` | Protected | Transactions |
| `/analytics` | Protected | Analytics |
| `/reports` | Protected | Reports |
| `/team` | Protected | Team management |
| `/billing` | Protected | Billing |
| `/health` | Protected | System health |
| `/settings` | Protected | Settings (profile, theme) |
| `/help` | Protected | Help center |
| `*` | — | Redirects to `/` |


## Development Notes

- **Seed data** — customers/orders returned by the API combine a built-in demo dataset (`server/src/data/seedData.js`) with real MongoDB records. DB records are returned first, so newly added records appear at the top of the table. Demo rows use numeric / `ORD-n` display IDs that can be edited or hidden without touching the seed file. No third-party data services are involved.
- **Dev proxy** — `vite.config.js` proxies `/api` → `http://localhost:5001` so cookies are same-origin in development. If you change `PORT`, update the proxy target too.
- **Linting** — `npm run lint` runs Oxlint; config in `.oxlintrc.json`.
- **One-off scripts** — `server/tmp-purge3.mjs` is a development-only database cleanup utility (deletes demo/test records). It is not part of the running app.
- **`server/.env.bak`** — a local backup of env values; git-ignored, do not commit.
- **API client** — `src/services/api.js` is a thin `fetch` wrapper. It uses `VITE_API_URL` if set (for cross-origin setups); otherwise a relative path works in both dev (proxy) and production (same process).

## Production Build & Deployment

```bash
# 1. Build the SPA
npm run build            # outputs to dist/

# 2. Start the API — it serves dist/ automatically when present
npm start
```

`server/src/app.js` serves static files from `dist/` and falls back to `index.html` for any non-API GET, so a single Node process hosts both the API and the SPA.

Deployment checklist:

- Set `NODE_ENV=production`, `COOKIE_SECURE=true`, and `JWT_SECRET` to a strong random value
- Set `CLIENT_URL` to your public origin(s) and `APP_URL` for reset links
- Ensure the platform is behind a proxy (`trust proxy` is already set) and uses HTTPS
- Configure SMTP (or accept console-logged reset links in development)

## Troubleshooting

| Problem | Fix |
|---------|-----|
| `Port 5001 is already in use` | Set a different `PORT` in `server/.env` **and** update the Vite proxy target |
| Cookie not sent / CORS errors | Confirm `CLIENT_URL` matches the exact origin you're browsing (including port) |
| Reset email not sent | Leave `SMTP_HOST` unset in dev — the reset link is printed to the server console |
| 401s right after login | Cookie rejected — check `COOKIE_SECURE` (must be `false` on plain-HTTP localhost) and `COOKIE_SAME_SITE` |
| Mongo connection failure | Verify `MONGO_URI` and network access (Atlas IP allow-list) |
| Need to reset someone's password | `npm --prefix server run reset-password -- <email-or-username>` |

## License

Private — all rights reserved.


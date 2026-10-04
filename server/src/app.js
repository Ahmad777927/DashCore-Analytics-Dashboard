import path from 'node:path';
import { fileURLToPath } from 'node:url';
import fs from 'node:fs';

import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';

import authRoutes from './routes/authRoutes.js';
import customerRoutes from './routes/customerRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import passwordResetRoutes from './routes/passwordResetRoutes.js';
import { notFound, errorHandler } from './middleware/errorHandler.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path to the Vite build output (../.. = project root / dist)
const CLIENT_DIST = path.resolve(__dirname, '../../dist');

export function createApp() {
  const app = express();

  // Behind a proxy (Render/Heroku/Nginx) so secure cookies work correctly.
  app.set('trust proxy', 1);

  // ---------- Security ----------
  app.use(
    helmet({
      // The SPA needs inline styles (recharts) and data/blob images.
      contentSecurityPolicy: {
        useDefaults: true,
        directives: {
          'default-src': ["'self'"],
          'script-src': ["'self'"],
          'style-src': ["'self'", "'unsafe-inline'"],
          'img-src': ["'self'", 'data:', 'blob:', 'https:'],
          'font-src': ["'self'", 'data:'],
          'connect-src': ["'self'", ...allowedOrigins()],
        },
      },
      crossOriginEmbedderPolicy: false,
    })
  );

  // ---------- CORS (credentials required for cookie auth) ----------
  // Scoped to /api: the SPA is same-origin (Vite proxy in dev, Express in
  // production), so HTML navigations must never be evaluated by CORS.
  // Unknown origins simply receive no CORS headers — browsers enforce
  // that on their side, so the request itself still succeeds.
  const origins = allowedOrigins();
  app.use(
    '/api',
    cors({
      origin(origin, callback) {
        // Allow same-origin / non-browser tools (curl, health checks)
        if (!origin || origins.includes(origin)) return callback(null, true);
        return callback(null, false);
      },
      credentials: true,
    })
  );

  // ---------- Parsers & logging ----------
  app.use(express.json({ limit: '100kb' }));
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());
  if (process.env.NODE_ENV !== 'test') {
    app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));
  }

  // ---------- Rate limiting on auth endpoints ----------
  const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // per IP
    standardHeaders: true,
    legacyHeaders: false,
    message: {
      success: false,
      message: 'Too many attempts. Please try again later.',
    },
  });

  // ---------- API routes ----------
  app.get('/api/health', (_req, res) => {
    res.json({ success: true, status: 'ok', uptime: process.uptime() });
  });

  // Password-reset (JSON). Mounted before authLimiter so only its own
  // stricter limiter (defined in the router) applies to these routes.
  app.use('/api/auth', passwordResetRoutes);

  app.use('/api/auth', authLimiter, authRoutes);

  // Dashboard data (customers/orders persist in Mongo and merge with the
  // read-only demo feed that seeds the tables).
  app.use('/api/customers', customerRoutes);
  app.use('/api/orders', orderRoutes);

  // Unknown API route -> JSON 404 (must stay before the SPA fallback)
  app.all('/api/*', notFound);

  // ---------- Serve the built SPA in production ----------
  if (fs.existsSync(CLIENT_DIST)) {
    app.use(express.static(CLIENT_DIST));

    // SPA fallback: any non-API GET returns index.html
    app.get('*', (req, res, next) => {
      if (req.path.startsWith('/api')) return next();
      return res.sendFile(path.join(CLIENT_DIST, 'index.html'));
    });
  }

  // ---------- Errors ----------
  app.use(notFound);
  app.use(errorHandler);

  return app;
}

/**
 * Parse the CLIENT_URL env (comma separated) into a clean list.
 */
function allowedOrigins() {
  return String(process.env.CLIENT_URL || 'http://localhost:5173')
    .split(',')
    .map((o) => o.trim())
    .filter(Boolean);
}

/**
 * 404 handler for unknown API routes.
 */
export function notFound(req, res) {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
}

/**
 * Central error handler. Keeps the API response shape consistent and
 * avoids leaking internals in production.
 */
// eslint-disable-next-line no-unused-vars
export function errorHandler(err, req, res, _next) {
  let status = err.statusCode || err.status || 500;
  let message = err.message || 'Internal server error';

  // Mongoose validation errors -> 422
  if (err.name === 'ValidationError') {
    status = 422;
    message = Object.values(err.errors)
      .map((e) => e.message)
      .join(', ');
  }

  // Duplicate key (unique index) -> 409
  if (err.code === 11000) {
    status = 409;
    const field = Object.keys(err.keyValue || {})[0] || 'field';
    message = `That ${field} is already registered`;
  }

  // Invalid ObjectId -> 400
  if (err.name === 'CastError') {
    status = 400;
    message = 'Invalid identifier';
  }

  if (status >= 500) {
    console.error('💥 Unhandled error:', err);
  }

  res.status(status).json({
    success: false,
    message,
    ...(process.env.NODE_ENV !== 'production' && status >= 500
      ? { stack: err.stack }
      : {}),
  });
}

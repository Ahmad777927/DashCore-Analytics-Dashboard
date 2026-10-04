import User from '../models/User.js';
import { COOKIE_NAME, verifyToken } from '../utils/token.js';

/**
 * Extract a JWT from either the httpOnly cookie or a Bearer header.
 */
function extractToken(req) {
  if (req.cookies?.[COOKIE_NAME]) return req.cookies[COOKIE_NAME];

  const header = req.headers.authorization || '';
  if (header.startsWith('Bearer ')) return header.slice(7);

  return null;
}

/**
 * Protect a route. Requires a valid token and an existing user.
 */
export async function protect(req, res, next) {
  try {
    const token = extractToken(req);

    if (!token) {
      return res.status(401).json({ success: false, message: 'Not authenticated' });
    }

    let decoded;
    try {
      decoded = verifyToken(token);
    } catch {
      return res.status(401).json({ success: false, message: 'Session expired or invalid' });
    }

    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ success: false, message: 'User no longer exists' });
    }

    req.user = user;
    return next();
  } catch (err) {
    return next(err);
  }
}

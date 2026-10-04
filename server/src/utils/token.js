import jwt from 'jsonwebtoken';

const COOKIE_NAME = process.env.COOKIE_NAME || 'dashcore_token';

/**
 * Build a signed JWT for a user id.
 */
export function signToken(userId) {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error('JWT_SECRET is not configured');

  return jwt.sign({ id: userId }, secret, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
}

/**
 * Verify a JWT and return its decoded payload.
 */
export function verifyToken(token) {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error('JWT_SECRET is not configured');
  return jwt.verify(token, secret);
}

/**
 * Cookie options shared by the setter and the clearer.
 * In production (cross-site, https) we need secure + sameSite=none.
 */
export function cookieOptions() {
  const sameSite = process.env.COOKIE_SAME_SITE || 'lax';
  const secure = String(process.env.COOKIE_SECURE) === 'true' || sameSite === 'none';

  return {
    httpOnly: true,
    secure,
    sameSite,
    path: '/',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  };
}

/**
 * Attach the auth cookie to the response.
 */
export function setAuthCookie(res, token) {
  res.cookie(COOKIE_NAME, token, cookieOptions());
}

/**
 * Remove the auth cookie from the response.
 */
export function clearAuthCookie(res) {
  const { maxAge: _maxAge, ...rest } = cookieOptions();
  res.clearCookie(COOKIE_NAME, { ...rest, maxAge: undefined });
}

export { COOKIE_NAME };

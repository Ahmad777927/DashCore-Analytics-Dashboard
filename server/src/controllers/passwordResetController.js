import User from '../models/User.js';
import PasswordReset, { RESET_TOKEN_TTL_MS } from '../models/PasswordReset.js';
import { sendPasswordResetEmail, appBaseUrl } from '../utils/mailer.js';

const RESET_MINUTES = RESET_TOKEN_TTL_MS / 60000;

const INVALID_LINK_MESSAGE =
  'This reset link is invalid or has expired. Please request a new one.';

/** Same rules as signup, kept in sync with authRoutes' passwordRule. */
function passwordProblem(value) {
  const v = String(value || '');
  if (v.length < 8) return 'Password must be at least 8 characters';
  if (!/[a-z]/.test(v)) return 'Password must contain a lowercase letter';
  if (!/[A-Z]/.test(v)) return 'Password must contain an uppercase letter';
  if (!/\d/.test(v)) return 'Password must contain a number';
  return null;
}

/**
 * POST /api/auth/forgot-password
 * Always reports success (even for unknown emails) to avoid user enumeration.
 */
export async function requestPasswordReset(req, res, next) {
  try {
    const email = String(req.body.email || '').trim().toLowerCase();

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res
        .status(400)
        .json({ success: false, message: 'Please enter a valid email address' });
    }

    const user = await User.findOne({ email });

    if (user) {
      // One live token at a time — a new request invalidates the old link.
      await PasswordReset.deleteMany({ user: user._id, usedAt: null });

      const rawToken = PasswordReset.generateRawToken();
      await PasswordReset.create({
        user: user._id,
        tokenHash: PasswordReset.hashToken(rawToken),
        expiresAt: new Date(Date.now() + RESET_TOKEN_TTL_MS),
      });

      const resetUrl = `${appBaseUrl()}/reset-password/${rawToken}`;
      await sendPasswordResetEmail({
        to: user.email,
        name: user.name,
        resetUrl,
        expiresMinutes: RESET_MINUTES,
      });
    }

    // Identical response whether or not the account exists.
    return res.json({
      success: true,
      message: `If an account exists for that address, a reset link is on its way. The link is valid for ${RESET_MINUTES} minutes.`,
    });
  } catch (err) {
    return next(err);
  }
}

/**
 * GET /api/auth/reset-password/:token
 * Lets the React page verify the link before showing the form.
 */
export async function verifyResetToken(req, res, next) {
  try {
    const rawToken = String(req.params.token || '');
    const record = await PasswordReset.findOne({
      tokenHash: PasswordReset.hashToken(rawToken),
    });

    if (!record || !record.isUsable()) {
      return res
        .status(400)
        .json({ success: false, message: INVALID_LINK_MESSAGE });
    }

    return res.json({ success: true });
  } catch (err) {
    return next(err);
  }
}

/**
 * POST /api/auth/reset-password/:token
 * Applies the new password, burns the token, and confirms.
 */
export async function applyNewPassword(req, res, next) {
  try {
    const rawToken = String(req.params.token || '');
    const { password, confirm } = req.body;

    const fail = (message) =>
      res.status(400).json({ success: false, message });

    const problem = passwordProblem(password);
    if (problem) return fail(problem);

    if (password !== confirm) {
      return fail('Passwords do not match');
    }

    const record = await PasswordReset.findOne({
      tokenHash: PasswordReset.hashToken(rawToken),
    });

    if (!record || !record.isUsable()) {
      return fail(INVALID_LINK_MESSAGE);
    }

    const user = await User.findById(record.user);
    if (!user) {
      return fail('This account no longer exists.');
    }

    // Triggers the pre('save') bcrypt hash in User.js.
    user.password = password;
    await user.save();

    // Burn this token and any other outstanding ones for the user.
    await PasswordReset.updateMany(
      { user: user._id, usedAt: null },
      { $set: { usedAt: new Date() } }
    );

    return res.json({
      success: true,
      message: 'Your password has been updated.',
      email: user.email,
    });
  } catch (err) {
    return next(err);
  }
}

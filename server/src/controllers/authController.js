import User from '../models/User.js';
import {
  setAuthCookie,
  clearAuthCookie,
  signToken,
} from '../utils/token.js';

/**
 * POST /api/auth/signup
 * Creates a new account and immediately signs the user in.
 */
export async function signup(req, res, next) {
  try {
    const { name, username, email, password, role } = req.body;

    const existing = await User.findOne({
      $or: [{ email: email.toLowerCase() }, { username: username.toLowerCase() }],
    });

    if (existing) {
      const field = existing.email === email.toLowerCase() ? 'email' : 'username';
      return res
        .status(409)
        .json({ success: false, message: `That ${field} is already registered` });
    }

    const user = await User.create({
      name,
      username,
      email,
      password,
      role: role || 'Administrator',
    });

    const token = signToken(user._id);
    setAuthCookie(res, token);

    return res.status(201).json({
      success: true,
      message: 'Account created successfully',
      token,
      user: user.toSafeObject(),
    });
  } catch (err) {
    return next(err);
  }
}

/**
 * POST /api/auth/login
 * Accepts either a username or an email in the `identifier` field.
 */
export async function login(req, res, next) {
  try {
    const { identifier, password } = req.body;

    const value = String(identifier).toLowerCase().trim();

    const user = await User.findOne({
      $or: [{ email: value }, { username: value }],
    }).select('+password');

    // Same generic message for both cases to avoid user enumeration.
    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: 'Invalid credentials' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res
        .status(401)
        .json({ success: false, message: 'Invalid credentials' });
    }

    const token = signToken(user._id);
    setAuthCookie(res, token);

    return res.status(200).json({
      success: true,
      message: 'Logged in successfully',
      token,
      user: user.toSafeObject(),
    });
  } catch (err) {
    return next(err);
  }
}

/**
 * PATCH /api/auth/me
 * Updates the signed-in user's own profile.
 *
 * `role` is intentionally not accepted here: letting a member raise their own
 * permission level would be a privilege-escalation hole, so roles stay
 * managed at the workspace level.
 */
export async function updateMe(req, res, next) {
  try {
    const { name, email, department } = req.body;
    const user = req.user;

    if (email && email.toLowerCase() !== user.email) {
      const taken = await User.findOne({
        email: email.toLowerCase(),
        _id: { $ne: user._id },
      });
      if (taken) {
        return res
          .status(409)
          .json({ success: false, message: 'That email is already registered' });
      }
      user.email = email;
    }

    if (name !== undefined) user.name = name;
    if (department !== undefined) user.department = department;

    await user.save();

    return res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      user: user.toSafeObject(),
    });
  } catch (err) {
    return next(err);
  }
}

/**
 * POST /api/auth/logout
 * Clears the auth cookie.
 */
export async function logout(_req, res) {
  clearAuthCookie(res);
  return res.status(200).json({ success: true, message: 'Logged out successfully' });
}

/**
 * GET /api/auth/me
 * Returns the currently authenticated user (cookie based).
 */
export async function getMe(req, res) {
  return res.status(200).json({
    success: true,
    user: req.user.toSafeObject(),
  });
}

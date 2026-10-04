import { Router } from 'express';
import rateLimit from 'express-rate-limit';

import {
  requestPasswordReset,
  verifyResetToken,
  applyNewPassword,
} from '../controllers/passwordResetController.js';

const router = Router();

// Stricter budget for password-reset requests (email sends are costly).
const resetLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 15,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many reset requests. Please wait 15 minutes and try again.',
  },
});

// JSON API consumed by the React forgot/reset password pages.
router.post('/forgot-password', resetLimiter, requestPasswordReset);
router.get('/reset-password/:token', resetLimiter, verifyResetToken);
router.post('/reset-password/:token', resetLimiter, applyNewPassword);

export default router;

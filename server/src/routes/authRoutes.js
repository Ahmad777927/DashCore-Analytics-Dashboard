import { Router } from 'express';
import { body } from 'express-validator';

import {
  signup,
  login,
  logout,
  getMe,
  updateMe,
} from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';

const router = Router();

const passwordRule = body('password')
  .isLength({ min: 8 })
  .withMessage('Password must be at least 8 characters')
  .matches(/[a-z]/)
  .withMessage('Password must contain a lowercase letter')
  .matches(/[A-Z]/)
  .withMessage('Password must contain an uppercase letter')
  .matches(/\d/)
  .withMessage('Password must contain a number');

router.post(
  '/signup',
  [
    body('name')
      .trim()
      .isLength({ min: 2, max: 60 })
      .withMessage('Name must be between 2 and 60 characters'),
    body('username')
      .trim()
      .toLowerCase()
      .isLength({ min: 3, max: 30 })
      .withMessage('Username must be between 3 and 30 characters')
      .matches(/^[a-z0-9_.]+$/)
      .withMessage('Username can only contain letters, numbers, "_" and "."'),
    body('email')
      .trim()
      .toLowerCase()
      .isEmail()
      .withMessage('Please provide a valid email address')
      .normalizeEmail(),
    passwordRule,
    body('role')
      .optional()
      .isIn(['Administrator', 'Manager', 'Member'])
      .withMessage('Invalid role'),
  ],
  validate,
  signup
);

router.post(
  '/login',
  [
    body('identifier')
      .trim()
      .notEmpty()
      .withMessage('Username or email is required'),
    body('password').notEmpty().withMessage('Password is required'),
  ],
  validate,
  login
);

router.post('/logout', logout);

router.get('/me', protect, getMe);

router.patch(
  '/me',
  protect,
  [
    body('name')
      .optional()
      .trim()
      .isLength({ min: 2, max: 60 })
      .withMessage('Name must be between 2 and 60 characters'),
    body('email')
      .optional()
      .trim()
      .toLowerCase()
      .isEmail()
      .withMessage('Please provide a valid email address')
      .normalizeEmail(),
    body('department')
      .optional()
      .trim()
      .isLength({ max: 80 })
      .withMessage('Department cannot exceed 80 characters'),
  ],
  validate,
  updateMe
);

export default router;

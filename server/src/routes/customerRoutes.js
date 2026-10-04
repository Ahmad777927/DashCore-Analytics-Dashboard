import { Router } from 'express';
import { body, param } from 'express-validator';

import {
  listCustomers,
  createCustomer,
  updateCustomer,
  deleteCustomer,
} from '../controllers/customerController.js';
import { protect } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { isMoney } from '../utils/demoFeed.js';

const router = Router();

// Dashboard data — only signed-in users can read or change it.
router.use(protect);

/* Rule factories: a fresh chain per route (`.optional()` mutates the chain,
   so shared instances must never be reused across routes). */

const nameRule = (optional = false) => {
  const chain = body('name');
  if (optional) chain.optional();
  return chain
    .trim()
    .isLength({ min: 2, max: 120 })
    .withMessage('Name must be between 2 and 120 characters');
};

const emailRule = (optional = false) => {
  const chain = body('email');
  if (optional) chain.optional();
  return chain
    .trim()
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail();
};

const statusRule = () =>
  body('status')
    .optional()
    .isIn(['Active', 'Inactive'])
    .withMessage('Status must be Active or Inactive');

const maxRule = (field, max, label) =>
  body(field)
    .optional()
    .trim()
    .isLength({ max })
    .withMessage(`${label} cannot exceed ${max} characters`);

/** Total spend — must be a number when provided (required on create). */
const spendRule = (optional = false) => {
  const chain = body('spend');
  if (optional) chain.optional();
  return chain
    .trim()
    .custom((value) => isMoney(value))
    .withMessage('Total spend must be a number (e.g. 1200.50)');
};

router.get('/', listCustomers);

router.post(
  '/',
  [
    nameRule(),
    emailRule(),
    statusRule(),
    maxRule('joined', 32, 'Joined date'),
    spendRule(),
    maxRule('company', 120, 'Company'),
    maxRule('phone', 40, 'Phone'),
  ],
  validate,
  createCustomer
);

router.patch(
  '/:id',
  [
    param('id').trim().notEmpty().withMessage('Customer id is required'),
    nameRule(true),
    emailRule(true),
    statusRule(),
    maxRule('joined', 32, 'Joined date'),
    spendRule(true),
    maxRule('company', 120, 'Company'),
    maxRule('phone', 40, 'Phone'),
  ],
  validate,
  updateCustomer
);

router.delete(
  '/:id',
  [param('id').trim().notEmpty().withMessage('Customer id is required')],
  validate,
  deleteCustomer
);

export default router;

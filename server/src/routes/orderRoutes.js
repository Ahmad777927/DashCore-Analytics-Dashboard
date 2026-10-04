import { Router } from 'express';
import { body, param } from 'express-validator';

import {
  listOrders,
  createOrder,
  updateOrder,
  deleteOrder,
} from '../controllers/orderController.js';
import { protect } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { isMoney } from '../utils/demoFeed.js';

const router = Router();

// Dashboard data — only signed-in users can read or change it.
router.use(protect);

/* Rule factories: a fresh chain per route (`.optional()` mutates the chain,
   so shared instances must never be reused across routes). */

const customerRule = (optional = false) => {
  const chain = body('customer');
  if (optional) chain.optional();
  return chain
    .trim()
    .isLength({ min: 2, max: 120 })
    .withMessage('Customer must be between 2 and 120 characters');
};

const dateRule = (optional = false) => {
  const chain = body('date');
  if (optional) chain.optional();
  return chain
    .trim()
    .isLength({ max: 32 })
    .withMessage('Date cannot exceed 32 characters');
};

const totalRule = (optional = false) => {
  const chain = body('total');
  if (optional) chain.optional();
  return chain
    .trim()
    .custom((value) => isMoney(value))
    .withMessage('Total must be a number (e.g. 250.00)');
};

const statusRule = () =>
  body('status')
    .optional()
    .isIn(['Completed', 'Pending', 'Review', 'Failed'])
    .withMessage('Status must be Completed, Pending, Review or Failed');

router.get('/', listOrders);

router.post(
  '/',
  [
    body('id').optional().trim().isLength({ max: 32 }).withMessage('Order id is too long'),
    customerRule(),
    dateRule(),
    totalRule(),
    statusRule(),
  ],
  validate,
  createOrder
);

router.patch(
  '/:id',
  [
    param('id').trim().notEmpty().withMessage('Order id is required'),
    customerRule(true),
    dateRule(true),
    totalRule(true),
    statusRule(),
  ],
  validate,
  updateOrder
);

router.delete(
  '/:id',
  [param('id').trim().notEmpty().withMessage('Order id is required')],
  validate,
  deleteOrder
);

export default router;

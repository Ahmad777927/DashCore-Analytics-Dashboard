import { validationResult } from 'express-validator';

/**
 * Runs after a chain of express-validator checks and returns a
 * consistent 422 payload when any of them failed.
 */
export function validate(req, res, next) {
  const result = validationResult(req);

  if (!result.isEmpty()) {
    const errors = result.array().map((e) => ({
      field: e.path,
      message: e.msg,
    }));

    return res.status(422).json({
      success: false,
      message: errors[0]?.message || 'Validation failed',
      errors,
    });
  }

  return next();
}

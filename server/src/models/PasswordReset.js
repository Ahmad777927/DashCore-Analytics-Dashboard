import mongoose from 'mongoose';
import crypto from 'node:crypto';

/** Reset links are valid for 15 minutes. */
export const RESET_TOKEN_TTL_MS = 15 * 60 * 1000;

/**
 * Single-use password-reset token.
 *
 * The raw token only ever exists in the emailed link — the database stores
 * a SHA-256 digest, so a DB leak cannot be used to reset passwords.
 * Collection: `password_resets` in `dashcore_db`.
 */
const passwordResetSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    tokenHash: {
      type: String,
      required: true,
      unique: true,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
    usedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
    collection: 'password_resets',
  }
);

// Auto-purge expired documents (TTL index).
passwordResetSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

/** SHA-256 digest of a raw token — what we persist and look up by. */
passwordResetSchema.statics.hashToken = function hashToken(rawToken) {
  return crypto.createHash('sha256').update(rawToken).digest('hex');
};

/** Generate a cryptographically strong raw token (never stored). */
passwordResetSchema.statics.generateRawToken = function generateRawToken() {
  return crypto.randomBytes(32).toString('hex'); // 64 hex chars
};

/** The token is usable only if unused and not yet expired. */
passwordResetSchema.methods.isUsable = function isUsable() {
  return this.usedAt === null && this.expiresAt.getTime() > Date.now();
};

const PasswordReset = mongoose.model('PasswordReset', passwordResetSchema);

export default PasswordReset;
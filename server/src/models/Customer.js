import mongoose from 'mongoose';

/**
 * Customers shown in the dashboard come from two places:
 *
 *  1. The built-in demo dataset (src/data/seedData.js) — read-only seed rows.
 *  2. Documents in this collection — rows the user created in the dashboard
 *     plus edits/deletes of seed rows.
 *
 * A document with an `externalKey` never *adds* a row: it replaces the seed
 * row whose id matches `externalKey` (or hides it when `deleted` is true).
 * Documents without an `externalKey` are customers created in the dashboard
 * and keep MongoDB's `_id` as their id.
 */
const customerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      maxlength: [120, 'Name cannot exceed 120 characters'],
      default: '',
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      maxlength: [160, 'Email cannot exceed 160 characters'],
      default: '',
    },
    status: {
      type: String,
      enum: ['Active', 'Inactive'],
      default: 'Active',
    },
    joined: {
      type: String,
      trim: true,
      maxlength: [32, 'Joined date cannot exceed 32 characters'],
      default: '',
    },
    spend: {
      type: String,
      trim: true,
      maxlength: [32, 'Spend cannot exceed 32 characters'],
      default: '',
    },
    company: {
      type: String,
      trim: true,
      maxlength: [120, 'Company cannot exceed 120 characters'],
      default: '',
    },
    phone: {
      type: String,
      trim: true,
      maxlength: [40, 'Phone cannot exceed 40 characters'],
      default: '',
    },

    // Demo-feed row this document overrides/hides (null for own records).
    externalKey: { type: String, default: null, index: true },
    deleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

/** Public shape sent to the client. */
customerSchema.methods.toSafeObject = function toSafeObject() {
  return {
    // Seed rows keep their original (numeric) id so detail links stay stable
    // after an override; dashboard-created rows use `_id`.
    id:
      this.externalKey != null && /^\d+$/.test(this.externalKey)
        ? Number(this.externalKey)
        : this.externalKey ?? this._id.toString(),
    name: this.name,
    email: this.email,
    status: this.status,
    joined: this.joined,
    spend: this.spend,
    company: this.company,
    phone: this.phone,
  };
};

const Customer = mongoose.model('Customer', customerSchema, 'customers');

export default Customer;

import mongoose from 'mongoose';

/**
 * Orders mirror customers: seed rows come from the built-in demo dataset
 * (src/data/seedData.js), while this collection stores orders created in the
 * dashboard plus edits/deletes of seed rows (`externalKey` = the seed row's
 * display id, e.g. "ORD-12").
 */
const orderSchema = new mongoose.Schema(
  {
    // Display id for orders created in the dashboard (e.g. "ORD-1741234").
    refId: { type: String, trim: true, default: null, index: true },
    customer: {
      type: String,
      trim: true,
      maxlength: [120, 'Customer cannot exceed 120 characters'],
      default: '',
    },
    date: {
      type: String,
      trim: true,
      maxlength: [32, 'Date cannot exceed 32 characters'],
      default: '',
    },
    total: {
      type: String,
      trim: true,
      maxlength: [32, 'Total cannot exceed 32 characters'],
      default: '',
    },
    status: {
      type: String,
      enum: ['Completed', 'Pending', 'Review', 'Failed'],
      default: 'Pending',
    },

    // Seed row this document overrides/hides (null for own records).
    externalKey: { type: String, default: null, index: true },
    deleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

/** Public shape sent to the client. */
orderSchema.methods.toSafeObject = function toSafeObject() {
  return {
    id: this.refId || this.externalKey || this._id.toString(),
    customer: this.customer,
    date: this.date,
    total: this.total,
    status: this.status,
  };
};

const Order = mongoose.model('Order', orderSchema, 'orders');

export default Order;

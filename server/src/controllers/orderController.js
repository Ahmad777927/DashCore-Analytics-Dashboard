import Order from '../models/Order.js';
import { SEED_ORDERS } from '../data/seedData.js';
import { pickFields, sanitizeMoney } from '../utils/demoFeed.js';

/** Fields the dashboard is allowed to write (mirrors the route validators). */
const WRITABLE = ['id', 'customer', 'date', 'total', 'status'];

/** Find by Mongo id, then display id, then the seed-row key. */
async function resolveDoc(id) {
  const key = String(id);
  try {
    const byId = await Order.findById(key);
    if (byId) return byId;
  } catch {
    // Not a valid ObjectId — try the display/seed keys below.
  }
  return Order.findOne({ $or: [{ refId: key }, { externalKey: key }] });
}

/** New display id for an order created in the dashboard (e.g. "ORD-1741234"). */
async function nextOrderId() {
  let refId;
  do {
    refId = `ORD-${Date.now().toString().slice(-6)}`;
  } while (await Order.findOne({ refId }));
  return refId;
}

/** True when the display id is already used by a seed row or a stored order. */
async function displayIdTaken(id) {
  const key = String(id);
  if (SEED_ORDERS.some((row) => row.id === key)) return true;
  return Boolean(
    await Order.findOne({ $or: [{ refId: key }, { externalKey: key }] })
  );
}

/**
 * GET /api/orders
 * Built-in seed rows merged with the user's persisted rows (same contract as
 * /api/customers): records created in the dashboard come first (newest
 * first), overrides replace a seed row, tombstones hide it.
 */
export async function listOrders(_req, res, next) {
  try {
    const docs = await Order.find({});

    const overrides = new Map(
      docs
        .filter((doc) => doc.externalKey != null)
        .map((doc) => [doc.externalKey, doc])
    );

    const created = docs
      .filter((doc) => doc.externalKey == null && !doc.deleted)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .map((doc) => doc.toSafeObject());

    const seed = SEED_ORDERS.filter(
      (row) => !overrides.get(String(row.id))?.deleted
    ).map((row) => overrides.get(String(row.id))?.toSafeObject() ?? row);

    res.json({ success: true, orders: [...created, ...seed] });
  } catch (err) {
    next(err);
  }
}

/** POST /api/orders */
export async function createOrder(req, res, next) {
  try {
    const fields = pickFields(req.body, WRITABLE);
    const { id, ...rest } = fields;
    if (rest.total !== undefined) rest.total = sanitizeMoney(rest.total);

    if (id && (await displayIdTaken(id))) {
      return res
        .status(409)
        .json({ success: false, message: 'An order with this id already exists.' });
    }

    const doc = await Order.create({
      ...rest,
      refId: id ? String(id) : await nextOrderId(),
    });

    res.status(201).json({ success: true, order: doc.toSafeObject() });
  } catch (err) {
    next(err);
  }
}

/** PATCH /api/orders/:id */
export async function updateOrder(req, res, next) {
  try {
    const { id } = req.params;
    const fields = pickFields(req.body, WRITABLE);
    delete fields.id; // display ids are not editable via PATCH
    if (fields.total !== undefined) fields.total = sanitizeMoney(fields.total);

    if (!Object.keys(fields).length) {
      return res.status(400).json({ success: false, message: 'No valid fields to update.' });
    }

    let doc = await resolveDoc(id);

    if (!doc && /^ORD-/i.test(String(id))) {
      // First edit of a seed order → persist a full override.
      doc = await Order.create({ ...fields, externalKey: String(id) });
      return res.status(201).json({ success: true, order: doc.toSafeObject() });
    }

    if (!doc) {
      return res.status(404).json({ success: false, message: 'Order not found.' });
    }

    Object.assign(doc, fields);
    await doc.save();
    res.json({ success: true, order: doc.toSafeObject() });
  } catch (err) {
    next(err);
  }
}

/** DELETE /api/orders/:id */
export async function deleteOrder(req, res, next) {
  try {
    const { id } = req.params;
    const doc = await resolveDoc(id);

    if (doc) {
      if (doc.externalKey != null) {
        // Seed order → tombstone so it stops showing up.
        doc.deleted = true;
        await doc.save();
      } else {
        await doc.deleteOne();
      }
      return res.json({ success: true });
    }

    if (/^ORD-/i.test(String(id))) {
      // Seed order that was never edited → hide it with a tombstone.
      await Order.create({ externalKey: String(id), deleted: true });
      return res.json({ success: true });
    }

    res.status(404).json({ success: false, message: 'Order not found.' });
  } catch (err) {
    next(err);
  }
}

import Customer from '../models/Customer.js';
import { SEED_CUSTOMERS } from '../data/seedData.js';
import { pickFields, isNumericKey, sanitizeMoney } from '../utils/demoFeed.js';

/** Fields the dashboard is allowed to write (mirrors the route validators). */
const WRITABLE = ['name', 'email', 'status', 'joined', 'spend', 'company', 'phone'];

/** Find by Mongo id first, then by the seed-row key. Cast errors → null. */
async function resolveDoc(id) {
  try {
    const byId = await Customer.findById(id);
    if (byId) return byId;
  } catch {
    // Not a valid ObjectId (e.g. "7") — fall through to the seed key lookup.
  }
  return Customer.findOne({ externalKey: String(id) });
}

/**
 * Duplicate-email guard. Checks the user's own documents *and* the built-in
 * seed rows (cheap — the dataset is local), so a new record can't shadow an
 * existing one.
 */
async function emailTaken(email, { excludeDocId, excludeSeedId } = {}) {
  if (!email) return false;
  const query = { email, deleted: false };
  if (excludeDocId) query._id = { $ne: excludeDocId };
  if (await Customer.findOne(query)) return true;
  return SEED_CUSTOMERS.some(
    (row) => row.email === email && String(row.id) !== String(excludeSeedId ?? '')
  );
}

/**
 * GET /api/customers
 * Built-in seed rows merged with the user's persisted rows:
 *   - records created in the dashboard come first (newest first) so a newly
 *     added row is immediately visible at the top of the table,
 *   - overrides replace their seed row, tombstones hide it.
 */
export async function listCustomers(_req, res, next) {
  try {
    const docs = await Customer.find({});

    const overrides = new Map(
      docs
        .filter((doc) => doc.externalKey != null)
        .map((doc) => [doc.externalKey, doc])
    );

    const created = docs
      .filter((doc) => doc.externalKey == null && !doc.deleted)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .map((doc) => doc.toSafeObject());

    const seed = SEED_CUSTOMERS.filter(
      (row) => !overrides.get(String(row.id))?.deleted
    ).map((row) => overrides.get(String(row.id))?.toSafeObject() ?? row);

    res.json({ success: true, customers: [...created, ...seed] });
  } catch (err) {
    next(err);
  }
}

/** POST /api/customers */
export async function createCustomer(req, res, next) {
  try {
    const fields = pickFields(req.body, WRITABLE);
    if (fields.spend !== undefined) fields.spend = sanitizeMoney(fields.spend);

    if (await emailTaken(fields.email)) {
      return res
        .status(409)
        .json({ success: false, message: 'That email is already in use by another customer.' });
    }

    const doc = await Customer.create(fields);
    res.status(201).json({ success: true, customer: doc.toSafeObject() });
  } catch (err) {
    next(err);
  }
}

/** PATCH /api/customers/:id */
export async function updateCustomer(req, res, next) {
  try {
    const { id } = req.params;
    const fields = pickFields(req.body, WRITABLE);
    if (fields.spend !== undefined) fields.spend = sanitizeMoney(fields.spend);

    if (!Object.keys(fields).length) {
      return res.status(400).json({ success: false, message: 'No valid fields to update.' });
    }

    let doc = await resolveDoc(id);

    if (!doc && isNumericKey(id)) {
      // First edit of a seed row → persist a full override so every reload
      // keeps returning the edited values. (The row's own seed email doesn't
      // count as a duplicate — hence excludeSeedId.)
      if (await emailTaken(fields.email, { excludeSeedId: id })) {
        return res
          .status(409)
          .json({ success: false, message: 'That email is already in use by another customer.' });
      }
      doc = await Customer.create({ ...fields, externalKey: String(id) });
      return res.status(201).json({ success: true, customer: doc.toSafeObject() });
    }

    if (!doc) {
      return res.status(404).json({ success: false, message: 'Customer not found.' });
    }

    if (await emailTaken(fields.email, { excludeDocId: doc._id, excludeSeedId: doc.externalKey })) {
      return res
        .status(409)
        .json({ success: false, message: 'That email is already in use by another customer.' });
    }

    Object.assign(doc, fields);
    await doc.save();
    res.json({ success: true, customer: doc.toSafeObject() });
  } catch (err) {
    next(err);
  }
}

/** DELETE /api/customers/:id */
export async function deleteCustomer(req, res, next) {
  try {
    const { id } = req.params;
    const doc = await resolveDoc(id);

    if (doc) {
      if (doc.externalKey != null) {
        // Seed row → tombstone so the feed row stops showing up.
        doc.deleted = true;
        await doc.save();
      } else {
        await doc.deleteOne();
      }
      return res.json({ success: true });
    }

    if (isNumericKey(id)) {
      // Seed row that was never edited → hide it with a tombstone.
      await Customer.create({ externalKey: String(id), deleted: true });
      return res.json({ success: true });
    }

    res.status(404).json({ success: false, message: 'Customer not found.' });
  } catch (err) {
    next(err);
  }
}

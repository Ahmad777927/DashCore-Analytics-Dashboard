import 'dotenv/config';

import mongoose from 'mongoose';

/**
 * One-off migration: copy every document from the OLD database's `users`
 * collection into the NEW database's `accounts` collection.
 *
 *   OLD:  <cluster>/auth_db.users
 *   NEW:  <cluster>/dashcore_db.accounts   (see User.js -> collection 'accounts')
 *
 * Passwords are copied verbatim — they are bcrypt hashes, so they stay valid.
 *
 * Usage:
 *   npm run migrate:users
 *   npm run migrate:users -- --drop        (replace existing target docs)
 */
async function main() {
  const newUri = process.env.MONGO_URI;
  if (!newUri) throw new Error('MONGO_URI is not defined');

  const oldUri = newUri.replace(/\/[^/?]+(\?|$)/, '/auth_db$1');
  if (oldUri === newUri) {
    throw new Error('Could not derive the old auth_db URI from MONGO_URI');
  }

  const drop = process.argv.includes('--drop');

  // Two named connections on the same cluster, pointing at different DBs.
  const oldConn = await mongoose.createConnection(oldUri, {
    serverSelectionTimeoutMS: 10000,
  }).asPromise();

  const newConn = await mongoose.createConnection(newUri, {
    serverSelectionTimeoutMS: 10000,
  }).asPromise();

  try {
    const src = oldConn.collection('users');
    const dest = newConn.collection('accounts');

    const existing = await dest.countDocuments();
    console.log(`Source  : auth_db.users`);
    console.log(`Target  : dashcore_db.accounts (existing: ${existing})`);

    if (drop && existing > 0) {
      await dest.deleteMany({});
      console.log('🧹 --drop: cleared target collection');
    }

    const docs = await src.find({}).toArray();
    if (docs.length === 0) {
      console.log('Nothing to migrate — source collection is empty.');
      return;
    }

    let copied = 0;
    let skipped = 0;

    for (const doc of docs) {
      const key = { email: doc.email };
      const already = await dest.findOne(key);
      if (already) {
        skipped += 1;
        continue;
      }
      // _id travels with the doc so relationships stay stable.
      await dest.insertOne(doc);
      copied += 1;
    }

    console.log(`✅ Migrated ${copied} user(s), skipped ${skipped} already present.`);
    console.log(`   Total in target: ${await dest.countDocuments()}`);
  } finally {
    await oldConn.close();
    await newConn.close();
  }
}

main().catch((err) => {
  console.error('❌ Migration failed:', err.message);
  process.exitCode = 1;
});

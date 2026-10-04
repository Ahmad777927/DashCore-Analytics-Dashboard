import mongoose from 'mongoose';
import { readFileSync } from 'node:fs';

// Minimal .env loader (no dependency on dotenv).
for (const line of readFileSync(new URL('./.env', import.meta.url), 'utf8').split('\n')) {
  const m = line.match(/^([A-Z_][A-Z0-9_]*)=(.*)$/);
  if (m && !process.env[m[1]]) process.env[m[1]] = m[2].trim();
}

await mongoose.connect(process.env.MONGO_URI);
const db = mongoose.connection.db;

const cust = await db.collection('customers').deleteMany({});
const ord = await db.collection('orders').deleteMany({});
const users = await db.collection('accounts').deleteMany({ email: /@test\.dev$/ });

console.log(`customers docs removed: ${cust.deletedCount}`);
console.log(`orders docs removed:    ${ord.deletedCount}`);
console.log(`test users removed:     ${users.deletedCount}`);
console.log(`leftover customers docs: ${await db.collection('customers').countDocuments()}`);
console.log(`leftover orders docs:    ${await db.collection('orders').countDocuments()}`);

await mongoose.disconnect();

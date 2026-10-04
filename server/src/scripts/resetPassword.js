import 'dotenv/config';
import readline from 'node:readline/promises';
import { connectDB, disconnectDB } from '../config/db.js';
import User from '../models/User.js';

/**
 * Reset a user's password.
 *
 *   node src/scripts/resetPassword.js <email-or-username> [newPassword]
 *
 * If no password argument is given, you'll be prompted for one (input is
 * hidden). The plaintext is passed to the model, so the pre-save hook hashes
 * it exactly like a normal signup — the original password stays unrecoverable.
 */
async function main() {
  const identifier = process.argv[2];
  const newPasswordArg = process.argv[3];

  if (!identifier) {
    console.error('Usage: node src/scripts/resetPassword.js <email-or-username> [newPassword]');
    process.exitCode = 1;
    return;
  }

  await connectDB();

  const id = identifier.toLowerCase();
  const user = await User.findOne({
    $or: [{ email: id }, { username: id }],
  }).select('+password');

  if (!user) {
    console.error(`❌ No user found for "${identifier}".`);
    await disconnectDB();
    process.exitCode = 1;
    return;
  }

  let newPassword = newPasswordArg;
  if (!newPassword) {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
    newPassword = await rl.question(`New password for ${user.email}: `);
    const confirm = await rl.question('Confirm password: ');
    rl.close();
    if (newPassword !== confirm) {
      console.error('❌ Passwords do not match.');
      await disconnectDB();
      process.exitCode = 1;
      return;
    }
  }

  if (newPassword.length < 8) {
    console.error('❌ Password must be at least 8 characters.');
    await disconnectDB();
    process.exitCode = 1;
    return;
  }

  // Assigning triggers the pre('save') hook → re-hashed with bcrypt (12 rounds).
  user.password = newPassword;
  await user.save();

  console.log(`✅ Password updated for ${user.email} (${user.username}).`);
  console.log('   You can now log in with your new password.');
  await disconnectDB();
}

main().catch(async (err) => {
  console.error('❌', err.message);
  await disconnectDB();
  process.exitCode = 1;
});

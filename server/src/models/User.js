import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const SALT_ROUNDS = 12;

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
      maxlength: [60, 'Name cannot exceed 60 characters'],
    },
    username: {
      type: String,
      required: [true, 'Username is required'],
      unique: true,
      trim: true,
      lowercase: true,
      minlength: [3, 'Username must be at least 3 characters'],
      maxlength: [30, 'Username cannot exceed 30 characters'],
      match: [/^[a-z0-9_.]+$/, 'Username can only contain letters, numbers, "_" and "."'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please provide a valid email address'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [8, 'Password must be at least 8 characters'],
      select: false, // never returned by default
    },
    role: {
      type: String,
      enum: ['Administrator', 'Manager', 'Member'],
      default: 'Administrator',
    },
    avatar: {
      type: String,
      default: '',
    },
    // Free-form team/department the member belongs to (editable in Settings).
    department: {
      type: String,
      trim: true,
      maxlength: [80, 'Department cannot exceed 80 characters'],
      default: '',
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform(_doc, ret) {
        delete ret.password;
        delete ret.__v;
        return ret;
      },
    },
  }
);

/** Hash the password whenever it is set/changed. */
userSchema.pre('save', async function hashPassword(next) {
  if (!this.isModified('password')) return next();
  try {
    const salt = await bcrypt.genSalt(SALT_ROUNDS);
    this.password = await bcrypt.hash(this.password, salt);
    return next();
  } catch (err) {
    return next(err);
  }
});

/** Compare a plaintext candidate against the stored hash. */
userSchema.methods.comparePassword = function comparePassword(candidate) {
  return bcrypt.compare(candidate, this.password);
};

/** Public shape sent to the client. */
userSchema.methods.toSafeObject = function toSafeObject() {
  return {
    id: this._id.toString(),
    name: this.name,
    username: this.username,
    email: this.email,
    role: this.role,
    avatar: this.avatar,
    department: this.department || '',
    createdAt: this.createdAt,
  };
};

/**
 * Explicit collection name: `accounts` (instead of Mongoose's default
 * pluralised `users`) inside the `dashcore_db` database.
 */
const User = mongoose.model('User', userSchema, 'accounts');

export default User;

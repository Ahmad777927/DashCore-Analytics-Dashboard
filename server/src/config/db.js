import mongoose from 'mongoose';

/**
 * Connect to MongoDB using Mongoose.
 * Fails fast so the process does not run without a database.
 */
export async function connectDB() {
  const uri = process.env.MONGO_URI;

  if (!uri) {
    throw new Error('MONGO_URI is not defined. Please check your .env file.');
  }

  mongoose.set('strictQuery', true);

  mongoose.connection.on('connected', () => {
    console.log('✅ MongoDB connected');
  });

  mongoose.connection.on('error', (err) => {
    console.error('❌ MongoDB connection error:', err.message);
  });

  mongoose.connection.on('disconnected', () => {
    console.warn('⚠️  MongoDB disconnected');
  });

  await mongoose.connect(uri, {
    serverSelectionTimeoutMS: 10000,
    autoIndex: process.env.NODE_ENV !== 'production',
  });

  return mongoose.connection;
}

export async function disconnectDB() {
  await mongoose.connection.close();
}

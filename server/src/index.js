import 'dotenv/config';

import { createApp } from './app.js';
import { connectDB, disconnectDB } from './config/db.js';

const PORT = process.env.PORT || 5000;

async function start() {
  try {
    await connectDB();

    const app = createApp();
    const server = app.listen(PORT, () => {
      console.log(`🚀 API server running on http://localhost:${PORT}`);
      console.log(`   Environment: ${process.env.NODE_ENV || 'development'}`);
    });

    server.on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        console.error(
          `❌ Port ${PORT} is already in use. Set a different PORT in server/.env`
        );
      } else {
        console.error('❌ Server error:', err.message);
      }
      process.exit(1);
    });

    // ---------- Graceful shutdown ----------
    const shutdown = async (signal) => {
      console.log(`\n${signal} received. Shutting down gracefully...`);
      server.close(async () => {
        await disconnectDB();
        console.log('👋 Server closed.');
        process.exit(0);
      });

      // Force-exit if graceful close hangs.
      setTimeout(() => process.exit(1), 10000).unref();
    };

    ['SIGINT', 'SIGTERM'].forEach((sig) => process.on(sig, () => shutdown(sig)));

    process.on('unhandledRejection', (reason) => {
      console.error('Unhandled promise rejection:', reason);
    });
  } catch (err) {
    console.error('❌ Failed to start server:', err.message);
    process.exit(1);
  }
}

start();

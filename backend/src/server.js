import app from './app.js';
import config from './config/index.js';
import { connectDB } from './config/db.js';
import { ensureSeed } from './utils/ensureSeed.js';

async function start() {
  try {
    await connectDB();
    await ensureSeed();
    app.listen(config.port, () => {
      console.log(`CMS API running on http://localhost:${config.port}`);
      console.log(`Admin API:  http://localhost:${config.port}/api/admin`);
      console.log(`Public API: http://localhost:${config.port}/api/public`);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
}

start();

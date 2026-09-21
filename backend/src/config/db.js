import mongoose from 'mongoose';
import config from './index.js';

let memoryServer = null;

export async function connectDB() {
  mongoose.set('strictQuery', true);

  const preferMemory = process.env.USE_MEMORY_MONGO === 'true';

  if (!preferMemory) {
    try {
      await mongoose.connect(config.mongoUri, { serverSelectionTimeoutMS: 3000 });
      console.log(`MongoDB connected: ${mongoose.connection.host}/${mongoose.connection.name}`);
      return;
    } catch (err) {
      console.warn('MongoDB connection failed, falling back to in-memory MongoDB.');
      console.warn(String(err?.message || err));
    }
  }

  const { MongoMemoryServer } = await import('mongodb-memory-server');
  memoryServer = await MongoMemoryServer.create();
  const uri = memoryServer.getUri('dwarika_hospital_cms');
  await mongoose.connect(uri);
  console.log('In-memory MongoDB connected (dev fallback). Run a real MongoDB for persistence.');
}

export async function disconnectDB() {
  await mongoose.disconnect();
  if (memoryServer) {
    await memoryServer.stop();
    memoryServer = null;
  }
}

export default connectDB;

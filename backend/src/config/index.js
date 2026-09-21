import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '../..');

const config = {
  port: Number(process.env.PORT) || 4000,
  nodeEnv: process.env.NODE_ENV || 'development',
  mongoUri: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/dwarika_hospital_cms',
  corsOrigin: (process.env.CORS_ORIGIN || 'http://localhost:5173').split(',').map((s) => s.trim()),
  uploadDir: path.resolve(rootDir, process.env.UPLOAD_DIR || 'uploads'),
  maxFileSizeMb: Number(process.env.MAX_FILE_SIZE_MB) || 10,
  publicBaseUrl: process.env.PUBLIC_BASE_URL || 'http://localhost:4000',
  // Reserved for future authentication
  auth: {
    enabled: false,
    jwtSecret: process.env.JWT_SECRET || 'change-me-in-production',
    jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  },
};

export default config;

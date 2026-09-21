import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
import config from '../config/index.js';
import { ApiError } from '../utils/ApiError.js';

const mediaRoot = path.join(config.uploadDir, 'media');
if (!fs.existsSync(mediaRoot)) fs.mkdirSync(mediaRoot, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const folder = (req.body.folder || req.query.folder || 'general').replace(/[^a-zA-Z0-9/_-]/g, '');
    const dest = path.join(mediaRoot, folder);
    fs.mkdirSync(dest, { recursive: true });
    req.uploadFolder = folder;
    cb(null, dest);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `${uuidv4()}${ext}`);
  },
});

const allowed = new Set([
  'image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml', 'image/x-icon',
  'application/pdf',
  'video/mp4', 'video/webm',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
]);

export const upload = multer({
  storage,
  limits: { fileSize: config.maxFileSizeMb * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (!allowed.has(file.mimetype)) {
      return cb(new ApiError(400, `File type not allowed: ${file.mimetype}`));
    }
    cb(null, true);
  },
});

export default upload;

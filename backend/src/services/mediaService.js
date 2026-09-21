import fs from 'fs/promises';
import path from 'path';
import sharp from 'sharp';
import mime from 'mime-types';
import Media from '../models/Media.js';
import config from '../config/index.js';
import { ApiError } from '../utils/ApiError.js';
import { getPagination, buildMeta } from '../utils/pagination.js';

function detectType(mimeType) {
  if (mimeType.startsWith('image/')) return 'image';
  if (mimeType.startsWith('video/')) return 'video';
  if (mimeType === 'application/pdf' || mimeType.includes('document') || mimeType.includes('word')) return 'document';
  return 'other';
}

function publicUrl(folder, filename) {
  return `${config.publicBaseUrl}/uploads/media/${folder}/${filename}`;
}

export async function listMedia(query = {}) {
  const { page, limit, skip, sort } = getPagination(query);
  const filter = {};
  if (query.folder) filter.folder = query.folder;
  if (query.type) filter.type = query.type;
  if (query.search) {
    const regex = new RegExp(query.search, 'i');
    filter.$or = [{ originalName: regex }, { title: regex }, { alt: regex }, { filename: regex }];
  }

  const [items, total] = await Promise.all([
    Media.find(filter).sort(sort).skip(skip).limit(limit).lean(),
    Media.countDocuments(filter),
  ]);
  return { items, meta: buildMeta(total, page, limit) };
}

export async function getFolders() {
  const folders = await Media.aggregate([
    { $group: { _id: '$folder', count: { $sum: 1 } } },
    { $sort: { _id: 1 } },
  ]);
  return folders.map((f) => ({ name: f._id, count: f.count }));
}

export async function createFromUpload(file, { folder = 'general', alt = '', title = '' } = {}) {
  const type = detectType(file.mimetype);
  let width = null;
  let height = null;
  let optimized = false;
  let finalFilename = file.filename;
  let finalPath = file.path;
  let finalSize = file.size;

  if (type === 'image' && file.mimetype !== 'image/svg+xml' && file.mimetype !== 'image/gif') {
    try {
      const ext = path.extname(file.filename);
      const base = path.basename(file.filename, ext);
      const optimizedName = `${base}.webp`;
      const optimizedPath = path.join(path.dirname(file.path), optimizedName);

      const image = sharp(file.path).rotate();
      const meta = await image.metadata();
      width = meta.width || null;
      height = meta.height || null;

      await image.webp({ quality: 82 }).toFile(optimizedPath);
      await fs.unlink(file.path).catch(() => {});

      finalFilename = optimizedName;
      finalPath = optimizedPath;
      const stat = await fs.stat(optimizedPath);
      finalSize = stat.size;
      optimized = true;
    } catch {
      // keep original if optimization fails
    }
  } else if (type === 'image') {
    try {
      const meta = await sharp(file.path).metadata();
      width = meta.width || null;
      height = meta.height || null;
    } catch {
      /* ignore */
    }
  }

  const doc = await Media.create({
    filename: finalFilename,
    originalName: file.originalname,
    mimeType: optimized ? 'image/webp' : file.mimetype,
    size: finalSize,
    url: publicUrl(folder, finalFilename),
    path: finalPath,
    folder,
    alt,
    title: title || file.originalname,
    width,
    height,
    optimized,
    type,
  });

  return doc.toObject();
}

export async function replaceMedia(id, file) {
  const existing = await Media.findById(id);
  if (!existing) throw new ApiError(404, 'Media not found');

  await fs.unlink(existing.path).catch(() => {});

  const created = await createFromUpload(file, {
    folder: existing.folder,
    alt: existing.alt,
    title: existing.title,
  });

  await Media.findByIdAndDelete(created._id);

  existing.filename = created.filename;
  existing.originalName = created.originalName;
  existing.mimeType = created.mimeType;
  existing.size = created.size;
  existing.url = created.url;
  existing.path = created.path;
  existing.width = created.width;
  existing.height = created.height;
  existing.optimized = created.optimized;
  existing.type = created.type;
  await existing.save();
  return existing.toObject();
}

export async function updateMedia(id, data) {
  const doc = await Media.findByIdAndUpdate(id, data, { new: true, runValidators: true });
  if (!doc) throw new ApiError(404, 'Media not found');
  return doc.toObject();
}

export async function deleteMedia(id) {
  const doc = await Media.findById(id);
  if (!doc) throw new ApiError(404, 'Media not found');
  await fs.unlink(doc.path).catch(() => {});
  await doc.deleteOne();
  return { id };
}

export async function getMedia(id) {
  const doc = await Media.findById(id).lean();
  if (!doc) throw new ApiError(404, 'Media not found');
  return doc;
}

export default {
  listMedia,
  getFolders,
  createFromUpload,
  replaceMedia,
  updateMedia,
  deleteMedia,
  getMedia,
};

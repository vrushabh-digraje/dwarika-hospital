import * as mediaService from '../services/mediaService.js';
import { success, created } from '../utils/ApiResponse.js';
import asyncHandler from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';

export const list = asyncHandler(async (req, res) => {
  const result = await mediaService.listMedia(req.query);
  return success(res, result.items, 'Media list', 200, result.meta);
});

export const folders = asyncHandler(async (req, res) => {
  const data = await mediaService.getFolders();
  return success(res, data, 'Folders');
});

export const getOne = asyncHandler(async (req, res) => {
  const item = await mediaService.getMedia(req.params.id);
  return success(res, item);
});

export const uploadOne = asyncHandler(async (req, res) => {
  if (!req.file) throw new ApiError(400, 'No file uploaded');
  const folder = req.body.folder || req.uploadFolder || 'general';
  const item = await mediaService.createFromUpload(req.file, {
    folder,
    alt: req.body.alt || '',
    title: req.body.title || '',
  });
  return created(res, item, 'File uploaded');
});

export const uploadMany = asyncHandler(async (req, res) => {
  if (!req.files?.length) throw new ApiError(400, 'No files uploaded');
  const folder = req.body.folder || req.uploadFolder || 'general';
  const items = [];
  for (const file of req.files) {
    items.push(
      await mediaService.createFromUpload(file, {
        folder,
        alt: req.body.alt || '',
        title: req.body.title || '',
      })
    );
  }
  return created(res, items, 'Files uploaded');
});

export const replace = asyncHandler(async (req, res) => {
  if (!req.file) throw new ApiError(400, 'No file uploaded');
  const item = await mediaService.replaceMedia(req.params.id, req.file);
  return success(res, item, 'Media replaced');
});

export const update = asyncHandler(async (req, res) => {
  const item = await mediaService.updateMedia(req.params.id, req.body);
  return success(res, item, 'Media updated');
});

export const remove = asyncHandler(async (req, res) => {
  await mediaService.deleteMedia(req.params.id);
  return success(res, null, 'Media deleted');
});

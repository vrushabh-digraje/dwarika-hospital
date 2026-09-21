import SiteSettings from '../models/SiteSettings.js';
import Homepage from '../models/Homepage.js';
import About from '../models/About.js';
import { success } from '../utils/ApiResponse.js';
import asyncHandler from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';

async function getOrCreateSettings() {
  let doc = await SiteSettings.findOne({ key: 'default' });
  if (!doc) doc = await SiteSettings.create({ key: 'default' });
  return doc;
}

async function getOrCreateHomepage() {
  let doc = await Homepage.findOne({ key: 'default' });
  if (!doc) doc = await Homepage.create({ key: 'default' });
  return doc;
}

export const getSettings = asyncHandler(async (req, res) => {
  const doc = await getOrCreateSettings();
  return success(res, doc);
});

export const updateSettings = asyncHandler(async (req, res) => {
  const doc = await getOrCreateSettings();
  Object.assign(doc, req.body, { key: 'default' });
  await doc.save();
  return success(res, doc, 'Settings updated');
});

export const getHomepage = asyncHandler(async (req, res) => {
  const doc = await getOrCreateHomepage();
  await doc.populate('hero.featuredDoctorIds');
  return success(res, doc);
});

export const updateHomepage = asyncHandler(async (req, res) => {
  const doc = await getOrCreateHomepage();
  Object.assign(doc, req.body, { key: 'default' });
  await doc.save();
  await doc.populate('hero.featuredDoctorIds');
  return success(res, doc, 'Homepage updated');
});

export const getAbout = asyncHandler(async (req, res) => {
  let doc = await About.findOne().sort({ updatedAt: -1 });
  if (!doc) throw new ApiError(404, 'About content not found');
  return success(res, doc);
});

export const upsertAbout = asyncHandler(async (req, res) => {
  let doc = await About.findOne().sort({ updatedAt: -1 });
  if (!doc) {
    doc = await About.create(req.body);
  } else {
    Object.assign(doc, req.body);
    await doc.save();
  }
  return success(res, doc, 'About content saved');
});

import SiteSettings from '../models/SiteSettings.js';
import Announcement from '../models/Announcement.js';
import { success } from '../utils/ApiResponse.js';
import asyncHandler from '../utils/asyncHandler.js';

const DEFAULT_MARQUEE_LINES = [
  'Welcome to Dwarika Hospital & Medical Academy — 24/7 Emergency & Trauma Care Available',
  'OPD Clinic Services Open Daily from 8:00 AM to 6:00 PM — Call 031-590123 for Bookings',
  'Admissions Open for Diploma in General Medicine & Diploma in Pharmacy for 2026 Academic Session',
  'Advanced 24-Hour Digital X-Ray, USG, and Fully Automated Pathology Laboratory Services Active',
  'Emergency 24/7 Helpline: 103 | Reception Landline: 031-590123 | Kalyanpur, Khadak-7',
];

async function getOrCreateSettings() {
  let doc = await SiteSettings.findOne({ key: 'default' });
  if (!doc) doc = await SiteSettings.create({ key: 'default' });
  if (!doc.marqueeLines || doc.marqueeLines.length === 0) {
    doc.marqueeLines = DEFAULT_MARQUEE_LINES;
    await doc.save();
  }
  return doc;
}

export const getLiveUpdates = asyncHandler(async (req, res) => {
  const settings = await getOrCreateSettings();
  const announcements = await Announcement.find({ showOnMarquee: true, status: 'published' })
    .sort({ createdAt: -1 })
    .limit(10);

  return success(res, {
    lines: settings.marqueeLines || [],
    settings: settings.liveUpdates || {
      enabled: true,
      badgeTextEn: 'Live Updates',
      badgeTextNp: 'ताजा जानकारी',
      speed: 'normal',
    },
    announcements,
  });
});

export const updateLiveUpdates = asyncHandler(async (req, res) => {
  const { lines, settings: updateSettings } = req.body;
  const doc = await getOrCreateSettings();

  if (Array.isArray(lines)) {
    doc.marqueeLines = lines.map((s) => String(s).trim()).filter(Boolean);
  }
  if (updateSettings && typeof updateSettings === 'object') {
    doc.liveUpdates = {
      ...doc.liveUpdates,
      ...updateSettings,
    };
  }

  doc.markModified('marqueeLines');
  doc.markModified('liveUpdates');
  await doc.save();

  return success(res, {
    lines: doc.marqueeLines,
    settings: doc.liveUpdates,
  }, 'Live updates ticker saved successfully');
});

export const addLiveUpdateLine = asyncHandler(async (req, res) => {
  const { text } = req.body;
  if (!text || !String(text).trim()) {
    return res.status(400).json({ success: false, message: 'Text line is required' });
  }

  const doc = await getOrCreateSettings();
  doc.marqueeLines.unshift(String(text).trim());
  doc.markModified('marqueeLines');
  await doc.save();

  return success(res, doc.marqueeLines, 'Live update line added');
});

export const deleteLiveUpdateLine = asyncHandler(async (req, res) => {
  const { index } = req.params;
  const idx = parseInt(index, 10);

  const doc = await getOrCreateSettings();
  if (idx >= 0 && idx < doc.marqueeLines.length) {
    doc.marqueeLines.splice(idx, 1);
    doc.markModified('marqueeLines');
    await doc.save();
  }

  return success(res, doc.marqueeLines, 'Live update line deleted');
});

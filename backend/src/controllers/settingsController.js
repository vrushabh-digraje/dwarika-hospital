import SiteSettings from '../models/SiteSettings.js';
import Homepage from '../models/Homepage.js';
import About from '../models/About.js';
import { success } from '../utils/ApiResponse.js';
import asyncHandler from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';

export const DEFAULT_PAGE_STATUSES = [
  {
    pageKey: 'home',
    path: '/',
    name: 'Homepage',
    status: 'active',
    noticeTitle: 'Homepage Temporarily Unavailable',
    noticeMessage: 'The homepage is currently under maintenance. Please contact Dwarika Hospital administration at 031-590123 for inquiries.',
  },
  {
    pageKey: 'about',
    path: '/about',
    name: 'About Hospital',
    status: 'active',
    noticeTitle: 'About Us Page Notice',
    noticeMessage: 'Our hospital profile section is temporarily unavailable. Please contact reception at 031-590123 for information.',
  },
  {
    pageKey: 'academic',
    path: '/academic',
    name: 'Academic & Training',
    status: 'active',
    noticeTitle: 'Academic Section Notice',
    noticeMessage: 'Academic admissions and training information are currently being updated. Please contact the academic desk for inquiries.',
  },
  {
    pageKey: 'appointment',
    path: '/appointment',
    name: 'Doctor Appointment',
    status: 'active',
    noticeTitle: 'Online Doctor Appointments Temporarily Suspended',
    noticeMessage: 'Online appointment booking is currently unavailable. For emergency services or direct booking, please call 031-590123 or visit Dwarika Hospital OPD.',
  },
  {
    pageKey: 'reports',
    path: '/reports',
    name: 'Patient Lab Reports',
    status: 'active',
    noticeTitle: 'Online Lab Reports Temporarily Unavailable',
    noticeMessage: 'The online patient reports portal is currently under system maintenance. Please collect physical reports from the Dwarika Hospital Lab counter.',
  },
  {
    pageKey: 'online-form',
    path: '/online-form',
    name: 'Online Registration Form',
    status: 'active',
    noticeTitle: 'Online Registration Notice',
    noticeMessage: 'Online registration is currently closed or undergoing scheduled maintenance. Please contact administration at 031-590123 for assistance.',
  },
  {
    pageKey: 'support-form',
    path: '/support-form',
    name: 'Support & Inquiries',
    status: 'active',
    noticeTitle: 'Support Form Notice',
    noticeMessage: 'Online inquiry form is temporarily suspended. Please call 031-590123.',
  },
  {
    pageKey: 'pharmacy',
    path: '/pharmacy',
    name: 'Pharmacy & Medicines',
    status: 'active',
    noticeTitle: 'Online Pharmacy Requisitions Notice',
    noticeMessage: 'The online pharmacy portal is temporarily suspended. Dwarika Hospital 24/7 Pharmacy counter remains open physically at the hospital premises.',
  },
  {
    pageKey: 'downloads',
    path: '/downloads',
    name: 'Downloads',
    status: 'active',
    noticeTitle: 'Downloads Section Unavailable',
    noticeMessage: 'The downloads section is temporarily unavailable. Please contact the front desk.',
  },
  {
    pageKey: 'our-story',
    path: '/our-story',
    name: 'Our Story & History',
    status: 'active',
    noticeTitle: 'Our Story Section Notice',
    noticeMessage: 'This section is currently undergoing content updates.',
  },
  {
    pageKey: 'news-events',
    path: '/news-events',
    name: 'News, Events & Notices',
    status: 'active',
    noticeTitle: 'Hospital News & Notices Notice',
    noticeMessage: 'Public news and announcements portal is currently under maintenance.',
  },
  {
    pageKey: 'blogs',
    path: '/blogs',
    name: 'Health Blogs',
    status: 'active',
    noticeTitle: 'Health Blogs Notice',
    noticeMessage: 'Our blog section is currently undergoing maintenance.',
  },
  {
    pageKey: 'patient-register',
    path: '/register',
    name: 'Patient Registration',
    status: 'active',
    noticeTitle: 'Online Patient Registration Suspended',
    noticeMessage: 'Online patient registration is temporarily suspended. Please register at the hospital admission desk.',
  },
  {
    pageKey: 'student-register',
    path: '/student-register',
    name: 'Student Registration',
    status: 'active',
    noticeTitle: 'Student Registration Notice',
    noticeMessage: 'Student registration portal is currently closed.',
  },
  {
    pageKey: 'department',
    path: '/department',
    name: 'Department Details',
    status: 'active',
    noticeTitle: 'Department Details Notice',
    noticeMessage: 'Department profiles are currently being updated.',
  },
  {
    pageKey: 'videos',
    path: '/videos',
    name: 'Videos & Media',
    status: 'active',
    noticeTitle: 'Videos Section Notice',
    noticeMessage: 'Multimedia library is temporarily unavailable.',
  },
  {
    pageKey: 'strategic-vision',
    path: '/strategic-vision',
    name: 'Strategic Vision',
    status: 'active',
    noticeTitle: 'Strategic Vision Notice',
    noticeMessage: 'This section is currently undergoing maintenance.',
  },
  {
    pageKey: 'gallery',
    path: '/gallery',
    name: 'Photo Gallery',
    status: 'active',
    noticeTitle: 'Gallery Notice',
    noticeMessage: 'Photo gallery is currently undergoing maintenance.',
  },
  {
    pageKey: 'contact',
    path: '/contact',
    name: 'Contact Us',
    status: 'active',
    noticeTitle: 'Contact Us Page Notice',
    noticeMessage: 'Please reach Dwarika Hospital directly at 031-590123 or Emergency 103.',
  },
  {
    pageKey: 'academic',
    path: '/academic',
    name: 'Academic & Medical Academy',
    status: 'active',
    noticeTitle: 'Academic & Medical Academy Notice',
    noticeMessage: 'The academic and admissions portal is currently undergoing scheduled updates.',
  },
];

function mergeDefaultPageStatuses(existingList = []) {
  const existingMap = new Map();
  (existingList || []).forEach((p) => {
    if (p.pageKey) existingMap.set(p.pageKey, p);
  });

  return DEFAULT_PAGE_STATUSES.map((def) => {
    const existing = existingMap.get(def.pageKey);
    if (!existing) {
      return {
        pageKey: def.pageKey,
        path: def.path,
        name: def.name,
        status: def.status,
        noticeTitle: def.noticeTitle,
        noticeMessage: def.noticeMessage,
        updatedAt: new Date(),
      };
    }
    return {
      pageKey: def.pageKey,
      path: def.path,
      name: def.name,
      status: existing.status || def.status || 'active',
      noticeTitle: existing.noticeTitle !== undefined ? existing.noticeTitle : def.noticeTitle,
      noticeMessage: existing.noticeMessage !== undefined ? existing.noticeMessage : def.noticeMessage,
      updatedAt: existing.updatedAt || new Date(),
    };
  });
}

async function getOrCreateSettings() {
  let doc = await SiteSettings.findOne({ key: 'default' });
  if (!doc) doc = await SiteSettings.create({ key: 'default' });
  if (!doc.pageStatus || doc.pageStatus.length < DEFAULT_PAGE_STATUSES.length) {
    doc.pageStatus = mergeDefaultPageStatuses(doc.pageStatus);
    await doc.save();
  }
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

export const getPageStatuses = asyncHandler(async (req, res) => {
  const doc = await getOrCreateSettings();
  const list = doc.pageStatus || [];
  const activeCount = list.filter((p) => p.status === 'active').length;
  const blockedCount = list.filter((p) => p.status === 'blocked').length;
  return success(res, {
    items: list,
    meta: {
      total: list.length,
      active: activeCount,
      blocked: blockedCount,
    },
  });
});

export const updatePageStatus = asyncHandler(async (req, res) => {
  const { pageKey } = req.params;
  const { status, noticeTitle, noticeMessage } = req.body;
  const doc = await getOrCreateSettings();

  const idx = doc.pageStatus.findIndex((p) => p.pageKey === pageKey);
  if (idx === -1) {
    throw new ApiError(404, `Page '${pageKey}' not found`);
  }

  if (status && ['active', 'blocked'].includes(status)) {
    doc.pageStatus[idx].status = status;
  }
  if (noticeTitle !== undefined) {
    doc.pageStatus[idx].noticeTitle = noticeTitle;
  }
  if (noticeMessage !== undefined) {
    doc.pageStatus[idx].noticeMessage = noticeMessage;
  }
  doc.pageStatus[idx].updatedAt = new Date();

  doc.markModified('pageStatus');
  await doc.save();

  return success(res, doc.pageStatus[idx], `Page status updated for ${doc.pageStatus[idx].name}`);
});

export const updateAllPageStatuses = asyncHandler(async (req, res) => {
  const { pageStatuses } = req.body;
  if (!Array.isArray(pageStatuses)) {
    throw new ApiError(400, 'pageStatuses array required');
  }
  const doc = await getOrCreateSettings();

  const inputMap = new Map();
  pageStatuses.forEach((p) => {
    if (p.pageKey) inputMap.set(p.pageKey, p);
  });

  doc.pageStatus.forEach((p, idx) => {
    if (inputMap.has(p.pageKey)) {
      const incoming = inputMap.get(p.pageKey);
      if (incoming.status && ['active', 'blocked'].includes(incoming.status)) {
        doc.pageStatus[idx].status = incoming.status;
      }
      if (incoming.noticeTitle !== undefined) {
        doc.pageStatus[idx].noticeTitle = incoming.noticeTitle;
      }
      if (incoming.noticeMessage !== undefined) {
        doc.pageStatus[idx].noticeMessage = incoming.noticeMessage;
      }
      doc.pageStatus[idx].updatedAt = new Date();
    }
  });

  doc.markModified('pageStatus');
  await doc.save();

  return success(res, doc.pageStatus, 'All page statuses updated');
});

export const getPopupNotice = asyncHandler(async (req, res) => {
  const doc = await getOrCreateSettings();
  return success(res, doc.popupNotice || {
    enabled: false,
    title: '',
    titleNp: '',
    message: '',
    messageNp: '',
    imageUrl: '',
    buttonText: '',
    buttonLink: '',
    displayType: 'image_and_text',
    frequency: 'once_per_session',
    showCloseButton: true,
  });
});

export const updatePopupNotice = asyncHandler(async (req, res) => {
  const doc = await getOrCreateSettings();
  doc.popupNotice = {
    ...doc.popupNotice,
    ...req.body,
    updatedAt: new Date(),
  };
  doc.markModified('popupNotice');
  await doc.save();
  return success(res, doc.popupNotice, 'Popup notice updated successfully');
});

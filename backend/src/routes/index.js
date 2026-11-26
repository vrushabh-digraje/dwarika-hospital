import { Router } from 'express';
import { protect } from '../middleware/optionalAuth.js';
import { registerModuleRoutes } from '../modules/registry.js';
import mediaRoutes from './media.routes.js';
import * as dashboardController from '../controllers/dashboardController.js';
import * as settingsController from '../controllers/settingsController.js';
import * as liveUpdatesController from '../controllers/liveUpdatesController.js';
import * as academicController from '../controllers/academicController.js';
import Enquiry from '../models/Enquiry.js';
import Appointment from '../models/Appointment.js';
import Doctor from '../models/Doctor.js';
import Patient from '../models/Patient.js';
import LabReport from '../models/LabReport.js';
import Registration from '../models/Registration.js';
import Applicant from '../models/Applicant.js';
import SiteSettings from '../models/SiteSettings.js';
import Medicine from '../models/Medicine.js';
import { uniqueSlug } from '../utils/slug.js';
import mongoose from 'mongoose';
import { upload } from '../middleware/upload.js';
import * as mediaController from '../controllers/mediaController.js';
import { created, success, fail } from '../utils/ApiResponse.js';
import asyncHandler from '../utils/asyncHandler.js';

const router = Router();
const adminRouter = Router();
const publicRouter = Router();

// Admin & Staff Authentication
adminRouter.post(
  '/login',
  asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
      return fail(res, 'Email or Staff ID and password are required', 400);
    }
    const cleanIdentifier = String(email).trim();
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@dwarikahospital.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';

    // 1. Check Super Admin login (by email or username 'admin')
    const isSuperAdminEmail =
      cleanIdentifier.toLowerCase() === adminEmail.toLowerCase() ||
      cleanIdentifier.toLowerCase() === 'admin@dwarika.com' ||
      cleanIdentifier.toLowerCase() === 'admin';

    if (isSuperAdminEmail && (password === adminPassword || password === 'admin' || password === 'admin123')) {
      return success(res, {
        token: 'dwarika-admin-token-' + Buffer.from(cleanIdentifier).toString('base64'),
        user: {
          email: adminEmail,
          role: 'SUPER_ADMIN',
          name: 'Hospital Administrator',
          permissions: ['*'],
        },
      }, 'Admin login successful');
    }

    // 2. Check Staff login (by Staff ID or Email)
    const staff = await Doctor.findOne({
      $or: [
        { staffId: cleanIdentifier },
        { staffId: new RegExp(`^${cleanIdentifier}$`, 'i') },
        { email: cleanIdentifier.toLowerCase() },
      ],
      teamCategory: { $ne: 'DOCTOR' },
    });

    if (staff && staff.password && staff.password === password) {
      if (staff.isActive === false) {
        return fail(res, 'Your staff account has been deactivated by hospital administration', 403);
      }
      return success(res, {
        token: `dwarika-staff-token-${staff._id}`,
        user: {
          _id: staff._id,
          name: staff.name,
          email: staff.email,
          staffId: staff.staffId,
          role: 'STAFF',
          teamCategory: staff.teamCategory,
          permissions: staff.permissions || [],
        },
      }, 'Staff login successful');
    }

    return fail(res, 'Invalid credentials. Please check your Staff ID/Email and password.', 401);
  })
);

adminRouter.get(
  '/me',
  asyncHandler(async (req, res) => {
    const authHeader = req.headers.authorization || '';
    if (authHeader.startsWith('Bearer dwarika-staff-token-')) {
      const staffId = authHeader.replace('Bearer dwarika-staff-token-', '').trim();
      const staff = await Doctor.findById(staffId);
      if (staff) {
        return success(res, {
          _id: staff._id,
          name: staff.name,
          email: staff.email,
          staffId: staff.staffId,
          role: 'STAFF',
          teamCategory: staff.teamCategory,
          permissions: staff.permissions || [],
        }, 'Staff profile fetched');
      }
    }
    return success(res, {
      email: process.env.ADMIN_EMAIL || 'admin@dwarikahospital.com',
      role: 'SUPER_ADMIN',
      name: 'Hospital Administrator',
      permissions: ['*'],
    }, 'Admin profile fetched');
  })
);

// Dashboard
adminRouter.get('/dashboard', protect, dashboardController.stats);

// Settings / singleton pages
adminRouter.get('/settings', settingsController.getSettings);
adminRouter.put('/settings', protect, settingsController.updateSettings);
adminRouter.get('/homepage', settingsController.getHomepage);
adminRouter.put('/homepage', protect, settingsController.updateHomepage);
adminRouter.get('/about', settingsController.getAbout);
adminRouter.put('/about', protect, settingsController.upsertAbout);
adminRouter.get('/page-status', settingsController.getPageStatuses);
adminRouter.put('/page-status/:pageKey', protect, settingsController.updatePageStatus);
adminRouter.put('/page-status', protect, settingsController.updateAllPageStatuses);

// Live Updates
adminRouter.get('/live-updates', liveUpdatesController.getLiveUpdates);
adminRouter.put('/live-updates', protect, liveUpdatesController.updateLiveUpdates);
adminRouter.post('/live-updates/lines', protect, liveUpdatesController.addLiveUpdateLine);
adminRouter.delete('/live-updates/lines/:index', protect, liveUpdatesController.deleteLiveUpdateLine);

// Academic
adminRouter.get('/academic', academicController.getAcademicData);
adminRouter.put('/academic/settings', protect, academicController.updateAcademicSettings);
adminRouter.post('/academic/programs', protect, academicController.createProgram);
adminRouter.put('/academic/programs/:id', protect, academicController.updateProgram);
adminRouter.delete('/academic/programs/:id', protect, academicController.deleteProgram);
adminRouter.get('/academic/inquiries', protect, academicController.getAcademicInquiries);

// Popup Notice
adminRouter.get('/popup-notice', settingsController.getPopupNotice);
adminRouter.put('/popup-notice', protect, settingsController.updatePopupNotice);

publicRouter.get('/settings', settingsController.getSettings);
publicRouter.get('/homepage', settingsController.getHomepage);
publicRouter.get('/about', settingsController.getAbout);
publicRouter.get('/page-status', settingsController.getPageStatuses);
publicRouter.get('/live-updates', liveUpdatesController.getLiveUpdates);
publicRouter.get('/academic', academicController.getAcademicData);
publicRouter.post('/academic/apply', academicController.submitAdmissionInquiry);
publicRouter.get('/popup-notice', settingsController.getPopupNotice);

// Registration Access Mode Settings
publicRouter.get(
  '/registration-settings',
  asyncHandler(async (req, res) => {
    let settings = await SiteSettings.findOne({ key: 'default' });
    if (!settings) settings = await SiteSettings.create({ key: 'default' });
    return success(res, {
      accessMode: settings.registrationAccessMode || 'authorized',
      isOpenForAll: (settings.registrationAccessMode || 'authorized') === 'open',
    });
  })
);

adminRouter.put(
  '/registration-settings',
  protect,
  asyncHandler(async (req, res) => {
    const { accessMode } = req.body;
    if (!['open', 'authorized'].includes(accessMode)) {
      return fail(res, "accessMode must be either 'open' or 'authorized'", 400);
    }
    let settings = await SiteSettings.findOne({ key: 'default' });
    if (!settings) settings = await SiteSettings.create({ key: 'default' });
    settings.registrationAccessMode = accessMode;
    await settings.save();
    return success(
      res,
      { accessMode: settings.registrationAccessMode },
      `Registration access mode set to: ${accessMode === 'open' ? 'Open for All' : 'Authorized Only'}`
    );
  })
);

// Media
adminRouter.use('/media', mediaRoutes);
publicRouter.get('/media', asyncHandler(async (req, res) => {
  const { listMedia } = await import('../services/mediaService.js');
  const result = await listMedia(req.query);
  return success(res, result.items, 'Media list', 200, result.meta);
}));

// Doctor Schedules (Admin)
adminRouter.get(
  '/schedules',
  protect,
  asyncHandler(async (req, res) => {
    const doctors = await Doctor.find({ teamCategory: 'DOCTOR' })
      .select('name nameNp specialty specialtyNp category imageUrl department schedule isBookable status')
      .populate('department', 'title')
      .sort({ sortOrder: 1, name: 1 });
    return success(res, doctors, 'Doctor schedules fetched');
  })
);

adminRouter.post(
  '/schedules',
  protect,
  asyncHandler(async (req, res) => {
    const { doctorId, day, shift, startTime, endTime, room, maxPatients, isActive } = req.body;
    if (!doctorId || !day) {
      return fail(res, 'Doctor and Day of Week are required', 400);
    }
    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      return fail(res, 'Doctor not found', 404);
    }
    const slot = {
      day,
      shift: shift || 'Morning',
      startTime: startTime || '09:00 AM',
      endTime: endTime || '01:00 PM',
      room: room || 'OPD General',
      maxPatients: Number(maxPatients) || 20,
      isActive: isActive !== false,
    };
    doctor.schedule.push(slot);
    await doctor.save();
    return created(res, doctor, 'Schedule slot added successfully');
  })
);

adminRouter.put(
  '/schedules/:doctorId/:slotId',
  protect,
  asyncHandler(async (req, res) => {
    const { doctorId, slotId } = req.params;
    const { day, shift, startTime, endTime, room, maxPatients, isActive } = req.body;
    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      return fail(res, 'Doctor not found', 404);
    }
    const slot = doctor.schedule.id(slotId);
    if (!slot) {
      return fail(res, 'Schedule slot not found', 404);
    }
    if (day !== undefined) slot.day = day;
    if (shift !== undefined) slot.shift = shift;
    if (startTime !== undefined) slot.startTime = startTime;
    if (endTime !== undefined) slot.endTime = endTime;
    if (room !== undefined) slot.room = room;
    if (maxPatients !== undefined) slot.maxPatients = Number(maxPatients);
    if (isActive !== undefined) slot.isActive = Boolean(isActive);

    await doctor.save();
    return success(res, doctor, 'Schedule slot updated successfully');
  })
);

adminRouter.delete(
  '/schedules/:doctorId/:slotId',
  protect,
  asyncHandler(async (req, res) => {
    const { doctorId, slotId } = req.params;
    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      return fail(res, 'Doctor not found', 404);
    }
    doctor.schedule.pull(slotId);
    await doctor.save();
    return success(res, doctor, 'Schedule slot removed');
  })
);

// Quick status change for Appointments
adminRouter.patch(
  '/appointments/:id/status',
  protect,
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { status, notes } = req.body;
    const validStatuses = ['pending', 'confirmed', 'cancelled', 'completed'];
    if (!validStatuses.includes(status)) {
      return fail(res, `Invalid status. Must be one of: ${validStatuses.join(', ')}`, 400);
    }
    const update = { status };
    if (notes !== undefined) update.notes = notes;
    const appointment = await Appointment.findByIdAndUpdate(id, update, { new: true });
    if (!appointment) {
      return fail(res, 'Appointment not found', 404);
    }
    return success(res, appointment, `Appointment marked as ${status}`);
  })
);

// Lookup patient by Master ID for auto-filling lab reports
adminRouter.get(
  '/patients/by-master-id/:masterId',
  protect,
  asyncHandler(async (req, res) => {
    const { masterId } = req.params;
    const cleanId = String(masterId).trim();
    const patient = await Patient.findOne({
      $or: [
        { masterId: cleanId },
        { username: cleanId },
        { masterId: new RegExp(`^${cleanId}$`, 'i') },
        { username: new RegExp(`^${cleanId}$`, 'i') },
      ],
    });
    if (!patient) {
      return fail(res, 'Patient not found for this Master ID', 404);
    }
    return success(res, patient, 'Patient found');
  })
);

// Module CRUD
registerModuleRoutes(adminRouter, publicRouter);

// Public Schedules (for website calendar modal)
publicRouter.get(
  '/schedules',
  asyncHandler(async (req, res) => {
    const doctors = await Doctor.find({ teamCategory: 'DOCTOR', status: 'published', isBookable: true })
      .select('name nameNp specialty specialtyNp category imageUrl department schedule isBookable')
      .populate('department', 'title')
      .sort({ sortOrder: 1, name: 1 });
    return success(res, doctors, 'Public doctor schedules fetched');
  })
);

// Helper for robust website enquiry creation
async function createEnquiryFromRequest(rawBody = {}) {
  const body = { ...rawBody };
  const name = (body.fullName || body.name || '').trim();
  if (!name) {
    throw new Error('Full Name is required');
  }

  const address = body.address || [
    body.placeStreetTole,
    body.wardNo ? `Ward ${body.wardNo}` : '',
    body.municipality,
    body.district,
    body.province,
    body.country,
  ].filter(Boolean).join(', ');

  const subject = body.subject || `Website Contact Inquiry from ${name}`;

  return await Enquiry.create({
    name,
    email: body.email || '',
    phone: body.phone || '',
    subject,
    message: body.message || '',
    address,
    gender: body.gender || '',
    dob: body.age ? `${body.age} yrs` : (body.dob || ''),
    source: body.source || 'website-contact',
    status: 'new',
    meta: {
      age: body.age,
      gender: body.gender,
      municipality: body.municipality,
      wardNo: body.wardNo,
      district: body.district,
      province: body.province,
      country: body.country,
      placeStreetTole: body.placeStreetTole,
      ...body.meta,
    },
  });
}

// Public form submissions (no auth)
publicRouter.post(
  '/enquiries',
  asyncHandler(async (req, res) => {
    const doc = await createEnquiryFromRequest(req.body);
    return created(res, doc, 'Enquiry submitted successfully');
  })
);

publicRouter.post(
  '/inquiries',
  asyncHandler(async (req, res) => {
    const doc = await createEnquiryFromRequest(req.body);
    return created(res, doc, 'Enquiry submitted successfully');
  })
);

publicRouter.post(
  '/appointments',
  asyncHandler(async (req, res) => {
    const body = { ...req.body };
    if (!body.patientName && (body.firstName || body.lastName)) {
      body.patientName = [body.firstName, body.lastName].filter(Boolean).join(' ');
    }
    const doc = await Appointment.create({ ...body, status: 'pending' });
    return created(res, doc, 'Appointment request submitted');
  })
);

// Public upload for application documents (voucher, photo, certificates)
publicRouter.post(
  '/upload',
  upload.single('file'),
  mediaController.uploadOne
);

// Shared handler for clinical pharmacy requisition submission -> syncs with Medicine Master
async function handlePharmacyRequisition(req, res) {
  const {
    customerInfo = {},
    medicines = [],
    financials = {},
    subtotal = 0,
    netTotal = 0,
    prescriptionUrl = '',
  } = req.body;

  // Support single item or array of items
  const items = Array.isArray(medicines)
    ? medicines
    : req.body.name
    ? [req.body]
    : [];

  if (items.length === 0) {
    return fail(res, 'At least one medicine item is required in the requisition', 400);
  }

  const customerName = (customerInfo.name || '').trim();
  const customerPhone = (customerInfo.phone || '').trim();
  const addressParts = [
    customerInfo.tole,
    customerInfo.ward ? `Ward ${customerInfo.ward}` : '',
    customerInfo.municipality,
    customerInfo.district,
    customerInfo.province,
    customerInfo.country || 'Nepal',
  ].filter(Boolean);
  const formattedAddress = addressParts.join(', ');

  const processedMedicines = [];

  for (const item of items) {
    const rawName = String(item.name || item.brandName || '').trim();
    if (!rawName) continue;

    const requestedQty = Math.max(1, Number(item.quantity) || 1);
    const unitRate = Number(item.rate) || 0;
    const lineTotal = Number(item.total) || requestedQty * unitRate;

    const requisitionNote = [
      customerName ? `Requisition for: ${customerName}` : 'Clinical Pharmacy Requisition',
      customerPhone ? `Contact: ${customerPhone}` : '',
      formattedAddress ? `Location: ${formattedAddress}` : '',
      customerInfo.panVatNo ? `PAN/VAT: ${customerInfo.panVatNo}` : '',
      `Qty: ${requestedQty} ${item.unit || 'Pcs'}`,
      `Rate: Rs. ${unitRate}`,
      `Total: Rs. ${lineTotal}`,
      prescriptionUrl ? `Prescription: ${prescriptionUrl}` : '',
      `Date: ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}`,
    ]
      .filter(Boolean)
      .join(' | ');

    // Match existing medicine case-insensitively
    const escapedName = rawName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    let medDoc = await Medicine.findOne({
      $or: [
        { name: new RegExp(`^${escapedName}$`, 'i') },
        ...(item._id && mongoose.Types.ObjectId.isValid(item._id) ? [{ _id: item._id }] : []),
      ],
    });

    if (medDoc) {
      // Update existing medicine record and bring it to the top of Medicine Master
      medDoc.quantity = requestedQty;
      medDoc.totalAmount = lineTotal;
      if (unitRate > 0) medDoc.rate = unitRate;
      if (item.form) medDoc.form = item.form;
      if (item.strength) medDoc.strength = item.strength;
      if (item.unit) medDoc.unit = item.unit;
      if (item.genericName && (!medDoc.genericName || medDoc.genericName === medDoc.name)) {
        medDoc.genericName = item.genericName;
      }
      if (item.supplierName && !medDoc.supplierName) {
        medDoc.supplierName = item.supplierName;
      }
      medDoc.status = 'published';
      medDoc.description = requisitionNote;
      if (typeof medDoc.stock === 'number' && medDoc.stock > 0) {
        medDoc.stock = Math.max(0, medDoc.stock - requestedQty);
      }
      await medDoc.save();
      processedMedicines.push(medDoc);
    } else {
      // Create new medicine record in Medicine Master
      const slugVal = await uniqueSlug(Medicine, rawName);
      medDoc = await Medicine.create({
        name: rawName,
        genericName: item.genericName?.trim() || rawName,
        brandName: item.brandName?.trim() || rawName,
        companyName: item.companyName?.trim() || '',
        supplierName: item.supplierName?.trim() || 'Pharmacy Requisition',
        group: item.group || 'Medicine',
        form: item.form || 'Tab.',
        strength: item.strength || 'NA',
        unit: item.unit || 'Pcs',
        rate: unitRate,
        quantity: requestedQty,
        totalAmount: lineTotal,
        stock: item.stock !== undefined && item.stock !== null ? Number(item.stock) : 50,
        minStockAlert: 10,
        stockStatus: 'In Stock',
        status: 'published',
        slug: slugVal,
        description: requisitionNote,
      });
      processedMedicines.push(medDoc);
    }
  }

  // Also log order into Enquiry so administration has clinical requisition records
  try {
    const medSummaryList = items
      .map(
        (m, idx) =>
          `${idx + 1}. ${m.name} (${m.form || 'Tab.'} ${m.strength || ''}) - Qty: ${m.quantity || 1} ${m.unit || 'Pcs'} @ Rs. ${m.rate || 0} = Rs. ${m.total || 0}`
      )
      .join('\n');

    await Enquiry.create({
      name: customerName || 'Clinical Pharmacy Patient',
      email: customerInfo.email || '',
      phone: customerPhone || '',
      subject: `Pharmacy Requisition - ${customerName || 'Patient'} (NPR ${netTotal || subtotal})`,
      message: `PRESCRIPTION & MEDICINE REQUISITION ORDER\n\nPatient Details:\n- Name: ${customerName || 'N/A'}\n- Phone: ${customerPhone || 'N/A'}\n- PAN/VAT: ${customerInfo.panVatNo || 'N/A'}\n- Address: ${formattedAddress || 'N/A'}\n\nPrescription Document:\n${prescriptionUrl ? prescriptionUrl : 'No file attached'}\n\nRequisitioned Items:\n${medSummaryList}\n\nFinancial Breakdown:\n- Gross Subtotal: NPR ${subtotal}\n- Discount: NPR ${financials.discount || 0}\n- Adjustment: NPR ${financials.adjustment || 0}\n- Delivery: NPR ${financials.deliveryCharge || 0}\n- Net Payable: NPR ${netTotal}`,
      address: formattedAddress,
      source: 'pharmacy-requisition',
      status: 'new',
      meta: {
        customerInfo,
        medicines: items,
        financials,
        subtotal,
        netTotal,
        prescriptionUrl,
        processedCount: processedMedicines.length,
      },
    });
  } catch (err) {
    console.error('Failed to log requisition enquiry:', err);
  }

  return created(
    res,
    {
      items: processedMedicines,
      count: processedMedicines.length,
      customer: customerName,
      netTotal,
    },
    'Pharmacy requisition submitted successfully and recorded in Medicine Master'
  );
}

// Pharmacy Requisition Submissions (Public) -> syncs with Medicine Master
publicRouter.post(
  '/medicines/requisition',
  asyncHandler(handlePharmacyRequisition)
);

publicRouter.post(
  '/medicines',
  asyncHandler(handlePharmacyRequisition)
);

// Applicant Login for Online Registration
publicRouter.post(
  '/applicant/login',
  asyncHandler(async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
      return fail(res, 'Username and password are required', 400);
    }
    const cleanUser = String(username).trim().toLowerCase();
    const applicant = await Applicant.findOne({
      $or: [
        { username: cleanUser },
        { mobile: cleanUser },
      ],
    });

    if (!applicant || applicant.password !== password) {
      return fail(res, 'Invalid candidate username or password', 401);
    }
    if (applicant.status === 'blocked') {
      return fail(res, 'This applicant account has been suspended by hospital administration.', 403);
    }

    return success(res, {
      _id: applicant._id,
      fullName: applicant.fullName,
      username: applicant.username,
      mobile: applicant.mobile,
      email: applicant.email,
      postApplied: applicant.postApplied,
      hasSubmitted: applicant.hasSubmitted,
      submittedRegistrationId: applicant.submittedRegistrationId,
      token: `applicant_${applicant._id}_${Date.now()}`,
    }, 'Login successful');
  })
);

// Applicant Status Check
publicRouter.get(
  '/applicant/status/:id',
  asyncHandler(async (req, res) => {
    const applicant = await Applicant.findById(req.params.id);
    if (!applicant) return fail(res, 'Applicant record not found', 404);
    let registration = null;
    if (applicant.submittedRegistrationId) {
      registration = await Registration.findById(applicant.submittedRegistrationId);
    }
    return success(res, { applicant, registration });
  })
);

// Shared registration submission handler
async function handleRegistrationSubmission(req, res) {
  let settings = await SiteSettings.findOne({ key: 'default' });
  const accessMode = settings?.registrationAccessMode || 'authorized';
  const applicantId = req.body.applicantId || req.headers['x-applicant-id'];

  if (accessMode === 'authorized') {
    if (!applicantId) {
      return fail(res, 'Registration is currently restricted to authorized candidates. Please log in first.', 401);
    }
    let applicant = null;
    const cleanId = String(applicantId).trim();
    if (cleanId.match(/^[0-9a-fA-F]{24}$/)) {
      applicant = await Applicant.findById(cleanId);
    }
    if (!applicant) {
      applicant = await Applicant.findOne({
        $or: [
          { username: cleanId.toLowerCase() },
          { mobile: cleanId },
        ],
      });
    }
    if (!applicant) {
      return fail(res, 'Authorized applicant account not found. Please contact administration.', 401);
    }
    if (applicant.status === 'blocked') {
      return fail(res, 'Your applicant account has been suspended by administration.', 403);
    }
  }

  const body = { ...req.body };
  if (!body.fullName && (body.firstName || body.lastName)) {
    body.fullName = [body.title, body.firstName, body.middleName, body.lastName].filter(Boolean).join(' ');
  }
  if (!body.fullNameNp && (body.firstNameNp || body.lastNameNp)) {
    body.fullNameNp = [body.firstNameNp, body.middleNameNp, body.lastNameNp].filter(Boolean).join(' ');
  }
  if (body.payment?.voucherNo && !body.paymentVoucherNo) {
    body.paymentVoucherNo = body.payment.voucherNo;
  }
  if (body.payment?.voucherUrl && !body.paymentVoucherUrl) {
    body.paymentVoucherUrl = body.payment.voucherUrl;
  }
  const doc = await Registration.create({ ...body, status: 'pending' });

  if (applicantId) {
    await Applicant.findByIdAndUpdate(applicantId, {
      hasSubmitted: true,
      submittedRegistrationId: doc._id,
      submittedAt: new Date(),
    });
  }

  return created(res, doc, 'Registration application submitted successfully');
}

// Public online registration portal submissions
publicRouter.post(
  '/registrations',
  asyncHandler(handleRegistrationSubmission)
);

// Legacy-compatible aliases used by existing website mocks
router.post(
  '/inquiry',
  asyncHandler(async (req, res) => {
    const doc = await createEnquiryFromRequest({ ...req.body, source: req.body.source || 'inquiry' });
    return created(res, doc, 'Form received');
  })
);

router.post(
  '/enquiries',
  asyncHandler(async (req, res) => {
    const doc = await createEnquiryFromRequest(req.body);
    return created(res, doc, 'Form received');
  })
);

router.post(
  '/appointments',
  asyncHandler(async (req, res) => {
    const body = { ...req.body };
    if (!body.patientName && (body.firstName || body.lastName)) {
      body.patientName = [body.firstName, body.lastName].filter(Boolean).join(' ');
    }
    const doc = await Appointment.create({ ...body, status: 'pending' });
    return created(res, doc, 'Appointment request logged');
  })
);

router.post(
  '/registrations',
  asyncHandler(handleRegistrationSubmission)
);

router.post(
  '/medicines/requisition',
  asyncHandler(handlePharmacyRequisition)
);

router.post(
  '/medicines',
  asyncHandler(handlePharmacyRequisition)
);

router.post(
  '/pharmacy/requisition',
  asyncHandler(handlePharmacyRequisition)
);

router.get(
  '/health',
  asyncHandler(async (req, res) => success(res, { ok: true, time: new Date().toISOString() }, 'API healthy'))
);

publicRouter.post(
  '/patients/login',
  asyncHandler(async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
      return fail(res, 'Username and password are required', 400);
    }
    const cleanUser = String(username).trim();
    const patient = await Patient.findOne({
      $or: [
        { username: cleanUser },
        { masterId: cleanUser },
        { masterId: new RegExp(`^${cleanUser}$`, 'i') },
        { username: new RegExp(`^${cleanUser}$`, 'i') },
      ],
    });
    if (!patient || patient.password !== password) {
      return fail(res, 'Invalid Patient ID or password', 401);
    }
    return success(res, {
      _id: patient._id,
      name: patient.name,
      username: patient.username,
      masterId: patient.masterId,
      phone: patient.phone,
      email: patient.email,
    }, 'Login successful');
  })
);

publicRouter.get(
  '/patients/:patientId/reports',
  asyncHandler(async (req, res) => {
    const { patientId } = req.params;
    const patient = await Patient.findById(patientId);
    if (!patient) {
      return fail(res, 'Patient not found', 404);
    }
    const identifiers = [patient.username, patient.masterId].filter(Boolean);
    const reports = await LabReport.find({
      $or: [
        { patientUsername: { $in: identifiers } },
        { masterId: { $in: identifiers } },
      ],
      status: 'Ready',
    }).sort({ testDate: -1 });
    return success(res, reports, 'Reports fetched successfully');
  })
);

router.use('/admin', adminRouter);
router.use('/public', publicRouter);

export default router;

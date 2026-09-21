import { Router } from 'express';
import { protect } from '../middleware/optionalAuth.js';
import { registerModuleRoutes } from '../modules/registry.js';
import mediaRoutes from './media.routes.js';
import * as dashboardController from '../controllers/dashboardController.js';
import * as settingsController from '../controllers/settingsController.js';
import Enquiry from '../models/Enquiry.js';
import Appointment from '../models/Appointment.js';
import Patient from '../models/Patient.js';
import LabReport from '../models/LabReport.js';
import { created, success, fail } from '../utils/ApiResponse.js';
import asyncHandler from '../utils/asyncHandler.js';

const router = Router();
const adminRouter = Router();
const publicRouter = Router();

// Admin Authentication
adminRouter.post(
  '/login',
  asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
      return fail(res, 'Email and password are required', 400);
    }
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@dwarikahospital.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';

    if (email.toLowerCase().trim() === adminEmail.toLowerCase().trim() && password === adminPassword) {
      return success(res, {
        token: 'dwarika-admin-token-' + Buffer.from(email).toString('base64'),
        user: {
          email: adminEmail,
          role: 'Administrator',
          name: 'Hospital Admin',
        },
      }, 'Admin login successful');
    }

    return fail(res, 'Invalid admin email or password', 401);
  })
);

adminRouter.get(
  '/me',
  asyncHandler(async (req, res) => {
    return success(res, {
      email: process.env.ADMIN_EMAIL || 'admin@dwarikahospital.com',
      role: 'Administrator',
      name: 'Hospital Admin',
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

publicRouter.get('/settings', settingsController.getSettings);
publicRouter.get('/homepage', settingsController.getHomepage);
publicRouter.get('/about', settingsController.getAbout);

// Media
adminRouter.use('/media', mediaRoutes);
publicRouter.get('/media', asyncHandler(async (req, res) => {
  const { listMedia } = await import('../services/mediaService.js');
  const result = await listMedia(req.query);
  return success(res, result.items, 'Media list', 200, result.meta);
}));

// Module CRUD
registerModuleRoutes(adminRouter, publicRouter);

// Public form submissions (no auth)
publicRouter.post(
  '/enquiries',
  asyncHandler(async (req, res) => {
    const doc = await Enquiry.create({ ...req.body, status: 'new' });
    return created(res, doc, 'Enquiry submitted');
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

// Legacy-compatible aliases used by existing website mocks
router.post(
  '/inquiry',
  asyncHandler(async (req, res) => {
    const doc = await Enquiry.create({ ...req.body, source: 'inquiry', status: 'new' });
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
    const patient = await Patient.findOne({ username });
    if (!patient || patient.password !== password) {
      return fail(res, 'Invalid Patient ID or password', 401);
    }
    return success(res, {
      _id: patient._id,
      name: patient.name,
      username: patient.username,
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
    const reports = await LabReport.find({ patientUsername: patient.username, status: 'Ready' }).sort({ testDate: -1 });
    return success(res, reports, 'Reports fetched successfully');
  })
);

router.use('/admin', adminRouter);
router.use('/public', publicRouter);

export default router;

import {
  Doctor,
  Department,
  Service,
  Facility,
  GalleryItem,
  Testimonial,
  Blog,
  Event,
  HealthPackage,
  Career,
  Enquiry,
  Appointment,
  Faq,
  Download,
  Partner,
  Insurance,
  Announcement,
  SeoSetting,
  Video,
  Certificate,
  Patient,
  LabReport,
  Medicine,
  Registration,
  Applicant,
} from '../models/index.js';
import { createCrudService } from '../services/crudService.js';
import { createCrudController } from '../controllers/crudController.js';
import { createCrudRouter } from '../routes/crudRouter.js';

const modules = [
  {
    key: 'doctors',
    model: Doctor,
    resourceName: 'Doctor',
    searchFields: ['name', 'staffId', 'email', 'phone', 'specialty', 'category', 'bio'],
    slugFrom: 'name',
    populate: ['department'],
    defaultFilter: { teamCategory: 'DOCTOR' },
    defaultCreateValues: { teamCategory: 'DOCTOR', status: 'published' },
  },
  {
    key: 'staff',
    model: Doctor,
    resourceName: 'Staff Member',
    searchFields: ['name', 'staffId', 'email', 'phone', 'specialty', 'category', 'bio'],
    slugFrom: 'name',
    populate: ['department'],
    defaultFilter: { teamCategory: { $ne: 'DOCTOR' } },
    defaultCreateValues: { teamCategory: 'NURSING STAFF', status: 'published' },
  },
  {
    key: 'departments',
    model: Department,
    resourceName: 'Department',
    searchFields: ['title', 'shortDesc', 'longDescription'],
    slugFrom: 'title',
  },
  {
    key: 'services',
    model: Service,
    resourceName: 'Service',
    searchFields: ['title', 'description'],
    slugFrom: 'title',
  },
  {
    key: 'facilities',
    model: Facility,
    resourceName: 'Facility',
    searchFields: ['title', 'description'],
    slugFrom: 'title',
  },
  {
    key: 'gallery',
    model: GalleryItem,
    resourceName: 'Gallery item',
    searchFields: ['title', 'description'],
  },
  {
    key: 'testimonials',
    model: Testimonial,
    resourceName: 'Testimonial',
    searchFields: ['name', 'content', 'role'],
  },
  {
    key: 'blogs',
    model: Blog,
    resourceName: 'Blog',
    searchFields: ['title', 'excerpt', 'author', 'fullContent'],
    slugFrom: 'title',
  },
  {
    key: 'events',
    model: Event,
    resourceName: 'Event',
    searchFields: ['title', 'description', 'fullContent'],
    slugFrom: 'title',
  },
  {
    key: 'health-packages',
    model: HealthPackage,
    resourceName: 'Health package',
    searchFields: ['title', 'description'],
    slugFrom: 'title',
  },
  {
    key: 'careers',
    model: Career,
    resourceName: 'Career',
    searchFields: ['title', 'description', 'department'],
    slugFrom: 'title',
  },
  {
    key: 'enquiries',
    model: Enquiry,
    resourceName: 'Enquiry',
    searchFields: ['name', 'email', 'subject', 'message', 'phone', 'address'],
    defaultSort: { createdAt: -1 },
    includeToggle: false,
  },
  {
    key: 'appointments',
    model: Appointment,
    resourceName: 'Appointment',
    searchFields: ['patientName', 'email', 'phone', 'doctor', 'department'],
    includeToggle: false,
  },
  {
    key: 'faqs',
    model: Faq,
    resourceName: 'FAQ',
    searchFields: ['question', 'answer'],
  },
  {
    key: 'downloads',
    model: Download,
    resourceName: 'Download',
    searchFields: ['title', 'description'],
  },
  {
    key: 'partners',
    model: Partner,
    resourceName: 'Partner',
    searchFields: ['name', 'description'],
  },
  {
    key: 'insurance',
    model: Insurance,
    resourceName: 'Insurance',
    searchFields: ['name', 'description'],
  },
  {
    key: 'announcements',
    model: Announcement,
    resourceName: 'Announcement',
    searchFields: ['title', 'content'],
  },
  {
    key: 'seo',
    model: SeoSetting,
    resourceName: 'SEO setting',
    searchFields: ['pageName', 'title', 'description'],
    includeToggle: false,
  },
  {
    key: 'videos',
    model: Video,
    resourceName: 'Video',
    searchFields: ['title', 'description'],
  },
  {
    key: 'certificates',
    model: Certificate,
    resourceName: 'Certificate',
    searchFields: ['title', 'org', 'description'],
  },
  {
    key: 'patients',
    model: Patient,
    resourceName: 'Patient Account',
    searchFields: ['masterId', 'name', 'nameNp', 'username', 'phone', 'email', 'doctorName', 'address'],
  },
  {
    key: 'labreports',
    model: LabReport,
    resourceName: 'Lab Report',
    searchFields: ['masterId', 'patientUsername', 'patientName', 'testName', 'doctorName', 'department'],
  },
  {
    key: 'medicines',
    model: Medicine,
    resourceName: 'Medicine',
    searchFields: ['name', 'genericName', 'brandName', 'supplierName', 'companyName'],
    slugFrom: 'name',
    defaultCreateValues: { group: 'Medicine', status: 'published' },
  },
  {
    key: 'registrations',
    model: Registration,
    resourceName: 'Registration',
    searchFields: ['registrationNumber', 'fullName', 'email', 'mobile', 'citizenshipNo', 'postApplied', 'entryYear', 'paymentVoucherNo'],
    includeToggle: false,
  },
  {
    key: 'applicants',
    model: Applicant,
    resourceName: 'Applicant Account',
    searchFields: ['fullName', 'username', 'mobile', 'email', 'postApplied', 'notes'],
    includeToggle: false,
    defaultCreateValues: { status: 'active', password: '123456' },
  },
];

export function registerModuleRoutes(adminRouter, publicRouter) {
  const services = {};

  for (const mod of modules) {
    const service = createCrudService(mod.model, {
      searchFields: mod.searchFields,
      slugFrom: mod.slugFrom,
      populate: mod.populate || [],
      defaultFilter: mod.defaultFilter || {},
      defaultCreateValues: mod.defaultCreateValues || {},
    });
    services[mod.key] = service;

    const controller = createCrudController(service, { resourceName: mod.resourceName });
    const adminModRouter = createCrudRouter(controller, {
      includeToggle: mod.includeToggle !== false,
      mode: 'admin',
    });
    const publicModRouter = createCrudRouter(controller, {
      includeToggle: false,
      mode: 'public',
    });

    adminRouter.use(`/${mod.key}`, adminModRouter);
    // Skip transactional modules from public GET listing if desired — keep for status checks
    if (!['enquiries', 'appointments'].includes(mod.key)) {
      publicRouter.use(`/${mod.key}`, publicModRouter);
    }
  }

  return services;
}

export default registerModuleRoutes;

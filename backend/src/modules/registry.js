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
} from '../models/index.js';
import { createCrudService } from '../services/crudService.js';
import { createCrudController } from '../controllers/crudController.js';
import { createCrudRouter } from '../routes/crudRouter.js';

const modules = [
  {
    key: 'doctors',
    model: Doctor,
    resourceName: 'Doctor',
    searchFields: ['name', 'specialty', 'category', 'bio'],
    slugFrom: 'name',
    populate: ['department'],
    defaultFilter: { teamCategory: 'DOCTOR' },
  },
  {
    key: 'staff',
    model: Doctor,
    resourceName: 'Staff Member',
    searchFields: ['name', 'specialty', 'category', 'bio'],
    slugFrom: 'name',
    populate: ['department'],
    defaultFilter: { teamCategory: { $ne: 'DOCTOR' } },
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
    searchFields: ['name', 'email', 'subject', 'message', 'phone'],
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
    searchFields: ['name', 'username', 'phone', 'email'],
  },
  {
    key: 'labreports',
    model: LabReport,
    resourceName: 'Lab Report',
    searchFields: ['testName', 'patientUsername', 'department'],
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

import {
  Doctor,
  Department,
  Service,
  Blog,
  Event,
  GalleryItem,
  Testimonial,
  Media,
  Enquiry,
  Appointment,
  Announcement,
  Career,
  HealthPackage,
  Faq,
  Download,
  Partner,
  Insurance,
  Facility,
} from '../models/index.js';

async function countByStatus(Model) {
  const [published, draft, total] = await Promise.all([
    Model.countDocuments({ status: 'published' }),
    Model.countDocuments({ status: 'draft' }),
    Model.countDocuments(),
  ]);
  return { published, draft, total };
}

export async function getDashboardStats() {
  const [
    doctors,
    departments,
    services,
    blogs,
    events,
    gallery,
    testimonials,
    media,
    enquiries,
    appointments,
    announcements,
    careers,
    packages,
    faqs,
    downloads,
    partners,
    insurance,
    facilities,
  ] = await Promise.all([
    countByStatus(Doctor),
    countByStatus(Department),
    countByStatus(Service),
    countByStatus(Blog),
    countByStatus(Event),
    countByStatus(GalleryItem),
    countByStatus(Testimonial),
    Media.countDocuments(),
    Enquiry.countDocuments({ status: 'new' }),
    Appointment.countDocuments({ status: 'pending' }),
    countByStatus(Announcement),
    countByStatus(Career),
    countByStatus(HealthPackage),
    countByStatus(Faq),
    countByStatus(Download),
    countByStatus(Partner),
    countByStatus(Insurance),
    countByStatus(Facility),
  ]);

  const recentUpdates = await Promise.all([
    Doctor.find().sort({ updatedAt: -1 }).limit(3).select('name status updatedAt').lean(),
    Blog.find().sort({ updatedAt: -1 }).limit(3).select('title status updatedAt').lean(),
    Event.find().sort({ updatedAt: -1 }).limit(3).select('title status updatedAt').lean(),
    Media.find().sort({ updatedAt: -1 }).limit(3).select('originalName type updatedAt url').lean(),
  ]);

  const recent = [
    ...recentUpdates[0].map((d) => ({ module: 'Doctor', title: d.name, status: d.status, updatedAt: d.updatedAt })),
    ...recentUpdates[1].map((d) => ({ module: 'Blog', title: d.title, status: d.status, updatedAt: d.updatedAt })),
    ...recentUpdates[2].map((d) => ({ module: 'Event', title: d.title, status: d.status, updatedAt: d.updatedAt })),
    ...recentUpdates[3].map((d) => ({ module: 'Media', title: d.originalName, status: d.type, updatedAt: d.updatedAt, url: d.url })),
  ]
    .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
    .slice(0, 10);

  return {
    content: {
      doctors,
      departments,
      services,
      blogs,
      events,
      gallery,
      testimonials,
      announcements,
      careers,
      packages,
      faqs,
      downloads,
      partners,
      insurance,
      facilities,
    },
    media: {
      total: media,
    },
    inbox: {
      newEnquiries: enquiries,
      pendingAppointments: appointments,
    },
    recentUpdates: recent,
  };
}

export default { getDashboardStats };

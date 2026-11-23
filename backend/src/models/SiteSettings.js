import mongoose from 'mongoose';

const siteSettingsSchema = new mongoose.Schema(
  {
    key: { type: String, default: 'default', unique: true },
    logoUrl: { type: String, default: '/logo.png' },
    faviconUrl: { type: String, default: '/vite.svg' },
    brandNameEn: { type: String, default: 'Dwarika Hospital' },
    brandNameNp: { type: String, default: 'द्वारिका हस्पिटल' },
    brandSubtitle: { type: String, default: '& Medical Academy Pvt. Ltd.' },
    brandLockupEn: { type: String, default: 'Dwarika Hospital & Medical Academy Pvt. Ltd.' },
    brandLockupNp: { type: String, default: 'द्वारिका हस्पिटल एण्ड मेडिकल एकेडेमी प्रा. लि.' },
    emergencyNumber: { type: String, default: '103' },
    landline: { type: String, default: '031-590123' },
    mobile: { type: String, default: '' },
    whatsapp: { type: String, default: '' },
    emails: {
      general: { type: String, default: 'dwarikahospital15@gmail.com' },
      appointment: { type: String, default: 'appointment@dwarikahospital.com' },
      info: { type: String, default: 'info@dhama.com.np' },
    },
    addressEn: { type: String, default: '' },
    addressNp: { type: String, default: '' },
    mapEmbedUrl: { type: String, default: '' },
    websiteUrl: { type: String, default: 'https://dwarikahospital.com' },
    social: {
      facebook: { type: String, default: '' },
      instagram: { type: String, default: '' },
      whatsapp: { type: String, default: '' },
      linkedin: { type: String, default: '' },
      youtube: { type: String, default: '' },
    },
    opdHours: {
      days: { type: String, default: 'Sun – Fri' },
      open: { type: String, default: '8:00 AM' },
      close: { type: String, default: '6:00 PM' },
    },
    marqueeLines: [{ type: String }],
    footerText: { type: String, default: '' },
    copyrightText: { type: String, default: '' },
    registrationAccessMode: { type: String, enum: ['open', 'authorized'], default: 'authorized' },
    liveUpdates: {
      enabled: { type: Boolean, default: true },
      badgeTextEn: { type: String, default: 'Live Updates' },
      badgeTextNp: { type: String, default: 'ताजा जानकारी' },
      speed: { type: String, enum: ['slow', 'normal', 'fast'], default: 'normal' },
    },
    academicSettings: {
      heroTitle: { type: String, default: 'Center for Healthcare Education & Medical Academy' },
      heroSubtitle: { type: String, default: 'Producing compassionate, highly skilled medical and paramedical professionals serving regional and national healthcare needs.' },
      yearsOfExcellence: { type: String, default: '25+' },
      graduatesProduced: { type: String, default: '8,000+' },
      academicProgramsCount: { type: String, default: '12' },
      researchPapers: { type: String, default: '500+' },
      brochureUrl: { type: String, default: '' },
    },
    popupNotice: {
      enabled: { type: Boolean, default: false },
      title: { type: String, default: '' },
      titleNp: { type: String, default: '' },
      message: { type: String, default: '' },
      messageNp: { type: String, default: '' },
      imageUrl: { type: String, default: '' },
      buttonText: { type: String, default: '' },
      buttonLink: { type: String, default: '' },
      displayType: {
        type: String,
        enum: ['image_only', 'text_only', 'image_and_text'],
        default: 'image_and_text',
      },
      frequency: {
        type: String,
        enum: ['always', 'once_per_session', 'once_per_day'],
        default: 'once_per_session',
      },
      showCloseButton: { type: Boolean, default: true },
      updatedAt: { type: Date, default: Date.now },
    },
    pageStatus: [
      {
        pageKey: { type: String, required: true },
        path: { type: String, required: true },
        name: { type: String, required: true },
        status: { type: String, enum: ['active', 'blocked'], default: 'active' },
        noticeTitle: { type: String, default: '' },
        noticeMessage: { type: String, default: '' },
        updatedAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model('SiteSettings', siteSettingsSchema);

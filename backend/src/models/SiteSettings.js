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
  },
  { timestamps: true }
);

export default mongoose.model('SiteSettings', siteSettingsSchema);

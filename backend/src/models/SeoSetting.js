import mongoose from 'mongoose';

const seoSettingSchema = new mongoose.Schema(
  {
    pageKey: { type: String, required: true, unique: true },
    pageName: { type: String, required: true },
    title: { type: String, default: '' },
    description: { type: String, default: '' },
    keywords: [{ type: String }],
    ogImage: { type: String, default: '' },
    canonicalUrl: { type: String, default: '' },
    noIndex: { type: Boolean, default: false },
    structuredData: { type: mongoose.Schema.Types.Mixed, default: null },
    status: { type: String, enum: ['draft', 'published'], default: 'published' },
  },
  { timestamps: true }
);

seoSettingSchema.index({ pageName: 'text', title: 'text', description: 'text' });

export default mongoose.model('SeoSetting', seoSettingSchema);

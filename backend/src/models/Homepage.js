import mongoose from 'mongoose';

const homepageSchema = new mongoose.Schema(
  {
    key: { type: String, default: 'default', unique: true },
    hero: {
      badge: { type: String, default: '' },
      badgeNp: { type: String, default: '' },
      titlePart1: { type: String, default: '' },
      titlePart1Np: { type: String, default: '' },
      titlePart2: { type: String, default: '' },
      titlePart2Np: { type: String, default: '' },
      description: { type: String, default: '' },
      descriptionNp: { type: String, default: '' },
      primaryCtaLabel: { type: String, default: 'Book Appointment' },
      primaryCtaLabelNp: { type: String, default: '' },
      primaryCtaLink: { type: String, default: '/appointment' },
      secondaryCtaLabel: { type: String, default: 'Explore Services' },
      secondaryCtaLabelNp: { type: String, default: '' },
      secondaryCtaLink: { type: String, default: '/#services' },
      bannerImages: [{ type: String }],
      awardBadgeTitle: { type: String, default: 'Award Winning' },
      awardBadgeTitleNp: { type: String, default: '' },
      awardBadgeSubtitle: { type: String, default: 'Healthcare 2024' },
      awardBadgeSubtitleNp: { type: String, default: '' },
      featuredDoctorIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Doctor' }],
    },
    counters: [
      {
        label: String,
        value: String,
        iconKey: String,
        sortOrder: { type: Number, default: 0 },
      },
    ],
    sections: [
      {
        key: String,
        title: String,
        subtitle: String,
        body: String,
        imageUrl: String,
        ctaLabel: String,
        ctaLink: String,
        enabled: { type: Boolean, default: true },
        sortOrder: { type: Number, default: 0 },
      },
    ],
    cta: {
      title: { type: String, default: '' },
      titleNp: { type: String, default: '' },
      description: { type: String, default: '' },
      descriptionNp: { type: String, default: '' },
      buttonLabel: { type: String, default: '' },
      buttonLabelNp: { type: String, default: '' },
      buttonLink: { type: String, default: '' },
      imageUrl: { type: String, default: '' },
    },
    status: { type: String, enum: ['draft', 'published'], default: 'published' },
  },
  { timestamps: true }
);

export default mongoose.model('Homepage', homepageSchema);

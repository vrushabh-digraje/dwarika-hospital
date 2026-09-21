import mongoose from 'mongoose';
import publishablePlugin from './plugins/publishable.js';

const aboutSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    tagline: { type: String, default: '' },
    introduction: { type: String, default: '' },
    missionTitle: { type: String, default: 'Our Mission' },
    missionSubtitle: { type: String, default: '' },
    missionText: { type: String, default: '' },
    visionTitle: { type: String, default: 'Our Vision' },
    visionSubtitle: { type: String, default: '' },
    visionText: { type: String, default: '' },
    values: [
      {
        title: String,
        description: String,
        iconKey: String,
      },
    ],
    storyHtml: { type: String, default: '' },
    storyImageUrl: { type: String, default: '' },
    infrastructure: {
      beds: String,
      ot: String,
      icu: String,
      facilities: [
        {
          title: String,
          description: String,
          imageUrl: String,
          iconKey: String,
        },
      ],
    },
    leadershipMessages: [
      {
        role: String,
        heading: String,
        name: String,
        message: String,
        imageUrl: String,
        sortOrder: { type: Number, default: 0 },
      },
    ],
    images: [{ type: String }],
  },
  { timestamps: true }
);

aboutSchema.plugin(publishablePlugin);

export default mongoose.model('About', aboutSchema);

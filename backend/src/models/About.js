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
    leadershipTitle: { type: String, default: 'Our Leadership' },
    leadershipSubtitle: {
      type: String,
      default:
        'Guided by a team of dedicated professionals committed to delivering world-class healthcare to our community.',
    },
    leaders: [
      {
        name: { type: String, default: '' },
        role: { type: String, default: '' },
        image: { type: String, default: '' },
        bio: { type: String, default: '' },
      },
    ],
    images: [{ type: String }],
  },
  { timestamps: true }
);

aboutSchema.plugin(publishablePlugin);

export default mongoose.model('About', aboutSchema);

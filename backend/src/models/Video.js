import mongoose from 'mongoose';
import publishablePlugin from './plugins/publishable.js';

const videoSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, default: '' },
    thumbnailUrl: { type: String, default: '' },
    videoUrl: { type: String, required: true },
    category: {
      type: String,
      enum: ['Facility', 'Testimonial', 'Medical', 'Academic', 'Other'],
      default: 'Facility',
      index: true,
    },
    duration: { type: String, default: '' },
  },
  { timestamps: true }
);

videoSchema.plugin(publishablePlugin);
videoSchema.index({ title: 'text', description: 'text' });

export default mongoose.model('Video', videoSchema);

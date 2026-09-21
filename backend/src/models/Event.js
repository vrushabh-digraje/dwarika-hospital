import mongoose from 'mongoose';
import publishablePlugin from './plugins/publishable.js';

const eventSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, unique: true, sparse: true },
    type: {
      type: String,
      enum: ['News', 'Event', 'Notice', 'Result', 'Admission', 'Scholarship', 'Academic', 'Strategic'],
      default: 'News',
      index: true,
    },
    category: {
      type: String,
      enum: ['News', 'Event', 'Notice', 'Academic', 'Strategic'],
      default: 'News',
      index: true,
    },
    date: { type: Date, default: Date.now },
    time: { type: String, default: '' },
    location: { type: String, default: '' },
    description: { type: String, default: '' },
    fullContent: { type: String, default: '' },
    imageUrl: { type: String, default: '' },
    isSpecial: { type: Boolean, default: false },
  },
  { timestamps: true }
);

eventSchema.plugin(publishablePlugin);
eventSchema.index({ title: 'text', description: 'text', fullContent: 'text' });

export default mongoose.model('Event', eventSchema);

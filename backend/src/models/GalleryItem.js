import mongoose from 'mongoose';
import publishablePlugin from './plugins/publishable.js';

const galleryItemSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    type: { type: String, enum: ['photo', 'video'], default: 'photo' },
    url: { type: String, required: true },
    images: [{ type: String }],
    date: { type: Date, default: Date.now },
    videoUrl: { type: String, default: '' },
    thumbnailUrl: { type: String, default: '' },
    album: {
      type: String,
      enum: ['hospital', 'academic', 'event', 'other'],
      default: 'hospital',
      index: true,
    },
    duration: { type: String, default: '' },
    description: { type: String, default: '' },
  },
  { timestamps: true }
);

galleryItemSchema.plugin(publishablePlugin);
galleryItemSchema.index({ title: 'text', description: 'text' });

export default mongoose.model('GalleryItem', galleryItemSchema);

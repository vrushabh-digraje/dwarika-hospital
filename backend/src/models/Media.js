import mongoose from 'mongoose';

const mediaSchema = new mongoose.Schema(
  {
    filename: { type: String, required: true },
    originalName: { type: String, required: true },
    mimeType: { type: String, required: true },
    size: { type: Number, required: true },
    url: { type: String, required: true },
    path: { type: String, required: true },
    folder: { type: String, default: 'general', index: true },
    alt: { type: String, default: '' },
    title: { type: String, default: '' },
    width: { type: Number, default: null },
    height: { type: Number, default: null },
    optimized: { type: Boolean, default: false },
    type: {
      type: String,
      enum: ['image', 'document', 'video', 'other'],
      default: 'other',
      index: true,
    },
  },
  { timestamps: true }
);

mediaSchema.index({ originalName: 'text', title: 'text', alt: 'text' });

export default mongoose.model('Media', mediaSchema);

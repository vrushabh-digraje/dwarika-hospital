import mongoose from 'mongoose';
import publishablePlugin from './plugins/publishable.js';

const testimonialSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    role: { type: String, default: '' },
    content: { type: String, required: true },
    rating: { type: Number, min: 1, max: 5, default: 5 },
    imageUrl: { type: String, default: '' },
    isFeatured: { type: Boolean, default: false },
  },
  { timestamps: true }
);

testimonialSchema.plugin(publishablePlugin);
testimonialSchema.index({ name: 'text', content: 'text', role: 'text' });

export default mongoose.model('Testimonial', testimonialSchema);

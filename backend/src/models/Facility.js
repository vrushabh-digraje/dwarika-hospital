import mongoose from 'mongoose';
import publishablePlugin from './plugins/publishable.js';

const facilitySchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, unique: true, sparse: true },
    description: { type: String, default: '' },
    imageUrl: { type: String, default: '' },
    iconKey: { type: String, default: '' },
    contentHtml: { type: String, default: '' },
  },
  { timestamps: true }
);

facilitySchema.plugin(publishablePlugin);
facilitySchema.index({ title: 'text', description: 'text' });

export default mongoose.model('Facility', facilitySchema);

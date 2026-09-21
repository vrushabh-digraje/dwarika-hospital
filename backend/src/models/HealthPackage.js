import mongoose from 'mongoose';
import publishablePlugin from './plugins/publishable.js';

const healthPackageSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, unique: true, sparse: true },
    description: { type: String, default: '' },
    contentHtml: { type: String, default: '' },
    price: { type: Number, default: 0 },
    currency: { type: String, default: 'NPR' },
    imageUrl: { type: String, default: '' },
    features: [{ type: String }],
    duration: { type: String, default: '' },
    isPopular: { type: Boolean, default: false },
  },
  { timestamps: true }
);

healthPackageSchema.plugin(publishablePlugin);
healthPackageSchema.index({ title: 'text', description: 'text' });

export default mongoose.model('HealthPackage', healthPackageSchema);

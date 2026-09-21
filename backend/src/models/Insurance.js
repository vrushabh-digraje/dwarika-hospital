import mongoose from 'mongoose';
import publishablePlugin from './plugins/publishable.js';

const insuranceSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    logoUrl: { type: String, default: '' },
    description: { type: String, default: '' },
    coverageDetails: { type: String, default: '' },
    websiteUrl: { type: String, default: '' },
    contactPhone: { type: String, default: '' },
  },
  { timestamps: true }
);

insuranceSchema.plugin(publishablePlugin);
insuranceSchema.index({ name: 'text', description: 'text' });

export default mongoose.model('Insurance', insuranceSchema);

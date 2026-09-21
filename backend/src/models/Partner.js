import mongoose from 'mongoose';
import publishablePlugin from './plugins/publishable.js';

const partnerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    logoUrl: { type: String, default: '' },
    websiteUrl: { type: String, default: '' },
    description: { type: String, default: '' },
    type: { type: String, default: 'Partner', index: true },
  },
  { timestamps: true }
);

partnerSchema.plugin(publishablePlugin);
partnerSchema.index({ name: 'text', description: 'text' });

export default mongoose.model('Partner', partnerSchema);

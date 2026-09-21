import mongoose from 'mongoose';
import publishablePlugin from './plugins/publishable.js';

const downloadSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    type: { type: String, default: 'Download', index: true },
    description: { type: String, default: '' },
    sizeLabel: { type: String, default: '' },
    fileUrl: { type: String, required: true },
    filename: { type: String, default: '' },
    iconKey: { type: String, default: '' },
  },
  { timestamps: true }
);

downloadSchema.plugin(publishablePlugin);
downloadSchema.index({ title: 'text', description: 'text' });

export default mongoose.model('Download', downloadSchema);

import mongoose from 'mongoose';
import publishablePlugin from './plugins/publishable.js';

const departmentSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    titleNp: { type: String, default: '' },
    slug: { type: String, required: true, unique: true },
    shortDesc: { type: String, default: '' },
    shortDescNp: { type: String, default: '' },
    longDescription: { type: String, default: '' },
    longDescriptionNp: { type: String, default: '' },
    iconKey: { type: String, default: '' },
    colorTheme: { type: String, default: '' },
    imageUrl: { type: String, default: '' },
    services: [{ type: String }],
    servicesNp: [{ type: String }],
    specialistCountLabel: { type: String, default: '' },
    specialistCountLabelNp: { type: String, default: '' },
  },
  { timestamps: true }
);

departmentSchema.plugin(publishablePlugin);
departmentSchema.index({ title: 'text', shortDesc: 'text', longDescription: 'text' });

export default mongoose.model('Department', departmentSchema);

import mongoose from 'mongoose';
import publishablePlugin from './plugins/publishable.js';

const serviceSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String, default: '' },
    category: {
      type: String,
      enum: ['Emergency', 'Diagnostics', 'Support', 'Clinical', 'Other'],
      default: 'Clinical',
      index: true,
    },
    imageUrl: { type: String, default: '' },
    iconKey: { type: String, default: '' },
    hideRequestAppointment: { type: Boolean, default: false },
    contentHtml: { type: String, default: '' },
  },
  { timestamps: true }
);

serviceSchema.plugin(publishablePlugin);
serviceSchema.index({ title: 'text', description: 'text' });

export default mongoose.model('Service', serviceSchema);

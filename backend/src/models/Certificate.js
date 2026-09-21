import mongoose from 'mongoose';
import publishablePlugin from './plugins/publishable.js';

const certificateSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    nepaliTitle: { type: String, default: '' },
    org: { type: String, default: '' },
    ministry: { type: String, default: '' },
    imageUrl: { type: String, default: '' },
    description: { type: String, default: '' },
  },
  { timestamps: true }
);

certificateSchema.plugin(publishablePlugin);

export default mongoose.model('Certificate', certificateSchema);

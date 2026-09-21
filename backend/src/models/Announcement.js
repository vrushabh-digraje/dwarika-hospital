import mongoose from 'mongoose';
import publishablePlugin from './plugins/publishable.js';

const announcementSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    content: { type: String, default: '' },
    type: {
      type: String,
      enum: ['info', 'warning', 'success', 'urgent'],
      default: 'info',
    },
    startsAt: { type: Date, default: null },
    endsAt: { type: Date, default: null },
    showOnMarquee: { type: Boolean, default: true },
    linkUrl: { type: String, default: '' },
  },
  { timestamps: true }
);

announcementSchema.plugin(publishablePlugin);
announcementSchema.index({ title: 'text', content: 'text' });

export default mongoose.model('Announcement', announcementSchema);

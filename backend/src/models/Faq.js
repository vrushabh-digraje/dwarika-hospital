import mongoose from 'mongoose';
import publishablePlugin from './plugins/publishable.js';

const faqSchema = new mongoose.Schema(
  {
    question: { type: String, required: true },
    answer: { type: String, required: true },
    category: { type: String, default: 'General', index: true },
  },
  { timestamps: true }
);

faqSchema.plugin(publishablePlugin);
faqSchema.index({ question: 'text', answer: 'text' });

export default mongoose.model('Faq', faqSchema);

import mongoose from 'mongoose';
import publishablePlugin from './plugins/publishable.js';

const careerSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, unique: true, sparse: true },
    department: { type: String, default: '' },
    location: { type: String, default: '' },
    employmentType: {
      type: String,
      enum: ['Full-time', 'Part-time', 'Contract', 'Internship'],
      default: 'Full-time',
    },
    description: { type: String, default: '' },
    requirementsHtml: { type: String, default: '' },
    responsibilitiesHtml: { type: String, default: '' },
    deadline: { type: Date, default: null },
    vacancies: { type: Number, default: 1 },
  },
  { timestamps: true }
);

careerSchema.plugin(publishablePlugin);
careerSchema.index({ title: 'text', description: 'text', department: 'text' });

export default mongoose.model('Career', careerSchema);

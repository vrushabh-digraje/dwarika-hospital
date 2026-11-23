import mongoose from 'mongoose';

const academicProgramSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    titleNp: { type: String, default: '' },
    duration: { type: String, default: '3 Years' },
    seats: { type: String, default: '40 Seats' },
    tag: { type: String, default: 'Medical' },
    desc: { type: String, default: '' },
    descNp: { type: String, default: '' },
    eligibility: { type: String, default: '' },
    gradient: { type: String, default: 'from-blue-900 via-blue-800 to-blue-700' },
    status: {
      type: String,
      enum: ['active', 'admissions_open', 'closed', 'published', 'draft'],
      default: 'admissions_open',
    },
    sortOrder: { type: Number, default: 0 },
    iconName: { type: String, default: 'GraduationCap' },
    brochureUrl: { type: String, default: '' },
    publishedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

academicProgramSchema.index({ title: 'text', desc: 'text' });

export default mongoose.model('AcademicProgram', academicProgramSchema);

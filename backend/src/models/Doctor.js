import mongoose from 'mongoose';
import publishablePlugin from './plugins/publishable.js';

const doctorSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    nameNp: { type: String, default: '' },
    slug: { type: String, unique: true, sparse: true },
    specialty: { type: String, default: '' },
    specialtyNp: { type: String, default: '' },
    category: { type: String, default: '', index: true },
    teamCategory: {
      type: String,
      enum: ['DOCTOR', 'NURSING STAFF', 'PARAMEDICAL STAFF', 'PHARMACY STAFF', 'RADIO IMAGING STAFF', 'LABORATORY STAFF', 'MANAGEMENT', 'ADMINISTRATION'],
      default: 'DOCTOR',
      index: true,
    },
    role: { type: String, default: '' },
    imageUrl: { type: String, default: '' },
    bio: { type: String, default: '' },
    bioNp: { type: String, default: '' },
    qualification: { type: String, default: '' },
    qualificationNp: { type: String, default: '' },
    specialization: { type: String, default: '' },
    specializationNp: { type: String, default: '' },
    nmcNo: { type: String, default: '' },
    email: { type: String, default: '' },
    phone: { type: String, default: '' },
    linkedin: { type: String, default: '' },
    department: { type: mongoose.Schema.Types.ObjectId, ref: 'Department', default: null },
    isFeaturedOnHero: { type: Boolean, default: false },
    isBookable: { type: Boolean, default: true },
    schedule: [
      {
        day: String,
        shift: String,
        startTime: String,
        endTime: String,
      },
    ],
  },
  { timestamps: true }
);

doctorSchema.plugin(publishablePlugin);
doctorSchema.index({ name: 'text', specialty: 'text', category: 'text', bio: 'text' });

export default mongoose.model('Doctor', doctorSchema);

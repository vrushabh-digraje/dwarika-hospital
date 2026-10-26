import mongoose from 'mongoose';

const applicantSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true, trim: true },
    username: { type: String, required: true, unique: true, trim: true, lowercase: true, index: true },
    password: { type: String, required: true, default: '123456' },
    mobile: { type: String, default: '', trim: true },
    email: { type: String, default: '', trim: true },
    postApplied: { type: String, default: '', trim: true },
    status: { type: String, enum: ['active', 'blocked'], default: 'active' },
    hasSubmitted: { type: Boolean, default: false },
    submittedRegistrationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Registration', default: null },
    submittedAt: { type: Date, default: null },
    notes: { type: String, default: '', trim: true },
  },
  { timestamps: true }
);

applicantSchema.index({ username: 1, mobile: 1 });

export default mongoose.model('Applicant', applicantSchema);

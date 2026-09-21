import mongoose from 'mongoose';

const enquirySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, default: '' },
    phone: { type: String, default: '' },
    subject: { type: String, default: '' },
    message: { type: String, default: '' },
    address: { type: String, default: '' },
    dob: { type: String, default: '' },
    gender: { type: String, default: '' },
    patientId: { type: String, default: '' },
    source: { type: String, default: 'contact', index: true },
    attachmentUrl: { type: String, default: '' },
    meta: { type: mongoose.Schema.Types.Mixed, default: {} },
    status: {
      type: String,
      enum: ['new', 'in_progress', 'resolved', 'archived'],
      default: 'new',
      index: true,
    },
    notes: { type: String, default: '' },
  },
  { timestamps: true }
);

enquirySchema.index({ name: 'text', email: 'text', subject: 'text', message: 'text' });

export default mongoose.model('Enquiry', enquirySchema);

import mongoose from 'mongoose';

const appointmentSchema = new mongoose.Schema(
  {
    patientName: { type: String, required: true },
    firstName: { type: String, default: '' },
    lastName: { type: String, default: '' },
    email: { type: String, default: '' },
    phone: { type: String, default: '' },
    gender: { type: String, default: '' },
    dob: { type: String, default: '' },
    department: { type: String, default: '' },
    doctor: { type: String, default: '' },
    doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', default: null },
    appointmentDate: { type: Date, default: null },
    shift: { type: String, default: '' },
    message: { type: String, default: '' },
    diseases: [{ type: String }],
    address: { type: mongoose.Schema.Types.Mixed, default: {} },
    meta: { type: mongoose.Schema.Types.Mixed, default: {} },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'cancelled', 'completed'],
      default: 'pending',
      index: true,
    },
    notes: { type: String, default: '' },
  },
  { timestamps: true }
);

appointmentSchema.index({ patientName: 'text', email: 'text', phone: 'text', doctor: 'text' });

export default mongoose.model('Appointment', appointmentSchema);

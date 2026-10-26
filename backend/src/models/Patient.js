import mongoose from 'mongoose';

const patientSchema = new mongoose.Schema(
  {
    masterId: { type: String, unique: true, sparse: true, trim: true, index: true }, // Master ID (Unique)
    name: { type: String, required: true, trim: true },
    nameNp: { type: String, default: '', trim: true }, // Full Name in Nepali (Optional)
    age: { type: String, default: '', trim: true },
    gender: { type: String, default: 'Other', trim: true },
    address: { type: String, default: '', trim: true },
    doctorName: { type: String, default: '', trim: true }, // Doctor Name
    username: { type: String, unique: true, sparse: true, trim: true },
    password: { type: String, default: '123456' },
    phone: { type: String, default: '', trim: true },
    email: { type: String, default: '', trim: true },
  },
  { timestamps: true }
);

// Ensure default password if not provided
patientSchema.pre('validate', function (next) {
  if (!this.password) {
    this.password = '123456';
  }
  next();
});

patientSchema.index({ masterId: 1, name: 1, phone: 1 });

export default mongoose.model('Patient', patientSchema);

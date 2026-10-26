import mongoose from 'mongoose';

const labReportSchema = new mongoose.Schema(
  {
    masterId: { type: String, trim: true, index: true }, // Master ID of patient
    patientUsername: { type: String, default: '', trim: true, index: true },
    patientName: { type: String, default: '', trim: true },
    age: { type: String, default: '', trim: true },
    address: { type: String, default: '', trim: true },
    doctorName: { type: String, default: '', trim: true },
    testName: { type: String, required: true, trim: true },
    testNameNp: { type: String, default: '', trim: true },
    testDate: { type: Date, default: Date.now },
    department: { type: String, default: 'Laboratory' },
    pdfUrl: { type: String, required: true },
    status: { type: String, enum: ['Ready', 'Processing', 'Draft'], default: 'Ready' },
    priority: { type: String, enum: ['Normal', 'Urgent'], default: 'Normal' },
  },
  { timestamps: true }
);

// Auto-sync patientUsername and masterId
labReportSchema.pre('validate', function (next) {
  if (!this.patientUsername && this.masterId) {
    this.patientUsername = this.masterId;
  }
  if (!this.masterId && this.patientUsername) {
    this.masterId = this.patientUsername;
  }
  next();
});

labReportSchema.index({ masterId: 1, patientUsername: 1, testDate: -1 });

export default mongoose.model('LabReport', labReportSchema);

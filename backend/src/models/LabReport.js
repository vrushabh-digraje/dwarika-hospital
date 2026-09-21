import mongoose from 'mongoose';

const labReportSchema = new mongoose.Schema(
  {
    patientUsername: { type: String, required: true, trim: true, index: true },
    testName: { type: String, required: true },
    testNameNp: { type: String, default: '' },
    testDate: { type: Date, default: Date.now },
    department: { type: String, default: 'Laboratory' },
    pdfUrl: { type: String, required: true },
    status: { type: String, enum: ['Ready', 'Processing', 'Draft'], default: 'Ready' },
    priority: { type: String, enum: ['Normal', 'Urgent'], default: 'Normal' },
  },
  { timestamps: true }
);

export default mongoose.model('LabReport', labReportSchema);

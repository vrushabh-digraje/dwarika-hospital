import mongoose from 'mongoose';

const registrationSchema = new mongoose.Schema(
  {
    registrationNumber: { type: String, unique: true, sparse: true, index: true },
    entryYear: { type: String, default: '2082 B.S.', index: true },
    userType: { type: String, default: 'STUDENT' },
    userTypeOther: { type: String, default: '' },
    postApplied: { type: String, default: '', index: true },
    entryCode: { type: String, default: '' },

    // Profile
    title: { type: String, default: 'Mr.' },
    firstName: { type: String, default: '' },
    middleName: { type: String, default: '' },
    lastName: { type: String, default: '' },
    fullName: { type: String, required: true, index: true },
    firstNameNp: { type: String, default: '' },
    middleNameNp: { type: String, default: '' },
    lastNameNp: { type: String, default: '' },
    fullNameNp: { type: String, default: '' },
    gender: { type: String, default: '' },
    bloodGroup: { type: String, default: '' },
    religion: { type: String, default: '' },
    nationality: { type: String, default: 'Nepali' },
    casteGroup: { type: String, default: '' },
    caste: { type: String, default: '' },
    casteOther: { type: String, default: '' },
    maritalStatus: { type: String, default: 'Unmarried' },
    photoUrl: { type: String, default: '' },

    // Contact
    mobile: { type: String, required: true, index: true },
    phone: { type: String, default: '' },
    email: { type: String, required: true, index: true },

    // Family Details
    fatherName: { type: String, default: '' },
    fatherNameNp: { type: String, default: '' },
    motherName: { type: String, default: '' },
    motherNameNp: { type: String, default: '' },
    grandfatherName: { type: String, default: '' },
    grandfatherNameNp: { type: String, default: '' },
    spouseName: { type: String, default: '' },
    spouseNameNp: { type: String, default: '' },

    // Identification
    dobAD: { type: String, default: '' },
    dobBS: { type: String, default: '' },
    citizenshipNo: { type: String, default: '', index: true },
    citizenshipIssueDate: { type: String, default: '' },
    citizenshipIssuePlace: { type: String, default: '' },
    citizenshipFrontUrl: { type: String, default: '' },
    citizenshipBackUrl: { type: String, default: '' },
    panNo: { type: String, default: '' },
    panFileUrl: { type: String, default: '' },
    passportNo: { type: String, default: '' },
    passportIssueDate: { type: String, default: '' },
    passportIssuePlace: { type: String, default: '' },
    passportFileUrl: { type: String, default: '' },
    nIdNo: { type: String, default: '' },
    nIdIssueDate: { type: String, default: '' },
    nIdIssuePlace: { type: String, default: '' },
    nIdFileUrl: { type: String, default: '' },
    localIdNo: { type: String, default: '' },
    localIdFileUrl: { type: String, default: '' },

    // Addresses
    permanentAddress: {
      country: { type: String, default: 'Nepal' },
      province: { type: String, default: '' },
      district: { type: String, default: '' },
      municipality: { type: String, default: '' },
      municipalityType: { type: String, default: 'MUNICIPALITY' },
      ward: { type: String, default: '' },
      street: { type: String, default: '' },
    },
    oldPermanentAddress: {
      country: { type: String, default: 'Nepal' },
      zone: { type: String, default: '' },
      district: { type: String, default: '' },
      municipality: { type: String, default: '' },
      municipalityType: { type: String, default: 'MUNICIPALITY' },
      ward: { type: String, default: '' },
      street: { type: String, default: '' },
    },
    mailingAddress: {
      country: { type: String, default: 'Nepal' },
      province: { type: String, default: '' },
      district: { type: String, default: '' },
      municipality: { type: String, default: '' },
      municipalityType: { type: String, default: 'MUNICIPALITY' },
      ward: { type: String, default: '' },
      street: { type: String, default: '' },
      foreignAddress: { type: String, default: '' },
    },

    // Academics
    academicDetails: [
      {
        level: { type: String, default: '' },
        degree: { type: String, default: '' },
        passedYear: { type: String, default: '' },
        school: { type: String, default: '' },
        university: { type: String, default: '' },
        address: { type: String, default: '' },
        markGpa: { type: String, default: '' },
        division: { type: String, default: '' },
        speciality: { type: String, default: '' },
        markSheetUrl: { type: String, default: '' },
        characterCertUrl: { type: String, default: '' },
        provisionalCertUrl: { type: String, default: '' },
      },
    ],

    // Council Registration
    councilDetails: {
      councilName: { type: String, default: '' },
      regNo: { type: String, default: '' },
      regDate: { type: String, default: '' },
      type: { type: String, default: '' },
      councilCertUrl: { type: String, default: '' },
    },

    // Training & Experience
    trainingEntries: [
      {
        name: { type: String, default: '' },
        regNo: { type: String, default: '' },
        regDate: { type: String, default: '' },
        recognizedBy: { type: String, default: '' },
        district: { type: String, default: '' },
        municipality: { type: String, default: '' },
        ward: { type: String, default: '' },
        stateProvince: { type: String, default: '' },
        country: { type: String, default: 'Nepal' },
        startDateAD: { type: String, default: '' },
        startDateBS: { type: String, default: '' },
        endDateAD: { type: String, default: '' },
        endDateBS: { type: String, default: '' },
        durationYears: { type: String, default: '' },
        durationMonths: { type: String, default: '' },
        durationDays: { type: String, default: '' },
      },
    ],
    workEntries: [
      {
        organization: { type: String, default: '' },
        post: { type: String, default: '' },
        district: { type: String, default: '' },
        municipality: { type: String, default: '' },
        ward: { type: String, default: '' },
        stateProvince: { type: String, default: '' },
        country: { type: String, default: 'Nepal' },
        startDateAD: { type: String, default: '' },
        startDateBS: { type: String, default: '' },
        endDateAD: { type: String, default: '' },
        endDateBS: { type: String, default: '' },
        durationYears: { type: String, default: '' },
        durationMonths: { type: String, default: '' },
        durationDays: { type: String, default: '' },
      },
    ],

    // Payment Verification
    payment: {
      mode: { type: String, default: 'eSewa / QR' },
      voucherNo: { type: String, default: '' },
      paymentDate: { type: String, default: '' },
      voucherUrl: { type: String, default: '' },
      amount: { type: Number, default: 0 },
    },
    paymentVoucherNo: { type: String, default: '', index: true },
    paymentVoucherUrl: { type: String, default: '' },

    // Status & Admin
    status: {
      type: String,
      enum: ['pending', 'verified', 'approved', 'rejected'],
      default: 'pending',
      index: true,
    },
    adminRemarks: { type: String, default: '' },
    submittedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

registrationSchema.pre('save', function (next) {
  if (!this.registrationNumber) {
    const yr = (this.entryYear || '2082').replace(/[^0-9]/g, '').slice(0, 4) || '2082';
    const rand = Math.floor(1000 + Math.random() * 9000);
    this.registrationNumber = `REG-${yr}-${Date.now().toString().slice(-4)}${rand}`;
  }
  if (!this.fullName) {
    this.fullName = [this.title, this.firstName, this.middleName, this.lastName].filter(Boolean).join(' ');
  }
  if (!this.paymentVoucherNo && this.payment?.voucherNo) {
    this.paymentVoucherNo = this.payment.voucherNo;
  }
  if (!this.paymentVoucherUrl && this.payment?.voucherUrl) {
    this.paymentVoucherUrl = this.payment.voucherUrl;
  }
  next();
});

registrationSchema.index({
  registrationNumber: 'text',
  fullName: 'text',
  email: 'text',
  mobile: 'text',
  postApplied: 'text',
  citizenshipNo: 'text',
  paymentVoucherNo: 'text',
});

export default mongoose.model('Registration', registrationSchema);

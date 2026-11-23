import AcademicProgram from '../models/AcademicProgram.js';
import SiteSettings from '../models/SiteSettings.js';
import Enquiry from '../models/Enquiry.js';
import { success, fail } from '../utils/ApiResponse.js';
import asyncHandler from '../utils/asyncHandler.js';

const DEFAULT_PROGRAMS = [
  {
    title: 'Diploma in General Medicine (HA)',
    titleNp: 'सामान्य चिकित्सा डिप्लोमा (एच.ए.)',
    duration: '3 Years',
    seats: '40 Seats',
    tag: 'Medical',
    desc: 'Foundational clinical education designed to produce skilled Health Assistants capable of providing primary healthcare services.',
    descNp: 'प्राथमिक स्वास्थ्य सेवा प्रदान गर्न दक्ष स्वास्थ्य सहायक तयार गर्न डिजाइन गरिएको आधारभूत क्लिनिकल शिक्षा।',
    eligibility: 'SEE / SLC with minimum GPA 2.0 or equivalent with Science & Math',
    gradient: 'from-blue-900 via-blue-800 to-blue-700',
    status: 'admissions_open',
    sortOrder: 1,
    iconName: 'Stethoscope',
  },
  {
    title: 'Diploma in Pharmacy',
    titleNp: 'फार्मेसी डिप्लोमा',
    duration: '3 Years',
    seats: '40 Seats',
    tag: 'Pharmacy',
    desc: 'Technical training in pharmaceutical sciences, drug management, dispensing, and pharmacology to ensure safe medication use.',
    descNp: 'औषधिको सुरक्षित प्रयोग सुनिश्चित गर्न औषधि विज्ञान, औषधि व्यवस्थापन, र वितरणमा प्राविधिक प्रशिक्षण।',
    eligibility: 'SEE / SLC with minimum GPA 2.0 or equivalent with Science & Math',
    gradient: 'from-red-800 via-red-700 to-rose-600',
    status: 'admissions_open',
    sortOrder: 2,
    iconName: 'HeartPulse',
  },
  {
    title: 'Diploma in Medical Laboratory Technology (CMLT)',
    titleNp: 'मेडिकल ल्याबोरेटरी टेक्नोलोजी डिप्लोमा (सीएमएलटी)',
    duration: '3 Years',
    seats: '30 Seats',
    tag: 'Paramedical',
    desc: 'Advanced diagnostic training for Laboratory Technicians, focusing on clinical pathology, biochemistry, hematology, and microbiology.',
    descNp: 'क्लिनिकल प्याथोलोजी, बायोकेमिस्ट्री, र माइक्रोबायोलोजीमा प्रयोगशाला प्राविधिकहरूको लागि उन्नत निदान प्रशिक्षण।',
    eligibility: 'SEE / SLC with minimum GPA 2.0 or equivalent with Science & Math',
    gradient: 'from-emerald-800 via-emerald-700 to-teal-600',
    status: 'admissions_open',
    sortOrder: 3,
    iconName: 'FlaskConical',
  },
  {
    title: 'PCL Nursing (Staff Nurse)',
    titleNp: 'पीसीएल नर्सिङ (स्टाफ नर्स)',
    duration: '3 Years',
    seats: '40 Seats',
    tag: 'Nursing',
    desc: 'Comprehensive clinical nursing education preparing registered nurses for multi-specialty hospital wards and critical care units.',
    descNp: 'अस्पताल वार्ड र सघन हेरचाह एकाइहरूको लागि दर्ता नर्सहरू तयार गर्ने व्यापक क्लिनिकल नर्सिङ शिक्षा।',
    eligibility: 'SEE / SLC with minimum GPA 2.0 or equivalent with Science & Math',
    gradient: 'from-purple-900 via-purple-800 to-indigo-700',
    status: 'admissions_open',
    sortOrder: 4,
    iconName: 'GraduationCap',
  },
  {
    title: 'Diploma in Radiography',
    titleNp: 'रेडियोग्राफी डिप्लोमा',
    duration: '3 Years',
    seats: '30 Seats',
    tag: 'Paramedical',
    desc: 'Training in modern diagnostic imaging, digital X-Ray, CT imaging protocols, radiation safety, and patient positioning.',
    descNp: 'आधुनिक डायग्नोस्टिक इमेजिङ, डिजिटल एक्स-रे, सीटी इमेजिङ प्रोटोकल र विकिरण सुरक्षामा तालिम।',
    eligibility: 'SEE / SLC with minimum GPA 2.0 or equivalent with Science & Math',
    gradient: 'from-amber-800 via-amber-700 to-orange-600',
    status: 'active',
    sortOrder: 5,
    iconName: 'Stethoscope',
  },
];

async function ensureDefaultPrograms() {
  try {
    const count = await AcademicProgram.countDocuments();
    if (count === 0) {
      await AcademicProgram.insertMany(DEFAULT_PROGRAMS);
    }
  } catch (err) {
    console.error('Error seeding default academic programs:', err.message);
  }
}

export const getAcademicData = asyncHandler(async (req, res) => {
  await ensureDefaultPrograms();
  const programs = await AcademicProgram.find().sort({ sortOrder: 1, createdAt: -1 });

  let settings = await SiteSettings.findOne({ key: 'default' });
  if (!settings) settings = await SiteSettings.create({ key: 'default' });

  const inquiriesCount = await Enquiry.countDocuments({ source: 'academic' });

  return success(res, {
    programs,
    settings: settings.academicSettings || {
      heroTitle: 'Center for Healthcare Education & Medical Academy',
      heroSubtitle:
        'Producing compassionate, highly skilled medical and paramedical professionals serving regional and national healthcare needs.',
      yearsOfExcellence: '25+',
      graduatesProduced: '8,000+',
      academicProgramsCount: '12',
      researchPapers: '500+',
      brochureUrl: '',
    },
    inquiriesCount,
  });
});

export const updateAcademicSettings = asyncHandler(async (req, res) => {
  let settings = await SiteSettings.findOne({ key: 'default' });
  if (!settings) settings = await SiteSettings.create({ key: 'default' });

  settings.academicSettings = {
    ...settings.academicSettings,
    ...req.body,
  };
  settings.markModified('academicSettings');
  await settings.save();

  return success(res, settings.academicSettings, 'Academic settings updated');
});

export const createProgram = asyncHandler(async (req, res) => {
  const { title } = req.body;
  if (!title || !title.trim()) {
    return fail(res, 'Program title is required', 400);
  }

  const newProg = await AcademicProgram.create({
    ...req.body,
    title: title.trim(),
  });

  return success(res, newProg, 'Academic program created successfully', 201);
});

export const updateProgram = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const prog = await AcademicProgram.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
  if (!prog) return fail(res, 'Program not found', 404);

  return success(res, prog, 'Academic program updated successfully');
});

export const deleteProgram = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const prog = await AcademicProgram.findByIdAndDelete(id);
  if (!prog) return fail(res, 'Program not found', 404);

  return success(res, { id }, 'Academic program deleted successfully');
});

export const getAcademicInquiries = asyncHandler(async (req, res) => {
  const inquiries = await Enquiry.find({ source: 'academic' }).sort({ createdAt: -1 });
  return success(res, inquiries);
});

export const submitAdmissionInquiry = asyncHandler(async (req, res) => {
  const { name, phone, email, program, qualification, message, address, dob, gender } = req.body;
  if (!name || !phone) {
    return fail(res, 'Name and phone number are required', 400);
  }

  const inquiry = await Enquiry.create({
    name: name.trim(),
    phone: phone.trim(),
    email: (email || '').trim(),
    subject: `Academic Admission Inquiry: ${program || 'General Inquiry'}`,
    message: message || `Application for ${program || 'an academic program'}. Qualification: ${qualification || 'N/A'}.`,
    address: address || '',
    dob: dob || '',
    gender: gender || '',
    source: 'academic',
    meta: {
      program: program || '',
      qualification: qualification || '',
    },
  });

  return success(res, inquiry, 'Your academic admission inquiry has been submitted successfully. Our admission desk will contact you shortly.', 201);
});

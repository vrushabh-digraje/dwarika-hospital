import { connectDB } from '../config/db.js';
import {
  SiteSettings,
  Homepage,
  About,
  Doctor,
  Department,
  Service,
  GalleryItem,
  Testimonial,
  Blog,
  Event,
  Faq,
  Download,
  Announcement,
  SeoSetting,
  Video,
  Facility,
  Partner,
  Insurance,
  HealthPackage,
  Career,
  Certificate,
} from '../models/index.js';

export async function runSeed({ connect = true } = {}) {
  if (connect) await connectDB();
  console.log('Seeding CMS database...');

  await Promise.all([
    SiteSettings.deleteMany({}),
    Homepage.deleteMany({}),
    About.deleteMany({}),
    Doctor.deleteMany({}),
    Department.deleteMany({}),
    Service.deleteMany({}),
    GalleryItem.deleteMany({}),
    Testimonial.deleteMany({}),
    Blog.deleteMany({}),
    Event.deleteMany({}),
    Faq.deleteMany({}),
    Download.deleteMany({}),
    Announcement.deleteMany({}),
    SeoSetting.deleteMany({}),
    Video.deleteMany({}),
    Facility.deleteMany({}),
    Partner.deleteMany({}),
    Insurance.deleteMany({}),
    HealthPackage.deleteMany({}),
    Career.deleteMany({}),
    Certificate.deleteMany({}),
  ]);

  await SiteSettings.create({
    key: 'default',
    logoUrl: '/logo.png',
    brandNameEn: 'Dwarika Hospital',
    brandSubtitle: '& Medical Academy Pvt. Ltd.',
    brandLockupEn: 'Dwarika Hospital & Medical Academy Pvt. Ltd.',
    brandLockupNp: 'द्वारिका हस्पिटल एण्ड मेडिकल एकेडेमी प्रा. लि.',
    emergencyNumber: '103',
    landline: '031-590123',
    emails: {
      general: 'dwarikahospital15@gmail.com',
      appointment: 'appointment@dwarikahospital.com',
      info: 'info@dhama.com.np',
    },
    addressEn: 'Janakpurdham, Dhanusha, Madhesh Province, Nepal',
    websiteUrl: 'https://dwarikahospital.com',
    social: {
      facebook: 'https://facebook.com',
      instagram: 'https://instagram.com',
      whatsapp: 'https://wa.me/',
      linkedin: 'https://linkedin.com',
      youtube: 'https://www.youtube.com/@DwarikaHospital',
    },
    marqueeLines: [
      'Dwarika Hospital — Your Health, Our Commitment',
      'MBBS Admissions Open for 2025/26 Academic Session',
      '24/7 Emergency & Lab Services Available',
      'Pharmacy Home Delivery Now Active',
    ],
    footerText: 'Providing advanced, compassionate healthcare to Madhesh Province and beyond.',
    copyrightText: '© Dwarika Hospital & Medical Academy Pvt. Ltd. All rights reserved.',
  });

  const doctors = await Doctor.insertMany([
    {
      name: 'Dr. Saroj Kumar Mandal',
      slug: 'dr-saroj-kumar-mandal',
      specialty: 'Senior Consultant Cardiologist',
      specialization: 'Senior Interventional Cardiologist',
      qualification: 'MBBS, MD, DM (Cardiology)',
      category: 'Cardiology',
      teamCategory: 'DOCTOR',
      imageUrl: 'https://images.unsplash.com/photo-1614608682850-e0d6ed316d47?auto=format&fit=crop&q=80&w=1000',
      bio: 'Dr. Mandal is a leading expert in cardiovascular medicine with over 15 years of experience in interventional cardiology.',
      isFeaturedOnHero: true,
      isBookable: true,
      status: 'published',
      sortOrder: 1,
    },
    {
      name: 'Dr. Pankaj Pratap Shah',
      slug: 'dr-pankaj-pratap-shah',
      specialty: 'Head of Neurology Department',
      specialization: 'Senior Neurologist & Neurosurgeon',
      qualification: 'MBBS, MD (Neurology), PhD',
      category: 'Neurology',
      teamCategory: 'DOCTOR',
      imageUrl: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=1528',
      bio: 'Dr. Shah specializes in complex neurological disorders and has published numerous research papers on stroke management.',
      isFeaturedOnHero: true,
      isBookable: true,
      status: 'published',
      sortOrder: 2,
    },
    {
      name: 'Dr. Emily Williams',
      slug: 'dr-emily-williams',
      specialty: 'Consultant Pediatrician',
      specialization: 'Consultant Pediatrician & Neonatologist',
      qualification: 'MBBS, MD (Pediatrics), Fellowship in Neonatology',
      category: 'Pediatrics',
      teamCategory: 'DOCTOR',
      imageUrl: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&q=80&w=1374',
      bio: 'Dr. Williams is dedicated to providing compassionate care to children, with a focus on neonatology and child development.',
      isFeaturedOnHero: true,
      isBookable: true,
      status: 'published',
      sortOrder: 3,
    },
    {
      name: 'Dr. Abhishek Shah',
      slug: 'dr-abhishek-shah',
      specialty: 'Senior Orthopedic Surgeon',
      category: 'Orthopedics',
      teamCategory: 'DOCTOR',
      imageUrl: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=1470',
      bio: 'Dr. Shah excels in joint replacement surgeries and sports medicine.',
      isBookable: true,
      status: 'published',
      sortOrder: 4,
    },
    {
      name: 'Dr. Suman Bhusal',
      slug: 'dr-suman-bhusal',
      specialty: 'Consultant Radiologist',
      category: 'Radio Imaging',
      teamCategory: 'RADIO IMAGING STAFF',
      imageUrl: 'https://images.unsplash.com/photo-1559839734-2b71f1536783?auto=format&fit=crop&q=80&w=1470',
      bio: 'Expert in diagnostic radiology with specialized training in MSK imaging.',
      isBookable: true,
      status: 'published',
      sortOrder: 5,
    },
  ]);

  await Homepage.create({
    key: 'default',
    status: 'published',
    hero: {
      badge: "Nepal's Premier Healthcare Destination",
      titlePart1: 'Your Health,',
      titlePart2: 'Our Commitment.',
      description:
        'Experience a new standard of medical excellence. Dwarika Hospital combines world-class clinical expertise with an empathetic heart, powered by advanced technology.',
      primaryCtaLabel: 'Book Appointment',
      primaryCtaLink: '/appointment',
      secondaryCtaLabel: 'Explore Services',
      secondaryCtaLink: '/#services',
      bannerImages: [
        'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=1600',
        'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=1600',
      ],
      awardBadgeTitle: 'Award Winning',
      awardBadgeSubtitle: 'Healthcare 2024',
      featuredDoctorIds: doctors.filter((d) => d.isFeaturedOnHero).map((d) => d._id),
    },
    counters: [
      { label: 'Patients Served', value: '15k+', iconKey: 'users', sortOrder: 1 },
      { label: 'Expert Doctors', value: '50+', iconKey: 'stethoscope', sortOrder: 2 },
      { label: 'Departments', value: '12+', iconKey: 'building', sortOrder: 3 },
      { label: 'Years of Care', value: '10+', iconKey: 'award', sortOrder: 4 },
    ],
    cta: {
      title: 'Need Medical Assistance?',
      description: 'Book an appointment with our specialists today.',
      buttonLabel: 'Book Appointment',
      buttonLink: '/appointment',
    },
  });

  await About.create({
    title: 'About Dwarika Hospital',
    tagline: 'Building a Legacy of Care',
    introduction:
      'Dwarika Hospital & Medical Academy Pvt. Ltd. is a pioneer in bringing advanced healthcare to the heart of Madhesh Province.',
    missionTitle: 'Our Mission',
    missionSubtitle: 'Patient-Centered Care First',
    missionText:
      'To provide high-quality, affordable and patient-centered healthcare to our community.',
    visionTitle: 'Our Vision',
    visionSubtitle: 'Excellence for Every Family',
    visionText: 'To be the most trusted healthcare institution in Madhesh Province.',
    values: [
      { title: 'Compassion', description: 'Care with empathy', iconKey: 'heart' },
      { title: 'Excellence', description: 'Clinical quality first', iconKey: 'award' },
      { title: 'Integrity', description: 'Transparent and ethical', iconKey: 'shield' },
    ],
    storyHtml: '<p>Our journey began with a commitment to bring world-class healthcare closer to home.</p>',
    infrastructure: {
      beds: '100+',
      ot: '5',
      icu: '12',
      facilities: [
        { title: 'Modern ICU', description: 'Advanced critical care units', iconKey: 'activity' },
        { title: 'Diagnostic Lab', description: '24/7 pathology services', iconKey: 'flask' },
      ],
    },
    leadershipMessages: [
      {
        role: 'Chairman',
        heading: 'Message from the Chairman',
        name: 'Chairman',
        message: 'We are committed to serving our community with excellence and compassion.',
        imageUrl: '/chairman.png',
        sortOrder: 1,
      },
    ],
    status: 'published',
  });

  const departments = [
    { title: 'Cardiology', slug: 'cardiology', shortDesc: 'Heart care & interventional cardiology', iconKey: 'heart', colorTheme: 'red' },
    { title: 'Neurology', slug: 'neurology', shortDesc: 'Brain and nervous system care', iconKey: 'brain', colorTheme: 'purple' },
    { title: 'Orthopedics', slug: 'orthopedics', shortDesc: 'Bones, joints and sports medicine', iconKey: 'bone', colorTheme: 'blue' },
    { title: 'Pediatrics', slug: 'pediatrics', shortDesc: 'Specialized care for children', iconKey: 'baby', colorTheme: 'green' },
    { title: 'Gynecology', slug: 'gynecology', shortDesc: 'Women’s health services', iconKey: 'heart', colorTheme: 'pink' },
    { title: 'Emergency', slug: 'emergency', shortDesc: '24/7 emergency response', iconKey: 'siren', colorTheme: 'orange' },
  ];

  await Department.insertMany(
    departments.map((d, i) => ({
      ...d,
      longDescription: `${d.shortDesc}. Our ${d.title} department provides comprehensive specialist care.`,
      services: ['Consultation', 'Diagnostics', 'Treatment'],
      specialistCountLabel: '4 Specialists',
      status: 'published',
      sortOrder: i + 1,
    }))
  );

  await Service.insertMany([
    { title: 'Emergency Care', slug: 'emergency-care', description: 'Round-the-clock emergency services', category: 'Emergency', status: 'published', sortOrder: 1 },
    { title: 'Laboratory', slug: 'laboratory', description: 'Full-service diagnostic laboratory', category: 'Diagnostics', status: 'published', sortOrder: 2 },
    { title: 'Pharmacy', slug: 'pharmacy', description: 'In-house pharmacy with home delivery', category: 'Support', status: 'published', sortOrder: 3 },
    { title: 'Radiology', slug: 'radiology', description: 'Advanced imaging and diagnostics', category: 'Diagnostics', status: 'published', sortOrder: 4 },
    { title: 'Surgery', slug: 'surgery', description: 'Modern operation theatres', category: 'Clinical', status: 'published', sortOrder: 5 },
  ].map((s, i) => ({ ...s, sortOrder: i + 1 })));

  await GalleryItem.insertMany(
    Array.from({ length: 8 }, (_, i) => ({
      title: `Hospital Gallery ${i + 1}`,
      type: 'photo',
      url: `/hospital-${(i % 10) + 1}.png`,
      album: 'hospital',
      status: 'published',
      sortOrder: i + 1,
    }))
  );

  await Testimonial.insertMany([
    {
      name: 'Sita Devi',
      role: 'Patient',
      content: 'The doctors and nurses treated my family with exceptional care and kindness.',
      rating: 5,
      status: 'published',
      isFeatured: true,
    },
    {
      name: 'Ramesh Yadav',
      role: 'Patient',
      content: 'Clean facilities, professional staff, and timely treatment. Highly recommended.',
      rating: 5,
      status: 'published',
    },
    {
      name: 'Anita Shrestha',
      role: 'Patient Family',
      content: 'Emergency team responded quickly and kept us informed throughout.',
      rating: 5,
      status: 'published',
    },
  ]);

  await Blog.insertMany([
    {
      title: '10 Simple Ways to Boost Your Heart Health Daily',
      slug: 'boost-heart-health-daily',
      category: 'Cardiology',
      excerpt: 'Small changes in your routine can make a big difference for your heart.',
      description: 'Learn how daily habits improve cardiovascular health.',
      fullContent: '<p>Maintaining a healthy heart starts with consistent daily habits...</p>',
      author: 'Dr. Rajesh Kumar',
      date: new Date('2024-05-15'),
      imageUrl: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&q=80&w=800',
      iconKey: 'heart',
      status: 'published',
    },
    {
      title: 'Understanding Minds: Mental Wellness in a Fast World',
      slug: 'mental-wellness-fast-world',
      category: 'Mental Health',
      excerpt: 'Techniques for mindfulness and stress management.',
      description: 'Explore how to navigate modern stress and maintain mental clarity.',
      fullContent: '<p>In a world that never seems to slow down, prioritizing mental wellness is essential...</p>',
      author: 'Ms. Anjali Sharma',
      date: new Date('2024-05-12'),
      imageUrl: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=800',
      iconKey: 'brain',
      status: 'published',
    },
  ]);

  await Event.insertMany([
    {
      title: 'Free Health Camp – Janakpur',
      slug: 'free-health-camp-janakpur',
      type: 'Event',
      category: 'Event',
      date: new Date('2024-06-01'),
      description: 'Community health screening camp.',
      fullContent: '<p>Join us for free consultations and basic health checks.</p>',
      imageUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=800',
      status: 'published',
    },
    {
      title: 'MBBS Admissions Open 2025/26',
      slug: 'mbbs-admissions-2025',
      type: 'Admission',
      category: 'Academic',
      date: new Date('2024-05-20'),
      description: 'Applications now open for the upcoming academic session.',
      fullContent: '<p>Apply now for MBBS admissions at Dwarika Medical Academy.</p>',
      status: 'published',
      isSpecial: true,
    },
    {
      title: 'Pharmacy Home Delivery Launch',
      slug: 'pharmacy-home-delivery',
      type: 'News',
      category: 'News',
      date: new Date('2024-05-10'),
      description: 'Medicines delivered to your doorstep.',
      fullContent: '<p>Our pharmacy now offers home delivery across the city.</p>',
      status: 'published',
    },
  ]);

  await Video.insertMany([
    {
      title: 'Hospital Tour',
      description: 'A walkthrough of our modern facilities.',
      thumbnailUrl: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=800',
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      category: 'Facility',
      duration: '3:20',
      status: 'published',
    },
  ]);

  await Faq.insertMany([
    { question: 'How do I book an appointment?', answer: 'Use the Book Appointment page or call our landline.', category: 'Appointments', status: 'published' },
    { question: 'Do you provide 24/7 emergency care?', answer: 'Yes, our emergency department is open 24/7.', category: 'Emergency', status: 'published' },
    { question: 'Where can I download lab reports?', answer: 'Visit the Patient Reports page and enter your credentials.', category: 'Reports', status: 'published' },
  ]);

  await Download.insertMany([
    {
      title: 'Hospital Brochure',
      type: 'Download',
      sizeLabel: '2.4 MB',
      fileUrl: '/downloads/brochure.pdf',
      filename: 'brochure.pdf',
      status: 'published',
    },
  ]);

  await Announcement.insertMany([
    {
      title: '24/7 Emergency & Lab Services Available',
      content: 'Our emergency and laboratory services remain open around the clock.',
      type: 'info',
      showOnMarquee: true,
      status: 'published',
    },
  ]);

  await Facility.insertMany([
    { title: 'ICU', description: 'Advanced intensive care unit', status: 'published', sortOrder: 1 },
    { title: 'Operation Theatre', description: 'Modern surgical suites', status: 'published', sortOrder: 2 },
    { title: 'Dialysis Center', description: 'Renal care services', status: 'published', sortOrder: 3 },
  ]);

  await Partner.insertMany([
    { name: 'Nepal Red Cross', logoUrl: '', websiteUrl: 'https://nrcs.org', status: 'published' },
  ]);

  await Insurance.insertMany([
    { name: 'National Health Insurance', description: 'Accepted at our facility', status: 'published' },
  ]);

  await HealthPackage.insertMany([
    {
      title: 'Basic Health Checkup',
      slug: 'basic-health-checkup',
      description: 'Essential screening package',
      price: 2500,
      features: ['CBC', 'Blood Sugar', 'Urine R/E', 'Doctor Consultation'],
      status: 'published',
      isPopular: true,
    },
  ]);

  await Career.insertMany([
    {
      title: 'Staff Nurse',
      slug: 'staff-nurse',
      department: 'Nursing',
      location: 'Janakpur',
      employmentType: 'Full-time',
      description: 'We are hiring experienced staff nurses.',
      status: 'published',
    },
  ]);

  await Certificate.insertMany([
    {
      title: 'Company Registration',
      nepaliTitle: 'कम्पनी दर्ता',
      org: 'Office of Company Registrar',
      imageUrl: '/images/certificates/certificate-1.png',
      status: 'published',
    },
  ]);

  await SeoSetting.insertMany([
    { pageKey: 'home', pageName: 'Homepage', title: 'Dwarika Hospital | Your Health, Our Commitment', description: 'Advanced healthcare in Madhesh Province.', status: 'published' },
    { pageKey: 'about', pageName: 'About', title: 'About Us | Dwarika Hospital', description: 'Learn about our mission, vision and legacy of care.', status: 'published' },
    { pageKey: 'contact', pageName: 'Contact', title: 'Contact Us | Dwarika Hospital', description: 'Get in touch with Dwarika Hospital.', status: 'published' },
  ]);

  console.log('Seed completed successfully.');
}

const isMain = process.argv[1] && process.argv[1].replace(/\\/g, '/').endsWith('/seed/index.js');
if (isMain) {
  runSeed()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
}

export default runSeed;

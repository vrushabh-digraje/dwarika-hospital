import Doctor from '../models/Doctor.js';
import Appointment from '../models/Appointment.js';

export async function seedAppointmentsAndSchedules() {
  try {
    const doctors = await Doctor.find({ teamCategory: 'DOCTOR' });
    if (!doctors.length) return;

    // 1. Ensure doctor schedules if empty
    for (const doc of doctors) {
      if (!doc.schedule || doc.schedule.length === 0) {
        if (doc.name.includes('Saroj')) {
          doc.schedule = [
            { day: 'Sunday', shift: 'Morning', startTime: '08:00 AM', endTime: '12:00 PM', room: 'Cardiology OPD 101', maxPatients: 25, isActive: true },
            { day: 'Tuesday', shift: 'Morning', startTime: '08:00 AM', endTime: '12:00 PM', room: 'Cardiology OPD 101', maxPatients: 25, isActive: true },
            { day: 'Thursday', shift: 'Afternoon', startTime: '01:00 PM', endTime: '04:00 PM', room: 'Cardiology OPD 101', maxPatients: 20, isActive: true },
            { day: 'Friday', shift: 'Evening', startTime: '04:00 PM', endTime: '07:00 PM', room: 'Cardiology OPD 101', maxPatients: 15, isActive: true },
          ];
        } else if (doc.name.includes('Pankaj')) {
          doc.schedule = [
            { day: 'Monday', shift: 'Morning', startTime: '09:00 AM', endTime: '01:00 PM', room: 'Neuro OPD 204', maxPatients: 20, isActive: true },
            { day: 'Wednesday', shift: 'Afternoon', startTime: '01:00 PM', endTime: '05:00 PM', room: 'Neuro OPD 204', maxPatients: 20, isActive: true },
            { day: 'Friday', shift: 'Morning', startTime: '09:00 AM', endTime: '01:00 PM', room: 'Neuro OPD 204', maxPatients: 20, isActive: true },
            { day: 'Saturday', shift: 'Morning', startTime: '09:00 AM', endTime: '12:30 PM', room: 'Neuro OPD 204', maxPatients: 15, isActive: true },
          ];
        } else if (doc.name.includes('Emily')) {
          doc.schedule = [
            { day: 'Sunday', shift: 'Afternoon', startTime: '12:00 PM', endTime: '04:00 PM', room: 'Pediatric Clinic 103', maxPatients: 20, isActive: true },
            { day: 'Monday', shift: 'Morning', startTime: '08:30 AM', endTime: '12:30 PM', room: 'Pediatric Clinic 103', maxPatients: 25, isActive: true },
            { day: 'Wednesday', shift: 'Morning', startTime: '08:30 AM', endTime: '12:30 PM', room: 'Pediatric Clinic 103', maxPatients: 25, isActive: true },
            { day: 'Friday', shift: 'Afternoon', startTime: '01:00 PM', endTime: '04:30 PM', room: 'Pediatric Clinic 103', maxPatients: 20, isActive: true },
          ];
        } else if (doc.name.includes('Abhishek')) {
          doc.schedule = [
            { day: 'Sunday', shift: 'Morning', startTime: '08:30 AM', endTime: '12:30 PM', room: 'Ortho OPD 108', maxPatients: 20, isActive: true },
            { day: 'Tuesday', shift: 'Afternoon', startTime: '01:00 PM', endTime: '05:00 PM', room: 'Ortho OPD 108', maxPatients: 20, isActive: true },
            { day: 'Thursday', shift: 'Morning', startTime: '08:30 AM', endTime: '12:30 PM', room: 'Ortho OPD 108', maxPatients: 20, isActive: true },
            { day: 'Saturday', shift: 'Evening', startTime: '04:00 PM', endTime: '07:00 PM', room: 'Ortho OPD 108', maxPatients: 15, isActive: true },
          ];
        } else {
          doc.schedule = [
            { day: 'Sunday', shift: 'Morning', startTime: '09:00 AM', endTime: '01:00 PM', room: 'General OPD Room 102', maxPatients: 20, isActive: true },
            { day: 'Wednesday', shift: 'Morning', startTime: '09:00 AM', endTime: '01:00 PM', room: 'General OPD Room 102', maxPatients: 20, isActive: true },
          ];
        }
        await doc.save();
      }
    }

    // 2. Ensure sample appointments if empty
    const appointmentCount = await Appointment.countDocuments();
    if (appointmentCount === 0) {
      const drSaroj = doctors.find((d) => d.name.includes('Saroj')) || doctors[0];
      const drPankaj = doctors.find((d) => d.name.includes('Pankaj')) || doctors[1] || doctors[0];
      const drEmily = doctors.find((d) => d.name.includes('Emily')) || doctors[2] || doctors[0];
      const drAbhishek = doctors.find((d) => d.name.includes('Abhishek')) || doctors[3] || doctors[0];

      const now = new Date();
      const tomorrow = new Date(now);
      tomorrow.setDate(now.getDate() + 1);
      const dayAfter = new Date(now);
      dayAfter.setDate(now.getDate() + 2);
      const yesterday = new Date(now);
      yesterday.setDate(now.getDate() - 1);

      await Appointment.insertMany([
        {
          patientName: 'Ram Bahadur Thapa',
          firstName: 'Ram Bahadur',
          lastName: 'Thapa',
          email: 'ram.thapa@gmail.com',
          phone: '9841234567',
          gender: 'Male',
          dob: '1985-04-12',
          department: drSaroj.category || 'Cardiology',
          doctor: drSaroj.name,
          doctorId: drSaroj._id,
          appointmentDate: tomorrow,
          shift: 'Morning (08:00 AM - 12:00 PM)',
          message: 'Experiencing irregular heartbeat and occasional chest tightness during mild exercise.',
          diseases: ['Hypertension', 'Chest Pain'],
          address: { city: 'Janakpurdham', province: 'Madhesh Province' },
          status: 'confirmed',
          notes: 'Patient requested Dr. Saroj specifically. Electrocardiogram (ECG) scheduled.',
        },
        {
          patientName: 'Sita Maya Gurung',
          firstName: 'Sita Maya',
          lastName: 'Gurung',
          email: 'sita.gurung@yahoo.com',
          phone: '9808765432',
          gender: 'Female',
          dob: '1992-09-20',
          department: drSaroj.category || 'Cardiology',
          doctor: drSaroj.name,
          doctorId: drSaroj._id,
          appointmentDate: dayAfter,
          shift: 'Afternoon (01:00 PM - 04:00 PM)',
          message: 'Routine cardiology follow-up and blood pressure checkup.',
          diseases: ['Routine Health Check'],
          address: { city: 'Birendranagar', province: 'Madhesh Province' },
          status: 'pending',
          notes: 'First time visit via online booking portal.',
        },
        {
          patientName: 'Bikash Shrestha',
          firstName: 'Bikash',
          lastName: 'Shrestha',
          email: 'bikash.shrestha@gmail.com',
          phone: '9812345678',
          gender: 'Male',
          dob: '1988-11-05',
          department: drPankaj.category || 'Neurology',
          doctor: drPankaj.name,
          doctorId: drPankaj._id,
          appointmentDate: tomorrow,
          shift: 'Morning (09:00 AM - 01:00 PM)',
          message: 'Severe recurrent migraines for past two months with light sensitivity.',
          diseases: ['Migraine', 'Headache'],
          address: { city: 'Janakpur', province: 'Madhesh Province' },
          status: 'pending',
          notes: 'Called helpline, needs neurological evaluation.',
        },
        {
          patientName: 'Geeta Sharma',
          firstName: 'Geeta',
          lastName: 'Sharma',
          email: 'geeta.sharma@hotmail.com',
          phone: '9851122334',
          gender: 'Female',
          dob: '1975-02-18',
          department: drPankaj.category || 'Neurology',
          doctor: drPankaj.name,
          doctorId: drPankaj._id,
          appointmentDate: yesterday,
          shift: 'Morning (09:00 AM - 01:00 PM)',
          message: 'Follow-up consultation after MRI cervical spine.',
          diseases: ['Cervical Spondylosis'],
          address: { city: 'Dhanusha', province: 'Madhesh Province' },
          status: 'completed',
          notes: 'Prescribed medication and physical therapy exercises. Next review in 4 weeks.',
        },
        {
          patientName: 'Master Aarav Yadav (Parent: Sunita Yadav)',
          firstName: 'Aarav',
          lastName: 'Yadav',
          email: 'sunita.yadav@gmail.com',
          phone: '9860112244',
          gender: 'Male',
          dob: '2020-06-15',
          department: drEmily.category || 'Pediatrics',
          doctor: drEmily.name,
          doctorId: drEmily._id,
          appointmentDate: now,
          shift: 'Afternoon (12:00 PM - 04:00 PM)',
          message: 'Persistent dry cough and mild fever in 4-year-old child since 3 days.',
          diseases: ['Pediatric Fever', 'Cough'],
          address: { city: 'Janakpurdham-4', province: 'Madhesh Province' },
          status: 'confirmed',
          notes: 'Pediatric urgent OPD slot confirmed by reception.',
        },
        {
          patientName: 'Pradeep Karki',
          firstName: 'Pradeep',
          lastName: 'Karki',
          email: 'pradeep.karki@gmail.com',
          phone: '9849988776',
          gender: 'Male',
          dob: '1980-07-28',
          department: drAbhishek.category || 'Orthopedics',
          doctor: drAbhishek.name,
          doctorId: drAbhishek._id,
          appointmentDate: dayAfter,
          shift: 'Morning (08:30 AM - 12:30 PM)',
          message: 'Right knee acute pain and swelling after soccer match injury.',
          diseases: ['Knee Pain', 'Sports Injury'],
          address: { city: 'Mahottari', province: 'Madhesh Province' },
          status: 'confirmed',
          notes: 'X-Ray Knee AP/Lateral requested upon arrival.',
        },
        {
          patientName: 'Manoj Kumar Rai',
          firstName: 'Manoj Kumar',
          lastName: 'Rai',
          email: 'manoj.rai@outlook.com',
          phone: '9801122339',
          gender: 'Male',
          dob: '1970-12-10',
          department: drAbhishek.category || 'Orthopedics',
          doctor: drAbhishek.name,
          doctorId: drAbhishek._id,
          appointmentDate: yesterday,
          shift: 'Evening (04:00 PM - 07:00 PM)',
          message: 'Patient cancelled due to out-of-town travel.',
          diseases: ['Lower Back Pain'],
          address: { city: 'Janakpur', province: 'Madhesh Province' },
          status: 'cancelled',
          notes: 'Cancelled by patient. Advised to reschedule next week.',
        },
      ]);
      console.log('Seeded sample appointments.');
    }
  } catch (err) {
    console.error('Error seeding appointments and schedules:', err);
  }
}

export default seedAppointmentsAndSchedules;

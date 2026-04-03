import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HeartPulse, Brain, Baby, Bone, Activity, Microscope, Syringe, Stethoscope, ArrowRight, Calendar, MapPin, Phone, Mail, Clock, ShieldCheck, Award, Star } from 'lucide-react';
import Button from '../components/Button';

const departmentDetails = {
  cardiology: {
    title: "Cardiology",
    icon: HeartPulse,
    description: "Our Cardiology department is dedicated to providing world-class heart care. From diagnostic services to complex cardiac interventions, we offer comprehensive solutions for all heart-related conditions.",
    services: [
      "Diagnostic ECG & ECHO",
      "Interventional Cardiology",
      "Coronary Artery Disease Treatment",
      "Heart Failure Management",
      "Hypertension Care"
    ],
    doctors: "4 Specialists"
  },
  neurology: {
    title: "Neurology",
    icon: Brain,
    description: "The Neurology department provides advanced care for brain and nervous system disorders. Our team of neurologists specializes in treating complex conditions with state-of-the-art diagnostic and therapeutic technologies.",
    services: [
      "Stroke Management",
      "Epilepsy Treatment",
      "Neuro-diagnostic Services",
      "Headache Clinic",
      "Nerve & Muscle Disorders"
    ],
    doctors: "3 Specialists"
  },
  paediatrics: {
    title: "Paediatrics",
    icon: Baby,
    description: "Our Paediatrics department offers compassionate and comprehensive healthcare for infants, children, and adolescents. We ensure a child-friendly environment to make medical visits stress-free.",
    services: [
      "Immunization / Vaccination",
      "General Pediatric Consultations",
      "Newborn Care",
      "Developmental Assessment",
      "Pediatric Emergency Care"
    ],
    doctors: "5 Specialists"
  },
  orthopaedics: {
    title: "Orthopaedics",
    icon: Bone,
    description: "The Orthopaedics department provides specialized care for bone, joint, and muscle conditions. We offer both conservative and surgical treatments to help patients regain mobility.",
    services: [
      "Fracture & Trauma Management",
      "Joint Replacement Surgery",
      "Physiotherapy Coordination",
      "Sports Injury Treatment",
      "Spine Care"
    ],
    doctors: "4 Specialists"
  },
  emergency: {
    title: "Emergency",
    icon: Activity,
    description: "Our 24/7 Emergency department is equipped to handle all medical crises with rapid triage and immediate stabilization. Our dedicated team is always ready for life-saving interventions.",
    services: [
      "24/7 Acute Care",
      "Major Trauma Management",
      "Poisoning & Toxicology",
      "Critical Care Support",
      "Ambulance Services"
    ],
    doctors: "8 Specialists"
  },
  diagnostics: {
    title: "Diagnostics",
    icon: Microscope,
    description: "The Diagnostics department provides essential lab and imaging services with high accuracy. We utilize modern technology for digital X-rays, ultrasonography, and specialized testing.",
    services: [
      "Digital X-ray",
      "Ultrasonography",
      "Pathology Lab Services",
      "Biochemistry Tests",
      "Standard Screening Packages"
    ],
    doctors: "6 Specialists"
  },
  "gynae-obstetrics": {
    title: "Gynae & Obstetrics",
    icon: Syringe,
    description: "Our Gynae & Obstetrics department offers comprehensive maternal and reproductive healthcare. We provide safe motherhood programs and delivery services in a secure environment.",
    services: [
      "Prenatal & Postnatal Care",
      "Normal & Caesarean Delivery",
      "Gynecological Surgery",
      "Family Planning Services",
      "Menstrual Health Clinic"
    ],
    doctors: "5 Specialists"
  },
  "general-medicine": {
    title: "General Medicine",
    icon: Stethoscope,
    description: "The General Medicine department is our primary healthcare hub. We manage chronic diseases and provide preventive checkups along with primary clinical consultations.",
    services: [
      "Chronic Disease Management",
      "Fever & Infectious Diseases",
      "Health Screenings",
      "Preventive Medicine",
      "Geriatric Care"
    ],
    doctors: "10 Specialists"
  }
};

const DepartmentDetailPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const department = departmentDetails[slug as keyof typeof departmentDetails];

  if (!department) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="text-center">
          <h2 className="text-2xl font-black text-blue-900 mb-4">Department Not Found</h2>
          <Button onClick={() => navigate('/')}>Return to Home</Button>
        </div>
      </div>
    );
  }

  const DepartmentIcon = department.icon;

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative h-96 bg-blue-900 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-blue-950 to-blue-900/40"></div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-6 h-full flex flex-col justify-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-4 mb-6"
          >
            <div className="p-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20">
              <DepartmentIcon className="w-12 h-12 text-blue-400" />
            </div>
            <div className="h-12 w-[2px] bg-red-600"></div>
            <span className="text-white/60 text-sm font-black uppercase tracking-[0.4em]">Expert Care</span>
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-5xl md:text-7xl font-black text-white uppercase tracking-tight mb-6"
          >
            {department.title} <span className="text-red-600">Department</span>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-white/70 text-lg max-w-2xl font-medium"
          >
            {department.description}
          </motion.p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-8 space-y-16">
            <section className="space-y-8">
              <div className="flex items-center gap-3">
                <ShieldCheck className="w-8 h-8 text-blue-900" />
                <h2 className="text-3xl font-black text-blue-900 uppercase">Our Specialized Services</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {department.services.map((service, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1 }}
                    className="flex items-center gap-4 p-5 bg-gray-50 rounded-2xl border border-gray-100 group hover:bg-blue-900 hover:text-white transition-all duration-300 shadow-sm"
                  >
                    <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-900 flex items-center justify-center shrink-0 group-hover:bg-white/20 group-hover:text-white">
                      <Star className="w-5 h-5 fill-current" />
                    </div>
                    <span className="font-bold text-sm tracking-wide">{service}</span>
                  </motion.div>
                ))}
              </div>
            </section>

            <section className="p-8 bg-blue-50 rounded-3xl border border-blue-100 flex flex-col md:flex-row items-center gap-8 justify-between">
              <div className="space-y-2 text-center md:text-left">
                <h3 className="text-2xl font-black text-blue-950 uppercase">Ready for a Consultation?</h3>
                <p className="text-blue-900/60 font-medium">Schedule your visit today with our specialized {department.title} experts.</p>
              </div>
              <Button
                onClick={() => navigate('/appointment', { state: { department: department.title } })}
                className="rounded-2xl px-10 py-4 shadow-xl shadow-blue-900/20 hover:scale-105 transition-all text-xs uppercase tracking-widest font-black"
              >
                Book Appointment <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </section>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4 space-y-8">
            <div className="bg-white rounded-3xl border border-gray-100 shadow-2xl p-8 space-y-8">
              <div className="space-y-6">
                <h3 className="text-xl font-black text-blue-900 uppercase tracking-tight pb-4 border-b border-gray-100 flex items-center gap-3">
                  <Award className="w-6 h-6 text-red-600" /> Department Info
                </h3>
                
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Available Days</p>
                    <p className="text-sm font-bold text-blue-900">Sunday - Friday</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">OPD Hours</p>
                    <p className="text-sm font-bold text-blue-900">8:00 AM - 4:00 PM</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Location</p>
                    <p className="text-sm font-bold text-blue-900">Floor 2, Wing B</p>
                  </div>
                </div>
              </div>

              <div className="p-6 bg-slate-900 rounded-2xl text-white space-y-4">
                <h4 className="font-black text-xs uppercase tracking-[0.2em] text-red-500">Emergency Case?</h4>
                <p className="text-sm text-white/60 leading-relaxed">For immediate medical attention, call our specialized unit directly.</p>
                <div className="space-y-2">
                  <a href="tel:+977" className="flex items-center gap-3 text-sm font-bold hover:text-red-500 transition-colors">
                    <Phone className="w-4 h-4" /> +977-XX-XXXXXX
                  </a>
                  <a href="mailto:info@" className="flex items-center gap-3 text-sm font-bold hover:text-red-500 transition-colors">
                    <Mail className="w-4 h-4" /> info@dwarikahospital.com
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DepartmentDetailPage;

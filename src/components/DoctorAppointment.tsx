import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
    Clock, Phone, Mail,
    ArrowLeft, ArrowRight, CheckCircle,
    Stethoscope
} from 'lucide-react';
import Button from './Button';
import { postData } from '../lib/api';
import { NepaliDatePicker } from 'nepali-datepicker-reactjs';
import BikramSambat from 'bikram-sambat-js';
import { PROVINCES, DISTRICTS_BY_PROVINCE, MUNICIPALITY_TYPES, COMMON_VILLAGES, CASTES_BY_GROUP } from '../constants/nepalData';
import 'nepali-datepicker-reactjs/dist/index.css';

const ETHNIC_GROUPS = Object.keys(CASTES_BY_GROUP);

const getAgeFromDobBs = (dobBs: string) => {
    if (!dobBs) return '';

    try {
        const adDate = new Date(new BikramSambat(dobBs, 'BS').toAD());
        const today = new Date();

        let years = today.getFullYear() - adDate.getFullYear();
        let months = today.getMonth() - adDate.getMonth();
        let days = today.getDate() - adDate.getDate();

        if (days < 0) {
            months -= 1;
            const previousMonth = new Date(today.getFullYear(), today.getMonth(), 0).getDate();
            days += previousMonth;
        }

        if (months < 0) {
            years -= 1;
            months += 12;
        }

        if (years < 0) return '';

        return `${years}y ${months}m`;
    } catch {
        return '';
    }
};

const DOCTORS_DATA = [
    { name: 'Dr. Sandeep Sharma', specialty: 'Cardiology', image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=1000' },
    { name: 'Dr. Priya Adhikari', specialty: 'Gynecology', image: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&q=80&w=1000' },
    { name: 'Dr. Rajesh Gupta', specialty: 'Neurology', image: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=1000' },
    { name: 'Dr. Sarah Johnson', specialty: 'Cardiology', image: 'https://images.unsplash.com/photo-1614608682850-e0d6ed316d47?auto=format&fit=crop&q=80&w=1000' },
    { name: 'Dr. Michael Chen', specialty: 'Neurology', image: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=1528' },
    { name: 'Dr. Emily Williams', specialty: 'Pediatrics', image: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&q=80&w=1374' },
    { name: 'Dr. Robert Brown', specialty: 'Orthopedics', image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=1470' },
];

const ICD11_COMMON_DISEASES = [
    "1A00 Cholera",
    "1A01 Typhoid fever",
    "1B10 Tuberculosis",
    "1D01 Influenza",
    "5A10 Type 1 diabetes mellitus",
    "5A11 Type 2 diabetes mellitus",
    "8A80 Epilepsy",
    "BA00 Essential hypertension",
    "BA01 Hypertensive heart disease",
    "CA20 Pneumonia",
    "CA23 Asthma",
    "CB00 Chronic obstructive pulmonary disease",
    "DA93 Gastritis",
    "FB32 Osteoarthritis",
    "GC08 Urinary tract infection",
    "ME01 Migraine",
    "NC72 Low back pain",
    "XR28 COVID-19",
    "None / Other"
];

const DoctorAppointment = () => {
    const { t, i18n } = useTranslation();
    const [formData, setFormData] = useState({
        firstName: '',
        middleName: '',
        lastName: '',
        dobBs: '',
        gender: 'Select Gender',
        religion: '',
        ethnicGroup: '',
        caste: '',
        phoneNumber: '',
        mobileNumber: '',
        email: '',
        department: 'Cardiology',
        doctor: 'Any Available Doctor',
        shift: 'Morning (8:00 AM - 12:00 PM)',
        address: '',
        country: 'Nepal',
        province: 'Select Province',
        district: '',
        municipalityType: 'Municipality',
        ward: '',
        villageTole: '',
        message: '',
        existingCondition: '',
        diseaseStatus: '',
        diseaseDuration: '',
        diseaseNote: '',
    });
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [appointmentDate, setAppointmentDate] = useState<string>('');
    const [dobDateBS, setDobDateBS] = useState('');
    const [appointmentDateBS, setAppointmentDateBS] = useState('');
    const [appointmentDateAD, setAppointmentDateAD] = useState('');
    const [step, setStep] = useState(1);
    const navigate = useNavigate();
    const location = useLocation();

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    useEffect(() => {
        if (dobDateBS) {
            try {
                setFormData(prev => prev.dobBs === dobDateBS ? prev : { ...prev, dobBs: dobDateBS });
            } catch (e) { /* ignore partial Input */ }
        }
    }, [dobDateBS]);

    useEffect(() => {
        if (appointmentDateBS) {
            try {
                const adDate = new BikramSambat(appointmentDateBS, 'BS').toAD();
                if (appointmentDateAD !== adDate) {
                    setAppointmentDateAD(adDate);
                    setAppointmentDate(adDate);
                }
            } catch (e) { /* ignore partial Input */ }
        }
    }, [appointmentDateBS, appointmentDateAD]);

    useEffect(() => {
        if (appointmentDateAD) {
            try {
                const bsDate = new BikramSambat(appointmentDateAD, 'AD').toBS();
                if (appointmentDateBS !== bsDate) {
                    setAppointmentDateBS(bsDate);
                    setAppointmentDate(appointmentDateAD);
                }
            } catch (e) { /* ignore partial Input */ }
        }
    }, [appointmentDateAD, appointmentDateBS]);

    useEffect(() => {
        if (location.state) {
            const { doctorName, department } = location.state;
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setFormData(prev => ({
                ...prev,
                doctor: doctorName || prev.doctor,
                department: department || prev.department
            }));
        }
    }, [location.state]);

    const availableCastes = formData.ethnicGroup ? CASTES_BY_GROUP[formData.ethnicGroup as keyof typeof CASTES_BY_GROUP] ?? [] : [];
    const availableDistricts = formData.province && formData.province !== 'Select Province'
        ? DISTRICTS_BY_PROVINCE[formData.province as keyof typeof DISTRICTS_BY_PROVINCE] ?? []
        : [];
    const combinedPatientName = [formData.firstName, formData.middleName, formData.lastName].filter(Boolean).join(' ').trim();
    const derivedAge = getAgeFromDobBs(dobDateBS || formData.dobBs);
    const langCode = (i18n.resolvedLanguage ?? i18n.language ?? 'en').split('-')[0].toLowerCase();
    const pickerLocale = langCode === 'np' ? 'ne' : 'en';
    const selectIndicatorStyle = {
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='18' height='18' viewBox='0 0 20 20' fill='none'%3E%3Cpath d='M6 8L10 12L14 8' stroke='%235D6E8B' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`,
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'right 1rem center',
        backgroundSize: '18px',
    } as const;

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.firstName.trim()) newErrors.firstName = "First name is required.";
        if (!formData.lastName.trim()) newErrors.lastName = "Last name is required.";
        if (!formData.dobBs.trim()) newErrors.age = "DOB (BS) is required.";
        if (formData.gender === 'Select Gender') newErrors.gender = t('appointment.errors.gender') || "Please select a gender.";
        if (!formData.ethnicGroup) newErrors.ethnicGroup = "Please select an ethnic group.";
        if (!formData.caste) newErrors.caste = t('appointment.errors.caste') || "Please select a caste.";
        if (!formData.mobileNumber.trim()) {
            newErrors.mobileNumber = "Mobile number is required.";
        } else if (!/^\+?[0-9\s-]{7,}$/.test(formData.mobileNumber)) {
            newErrors.mobileNumber = t('appointment.errors.phone_valid') || "Please enter a valid phone number.";
        }
        if (formData.country === 'Nepal') {
            if (formData.province === 'Select Province') newErrors.province = t('appointment.errors.province') || "Please select a province.";
            if (!formData.district) newErrors.district = t('appointment.errors.district') || "Please select a district.";
            if (!formData.ward.trim()) newErrors.ward = t('appointment.errors.ward') || "Ward is required.";
            if (!formData.villageTole.trim()) newErrors.villageTole = t('appointment.errors.village') || "Village / Tole is required.";
        } else {
            if (!formData.address.trim()) newErrors.address = t('appointment.errors.address') || "Address specification is required.";
        }
        if (formData.email.trim() && !/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = t('appointment.errors.email_valid') || "Please enter a valid email address.";
        }
        if (!appointmentDate) {
            newErrors.appointmentDates = t('appointment.errors.date') || "Please select an appointment date.";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm()) {
            return;
        }
        try {
            await postData('/appointments', {
                ...formData,
                fullName: combinedPatientName,
                age: derivedAge,
                contactNumber: formData.mobileNumber,
                appointmentDate
            });
            setIsSubmitted(true);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } catch (error) {
            console.error('Appointment request failed:', error);
            alert('Failed to submit appointment request.');
        }
    };

    if (isSubmitted) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-20 relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5"></div>
                <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    className="bg-white p-10 rounded-3xl shadow-2xl max-w-md w-full text-center relative z-10 border border-gray-100"
                >
                    <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", stiffness: 200, damping: 10, delay: 0.2 }}
                        >
                            <CheckCircle className="w-12 h-12 text-green-500" />
                        </motion.div>
                    </div>
                    <h2 className="text-3xl font-black text-blue-900 mb-3 tracking-tight">{t('appointment.success.title')}</h2>
                    <p className="text-gray-500 mb-8 leading-relaxed">
                        {t('appointment.success.desc', { name: combinedPatientName, phone: formData.mobileNumber })}
                    </p>
                    <Button onClick={() => navigate('/')} className="w-full bg-blue-900 text-white py-4 rounded-xl font-bold shadow-lg shadow-blue-900/20 hover:shadow-blue-900/30 transition-all hover:-translate-y-1">
                        {t('appointment.success.return_home')}
                    </Button>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 relative">
            {/* Background decoration */}
            <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-blue-900/5 to-transparent -z-10" />

            <div className="max-w-7xl mx-auto relative z-10">
                <div className="text-center mb-12">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-block mb-4 px-4 py-1.5 rounded-full bg-blue-100 text-blue-900 text-xs font-bold uppercase tracking-widest"
                    >
                        {t('appointment.badge')}
                    </motion.div>
                    <h1 className="text-3xl lg:text-5xl font-black text-blue-900 uppercase tracking-tight mb-6">
                        {t('appointment.heading_part1')}<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-red-600">{t('appointment.heading_part2')}</span>
                    </h1>
                    <p className="text-gray-600 max-w-2xl mx-auto font-medium text-lg">
                        {t('appointment.description')}
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Contact Info Sidebar */}
                    <div className="lg:col-span-4 space-y-6">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="relative h-64 w-full rounded-3xl overflow-hidden shadow-xl group"
                        >
                            <img
                                src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80&w=800"
                                alt="Doctor with tablet"
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-blue-900/80 to-transparent flex items-end p-6">
                                <p className="text-white font-bold text-lg">{t('live_consultation.available_now')}</p>
                            </div>
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1 }}
                            className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100"
                        >
                            <h3 className="text-xl font-bold mb-6 uppercase tracking-wider">{t('appointment.contact_title')}</h3>
                            <div className="space-y-6">
                                <div className="flex items-start gap-4 group">
                                    <div className="p-3 bg-blue-50 rounded-xl text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                        <Phone className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">{t('appointment.hotline')}</p>
                                        <p className="text-lg font-black text-blue-900">+977-XX-XXXXXX</p>
                                        <p className="text-sm text-gray-500 font-medium">+977-XX-XXXXXX</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4 group">
                                    <div className="p-3 bg-blue-50 rounded-xl text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                        <Mail className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">{t('appointment.email_us')}</p>
                                        <p className="text-sm font-bold text-blue-900 break-all">appointment@dwarikahospital.com</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4 group">
                                    <div className="p-3 bg-blue-50 rounded-xl text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                        <Clock className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">{t('appointment.opd_hours')}</p>
                                        <p className="text-sm font-bold text-blue-900">Sunday - Friday</p>
                                        <p className="text-sm font-medium text-gray-500">8:00 AM - 5:00 PM</p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                            className="bg-red-50 p-6 rounded-3xl border border-red-100"
                        >
                            <h4 className="font-bold text-gray-800 mb-2">{t('appointment.emergency_title')}</h4>
                            <p className="text-sm text-gray-600 mb-4">{t('appointment.emergency_desc')}</p>
                            <a href="tel:+977XXXXXXXX" className="flex items-center justify-center gap-2 w-full py-3 bg-white text-red-600 font-black uppercase tracking-wider rounded-xl shadow-sm hover:shadow-md transition-all">
                                <Phone className="w-4 h-4" /> {t('appointment.emergency_label')}
                            </a>
                        </motion.div>
                    </div>

                    {/* Appointment Form */}
                    <div className="lg:col-span-8">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden h-full flex flex-col"
                        >
                            {/* Stepper Header */}
                            <div className="bg-gray-50/50 px-8 py-6 border-b border-gray-100">
                                <div className="flex items-center justify-between max-w-md mx-auto">
                                    {/* Step 1 Indicator */}
                                    <div className="flex flex-col items-center gap-2 relative z-10">
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${step >= 1 ? 'bg-blue-900 text-white shadow-lg shadow-blue-900/20' : 'bg-gray-200 text-gray-500'}`}>
                                            {step > 1 ? <CheckCircle className="w-5 h-5" /> : "1"}
                                        </div>
                                        <span className={`text-xs font-bold uppercase tracking-wider ${step >= 1 ? 'text-blue-900' : 'text-gray-400'}`}>{t('appointment.form.doctor_step', {defaultValue: 'Doctor'})}</span>
                                    </div>

                                    {/* Connector Line */}
                                    <div className="flex-1 h-1 bg-gray-200 mx-4 rounded-full overflow-hidden">
                                        <motion.div
                                            className="h-full bg-blue-900"
                                            initial={{ width: "0%" }}
                                            animate={{ width: step === 2 ? "100%" : "0%" }}
                                            transition={{ duration: 0.5 }}
                                        />
                                    </div>

                                    {/* Step 2 Indicator */}
                                    <div className="flex flex-col items-center gap-2 relative z-10">
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${step >= 2 ? 'bg-blue-900 text-white shadow-lg shadow-blue-900/20' : 'bg-gray-200 text-gray-500'}`}>2</div>
                                        <span className={`text-xs font-bold uppercase tracking-wider ${step >= 2 ? 'text-blue-900' : 'text-gray-400'}`}>{t('appointment.form.details_step', {defaultValue: 'Details'})}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="p-8 lg:p-10 flex-1">
                                <form onSubmit={handleSubmit} className="space-y-8">
                                    {step === 1 && (
                                        <motion.div
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: 20 }}
                                            className="space-y-6"
                                        >
                                            <div className="space-y-2">
                                                <h3 className="text-lg font-black text-blue-900 uppercase tracking-tight">{t('appointment.step1_title')}</h3>
                                                <p className="text-sm text-gray-500">{t('appointment.step1_desc')}</p>
                                            </div>

                                            <div className="space-y-8">
                                                <div className="space-y-2">
                                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">{t('appointment.department')} *</label>
                                                    <select
                                                        name="department"
                                                        value={formData.department}
                                                        onChange={(e) => setFormData(prev => ({ ...prev, department: e.target.value, doctor: 'Any Available Doctor' }))}
                                                        className="w-full px-4 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-900 focus:ring-2 focus:ring-blue-900/20 transition-all text-sm font-medium appearance-none"
                                                        style={selectIndicatorStyle}
                                                    >
                                                        <option>Cardiology</option>
                                                        <option>Neurology</option>
                                                        <option>Orthopedics</option>
                                                        <option>Pediatrics</option>
                                                        <option>General Medicine</option>
                                                        <option>Gynecology</option>
                                                        <option>Dermatology</option>
                                                        <option>ENT</option>
                                                    </select>
                                                </div>

                                                <div className="space-y-2">
                                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">{t('appointment.specialist')}</label>
                                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                        <div
                                                            onClick={() => setFormData(prev => ({ ...prev, doctor: 'Any Available Doctor' }))}
                                                            className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex items-center gap-4 group ${formData.doctor === 'Any Available Doctor' ? 'border-blue-900 bg-blue-50/50 shadow-sm' : 'border-gray-100 hover:border-blue-200 hover:bg-gray-50'}`}
                                                        >
                                                            <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors shrink-0 ${formData.doctor === 'Any Available Doctor' ? 'bg-blue-200 text-blue-900' : 'bg-gray-100 text-gray-500 group-hover:bg-white'}`}>
                                                                <Stethoscope className="w-6 h-6" />
                                                            </div>
                                                            <div>
                                                                <h4 className={`font-bold text-sm ${formData.doctor === 'Any Available Doctor' ? 'text-blue-900' : 'text-gray-700'}`}>{t('appointment.any_doctor')}</h4>
                                                                <p className="text-xs text-gray-500">{t('appointment.earliest_slot')}</p>
                                                            </div>
                                                            {formData.doctor === 'Any Available Doctor' && <CheckCircle className="w-5 h-5 text-blue-900 ml-auto" />}
                                                        </div>

                                                        {DOCTORS_DATA.filter(doc => doc.specialty === formData.department).map(doc => (
                                                            <div
                                                                key={doc.name}
                                                                onClick={() => setFormData(prev => ({ ...prev, doctor: doc.name }))}
                                                                className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex items-center gap-4 group ${formData.doctor === doc.name ? 'border-blue-900 bg-blue-50/50 shadow-sm' : 'border-gray-100 hover:border-blue-200 hover:bg-gray-50'}`}
                                                            >
                                                                <img
                                                                    src={doc.image}
                                                                    alt={doc.name}
                                                                    className="w-12 h-12 rounded-full object-cover border border-gray-200 shrink-0"
                                                                />
                                                                <div>
                                                                    <h4 className={`font-bold text-sm ${formData.doctor === doc.name ? 'text-blue-900' : 'text-gray-700'}`}>{doc.name}</h4>
                                                                    <p className="text-xs text-gray-500">{doc.specialty}</p>
                                                                </div>
                                                                {formData.doctor === doc.name && <CheckCircle className="w-5 h-5 text-blue-900 ml-auto" />}
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="pt-4">
                                                <Button
                                                    type="button"
                                                    onClick={() => setStep(2)}
                                                    className="w-full py-4 bg-blue-900 text-white rounded-xl font-bold shadow-lg shadow-blue-900/20 hover:shadow-blue-900/30 transition-all hover:-translate-y-1 flex items-center justify-center gap-2"
                                                >
                                                    {t('appointment.next_details')} <ArrowRight className="w-5 h-5" />
                                                </Button>
                                            </div>
                                        </motion.div>
                                    )}

                                    {step === 2 && (
                                        <div className="space-y-8">
                                            <div className="rounded-[28px] border border-blue-100 bg-gradient-to-br from-blue-50 to-white p-6">
                                                <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1.5fr)_minmax(320px,0.9fr)] xl:items-start">
                                                    <div className="min-w-0">
                                                        <p className="text-[11px] font-black uppercase tracking-[0.24em] text-blue-900/55">Doctor Appointment</p>
                                                        <h3 className="mt-2 text-2xl font-black tracking-tight text-blue-950">Patient Details</h3>
                                                        <p className="mt-2 max-w-2xl text-sm text-slate-600">Complete the patient information before confirming the appointment request.</p>
                                                    </div>
                                                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:self-start">
                                                        <div className="min-w-0 rounded-2xl bg-white px-4 py-3 shadow-sm ring-1 ring-blue-100">
                                                            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">Department</p>
                                                            <p className="mt-1 break-words text-sm font-bold text-slate-900">{formData.department}</p>
                                                        </div>
                                                        <div className="min-w-0 rounded-2xl bg-white px-4 py-3 shadow-sm ring-1 ring-blue-100">
                                                            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">Doctor</p>
                                                            <p className="mt-1 break-words text-sm font-bold text-slate-900">{formData.doctor}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="space-y-8">
                                                <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                                                    <div className="space-y-2">
                                                        <label className="text-xs font-bold uppercase tracking-widest text-slate-700">Patient Name *</label>
                                                        <input type="text" name="firstName" value={formData.firstName} onChange={handleInputChange} placeholder="First Name" className={`w-full rounded-xl border bg-slate-50 px-4 py-3 text-sm font-medium ${errors.firstName ? 'border-red-500' : 'border-slate-200'} focus:outline-none focus:border-blue-900 focus:ring-2 focus:ring-blue-900/20`} />
                                                        {errors.firstName && <p className="text-xs text-red-500">{errors.firstName}</p>}
                                                    </div>
                                                    <div className="space-y-2">
                                                        <label className="text-xs font-bold uppercase tracking-widest text-slate-700 opacity-0">Middle Name</label>
                                                        <input type="text" name="middleName" value={formData.middleName} onChange={handleInputChange} placeholder="Middle Name" className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium focus:outline-none focus:border-blue-900 focus:ring-2 focus:ring-blue-900/20" />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <label className="text-xs font-bold uppercase tracking-widest text-slate-700 opacity-0">Last Name</label>
                                                        <input type="text" name="lastName" value={formData.lastName} onChange={handleInputChange} placeholder="Last Name" className={`w-full rounded-xl border bg-slate-50 px-4 py-3 text-sm font-medium ${errors.lastName ? 'border-red-500' : 'border-slate-200'} focus:outline-none focus:border-blue-900 focus:ring-2 focus:ring-blue-900/20`} />
                                                        {errors.lastName && <p className="text-xs text-red-500">{errors.lastName}</p>}
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-1 gap-4 xl:grid-cols-6">
                                                    <div className="space-y-2 xl:col-span-2">
                                                        <label className="text-xs font-bold uppercase tracking-widest text-slate-700">DOB (BS) *</label>
                                                        <NepaliDatePicker
                                                            value={dobDateBS}
                                                            onChange={(value: string) => setDobDateBS(value)}
                                                            options={{ calenderLocale: pickerLocale, valueLocale: pickerLocale }}
                                                            inputClassName={`w-full rounded-xl border bg-slate-50 px-4 py-3 text-sm font-medium ${errors.age ? 'border-red-500' : 'border-slate-200'} focus:outline-none focus:border-blue-900 focus:ring-2 focus:ring-blue-900/20`}
                                                        />
                                                        {errors.age && <p className="text-xs text-red-500">{errors.age}</p>}
                                                    </div>
                                                    <div className="space-y-2 xl:col-span-2">
                                                        <label className="text-xs font-bold uppercase tracking-widest text-slate-700">Age</label>
                                                        <div className="w-full rounded-xl border border-slate-200 bg-slate-100 px-4 py-3 text-sm font-semibold text-slate-700">
                                                            {derivedAge || 'Auto-calculated from DOB'}
                                                        </div>
                                                    </div>
                                                    <div className="space-y-2 xl:col-span-2">
                                                        <label className="text-xs font-bold uppercase tracking-widest text-slate-700">Gender *</label>
                                                        <select name="gender" value={formData.gender} onChange={handleInputChange} className={`w-full rounded-xl border bg-slate-50 px-4 pr-12 py-3 text-sm font-medium appearance-none ${errors.gender ? 'border-red-500' : 'border-slate-200'} focus:outline-none focus:border-blue-900 focus:ring-2 focus:ring-blue-900/20`} style={selectIndicatorStyle}>
                                                            <option disabled>Select Gender</option>
                                                            <option>Male</option>
                                                            <option>Female</option>
                                                            <option>Other</option>
                                                        </select>
                                                        {errors.gender && <p className="text-xs text-red-500">{errors.gender}</p>}
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                                                    <div className="space-y-2">
                                                        <label className="text-xs font-bold uppercase tracking-widest text-slate-700">Religion</label>
                                                        <input type="text" name="religion" value={formData.religion} onChange={handleInputChange} placeholder="Religion" className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium focus:outline-none focus:border-blue-900 focus:ring-2 focus:ring-blue-900/20" />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <label className="text-xs font-bold uppercase tracking-widest text-slate-700">Ethnic Group *</label>
                                                        <select name="ethnicGroup" value={formData.ethnicGroup} onChange={(e) => setFormData(prev => ({ ...prev, ethnicGroup: e.target.value, caste: '' }))} className={`w-full rounded-xl border bg-slate-50 px-4 pr-12 py-3 text-sm font-medium appearance-none ${errors.ethnicGroup ? 'border-red-500' : 'border-slate-200'} focus:outline-none focus:border-blue-900 focus:ring-2 focus:ring-blue-900/20`} style={selectIndicatorStyle}>
                                                            <option value="" disabled>Select Ethnic Group</option>
                                                            {ETHNIC_GROUPS.map(group => <option key={group} value={group}>{group}</option>)}
                                                        </select>
                                                        {errors.ethnicGroup && <p className="text-xs text-red-500">{errors.ethnicGroup}</p>}
                                                    </div>
                                                    <div className="space-y-2">
                                                        <label className="text-xs font-bold uppercase tracking-widest text-slate-700">Caste *</label>
                                                        <select name="caste" value={formData.caste} onChange={handleInputChange} className={`w-full rounded-xl border bg-slate-50 px-4 pr-12 py-3 text-sm font-medium appearance-none ${errors.caste ? 'border-red-500' : 'border-slate-200'} focus:outline-none focus:border-blue-900 focus:ring-2 focus:ring-blue-900/20`} style={selectIndicatorStyle} disabled={!formData.ethnicGroup}>
                                                            <option value="" disabled>{formData.ethnicGroup ? 'Select Caste' : 'Select ethnic group first'}</option>
                                                            {availableCastes.map(caste => <option key={caste} value={caste}>{caste}</option>)}
                                                            <option value="Other">Other</option>
                                                        </select>
                                                        {errors.caste && <p className="text-xs text-red-500">{errors.caste}</p>}
                                                    </div>
                                                </div>

                                                <div className="space-y-4">
                                                    <label className="text-xs font-bold uppercase tracking-widest text-slate-700">Address</label>
                                                    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                                                        <select name="country" value={formData.country} onChange={handleInputChange} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 pr-12 py-3 text-sm font-medium appearance-none focus:outline-none focus:border-blue-900 focus:ring-2 focus:ring-blue-900/20" style={selectIndicatorStyle}>
                                                            <option>Nepal</option>
                                                            <option>India</option>
                                                            <option>Bangladesh</option>
                                                            <option>USA</option>
                                                            <option>UK</option>
                                                            <option>Australia</option>
                                                            <option>Canada</option>
                                                            <option>Other</option>
                                                        </select>
                                                        <div className="space-y-2">
                                                            <select name="province" value={formData.province} onChange={(e) => setFormData(prev => ({ ...prev, province: e.target.value, district: '' }))} className={`w-full rounded-xl border bg-slate-50 px-4 pr-12 py-3 text-sm font-medium appearance-none ${errors.province ? 'border-red-500' : 'border-slate-200'} focus:outline-none focus:border-blue-900 focus:ring-2 focus:ring-blue-900/20`} style={selectIndicatorStyle} disabled={formData.country !== 'Nepal'}>
                                                                <option value="Select Province" disabled>Select Province</option>
                                                                {PROVINCES.map(province => <option key={province} value={province}>{province}</option>)}
                                                            </select>
                                                            {errors.province && formData.country === 'Nepal' && <p className="text-xs text-red-500">{errors.province}</p>}
                                                        </div>
                                                        <div className="space-y-2">
                                                            {formData.country === 'Nepal' ? (
                                                                <select name="district" value={formData.district} onChange={handleInputChange} className={`w-full rounded-xl border bg-slate-50 px-4 pr-12 py-3 text-sm font-medium appearance-none ${errors.district ? 'border-red-500' : 'border-slate-200'} focus:outline-none focus:border-blue-900 focus:ring-2 focus:ring-blue-900/20`} style={selectIndicatorStyle} disabled={formData.province === 'Select Province'}>
                                                                    <option value="" disabled>{formData.province === 'Select Province' ? 'Select province first' : 'Select District'}</option>
                                                                    {availableDistricts.map(district => <option key={district} value={district}>{district}</option>)}
                                                                </select>
                                                            ) : (
                                                                <input type="text" name="district" value={formData.district} onChange={handleInputChange} placeholder="District / State" className={`w-full rounded-xl border bg-slate-50 px-4 py-3 text-sm font-medium ${errors.district ? 'border-red-500' : 'border-slate-200'} focus:outline-none focus:border-blue-900 focus:ring-2 focus:ring-blue-900/20`} />
                                                            )}
                                                            {errors.district && <p className="text-xs text-red-500">{errors.district}</p>}
                                                        </div>
                                                    </div>

                                                    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                                                        <select name="municipalityType" value={formData.municipalityType} onChange={handleInputChange} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 pr-12 py-3 text-sm font-medium appearance-none focus:outline-none focus:border-blue-900 focus:ring-2 focus:ring-blue-900/20" style={selectIndicatorStyle} disabled={formData.country !== 'Nepal'}>
                                                            {MUNICIPALITY_TYPES.map(type => <option key={type} value={type}>{type}</option>)}
                                                        </select>
                                                        <div className="space-y-2">
                                                            <input type="text" name="ward" value={formData.ward} onChange={handleInputChange} placeholder="Ward No." className={`w-full rounded-xl border bg-slate-50 px-4 py-3 text-sm font-medium ${errors.ward ? 'border-red-500' : 'border-slate-200'} focus:outline-none focus:border-blue-900 focus:ring-2 focus:ring-blue-900/20`} />
                                                            {errors.ward && <p className="text-xs text-red-500">{errors.ward}</p>}
                                                        </div>
                                                        <div className="space-y-2">
                                                            {formData.country === 'Nepal' ? (
                                                                <select name="villageTole" value={formData.villageTole} onChange={handleInputChange} className={`w-full rounded-xl border bg-slate-50 px-4 pr-12 py-3 text-sm font-medium appearance-none ${errors.villageTole ? 'border-red-500' : 'border-slate-200'} focus:outline-none focus:border-blue-900 focus:ring-2 focus:ring-blue-900/20`} style={selectIndicatorStyle}>
                                                                    <option value="" disabled>Select Village / Tole</option>
                                                                    {COMMON_VILLAGES.map(village => <option key={village} value={village}>{village}</option>)}
                                                                </select>
                                                            ) : (
                                                                <input type="text" name="address" value={formData.address} onChange={handleInputChange} placeholder="Address" className={`w-full rounded-xl border bg-slate-50 px-4 py-3 text-sm font-medium ${errors.address ? 'border-red-500' : 'border-slate-200'} focus:outline-none focus:border-blue-900 focus:ring-2 focus:ring-blue-900/20`} />
                                                            )}
                                                            {errors.villageTole && formData.country === 'Nepal' && <p className="text-xs text-red-500">{errors.villageTole}</p>}
                                                            {errors.address && formData.country !== 'Nepal' && <p className="text-xs text-red-500">{errors.address}</p>}
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                                                    <div className="space-y-2">
                                                        <label className="text-xs font-bold uppercase tracking-widest text-slate-700">Phone No.</label>
                                                        <input type="tel" name="phoneNumber" value={formData.phoneNumber} onChange={handleInputChange} placeholder="Phone Number" className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium focus:outline-none focus:border-blue-900 focus:ring-2 focus:ring-blue-900/20" />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <label className="text-xs font-bold uppercase tracking-widest text-slate-700">Mobile No. *</label>
                                                        <input type="tel" name="mobileNumber" value={formData.mobileNumber} onChange={handleInputChange} placeholder="Mobile Number" className={`w-full rounded-xl border bg-slate-50 px-4 py-3 text-sm font-medium ${errors.mobileNumber ? 'border-red-500' : 'border-slate-200'} focus:outline-none focus:border-blue-900 focus:ring-2 focus:ring-blue-900/20`} />
                                                        {errors.mobileNumber && <p className="text-xs text-red-500">{errors.mobileNumber}</p>}
                                                    </div>
                                                    <div className="space-y-2">
                                                        <label className="text-xs font-bold uppercase tracking-widest text-slate-700">Email</label>
                                                        <input type="email" name="email" value={formData.email} onChange={handleInputChange} placeholder="Email" className={`w-full rounded-xl border bg-slate-50 px-4 py-3 text-sm font-medium ${errors.email ? 'border-red-500' : 'border-slate-200'} focus:outline-none focus:border-blue-900 focus:ring-2 focus:ring-blue-900/20`} />
                                                        {errors.email && <p className="text-xs text-red-500">{errors.email}</p>}
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.2fr_1fr]">
                                                    <div className="space-y-4">
                                                        <label className="text-xs font-bold uppercase tracking-widest text-slate-700">Preferred Shift *</label>
                                                        <select name="shift" value={formData.shift} onChange={handleInputChange} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 pr-12 py-3 text-sm font-medium appearance-none focus:outline-none focus:border-blue-900 focus:ring-2 focus:ring-blue-900/20" style={selectIndicatorStyle}>
                                                            <option>Morning (8:00 AM - 12:00 PM)</option>
                                                            <option>Afternoon (12:00 PM - 4:00 PM)</option>
                                                            <option>Evening (4:00 PM - 7:00 PM)</option>
                                                        </select>
                                                    </div>
                                                    <div className="flex items-end">
                                                        <button type="button" className="w-full rounded-2xl border border-blue-200 bg-blue-50 px-5 py-3 text-sm font-bold uppercase tracking-wide text-blue-900 transition-colors hover:bg-blue-100">
                                                            See Doctor Weekly Schedule
                                                        </button>
                                                    </div>
                                                </div>

                                                <div className="space-y-4 border-t border-slate-200 pt-6">
                                                    <label className="text-xs font-bold uppercase tracking-widest text-slate-700">Preferred Appointment Date *</label>
                                                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                                        <div className="space-y-2">
                                                            <span className="text-[10px] font-black uppercase tracking-[0.18em] text-blue-900/45">Nepali Calendar (BS)</span>
                                                            <NepaliDatePicker value={appointmentDateBS} onChange={(value: string) => setAppointmentDateBS(value)} options={{ calenderLocale: pickerLocale, valueLocale: pickerLocale }} inputClassName="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium focus:outline-none focus:border-blue-900 focus:ring-2 focus:ring-blue-900/20" />
                                                        </div>
                                                        <div className="space-y-2">
                                                            <span className="text-[10px] font-black uppercase tracking-[0.18em] text-blue-900/45">English Calendar (AD)</span>
                                                            <NepaliDatePicker value={appointmentDateAD} onChange={(value: string) => setAppointmentDateAD(value)} options={{ calenderLocale: pickerLocale, valueLocale: pickerLocale }} inputClassName="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium focus:outline-none focus:border-blue-900 focus:ring-2 focus:ring-blue-900/20" />
                                                        </div>
                                                    </div>
                                                    {errors.appointmentDates && <p className="text-xs text-red-500">{errors.appointmentDates}</p>}
                                                </div>

                                                <div className="space-y-4 border-t border-slate-200 pt-6">
                                                    <label className="text-xs font-bold uppercase tracking-widest text-slate-700">Are you suffering from any disease (ICD-11)?</label>
                                                    <div className="grid grid-cols-1 gap-4 xl:grid-cols-4">
                                                        <select name="diseaseStatus" value={formData.diseaseStatus} onChange={handleInputChange} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 pr-12 py-3 text-sm font-medium appearance-none focus:outline-none focus:border-blue-900 focus:ring-2 focus:ring-blue-900/20" style={selectIndicatorStyle}>
                                                            <option value="">Select Status</option>
                                                            <option value="No">No</option>
                                                            <option value="Yes">Yes</option>
                                                            <option value="Not Sure">Not Sure</option>
                                                        </select>
                                                        <input list="icd11-diseases" name="existingCondition" value={formData.existingCondition} onChange={handleInputChange} placeholder="Select / Type Disease" className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium focus:outline-none focus:border-blue-900 focus:ring-2 focus:ring-blue-900/20" />
                                                        <select name="diseaseDuration" value={formData.diseaseDuration} onChange={handleInputChange} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 pr-12 py-3 text-sm font-medium appearance-none focus:outline-none focus:border-blue-900 focus:ring-2 focus:ring-blue-900/20" style={selectIndicatorStyle}>
                                                            <option value="">Duration</option>
                                                            <option value="< 1 week">Less than 1 week</option>
                                                            <option value="1-4 weeks">1 to 4 weeks</option>
                                                            <option value="1-6 months">1 to 6 months</option>
                                                            <option value="> 6 months">More than 6 months</option>
                                                        </select>
                                                        <input type="text" name="diseaseNote" value={formData.diseaseNote} onChange={handleInputChange} placeholder="Type here..." className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium focus:outline-none focus:border-blue-900 focus:ring-2 focus:ring-blue-900/20" />
                                                    </div>
                                                    <datalist id="icd11-diseases">
                                                        {ICD11_COMMON_DISEASES.map((disease) => (
                                                            <option key={disease} value={disease} />
                                                        ))}
                                                    </datalist>
                                                </div>

                                                <div className="space-y-3">
                                                    <label className="text-xs font-bold uppercase tracking-widest text-slate-700">Reason for Visit / Complaint</label>
                                                    <textarea name="message" value={formData.message} onChange={handleInputChange} rows={5} placeholder="Briefly describe the complaint, symptoms, or reason for this visit..." className="w-full rounded-[22px] border border-slate-200 bg-slate-50 px-5 py-4 text-sm font-medium resize-none focus:outline-none focus:border-blue-900 focus:ring-2 focus:ring-blue-900/20" />
                                                </div>

                                                <div className="flex flex-col gap-4 border-t border-slate-200 pt-6 sm:flex-row">
                                                    <Button type="button" variant="outline" onClick={() => setStep(1)} className="sm:flex-1 py-4 rounded-xl font-bold flex items-center justify-center gap-2">
                                                        <ArrowLeft className="w-5 h-5" /> Previous Step
                                                    </Button>
                                                    <Button type="submit" className="sm:flex-[1.4] py-4 rounded-xl font-bold">
                                                        Confirm Appointment Request
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </form>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DoctorAppointment;

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
    Clock, Phone, Mail,
    ArrowLeft, ArrowRight, CheckCircle, AlertCircle,
    Stethoscope, Plus, Trash2
} from 'lucide-react';
import Button from './Button';
import { postData } from '../lib/api';
import NepaliDatePickerCustom from './NepaliDatePickerCustom';
import EnglishDatePicker from './EnglishDatePicker';
import DoctorScheduleModal from './DoctorScheduleModal';
import BikramSambat from 'bikram-sambat-js';
import { PROVINCES, DISTRICTS_BY_PROVINCE, GET_MUNICIPALITIES, CASTE_GROUPS, CASTES_BY_GROUP, NATIONALITIES, RELIGIONS } from '../constants/nepalData';
// import 'nepali-datepicker-reactjs/dist/index.css';

const ETHNIC_GROUPS = CASTE_GROUPS;

const getAgeFromDobBs = (dobBs: string) => {
    if (!dobBs || dobBs.length < 10) return '';

    try {
        const bs = new BikramSambat(dobBs, 'BS');
        const adDate = new Date(bs.toAD());
        const today = new Date();

        let years = today.getFullYear() - adDate.getFullYear();
        let months = today.getMonth() - adDate.getMonth();
        let days = today.getDate() - adDate.getDate();

        if (days < 0) {
            months -= 1;
            const previousMonth = new Date(today.getFullYear(), today.getMonth(), 0);
            days += previousMonth.getDate();
        }

        if (months < 0) {
            years -= 1;
            months += 12;
        }

        if (years < 0) return '0y 0m 0d';
        return `${years}y ${months}m ${days}d`;
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
    { name: 'Dr. Suman Bhusal', specialty: 'Radio Imaging', image: 'https://images.unsplash.com/photo-1559839734-2b71f1536783?auto=format&fit=crop&q=80&w=1470' },
];

const ICD11_COMMON_DISEASES = [
    // --- 01 Infectious or parasitic diseases ---
    "1A00 Cholera", "1A01 Typhoid fever", "1B10 Tuberculosis", "1B11 Silicotuberculosis", "1D01 Influenza", "1D00 Seasonal influenza, virus identified", "1F01 Dengue fever", "1F02 Zika virus disease", "1C10 HIV disease", "1A20 Amoebiasis", "1A22 Giardiasis", "1E30 Herpes simplex infections", "1E31 Varicella", "1E32 Zoster", "1F00 Yellow fever", "XR28 COVID-19", "1D0Z Respiratory infection, unspecified", "1A40 Bacterial intestinal infection", "1G40 Sepsis",

    // --- 02 Neoplasms ---
    "2C61 Malignant neoplasms of breast", "2C25 Malignant neoplasms of bronchus or lung", "2D50 Malignant neoplasms of colon", "2D10 Malignant neoplasms of stomach", "2C91 Malignant neoplasms of prostate", "2C70 Malignant neoplasms of ovary", "2E60 Malignant melanoma of skin", "2A00 Malignant neoplasm of lip", "2D14 Malignant neoplasm of pancreas", "2C30 Malignant neoplasm of thymus", "2B50 Malignant neoplasm of thyroid gland", "3A70 Leukaemia", "3B00 Lymphoma",

    // --- 03 Diseases of the blood or blood-forming organs ---
    "3A00 Iron deficiency anaemia", "3A01 Vitamin B12 deficiency anaemia", "3A02 Folate deficiency anaemia", "3A05 Haemolytic anaemia", "3A50 Aplastic anaemia", "3B20 Haemophilia", "3B24 Von Willebrand disease",

    // --- 05 Endocrine, nutritional or metabolic diseases ---
    "5A10 Type 1 diabetes mellitus", "5A11 Type 2 diabetes mellitus", "5A80 Hypothyroidism", "5A02 Hyperthyroidism", "5A13 Gestational diabetes mellitus", "5B50 Obesity", "5B51 Overweight", "5B80 Vitamin D deficiency", "5B81 Vitamin A deficiency", "5C50 Hypercholesterolaemia", "5C51 Hypertriglyceridaemia", "5C52 Mixed hyperlipidaemia", "5A00 Goitre",

    // --- 06 Mental, behavioural or neurodevelopmental disorders ---
    "6A70 Single episode depressive disorder", "6A71 Recurrent depressive disorder", "6A40 Generalized anxiety disorder", "6A41 Panic disorder", "6A43 Social anxiety disorder", "6A20 Schizophrenia", "6C40 Alcohol use disorder", "6C41 Cannabis use disorder", "6C44 Opioid use disorder", "6A02 Autism spectrum disorder", "6A05 Attention deficit hyperactivity disorder", "6B00 Obsessive-compulsive disorder", "6B40 Post traumatic stress disorder", "6B60 Dissociative identity disorder", "6D70 Dementia",

    // --- 08 Diseases of the nervous system ---
    "8A80 Epilepsy", "8A00 Alzheimer disease", "8A01 Vascular dementia", "8A02 Dementia with Lewy bodies", "8B00 Stroke", "8B01 Ischaemic stroke", "8B02 Haemorrhagic stroke", "8C00 Multiple sclerosis", "8C40 Parkinson disease", "ME01 Migraine", "8D42 Tension-type headache", "8A40 Meningitis", "8A41 Encephalitis", "8B20 Transient ischaemic attack",

    // --- 09 Diseases of the visual system ---
    "9A10 Cataract", "9C61 Glaucoma", "9C80 Macular degeneration", "9A60 Conjunctivitis", "9D40 Myopia", "9D41 Hypermetropia", "9D42 Astigmatism",

    // --- 11 Diseases of the circulatory system ---
    "BA00 Essential hypertension", "BA01 Hypertensive heart disease", "BA40 Ischaemic heart disease", "BA41 Myocardial infarction", "BA42 Heart failure", "BA60 Atrial fibrillation", "BA80 Angina pectoris", "BC40 Valvular heart disease", "BD50 Varicose veins", "BD71 Deep vein thrombosis", "BC80 Myocarditis", "BC81 Pericarditis", "BD10 Atherosclerosis",

    // --- 12 Diseases of the respiratory system ---
    "CA20 Pneumonia", "CA23 Asthma", "CB00 Chronic obstructive pulmonary disease (COPD)", "CB01 Bronchitis", "CB02 Emphysema", "CA00 Acute upper respiratory infection", "CA01 Acute nasopharyngitis (common cold)", "CA02 Acute sinusitis", "CA03 Acute pharyngitis", "CA05 Acute laryngitis", "CA40 Pleural effusion", "CA60 Pulmonary oedema",

    // --- 13 Diseases of the digestive system ---
    "DA93 Gastritis", "DA94 Duodenitis", "DA90 Gastro-oesophageal reflux disease (GERD)", "DA92 Peptic ulcer", "DB10 Appendicitis", "DB30 Inguinal hernia", "DB90 Crohn disease", "DB91 Ulcerative colitis", "DB94 Irritable bowel syndrome", "DC30 Cirrhosis of liver", "DC31 Alcoholic liver disease", "DC10 Fatty liver disease", "DC50 Cholelithiasis (Gallstones)", "DC51 Cholecystitis", "DB50 Haemorrhoids",

    // --- 14 Diseases of the skin ---
    "EB90 Eczema / Atopic dermatitis", "ED90 Psoriasis", "EE10 Urticaria", "EF00 Acne", "EF02 Rosacea", "EK10 Cellulitis", "EK70 Impetigo", "EK12 Abscess", "EE40 Contact dermatitis", "EH60 Alopecia areata",

    // --- 15 Diseases of the musculoskeletal system ---
    "FB32 Osteoarthritis", "FA01 Rheumatoid arthritis", "FB80 Osteoporosis", "NC72 Low back pain", "FB70 Gout", "FA80 Ankylosing spondylitis", "FB50 Fibromyalgia", "FB54 Tendinitis", "FB55 Bursitis", "FC00 Osteomyelitis",

    // --- 16 Diseases of the genitourinary system ---
    "GC08 Urinary tract infection", "GB04 Chronic kidney disease", "GB00 Acute kidney failure", "GB70 Nephrolithiasis (Kidney stones)", "GB71 Cystitis", "GB90 Benign prostatic hyperplasia", "GA00 Endometriosis", "GA10 Polycystic ovary syndrome", "GA30 Uterine fibroids", "GC00 Pelvic inflammatory disease",

    // --- 17 Conditions related to sexual health ---
    "HA00 Syphilis", "HA01 Gonococcal infection", "HA02 Chlamydial infection", "HA40 Sexual dysfunction",

    // --- 21 Symptoms, signs or clinical findings ---
    "MG30 Pain, not elsewhere classified", "MG20 Fatigue", "MD10 Fever", "MC80 Cough", "MD30 Oedema", "ME00 Headache", "MA00 Nausea and vomiting"
];

const DoctorAppointment = () => {
    const { t } = useTranslation();
    const [formData, setFormData] = useState({
        firstName: '',
        middleName: '',
        lastName: '',
        dobBs: '',
        gender: 'Select Gender',
        religion: '',
        ethnicGroup: '',
        caste: '',
        casteOther: '',
        nationality: 'Nepali',
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
        municipality: '',
        ward: '',
        villageTole: '',
        age: '',
        ageYears: '',
        ageMonths: '',
        ageDays: '',
        diseases: [] as { condition: string; duration: string; note: string }[],
        currentDisease: { condition: '', duration: '', note: '' },
        diseaseStatus: 'No',
        message: '',
    });
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [appointmentDate, setAppointmentDate] = useState<string>('');
    const [dobDateBS, setDobDateBS] = useState('');
    const [appointmentDateBS, setAppointmentDateBS] = useState('');
    const [appointmentDateAD, setAppointmentDateAD] = useState('');
    const [dobDateAD, setDobDateAD] = useState('');
    const [dobCalendarMode, setDobCalendarMode] = useState<'BS' | 'AD'>('BS');
    const [step, setStep] = useState(1);
    const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleDiseaseChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            currentDisease: { ...prev.currentDisease, [name]: value }
        }));
    };

    const addDisease = () => {
        if (formData.currentDisease.condition.trim()) {
            setFormData(prev => ({
                ...prev,
                diseases: [...prev.diseases, { ...prev.currentDisease }],
                currentDisease: { condition: '', duration: '', note: '' }
            }));
        }
    };

    const removeDisease = (index: number) => {
        setFormData(prev => ({
            ...prev,
            diseases: prev.diseases.filter((_, i) => i !== index)
        }));
    };

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    // ── Bidirectional DOB ↔ Age Sync ──────────────────────────────────
    // Source tracks WHO initiated the change to prevent infinite loops.
    // Flow: BS date is the "source of truth" for age calculation.
    //   AD picker → converts to BS → BS effect calculates age + skips AD re-sync
    //   BS picker → BS effect calculates age + syncs AD
    //   Age input → calculates BS → BS effect skips age re-calc + syncs AD
    const dobSyncSource = useRef<'BS' | 'AD' | 'AGE' | null>(null);

    // Effect: When BS date changes → ALWAYS calculate age, sync AD conditionally
    useEffect(() => {
        if (!dobDateBS || dobDateBS.length < 10) {
            // If cleared, also clear age and AD
            if (!dobDateBS) {
                setFormData(prev => ({ ...prev, ageYears: '', ageMonths: '', ageDays: '', dobBs: '' }));
                setDobDateAD('');
            }
            return;
        }

        const source = dobSyncSource.current;

        try {
            // STEP 1: Always calculate age from BS (unless the age input triggered this)
            if (source !== 'AGE') {
                const ageResult = getAgeFromDobBs(dobDateBS);
                if (ageResult) {
                    const yrs = ageResult.split('y')[0].trim();
                    const mths = ageResult.split('y')[1].split('m')[0].trim();
                    const days = ageResult.split('m')[1].split('d')[0].trim();
                    setFormData(prev => ({
                        ...prev,
                        ageYears: yrs,
                        ageMonths: mths,
                        ageDays: days
                    }));
                }
            }

            // STEP 2: Sync AD date (skip only if AD was the original source, to prevent loop)
            if (source !== 'AD') {
                const adDate = new BikramSambat(dobDateBS, 'BS').toAD();
                const adStr = new Date(adDate).toISOString().split('T')[0];
                setDobDateAD(adStr);
            }
            setFormData(prev => ({ ...prev, dobBs: dobDateBS }));
        } catch (e) { /* invalid BS date, ignore */ }

        // Reset source after processing
        dobSyncSource.current = null;
    }, [dobDateBS]);

    // Effect: When AD date changes → convert to BS ONLY if user picked an AD date
    useEffect(() => {
        if (!dobDateAD) return;

        // Only act when user explicitly picked an AD date.
        // Skip cascaded updates (source is null after BS effect, or 'BS'/'AGE').
        if (dobSyncSource.current !== 'AD') return;

        try {
            const bsDate = new BikramSambat(dobDateAD, 'AD').toBS();
            // Source stays 'AD' so BS effect knows to skip AD re-sync but still calc age
            setDobDateBS(bsDate);
        } catch (e) { /* invalid AD date, ignore */ }
    }, [dobDateAD]);

    // Handler: User picks BS date
    const handleDobBSChange = (val: string) => {
        dobSyncSource.current = 'BS';
        setDobDateBS(val);
    };

    // Handler: User picks AD date
    const handleDobADChange = (val: string) => {
        dobSyncSource.current = 'AD';
        setDobDateAD(val);
    };

    // Handler: User types in Age fields
    const handleAgeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        // Update formData immediately
        const updatedYears = name === 'ageYears' ? value : formData.ageYears;
        const updatedMonths = name === 'ageMonths' ? value : formData.ageMonths;
        const updatedDays = name === 'ageDays' ? value : formData.ageDays;

        setFormData(prev => ({ ...prev, [name]: value }));

        // If all empty, clear DOB
        if (updatedYears === '' && updatedMonths === '' && updatedDays === '') {
            dobSyncSource.current = null;
            setDobDateBS('');
            setDobDateAD('');
            return;
        }

        const yrs = parseInt(updatedYears || '0');
        const mths = parseInt(updatedMonths || '0');
        const ddays = parseInt(updatedDays || '0');

        if (!isNaN(yrs) && yrs >= 0 && yrs < 150) {
            try {
                const todayBS = new BikramSambat(new Date(), 'AD').toBS();
                const [currY, currM, currD] = todayBS.split('-').map(Number);

                let bY = currY - yrs;
                let bM = currM - (isNaN(mths) ? 0 : mths);
                let bD = currD - (isNaN(ddays) ? 0 : ddays);

                while (bD <= 0) {
                    bM -= 1;
                    if (bM <= 0) {
                        bY -= 1;
                        bM += 12;
                    }
                    // Approx days in month for reverse calc
                    bD += 30; 
                }

                while (bM <= 0) {
                    bY -= 1;
                    bM += 12;
                }

                const newDobBS = `${bY}-${bM.toString().padStart(2, '0')}-${bD.toString().padStart(2, '0')}`;
                // Mark source as AGE so BS effect skips age re-calculation
                dobSyncSource.current = 'AGE';
                setDobDateBS(newDobBS);
            } catch (e) { /* ignore partial input */ }
        }
    };


    const apptSyncSource = useRef<'BS' | 'AD' | null>(null);
    useEffect(() => {
        if (!appointmentDateBS) return;
        if (apptSyncSource.current === 'AD') {
            apptSyncSource.current = null;
            return;
        }
        try {
            const bs = new BikramSambat(appointmentDateBS, 'BS');
            const adDate = bs.toAD();
            // Ensure YYYY-MM-DD format if library returns differently
            const formattedAD = new Date(adDate).toISOString().split('T')[0];
            apptSyncSource.current = 'BS';
            setAppointmentDateAD(formattedAD);
            setAppointmentDate(formattedAD);
        } catch (e) { /* ignore */ }
    }, [appointmentDateBS]);

    useEffect(() => {
        if (!appointmentDateAD) return;
        if (apptSyncSource.current === 'BS') {
            apptSyncSource.current = null;
            return;
        }
        try {
            const bsDate = new BikramSambat(appointmentDateAD, 'AD').toBS();
            apptSyncSource.current = 'AD';
            setAppointmentDateBS(bsDate);
            setAppointmentDate(appointmentDateAD);
        } catch (e) { /* ignore */ }
    }, [appointmentDateAD]);

    const handleSlotSelection = (date: string, shiftId: string, time: string) => {
        setAppointmentDateAD(date);
        setFormData(prev => ({
            ...prev,
            shift: `${shiftId} (${time})`
        }));
    };

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

    const availableDistricts = formData.province && formData.province !== 'Select Province'
        ? DISTRICTS_BY_PROVINCE[formData.province as keyof typeof DISTRICTS_BY_PROVINCE] ?? []
        : [];
    const availableMunicipalities = formData.district ? GET_MUNICIPALITIES(formData.district) : [];
    const combinedPatientName = [formData.firstName, formData.middleName, formData.lastName].filter(Boolean).join(' ').trim();
    const derivedAge = getAgeFromDobBs(dobDateBS || formData.dobBs);

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
            if (!formData.municipality) newErrors.municipality = "Municipality is required.";
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
                            <a href="tel:103" className="flex items-center justify-center gap-2 w-full py-3 bg-white text-red-600 font-black uppercase tracking-wider rounded-xl shadow-sm hover:shadow-md transition-all">
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
                                                        <option>Radio Imaging</option>
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

                                                <div className="grid grid-cols-1 gap-6 md:grid-cols-12 items-end">
                                                    <div className="md:col-span-4 space-y-2">
                                                        <div className="flex items-center gap-2">
                                                            <label className="text-xs font-bold uppercase tracking-widest text-slate-700">DOB *</label>
                                                            <div className="flex rounded-md bg-slate-100 p-0.5">
                                                                <button 
                                                                    type="button"
                                                                    onClick={() => setDobCalendarMode('BS')}
                                                                    className={`px-2 py-0.5 text-[10px] font-bold uppercase rounded transition-all ${dobCalendarMode === 'BS' ? 'bg-white text-blue-900 shadow-sm' : 'text-slate-500'}`}
                                                                >NEP</button>
                                                                <button 
                                                                    type="button"
                                                                    onClick={() => setDobCalendarMode('AD')}
                                                                    className={`px-2 py-0.5 text-[10px] font-bold uppercase rounded transition-all ${dobCalendarMode === 'AD' ? 'bg-white text-blue-900 shadow-sm' : 'text-slate-500'}`}
                                                                >ENG</button>
                                                            </div>
                                                        </div>
                                                        {dobCalendarMode === 'BS' ? (
                                                            <NepaliDatePickerCustom
                                                                value={dobDateBS}
                                                                onChange={handleDobBSChange}
                                                                className={`w-full rounded-2xl border bg-slate-50 px-4 py-3.5 text-sm font-semibold text-blue-950 ${errors.age ? 'border-red-500' : 'border-slate-200'} focus:outline-none focus:border-blue-900 focus:ring-4 focus:ring-blue-900/10 transition-all`}
                                                            />
                                                        ) : (
                                                            <EnglishDatePicker 
                                                                value={dobDateAD}
                                                                onChange={handleDobADChange}
                                                                className={`w-full rounded-2xl border bg-slate-50 px-4 py-3.5 text-sm font-semibold text-blue-950 ${errors.age ? 'border-red-500' : 'border-slate-200'} focus:outline-none focus:border-blue-900 focus:ring-4 focus:ring-blue-900/10 transition-all`}
                                                            />
                                                        )}
                                                        {errors.age && <p className="text-xs text-red-500 font-bold">{errors.age}</p>}
                                                    </div>

                                                    <div className="md:col-span-8 space-y-3">
                                                        <label className="text-xs font-bold uppercase tracking-widest text-slate-700 block pl-1">Age (Yrs / Mths / Days)</label>
                                                        <div className="flex items-center gap-3">
                                                            {/* Year Input */}
                                                            <div className="relative group flex-1">
                                                                <input 
                                                                    type="number" 
                                                                    name="ageYears" 
                                                                    value={formData.ageYears} 
                                                                    onChange={handleAgeChange}
                                                                    placeholder="00"
                                                                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm font-semibold text-blue-950 focus:outline-none focus:border-blue-900 focus:ring-4 focus:ring-blue-900/10 transition-all placeholder:text-slate-300 text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                                                />
                                                                <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-[9px] font-black text-slate-400 uppercase tracking-widest">Years</span>
                                                            </div>

                                                            {/* Month Input */}
                                                            <div className="relative group flex-1">
                                                                <input 
                                                                    type="number" 
                                                                    name="ageMonths" 
                                                                    value={formData.ageMonths} 
                                                                    onChange={handleAgeChange}
                                                                    placeholder="00"
                                                                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm font-semibold text-blue-950 focus:outline-none focus:border-blue-900 focus:ring-4 focus:ring-blue-900/10 transition-all placeholder:text-slate-300 text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                                                />
                                                                <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-[9px] font-black text-slate-400 uppercase tracking-widest">Months</span>
                                                            </div>

                                                            {/* Day Input */}
                                                            <div className="relative group flex-1">
                                                                <input 
                                                                    type="number" 
                                                                    name="ageDays" 
                                                                    value={formData.ageDays} 
                                                                    onChange={handleAgeChange}
                                                                    placeholder="00"
                                                                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm font-semibold text-blue-950 focus:outline-none focus:border-blue-900 focus:ring-4 focus:ring-blue-900/10 transition-all placeholder:text-slate-300 text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                                                />
                                                                <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-[9px] font-black text-slate-400 uppercase tracking-widest">Days</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-1 gap-4 md:grid-cols-3 pt-6">
                                                    <div className="space-y-2">
                                                        <label className="text-xs font-bold uppercase tracking-widest text-slate-700">Gender *</label>
                                                        <select name="gender" value={formData.gender} onChange={handleInputChange} className={`w-full rounded-2xl border bg-slate-50 px-4 pr-12 py-3.5 text-sm font-semibold appearance-none ${errors.gender ? 'border-red-500' : 'border-slate-200'} focus:outline-none focus:border-blue-900 focus:ring-4 focus:ring-blue-900/10 transition-all`} style={selectIndicatorStyle}>
                                                            <option disabled>Select Gender</option>
                                                            <option>Male</option>
                                                            <option>Female</option>
                                                            <option>Other</option>
                                                        </select>
                                                        {errors.gender && <p className="text-xs text-red-500 font-bold">{errors.gender}</p>}
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                                                    <div className="space-y-2">
                                                        <label className="text-xs font-bold uppercase tracking-widest text-slate-700">Religion</label>
                                                        <select 
                                                            name="religion" 
                                                            value={formData.religion} 
                                                            onChange={handleInputChange} 
                                                            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 pr-12 py-3 text-sm font-medium appearance-none focus:outline-none focus:border-blue-900 focus:ring-2 focus:ring-blue-900/20"
                                                            style={selectIndicatorStyle}
                                                        >
                                                            <option value="">Select Religion</option>
                                                            {RELIGIONS.map(r => <option key={r} value={r}>{r}</option>)}
                                                        </select>
                                                    </div>
                                                    <div className="space-y-2">
                                                        <label className="text-xs font-bold uppercase tracking-widest text-slate-700">Nationality *</label>
                                                        <select 
                                                            name="nationality" 
                                                            value={formData.nationality} 
                                                            onChange={handleInputChange} 
                                                            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 pr-12 py-3 text-sm font-medium appearance-none focus:outline-none focus:border-blue-900 focus:ring-2 focus:ring-blue-900/20"
                                                            style={selectIndicatorStyle}
                                                        >
                                                            <option value="">Select Nationality</option>
                                                            {NATIONALITIES.map(n => <option key={n} value={n}>{n}</option>)}
                                                        </select>
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
                                                            {formData.ethnicGroup && CASTES_BY_GROUP[formData.ethnicGroup]?.map(caste => <option key={caste} value={caste}>{caste}</option>)}
                                                            <option value="Other">Other</option>
                                                        </select>
                                                        {errors.caste && <p className="text-xs text-red-500">{errors.caste}</p>}
                                                    </div>
                                                    {(formData.caste === 'Other' || formData.ethnicGroup === 'Others') && (
                                                        <div className="space-y-2">
                                                            <label className="text-xs font-bold uppercase tracking-widest text-slate-700">Specify Caste/Type *</label>
                                                            <input
                                                                type="text"
                                                                name="casteOther"
                                                                value={formData.casteOther}
                                                                onChange={handleInputChange}
                                                                placeholder="Type here..."
                                                                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium focus:outline-none focus:border-blue-900 focus:ring-2 focus:ring-blue-900/20"
                                                            />
                                                        </div>
                                                    )}
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
                                                                <select name="district" value={formData.district} onChange={(e) => setFormData(prev => ({ ...prev, district: e.target.value, municipality: '' }))} className={`w-full rounded-xl border bg-slate-50 px-4 pr-12 py-3 text-sm font-medium appearance-none ${errors.district ? 'border-red-500' : 'border-slate-200'} focus:outline-none focus:border-blue-900 focus:ring-2 focus:ring-blue-900/20`} style={selectIndicatorStyle} disabled={formData.province === 'Select Province'}>
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
                                                        <div className="space-y-2">
                                                            <select 
                                                                name="municipality" 
                                                                value={formData.municipality} 
                                                                onChange={handleInputChange} 
                                                                className={`w-full rounded-xl border bg-slate-50 px-4 pr-12 py-3 text-sm font-medium appearance-none focus:outline-none focus:border-blue-900 focus:ring-2 focus:ring-blue-900/20`} 
                                                                style={selectIndicatorStyle} 
                                                                disabled={!formData.district || formData.country !== 'Nepal'}
                                                            >
                                                                <option value="" disabled>{formData.district ? 'Select Municipality' : 'Select District first'}</option>
                                                                {availableMunicipalities.map(m => <option key={m} value={m}>{m}</option>)}
                                                            </select>
                                                            {errors.municipality && <p className="text-xs text-red-500">{errors.municipality}</p>}
                                                        </div>
                                                        <div className="space-y-2">
                                                            <input type="text" name="ward" value={formData.ward} onChange={handleInputChange} placeholder="Ward No." className={`w-full rounded-xl border bg-slate-50 px-4 py-3 text-sm font-medium ${errors.ward ? 'border-red-500' : 'border-slate-200'} focus:outline-none focus:border-blue-900 focus:ring-2 focus:ring-blue-900/20`} />
                                                            {errors.ward && <p className="text-xs text-red-500">{errors.ward}</p>}
                                                        </div>
                                                        <div className="space-y-2">
                                                            {formData.country === 'Nepal' ? (
                                                                <input 
                                                                    type="text" 
                                                                    name="villageTole" 
                                                                    value={formData.villageTole} 
                                                                    onChange={handleInputChange} 
                                                                    placeholder="Village / Tole" 
                                                                    className={`w-full rounded-xl border bg-slate-50 px-4 py-3 text-sm font-medium ${errors.villageTole ? 'border-red-500' : 'border-slate-200'} focus:outline-none focus:border-blue-900 focus:ring-2 focus:ring-blue-900/20`} 
                                                                />
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
                                                        <button 
                                                            type="button" 
                                                            onClick={() => setIsScheduleModalOpen(true)}
                                                            className="w-full rounded-2xl border border-blue-200 bg-blue-50 px-5 py-3 text-sm font-bold uppercase tracking-wide text-blue-900 transition-colors hover:bg-blue-100"
                                                        >
                                                            See Doctor Weekly Schedule
                                                        </button>
                                                    </div>
                                                </div>

                                                <div className="space-y-4 border-t border-slate-200 pt-6">
                                                    <label className="text-xs font-bold uppercase tracking-widest text-slate-700">Preferred Appointment Date *</label>
                                                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                                        <div className="space-y-2">
                                                            <span className="text-[10px] font-black uppercase tracking-[0.18em] text-blue-900/45">Nepali Calendar (BS)</span>
                                                            <NepaliDatePickerCustom value={appointmentDateBS} onChange={(value: string) => setAppointmentDateBS(value)} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium focus:outline-none focus:border-blue-900 focus:ring-2 focus:ring-blue-900/20" />
                                                        </div>
                                                        <div className="space-y-2">
                                                            <span className="text-[10px] font-black uppercase tracking-[0.18em] text-blue-900/45">English Calendar (AD)</span>
                                                            <EnglishDatePicker value={appointmentDateAD} onChange={(value: string) => setAppointmentDateAD(value)} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium focus:outline-none focus:border-blue-900 focus:ring-2 focus:ring-blue-900/20" />
                                                        </div>
                                                    </div>
                                                    {appointmentDateAD && (
                                                        <motion.div 
                                                            initial={{ opacity: 0, y: 10 }}
                                                            animate={{ opacity: 1, y: 0 }}
                                                            className={`p-4 rounded-2xl flex items-center gap-3 border transition-all ${
                                                                // Mock logic: available on even days
                                                                parseInt(appointmentDateAD.split('-')[2]) % 2 === 0 
                                                                ? 'bg-green-50 border-green-100 text-green-700' 
                                                                : 'bg-red-50 border-red-100 text-red-700'
                                                            }`}
                                                        >
                                                            {parseInt(appointmentDateAD.split('-')[2]) % 2 === 0 ? (
                                                                <>
                                                                    <CheckCircle className="w-5 h-5 shrink-0" />
                                                                    <div className="min-w-0">
                                                                        <p className="text-xs font-black uppercase tracking-wider mb-0.5">Availability Confirmed</p>
                                                                        <p className="text-sm font-bold opacity-90">Doctor is available for the selected week/date.</p>
                                                                    </div>
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <AlertCircle className="w-5 h-5 shrink-0" />
                                                                    <div className="min-w-0">
                                                                        <p className="text-xs font-black uppercase tracking-wider mb-0.5">Limited Availability</p>
                                                                        <p className="text-sm font-bold opacity-90">Doctor might not be available. Please check the weekly schedule for exact slots.</p>
                                                                    </div>
                                                                </>
                                                            )}
                                                        </motion.div>
                                                    )}
                                                    {errors.appointmentDates && <p className="text-xs text-red-500">{errors.appointmentDates}</p>}
                                                </div>

                                                <div className="space-y-6 border-t border-slate-200 pt-6">
                                                    <div className="space-y-3">
                                                        <label className="text-xs font-bold uppercase tracking-widest text-slate-700">Are you suffering from any disease (ICD-11)?</label>
                                                        <div className="flex flex-wrap gap-3">
                                                            {['No', 'Yes', 'Not Sure'].map((status) => (
                                                                <button
                                                                    key={status}
                                                                    type="button"
                                                                        onClick={() => setFormData(prev => ({ 
                                                                            ...prev, 
                                                                            diseaseStatus: status,
                                                                            ...(status === 'No' ? { diseases: [], currentDisease: { condition: '', duration: '', note: '' } } : {})
                                                                        }))}
                                                                    className={`px-6 py-2.5 rounded-full text-xs font-black uppercase tracking-widest transition-all border ${
                                                                        formData.diseaseStatus === status
                                                                            ? 'bg-blue-900 text-white border-blue-900 shadow-lg shadow-blue-900/20'
                                                                            : 'bg-white text-slate-400 border-slate-200 hover:border-blue-900 hover:text-blue-900'
                                                                    }`}
                                                                >
                                                                    {status}
                                                                </button>
                                                            ))}
                                                        </div>
                                                    </div>

                                                    <AnimatePresence mode="wait">
                                                        {(formData.diseaseStatus === 'Yes' || formData.diseaseStatus === 'Not Sure') && (
                                                            <motion.div
                                                                initial={{ opacity: 0, height: 0, y: -10 }}
                                                                animate={{ opacity: 1, height: 'auto', y: 0 }}
                                                                exit={{ opacity: 0, height: 0, y: -10 }}
                                                                className="overflow-hidden space-y-4"
                                                            >
                                                                {/* Disease List */}
                                                                {formData.diseases.length > 0 && (
                                                                    <div className="flex flex-wrap gap-2 pt-2">
                                                                        {formData.diseases.map((d, idx) => (
                                                                            <div key={idx} className="flex items-center gap-2 bg-blue-50 border border-blue-100 rounded-full pl-4 pr-2 py-1.5 shadow-sm group hover:bg-blue-100 transition-all">
                                                                                <div className="flex flex-col leading-tight">
                                                                                    <span className="text-[10px] font-black text-blue-900 uppercase tracking-wider">{d.condition}</span>
                                                                                    {d.duration && <span className="text-[9px] text-blue-600 font-bold">{d.duration}</span>}
                                                                                </div>
                                                                                <button
                                                                                    type="button"
                                                                                    onClick={() => removeDisease(idx)}
                                                                                    className="p-1 hover:bg-red-100 rounded-full text-red-400 hover:text-red-600 transition-colors"
                                                                                >
                                                                                    <Trash2 className="w-3.5 h-3.5" />
                                                                                </button>
                                                                            </div>
                                                                        ))}
                                                                    </div>
                                                                )}

                                                                {/* Add Disease Form */}
                                                                <div className="bg-slate-50/50 p-6 rounded-[22px] border border-slate-200 space-y-4 relative group">
                                                                    <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
                                                                        <div className="space-y-1.5">
                                                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Disease Name (ICD-11)</label>
                                                                            <input list="icd11-diseases" name="condition" value={formData.currentDisease.condition} onChange={handleDiseaseChange} placeholder="Select or Type Disease..." className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium focus:outline-none focus:border-blue-900 focus:ring-2 focus:ring-blue-900/20" />
                                                                        </div>
                                                                        <div className="space-y-1.5">
                                                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Duration</label>
                                                                            <input list="disease-durations" name="duration" value={formData.currentDisease.duration} onChange={handleDiseaseChange} placeholder="Duration" className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium focus:outline-none focus:border-blue-900 focus:ring-2 focus:ring-blue-900/20" />
                                                                        </div>
                                                                        <div className="space-y-1.5">
                                                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Additional Notes</label>
                                                                            <input type="text" name="note" value={formData.currentDisease.note} onChange={handleDiseaseChange} placeholder="Type here..." className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium focus:outline-none focus:border-blue-900 focus:ring-2 focus:ring-blue-900/20" />
                                                                        </div>
                                                                    </div>
                                                                    <div className="flex justify-end">
                                                                        <button
                                                                            type="button"
                                                                            onClick={addDisease}
                                                                            disabled={!formData.currentDisease.condition.trim()}
                                                                            className="flex items-center gap-2 bg-blue-900 text-white px-5 py-2 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-blue-900/20"
                                                                        >
                                                                            <Plus className="w-4 h-4" /> Add to List
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            </motion.div>
                                                        )}
                                                    </AnimatePresence>

                                                    <datalist id="icd11-diseases">
                                                        {ICD11_COMMON_DISEASES.map((disease) => (
                                                            <option key={disease} value={disease} />
                                                        ))}
                                                    </datalist>
                                                    <datalist id="disease-durations">
                                                        <option value="Less than 1 week" />
                                                        <option value="1 to 4 weeks" />
                                                        <option value="1 to 6 months" />
                                                        <option value="More than 6 months" />
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
            
            <DoctorScheduleModal 
                isOpen={isScheduleModalOpen} 
                onClose={() => setIsScheduleModalOpen(false)} 
                department={formData.department}
                doctorName={formData.doctor}
                onSelectSlot={handleSlotSelection}
            />
        </div>
    );
};

export default DoctorAppointment;

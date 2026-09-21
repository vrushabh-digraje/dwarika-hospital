import { useState, useEffect, useRef } from 'react';
import BikramSambat from 'bikram-sambat-js';
import { motion, AnimatePresence } from 'framer-motion';
import {
    User, Phone, Mail, MapPin,
    Upload, CheckCircle2, ArrowRight, ArrowLeft,
    BookOpen, Briefcase, Award, Globe, Shield, Info,
    QrCode, Plus, CreditCard, FileText, Pencil, Trash2, ChevronDown
} from 'lucide-react';
import DualDatePicker from './DualDatePicker';
import {
    PROVINCES, DISTRICTS_BY_PROVINCE, GET_MUNICIPALITIES,
    WARDS, BLOOD_GROUPS, RELIGIONS, USER_TYPES, NATIONALITIES, CASTE_GROUPS, CASTES_BY_GROUP
} from '../constants/nepalData';

const STEPS = [
    { id: 'initial', title: 'Entry', icon: Shield },
    { id: 'profile', title: 'Profile', icon: User },
    { id: 'personal', title: 'Personal', icon: Info },
    { id: 'address', title: 'Address', icon: MapPin },
    { id: 'academic', title: 'Academic', icon: BookOpen },
    { id: 'council', title: 'Council', icon: Award },
    { id: 'training', title: 'Training', icon: BookOpen },
    { id: 'experience', title: 'Experience', icon: Briefcase },
    { id: 'preview', title: 'Preview', icon: FileText },
    { id: 'payment', title: 'Payment', icon: CreditCard },
];

const AddressBlock = ({ 
    title, 
    prefix, 
    formData, 
    handleInputChange, 
    isMailingSameAsPermanent, 
    setIsMailingSameAsPermanent 
}: { 
    title: string; 
    prefix: string; 
    formData: any; 
    handleInputChange: (e: any) => void; 
    isMailingSameAsPermanent: boolean; 
    setIsMailingSameAsPermanent: (val: boolean) => void; 
}) => {
    const isOld = prefix === 'old';
    const countryField = `${prefix}Country`;
    const provinceField = isOld ? 'oldZone' : `${prefix}Province`;
    const districtField = `${prefix}District`;
    const selectedCountry = (formData as any)[countryField] || 'Nepal';
    const isNepal = selectedCountry === 'Nepal';
    const selectedProvince = (formData as any)[provinceField] || '';
    const isDisabled = prefix === 'mailing' && isMailingSameAsPermanent;

    // Get districts filtered by selected province
    const getFilteredDistricts = () => {
        if (!isNepal) return [];
        if (isOld) return Object.values(DISTRICTS_BY_PROVINCE).flat().sort();
        if (selectedProvince && DISTRICTS_BY_PROVINCE[selectedProvince as keyof typeof DISTRICTS_BY_PROVINCE]) {
            return DISTRICTS_BY_PROVINCE[selectedProvince as keyof typeof DISTRICTS_BY_PROVINCE];
        }
        return Object.values(DISTRICTS_BY_PROVINCE).flat().sort();
    };

    const selectClass = (extra = "") => 
        `w-full border px-5 py-3 text-sm font-bold focus:outline-none focus:border-blue-900 focus:ring-2 focus:ring-blue-900/20 transition-all rounded-full appearance-none ${
            isDisabled 
            ? 'bg-slate-50 border-slate-200 text-slate-400 cursor-not-allowed opacity-75' 
            : 'bg-white border-gray-200 text-gray-800'
        } ${extra}`;

    const inputClass = (extra = "") => 
        `w-full border px-5 py-3 text-sm font-bold focus:outline-none focus:border-blue-900 focus:ring-2 focus:ring-blue-900/20 transition-all rounded-full ${
            isDisabled 
            ? 'bg-slate-50 border-slate-200 text-slate-400 cursor-not-allowed opacity-75' 
            : 'bg-white border-gray-200 text-gray-800'
        } ${extra}`;

    return (
        <div className="space-y-6">
            <h3 className="text-sm font-black text-blue-900 uppercase tracking-[0.2em] flex items-center justify-between pb-2 border-b-2 border-blue-900/10">
                <span className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" /> {title}
                </span>
                {prefix === 'mailing' && (
                    <label className="flex items-center gap-2.5 cursor-pointer text-xs font-black text-blue-900 uppercase tracking-widest hover:text-blue-800 select-none bg-blue-50/70 hover:bg-blue-50 border border-blue-100 px-3.5 py-1.5 rounded-full transition-all">
                        <input
                            type="checkbox"
                            checked={isMailingSameAsPermanent}
                            onChange={(e) => setIsMailingSameAsPermanent(e.target.checked)}
                            className="w-4 h-4 rounded border-gray-300 text-blue-900 focus:ring-blue-900"
                        />
                        Same as Permanent Address
                    </label>
                )}
            </h3>

            {/* Row 1: Country → Province/Zone → District */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                    <label className="text-[11px] font-black text-gray-600 uppercase tracking-widest">Country *</label>
                    <div className="relative">
                        <select name={countryField} value={selectedCountry} onChange={handleInputChange} disabled={isDisabled} className={selectClass()}>
                            <option>Nepal</option>
                            <option>India</option>
                            <option>China</option>
                            <option>Bangladesh</option>
                            <option>USA</option>
                            <option>UK</option>
                            <option>Other</option>
                        </select>
                        {!isDisabled && <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />}
                    </div>
                </div>
                <div className="space-y-2">
                    <label className="text-[11px] font-black text-gray-600 uppercase tracking-widest">{isOld ? 'Zone *' : 'Province/State *'}</label>
                    <div className="relative">
                        <input 
                            type="text" 
                            name={isOld ? 'oldZone' : `${prefix}Province`} 
                            value={(formData as any)[isOld ? 'oldZone' : `${prefix}Province`] || ''} 
                            onChange={handleInputChange} 
                            disabled={isDisabled} 
                            list={`${prefix}ProvinceList`}
                            placeholder={isOld ? "Select or type zone..." : "Select or type province..."} 
                            className={inputClass("pr-10")} 
                        />
                        {!isDisabled && <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />}
                        {isNepal && (
                            <datalist id={`${prefix}ProvinceList`}>
                                {isOld ? (
                                    ["Mechi", "Kosi", "Sagarmatha", "Janakpur", "Bagmati", "Narayani", "Gandaki", "Lumbini", "Dhaulagiri", "Rapti", "Bheri", "Karnali", "Seti", "Mahakali"].map(z => <option key={z} value={z} />)
                                ) : (
                                    PROVINCES.map(p => <option key={p} value={p} />)
                                )}
                            </datalist>
                        )}
                    </div>
                </div>
                <div className="space-y-2">
                    <label className="text-[11px] font-black text-gray-600 uppercase tracking-widest">District *</label>
                    <div className="relative">
                        <input 
                            type="text" 
                            name={districtField} 
                            value={(formData as any)[districtField] || ''} 
                            onChange={handleInputChange} 
                            disabled={isDisabled} 
                            list={`${prefix}DistrictList`}
                            placeholder="Select or type district..." 
                            className={inputClass("pr-10")} 
                        />
                        {!isDisabled && <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />}
                        {isNepal && (
                            <datalist id={`${prefix}DistrictList`}>
                                {getFilteredDistricts().map(d => <option key={d} value={d} />)}
                            </datalist>
                        )}
                    </div>
                </div>
            </div>

            {/* Row 2: Municipality → Ward → Street */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                    <label className="text-[11px] font-black text-gray-600 uppercase tracking-widest">Municipality/VDC *</label>
                    <div className="relative">
                        <input 
                            type="text" 
                            name={`${prefix}Municipality`} 
                            value={(formData as any)[`${prefix}Municipality`] || ''} 
                            onChange={handleInputChange} 
                            disabled={isDisabled} 
                            list={`${prefix}MunicipalityList`}
                            placeholder="Select or type municipality..." 
                            className={inputClass("pr-10")} 
                        />
                        {!isDisabled && <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />}
                        {isNepal && (
                            <datalist id={`${prefix}MunicipalityList`}>
                                {GET_MUNICIPALITIES((formData as any)[districtField] || '').map(m => <option key={m} value={m} />)}
                            </datalist>
                        )}
                    </div>
                </div>
                <div className="space-y-2">
                    <label className="text-[11px] font-black text-gray-600 uppercase tracking-widest">Ward No. *</label>
                    <div className="relative">
                        <input 
                            type="text" 
                            name={`${prefix}Ward`} 
                            value={(formData as any)[`${prefix}Ward`] || ''} 
                            onChange={handleInputChange} 
                            disabled={isDisabled} 
                            list={`${prefix}WardList`}
                            placeholder="Select or type ward..." 
                            className={inputClass("pr-10")} 
                        />
                        {!isDisabled && <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />}
                        {isNepal && (
                            <datalist id={`${prefix}WardList`}>
                                {WARDS.map(w => <option key={w} value={w} />)}
                            </datalist>
                        )}
                    </div>
                </div>
                <div className="space-y-2">
                    <label className="text-[11px] font-black text-gray-600 uppercase tracking-widest">Village / Tole *</label>
                    <input type="text" name={`${prefix}Street`} value={(formData as any)[`${prefix}Street`] || ''} onChange={handleInputChange} disabled={isDisabled} className={inputClass()} placeholder="Village / Tole" />
                </div>
            </div>
        </div>
    );
};

const ComplexOnlineRegistrationForm = () => {
    const calculateDateDiff = (start: string, end: string) => {
        if (!start || !end) return { y: '', m: '', d: '' };
        const s = new Date(start);
        const e = new Date(end);
        if (isNaN(s.getTime()) || isNaN(e.getTime())) return { y: '', m: '', d: '' };
        if (e < s) return { y: '0', m: '0', d: '0' };

        let years = e.getFullYear() - s.getFullYear();
        let months = e.getMonth() - s.getMonth();
        let days = e.getDate() - s.getDate();

        if (days < 0) {
            months--;
            const lastMonth = new Date(e.getFullYear(), e.getMonth(), 0);
            days += lastMonth.getDate();
        }
        if (months < 0) {
            years--;
            months += 12;
        }

        return { y: String(years), m: String(months), d: String(days) };
    };

    const [step, setStep] = useState(0);
    const [isMailingSameAsPermanent, setIsMailingSameAsPermanent] = useState(false);
    const [trainingError, setTrainingError] = useState('');
    const [workError, setWorkError] = useState('');
    const dobSyncSource = useRef<'AD' | 'BS' | null>(null);

    const [formData, setFormData] = useState({
        // Initial / Security
        entryCode: '',

        // General Profile
        photo: null,
        title: 'Mr.',
        firstName: '',
        middleName: '',
        lastName: '',
        firstNameNp: '',
        middleNameNp: '',
        lastNameNp: '',
        gender: '',
        bloodGroup: '',
        religion: '',
        userType: 'STUDENT',
        userTypeOther: '',
        mobile: '',
        phone: '',
        email: '',
        nationality: 'Nepali',
        casteGroup: '',
        caste: '',
        casteOther: '',
        postApplied: '',

        // Personal Details
        fatherName: '',
        fatherNameNp: '',
        motherName: '',
        motherNameNp: '',
        grandfatherName: '',
        grandfatherNameNp: '',
        grandmotherName: '',
        grandmotherNameNp: '',
        spouseName: '',
        spouseNameNp: '',
        maritalStatus: 'Unmarried',
        dobAD: '',
        dobBS: '',
        panNo: '',
        panFile: null,
        citizenshipNo: '',
        citizenshipIssueDate: '',
        citizenshipIssuePlace: '',
        citizenshipFront: null,
        citizenshipBack: null,
        passportNo: '',
        passportIssueDate: '',
        passportIssuePlace: '',
        passportFile: null,
        nIdNo: '',
        nIdIssueDate: '',
        nIdIssuePlace: '',
        nIdFile: null,
        localIdNo: '',
        localIdIssueDate: '',
        localIdIssuePlace: '',
        localIdFile: null,

        // Address
        // 1. Permanent (Old)
        oldDistrict: '',
        oldMunicipality: '',
        oldMunicipalityType: 'MUNICIPALITY',
        oldWard: '',
        oldStreet: '',
        oldZone: '',
        oldCountry: 'Nepal',

        // 2. Permanent (Current)
        permanentDistrict: '',
        permanentMunicipality: '',
        permanentMunicipalityType: 'MUNICIPALITY',
        permanentWard: '',
        permanentStreet: '',
        permanentProvince: '',
        permanentCountry: 'Nepal',

        // 3. Mailing
        mailingDistrict: '',
        mailingMunicipality: '',
        mailingMunicipalityType: 'MUNICIPALITY',
        mailingWard: '',
        mailingStreet: '',
        mailingProvince: '',
        mailingCountry: 'Nepal',
        mailingForeignAddress: '',

        // Academic Detail
        academicDetails: [
            { level: 'SLC/SEE', degree: '', passedYear: '', school: '', university: '', address: '', markGpa: '', division: '', speciality: '', markSheet: null, characterCert: null, provisionalCert: null, extraUploads: [] as (File | null)[] }
        ],

        // Training
        trainingEntries: [] as {
            name: string; regNo: string; regDate: string; recognizedBy: string;
            district: string; municipality: string; ward: string; stateProvince: string; country: string;
            startDateAD: string; startDateBS: string; endDateAD: string; endDateBS: string;
            durationYears: string; durationMonths: string; durationDays: string;
        }[],
        trainingForm: {
            name: '', regNo: '', regDate: '', recognizedBy: '',
            district: '', municipality: '', ward: '', stateProvince: '', country: 'Nepal',
            startDateAD: '', startDateBS: '', endDateAD: '', endDateBS: '',
            durationYears: '', durationMonths: '', durationDays: '',
        },
        trainingEditIndex: -1,

        // Work Experience
        workEntries: [] as {
            organization: string; post: string;
            district: string; municipality: string; ward: string; stateProvince: string; country: string;
            startDateAD: string; startDateBS: string; endDateAD: string; endDateBS: string;
            durationYears: string; durationMonths: string; durationDays: string;
        }[],
        workForm: {
            organization: '', post: '',
            district: '', municipality: '', ward: '', stateProvince: '', country: 'Nepal',
            startDateAD: '', startDateBS: '', endDateAD: '', endDateBS: '',
            durationYears: '', durationMonths: '', durationDays: '',
        },
        workEditIndex: -1,
        councilExtraUploads: [] as (File | null)[],
    });

    // Sync DOB: AD to BS
    useEffect(() => {
        if (!formData.dobAD || dobSyncSource.current === 'BS') {
            if (dobSyncSource.current === 'BS') dobSyncSource.current = null;
            return;
        }
        try {
            const bsDate = new BikramSambat(formData.dobAD, 'AD').toBS();
            dobSyncSource.current = 'AD';
            setFormData(prev => ({ ...prev, dobBS: bsDate }));
        } catch (e) { /* ignore */ }
    }, [formData.dobAD]);

    // Sync DOB: BS to AD
    useEffect(() => {
        if (!formData.dobBS || formData.dobBS.length < 10 || dobSyncSource.current === 'AD') {
            if (dobSyncSource.current === 'AD') dobSyncSource.current = null;
            return;
        }
        try {
            const adDate = new BikramSambat(formData.dobBS, 'BS').toAD();
            const adStr = new Date(adDate).toISOString().split('T')[0];
            dobSyncSource.current = 'BS';
            setFormData(prev => ({ ...prev, dobAD: adStr }));
        } catch (e) { /* ignore */ }
    }, [formData.dobBS]);

    // Training Date Sync & Duration Calculation Effect
    useEffect(() => {
        const tf = formData.trainingForm;
        let needsUpdate = false;
        const newForm = { ...tf };

        // AD to BS: Start Date
        if (tf.startDateAD) {
            try {
                const calculatedBS = new BikramSambat(tf.startDateAD, 'AD').toBS();
                if (tf.startDateBS !== calculatedBS) {
                    newForm.startDateBS = calculatedBS;
                    needsUpdate = true;
                }
            } catch (e) {}
        } else if (tf.startDateBS) {
            newForm.startDateBS = '';
            needsUpdate = true;
        }

        // AD to BS: End Date
        if (tf.endDateAD) {
            try {
                const calculatedBS = new BikramSambat(tf.endDateAD, 'AD').toBS();
                if (tf.endDateBS !== calculatedBS) {
                    newForm.endDateBS = calculatedBS;
                    needsUpdate = true;
                }
            } catch (e) {}
        } else if (tf.endDateBS) {
            newForm.endDateBS = '';
            needsUpdate = true;
        }

        // BS to AD: Start Date
        if (tf.startDateBS && tf.startDateBS.length >= 10) {
            try {
                const calculatedAD = new BikramSambat(tf.startDateBS, 'BS').toAD();
                const adStr = new Date(calculatedAD).toISOString().split('T')[0];
                if (tf.startDateAD !== adStr) {
                    newForm.startDateAD = adStr;
                    needsUpdate = true;
                }
            } catch (e) {}
        }

        // BS to AD: End Date
        if (tf.endDateBS && tf.endDateBS.length >= 10) {
            try {
                const calculatedAD = new BikramSambat(tf.endDateBS, 'BS').toAD();
                const adStr = new Date(calculatedAD).toISOString().split('T')[0];
                if (tf.endDateAD !== adStr) {
                    newForm.endDateAD = adStr;
                    needsUpdate = true;
                }
            } catch (e) {}
        }

        // Recalculate Duration
        const diff = calculateDateDiff(newForm.startDateAD, newForm.endDateAD);
        if (newForm.durationYears !== diff.y || newForm.durationMonths !== diff.m || newForm.durationDays !== diff.d) {
            newForm.durationYears = diff.y;
            newForm.durationMonths = diff.m;
            newForm.durationDays = diff.d;
            needsUpdate = true;
        }

        if (needsUpdate) {
            setFormData(prev => ({ ...prev, trainingForm: newForm }));
        }
    }, [
        formData.trainingForm.startDateAD,
        formData.trainingForm.endDateAD,
        formData.trainingForm.startDateBS,
        formData.trainingForm.endDateBS
    ]);

    // Work Experience Date Sync & Duration Calculation Effect
    useEffect(() => {
        const wf = formData.workForm;
        let needsUpdate = false;
        const newForm = { ...wf };

        // AD to BS: Start Date
        if (wf.startDateAD) {
            try {
                const calculatedBS = new BikramSambat(wf.startDateAD, 'AD').toBS();
                if (wf.startDateBS !== calculatedBS) {
                    newForm.startDateBS = calculatedBS;
                    needsUpdate = true;
                }
            } catch (e) {}
        } else if (wf.startDateBS) {
            newForm.startDateBS = '';
            needsUpdate = true;
        }

        // AD to BS: End Date
        if (wf.endDateAD) {
            try {
                const calculatedBS = new BikramSambat(wf.endDateAD, 'AD').toBS();
                if (wf.endDateBS !== calculatedBS) {
                    newForm.endDateBS = calculatedBS;
                    needsUpdate = true;
                }
            } catch (e) {}
        } else if (wf.endDateBS) {
            newForm.endDateBS = '';
            needsUpdate = true;
        }

        // BS to AD: Start Date
        if (wf.startDateBS && wf.startDateBS.length >= 10) {
            try {
                const calculatedAD = new BikramSambat(wf.startDateBS, 'BS').toAD();
                const adStr = new Date(calculatedAD).toISOString().split('T')[0];
                if (wf.startDateAD !== adStr) {
                    newForm.startDateAD = adStr;
                    needsUpdate = true;
                }
            } catch (e) {}
        }

        // BS to AD: End Date
        if (wf.endDateBS && wf.endDateBS.length >= 10) {
            try {
                const calculatedAD = new BikramSambat(wf.endDateBS, 'BS').toAD();
                const adStr = new Date(calculatedAD).toISOString().split('T')[0];
                if (wf.endDateAD !== adStr) {
                    newForm.endDateAD = adStr;
                    needsUpdate = true;
                }
            } catch (e) {}
        }

        // Recalculate Duration
        const diff = calculateDateDiff(newForm.startDateAD, newForm.endDateAD);
        if (newForm.durationYears !== diff.y || newForm.durationMonths !== diff.m || newForm.durationDays !== diff.d) {
            newForm.durationYears = diff.y;
            newForm.durationMonths = diff.m;
            newForm.durationDays = diff.d;
            needsUpdate = true;
        }

        if (needsUpdate) {
            setFormData(prev => ({ ...prev, workForm: newForm }));
        }
    }, [
        formData.workForm.startDateAD,
        formData.workForm.endDateAD,
        formData.workForm.startDateBS,
        formData.workForm.endDateBS
    ]);

    // Sync Mailing Address with Permanent Address if "Same as Permanent" is ticked
    useEffect(() => {
        if (isMailingSameAsPermanent) {
            setFormData(prev => ({
                ...prev,
                mailingCountry: prev.permanentCountry,
                mailingProvince: prev.permanentProvince,
                mailingDistrict: prev.permanentDistrict,
                mailingMunicipality: prev.permanentMunicipality,
                mailingWard: prev.permanentWard,
                mailingStreet: prev.permanentStreet
            }));
        }
    }, [
        isMailingSameAsPermanent,
        formData.permanentCountry,
        formData.permanentProvince,
        formData.permanentDistrict,
        formData.permanentMunicipality,
        formData.permanentWard,
        formData.permanentStreet
    ]);

    const handleNext = () => {
        // Auto-save unsaved Training form when leaving the Training step (step 6)
        if (step === 6 && formData.trainingForm.name.trim()) {
            setFormData(prev => {
                const entries = [...prev.trainingEntries];
                if (prev.trainingEditIndex >= 0) {
                    entries[prev.trainingEditIndex] = { ...prev.trainingForm };
                } else {
                    entries.push({ ...prev.trainingForm });
                }
                return {
                    ...prev,
                    trainingEntries: entries,
                    trainingForm: { name: '', regNo: '', regDate: '', recognizedBy: '', district: '', municipality: '', ward: '', stateProvince: '', country: 'Nepal', startDateAD: '', startDateBS: '', endDateAD: '', endDateBS: '', durationYears: '', durationMonths: '', durationDays: '' },
                    trainingEditIndex: -1,
                };
            });
        }
        // Auto-save unsaved Work Experience form when leaving the Work Experience step (step 7)
        if (step === 7 && formData.workForm.organization.trim()) {
            setFormData(prev => {
                const entries = [...prev.workEntries];
                if (prev.workEditIndex >= 0) {
                    entries[prev.workEditIndex] = { ...prev.workForm };
                } else {
                    entries.push({ ...prev.workForm });
                }
                return {
                    ...prev,
                    workEntries: entries,
                    workForm: { organization: '', post: '', district: '', municipality: '', ward: '', stateProvince: '', country: 'Nepal', startDateAD: '', startDateBS: '', endDateAD: '', endDateBS: '', durationYears: '', durationMonths: '', durationDays: '' },
                    workEditIndex: -1,
                };
            });
        }
        setStep(prev => Math.min(prev + 1, STEPS.length - 1));
    };
    const handleBack = () => setStep(prev => Math.max(prev - 1, 0));

    const renderStepHeader = () => (
        <div className="mb-12 overflow-x-auto pb-6 scrollbar-hide">
            <div className="flex items-center justify-between min-w-[700px] px-4 relative">
                {/* Progress Line */}
                <div className="absolute top-5 left-8 right-8 h-[2px] bg-gray-200 -z-0" />
                <div className="absolute top-5 left-8 h-[2px] bg-blue-900 -z-0 transition-all duration-500" style={{ width: `${(step / (STEPS.length - 1)) * 100}%` }} />

                {STEPS.map((s, idx) => {
                    const Icon = s.icon;
                    const isActive = idx === step;
                    const isCompleted = idx < step;

                    return (
                        <div key={s.id} className="flex flex-col items-center relative z-10">
                            <button
                                type="button"
                                onClick={() => idx <= step && setStep(idx)}
                                className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 shadow-sm ${isActive ? 'bg-blue-900 text-white ring-8 ring-blue-900/10 scale-110' :
                                    isCompleted ? 'bg-green-500 text-white hover:bg-green-600' : 'bg-white text-gray-400 border border-gray-200 shadow-sm'
                                    } ${idx <= step ? 'cursor-pointer' : 'cursor-not-allowed'}`}
                            >
                                {isCompleted ? <CheckCircle2 className="w-6 h-6" /> : <Icon className="w-5 h-5" />}
                            </button>
                            <span className={`text-[10px] font-black uppercase mt-3 tracking-[0.15em] ${isActive ? 'text-blue-900' : isCompleted ? 'text-green-700' : 'text-gray-500'
                                }`}>
                                {s.title}
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        if (name && name.startsWith('mailing')) {
            setIsMailingSameAsPermanent(false);
        }
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, files } = e.target;
        if (files && files[0]) {
            setFormData(prev => ({ ...prev, [name]: files[0] }));
        }
    };

    const renderStepContent = () => {
        switch (step) {
            case 0: // Initial Entry
                return (
                    <div className="space-y-6">
                        <div className="bg-blue-50 border border-blue-100 p-6 rounded-2xl text-center">
                            <Shield className="w-12 h-12 text-blue-900 mx-auto mb-4" />
                            <h3 className="text-xl font-black text-blue-900 uppercase tracking-tight mb-2">Registration Status</h3>
                            <p className="text-sm text-blue-700/70 font-medium mb-6">Choose how you want to proceed with your registration.</p>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <button
                                    onClick={handleNext}
                                    className="flex flex-col items-center justify-center p-8 bg-white border-2 border-blue-900 rounded-3xl hover:bg-blue-50 transition-all group shadow-sm hover:shadow-md"
                                >
                                    <div className="p-4 bg-blue-900/10 rounded-2xl mb-4 group-hover:scale-110 transition-transform">
                                        <User className="w-8 h-8 text-blue-900" />
                                    </div>
                                    <span className="font-black text-blue-900 uppercase text-xs tracking-widest">Start New Registration</span>
                                </button>
                                <button className="flex flex-col items-center justify-center p-8 bg-gray-50 border-2 border-dashed border-gray-300 rounded-3xl hover:border-blue-900 hover:bg-white transition-all group shadow-sm hover:shadow-md">
                                    <div className="p-4 bg-gray-100 rounded-2xl mb-4 group-hover:bg-blue-900/10 transition-colors">
                                        <QrCode className="w-8 h-8 text-gray-500 group-hover:text-blue-900" />
                                    </div>
                                    <span className="font-black text-gray-500 uppercase text-xs tracking-widest group-hover:text-blue-900">Already have a code?</span>
                                </button>
                            </div>
                        </div>

                        <div className="bg-gray-50 border border-gray-200 p-6 rounded-2xl">
                            <h4 className="text-gray-900 font-black uppercase text-xs tracking-widest mb-3 flex items-center gap-2">
                                <Info className="w-4 h-4 text-blue-900" /> Important Instructions:
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <ul className="text-[11px] text-gray-600 font-medium space-y-2 list-disc pl-4">
                                    <li>Upload a recent passport-sized photograph.</li>
                                    <li>Provide your name exactly as per citizenship.</li>
                                    <li>Citizenship front and back scans are mandatory.</li>
                                </ul>
                                <ul className="text-[11px] text-gray-600 font-medium space-y-2 list-disc pl-4">
                                    <li>Academic documents from SLC onwards are required.</li>
                                    <li>Payment verification is required for submission.</li>
                                    <li>You can save your progress and return later.</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                );
            case 1: // General Profile
                return (
                    <div className="space-y-8">
                        <div className="flex flex-col md:flex-row gap-8 items-start">
                            {/* Photo Upload Area */}
                            <div className="w-full md:w-1/3 flex flex-col items-center gap-4">
                                <div className="w-48 h-56 bg-gray-50 border-2 border-dashed border-gray-300 rounded-2xl flex flex-col items-center justify-center overflow-hidden relative group hover:border-blue-900 transition-all">
                                    {formData.photo ? (
                                        <img
                                            src={URL.createObjectURL(formData.photo as unknown as Blob)}
                                            alt="Preview"
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="text-center p-4">
                                            <Upload className="w-10 h-10 text-gray-500 mx-auto mb-2 group-hover:text-blue-900 transition-colors" />
                                            <p className="text-[11px] font-black uppercase text-gray-600 tracking-wider">Upload Photo *</p>
                                        </div>
                                    )}
                                    <input
                                        type="file"
                                        name="photo"
                                        onChange={handleFileChange}
                                        className="absolute inset-0 opacity-0 cursor-pointer"
                                        accept="image/*"
                                    />
                                </div>
                                <p className="text-[11px] text-center text-gray-500 font-bold uppercase">Max Size: 2MB | Format: JPG, PNG</p>
                            </div>

                            {/* Main Details */}
                            <div className="w-full md:w-2/3 space-y-6">
                                <div className="flex flex-col md:flex-row gap-4">
                                    <div className="space-y-2 w-full md:w-[76px] shrink-0">
                                        <label className="text-[11px] font-black text-gray-600 uppercase tracking-widest">Title *</label>
                                        <select
                                            name="title"
                                            value={formData.title}
                                            onChange={handleInputChange}
                                            className="w-full bg-gray-100/80 border border-gray-300 rounded-xl px-2 py-3 text-sm font-bold focus:outline-none focus:border-blue-900 transition-all appearance-none text-center"
                                        >
                                            <option>Mr.</option>
                                            <option>Mrs.</option>
                                            <option>Miss</option>
                                            <option>Dr.</option>
                                        </select>
                                    </div>
                                    <div className="space-y-2 flex-1">
                                        <label className="text-[11px] font-black text-gray-600 uppercase tracking-widest">First Name *</label>
                                        <input
                                            type="text"
                                            name="firstName"
                                            value={formData.firstName}
                                            onChange={handleInputChange}
                                            placeholder="E.g. RAM"
                                            className="w-full bg-gray-100/80 border border-gray-300 rounded-xl px-4 py-3 text-sm font-bold focus:outline-none focus:border-blue-900 transition-all uppercase"
                                        />
                                    </div>
                                    <div className="space-y-2 flex-1">
                                        <label className="text-[11px] font-black text-gray-600 uppercase tracking-widest">Middle Name</label>
                                        <input
                                            type="text"
                                            name="middleName"
                                            value={formData.middleName}
                                            onChange={handleInputChange}
                                            placeholder="E.g. BAHADUR"
                                            className="w-full bg-gray-100/80 border border-gray-300 rounded-xl px-4 py-3 text-sm font-bold focus:outline-none focus:border-blue-900 transition-all uppercase"
                                        />
                                    </div>
                                    <div className="space-y-2 flex-1">
                                        <label className="text-[11px] font-black text-gray-600 uppercase tracking-widest">Last Name *</label>
                                        <input
                                            type="text"
                                            name="lastName"
                                            value={formData.lastName}
                                            onChange={handleInputChange}
                                            placeholder="E.g. SHARMA"
                                            className="w-full bg-gray-100/80 border border-gray-300 rounded-xl px-4 py-3 text-sm font-bold focus:outline-none focus:border-blue-900 transition-all uppercase"
                                        />
                                    </div>
                                </div>

                                {/* Nepali Name Section */}
                                <div className="space-y-4 pt-4 border-t border-dashed border-gray-200">
                                    <label className="text-[10px] font-black text-blue-900 uppercase tracking-widest">नाम (In Nepali) *</label>
                                    <div className="grid grid-cols-3 gap-4">
                                        <input
                                            type="text"
                                            name="firstNameNp"
                                            value={formData.firstNameNp}
                                            onChange={handleInputChange}
                                            placeholder="पहिलो नाम"
                                            className="w-full bg-blue-50/50 border border-blue-100 rounded-xl px-4 py-3 text-sm font-bold focus:outline-none focus:border-blue-900 transition-all font-nepali"
                                        />
                                        <input
                                            type="text"
                                            name="middleNameNp"
                                            value={formData.middleNameNp}
                                            onChange={handleInputChange}
                                            placeholder="बीचको नाम"
                                            className="w-full bg-blue-50/50 border border-blue-100 rounded-xl px-4 py-3 text-sm font-bold focus:outline-none focus:border-blue-900 transition-all font-nepali"
                                        />
                                        <input
                                            type="text"
                                            name="lastNameNp"
                                            value={formData.lastNameNp}
                                            onChange={handleInputChange}
                                            placeholder="थर"
                                            className="w-full bg-blue-50/50 border border-blue-100 rounded-xl px-4 py-3 text-sm font-bold focus:outline-none focus:border-blue-900 transition-all font-nepali"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pt-6 border-t border-gray-200">
                            <div className="space-y-2">
                                <label className="text-[11px] font-black text-gray-600 uppercase tracking-widest">Gender *</label>
                                <div className="flex gap-2">
                                    {['Male', 'Female', 'Other'].map(g => (
                                        <button
                                            key={g}
                                            type="button"
                                            onClick={() => setFormData(prev => ({ ...prev, gender: g }))}
                                            className={`flex-1 py-3 px-1 rounded-full text-[10px] font-black uppercase transition-all border ${formData.gender === g ? 'bg-blue-900 text-white border-blue-900 shadow-md' : 'bg-white text-gray-500 border-gray-200 hover:bg-gray-50'
                                                }`}
                                        >
                                            {g}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[11px] font-black text-gray-600 uppercase tracking-widest">Blood Group *</label>
                                <select
                                    name="bloodGroup"
                                    value={formData.bloodGroup}
                                    onChange={handleInputChange}
                                    className="w-full bg-white border border-gray-200 rounded-full px-4 py-3 text-sm font-bold focus:outline-none focus:border-blue-900 transition-all appearance-none"
                                >
                                    <option value="">Select Group</option>
                                    {BLOOD_GROUPS.map(bg => <option key={bg} value={bg}>{bg}</option>)}
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[11px] font-black text-gray-600 uppercase tracking-widest">Nationality *</label>
                                <select
                                    name="nationality"
                                    value={formData.nationality}
                                    onChange={handleInputChange}
                                    className="w-full bg-white border border-gray-200 rounded-full px-4 py-3 text-sm font-bold focus:outline-none focus:border-blue-900 transition-all appearance-none"
                                >
                                    <option value="">Select Nationality</option>
                                    {NATIONALITIES.map(n => <option key={n} value={n}>{n}</option>)}
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[11px] font-black text-gray-600 uppercase tracking-widest">Religion *</label>
                                <select
                                    name="religion"
                                    value={formData.religion}
                                    onChange={handleInputChange}
                                    className="w-full bg-white border border-gray-200 rounded-full px-4 py-3 text-sm font-bold focus:outline-none focus:border-blue-900 transition-all appearance-none"
                                >
                                    <option value="">Select Religion</option>
                                    {RELIGIONS.map(r => <option key={r} value={r}>{r}</option>)}
                                </select>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
                            <div className="space-y-2">
                                <label className="text-[11px] font-black text-gray-600 uppercase tracking-widest">Ethnic Group *</label>
                                <select
                                    name="casteGroup"
                                    value={formData.casteGroup}
                                    onChange={(e) => {
                                        handleInputChange(e);
                                        setFormData(prev => ({ ...prev, caste: '' }));
                                    }}
                                    className="w-full bg-white border border-gray-200 rounded-full px-4 py-3 text-sm font-bold focus:outline-none focus:border-blue-900 transition-all appearance-none"
                                >
                                    <option value="">Select Group</option>
                                    {CASTE_GROUPS.map(cg => <option key={cg} value={cg}>{cg}</option>)}
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[11px] font-black text-gray-600 uppercase tracking-widest">Caste *</label>
                                <select
                                    name="caste"
                                    value={formData.caste}
                                    onChange={handleInputChange}
                                    className="w-full bg-white border border-gray-200 rounded-full px-4 py-3 text-sm font-bold focus:outline-none focus:border-blue-900 transition-all appearance-none"
                                    disabled={!formData.casteGroup}
                                >
                                    <option value="">{formData.casteGroup ? "Select Caste" : "Select Ethnic Group first"}</option>
                                    {formData.casteGroup && CASTES_BY_GROUP[formData.casteGroup]?.map(c => (
                                        <option key={c} value={c}>{c}</option>
                                    ))}
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                            {(formData.caste === 'Other' || formData.casteGroup === 'Others') && (
                                <div className="space-y-2">
                                    <label className="text-[11px] font-black text-gray-600 uppercase tracking-widest">Specify Caste/Type *</label>
                                    <input
                                        type="text"
                                        name="casteOther"
                                        value={formData.casteOther}
                                        onChange={handleInputChange}
                                        placeholder="Type here..."
                                        className="w-full bg-white border border-gray-200 rounded-full px-4 py-3 text-sm font-bold focus:outline-none focus:border-blue-900 transition-all"
                                    />
                                </div>
                            )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
                            <div className="space-y-2">
                                <label className="text-[11px] font-black text-gray-600 uppercase tracking-widest">You Are A: *</label>
                                <div className="grid grid-cols-2 gap-2">
                                    {USER_TYPES.map(ut => (
                                        <button
                                            key={ut}
                                            type="button"
                                            onClick={() => setFormData(prev => ({ ...prev, userType: ut }))}
                                            className={`py-2 px-3 rounded-xl text-[10px] font-black uppercase transition-all border text-center ${formData.userType === ut ? 'bg-blue-900 text-white border-blue-900 shadow-sm' : 'bg-gray-50 text-gray-500 border-gray-200 hover:bg-gray-100'
                                                }`}
                                        >
                                            {ut}
                                        </button>
                                    ))}
                                </div>
                                {formData.userType === 'OTHER' && (
                                    <div className="space-y-2 pt-4">
                                        <label className="text-[11px] font-black text-gray-600 uppercase tracking-widest">Specify Other Role *</label>
                                        <input
                                            type="text"
                                            name="userTypeOther"
                                            value={formData.userTypeOther}
                                            onChange={handleInputChange}
                                            placeholder="Specify your role..."
                                            className="w-full bg-white border border-gray-200 rounded-full px-4 py-3 text-sm font-bold focus:outline-none focus:border-blue-900 transition-all"
                                        />
                                    </div>
                                )}
                            </div>
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-[11px] font-black text-gray-600 uppercase tracking-widest">Mobile No. *</label>
                                    <div className="relative">
                                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                                        <input
                                            type="tel"
                                            name="mobile"
                                            value={formData.mobile}
                                            onChange={handleInputChange}
                                            placeholder="98XXXXXXXX"
                                            className="w-full bg-gray-100/80 border border-gray-300 rounded-xl pl-10 pr-4 py-3 text-sm font-bold focus:outline-none focus:border-blue-900 transition-all"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[11px] font-black text-gray-600 uppercase tracking-widest">Email ID *</label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            placeholder="example@mail.com"
                                            className="w-full bg-gray-100/80 border border-gray-300 rounded-xl pl-10 pr-4 py-3 text-sm font-bold focus:outline-none focus:border-blue-900 transition-all"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            case 2: // Personal Detail
                return (
                    <div className="space-y-10">
                        {/* Section Header */}
                        <div className="bg-blue-900 p-6 rounded-2xl text-white shadow-xl shadow-blue-900/10">
                            <h3 className="text-lg font-black uppercase tracking-tight flex items-center gap-3">
                                <User className="w-6 h-6 text-blue-300" /> Personal Detail
                            </h3>
                            <p className="text-blue-200 text-xs font-medium mt-1 uppercase tracking-widest">Provide your family and identity information</p>
                        </div>

                        {/* Family Details Section */}
                        <div className="space-y-6">
                            <h4 className="text-[10px] font-black text-blue-900 uppercase tracking-[0.2em] flex items-center gap-2 pb-2 border-b-2 border-blue-900/10">
                                <Info className="w-4 h-4" /> Family Information
                            </h4>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {/* Father & Mother */}
                                <div className="space-y-6">
                                    <div className="grid grid-cols-1 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-[11px] font-black text-gray-600 uppercase tracking-widest">Father's Name *</label>
                                            <input type="text" name="fatherName" value={formData.fatherName} onChange={handleInputChange} placeholder="FATHER'S FULL NAME" className="w-full bg-gray-100/80 border border-gray-400/60 rounded-xl px-4 py-3 text-sm font-bold focus:outline-none focus:border-blue-900 transition-all uppercase" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-blue-900 uppercase tracking-widest">बाबुको नाम *</label>
                                            <input type="text" name="fatherNameNp" value={formData.fatherNameNp} onChange={handleInputChange} placeholder="बाबुको पूरा नाम" className="w-full bg-blue-50/50 border border-blue-200/80 rounded-xl px-4 py-3 text-sm font-bold focus:outline-none focus:border-blue-900 transition-all font-nepali" />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-[11px] font-black text-gray-600 uppercase tracking-widest">Grandfather's Name *</label>
                                            <input type="text" name="grandfatherName" value={formData.grandfatherName} onChange={handleInputChange} placeholder="GRANDFATHER'S FULL NAME" className="w-full bg-gray-100/80 border border-gray-400/60 rounded-xl px-4 py-3 text-sm font-bold focus:outline-none focus:border-blue-900 transition-all uppercase" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-blue-900 uppercase tracking-widest">हजुरबुवाको नाम *</label>
                                            <input type="text" name="grandfatherNameNp" value={formData.grandfatherNameNp} onChange={handleInputChange} placeholder="हजुरबुवाको पूरा नाम" className="w-full bg-blue-50/50 border border-blue-200/80 rounded-xl px-4 py-3 text-sm font-bold focus:outline-none focus:border-blue-900 transition-all font-nepali" />
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <div className="grid grid-cols-1 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-[11px] font-black text-gray-600 uppercase tracking-widest">Mother's Name *</label>
                                            <input type="text" name="motherName" value={formData.motherName} onChange={handleInputChange} placeholder="MOTHER'S FULL NAME" className="w-full bg-gray-100/80 border border-gray-400/60 rounded-xl px-4 py-3 text-sm font-bold focus:outline-none focus:border-blue-900 transition-all uppercase" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-blue-900 uppercase tracking-widest">आमाको नाम *</label>
                                            <input type="text" name="motherNameNp" value={formData.motherNameNp} onChange={handleInputChange} placeholder="आमाको पूरा नाम" className="w-full bg-blue-50/50 border border-blue-200/80 rounded-xl px-4 py-3 text-sm font-bold focus:outline-none focus:border-blue-900 transition-all font-nepali" />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-[11px] font-black text-gray-600 uppercase tracking-widest">Grandmother's Name</label>
                                            <input type="text" name="grandmotherName" value={formData.grandmotherName} onChange={handleInputChange} placeholder="GRANDMOTHER'S FULL NAME" className="w-full bg-gray-100/80 border border-gray-400/60 rounded-xl px-4 py-3 text-sm font-bold focus:outline-none focus:border-blue-900 transition-all uppercase" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-blue-900 uppercase tracking-widest">हजुरआमाको नाम</label>
                                            <input type="text" name="grandmotherNameNp" value={formData.grandmotherNameNp} onChange={handleInputChange} placeholder="हजुरआमाको पूरा नाम" className="w-full bg-blue-50/50 border border-blue-200/80 rounded-xl px-4 py-3 text-sm font-bold focus:outline-none focus:border-blue-900 transition-all font-nepali" />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Spouse Detail */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
                                <div className="space-y-2">
                                    <label className="text-[11px] font-black text-gray-600 uppercase tracking-widest">Husband/Wife Name</label>
                                    <input type="text" name="spouseName" value={formData.spouseName} onChange={handleInputChange} placeholder="SPOUSE FULL NAME" className="w-full bg-gray-100/80 border border-gray-400/60 rounded-xl px-4 py-3 text-sm font-bold focus:outline-none focus:border-blue-900 transition-all uppercase" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-blue-900 uppercase tracking-widest">पति/पत्नीको नाम</label>
                                    <input type="text" name="spouseNameNp" value={formData.spouseNameNp} onChange={handleInputChange} placeholder="पति/पत्नीको पूरा नाम" className="w-full bg-blue-50/50 border border-blue-200/80 rounded-xl px-4 py-3 text-sm font-bold focus:outline-none focus:border-blue-900 transition-all font-nepali" />
                                </div>
                            </div>

                            {/* Marital Status & DOB */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
                                <div className="space-y-2">
                                    <label className="text-[11px] font-black text-gray-600 uppercase tracking-widest">Marital Status / वैवाहिक स्थिति *</label>
                                    <div className="flex flex-wrap gap-2">
                                        {[
                                            { en: 'Married', np: 'विवाहित' },
                                            { en: 'Unmarried', np: 'अविवाहित' },
                                            { en: 'Divorced', np: 'सम्बन्ध विच्छेद' },
                                            { en: 'Widowed', np: 'एकल' }
                                        ].map(s => (
                                            <button
                                                key={s.en}
                                                type="button"
                                                onClick={() => setFormData(prev => ({ ...prev, maritalStatus: s.en }))}
                                                className={`flex-1 min-w-[120px] py-3 px-4 rounded-xl text-[10px] font-black uppercase transition-all border ${formData.maritalStatus === s.en ? 'bg-blue-900 text-white border-blue-900 shadow-md' : 'bg-gray-50 text-gray-500 border-gray-200 hover:bg-gray-100'}`}
                                            >
                                                {s.en} / {s.np}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-[11px] font-black text-gray-600 uppercase tracking-widest">DOB (A.D) *</label>
                                        <input type="date" name="dobAD" value={formData.dobAD} onChange={handleInputChange} className="w-full bg-gray-100/80 border border-gray-400/60 rounded-xl px-4 py-3 text-sm font-bold focus:outline-none focus:border-blue-900 transition-all" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[11px] font-black text-gray-600 uppercase tracking-widest">DOB (B.S) *</label>
                                        <input type="text" name="dobBS" value={formData.dobBS} onChange={handleInputChange} placeholder="YYYY-MM-DD" className="w-full bg-gray-100/80 border border-gray-400/60 rounded-xl px-4 py-3 text-sm font-bold focus:outline-none focus:border-blue-900 transition-all" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Identity Documents Section */}
                        <div className="space-y-8 pt-6">
                            <h4 className="text-[10px] font-black text-blue-900 uppercase tracking-[0.2em] flex items-center gap-2 pb-2 border-b-2 border-blue-900/10">
                                <Shield className="w-4 h-4" /> Identity Documents
                            </h4>

                            {/* PAN Section */}
                            <div className="bg-gray-50/50 p-6 rounded-2xl border border-gray-200 space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
                                    <div className="space-y-2">
                                        <label className="text-[11px] font-black text-gray-600 uppercase tracking-widest">PAN No.</label>
                                        <input type="text" name="panNo" value={formData.panNo} onChange={handleInputChange} placeholder="PAN NUMBER" className="w-full bg-white border border-gray-400/60 rounded-xl px-4 py-3 text-sm font-bold focus:outline-none focus:border-blue-900 uppercase" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[11px] font-black text-gray-600 uppercase tracking-widest">Upload PAN Card</label>
                                        <div className="border-2 border-dashed border-gray-400/60 rounded-xl p-3 text-center relative group hover:border-blue-900 transition-all bg-white">
                                            <Upload className="w-5 h-5 text-gray-400 mx-auto mb-1 group-hover:text-blue-900 transition-colors" />
                                            <p className="text-[9px] font-black uppercase text-gray-500 tracking-wider truncate px-2">{formData.panFile ? (formData.panFile as any).name : 'Select File'}</p>
                                            <input type="file" name="panFile" onChange={handleFileChange} className="absolute inset-0 opacity-0 cursor-pointer" />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Citizenship Section */}
                            <div className="bg-blue-50/30 p-6 rounded-2xl border border-blue-100 space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[11px] font-black text-gray-600 uppercase tracking-widest">Citizenship No. *</label>
                                        <input type="text" name="citizenshipNo" value={formData.citizenshipNo} onChange={handleInputChange} placeholder="CITIZENSHIP NO" className="w-full bg-white border border-gray-400/60 rounded-xl px-4 py-3 text-sm font-bold focus:outline-none focus:border-blue-900 uppercase" />
                                    </div>
                                    <DualDatePicker
                                        label="Date of Issue *"
                                        labelClassName="text-[11px] font-black text-gray-600 uppercase tracking-widest"
                                        value={formData.citizenshipIssueDate}
                                        onChange={(val: string) => handleInputChange({ target: { name: 'citizenshipIssueDate', value: val } } as any)}
                                        className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 text-sm font-bold focus:outline-none focus:border-blue-900"
                                    />
                                    <div className="space-y-2">
                                        <label className="text-[11px] font-black text-gray-600 uppercase tracking-widest">Place of Issue *</label>
                                        <input type="text" name="citizenshipIssuePlace" value={formData.citizenshipIssuePlace} onChange={handleInputChange} placeholder="DISTRICT" className="w-full bg-white border border-gray-400/60 rounded-xl px-4 py-3 text-sm font-bold focus:outline-none focus:border-blue-900 uppercase" />
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[11px] font-black text-gray-600 uppercase tracking-widest">Upload Front Side *</label>
                                        <div className="border-2 border-dashed border-gray-400/60 rounded-xl p-4 text-center relative group hover:border-blue-900 transition-all bg-white">
                                            <Upload className="w-6 h-6 text-gray-400 mx-auto mb-2 group-hover:text-blue-900 transition-colors" />
                                            <p className="text-[10px] font-black uppercase text-gray-500 tracking-wider">{formData.citizenshipFront ? (formData.citizenshipFront as any).name : 'Select Front'}</p>
                                            <input type="file" name="citizenshipFront" onChange={handleFileChange} className="absolute inset-0 opacity-0 cursor-pointer" />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[11px] font-black text-gray-600 uppercase tracking-widest">Upload Back Side *</label>
                                        <div className="border-2 border-dashed border-gray-400/60 rounded-xl p-4 text-center relative group hover:border-blue-900 transition-all bg-white">
                                            <Upload className="w-6 h-6 text-gray-400 mx-auto mb-2 group-hover:text-blue-900 transition-colors" />
                                            <p className="text-[10px] font-black uppercase text-gray-500 tracking-wider">{formData.citizenshipBack ? (formData.citizenshipBack as any).name : 'Select Back'}</p>
                                            <input type="file" name="citizenshipBack" onChange={handleFileChange} className="absolute inset-0 opacity-0 cursor-pointer" />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Other IDs (Passport, NID, Local ID) */}
                            <div className="grid grid-cols-1 gap-6">
                                {[
                                    { id: 'Passport', prefix: 'passport', label: 'Passport No.', file: 'passportFile' },
                                    { id: 'NID', prefix: 'nId', label: 'NID No.', file: 'nIdFile' },
                                    { id: 'Local ID', prefix: 'localId', label: 'Local ID No.', file: 'localIdFile' }
                                ].map((doc) => (
                                    <div key={doc.prefix} className="bg-gray-50/50 p-6 rounded-2xl border border-gray-200 space-y-4">
                                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-end">
                                            <div className="space-y-2">
                                                <label className="text-[11px] font-black text-gray-600 uppercase tracking-widest">{doc.label}</label>
                                                <input type="text" name={`${doc.prefix}No`} value={(formData as any)[`${doc.prefix}No`]} onChange={handleInputChange} placeholder={`${doc.id.toUpperCase()} NO`} className="w-full bg-white border border-gray-400/60 rounded-xl px-4 py-3 text-sm font-bold focus:outline-none focus:border-blue-900 uppercase" />
                                            </div>
                                            <div className="space-y-2 flex flex-col justify-end">
                                                <DualDatePicker
                                                    label="Date of Issue"
                                                    labelClassName="text-[11px] font-black text-gray-600 uppercase tracking-widest"
                                                    value={(formData as any)[`${doc.prefix}IssueDate`] || ''}
                                                    onChange={(val: string) => handleInputChange({ target: { name: `${doc.prefix}IssueDate`, value: val } } as any)}
                                                    className="w-full bg-white border border-gray-400/60 rounded-xl px-4 py-3 text-sm font-bold focus:outline-none focus:border-blue-900"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[11px] font-black text-gray-600 uppercase tracking-widest">Place of Issue</label>
                                                <input type="text" name={`${doc.prefix}IssuePlace`} value={(formData as any)[`${doc.prefix}IssuePlace`]} onChange={handleInputChange} placeholder="PLACE" className="w-full bg-white border border-gray-400/60 rounded-xl px-4 py-3 text-sm font-bold focus:outline-none focus:border-blue-900 uppercase" />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[11px] font-black text-gray-600 uppercase tracking-widest">Upload {doc.id}</label>
                                                <div className="border-2 border-dashed border-gray-400/60 rounded-xl p-3 text-center relative group hover:border-blue-900 transition-all bg-white">
                                                    <Upload className="w-5 h-5 text-gray-400 mx-auto mb-1 group-hover:text-blue-900 transition-colors" />
                                                    <p className="text-[9px] font-black uppercase text-gray-500 tracking-wider truncate px-2">{(formData as any)[doc.file] ? (formData as any)[doc.file].name : 'Select File'}</p>
                                                    <input type="file" name={doc.file} onChange={handleFileChange} className="absolute inset-0 opacity-0 cursor-pointer" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                );
            case 3: { // Address
                return (
                    <div className="space-y-10">
                        <AddressBlock 
                            title="Permanent Address (According to Old Citizenship)" 
                            prefix="old" 
                            formData={formData}
                            handleInputChange={handleInputChange}
                            isMailingSameAsPermanent={isMailingSameAsPermanent}
                            setIsMailingSameAsPermanent={setIsMailingSameAsPermanent}
                        />
                        <AddressBlock 
                            title="Permanent Address" 
                            prefix="permanent" 
                            formData={formData}
                            handleInputChange={handleInputChange}
                            isMailingSameAsPermanent={isMailingSameAsPermanent}
                            setIsMailingSameAsPermanent={setIsMailingSameAsPermanent}
                        />
                        <AddressBlock 
                            title="Mailing Address" 
                            prefix="mailing" 
                            formData={formData}
                            handleInputChange={handleInputChange}
                            isMailingSameAsPermanent={isMailingSameAsPermanent}
                            setIsMailingSameAsPermanent={setIsMailingSameAsPermanent}
                        />
                    </div>
                );
            }
            case 4: { // Academic Detail
                const updateAcademic = (level: string, field: string, value: any) => {
                    const updated = formData.academicDetails.map(a => a.level === level ? { ...a, [field]: value } : a);
                    setFormData(prev => ({ ...prev, academicDetails: updated }));
                };

                const ACADEMIC_LEVELS_ORDER = ['SLC/SEE', '+2/Intermediate/Diploma', 'Bachelor', 'Master', 'Master Above or Other Degree'];

                const addMoreLevel = () => {
                    const existingLevels = formData.academicDetails.map(a => a.level);
                    const nextLevel = ACADEMIC_LEVELS_ORDER.find(l => !existingLevels.includes(l));
                    if (nextLevel) {
                        setFormData(prev => ({
                            ...prev,
                            academicDetails: [...prev.academicDetails, { level: nextLevel, degree: '', passedYear: '', school: '', university: '', address: '', markGpa: '', division: '', speciality: '', markSheet: null, characterCert: null, provisionalCert: null, extraUploads: [] as (File | null)[] }]
                        }));
                    }
                };

                const hasMoreLevels = ACADEMIC_LEVELS_ORDER.some(l => !formData.academicDetails.map(a => a.level).includes(l));

                const isSLC = (level: string) => level === 'SLC/SEE';

                const renderAcademicCard = (detail: typeof formData.academicDetails[0], idx: number) => (
                    <div key={idx} className="space-y-6">
                        <h3 className="text-sm font-black text-blue-900 uppercase tracking-[0.2em] flex items-center gap-2 pb-2 border-b-2 border-blue-900/10">
                            <BookOpen className="w-4 h-4" /> {detail.level}
                        </h3>

                        {/* Level & Degree (only for non-SLC) */}
                        {!isSLC(detail.level) && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[11px] font-black text-gray-600 uppercase tracking-widest">Level *</label>
                                    <input type="text" value={detail.level} onChange={(e) => updateAcademic(detail.level, 'level', e.target.value)} className="w-full bg-gray-100/80 border border-gray-300 rounded-xl px-4 py-3 text-sm font-bold focus:outline-none focus:border-blue-900 transition-all" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[11px] font-black text-gray-600 uppercase tracking-widest">Degree *</label>
                                    <input type="text" value={detail.degree} onChange={(e) => updateAcademic(detail.level, 'degree', e.target.value)} placeholder="E.g. MBBS, Health Assistant" className="w-full bg-gray-100/80 border border-gray-300 rounded-xl px-4 py-3 text-sm font-bold focus:outline-none focus:border-blue-900 transition-all" />
                                </div>
                            </div>
                        )}

                        {/* Name of School/College + University */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                            <div className="space-y-2 md:col-span-3">
                                <label className="text-[11px] font-black text-gray-600 uppercase tracking-widest">Name of School/College *</label>
                                <input type="text" value={detail.school} onChange={(e) => updateAcademic(detail.level, 'school', e.target.value)} className="w-full bg-gray-100/80 border border-gray-300 rounded-xl px-4 py-3 text-sm font-bold focus:outline-none focus:border-blue-900 transition-all" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[11px] font-black text-gray-600 uppercase tracking-widest">University *</label>
                                <input type="text" value={detail.university} onChange={(e) => updateAcademic(detail.level, 'university', e.target.value)} className="w-full bg-gray-100/80 border border-gray-300 rounded-xl px-4 py-3 text-sm font-bold focus:outline-none focus:border-blue-900 transition-all" />
                            </div>
                        </div>

                        {/* School/College Address + Passed Year */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                            <div className="space-y-2 md:col-span-3">
                                <label className="text-[11px] font-black text-gray-600 uppercase tracking-widest">School/College Address *</label>
                                <input type="text" value={detail.address} onChange={(e) => updateAcademic(detail.level, 'address', e.target.value)} className="w-full bg-gray-100/80 border border-gray-300 rounded-xl px-4 py-3 text-sm font-bold focus:outline-none focus:border-blue-900 transition-all" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[11px] font-black text-gray-600 uppercase tracking-widest">Passed Year *</label>
                                <input type="text" value={detail.passedYear} onChange={(e) => updateAcademic(detail.level, 'passedYear', e.target.value)} placeholder="YYYY" className="w-full bg-gray-100/80 border border-gray-300 rounded-xl px-4 py-3 text-sm font-bold focus:outline-none focus:border-blue-900 transition-all" />
                            </div>
                        </div>

                        {/* Mark Obtained/GPA + Division/Grade + Speciality */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="space-y-2">
                                <label className="text-[11px] font-black text-gray-600 uppercase tracking-widest">Mark Obtained/GPA *</label>
                                <input type="text" value={detail.markGpa} onChange={(e) => updateAcademic(detail.level, 'markGpa', e.target.value)} className="w-full bg-gray-100/80 border border-gray-300 rounded-xl px-4 py-3 text-sm font-bold focus:outline-none focus:border-blue-900 transition-all" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[11px] font-black text-gray-600 uppercase tracking-widest">Division/Grade *</label>
                                <input type="text" value={detail.division} onChange={(e) => updateAcademic(detail.level, 'division', e.target.value)} className="w-full bg-gray-100/80 border border-gray-300 rounded-xl px-4 py-3 text-sm font-bold focus:outline-none focus:border-blue-900 transition-all" />
                            </div>
                            {!isSLC(detail.level) && (
                                <div className="space-y-2">
                                    <label className="text-[11px] font-black text-gray-600 uppercase tracking-widest">Speciality</label>
                                    <input type="text" value={detail.speciality} onChange={(e) => updateAcademic(detail.level, 'speciality', e.target.value)} className="w-full bg-gray-100/80 border border-gray-300 rounded-xl px-4 py-3 text-sm font-bold focus:outline-none focus:border-blue-900 transition-all" />
                                </div>
                            )}
                        </div>

                        {/* File Uploads - Dashed Square Boxes */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {[
                                { label: isSLC(detail.level) ? 'Marksheet' : 'Marksheet/Transcript', key: 'markSheet' },
                                { label: 'Character Certificate', key: 'characterCert' },
                                { label: 'Provisional Certificate', key: 'provisionalCert' },
                            ].map(upload => (
                                <div key={upload.key} className="space-y-2">
                                    <label className="text-[11px] font-black text-gray-600 uppercase tracking-widest">Upload {upload.label} *</label>
                                    <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 text-center relative group hover:border-blue-900 transition-all">
                                        <Upload className="w-6 h-6 text-gray-400 mx-auto mb-2 group-hover:text-blue-900 transition-colors" />
                                        <p className="text-[10px] font-black uppercase text-gray-500 tracking-wider">
                                            {(detail as any)[upload.key] ? (detail as any)[upload.key].name : 'Select File'}
                                        </p>
                                        <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => {
                                            if (e.target.files?.[0]) updateAcademic(detail.level, upload.key, e.target.files[0]);
                                        }} />
                                    </div>
                                </div>
                            ))}

                            {/* Extra upload boxes added by "Click Here" */}
                            {detail.extraUploads.map((file, eIdx) => (
                                <div key={`extra-${eIdx}`} className="space-y-2">
                                    <label className="text-[11px] font-black text-gray-600 uppercase tracking-widest">Additional Document {eIdx + 1}</label>
                                    <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 text-center relative group hover:border-blue-900 transition-all">
                                        <Upload className="w-6 h-6 text-gray-400 mx-auto mb-2 group-hover:text-blue-900 transition-colors" />
                                        <p className="text-[10px] font-black uppercase text-gray-500 tracking-wider">
                                            {file ? file.name : 'Select File'}
                                        </p>
                                        <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => {
                                            if (e.target.files?.[0]) {
                                                const updatedExtras = [...detail.extraUploads];
                                                updatedExtras[eIdx] = e.target.files[0];
                                                updateAcademic(detail.level, 'extraUploads', updatedExtras);
                                            }
                                        }} />
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Additional Upload Link */}
                        <p className="text-[11px] font-black text-gray-600 uppercase tracking-widest">
                            Additional Upload Please <button type="button" onClick={() => {
                                const updatedExtras = [...detail.extraUploads, null];
                                updateAcademic(detail.level, 'extraUploads', updatedExtras);
                            }} className="underline text-blue-900 hover:text-blue-700 transition-colors">Click Here</button>
                        </p>
                    </div>
                );

                return (
                    <div className="space-y-10">
                        {/* Section Banner Header */}
                        <div className="bg-blue-900 p-6 rounded-2xl text-white shadow-xl shadow-blue-900/10">
                            <h3 className="text-lg font-black uppercase tracking-tight flex items-center gap-3">
                                <BookOpen className="w-6 h-6 text-blue-300" /> Academic Detail
                            </h3>
                            <p className="text-blue-200 text-xs font-medium mt-1 uppercase tracking-widest">Starting from SLC/SEE onwards</p>
                        </div>

                        {/* Render each academic level */}
                        {formData.academicDetails.map((detail, idx) => renderAcademicCard(detail, idx))}

                        {/* Add More Button - only shows if there are more levels to add */}
                        {hasMoreLevels && (
                            <div className="pt-6 border-t border-gray-200 flex justify-center">
                                <button type="button" onClick={addMoreLevel} className="flex items-center gap-2 px-6 py-3 bg-blue-50 text-blue-900 rounded-xl font-black uppercase text-[10px] tracking-widest hover:bg-blue-100 transition-all border border-blue-100 shadow-sm">
                                    <Plus className="w-4 h-4" /> Add Higher Degree
                                </button>
                            </div>
                        )}
                    </div>
                );
            }
            case 5: // Council Registration
                return (
                    <div className="space-y-8">
                        <div className="bg-blue-900 p-6 rounded-2xl text-white shadow-xl shadow-blue-900/10">
                            <h3 className="text-lg font-black uppercase tracking-tight flex items-center gap-3">
                                <Award className="w-6 h-6 text-blue-300" /> Council Registration Detail
                            </h3>
                            <p className="text-blue-200 text-xs font-medium mt-1 uppercase tracking-widest">Provide your professional council details</p>
                        </div>

                        {/* Row 1: Council Regd. No + Type of Registration */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-[11px] font-black text-gray-600 uppercase tracking-widest">Council Regd. No. *</label>
                                <input type="text" name="councilRegNo" value={(formData as any).councilRegNo || ''} onChange={handleInputChange} className="w-full bg-white border border-gray-200 rounded-full px-5 py-3 text-sm font-bold focus:outline-none focus:border-blue-900 focus:ring-2 focus:ring-blue-900/20 transition-all uppercase" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[11px] font-black text-gray-600 uppercase tracking-widest">Type of Registration *</label>
                                <div className="relative">
                                    <select name="councilRegType" value={(formData as any).councilRegType || ''} onChange={handleInputChange} className="w-full bg-white border border-gray-200 rounded-full px-5 py-3 text-sm font-bold focus:outline-none focus:border-blue-900 focus:ring-2 focus:ring-blue-900/20 transition-all appearance-none">
                                        <option value="">Select Type</option>
                                        <option>Temporary</option>
                                        <option>Permanent</option>
                                        <option>Renewal</option>
                                    </select>
                                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                                </div>
                            </div>
                        </div>

                        {/* Row 2: Educational Qualification + Council Name */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-[11px] font-black text-gray-600 uppercase tracking-widest">Educational Qualification *</label>
                                <input type="text" name="councilEduQualification" value={(formData as any).councilEduQualification || ''} onChange={handleInputChange} className="w-full bg-white border border-gray-200 rounded-full px-5 py-3 text-sm font-bold focus:outline-none focus:border-blue-900 focus:ring-2 focus:ring-blue-900/20 transition-all uppercase" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[11px] font-black text-gray-600 uppercase tracking-widest">Council Name *</label>
                                <input type="text" name="councilName" value={(formData as any).councilName || ''} onChange={handleInputChange} className="w-full bg-white border border-gray-200 rounded-full px-5 py-3 text-sm font-bold focus:outline-none focus:border-blue-900 focus:ring-2 focus:ring-blue-900/20 transition-all uppercase" />
                            </div>
                        </div>

                        {/* Upload Council Registration Certificate */}
                        <div className="space-y-2">
                            <label className="text-[11px] font-black text-gray-600 uppercase tracking-widest">Upload Council Registration Certificate *</label>
                            <div className="border-2 border-dashed border-gray-200 hover:border-blue-900 rounded-2xl p-6 text-center relative group transition-all bg-white shadow-sm hover:shadow-md">
                                <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2 group-hover:text-blue-900 transition-colors" />
                                <p className="text-[10px] font-black uppercase text-gray-500 tracking-wider">
                                    {(formData as any).councilCert ? (formData as any).councilCert.name : 'Select File'}
                                </p>
                                <input type="file" name="councilCert" onChange={handleFileChange} className="absolute inset-0 opacity-0 cursor-pointer" />
                            </div>
                        </div>

                        {/* Additional Uploads */}
                        {((formData as any).councilExtraUploads || []).map((file: File | null, eIdx: number) => (
                            <div key={eIdx} className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <label className="text-[11px] font-black text-gray-600 uppercase tracking-widest">Additional Document #{eIdx + 1} *</label>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            const updated = ((formData as any).councilExtraUploads || []).filter((_: any, i: number) => i !== eIdx);
                                            setFormData(prev => ({ ...prev, councilExtraUploads: updated }));
                                        }}
                                        className="text-[10px] font-black uppercase text-red-600 hover:text-red-800 flex items-center gap-1 bg-red-50 hover:bg-red-100/80 px-2.5 py-1 rounded-full transition-colors border border-red-100"
                                    >
                                        <Trash2 className="w-3.5 h-3.5" /> Remove
                                    </button>
                                </div>
                                <div className="border-2 border-dashed border-gray-200 hover:border-blue-900 rounded-2xl p-6 text-center relative group transition-all bg-white shadow-sm hover:shadow-md">
                                    <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2 group-hover:text-blue-900 transition-colors" />
                                    <p className="text-[10px] font-black uppercase text-gray-500 tracking-wider truncate px-2">
                                        {file ? file.name : 'Select File'}
                                    </p>
                                    <input
                                        type="file"
                                        onChange={(e) => {
                                            if (e.target.files && e.target.files[0]) {
                                                const updated = [...((formData as any).councilExtraUploads || [])];
                                                updated[eIdx] = e.target.files[0];
                                                setFormData(prev => ({ ...prev, councilExtraUploads: updated }));
                                            }
                                        }}
                                        className="absolute inset-0 opacity-0 cursor-pointer"
                                    />
                                </div>
                            </div>
                        ))}

                        {/* Additional Upload Link */}
                        <p className="text-[11px] font-black text-gray-600 uppercase tracking-widest flex items-center gap-2">
                            Additional Upload Please <button type="button" onClick={() => {
                                const updated = [...((formData as any).councilExtraUploads || []), null];
                                setFormData(prev => ({ ...prev, councilExtraUploads: updated }));
                            }} className="underline text-blue-900 hover:text-blue-800 transition-colors font-black">Click Here</button>
                        </p>
                    </div>
                );
            case 6: { // Training Details
                const tf = formData.trainingForm;
                const updateTF = (field: string, value: string) => {
                    setFormData(prev => ({
                        ...prev,
                        trainingForm: { ...prev.trainingForm, [field]: value }
                    }));
                };
                const addTraining = () => {
                    if (!tf.name) {
                        setTrainingError('Please fill in the Training Name.');
                        return;
                    }
                    setTrainingError('');
                    setFormData(prev => {
                        const entries = [...prev.trainingEntries];
                        if (prev.trainingEditIndex >= 0) {
                            entries[prev.trainingEditIndex] = { ...tf };
                        } else {
                            entries.push({ ...tf });
                        }
                        return {
                            ...prev,
                            trainingEntries: entries,
                            trainingForm: { name: '', regNo: '', regDate: '', recognizedBy: '', district: '', municipality: '', ward: '', stateProvince: '', country: 'Nepal', startDateAD: '', startDateBS: '', endDateAD: '', endDateBS: '', durationYears: '', durationMonths: '', durationDays: '' },
                            trainingEditIndex: -1,
                        };
                    });
                };
                const editTraining = (idx: number) => {
                    setFormData(prev => ({ ...prev, trainingForm: { ...prev.trainingEntries[idx] }, trainingEditIndex: idx }));
                };
                const deleteTraining = (idx: number) => {
                    setFormData(prev => ({ ...prev, trainingEntries: prev.trainingEntries.filter((_, i) => i !== idx) }));
                };

                const inputCls = "w-full bg-gray-100/80 border border-gray-300 rounded-xl px-4 py-3 text-sm font-bold focus:outline-none focus:border-blue-900 transition-all";
                const selectCls = "w-full bg-gray-100/80 border border-gray-300 rounded-xl px-4 py-3 text-sm font-bold focus:outline-none focus:border-blue-900 transition-all appearance-none";
                const labelCls = "text-[11px] font-black text-gray-600 uppercase tracking-widest";

                return (
                    <div className="space-y-8">
                        <div className="bg-blue-900 p-6 rounded-2xl text-white shadow-xl shadow-blue-900/10">
                            <h3 className="text-lg font-black uppercase tracking-tight flex items-center gap-3">
                                <BookOpen className="w-6 h-6 text-blue-300" /> Training
                            </h3>
                            <p className="text-blue-200 text-xs font-medium mt-1 uppercase tracking-widest">Specialized trainings and certifications</p>
                        </div>

                        {/* Training Name */}
                        <div className="space-y-2">
                            <label className={labelCls}>Training Name *</label>
                            <input type="text" value={tf.name} onChange={e => {
                                updateTF('name', e.target.value);
                                if (e.target.value) setTrainingError('');
                            }} className={inputCls} />
                            {trainingError && (
                                <p className="text-xs font-bold text-red-500 mt-1 uppercase tracking-wider">{trainingError}</p>
                            )}
                        </div>

                        {/* Reg No + Date of Registration */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className={labelCls}>Training Registered No.</label>
                                <input type="text" value={tf.regNo} onChange={e => updateTF('regNo', e.target.value)} className={inputCls} />
                            </div>
                            <DualDatePicker
                                label="Date of Registration"
                                labelClassName={labelCls}
                                value={tf.regDate}
                                onChange={(val: string) => updateTF('regDate', val)}
                                className={inputCls}
                            />
                        </div>

                        {/* Training Recognized By */}
                        <div className="space-y-2">
                            <label className={labelCls}>Training Recognized By</label>
                            <input type="text" value={tf.recognizedBy} onChange={e => updateTF('recognizedBy', e.target.value)} className={inputCls} />
                        </div>

                        {/* Training Site: Country -> State/Province -> District -> Municipality -> Ward */}
                        <div className="space-y-4">
                            <label className={labelCls}>Training Site</label>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className={labelCls}>Country</label>
                                    <select value={tf.country} onChange={e => {
                                        updateTF('country', e.target.value);
                                        if (e.target.value !== 'Nepal') {
                                            updateTF('stateProvince', '');
                                            updateTF('district', '');
                                            updateTF('municipality', '');
                                            updateTF('ward', '');
                                        }
                                    }} className={selectCls}>
                                        <option>Nepal</option>
                                        <option>India</option>
                                        <option>China</option>
                                        <option>Bangladesh</option>
                                        <option>USA</option>
                                        <option>UK</option>
                                        <option>Other</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className={labelCls}>State/Province</label>
                                    {tf.country === 'Nepal' ? (
                                        <select value={tf.stateProvince} onChange={e => updateTF('stateProvince', e.target.value)} className={selectCls}>
                                            <option value="">Select Province</option>
                                            {PROVINCES.map(p => <option key={p} value={p}>{p}</option>)}
                                        </select>
                                    ) : (
                                        <input type="text" value={tf.stateProvince} onChange={e => updateTF('stateProvince', e.target.value)} className={inputCls} />
                                    )}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="space-y-2">
                                    <label className={labelCls}>District</label>
                                    {tf.country === 'Nepal' ? (
                                        <select value={tf.district} onChange={e => updateTF('district', e.target.value)} className={selectCls}>
                                            <option value="">Select District</option>
                                            {(tf.stateProvince ? DISTRICTS_BY_PROVINCE[tf.stateProvince as keyof typeof DISTRICTS_BY_PROVINCE] : Object.values(DISTRICTS_BY_PROVINCE).flat()).map(d => <option key={d} value={d}>{d}</option>)}
                                        </select>
                                    ) : (
                                        <input type="text" value={tf.district} onChange={e => updateTF('district', e.target.value)} className={inputCls} />
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <label className={labelCls}>Municipality/GP</label>
                                    {tf.country === 'Nepal' ? (
                                        <select value={tf.municipality} onChange={e => updateTF('municipality', e.target.value)} className={selectCls}>
                                            <option value="">Select Municipality</option>
                                            {GET_MUNICIPALITIES(tf.district).map(m => <option key={m} value={m}>{m}</option>)}
                                        </select>
                                    ) : (
                                        <input type="text" value={tf.municipality} onChange={e => updateTF('municipality', e.target.value)} className={inputCls} />
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <label className={labelCls}>Ward</label>
                                    {tf.country === 'Nepal' ? (
                                        <select value={tf.ward} onChange={e => updateTF('ward', e.target.value)} className={selectCls}>
                                            <option value="">Select Ward</option>
                                            {WARDS.map(w => <option key={w} value={w}>{w}</option>)}
                                        </select>
                                    ) : (
                                        <input type="text" value={tf.ward} onChange={e => updateTF('ward', e.target.value)} className={inputCls} />
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Start Date (AD + BS) + End Date (AD + BS) */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                            <div className="space-y-2">
                                <label className={labelCls}>Start Date (A.D)</label>
                                <input type="date" value={tf.startDateAD} onChange={e => updateTF('startDateAD', e.target.value)} className={inputCls} />
                            </div>
                            <div className="space-y-2">
                                <label className={labelCls}>Start Date (B.S)</label>
                                <input type="text" value={tf.startDateBS} onChange={e => updateTF('startDateBS', e.target.value)} placeholder="YYYY-MM-DD" className={inputCls} />
                            </div>
                            <div className="space-y-2">
                                <label className={labelCls}>End Date (A.D)</label>
                                <input type="date" value={tf.endDateAD} onChange={e => updateTF('endDateAD', e.target.value)} className={inputCls} />
                            </div>
                            <div className="space-y-2">
                                <label className={labelCls}>End Date (B.S)</label>
                                <input type="text" value={tf.endDateBS} onChange={e => updateTF('endDateBS', e.target.value)} placeholder="YYYY-MM-DD" className={inputCls} />
                            </div>
                        </div>

                        {/* Total Duration */}
                        <div className="flex items-center gap-4 flex-wrap">
                            <label className={labelCls}>Total Duration:</label>
                            <div className="flex items-center gap-2">
                                <input type="number" min="0" value={tf.durationYears} onChange={e => updateTF('durationYears', e.target.value)} className="w-16 bg-gray-50 border border-gray-200 rounded-xl px-3 py-3 text-sm font-bold text-center focus:outline-none focus:border-blue-900 transition-all" />
                                <span className="text-[11px] font-black text-gray-600 uppercase tracking-widest">Years</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <input type="number" min="0" value={tf.durationMonths} onChange={e => updateTF('durationMonths', e.target.value)} className="w-16 bg-gray-50 border border-gray-200 rounded-xl px-3 py-3 text-sm font-bold text-center focus:outline-none focus:border-blue-900 transition-all" />
                                <span className="text-[11px] font-black text-gray-600 uppercase tracking-widest">Months</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <input type="number" min="0" value={tf.durationDays} onChange={e => updateTF('durationDays', e.target.value)} className="w-16 bg-gray-50 border border-gray-200 rounded-xl px-3 py-3 text-sm font-bold text-center focus:outline-none focus:border-blue-900 transition-all" />
                                <span className="text-[11px] font-black text-gray-600 uppercase tracking-widest">Days</span>
                            </div>
                        </div>

                        {/* Add Button */}
                        <div className="flex justify-center pt-4">
                            <button type="button" onClick={addTraining} className="flex items-center gap-2 px-8 py-3 bg-blue-50 text-blue-900 rounded-xl font-black uppercase text-[10px] tracking-widest hover:bg-blue-100 transition-all border border-blue-100 shadow-sm">
                                <Plus className="w-4 h-4" /> {formData.trainingEditIndex >= 0 ? 'Update' : 'Add'}
                            </button>
                        </div>

                        {/* Training Entries Table */}
                        {formData.trainingEntries.length > 0 && (
                            <div className="overflow-x-auto rounded-xl border border-gray-200">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="bg-gray-100 border-b border-gray-300">
                                            <th className="px-4 py-3 text-[11px] font-black text-gray-600 uppercase tracking-widest">S.No.</th>
                                            <th className="px-4 py-3 text-[11px] font-black text-gray-600 uppercase tracking-widest">Training Name</th>
                                            <th className="px-4 py-3 text-[11px] font-black text-gray-600 uppercase tracking-widest">Recognized By</th>
                                            <th className="px-4 py-3 text-[11px] font-black text-gray-600 uppercase tracking-widest">Registration No.</th>
                                            <th className="px-4 py-3 text-[11px] font-black text-gray-600 uppercase tracking-widest">Registration Date</th>
                                            <th className="px-4 py-3 text-[11px] font-black text-gray-600 uppercase tracking-widest">Duration</th>
                                            <th className="px-4 py-3 text-[11px] font-black text-gray-600 uppercase tracking-widest">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {formData.trainingEntries.map((entry, idx) => (
                                            <tr key={idx} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                                                <td className="px-4 py-3 text-sm font-bold text-gray-700">{idx + 1}</td>
                                                <td className="px-4 py-3 text-sm font-bold text-gray-700">{entry.name}</td>
                                                <td className="px-4 py-3 text-sm font-semibold text-gray-700">{entry.recognizedBy || '-'}</td>
                                                <td className="px-4 py-3 text-sm font-semibold text-gray-700">{entry.regNo || '-'}</td>
                                                <td className="px-4 py-3 text-sm font-semibold text-gray-700">{entry.regDate || '-'}</td>
                                                <td className="px-4 py-3 text-sm font-semibold text-gray-700">
                                                    {[entry.durationYears && `${entry.durationYears}Y`, entry.durationMonths && `${entry.durationMonths}M`, entry.durationDays && `${entry.durationDays}D`].filter(Boolean).join(' ') || '-'}
                                                </td>
                                                <td className="px-4 py-3">
                                                    <div className="flex items-center gap-1.5">
                                                        <button type="button" onClick={() => editTraining(idx)} title="Edit" className="w-8 h-8 flex items-center justify-center rounded-lg bg-blue-50 text-blue-900 hover:bg-blue-100 transition-all border border-blue-100">
                                                            <Pencil className="w-3.5 h-3.5" />
                                                        </button>
                                                        <button type="button" onClick={() => deleteTraining(idx)} title="Delete" className="w-8 h-8 flex items-center justify-center rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-all border border-red-100">
                                                            <Trash2 className="w-3.5 h-3.5" />
                                                        </button>
                                                        <label title="Upload Certificate" className="w-8 h-8 flex items-center justify-center rounded-lg bg-green-50 text-green-700 hover:bg-green-100 transition-all border border-green-100 cursor-pointer">
                                                            <Upload className="w-3.5 h-3.5" />
                                                            <input type="file" className="hidden" />
                                                        </label>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                );
            }
            case 7: { // Work Experience
                const wf = formData.workForm;
                 const updateWF = (field: string, value: string) => {
                    setFormData(prev => ({
                        ...prev,
                        workForm: { ...prev.workForm, [field]: value }
                    }));
                };
                const addWork = () => {
                    if (!wf.organization) {
                        setWorkError('Please fill in the Organization name.');
                        return;
                    }
                    setWorkError('');
                    setFormData(prev => {
                        const entries = [...prev.workEntries];
                        if (prev.workEditIndex >= 0) {
                            entries[prev.workEditIndex] = { ...wf };
                        } else {
                            entries.push({ ...wf });
                        }
                        return {
                            ...prev,
                            workEntries: entries,
                            workForm: { organization: '', post: '', district: '', municipality: '', ward: '', stateProvince: '', country: 'Nepal', startDateAD: '', startDateBS: '', endDateAD: '', endDateBS: '', durationYears: '', durationMonths: '', durationDays: '' },
                            workEditIndex: -1,
                        };
                    });
                };
                const editWork = (idx: number) => {
                    setFormData(prev => ({ ...prev, workForm: { ...prev.workEntries[idx] }, workEditIndex: idx }));
                };
                const deleteWork = (idx: number) => {
                    setFormData(prev => ({ ...prev, workEntries: prev.workEntries.filter((_, i) => i !== idx) }));
                };

                const inputCls = "w-full bg-gray-100/80 border border-gray-300 rounded-xl px-4 py-3 text-sm font-bold focus:outline-none focus:border-blue-900 transition-all";
                const selectCls = "w-full bg-gray-100/80 border border-gray-300 rounded-xl px-4 py-3 text-sm font-bold focus:outline-none focus:border-blue-900 transition-all appearance-none";
                const labelCls = "text-[11px] font-black text-gray-600 uppercase tracking-widest";

                return (
                    <div className="space-y-8">
                        <div className="bg-blue-900 p-6 rounded-2xl text-white shadow-xl shadow-blue-900/10">
                            <h3 className="text-lg font-black uppercase tracking-tight flex items-center gap-3">
                                <Briefcase className="w-6 h-6 text-blue-300" /> Work Experience
                            </h3>
                            <p className="text-blue-200 text-xs font-medium mt-1 uppercase tracking-widest">Professional employment history</p>
                        </div>

                        {/* Organization Name */}
                        <div className="space-y-2">
                            <label className={labelCls}>Organization Name *</label>
                            <input type="text" value={wf.organization} onChange={e => {
                                updateWF('organization', e.target.value);
                                if (e.target.value) setWorkError('');
                            }} className={inputCls} />
                            {workError && (
                                <p className="text-xs font-bold text-red-500 mt-1 uppercase tracking-wider">{workError}</p>
                            )}
                        </div>

                        {/* Post / Designation */}
                        <div className="space-y-2">
                            <label className={labelCls}>Post / Designation *</label>
                            <input type="text" value={wf.post} onChange={e => updateWF('post', e.target.value)} className={inputCls} />
                        </div>

                        {/* Work Site Location */}
                        <div className="space-y-4">
                            <label className={labelCls}>Work Site Location</label>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className={labelCls}>Country</label>
                                    <select value={wf.country} onChange={e => {
                                        updateWF('country', e.target.value);
                                        if (e.target.value !== 'Nepal') {
                                            updateWF('stateProvince', '');
                                            updateWF('district', '');
                                            updateWF('municipality', '');
                                            updateWF('ward', '');
                                        }
                                    }} className={selectCls}>
                                        <option>Nepal</option>
                                        <option>India</option>
                                        <option>China</option>
                                        <option>Bangladesh</option>
                                        <option>USA</option>
                                        <option>UK</option>
                                        <option>Other</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className={labelCls}>State/Province</label>
                                    {wf.country === 'Nepal' ? (
                                        <select value={wf.stateProvince} onChange={e => updateWF('stateProvince', e.target.value)} className={selectCls}>
                                            <option value="">Select Province</option>
                                            {PROVINCES.map(p => <option key={p} value={p}>{p}</option>)}
                                        </select>
                                    ) : (
                                        <input type="text" value={wf.stateProvince} onChange={e => updateWF('stateProvince', e.target.value)} className={inputCls} />
                                    )}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="space-y-2">
                                    <label className={labelCls}>District</label>
                                    {wf.country === 'Nepal' ? (
                                        <select value={wf.district} onChange={e => updateWF('district', e.target.value)} className={selectCls}>
                                            <option value="">Select District</option>
                                            {(wf.stateProvince ? DISTRICTS_BY_PROVINCE[wf.stateProvince as keyof typeof DISTRICTS_BY_PROVINCE] : Object.values(DISTRICTS_BY_PROVINCE).flat()).map(d => <option key={d} value={d}>{d}</option>)}
                                        </select>
                                    ) : (
                                        <input type="text" value={wf.district} onChange={e => updateWF('district', e.target.value)} className={inputCls} />
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <label className={labelCls}>Municipality/GP</label>
                                    {wf.country === 'Nepal' ? (
                                        <select value={wf.municipality} onChange={e => updateWF('municipality', e.target.value)} className={selectCls}>
                                            <option value="">Select Municipality</option>
                                            {GET_MUNICIPALITIES(wf.district).map(m => <option key={m} value={m}>{m}</option>)}
                                        </select>
                                    ) : (
                                        <input type="text" value={wf.municipality} onChange={e => updateWF('municipality', e.target.value)} className={inputCls} />
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <label className={labelCls}>Ward</label>
                                    {wf.country === 'Nepal' ? (
                                        <select value={wf.ward} onChange={e => updateWF('ward', e.target.value)} className={selectCls}>
                                            <option value="">Select Ward</option>
                                            {WARDS.map(w => <option key={w} value={w}>{w}</option>)}
                                        </select>
                                    ) : (
                                        <input type="text" value={wf.ward} onChange={e => updateWF('ward', e.target.value)} className={inputCls} />
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Tenure Dates (AD + BS) */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                            <div className="space-y-2">
                                <label className={labelCls}>Start Date (A.D) *</label>
                                <input type="date" value={wf.startDateAD} onChange={e => updateWF('startDateAD', e.target.value)} className={inputCls} />
                            </div>
                            <div className="space-y-2">
                                <label className={labelCls}>Start Date (B.S)</label>
                                <input type="text" value={wf.startDateBS} onChange={e => updateWF('startDateBS', e.target.value)} placeholder="YYYY-MM-DD" className={inputCls} />
                            </div>
                            <div className="space-y-2">
                                <label className={labelCls}>End Date (A.D)</label>
                                <input type="date" value={wf.endDateAD} onChange={e => updateWF('endDateAD', e.target.value)} placeholder="Blank for current" className={inputCls} />
                            </div>
                            <div className="space-y-2">
                                <label className={labelCls}>End Date (B.S)</label>
                                <input type="text" value={wf.endDateBS} onChange={e => updateWF('endDateBS', e.target.value)} placeholder="YYYY-MM-DD" className={inputCls} />
                            </div>
                        </div>

                        {/* Total Duration */}
                        <div className="flex items-center gap-4 flex-wrap">
                            <label className={labelCls}>Total Duration:</label>
                            <div className="flex items-center gap-2">
                                <input type="number" min="0" value={wf.durationYears} onChange={e => updateWF('durationYears', e.target.value)} className="w-16 bg-gray-50 border border-gray-200 rounded-xl px-3 py-3 text-sm font-bold text-center focus:outline-none focus:border-blue-900 transition-all" />
                                <span className="text-[11px] font-black text-gray-600 uppercase tracking-widest">Years</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <input type="number" min="0" value={wf.durationMonths} onChange={e => updateWF('durationMonths', e.target.value)} className="w-16 bg-gray-50 border border-gray-200 rounded-xl px-3 py-3 text-sm font-bold text-center focus:outline-none focus:border-blue-900 transition-all" />
                                <span className="text-[11px] font-black text-gray-600 uppercase tracking-widest">Months</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <input type="number" min="0" value={wf.durationDays} onChange={e => updateWF('durationDays', e.target.value)} className="w-16 bg-gray-50 border border-gray-200 rounded-xl px-3 py-3 text-sm font-bold text-center focus:outline-none focus:border-blue-900 transition-all" />
                                <span className="text-[11px] font-black text-gray-600 uppercase tracking-widest">Days</span>
                            </div>
                        </div>

                        {/* Add Button */}
                        <div className="flex justify-center pt-4">
                            <button type="button" onClick={addWork} className="flex items-center gap-2 px-8 py-3 bg-blue-50 text-blue-900 rounded-xl font-black uppercase text-[10px] tracking-widest hover:bg-blue-100 transition-all border border-blue-100 shadow-sm">
                                <Plus className="w-4 h-4" /> {formData.workEditIndex >= 0 ? 'Update' : 'Add Experience'}
                            </button>
                        </div>

                        {/* Work Entries Table */}
                        {formData.workEntries.length > 0 && (
                            <div className="overflow-x-auto rounded-xl border border-gray-200">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="bg-gray-100 border-b border-gray-300">
                                            <th className="px-4 py-3 text-[11px] font-black text-gray-600 uppercase tracking-widest">S.No.</th>
                                            <th className="px-4 py-3 text-[11px] font-black text-gray-600 uppercase tracking-widest">Organization</th>
                                            <th className="px-4 py-3 text-[11px] font-black text-gray-600 uppercase tracking-widest">Post / Designation</th>
                                            <th className="px-4 py-3 text-[11px] font-black text-gray-600 uppercase tracking-widest">Duration</th>
                                            <th className="px-4 py-3 text-[11px] font-black text-gray-600 uppercase tracking-widest">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {formData.workEntries.map((entry, idx) => (
                                            <tr key={idx} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                                                <td className="px-4 py-3 text-sm font-bold text-gray-700">{idx + 1}</td>
                                                <td className="px-4 py-3 text-sm font-bold text-gray-700">{entry.organization}</td>
                                                <td className="px-4 py-3 text-sm font-semibold text-gray-700">{entry.post || '-'}</td>
                                                <td className="px-4 py-3 text-sm font-semibold text-gray-700">
                                                    {[entry.durationYears && `${entry.durationYears}Y`, entry.durationMonths && `${entry.durationMonths}M`, entry.durationDays && `${entry.durationDays}D`].filter(Boolean).join(' ') || 'Not Spec.'}
                                                </td>
                                                <td className="px-4 py-3">
                                                    <div className="flex items-center gap-1.5">
                                                        <button type="button" onClick={() => editWork(idx)} title="Edit" className="w-8 h-8 flex items-center justify-center rounded-lg bg-blue-50 text-blue-900 hover:bg-blue-100 transition-all border border-blue-100">
                                                            <Pencil className="w-3.5 h-3.5" />
                                                        </button>
                                                        <button type="button" onClick={() => deleteWork(idx)} title="Delete" className="w-8 h-8 flex items-center justify-center rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-all border border-red-100">
                                                            <Trash2 className="w-3.5 h-3.5" />
                                                        </button>
                                                        <label title="Upload Exp. Letter" className="w-8 h-8 flex items-center justify-center rounded-lg bg-green-50 text-green-700 hover:bg-green-100 transition-all border border-green-100 cursor-pointer">
                                                            <Upload className="w-3.5 h-3.5" />
                                                            <input type="file" className="hidden" />
                                                        </label>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                );
            }
            case 8: // Preview
                return (
                    <div className="space-y-8">
                        {/* Header */}
                        <div className="bg-blue-900 p-6 rounded-2xl text-white shadow-xl shadow-blue-900/10">
                            <h3 className="text-lg font-black uppercase tracking-tight flex items-center gap-3">
                                <FileText className="w-6 h-6 text-blue-300" /> Application Preview
                            </h3>
                            <p className="text-blue-200 text-xs font-medium mt-1 uppercase tracking-widest">Please review all your information before proceeding to payment.</p>
                        </div>

                        {/* Profile — photo + name fields */}
                        <div className="flex flex-col md:flex-row gap-8 items-start">
                            <div className="w-full md:w-1/3 flex flex-col items-center gap-4">
                                <div className="w-48 h-56 bg-gray-50 border-2 border-dashed border-gray-300 rounded-2xl flex flex-col items-center justify-center overflow-hidden">
                                    {formData.photo ? (
                                        <img src={URL.createObjectURL(formData.photo as unknown as Blob)} alt="Preview" className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="text-center p-4">
                                            <User className="w-10 h-10 text-gray-500 mx-auto mb-2" />
                                            <p className="text-[11px] font-black uppercase text-gray-600 tracking-wider">No Photo</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="w-full md:w-2/3 space-y-6">
                                <div className="flex flex-col md:flex-row gap-4">
                                    <div className="space-y-2 w-full md:w-[76px] shrink-0">
                                        <label className="text-[11px] font-black text-gray-600 uppercase tracking-widest">Title</label>
                                        <div className="w-full bg-gray-100/80 border border-gray-300 rounded-xl px-2 py-3 text-sm font-bold text-center">{formData.title || '—'}</div>
                                    </div>
                                    <div className="space-y-2 flex-1">
                                        <label className="text-[11px] font-black text-gray-600 uppercase tracking-widest">First Name</label>
                                        <div className="w-full bg-gray-100/80 border border-gray-300 rounded-xl px-4 py-3 text-sm font-bold uppercase">{formData.firstName || '—'}</div>
                                    </div>
                                    <div className="space-y-2 flex-1">
                                        <label className="text-[11px] font-black text-gray-600 uppercase tracking-widest">Middle Name</label>
                                        <div className="w-full bg-gray-100/80 border border-gray-300 rounded-xl px-4 py-3 text-sm font-bold uppercase">{formData.middleName || '—'}</div>
                                    </div>
                                    <div className="space-y-2 flex-1">
                                        <label className="text-[11px] font-black text-gray-600 uppercase tracking-widest">Last Name</label>
                                        <div className="w-full bg-gray-100/80 border border-gray-300 rounded-xl px-4 py-3 text-sm font-bold uppercase">{formData.lastName || '—'}</div>
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[11px] font-black text-gray-600 uppercase tracking-widest">Designation/Post</label>
                                        <div className="w-full bg-gray-100/80 border border-gray-300 rounded-xl px-4 py-3 text-sm font-bold">{formData.postApplied || '—'}</div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[11px] font-black text-gray-600 uppercase tracking-widest">Council Regd. No.</label>
                                        <div className="w-full bg-gray-100/80 border border-gray-300 rounded-xl px-4 py-3 text-sm font-bold">{(formData as any).councilRegNo || '—'}</div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[11px] font-black text-gray-600 uppercase tracking-widest">NID No.</label>
                                        <div className="w-full bg-gray-100/80 border border-gray-300 rounded-xl px-4 py-3 text-sm font-bold uppercase">
                                            {formData.nIdNo || '—'}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* General Profile Details */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-gray-200">
                            <div className="space-y-2">
                                <label className="text-[11px] font-black text-gray-600 uppercase tracking-widest">Gender</label>
                                <div className="w-full bg-gray-100/80 border border-gray-300 rounded-xl px-4 py-3 text-sm font-bold">{formData.gender || '—'}</div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[11px] font-black text-gray-600 uppercase tracking-widest">Blood Group</label>
                                <div className="w-full bg-gray-100/80 border border-gray-300 rounded-xl px-4 py-3 text-sm font-bold">{formData.bloodGroup || '—'}</div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[11px] font-black text-gray-600 uppercase tracking-widest">Religion</label>
                                <div className="w-full bg-gray-100/80 border border-gray-300 rounded-xl px-4 py-3 text-sm font-bold">{formData.religion || '—'}</div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[11px] font-black text-gray-600 uppercase tracking-widest">Nationality</label>
                                <div className="w-full bg-gray-100/80 border border-gray-300 rounded-xl px-4 py-3 text-sm font-bold">{formData.nationality || '—'}</div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[11px] font-black text-gray-600 uppercase tracking-widest">Mobile No.</label>
                                <div className="w-full bg-gray-100/80 border border-gray-300 rounded-xl px-4 py-3 text-sm font-bold">{formData.mobile || '—'}</div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[11px] font-black text-gray-600 uppercase tracking-widest">Email ID</label>
                                <div className="w-full bg-gray-100/80 border border-gray-300 rounded-xl px-4 py-3 text-sm font-bold">{formData.email || '—'}</div>
                            </div>
                        </div>

                        {/* Personal Details Summary */}
                        <div className="space-y-6 pt-6 border-t border-gray-200">
                            <label className="text-[10px] font-black text-blue-900 uppercase tracking-widest">Personal & Family Details</label>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                                <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1">
                                            <span className="text-[10px] font-black text-gray-500 uppercase">Father's Name</span>
                                            <div className="text-sm font-bold text-gray-800 uppercase">{formData.fatherName || '—'}</div>
                                        </div>
                                        <div className="space-y-1">
                                            <span className="text-[10px] font-black text-blue-900/50 uppercase">बाबुको नाम</span>
                                            <div className="text-sm font-bold text-gray-800 font-nepali">{formData.fatherNameNp || '—'}</div>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1">
                                            <span className="text-[10px] font-black text-gray-500 uppercase">Mother's Name</span>
                                            <div className="text-sm font-bold text-gray-800 uppercase">{formData.motherName || '—'}</div>
                                        </div>
                                        <div className="space-y-1">
                                            <span className="text-[10px] font-black text-blue-900/50 uppercase">आमाको नाम</span>
                                            <div className="text-sm font-bold text-gray-800 font-nepali">{formData.motherNameNp || '—'}</div>
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1">
                                            <span className="text-[10px] font-black text-gray-500 uppercase">Grandfather's Name</span>
                                            <div className="text-sm font-bold text-gray-800 uppercase">{formData.grandfatherName || '—'}</div>
                                        </div>
                                        <div className="space-y-1">
                                            <span className="text-[10px] font-black text-blue-900/50 uppercase">हजुरबुवाको नाम</span>
                                            <div className="text-sm font-bold text-gray-800 font-nepali">{formData.grandfatherNameNp || '—'}</div>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1">
                                            <span className="text-[10px] font-black text-gray-500 uppercase">Marital Status</span>
                                            <div className="text-sm font-bold text-gray-800 uppercase">{formData.maritalStatus || '—'}</div>
                                        </div>
                                        <div className="space-y-1">
                                            <span className="text-[10px] font-black text-gray-500 uppercase">Date of Birth (A.D)</span>
                                            <div className="text-sm font-bold text-gray-800">{formData.dobAD || '—'} ({formData.dobBS || '—'} B.S.)</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
                                <div className="space-y-1">
                                    <span className="text-[10px] font-black text-gray-500 uppercase">Citizenship No.</span>
                                    <div className="text-sm font-bold text-gray-800">{formData.citizenshipNo || '—'}</div>
                                </div>
                                <div className="space-y-1">
                                    <span className="text-[10px] font-black text-gray-500 uppercase">Issue Date</span>
                                    <div className="text-sm font-bold text-gray-800">{formData.citizenshipIssueDate || '—'}</div>
                                </div>
                                <div className="space-y-1">
                                    <span className="text-[10px] font-black text-gray-500 uppercase">Issue Place</span>
                                    <div className="text-sm font-bold text-gray-800 uppercase">{formData.citizenshipIssuePlace || '—'}</div>
                                </div>
                            </div>
                        </div>

                        {/* Addresses */}
                        <div className="space-y-6 pt-6 border-t border-gray-200">
                            <label className="text-[10px] font-black text-blue-900 uppercase tracking-widest">Permanent Address</label>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[11px] font-black text-gray-600 uppercase tracking-widest">Country</label>
                                    <div className="w-full bg-gray-100/80 border border-gray-300 rounded-xl px-4 py-3 text-sm font-bold">{formData.permanentCountry || '—'}</div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[11px] font-black text-gray-600 uppercase tracking-widest">Province</label>
                                    <div className="w-full bg-gray-100/80 border border-gray-300 rounded-xl px-4 py-3 text-sm font-bold">{formData.permanentProvince || '—'}</div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[11px] font-black text-gray-600 uppercase tracking-widest">District</label>
                                    <div className="w-full bg-gray-100/80 border border-gray-300 rounded-xl px-4 py-3 text-sm font-bold">{formData.permanentDistrict || '—'}</div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[11px] font-black text-gray-600 uppercase tracking-widest">Municipality/GP</label>
                                    <div className="w-full bg-gray-100/80 border border-gray-300 rounded-xl px-4 py-3 text-sm font-bold">{formData.permanentMunicipality || '—'}</div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[11px] font-black text-gray-600 uppercase tracking-widest">Ward</label>
                                    <div className="w-full bg-gray-100/80 border border-gray-300 rounded-xl px-4 py-3 text-sm font-bold">{formData.permanentWard || '—'}</div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[11px] font-black text-gray-600 uppercase tracking-widest">Village / Tole</label>
                                    <div className="w-full bg-gray-100/80 border border-gray-300 rounded-xl px-4 py-3 text-sm font-bold">{formData.permanentStreet || '—'}</div>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <label className="text-[10px] font-black text-blue-900 uppercase tracking-widest">Mailing Address</label>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[11px] font-black text-gray-600 uppercase tracking-widest">Country</label>
                                    <div className="w-full bg-gray-100/80 border border-gray-300 rounded-xl px-4 py-3 text-sm font-bold">{formData.mailingCountry || '—'}</div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[11px] font-black text-gray-600 uppercase tracking-widest">Province</label>
                                    <div className="w-full bg-gray-100/80 border border-gray-300 rounded-xl px-4 py-3 text-sm font-bold">{formData.mailingProvince || '—'}</div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[11px] font-black text-gray-600 uppercase tracking-widest">District</label>
                                    <div className="w-full bg-gray-100/80 border border-gray-300 rounded-xl px-4 py-3 text-sm font-bold">{formData.mailingDistrict || '—'}</div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[11px] font-black text-gray-600 uppercase tracking-widest">Municipality/GP</label>
                                    <div className="w-full bg-gray-100/80 border border-gray-300 rounded-xl px-4 py-3 text-sm font-bold">{formData.mailingMunicipality || '—'}</div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[11px] font-black text-gray-600 uppercase tracking-widest">Ward</label>
                                    <div className="w-full bg-gray-100/80 border border-gray-300 rounded-xl px-4 py-3 text-sm font-bold">{formData.mailingWard || '—'}</div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[11px] font-black text-gray-600 uppercase tracking-widest">Village / Tole</label>
                                    <div className="w-full bg-gray-100/80 border border-gray-300 rounded-xl px-4 py-3 text-sm font-bold">{formData.mailingStreet || '—'}</div>
                                </div>
                            </div>
                        </div>

                        {/* Academic Qualifications Table */}
                        {formData.academicDetails.length > 0 && (
                            <div className="pt-6 border-t border-gray-200">
                                <label className="text-[10px] font-black text-blue-900 uppercase tracking-widest">Academic Qualifications</label>
                                <div className="overflow-x-auto rounded-xl border border-gray-200 mt-4">
                                    <table className="w-full text-left">
                                        <thead>
                                            <tr className="bg-gray-100 border-b border-gray-300">
                                                <th className="px-4 py-3 text-[11px] font-black text-gray-600 uppercase tracking-widest">S.No.</th>
                                                <th className="px-4 py-3 text-[11px] font-black text-gray-600 uppercase tracking-widest">Level</th>
                                                <th className="px-4 py-3 text-[11px] font-black text-gray-600 uppercase tracking-widest">Degree</th>
                                                <th className="px-4 py-3 text-[11px] font-black text-gray-600 uppercase tracking-widest">Passed Year</th>
                                                <th className="px-4 py-3 text-[11px] font-black text-gray-600 uppercase tracking-widest">School/College</th>
                                                <th className="px-4 py-3 text-[11px] font-black text-gray-600 uppercase tracking-widest">University/Board</th>
                                                <th className="px-4 py-3 text-[11px] font-black text-gray-600 uppercase tracking-widest">GPA/Marks</th>
                                                <th className="px-4 py-3 text-[11px] font-black text-gray-600 uppercase tracking-widest">Division</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {formData.academicDetails.map((acd, idx) => (
                                                <tr key={idx} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                                                    <td className="px-4 py-3 text-sm font-bold text-gray-700">{idx + 1}</td>
                                                    <td className="px-4 py-3 text-sm font-bold text-gray-700">{acd.level || '—'}</td>
                                                    <td className="px-4 py-3 text-sm font-semibold text-gray-700">{acd.degree || '—'}</td>
                                                    <td className="px-4 py-3 text-sm font-semibold text-gray-700">{acd.passedYear || '—'}</td>
                                                    <td className="px-4 py-3 text-sm font-semibold text-gray-700">{acd.school || '—'}</td>
                                                    <td className="px-4 py-3 text-sm font-semibold text-gray-700">{acd.university || '—'}</td>
                                                    <td className="px-4 py-3 text-sm font-semibold text-gray-700">{acd.markGpa || '—'}</td>
                                                    <td className="px-4 py-3 text-sm font-semibold text-gray-700">{acd.division || '—'}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}

                        {/* Council Details */}
                        {((formData as any).councilRegNo || (formData as any).councilName) && (
                            <div className="pt-6 border-t border-gray-200">
                                <label className="text-[10px] font-black text-blue-900 uppercase tracking-widest">Council Registration</label>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                                    <div className="space-y-2">
                                        <label className="text-[11px] font-black text-gray-600 uppercase tracking-widest">Council Regd. No.</label>
                                        <div className="w-full bg-gray-100/80 border border-gray-300 rounded-xl px-4 py-3 text-sm font-bold uppercase">{(formData as any).councilRegNo || '—'}</div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[11px] font-black text-gray-600 uppercase tracking-widest">Type of Registration</label>
                                        <div className="w-full bg-gray-100/80 border border-gray-300 rounded-xl px-4 py-3 text-sm font-bold uppercase">{(formData as any).councilRegType || '—'}</div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[11px] font-black text-gray-600 uppercase tracking-widest">Educational Qualification</label>
                                        <div className="w-full bg-gray-100/80 border border-gray-300 rounded-xl px-4 py-3 text-sm font-bold uppercase">{(formData as any).councilEduQualification || '—'}</div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[11px] font-black text-gray-600 uppercase tracking-widest">Council Name</label>
                                        <div className="w-full bg-gray-100/80 border border-gray-300 rounded-xl px-4 py-3 text-sm font-bold uppercase">{(formData as any).councilName || '—'}</div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[11px] font-black text-gray-600 uppercase tracking-widest">Uploaded Certificate</label>
                                        <div className="w-full bg-gray-100/80 border border-gray-300 rounded-xl px-4 py-3 text-sm font-bold">{(formData as any).councilCert ? (formData as any).councilCert.name : '—'}</div>
                                    </div>
                                    {((formData as any).councilExtraUploads || []).length > 0 && (
                                        <div className="space-y-2">
                                            <label className="text-[11px] font-black text-gray-600 uppercase tracking-widest">Additional Documents</label>
                                            <div className="w-full bg-gray-100/80 border border-gray-300 rounded-xl px-4 py-3 text-sm font-bold space-y-1">
                                                {((formData as any).councilExtraUploads || []).map((file: File | null, fIdx: number) => (
                                                    <div key={fIdx}>{file ? file.name : `Doc #${fIdx + 1} (Not Uploaded)`}</div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Training Table */}
                        {formData.trainingEntries.length > 0 && (
                            <div className="pt-6 border-t border-gray-200">
                                <label className="text-[10px] font-black text-blue-900 uppercase tracking-widest">Training</label>
                                <div className="overflow-x-auto rounded-xl border border-gray-200 mt-4">
                                    <table className="w-full text-left">
                                        <thead>
                                            <tr className="bg-gray-100 border-b border-gray-300">
                                                <th className="px-4 py-3 text-[11px] font-black text-gray-600 uppercase tracking-widest">S.No.</th>
                                                <th className="px-4 py-3 text-[11px] font-black text-gray-600 uppercase tracking-widest">Training Name</th>
                                                <th className="px-4 py-3 text-[11px] font-black text-gray-600 uppercase tracking-widest">Recognized By</th>
                                                <th className="px-4 py-3 text-[11px] font-black text-gray-600 uppercase tracking-widest">Registration No.</th>
                                                <th className="px-4 py-3 text-[11px] font-black text-gray-600 uppercase tracking-widest">Start Date (A.D)</th>
                                                <th className="px-4 py-3 text-[11px] font-black text-gray-600 uppercase tracking-widest">End Date (A.D)</th>
                                                <th className="px-4 py-3 text-[11px] font-black text-gray-600 uppercase tracking-widest">Total Duration</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {formData.trainingEntries.map((entry, idx) => (
                                                <tr key={idx} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                                                    <td className="px-4 py-3 text-sm font-bold text-gray-700">{idx + 1}</td>
                                                    <td className="px-4 py-3 text-sm font-bold text-gray-700">{entry.name || '—'}</td>
                                                    <td className="px-4 py-3 text-sm font-semibold text-gray-700">{entry.recognizedBy || '—'}</td>
                                                    <td className="px-4 py-3 text-sm font-semibold text-gray-700">{entry.regNo || '—'}</td>
                                                    <td className="px-4 py-3 text-sm font-semibold text-gray-700">{entry.startDateAD || '—'}</td>
                                                    <td className="px-4 py-3 text-sm font-semibold text-gray-700">{entry.endDateAD || '—'}</td>
                                                    <td className="px-4 py-3 text-sm font-semibold text-gray-700">
                                                        {[entry.durationYears && `${entry.durationYears}Y`, entry.durationMonths && `${entry.durationMonths}M`, entry.durationDays && `${entry.durationDays}D`].filter(Boolean).join(' ') || '—'}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}

                        {/* Work Experience Table */}
                        {formData.workEntries.length > 0 && (
                            <div className="pt-6 border-t border-gray-200">
                                <label className="text-[10px] font-black text-blue-900 uppercase tracking-widest">Work Experience</label>
                                <div className="overflow-x-auto rounded-xl border border-gray-200 mt-4">
                                    <table className="w-full text-left">
                                        <thead>
                                            <tr className="bg-gray-100 border-b border-gray-300">
                                                <th className="px-4 py-3 text-[11px] font-black text-gray-600 uppercase tracking-widest">S.No.</th>
                                                <th className="px-4 py-3 text-[11px] font-black text-gray-600 uppercase tracking-widest">Organization</th>
                                                <th className="px-4 py-3 text-[11px] font-black text-gray-600 uppercase tracking-widest">Location</th>
                                                <th className="px-4 py-3 text-[11px] font-black text-gray-600 uppercase tracking-widest">Post / Designation</th>
                                                <th className="px-4 py-3 text-[11px] font-black text-gray-600 uppercase tracking-widest">Start Date (A.D)</th>
                                                <th className="px-4 py-3 text-[11px] font-black text-gray-600 uppercase tracking-widest">End Date (A.D)</th>
                                                <th className="px-4 py-3 text-[11px] font-black text-gray-600 uppercase tracking-widest">Total Duration</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {formData.workEntries.map((entry, idx) => (
                                                <tr key={idx} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                                                    <td className="px-4 py-3 text-sm font-bold text-gray-700">{idx + 1}</td>
                                                    <td className="px-4 py-3 text-sm font-bold text-gray-700">{entry.organization || '—'}</td>
                                                    <td className="px-4 py-3 text-sm font-semibold text-gray-700">{[entry.municipality, entry.district, entry.country].filter(Boolean).join(', ') || '—'}</td>
                                                    <td className="px-4 py-3 text-sm font-semibold text-gray-700">{entry.post || '—'}</td>
                                                    <td className="px-4 py-3 text-sm font-semibold text-gray-700">{entry.startDateAD || '—'}</td>
                                                    <td className="px-4 py-3 text-sm font-semibold text-gray-700">{entry.endDateAD || '—'}</td>
                                                    <td className="px-4 py-3 text-sm font-semibold text-gray-700">
                                                        {[entry.durationYears && `${entry.durationYears}Y`, entry.durationMonths && `${entry.durationMonths}M`, entry.durationDays && `${entry.durationDays}D`].filter(Boolean).join(' ') || '—'}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}

                        {/* Confirmation */}
                        <div className="bg-amber-50 border border-amber-100 p-4 rounded-xl">
                            <p className="text-[11px] text-amber-800 font-bold uppercase tracking-wider text-center">
                                ⚠️ Please verify all information above. Click <strong>Save & Continue</strong> to proceed to payment.
                            </p>
                        </div>
                    </div>
                );
            case 9: // Payment
                return (
                    <div className="space-y-8">
                        <div className="text-center">
                            <CreditCard className="w-12 h-12 text-blue-900 mx-auto mb-3" />
                            <h3 className="text-xl font-black text-blue-900 uppercase tracking-tight">Payment Verification</h3>
                            <p className="text-sm text-gray-500 font-medium mt-1">Scan the QR code or deposit to the bank account below, then upload your receipt.</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* eSewa / QR Option */}
                            <div className="bg-green-50 border border-green-100 rounded-2xl p-6 text-center space-y-4">
                                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto">
                                    <QrCode className="w-6 h-6 text-green-700" />
                                </div>
                                <h4 className="text-xs font-black text-green-900 uppercase tracking-widest">eSewa / QR Payment</h4>
                                <div className="bg-white rounded-xl p-4 mx-auto w-40 h-40 flex items-center justify-center border border-green-100">
                                    <QrCode className="w-24 h-24 text-green-800" />
                                </div>
                                <p className="text-[10px] text-green-700 font-bold uppercase tracking-wider">eSewa ID: 9841XXXXXX</p>
                            </div>

                            {/* Bank Transfer Option */}
                            <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6 space-y-4">
                                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto">
                                    <Globe className="w-6 h-6 text-blue-700" />
                                </div>
                                <h4 className="text-xs font-black text-blue-900 uppercase tracking-widest text-center">Bank Transfer</h4>
                                <div className="space-y-3 text-xs">
                                    {[
                                        { label: 'Bank Name', value: 'Nepal Bank Limited' },
                                        { label: 'Account No.', value: '0070XXXXXXXXXX' },
                                        { label: 'Account Name', value: 'Hospital Fund Account' },
                                        { label: 'Branch', value: 'Main Branch, Kathmandu' },
                                    ].map(row => (
                                        <div key={row.label} className="flex justify-between items-center py-2 border-b border-blue-100">
                                            <span className="font-black text-blue-900 uppercase tracking-widest text-[10px]">{row.label}</span>
                                            <span className="font-bold text-blue-800">{row.value}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Voucher Upload */}
                        <div className="space-y-4 pt-4 border-t border-gray-200">
                            <h4 className="text-xs font-black text-gray-700 uppercase tracking-widest">Upload Payment Voucher / Screenshot *</h4>
                            <div className="border-2 border-dashed border-gray-200 rounded-2xl p-8 text-center relative group hover:border-blue-900 transition-all">
                                <Upload className="w-10 h-10 text-gray-500 mx-auto mb-3 group-hover:text-blue-900 transition-colors" />
                                <p className="font-black text-gray-500 uppercase text-xs tracking-widest">Click to Upload Voucher</p>
                                <p className="text-[11px] text-gray-500 mt-1">PDF, JPG, PNG (Max 5MB)</p>
                                <input type="file" name="paymentVoucher" onChange={handleFileChange} className="absolute inset-0 opacity-0 cursor-pointer" accept=".pdf,.jpg,.jpeg,.png" />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                                <div className="space-y-2">
                                    <label className="text-[11px] font-black text-gray-600 uppercase tracking-widest">Transaction / Voucher No. *</label>
                                    <input type="text" name="paymentVoucherNo" onChange={handleInputChange} className="w-full bg-gray-100/80 border border-gray-300 rounded-xl px-4 py-3 text-sm font-bold focus:outline-none focus:border-blue-900 uppercase" />
                                </div>
                                <DualDatePicker
                                    label="Payment Date *"
                                    labelClassName="text-[11px] font-black text-gray-600 uppercase tracking-widest"
                                    value={(formData as any).paymentDate || ''}
                                    onChange={(val: string) => handleInputChange({ target: { name: 'paymentDate', value: val } } as any)}
                                    className="w-full bg-gray-100/80 border border-gray-300 rounded-xl px-4 py-3 text-sm font-bold focus:outline-none focus:border-blue-900"
                                />
                            </div>
                        </div>

                        <div className="bg-amber-50 border border-amber-100 p-4 rounded-xl">
                            <p className="text-[11px] text-amber-800 font-bold uppercase tracking-wider text-center">
                                ⚠️ By clicking <strong>Finish &amp; Submit</strong>, you confirm that all information is accurate and complete.
                                <br />After submission, NO edits are possible.
                            </p>
                        </div>
                    </div>
                );
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 py-20 px-4">
            <div className="max-w-5xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100 min-h-[700px] flex flex-col"
                >
                    {/* Header */}
                    <div className="bg-blue-900 p-8 text-white relative overflow-hidden flex-shrink-0">
                        <div className="relative z-10 flex justify-between items-center">
                            <div className="rounded-2xl bg-white/[0.04] px-5 py-4 ring-1 ring-white/10 backdrop-blur-[2px]">
                                <h1 className="text-3xl font-black uppercase tracking-tight leading-none text-white" style={{ color: '#ffffff' }}>
                                    Registration Portal
                                </h1>
                                <p className="text-blue-100 text-sm font-bold mt-2 uppercase tracking-widest flex items-center gap-2">
                                    <Globe className="w-4 h-4" /> Online Portal Access
                                </p>
                            </div>
                            <div className="hidden md:flex flex-col items-end rounded-2xl bg-white/[0.06] px-5 py-4 ring-1 ring-white/10 backdrop-blur-[2px]">
                                <span className="text-[10px] font-black text-blue-100 uppercase tracking-[0.2em] mb-1">Entry Year</span>
                                <span className="text-2xl font-black text-white drop-shadow-[0_2px_8px_rgba(15,23,42,0.3)]">2082 B.S.</span>
                            </div>
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-r from-white/[0.03] via-transparent to-white/[0.06]" />
                        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-400/20 rounded-full -mr-48 -mt-48 blur-3xl animate-pulse" />
                    </div>

                    <div className="p-8 flex-grow flex flex-col">
                        {renderStepHeader()}

                        <form className="space-y-8 flex-grow flex flex-col" onSubmit={(e) => e.preventDefault()}>
                            <div className="flex-grow">
                                <AnimatePresence mode="wait">
                                    <motion.div
                                        key={step}
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        {renderStepContent()}
                                    </motion.div>
                                </AnimatePresence>
                            </div>

                            {/* Navigation Buttons */}
                            <div className="flex justify-between pt-8 mt-auto border-t border-gray-200">
                                <button
                                    type="button"
                                    onClick={handleBack}
                                    disabled={step === 0}
                                    className={`px-8 py-4 rounded-2xl font-black uppercase text-xs tracking-widest flex items-center gap-2 transition-all ${step === 0 ? 'opacity-0 pointer-events-none' : 'bg-gray-200 text-gray-700 hover:bg-gray-300 hover:-translate-x-1'}`}
                                >
                                    <ArrowLeft className="w-4 h-4" /> Go Back
                                </button>
                                <button
                                    type="button"
                                    onClick={handleNext}
                                    className="px-8 py-4 bg-blue-900 text-white rounded-2xl font-black uppercase text-xs tracking-widest flex items-center gap-2 hover:bg-blue-800 transition-all hover:translate-x-1 shadow-xl shadow-blue-900/30"
                                >
                                    {step === STEPS.length - 1 ? 'Finish & Submit' : 'Save & Continue'} <ArrowRight className="w-4 h-4" />
                                </button>
                            </div>
                        </form>
                    </div>
                </motion.div>

                <p className="text-center text-gray-500 text-[11px] font-bold uppercase mt-8 tracking-[0.3em]">
                    System Security Version 5.4.1 | Powered by IT Division
                </p>
            </div>
        </div>
    );
};

export default ComplexOnlineRegistrationForm;

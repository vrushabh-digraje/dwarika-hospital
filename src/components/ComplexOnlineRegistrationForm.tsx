import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    User, Phone, Mail, MapPin,
    Upload, CheckCircle2, ArrowRight, ArrowLeft,
    BookOpen, Briefcase, Award, Globe, Shield, Info,
    QrCode, Plus, CreditCard
} from 'lucide-react';
import {
    PROVINCES, DISTRICTS_BY_PROVINCE,
    WARDS, BLOOD_GROUPS, RELIGIONS, USER_TYPES
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
    { id: 'payment', title: 'Payment', icon: CreditCard },
];

const ComplexOnlineRegistrationForm = () => {
    const [step, setStep] = useState(0);
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
        mobile: '',
        phone: '',
        email: '',
        nationality: 'Nepali',

        // Personal Details
        fatherName: '',
        motherName: '',
        grandfatherName: '',
        grandmotherName: '',
        spouseName: '',
        maritalStatus: 'Unmarried',
        dobAD: '',
        dobBS: '',
        panNo: '',
        citizenshipNo: '',
        citizenshipIssueDate: '',
        citizenshipIssuePlace: '',
        citizenshipFront: null,
        citizenshipBack: null,
        passportNo: '',
        nIdNo: '',
        localIdNo: '',

        // Address
        permanentDistrict: '',
        permanentMunicipality: '',
        permanentWard: '',
        permanentStreet: '',
        permanentProvince: '',
        currentDistrict: '',
        currentMunicipality: '',
        currentWard: '',
        currentStreet: '',
        currentProvince: '',
        mailingDistrict: '',
        mailingMunicipality: '',
        mailingWard: '',
        mailingStreet: '',
        mailingProvince: '',
        mailingForeign: '',

        // Academic Detail
        academicDetails: [
            { level: 'SLC/SEE', school: '', university: '', address: '', markGpa: '', division: '', markSheet: null, characterCert: null, provisionalCert: null }
        ]
    });

    const handleNext = () => setStep(prev => Math.min(prev + 1, STEPS.length - 1));
    const handleBack = () => setStep(prev => Math.max(prev - 1, 0));

    const renderStepHeader = () => (
        <div className="mb-12 overflow-x-auto pb-6 scrollbar-hide">
            <div className="flex items-center justify-between min-w-[700px] px-4 relative">
                {/* Progress Line */}
                <div className="absolute top-5 left-8 right-8 h-[2px] bg-gray-100 -z-0" />
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
                                    isCompleted ? 'bg-green-500 text-white hover:bg-green-600' : 'bg-white text-gray-300 border border-gray-100'
                                    } ${idx <= step ? 'cursor-pointer' : 'cursor-not-allowed'}`}
                            >
                                {isCompleted ? <CheckCircle2 className="w-6 h-6" /> : <Icon className="w-5 h-5" />}
                            </button>
                            <span className={`text-[9px] font-black uppercase mt-3 tracking-[0.15em] ${isActive ? 'text-blue-900' : isCompleted ? 'text-green-600' : 'text-gray-400'
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
                                        <QrCode className="w-8 h-8 text-gray-400 group-hover:text-blue-900" />
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
                                            <Upload className="w-10 h-10 text-gray-400 mx-auto mb-2 group-hover:text-blue-900 transition-colors" />
                                            <p className="text-[10px] font-black uppercase text-gray-500 tracking-wider">Upload Photo *</p>
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
                                <p className="text-[10px] text-center text-gray-400 font-bold uppercase">Max Size: 2MB | Format: JPG, PNG</p>
                            </div>

                            {/* Main Details */}
                            <div className="w-full md:w-2/3 space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Title *</label>
                                        <select
                                            name="title"
                                            value={formData.title}
                                            onChange={handleInputChange}
                                            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold focus:outline-none focus:border-blue-900 transition-all appearance-none"
                                        >
                                            <option>Mr.</option>
                                            <option>Mrs.</option>
                                            <option>Miss</option>
                                            <option>Dr.</option>
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">First Name *</label>
                                        <input
                                            type="text"
                                            name="firstName"
                                            value={formData.firstName}
                                            onChange={handleInputChange}
                                            placeholder="E.g. RAM"
                                            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold focus:outline-none focus:border-blue-900 transition-all uppercase"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Middle Name</label>
                                        <input
                                            type="text"
                                            name="middleName"
                                            value={formData.middleName}
                                            onChange={handleInputChange}
                                            placeholder="E.g. BAHADUR"
                                            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold focus:outline-none focus:border-blue-900 transition-all uppercase"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Last Name *</label>
                                        <input
                                            type="text"
                                            name="lastName"
                                            value={formData.lastName}
                                            onChange={handleInputChange}
                                            placeholder="E.g. SHARMA"
                                            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold focus:outline-none focus:border-blue-900 transition-all uppercase"
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

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-gray-100">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Gender *</label>
                                <div className="flex gap-4">
                                    {['Male', 'Female', 'Other'].map(g => (
                                        <button
                                            key={g}
                                            type="button"
                                            onClick={() => setFormData(prev => ({ ...prev, gender: g }))}
                                            className={`flex-1 py-3 px-2 rounded-xl text-xs font-black uppercase transition-all border ${formData.gender === g ? 'bg-blue-900 text-white border-blue-900 shadow-md' : 'bg-gray-50 text-gray-500 border-gray-200 hover:bg-gray-100'
                                                }`}
                                        >
                                            {g}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Blood Group *</label>
                                <select
                                    name="bloodGroup"
                                    value={formData.bloodGroup}
                                    onChange={handleInputChange}
                                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold focus:outline-none focus:border-blue-900 transition-all appearance-none"
                                >
                                    <option value="">Select Group</option>
                                    {BLOOD_GROUPS.map(bg => <option key={bg} value={bg}>{bg}</option>)}
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Religion *</label>
                                <select
                                    name="religion"
                                    value={formData.religion}
                                    onChange={handleInputChange}
                                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold focus:outline-none focus:border-blue-900 transition-all appearance-none"
                                >
                                    <option value="">Select Religion</option>
                                    {RELIGIONS.map(r => <option key={r} value={r}>{r}</option>)}
                                </select>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">You Are A: *</label>
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
                            </div>
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Mobile No. *</label>
                                    <div className="relative">
                                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                        <input
                                            type="tel"
                                            name="mobile"
                                            value={formData.mobile}
                                            onChange={handleInputChange}
                                            placeholder="98XXXXXXXX"
                                            className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-sm font-bold focus:outline-none focus:border-blue-900 transition-all"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Email ID *</label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            placeholder="example@mail.com"
                                            className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-sm font-bold focus:outline-none focus:border-blue-900 transition-all"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            default:
                return (
                    <div className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
                        <Award className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-gray-400 font-black uppercase tracking-widest text-sm">Step {step + 1} Under Construction</h3>
                        <p className="text-gray-400 text-xs mt-2 font-medium">Coming soon: Personal, Address, and Academic sections.</p>
                    </div>
                );
            case 3: // Address
                return (
                    <div className="space-y-10">
                        {/* Permanent Address */}
                        <div className="space-y-6">
                            <h3 className="text-sm font-black text-blue-900 uppercase tracking-[0.2em] flex items-center gap-2 pb-2 border-b-2 border-blue-900/10">
                                <MapPin className="w-4 h-4" /> Permanent Address (As per Citizenship)
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">District *</label>
                                    <select name="permanentDistrict" value={formData.permanentDistrict} onChange={handleInputChange} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold focus:outline-none focus:border-blue-900 appearance-none">
                                        <option value="">Select District</option>
                                        {Object.values(DISTRICTS_BY_PROVINCE).flat().sort().map(d => <option key={d} value={d}>{d}</option>)}
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Municipality/VDC *</label>
                                    <input type="text" name="permanentMunicipality" value={formData.permanentMunicipality} onChange={handleInputChange} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold focus:outline-none focus:border-blue-900 uppercase" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Ward No. *</label>
                                    <select name="permanentWard" value={formData.permanentWard} onChange={handleInputChange} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold focus:outline-none focus:border-blue-900 appearance-none">
                                        <option value="">Select Ward</option>
                                        {WARDS.map(w => <option key={w} value={w}>{w}</option>)}
                                    </select>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Street/Tole *</label>
                                    <input type="text" name="permanentStreet" value={formData.permanentStreet} onChange={handleInputChange} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold focus:outline-none focus:border-blue-900 uppercase" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Zone/Province *</label>
                                    <select name="permanentProvince" value={formData.permanentProvince} onChange={handleInputChange} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold focus:outline-none focus:border-blue-900 appearance-none">
                                        <option value="">Select Province</option>
                                        {PROVINCES.map(p => <option key={p} value={p}>{p}</option>)}
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Mailing Address */}
                        <div className="space-y-6 pt-4">
                            <div className="flex justify-between items-center pb-2 border-b-2 border-blue-900/10">
                                <h3 className="text-sm font-black text-blue-900 uppercase tracking-[0.2em] flex items-center gap-2">
                                    <Mail className="w-4 h-4" /> Mailing Address
                                </h3>
                                <button
                                    type="button"
                                    onClick={() => setFormData(prev => ({
                                        ...prev,
                                        mailingDistrict: prev.permanentDistrict,
                                        mailingMunicipality: prev.permanentMunicipality,
                                        mailingWard: prev.permanentWard,
                                        mailingStreet: prev.permanentStreet,
                                        mailingProvince: prev.permanentProvince
                                    }))}
                                    className="text-[10px] font-black text-blue-900 uppercase tracking-widest hover:underline"
                                >
                                    Same as Permanent?
                                </button>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">District *</label>
                                    <select name="mailingDistrict" value={formData.mailingDistrict} onChange={handleInputChange} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold focus:outline-none focus:border-blue-900 appearance-none">
                                        <option value="">Select District</option>
                                        {Object.values(DISTRICTS_BY_PROVINCE).flat().sort().map(d => <option key={d} value={d}>{d}</option>)}
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Municipality/VDC *</label>
                                    <input type="text" name="mailingMunicipality" value={formData.mailingMunicipality} onChange={handleInputChange} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold focus:outline-none focus:border-blue-900 uppercase" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Ward No. *</label>
                                    <select name="mailingWard" value={formData.mailingWard} onChange={handleInputChange} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold focus:outline-none focus:border-blue-900 appearance-none">
                                        <option value="">Select Ward</option>
                                        {WARDS.map(w => <option key={w} value={w}>{w}</option>)}
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            case 4: // Academic Detail
                const slc = formData.academicDetails.find(a => a.level === 'SLC/SEE');
                return (
                    <div className="space-y-8">
                        <div className="bg-blue-900 p-6 rounded-2xl text-white shadow-xl shadow-blue-900/10 mb-8">
                            <h3 className="text-lg font-black uppercase tracking-tight flex items-center gap-3">
                                <BookOpen className="w-6 h-6 text-blue-300" /> Academic Qualifications
                            </h3>
                            <p className="text-blue-200 text-xs font-medium mt-1 uppercase tracking-widest">Starting from SLC/SEE onwards</p>
                        </div>

                        <div className="space-y-6">
                            <h4 className="text-xs font-black text-blue-900 uppercase tracking-[0.2em] flex items-center gap-2 pb-2 border-b border-gray-100">
                                <CheckCircle2 className="w-4 h-4 text-green-500" /> SLC / SEE Details
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Name of School/College *</label>
                                    <input
                                        type="text"
                                        value={slc?.school}
                                        onChange={(e) => {
                                            const updated = formData.academicDetails.map(a => a.level === 'SLC/SEE' ? { ...a, school: e.target.value } : a);
                                            setFormData(prev => ({ ...prev, academicDetails: updated }));
                                        }}
                                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold focus:outline-none focus:border-blue-900 uppercase"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Board / University *</label>
                                    <input
                                        type="text"
                                        value={slc?.university}
                                        onChange={(e) => {
                                            const updated = formData.academicDetails.map(a => a.level === 'SLC/SEE' ? { ...a, university: e.target.value } : a);
                                            setFormData(prev => ({ ...prev, academicDetails: updated }));
                                        }}
                                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold focus:outline-none focus:border-blue-900 uppercase"
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Mark Obtained / GPA *</label>
                                    <input type="text" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold focus:outline-none focus:border-blue-900 uppercase" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Division / Grade *</label>
                                    <input type="text" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold focus:outline-none focus:border-blue-900 uppercase" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Passed Year *</label>
                                    <input type="text" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold focus:outline-none focus:border-blue-900 uppercase" placeholder="YYYY" />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
                                {['Marksheet', 'Character', 'Provisional'].map(type => (
                                    <div key={type} className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Upload {type} *</label>
                                        <div className="border-2 border-dashed border-gray-200 rounded-xl p-4 text-center relative group hover:border-blue-900 transition-all">
                                            <Upload className="w-6 h-6 text-gray-300 mx-auto mb-2 group-hover:text-blue-900" />
                                            <p className="text-[8px] font-black uppercase text-gray-400 tracking-wider">Select File</p>
                                            <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="pt-6 border-t border-gray-100 flex justify-center">
                            <button type="button" className="flex items-center gap-2 px-6 py-3 bg-blue-50 text-blue-900 rounded-xl font-black uppercase text-[10px] tracking-widest hover:bg-blue-100 transition-all border border-blue-100 shadow-sm">
                                <Plus className="w-4 h-4" /> Add Higher Degree (+2 / Diploma)
                            </button>
                        </div>
                    </div>
                );
                case 5: // Council Registration
                return (
                    <div className="space-y-6">
                        <div className="bg-blue-900 p-6 rounded-2xl text-white shadow-xl shadow-blue-900/10 mb-8">
                            <h3 className="text-lg font-black uppercase tracking-tight flex items-center gap-3">
                                <Award className="w-6 h-6 text-blue-300" /> Council Registration Details
                            </h3>
                            <p className="text-blue-200 text-xs font-medium mt-1 uppercase tracking-widest">Provide your professional council details</p>
                        </div>

                        <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Registration No. *</label>
                                    <input type="text" name="councilRegNo" onChange={handleInputChange} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold focus:outline-none focus:border-blue-900 uppercase" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Issue Date *</label>
                                    <input type="date" name="councilIssueDate" onChange={handleInputChange} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold focus:outline-none focus:border-blue-900" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Expiry Date</label>
                                    <input type="date" name="councilExpiryDate" onChange={handleInputChange} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold focus:outline-none focus:border-blue-900" />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Upload Registration Certificate *</label>
                                    <div className="border-2 border-dashed border-gray-200 rounded-xl p-4 text-center relative group hover:border-blue-900 transition-all">
                                        <Upload className="w-6 h-6 text-gray-300 mx-auto mb-2 group-hover:text-blue-900" />
                                        <p className="text-[8px] font-black uppercase text-gray-400 tracking-wider">Select File</p>
                                        <input type="file" name="councilCert" onChange={handleFileChange} className="absolute inset-0 opacity-0 cursor-pointer" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Upload Renewal Receipt</label>
                                    <div className="border-2 border-dashed border-gray-200 rounded-xl p-4 text-center relative group hover:border-blue-900 transition-all">
                                        <Upload className="w-6 h-6 text-gray-300 mx-auto mb-2 group-hover:text-blue-900" />
                                        <p className="text-[8px] font-black uppercase text-gray-400 tracking-wider">Select File</p>
                                        <input type="file" name="councilRenewal" onChange={handleFileChange} className="absolute inset-0 opacity-0 cursor-pointer" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            case 6: // Training Details
                return (
                    <div className="space-y-6">
                        <div className="bg-blue-900 p-6 rounded-2xl text-white shadow-xl shadow-blue-900/10 mb-8">
                            <h3 className="text-lg font-black uppercase tracking-tight flex items-center gap-3">
                                <BookOpen className="w-6 h-6 text-blue-300" /> Training Details
                            </h3>
                            <p className="text-blue-200 text-xs font-medium mt-1 uppercase tracking-widest">Specialized trainings and certifications</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Training Subject / Field *</label>
                                <input type="text" name="trainingSubject" onChange={handleInputChange} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold focus:outline-none focus:border-blue-900 uppercase" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Institute Name *</label>
                                <input type="text" name="trainingInstitute" onChange={handleInputChange} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold focus:outline-none focus:border-blue-900 uppercase" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Duration *</label>
                                <input type="text" name="trainingDuration" onChange={handleInputChange} placeholder="E.g. 6 months, 2 years" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold focus:outline-none focus:border-blue-900" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Year of Completion *</label>
                                <input type="text" name="trainingYear" onChange={handleInputChange} placeholder="YYYY" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold focus:outline-none focus:border-blue-900" />
                            </div>
                        </div>
                    </div>
                );
            case 7: // Work Experience
                return (
                    <div className="space-y-6">
                        <div className="bg-blue-900 p-6 rounded-2xl text-white shadow-xl shadow-blue-900/10 mb-8">
                            <h3 className="text-lg font-black uppercase tracking-tight flex items-center gap-3">
                                <Briefcase className="w-6 h-6 text-blue-300" /> Work Experience
                            </h3>
                            <p className="text-blue-200 text-xs font-medium mt-1 uppercase tracking-widest">Your professional history</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Organization Name *</label>
                                <input type="text" name="workOrganization" onChange={handleInputChange} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold focus:outline-none focus:border-blue-900 uppercase" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Designation / Post *</label>
                                <input type="text" name="workDesignation" onChange={handleInputChange} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold focus:outline-none focus:border-blue-900 uppercase" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Start Date *</label>
                                <input type="date" name="workStartDate" onChange={handleInputChange} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold focus:outline-none focus:border-blue-900" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">End Date (leave blank if current)</label>
                                <input type="date" name="workEndDate" onChange={handleInputChange} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold focus:outline-none focus:border-blue-900" />
                            </div>
                        </div>
                    </div>
                );
            case 8: // Payment
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
                        <div className="space-y-4 pt-4 border-t border-gray-100">
                            <h4 className="text-xs font-black text-gray-700 uppercase tracking-widest">Upload Payment Voucher / Screenshot *</h4>
                            <div className="border-2 border-dashed border-gray-200 rounded-2xl p-8 text-center relative group hover:border-blue-900 transition-all">
                                <Upload className="w-10 h-10 text-gray-300 mx-auto mb-3 group-hover:text-blue-900 transition-colors" />
                                <p className="font-black text-gray-500 uppercase text-xs tracking-widest">Click to Upload Voucher</p>
                                <p className="text-[10px] text-gray-400 mt-1">PDF, JPG, PNG (Max 5MB)</p>
                                <input type="file" name="paymentVoucher" onChange={handleFileChange} className="absolute inset-0 opacity-0 cursor-pointer" accept=".pdf,.jpg,.jpeg,.png" />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Transaction / Voucher No. *</label>
                                    <input type="text" name="paymentVoucherNo" onChange={handleInputChange} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold focus:outline-none focus:border-blue-900 uppercase" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Payment Date *</label>
                                    <input type="date" name="paymentDate" onChange={handleInputChange} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold focus:outline-none focus:border-blue-900" />
                                </div>
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
                                <h1 className="text-3xl font-black uppercase tracking-tight leading-none text-white drop-shadow-[0_2px_10px_rgba(15,23,42,0.35)]">
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
                            <div className="flex justify-between pt-8 mt-auto border-t border-gray-100">
                                <button
                                    type="button"
                                    onClick={handleBack}
                                    disabled={step === 0}
                                    className={`px-8 py-4 rounded-2xl font-black uppercase text-xs tracking-widest flex items-center gap-2 transition-all ${step === 0 ? 'opacity-0 pointer-events-none' : 'bg-gray-100 text-gray-500 hover:bg-gray-200 hover:-translate-x-1'
                                        }`}
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

                <p className="text-center text-gray-400 text-[10px] font-bold uppercase mt-8 tracking-[0.3em]">
                    System Security Version 5.4.1 | Powered by IT Division
                </p>
            </div>
        </div>
    );
};

export default ComplexOnlineRegistrationForm;

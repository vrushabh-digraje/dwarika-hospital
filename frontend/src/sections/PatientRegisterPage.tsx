import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    User, Lock, ArrowRight, ShieldCheck, Mail, CheckCircle2,
    Loader2, ChevronLeft, Camera, Upload, Calendar,
    Smartphone, Hash, UserCircle2, ChevronDown, Eye, EyeOff
} from 'lucide-react';
import { cn } from '../lib/utils';
import { useNavigate } from 'react-router-dom';
import { 
    PROVINCES, 
    DISTRICTS_BY_PROVINCE, 
    GET_MUNICIPALITIES, 
    WARDS 
} from '../constants/nepalData';
import DualDatePicker from '../components/DualDatePicker';

const PatientRegisterPage = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [otpSent, setOtpSent] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        firstName: '',
        middleName: '',
        lastName: '',
        photo: null as File | null,
        dob: '',
        gender: '',
        mobile: '',
        email: '',
        country: 'Nepal',
        province: '',
        district: '',
        municipality: '',
        ward: '',
        street: '',
        otp: '',
        password: '',
        confirmPassword: ''
    });

    const [errors, setErrors] = useState<Record<string, string>>({});

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[name];
                return newErrors;
            });
        }
    };

    const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.[0]) {
            setFormData(prev => ({ ...prev, photo: e.target.files![0] }));
        }
    };

    const handleSendOtp = () => {
        if (!formData.mobile && !formData.email) {
            setErrors(prev => ({ ...prev, mobile: "Enter mobile or email to receive OTP" }));
            return;
        }
        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
            setOtpSent(true);
            alert("Security code sent successfully!");
        }, 1000);
    };

    const validateForm = () => {
        const newErrors: Record<string, string> = {};
        if (!formData.firstName.trim()) newErrors.firstName = "First name required";
        if (!formData.lastName.trim()) newErrors.lastName = "Last name required";
        if (!formData.dob) newErrors.dob = "Date of birth required";
        if (!formData.gender) newErrors.gender = "Gender required";
        if (!formData.mobile.trim()) newErrors.mobile = "Mobile number required";

        if (!formData.password) {
            newErrors.password = "Password required";
        } else if (formData.password.length < 8) {
            newErrors.password = "Min 8 characters";
        }

        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = "Passwords match failed";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm()) return;

        setIsLoading(true);
        // Simulate API call for creation
        setTimeout(() => {
            setIsLoading(false);
            setIsSuccess(true);
        }, 2000);
    };

    const inputCls = "w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-full focus:outline-none focus:border-blue-600 transition-all font-bold text-[#1E293B] placeholder:text-gray-300 placeholder:font-medium text-[13px] shadow-[0_2px_4px_rgba(0,0,0,0.02)]";
    const labelCls = "text-[11px] font-black text-[#1E293B] uppercase tracking-[0.1em] mb-2.5 block";

    return (
        <div className="min-h-[calc(100vh-80px)] bg-slate-50 flex items-center justify-center p-4 py-12 lg:py-16 selection:bg-blue-900/10 selection:text-blue-900">
            <div className="max-w-6xl w-full bg-white rounded-[32px] shadow-[0_32px_80px_-20px_rgba(15,23,42,0.15)] overflow-hidden border border-gray-200 flex flex-col lg:flex-row min-h-[800px]">

                {/* Left Side: Information & Branding */}
                <div className="lg:w-[40%] bg-blue-900 p-8 lg:p-12 text-white flex flex-col justify-between relative overflow-hidden">
                    <div className="relative z-10">
                        <button
                            onClick={() => navigate('/login')}
                            className="inline-flex items-center gap-2 text-blue-200 hover:text-white transition-all mb-12 font-black uppercase tracking-widest text-[10px] group"
                        >
                            <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Sign In
                        </button>

                        <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 rounded-2xl backdrop-blur-md mb-8 border border-white/10 shadow-xl">
                            <ShieldCheck className="w-8 h-8 text-blue-300" />
                        </div>

                        <h2 className="text-4xl lg:text-5xl font-black mb-6 leading-tight uppercase tracking-tighter">
                            Create Patient <br />
                            Identity
                        </h2>

                        <p className="text-blue-200 text-lg font-medium opacity-90 max-w-sm leading-relaxed">
                            Complete our secure enrollment to access personalized digital healthcare services.
                        </p>
                    </div>

                    <div className="space-y-6 relative z-10">
                        <div className="p-6 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-sm">
                            <h4 className="text-xs font-black uppercase tracking-widest mb-4 text-blue-300">Why Register?</h4>
                            <ul className="space-y-3">
                                {[
                                    { text: "Universal Medical ID", icon: Hash },
                                    { text: "Secure Digital Vault", icon: Lock },
                                    { text: "Instant Online Reports", icon: Smartphone },
                                ].map((item, i) => (
                                    <li key={i} className="flex items-center gap-3 text-sm font-bold">
                                        <item.icon className="w-4 h-4 text-blue-400" />
                                        {item.text}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <p className="text-[10px] text-blue-400 font-black uppercase tracking-[0.3em]">
                            System Security Version 5.4.1
                        </p>
                    </div>

                    {/* Background Accents */}
                    <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-600/20 rounded-full blur-[100px]" />
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-[80px]" />
                </div>

                {/* Right Side: Step-by-Step Form */}
                <div className="lg:w-[60%] p-8 lg:p-16">
                    <AnimatePresence mode="wait">
                        {!isSuccess ? (
                            <motion.div
                                key="form-container"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.4, ease: "circOut" }}
                            >
                                <form onSubmit={handleSubmit} className="space-y-12">
                                    {/* Section 1: Basic Identity */}
                                    <section className="space-y-6">
                                        <div className="flex items-center gap-4 mb-8">
                                            <div className="h-8 w-1 bg-blue-900 rounded-full" />
                                            <h3 className="text-xl font-black uppercase tracking-tight text-gray-900">Identity & Personal Details</h3>
                                        </div>

                                        <div className="flex flex-col md:flex-row gap-8 items-center md:items-start mb-8">
                                            <div className="shrink-0 relative group">
                                                <input
                                                    type="file"
                                                    ref={fileInputRef}
                                                    onChange={handlePhotoChange}
                                                    className="hidden"
                                                    accept="image/*"
                                                />
                                                <div
                                                    onClick={() => fileInputRef.current?.click()}
                                                    className="w-32 h-40 rounded-3xl bg-gray-100 border-2 border-dashed border-gray-300 flex flex-col items-center justify-center gap-2 cursor-pointer group-hover:bg-gray-200 group-hover:border-blue-900 transition-all overflow-hidden relative"
                                                >
                                                    {formData.photo ? (
                                                        <img
                                                            src={URL.createObjectURL(formData.photo)}
                                                            alt="Preview"
                                                            className="w-full h-full object-cover"
                                                        />
                                                    ) : (
                                                        <>
                                                            <div className="p-3 bg-white rounded-2xl shadow-sm border border-gray-200 mb-2">
                                                                <Camera className="w-6 h-6 text-gray-500" />
                                                            </div>
                                                            <span className="text-[10px] font-black text-gray-500 uppercase">Add Photo</span>
                                                        </>
                                                    )}
                                                    <div className="absolute inset-0 bg-blue-900/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <Upload className="w-6 h-6 text-white" />
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                                                <div className="md:col-span-2 grid grid-cols-3 gap-4">
                                                    <div className="space-y-1">
                                                        <label className={labelCls}>First Name *</label>
                                                        <div className="relative">
                                                            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                                            <input name="firstName" value={formData.firstName} onChange={handleChange} className={inputCls} placeholder="John" />
                                                        </div>
                                                        {errors.firstName && <p className="text-red-600 text-[10px] font-bold uppercase mt-1">{errors.firstName}</p>}
                                                    </div>
                                                    <div className="space-y-1">
                                                        <label className={labelCls}>Middle Name</label>
                                                        <input name="middleName" value={formData.middleName} onChange={handleChange} className={inputCls.replace('pl-11', 'pl-4')} placeholder="P." />
                                                    </div>
                                                    <div className="space-y-1">
                                                        <label className={labelCls}>Last Name *</label>
                                                        <input name="lastName" value={formData.lastName} onChange={handleChange} className={inputCls.replace('pl-11', 'pl-4')} placeholder="Doe" />
                                                        {errors.lastName && <p className="text-red-600 text-[10px] font-bold uppercase mt-1">{errors.lastName}</p>}
                                                    </div>
                                                </div>

                                                <div className="space-y-1">
                                                    <div className="relative">
                                                        <Calendar className="absolute left-4 top-[calc(50%+16px)] -translate-y-1/2 w-4 h-4 text-gray-400 z-10 pointer-events-none" />
                                                        <DualDatePicker 
                                                            label="Date of Birth *"
                                                            labelClassName={labelCls.replace('mb-2.5', 'mb-0')}
                                                            value={formData.dob} 
                                                            onChange={(val) => setFormData(prev => ({ ...prev, dob: val }))} 
                                                            className={inputCls} 
                                                        />
                                                    </div>
                                                    {errors.dob && <p className="text-red-600 text-[10px] font-bold uppercase mt-1">{errors.dob}</p>}
                                                </div>

                                                <div className="space-y-1">
                                                    <label className={labelCls}>Gender *</label>
                                                    <div className="relative">
                                                        <UserCircle2 className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                                        <select name="gender" value={formData.gender} onChange={handleChange} className={inputCls + " appearance-none"}>
                                                            <option value="">Select Gender</option>
                                                            <option value="male">Male</option>
                                                            <option value="female">Female</option>
                                                            <option value="other">Other</option>
                                                        </select>
                                                    </div>
                                                    {errors.gender && <p className="text-red-600 text-[10px] font-bold uppercase mt-1">{errors.gender}</p>}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Section: Address */}
                                        <div className="space-y-4">
                                            <label className={labelCls}>Address</label>

                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-4">
                                                {/* Country */}
                                                <div className="relative group">
                                                    <select 
                                                        name="country" 
                                                        value={formData.country} 
                                                        onChange={handleChange} 
                                                        className={cn(inputCls, "pl-4 pr-10 appearance-none")}
                                                    >
                                                        <option value="Nepal">Nepal</option>
                                                        <option value="India">India</option>
                                                        <option value="China">China</option>
                                                        <option value="USA">USA</option>
                                                        <option value="Other">Other</option>
                                                    </select>
                                                    <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 group-hover:text-gray-900 transition-colors">
                                                        <ChevronDown className="w-4 h-4" />
                                                    </div>
                                                </div>

                                                {/* Province */}
                                                <div className="relative group">
                                                    <select 
                                                        name="province" 
                                                        value={formData.province} 
                                                        onChange={handleChange} 
                                                        className={cn(inputCls, "pl-4 pr-10 appearance-none")}
                                                    >
                                                        <option value="">Select Province</option>
                                                        {PROVINCES.map(p => <option key={p} value={p}>{p}</option>)}
                                                    </select>
                                                    <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 group-hover:text-gray-900 transition-colors">
                                                        <ChevronDown className="w-4 h-4" />
                                                    </div>
                                                </div>

                                                {/* District */}
                                                <div className="relative group">
                                                    <select 
                                                        name="district" 
                                                        value={formData.district} 
                                                        onChange={handleChange} 
                                                        className={cn(inputCls, "pl-4 pr-10 appearance-none")}
                                                        disabled={!formData.province}
                                                    >
                                                        <option value="">{formData.province ? "Select District" : "Select province first"}</option>
                                                        {formData.province && DISTRICTS_BY_PROVINCE[formData.province]?.map(d => (
                                                            <option key={d} value={d}>{d}</option>
                                                        ))}
                                                    </select>
                                                    <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 group-hover:text-gray-900 transition-colors">
                                                        <ChevronDown className="w-4 h-4" />
                                                    </div>
                                                </div>

                                                {/* Municipality */}
                                                <div className="relative group">
                                                    <select 
                                                        name="municipality" 
                                                        value={formData.municipality} 
                                                        onChange={handleChange} 
                                                        className={cn(inputCls, "pl-4 pr-10 appearance-none")}
                                                        disabled={!formData.district}
                                                    >
                                                        <option value="">{formData.district ? "Select Municipality" : "Select District first"}</option>
                                                        {formData.district && GET_MUNICIPALITIES(formData.district).map(m => (
                                                            <option key={m} value={m}>{m}</option>
                                                        ))}
                                                    </select>
                                                    <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 group-hover:text-gray-900 transition-colors">
                                                        <ChevronDown className="w-4 h-4" />
                                                    </div>
                                                </div>

                                                {/* Ward */}
                                                <div className="relative group">
                                                    <select 
                                                        name="ward" 
                                                        value={formData.ward} 
                                                        onChange={handleChange} 
                                                        className={cn(inputCls, "pl-4 pr-10 appearance-none")}
                                                    >
                                                        <option value="">Ward No.</option>
                                                        {WARDS.map(w => <option key={w} value={w}>{w}</option>)}
                                                    </select>
                                                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-300 group-hover:text-gray-900 transition-colors">
                                                        <ArrowRight className="w-3.5 h-3.5 rotate-90" />
                                                    </div>
                                                </div>

                                                {/* Village / Tole */}
                                                <div className="relative group">
                                                    <input 
                                                        name="street" 
                                                        value={formData.street} 
                                                        onChange={handleChange} 
                                                        className={cn(inputCls, "pl-4")}
                                                        placeholder="Village / Tole" 
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </section>

                                    {/* Section 2: Contact & Verification */}
                                    <section className="space-y-6">
                                        <div className="flex items-center gap-4 mb-8">
                                            <div className="h-8 w-1 bg-blue-900 rounded-full" />
                                            <h3 className="text-xl font-black uppercase tracking-tight text-gray-900">Secure Contact & Verification</h3>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-1">
                                                <label className={labelCls}>Mobile Number *</label>
                                                <div className="relative">
                                                    <Smartphone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                                    <input name="mobile" value={formData.mobile} onChange={handleChange} className={inputCls} placeholder="+977 1234567890" />
                                                </div>
                                                {errors.mobile && <p className="text-red-600 text-[10px] font-bold uppercase mt-1">{errors.mobile}</p>}
                                            </div>
                                            <div className="space-y-1">
                                                <label className={labelCls}>Email Address</label>
                                                <div className="relative">
                                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                                    <input name="email" value={formData.email} onChange={handleChange} className={inputCls} placeholder="patient@example.com" />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="p-7 bg-gray-50/50 rounded-[32px] border border-gray-100 flex flex-col md:flex-row items-center gap-6">
                                            <div className="flex-1 space-y-1 w-full">
                                                <label className={labelCls}>OTP Verification Code</label>
                                                <div className="relative">
                                                    <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                                    <input
                                                        name="otp"
                                                        value={formData.otp}
                                                        onChange={handleChange}
                                                        className={inputCls.replace('bg-gray-100/80', 'bg-white')}
                                                        placeholder="Enter 6-digit OTP"
                                                        disabled={!otpSent}
                                                    />
                                                </div>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={handleSendOtp}
                                                className="w-full md:w-auto px-8 py-3.5 bg-white border border-gray-300 rounded-full font-black uppercase tracking-widest text-[10px] text-blue-900 shadow-sm hover:bg-blue-900 hover:text-white hover:border-blue-900 transition-all active:scale-95"
                                            >
                                                {otpSent ? "Resend OTP" : "Send Account Key"}
                                            </button>
                                        </div>
                                    </section>

                                    {/* Section 3: Security */}
                                    <section className="space-y-6">
                                        <div className="flex items-center gap-4 mb-4">
                                            <div className="h-8 w-1 bg-blue-900 rounded-full" />
                                            <h3 className="text-xl font-black uppercase tracking-tight text-gray-900">Security Access</h3>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-1">
                                                <label className={labelCls}>Set Password *</label>
                                                <div className="relative">
                                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                                    <input type={showPassword ? "text" : "password"} name="password" value={formData.password} onChange={handleChange} className={inputCls + " pr-10"} placeholder="••••••••" />
                                                    <button
                                                        type="button"
                                                        onClick={() => setShowPassword(!showPassword)}
                                                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-900 focus:outline-none"
                                                    >
                                                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                                    </button>
                                                </div>
                                                {errors.password && <p className="text-red-600 text-[10px] font-bold uppercase mt-1">{errors.password}</p>}
                                            </div>
                                            <div className="space-y-1">
                                                <label className={labelCls}>Repeat Password *</label>
                                                <div className="relative">
                                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                                    <input type={showConfirmPassword ? "text" : "password"} name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} className={inputCls + " pr-10"} placeholder="••••••••" />
                                                    <button
                                                        type="button"
                                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-900 focus:outline-none"
                                                    >
                                                        {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                                    </button>
                                                </div>
                                                {errors.confirmPassword && <p className="text-red-600 text-[10px] font-bold uppercase mt-1">{errors.confirmPassword}</p>}
                                            </div>
                                        </div>
                                    </section>

                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className="w-full py-5 bg-blue-900 text-white rounded-full font-black uppercase tracking-[0.2em] text-sm shadow-xl shadow-blue-900/20 hover:bg-black transition-all flex items-center justify-center gap-3 group active:scale-[0.98] disabled:opacity-70"
                                    >
                                        {isLoading ? (
                                            <Loader2 className="w-6 h-6 animate-spin" />
                                        ) : (
                                            <>
                                                Initialize Account Creation
                                                <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                                            </>
                                        )}
                                    </button>
                                </form>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="success-screen"
                                initial={{ opacity: 0, scale: 0.9, filter: 'blur(20px)' }}
                                animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                                className="text-center py-10 lg:py-20 flex flex-col items-center"
                            >
                                <div className="w-24 h-24 rounded-[32px] bg-emerald-500 text-white flex items-center justify-center mb-10 shadow-2xl shadow-emerald-500/30">
                                    <CheckCircle2 className="w-12 h-12" />
                                </div>

                                <h1 className="text-4xl font-black text-gray-900 uppercase tracking-tighter mb-4">Registration Complete</h1>
                                <p className="text-gray-600 font-semibold mb-12 max-w-md mx-auto">
                                    Your secure medical identity has been verified and registered within our primary database.
                                </p>

                                <div className="w-full max-w-md bg-gray-50 rounded-[32px] p-8 space-y-6 border border-gray-200">
                                    <div className="flex flex-col items-center">
                                        <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Master Register Number</p>
                                        <p className="text-2xl font-black text-blue-900 tracking-widest">{Math.floor(Math.random() * 900000) + 100000}</p>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
                                        <div>
                                            <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-1">Mobile</p>
                                            <p className="text-xs font-bold text-gray-900">{formData.mobile}</p>
                                        </div>
                                        <div>
                                            <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-1">Email</p>
                                            <p className="text-xs font-bold text-gray-900 truncate px-2">{formData.email || 'N/A'}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-12 space-y-4 w-full max-w-md">
                                    <button
                                        onClick={() => navigate('/login')}
                                        className="w-full py-5 bg-blue-900 text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-blue-900/20 hover:bg-black transition-all"
                                    >
                                        Access Patient Portal
                                    </button>
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">A copy of these details has been sent via SMS</p>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

export default PatientRegisterPage;


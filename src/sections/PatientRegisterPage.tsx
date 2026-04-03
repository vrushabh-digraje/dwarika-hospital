import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Phone, Lock, ArrowRight, ShieldCheck, Mail, CheckCircle2, Loader2, ChevronLeft } from 'lucide-react';
import { cn } from '../lib/utils';
import { useNavigate } from 'react-router-dom';

const PatientRegisterPage = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: ''
    });

    const [errors, setErrors] = useState<Record<string, string>>({});

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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

    const validateForm = () => {
        const newErrors: Record<string, string> = {};
        if (!formData.fullName.trim()) newErrors.fullName = "Full name is required";
        if (!formData.email.trim()) {
            newErrors.email = "Email is required";
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = "Email is invalid";
        }
        if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
        if (!formData.password) {
            newErrors.password = "Password is required";
        } else if (formData.password.length < 6) {
            newErrors.password = "Password must be at least 6 characters";
        }
        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = "Passwords do not match";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm()) return;

        setIsLoading(true);
        // Simulate API call
        setTimeout(() => {
            setIsLoading(false);
            setIsSuccess(true);
        }, 1500);
    };

    return (
        <div className="min-h-[calc(100vh-80px)] bg-slate-50 flex items-center justify-center p-4 py-12 lg:py-20">
            <div className="max-w-5xl w-full bg-white rounded-2xl shadow-xl overflow-hidden shadow-blue-900/10 flex flex-col lg:flex-row border border-slate-100">

                {/* Visual Side */}
                <div className="lg:w-1/2 bg-[#1E3A8A] p-8 lg:p-12 text-white flex flex-col justify-between relative overflow-hidden">
                    <div className="relative z-10">
                        <button
                            onClick={() => navigate('/login')}
                            className="inline-flex items-center gap-2 text-blue-200 hover:text-white transition-colors mb-8 font-bold text-sm"
                        >
                            <ChevronLeft className="w-4 h-4" /> Back to Login
                        </button>
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 rounded-xl backdrop-blur-sm mb-8">
                            <ShieldCheck className="w-8 h-8" />
                        </div>
                        <h2 className="text-3xl lg:text-4xl font-black mb-4 leading-tight">
                            Start Your <br />
                            Health Journey
                        </h2>
                        <p className="text-blue-100 text-lg opacity-90 max-w-sm">
                            Create your account to manage appointments, access reports, and connect with your healthcare team.
                        </p>
                    </div>

                    <div className="mt-12 relative z-10">
                        <div className="flex -space-x-3 mb-4">
                            {[5, 6, 7, 8].map((i) => (
                                <div key={i} className="w-10 h-10 rounded-full border-2 border-blue-900 bg-slate-200 overflow-hidden">
                                    <img src={`https://i.pravatar.cc/100?img=${i + 20}`} alt="user" />
                                </div>
                            ))}
                            <div className="w-10 h-10 rounded-full border-2 border-blue-900 bg-blue-700 flex items-center justify-center text-[10px] font-bold">
                                40k+
                            </div>
                        </div>
                        <p className="text-sm text-blue-200">
                            Join over <span className="text-white font-bold">40,000+ patients</span> getting better care everyday.
                        </p>
                    </div>

                    {/* Decorative elements */}
                    <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-64 h-64 bg-blue-600/20 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-64 h-64 bg-blue-400/20 rounded-full blur-3xl"></div>
                </div>

                {/* Form Side */}
                <div className="lg:w-1/2 p-8 lg:p-12 text-blue-900">
                    <AnimatePresence mode="wait">
                        {!isSuccess ? (
                            <motion.div
                                key="form"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                            >
                                <div className="mb-10">
                                    <h1 className="text-2xl font-black text-slate-900 mb-2">Create Account</h1>
                                    <p className="text-slate-500 font-medium">Please enter your details to register as a patient</p>
                                </div>

                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-black text-slate-700 uppercase tracking-wider">Full Name</label>
                                        <div className="relative">
                                            <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
                                            <input
                                                name="fullName"
                                                value={formData.fullName}
                                                onChange={handleChange}
                                                type="text"
                                                className={cn(
                                                    "w-full pl-11 pr-4 py-3 bg-slate-50 border rounded-xl focus:outline-none focus:ring-2 transition-all font-medium text-slate-900",
                                                    errors.fullName ? "border-red-300 focus:ring-red-100" : "border-slate-200 focus:ring-blue-900/10 focus:border-[#1E3A8A]"
                                                )}
                                                placeholder="Enter your full name"
                                            />
                                        </div>
                                        {errors.fullName && <p className="text-red-500 text-[10px] font-bold uppercase">{errors.fullName}</p>}
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-xs font-black text-slate-700 uppercase tracking-wider">Email Address</label>
                                        <div className="relative">
                                            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
                                            <input
                                                name="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                type="email"
                                                className={cn(
                                                    "w-full pl-11 pr-4 py-3 bg-slate-50 border rounded-xl focus:outline-none focus:ring-2 transition-all font-medium text-slate-900",
                                                    errors.email ? "border-red-300 focus:ring-red-100" : "border-slate-200 focus:ring-blue-900/10 focus:border-[#1E3A8A]"
                                                )}
                                                placeholder="your@email.com"
                                            />
                                        </div>
                                        {errors.email && <p className="text-red-500 text-[10px] font-bold uppercase">{errors.email}</p>}
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-xs font-black text-slate-700 uppercase tracking-wider">Mobile Number</label>
                                        <div className="relative">
                                            <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
                                            <input
                                                name="phone"
                                                value={formData.phone}
                                                onChange={handleChange}
                                                type="tel"
                                                className={cn(
                                                    "w-full pl-11 pr-4 py-3 bg-slate-50 border rounded-xl focus:outline-none focus:ring-2 transition-all font-medium text-slate-900",
                                                    errors.phone ? "border-red-300 focus:ring-red-100" : "border-slate-200 focus:ring-blue-900/10 focus:border-[#1E3A8A]"
                                                )}
                                                placeholder="Registered mobile number"
                                            />
                                        </div>
                                        {errors.phone && <p className="text-red-500 text-[10px] font-bold uppercase">{errors.phone}</p>}
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-1.5">
                                            <label className="text-xs font-black text-slate-700 uppercase tracking-wider">Password</label>
                                            <div className="relative">
                                                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
                                                <input
                                                    name="password"
                                                    value={formData.password}
                                                    onChange={handleChange}
                                                    type="password"
                                                    className={cn(
                                                        "w-full pl-11 pr-4 py-3 bg-slate-50 border rounded-xl focus:outline-none focus:ring-2 transition-all font-medium text-slate-900",
                                                        errors.password ? "border-red-300 focus:ring-red-100" : "border-slate-200 focus:ring-blue-900/10 focus:border-[#1E3A8A]"
                                                    )}
                                                    placeholder="••••••••"
                                                />
                                            </div>
                                            {errors.password && <p className="text-red-500 text-[10px] font-bold uppercase">{errors.password}</p>}
                                        </div>

                                        <div className="space-y-1.5">
                                            <label className="text-xs font-black text-slate-700 uppercase tracking-wider">Confirm</label>
                                            <div className="relative">
                                                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
                                                <input
                                                    name="confirmPassword"
                                                    value={formData.confirmPassword}
                                                    onChange={handleChange}
                                                    type="password"
                                                    className={cn(
                                                        "w-full pl-11 pr-4 py-3 bg-slate-50 border rounded-xl focus:outline-none focus:ring-2 transition-all font-medium text-slate-900",
                                                        errors.confirmPassword ? "border-red-300 focus:ring-red-100" : "border-slate-200 focus:ring-blue-900/10 focus:border-[#1E3A8A]"
                                                    )}
                                                    placeholder="••••••••"
                                                />
                                            </div>
                                            {errors.confirmPassword && <p className="text-red-500 text-[10px] font-bold uppercase">{errors.confirmPassword}</p>}
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className="w-full py-4 bg-[#1E3A8A] text-white rounded-xl font-black shadow-lg shadow-blue-900/20 hover:bg-blue-800 transition-all flex items-center justify-center gap-2 group disabled:opacity-70 mt-4"
                                    >
                                        {isLoading ? (
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                        ) : (
                                            <>
                                                Create Account
                                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                            </>
                                        )}
                                    </button>

                                    <div className="pt-6 text-center">
                                        <p className="text-sm text-slate-500 font-medium">
                                            Already registered? <button type="button" onClick={() => navigate('/login')} className="text-[#1E3A8A] font-black hover:underline transition-all">Sign In</button>
                                        </p>
                                    </div>
                                </form>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="success"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="text-center py-12 space-y-6"
                            >
                                <div className="w-24 h-24 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
                                    <CheckCircle2 className="w-12 h-12 text-emerald-600" />
                                </div>
                                <div className="space-y-2">
                                    <h2 className="text-3xl font-black text-slate-900">Registration Successful!</h2>
                                    <p className="text-slate-500 font-medium max-w-sm mx-auto">
                                        Your medical account has been created. You can now login to manage your healthcare needs.
                                    </p>
                                </div>
                                <div className="pt-4 space-y-3">
                                    <button
                                        onClick={() => navigate('/login')}
                                        className="w-full py-4 bg-[#1E3A8A] text-white rounded-xl font-black shadow-lg shadow-blue-900/20 hover:bg-blue-800 transition-all"
                                    >
                                        Login to Portal
                                    </button>
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

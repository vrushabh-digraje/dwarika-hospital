import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Lock, Mail, ShieldCheck, UserCircle, BriefcaseMedical, User, Loader2 } from 'lucide-react';
import { postData } from '../lib/api';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [id, setId] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [userType, setUserType] = useState<'patient' | 'staff'>('patient');
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const loginData = userType === 'patient' 
                ? { email, password, rememberMe } 
                : { staffId: id, password, rememberMe };
            
            await postData('/api/auth/login', loginData);
            navigate('/');
        } catch (error) {
            console.error('Login failed:', error);
            alert('Login failed. Please check your credentials and try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-[calc(100vh-80px)] bg-slate-50 px-4 py-12 selection:bg-blue-900/10 selection:text-blue-900">
            <div className="mx-auto flex min-h-[calc(100vh-176px)] max-w-5xl items-center justify-center">
                <motion.div
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="w-full max-w-md rounded-[28px] border border-gray-300 bg-white p-8 shadow-[0_32px_80px_-20px_rgba(15,23,42,0.15)] sm:p-10"
                >
                    <div className="mb-8 text-center">
                        <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-900 border border-blue-100 shadow-sm">
                            <ShieldCheck className="h-6 w-6" />
                        </div>
                        <h1 className="text-3xl font-black tracking-tight text-gray-900 uppercase">Sign in</h1>
                        <p className="mt-2 text-sm font-semibold text-gray-600">Access your hospital workspace securely.</p>

                        <div className="mt-8 flex rounded-full bg-gray-100 p-1 border border-gray-200 relative">
                            <button
                                type="button"
                                onClick={() => setUserType('patient')}
                                className={`flex-1 flex items-center justify-center gap-2 rounded-full py-3 text-xs font-black uppercase tracking-widest transition-all duration-300 relative z-10 ${
                                    userType === 'patient' ? 'text-blue-900' : 'text-gray-500 hover:text-gray-700'
                                }`}
                            >
                                <UserCircle className="h-4 w-4" />
                                Patient
                                {userType === 'patient' && (
                                    <motion.div
                                        layoutId="activeTab"
                                        className="absolute inset-0 bg-white rounded-full shadow-md border border-gray-200 -z-10"
                                        transition={{ type: "spring", bounce: 0.15, duration: 0.5 }}
                                    />
                                )}
                            </button>
                            <button
                                type="button"
                                onClick={() => setUserType('staff')}
                                className={`flex-1 flex items-center justify-center gap-2 rounded-full py-3 text-xs font-black uppercase tracking-widest transition-all duration-300 relative z-10 ${
                                    userType === 'staff' ? 'text-blue-900' : 'text-gray-500 hover:text-gray-700'
                                }`}
                            >
                                <BriefcaseMedical className="h-4 w-4" />
                                Staff
                                {userType === 'staff' && (
                                    <motion.div
                                        layoutId="activeTab"
                                        className="absolute inset-0 bg-white rounded-full shadow-md border border-gray-200 -z-10"
                                        transition={{ type: "spring", bounce: 0.15, duration: 0.5 }}
                                    />
                                )}
                            </button>
                        </div>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-6">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={userType}
                                initial="initial"
                                animate="animate"
                                exit="exit"
                                variants={{
                                    initial: { opacity: 0 },
                                    animate: { opacity: 1, transition: { staggerChildren: 0.1 } },
                                    exit: { opacity: 0, transition: { staggerChildren: 0.05, staggerDirection: -1 } }
                                }}
                                className="space-y-5"
                            >
                                {userType === 'patient' ? (
                                    <motion.div
                                        variants={{
                                            initial: { opacity: 0, x: -20, filter: 'blur(10px)' },
                                            animate: { opacity: 1, x: 0, filter: 'blur(0px)' },
                                            exit: { opacity: 0, x: 20, filter: 'blur(10px)' }
                                        }}
                                    >
                                        <label className="mb-2.5 block text-[11px] font-black uppercase tracking-[0.2em] text-gray-700">Email Address</label>
                                        <div className="relative group">
                                            <Mail className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500 group-focus-within:text-blue-900 transition-colors" />
                                            <input
                                                type="email"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                required
                                                placeholder="name@example.com"
                                                className="w-full rounded-2xl border border-gray-300 bg-gray-100/80 py-4 pl-12 pr-4 text-sm font-bold text-gray-900 outline-none transition-all focus:bg-white focus:border-blue-900 focus:ring-4 focus:ring-blue-900/10 placeholder:text-gray-400 placeholder:font-medium"
                                            />
                                        </div>
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        variants={{
                                            initial: { opacity: 0, x: -20, filter: 'blur(10px)' },
                                            animate: { opacity: 1, x: 0, filter: 'blur(0px)' },
                                            exit: { opacity: 0, x: 20, filter: 'blur(10px)' }
                                        }}
                                    >
                                        <label className="mb-2.5 block text-[11px] font-black uppercase tracking-[0.2em] text-gray-700">Staff ID / Email</label>
                                        <div className="relative group">
                                            <User className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500 group-focus-within:text-blue-900 transition-colors" />
                                            <input
                                                type="text"
                                                value={id}
                                                onChange={(e) => setId(e.target.value)}
                                                required
                                                placeholder="Enter Staff ID or Email"
                                                className="w-full rounded-2xl border border-gray-300 bg-gray-100/80 py-4 pl-12 pr-4 text-sm font-bold text-gray-900 outline-none transition-all focus:bg-white focus:border-blue-900 focus:ring-4 focus:ring-blue-900/10 placeholder:text-gray-400 placeholder:font-medium"
                                            />
                                        </div>
                                    </motion.div>
                                )}

                                <motion.div
                                    variants={{
                                        initial: { opacity: 0, x: -20, filter: 'blur(10px)' },
                                        animate: { opacity: 1, x: 0, filter: 'blur(0px)' },
                                        exit: { opacity: 0, x: 20, filter: 'blur(10px)' }
                                    }}
                                >
                                    <label className="mb-2.5 block text-[11px] font-black uppercase tracking-[0.2em] text-gray-700">Password</label>
                                    <div className="relative group">
                                        <Lock className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500 group-focus-within:text-blue-900 transition-colors" />
                                        <input
                                            type="password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            required
                                            placeholder="••••••••"
                                            className="w-full rounded-2xl border border-gray-300 bg-gray-100/80 py-4 pl-12 pr-4 text-sm font-bold text-gray-900 outline-none transition-all focus:bg-white focus:border-blue-900 focus:ring-4 focus:ring-blue-900/10 placeholder:text-gray-400 placeholder:font-medium"
                                        />
                                    </div>
                                </motion.div>

                                <motion.div
                                    variants={{
                                        initial: { opacity: 0, y: 10 },
                                        animate: { opacity: 1, y: 0 },
                                        exit: { opacity: 0, y: 10 }
                                    }}
                                    className="flex items-center justify-between gap-4 pt-1"
                                >
                                    <label className="flex items-center gap-2.5 text-xs font-bold text-gray-600 cursor-pointer group">
                                        <input
                                            type="checkbox"
                                            checked={rememberMe}
                                            onChange={(e) => setRememberMe(e.target.checked)}
                                            className="h-4.5 w-4.5 rounded border-gray-300 text-blue-900 focus:ring-blue-900/20 transition-all cursor-pointer"
                                        />
                                        <span className="group-hover:text-gray-900 transition-colors">Remember me</span>
                                    </label>

                                    <button type="button" className="text-xs font-black uppercase tracking-widest text-blue-900 hover:text-blue-700 transition-colors">
                                        Forgot password?
                                    </button>
                                </motion.div>

                                <motion.button
                                    variants={{
                                        initial: { opacity: 0, scale: 0.95 },
                                        animate: { opacity: 1, scale: 1 },
                                        exit: { opacity: 0, scale: 0.95 }
                                    }}
                                    type="submit"
                                    disabled={isLoading}
                                    className="flex w-full items-center justify-center gap-3 rounded-2xl bg-blue-900 px-5 py-4 text-sm font-black uppercase tracking-widest text-white transition-all hover:bg-black hover:shadow-2xl hover:shadow-blue-900/20 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70 group"
                                >
                                    {isLoading ? (
                                        <Loader2 className="h-5 w-5 animate-spin" />
                                    ) : (
                                        <motion.span 
                                            key={userType}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="flex items-center gap-2"
                                        >
                                            {userType === 'patient' ? 'Sign In' : 'Login to Workplace'}
                                            <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                                        </motion.span>
                                    )}
                                </motion.button>
                            </motion.div>
                        </AnimatePresence>
                    </form>

                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className="mt-10 border-t border-gray-200 pt-8 text-center space-y-4"
                    >
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={userType}
                                initial={{ opacity: 0, y: 5 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -5 }}
                            >
                                {userType === 'staff' ? (
                                    <div className="space-y-2">
                                        <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Authorized Access Only</p>
                                        <button
                                            onClick={() => navigate('/online-form')}
                                            className="inline-flex items-center gap-2 text-sm font-black text-blue-900 hover:text-blue-700 transition-all group"
                                        >
                                            Need to complete registration form?
                                            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                        </button>
                                    </div>
                                ) : (
                                    <div className="space-y-2">
                                        <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Don't have an account?</p>
                                        <button
                                            onClick={() => navigate('/register')}
                                            className="inline-flex items-center gap-2 text-sm font-black text-blue-900 hover:text-blue-700 transition-all group"
                                        >
                                            New Patient Register
                                            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                        </button>
                                    </div>
                                )}
                            </motion.div>
                        </AnimatePresence>
                    </motion.div>
                </motion.div>
            </div>
        </div>
    );
};

export default LoginPage;


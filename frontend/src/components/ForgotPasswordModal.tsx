import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Send, ArrowLeft, Loader2 } from 'lucide-react';
import Button from './Button';
import { postData } from '../lib/api';

interface ForgotPasswordModalProps {
    isOpen: boolean;
    onClose: () => void;
    onLoginClick: () => void;
}

const ForgotPasswordModal = ({ isOpen, onClose, onLoginClick }: ForgotPasswordModalProps) => {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isSent, setIsSent] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return;
        
        setIsLoading(true);
        try {
            await postData('/api/auth/forgot-password', { email });
            setIsSent(true);
        } catch (error) {
            console.error('Forgot password request failed:', error);
            alert('Failed to send reset link. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/50 z-[60] backdrop-blur-sm"
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white rounded-2xl shadow-2xl z-[70] overflow-hidden"
                    >
                        <div className="p-6 bg-blue-900 text-white flex justify-between items-center">
                            <div>
                                <h2 className="text-xl font-black uppercase tracking-wide">Reset Password</h2>
                                <p className="text-xs text-blue-200 mt-1">Recover access to your account</p>
                            </div>
                            <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="p-8">
                            {!isSent ? (
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <p className="text-sm text-gray-600">
                                        Enter your email address and we'll send you a link to reset your password.
                                    </p>
                                    
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Email Address</label>
                                        <div className="relative">
                                            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                                                <Mail className="w-5 h-5" />
                                            </div>
                                            <input
                                                type="email"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-900 focus:ring-2 focus:ring-blue-900/20 transition-all text-sm font-medium"
                                                placeholder="Enter your email"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <Button
                                        type="submit"
                                        disabled={isLoading}
                                        className="w-full py-3 rounded-xl font-bold shadow-lg shadow-blue-900/20 flex items-center justify-center gap-2 bg-blue-900 hover:bg-blue-800 text-white"
                                    >
                                        {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                                        {isLoading ? "Sending Link..." : "Send Reset Link"}
                                    </Button>
                                </form>
                            ) : (
                                <div className="text-center space-y-6">
                                    <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto">
                                        <Mail className="w-8 h-8" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-black text-gray-900 mb-2">Check your email</h3>
                                        <p className="text-sm text-gray-600">
                                            We have sent a password reset link to <span className="font-bold text-gray-800">{email}</span>.
                                        </p>
                                    </div>
                                    <Button
                                        onClick={onClose}
                                        className="w-full py-3 rounded-xl font-bold bg-gray-100 text-gray-700 hover:bg-gray-200"
                                    >
                                        Close
                                    </Button>
                                </div>
                            )}

                            <div className="mt-6 text-center border-t border-gray-100 pt-6">
                                <button 
                                    onClick={onLoginClick} 
                                    className="text-blue-900 font-bold hover:underline flex items-center justify-center gap-2 mx-auto text-sm"
                                >
                                    <ArrowLeft className="w-4 h-4" /> Back to Login
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default ForgotPasswordModal;
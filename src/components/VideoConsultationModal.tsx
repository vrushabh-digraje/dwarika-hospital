import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, Phone, Calendar, Video, Loader2 } from 'lucide-react';
import Button from './Button';
import { postData } from '../lib/api';
import DualDatePicker from './DualDatePicker';

interface VideoConsultationModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const VideoConsultationModal = ({ isOpen, onClose }: VideoConsultationModalProps) => {
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        date: '',
        reason: ''
    });
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await postData('/video-consultations', formData);
            console.log('Video consultation requested:', formData);
            alert('Video consultation request sent! We will contact you with the meeting link.');
            onClose();
            setFormData({ name: '', phone: '', date: '', reason: '' });
        } catch (error) {
            console.error('Request failed:', error);
            alert('Failed to submit request.');
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
                        className="fixed inset-0 bg-black/60 z-[60] backdrop-blur-sm"
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white rounded-2xl shadow-2xl z-[70] overflow-hidden"
                    >
                        <div className="p-6 bg-blue-900 text-white flex justify-between items-center">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-white/10 rounded-lg">
                                    <Video className="w-6 h-6" />
                                </div>
                                <div>
                                    <h2 className="text-lg font-black uppercase tracking-wide">Video Consultation</h2>
                                    <p className="text-xs text-blue-200">Book a secure online session</p>
                                </div>
                            </div>
                            <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="p-8">
                            <form onSubmit={handleSubmit} className="space-y-5">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Patient Name</label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-900 focus:ring-2 focus:ring-blue-900/20 transition-all text-sm font-medium"
                                            placeholder="Enter full name"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Phone Number</label>
                                    <div className="relative">
                                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-900 focus:ring-2 focus:ring-blue-900/20 transition-all text-sm font-medium"
                                            placeholder="Enter phone number"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <div className="relative">
                                        <Calendar className="absolute left-3 top-[calc(50%+14px)] -translate-y-1/2 w-5 h-5 text-gray-400 z-10 pointer-events-none" />
                                        <DualDatePicker
                                            label="Preferred Date"
                                            labelClassName="text-xs font-bold text-gray-500 uppercase tracking-wider"
                                            value={formData.date}
                                            onChange={(val) => setFormData(prev => ({ ...prev, date: val }))}
                                            className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-900 focus:ring-2 focus:ring-blue-900/20 transition-all text-sm font-medium"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Reason for Consultation</label>
                                    <textarea
                                        name="reason"
                                        value={formData.reason}
                                        onChange={handleChange}
                                        rows={3}
                                        className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-900 focus:ring-2 focus:ring-blue-900/20 transition-all text-sm font-medium resize-none"
                                        placeholder="Briefly describe your symptoms..."
                                        required
                                    />
                                </div>

                                <Button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full py-3.5 rounded-xl font-bold shadow-lg shadow-blue-900/20 flex items-center justify-center gap-2 bg-blue-900 hover:bg-blue-800 text-white transition-all hover:-translate-y-0.5"
                                >
                                    {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Video className="w-5 h-5" />}
                                    {isLoading ? "Booking..." : "Request Video Call"}
                                </Button>
                            </form>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default VideoConsultationModal;
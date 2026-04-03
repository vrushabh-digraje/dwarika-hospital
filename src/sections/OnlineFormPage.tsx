import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { User, Phone, Mail, FileText, Send, Loader2, MapPin, Calendar, Users as GenderIcon, ArrowLeft, FileUp } from 'lucide-react';
import Button from '../components/Button';

const OnlineFormPage = () => {
    const [formData, setFormData] = useState({
        name: '',
        address: '',
        phone: '',
        email: '',
        dob: '',
        gender: 'Select Gender',
        patientId: '',
        subject: 'General Inquiry',
        message: '',
    });
    const [attachment, setAttachment] = useState<File | null>(null);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        if (e.target.type === 'file') {
            const fileInput = e.target as HTMLInputElement;
            setAttachment(fileInput.files && fileInput.files.length > 0 ? fileInput.files[0] : null);
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setUploadProgress(0);
        try {
            const dataToSubmit = new FormData();
            Object.entries(formData).forEach(([key, value]) => dataToSubmit.append(key, value));
            if (attachment) {
                dataToSubmit.append('attachment', attachment);
            }

            // In a real app, you would send `dataToSubmit` to your server.
            // The current `postData` is a mock and might not support FormData.
            // await postData('/api/inquiry', dataToSubmit);

            for (let i = 0; i <= 100; i += 5) {
                setUploadProgress(i);
                await new Promise(resolve => setTimeout(resolve, 50)); // Simulate upload progress
            }

            alert('Form submitted successfully!');
            setFormData({
                name: '',
                address: '',
                phone: '',
                email: '',
                dob: '',
                gender: 'Select Gender',
                patientId: '',
                subject: 'General Inquiry',
                message: '',
            });
            setAttachment(null);
            setUploadProgress(0);
        } catch (error) {
            console.error('Form submission failed:', error);
            alert('Failed to submit form. Please try again.');
        } finally {
            setIsLoading(false);
            setUploadProgress(0);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-20">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white p-8 sm:p-12 rounded-2xl shadow-xl max-w-2xl w-full border border-gray-100"
            >
                <div className="text-center mb-10">
                    <FileText className="w-12 h-12 mx-auto text-blue-900 mb-4" />
                    <h1 className="text-3xl font-black text-blue-900 uppercase tracking-tight">
                        Online Registration Form
                    </h1>
                    <p className="text-gray-500 mt-2 font-medium">
                        Submit your inquiries or feedback directly to our team.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Full Name</label>
                        <div className="relative">
                            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                                <User className="w-5 h-5" />
                            </div>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-900 focus:ring-2 focus:ring-blue-900/20 transition-all text-sm font-medium"
                                placeholder="Enter your full name"
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Address</label>
                        <div className="relative">
                            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                                <MapPin className="w-5 h-5" />
                            </div>
                            <input
                                type="text"
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-900 focus:ring-2 focus:ring-blue-900/20 transition-all text-sm font-medium"
                                placeholder="Enter your address"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Phone Number</label>
                            <div className="relative">
                                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                                    <Phone className="w-5 h-5" />
                                </div>
                                <input
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-900 focus:ring-2 focus:ring-blue-900/20 transition-all text-sm font-medium"
                                    placeholder="Phone number"
                                    required
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Email (Optional)</label>
                            <div className="relative">
                                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                                    <Mail className="w-5 h-5" />
                                </div>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-900 focus:ring-2 focus:ring-blue-900/20 transition-all text-sm font-medium"
                                    placeholder="Email address"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Date of Birth</label>
                            <div className="relative">
                                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                                    <Calendar className="w-5 h-5" />
                                </div>
                                <input
                                    type="date"
                                    name="dob"
                                    value={formData.dob}
                                    onChange={handleChange}
                                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-900 focus:ring-2 focus:ring-blue-900/20 transition-all text-sm font-medium"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Gender</label>
                            <div className="relative">
                                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                                    <GenderIcon className="w-5 h-5" />
                                </div>
                                <select
                                    name="gender"
                                    value={formData.gender}
                                    onChange={handleChange}
                                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-900 focus:ring-2 focus:ring-blue-900/20 transition-all text-sm font-medium appearance-none"
                                >
                                    <option disabled>Select Gender</option>
                                    <option>Male</option>
                                    <option>Female</option>
                                    <option>Other</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Patient ID (Optional)</label>
                        <div className="relative">
                            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                                <User className="w-5 h-5" />
                            </div>
                            <input
                                type="text"
                                name="patientId"
                                value={formData.patientId}
                                onChange={handleChange}
                                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-900 focus:ring-2 focus:ring-blue-900/20 transition-all text-sm font-medium"
                                placeholder="Existing Patient ID"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Attach File (Optional)</label>
                        <div className="relative flex items-center justify-center w-full h-32 px-4 py-3 bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl hover:border-blue-900 transition-all text-sm font-medium">
                            <input
                                type="file"
                                name="attachment"
                                onChange={handleChange}
                                className={`absolute inset-0 w-full h-full opacity-0 cursor-pointer ${isLoading ? 'pointer-events-none' : ''}`}
                                disabled={isLoading}
                            />
                            {!attachment ? (
                                <div className="text-center text-gray-500 pointer-events-none">
                                    <FileUp className="w-8 h-8 mx-auto mb-2" />
                                    <p className="font-bold">Click to upload a file</p>
                                    <p className="text-xs">PDF, DOC, JPG, PNG (max 5MB)</p>
                                </div>
                            ) : (
                                <div className="text-center text-blue-900 font-bold w-full px-4">
                                    <p>{attachment.name}</p>
                                    <p className="text-xs text-gray-500">{(attachment.size / 1024).toFixed(2)} KB</p>

                                    {isLoading ? (
                                        <div className="w-full max-w-[200px] mx-auto mt-3">
                                            <div className="flex justify-between text-[10px] text-gray-500 mb-1">
                                                <span>Uploading...</span>
                                                <span>{uploadProgress}%</span>
                                            </div>
                                            <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                                                <motion.div
                                                    className="h-full bg-blue-600 rounded-full"
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${uploadProgress}%` }}
                                                    transition={{ duration: 0.1 }}
                                                />
                                            </div>
                                        </div>
                                    ) : (
                                        <button type="button" onClick={() => setAttachment(null)} className="mt-2 text-red-500 hover:text-red-700 text-xs font-bold relative z-10">
                                            Remove
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Subject</label>
                        <div className="relative">
                            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                                <FileText className="w-5 h-5" />
                            </div>
                            <select
                                name="subject"
                                value={formData.subject}
                                onChange={handleChange}
                                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-900 focus:ring-2 focus:ring-blue-900/20 transition-all text-sm font-medium appearance-none"
                            >
                                <option value="General Inquiry">General Inquiry</option>
                                <option value="Appointment Issue">Appointment Issue</option>
                                <option value="Feedback">Feedback / Complaint</option>
                                <option value="Billing Query">Billing Query</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Message</label>
                        <textarea
                            name="message"
                            value={formData.message}
                            onChange={handleChange}
                            rows={4}
                            className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-900 focus:ring-2 focus:ring-blue-900/20 transition-all text-sm font-medium resize-none"
                            placeholder="Type your message here..."
                            required
                        />
                    </div>

                    <Button
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-3.5 rounded-xl font-bold shadow-lg shadow-blue-900/20 flex items-center justify-center gap-2 bg-blue-900 hover:bg-blue-800 text-white transition-all hover:-translate-y-0.5"
                    >
                        {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                        {isLoading ? "Proceeding..." : "Proceed"}
                    </Button>
                </form>

                <div className="mt-8 text-center">
                    <button
                        onClick={() => navigate(-1)}
                        className="text-sm text-blue-900 font-bold hover:underline flex items-center justify-center gap-2 mx-auto"
                    >
                        <ArrowLeft className="w-4 h-4" /> Back to Previous Page
                    </button>
                </div>
            </motion.div>
        </div>
    );
};

export default OnlineFormPage;
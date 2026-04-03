import { useState } from 'react';
import Button from '../components/Button';
import { Phone, Mail, MapPin, Send, Loader2, Map, User, Globe, Users, CalendarDays, FileText, Home, Clock, Building2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { PROVINCES, DISTRICTS_BY_PROVINCE, CASTE_GROUPS, CASTES_BY_GROUP, WARDS, COMMON_VILLAGES } from '../constants/nepalData';

const ALL_DISTRICTS = Object.values(DISTRICTS_BY_PROVINCE).flat().sort();

const Appointment = () => {
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        contactNumber: '',
        casteGroup: '',
        caste: '',
        address: '',
        nationality: 'Nepali',
        province: 'Select Province',
        district: '',
        ward: '',
        villageTole: '',
        shift: 'Morning',
        message: '',
        preferredDate1: '',
    });
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const navigate = useNavigate();

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
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
        if (!formData.fullName.trim()) newErrors.fullName = "Full name is required.";
        if (!formData.contactNumber.trim()) {
            newErrors.contactNumber = "Contact number is required.";
        } else if (!/^\+?[0-9\s-]{7,}$/.test(formData.contactNumber)) {
            newErrors.contactNumber = "Please enter a valid phone number.";
        }
        if (!formData.email.trim()) {
            newErrors.email = "Email is required.";
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = "Please enter a valid email address.";
        }
        if (!formData.message.trim()) {
            newErrors.message = "Message is required.";
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm()) {
            return;
        }

        setIsLoading(true);
        console.log("Submitting contact form:", formData);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        setIsLoading(false);
        alert('Message sent successfully! Our team will get back to you shortly.');
        setFormData({ fullName: '', email: '', contactNumber: '', casteGroup: '', caste: '', address: '', nationality: 'Nepali', province: 'Select Province', district: '', ward: '', villageTole: '', shift: 'Morning', message: '', preferredDate1: '' });
        window.scrollTo(0, 0);
        navigate('/');
    };

    return (
        <section id="contact" className="px-4 bg-slate-50 py-20">
            <div className="max-w-6xl mx-auto">
                <div className="bg-white border border-gray-200 shadow-xl relative overflow-hidden rounded-2xl">
                    <div className="grid grid-cols-1 lg:grid-cols-12">
                        {/* Info Panel */}
                        <div className="lg:col-span-5 bg-slate-900 p-6 lg:p-8 text-white relative">
                            <div className="relative z-10 space-y-8">
                                <div className="space-y-4">
                                    <h2 className="text-2xl lg:text-3xl font-black uppercase tracking-tight leading-tight">
                                        Get In Touch
                                    </h2>
                                    <div className="w-16 h-1 bg-blue-500" />
                                    <p className="text-white/70 text-sm font-medium leading-relaxed">
                                        Have questions or need to book an appointment? Fill out the form and we'll get back to you. For emergencies, call our 24/7 hotline.
                                    </p>
                                </div>

                                <div className="space-y-8">
                                    <div className="flex items-start gap-3">
                                        <div className="p-2 bg-white/10 border border-white/20 rounded-lg">
                                            <Phone className="w-5 h-5 text-blue-400" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-1">24/7 Hotline</p>
                                            <p className="text-lg font-black">+977-XX-XXXXXX</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <div className="p-2 bg-white/10 border border-white/20 rounded-lg">
                                            <Mail className="w-5 h-5 text-blue-400" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-1">Official Email</p>
                                            <p className="text-lg font-black">info@dwarikahospital.com</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <div className="p-2 bg-white/10 border border-white/20 rounded-lg">
                                            <MapPin className="w-5 h-5 text-blue-400" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-1">Our Location</p>
                                            <p className="text-sm font-bold">Health Care Lane, Province No. 1, Nepal</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Decorative Logo Watermark */}
                            <div className="absolute bottom-4 right-4 opacity-5 pointer-events-none">
                                <img src="/logo.png" alt="" className="w-48 h-48 filter grayscale brightness-0 invert" />
                            </div>
                        </div>

                        {/* Form Panel */}
                        <div className="lg:col-span-7 p-8 lg:p-10">
                            <form className="space-y-4" onSubmit={handleSubmit}>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-gray-900 text-xs font-bold uppercase tracking-widest">Full Name *</label>
                                        <div className="relative">
                                            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                            <input type="text" name="fullName" value={formData.fullName} onChange={handleInputChange} className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-900 focus:ring-2 focus:ring-blue-900/20 transition-all text-sm font-medium" placeholder="E.g. Ram Bahadur" required />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-gray-900 text-xs font-bold uppercase tracking-widest">Contact Number *</label>
                                        <div className="relative">
                                            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                            <input type="tel" name="contactNumber" value={formData.contactNumber} onChange={handleInputChange} className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-900 focus:ring-2 focus:ring-blue-900/20 transition-all text-sm font-medium" placeholder="+977-XXXXXXXXXX" required />
                                        </div>
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-gray-900 text-xs font-bold uppercase tracking-widest">Email Address *</label>
                                        <div className="relative">
                                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                            <input type="email" name="email" value={formData.email} onChange={handleInputChange} className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-900 focus:ring-2 focus:ring-blue-900/20 transition-all text-sm font-medium" placeholder="Your Email Address" required />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-gray-900 text-xs font-bold uppercase tracking-widest">Province *</label>
                                        <div className="relative">
                                            <Map className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                                            <select
                                                name="province"
                                                value={formData.province}
                                                onChange={(e) => {
                                                    handleInputChange(e);
                                                    setFormData(prev => ({ ...prev, district: '' }));
                                                }}
                                                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-900 focus:ring-2 focus:ring-blue-900/20 transition-all text-sm font-medium appearance-none"
                                                required
                                            >
                                                <option disabled value="Select Province">Select Province</option>
                                                {PROVINCES.map(p => <option key={p} value={p}>{p}</option>)}
                                            </select>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-gray-900 text-xs font-bold uppercase tracking-widest">District *</label>
                                        <div className="relative">
                                            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                                            <select
                                                name="district"
                                                value={formData.district}
                                                onChange={handleInputChange}
                                                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-900 focus:ring-2 focus:ring-blue-900/20 transition-all text-sm font-medium appearance-none"
                                                required
                                            >
                                                <option value="" disabled>Select District</option>
                                                {(formData.province && formData.province !== 'Select Province' ? (DISTRICTS_BY_PROVINCE[formData.province] || []) : ALL_DISTRICTS).map(d => (
                                                    <option key={d} value={d}>{d}</option>
                                                ))}
                                                <option value="Other">Other</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-gray-900 text-xs font-bold uppercase tracking-widest">Caste Group</label>
                                        <div className="relative">
                                            <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                            <select
                                                name="casteGroup"
                                                value={formData.casteGroup}
                                                onChange={(e) => {
                                                    handleInputChange(e);
                                                    setFormData(prev => ({ ...prev, caste: '' }));
                                                }}
                                                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-900 focus:ring-2 focus:ring-blue-900/20 transition-all text-sm font-medium appearance-none"
                                            >
                                                <option value="" disabled>Select Group</option>
                                                {CASTE_GROUPS.map(g => <option key={g} value={g}>{g}</option>)}
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-gray-900 text-xs font-bold uppercase tracking-widest">Ward *</label>
                                        <div className="relative">
                                            <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                                            <select
                                                name="ward"
                                                value={formData.ward}
                                                onChange={handleInputChange}
                                                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-900 focus:ring-2 focus:ring-blue-900/20 transition-all text-sm font-medium appearance-none"
                                            >
                                                <option value="" disabled>Select Ward</option>
                                                {WARDS.map(w => <option key={w} value={w}>{w}</option>)}
                                            </select>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-gray-900 text-xs font-bold uppercase tracking-widest">Village / Tole *</label>
                                        <div className="relative">
                                            <Home className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                                            <select
                                                name="villageTole"
                                                value={formData.villageTole}
                                                onChange={handleInputChange}
                                                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-900 focus:ring-2 focus:ring-blue-900/20 transition-all text-sm font-medium appearance-none"
                                            >
                                                <option value="" disabled>Select Village / Tole</option>
                                                {COMMON_VILLAGES.map(v => <option key={v} value={v}>{v}</option>)}
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-gray-900 text-xs font-bold uppercase tracking-widest">Preferred Shift</label>
                                        <div className="relative">
                                            <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                                            <select
                                                name="shift"
                                                value={formData.shift}
                                                onChange={handleInputChange}
                                                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-900 focus:ring-2 focus:ring-blue-900/20 transition-all text-sm font-medium appearance-none"
                                            >
                                                <option>Morning (8:00 AM - 12:00 PM)</option>
                                                <option>Afternoon (12:00 PM - 4:00 PM)</option>
                                                <option>Evening (4:00 PM - 7:00 PM)</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-gray-900 text-xs font-bold uppercase tracking-widest">Caste/Ethnicity</label>
                                        <div className="relative">
                                            <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                            <select
                                                name="caste"
                                                value={formData.caste}
                                                onChange={handleInputChange}
                                                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-900 focus:ring-2 focus:ring-blue-900/20 transition-all text-sm font-medium appearance-none"
                                                disabled={!formData.casteGroup}
                                            >
                                                <option value="" disabled>Select Caste</option>
                                                {formData.casteGroup && CASTES_BY_GROUP[formData.casteGroup]?.map(c => <option key={c} value={c}>{c}</option>)}
                                                <option value="Other">Other</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-gray-900 text-xs font-bold uppercase tracking-widest">Nationality *</label>
                                        <div className="relative">
                                            <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                            <input type="text" name="nationality" value={formData.nationality} onChange={handleInputChange} className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-900 focus:ring-2 focus:ring-blue-900/20 transition-all text-sm font-medium" placeholder="E.g. Nepali" required />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-gray-900 text-xs font-bold uppercase tracking-widest">Address Specification</label>
                                        <div className="relative">
                                            <Home className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                            <input type="text" name="address" value={formData.address} onChange={handleInputChange} className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-900 focus:ring-2 focus:ring-blue-900/20 transition-all text-sm font-medium" placeholder="E.g. Ward No. 7, Kalyanpur" />
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-gray-900 text-xs font-bold uppercase tracking-widest">Preferred Date</label>
                                        <div className="relative">
                                            <CalendarDays className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                                            <input type="date" name="preferredDate1" value={formData.preferredDate1} onChange={handleInputChange} className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-900 focus:ring-2 focus:ring-blue-900/20 transition-all text-sm font-medium" />
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-gray-900 text-xs font-bold uppercase tracking-widest">Message *</label>
                                    <div className="relative">
                                        <FileText className="absolute left-3 top-4 w-5 h-5 text-gray-400" />
                                        <textarea name="message" value={formData.message} onChange={handleInputChange} rows={4} className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-900 focus:ring-2 focus:ring-blue-900/20 transition-all text-sm font-medium resize-none" placeholder="How can we help you?" required></textarea>
                                    </div>
                                </div>
                                <Button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black uppercase py-3 rounded-xl shadow-lg flex items-center justify-center gap-3 tracking-widest"
                                >
                                    {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                                    {isLoading ? "Sending..." : "Send Message"}
                                </Button>
                                <p className="text-[10px] text-gray-400 font-bold text-center uppercase">Our staff will contact you shortly.</p>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Appointment;

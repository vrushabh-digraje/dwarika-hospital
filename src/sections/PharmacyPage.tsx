import { useState, useEffect } from 'react';
import { Pill, Truck, Clock, ShieldCheck, Send, Loader2, Phone, MapPin, FileUp, X } from 'lucide-react';
import { motion } from 'framer-motion';
import Button from '../components/Button';

const PharmacyPage = () => {
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        address: '',
        medicineList: ''
    });
    const [prescriptionFile, setPrescriptionFile] = useState<File | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setPrescriptionFile(e.target.files[0]);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        setIsLoading(false);
        alert('Medicine request submitted successfully! Our pharmacist will call you shortly to confirm the order and delivery.');
        setFormData({ name: '', phone: '', address: '', medicineList: '' });
        setPrescriptionFile(null);
    };

    const features = [
        { icon: Clock, title: "24/7 Service", desc: "Round-the-clock availability for all your medicinal needs." },
        { icon: Truck, title: "Home Delivery", desc: "Fast and safe delivery to your doorstep within the city." },
        { icon: ShieldCheck, title: "Authentic Medicines", desc: "100% genuine products stored under optimal conditions." },
        { icon: Pill, title: "Expert Counseling", desc: "Free medication counseling by qualified pharmacists." }
    ];

    return (
        <div className="min-h-screen bg-gray-50 pt-12 pb-20">
            {/* Hero Section */}
            <div className="bg-blue-900 text-white py-16 px-6 mb-12">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="space-y-4 max-w-2xl">
                        <div className="flex items-center gap-2 text-blue-300 font-bold uppercase tracking-widest text-xs">
                            <Pill className="w-4 h-4" /> Dwarika Pharmacy
                        </div>
                        <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tight">
                            Your Trusted Partner for <span className="text-blue-300">Health & Wellness</span>
                        </h1>
                        <p className="text-blue-100 text-lg max-w-xl leading-relaxed">
                            We provide a wide range of prescription medicines, OTC products, and surgical supplies with a commitment to quality and care.
                        </p>
                    </div>
                    <div className="hidden md:block">
                        <Truck className="w-32 h-32 text-blue-800/50" />
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12">
                {/* Left Column: Info & Features */}
                <div className="lg:col-span-7 space-y-10">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        {features.map((feature, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
                            >
                                <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-900 mb-4">
                                    <feature.icon className="w-6 h-6" />
                                </div>
                                <h3 className="font-bold text-lg text-gray-800 mb-2">{feature.title}</h3>
                                <p className="text-sm text-gray-500 leading-relaxed">{feature.desc}</p>
                            </motion.div>
                        ))}
                    </div>

                    <div className="bg-blue-50 p-8 rounded-3xl border border-blue-100">
                        <h3 className="font-black text-xl text-blue-900 uppercase tracking-wide mb-4">Contact Pharmacy Directly</h3>
                        <div className="space-y-4">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-white rounded-full text-blue-600 shadow-sm"><Phone className="w-5 h-5" /></div>
                                <div>
                                    <p className="text-xs font-bold text-gray-500 uppercase">Pharmacy Hotline</p>
                                    <p className="text-lg font-black text-gray-800">+977-XX-XXXXXX</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-white rounded-full text-blue-600 shadow-sm"><MapPin className="w-5 h-5" /></div>
                                <div>
                                    <p className="text-xs font-bold text-gray-500 uppercase">Location</p>
                                    <p className="text-lg font-black text-gray-800">Ground Floor, OPD Block</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Order Form */}
                <div className="lg:col-span-5">
                    <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100 sticky top-24">
                        <h2 className="text-2xl font-black text-blue-900 uppercase tracking-tight mb-2">Request Medicine</h2>
                        <p className="text-gray-500 text-sm mb-6">Fill out the form below to order medicines for home delivery or store pickup.</p>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-gray-500 uppercase">Full Name</label>
                                <input type="text" name="name" value={formData.name} onChange={handleChange} required className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-900 focus:ring-2 focus:ring-blue-900/20 text-sm font-medium" placeholder="Your Name" />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-gray-500 uppercase">Phone Number</label>
                                <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-900 focus:ring-2 focus:ring-blue-900/20 text-sm font-medium" placeholder="Mobile Number" />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-gray-500 uppercase">Delivery Address</label>
                                <input type="text" name="address" value={formData.address} onChange={handleChange} required className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-900 focus:ring-2 focus:ring-blue-900/20 text-sm font-medium" placeholder="Your Address" />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-gray-500 uppercase">Medicine List / Prescription</label>
                                <textarea name="medicineList" value={formData.medicineList} onChange={handleChange} required rows={4} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-900 focus:ring-2 focus:ring-blue-900/20 text-sm font-medium resize-none" placeholder="List medicines or paste prescription details here..." />
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs font-bold text-gray-500 uppercase">Upload Prescription (Optional)</label>
                                <div className="relative border-2 border-dashed border-gray-200 rounded-xl p-4 flex flex-col items-center justify-center text-center hover:border-blue-900 hover:bg-blue-50/30 transition-all bg-gray-50 group">
                                    <input
                                        type="file"
                                        accept="image/*,.pdf"
                                        onChange={handleFileChange}
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                                        disabled={isLoading}
                                    />
                                    {prescriptionFile ? (
                                        <div className="flex items-center gap-3 z-10 bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-100">
                                            <div className="p-2 bg-blue-100 rounded-lg">
                                                <FileUp className="w-4 h-4 text-blue-900" />
                                            </div>
                                            <span className="text-sm font-bold text-gray-700 line-clamp-1 max-w-[150px]">{prescriptionFile.name}</span>
                                            <button
                                                type="button"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    setPrescriptionFile(null);
                                                }}
                                                className="p-1 hover:bg-red-50 rounded-full text-gray-400 hover:text-red-500 transition-colors z-30"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center gap-2 pointer-events-none">
                                            <div className="p-3 bg-white rounded-full shadow-sm border border-gray-100 group-hover:scale-110 transition-transform">
                                                <FileUp className="w-5 h-5 text-blue-900" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-gray-600 group-hover:text-blue-900 transition-colors">Click to upload prescription</p>
                                                <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wide">JPG, PNG, PDF (Max 5MB)</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <Button type="submit" disabled={isLoading} className="w-full py-4 bg-blue-900 hover:bg-blue-800 text-white rounded-xl font-bold shadow-lg shadow-blue-900/20 mt-2 flex items-center justify-center gap-2">
                                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                                {isLoading ? "Submitting..." : "Place Order Request"}
                            </Button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PharmacyPage;
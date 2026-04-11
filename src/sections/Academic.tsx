import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
    GraduationCap,
    BookOpen,
    Download,
    ChevronRight,
    ChevronLeft,
    ExternalLink,
    X,
    Calendar,
    Users,
    FlaskConical,
    Stethoscope,
    HeartPulse,
    ArrowRight,
    Bell,
    Send,
    Loader2,
    User,
    Phone,
    Mail,
    MapPin,
    CheckCircle2,
} from "lucide-react";

/* ─── TYPES ─────────────────────────────────────── */
type FormType = "admission" | "internship" | "brochure" | "program" | null;

/* ─── DATA ──────────────────────────────────────── */
const stats = [
    { label: "Years of Excellence", value: "25+" },
    { label: "Graduates Produced", value: "8,000+" },
    { label: "Academic Programs", value: "12" },
    { label: "Research Papers", value: "500+" },
];

const programs = [
    {
        icon: Stethoscope,
        title: "Diploma in General Medicine",
        duration: "3 Years",
        seats: "40 Seats",
        desc: "Foundational clinical education designed to produce skilled Health Assistants capable of providing primary healthcare services.",
        tag: "Medical",
        gradient: "from-blue-900 via-blue-800 to-blue-700",
    },
    {
        icon: HeartPulse,
        title: "Diploma in Pharmacy",
        duration: "3 Years",
        seats: "40 Seats",
        desc: "Technical training in pharmaceutical sciences, drug management, and dispensing to ensure safe and effective medication use.",
        tag: "Nursing",
        gradient: "from-red-800 via-red-700 to-rose-600",
    },
    {
        icon: FlaskConical,
        title: "Diploma in Laboratory",
        duration: "3 Years",
        seats: "30 Seats",
        desc: "Advanced diagnostic training for Laboratory Technicians, focusing on clinical pathology, biochemistry, and microbiology.",
        tag: "Paramedical",
        gradient: "from-emerald-800 via-emerald-700 to-teal-600",
    },
];

import { articles } from "./NewsAndEvents";

const academicNotices = articles.filter(a => a.category === "Notice")
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

const noticeTypeColors: Record<string, string> = {
    Result: "bg-emerald-100 text-emerald-700",
    Admission: "bg-blue-100 text-blue-700",
    Notice: "bg-orange-100 text-orange-700",
    Scholarship: "bg-purple-100 text-purple-700",
    Event: "bg-red-100 text-red-700",
};

const upcomingEvents = [
    { title: "Annual Medical Conference", date: "2026-04-15", time: "10:00 AM", location: "Hospital Auditorium" },
    { title: "Internship Orientation 2026", date: "2026-04-20", time: "02:00 PM", location: "Lecture Hall A" },
    { title: "Public Health Awareness Workshop", date: "2026-05-02", time: "09:00 AM", location: "Main Hall" },
];

const academicGalleryImages = [
    "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&q=80&w=1470",
    "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=1471",
    "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&q=80&w=1632",
    "https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&q=80&w=1470",
    "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=1470",
    "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80&w=1470",
    "https://images.unsplash.com/photo-1581056771107-24ca5f033842?auto=format&fit=crop&q=80&w=1470",
    "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=1470",
];

const fmtMonth = (d: string) => new Date(d).toLocaleString("default", { month: "short" });
const fmtDay = (d: string) => new Date(d).getDate();

/* ────────────────────────────────────────────────────
   MODAL FORM COMPONENT
─────────────────────────────────────────────────── */
type ModalFormProps = {
    type: FormType;
    programTitle?: string;
    onClose: () => void;
};

const formTitles: Record<string, string> = {
    admission: "Admission Application Form",
    internship: "Internship Application Form",
    brochure: "Request Academic Brochure",
    program: "Program Application",
};

const ModalForm = ({ type, programTitle, onClose }: ModalFormProps) => {
    const [form, setForm] = useState({
        name: "", phone: "", email: "", dob: "", gender: "",
        address: "", qualification: "", program: programTitle ?? "",
        message: "",
    });
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        await new Promise(r => setTimeout(r, 1600));
        setLoading(false);
        setSuccess(true);
    };

    if (!type) return null;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[300] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={onClose}
        >
            <motion.div
                initial={{ opacity: 0, scale: 0.92, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.92, y: 30 }}
                transition={{ type: "spring", damping: 22, stiffness: 280 }}
                onClick={e => e.stopPropagation()}
                className="bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
            >
                {/* Header */}
                <div className="bg-gradient-to-r from-[#1E3A8A] to-[#1E40AF] px-8 py-6 rounded-t-3xl flex items-start justify-between">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <GraduationCap className="w-5 h-5 text-[#FB923C]" />
                            <span className="text-blue-200 text-xs font-semibold uppercase tracking-wider">Dwarika Hospital</span>
                        </div>
                        <h2 className="text-white font-black text-xl">
                            {type === "program" && programTitle ? `Apply – ${programTitle}` : formTitles[type]}
                        </h2>
                    </div>
                    <button onClick={onClose} className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors cursor-pointer mt-0.5">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="px-8 py-7">
                    {success ? (
                        /* Success State */
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="text-center py-8 space-y-4"
                        >
                            <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center mx-auto">
                                <CheckCircle2 className="w-10 h-10 text-emerald-600" />
                            </div>
                            <h3 className="text-2xl font-black text-[#1E3A8A]">Submitted Successfully!</h3>
                            <p className="text-gray-500 text-sm leading-relaxed">
                                Your application has been received. Our team will contact you within <strong>2–3 business days</strong>.
                            </p>
                            <button
                                onClick={onClose}
                                className="mt-4 inline-flex items-center gap-2 bg-[#1E3A8A] text-white font-bold px-8 py-3 rounded-xl hover:bg-blue-800 transition-colors cursor-pointer"
                            >
                                Done <CheckCircle2 className="w-4 h-4" />
                            </button>
                        </motion.div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-4">

                            {/* Full Name */}
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Full Name *</label>
                                <div className="relative">
                                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <input
                                        name="name" value={form.name} onChange={handleChange} required
                                        placeholder="Enter your full name"
                                        className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:border-[#1E3A8A] focus:ring-2 focus:ring-[#1E3A8A]/15 transition-all"
                                    />
                                </div>
                            </div>

                            {/* Phone + Email */}
                            <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Phone *</label>
                                    <div className="relative">
                                        <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                        <input
                                            name="phone" value={form.phone} onChange={handleChange} required type="tel"
                                            placeholder="Phone number"
                                            className="w-full pl-10 pr-3 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:border-[#1E3A8A] focus:ring-2 focus:ring-[#1E3A8A]/15 transition-all"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Email</label>
                                    <div className="relative">
                                        <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                        <input
                                            name="email" value={form.email} onChange={handleChange} type="email"
                                            placeholder="Email address"
                                            className="w-full pl-10 pr-3 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:border-[#1E3A8A] focus:ring-2 focus:ring-[#1E3A8A]/15 transition-all"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* DOB + Gender */}
                            <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Date of Birth *</label>
                                    <input
                                        name="dob" value={form.dob} onChange={handleChange} required type="date"
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:border-[#1E3A8A] focus:ring-2 focus:ring-[#1E3A8A]/15 transition-all"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Gender *</label>
                                    <select
                                        name="gender" value={form.gender} onChange={handleChange} required
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:border-[#1E3A8A] focus:ring-2 focus:ring-[#1E3A8A]/15 transition-all appearance-none"
                                    >
                                        <option value="">Select</option>
                                        <option>Male</option>
                                        <option>Female</option>
                                        <option>Other</option>
                                    </select>
                                </div>
                            </div>

                            {/* Address */}
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Address *</label>
                                <div className="relative">
                                    <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <input
                                        name="address" value={form.address} onChange={handleChange} required
                                        placeholder="Your address"
                                        className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:border-[#1E3A8A] focus:ring-2 focus:ring-[#1E3A8A]/15 transition-all"
                                    />
                                </div>
                            </div>

                            {/* Qualification */}
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Highest Qualification *</label>
                                <select
                                    name="qualification" value={form.qualification} onChange={handleChange} required
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:border-[#1E3A8A] focus:ring-2 focus:ring-[#1E3A8A]/15 transition-all appearance-none"
                                >
                                    <option value="">Select Qualification</option>
                                    <option>10+2 (Science)</option>
                                    <option>10+2 (Other)</option>
                                    <option>B.Sc.</option>
                                    <option>MBBS</option>
                                    <option>Other</option>
                                </select>
                            </div>

                            {/* Program Selection — show for admission/program only */}
                            {(type === "admission" || type === "program") && (
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Program Applied For *</label>
                                    <select
                                        name="program" value={form.program} onChange={handleChange} required
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:border-[#1E3A8A] focus:ring-2 focus:ring-[#1E3A8A]/15 transition-all appearance-none"
                                    >
                                        <option value="">Select Program</option>
                                        <option>Diploma in General Medicine</option>
                                        <option>Diploma in Pharmacy</option>
                                        <option>Diploma in Laboratory</option>
                                    </select>
                                </div>
                            )}

                            {/* Department — for internship */}
                            {type === "internship" && (
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Preferred Department *</label>
                                    <select
                                        name="program" value={form.program} onChange={handleChange} required
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:border-[#1E3A8A] focus:ring-2 focus:ring-[#1E3A8A]/15 transition-all appearance-none"
                                    >
                                        <option value="">Select Department</option>
                                        <option>General Medicine</option>
                                        <option>Surgery</option>
                                        <option>Pediatrics</option>
                                        <option>Gynecology</option>
                                        <option>Radiology</option>
                                        <option>Pharmacy</option>
                                    </select>
                                </div>
                            )}

                            {/* Brochure delivery — for brochure */}
                            {type === "brochure" && (
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Brochure For *</label>
                                    <select
                                        name="program" value={form.program} onChange={handleChange} required
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:border-[#1E3A8A] focus:ring-2 focus:ring-[#1E3A8A]/15 transition-all appearance-none"
                                    >
                                        <option value="">Select Program</option>
                                        <option>Diploma in General Medicine</option>
                                        <option>Diploma in Pharmacy</option>
                                        <option>Diploma in Laboratory</option>
                                        <option>General (All Programs)</option>
                                    </select>
                                </div>
                            )}

                            {/* Message */}
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Additional Message</label>
                                <textarea
                                    name="message" value={form.message} onChange={handleChange}
                                    rows={3} placeholder="Any additional information or queries..."
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:border-[#1E3A8A] focus:ring-2 focus:ring-[#1E3A8A]/15 transition-all resize-none"
                                />
                            </div>

                            {/* Submit */}
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full flex items-center justify-center gap-2 bg-[#1E3A8A] hover:bg-blue-700 disabled:opacity-70 text-white font-bold py-3.5 rounded-xl transition-all hover:-translate-y-0.5 shadow-lg shadow-blue-900/20 cursor-pointer mt-2"
                            >
                                {loading ? <><Loader2 className="w-5 h-5 animate-spin" /> Submitting...</> : <><Send className="w-5 h-5" /> Submit Application</>}
                            </button>
                        </form>
                    )}
                </div>
            </motion.div>
        </motion.div>
    );
};

/* ─── MAIN COMPONENT ─────────────────────────── */
const Academic = () => {
    const navigate = useNavigate();
    const [galleryIndex, setGalleryIndex] = useState(0);
    const [isLightboxOpen, setIsLightboxOpen] = useState(false);
    const [showGrid, setShowGrid] = useState(false);
    const [activeForm, setActiveForm] = useState<FormType>(null);
    const [selectedProgram, setSelectedProgram] = useState<string>("");

    const openForm = (type: FormType, program = "") => {
        setActiveForm(type);
        setSelectedProgram(program);
    };
    const closeForm = () => { setActiveForm(null); setSelectedProgram(""); };

    const nextImg = (e?: React.MouseEvent) => { e?.stopPropagation(); setGalleryIndex(p => (p + 1) % academicGalleryImages.length); };
    const prevImg = (e?: React.MouseEvent) => { e?.stopPropagation(); setGalleryIndex(p => (p - 1 + academicGalleryImages.length) % academicGalleryImages.length); };

    return (
        <section id="academic" className="relative overflow-hidden bg-[#F0F4FF]">
            <style>{`
                .acad-scrollbar { scrollbar-width: thin; scrollbar-color: #CBD5E1 transparent; }
                .acad-scrollbar::-webkit-scrollbar { width: 4px; }
                .acad-scrollbar::-webkit-scrollbar-thumb { background: #CBD5E1; border-radius: 99px; }
                .acad-scrollbar::-webkit-scrollbar-thumb:hover { background: #1E3A8A; }
                .flip-card { perspective: 1000px; }
                .flip-inner { transition: transform 0.7s; transform-style: preserve-3d; position: relative; }
                .flip-card:hover .flip-inner { transform: rotateY(180deg); }
                .flip-face { backface-visibility: hidden; position: absolute; inset: 0; }
                .flip-back { transform: rotateY(180deg); }
                @keyframes pulseRing { 0%{transform:scale(1);opacity:.6} 100%{transform:scale(1.8);opacity:0} }
                .pulse-ring::after { content:''; position:absolute; inset:-4px; border-radius:50%; border: 2px solid #FB923C; animation: pulseRing 2s ease-out infinite; }
            `}</style>

            {/* ── HERO BANNER ── */}
            <div className="relative bg-gradient-to-br from-[#0A1A4E] via-[#1E3A8A] to-[#1E40AF] overflow-hidden">
                <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-white/5 blur-2xl" />
                <div className="absolute -bottom-20 -left-20 w-72 h-72 rounded-full bg-[#FB923C]/10 blur-3xl" />

                <div className="max-w-7xl mx-auto px-6 py-20 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.7 }}
                        className="text-center space-y-6"
                    >
                        <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-5 py-2 text-white/80 text-sm font-semibold tracking-wider uppercase">
                            <GraduationCap className="w-4 h-4 text-[#FB923C]" />
                            Academics, Education & Training
                        </div>
                        <h1 className="text-4xl md:text-6xl font-black text-white leading-tight drop-shadow-[0_4px_12px_rgba(0,0,0,0.5)]">
                            <span className="text-white brightness-125">Shaping Tomorrow's</span><br />
                            <span className="text-[#FB923C] drop-shadow-sm">Healthcare Leaders</span>
                        </h1>
                             <motion.p
                                className="max-w-2xl mx-auto text-lg leading-relaxed"
                                style={{ color: '#f5fbff', textShadow: '0 2px 12px rgba(0, 0, 0, 0.28)' }}
                             >
                                Our academic programs combine world-class medical education with extensive clinical exposure, nurturing future healthcare professionals.
                            </motion.p>
                            <div className="flex flex-wrap justify-center gap-4 pt-2">
                                <motion.button
                                    onClick={() => openForm("admission")}
                                    whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}
                                    className="inline-flex items-center gap-2 bg-[#FB923C] hover:bg-orange-500 text-white font-bold px-8 py-3.5 rounded-full shadow-lg shadow-orange-500/30 transition-colors cursor-pointer"
                                >
                                    Apply for Admission <ArrowRight className="w-4 h-4" />
                                </motion.button>
                                <motion.button
                                    onClick={() => openForm("internship")}
                                    whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}
                                    className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/30 text-white font-bold px-8 py-3.5 rounded-full backdrop-blur-sm transition-colors cursor-pointer"
                                >
                                    <Users className="w-4 h-4" /> Apply for Internship
                                </motion.button>
                                <motion.button
                                    onClick={() => openForm("brochure")}
                                    whileHover={{ scale: 1.05 }}
                                    className="inline-flex items-center gap-2 text-white/80 hover:text-white font-semibold py-3.5 transition-colors cursor-pointer"
                                >
                                    <Download className="w-4 h-4" /> Download Brochure
                                </motion.button>
                            </div>
                    </motion.div>
                </div>

                {/* Stats */}
                <div className="border-t border-white/10 bg-white/5 backdrop-blur-sm">
                    <div className="max-w-7xl mx-auto px-6 py-6 grid grid-cols-2 md:grid-cols-4 gap-6">
                        {stats.map((s, i) => (
                            <motion.div key={i} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="text-center">
                                <p className="text-3xl font-black [color:#f8fdff] [text-shadow:0_2px_10px_rgba(4,18,40,0.28)]">{s.value}</p>
                                <p className="text-sm font-bold uppercase tracking-wider [color:#d7f6ff] [text-shadow:0_1px_8px_rgba(4,18,40,0.2)]">{s.label}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>

            {/* ── PROGRAMS ── */}
            <div className="max-w-7xl mx-auto px-6 py-16 space-y-10">
                <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center">
                    <h2 className="text-3xl font-black text-[#1E3A8A] uppercase tracking-tight">Our Academic Programs</h2>
                    <div className="w-16 h-1.5 bg-[#FB923C] rounded-full mx-auto mt-3" />
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {programs.map((prog, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.15 }}
                            onClick={() => openForm("program", prog.title)}
                            whileHover={{ y: -6, boxShadow: "0 20px 40px rgba(30,58,138,0.15)" }}
                            className="group relative bg-white rounded-3xl overflow-hidden shadow-xl border border-gray-100 cursor-pointer transition-all duration-300"
                        >
                            <div className={`h-36 bg-gradient-to-br ${prog.gradient} relative overflow-hidden flex items-center justify-center`}>
                                <div className="absolute inset-0 bg-black/20" />
                                <div className="relative z-10 group-hover:scale-110 group-hover:-rotate-6 transition-all duration-300">
                                    <div className="relative pulse-ring">
                                        <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30">
                                            <prog.icon className="w-8 h-8 text-white" />
                                        </div>
                                    </div>
                                </div>
                                <div className="absolute top-4 right-4">
                                    <span className="bg-white/20 backdrop-blur-sm text-white text-[10px] font-bold px-3 py-1 rounded-full border border-white/30 uppercase">{prog.tag}</span>
                                </div>
                            </div>
                            <div className="p-7 space-y-4">
                                <div>
                                    <h3 className="text-xl font-black text-[#1E3A8A]">{prog.title}</h3>
                                    <div className="flex items-center gap-4 mt-2">
                                        <span className="text-xs font-semibold text-gray-500 flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {prog.duration}</span>
                                        <span className="text-xs font-semibold text-gray-500 flex items-center gap-1"><Users className="w-3.5 h-3.5" /> {prog.seats}</span>
                                    </div>
                                </div>
                                <p className="text-gray-600 text-sm leading-relaxed">{prog.desc}</p>
                                <div className="inline-flex items-center gap-2 text-[#1E3A8A] font-bold text-sm group-hover:text-[#FB923C] transition-colors">
                                    Apply Now <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* ── NOTICES + EXAM FLIP + EVENTS ── */}
            <div className="max-w-7xl mx-auto px-6 pb-16">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

                    {/* Academic Notices */}
                    <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}
                        className="lg:col-span-2 bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
                        <div className="bg-gradient-to-r from-[#1E3A8A] to-[#1E40AF] px-8 py-5 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-xl bg-white/15 flex items-center justify-center"><Bell className="w-5 h-5 text-white" /></div>
                                <h3 className="text-white font-black text-lg uppercase tracking-wide">Academic Notices</h3>
                            </div>
                            <span className="bg-[#FB923C] text-white text-[11px] font-bold px-3 py-1 rounded-full">{academicNotices.length} New</span>
                        </div>
                        <ul className="divide-y divide-gray-100 max-h-[460px] overflow-y-auto acad-scrollbar">
                            {academicNotices.map((notice, i) => (
                                <motion.li key={i} initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.07 }}
                                    onClick={() => navigate(`/news/${notice.id}`)}
                                    className="flex items-center gap-5 px-8 py-5 hover:bg-blue-50/60 transition-colors group cursor-pointer">
                                    <div className="shrink-0 w-14 h-14 rounded-2xl bg-[#1E3A8A] flex flex-col items-center justify-center shadow-md">
                                        <span className="text-[10px] font-bold text-[#FB923C] uppercase">{fmtMonth(notice.date)}</span>
                                        <span className="text-xl font-black text-white leading-none">{fmtDay(notice.date)}</span>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-bold text-gray-800 group-hover:text-[#1E3A8A] transition-colors leading-snug truncate pr-2">{notice.title}</p>
                                        <div className="flex items-center gap-3 mt-1.5">
                                            <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${noticeTypeColors[notice.type] ?? "bg-gray-100 text-gray-600"}`}>{notice.type}</span>
                                            <span className="text-[11px] text-gray-400">{new Date(notice.date).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                    <div className="shrink-0 w-9 h-9 rounded-full bg-gray-100 group-hover:bg-[#1E3A8A] flex items-center justify-center transition-colors">
                                        <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
                                    </div>
                                </motion.li>
                            ))}
                        </ul>
                        <div className="px-8 py-4 border-t border-gray-100 bg-gray-50">
                            <button onClick={() => openForm("admission")} className="flex items-center justify-center gap-2 w-full text-[#1E3A8A] font-bold text-sm hover:text-[#FB923C] transition-colors cursor-pointer">
                                Apply via Notices <ArrowRight className="w-4 h-4" />
                            </button>
                        </div>
                    </motion.div>

                    {/* Right column */}
                    <div className="space-y-8">
                        {/* Flip Card – Exam */}
                        <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.1 }} className="flip-card h-72">
                            <div className="flip-inner w-full h-full">
                                {/* Front */}
                                <div className="flip-face rounded-3xl overflow-hidden bg-gradient-to-br from-[#0A1A4E] via-[#1E3A8A] to-[#2563EB] p-7 shadow-xl flex flex-col">
                                    <div className="w-12 h-12 rounded-2xl bg-white/15 flex items-center justify-center mb-4"><BookOpen className="w-6 h-6 text-[#FB923C]" /></div>
                                    <h3 className="text-white font-black text-xl uppercase mb-2">Online Exam System</h3>
                                    <p className="text-blue-200 text-sm leading-relaxed flex-1">Secure MCQ-based online entrance and semester exams through our advanced portal.</p>
                                    <div className="mt-4 flex items-center gap-2 text-[#FB923C] text-xs font-bold">
                                        <span>Hover to explore</span><ChevronRight className="w-4 h-4 animate-bounce" />
                                    </div>
                                </div>
                                {/* Back */}
                                <div className="flip-face flip-back rounded-3xl bg-white p-7 shadow-xl flex flex-col border border-gray-100">
                                    <h3 className="text-[#1E3A8A] font-black text-lg uppercase mb-4">Portal Features</h3>
                                    <ul className="space-y-3 flex-1">
                                        {["Secure Student Login", "Real-time Score Tracking", "MCQ-Based Assessment", "Instant Results"].map((f, i) => (
                                            <li key={i} className="flex items-center gap-3 text-sm text-gray-700 font-medium">
                                                <div className="w-6 h-6 rounded-full bg-[#FB923C]/15 flex items-center justify-center shrink-0"><div className="w-2 h-2 bg-[#FB923C] rounded-full" /></div>
                                                {f}
                                            </li>
                                        ))}
                                    </ul>
                                    <button
                                        onClick={() => navigate("/student-register")}
                                        className="mt-4 w-full bg-[#1E3A8A] hover:bg-blue-700 text-white font-bold py-2.5 rounded-xl flex items-center justify-center gap-2 text-sm transition-colors cursor-pointer"
                                    >
                                        Register Now <ExternalLink className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </motion.div>

                        {/* Events */}
                        <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.2 }}
                            className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
                            <div className="bg-gradient-to-r from-[#DC2626] to-[#EF4444] px-6 py-4 flex items-center gap-3">
                                <Calendar className="w-5 h-5 text-white" />
                                <h3 className="text-white font-black uppercase tracking-wide">Upcoming Events</h3>
                            </div>
                            <div className="divide-y divide-gray-100">
                                {upcomingEvents.map((ev, i) => (
                                    <div key={i} onClick={() => openForm("admission")} className="flex items-center gap-4 px-6 py-4 hover:bg-red-50/50 transition-colors group cursor-pointer">
                                        <div className="w-12 h-12 rounded-2xl bg-[#DC2626] flex flex-col items-center justify-center text-white shrink-0 shadow-md">
                                            <span className="text-[9px] font-bold uppercase">{fmtMonth(ev.date)}</span>
                                            <span className="text-lg font-black leading-none">{fmtDay(ev.date)}</span>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-bold text-gray-800 text-sm group-hover:text-[#DC2626] transition-colors truncate">{ev.title}</p>
                                            <p className="text-[11px] text-gray-400 mt-0.5">{ev.time} · {ev.location}</p>
                                        </div>
                                        <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-[#DC2626] transition-colors shrink-0" />
                                    </div>
                                ))}
                            </div>
                            <div className="px-6 pb-6 pt-2 space-y-3">
                                <button
                                    onClick={() => navigate('/news-events')}
                                    className="w-full bg-[#DC2626] hover:bg-red-700 text-white font-black py-3 rounded-xl flex items-center justify-center gap-2 text-xs transition-all cursor-pointer shadow-lg shadow-red-500/20"
                                >
                                    View All Events <ArrowRight className="w-4 h-4" />
                                </button>
                                <button onClick={() => openForm("admission")} className="w-full text-[10px] font-black text-[#DC2626] hover:underline flex items-center justify-center gap-1 cursor-pointer uppercase opacity-60">
                                    Quick Registration for Upcoming
                                </button>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* ── GALLERY ── */}
            <div className="max-w-7xl mx-auto px-6 py-16 space-y-8">
                <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="flex items-end justify-between gap-4">
                    <div>
                        <h2 className="text-3xl font-black text-[#1E3A8A] uppercase">Academic Gallery</h2>
                        <div className="w-12 h-1.5 bg-[#FB923C] rounded-full mt-2" />
                    </div>
                    <button onClick={() => setShowGrid(!showGrid)} className="inline-flex items-center gap-2 text-[#1E3A8A] border-2 border-[#1E3A8A] hover:bg-[#1E3A8A] hover:text-white font-bold px-5 py-2 rounded-full text-sm transition-all cursor-pointer">
                        {showGrid ? "Show Less" : "View All Photos"}
                    </button>
                </motion.div>

                <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
                    className="relative rounded-3xl overflow-hidden shadow-2xl cursor-pointer group h-72 md:h-[480px]"
                    onClick={() => setIsLightboxOpen(true)}>
                    <img src={academicGalleryImages[galleryIndex]} alt={`Academic ${galleryIndex + 1}`} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                    <div className="absolute bottom-6 left-8 right-8 flex items-center justify-between">
                        <div>
                            <p className="text-white/60 text-xs uppercase tracking-widest">Academic Life</p>
                            <p className="text-white font-bold">Photo {galleryIndex + 1} of {academicGalleryImages.length}</p>
                        </div>
                        <div className="flex items-center gap-2">
                            {academicGalleryImages.map((_, idx) => (
                                <button key={idx} onClick={e => { e.stopPropagation(); setGalleryIndex(idx); }}
                                    className={`rounded-full transition-all cursor-pointer ${idx === galleryIndex ? "w-6 h-2 bg-[#FB923C]" : "w-2 h-2 bg-white/50 hover:bg-white"}`} />
                            ))}
                        </div>
                    </div>
                    <button onClick={prevImg} className="absolute left-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-black/40 hover:bg-black/70 text-white flex items-center justify-center backdrop-blur-sm transition-all cursor-pointer"><ChevronLeft className="w-5 h-5" /></button>
                    <button onClick={nextImg} className="absolute right-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-black/40 hover:bg-black/70 text-white flex items-center justify-center backdrop-blur-sm transition-all cursor-pointer"><ChevronRight className="w-5 h-5" /></button>
                </motion.div>

                <AnimatePresence>
                    {showGrid && (
                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
                            className="grid grid-cols-2 md:grid-cols-4 gap-4 overflow-hidden">
                            {academicGalleryImages.map((img, idx) => (
                                <motion.div key={idx} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: idx * 0.06 }}
                                    className="relative aspect-square rounded-2xl overflow-hidden cursor-pointer group shadow-lg"
                                    onClick={() => { setGalleryIndex(idx); setIsLightboxOpen(true); }}>
                                    <img src={img} alt={`Gallery ${idx + 1}`} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                                        <span className="text-white text-xs font-semibold">Photo {idx + 1}</span>
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* ── CTA STRIP ── */}
            <div className="bg-[#FB923C] py-12">
                <div className="max-w-4xl mx-auto px-6 text-center space-y-4">
                    <h2 className="text-2xl md:text-3xl font-black text-white">Ready to Begin Your Medical Journey?</h2>
                    <p className="text-orange-100 text-sm">Apply today and join hundreds of students building careers in healthcare.</p>
                    <div className="flex flex-wrap justify-center gap-4 pt-2">
                        <motion.button onClick={() => openForm("admission")} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}
                            className="inline-flex items-center gap-2 bg-white text-[#FB923C] font-black px-8 py-3.5 rounded-full shadow-lg hover:shadow-xl transition-all cursor-pointer">
                            Apply Now <ArrowRight className="w-4 h-4" />
                        </motion.button>
                        <motion.button onClick={() => openForm("internship")} whileHover={{ scale: 1.05 }}
                            className="inline-flex items-center gap-2 border-2 border-white text-white font-bold px-8 py-3.5 rounded-full hover:bg-white/10 transition-all cursor-pointer">
                            Apply for Internship
                        </motion.button>
                    </div>
                </div>
            </div>

            {/* ── LIGHTBOX ── */}
            <AnimatePresence>
                {isLightboxOpen && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[200] bg-black/95 backdrop-blur-md flex items-center justify-center p-4"
                        onClick={() => setIsLightboxOpen(false)}>
                        <button className="absolute top-6 right-6 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer" onClick={() => setIsLightboxOpen(false)}><X className="w-6 h-6" /></button>
                        <button onClick={prevImg} className="absolute left-4 md:left-8 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"><ChevronLeft className="w-8 h-8" /></button>
                        <motion.img key={galleryIndex} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3 }}
                            src={academicGalleryImages[galleryIndex]} alt="Full screen view"
                            className="max-w-full max-h-[85vh] object-contain rounded-2xl shadow-2xl"
                            onClick={e => e.stopPropagation()} />
                        <button onClick={nextImg} className="absolute right-4 md:right-8 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"><ChevronRight className="w-8 h-8" /></button>
                        <div className="absolute bottom-6 left-0 right-0 text-center text-white/60 text-sm font-medium tracking-widest">{galleryIndex + 1} / {academicGalleryImages.length}</div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ── MODAL FORMS ── */}
            <AnimatePresence>
                {activeForm && (
                    <ModalForm type={activeForm} programTitle={selectedProgram} onClose={closeForm} />
                )}
            </AnimatePresence>
        </section>
    );
};

export default Academic;

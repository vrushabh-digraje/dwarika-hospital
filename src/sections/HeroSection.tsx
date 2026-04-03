import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Award, ChevronLeft, ChevronRight, X, Shield, Clock, HeartPulse } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";
import { useTranslation } from "react-i18next";

const DOCTORS = [
    {
        name: "Dr. Sandeep Kumar Shah",
        nmcNo: "7482",
        image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=1000",
        featuredIndex: 0 as const,
    },
    {
        name: "Mrs. Babita Kumari Sah",
        nmcNo: "9521",
        image: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&q=80&w=1000",
        featuredIndex: 1 as const,
    },
    {
        name: "Mr. Sanjeev Kumar Sah",
        nmcNo: "11034",
        image: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=1000",
        featuredIndex: 2 as const,
    },
];

const HERO_IMAGES = [
    "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=90&w=2400",
    "https://images.unsplash.com/photo-1581594693702-fbdc51b2763b?auto=format&fit=crop&q=90&w=2400",
    "https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&q=90&w=2400",
];

const HeroSection = () => {
    const { t } = useTranslation();
    const [currentImage, setCurrentImage] = useState(0);
    const [currentDoctorIndex, setCurrentDoctorIndex] = useState(0);
    const [selectedDoctor, setSelectedDoctor] = useState<typeof DOCTORS[0] | null>(null);
    const navigate = useNavigate();

    const nextDoctor = () => setCurrentDoctorIndex((prev) => (prev + 1) % DOCTORS.length);
    const prevDoctor = () => setCurrentDoctorIndex((prev) => (prev - 1 + DOCTORS.length) % DOCTORS.length);
    const nextImage = () => setCurrentImage((prev) => (prev + 1) % HERO_IMAGES.length);

    useEffect(() => {
        const imageTimer = setInterval(nextImage, 6000);
        return () => clearInterval(imageTimer);
    }, []);

    useEffect(() => {
        const doctorTimer = setInterval(nextDoctor, 4000);
        return () => clearInterval(doctorTimer);
    }, []);

    const TRUST_BADGES = [
        { icon: Shield, label: t('hero.stats.doctors'), value: "50+" },
        { icon: Clock, label: t('hero.stats.emergency'), value: "24/7" },
        { icon: HeartPulse, label: t('hero.stats.patients'), value: "15,000+" },
    ];

    return (
        <>
            <section id="home" className="relative w-full overflow-hidden bg-slate-900" style={{ minHeight: '85vh' }}>
                {/* Full-bleed background image */}
                <AnimatePresence mode="wait">
                    <motion.img
                        key={currentImage}
                        src={HERO_IMAGES[currentImage]}
                        alt=""
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.96 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 1.2 }}
                        className="absolute inset-0 w-full h-full object-cover"
                    />
                </AnimatePresence>

                {/* Narrow left gradient for text area only */}
                <div className="absolute inset-y-0 left-0 w-[58%] bg-[linear-gradient(90deg,rgba(15,23,42,0.72)_0%,rgba(15,23,42,0.56)_34%,rgba(15,23,42,0.18)_72%,transparent_100%)]" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(102,195,255,0.14),transparent_26%),radial-gradient(circle_at_bottom_right,rgba(231,165,76,0.1),transparent_22%)]" />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(2,6,23,0.18)_0%,rgba(2,6,23,0.08)_34%,rgba(2,6,23,0.26)_100%)]" />

                {/* Content */}
                <div className="max-w-7xl mx-auto px-6 lg:px-8 w-full grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center relative z-10 py-14 lg:py-20" style={{ minHeight: '85vh' }}>

                    {/* Left: Text */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="space-y-7"
                    >
                        <div className="space-y-5 max-w-xl rounded-[30px] px-6 py-7 lg:px-8 lg:py-8 border border-white/70 bg-[linear-gradient(180deg,rgba(255,255,255,0.94),rgba(247,250,255,0.9))] shadow-[0_30px_70px_-42px_rgba(15,23,42,0.45)] backdrop-blur-xl">
                            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/20 backdrop-blur-md">
                                <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                                <span className="text-sm font-semibold text-emerald-400">{t('hero.badge')}</span>
                            </div>

                            <h1 className="text-[clamp(2.4rem,5vw,4.2rem)] font-extrabold leading-[1.08] tracking-tight">
                                <span className="text-slate-950">{t('hero.title_part1')}</span><br />
                                <span className="text-primary">{t('hero.title_part2')}</span>
                            </h1>

                            <p className="text-base text-slate-600 max-w-md leading-relaxed">{t('hero.description')}</p>
                        </div>

                        <div className="flex flex-wrap gap-3">
                            <Button
                                onClick={() => navigate('/appointment')}
                                className="px-7 py-3 text-sm font-semibold text-white rounded-xl transition-all hover:scale-[1.02] active:scale-95"
                            >
                                {t('hero.book_appointment')}
                            </Button>
                            <Button
                                variant="outline"
                                className="px-7 py-3 text-sm font-semibold border border-white/35 bg-white/88 text-slate-900 hover:bg-white rounded-xl transition-all hover:scale-[1.02] active:scale-95"
                                onClick={() => document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' })}
                            >
                                {t('hero.explore_services')}
                            </Button>
                        </div>

                        {/* Trust Badges */}
                        <div className="flex flex-wrap gap-4 pt-5 border-t border-white/12">
                            {TRUST_BADGES.map((badge) => (
                                <div key={badge.label} className="flex items-center gap-2.5 rounded-2xl bg-slate-950/64 px-4 py-3 backdrop-blur-md border border-white/16 shadow-[0_18px_40px_-28px_rgba(15,23,42,0.6)]">
                                    <div className="w-10 h-10 rounded-xl bg-white/12 flex items-center justify-center ring-1 ring-white/10">
                                        <badge.icon className="w-4 h-4 text-primary-light" />
                                    </div>
                                    <div>
                                        <p className="text-white font-bold text-base leading-none">{badge.value}</p>
                                        <p className="mt-1 text-white/88 text-sm leading-snug">{badge.label}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Right: Doctor Card */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                        className="relative flex justify-center lg:justify-end"
                    >
                        <div className="relative w-full max-w-xs lg:max-w-sm">
                            <div className="relative bg-white/80 backdrop-blur-xl rounded-[30px] overflow-hidden shadow-[0_40px_100px_-50px_rgba(15,23,42,0.85)] border border-white/30">
                                <div className="relative aspect-[3/4] overflow-hidden">
                                    <AnimatePresence mode="wait">
                                        <motion.img
                                            key={currentDoctorIndex}
                                            src={DOCTORS[currentDoctorIndex].image}
                                            alt={DOCTORS[currentDoctorIndex].name}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            transition={{ duration: 0.5 }}
                                            className="absolute inset-0 w-full h-full object-cover"
                                        />
                                    </AnimatePresence>
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                                    <div className="absolute top-1/2 -translate-y-1/2 inset-x-2 flex justify-between z-20">
                                        <button onClick={(e) => { e.stopPropagation(); prevDoctor(); }} className="w-8 h-8 rounded-full bg-white/90 shadow flex items-center justify-center text-slate-700 hover:bg-white transition-all">
                                            <ChevronLeft className="w-4 h-4" />
                                        </button>
                                        <button onClick={(e) => { e.stopPropagation(); nextDoctor(); }} className="w-8 h-8 rounded-full bg-white/90 shadow flex items-center justify-center text-slate-700 hover:bg-white transition-all">
                                            <ChevronRight className="w-4 h-4" />
                                        </button>
                                    </div>

                                    <div className="absolute bottom-0 inset-x-0 p-4">
                                        <span className="inline-block px-2.5 py-0.5 bg-primary rounded text-xs font-semibold text-white mb-1.5">
                                            {t(`hero.featured.${DOCTORS[currentDoctorIndex].featuredIndex}.specialization`)}
                                        </span>
                                        <h3 className="text-lg font-bold text-white">{DOCTORS[currentDoctorIndex].name}</h3>
                                        <p className="text-white/70 text-sm">{t(`hero.featured.${DOCTORS[currentDoctorIndex].featuredIndex}.qualification`)}</p>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between p-3 bg-white/80 border-t border-slate-100/70">
                                    <div className="flex gap-1.5">
                                        {DOCTORS.map((_, idx) => (
                                            <button key={idx} onClick={() => setCurrentDoctorIndex(idx)}
                                                className={`h-1.5 rounded-full transition-all ${currentDoctorIndex === idx ? 'w-5 bg-primary' : 'w-2.5 bg-slate-300'}`} />
                                        ))}
                                    </div>
                                    <button onClick={() => setSelectedDoctor(DOCTORS[currentDoctorIndex])} className="text-sm font-semibold text-primary hover:text-primary-hover transition-colors">
                                        {t('hero.view_profile')}
                                    </button>
                                </div>
                            </div>

                            {/* Floating badge */}
                            <motion.div
                                animate={{ y: [0, -6, 0] }}
                                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                                className="absolute -top-3 -left-3 soft-card rounded-xl p-2.5 hidden lg:flex items-center gap-2 z-30"
                            >
                                <div className="w-8 h-8 bg-emerald-50 rounded-lg flex items-center justify-center">
                                    <Award className="w-4 h-4 text-emerald-600" />
                                </div>
                                <div>
                                    <p className="text-slate-900 font-bold text-xs">{t('hero.award_badge_title')}</p>
                                    <p className="text-slate-400 text-[10px]">{t('hero.award_badge_subtitle')}</p>
                                </div>
                            </motion.div>
                        </div>
                    </motion.div>
                </div>

                {/* Image dots */}
                <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2 z-30">
                    {HERO_IMAGES.map((_, index) => (
                        <button key={index} onClick={() => setCurrentImage(index)}
                            className={`h-1.5 rounded-full transition-all ${currentImage === index ? "w-7 bg-white" : "w-3 bg-white/40"}`} />
                    ))}
                </div>
            </section>

            {/* Doctor Profile Modal */}
            <AnimatePresence>
                {selectedDoctor && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
                        onClick={() => setSelectedDoctor(null)}>
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 20 }}
                            transition={{ type: "spring", damping: 30, stiffness: 300 }}
                            className="relative bg-white rounded-2xl overflow-hidden max-w-sm w-full shadow-2xl"
                            onClick={(e) => e.stopPropagation()}>
                            <button onClick={() => setSelectedDoctor(null)} className="absolute top-3 right-3 z-10 p-2 bg-white/80 hover:bg-white rounded-full text-slate-600 shadow-sm transition-all">
                                <X className="w-4 h-4" />
                            </button>
                            <div className="relative aspect-[4/5] w-full">
                                <img src={selectedDoctor.image} alt={selectedDoctor.name} className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent" />
                                <div className="absolute bottom-0 inset-x-0 p-6">
                                    <span className="inline-block px-3 py-1 bg-primary/80 rounded-md mb-2 text-[13px] font-semibold text-white">{t(`hero.featured.${selectedDoctor.featuredIndex}.specialization`)}</span>
                                    <h3 className="text-xl font-bold text-white mb-1">{selectedDoctor.name}</h3>
                                    <p className="text-white/70 text-base">{t(`hero.featured.${selectedDoctor.featuredIndex}.qualification`)}</p>
                                    <p className="text-white/40 text-sm mt-1">{t('hero.nmc_no', { no: selectedDoctor.nmcNo })}</p>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default HeroSection;

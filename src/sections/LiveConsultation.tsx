import { useState } from 'react';
import { motion } from 'framer-motion';
import { Video, CalendarCheck, Wifi } from 'lucide-react';
import Button from '../components/Button';
import { useTranslation } from 'react-i18next';
import VideoConsultationModal from "../components/VideoConsultationModal";

const LiveConsultation = () => {
    const { t } = useTranslation();
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <>
            <section className="px-4 sm:px-6 lg:px-8 py-10 lg:py-14 overflow-hidden">
                <div className="max-w-7xl mx-auto">
                    <div className="rounded-[32px] lg:rounded-[40px] overflow-hidden shadow-[var(--shadow-card)] text-white relative border border-white/10 bg-[radial-gradient(circle_at_top_left,rgba(102,195,255,0.22),transparent_26%),linear-gradient(135deg,#0d1728_0%,#10233d_52%,#17365d_100%)]">
                        {/* Background Pattern */}
                        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] mix-blend-overlay"></div>
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent pointer-events-none" />
                        
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center p-6 sm:p-10 lg:p-14 relative z-10">
                            <motion.div 
                                initial={{ opacity: 0, x: -30 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6 }}
                                className="space-y-10"
                            >
                                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/10 backdrop-blur-md">
                                    <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                                    <span className="text-sm font-medium text-white/70">{t('live_consultation.available_now')}</span>
                                </div>
                                
                                <h2 className="text-4xl sm:text-5xl lg:text-5xl font-bold leading-[1.1] tracking-tight text-white">
                                    {t('live_consultation.heading_part1')}<br/>
                                    <span className="text-sky-400">{t('live_consultation.heading_part2')}</span>
                                </h2>
                                
                                <p className="text-slate-400 text-lg max-w-xl leading-relaxed">
                                    {t('live_consultation.description')}
                                </p>

                                <div className="flex flex-col sm:flex-row items-center gap-6 pt-2">
                                    <Button 
                                        onClick={() => setIsModalOpen(true)}
                                        className="w-full sm:w-auto text-white font-semibold px-8 py-4 rounded-xl flex items-center justify-center gap-2 uppercase tracking-wide text-xs transition-all"
                                    >
                                        <CalendarCheck className="w-4 h-4" />
                                        {t('live_consultation.book_consultation')}
                                    </Button>
                                    <div className="flex items-center gap-4 px-4 py-2">
                                        <div className="p-3 bg-white/10 rounded-xl border border-white/10 shadow-inner">
                                            <Video className="w-5 h-5 text-primary" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-semibold text-primary uppercase tracking-widest">{t('live_consultation.secure_video')}</p>
                                            <p className="text-sm font-bold text-white tracking-wide">{t('live_consultation.hd_quality')}</p>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>

                            <motion.div 
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: 0.2 }}
                                className="relative lg:h-full flex justify-center lg:justify-end mt-8 lg:mt-0"
                            >
                                <div className="relative w-full max-w-md aspect-square lg:aspect-auto lg:h-[420px]">
                                    {/* Abstract shapes behind */}
                                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-primary/20 rounded-full blur-[80px]"></div>
                                    
                                    <div className="relative z-10 w-full h-full p-2 bg-white/10 backdrop-blur-sm rounded-3xl border border-white/10 shadow-[0_30px_80px_-40px_rgba(0,0,0,0.55)]">
                                        <img 
                                            src="https://images.unsplash.com/photo-1614608682850-e0d6ed316d47?auto=format&fit=crop&q=80&w=1000" 
                                            alt="Dr. Sarah Johnson" 
                                            className="w-full h-full object-cover rounded-2xl shadow-xl"
                                        />
                                    </div>
                                    
                                    {/* Floating Badge */}
                                    <motion.div 
                                        animate={{ y: [0, -8, 0] }}
                                        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                        className="absolute bottom-6 -left-4 md:-left-8 z-20 soft-card text-slate-900 p-4 rounded-2xl flex items-center gap-4"
                                    >
                                        <div className="p-2 sm:p-2.5 bg-emerald-100 rounded-xl">
                                            <Wifi className="w-5 h-5 text-emerald-600" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest">{t('live_consultation.connection')}</p>
                                            <p className="text-sm font-bold tracking-tight">{t('live_consultation.stable_secure')}</p>
                                        </div>
                                    </motion.div>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </section>
            <VideoConsultationModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        </>
    );
};

export default LiveConsultation;

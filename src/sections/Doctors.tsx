import { useState } from 'react';
import { Card } from '../components/Card';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import { useTranslation } from 'react-i18next';

import { doctors } from '../lib/teamData';

const Doctors = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [filter, setFilter] = useState('All');
    const [selectedDoctor, setSelectedDoctor] = useState<typeof doctors[0] | null>(null);

    const categories = ['All', ...Array.from(new Set(doctors.map(d => d.category)))];
    const filteredDoctors = doctors.filter(d => filter === 'All' || d.category === filter);

    return (
        <section id="doctors" className="px-4 sm:px-6 lg:px-8 py-10 lg:py-14 relative overflow-hidden">
            <div className="home-band-inner premium-surface premium-tint rounded-[32px] lg:rounded-[40px] px-6 sm:px-8 lg:px-10 py-12 lg:py-16 max-w-7xl mx-auto relative z-10">
                <div className="ambient-orb top-8 left-4 h-32 w-32 bg-primary/10" />
                <div className="ambient-orb bottom-10 right-6 h-28 w-28 bg-sky-200/20" />
                <div className="max-w-2xl mb-10 lg:mb-12 section-intro">
                    <p className="section-label text-primary font-semibold text-sm tracking-wide uppercase">{t('doctors.section_title')}</p>
                    <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 tracking-tight leading-[1.1] mb-6">
                        {t('doctors.heading_part1')}<span className="text-primary">{t('doctors.heading_part2')}</span>
                    </h2>
                </div>

                <div className="flex flex-wrap gap-2 mb-10">
                    {categories.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setFilter(cat)}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${filter === cat
                                ? 'bg-primary text-white shadow-[0_18px_35px_-24px_rgba(15,76,151,0.8)]'
                                : 'bg-white/70 text-slate-500 hover:text-slate-800 border border-white/70 backdrop-blur-sm'
                            }`}
                        >
                            {cat === 'All' ? t('common.all') : cat}
                        </button>
                    ))}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                    <AnimatePresence mode="popLayout">
                        {filteredDoctors.map((doctor) => (
                            <motion.div
                                layout
                                key={doctor.name}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 20 }}
                                transition={{ duration: 0.3 }}
                            >
                                <Card className="group p-0 overflow-hidden rounded-[28px] transition-all duration-300 hover:-translate-y-1 flex flex-col h-full">
                                    <div
                                        className="relative h-56 overflow-hidden bg-slate-100 cursor-pointer"
                                        onClick={() => navigate('/appointment', { state: { doctorName: doctor.name, department: doctor.category } })}
                                    >
                                        <img
                                            src={doctor.image}
                                            alt={doctor.name}
                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                            loading="lazy"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10">
                                            <span className="bg-white text-primary px-4 py-2 rounded-lg text-xs font-semibold shadow-lg flex items-center gap-2">
                                                <Calendar className="w-3.5 h-3.5" /> {t('doctors.book_appointment')}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="p-5 flex flex-col flex-grow">
                                        <h3 className="text-base font-semibold text-slate-900 mb-1 group-hover:text-primary transition-colors">{doctor.name}</h3>
                                        <p className="text-primary font-medium text-xs mb-1">{doctor.category}</p>
                                        <p className="text-slate-500 text-sm line-clamp-2">{doctor.specialty}</p>
                                    </div>
                                </Card>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>

                <AnimatePresence>
                    {selectedDoctor && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedDoctor(null)}
                            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
                        >
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                                onClick={(e) => e.stopPropagation()}
                                className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[90vh]"
                            >
                                <button
                                    onClick={() => setSelectedDoctor(null)}
                                    className="absolute top-4 right-4 p-2 bg-white/80 hover:bg-slate-100 rounded-full text-slate-500 transition-all z-20"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                                <div className="w-full md:w-2/5 h-56 md:h-auto relative shrink-0">
                                    <img src={selectedDoctor.image} alt={selectedDoctor.name} className="absolute inset-0 w-full h-full object-cover" />
                                </div>
                                <div className="p-8 flex flex-col flex-1 overflow-y-auto">
                                    <span className="inline-flex px-3 py-1 mb-3 text-xs font-semibold text-primary bg-blue-50 rounded-lg self-start">
                                        {selectedDoctor.category}
                                    </span>
                                    <h3 className="text-xl font-bold text-slate-900 mb-1">{selectedDoctor.name}</h3>
                                    <p className="text-sm text-slate-500 mb-6">{selectedDoctor.specialty}</p>
                                    <div className="space-y-3 text-sm text-slate-600 leading-relaxed mb-8">
                                        <p>{t('doctors.expert_of', { name: selectedDoctor.name.split(' ').pop(), category: selectedDoctor.category })}</p>
                                        <p>{t('doctors.patient_centric')}</p>
                                    </div>
                                    <div className="mt-auto pt-4 border-t border-slate-100">
                                        <Button
                                            onClick={() => { setSelectedDoctor(null); navigate('/appointment', { state: { doctorName: selectedDoctor.name, department: selectedDoctor.category } }); }}
                                            className="w-full rounded-xl py-3 font-semibold text-sm shadow-sm"
                                        >
                                            {t('doctors.book_appointment')}
                                        </Button>
                                    </div>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </section>
    );
};

export default Doctors;

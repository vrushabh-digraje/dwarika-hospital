import { motion } from 'framer-motion';
import { Heart, Clock, ShieldCheck, Smile, Star, HeartHandshake } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import { useTranslation } from 'react-i18next';

const getFeatures = (t: any) => [
    {
        icon: Heart,
        title: t('patient_experience.features.compassionate.title'),
        description: t('patient_experience.features.compassionate.desc')
    },
    {
        icon: Clock,
        title: t('patient_experience.features.wait_times.title'),
        description: t('patient_experience.features.wait_times.desc')
    },
    {
        icon: ShieldCheck,
        title: t('patient_experience.features.safety.title'),
        description: t('patient_experience.features.safety.desc')
    },
    {
        icon: Smile,
        title: t('patient_experience.features.holistic.title'),
        description: t('patient_experience.features.holistic.desc')
    }
];

const PatientExperience = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const features = getFeatures(t);

    return (
        <section className="px-4 sm:px-6 lg:px-8 py-10 lg:py-14 overflow-hidden relative">
             {/* Background Decorative Elements */}
             <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] pointer-events-none -translate-y-1/2 translate-x-1/2" />
             <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-slate-200/50 rounded-full blur-[100px] pointer-events-none translate-y-1/2 -translate-x-1/2" />
            
            <div className="home-band-inner premium-surface rounded-[32px] lg:rounded-[40px] px-6 sm:px-8 lg:px-10 py-12 lg:py-16 max-w-7xl mx-auto relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-20 items-center">
                    {/* Left Content */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="space-y-10"
                    >
                        <div className="space-y-6">
                            <div className="section-label text-primary">
                                <HeartHandshake className="w-4 h-4" />
                                <span className="text-[10px] font-semibold uppercase tracking-widest">{t('patient_experience.badge')}</span>
                            </div>
                            <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 tracking-tight font-heading leading-tight">
                                {t('patient_experience.heading_part1')}<span className="text-primary">{t('patient_experience.heading_part2')}</span>
                            </h2>
                            <p className="text-slate-600 font-normal text-lg leading-relaxed max-w-lg">
                                {t('patient_experience.description')}
                            </p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-10">
                            {features.map((feature, index) => (
                                <div key={index} className="flex gap-4 group">
                                    <div className="shrink-0">
                                        <div className="w-12 h-12 soft-card rounded-xl flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300">
                                            <feature.icon className="w-5 h-5" />
                                        </div>
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-slate-900 text-[15px] tracking-tight mb-2 font-heading transition-colors group-hover:text-primary">{feature.title}</h4>
                                        <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">{feature.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="pt-6 border-t border-slate-200/60">
                            <Button
                                onClick={() => navigate('/our-story')}
                                className="rounded-xl px-10 py-4 bg-primary text-white hover:bg-primary-hover shadow-md font-semibold text-xs tracking-widest transition-all uppercase"
                            >
                                {t('patient_experience.read_story')}
                            </Button>
                        </div>
                    </motion.div>

                    {/* Right Image Composition */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="relative lg:h-[600px] flex items-center justify-center"
                    >
                        <div className="relative z-10 w-full h-full max-h-[500px] lg:max-h-none rounded-3xl overflow-hidden shadow-[var(--shadow-card)] p-2 bg-white/55 backdrop-blur-sm border border-white/60">
                            <div className="w-full h-full rounded-2xl overflow-hidden relative">
                                <video
                                    autoPlay
                                    loop
                                    muted
                                    playsInline
                                    className="w-full h-full object-cover scale-[1.02]"
                                    poster="https://images.unsplash.com/photo-1581056771107-24ca5f033842?auto=format&fit=crop&q=80&w=1470"
                                >
                                    <source src="https://assets.mixkit.co/videos/preview/mixkit-nurse-checking-a-patient-s-iv-drip-4968-large.mp4" type="video/mp4" />
                                </video>
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-slate-900/10 to-transparent mix-blend-multiply" />
                            </div>
                        </div>

                        {/* Floating Review Card */}
                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            whileInView={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.4, duration: 0.6 }}
                            className="absolute bottom-8 -left-4 sm:-left-12 soft-card p-6 rounded-2xl max-w-xs z-20"
                        >
                            <div className="flex items-center gap-1 mb-4">
                                 {[1, 2, 3, 4, 5].map(i => (
                                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                                ))}
                            </div>
                            <p className="text-sm font-medium text-slate-700 italic mb-5 leading-relaxed">{t('patient_experience.testimonial')}</p>
                            <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
                                <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden shadow-inner">
                                    <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100" alt="Patient" className="w-full h-full object-cover"/>
                                </div>
                                <div>
                                    <p className="text-xs font-bold uppercase text-slate-900 tracking-wider">{t('patient_experience.patient_name')}</p>
                                    <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest mt-0.5">{t('patient_experience.patient_status')}</p>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default PatientExperience;

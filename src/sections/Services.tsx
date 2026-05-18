import { useState } from 'react';
import {
    Siren,
    FlaskConical,
    Pill,
    Stethoscope,
    Bed,
    Users,
    Smile,
    Scissors,
    Bone,
    Waves,
    Activity,
    Heart,
    Ambulance,
    Car,
    ChevronDown,
    ChevronUp,
    X,
    Calendar
} from 'lucide-react';
import { Card } from '../components/Card';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../components/Button';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

// eslint-disable-next-line react-refresh/only-export-components
// eslint-disable-next-line react-refresh/only-export-components
export const getServices = (t: any) => [
    {
        icon: Siren,
        title: t('services.list.emergency_24h.title'),
        desc: t('services.list.emergency_24h.desc'),
        image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=1470',
        category: t('services.list.emergency_24h.category'),
    },
    {
        icon: FlaskConical,
        title: t('services.list.lab_24h.title'),
        desc: t('services.list.lab_24h.desc'),
        image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5a0a452?auto=format&fit=crop&q=80&w=1470',
        category: t('services.list.lab_24h.category'),
    },
    {
        icon: Pill,
        title: t('services.list.pharmacy_24h.title'),
        desc: t('services.list.pharmacy_24h.desc'),
        image: 'https://images.unsplash.com/photo-1584308666744-8480404b65ae?auto=format&fit=crop&q=80&w=1470',
        category: t('services.list.pharmacy_24h.category'),
    },
    {
        icon: Stethoscope,
        title: t('services.list.opd.title'),
        desc: t('services.list.opd.desc'),
        image: 'https://images.unsplash.com/photo-1551884828-425A5b014a03?auto=format&fit=crop&q=80&w=1470',
        category: t('services.list.opd.category'),
    },
    {
        icon: Bed,
        title: t('services.list.inpatient.title'),
        desc: t('services.list.inpatient.desc'),
        image: 'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fit=crop&q=80&w=1470',
        category: t('services.list.inpatient.category'),
    },
    {
        icon: Users,
        title: t('services.list.specialist.title'),
        desc: t('services.list.specialist.desc'),
        image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=1470',
        category: t('services.list.specialist.category'),
    },
    {
        icon: Smile,
        title: t('services.list.dental.title'),
        desc: t('services.list.dental.desc'),
        image: 'https://images.unsplash.com/photo-1606228963436-67534933a599?auto=format&fit=crop&q=80&w=1470',
        category: t('services.list.dental.category'),
    },
    {
        icon: Scissors,
        title: t('services.list.surgery.title'),
        desc: t('services.list.surgery.desc'),
        image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&q=80&w=1470',
        category: t('services.list.surgery.category'),
    },
    {
        icon: Bone,
        title: t('services.list.xray.title'),
        desc: t('services.list.xray.desc'),
        image: 'https://images.unsplash.com/photo-1530497610242-d843ab394da8?auto=format&fit=crop&q=80&w=1470',
        category: t('services.list.xray.category'),
    },
    {
        icon: Waves,
        title: t('services.list.usg.title'),
        desc: t('services.list.usg.desc'),
        image: 'https://images.unsplash.com/photo-1581092580423-9c27c1f8f13c?auto=format&fit=crop&q=80&w=1470',
        category: t('services.list.usg.category'),
    },
    {
        icon: Activity,
        title: t('services.list.ecg.title'),
        desc: t('services.list.ecg.desc'),
        image: 'https://images.unsplash.com/photo-1526256262350-7da7584cf5eb?auto=format&fit=crop&q=80&w=1470',
        category: t('services.list.ecg.category'),
    },
    {
        icon: Heart,
        title: t('services.list.echo.title'),
        desc: t('services.list.echo.desc'),
        image: 'https://images.unsplash.com/photo-1629102892200-73a6288c1605?auto=format&fit=crop&q=80&w=1470',
        category: t('services.list.echo.category'),
    },
    {
        icon: Ambulance,
        title: t('services.list.ambulance.title'),
        desc: t('services.list.ambulance.desc'),
        image: 'https://images.unsplash.com/photo-1605289982774-9a6fef564df8?auto=format&fit=crop&q=80&w=1528',
        category: t('services.list.ambulance.category'),
    },
    {
        icon: Car,
        title: t('services.list.parking.title'),
        desc: t('services.list.parking.desc'),
        image: 'https://images.unsplash.com/photo-1543465077-5828b53c3423?auto=format&fit=crop&q=80&w=1470',
        category: t('services.list.parking.category'),
        hideRequest: true,
    },
];

// eslint-disable-next-line react-refresh/only-export-components
export const getServiceImageSlug = (title: string) =>
    title.toLowerCase().replace(/\s+/g, '-');

const Services = () => {
    const { t } = useTranslation();
    const services = getServices(t);
    const [showAll, setShowAll] = useState(false);
    const [selectedService, setSelectedService] = useState<any | null>(null);
    const [failedLocalImages, setFailedLocalImages] = useState<Set<string>>(new Set());
    const displayServices = showAll ? services : services.slice(0, 4);
    const navigate = useNavigate();

    const getImageSrc = (service: any) => {
        if (failedLocalImages.has(service.title)) return service.image;
        return `/images/services/${getServiceImageSlug(service.title)}.png`;
    };
    const handleImageError = (title: string, fallbackUrl: string) => (
        (e: React.SyntheticEvent<HTMLImageElement>) => {
            const img = e.currentTarget;
            if (img.src === fallbackUrl) return;
            if (img.src.endsWith('.png')) {
                img.src = img.src.replace('.png', '.jpg');
                return;
            }
            setFailedLocalImages((prev) => new Set(prev).add(title));
            img.src = fallbackUrl;
        }
    );

    return (
        <section id="services" className="px-4 sm:px-6 lg:px-8 py-10 lg:py-14 relative">
            <div className="home-band-inner premium-surface rounded-[32px] lg:rounded-[40px] px-6 sm:px-8 lg:px-10 py-12 lg:py-16 max-w-7xl mx-auto">
                <div className="ambient-orb -top-2 right-0 h-36 w-36 bg-sky-300/20" />
                <div className="ambient-orb bottom-6 left-6 h-28 w-28 bg-amber-200/20" />
                <div className="max-w-2xl mb-10 lg:mb-12 section-intro relative z-10">
                    <p className="section-label text-primary font-semibold text-sm tracking-wide uppercase">{t('services.section_title')}</p>
                    <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 tracking-tight leading-[1.1] mb-6">
                        {t('services.heading_part1')}<span className="text-primary">{t('services.heading_part2')}</span>
                    </h2>
                    <p className="text-slate-500 text-lg leading-relaxed">
                        {t('services.description')}
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 relative z-10">
                    <AnimatePresence mode='popLayout'>
                        {displayServices.map((service, idx) => (
                            <motion.div
                                layout
                                key={service.title}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 20 }}
                                transition={{ duration: 0.4, delay: idx * 0.03 }}
                                className="group"
                            >
                                <button
                                    onClick={() => setSelectedService(service)}
                                    className="block h-full w-full text-left focus:outline-none"
                                >
                                    <Card className="overflow-hidden rounded-[28px] transition-all duration-300 hover:-translate-y-1 flex flex-col h-full p-0">
                                        <div className="relative aspect-video overflow-hidden bg-slate-100">
                                            <img
                                                src={getImageSrc(service)}
                                                alt={service.title}
                                                loading="lazy"
                                                decoding="async"
                                                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                                onError={handleImageError(service.title, service.image)}
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                                            <div className="absolute top-3 right-3 p-2.5 bg-white/90 backdrop-blur-md rounded-xl shadow-sm soft-ring">
                                                <service.icon className="w-4 h-4 text-primary" />
                                            </div>
                                        </div>
                                        <div className="p-5 flex flex-col flex-grow">
                                            <h3 className="text-base font-semibold text-slate-900 mb-2 group-hover:text-primary transition-colors">{service.title}</h3>
                                            <p className="text-sm text-slate-500 leading-relaxed line-clamp-2">
                                                {service.desc}
                                            </p>
                                        </div>
                                    </Card>
                                </button>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>

                <div className="mt-12 text-center relative z-10">
                    <Button
                        variant="outline"
                        size="lg"
                        className="rounded-full group/btn min-w-[200px] font-semibold text-slate-700"
                        onClick={() => setShowAll(!showAll)}
                    >
                        {showAll ? t('services.show_less') : t('services.view_all')}
                        {showAll ? (
                            <ChevronUp className="w-4 h-4 ml-2 transition-transform duration-300" />
                        ) : (
                            <ChevronDown className="w-4 h-4 ml-2 transition-transform duration-300" />
                        )}
                    </Button>
                </div>
            </div>

            {/* Service Detail Modal */}
            <AnimatePresence>
                {selectedService && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedService(null)}
                            className="absolute inset-0 bg-slate-900/40 backdrop-blur-md"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 10 }}
                            onClick={(e) => e.stopPropagation()}
                            className="relative bg-white w-full max-w-4xl rounded-[2rem] shadow-2xl flex flex-col md:flex-row max-h-[90vh] overflow-hidden"
                        >
                            <button
                                onClick={() => setSelectedService(null)}
                                className="absolute top-5 right-5 z-20 p-2.5 bg-white/50 backdrop-blur-md hover:bg-slate-100 rounded-full text-slate-600 transition-all border border-slate-200/50 shadow-sm"
                            >
                                <X className="w-5 h-5" />
                            </button>

                            <div className="w-full md:w-2/5 h-64 md:h-auto relative shrink-0">
                                <img
                                    src={getImageSrc(selectedService)}
                                    alt={selectedService.title}
                                    className="absolute inset-0 w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent"></div>
                            </div>

                            <div className="p-8 md:p-12 space-y-8 overflow-y-auto flex-1">
                                <div className="space-y-4">
                                    <div className="inline-flex px-4 py-1.5 bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-widest rounded-full border border-primary/20">
                                        {selectedService.category}
                                    </div>
                                    <h2 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight font-heading">
                                        {selectedService.title}
                                    </h2>
                                </div>

                                <div className="space-y-6">
                                    <div className="flex items-start gap-5 p-5 bg-slate-50 rounded-2xl border border-slate-100">
                                        <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-primary shrink-0 shadow-sm border border-slate-100">
                                            <selectedService.icon className="w-6 h-6" />
                                        </div>
                                        <p className="text-slate-600 text-base leading-relaxed font-normal pt-1">
                                            {selectedService.desc}
                                        </p>
                                    </div>
                                    <p className="text-slate-500 text-sm leading-relaxed font-normal">
                                        {t('services.modal.disclaimer', { service: selectedService.title.toLowerCase() })}
                                    </p>
                                </div>

                                {!selectedService.hideRequest && (
                                    <div className="flex flex-col sm:flex-row gap-4 pt-8 mt-auto border-t border-slate-100">
                                        <Button
                                            className="flex-1 bg-primary hover:bg-primary-hover text-white font-semibold uppercase text-xs tracking-wide py-4.5 rounded-xl shadow-lg shadow-primary/20 flex items-center justify-center gap-2 border-0 transition-all"
                                            onClick={() => {
                                                setSelectedService(null);
                                                const contactSection = document.getElementById('contact');
                                                if (contactSection) {
                                                    contactSection.scrollIntoView({ behavior: 'smooth' });
                                                } else {
                                                    navigate('/#contact');
                                                }
                                            }}
                                        >
                                            <Calendar className="w-4 h-4" />
                                            {t('services.modal.request_appointment')}
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </section>
    );
};

export default Services;

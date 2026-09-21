import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card } from '../components/Card';
import { getServices, getServiceImageSlug } from '../sections/Services';
import Button from '../components/Button';
import { Calendar, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const AllServices = () => {
    const { t } = useTranslation();
    const services = getServices(t);
    const [failedLocalImages, setFailedLocalImages] = useState<Set<string>>(new Set());
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
        <>
            <div className="bg-gray-50 min-h-screen py-20 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16 space-y-4">
                        <h1 className="text-4xl lg:text-5xl font-black text-blue-900 uppercase leading-tight">
                            All Medical <span className="text-red-600">Services</span>
                        </h1>
                        <p className="text-gray-500 font-medium max-w-2xl mx-auto">
                            Explore our comprehensive range of medical services designed to provide the best care for you and your family.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {services.map((service: any, index: number) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 24 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.05 }}
                                className="group"
                            >
                                <Card className="overflow-hidden rounded-[2rem] shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-gray-100 flex flex-col h-full bg-white relative">
                                    <div className="relative aspect-[4/3] min-h-[180px] overflow-hidden rounded-t-[2rem] bg-gray-100">
                                        <img
                                            src={getImageSrc(service)}
                                            alt={service.title}
                                            loading="lazy"
                                            decoding="async"
                                            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                            onError={handleImageError(service.title, service.image)}
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                                        <div className="absolute top-4 right-4 p-3 bg-white/90 backdrop-blur-sm rounded-2xl shadow-md border border-white/20">
                                            <service.icon className="w-6 h-6 text-blue-900" />
                                        </div>
                                    </div>
                                    <div className="p-8 flex flex-col flex-grow">
                                        <h3 className="text-lg font-black text-blue-950 mb-3 uppercase tracking-tight leading-tight">{service.title}</h3>
                                        <p className="text-sm text-gray-500 font-medium leading-relaxed mb-8 flex-grow line-clamp-3">{service.desc}</p>
                                        
                                        <div className="space-y-3 mt-auto">
                                            <Button
                                                className="w-full bg-red-600 hover:bg-red-700 text-white font-black uppercase text-[10px] tracking-widest py-4 rounded-xl flex items-center justify-center gap-2 group/btn shadow-lg shadow-red-600/20"
                                                onClick={() => {
                                                    const contactSection = document.getElementById('contact');
                                                    if (contactSection) {
                                                        contactSection.scrollIntoView({ behavior: 'smooth' });
                                                    } else {
                                                        navigate('/#contact');
                                                    }
                                                }}
                                            >
                                                <Calendar className="w-4 h-4" />
                                                Book Appointment
                                            </Button>
                                            
                                            <a 
                                                href={`/services/${service.title.toLowerCase().replace(/ /g, '-')}`}
                                                className="flex items-center justify-center gap-1.5 text-blue-900 font-black uppercase text-[10px] tracking-widest hover:text-blue-700 transition-colors py-2"
                                            >
                                                View Details
                                                <ChevronRight className="w-3.5 h-3.5" />
                                            </a>
                                        </div>
                                    </div>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
};

export default AllServices;
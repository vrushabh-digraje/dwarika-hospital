import { motion } from 'framer-motion';
import { Bed, ShieldCheck, Zap, Scissors, FlaskConical, Stethoscope } from 'lucide-react';

const stats = [
    { label: "Total Beds", value: "100+", icon: Bed },
    { label: "Operation Theaters", value: "4", icon: Scissors },
    { label: "ICU/NICU Beds", value: "15", icon: ShieldCheck },
    { label: "Specialties", value: "20+", icon: Stethoscope },
];

const facilities = [
    {
        title: "Modular Operation Theatres",
        description: "Equipped with laminar airflow and the latest surgical technology for superior infection control.",
        image: "https://images.unsplash.com/photo-1551076805-e1869033e561?auto=format&fit=crop&q=80&w=800",
        icon: Scissors
    },
    {
        title: "Advanced Diagnostic Lab",
        description: "24/7 fully automated laboratory providing high-precision results for critical care.",
        image: "https://images.unsplash.com/photo-1579152276532-59598e84146a?auto=format&fit=crop&q=80&w=800",
        icon: FlaskConical
    },
    {
        title: "Emergency Care Unit",
        description: "Ready to handle trauma and critical emergencies with a dedicated team available round the clock.",
        image: "https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&q=80&w=800",
        icon: Zap
    }
];

const AboutInfrastructure = () => {
    return (
        <section className="py-20 bg-slate-50">
            <div className="max-w-7xl mx-auto px-6">
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-black text-blue-950 uppercase tracking-tight mb-4">Infrastructure & Facilities</h2>
                    <div className="w-20 h-1.5 bg-blue-600 mx-auto rounded-full mb-6"></div>
                    <p className="text-gray-600 max-w-2xl mx-auto text-lg font-medium">
                        World-class facilities spanning across 50,000+ sq. ft., designed for patient safety, comfort, and clinical excellence.
                    </p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20">
                    {stats.map((stat, index) => (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 text-center flex flex-col items-center"
                        >
                            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 mb-4">
                                <stat.icon className="w-6 h-6" />
                            </div>
                            <div className="text-3xl font-black text-blue-950 mb-1">{stat.value}</div>
                            <div className="text-xs font-bold text-gray-400 uppercase tracking-widest">{stat.label}</div>
                        </motion.div>
                    ))}
                </div>

                <div className="space-y-12">
                    {facilities.map((item, index) => (
                        <motion.div
                            key={item.title}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                            className={`flex flex-col ${index % 2 === 1 ? 'md:flex-row-reverse' : 'md:flex-row'} items-center gap-12`}
                        >
                            <div className="flex-1">
                                <div className="relative rounded-3xl overflow-hidden shadow-2xl aspect-video">
                                    <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                                    <div className="absolute inset-0 bg-blue-950/10 group-hover:bg-transparent transition-colors duration-500"></div>
                                </div>
                            </div>
                            <div className="flex-1 space-y-6">
                                <div className="w-14 h-14 bg-white shadow-xl rounded-2xl flex items-center justify-center text-blue-600">
                                    <item.icon className="w-7 h-7" />
                                </div>
                                <h3 className="text-3xl font-black text-blue-950 leading-tight">{item.title}</h3>
                                <p className="text-gray-600 text-lg leading-relaxed">{item.description}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default AboutInfrastructure;

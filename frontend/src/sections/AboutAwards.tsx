import { motion, AnimatePresence } from 'framer-motion';
import { Award, ShieldCheck, FileCheck, X, ZoomIn } from 'lucide-react';
import { useState } from 'react';

// Import images
import businessCert from '../assets/certificates/business_registration.jpg';
import panCert from '../assets/certificates/pan_registration.jpg';
import incCert from '../assets/certificates/incorporation_certificate.jpg';

const certificates = [
    {
        title: "Certificate of Incorporation",
        nepaliTitle: "कम्पनी दर्ताको प्रमाण-पत्र",
        org: "Office of the Company Registrar",
        ministry: "Ministry of Industry, Commerce & Supplies",
        image: incCert,
        desc: "Official recognition of Dwarika Hospital & Medical Academy as a registered private limited company under the Companies Act, 2006."
    },
    {
        title: "PAN Registration Certificate",
        nepaliTitle: "स्थायी लेखा नम्बर (PAN) दर्ता प्रमाण पत्र",
        org: "Inland Revenue Department",
        ministry: "Ministry of Finance",
        image: panCert,
        desc: "Permanent Account Number registration for tax compliance and legal financial operations in Nepal."
    },
    {
        title: "Business Registration",
        nepaliTitle: "व्यवसाय कर दर्ता प्रमाण-पत्र",
        org: "Khadka Municipality",
        ministry: "Office of Municipal Executive",
        image: businessCert,
        desc: "Authorized permission from the local municipality to operate healthcare and educational services in the region."
    }
];

const AboutAwards = () => {
    const [selectedCert, setSelectedCert] = useState<typeof certificates[0] | null>(null);

    return (
        <section className="py-24 bg-slate-50 relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-100/30 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-orange-50/50 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="text-center mb-20">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest mb-6"
                    >
                        <Award className="w-3.5 h-3.5" />
                        Accreditations & Legal Compliance
                    </motion.div>
                    <h2 className="text-4xl md:text-5xl font-black text-blue-950 uppercase tracking-tight mb-6">Legal Certifications</h2>
                    <div className="w-24 h-2 bg-blue-600 mx-auto rounded-full mb-8"></div>
                    <p className="text-gray-600 max-w-2xl mx-auto text-lg font-medium leading-relaxed">
                        Operating with full transparency and legal authorization. Our hospital and academy are fully registered and compliant with national and local regulations.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                    {certificates.map((cert, index) => (
                        <motion.div
                            key={cert.title}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: index * 0.15 }}
                            className="bg-white rounded-[2.5rem] shadow-xl shadow-blue-900/5 border border-slate-100 overflow-hidden flex flex-col group hover:-translate-y-2 transition-all duration-500"
                        >
                            <div 
                                className="relative h-72 overflow-hidden bg-slate-100 cursor-zoom-in group/img"
                                onClick={() => setSelectedCert(cert)}
                            >
                                <img 
                                    src={cert.image} 
                                    alt={cert.title} 
                                    className="w-full h-full object-contain p-4 group-hover/img:scale-110 transition-transform duration-700" 
                                />
                                <div className="absolute inset-0 bg-blue-950/0 group-hover/img:bg-blue-950/40 transition-colors duration-500 flex items-center justify-center">
                                    <ZoomIn className="text-white w-10 h-10 opacity-0 group-hover/img:opacity-100 scale-50 group-hover/img:scale-100 transition-all duration-500" />
                                </div>
                                <div className="absolute top-4 right-4">
                                    <div className="bg-white/90 backdrop-blur-sm p-2 rounded-xl shadow-md">
                                        <FileCheck className="w-5 h-5 text-blue-600" />
                                    </div>
                                </div>
                            </div>

                            <div className="p-10 flex-1 flex flex-col">
                                <div className="space-y-1 mb-6">
                                    <h4 className="text-blue-600 font-black text-[10px] uppercase tracking-widest">{cert.ministry}</h4>
                                    <h3 className="text-2xl font-black text-blue-950 leading-tight group-hover:text-blue-700 transition-colors">{cert.title}</h3>
                                    <p className="text-gray-400 text-xs font-bold font-nepali">{cert.nepaliTitle}</p>
                                </div>
                                <p className="text-gray-600 text-sm font-medium leading-relaxed mb-8 flex-1 italic">
                                    "{cert.desc}"
                                </p>
                                <div className="pt-6 border-t border-slate-50 flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
                                        <ShieldCheck className="w-5 h-5 text-blue-800" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Authority</p>
                                        <p className="text-xs font-black text-blue-900">{cert.org}</p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                <motion.div 
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mt-24 p-12 bg-gradient-to-br from-blue-900 to-blue-950 rounded-[3.5rem] text-white relative overflow-hidden shadow-2xl shadow-blue-900/40"
                >
                    <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                    <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-12">
                        <div className="space-y-6 text-center lg:text-left">
                            <h3 className="text-3xl md:text-4xl font-black leading-tight">Accredited by National <br className="hidden md:block" /> Healthcare Standards</h3>
                            <p className="text-blue-200 max-w-xl text-lg opacity-80 font-medium">
                                We take pride in being a legitimate healthcare and academic institution, adhering to the highest protocols for quality and patient safety.
                            </p>
                        </div>
                        <div className="flex flex-wrap justify-center gap-8">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="w-24 h-24 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 flex items-center justify-center group hover:bg-white/20 transition-all duration-300">
                                    <Award className="w-10 h-10 text-white/20 group-hover:text-white/60 transition-colors" />
                                </div>
                            ))}
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Lightbox for certificates */}
            <AnimatePresence>
                {selectedCert && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[200] bg-blue-950/95 backdrop-blur-xl flex items-center justify-center p-6"
                        onClick={() => setSelectedCert(null)}
                    >
                        <motion.button
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="absolute top-8 right-8 w-14 h-14 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors cursor-pointer"
                        >
                            <X className="w-8 h-8" />
                        </motion.button>

                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="max-w-5xl w-full bg-white rounded-3xl overflow-hidden shadow-2xl relative"
                            onClick={e => e.stopPropagation()}
                        >
                            <div className="flex flex-col md:flex-row">
                                <div className="md:w-3/5 bg-slate-100 p-8 flex items-center justify-center">
                                    <img 
                                        src={selectedCert.image} 
                                        alt={selectedCert.title} 
                                        className="max-h-[70vh] w-auto shadow-2xl" 
                                    />
                                </div>
                                <div className="md:w-2/5 p-12 flex flex-col justify-center bg-white">
                                    <div className="space-y-6">
                                        <div>
                                            <h4 className="text-blue-600 font-bold text-xs uppercase tracking-[0.2em] mb-4">{selectedCert.ministry}</h4>
                                            <h2 className="text-3xl font-black text-blue-950 leading-tight mb-2">{selectedCert.title}</h2>
                                            <p className="text-gray-400 font-nepali">{selectedCert.nepaliTitle}</p>
                                        </div>
                                        <div className="w-12 h-1 bg-blue-600 rounded-full"></div>
                                        <p className="text-gray-600 leading-relaxed font-medium capitalize italic">
                                            {selectedCert.desc}
                                        </p>
                                        <div className="pt-8 border-t border-slate-100">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-700">
                                                    <ShieldCheck className="w-6 h-6" />
                                                </div>
                                                <div>
                                                    <p className="text-xs text-gray-400 font-bold uppercase">Issued By Authority</p>
                                                    <p className="text-lg font-black text-blue-950">{selectedCert.org}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
};

export default AboutAwards;

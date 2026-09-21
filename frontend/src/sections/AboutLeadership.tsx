import { motion, AnimatePresence } from 'framer-motion';
import { Linkedin, Mail, X } from 'lucide-react';
import { useState } from 'react';

const leaders = [
    {
        name: "Dr. Rajesh Kumar",
        role: "Managing Director",
        image: "/leadership/leader2.jpg",
        bio: "Specializing in health administration with over 20 years of clinical experience. He has been instrumental in growing the hospital from a small clinic to a multi-specialty regional healthcare leader. His vision focuses on patient-centric care and integrating modern technology into medical practices."
    },
    {
        name: "Ms. Anjali Sharma",
        role: "Administrative Head",
        image: "/leadership/leader1.png",
        bio: "Expert in hospital operations and strategic planning for healthcare growth. With a background in healthcare management from top institutions, Anjali ensures the daily operations run smoothly and efficiently, focusing on quality control and patient satisfaction."
    }
];

const AboutLeadership = () => {
    const [selectedLeader, setSelectedLeader] = useState<typeof leaders[0] | null>(null);

    return (
        <section className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-6">
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-black text-blue-950 uppercase tracking-tight mb-4">Our Leadership</h2>
                    <div className="w-20 h-1.5 bg-blue-600 mx-auto rounded-full mb-6"></div>
                    <p className="text-gray-600 max-w-2xl mx-auto text-lg">
                        Guided by a team of dedicated professionals committed to delivering world-class healthcare to our community.
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-12 max-w-3xl mx-auto">
                    {leaders.map((leader, index) => (
                        <motion.div
                            key={leader.name}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="group text-center cursor-pointer"
                            onClick={() => setSelectedLeader(leader)}
                        >
                            <div className="relative overflow-hidden rounded-full mx-auto mb-6 w-48 h-48 sm:w-56 sm:h-56 shadow-xl border-4 border-white ring-2 ring-gray-100 transition-transform duration-300 group-hover:scale-105">
                                <img
                                    src={leader.image}
                                    alt={leader.name}
                                    className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-blue-950/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                    <span className="text-white font-bold bg-blue-600/90 px-5 py-2.5 rounded-full backdrop-blur-md text-sm shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                                        View Profile
                                    </span>
                                </div>
                            </div>
                            <div className="text-center">
                                <h3 className="text-2xl font-black text-blue-950 mb-1 group-hover:text-blue-600 transition-colors">{leader.name}</h3>
                                <p className="text-blue-600 font-black text-xs uppercase tracking-[0.2em]">{leader.role}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            <AnimatePresence>
                {selectedLeader && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
                            onClick={() => setSelectedLeader(null)}
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="relative bg-white rounded-3xl shadow-2xl overflow-hidden max-w-3xl w-full flex flex-col md:flex-row z-10"
                        >
                            <button 
                                onClick={() => setSelectedLeader(null)}
                                className="absolute top-4 right-4 p-2 bg-gray-100 hover:bg-gray-200 rounded-full text-gray-600 transition-colors z-20"
                            >
                                <X className="w-5 h-5" />
                            </button>
                            
                            <div className="w-full md:w-2/5 h-72 md:h-auto relative">
                                <img 
                                    src={selectedLeader.image} 
                                    alt={selectedLeader.name}
                                    className="absolute inset-0 w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-blue-950/60 to-transparent md:hidden" />
                            </div>
                            
                            <div className="p-8 md:p-10 md:w-3/5 flex flex-col justify-center bg-white">
                                <h3 className="text-3xl font-black text-blue-950 mb-2">{selectedLeader.name}</h3>
                                <p className="text-blue-600 font-black text-sm uppercase tracking-[0.2em] mb-6">{selectedLeader.role}</p>
                                
                                <div className="w-12 h-1 bg-blue-100 rounded-full mb-6"></div>
                                
                                <p className="text-gray-600 leading-relaxed mb-8 text-base">
                                    {selectedLeader.bio}
                                </p>
                                
                                <div className="flex gap-4 mt-auto">
                                    <a href="#" className="p-3 bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white rounded-full transition-colors">
                                        <Linkedin className="w-5 h-5" />
                                    </a>
                                    <a href="#" className="p-3 bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white rounded-full transition-colors">
                                        <Mail className="w-5 h-5" />
                                    </a>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </section>
    );
};

export default AboutLeadership;

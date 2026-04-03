import { motion, AnimatePresence } from 'framer-motion';
import { X, Award, Users } from 'lucide-react';
import { useState } from 'react';
import { doctors } from '../lib/teamData';

const AboutTeam = () => {
    const [selectedMember, setSelectedMember] = useState<typeof doctors[0] | null>(null);

    return (
        <section className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-6">
                <div className="text-center mb-20">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 text-blue-600 text-[10px] font-black uppercase tracking-widest mb-6 border border-blue-100"
                    >
                        <Users className="w-3.5 h-3.5" />
                        Medical Excellence
                    </motion.div>
                    <h2 className="text-4xl md:text-5xl font-black text-blue-950 uppercase tracking-tight mb-6">Our Medical Team</h2>
                    <div className="w-24 h-2 bg-blue-600 mx-auto rounded-full mb-8"></div>
                    <p className="text-gray-600 max-w-2xl mx-auto text-lg font-medium leading-relaxed">
                        A dedicated group of world-class specialists committed to your health and well-being, bringing years of expertise and compassionate care.
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10">
                    {doctors.map((member, index) => (
                        <motion.div
                            key={member.name}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: index * 0.1 }}
                            className="group cursor-pointer"
                            onClick={() => setSelectedMember(member)}
                        >
                            <div className="relative aspect-[4/5] overflow-hidden rounded-[2.5rem] mb-6 shadow-2xl shadow-blue-900/10 border-4 border-white transition-all duration-500 group-hover:-translate-y-2">
                                <img
                                    src={member.image}
                                    alt={member.name}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-blue-950/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                
                                <div className="absolute bottom-6 left-6 right-6">
                                    <div className="bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-lg transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                                        <p className="text-blue-600 font-black text-[10px] uppercase tracking-widest mb-1">{member.category}</p>
                                        <span className="text-blue-950 font-black text-sm uppercase">View Profile</span>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="text-center px-4">
                                <h3 className="text-xl font-black text-blue-950 mb-1 group-hover:text-blue-600 transition-colors uppercase tracking-tight leading-tight">{member.name}</h3>
                                <p className="text-gray-500 font-bold text-xs uppercase tracking-wider">{member.specialty}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Additional Info Banner */}
                <motion.div 
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mt-24 p-12 bg-slate-50 rounded-[3.5rem] border border-slate-200 text-center relative overflow-hidden"
                >
                    <div className="relative z-10">
                        <Award className="w-12 h-12 text-blue-600 mx-auto mb-6 opacity-40" />
                        <h3 className="text-2xl font-black text-blue-950 mb-4 uppercase tracking-tight">Expanding Our Care</h3>
                        <p className="text-gray-500 max-w-2xl mx-auto font-medium lg:text-lg">
                            With over 85+ specialized healthcare professionals, we are constantly growing our team to provide the best medical services in Madhesh Province.
                        </p>
                    </div>
                    <div className="absolute -top-24 -right-24 w-64 h-64 bg-blue-100/50 rounded-full blur-3xl -z-10" />
                    <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-red-100/30 rounded-full blur-3xl -z-10" />
                </motion.div>
            </div>

            {/* Profile Modal */}
            <AnimatePresence>
                {selectedMember && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-blue-950/40 backdrop-blur-md"
                            onClick={() => setSelectedMember(null)}
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="relative bg-white rounded-[3rem] shadow-2xl overflow-hidden max-w-4xl w-full flex flex-col md:flex-row z-10 border border-white"
                        >
                            <button 
                                onClick={() => setSelectedMember(null)}
                                className="absolute top-6 right-6 p-3 bg-gray-100 hover:bg-gray-200 rounded-full text-gray-600 transition-colors z-20"
                            >
                                <X className="w-6 h-6" />
                            </button>
                            
                            <div className="w-full md:w-[45%] h-80 md:h-auto relative">
                                <img 
                                    src={selectedMember.image} 
                                    alt={selectedMember.name}
                                    className="absolute inset-0 w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-blue-950/40 to-transparent" />
                                <div className="absolute bottom-8 left-8">
                                    <span className="px-4 py-1.5 bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg">
                                        {selectedMember.category}
                                    </span>
                                </div>
                            </div>
                            
                            <div className="p-10 md:p-14 md:w-[55%] flex flex-col justify-center bg-white relative">
                                <div className="space-y-2 mb-8">
                                    <h3 className="text-3xl md:text-4xl font-black text-blue-950 leading-tight uppercase tracking-tight">{selectedMember.name}</h3>
                                    <p className="text-blue-600 font-black text-sm uppercase tracking-[0.2em]">{selectedMember.specialty}</p>
                                </div>
                                
                                <div className="w-16 h-1.5 bg-blue-100 rounded-full mb-8"></div>
                                
                                <div className="space-y-6 flex-1">
                                    <p className="text-gray-600 leading-relaxed text-lg font-medium italic">
                                        "{selectedMember.bio || `Expert specialist in ${selectedMember.category} with a commitment to providing the highest quality of patient care.`}"
                                    </p>
                                    
                                    <div className="flex flex-wrap gap-4 pt-4">
                                        <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-xl border border-slate-100">
                                            <Award className="w-4 h-4 text-blue-600" />
                                            <span className="text-xs font-black text-blue-950 uppercase">Board Certified</span>
                                        </div>
                                        <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-xl border border-slate-100">
                                            <Users className="w-4 h-4 text-blue-600" />
                                            <span className="text-xs font-black text-blue-950 uppercase">10+ Years Exp.</span>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="mt-12 flex justify-center">
                                    <button className="w-full bg-blue-950 text-white font-black uppercase text-xs tracking-widest py-4 rounded-2xl hover:bg-blue-900 transition-colors shadow-xl shadow-blue-900/20">
                                        Book Consultation
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </section>
    );
};

export default AboutTeam;

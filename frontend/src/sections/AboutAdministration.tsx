import { motion, AnimatePresence } from 'framer-motion';
import { X, Shield, Users, Briefcase } from 'lucide-react';
import { useState } from 'react';
import { administrationTeam } from '../lib/teamData';

const AboutAdministration = () => {
    const [selectedMember, setSelectedMember] = useState<typeof administrationTeam[0] | null>(null);

    return (
        <section className="py-20 bg-slate-50/50">
            <div className="max-w-7xl mx-auto px-6">
                <div className="text-center mb-20">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-100 text-slate-600 text-[10px] font-black uppercase tracking-widest mb-6 border border-slate-200"
                    >
                        <Shield className="w-3.5 h-3.5" />
                        Operational Excellence
                    </motion.div>
                    <h2 className="text-4xl md:text-5xl font-black text-blue-950 uppercase tracking-tight mb-6">Administration Team</h2>
                    <div className="w-24 h-2 bg-slate-400 mx-auto rounded-full mb-8"></div>
                    <p className="text-gray-600 max-w-2xl mx-auto text-lg font-medium leading-relaxed">
                        The backbone of our hospital, ensuring every department runs with precision and every patient receives seamless support.
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10">
                    {administrationTeam.map((member, index) => (
                        <motion.div
                            key={member.name}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: index * 0.1 }}
                            className="group cursor-pointer"
                            onClick={() => setSelectedMember(member)}
                        >
                            <div className="relative aspect-square overflow-hidden rounded-[2rem] mb-6 shadow-xl shadow-slate-200 border-4 border-white transition-all duration-500 group-hover:-translate-y-2">
                                <img
                                    src={member.image}
                                    alt={member.name}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 grayscale group-hover:grayscale-0"
                                />
                                <div className="absolute inset-0 bg-blue-900/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                
                                <div className="absolute bottom-4 left-4 right-4 text-center">
                                    <div className="bg-white/80 backdrop-blur-md py-2 px-4 rounded-xl shadow-lg transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                                        <span className="text-blue-950 font-black text-[10px] uppercase tracking-widest">Profile Details</span>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="text-center">
                                <h3 className="text-xl font-black text-blue-950 mb-1 group-hover:text-blue-600 transition-colors uppercase tracking-tight">{member.name}</h3>
                                <p className="text-slate-500 font-bold text-xs uppercase tracking-wider">{member.role}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Integration Message */}
                <motion.div 
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mt-20 p-10 bg-white rounded-[3rem] border border-slate-100 text-center shadow-sm"
                >
                    <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16">
                        <div className="flex items-center gap-4 text-left">
                            <div className="p-4 bg-blue-50 rounded-2xl">
                                <Briefcase className="w-8 h-8 text-blue-600" />
                            </div>
                            <div>
                                <h4 className="text-blue-950 font-black uppercase text-sm">Strategic Planning</h4>
                                <p className="text-gray-500 text-xs font-medium">Coordinated hospital growth</p>
                            </div>
                        </div>
                        <div className="w-px h-12 bg-slate-100 hidden md:block" />
                        <div className="flex items-center gap-4 text-left">
                            <div className="p-4 bg-emerald-50 rounded-2xl">
                                <Users className="w-8 h-8 text-emerald-600" />
                            </div>
                            <div>
                                <h4 className="text-blue-950 font-black uppercase text-sm">Patient Focus</h4>
                                <p className="text-gray-500 text-xs font-medium">Quality assurance & service</p>
                            </div>
                        </div>
                    </div>
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
                            className="relative bg-white rounded-[2.5rem] shadow-2xl overflow-hidden max-w-2xl w-full flex flex-col md:flex-row z-10 border border-white"
                        >
                            <button 
                                onClick={() => setSelectedMember(null)}
                                className="absolute top-6 right-6 p-2.5 bg-slate-100 hover:bg-slate-200 rounded-full text-slate-600 transition-colors z-20"
                            >
                                <X className="w-5 h-5" />
                            </button>
                            
                            <div className="w-full md:w-[40%] h-64 md:h-auto relative">
                                <img 
                                    src={selectedMember.image} 
                                    alt={selectedMember.name}
                                    className="absolute inset-0 w-full h-full object-cover"
                                />
                            </div>
                            
                            <div className="p-10 md:w-[60%] flex flex-col justify-center bg-white">
                                <div className="mb-6">
                                    <span className="px-3 py-1 bg-slate-100 text-slate-600 text-[10px] font-black uppercase tracking-widest rounded-full mb-4 inline-block">
                                        {selectedMember.category} Division
                                    </span>
                                    <h3 className="text-2xl font-black text-blue-950 uppercase tracking-tight mb-1">{selectedMember.name}</h3>
                                    <p className="text-blue-600 font-bold text-xs uppercase tracking-widest">{selectedMember.role}</p>
                                </div>
                                
                                <div className="space-y-6">
                                    <p className="text-gray-600 leading-relaxed font-medium">
                                        {selectedMember.bio}
                                    </p>
                                    
                                    <div className="pt-4 border-t border-slate-100 flex gap-4">
                                        <div className="text-center">
                                            <p className="text-[10px] font-black text-blue-950 uppercase mb-1">Experience</p>
                                            <p className="text-blue-600 font-black text-lg">12+</p>
                                        </div>
                                        <div className="w-px h-8 bg-slate-100 my-auto" />
                                        <div className="text-center">
                                            <p className="text-[10px] font-black text-blue-950 uppercase mb-1">Projects</p>
                                            <p className="text-blue-600 font-black text-lg">50+</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </section>
    );
};

export default AboutAdministration;

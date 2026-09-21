import { motion, AnimatePresence } from 'framer-motion';
import { X, Award, Users, Shield, Briefcase } from 'lucide-react';
import { useState, useMemo } from 'react';
import { medicalTeam } from '../lib/teamData';
import type { TeamMember } from '../lib/teamData';
import { cmsPublic } from '../lib/cmsClient';
import { useCmsQuery } from '../hooks/useCmsQuery';
import { useTranslation } from 'react-i18next';

const CATEGORIES = [
    { key: 'ALL', label: 'All Staff' },
    { key: 'DOCTOR', label: 'Doctors' },
    { key: 'NURSING STAFF', label: 'Nursing Staff' },
    { key: 'PARAMEDICAL STAFF', label: 'Paramedical Staff' },
    { key: 'PHARMACY STAFF', label: 'Pharmacy Staff' },
    { key: 'RADIO IMAGING STAFF', label: 'Radio Imaging Staff' },
    { key: 'LABORATORY STAFF', label: 'Laboratory Staff' }
];

const AboutTeam = () => {
    const { i18n } = useTranslation();
    const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
    const [activeCategory, setActiveCategory] = useState('ALL');

    const currentLang = i18n.language;

    const { data: dbData } = useCmsQuery(() => cmsPublic.doctors(), []);

    const teamMembers = useMemo(() => {
        const items = dbData?.items || [];
        if (items.length === 0) {
            return medicalTeam;
        }
        return items.map((item: any) => ({
            name: (currentLang === 'np' && item.nameNp) ? item.nameNp : item.name,
            specialty: (currentLang === 'np' && item.specialtyNp) ? item.specialtyNp : item.specialty,
            category: item.category,
            image: item.imageUrl || 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=800',
            bio: (currentLang === 'np' && item.bioNp) ? item.bioNp : (item.bio || ''),
            teamCategory: item.teamCategory || 'DOCTOR'
        }));
    }, [dbData, currentLang]);

    const filteredMembers = teamMembers.filter(
        member => activeCategory === 'ALL' || member.teamCategory === activeCategory
    );

    return (
        <section className="py-20 bg-gradient-to-b from-white to-slate-50 relative overflow-hidden">
            {/* Ambient Background Glows */}
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-100/30 rounded-full blur-3xl -z-10" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-red-100/20 rounded-full blur-3xl -z-10" />

            <div className="max-w-7xl mx-auto px-6">
                {/* Section Header */}
                <div className="text-center mb-16">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 text-blue-600 text-[10px] font-black uppercase tracking-widest mb-6 border border-blue-100 shadow-sm"
                    >
                        <Users className="w-3.5 h-3.5" />
                        Medical Excellence
                    </motion.div>
                    <h2 className="text-4xl md:text-5xl font-black text-blue-950 uppercase tracking-tight mb-6 leading-tight">
                        Meet Our Medical Team
                    </h2>
                    <div className="w-24 h-2 bg-blue-600 mx-auto rounded-full mb-8"></div>
                    <p className="text-slate-600 max-w-2xl mx-auto text-base md:text-lg font-medium leading-relaxed">
                        A dedicated group of world-class specialists, nurses, and clinical experts committed to your health and well-being.
                    </p>
                </div>

                {/* Category Filtering Tabs */}
                <div className="flex flex-wrap justify-center gap-3 mb-16 max-w-5xl mx-auto">
                    {CATEGORIES.map((cat) => {
                        const isActive = activeCategory === cat.key;
                        return (
                            <button
                                key={cat.key}
                                onClick={() => setActiveCategory(cat.key)}
                                className={`relative px-5 py-3 rounded-full text-xs font-black uppercase tracking-wider transition-all duration-300 border flex items-center gap-2 shadow-sm ${
                                    isActive
                                        ? 'bg-blue-900 text-white border-blue-900 shadow-blue-900/10'
                                        : 'bg-white text-slate-600 hover:text-blue-950 border-slate-200 hover:border-blue-200'
                                }`}
                            >
                                {isActive && (
                                    <motion.span
                                        layoutId="activeCategoryGlow"
                                        className="absolute inset-0 bg-blue-900 rounded-full -z-10"
                                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                                    />
                                )}
                                {cat.label}
                            </button>
                        );
                    })}
                </div>

                {/* Team Grid */}
                <motion.div 
                    layout
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10"
                >
                    <AnimatePresence mode="popLayout">
                        {filteredMembers.map((member, index) => (
                            <motion.div
                                layout
                                key={member.name}
                                initial={{ opacity: 0, scale: 0.9, y: 30 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                                transition={{ duration: 0.4, delay: index * 0.05 }}
                                className="group cursor-pointer"
                                onClick={() => setSelectedMember(member)}
                            >
                                <div className="relative aspect-[4/5] overflow-hidden rounded-[2.5rem] mb-6 shadow-2xl shadow-blue-950/5 border-4 border-white transition-all duration-500 group-hover:-translate-y-2 group-hover:shadow-blue-900/10">
                                    <img
                                        src={member.image}
                                        alt={member.name}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                        loading="lazy"
                                    />
                                    <div className="absolute inset-0 bg-blue-950/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                    
                                    <div className="absolute bottom-6 left-6 right-6">
                                        <div className="bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-lg transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                                            <p className="text-blue-600 font-black text-[9px] uppercase tracking-widest mb-1">
                                                {member.teamCategory}
                                            </p>
                                            <span className="text-blue-950 font-black text-xs uppercase tracking-wider">View Profile</span>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="text-center px-4">
                                    <h3 className="text-lg font-black text-blue-950 mb-1 group-hover:text-blue-600 transition-colors uppercase tracking-tight leading-tight">
                                        {member.name}
                                    </h3>
                                    <p className="text-blue-600/90 font-extrabold text-[10px] uppercase tracking-widest mb-1">
                                        {member.category}
                                    </p>
                                    <p className="text-slate-500 font-semibold text-xs leading-tight">
                                        {member.specialty}
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </motion.div>

                {/* Empty State if no members */}
                {filteredMembers.length === 0 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-16 bg-white rounded-3xl border border-slate-200 shadow-md max-w-lg mx-auto mt-10"
                    >
                        <Users className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                        <h4 className="text-lg font-black text-slate-800 uppercase tracking-tight mb-2">No Staff Listed</h4>
                        <p className="text-slate-500 text-sm">We are currently updating our staff list for this category. Please check back soon.</p>
                    </motion.div>
                )}

                {/* Expanding Our Care Banner */}
                <motion.div 
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mt-24 p-10 md:p-14 bg-slate-100/80 rounded-[3.5rem] border border-slate-200 text-center relative overflow-hidden"
                >
                    <div className="relative z-10">
                        <Award className="w-12 h-12 text-blue-600 mx-auto mb-6 opacity-60" />
                        <h3 className="text-2xl font-black text-blue-950 mb-4 uppercase tracking-tight">Expanding Our Care</h3>
                        <p className="text-slate-600 max-w-2xl mx-auto font-medium md:text-lg leading-relaxed">
                            With over 120+ specialized healthcare professionals and staff, we are constantly growing our team to provide the best medical services across all hospital divisions.
                        </p>
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
                            className="absolute inset-0 bg-blue-950/50 backdrop-blur-md"
                            onClick={() => setSelectedMember(null)}
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.92, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.92, y: 20 }}
                            className="relative bg-white rounded-[3rem] shadow-2xl overflow-hidden max-w-4xl w-full flex flex-col md:flex-row z-10 border border-white"
                        >
                            <button 
                                onClick={() => setSelectedMember(null)}
                                className="absolute top-6 right-6 p-3 bg-slate-100 hover:bg-slate-200 rounded-full text-slate-600 transition-colors z-20"
                            >
                                <X className="w-5 h-5" />
                            </button>
                            
                            <div className="w-full md:w-[45%] h-72 md:h-auto relative shrink-0">
                                <img 
                                    src={selectedMember.image} 
                                    alt={selectedMember.name}
                                    className="absolute inset-0 w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-blue-950/50 to-transparent" />
                                <div className="absolute bottom-8 left-8">
                                    <span className="px-4 py-1.5 bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg">
                                        {selectedMember.teamCategory}
                                    </span>
                                </div>
                            </div>
                            
                            <div className="p-10 md:p-12 md:w-[55%] flex flex-col justify-center bg-white relative">
                                <div className="space-y-2 mb-6">
                                    <h3 className="text-3xl font-black text-blue-950 leading-tight uppercase tracking-tight">
                                        {selectedMember.name}
                                    </h3>
                                    <p className="text-blue-600 font-extrabold text-[11px] uppercase tracking-[0.2em]">
                                        {selectedMember.category} • {selectedMember.specialty}
                                    </p>
                                </div>
                                
                                <div className="w-16 h-1.5 bg-blue-100 rounded-full mb-6"></div>
                                
                                <div className="space-y-6 flex-1">
                                    <p className="text-slate-600 leading-relaxed text-base font-medium italic">
                                        "{selectedMember.bio || `Expert specialist dedicated to providing the highest quality of clinical care and patient service.`}"
                                    </p>
                                    
                                    <div className="flex flex-wrap gap-3 pt-2">
                                        <div className="flex items-center gap-2 px-3.5 py-2 bg-slate-50 rounded-xl border border-slate-100">
                                            <Shield className="w-4 h-4 text-blue-600" />
                                            <span className="text-[10px] font-black text-blue-950 uppercase tracking-wider">Certified Specialist</span>
                                        </div>
                                        <div className="flex items-center gap-2 px-3.5 py-2 bg-slate-50 rounded-xl border border-slate-100">
                                            <Briefcase className="w-4 h-4 text-blue-600" />
                                            <span className="text-[10px] font-black text-blue-950 uppercase tracking-wider">Extensive Exp.</span>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="mt-8 flex justify-center">
                                    <button 
                                        onClick={() => setSelectedMember(null)}
                                        className="w-full bg-blue-950 text-white font-black uppercase text-xs tracking-widest py-4 rounded-2xl hover:bg-blue-900 transition-colors shadow-xl shadow-blue-900/20"
                                    >
                                        Close Profile
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

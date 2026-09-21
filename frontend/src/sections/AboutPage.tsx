import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';
import AboutUsSection from './AboutUsSection';
import AboutLeadership from './AboutLeadership';

import AboutAwards from './AboutAwards';
import AboutTeam from './AboutTeam';
import AboutAdministration from './AboutAdministration';

const getTabs = (t: any) => [
    { id: 'overview', label: t('about_page.tabs.overview') },
    { id: 'leadership', label: t('about_page.tabs.leadership') },
    { id: 'team', label: t('about_page.tabs.team') },
    { id: 'administration', label: t('about_page.tabs.administration') },
    { id: 'awards', label: t('about_page.tabs.awards') },

];

const AboutPage = () => {
    const { t } = useTranslation();
    const location = useLocation();
    const tabs = getTabs(t);
    const initialState = location.state as { activeTab?: string } | null;
    const [activeTab, setActiveTab] = useState(initialState?.activeTab || 'overview');

    useEffect(() => {
        window.scrollTo(0, 0);
        if (initialState?.activeTab) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setActiveTab(initialState.activeTab);
        }
    }, [initialState]);

    return (
        <div className="min-h-screen bg-white">
            {/* Hero Section */}
            <div className="relative pt-24 pb-12 lg:pt-32 lg:pb-20 px-4 overflow-hidden bg-[#020617] flex items-center justify-center min-h-[45vh]">
                {/* Advanced Animated Background */}
                <div className="absolute inset-0 z-0">
                    <style>{`
                        @keyframes pan-slow {
                            0% { transform: scale(1.05) translate(0, 0); }
                            100% { transform: scale(1.15) translate(-1%, -1%); }
                        }
                        .ken-burns-slow {
                            animation: pan-slow 20s infinite alternate ease-in-out;
                        }
                    `}</style>
                    <img
                        src="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=2400"
                        alt="Hero Background"
                        className="absolute inset-0 w-full h-full object-cover opacity-80 ken-burns-slow"
                    />
                    {/* Deep Cinematic Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-b from-slate-950/80 via-slate-950/40 to-slate-950 z-10" />
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(2,6,23,0.6)_100%)] z-10" />
                    
                    {/* Floating Decorative Elements */}
                    <motion.div 
                        animate={{ opacity: [0.3, 0.6, 0.3], scale: [1, 1.2, 1] }} 
                        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-blue-600/20 blur-[120px] rounded-full" 
                    />
                    <motion.div 
                        animate={{ opacity: [0.2, 0.4, 0.2], scale: [1, 1.3, 1] }} 
                        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                        className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-red-600/10 blur-[100px] rounded-full" 
                    />
                </div>

                <div className="max-w-5xl mx-auto relative z-20 text-center space-y-8 mt-10">
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }} 
                        animate={{ opacity: 1, y: 0 }} 
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="inline-flex items-center gap-3 px-6 py-2.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-xl shadow-2xl"
                    >
                        <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                        <span className="text-white text-[10px] md:text-xs font-black uppercase tracking-[0.3em] lg:tracking-[0.4em] drop-shadow-sm">
                            {t('about_page.hero_badge')}
                        </span>
                        <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                    </motion.div>
                    
                    <motion.h1 
                        initial={{ opacity: 0, y: 30 }} 
                        animate={{ opacity: 1, y: 0 }} 
                        transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                        className="text-5xl md:text-7xl lg:text-[5.5rem] font-black uppercase tracking-tight leading-[1.1] text-white break-words drop-shadow-[0_4px_12px_rgba(0,0,0,0.5)]"
                    >
                        <span className="text-white brightness-125">{t('about_page.hero_heading_part1')}</span> <br /> 
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-blue-100 to-white drop-shadow-lg">
                            {t('about_page.hero_heading_part2')}
                        </span>
                    </motion.h1>
                    
                    <motion.p 
                        initial={{ opacity: 0, y: 20 }} 
                        animate={{ opacity: 1, y: 0 }} 
                        transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
                        className="text-lg md:text-2xl text-white/90 max-w-3xl mx-auto font-medium leading-relaxed drop-shadow-sm"
                    >
                        {t('about_page.hero_description')}
                    </motion.p>
                </div>
            </div>

            {/* Sub Navigation (Tabs) */}
            <div className="sticky top-[80px] z-40 bg-white border-b border-gray-100 shadow-sm overflow-x-auto whitespace-nowrap">
                <div className="max-w-7xl mx-auto px-6 flex justify-center">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`px-8 py-5 text-[13px] font-black uppercase tracking-widest transition-all relative ${activeTab === tab.id ? 'text-blue-600' : 'text-gray-400 hover:text-gray-900'
                                }`}
                        >
                            {tab.label}
                            {activeTab === tab.id && (
                                <motion.div
                                    layoutId="activeTab"
                                    className="absolute bottom-0 left-0 right-0 h-1 bg-blue-600 shadow-[0_0_10px_rgb(37,99,235,0.4)]"
                                />
                            )}
                        </button>
                    ))}
                </div>
            </div>

            {/* Tab Content */}
            <div className="min-h-[600px]">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.4 }}
                    >
                        {activeTab === 'overview' && <AboutUsSection />}
                        {activeTab === 'leadership' && <AboutLeadership />}
                        {activeTab === 'team' && <AboutTeam />}
                        {activeTab === 'administration' && <AboutAdministration />}

                        {activeTab === 'awards' && <AboutAwards />}
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
};

export default AboutPage;

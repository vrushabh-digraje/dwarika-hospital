import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { cn } from '../lib/utils';
import { Menu, X, Search, Phone, Globe, Newspaper, Mail, Stethoscope, FlaskConical, Pill, FileText, MessageCircle, LogIn, Siren } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import RegisterModal from './RegisterModal';
import LoginModal from './LoginModal';
import ForgotPasswordModal from './ForgotPasswordModal';
import ScrollToTopButton from './ScrollToTopButton';
import ChatWidget from './ChatWidget';
import { cmsPublic } from '../lib/cmsClient';
import { useCmsQuery } from '../hooks/useCmsQuery';

const Navbar = () => {
    const { t, i18n } = useTranslation();
    const [isRegisterOpen, setIsRegisterOpen] = useState(false);
    const [isLoginOpen, setIsLoginOpen] = useState(false);
    const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false);
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [isScrolled, setIsScrolled] = useState(false);
    const { data: settings } = useCmsQuery(() => cmsPublic.settings(), []);
    const langCode = (i18n.resolvedLanguage ?? i18n.language ?? 'en').split('-')[0].toLowerCase();
    const marqueeItems = useMemo(() => {
        if (settings?.marqueeLines?.length) {
            return settings.marqueeLines;
        }
        return [
            t('navbar.marquee.line1'),
            t('navbar.marquee.line2'),
            t('navbar.marquee.line3'),
            t('navbar.marquee.line4'),
            t('navbar.marquee.helpline'),
        ];
    }, [settings, t]);
    const logoUrl = settings?.logoUrl || '/logo.png';
    const landlineNumber = settings?.landline || t('navbar.landline_number');
    const emergencyNumber = settings?.emergencyNumber || t('navbar.emergency_number');
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 160);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleLinkClick = (link: string) => {
        setIsMobileMenuOpen(false);
        const routes: Record<string, () => void> = {
            "HOME": () => location.pathname !== '/' ? navigate('/') : window.scrollTo({ top: 0, behavior: 'smooth' }),
            "ABOUT": () => location.pathname !== '/about' ? navigate('/about') : document.getElementById('about-overview')?.scrollIntoView({ behavior: 'smooth' }),
            "CONTACT US": () => navigate('/contact'),
            "ACADEMIC": () => navigate('/academic'),
            "NOTICES": () => navigate('/notices'),
            "DOWNLOADS": () => navigate('/downloads'),
            "BLOG": () => navigate('/blogs'),
            "GALLERY": () => navigate('/gallery'),
            "NEWS & EVENTS": () => location.pathname === '/' ? document.getElementById('news')?.scrollIntoView({ behavior: 'smooth' }) : navigate('/', { state: { scrollTo: 'news' } }),
            "MAIL LOGIN": () => navigate('/contact'),
            "DOCTOR APPOINTMENT": () => navigate('/appointment'),
            "PATIENT REPORT": () => navigate('/reports'),
            "PHARMACY": () => navigate('/pharmacy'),
            "ONLINE FORM": () => navigate('/online-form'),
            "CHAT": () => setIsChatOpen(true),
            "LOGIN": () => navigate('/login'),
            "DEPARTMENTS": () => location.pathname === '/' ? document.getElementById('departments')?.scrollIntoView({ behavior: 'smooth' }) : navigate('/', { state: { scrollTo: 'departments' } }),
            "SERVICES": () => location.pathname === '/' ? document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' }) : navigate('/', { state: { scrollTo: 'services' } }),
        };
        routes[link]?.();
    };

    const topNavLinks = [
        { label: t('navbar.home'), key: "HOME" },
        { label: t('navbar.about'), key: "ABOUT" },
        { label: t('navbar.departments'), key: "DEPARTMENTS" },
        { label: t('navbar.services'), key: "SERVICES" },
        { label: t('navbar.academic'), key: "ACADEMIC" },
        { label: t('navbar.news'), key: "NEWS & EVENTS" },
        { label: t('navbar.blog'), key: "BLOG" },
        { label: t('navbar.notices'), key: "NOTICES" },
        { label: t('navbar.gallery'), key: "GALLERY" },
        { label: t('navbar.downloads'), key: "DOWNLOADS" },
        { label: t('navbar.contact'), key: "CONTACT US" },
    ];

    const quickActions = [
        { label: t('navbar.quick.news_events'), key: "NEWS & EVENTS", icon: Newspaper, accent: "#1E40AF" },
        { label: t('common.contact_us'), key: "CONTACT US", icon: Mail, accent: "#0F766E" },
        { label: t('navbar.quick.doctor_appointment'), key: "DOCTOR APPOINTMENT", icon: Stethoscope, accent: "#047857" },
        { label: t('navbar.quick.lab_report'), key: "PATIENT REPORT", icon: FlaskConical, accent: "#C2410C" },
        { label: t('navbar.quick.pharmacy'), key: "PHARMACY", icon: Pill, accent: "#6D28D9" },
        { label: t('navbar.quick.online_form'), key: "ONLINE FORM", icon: FileText, accent: "#0E7490" },
        { label: t('navbar.quick.chat'), key: "CHAT", icon: MessageCircle, accent: "#BE185D" },
        { label: t('navbar.quick.login'), key: "LOGIN", icon: LogIn, accent: "#334155" },
    ];

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        const q = searchQuery.toLowerCase().trim();
        if (!q) return;
        const isDoctor = ['doctor', 'dr', 'specialist', 'appointment'].some(kw => q.includes(kw));
        if (isDoctor) document.getElementById('doctors')?.scrollIntoView({ behavior: 'smooth' });
        else document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' });
        setSearchQuery('');
    };

    const toggleLanguage = () => {
        const current = (i18n.resolvedLanguage ?? i18n.language ?? 'en').split('-')[0].toLowerCase();
        void i18n.changeLanguage(current === 'en' ? 'np' : 'en');
    };

    return (
        <>
            {/* ════════════════════════════════════════════════════════════
                STICKY COMPACT NAVBAR (Slides down when scrolled)
            ════════════════════════════════════════════════════════════ */}
            <div className={cn(
                "fixed top-0 left-0 w-full z-50 bg-white shadow-lg shadow-slate-900/5 border-b border-slate-100 transition-transform duration-300",
                isScrolled ? "translate-y-0" : "-translate-y-full"
            )}>
                {/* Sticky Row 1: Logo + Brand + Actions */}
                <div className="w-full px-4 sm:px-8 flex items-center justify-between gap-4 h-12 border-b border-slate-100/80">
                    {/* Logo & Brand */}
                    <div className="flex items-center gap-3 cursor-pointer shrink-0" onClick={() => handleLinkClick('HOME')}>
                        <img src={logoUrl} alt={t('navbar.logo_alt')} className="w-8 h-8 object-contain" />
                        <div className="hidden sm:flex items-center gap-3 min-w-0">
                            <span className="font-outfit text-[11px] font-bold text-[#0B4A9E] uppercase tracking-wider whitespace-nowrap">{t('navbar.brand_lockup_en')}</span>
                            <div className="h-4 w-[1.5px] bg-slate-300" />
                            <span className="font-devanagari text-[13px] font-bold text-[#15803D] leading-none whitespace-nowrap">{t('navbar.brand_lockup_devanagari')}</span>
                        </div>
                    </div>

                    {/* Right side Actions */}
                    <div className="flex items-center gap-2 shrink-0">
                        <button
                            type="button"
                            onClick={toggleLanguage}
                            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-[11px] font-semibold text-slate-500 hover:text-primary hover:bg-primary/5 transition-all"
                        >
                            <Globe className="w-3.5 h-3.5" />
                            <span className="uppercase">{langCode === 'en' ? 'NP' : 'EN'}</span>
                        </button>
                        <button
                            type="button"
                            onClick={() => navigate('/appointment')}
                            className="px-4 py-2 bg-primary hover:bg-primary-hover text-white rounded-lg text-[11px] font-bold transition-all shadow-sm shadow-primary/20"
                        >
                            {t('navbar.book_short') || "Book"}
                        </button>
                        <button
                            className="lg:hidden p-1.5 hover:bg-slate-50 rounded-lg"
                            onClick={() => setIsMobileMenuOpen(true)}
                        >
                            <Menu className="w-5 h-5 text-slate-700" />
                        </button>
                    </div>
                </div>

                {/* Sticky Row 2: All Nav Links */}
                <nav className="hidden lg:flex items-center justify-center gap-1 w-full px-4 sm:px-8 py-1.5 bg-slate-50/80">
                    {topNavLinks.map((link, idx) => (
                        <React.Fragment key={link.key}>
                            <button
                                onClick={() => handleLinkClick(link.key)}
                                className="px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-slate-600 hover:text-primary hover:bg-primary/5 rounded-md transition-all whitespace-nowrap"
                            >
                                {link.label}
                            </button>
                            {idx < topNavLinks.length - 1 && (
                                <span className="text-slate-300 text-[10px]">|</span>
                            )}
                        </React.Fragment>
                    ))}
                </nav>
            </div>

            {/* ════════════════════════════════════════════════════════════
                FULL NAVBAR (Always in document flow)
            ════════════════════════════════════════════════════════════ */}
            <header className="w-full relative z-40 bg-white main-header">
                {/* ROW 1: Premium Utility Bar */}
                {/* ROW 1: Unified Utility & Navigation Bar */}
                <div className="bg-[#0F172A] text-white border-b border-white/5 py-1.5 lg:py-2">
                    <div className="w-full px-4 sm:px-8 flex items-center justify-between gap-4">
                        {/* Desktop Main Links */}
                        <div className="hidden lg:flex items-center gap-0.5 text-[11px] font-bold uppercase tracking-wider flex-1 min-w-0 overflow-hidden">
                            {topNavLinks.map((link, idx) => (
                                <div key={link.key} className="flex items-center shrink-0">
                                    <button
                                        onClick={() => handleLinkClick(link.key)}
                                        className="hover:text-primary-light transition-colors px-2 py-1 whitespace-nowrap"
                                    >
                                        {link.label}
                                    </button>
                                    {idx < topNavLinks.length - 1 && (
                                        <span className="text-white/20 mx-0.5">|</span>
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* Search & Contacts Section */}
                        <div className="flex items-center gap-3 sm:gap-5 shrink-0">
                            {/* Search Bar */}
                            <form onSubmit={handleSearch} className="relative hidden md:flex items-center bg-white/5 rounded-full border border-white/10 px-3 py-1 focus-within:bg-white/10 focus-within:border-white/30 transition-all">
                                <Search className="w-3.5 h-3.5 text-white/50 mr-2 shrink-0" />
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder={t('navbar.search_compact')}
                                    className="bg-transparent border-none text-[11px] text-white placeholder:text-white/40 focus:outline-none w-24 lg:w-32"
                                />
                            </form>

                            {/* Contact: Landline */}
                            <div className="flex items-center gap-2 text-[10px] sm:text-[11px] font-bold text-slate-300 cursor-default">
                                <Phone className="w-3.5 h-3.5 text-primary-light" />
                                <span className="uppercase tracking-widest hidden sm:inline">{t('navbar.landline')} </span>
                                <span className="text-white whitespace-nowrap">{landlineNumber}</span>
                            </div>

                            {/* Contact: Emergency */}
                            <div className="flex items-center gap-2 text-[10px] sm:text-[11px] font-bold cursor-default">
                                <Siren className="w-3.5 h-3.5 text-red-500 animate-[pulse_2s_infinite]" />
                                <span className="uppercase tracking-widest text-red-400 hidden sm:inline">{t('navbar.emergency')} </span>
                                <span className="text-white font-black whitespace-nowrap">{emergencyNumber}</span>
                            </div>

                            {/* Language Toggle */}
                            <div className="h-3 w-[1px] bg-white/20 hidden sm:block" />
                            <button
                                onClick={toggleLanguage}
                                className="flex items-center gap-1.5 hover:text-white transition-colors uppercase tracking-wider font-bold text-[10px] sm:text-[11px]"
                            >
                                <Globe className="w-3.5 h-3.5 text-primary-light" />
                                <span>{langCode === 'en' ? 'NP' : 'EN'}</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* ROW 2: Institutional Branding Row — Full Width Branding */}
                <div className="bg-white border-b border-primary/[0.12] py-2 lg:py-3">
                    <div className="w-full px-4 sm:px-8 flex items-center gap-4 lg:gap-8">
                        <div className="flex items-center gap-4 lg:gap-8 cursor-pointer group flex-1" onClick={() => handleLinkClick('HOME')}>
                            {/* Logo */}
                            <div className="shrink-0 p-1 bg-white border border-slate-100 rounded-full shadow-sm ring-1 ring-primary/5 overflow-hidden">
                                <img
                                    src={logoUrl}
                                    alt={t('navbar.logo_alt')}
                                    className="w-12 h-12 sm:w-14 sm:h-14 lg:w-18 lg:h-18 object-contain scale-[1.15] transition-transform duration-500 group-hover:scale-[1.22]"
                                />
                            </div>

                            {/* Typography: Small EN top / Gold divider / Big Bold NP bottom */}
                            <div className="flex items-center flex-1 min-w-0">
                                <h1 className="flex items-center gap-x-2 sm:gap-x-3 lg:gap-x-4 font-bold">
                                    <span className="font-outfit text-[clamp(13px,2.1vw,34px)] text-[#0B4A9E] uppercase tracking-tighter whitespace-nowrap leading-none shrink-0">
                                        {t('navbar.brand_lockup_en')}
                                    </span>
                                    <div className="h-6 lg:h-10 w-[1.5px] bg-slate-200 shrink-0 mx-1" aria-hidden="true" />
                                    <span className="font-devanagari text-[clamp(15px,2.4vw,38px)] text-[#15803D] leading-none whitespace-nowrap tracking-tighter">
                                        {t('navbar.brand_lockup_devanagari')}
                                    </span>
                                </h1>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ROW 3: High-Grid Quick Actions */}
                <div className="bg-slate-50 border-b border-slate-200 py-3">
                    <div className="w-full px-4 sm:px-8">
                        <div className="hidden lg:grid grid-cols-4 xl:grid-cols-8 gap-3">
                            {quickActions.map((action) => (
                                <button
                                    key={action.key}
                                    onClick={() => handleLinkClick(action.key)}
                                    className="group flex flex-row items-center gap-2.5 py-3 px-3 rounded-xl transition-all duration-300 border shadow-sm hover:shadow-md hover:-translate-y-0.5"
                                    style={{
                                        backgroundColor: `${action.accent}08`,
                                        borderColor: `${action.accent}15`
                                    }}
                                >
                                    <div
                                        className="p-1.5 rounded-lg transition-all duration-300 shadow-sm border bg-white group-hover:scale-110 shrink-0"
                                        style={{ borderColor: `${action.accent}30` }}
                                    >
                                        <action.icon
                                            className="w-4 h-4"
                                            style={{ color: action.accent, strokeWidth: 3 }}
                                        />
                                    </div>
                                    <span
                                        className="text-[11px] font-black transition-colors text-left uppercase tracking-tight leading-[1.2] flex-1"
                                        style={{ color: action.accent }}
                                    >
                                        {action.label}
                                    </span>
                                </button>
                            ))}
                        </div>
                        {/* Mobile Actions Overlay Trigger */}
                        <div className="lg:hidden flex items-center justify-between py-1">
                            <button onClick={() => setIsMobileMenuOpen(true)} className="flex items-center gap-2 text-primary font-bold text-[11px] uppercase tracking-widest">
                                <Menu className="w-5 h-5" /> {t('navbar.menu') || 'MENU'}
                            </button>
                            <button onClick={() => navigate('/appointment')} className="bg-primary text-white px-4 py-2 rounded-lg font-bold text-[11px] uppercase tracking-widest shadow-lg shadow-primary/20">
                                {t('navbar.book_short') || "BOOK"}
                            </button>
                        </div>
                    </div>
                </div>

                {/* ROW 4: Live Marquee */}
                <div className="bg-primary text-white relative overflow-hidden border-t border-white/5">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.03] to-transparent animate-[shimmer_3s_infinite]" />
                    <div className="flex items-center relative z-10">
                        <div className="shrink-0 bg-gradient-to-r from-red-600 to-red-500 text-white px-6 py-2.5 text-[11px] font-black uppercase tracking-[0.2em] flex items-center gap-3 border-r border-white/10 shadow-[8px_0_24px_rgba(0,0,0,0.1)]">
                            <span className="relative flex h-2.5 w-2.5">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-white"></span>
                            </span>
                            {t('navbar.live_updates')}
                        </div>
                        <div className="flex-1 overflow-hidden whitespace-nowrap">
                            <div className="animate-marquee py-3">
                                {[...marqueeItems, ...marqueeItems].map((item, idx) => (
                                    <span key={idx} className="inline-flex items-center px-10 text-[12px] font-bold tracking-wide uppercase text-white/90">
                                        <span className="w-4 h-[1px] bg-white/20 mr-4" />
                                        {item}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Mobile Menu Drawer */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="fixed inset-0 bg-black/40 z-[60] backdrop-blur-sm lg:hidden"
                        />
                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: "spring", damping: 30, stiffness: 300 }}
                            className="fixed top-0 right-0 h-full w-[300px] bg-white shadow-2xl z-[70] flex flex-col lg:hidden"
                        >
                            <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                                <img src={logoUrl} alt="Logo" className="w-10 h-10 object-contain" />
                                <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 hover:bg-slate-200 rounded-lg">
                                    <X className="w-5 h-5 text-slate-500" />
                                </button>
                            </div>
                            <div className="flex-1 overflow-y-auto py-4">
                                <div className="px-6 mb-8">
                                    <button onClick={toggleLanguage} className="w-full flex items-center justify-between p-3 bg-slate-100 rounded-xl font-bold text-xs text-primary mb-6">
                                        <div className="flex items-center gap-2">
                                            <Globe className="w-4 h-4" />
                                            {langCode === 'en' ? 'ENGLISH' : 'NEPALI'}
                                        </div>
                                        <span className="text-slate-400">CHANGE</span>
                                    </button>
                                    <p className="text-[10px] font-black tracking-widest text-slate-400 mb-4 uppercase">{t('navbar.navigation')}</p>
                                    <div className="space-y-1">
                                        {topNavLinks.map((link) => (
                                            <button key={link.key} onClick={() => handleLinkClick(link.key)} className="w-full text-left p-3 text-sm font-bold text-slate-600 hover:text-primary hover:bg-primary/5 rounded-lg transition-all">
                                                {link.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <div className="p-6 border-t border-slate-100">
                                <button onClick={() => { navigate('/appointment'); setIsMobileMenuOpen(false); }} className="w-full py-4 bg-primary text-white rounded-xl font-bold uppercase tracking-widest text-xs shadow-lg shadow-primary/20">
                                    {t('navbar.book_appointment')}
                                </button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            <RegisterModal isOpen={isRegisterOpen} onClose={() => setIsRegisterOpen(false)} onLoginClick={() => { setIsRegisterOpen(false); setIsLoginOpen(true); }} />
            <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} onRegisterClick={() => { setIsLoginOpen(false); setIsRegisterOpen(true); }} onForgotPasswordClick={() => { setIsLoginOpen(false); setIsForgotPasswordOpen(true); }} />
            <ForgotPasswordModal isOpen={isForgotPasswordOpen} onClose={() => setIsForgotPasswordOpen(false)} onLoginClick={() => { setIsForgotPasswordOpen(false); setIsLoginOpen(true); }} />
            <ScrollToTopButton />
            <ChatWidget isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
        </>
    );
};

export default Navbar;

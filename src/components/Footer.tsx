import { Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin, ExternalLink, ArrowRight, Globe } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const Footer = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const location = useLocation();

    const handleScroll = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
        e.preventDefault();
        if (location.pathname !== '/') {
            navigate('/', { state: { scrollTo: id } });
        } else {
            document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <footer className="bg-slate-900 text-white relative overflow-hidden">
            {/* Decorative top border */}
            <div className="h-1 bg-gradient-to-r from-primary via-sky-400 to-primary" />

            <div className="max-w-7xl mx-auto px-6 pt-12 pb-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-10">
                    {/* Brand Column */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-4 cursor-pointer group" onClick={() => navigate('/')}>
                            <img src="/logo.png" alt="Dwarika Hospital Logo" className="w-14 h-14 object-contain brightness-0 invert opacity-90 group-hover:opacity-100 transition-all" />
                            <div>
                                <h4 className="text-lg font-bold text-white leading-tight">
                                    Dwarika Hospital
                                </h4>
                                <p className="text-xs text-slate-300">& Medical Academy Pvt. Ltd.</p>
                            </div>
                        </div>
                        <p className="text-slate-200 text-sm leading-relaxed">
                            {t('footer.brand_desc')}
                        </p>
                        <div className="flex gap-2">
                            {[
                                { icon: Facebook, href: "https://facebook.com", hoverBg: "hover:bg-[#1877F2]" },
                                { icon: Twitter, href: "https://twitter.com", hoverBg: "hover:bg-[#1DA1F2]" },
                                { icon: Instagram, href: "https://instagram.com", hoverBg: "hover:bg-[#E4405F]" },
                                { icon: Linkedin, href: "https://linkedin.com", hoverBg: "hover:bg-[#0A66C2]" },
                            ].map(({ icon: Icon, href, hoverBg }) => (
                                <a key={href} href={href} target="_blank" rel="noreferrer" aria-label={href}
                                    className={`p-2.5 bg-slate-800/90 rounded-lg ring-1 ring-white/8 ${hoverBg} transition-all hover:text-white hover:shadow-md`}>
                                    <Icon className="w-4 h-4 text-slate-200 group-hover:text-white" />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Patient Portal */}
                    <div>
                        <h4 className="text-sm font-bold mb-5 uppercase tracking-wider text-white">{t('footer.portal_title')}</h4>
                        <ul className="space-y-3">
                            {[
                                { label: t('footer.portal.appointment'), route: '/appointment' },
                                { label: t('footer.portal.reports'), route: '/reports' },
                                { label: t('footer.portal.pharmacy'), route: '/pharmacy' },
                                { label: t('footer.portal.feedback'), route: '/support-form' },
                            ].map(({ label, route }) => (
                                <li key={route}>
                                    <a href={route} onClick={(e) => { e.preventDefault(); navigate(route); }}
                                        className="group flex items-center justify-between text-sm text-slate-200 hover:text-white transition-colors py-0.5">
                                        <span>{label}</span>
                                        <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-all group-hover:translate-x-1 text-primary-light" />
                                    </a>
                                </li>
                            ))}
                            <li>
                                <a href="tel:102" className="group flex items-center justify-between text-sm text-red-400 hover:text-red-300 transition-colors py-0.5">
                                    <span>{t('footer.portal.emergency')}</span>
                                    <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-all group-hover:translate-x-1" />
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-sm font-bold mb-5 uppercase tracking-wider text-white">{t('footer.links_title')}</h4>
                        <ul className="space-y-3">
                             <li><a href="/academic" onClick={(e) => { e.preventDefault(); navigate('/academic'); }} className="text-sm text-slate-200 hover:text-white transition-colors flex items-center gap-2">{t('footer.links.academic')} <ExternalLink className="w-3 h-3 text-slate-300" /></a></li>
                            <li><a href="/notices" onClick={(e) => { e.preventDefault(); navigate('/notices'); }} className="text-sm text-slate-200 hover:text-white transition-colors">{t('footer.links.notices')}</a></li>
                            <li><a href="#news" onClick={(e) => handleScroll(e, 'news')} className="text-sm text-slate-200 hover:text-white transition-colors">{t('footer.links.news')}</a></li>
                            <li><a href="/gallery" onClick={(e) => { e.preventDefault(); navigate('/gallery'); }} className="text-sm text-slate-200 hover:text-white transition-colors">{t('footer.links.gallery')}</a></li>
                            <li><a href="#services" onClick={(e) => handleScroll(e, 'services')} className="text-sm text-slate-200 hover:text-white transition-colors">{t('footer.links.packages')}</a></li>
                            <li><a href="/downloads" onClick={(e) => { e.preventDefault(); navigate('/downloads'); }} className="text-sm text-slate-200 hover:text-white transition-colors">{t('footer.links.downloads')}</a></li>
                            <li><a href="/contact" onClick={(e) => { e.preventDefault(); navigate('/contact'); }} className="text-sm text-slate-200 hover:text-white transition-colors flex items-center gap-2">{t('footer.links.webmail')} <ExternalLink className="w-3 h-3 text-slate-300" /></a></li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h4 className="text-sm font-bold mb-5 uppercase tracking-wider text-white">{t('footer.touch_title')}</h4>
                        <ul className="space-y-4">
                            <li>
                                <a href="https://maps.google.com/?q=Kalyanpur,+Khadak+Municipality,+Saptari,+Nepal" target="_blank" rel="noreferrer" className="flex gap-3 group items-start">
                                    <div className="mt-0.5 p-2 bg-slate-800/90 rounded-lg ring-1 ring-white/8 group-hover:bg-primary transition-colors shrink-0">
                                        <MapPin className="w-4 h-4 text-slate-100 group-hover:text-white" />
                                    </div>
                                    <span className="text-sm text-slate-100 group-hover:text-white transition-colors leading-relaxed whitespace-pre-line">
                                        {t('footer.address')}
                                    </span>
                                </a>
                            </li>
                            <li className="flex gap-3 items-start group">
                                <div className="mt-0.5 p-2 bg-slate-800/90 rounded-lg ring-1 ring-white/8 group-hover:bg-primary transition-colors shrink-0">
                                    <Phone className="w-4 h-4 text-slate-100 group-hover:text-white" />
                                </div>
                                <div className="flex flex-col gap-1 mt-1">
                                    <a href="tel:031590123" className="text-sm text-slate-100 hover:text-white transition-colors">031 - 590123</a>
                                    <a href="tel:9705490123" className="text-sm text-slate-100 hover:text-white transition-colors">+977 9705 490123</a>
                                </div>
                            </li>
                            <li className="flex items-center gap-3 group">
                                <div className="p-2 bg-slate-800/90 rounded-lg ring-1 ring-white/8 group-hover:bg-primary transition-colors shrink-0">
                                    <Mail className="w-4 h-4 text-slate-100 group-hover:text-white" />
                                </div>
                                <a href="mailto:dwarikahospital15@gmail.com" className="text-sm text-slate-100 hover:text-white transition-colors">info@dhama.com.np</a>
                            </li>
                            <li className="flex items-center gap-3 group">
                                <div className="p-2 bg-slate-800/90 rounded-lg ring-1 ring-white/8 group-hover:bg-primary transition-colors shrink-0">
                                    <Globe className="w-4 h-4 text-slate-100 group-hover:text-white" />
                                </div>
                                <a href="https://www.dhama.com.np" target="_blank" rel="noreferrer" className="text-sm text-slate-100 hover:text-white transition-colors">www.dhama.com.np</a>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="mt-14 pt-6 border-t border-slate-700 flex flex-col md:flex-row justify-between items-center gap-4 text-slate-300 text-xs">
                    <p>&copy; {new Date().getFullYear()} Dwarika Hospital & Medical Academy Pvt. Ltd. {t('footer.rights')}</p>
                    <div className="flex gap-6">
                        <a href="#" className="hover:text-white transition-colors">{t('footer.privacy')}</a>
                        <a href="#" className="hover:text-white transition-colors">{t('footer.terms')}</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;

import { motion } from 'framer-motion';
import { Calendar, User, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { BLOGS } from '../lib/blogData';

const HealthTipsSection = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const tips = BLOGS.slice(0, 3);

    return (
        <section className="px-4 sm:px-6 lg:px-8 py-10 lg:py-14 overflow-hidden">
            <div className="home-band-inner premium-surface premium-tint rounded-[32px] lg:rounded-[40px] px-6 sm:px-8 lg:px-10 py-12 lg:py-16 max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 lg:mb-12 gap-6">
                    <div className="max-w-xl section-intro">
                        <p className="section-label text-primary font-semibold text-sm tracking-wide uppercase">{t('health_tips.section_title')}</p>
                        <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 tracking-tight leading-[1.1]">
                            {t('health_tips.heading_part1')}<span className="text-primary">{t('health_tips.heading_part2')}</span>
                        </h2>
                    </div>
                    <button
                        onClick={() => navigate('/blogs')}
                        className="group flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary-hover transition-colors"
                    >
                        {t('health_tips.view_all')}
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {tips.map((tip, index) => (
                        <motion.div
                            key={tip.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            onClick={() => navigate(`/blog/${tip.id}`)}
                            className="group soft-card rounded-[28px] overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 flex flex-col h-full cursor-pointer"
                        >
                            <div className="relative h-52 overflow-hidden">
                                <img
                                    src={tip.image}
                                    alt={tip.title}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    loading="lazy"
                                />
                                <div className="absolute top-4 left-4">
                                    <span className="px-3 py-1.5 rounded-lg bg-white/95 text-xs font-semibold text-slate-700 shadow-sm">
                                        {tip.category}
                                    </span>
                                </div>
                            </div>

                            <div className="p-6 flex flex-col flex-grow">
                                <div className="flex items-center gap-4 mb-4 text-xs text-slate-400">
                                    <div className="flex items-center gap-1.5">
                                        <Calendar className="w-3.5 h-3.5" />
                                        {tip.date}
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <User className="w-3.5 h-3.5" />
                                        {tip.author}
                                    </div>
                                </div>
                                <h3 className="text-lg font-semibold text-slate-900 group-hover:text-primary transition-colors mb-3 leading-snug">
                                    {tip.title}
                                </h3>
                                <p className="text-sm text-slate-500 leading-relaxed line-clamp-2 mb-4">
                                    {tip.excerpt}
                                </p>
                                <div className="mt-auto">
                                    <span className="text-sm font-semibold text-primary group-hover:underline">
                                        {t('common.read_more')} →
                                    </span>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default HealthTipsSection;

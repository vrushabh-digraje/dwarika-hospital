import { useMemo, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, ChevronLeft, ChevronRight, Play, X, Activity } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";
import { useTranslation } from "react-i18next";
import { VIDEOS } from '../lib/multimediaData';
import { articles as NEWS_ITEMS } from './NewsAndEvents';

const NEWS_FILTER_KEYS = ['All', 'News', 'Event', 'Notice', 'Academic', 'Strategic'] as const;

const NewsEventsSection = () => {
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();
    const [slideIndex, setSlideIndex] = useState(0);
    const [filter, setFilter] = useState<(typeof NEWS_FILTER_KEYS)[number]>('All');
    const [isVideoPlaying, setIsVideoPlaying] = useState(false);
    const [videoIndex, setVideoIndex] = useState(0);

    const items = useMemo(() => {
        const sorted = [...NEWS_ITEMS].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        if (filter === 'All') return sorted;
        return sorted.filter((item) => item.category === filter);
    }, [filter]);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setSlideIndex(0);
    }, [filter]);

    const current = items[slideIndex];

    const nextSlide = () => setSlideIndex((prev) => (prev + 1) % items.length);
    const prevSlide = () => setSlideIndex((prev) => (prev - 1 + items.length) % items.length);

    const nextVideo = () => {
        setIsVideoPlaying(false);
        setVideoIndex((prev) => (prev + 1) % VIDEOS.length);
    };

    const prevVideo = () => {
        setIsVideoPlaying(false);
        setVideoIndex((prev) => (prev - 1 + VIDEOS.length) % VIDEOS.length);
    };

    const currentVideo = VIDEOS[videoIndex];

    return (
        <section id="news" className="relative px-4 sm:px-6 lg:px-8 py-10 lg:py-14 overflow-hidden">
            {/* Background Decorative Elements */}
            <div className="absolute top-0 right-0 w-1/3 h-1/2 bg-primary/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-1/4 h-1/3 bg-slate-50/80 blur-[100px] rounded-full translate-y-1/4 -translate-x-1/4" />

            <div className="home-band-inner premium-surface rounded-[32px] lg:rounded-[40px] px-6 sm:px-8 lg:px-10 py-12 lg:py-16 max-w-7xl mx-auto relative z-10">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-10 lg:mb-12">
                    <div className="section-intro">
                        <p className="section-label text-primary font-semibold text-sm tracking-wide uppercase">{t('news.section_title')}</p>
                        <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 tracking-tight leading-[1.1]">
                            {t('news.heading_part1')}<span className="text-primary">{t('news.heading_part2')}</span>{t('news.heading_part3')}
                        </h2>
                    </div>

                    <div className="flex p-2 bg-white/65 backdrop-blur-md rounded-2xl border border-white/70 shadow-[var(--shadow-soft)]">
                        {NEWS_FILTER_KEYS.map((f) => (
                            <button
                                key={f}
                                type="button"
                                onClick={() => setFilter(f)}
                                className={`px-5 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all duration-300 ${filter === f
                                    ? "bg-white text-primary shadow-sm shadow-slate-200"
                                    : "text-slate-500 hover:text-slate-800 hover:bg-white/50"
                                    }`}
                            >
                                {f === 'All' ? t('common.all') : t(`news.category.${f}`)}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
                    {/* News Container - 7 Cols */}
                    <div className="lg:col-span-7 flex flex-col">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={current?.id || filter}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                transition={{ duration: 0.4, ease: "easeOut" }}
                                className="relative flex-1 group"
                            >
                                {current ? (
                                    <div
                                        className="relative h-full bg-slate-900 rounded-3xl overflow-hidden shadow-[var(--shadow-card)] group cursor-pointer"
                                        onClick={() => navigate(current.isSpecial ? '/strategic-vision' : `/news/${current.id}`)}
                                    >
                                        <div className="absolute inset-0">
                                            <img
                                                src={current.image}
                                                alt={current.title}
                                                className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-[1.05] transition-all duration-1000"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent" />
                                        </div>

                                        <div className="relative h-full p-6 md:p-8 flex flex-col justify-end min-h-[420px]">
                                            <div className="mb-6 flex items-center justify-between">
                                                <div className="flex items-center gap-3 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/10">
                                                    <Calendar className="w-4 h-4 text-primary" />
                                                    <span className="text-xs font-semibold text-white uppercase tracking-wider">
                                                        {new Date(current.date).toLocaleDateString(i18n.resolvedLanguage ?? i18n.language, {
                                                            month: "long",
                                                            day: "numeric",
                                                            year: "numeric"
                                                        })}
                                                    </span>
                                                </div>
                                                <span className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest text-white border ${current.isSpecial ? 'bg-orange-500/80 border-orange-400' : (current.type === 'Event' ? 'bg-orange-600/80 border-orange-500' : 'bg-primary/80 border-primary-hover')
                                                    }`}>
                                                    {t(`news.type.${current.type.toLowerCase()}`, { defaultValue: current.type })}
                                                </span>
                                            </div>

                                            <h3 className="text-2xl md:text-3xl font-bold text-white tracking-tight leading-snug mb-4 line-clamp-2 font-heading">
                                                {current.title}
                                            </h3>

                                            <p className="text-slate-300 font-normal leading-relaxed mb-8 max-w-2xl line-clamp-2">
                                                {current.description}
                                            </p>

                                            <div className="flex items-center justify-between pt-6 border-t border-white/10">
                                                <Button
                                                    variant="primary"
                                                    onClick={(e) => { e.stopPropagation(); navigate(current.isSpecial ? '/strategic-vision' : `/news/${current.id}`); }}
                                                    className="rounded-xl bg-primary hover:bg-primary-hover py-3.5 px-6 text-xs font-semibold uppercase tracking-wide border-none shadow-md"
                                                >
                                                    {current.isSpecial ? t('about.vision_title') : t('common.read_more')}
                                                </Button>

                                                <div className="flex gap-3">
                                                    <button onClick={(e) => { e.stopPropagation(); prevSlide(); }} className="w-11 h-11 rounded-full border border-white/20 flex items-center justify-center text-white hover:bg-white/10 transition-all hover:scale-105">
                                                        <ChevronLeft className="w-5 h-5" />
                                                    </button>
                                                    <button onClick={(e) => { e.stopPropagation(); nextSlide(); }} className="w-11 h-11 rounded-full border border-white/20 flex items-center justify-center text-white hover:bg-white/10 transition-all hover:scale-105">
                                                        <ChevronRight className="w-5 h-5" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="h-full bg-white/70 rounded-3xl flex items-center justify-center border border-white/70 backdrop-blur-sm">
                                        <p className="text-slate-400 font-semibold uppercase tracking-widest">{t('common.no_updates')}</p>
                                    </div>
                                )}
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    {/* Video Container - 5 Cols */}
                    <div className="lg:col-span-5 flex flex-col">
                        <div className="relative flex-1 soft-card rounded-3xl overflow-hidden flex flex-col h-full group">
                            <div className="relative h-[240px] md:h-[280px] overflow-hidden bg-slate-900 group">
                                <AnimatePresence mode="wait">
                                    <motion.div
                                        key={videoIndex}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="h-full w-full"
                                    >
                                        {!isVideoPlaying ? (
                                            <div
                                                className="relative w-full h-full cursor-pointer overflow-hidden"
                                                onClick={() => setIsVideoPlaying(true)}
                                            >
                                                <img
                                                    src={currentVideo.thumbnail}
                                                    alt={currentVideo.title}
                                                    className="w-full h-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-110 transition-all duration-1000"
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent opacity-60" />

                                                {/* Play Button */}
                                                <div className="absolute inset-0 flex items-center justify-center">
                                                    <div className="relative group/btn">
                                                        <div className="absolute inset-0 bg-primary/30 blur-2xl rounded-full scale-[2] group-hover/btn:scale-150 transition-transform duration-500 animate-pulse"></div>
                                                        <div className="relative w-16 h-16 bg-primary rounded-full flex items-center justify-center shadow-[var(--shadow-card)] transition-all duration-300 group-hover/btn:scale-110">
                                                            <Play className="w-7 h-7 text-white fill-white ml-1" />
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="absolute bottom-6 left-6 right-6">
                                                    <div className="flex items-center gap-3 mb-3">
                                                        <span className="px-3 py-1 bg-primary/20 backdrop-blur-md rounded-md text-[10px] font-bold uppercase tracking-wider text-primary-light border border-primary/20">
                                                            {currentVideo.category}
                                                        </span>
                                                        <span className="px-3 py-1 bg-slate-900/40 backdrop-blur-md rounded-md text-[10px] font-medium text-slate-300 uppercase tracking-widest border border-white/5">
                                                            {currentVideo.duration}
                                                        </span>
                                                    </div>
                                                    <h4 className="text-white text-xl font-bold tracking-tight leading-tight group-hover:text-primary-light transition-colors font-heading line-clamp-2">
                                                        {currentVideo.title}
                                                    </h4>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="w-full h-full relative">
                                                <iframe
                                                    width="100%"
                                                    height="100%"
                                                    src={`${currentVideo.videoUrl}?autoplay=1&rel=0&modestbranding=1&mute=0`}
                                                    title={currentVideo.title}
                                                    frameBorder="0"
                                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                                    allowFullScreen
                                                    className="w-full h-full"
                                                ></iframe>
                                                <button
                                                    onClick={() => setIsVideoPlaying(false)}
                                                    className="absolute top-6 right-6 z-20 w-12 h-12 bg-black/50 hover:bg-red-600/90 text-white rounded-full flex items-center justify-center transition-all backdrop-blur-md border border-white/10 shadow-2xl"
                                                >
                                                    <X className="w-6 h-6" />
                                                </button>
                                            </div>
                                        )}
                                    </motion.div>
                                </AnimatePresence>
                            </div>

                            <div className="p-5 md:p-6 flex flex-col justify-between flex-1 bg-white/60 backdrop-blur-sm">
                                <div className="space-y-4">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Activity className="w-4 h-4 text-primary" />
                                        <span className="text-xs font-semibold uppercase tracking-widest text-slate-500">{t('news.up_next')}</span>
                                    </div>
                                    <div className="space-y-3">
                                        {VIDEOS.map((v, i) => {
                                            const total = VIDEOS.length;
                                            const isNext = (i > videoIndex && i <= videoIndex + 3) || (i + total > videoIndex && i + total <= videoIndex + 3);

                                            if (!isNext && videoIndex !== i) return null;
                                            if (videoIndex === i && total > 3) return null; 

                                            return (
                                                <button
                                                    key={v.id}
                                                    onClick={() => { setVideoIndex(i); setIsVideoPlaying(false); }}
                                                    className={`w-full flex items-center gap-4 p-3 rounded-xl transition-all duration-300 group/item ${videoIndex === i
                                                        ? "bg-white/85 border border-white/70 shadow-[var(--shadow-soft)]"
                                                        : "hover:bg-white/70 border border-transparent"
                                                        }`}
                                                >
                                                    <div className="w-20 h-14 rounded-lg overflow-hidden flex-shrink-0 bg-slate-100 shadow-sm relative">
                                                        <img src={v.thumbnail} alt="" className="w-full h-full object-cover group-hover/item:scale-105 transition-transform duration-500" />
                                                        <div className="absolute inset-0 flex items-center justify-center bg-slate-900/20 group-hover/item:bg-slate-900/10 transition-colors">
                                                            <Play className="w-5 h-5 text-white fill-white opacity-80" />
                                                        </div>
                                                    </div>
                                                    <div className="text-left min-w-0">
                                                        <h5 className={`text-sm font-semibold truncate transition-colors font-heading ${i === videoIndex ? 'text-primary' : 'text-slate-900 group-hover/item:text-primary'}`}>
                                                            {v.title}
                                                        </h5>
                                                        <p className="text-[10px] font-medium text-slate-500 uppercase tracking-wider mt-1">{v.category} • {v.duration}</p>
                                                    </div>
                                                </button>
                                            );
                                        }).filter(Boolean).slice(0, 3)}
                                    </div>
                                </div>

                                <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-between">
                                    <div className="flex gap-2">
                                        <button onClick={prevVideo} className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-600 hover:bg-primary hover:text-white transition-colors border border-slate-200">
                                            <ChevronLeft className="w-5 h-5" />
                                        </button>
                                        <button onClick={nextVideo} className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-600 hover:bg-primary hover:text-white transition-colors border border-slate-200">
                                            <ChevronRight className="w-5 h-5" />
                                        </button>
                                    </div>
                                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-widest">
                                        {videoIndex + 1} / {VIDEOS.length}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* View All Button */}
                <div className="mt-12 text-center">
                    <Button
                        variant="secondary"
                        onClick={() => navigate('/news-events')}
                        className="rounded-full bg-slate-900 hover:bg-slate-800 text-white border-none py-4 px-8 text-xs font-semibold uppercase tracking-widest shadow-lg shadow-slate-900/20 group transition-all"
                    >
                        {t('news.view_all')}
                        <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </Button>
                </div>
            </div>
        </section>
    );
};


export default NewsEventsSection;

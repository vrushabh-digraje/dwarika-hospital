import { useMemo, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, ChevronLeft, ChevronRight, Play, X, ArrowUpRight, Film } from "lucide-react";
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
        <section id="news" className="relative px-4 sm:px-6 lg:px-8 py-16 lg:py-24 overflow-hidden bg-slate-50/50">
            {/* Background Decorative Elements */}
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 blur-[150px] rounded-full -translate-y-1/2 translate-x-1/3 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-amber-500/5 blur-[120px] rounded-full translate-y-1/3 -translate-x-1/3 pointer-events-none" />

            <div className="max-w-[1400px] mx-auto relative z-10">
                {/* Header Section */}
                <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-10 mb-12 lg:mb-16">
                    <div className="max-w-2xl">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-[1px] bg-primary/40"></div>
                            <p className="text-primary font-semibold text-xs tracking-[0.2em] uppercase">{t('news.section_title')}</p>
                        </div>
                        <h2 className="text-4xl md:text-5xl lg:text-6xl font-heading font-extrabold text-slate-900 tracking-tight leading-[1.1]">
                            {t('news.heading_part1')}<span className="text-primary italic px-2">{t('news.heading_part2')}</span>{t('news.heading_part3')}
                        </h2>
                    </div>

                    {/* Premium Filter Tabs */}
                    <div className="inline-flex p-1.5 bg-white/80 backdrop-blur-xl rounded-full border border-slate-200/60 shadow-sm overflow-x-auto custom-scrollbar max-w-full">
                        {NEWS_FILTER_KEYS.map((f) => (
                            <button
                                key={f}
                                type="button"
                                onClick={() => setFilter(f)}
                                className={`relative px-6 py-3 rounded-full text-xs font-bold uppercase tracking-widest transition-all duration-500 whitespace-nowrap ${filter === f
                                    ? "text-white shadow-md shadow-primary/20"
                                    : "text-slate-500 hover:text-slate-900 hover:bg-slate-100/50"
                                    }`}
                            >
                                {filter === f && (
                                    <motion.div
                                        layoutId="activeNewsFilter"
                                        className="absolute inset-0 bg-primary rounded-full"
                                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                                    />
                                )}
                                <span className="relative z-10">{f === 'All' ? t('common.all') : t(`news.category.${f}`)}</span>
                            </button>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 xl:gap-10 items-stretch">
                    {/* Featured Editorial News - 7 or 8 Cols */}
                    <div className="lg:col-span-7 xl:col-span-8 flex flex-col min-h-[500px] xl:min-h-[640px]">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={current?.id || filter}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                                className="relative flex-1 group rounded-[2.5rem] bg-slate-100 overflow-hidden shadow-2xl shadow-slate-200/50"
                            >
                                {current ? (
                                    <div
                                        className="absolute inset-0 cursor-pointer"
                                        onClick={() => navigate(current.isSpecial ? '/strategic-vision' : `/news/${current.id}`)}
                                    >
                                        <div className="absolute inset-0">
                                            <img
                                                src={current.image}
                                                alt={current.title}
                                                className="w-full h-full object-cover transform scale-100 group-hover:scale-105 transition-transform duration-[1.5s] ease-out will-change-transform"
                                            />
                                            {/* Refined gradient overlay */}
                                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-slate-900/10 to-transparent" />
                                        </div>

                                        {/* Floating White Content Card */}
                                        <div className="absolute bottom-4 left-4 right-4 md:bottom-8 md:left-8 md:right-auto md:w-[85%] xl:w-[70%] bg-white/95 backdrop-blur-2xl rounded-[2rem] p-6 md:p-10 shadow-2xl border border-white/60 transform translate-y-0 group-hover:-translate-y-2 transition-transform duration-500 ease-out">
                                            <div className="mb-6 flex flex-wrap items-center gap-3">
                                                <div className="flex items-center gap-2 px-4 py-2 bg-slate-100 rounded-full">
                                                    <Calendar className="w-3.5 h-3.5 text-primary" />
                                                    <span className="text-[11px] font-bold text-slate-700 uppercase tracking-widest">
                                                        {new Date(current.date).toLocaleDateString(i18n.resolvedLanguage ?? i18n.language, {
                                                            month: "long",
                                                            day: "numeric",
                                                            year: "numeric"
                                                        })}
                                                    </span>
                                                </div>
                                                <span className={`px-4 py-2 rounded-full text-[11px] font-bold uppercase tracking-widest border ${current.isSpecial ? 'bg-orange-50 text-orange-600 border-orange-200' : (current.type === 'Event' ? 'bg-amber-50 text-amber-600 border-amber-200' : 'bg-primary/5 text-primary border-primary/10')
                                                    }`}>
                                                    {t(`news.type.${current.type.toLowerCase()}`, { defaultValue: current.type })}
                                                </span>
                                            </div>

                                            <h3 className="text-2xl md:text-3xl xl:text-4xl font-heading font-extrabold text-slate-900 tracking-tight leading-[1.2] mb-4 line-clamp-2">
                                                {current.title}
                                            </h3>

                                            <p className="text-slate-600 font-medium leading-relaxed mb-8 line-clamp-2 xl:line-clamp-3 text-sm xl:text-base">
                                                {current.description}
                                            </p>

                                            <div className="flex items-center justify-between pt-6 border-t border-slate-100">
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); navigate(current.isSpecial ? '/strategic-vision' : `/news/${current.id}`); }}
                                                    className="group/btn flex items-center gap-2 text-primary font-bold text-xs xl:text-sm uppercase tracking-widest transition-colors hover:text-primary-hover"
                                                >
                                                    {current.isSpecial ? t('about.vision_title') : t('common.read_more', 'Read More')}
                                                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center group-hover/btn:bg-primary group-hover/btn:text-white transition-all duration-300">
                                                        <ArrowUpRight className="w-4 h-4" />
                                                    </div>
                                                </button>

                                                <div className="flex gap-2">
                                                    <button onClick={(e) => { e.stopPropagation(); prevSlide(); }} className="w-12 h-12 rounded-full border-2 border-slate-100 flex items-center justify-center text-slate-400 hover:bg-slate-50 hover:text-primary hover:border-primary/20 transition-all">
                                                        <ChevronLeft className="w-5 h-5" />
                                                    </button>
                                                    <button onClick={(e) => { e.stopPropagation(); nextSlide(); }} className="w-12 h-12 rounded-full border-2 border-slate-100 flex items-center justify-center text-slate-400 hover:bg-slate-50 hover:text-primary hover:border-primary/20 transition-all">
                                                        <ChevronRight className="w-5 h-5" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="h-full bg-white/70 rounded-[2.5rem] flex items-center justify-center border border-white backdrop-blur-sm">
                                        <p className="text-slate-400 font-semibold uppercase tracking-widest">{t('common.no_updates')}</p>
                                    </div>
                                )}
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    {/* Curated Media/Videos - 5 or 4 Cols */}
                    <div className="lg:col-span-5 xl:col-span-4 flex flex-col h-full min-h-[500px]">
                        <div className="flex-1 bg-white border border-slate-100 rounded-[2.5rem] p-4 xl:p-5 shadow-xl shadow-slate-200/40 flex flex-col group/media relative overflow-hidden">
                            {/* Inner Decorative background */}
                            <div className="absolute top-0 right-0 w-full h-1/2 bg-gradient-to-br from-slate-50 to-white -z-10 rounded-t-[2.5rem]" />
                            
                            <div className="flex items-center justify-between px-3 md:px-4 pt-2 pb-5">
                                <div className="flex items-center gap-2.5">
                                    <Film className="w-5 h-5 text-primary" />
                                    <h4 className="font-heading font-extrabold text-slate-900 text-lg uppercase tracking-wider">{t('news.media_gallery', 'Media Gallery')}</h4>
                                </div>
                                <span className="text-xs font-bold text-slate-400 tracking-widest uppercase">
                                    {videoIndex + 1} / {VIDEOS.length}
                                </span>
                            </div>

                            {/* Main Video Area */}
                            <div className="relative h-[220px] xl:h-[260px] rounded-[1.75rem] overflow-hidden bg-slate-900 shadow-inner shrink-0 isolate">
                                <AnimatePresence mode="wait">
                                    <motion.div
                                        key={videoIndex}
                                        initial={{ opacity: 0, scale: 0.98 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 1.02 }}
                                        transition={{ duration: 0.5, ease: "easeOut" }}
                                        className="h-full w-full absolute inset-0"
                                    >
                                        {!isVideoPlaying ? (
                                            <div
                                                className="relative w-full h-full cursor-pointer overflow-hidden group/vid"
                                                onClick={() => setIsVideoPlaying(true)}
                                            >
                                                <img
                                                    src={currentVideo.thumbnail}
                                                    alt={currentVideo.title}
                                                    className="w-full h-full object-cover opacity-90 group-hover/vid:opacity-100 group-hover/vid:scale-110 transition-all duration-[1.5s]"
                                                />
                                                <div className="absolute inset-0 bg-slate-900/40 group-hover/vid:bg-slate-900/20 transition-colors duration-500" />
                                                
                                                {/* Premium Play Button */}
                                                <div className="absolute inset-0 flex items-center justify-center">
                                                    <div className="relative w-20 h-20 flex items-center justify-center">
                                                        <div className="absolute inset-0 border border-white/30 rounded-full scale-[1.2] group-hover/vid:border-white/60 transition-colors duration-500"></div>
                                                        <div className="absolute inset-0 bg-white/20 backdrop-blur-md rounded-full group-hover/vid:bg-white/30 transition-colors duration-500"></div>
                                                        <Play className="w-8 h-8 text-white fill-white ml-1.5 drop-shadow-md z-10" />
                                                    </div>
                                                </div>

                                                <div className="absolute bottom-5 left-5 right-5">
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <span className="px-2.5 py-1 bg-black/40 backdrop-blur-md rounded text-[9px] font-bold uppercase tracking-widest text-white border border-white/20">
                                                            {currentVideo.category}
                                                        </span>
                                                        <span className="text-[10px] font-bold text-white/80 shadow-black drop-shadow-md">
                                                            {currentVideo.duration}
                                                        </span>
                                                    </div>
                                                    <h4 className="text-white text-base xl:text-lg font-bold tracking-tight leading-tight line-clamp-1 drop-shadow-md">
                                                        {currentVideo.title}
                                                    </h4>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="w-full h-full relative z-20">
                                                <iframe
                                                    width="100%"
                                                    height="100%"
                                                    src={`${currentVideo.videoUrl}?autoplay=1&rel=0&modestbranding=1&mute=0`}
                                                    title={currentVideo.title}
                                                    frameBorder="0"
                                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                    allowFullScreen
                                                    className="w-full h-full"
                                                ></iframe>
                                                <button
                                                    onClick={() => setIsVideoPlaying(false)}
                                                    className="absolute top-4 right-4 z-30 w-10 h-10 bg-black/60 hover:bg-black text-white rounded-full flex items-center justify-center transition-all backdrop-blur-md border border-white/20"
                                                >
                                                    <X className="w-5 h-5" />
                                                </button>
                                            </div>
                                        )}
                                    </motion.div>
                                </AnimatePresence>
                            </div>

                            {/* Upcoming List */}
                            <div className="mt-5 flex-1 flex flex-col justify-between custom-scrollbar overflow-y-auto pr-1">
                                <div className="space-y-2.5">
                                    {VIDEOS.map((v, i) => {
                                        const total = VIDEOS.length;
                                        // Show next 3 videos, or 4 depending on spacing
                                        const isNext = (i > videoIndex && i <= videoIndex + 3) || (i + total > videoIndex && i + total <= videoIndex + 3);
                                        
                                        if (!isNext && videoIndex !== i) return null;
                                        if (videoIndex === i && total > 3) return null; // Hide current from list if plenty available

                                        return (
                                            <button
                                                key={v.id}
                                                onClick={() => { setVideoIndex(i); setIsVideoPlaying(false); }}
                                                className={`w-full flex items-start gap-4 p-3 rounded-2xl transition-all duration-300 group/item text-left ${videoIndex === i
                                                    ? "bg-slate-50 border border-slate-200"
                                                    : "hover:bg-slate-50 border border-transparent"
                                                    }`}
                                            >
                                                <div className="w-24 h-16 rounded-[10px] overflow-hidden flex-shrink-0 relative shadow-sm">
                                                    <img src={v.thumbnail} alt="" className="w-full h-full object-cover group-hover/item:scale-110 transition-transform duration-700" />
                                                    <div className="absolute inset-0 flex items-center justify-center bg-slate-900/20 group-hover/item:bg-slate-900/10 transition-colors">
                                                        <Play className="w-5 h-5 text-white/90 fill-white" />
                                                    </div>
                                                </div>
                                                <div className="min-w-0 flex-1 pt-0.5">
                                                    <h5 className={`text-sm font-semibold truncate tracking-tight ${i === videoIndex ? 'text-primary' : 'text-slate-700 group-hover/item:text-slate-900'}`}>
                                                        {v.title}
                                                    </h5>
                                                    <div className="flex items-center gap-2 mt-1.5">
                                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{v.category}</span>
                                                        <div className="w-1 h-1 rounded-full bg-slate-300"></div>
                                                        <span className="text-[10px] font-bold text-slate-400 tracking-widest">{v.duration}</span>
                                                    </div>
                                                </div>
                                            </button>
                                        );
                                    }).filter(Boolean).slice(0, 3)}
                                </div>

                                {/* Video Controls Bottom Row */}
                                <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between pb-1 px-3">
                                    <button 
                                        onClick={() => navigate('/videos')}
                                        className="text-[11px] font-extrabold uppercase tracking-widest text-primary hover:text-primary-hover transition-colors flex items-center gap-1.5"
                                    >
                                        {t('common.view_all_videos', 'All Videos')} <ChevronRight className="w-3.5 h-3.5" />
                                    </button>
                                    
                                    <div className="flex gap-2.5">
                                        <button onClick={prevVideo} className="w-9 h-9 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-50 hover:text-primary transition-all shadow-sm">
                                            <ChevronLeft className="w-4 h-4" />
                                        </button>
                                        <button onClick={nextVideo} className="w-9 h-9 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-50 hover:text-primary transition-all shadow-sm">
                                            <ChevronRight className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* View All Master Button */}
                <div className="mt-16 sm:mt-20 flex justify-center">
                    <Button
                        variant="primary"
                        onClick={() => navigate('/news-events')}
                        className="rounded-full bg-slate-900 hover:bg-slate-800 text-white border-none py-4 px-10 text-xs font-bold uppercase tracking-[0.2em] shadow-xl shadow-slate-900/10 group transition-all"
                    >
                        {t('news.view_all', 'View All Updates')}
                        <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 ml-2" />
                    </Button>
                </div>
            </div>
        </section>
    );
};

export default NewsEventsSection;

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, X, Video, Heart, Shield, Activity, Search, ExternalLink } from 'lucide-react';
import Button from '../components/Button';
import { VIDEOS as ALL_VIDEOS } from '../lib/multimediaData';

const VideosPage = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [activeCategory, setActiveCategory] = useState<string>('All');
    const [playingVideoId, setPlayingVideoId] = useState<string | null>(null);

    const categories = ['All', 'Facility', 'Medical', 'Testimonial', 'Academic'];

    const filteredVideos = useMemo(() => {
        return ALL_VIDEOS.filter(video => {
            const matchesSearch = video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                 video.description.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesCategory = activeCategory === 'All' || video.category === activeCategory;
            return matchesSearch && matchesCategory;
        });
    }, [searchQuery, activeCategory]);

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Hero Section */}
            <div className="bg-slate-900 text-white py-24 px-6 relative overflow-hidden">
                <div className="absolute inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=2000')] bg-cover bg-center"></div>
                <div className="max-w-7xl mx-auto relative z-10">
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="max-w-3xl"
                    >
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-12 h-1 bg-blue-500 rounded-full" />
                            <span className="text-sm font-black uppercase tracking-[0.3em] text-blue-400">Multimedia Hub</span>
                        </div>
                        <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tight leading-tight mb-8">
                            Experience <span className="text-blue-500">Dwarika</span> Through Film
                        </h1>
                        <p className="text-xl text-slate-400 font-medium leading-relaxed mb-10">
                            Our complete library of hospital tours, medical breakthroughs, academic journeys, and patient stories—all in one place.
                        </p>
                    </motion.div>
                </div>
            </div>

            {/* Filters Bar */}
            <div className="sticky top-[80px] z-40 bg-white border-b border-slate-200 py-6 px-6 shadow-sm">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-6 md:items-center justify-between">
                    <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 no-scrollbar">
                        {categories.map(cat => (
                            <button
                                key={cat}
                                onClick={() => setActiveCategory(cat)}
                                className={`px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                                    activeCategory === cat
                                    ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
                                    : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                                }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>

                    <div className="relative w-full md:w-80">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search videos..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-11 pr-4 py-3 bg-slate-50 rounded-2xl text-sm font-medium border border-transparent focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10 transition-all outline-none"
                        />
                    </div>
                </div>
            </div>

            {/* Video Grid */}
            <div className="max-w-7xl mx-auto px-6 py-16">
                {filteredVideos.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                        {filteredVideos.map((video, index) => (
                            <motion.div
                                key={video.id}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: index * 0.05 }}
                                className="group bg-white rounded-[2.5rem] overflow-hidden border border-slate-100 shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:shadow-blue-200/40 transition-all duration-500 flex flex-col"
                            >
                                <div className="aspect-video relative bg-slate-100 overflow-hidden">
                                    <AnimatePresence mode="wait">
                                        {playingVideoId === video.id ? (
                                          <motion.div
                                            key="player"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            className="absolute inset-0 z-10"
                                        >
                                            {video.videoUrl.includes('.mp4') ? (
                                                <video
                                                    src={video.videoUrl}
                                                    title={video.title}
                                                    autoPlay
                                                    controls
                                                    className="w-full h-full object-cover"
                                                ></video>
                                            ) : (
                                                <iframe
                                                    width="100%"
                                                    height="100%"
                                                    src={`${video.videoUrl}?autoplay=1&rel=0&modestbranding=1&mute=0`}
                                                    title={video.title}
                                                    frameBorder="0"
                                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                                    allowFullScreen
                                                    className="w-full h-full"
                                                ></iframe>
                                            )}
                                            <button 
                                                    onClick={() => setPlayingVideoId(null)}
                                                    className="absolute top-4 right-4 z-20 w-10 h-10 bg-black/50 hover:bg-red-600 text-white rounded-full flex items-center justify-center transition-all opacity-0 group-hover:opacity-100"
                                                >
                                                    <X className="w-5 h-5" />
                                                </button>
                                            </motion.div>
                                        ) : (
                                            <motion.div
                                                key="thumbnail"
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                exit={{ opacity: 0 }}
                                                className="absolute inset-0 cursor-pointer"
                                                onClick={() => setPlayingVideoId(video.id)}
                                            >
                                                <img
                                                    src={video.thumbnail}
                                                    alt={video.title}
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                                />
                                                <div className="absolute inset-0 bg-slate-900/20 group-hover:bg-slate-900/40 transition-colors duration-500" />
                                                
                                                <div className="absolute inset-0 flex items-center justify-center">
                                                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform duration-500">
                                                        <Play className="w-6 h-6 text-blue-600 fill-blue-600 ml-1" />
                                                    </div>
                                                </div>

                                                <div className="absolute top-4 left-4">
                                                    <span className="px-3 py-1 rounded-full bg-white/95 backdrop-blur-md text-[9px] font-black uppercase tracking-wider text-blue-600 flex items-center gap-2 shadow-lg">
                                                        {video.category === 'Facility' && <Shield className="w-3 h-3 text-red-600" />}
                                                        {video.category === 'Testimonial' && <Heart className="w-3 h-3 text-red-600" />}
                                                        {video.category === 'Medical' && <Activity className="w-3 h-3 text-red-600" />}
                                                        {video.category === 'Academic' && <Video className="w-3 h-3 text-red-600" />}
                                                        {video.category}
                                                    </span>
                                                </div>

                                                <div className="absolute bottom-4 right-4 text-[9px] font-bold text-white bg-black/50 px-2 py-1 rounded-lg border border-white/10">
                                                    {video.duration}
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>

                                <div className="p-8 flex-1 flex flex-col">
                                    <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight mb-4 leading-tight group-hover:text-blue-600 transition-colors line-clamp-2">
                                        {video.title}
                                    </h3>
                                    <p className="text-sm text-slate-500 font-medium leading-relaxed mb-6 line-clamp-3">
                                        {video.description}
                                    </p>
                                    <div className="mt-auto pt-6 border-t border-slate-50 flex items-center justify-between">
                                        <button 
                                            onClick={() => setPlayingVideoId(video.id)}
                                            className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-600 hover:text-blue-700 transition-colors"
                                        >
                                            Play Experience
                                        </button>
                                        <div className="flex items-center gap-4">
                                            <button className="text-slate-300 hover:text-blue-600 transition-all">
                                                <Activity className="w-4 h-4" />
                                            </button>
                                            <button className="text-slate-300 hover:text-blue-600 transition-all">
                                                <ExternalLink className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-32">
                        <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Video className="w-8 h-8 text-slate-300" />
                        </div>
                        <h3 className="text-2xl font-black text-slate-900 uppercase">No videos found</h3>
                        <p className="text-slate-500 font-medium mt-2">Try adjusting your search or category filters.</p>
                        <button 
                            onClick={() => { setSearchQuery(''); setActiveCategory('All'); }}
                            className="mt-8 text-blue-600 font-black uppercase text-[10px] tracking-widest hover:underline"
                        >
                            Reset All Filters
                        </button>
                    </div>
                )}
            </div>

            {/* Footer CTA */}
            <div className="bg-white border-t border-slate-100 py-24 px-6 text-center">
                <div className="max-w-2xl mx-auto space-y-8">
                    <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tight">Stay Updated on YouTube</h2>
                    <p className="text-slate-500 font-medium">Subscribe to our channel for the latest medical seminars, hospital updates, and patient success stories.</p>
                    <Button
                        variant="primary"
                        onClick={() => window.open('https://www.youtube.com/@DwarikaHospital', '_blank')}
                        className="rounded-full bg-blue-600 hover:bg-blue-700 shadow-xl shadow-blue-600/20 px-10 py-5 text-sm font-black uppercase tracking-widest"
                    >
                        Visit Official Channel
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default VideosPage;

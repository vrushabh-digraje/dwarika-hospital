import { useMemo, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, ChevronDown, ChevronUp, ZoomIn, Play, Images, Calendar } from "lucide-react";
import Button from "../components/Button";
import { cmsPublic } from "../lib/cmsClient";
import { useCmsQuery } from "../hooks/useCmsQuery";

type GalleryItem = {
    id: number | string;
    type: 'photo' | 'video';
    url: string;
    title: string;
    images?: string[];
    date?: string;
    videoUrl?: string;
    duration?: string;
};

const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    try {
        const d = new Date(dateString);
        if (isNaN(d.getTime())) return '';
        return d.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
    } catch {
        return '';
    }
};

const GallerySection = () => {
    const [filter] = useState<'all' | 'photo' | 'video'>('all');
    const [showAll, setShowAll] = useState(false);
    const [activeVideoId, setActiveVideoId] = useState<number | string | null>(null);
    const [selectedAlbum, setSelectedAlbum] = useState<GalleryItem | null>(null);
    const [albumPhotoIndex, setAlbumPhotoIndex] = useState(0);

    const { data } = useCmsQuery(() => cmsPublic.gallery({ album: 'hospital' }), []);

    const hospitalGalleryItems: GalleryItem[] = useMemo(
        () =>
            (data?.items || []).map((item: any, i: number) => ({
                id: item._id || i + 1,
                type: item.type === 'video' ? 'video' : 'photo',
                url: item.url,
                title: item.title,
                images: Array.isArray(item.images) ? item.images : [],
                date: item.date || item.createdAt,
                videoUrl: item.videoUrl,
                duration: item.duration,
            })),
        [data]
    );

    const filteredItems = hospitalGalleryItems.filter(item => filter === 'all' || item.type === filter);
    const displayedItems = showAll ? filteredItems : filteredItems.slice(0, 6);

    const currentAlbumPhotos = useMemo(() => {
        if (!selectedAlbum) return [];
        const raw = [selectedAlbum.url, ...(selectedAlbum.images || [])].filter(Boolean);
        return Array.from(new Set(raw));
    }, [selectedAlbum]);

    const nextPhoto = (e?: React.MouseEvent) => {
        e?.stopPropagation();
        if (currentAlbumPhotos.length <= 1) return;
        setAlbumPhotoIndex((prev) => (prev + 1) % currentAlbumPhotos.length);
    };

    const prevPhoto = (e?: React.MouseEvent) => {
        e?.stopPropagation();
        if (currentAlbumPhotos.length <= 1) return;
        setAlbumPhotoIndex((prev) => (prev - 1 + currentAlbumPhotos.length) % currentAlbumPhotos.length);
    };

    useEffect(() => {
        if (!selectedAlbum) return;
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                setSelectedAlbum(null);
            } else if (e.key === 'ArrowRight') {
                if (currentAlbumPhotos.length > 1) {
                    setAlbumPhotoIndex((prev) => (prev + 1) % currentAlbumPhotos.length);
                }
            } else if (e.key === 'ArrowLeft') {
                if (currentAlbumPhotos.length > 1) {
                    setAlbumPhotoIndex((prev) => (prev - 1 + currentAlbumPhotos.length) % currentAlbumPhotos.length);
                }
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [selectedAlbum, currentAlbumPhotos.length]);

    return (
        <section id="gallery" className="bg-white px-6 py-16 border-t border-gray-100">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-1 bg-blue-600 rounded-full" />
                        <h2 className="font-black text-primary uppercase text-xs tracking-[0.4em]">
                            Hospital Gallery
                        </h2>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                    <AnimatePresence mode="popLayout">
                        {displayedItems.map((item, idx) => {
                            const formattedDate = formatDate(item.date);
                            const hasMultiplePhotos = item.images && item.images.length > 0;
                            const totalPhotos = 1 + (item.images?.length || 0);

                            return (
                                <motion.article
                                    key={item.id}
                                    layout
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    transition={{ duration: 0.4, delay: idx * 0.05 }}
                                    className="group relative rounded-3xl overflow-hidden bg-black shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer aspect-[4/3]"
                                    onClick={() => {
                                        if (item.type === 'video') {
                                            setActiveVideoId(item.id);
                                        } else {
                                            setSelectedAlbum(item);
                                            setAlbumPhotoIndex(0);
                                        }
                                    }}
                                >
                                    {activeVideoId === item.id ? (
                                        <div className="absolute inset-0 z-10">
                                            <iframe
                                                width="100%"
                                                height="100%"
                                                src={`${item.videoUrl}?autoplay=1&rel=0&modestbranding=1&mute=0`}
                                                title={item.title}
                                                frameBorder="0"
                                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                                allowFullScreen
                                                className="w-full h-full"
                                            ></iframe>
                                            <button
                                                onClick={(e) => { e.stopPropagation(); setActiveVideoId(null); }}
                                                className="absolute top-4 right-4 z-20 w-8 h-8 bg-black/50 hover:bg-red-600 text-white rounded-full flex items-center justify-center transition-all opacity-0 group-hover:opacity-100"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ) : (
                                        <>
                                            <img
                                                src={item.url}
                                                alt={item.title}
                                                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                                            />
                                            <div className="absolute inset-0 bg-blue-950/20 group-hover:bg-blue-950/10 transition-colors duration-500" />

                                            <div className="absolute inset-0 flex items-center justify-center">
                                                {item.type === 'video' ? (
                                                    <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform duration-500">
                                                        <Play className="w-6 h-6 text-white fill-white ml-0.5" />
                                                    </div>
                                                ) : (
                                                    <div className="w-12 h-12 bg-white/95 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transform scale-50 group-hover:scale-100 transition-all duration-300 shadow-xl">
                                                        <ZoomIn className="w-5 h-5 text-blue-900" />
                                                    </div>
                                                )}
                                            </div>

                                            {/* Bottom Overlay: Title (small text on left) and Date/Info (on right) */}
                                            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent pt-12 pb-4 px-4 sm:px-5">
                                                <div className="flex items-end justify-between gap-3">
                                                    {/* Left bottom: slightly smaller title text */}
                                                    <div className="min-w-0 flex-1">
                                                        <h3 className="text-white font-bold text-xs sm:text-[13px] tracking-normal leading-snug line-clamp-1 drop-shadow-sm">
                                                            {item.title}
                                                        </h3>
                                                    </div>

                                                    {/* Right bottom: date & photo count */}
                                                    <div className="flex items-center gap-1.5 shrink-0 text-right">
                                                        {hasMultiplePhotos && (
                                                            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-600/90 backdrop-blur-md rounded-full text-[9px] font-bold text-white shadow-xs">
                                                                <Images className="w-2.5 h-2.5" />
                                                                <span>{totalPhotos}</span>
                                                            </span>
                                                        )}
                                                        {formattedDate && (
                                                            <span className="text-[10px] sm:text-[11px] font-medium text-white/80 drop-shadow-sm whitespace-nowrap">
                                                                {formattedDate}
                                                            </span>
                                                        )}
                                                        {item.duration && (
                                                            <span className="px-2 py-0.5 bg-white/10 backdrop-blur-md rounded text-[8px] font-bold text-white border border-white/20">
                                                                {item.duration}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </>
                                    )}
                                </motion.article>
                            );
                        })}
                    </AnimatePresence>
                </div>

                {filteredItems.length > 6 && (
                    <div className="mt-12 text-center">
                        <Button
                            onClick={() => setShowAll(!showAll)}
                            className="gap-3 rounded-full bg-[#FB923C] text-white hover:bg-orange-500 font-black text-[10px] uppercase tracking-[0.2em] py-4 px-10 shadow-xl shadow-orange-500/30 active:scale-95 transition-all"
                        >
                            {showAll ? "Show Less" : "View All"}
                            {showAll ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </Button>
                    </div>
                )}
            </div>

            {/* Album Multi-Image Lightbox Modal */}
            <AnimatePresence>
                {selectedAlbum && currentAlbumPhotos.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] bg-black/95 flex flex-col items-center justify-between p-4 sm:p-6 backdrop-blur-xl"
                        onClick={() => setSelectedAlbum(null)}
                    >
                        {/* Top Bar: Title, Date, Photo Counter, Close */}
                        <div
                            className="w-full max-w-6xl flex items-center justify-between gap-4 py-2 z-20 text-white"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="min-w-0">
                                <h4 className="text-sm sm:text-base font-bold text-white truncate">
                                    {selectedAlbum.title}
                                </h4>
                                <div className="flex items-center gap-3 text-xs text-white/60 mt-0.5">
                                    {formatDate(selectedAlbum.date) && (
                                        <span className="flex items-center gap-1">
                                            <Calendar className="w-3 h-3" />
                                            {formatDate(selectedAlbum.date)}
                                        </span>
                                    )}
                                    <span>
                                        Photo {albumPhotoIndex + 1} of {currentAlbumPhotos.length}
                                    </span>
                                </div>
                            </div>

                            <button
                                onClick={() => setSelectedAlbum(null)}
                                className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all hover:rotate-90 shrink-0 cursor-pointer"
                                aria-label="Close Gallery"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Main Image Display with Prev/Next Controls */}
                        <div
                            className="relative flex-1 w-full max-w-6xl flex items-center justify-center my-3 min-h-0"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {currentAlbumPhotos.length > 1 && (
                                <button
                                    className="absolute left-2 sm:left-4 z-20 w-11 h-11 sm:w-12 sm:h-12 bg-black/60 hover:bg-white/20 text-white rounded-full flex items-center justify-center transition-all backdrop-blur-md cursor-pointer border border-white/10"
                                    onClick={prevPhoto}
                                    aria-label="Previous Photo"
                                >
                                    <ChevronLeft className="w-6 h-6" />
                                </button>
                            )}

                            <motion.img
                                key={currentAlbumPhotos[albumPhotoIndex]}
                                initial={{ opacity: 0, scale: 0.96 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.25 }}
                                src={currentAlbumPhotos[albumPhotoIndex]}
                                alt={`${selectedAlbum.title} - ${albumPhotoIndex + 1}`}
                                className="max-w-full max-h-[68vh] object-contain rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.8)] border border-white/10 select-none"
                            />

                            {currentAlbumPhotos.length > 1 && (
                                <button
                                    className="absolute right-2 sm:right-4 z-20 w-11 h-11 sm:w-12 sm:h-12 bg-black/60 hover:bg-white/20 text-white rounded-full flex items-center justify-center transition-all backdrop-blur-md cursor-pointer border border-white/10"
                                    onClick={nextPhoto}
                                    aria-label="Next Photo"
                                >
                                    <ChevronRight className="w-6 h-6" />
                                </button>
                            )}
                        </div>

                        {/* Bottom Thumbnail Strip (When album has multiple photos) */}
                        {currentAlbumPhotos.length > 1 && (
                            <div
                                className="w-full max-w-4xl py-2 flex items-center justify-center gap-2 overflow-x-auto z-20 scrollbar-none px-2"
                                onClick={(e) => e.stopPropagation()}
                            >
                                {currentAlbumPhotos.map((photoUrl, pIdx) => (
                                    <button
                                        key={pIdx}
                                        type="button"
                                        onClick={() => setAlbumPhotoIndex(pIdx)}
                                        className={`w-14 h-14 sm:w-16 sm:h-16 rounded-xl overflow-hidden shrink-0 transition-all border-2 cursor-pointer ${
                                            pIdx === albumPhotoIndex
                                                ? 'border-blue-500 scale-105 shadow-md ring-2 ring-blue-500/50'
                                                : 'border-white/20 opacity-50 hover:opacity-100 hover:border-white/50'
                                        }`}
                                    >
                                        <img
                                            src={photoUrl}
                                            alt={`Thumbnail ${pIdx + 1}`}
                                            className="w-full h-full object-cover"
                                        />
                                    </button>
                                ))}
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
};

export default GallerySection;

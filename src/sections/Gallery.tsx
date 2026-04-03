import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, ChevronDown, ChevronUp, ZoomIn, Play } from "lucide-react";
import Button from "../components/Button";

type GalleryItem = {
    id: number;
    type: 'photo' | 'video';
    url: string;
    title: string;
    videoUrl?: string;
    duration?: string;
};

const hospitalGalleryItems: GalleryItem[] = [
    { id: 1, type: 'photo', url: "/hospital-1.png", title: "Hospital Exterior" },
    { id: 2, type: 'photo', url: "/hospital-2.png", title: "Reception Area" },
    { id: 3, type: 'photo', url: "/hospital-3.png", title: "Patient Ward" },
    { id: 4, type: 'photo', url: "/hospital-4.png", title: "Operation Theatre" },
    { id: 5, type: 'photo', url: "/hospital-5.png", title: "Advanced Laboratory" },
    { id: 6, type: 'photo', url: "/hospital-6.png", title: "ICU Department" },
    { id: 7, type: 'photo', url: "/hospital-7.png", title: "Hospital Building" },
    { id: 8, type: 'photo', url: "/hospital-8.png", title: "Emergency Room" },
    { id: 9, type: 'photo', url: "https://images.unsplash.com/photo-1516574187841-cb9cc2ca948b?auto=format&fit=crop&q=80&w=1500", title: "Maternal Health Workshop" },
    { id: 10, type: 'photo', url: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=1500", title: "World Heart Day Seminar" },
    { id: 11, type: 'photo', url: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=1500", title: "New Cardiology Wing" },
    { id: 12, type: 'photo', url: "https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&q=80&w=1500", title: "Dental Check-up Camp" },
];

const GallerySection = () => {
    const [filter] = useState<'all' | 'photo' | 'video'>('all');
    const [index, setIndex] = useState(0);
    const [isOpen, setIsOpen] = useState(false);
    const [showAll, setShowAll] = useState(false);
    const [activeVideoId, setActiveVideoId] = useState<number | null>(null);

    const filteredItems = hospitalGalleryItems.filter(item => filter === 'all' || item.type === filter);
    const displayedItems = showAll ? filteredItems : filteredItems.slice(0, 6);

    const nextImage = (e?: React.MouseEvent) => {
        e?.stopPropagation();
        setIndex((prev) => (prev + 1) % filteredItems.length);
    };

    const prevImage = (e?: React.MouseEvent) => {
        e?.stopPropagation();
        setIndex((prev) => (prev - 1 + filteredItems.length) % filteredItems.length);
    };

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
                        {displayedItems.map((item, idx) => (
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
                                        setIndex(idx);
                                        setIsOpen(true);
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
                                        <div className="absolute inset-0 bg-blue-900/30 group-hover:bg-blue-900/10 transition-colors duration-500" />

                                        <div className="absolute inset-0 flex items-center justify-center">
                                            {item.type === 'video' ? (
                                                <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform duration-500">
                                                    <Play className="w-6 h-6 text-white fill-white ml-0.5" />
                                                </div>
                                            ) : (
                                                <div className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transform scale-50 group-hover:scale-100 transition-all duration-300 shadow-lg">
                                                    <ZoomIn className="w-5 h-5 text-blue-900" />
                                                </div>
                                            )}
                                        </div>

                                        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-6">
                                            <div className="flex items-center justify-between gap-4">
                                                <h3 className="text-white font-black text-xs uppercase tracking-widest">
                                                    {item.title}
                                                </h3>
                                                {item.duration && (
                                                    <span className="px-2 py-0.5 bg-white/10 backdrop-blur-md rounded text-[8px] font-bold text-white border border-white/20">
                                                        {item.duration}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </>
                                )}
                            </motion.article>
                        ))}
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

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] bg-blue-950/98 flex items-center justify-center p-4 backdrop-blur-xl"
                        onClick={() => setIsOpen(false)}
                    >
                        <button className="absolute top-8 right-8 text-white/50 hover:text-white hover:rotate-90 transition-all duration-300">
                            <X className="w-10 h-10" />
                        </button>

                        <button
                            className="absolute left-6 md:left-12 text-white/30 hover:text-white transition-all p-4 bg-white/5 hover:bg-white/10 rounded-full"
                            onClick={prevImage}
                        >
                            <ChevronLeft className="w-10 h-10" />
                        </button>

                        <motion.img
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            src={filteredItems[index].url}
                            alt={filteredItems[index].title}
                            className="max-w-[90vw] max-h-[80vh] object-contain rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.5)] border border-white/10"
                            onClick={(e) => e.stopPropagation()}
                        />

                        <button
                            className="absolute right-6 md:right-12 text-white/30 hover:text-white transition-all p-4 bg-white/5 hover:bg-white/10 rounded-full"
                            onClick={nextImage}
                        >
                            <ChevronRight className="w-10 h-10" />
                        </button>

                        <div className="absolute bottom-10 left-0 right-0 text-center">
                            <h4 className="text-white text-sm font-black tracking-widest uppercase mb-2">
                                {filteredItems[index].title}
                            </h4>
                            <p className="text-white/40 text-[10px] font-bold uppercase tracking-[0.3em]">
                                {index + 1} OF {filteredItems.length}
                            </p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
};

export default GallerySection;

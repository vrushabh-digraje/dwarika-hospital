import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Download,
    FileText,
    FlaskConical,
    HeartPulse,
    Star,
    ArrowRight,
    Search,
    X,
    Loader2,
} from "lucide-react";

/* ─── DATA ──────────────────────────────────────── */
const downloadItems = [
    {
        title: "Research Publication: Community Health Trends 2025",
        type: "Research",
        size: "2.1 MB",
        icon: FlaskConical,
        url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
        filename: "Community_Health_Trends_2025.pdf",
    },
    {
        title: "Journal: Clinical Excellence Volume 12",
        type: "Download",
        size: "4.8 MB",
        icon: Star,
        url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
        filename: "Clinical_Excellence_Vol12.pdf",
    },
    {
        title: "Case Study: Advanced Cardiac Treatments",
        type: "Download",
        size: "1.9 MB",
        icon: HeartPulse,
        url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
        filename: "Cardiac_Treatments_CaseStudy.pdf",
    },
    {
        title: "Annual Research Review 2025-26",
        type: "Research",
        size: "5.4 MB",
        icon: FileText,
        url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
        filename: "Research_Review_2026.pdf",
    },
];

const DownloadPage = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [activeFilter, setActiveFilter] = useState("All");
    const [isDownloading, setIsDownloading] = useState(false);
    const [previewingDoc, setPreviewingDoc] = useState<(typeof downloadItems)[0] | null>(null);

    const filteredItems = downloadItems.filter(item => {
        const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesFilter = activeFilter === "All" || item.type === activeFilter;
        return matchesSearch && matchesFilter;
    });

    const handleDownloadAll = async () => {
        setIsDownloading(true);
        const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

        for (let i = 0; i < filteredItems.length; i++) {
            const item = filteredItems[i];
            const link = document.createElement('a');
            link.href = item.url;
            link.download = item.filename;
            link.target = '_blank';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            // Wait 1 second between downloads to prevent browser blocking
            if (i < filteredItems.length - 1) {
                await delay(1000);
            }
        }
        setIsDownloading(false);
    };

    return (
        <section className="min-h-screen bg-[#F8FAFC]">
            {/* ── HERO SECTION ── */}
            <div className="relative bg-gradient-to-br from-[#0A1A4E] via-[#1E3A8A] to-[#1E40AF] py-20 overflow-hidden">
                <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl -mr-48 -mt-48" />
                <div className="absolute bottom-0 left-0 w-72 h-72 bg-orange-500/10 rounded-full blur-3xl -ml-36 -mb-36" />

                <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <h1 className="text-4xl md:text-6xl font-black text-white mb-6 uppercase tracking-tight drop-shadow-[0_4px_12px_rgba(0,0,0,0.5)]">
                            <span className="text-white brightness-125">Research & </span><span className="text-[#FB923C] drop-shadow-sm">Downloads</span>
                        </h1>
                        <p className="text-white brightness-110 max-w-2xl mx-auto text-lg leading-relaxed drop-shadow-sm">
                            Access our complete library of medical research, clinical journals, case studies, and academic resources.
                        </p>
                    </motion.div>
                </div>
            </div>

            {/* ── SEARCH & FILTER ── */}
            <div className="max-w-7xl mx-auto px-6 -mt-10 relative z-20">
                <div className="bg-white rounded-3xl shadow-xl shadow-blue-900/5 p-4 md:p-6 border border-gray-100">
                    <div className="flex flex-col md:flex-row gap-4 items-center">
                        <div className="relative flex-1 w-full">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search publications, reports..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-600/20 text-gray-700 font-medium transition-all placeholder:text-gray-500"
                            />
                        </div>
                        <div className="flex flex-wrap items-center gap-2 p-1 bg-gray-50 rounded-2xl w-full md:w-auto">
                            {["All", "Research", "Download"].map((filter) => (
                                <button
                                    key={filter}
                                    onClick={() => setActiveFilter(filter)}
                                    className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all cursor-pointer ${activeFilter === filter
                                        ? "bg-white text-[#1E3A8A] shadow-md"
                                        : "text-gray-500 hover:text-gray-700"
                                        }`}
                                >
                                    {filter}
                                </button>
                            ))}
                            <div className="h-8 w-px bg-gray-200 mx-1 hidden md:block" />
                            <button
                                onClick={handleDownloadAll}
                                disabled={filteredItems.length === 0 || isDownloading}
                                className="flex-1 md:flex-none px-6 py-2.5 bg-[#1E3A8A] hover:bg-blue-800 text-white rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-900/10 disabled:opacity-50 disabled:cursor-not-allowed group cursor-pointer"
                            >
                                {isDownloading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4 group-hover:animate-bounce" />}
                                {isDownloading ? "Downloading..." : "Download All"}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── CONTENT GRID ── */}
            <div className="max-w-7xl mx-auto px-6 py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {filteredItems.length > 0 ? (
                        filteredItems.map((item, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 15 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.05 }}
                                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                                className="group flex items-center gap-5 bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-blue-900/10 transition-all"
                            >
                                <div onClick={() => setPreviewingDoc(item)} className="flex-1 flex items-center gap-5 cursor-pointer min-w-0">
                                    <div className="w-16 h-16 rounded-2xl bg-[#F0F4FF] group-hover:bg-[#FB923C]/10 flex items-center justify-center shrink-0 transition-colors">
                                        <item.icon className="w-8 h-8 text-[#1E3A8A] group-hover:text-[#FB923C] transition-colors" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="text-gray-900 font-black text-lg group-hover:text-[#1E3A8A] transition-colors truncate mb-1">
                                            {item.title}
                                        </h3>
                                        <div className="flex items-center gap-3">
                                            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${item.type === "Research" ? "bg-purple-100 text-purple-700" : "bg-emerald-100 text-emerald-700"}`}>
                                                {item.type}
                                            </span>
                                            <span className="text-gray-400 text-xs font-bold uppercase tracking-widest">{item.size}</span>
                                        </div>
                                    </div>
                                </div>
                                <a
                                    href={item.url}
                                    download={item.filename}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    onClick={(e) => e.stopPropagation()}
                                    className="w-12 h-12 rounded-full bg-gray-50 group-hover:bg-[#1E3A8A] flex items-center justify-center shrink-0 transition-all duration-300"
                                >
                                    <Download className="w-5 h-5 text-gray-400 group-hover:text-white transition-transform group-hover:translate-y-0.5" />
                                </a>
                            </motion.div>
                        ))
                    ) : (
                        <div className="col-span-full py-20 text-center">
                            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Search className="w-10 h-10 text-gray-300" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-600">No documents found</h3>
                            <p className="text-gray-400 mt-1">Try adjusting your search or filters.</p>
                        </div>
                    )}
                </div>

                {/* ── FOOTER STATS ── */}
                <div className="mt-16 bg-white rounded-3xl p-8 border border-gray-100 grid grid-cols-2 md:grid-cols-4 gap-8">
                    {[
                        { label: "Total Documents", value: "4" },
                        { label: "Research Papers", value: "50+" },
                        { label: "Free Access", value: "100%" },
                        { label: "Updated Weekly", value: "Live" },
                    ].map((s, i) => (
                        <div key={i} className="text-center md:border-r border-gray-100 last:border-0">
                            <p className="text-3xl font-black text-[#1E3A8A] mb-1">{s.value}</p>
                            <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">{s.label}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* PDF Preview Modal */}
            <AnimatePresence>
                {previewingDoc && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
                        onClick={() => setPreviewingDoc(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            transition={{ type: "spring", damping: 25, stiffness: 300 }}
                            className="relative bg-gray-100 rounded-2xl w-full max-w-4xl h-[90vh] flex flex-col overflow-hidden shadow-2xl"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Header */}
                            <div className="flex items-center justify-between p-4 bg-white border-b border-gray-200 shrink-0">
                                <h3 className="font-bold text-gray-800 truncate pr-8">{previewingDoc.title}</h3>
                                <button onClick={() => setPreviewingDoc(null)} className="p-2 rounded-full hover:bg-gray-100 text-gray-500 hover:text-gray-800 transition-colors">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                            {/* PDF Viewer */}
                            <div className="flex-1 bg-gray-200">
                                <iframe src={`${previewingDoc.url}#toolbar=0`} width="100%" height="100%" title={previewingDoc.title} />
                            </div>
                            {/* Footer */}
                            <div className="flex items-center justify-end p-4 bg-white border-t border-gray-200 shrink-0">
                                <a href={previewingDoc.url} download={previewingDoc.filename} className="flex items-center justify-center gap-2 px-6 py-2.5 bg-[#1E3A8A] hover:bg-blue-800 text-white rounded-xl text-sm font-bold transition-all shadow-lg shadow-blue-900/10">
                                    <Download className="w-4 h-4" />
                                    Download PDF
                                </a>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ── CTA ── */}
            <div className="bg-[#1E3A8A] py-16 text-center">
                <div className="max-w-3xl mx-auto px-6">
                    <h2 className="text-3xl font-black text-white mb-4">Can't Find Something?</h2>
                    <p className="text-blue-200 mb-8 leading-relaxed">
                        If you are looking for a specific research paper or institutional document not listed here, please contact our academic department.
                    </p>
                    <button className="bg-[#FB923C] hover:bg-orange-500 text-white font-black px-10 py-4 rounded-full shadow-lg shadow-orange-500/20 transition-all flex items-center gap-2 mx-auto uppercase tracking-wide cursor-pointer">
                        Contact Academic Team <ArrowRight className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </section>
    );
};

export default DownloadPage;

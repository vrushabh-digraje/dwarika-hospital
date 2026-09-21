import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, User, Search, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cmsPublic } from '../lib/cmsClient';
import { useCmsQuery } from '../hooks/useCmsQuery';

const BlogPage = () => {
    const navigate = useNavigate();
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [searchQuery, setSearchQuery] = useState("");
    const { data } = useCmsQuery(() => cmsPublic.blogs(), []);

    const allBlogs = useMemo(
        () =>
            (data?.items || []).map((blog: any) => ({
                id: blog.slug || blog._id,
                title: blog.title,
                category: blog.category || 'General',
                excerpt: blog.excerpt || blog.description || '',
                author: blog.author || '',
                date: blog.date ? new Date(blog.date).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }) : '',
                image: blog.imageUrl || blog.image || '',
            })),
        [data]
    );

    const categories = useMemo(
        () => ["All", ...Array.from(new Set(allBlogs.map((b) => b.category)))],
        [allBlogs]
    );

    const filteredBlogs = allBlogs.filter(blog => {
        const matchesCategory = selectedCategory === "All" || blog.category === selectedCategory;
        const matchesSearch = blog.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                             blog.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    return (
        <div className="min-h-screen bg-white">
            {/* Header Section */}
            <div className="bg-blue-950 text-white py-24 px-6 relative overflow-hidden">
                <div className="absolute inset-0 z-0 opacity-10 bg-[url('https://images.unsplash.com/photo-1576091160550-217359f4ecf8?auto=format&fit=crop&q=80&w=2000')] bg-cover bg-center"></div>
                <div className="max-w-7xl mx-auto relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-6 text-center"
                    >
                        <span className="inline-block px-4 py-1.5 rounded-full bg-blue-900/50 text-blue-300 text-[10px] font-black uppercase tracking-[0.3em] backdrop-blur-md border border-blue-800/50">
                            Our Knowledge Base
                        </span>
                        <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tight leading-tight">
                            Hospital <span className="text-blue-500">Blogs</span> <br /> & Health Tips
                        </h1>
                        <p className="text-lg md:text-xl text-blue-100/80 max-w-2xl mx-auto font-medium">
                            Expert advice, medical insights, and wellness tips from the leading healthcare professionals at Dwarika Hospital.
                        </p>
                    </motion.div>
                </div>
            </div>

            {/* Filter & Search Bar */}
            <div className="sticky top-[80px] z-40 bg-white border-b border-gray-100 shadow-sm">
                <div className="max-w-7xl mx-auto px-6 py-4">
                    <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
                        {/* Categories */}
                        <div className="flex items-center gap-2 overflow-x-auto pb-2 lg:pb-0 w-full lg:w-auto no-scrollbar">
                            {categories.map((cat) => (
                                <button
                                    key={cat}
                                    onClick={() => setSelectedCategory(cat)}
                                    className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                                        selectedCategory === cat
                                            ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                                            : 'bg-gray-50 text-gray-400 hover:bg-gray-100 hover:text-gray-900 border border-gray-100'
                                    }`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>

                        {/* Search */}
                        <div className="relative w-full lg:w-96">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search articles..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-600/20 text-sm font-medium"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Blog Grid */}
            <div className="max-w-7xl mx-auto px-6 py-20">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                    <AnimatePresence mode='popLayout'>
                        {filteredBlogs.length > 0 ? (
                            filteredBlogs.map((blog, index) => (
                                <motion.div
                                    key={blog.id}
                                    layout
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    transition={{ duration: 0.4, delay: index * 0.05 }}
                                    onClick={() => navigate(`/blog/${blog.id}`)}
                                    className="group flex flex-col bg-white rounded-[2.5rem] overflow-hidden border border-gray-100 hover:border-blue-100 transition-all duration-500 hover:shadow-[0_20px_50px_rgba(30,58,138,0.1)] hover:-translate-y-2 cursor-pointer"
                                >
                                    <div className="relative h-72 overflow-hidden">
                                        <img
                                            src={blog.image}
                                            alt={blog.title}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-blue-950/60 to-transparent"></div>
                                        <div className="absolute top-6 left-6">
                                            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/90 backdrop-blur-md text-blue-950 text-[10px] font-black uppercase tracking-widest shadow-lg">
                                                {blog.category}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="p-10 flex flex-col flex-grow">
                                        <div className="flex items-center gap-4 mb-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                            <div className="flex items-center gap-1.5">
                                                <Calendar className="w-3.5 h-3.5" />
                                                {blog.date}
                                            </div>
                                            <div className="w-1 h-1 rounded-full bg-gray-300"></div>
                                            <div className="flex items-center gap-1.5">
                                                <User className="w-3.5 h-3.5" />
                                                {blog.author}
                                            </div>
                                        </div>
                                        <h3 className="text-2xl font-black text-blue-950 group-hover:text-blue-600 transition-colors mb-4 leading-tight">
                                            {blog.title}
                                        </h3>
                                        <p className="text-gray-500 text-sm leading-relaxed mb-8 line-clamp-3">
                                            {blog.excerpt}
                                        </p>
                                        <div className="mt-auto pt-6 border-t border-gray-100">
                                            <div className="group/btn flex items-center justify-between w-full text-blue-950 font-black text-xs uppercase tracking-widest">
                                                Read Full Article
                                                <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center group-hover/btn:bg-blue-600 group-hover/btn:text-white transition-all duration-300">
                                                    <ArrowRight className="w-4 h-4" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))
                        ) : (
                            <div className="col-span-full py-20 text-center">
                                <Search className="w-16 h-16 text-gray-200 mx-auto mb-6" />
                                <h3 className="text-2xl font-black text-blue-950 mb-2">No blogs found</h3>
                                <p className="text-gray-500">Try adjusting your search or category filters.</p>
                            </div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* Newsletter Section */}
            <div className="bg-blue-900 py-20 px-6">
                <div className="max-w-4xl mx-auto text-center space-y-8">
                    <h2 className="text-3xl md:text-4xl font-black text-white uppercase tracking-tight">Stay updated with <br /> medical breakthroughs</h2>
                    <p className="text-blue-100/70 max-w-xl mx-auto font-medium">Subscribe to our monthly newsletter for the latest health tips and hospital updates.</p>
                    <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                        <input
                            type="email"
                            placeholder="Enter your email"
                            className="flex-1 px-6 py-4 bg-white/10 border border-white/20 rounded-2xl text-white placeholder:text-blue-100/40 focus:outline-none focus:ring-2 focus:ring-white/20"
                        />
                        <button className="px-8 py-4 bg-white text-blue-900 font-black text-xs uppercase tracking-widest rounded-2xl hover:bg-orange-400 hover:text-white transition-all duration-300">
                            Subscribe
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BlogPage;

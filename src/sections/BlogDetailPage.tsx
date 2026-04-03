import { useParams, useNavigate, Link } from 'react-router-dom';
import { BLOGS } from '../lib/blogData';
import { Calendar, ArrowLeft, Share2, Tag, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

const BlogDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const blog = BLOGS.find(b => b.id === Number(id));

    const relatedBlogs = blog
        ? BLOGS
            .filter(b => b.category === blog.category && b.id !== blog.id)
            .slice(0, 3)
        : BLOGS.slice(0, 3);

    if (!blog) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-6 text-center">
                <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mb-6">
                    <Tag className="w-10 h-10 text-blue-600" />
                </div>
                <h2 className="text-3xl font-black text-blue-950 mb-4 uppercase tracking-tight">Article Not Found</h2>
                <p className="text-gray-500 mb-8 max-w-sm">The health tip or expert insight you are looking for might have been moved or removed.</p>
                <button 
                    onClick={() => navigate('/blogs')}
                    className="px-8 py-4 bg-blue-600 text-white font-black text-xs uppercase tracking-widest rounded-2xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20"
                >
                    Back to Blogs
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white">
            {/* Progress Bar */}
            <motion.div 
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                className="fixed top-0 left-0 right-0 h-1 bg-blue-600 origin-left z-50"
            />

            <div className="max-w-4xl mx-auto px-6 pt-32 pb-24">
                {/* Back Button */}
                <motion.button
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    onClick={() => navigate(-1)}
                    className="group mb-12 flex items-center gap-3 text-xs font-black text-gray-400 uppercase tracking-widest hover:text-blue-600 transition-colors"
                >
                    <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-blue-50 transition-colors">
                        <ArrowLeft className="w-4 h-4" />
                    </div>
                    Back to Feed
                </motion.button>

                {/* Hero Header */}
                <div className="space-y-8 mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center gap-4"
                    >
                        <span className="px-4 py-1.5 rounded-full bg-blue-50 text-blue-600 text-[10px] font-black uppercase tracking-widest border border-blue-100">
                            {blog.category}
                        </span>
                        <div className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                            <Clock className="w-3.5 h-3.5" />
                            5 Min Read
                        </div>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl md:text-6xl font-black text-blue-950 uppercase tracking-tight leading-[1.1]"
                    >
                        {blog.title}
                    </motion.h1>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="flex flex-wrap items-center gap-8 py-8 border-y border-gray-100"
                    >
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center text-white font-black text-lg">
                                {blog.author.split(' ').pop()?.charAt(0)}
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-0.5">Written by</p>
                                <p className="text-sm font-black text-blue-950 uppercase tracking-tight">{blog.author}</p>
                            </div>
                        </div>
                        <div className="h-10 w-px bg-gray-100 hidden sm:block"></div>
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center text-blue-600">
                                <Calendar className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-0.5">Published on</p>
                                <p className="text-sm font-black text-blue-950 uppercase tracking-tight">
                                    {new Date(blog.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                                </p>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Featured Image */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 }}
                    className="relative h-[500px] rounded-[3rem] overflow-hidden mb-16 shadow-2xl shadow-blue-900/10"
                >
                    <img src={blog.image} alt={blog.title} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-blue-950/20 to-transparent" />
                </motion.div>

                {/* Content */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
                    <div className="lg:col-span-8">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.4 }}
                            className="prose prose-lg max-w-none"
                        >
                            <p className="text-2xl font-bold text-blue-900 mb-12 leading-relaxed tracking-tight">
                                {blog.description}
                            </p>
                            <div className="text-gray-600 text-lg leading-[1.8] whitespace-pre-line space-y-6">
                                {blog.fullContent}
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.5 }}
                            className="mt-16 p-8 rounded-[2rem] bg-gray-50 border border-gray-100 flex flex-col md:flex-row items-center justify-between gap-6"
                        >
                            <div className="flex items-center gap-4 text-sm font-black text-blue-900 uppercase tracking-widest">
                                <Share2 className="w-5 h-5" />
                                Share this health insight
                            </div>
                            <div className="flex gap-3">
                                {['Twitter', 'Facebook', 'LinkedIn'].map((platform) => (
                                    <button 
                                        key={platform}
                                        className="px-6 py-3 rounded-xl bg-white text-[10px] font-black uppercase tracking-widest text-gray-500 hover:bg-blue-600 hover:text-white transition-all shadow-sm"
                                    >
                                        {platform}
                                    </button>
                                ))}
                            </div>
                        </motion.div>
                    </div>

                    {/* Sidebar / Related */}
                    <div className="lg:col-span-4 space-y-12">
                        <div className="sticky top-32">
                            <h2 className="text-xl font-black text-blue-950 uppercase tracking-tight mb-8">Related Articles</h2>
                            <div className="space-y-8">
                                {relatedBlogs.map((related) => (
                                    <Link 
                                        key={related.id}
                                        to={`/blog/${related.id}`}
                                        className="group block space-y-4"
                                    >
                                        <div className="relative h-48 rounded-3xl overflow-hidden">
                                            <img src={related.image} alt={related.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                                            <div className="absolute inset-0 bg-blue-950/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                                        </div>
                                        <div>
                                            <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-2 block">
                                                {related.category}
                                            </span>
                                            <h3 className="text-lg font-black text-blue-950 group-hover:text-blue-600 transition-colors leading-tight line-clamp-2">
                                                {related.title}
                                            </h3>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BlogDetailPage;

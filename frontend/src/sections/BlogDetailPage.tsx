import { useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Calendar, ArrowLeft, Tag, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import { cmsPublic } from '../lib/cmsClient';
import { useCmsQuery } from '../hooks/useCmsQuery';

const BlogDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { data: blogRaw, loading } = useCmsQuery(
        () => cmsPublic.blog(String(id)),
        [id]
    );
    const { data: listData } = useCmsQuery(() => cmsPublic.blogs(), []);

    const blog = useMemo(() => {
        if (!blogRaw) return null;
        return {
            id: blogRaw.slug || blogRaw._id,
            title: blogRaw.title,
            category: blogRaw.category || 'General',
            description: blogRaw.description || blogRaw.excerpt || '',
            fullContent: blogRaw.fullContent || '',
            author: blogRaw.author || 'Dwarika Hospital',
            date: blogRaw.date || blogRaw.publishedAt || blogRaw.createdAt,
            image: blogRaw.imageUrl || '',
        };
    }, [blogRaw]);

    const relatedBlogs = useMemo(() => {
        const items = (listData?.items || [])
            .filter((b: any) => (b.slug || b._id) !== blog?.id)
            .filter((b: any) => !blog || b.category === blog.category)
            .slice(0, 3);
        return items.map((b: any) => ({
            id: b.slug || b._id,
            title: b.title,
            image: b.imageUrl || '',
            category: b.category,
        }));
    }, [listData, blog]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white">
                <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

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

    const isHtml = /<\/?[a-z][\s\S]*>/i.test(blog.fullContent);

    return (
        <div className="min-h-screen bg-white">
            <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                className="fixed top-0 left-0 right-0 h-1 bg-blue-600 origin-left z-50"
            />

            <div className="max-w-4xl mx-auto px-6 pt-32 pb-24">
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

                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 }}
                    className="relative h-[500px] rounded-[3rem] overflow-hidden mb-16 shadow-2xl shadow-blue-900/10"
                >
                    <img src={blog.image} alt={blog.title} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-blue-950/20 to-transparent" />
                </motion.div>

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
                            {isHtml ? (
                                <div
                                    className="text-gray-600 text-lg leading-[1.8] space-y-6"
                                    dangerouslySetInnerHTML={{ __html: blog.fullContent }}
                                />
                            ) : (
                                <div className="text-gray-600 text-lg leading-[1.8] whitespace-pre-line space-y-6">
                                    {blog.fullContent}
                                </div>
                            )}
                        </motion.div>
                    </div>

                    <aside className="lg:col-span-4 space-y-6">
                        <h3 className="text-sm font-black uppercase tracking-widest text-blue-950">Related</h3>
                        {relatedBlogs.map((item) => (
                            <button
                                key={item.id}
                                type="button"
                                onClick={() => navigate(`/blog/${item.id}`)}
                                className="w-full text-left rounded-2xl overflow-hidden border border-gray-100 hover:shadow-lg transition-all"
                            >
                                {item.image ? (
                                    <img src={item.image} alt={item.title} className="h-32 w-full object-cover" />
                                ) : null}
                                <div className="p-4">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-blue-600 mb-1">{item.category}</p>
                                    <p className="text-sm font-bold text-blue-950">{item.title}</p>
                                </div>
                            </button>
                        ))}
                    </aside>
                </div>
            </div>
        </div>
    );
};

export default BlogDetailPage;

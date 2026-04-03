import { useParams, useNavigate, Link } from 'react-router-dom';
import { articles } from './NewsAndEvents';
import { Calendar, ArrowLeft, Share2 } from 'lucide-react';
import Button from '../components/Button';
import { motion } from 'framer-motion';

const NewsDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const article = articles.find(a => a.id === Number(id));

    const relatedArticles = article
        ? articles
            .filter(a => a.type === article.type && a.id !== article.id)
            .slice(0, 3)
        : [];

    if (!article) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
                <h2 className="text-2xl font-black text-blue-900 mb-4">Article Not Found</h2>
                <Button onClick={() => navigate('/')}>Back to Home</Button>
            </div>
        );
    }

    const typeColors: Record<string, string> = {
        News: 'bg-blue-600',
        Event: 'bg-red-600',
        Result: 'bg-emerald-600',
        Admission: 'bg-blue-800',
        Notice: 'bg-orange-600',
        Scholarship: 'bg-purple-600',
    };

    const typeColor = typeColors[article.type] || 'bg-gray-600';

    return (
        <div className="min-h-screen bg-white pt-20 pb-20">
            <div className="max-w-4xl mx-auto px-6">
                <Button
                    variant="ghost"
                    onClick={() => navigate(-1)}
                    className="mb-8 pl-0 hover:bg-transparent hover:text-blue-600 text-gray-500 flex items-center gap-2"
                >
                    <ArrowLeft className="w-4 h-4" /> Back
                </Button>

                <div className="relative h-[400px] rounded-3xl overflow-hidden mb-10 shadow-xl">
                    <img src={article.image} alt={article.title} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-8 left-8 right-8 text-white">
                        <div className={`inline-block px-3 py-1 text-xs font-bold rounded-full shadow-md mb-4 ${typeColor}`}>
                            {article.type}
                        </div>
                        <h1 className="text-3xl md:text-4xl lg:text-5xl font-black leading-tight mb-4">
                            {article.title}
                        </h1>
                        <div className="flex items-center gap-4 text-sm font-medium text-white/90">
                            <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4" />
                                <span>{new Date(article.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed">
                    <p className="text-xl font-medium text-blue-900 mb-8 border-l-4 border-red-600 pl-4">
                        {article.description}
                    </p>
                    <div className="whitespace-pre-line">
                        {article.fullContent}
                    </div>
                </div>

                <div className="mt-12 pt-8 border-t border-gray-100 flex justify-between items-center">
                    <p className="text-sm font-bold text-gray-500 uppercase tracking-wider">Share this article</p>
                    <button 
                        onClick={() => navigator.share?.({ title: article.title, text: article.description, url: window.location.href }).catch(() => {})}
                        className="p-3 rounded-full bg-gray-100 hover:bg-blue-50 text-blue-900 transition-colors"
                    >
                        <Share2 className="w-5 h-5" />
                    </button>
                </div>

                {relatedArticles.length > 0 && (
                    <div className="mt-20 pt-12 border-t border-gray-100">
                        <h2 className="text-3xl font-black text-blue-900 mb-8">
                            Related {article.type === 'News' ? 'News' : 'Events'}
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {relatedArticles.map((related, index) => (
                                <motion.div
                                    key={related.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                >
                                    <Link to={`/news/${related.id}`} className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl overflow-hidden border border-gray-100 flex flex-col transition-all duration-300 hover:-translate-y-2 h-full">
                                        <div className="relative h-40 overflow-hidden">
                                            <img
                                                src={related.image}
                                                alt={related.title}
                                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                            />
                                            <div className={`absolute top-3 right-3 px-2 py-0.5 text-[10px] font-bold text-white rounded-full shadow-md ${typeColors[related.type] || 'bg-gray-600'}`}>
                                                {related.type}
                                            </div>
                                        </div>
                                        <div className="p-4 flex flex-col flex-grow">
                                            <div className="flex items-center gap-2 text-gray-500 text-[10px] font-semibold mb-2">
                                                <Calendar className="w-3 h-3" />
                                                <span>{new Date(related.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                                            </div>
                                            <h3 className="text-sm font-black text-primary mb-2 leading-tight flex-grow line-clamp-2">{related.title}</h3>
                                        </div>
                                    </Link>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default NewsDetailPage;
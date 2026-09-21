import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';
import { cmsPublic } from '../lib/cmsClient';
import { useCmsQuery } from '../hooks/useCmsQuery';

const Testimonials = () => {
    const { data } = useCmsQuery(() => cmsPublic.testimonials(), []);
    const reviews = useMemo(
        () =>
            (data?.items || []).map((item: any) => ({
                name: item.name,
                role: item.role || 'Patient',
                content: item.content,
                rating: item.rating || 5,
            })),
        [data]
    );

    if (!reviews.length) return null;

    return (
        <section id="reviews" className="bg-white px-6 py-12 lg:py-20">
            <div className="max-w-7xl mx-auto">
                <div className="max-w-2xl mb-10 lg:mb-12">
                    <p className="text-primary font-semibold text-sm tracking-wide uppercase mb-4">Testimonials</p>
                    <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 tracking-tight leading-[1.1] mb-6">
                        What our <span className="text-primary">patients</span> say
                    </h2>
                    <p className="text-slate-500 text-lg leading-relaxed">
                        Our commitment to providing quality healthcare is reflected in the experiences of our recovered patients.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {reviews.map((review, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1, duration: 0.4 }}
                            className="bg-slate-50 rounded-2xl p-8 border border-slate-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
                        >
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
                                    <Quote className="w-5 h-5 text-white" />
                                </div>
                                <div className="flex gap-0.5">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} className={`w-4 h-4 ${i < review.rating ? 'fill-amber-400 text-amber-400' : 'fill-slate-200 text-slate-200'}`} />
                                    ))}
                                </div>
                            </div>

                            <p className="text-slate-600 leading-relaxed mb-8 text-[15px]">
                                "{review.content}"
                            </p>

                            <div className="flex items-center gap-3 pt-6 border-t border-slate-200/60">
                                <div className="w-10 h-10 bg-primary/10 flex items-center justify-center rounded-full text-primary font-bold text-sm">
                                    {review.name.charAt(0)}
                                </div>
                                <div>
                                    <h4 className="font-semibold text-slate-900 text-sm">{review.name}</h4>
                                    <p className="text-xs text-slate-500">{review.role}</p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Testimonials;

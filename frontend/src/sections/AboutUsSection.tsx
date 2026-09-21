import { motion } from 'framer-motion';
import { Goal, Binoculars, HeartHandshake } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const getAboutData = (t: any) => ({
    title: t('about.title'),
    tagline: t('about.tagline'),
    introduction: t('about.introduction'),
    sections: [
        {
            title: t('about.mission_title'),
            subtitle: t('about.mission_subtitle'),
            icon: Goal,
            text: t('about.mission_text'),
            image: "https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&q=80&w=1200",
        },
        {
            title: t('about.vision_title'),
            subtitle: t('about.vision_subtitle'),
            icon: Binoculars,
            text: t('about.vision_text'),
            image: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=1200",
        },
        {
            title: t('about.values_title'),
            subtitle: t('about.values_subtitle'),
            icon: HeartHandshake,
            text: t('about.values_text'),
            image: "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&q=80&w=1200",
        }
    ]
});

const AboutUsSection = () => {
    const { t } = useTranslation();
    const aboutData = getAboutData(t);

    return (
        <section id="about-overview" className="bg-white py-24 lg:py-32 px-6 overflow-hidden">
            <div className="max-w-7xl mx-auto">
                <div className="max-w-3xl mx-auto text-center mb-20 space-y-6">
                    <p className="text-primary font-semibold text-sm tracking-wide uppercase">
                        {aboutData.title}
                    </p>
                    <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 tracking-tight leading-[1.1]">
                        {aboutData.tagline}
                    </h2>
                    <p className="text-slate-500 text-lg leading-relaxed">
                        {aboutData.introduction}
                    </p>
                </div>

                <div className="space-y-20">
                    {aboutData.sections.map((section, index) => (
                        <motion.div
                            key={section.title}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.5 }}
                            className={`flex flex-col ${index % 2 === 1 ? 'lg:flex-row-reverse' : 'lg:flex-row'} items-center gap-12 lg:gap-16`}
                        >
                            <div className="flex-1 space-y-6">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-blue-50 text-primary rounded-xl flex items-center justify-center">
                                        <section.icon className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-0.5">{section.title}</p>
                                        <h3 className="text-2xl font-bold text-slate-900">{section.subtitle}</h3>
                                    </div>
                                </div>
                                <div className="w-10 h-1 bg-primary rounded-full" />
                                <p className="text-slate-500 text-lg leading-relaxed">
                                    {section.text}
                                </p>
                            </div>

                            <div className="flex-1 w-full">
                                <div className="relative group">
                                    <div className="aspect-[4/3] rounded-2xl overflow-hidden border border-slate-100 shadow-lg group-hover:shadow-xl transition-all duration-500 group-hover:-translate-y-1">
                                        <img
                                            src={section.image}
                                            alt={section.title}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                            loading="lazy"
                                        />
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default AboutUsSection;

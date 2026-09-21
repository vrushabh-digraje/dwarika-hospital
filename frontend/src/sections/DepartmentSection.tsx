import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ArrowRight, Activity } from "lucide-react";
import * as LucideIcons from "lucide-react";
import { useMemo } from "react";
import { cmsPublic } from '../lib/cmsClient';
import { useCmsQuery } from '../hooks/useCmsQuery';

const THEME_CLASSES: Record<string, { color: string; iconColor: string; accent: string }> = {
    red: { color: "bg-red-50", iconColor: "text-red-500", accent: "group-hover:border-red-200" },
    blue: { color: "bg-blue-50", iconColor: "text-blue-500", accent: "group-hover:border-blue-200" },
    sky: { color: "bg-sky-50", iconColor: "text-sky-500", accent: "group-hover:border-sky-200" },
    indigo: { color: "bg-indigo-50", iconColor: "text-indigo-500", accent: "group-hover:border-indigo-200" },
    pink: { color: "bg-pink-50", iconColor: "text-pink-500", accent: "group-hover:border-pink-200" },
    fuchsia: { color: "bg-fuchsia-50", iconColor: "text-fuchsia-500", accent: "group-hover:border-fuchsia-200" },
    amber: { color: "bg-amber-50", iconColor: "text-amber-500", accent: "group-hover:border-amber-200" },
    orange: { color: "bg-orange-50", iconColor: "text-orange-500", accent: "group-hover:border-orange-200" },
    cyan: { color: "bg-cyan-50", iconColor: "text-cyan-500", accent: "group-hover:border-cyan-200" },
    emerald: { color: "bg-emerald-50", iconColor: "text-emerald-500", accent: "group-hover:border-emerald-200" },
    violet: { color: "bg-violet-50", iconColor: "text-violet-500", accent: "group-hover:border-violet-200" },
    rose: { color: "bg-rose-50", iconColor: "text-rose-500", accent: "group-hover:border-rose-200" },
};

const DepartmentSection = () => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language;

  const { data: dbData } = useCmsQuery(() => cmsPublic.departments(), []);

  const departments = useMemo(() => {
    const items = dbData?.items || [];
    if (items.length === 0) {
      return [
        {
          icon: Activity,
          title: t('departments.list.emergency.title'),
          slug: "emergency",
          desc: t('departments.list.emergency.desc'),
          color: "bg-red-50",
          iconColor: "text-red-500",
          accent: "group-hover:border-red-200",
        }
      ];
    }

    const getIcon = (key: string) => {
        if (!key) return Activity;
        const normalized = key.charAt(0).toUpperCase() + key.slice(1);
        return (LucideIcons as any)[normalized] || (LucideIcons as any)[key] || Activity;
    };

    const sorted = [...items].sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));

    return sorted.map((d: any) => {
      const theme = THEME_CLASSES[String(d.colorTheme).toLowerCase()] || THEME_CLASSES.blue;
      return {
        icon: getIcon(d.iconKey),
        title: (currentLang === 'np' && d.titleNp) ? d.titleNp : d.title,
        slug: d.slug,
        desc: (currentLang === 'np' && d.shortDescNp) ? d.shortDescNp : (d.shortDesc || ''),
        ...theme
      };
    });
  }, [dbData, t, currentLang]);

  return (
    <section id="departments" className="px-4 sm:px-6 lg:px-8 py-10 lg:py-14 relative">
      <div className="home-band-inner premium-surface premium-tint rounded-[32px] lg:rounded-[40px] px-6 sm:px-8 lg:px-10 py-12 lg:py-16 max-w-7xl mx-auto">
        <div className="ambient-orb top-10 right-8 h-32 w-32 bg-primary/10" />
        <div className="ambient-orb bottom-10 left-8 h-28 w-28 bg-amber-300/20" />
        {/* Header */}
        <div className="max-w-2xl mb-10 lg:mb-12 section-intro relative z-10">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="section-label text-primary font-semibold text-sm tracking-wide uppercase"
          >
            {t('departments.section_title')}
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl lg:text-5xl font-bold text-slate-900 tracking-tight leading-[1.1] font-heading mb-6"
          >
            {t('departments.heading_part1')}
            <span className="text-primary">{t('departments.heading_part2')}</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-slate-600 text-lg leading-relaxed"
          >
            {t('departments.description')}
          </motion.p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 relative z-10">
          {departments.map((d, idx) => (
            <motion.div
              key={d.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.05 }}
              onClick={() => navigate(`/department/${d.slug}`)}
              className={`group relative soft-card rounded-[28px] p-7 cursor-pointer ${d.accent} transition-all duration-300 hover:-translate-y-1`}
            >
              <div className={`w-14 h-14 ${d.color} rounded-xl flex items-center justify-center ${d.iconColor} mb-5 transition-transform duration-300 group-hover:scale-110`}>
                <d.icon className="w-7 h-7" />
              </div>

              <h3 className="text-lg font-bold text-slate-900 mb-2 tracking-tight group-hover:text-primary transition-colors font-heading">
                {d.title}
              </h3>

              <p className="text-sm text-slate-500 leading-relaxed mb-5">
                {d.desc}
              </p>

              <div className="flex items-center gap-2 text-primary text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                {t('departments.learn_more')} <ArrowRight className="w-4 h-4" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default DepartmentSection;

import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  HeartPulse,
  Stethoscope,
  Baby,
  Brain,
  Bone,
  Activity,
  Syringe,
  Microscope,
  ArrowRight
} from "lucide-react";

const getDepartments = (t: any) => [
  {
    icon: HeartPulse,
    title: t('departments.list.cardiology.title'),
    slug: "cardiology",
    desc: t('departments.list.cardiology.desc'),
    color: "bg-rose-50",
    iconColor: "text-rose-500",
    accent: "group-hover:border-rose-200",
  },
  {
    icon: Brain,
    title: t('departments.list.neurology.title'),
    slug: "neurology",
    desc: t('departments.list.neurology.desc'),
    color: "bg-violet-50",
    iconColor: "text-violet-500",
    accent: "group-hover:border-violet-200",
  },
  {
    icon: Baby,
    title: t('departments.list.paediatrics.title'),
    slug: "paediatrics",
    desc: t('departments.list.paediatrics.desc'),
    color: "bg-pink-50",
    iconColor: "text-pink-500",
    accent: "group-hover:border-pink-200",
  },
  {
    icon: Bone,
    title: t('departments.list.orthopaedics.title'),
    slug: "orthopaedics",
    desc: t('departments.list.orthopaedics.desc'),
    color: "bg-amber-50",
    iconColor: "text-amber-500",
    accent: "group-hover:border-amber-200",
  },
  {
    icon: Activity,
    title: t('departments.list.emergency.title'),
    slug: "emergency",
    desc: t('departments.list.emergency.desc'),
    color: "bg-red-50",
    iconColor: "text-red-500",
    accent: "group-hover:border-red-200",
  },
  {
    icon: Microscope,
    title: t('departments.list.diagnostics.title'),
    slug: "diagnostics",
    desc: t('departments.list.diagnostics.desc'),
    color: "bg-emerald-50",
    iconColor: "text-emerald-500",
    accent: "group-hover:border-emerald-200",
  },
  {
    icon: Syringe,
    title: t('departments.list.gynae_obstetrics.title'),
    slug: "gynae-obstetrics",
    desc: t('departments.list.gynae_obstetrics.desc'),
    color: "bg-fuchsia-50",
    iconColor: "text-fuchsia-500",
    accent: "group-hover:border-fuchsia-200",
  },
  {
    icon: Stethoscope,
    title: t('departments.list.general_medicine.title'),
    slug: "general-medicine",
    desc: t('departments.list.general_medicine.desc'),
    color: "bg-sky-50",
    iconColor: "text-sky-500",
    accent: "group-hover:border-sky-200",
  },
];

const DepartmentSection = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const departments = getDepartments(t);

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

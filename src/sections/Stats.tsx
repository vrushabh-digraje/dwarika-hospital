import { useEffect, useRef } from 'react';
import { GraduationCap, Stethoscope, TrendingUp, HeartPulse } from 'lucide-react';
import { useInView, useMotionValue, useSpring } from 'framer-motion';
import { useTranslation } from 'react-i18next';

const getStats = (t: any) => [
    { icon: HeartPulse, value: "15k+", label: t('stats.patients'), color: "text-rose-500", bg: "bg-rose-50" },
    { icon: Stethoscope, value: "50+", label: t('stats.doctors'), color: "text-primary", bg: "bg-blue-50" },
    { icon: TrendingUp, value: "20+", label: t('stats.experience'), color: "text-amber-500", bg: "bg-amber-50" },
    { icon: GraduationCap, value: "10+", label: t('stats.academic'), color: "text-emerald-500", bg: "bg-emerald-50" },
];

const Counter = ({ value }: { value: string }) => {
    const ref = useRef<HTMLSpanElement>(null);
    const motionValue = useMotionValue(0);
    const springValue = useSpring(motionValue, { damping: 60, stiffness: 200 });
    const isInView = useInView(ref, { once: true, margin: "-20px" });

    useEffect(() => {
        if (isInView) {
            const numericValue = parseInt(value.replace(/[^0-9]/g, ''));
            if (!isNaN(numericValue)) motionValue.set(numericValue);
        }
    }, [isInView, value, motionValue]);

    useEffect(() => {
        return springValue.on("change", (latest) => {
            if (ref.current) {
                const suffix = value.replace(/[0-9]/g, '');
                ref.current.textContent = Math.floor(latest).toFixed(0) + suffix;
            }
        });
    }, [springValue, value]);

    const suffix = value.replace(/[0-9]/g, '');
    return <span ref={ref}>0{suffix}</span>;
};

const Stats = () => {
    const { t } = useTranslation();
    const stats = getStats(t);
    return (
        <section className="py-12 bg-white border-y border-slate-100">
            <div className="max-w-7xl mx-auto px-6">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                    {stats.map((stat) => (
                        <div key={stat.label} className="flex items-center gap-5 p-6 rounded-2xl hover:bg-slate-50 transition-colors">
                            <div className={`w-14 h-14 ${stat.bg} rounded-xl flex items-center justify-center shrink-0`}>
                                <stat.icon className={`w-7 h-7 ${stat.color}`} />
                            </div>
                            <div>
                                <p className={`text-3xl lg:text-4xl font-bold ${stat.color}`}>
                                    <Counter value={stat.value} />
                                </p>
                                <p className="text-sm text-slate-500 font-medium mt-1">{stat.label}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Stats;
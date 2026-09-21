import { useNavigate } from 'react-router-dom';
import { useCmsQuery } from '../hooks/useCmsQuery';
import { cmsPublic } from '../lib/cmsClient';
import Button from '../components/Button';
import { useTranslation } from 'react-i18next';
import { Calendar } from 'lucide-react';

const CtaSection = () => {
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();
    const { data: homepage } = useCmsQuery(() => cmsPublic.homepage(), []);

    const currentLang = i18n.language;
    const getVal = (enVal?: string, npVal?: string) => {
        if (currentLang === 'np' && npVal) return npVal;
        return enVal || '';
    };

    const cta = homepage?.cta;
    const title = getVal(cta?.title, cta?.titleNp) || 'Need Medical Assistance?';
    const descriptionHtml = getVal(cta?.description, cta?.descriptionNp) || 'Book an appointment with our specialists today.';
    const buttonLabel = getVal(cta?.buttonLabel, cta?.buttonLabelNp) || 'Book Appointment';
    const buttonLink = cta?.buttonLink || '/appointment';
    const imageUrl = cta?.imageUrl || 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=1600';

    return (
        <section className="px-4 sm:px-6 lg:px-8 py-10 lg:py-14 bg-slate-50">
            <div className="max-w-7xl mx-auto">
                <div className="rounded-[32px] overflow-hidden shadow-[var(--shadow-card)] text-white relative border border-white/10 bg-[linear-gradient(135deg,#0d1728_0%,#10233d_52%,#17365d_100%)]">
                    {/* Background image overlay */}
                    <div 
                        className="absolute inset-0 opacity-15 bg-cover bg-center mix-blend-overlay"
                        style={{ backgroundImage: `url(${imageUrl})` }}
                    />
                    
                    <div className="relative z-10 px-6 py-12 sm:p-10 lg:p-14 flex flex-col lg:flex-row items-center justify-between gap-8">
                        <div className="space-y-4 max-w-2xl text-center lg:text-left">
                            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
                                {title}
                            </h2>
                            <div 
                                className="text-lg text-slate-300 leading-relaxed font-normal whitespace-pre-line"
                                dangerouslySetInnerHTML={{ __html: descriptionHtml }}
                            />
                        </div>
                        
                        <div className="shrink-0 w-full sm:w-auto">
                            <Button 
                                onClick={() => navigate(buttonLink)}
                                className="w-full sm:w-auto !bg-emerald-500 hover:!bg-emerald-600 !text-white font-bold px-8 py-4 rounded-xl flex items-center justify-center gap-2 uppercase tracking-wide text-xs transition-all hover:scale-[1.02] active:scale-95"
                            >
                                <Calendar className="w-4 h-4" />
                                {buttonLabel}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default CtaSection;

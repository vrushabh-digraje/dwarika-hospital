import React from 'react';
import { cn } from '../lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'accent' | 'success' | 'outline' | 'ghost' | 'link';
    size?: 'sm' | 'md' | 'lg';
    className?: string;
    children: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = 'primary', size = 'md', ...props }, ref) => {
        const variants = {
            primary: 'bg-[linear-gradient(135deg,#0f4c97_0%,#1a6ccf_100%)] text-white shadow-[0_22px_40px_-24px_rgba(15,76,151,0.65)] hover:shadow-[0_28px_48px_-24px_rgba(15,76,151,0.72)] border border-white/20',
            secondary: 'bg-[linear-gradient(135deg,#16324f_0%,#284f79_100%)] text-white shadow-[0_22px_40px_-24px_rgba(15,23,42,0.45)] hover:shadow-[0_28px_48px_-24px_rgba(15,23,42,0.52)] border border-white/10',
            accent: 'bg-[linear-gradient(135deg,#e7a54c_0%,#f0bc71_100%)] text-white shadow-[0_22px_40px_-24px_rgba(231,165,76,0.6)] hover:shadow-[0_28px_48px_-24px_rgba(231,165,76,0.7)] border border-white/20',
            success: 'bg-[linear-gradient(135deg,#16a34a_0%,#22c55e_100%)] text-white shadow-[0_20px_38px_-24px_rgba(34,197,94,0.6)] hover:shadow-[0_28px_48px_-24px_rgba(34,197,94,0.72)] border border-white/20',
            outline: 'soft-card text-primary hover:bg-white/90 bg-white/70 border border-white/70',
            ghost: 'text-primary hover:bg-white/60 hover:text-primary-hover',
            link: 'text-primary hover:text-secondary hover:underline underline-offset-4 bg-transparent shadow-none p-0 h-auto',
        };

        const sizes = {
            sm: 'px-4 py-2 text-sm font-medium',
            md: 'px-6 py-2.5 text-base font-medium tracking-tight',
            lg: 'px-8 py-3.5 text-lg font-semibold tracking-tight',
        };

        return (
            <button
                ref={ref}
                className={cn(
                    'inline-flex items-center justify-center rounded-full transition-all duration-300 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-2 active:scale-[0.98] hover:-translate-y-0.5 disabled:opacity-50 disabled:pointer-events-none',
                    variants[variant],
                    sizes[size],
                    className
                )}
                {...props}
            />
        );
    }
);

Button.displayName = 'Button';

export default Button;

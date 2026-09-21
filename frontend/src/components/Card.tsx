import React from 'react';
import { cn } from '../lib/utils';

interface CardProps {
    className?: string;
    children: React.ReactNode;
}

export const Card = ({ className, children }: CardProps) => {
    return (
        <div className={cn(
            "soft-card rounded-[28px] p-6 sm:p-8 hover-lift relative overflow-hidden",
            className
        )}>
            {children}
        </div>
    );
};

export const CardHeader = ({ className, children }: CardProps) => (
    <div className={cn("mb-5", className)}>{children}</div>
);

export const CardContent = ({ className, children }: CardProps) => (
    <div className={cn("text-slate-600 leading-relaxed font-light", className)}>{children}</div>
);

export const CardFooter = ({ className, children }: CardProps) => (
    <div className={cn("mt-6 flex items-center pt-5 border-t soft-divider", className)}>{children}</div>
);

import type { LucideIcon } from 'lucide-react';
import { Card, CardHeader, CardContent } from './Card';

interface ServiceCardProps {
    icon: LucideIcon;
    title: string;
    desc: string;
    index: number;
}

export const ServiceCard = ({ icon: Icon, title, desc, index }: ServiceCardProps) => {
    return (
        <Card className="relative h-full border-gray-100 rounded-none shadow-[0_18px_40px_rgba(15,23,42,0.06)] hover:shadow-[0_24px_70px_rgba(15,23,42,0.08)] hover:-translate-y-1 transition-all duration-300 border p-6 group bg-white overflow-hidden">
            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-blue-900 via-red-600 to-blue-800 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            <CardHeader className="p-0 mb-6 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="w-16 h-16 flex items-center justify-center p-4 bg-blue-900/5 rounded-none border-b-4 border-red-600 group-hover:bg-blue-900 group-hover:border-blue-900 transition-colors duration-300">
                        <Icon className="w-8 h-8 text-blue-900 group-hover:text-white" />
                    </div>
                    <span className="text-[11px] font-black text-gray-400 uppercase tracking-[0.3em]">
                        Dept. {String(index + 1).padStart(2, "0")}
                    </span>
                </div>
            </CardHeader>

            <CardContent className="p-0 space-y-3">
                <h3 className="text-xl font-black text-blue-900 mb-1 uppercase tracking-tight">
                    {title}
                </h3>
                <p className="text-sm text-gray-500 leading-relaxed font-medium">
                    {desc}
                </p>
                <div className="mt-4 flex flex-wrap gap-2 text-[11px] font-bold uppercase tracking-[0.22em] text-gray-400">
                    <span className="px-3 py-1 bg-gray-50 border border-gray-100">
                        24/7 Support
                    </span>
                    <span className="px-3 py-1 bg-gray-50 border border-gray-100">
                        Senior Consultants
                    </span>
                </div>
            </CardContent>
        </Card>
    );
};
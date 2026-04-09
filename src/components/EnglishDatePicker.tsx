import React, { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
    value: string;
    onChange: (date: string) => void;
    className?: string;
}

const EnglishDatePicker: React.FC<Props> = ({ value, onChange, className }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [viewMode, setViewMode] = useState<'calendar' | 'month' | 'year'>('year');
    const [viewDate, setViewDate] = useState(value ? new Date(value) : new Date());
    const containerRef = useRef<HTMLDivElement>(null);

    const daysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

    const months = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    const handleOpen = () => {
        setIsOpen(true);
        // If value exists, start at calendar view; otherwise start at year view for easy birthdate entry
        setViewMode(value ? 'calendar' : 'year');
    };

    const handleDateSelect = (day: number) => {
        const date = new Date(viewDate.getFullYear(), viewDate.getMonth(), day);
        const yyyy = date.getFullYear();
        const mm = String(date.getMonth() + 1).padStart(2, '0');
        const dd = String(date.getDate()).padStart(2, '0');
        const formatted = `${yyyy}-${mm}-${dd}`;
        onChange(formatted);
        setIsOpen(false);
    };

    const selectYear = (y: number) => {
        setViewDate(new Date(y, viewDate.getMonth(), 1));
        setViewMode('month'); // Progression: Year -> Month
    };

    const selectMonth = (m: number) => {
        setViewDate(new Date(viewDate.getFullYear(), m, 1));
        setViewMode('calendar'); // Progression: Month -> Calendar
    };

    const changeMonth = (offset: number) => {
        setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + offset, 1));
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const renderCalendar = () => {
        const days = [];
        const totalDays = daysInMonth(viewDate.getFullYear(), viewDate.getMonth());
        const startDay = firstDayOfMonth(viewDate.getFullYear(), viewDate.getMonth());

        for (let i = 0; i < startDay; i++) {
            days.push(<div key={`empty-${i}`} className="p-2" />);
        }

        for (let d = 1; d <= totalDays; d++) {
            const dateStr = `${viewDate.getFullYear()}-${String(viewDate.getMonth() + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
            const isSelected = value === dateStr;
            const isToday = new Date().toDateString() === new Date(viewDate.getFullYear(), viewDate.getMonth(), d).toDateString();
            
            days.push(
                <button
                    key={d}
                    type="button"
                    onClick={() => handleDateSelect(d)}
                    className={`p-2 w-10 h-10 rounded-full text-xs font-bold transition-all flex items-center justify-center
                        ${isSelected ? 'bg-blue-900 text-white shadow-lg' : 
                        isToday ? 'border-2 border-blue-900 text-blue-900' : 'hover:bg-slate-100 text-slate-700'}`}
                >
                    {d}
                </button>
            );
        }

        return (
            <>
                <div className="flex items-center justify-between mb-4">
                    <button type="button" onClick={() => changeMonth(-1)} className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                        <ChevronLeft className="w-4 h-4" />
                    </button>
                    <div className="flex flex-col items-center cursor-pointer hover:bg-slate-50 p-1 rounded-xl transition-colors" onClick={() => setViewMode('month')}>
                        <span className="text-sm font-black uppercase tracking-widest text-blue-900">
                            {months[viewDate.getMonth()]}
                        </span>
                        <span className="text-[10px] font-bold text-slate-400 hover:text-blue-900" onClick={(e) => { e.stopPropagation(); setViewMode('year'); }}>
                            {viewDate.getFullYear()}
                        </span>
                    </div>
                    <button type="button" onClick={() => changeMonth(1)} className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                        <ChevronRight className="w-4 h-4" />
                    </button>
                </div>

                <div className="grid grid-cols-7 gap-1 mb-2 text-center">
                    {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(d => (
                        <div key={d} className="text-[10px] font-black text-slate-400 uppercase py-2">
                            {d}
                        </div>
                    ))}
                    {days}
                </div>
            </>
        );
    };

    const renderYearSelection = () => {
        const years = [];
        const currentYear = new Date().getFullYear();
        for (let y = currentYear; y >= currentYear - 100; y--) {
            const isSelected = y === viewDate.getFullYear();
            years.push(
                <button
                    key={y}
                    onClick={() => selectYear(y)}
                    className={`p-2 rounded-xl text-xs font-bold transition-all ${isSelected ? 'bg-blue-900 text-white shadow-md' : 'hover:bg-slate-100 text-slate-700'}`}
                >
                    {y}
                </button>
            );
        }
        return (
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <button onClick={() => setViewMode('calendar')} className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-blue-900 flex items-center gap-1">
                        <ChevronLeft className="w-3 h-3" /> Back
                    </button>
                    <span className="text-xs font-black uppercase tracking-widest text-blue-900">Select Year</span>
                </div>
                <div className="grid grid-cols-4 gap-2 max-h-[220px] overflow-y-auto pr-2 scrollbar-hide">
                    {years}
                </div>
            </div>
        );
    };

    const renderMonthSelection = () => {
        return (
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <button onClick={() => setViewMode('calendar')} className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-blue-900 flex items-center gap-1">
                        <ChevronLeft className="w-3 h-3" /> Back
                    </button>
                    <span className="text-xs font-black uppercase tracking-widest text-blue-900">Select Month</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                    {months.map((m, idx) => (
                        <button
                            key={m}
                            onClick={() => selectMonth(idx)}
                            className={`p-3 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${idx === viewDate.getMonth() ? 'bg-blue-900 text-white shadow-md' : 'hover:bg-slate-100 text-slate-700'}`}
                        >
                            {m.substring(0, 3)}
                        </button>
                    ))}
                </div>
            </div>
        );
    };

    return (
        <div className="relative" ref={containerRef}>
            <div 
                onClick={handleOpen}
                className={`cursor-pointer flex items-center justify-between transition-all ${className} ${isOpen ? 'ring-2 ring-blue-900 border-blue-900 bg-white' : ''}`}
            >
                <span className={`font-semibold ${value ? 'text-slate-900' : 'text-slate-400'}`}>
                    {value ? new Date(value).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'Select Date'}
                </span>
                <CalendarIcon className={`w-4 h-4 ${isOpen ? 'text-blue-900' : 'text-slate-400'}`} />
            </div>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute z-50 mt-2 p-4 bg-white rounded-2xl shadow-2xl border border-slate-100 w-[320px]"
                    >
                        {viewMode === 'calendar' && renderCalendar()}
                        {viewMode === 'year' && renderYearSelection()}
                        {viewMode === 'month' && renderMonthSelection()}

                        {viewMode === 'calendar' && (
                            <div className="flex justify-between border-t border-slate-50 pt-3 mt-2 font-bold text-[10px] uppercase tracking-widest text-slate-400">
                                <button type="button" onClick={() => { setViewMode('year'); }} className="hover:text-blue-900">Change Year</button>
                                <button type="button" onClick={() => setViewDate(new Date())} className="hover:text-blue-900">Today</button>
                                <button type="button" onClick={() => changeMonth(12)} className="hover:text-blue-900">Next Year</button>
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default EnglishDatePicker;

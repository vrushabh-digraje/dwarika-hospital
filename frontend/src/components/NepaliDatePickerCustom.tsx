import React, { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import BikramSambat from 'bikram-sambat-js';

interface Props {
    value: string;
    onChange: (date: string) => void;
    className?: string;
}

const NepaliDatePickerCustom: React.FC<Props> = ({ value, onChange, className }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [viewMode, setViewMode] = useState<'calendar' | 'month' | 'year'>('year');
    
    // Initial view date setup
    const getInitialDate = () => {
        if (value && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
            return value;
        }
        const todayAD = new Date();
        return new BikramSambat(todayAD, 'AD').toBS();
    };

    const [viewDateBS, setViewDateBS] = useState(getInitialDate());
    const containerRef = useRef<HTMLDivElement>(null);

    const [year, month] = viewDateBS.split('-').map(Number);

    const nepaliMonths = [
        "Baisakh", "Jestha", "Ashadh", "Shrawan", "Bhadra", "Ashwin",
        "Kartik", "Mangshir", "Poush", "Magh", "Falgun", "Chaitra"
    ];

    const getDaysInMonth = (y: number, m: number) => {
        try {

            let max = 28;
            for (let d = 29; d <= 32; d++) {
                try {
                    const test = new BikramSambat(`${y}-${m.toString().padStart(2, '0')}-${d.toString().padStart(2, '0')}`, 'BS');
                    if (test.toBS().includes(`-${m.toString().padStart(2, '0')}-`)) {
                        max = d;
                    }
                } catch (e) { break; }
            }
            return max;
        } catch (e) { return 30; }
    };

    const getFirstDayOfWeek = (y: number, m: number) => {
        try {
            const bs = new BikramSambat(`${y}-${m.toString().padStart(2, '0')}-01`, 'BS');
            const adDate = new Date(bs.toAD());
            return adDate.getDay();
        } catch (e) { return 0; }
    };

    const handleOpen = () => {
        setIsOpen(true);
        // If value exists, start at calendar view; otherwise start at year view for easy birthdate entry
        setViewMode(value ? 'calendar' : 'year');
    };

    const handleDateSelect = (day: number) => {
        const formatted = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
        onChange(formatted);
        setIsOpen(false);
    };

    const selectYear = (y: number) => {
        setViewDateBS(`${y}-${month.toString().padStart(2, '0')}-01`);
        setViewMode('month'); // Progression: Year -> Month
    };

    const selectMonth = (m: number) => {
        setViewDateBS(`${year}-${(m + 1).toString().padStart(2, '0')}-01`);
        setViewMode('calendar'); // Progression: Month -> Calendar
    };

    const changeMonth = (offset: number) => {
        let newMonth = month + offset;
        let newYear = year;
        if (newMonth > 12) {
            newMonth = 1;
            newYear++;
        } else if (newMonth < 1) {
            newMonth = 12;
            newYear--;
        }
        setViewDateBS(`${newYear}-${newMonth.toString().padStart(2, '0')}-01`);
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
        const totalDays = getDaysInMonth(year, month);
        const startDay = getFirstDayOfWeek(year, month);

        for (let i = 0; i < startDay; i++) {
            days.push(<div key={`empty-${i}`} className="p-2" />);
        }

        for (let d = 1; d <= totalDays; d++) {
            const dateStr = `${year}-${month.toString().padStart(2, '0')}-${d.toString().padStart(2, '0')}`;
            const isSelected = value === dateStr;
            
            days.push(
                <button
                    key={d}
                    type="button"
                    onClick={() => handleDateSelect(d)}
                    className={`p-2 w-10 h-10 rounded-full text-xs font-bold transition-all flex items-center justify-center
                        ${isSelected ? 'bg-blue-900 text-white shadow-lg' : 'hover:bg-slate-100 text-slate-700'}`}
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
                            {nepaliMonths[month - 1]}
                        </span>
                        <span className="text-[10px] font-bold text-slate-400 hover:text-blue-900" onClick={(e) => { e.stopPropagation(); setViewMode('year'); }}>
                            {year} BS
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
        const currentYearBS = Number(new BikramSambat(new Date(), 'AD').toBS().split('-')[0]);
        for (let y = currentYearBS; y >= currentYearBS - 100; y--) {
            const isSelected = y === year;
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
                    <span className="text-xs font-black uppercase tracking-widest text-blue-900">Select Year (BS)</span>
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
                    <span className="text-xs font-black uppercase tracking-widest text-blue-900">Select Month (BS)</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                    {nepaliMonths.map((m, idx) => (
                        <button
                            key={m}
                            onClick={() => selectMonth(idx)}
                            className={`p-3 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${idx === (month - 1) ? 'bg-blue-900 text-white shadow-md' : 'hover:bg-slate-100 text-slate-700'}`}
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
                    {value ? value : 'Select Date (BS)'}
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
                                <button type="button" onClick={() => {
                                    const todayBS = new BikramSambat(new Date(), 'AD').toBS();
                                    setViewDateBS(todayBS);
                                }} className="hover:text-blue-900">Today</button>
                                <button type="button" onClick={() => {
                                    setViewDateBS(`${year + 10}-${month.toString().padStart(2, '0')}-01`);
                                }} className="hover:text-blue-900">+10 Yrs</button>
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default NepaliDatePickerCustom;

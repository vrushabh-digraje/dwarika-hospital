import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, Clock, Check, Info } from 'lucide-react';
import { useState, useMemo } from 'react';
import BikramSambat from 'bikram-sambat-js';

interface DoctorScheduleModalProps {
    isOpen: boolean;
    onClose: () => void;
    department: string;
    doctorName: string;
    onSelectSlot: (date: string, shift: string, time: string) => void;
}

const SHIFTS = [
    { id: 'Morning', label: 'Morning', timeRange: '08:00 - 12:00' },
    { id: 'Afternoon', label: 'Afternoon', timeRange: '12:00 - 16:00' },
    { id: 'Evening', label: 'Evening', timeRange: '16:00 - 19:00' },
    { id: 'Other', label: 'Other', timeRange: '19:00 - 21:00' }
];

// Mock data for time slots across 7 days (index 0 to 6)
const MOCK_SLOTS: Record<string, any> = {
    'Morning': {
        0: '9:00 AM - 10:00 AM',
        2: '8:00 AM - 9:30 AM',
        6: '8:30 AM - 10:00 AM',
    },
    'Afternoon': {
        1: '11:00 AM - 1:00 PM',
        3: '10:00 AM - 12:00 PM',
        5: '1:00 PM - 3:00 PM',
    },
    'Evening': {
        0: '4:00 PM - 6:00 PM',
    },
    'Other': {
        1: '7:00 PM - 8:00 PM',
        2: '7:00 PM - 8:00 PM',
        6: '6:30 PM - 8:00 PM',
    }
};

const DoctorScheduleModal = ({ isOpen, onClose, department, doctorName, onSelectSlot }: DoctorScheduleModalProps) => {
    const [selectedSlot, setSelectedSlot] = useState<{ dayIdx: number, shiftId: string, time: string } | null>(null);
    const [weekOffset, setWeekOffset] = useState(0);
    const [calendarMode, setCalendarMode] = useState<'BS' | 'AD'>('BS');

    const days = useMemo(() => {
        const result = [];
        const today = new Date();
        const startDay = new Date(today);
        startDay.setDate(today.getDate() + (weekOffset * 7));

        for (let i = 0; i < 7; i++) {
            const d = new Date(startDay);
            d.setDate(startDay.getDate() + i);
            
            const adDateStr = d.toISOString().split('T')[0];
            let bsDateStr = '';
            let bsDayNum = 0;
            let bsMonthName = '';
            let bsYear = 0;

            try {
                const bs = new BikramSambat(d, 'AD');
                bsDateStr = bs.toBS();
                const [y, m, day] = bsDateStr.split('-').map(Number);
                bsDayNum = day;
                bsYear = y;
                // Nepali month names for BS
                const bsMonths = ['BAISAKH', 'JESTHA', 'ASHADH', 'SHRAWAN', 'BHADRA', 'ASHWIN', 'KARTIK', 'MANGSIR', 'POUSH', 'MAGH', 'FALGUN', 'CHAITRA'];
                bsMonthName = bsMonths[m - 1];
            } catch (e) {
                console.error("BS Conversion error", e);
            }

            result.push({
                date: adDateStr,
                adDayNum: d.getDate(),
                adDayName: d.toLocaleDateString('en-US', { weekday: 'short' }),
                adMonthName: d.toLocaleDateString('en-US', { month: 'long' }).toUpperCase(),
                adYear: d.getFullYear(),
                bsDayNum,
                bsMonthName,
                bsYear,
                bsDateStr
            });
        }
        return result;
    }, [weekOffset]);

    const handleConfirm = () => {
        if (selectedSlot) {
            onSelectSlot(days[selectedSlot.dayIdx].date, selectedSlot.shiftId, selectedSlot.time);
            onClose();
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-blue-950/40 backdrop-blur-md z-[100]"
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[96%] max-w-6xl bg-white rounded-3xl shadow-[0_24px_80px_-15px_rgba(0,0,0,0.3)] z-[110] overflow-hidden flex flex-col"
                    >
                        {/* Compact Header Section */}
                        <div className="px-6 pt-4 sm:pt-5 pb-2.5 shrink-0">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                <div className="flex items-center gap-2.5">
                                    <div className="p-2 bg-blue-50 rounded-xl text-blue-600 border border-blue-100/60 shadow-xs shrink-0">
                                        <Calendar className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h2 className="text-xl sm:text-2xl font-black text-blue-950 uppercase tracking-tight leading-tight">
                                            Weekly Schedule
                                        </h2>
                                        <p className="text-slate-500 font-bold uppercase tracking-[0.14em] text-[11px]">
                                            {doctorName} • <span className="text-blue-600">{department}</span>
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2.5 sm:gap-4 flex-wrap">
                                    {/* Week pagination */}
                                    <div className="flex bg-slate-100/80 p-0.5 rounded-xl border border-slate-200/50">
                                        {[
                                            { label: 'Prev Week', offset: weekOffset - 1 },
                                            { label: 'This Week', offset: 0 },
                                            { label: 'Next Week', offset: weekOffset + 1 }
                                        ].map((btn) => (
                                            <button
                                                key={btn.label}
                                                type="button"
                                                onClick={() => setWeekOffset(btn.offset)}
                                                className={`px-3 py-1.5 text-[10px] font-black uppercase tracking-wider rounded-lg transition-all duration-150 cursor-pointer
                                                    ${(btn.label === 'This Week' && weekOffset === 0) || (btn.label !== 'This Week' && weekOffset === btn.offset)
                                                        ? 'bg-white text-blue-900 shadow-xs ring-1 ring-slate-200'
                                                        : 'text-slate-500 hover:text-blue-600'
                                                    }`}
                                            >
                                                {btn.label}
                                            </button>
                                        ))}
                                    </div>

                                    {/* Calendar Mode BS/AD */}
                                    <div className="flex bg-slate-100/80 p-0.5 rounded-xl border border-slate-200/50">
                                        {[
                                            { label: 'BS', mode: 'BS' },
                                            { label: 'AD', mode: 'AD' }
                                        ].map((btn) => (
                                            <button
                                                key={btn.label}
                                                type="button"
                                                onClick={() => setCalendarMode(btn.mode as 'BS' | 'AD')}
                                                className={`px-3 py-1.5 text-[10px] font-black uppercase tracking-wider transition-all duration-150 rounded-lg cursor-pointer
                                                    ${calendarMode === btn.mode
                                                        ? 'bg-blue-900 text-white shadow-xs'
                                                        : 'text-slate-500 hover:text-blue-600'
                                                    }`}
                                            >
                                                {btn.label}
                                            </button>
                                        ))}
                                    </div>

                                    {/* Month/Year Display */}
                                    <div className="text-right hidden md:block pl-1">
                                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-0.5">
                                            {calendarMode === 'BS' ? 'Nepali Calendar' : 'English Calendar'}
                                        </p>
                                        <p className="text-xs sm:text-sm font-black text-blue-950 leading-tight">
                                            {calendarMode === 'BS' 
                                                ? `${days[0].bsMonthName}, ${days[0].bsYear}` 
                                                : `${days[0].adMonthName}, ${days[0].adYear}`
                                            }
                                        </p>
                                    </div>

                                    {/* Close Button */}
                                    <button 
                                        type="button"
                                        onClick={onClose} 
                                        className="p-1.5 hover:bg-slate-100 rounded-xl transition-all bg-slate-50 border border-slate-200/70 text-slate-400 hover:text-slate-700 cursor-pointer"
                                        aria-label="Close Schedule"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>

                            {/* Slim Info alert */}
                            <div className="mt-2.5 flex items-center gap-2 py-1.5 px-3 bg-blue-50/70 rounded-xl border border-blue-100/60 w-fit text-blue-950">
                                <Info className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                                <p className="text-[11px] font-medium text-blue-900/80">
                                    Select an available time slot below to automatically update your appointment details.
                                </p>
                            </div>
                        </div>

                        {/* Timetable Grid with Separate Shift Column - Fits Single View */}
                        <div className="px-6 py-2 overflow-x-auto">
                            <div className="min-w-[860px] bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
                                {/* Table Header Row */}
                                <div className="grid grid-cols-[120px_repeat(7,1fr)] bg-slate-50 border-b border-slate-200/80">
                                    {/* Separate Shift Column Header */}
                                    <div className="p-2 flex flex-col items-center justify-center border-r border-slate-200/80 bg-slate-100/70 text-center">
                                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">Shift</span>
                                        <span className="text-[11px] font-black text-blue-950 uppercase tracking-wider mt-0.5">Timeline</span>
                                    </div>

                                    {/* 7 Days Columns */}
                                    {days.map((day, dIdx) => (
                                        <div 
                                            key={dIdx} 
                                            className={`p-2 text-center ${dIdx < 6 ? 'border-r border-slate-200/60' : ''}`}
                                        >
                                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5 opacity-70">
                                                {day.adDayName}
                                            </p>
                                            <p className="text-base font-black text-blue-950 uppercase tracking-tight leading-none">
                                                {calendarMode === 'BS' ? day.bsDayNum : day.adDayNum}
                                            </p>
                                        </div>
                                    ))}
                                </div>

                                {/* Shift Rows */}
                                <div className="divide-y divide-slate-200/60">
                                    {SHIFTS.map((shift) => (
                                        <div key={shift.id} className="grid grid-cols-[120px_repeat(7,1fr)] items-stretch hover:bg-slate-50/40 transition-colors">
                                            {/* Separate Shift Column Cell */}
                                            <div className="p-2 border-r border-slate-200/80 bg-slate-50/60 flex flex-col justify-center items-center text-center">
                                                <span className="text-[11px] font-black text-blue-950 uppercase tracking-wider leading-tight">
                                                    {shift.label}
                                                </span>
                                                <span className="text-[8px] font-bold text-slate-400 uppercase tracking-tight mt-0.5">
                                                    {shift.timeRange}
                                                </span>
                                            </div>

                                            {/* 7 Day Slot Cells for this Shift */}
                                            {days.map((_, dIdx) => {
                                                const slotTime = MOCK_SLOTS[shift.id]?.[dIdx];
                                                const isSelected = selectedSlot?.dayIdx === dIdx && selectedSlot?.shiftId === shift.id;

                                                return (
                                                    <div 
                                                        key={dIdx} 
                                                        className={`p-1.5 flex items-center justify-center ${dIdx < 6 ? 'border-r border-slate-200/60' : ''}`}
                                                    >
                                                        {slotTime ? (
                                                            <button
                                                                type="button"
                                                                onClick={() => setSelectedSlot({ dayIdx: dIdx, shiftId: shift.id, time: slotTime })}
                                                                className={`w-full py-1.5 px-1 rounded-xl border text-center transition-all duration-150 flex flex-col items-center justify-center gap-0.5 cursor-pointer
                                                                    ${isSelected 
                                                                        ? 'bg-blue-600 border-blue-600 text-white shadow-xs scale-[0.98]' 
                                                                        : 'bg-white border-blue-100 hover:border-blue-400 hover:shadow-2xs text-blue-950'
                                                                    }
                                                                `}
                                                            >
                                                                <span className="text-[10px] font-black tracking-tight leading-tight">
                                                                    {slotTime}
                                                                </span>
                                                                <span className={`text-[7px] font-black uppercase tracking-wider ${
                                                                    isSelected ? 'text-blue-100' : 'text-emerald-600'
                                                                }`}>
                                                                    Available
                                                                </span>
                                                            </button>
                                                        ) : (
                                                            <span className="text-slate-300 font-bold text-xs select-none">
                                                                —
                                                            </span>
                                                        )}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Compact Footer Section */}
                        <div className="px-6 py-3 bg-slate-50/90 border-t border-slate-200/80 flex flex-col sm:flex-row justify-between items-center gap-2.5 shrink-0 backdrop-blur-sm">
                            <div className="flex flex-wrap items-center gap-3">
                                <div className="flex items-center gap-2 px-2.5 py-1 bg-white rounded-lg border border-slate-200 shadow-2xs">
                                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Nepal Standard Time (NST)</span>
                                </div>
                                {selectedSlot && (
                                    <motion.div 
                                        initial={{ opacity: 0, x: -8 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        className="flex items-center gap-2 px-3 py-1 bg-blue-600 rounded-lg text-white shadow-xs"
                                    >
                                        <Check className="w-3.5 h-3.5" />
                                        <span className="text-[11px] font-bold tracking-wide">
                                            Selected: {calendarMode === 'BS' ? `BS ${days[selectedSlot.dayIdx].bsDateStr}` : `AD ${days[selectedSlot.dayIdx].date}`} • {selectedSlot.shiftId} ({selectedSlot.time})
                                        </span>
                                    </motion.div>
                                )}
                            </div>

                            <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
                                <button 
                                    type="button"
                                    onClick={onClose}
                                    className="px-5 py-2 bg-white text-slate-600 rounded-xl font-bold uppercase tracking-wider text-[11px] border border-slate-200 hover:bg-slate-50 transition-all cursor-pointer shadow-2xs"
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="button"
                                    onClick={handleConfirm}
                                    disabled={!selectedSlot}
                                    className={`
                                        px-7 py-2 rounded-xl font-bold uppercase tracking-wider text-[11px] transition-all shadow-xs
                                        ${selectedSlot 
                                            ? 'bg-blue-900 text-white shadow-blue-900/20 hover:bg-blue-950 cursor-pointer active:scale-95' 
                                            : 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
                                        }
                                    `}
                                >
                                    Confirm Selection
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default DoctorScheduleModal;

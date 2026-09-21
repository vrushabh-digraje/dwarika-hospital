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
    { id: 'Morning', label: 'Morning Shift' },
    { id: 'Afternoon', label: 'Afternoon Shift' },
    { id: 'Evening', label: 'Evening Shift' },
    { id: 'Other', label: 'Other' }
];

// Mock data for time slots
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
                // Mock month names for BS
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
                        initial={{ opacity: 0, scale: 0.9, y: 40 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 40 }}
                        className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[95%] max-w-7xl bg-white rounded-[40px] shadow-[0_32px_120px_-20px_rgba(0,0,0,0.3)] z-[110] overflow-hidden flex flex-col max-h-[92vh]"
                    >
                        {/* Header Section */}
                        <div className="p-10 pb-6 shrink-0">
                            <div className="flex justify-between items-start">
                                <div className="space-y-1">
                                    <h2 className="text-4xl font-black text-blue-950 uppercase tracking-tighter flex items-center gap-4">
                                        <div className="p-3 bg-blue-50 rounded-2xl">
                                            <Calendar className="w-8 h-8 text-blue-600" />
                                        </div>
                                        Doctor Weekly Schedule
                                    </h2>
                                    <p className="text-slate-500 font-bold uppercase tracking-[0.2em] text-sm pl-2">
                                        {doctorName} • <span className="text-blue-600">{department}</span>
                                    </p>
                                </div>

                                <div className="flex items-center gap-10">
                                    <div className="flex bg-slate-100/80 p-1.5 rounded-[20px] backdrop-blur-sm border border-slate-200/50">
                                        {[
                                            { label: 'Prev Week', offset: weekOffset - 1 },
                                            { label: 'This Week', offset: 0 },
                                            { label: 'Next Week', offset: weekOffset + 1 }
                                        ].map((btn) => (
                                            <button
                                                key={btn.label}
                                                onClick={() => setWeekOffset(btn.offset)}
                                                className={`px-6 py-2.5 text-[11px] font-black uppercase tracking-widest rounded-XV transition-all duration-300 rounded-2xl
                                                    ${(btn.label === 'This Week' && weekOffset === 0) || (btn.label !== 'This Week' && weekOffset === btn.offset)
                                                        ? 'bg-white text-blue-900 shadow-sm ring-1 ring-slate-200'
                                                        : 'text-slate-500 hover:text-blue-600'
                                                    }`}
                                            >
                                                {btn.label}
                                            </button>
                                        ))}
                                    </div>

                                    <div className="flex bg-slate-100/80 p-1.5 rounded-[20px] backdrop-blur-sm border border-slate-200/50">
                                        {[
                                            { label: 'BS', mode: 'BS' },
                                            { label: 'AD', mode: 'AD' }
                                        ].map((btn) => (
                                            <button
                                                key={btn.label}
                                                onClick={() => setCalendarMode(btn.mode as 'BS' | 'AD')}
                                                className={`px-5 py-2 text-[11px] font-black uppercase tracking-widest transition-all duration-300 rounded-2xl
                                                    ${calendarMode === btn.mode
                                                        ? 'bg-blue-900 text-white shadow-lg shadow-blue-900/20'
                                                        : 'text-slate-500 hover:text-blue-600'
                                                    }`}
                                            >
                                                {btn.label}
                                            </button>
                                        ))}
                                    </div>

                                    <div className="text-right min-w-[120px]">
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">
                                            {calendarMode === 'BS' ? 'Nepali Calendar' : 'English Calendar'}
                                        </p>
                                        <p className="text-xl font-black text-blue-950">
                                            {calendarMode === 'BS' 
                                                ? `${days[0].bsMonthName}, ${days[0].bsYear}` 
                                                : `${days[0].adMonthName}, ${days[0].adYear}`
                                            }
                                        </p>
                                    </div>

                                    <button onClick={onClose} className="p-3 hover:bg-slate-100 rounded-2xl transition-all active:scale-90 bg-slate-50 border border-slate-100">
                                        <X className="w-6 h-6 text-slate-400" />
                                    </button>
                                </div>
                            </div>

                            <div className="mt-8 flex items-center gap-3 py-3 px-5 bg-blue-50/50 rounded-2xl border border-blue-100/50 w-fit">
                                <Info className="w-4 h-4 text-blue-600" />
                                <p className="text-xs font-bold text-blue-900/70">Select an available time slot below to automatically update your appointment details.</p>
                            </div>
                        </div>

                        {/* Day Columns Slot Grid */}
                        <div className="flex-1 overflow-auto px-10 pb-10">
                            <div className="grid grid-cols-7 gap-4 min-w-[900px]">
                                {days.map((day, dIdx) => {
                                    // Gather available slots for this day across all shifts
                                    const daySlots = SHIFTS.map(shift => {
                                        const time = MOCK_SLOTS[shift.id]?.[dIdx];
                                        return time ? { shiftId: shift.id, shiftLabel: shift.label, time } : null;
                                    }).filter(Boolean) as { shiftId: string; shiftLabel: string; time: string }[];

                                    return (
                                        <div 
                                            key={dIdx} 
                                            className="bg-slate-50/50 border border-slate-200/80 rounded-3xl p-4 flex flex-col items-center min-h-[220px]"
                                        >
                                            {/* Day Header */}
                                            <div className="text-center pb-3 border-b border-slate-200/50 w-full mb-3">
                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 opacity-60">
                                                    {day.adDayName}
                                                </p>
                                                <p className="text-xl font-black text-blue-950 uppercase tracking-tight">
                                                    {calendarMode === 'BS' ? day.bsDayNum : day.adDayNum}
                                                </p>
                                            </div>

                                            {/* Slots List */}
                                            <div className="flex-1 w-full flex flex-col gap-2.5 justify-center">
                                                {daySlots.length > 0 ? (
                                                    daySlots.map((slot) => {
                                                        const isSelected = selectedSlot?.dayIdx === dIdx && selectedSlot?.shiftId === slot.shiftId;
                                                        return (
                                                            <button
                                                                key={slot.shiftId}
                                                                onClick={() => setSelectedSlot({ dayIdx: dIdx, shiftId: slot.shiftId, time: slot.time })}
                                                                className={`w-full p-2.5 rounded-xl border text-center transition-all duration-300 flex flex-col items-center justify-center gap-1
                                                                    ${isSelected 
                                                                        ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-600/20 scale-[0.98]' 
                                                                        : 'bg-white border-blue-100 hover:border-blue-300 text-blue-950 shadow-sm'
                                                                    }
                                                                `}
                                                            >
                                                                <span className="text-[10px] font-black tracking-tight leading-none">
                                                                    {slot.time}
                                                                </span>
                                                                <span className={`text-[8px] font-black uppercase tracking-wider
                                                                    ${isSelected ? 'text-blue-100' : 'text-slate-400'}
                                                                `}>
                                                                    {slot.shiftId}
                                                                </span>
                                                            </button>
                                                        );
                                                    })
                                                ) : (
                                                    <div className="flex flex-col items-center justify-center py-6 opacity-30">
                                                        <span className="text-slate-300 font-black text-lg">—</span>
                                                        <span className="text-[8px] font-black text-slate-300 uppercase tracking-widest mt-1">OFF</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Footer Section */}
                        <div className="p-10 bg-slate-50/80 border-t border-slate-100 flex justify-between items-center shrink-0 backdrop-blur-sm">
                            <div className="flex items-center gap-8">
                                <div className="flex items-center gap-3 px-4 py-2 bg-white rounded-xl border border-slate-200 shadow-sm">
                                    <Clock className="w-4 h-4 text-slate-400" />
                                    <span className="text-[11px] font-black text-slate-500 uppercase tracking-widest">Nepal Standard Time (NST)</span>
                                </div>
                                {selectedSlot && (
                                    <motion.div 
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        className="flex items-center gap-3 px-4 py-2 bg-blue-600 rounded-xl text-white shadow-lg shadow-blue-600/20"
                                    >
                                        <Check className="w-4 h-4" />
                                        <span className="text-xs font-black uppercase tracking-widest">
                                            Selected: {calendarMode === 'BS' ? `BS ${days[selectedSlot.dayIdx].bsDateStr}` : `AD ${days[selectedSlot.dayIdx].date}`} • {selectedSlot.time}
                                        </span>
                                    </motion.div>
                                )}
                            </div>

                            <div className="flex gap-4">
                                <button 
                                    onClick={onClose}
                                    className="px-10 py-4 bg-white text-slate-600 rounded-2xl font-black uppercase tracking-[0.2em] text-xs border border-slate-200 hover:bg-slate-50 transition-all active:scale-95 shadow-sm"
                                >
                                    Cancel
                                </button>
                                <button 
                                    onClick={handleConfirm}
                                    disabled={!selectedSlot}
                                    className={`
                                        px-12 py-4 rounded-2xl font-black uppercase tracking-[0.2em] text-xs transition-all active:scale-95 shadow-xl
                                        ${selectedSlot 
                                            ? 'bg-blue-900 text-white shadow-blue-900/20 hover:shadow-blue-900/40 hover:-translate-y-0.5' 
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

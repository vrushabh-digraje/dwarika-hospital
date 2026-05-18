import React, { useState } from 'react';
import NepaliDatePickerCustom from './NepaliDatePickerCustom';
import EnglishDatePicker from './EnglishDatePicker';

interface Props {
    value: string;
    onChange: (value: string) => void;
    className?: string;
    label?: string;
    labelClassName?: string;
}

const DualDatePicker: React.FC<Props> = ({ value, onChange, className, label, labelClassName }) => {
    const [mode, setMode] = useState<'BS' | 'AD'>('BS');

    return (
        <div className="flex flex-col w-full">
            {/* Header: Label + Toggle */}
            <div className="flex items-center gap-3 mb-2">
                {label && (
                    <label className={labelClassName || "text-xs font-bold text-gray-500 uppercase tracking-wider"}>
                        {label}
                    </label>
                )}
                <div className="flex rounded-md bg-[#F4F6F9] p-1 shadow-sm border border-gray-100">
                    <button 
                        type="button"
                        onClick={(e) => { e.preventDefault(); setMode('BS'); }}
                        className={`px-3 py-1 text-[10px] font-black uppercase rounded transition-all ${mode === 'BS' ? 'bg-white text-blue-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                        NEP
                    </button>
                    <button 
                        type="button"
                        onClick={(e) => { e.preventDefault(); setMode('AD'); }}
                        className={`px-3 py-1 text-[10px] font-black uppercase rounded transition-all ${mode === 'AD' ? 'bg-white text-blue-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                        ENG
                    </button>
                </div>
            </div>

            <div className="relative w-full">

            {mode === 'BS' ? (
                <NepaliDatePickerCustom
                    value={value}
                    onChange={onChange}
                    className={className || "w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium focus:outline-none focus:border-blue-900 focus:ring-2 focus:ring-blue-900/20"}
                />
            ) : (
                <EnglishDatePicker
                    value={value}
                    onChange={onChange}
                    className={className || "w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium focus:outline-none focus:border-blue-900 focus:ring-2 focus:ring-blue-900/20"}
                />
            )}
            </div>
        </div>
    );
};

export default DualDatePicker;

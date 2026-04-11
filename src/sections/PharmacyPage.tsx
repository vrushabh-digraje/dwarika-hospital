import { useState, useEffect, useMemo } from 'react';
import { 
    Pill, Send, Loader2, 
    Plus, Trash2, Edit2, ChevronDown, FileText
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import { cn } from '../lib/utils';

// Helper to convert number to words
const numberToWords = (num: number): string => {
    if (num === 0) return 'Zero';
    const a = ['', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
    const b = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];
    
    const count = (n: number): string => {
        if (n < 20) return a[n];
        if (n < 100) return b[Math.floor(n / 10)] + (n % 10 !== 0 ? ' ' + a[n % 10] : '');
        if (n < 1000) return a[Math.floor(n / 100)] + ' hundred' + (n % 100 !== 0 ? ' and ' + count(n % 100) : '');
        if (n < 100000) return count(Math.floor(n / 1000)) + ' thousand' + (n % 1000 !== 0 ? ' ' + count(n % 1000) : '');
        return n.toString();
    };
    
    return (count(num).charAt(0).toUpperCase() + count(num).slice(1) + ' rupees only').trim();
};

interface MedicineEntry {
    id: string;
    name: string;
    strength: string;
    quantity: number;
    unit: string;
    rate: number;
    total: number;
}

const PharmacyPage = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [customerInfo, setCustomerInfo] = useState({
        name: '',
        phone: '',
        address: ''
    });

    const [medicines, setMedicines] = useState<MedicineEntry[]>([]);
    const [financials] = useState({
        discount: 0,
        adjustment: 0,
        roundOff: 0
    });
    const [isEditingId, setIsEditingId] = useState<string | null>(null);

    const [currentEntry, setCurrentEntry] = useState({
        name: '',
        strength: '',
        quantity: '',
        unit: 'Pcs',
        rate: ''
    });

    const subtotal = useMemo(() => medicines.reduce((sum, item) => sum + item.total, 0), [medicines]);
    const netTotal = Math.max(0, subtotal - financials.discount - financials.adjustment - financials.roundOff);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const handleInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setCustomerInfo(prev => ({ ...prev, [name]: value }));
    };

    const handleEntryChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        let finalValue = value;
        
        // Prevent negative numbers for quantity and rate
        if (type === 'number' && parseFloat(value) < 0) {
            finalValue = '0';
        }
        
        setCurrentEntry(prev => ({ ...prev, [name]: finalValue }));
    };

    const addMedicine = () => {
        if (!currentEntry.name || !currentEntry.quantity) return;

        const rateNum = parseFloat(currentEntry.rate) || 0;
        const qtyNum = parseFloat(currentEntry.quantity) || 0;

        const newEntry: MedicineEntry = {
            id: isEditingId || Math.random().toString(36).substr(2, 9),
            name: currentEntry.name,
            strength: currentEntry.strength,
            quantity: qtyNum,
            unit: currentEntry.unit,
            rate: rateNum,
            total: qtyNum * rateNum
        };

        if (isEditingId) {
            setMedicines(prev => prev.map(m => m.id === isEditingId ? newEntry : m));
            setIsEditingId(null);
        } else {
            setMedicines(prev => [...prev, newEntry]);
        }

        setCurrentEntry({ name: '', strength: '', quantity: '', unit: 'Pcs', rate: '' });
    };

    const deleteMedicine = (id: string) => {
        setMedicines(prev => prev.filter(m => m.id !== id));
    };

    const editMedicine = (med: MedicineEntry) => {
        setIsEditingId(med.id);
        setCurrentEntry({
            name: med.name,
            strength: med.strength,
            quantity: med.quantity.toString(),
            unit: med.unit,
            rate: med.rate.toString()
        });
    };

    const handleSubmit = async () => {
        if (medicines.length === 0) {
            alert("Please add at least one medicine.");
            return;
        }
        setIsLoading(true);
        await new Promise(resolve => setTimeout(resolve, 1500));
        setIsLoading(false);
        alert('Order placed successfully!');
    };

    const inputCls = "w-full px-5 py-3.5 bg-white border border-gray-200 rounded-full focus:outline-none focus:border-blue-600 transition-all font-bold text-[#1E293B] placeholder:text-gray-300 placeholder:font-medium text-[13px] shadow-[0_2px_4px_rgba(0,0,0,0.02)]";
    const labelCls = "text-[11px] font-black text-[#1E293B] uppercase tracking-[0.1em] mb-2.5 block";

    return (
        <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-4 py-12 lg:py-20 selection:bg-blue-900/10 selection:text-blue-900">
            <div className="max-w-[1240px] w-full bg-white rounded-[40px] shadow-[0_40px_100px_-20px_rgba(15,23,42,0.1)] overflow-hidden border border-gray-100 p-8 lg:p-14">
                
                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12 border-b border-gray-100 pb-10">
                    <div>
                        <div className="flex items-center gap-3 mb-3">
                            <div className="p-2 bg-blue-900 rounded-xl text-white shadow-lg">
                                <Pill className="w-5 h-5" />
                            </div>
                            <span className="text-xs font-black uppercase tracking-[0.2em] text-blue-900">Dwarika Pharmacy</span>
                        </div>
                        <h1 className="text-4xl font-black text-gray-900 uppercase tracking-tight">Request Medication</h1>
                    </div>
                    <div className="flex items-center gap-4 text-gray-400 font-bold uppercase tracking-widest text-[10px]">
                        <span>System Version 2.0</span>
                        <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                    </div>
                </div>

                {/* Step 1: Customer Information */}
                <section className="mb-14">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="h-8 w-1 bg-blue-900 rounded-full" />
                        <h3 className="text-xl font-black uppercase tracking-tight text-gray-900">Patient & Delivery Info</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="space-y-1">
                            <label className={labelCls}>Full Name *</label>
                            <input name="name" value={customerInfo.name} onChange={handleInfoChange} placeholder="John Doe" className={inputCls} />
                        </div>
                        <div className="space-y-1">
                            <label className={labelCls}>Phone Number *</label>
                            <input name="phone" value={customerInfo.phone} onChange={handleInfoChange} placeholder="+977-9800000000" className={inputCls} />
                        </div>
                        <div className="space-y-1">
                            <label className={labelCls}>Delivery Address *</label>
                            <input name="address" value={customerInfo.address} onChange={handleInfoChange} placeholder="Tole, Ward No, Municipality" className={inputCls} />
                        </div>
                    </div>
                </section>

                {/* Step 2: Medicine Entry Row */}
                <section className="mb-8">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="h-8 w-1 bg-blue-900 rounded-full" />
                        <h3 className="text-xl font-black uppercase tracking-tight text-gray-900">Medication Details</h3>
                    </div>
                    
                    <div className="bg-gray-50/50 p-8 rounded-[32px] border border-gray-100">
                        <div className="grid grid-cols-1 md:grid-cols-6 lg:grid-cols-11 gap-4 items-end">
                            <div className="md:col-span-2 lg:col-span-3 space-y-1">
                                <label className={labelCls}>Medicine Name *</label>
                                <input name="name" value={currentEntry.name} onChange={handleEntryChange} placeholder="e.g. Flexon" className={inputCls.replace('pl-11', 'pl-6')} />
                            </div>
                            <div className="md:col-span-1 lg:col-span-2 space-y-1">
                                <label className={labelCls}>Strength</label>
                                <input name="strength" value={currentEntry.strength} onChange={handleEntryChange} placeholder="e.g. 500mg" className={inputCls.replace('pl-11', 'pl-6')} />
                            </div>
                            <div className="md:col-span-1 lg:col-span-1 space-y-1">
                                <label className={labelCls}>Qty *</label>
                                <input type="number" name="quantity" value={currentEntry.quantity} onChange={handleEntryChange} placeholder="0" min="0" className={inputCls.replace('pl-11', 'pl-4')} />
                            </div>
                            <div className="md:col-span-1 lg:col-span-1.5 space-y-1 relative group">
                                <label className={labelCls}>Unit</label>
                                <select name="unit" value={currentEntry.unit} onChange={handleEntryChange} className={cn(inputCls, "pl-4 pr-10 appearance-none")}>
                                    <option>Pcs</option>
                                    <option>Tab</option>
                                    <option>Cap</option>
                                    <option>Syp</option>
                                    <option>Inj</option>
                                    <option>Bottle</option>
                                    <option>File</option>
                                </select>
                                <div className="absolute right-5 bottom-4 pointer-events-none text-gray-400">
                                    <ChevronDown className="w-4 h-4" />
                                </div>
                            </div>
                            <div className="md:col-span-1 lg:col-span-1.5 space-y-1">
                                <label className={labelCls}>Rate (P/U)</label>
                                <input type="number" name="rate" value={currentEntry.rate} onChange={handleEntryChange} placeholder="Auto" min="0" className={inputCls.replace('pl-11', 'pl-4')} />
                            </div>
                            <div className="md:col-span-1 lg:col-span-2">
                                <button
                                    onClick={addMedicine}
                                    className="w-full py-3.5 bg-blue-900 text-white rounded-full font-black uppercase tracking-widest text-[10px] hover:bg-black transition-all flex items-center justify-center gap-2"
                                >
                                    {isEditingId ? <Edit2 className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                                    {isEditingId ? "Update Item" : "Add Medicine"}
                                </button>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Step 3: Medication Table */}
                <div className="overflow-x-auto mb-14">
                    <table className="w-full text-left border-separate border-spacing-y-3">
                        <thead>
                            <tr className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-600 bg-slate-100/50">
                                <th className="px-6 py-4">S.No</th>
                                <th className="px-6 py-4">Medicine</th>
                                <th className="px-6 py-4">Strength</th>
                                <th className="px-6 py-4 text-center">Qty / Unit</th>
                                <th className="px-6 py-4 text-right">Rate</th>
                                <th className="px-6 py-4 text-right">Total</th>
                                <th className="px-6 py-4 text-center">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            <AnimatePresence>
                                {medicines.map((med, idx) => (
                                    <motion.tr
                                        key={med.id}
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        className="bg-[#F8FAFC] group hover:bg-white hover:shadow-xl hover:shadow-blue-900/5 transition-all rounded-2xl border border-transparent hover:border-blue-100"
                                    >
                                        <td className="px-6 py-5 font-black text-slate-500 first:rounded-l-2xl w-16">{idx + 1}.</td>
                                        <td className="px-6 py-5 font-black text-gray-900">{med.name}</td>
                                        <td className="px-6 py-5 font-bold text-gray-500 uppercase text-[11px]">{med.strength || '-'}</td>
                                        <td className="px-6 py-5 text-center font-black text-blue-900 text-sm whitespace-nowrap">
                                            {med.quantity} <span className="text-[10px] text-gray-400 ml-1">{med.unit}</span>
                                        </td>
                                        <td className="px-6 py-5 text-right font-bold text-gray-600">Rs. {med.rate.toLocaleString()}</td>
                                        <td className="px-6 py-5 text-right font-black text-gray-900">Rs. {med.total.toLocaleString()}</td>
                                        <td className="px-6 py-5 last:rounded-r-2xl text-center">
                                            <div className="flex items-center justify-center gap-2">
                                                <button onClick={() => editMedicine(med)} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-all">
                                                    <Edit2 className="w-4 h-4" />
                                                </button>
                                                <button onClick={() => deleteMedicine(med.id)} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all">
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </motion.tr>
                                ))}
                            </AnimatePresence>
                            {medicines.length === 0 && (
                                <tr>
                                    <td colSpan={7} className="py-20 text-center text-slate-400 font-bold uppercase tracking-[0.1em] italic"> No medications added yet</td>
                                </tr>
                            )}
                        </tbody>
                        <tfoot className="border-t-[4px] border-slate-200">
                            <tr>
                                <td colSpan={7} className="p-8">
                                    <div className="bg-white rounded-[32px] border-2 border-slate-200 shadow-xl overflow-hidden flex flex-col lg:flex-row min-h-[450px]">
                                        
                                        {/* Left Side: Statement Note (Vertical Center) */}
                                        <div className="flex-1 p-12 flex flex-col justify-center bg-slate-50/30 border-b lg:border-b-0 lg:border-r-2 border-slate-100 relative">
                                            <div className="space-y-6 relative z-10 max-w-xl">
                                                <div className="flex items-center gap-3 text-[12px] font-black uppercase text-slate-500 tracking-[0.3em]">
                                                    <div className="w-2.5 h-2.5 bg-blue-700 rounded-full shadow-sm shadow-blue-700/20" />
                                                    Billing Amount Certification
                                                </div>
                                                <div className="relative">
                                                    <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-blue-700 rounded-full" />
                                                    <p className="text-2xl font-black text-slate-900 pl-10 py-4 italic leading-relaxed tracking-tight">
                                                        {numberToWords(netTotal)}
                                                        <span className="text-blue-700/30 not-italic ml-2 text-3xl">.</span>
                                                    </p>
                                                </div>
                                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-10 opacity-70">
                                                    System generated formal amount conversion
                                                </p>
                                            </div>
                                            
                                            {/* Decorative Background Element */}
                                            <div className="absolute right-10 bottom-10 opacity-[0.03] pointer-events-none">
                                                <FileText className="w-48 h-48" />
                                            </div>
                                        </div>

                                        {/* Right Side: Calculation Zone (Structured) */}
                                        <div className="w-full lg:w-[420px] p-12 bg-white flex flex-col justify-between">
                                            <div className="space-y-8">
                                                <div className="flex justify-between items-center text-[11px] font-black uppercase tracking-[0.2em] text-slate-500">
                                                    <span>Gross Subtotal</span>
                                                    <span className="text-slate-900 font-black text-base italic">Rs. {subtotal.toLocaleString()}</span>
                                                </div>
                                                
                                                {/* Adjusted Metrics Stack */}
                                                <div className="space-y-6 py-8 border-y-2 border-slate-50">
                                                    {/* Discount Row */}
                                                    <div className="flex justify-between items-center">
                                                        <div className="flex flex-col gap-1">
                                                            <span className="text-[11px] font-black uppercase tracking-[0.2em] text-red-700">Discount</span>
                                                            <span className="text-[9px] font-bold text-slate-400 uppercase">Admin Applied</span>
                                                        </div>
                                                        <div className="flex items-center gap-3">
                                                            <span className="text-sm font-black text-red-600">-</span>
                                                            <span className="text-lg font-black text-slate-900 bg-red-50/50 px-5 py-2.5 rounded-xl border-2 border-red-100/50 min-w-[140px] text-right">
                                                                {financials.discount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                                            </span>
                                                        </div>
                                                    </div>

                                                    {/* Adjustment Row */}
                                                    <div className="flex justify-between items-center">
                                                        <div className="flex flex-col gap-1">
                                                            <span className="text-[11px] font-black uppercase tracking-[0.2em] text-blue-800">Adjustment</span>
                                                            <span className="text-[9px] font-bold text-slate-400 uppercase">System Final</span>
                                                        </div>
                                                        <div className="flex items-center gap-3">
                                                            <span className="text-sm font-black text-slate-500">±</span>
                                                            <span className="text-lg font-black text-slate-900 bg-blue-50/50 px-5 py-2.5 rounded-xl border-2 border-blue-100/50 min-w-[140px] text-right">
                                                                {financials.adjustment.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                                            </span>
                                                        </div>
                                                    </div>

                                                    {/* Round Off Row */}
                                                    <div className="flex justify-between items-center">
                                                        <div className="flex flex-col gap-1">
                                                            <span className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-700">Round Off</span>
                                                            <span className="text-[9px] font-bold text-slate-400 uppercase">Automatic</span>
                                                        </div>
                                                        <div className="flex items-center gap-3">
                                                            <span className="text-sm font-black text-slate-400">≈</span>
                                                            <span className="text-lg font-black text-slate-900 bg-slate-50 px-5 py-2.5 rounded-xl border-2 border-slate-100 min-w-[140px] text-right">
                                                                {financials.roundOff.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="flex justify-between items-end pt-4">
                                                    <div className="flex flex-col gap-2">
                                                        <span className="text-[11px] font-black uppercase tracking-[0.5em] text-blue-900">Net Payable</span>
                                                        <span className="text-5xl font-black text-slate-900 tracking-tighter leading-none italic">
                                                            Rs. {netTotal.toLocaleString()}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            <button
                                                onClick={handleSubmit}
                                                disabled={isLoading || medicines.length === 0}
                                                className="w-full mt-10 py-6 bg-slate-900 hover:bg-black text-white rounded-[24px] font-black uppercase tracking-[0.3em] text-[12px] shadow-2xl transition-all flex items-center justify-center gap-4 active:scale-95 disabled:bg-slate-200 disabled:text-slate-500"
                                            >
                                                {isLoading ? (
                                                    <Loader2 className="w-5 h-5 animate-spin" />
                                                ) : (
                                                    <>
                                                        <Send className="w-5 h-5" />
                                                        Submit Request
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                </td>
                            </tr>
                        </tfoot>
                    </table>
                </div>

            </div>
        </div>
    );
};

export default PharmacyPage;
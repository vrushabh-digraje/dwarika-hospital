import { useState, useEffect, useMemo, useRef } from 'react';
import { 
    Pill, Send, Loader2, 
    Plus, Trash2, Edit2, Upload, CheckCircle2, Info, Hash, Phone, User, MapPin
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import { cn } from '../lib/utils';
import { 
    PROVINCES, DISTRICTS_BY_PROVINCE, GET_MUNICIPALITIES 
} from '../constants/nepalData';

// Helper to convert number to words
const numberToWords = (num: number): string => {
    if (num <= 0) return 'Zero';
    const a = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
    const b = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
    
    const count = (n: number): string => {
        if (n < 20) return a[n];
        if (n < 100) return b[Math.floor(n / 10)] + (n % 10 !== 0 ? ' ' + a[n % 10] : '');
        if (n < 1000) return a[Math.floor(n / 100)] + ' Hundred' + (n % 100 !== 0 ? ' and ' + count(n % 100) : '');
        if (n < 100000) return count(Math.floor(n / 1000)) + ' Thousand' + (n % 1000 !== 0 ? ' ' + count(n % 1000) : '');
        return n.toString();
    };
    
    return (count(Math.floor(num)) + ' Rupees Only').trim();
};

interface MedicineEntry {
    id: string;
    form: string;
    name: string;
    strength: string;
    quantity: number;
    unit: string;
    rate: number;
    total: number;
}

const MEDICINE_FORMS = ['Tab.', 'Syp.', 'Inj.', 'Ivf', 'Drop', 'Cap.', 'R/H', 'NA'];
const MEDICINE_UNITS = ['Pcs', 'File', 'Bottle', 'Vial', 'Ampoule', 'Box', 'Strip', 'Set'];

const MOCK_DRUG_BRANDS: Record<string, string[]> = {
    'Paracetamol': ['Napa', 'Ace', 'Panadol', 'Calpol', 'Tylenol'],
    'Amoxicillin': ['Mox', 'Amoxil', 'Clamoxyl', 'Novamox'],
    'Cetirizine': ['Alset', 'Zyrtec', 'Cetzine', 'Okacet'],
    'Metformin': ['Glycomet', 'Obemet', 'Cetapin', 'Glucophage'],
    'Pantoprazole': ['Pantocid', 'Pan', 'Pantodac', 'Protonix'],
    'Amlodipine': ['Amlong', 'Amlokind', 'Stamp', 'Norvasc'],
    'Azithromycin': ['Azithral', 'Zady', 'Azee', 'Zithromax']
};

const PharmacyPage = () => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isLoading, setIsLoading] = useState(false);
    
    const [customerInfo, setCustomerInfo] = useState({
        name: '',
        phone: '',
        panVatNo: '',
        country: 'Nepal',
        province: '',
        district: '',
        municipality: '',
        ward: '',
        tole: '',
        landmark: ''
    });

    const [generalMedDetails, setGeneralMedDetails] = useState({
        genericName: '',
        options: [] as string[],
        prescriptionFile: null as File | null
    });

    const [medicines, setMedicines] = useState<MedicineEntry[]>([]);
    const [financials, setFinancials] = useState({
        discount: 0,
        adjustment: 0,
        roundOff: 0,
        deliveryCharge: 0
    });

    const [isEditingId, setIsEditingId] = useState<string | null>(null);

    const [currentEntry, setCurrentEntry] = useState({
        form: 'Tab.',
        name: '',
        strength: '',
        quantity: '',
        unit: 'Pcs',
        rate: ''
    });

    const subtotal = useMemo(() => medicines.reduce((sum, item) => sum + item.total, 0), [medicines]);
    const netTotal = Math.max(0, subtotal + financials.deliveryCharge + financials.roundOff - financials.discount - financials.adjustment);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const handleInfoChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setCustomerInfo(prev => ({ ...prev, [name]: value }));
    };

    const handleFinancialChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFinancials(prev => ({ ...prev, [name]: parseFloat(value) || 0 }));
    };

    const handleEntryChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        let finalValue = value;
        if (type === 'number' && parseFloat(value) < 0) finalValue = '0';
        setCurrentEntry(prev => ({ ...prev, [name]: finalValue }));
    };

    const filteredBrands = useMemo(() => {
        const query = generalMedDetails.genericName.toLowerCase().trim();
        if (!query) return Object.values(MOCK_DRUG_BRANDS).flat().slice(0, 8);
        const match = Object.keys(MOCK_DRUG_BRANDS).find(k => k.toLowerCase().includes(query));
        if (match) return MOCK_DRUG_BRANDS[match];
        return Object.values(MOCK_DRUG_BRANDS).flat().filter(b => b.toLowerCase().includes(query));
    }, [generalMedDetails.genericName]);

    const selectBrand = (brand: string) => {
        setCurrentEntry(prev => ({ ...prev, name: brand }));
    };

    const handlePrescriptionUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setGeneralMedDetails(prev => ({ ...prev, prescriptionFile: e.target.files![0] }));
        }
    };

    const addMedicine = () => {
        if (!currentEntry.name || !currentEntry.quantity) return;
        const rateNum = parseFloat(currentEntry.rate) || 0;
        const qtyNum = parseFloat(currentEntry.quantity) || 0;
        const newEntry: MedicineEntry = {
            id: isEditingId || Math.random().toString(36).substr(2, 9),
            form: currentEntry.form,
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
        setCurrentEntry({ form: 'Tab.', name: '', strength: '', quantity: '', unit: 'Pcs', rate: '' });
    };

    const deleteMedicine = (id: string) => {
        setMedicines(prev => prev.filter(m => m.id !== id));
    };

    const editMedicine = (med: MedicineEntry) => {
        setIsEditingId(med.id);
        setCurrentEntry({
            form: med.form,
            name: med.name,
            strength: med.strength,
            quantity: med.quantity.toString(),
            unit: med.unit,
            rate: med.rate.toString()
        });
    };

    const handleSubmit = async () => {
        if (medicines.length === 0) return;
        setIsLoading(true);
        await new Promise(resolve => setTimeout(resolve, 2000));
        setIsLoading(false);
        alert('Requisition Submitted Successfully');
    };

    const cardCls = "bg-white rounded-[32px] border-2 border-slate-100 shadow-xl shadow-slate-200/50 p-10";
    const labelCls = "text-[12px] font-black uppercase tracking-[0.15em] text-slate-700 mb-2 block";
    const inputCls = "w-full rounded-2xl border-2 border-slate-200 bg-slate-50 px-5 py-4 text-sm font-black text-slate-950 focus:outline-none focus:bg-white focus:border-blue-700 focus:ring-4 focus:ring-blue-700/10 transition-all placeholder:text-slate-500";

    const selectIndicatorStyle = {
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='18' height='18' viewBox='0 0 20 20' fill='none'%3E%3Cpath d='M6 8L10 12L14 8' stroke='%23475569' stroke-width='3' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`,
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'right 1rem center',
        backgroundSize: '14px',
    } as const;

    const availableDistricts = customerInfo.province ? DISTRICTS_BY_PROVINCE[customerInfo.province as keyof typeof DISTRICTS_BY_PROVINCE] || [] : [];
    const availableMunicipalities = customerInfo.district ? GET_MUNICIPALITIES(customerInfo.district) : [];

    return (
        <div className="min-h-screen bg-[#f0f4f8] py-16 px-4 sm:px-6 lg:px-8 relative selection:bg-blue-600 selection:text-white">
            {/* Background elements */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/5 blur-[120px] rounded-full" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/5 blur-[120px] rounded-full" />
            </div>

            <div className="max-w-7xl mx-auto space-y-10 relative">
                {/* Header Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 pb-10 border-b border-slate-200/60">
                    <div className="space-y-4">
                        <motion.div 
                            initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-600/10 text-blue-700 text-[10px] font-black uppercase tracking-widest"
                        >
                            <Pill className="w-3.5 h-3.5" /> Clinical Pharmacy Requisition
                        </motion.div>
                        <motion.h1 
                            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                            className="text-5xl font-black text-slate-900 tracking-tighter uppercase leading-[0.9]"
                        >
                            Pharmacy <span className="text-blue-600">Sync</span> System
                        </motion.h1>
                    </div>
                    <div className="text-right">
                        <div className="inline-flex items-center gap-3 px-6 py-4 bg-white/50 backdrop-blur-md rounded-2xl border border-white/80 shadow-soft">
                            <div className="space-y-0.5">
                                <p className="text-[11px] font-black text-slate-600 uppercase tracking-widest">Active Server Time</p>
                                <p className="text-sm font-black text-slate-950 font-outfit">{new Date().toLocaleString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true })}</p>
                            </div>
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.5)]" />
                        </div>
                    </div>
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    
                    <div className="lg:col-span-12 space-y-8">
                        {/* Section I: Identity */}
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className={cardCls}>
                            <div className="flex items-center gap-4 mb-8">
                                <div className="w-1.5 h-8 bg-blue-600 rounded-full" />
                                <h3 className="text-2xl font-black text-slate-900 tracking-tight uppercase">I. Patient Identity & Address</h3>
                            </div>
                            
                            <div className="space-y-8">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className="space-y-1">
                                        <label className={labelCls}><User className="w-3 h-3 inline mr-1" /> Full Name</label>
                                        <input name="name" value={customerInfo.name} onChange={handleInfoChange} placeholder="Enter full name" className={inputCls} />
                                    </div>
                                    <div className="space-y-1">
                                        <label className={labelCls}><Phone className="w-3 h-3 inline mr-1" /> Contact No.</label>
                                        <input name="phone" value={customerInfo.phone} onChange={handleInfoChange} placeholder="+977" className={inputCls} />
                                    </div>
                                    <div className="space-y-1">
                                        <label className={labelCls}><Hash className="w-3 h-3 inline mr-1" /> PAN / VAT No.</label>
                                        <input name="panVatNo" value={customerInfo.panVatNo} onChange={handleInfoChange} placeholder="Optional" className={inputCls} />
                                    </div>
                                </div>

                                <div className="p-8 bg-slate-50/50 rounded-3xl border border-slate-100/80 space-y-6">
                                    <div className="flex items-center gap-2 mb-4">
                                        <MapPin className="w-4 h-4 text-blue-600" />
                                        <span className="text-[11px] font-black text-slate-700 uppercase tracking-widest">Delivery Destination</span>
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                        <select name="country" value={customerInfo.country} onChange={handleInfoChange} className={cn(inputCls, "appearance-none pr-10")} style={selectIndicatorStyle}>
                                            <option>Nepal</option>
                                            <option>India</option>
                                        </select>
                                        <select name="province" value={customerInfo.province} onChange={(e) => setCustomerInfo(prev => ({ ...prev, province: e.target.value, district: '', municipality: '' }))} className={cn(inputCls, "appearance-none pr-10")} style={selectIndicatorStyle}>
                                            <option value="">Select Province</option>
                                            {PROVINCES.map(p => <option key={p} value={p}>{p}</option>)}
                                        </select>
                                        <select name="district" value={customerInfo.district} onChange={(e) => setCustomerInfo(prev => ({ ...prev, district: e.target.value, municipality: '' }))} className={cn(inputCls, "appearance-none pr-10")} style={selectIndicatorStyle} disabled={!customerInfo.province}>
                                            <option value="">{customerInfo.province ? 'Select District' : 'Select province first'}</option>
                                            {availableDistricts.map(d => <option key={d} value={d}>{d}</option>)}
                                        </select>
                                        <select name="municipality" value={customerInfo.municipality} onChange={handleInfoChange} className={cn(inputCls, "appearance-none pr-10")} style={selectIndicatorStyle} disabled={!customerInfo.district}>
                                            <option value="">{customerInfo.district ? 'Select Municipality' : 'Select District first'}</option>
                                            {availableMunicipalities.map(m => <option key={m} value={m}>{m}</option>)}
                                        </select>
                                        <input name="ward" value={customerInfo.ward} onChange={handleInfoChange} placeholder="Ward No." className={inputCls} />
                                        <input name="tole" value={customerInfo.tole} onChange={handleInfoChange} placeholder="Village / Tole" className={inputCls} />
                                    </div>
                                    <div className="space-y-1">
                                        <label className={labelCls}>Specific Landmark / Instructions</label>
                                        <input name="landmark" value={customerInfo.landmark} onChange={handleInfoChange} placeholder="Type specific instructions here..." className={inputCls} />
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Section II: Generic Medication */}
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className={cardCls}>
                            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                                <div className="lg:col-span-7 space-y-8">
                                    <div className="flex items-center gap-4">
                                        <div className="w-1.5 h-8 bg-blue-600 rounded-full" />
                                        <h3 className="text-2xl font-black text-slate-900 tracking-tight uppercase">II. Medicine Specification</h3>
                                    </div>
                                    
                                    <div className="space-y-6">
                                        <div className="space-y-2">
                                            <label className={labelCls}>Generic / Classification Name</label>
                                            <div className="relative group">
                                                <input 
                                                    value={generalMedDetails.genericName} 
                                                    onChange={(e) => setGeneralMedDetails(prev => ({ ...prev, genericName: e.target.value }))}
                                                    placeholder="Example: Paracetamol, Amoxicillin..." 
                                                    className={cn(inputCls, "pl-14 !py-5 text-base shadow-sm group-hover:border-blue-400 transition-all")} 
                                                />
                                                <div className="absolute left-4 top-1/2 -translate-y-1/2 w-8 h-8 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
                                                    <SearchIcon />
                                                </div>
                                            </div>
                                        </div>

                                        {/* Integrated Brand Suggestions */}
                                        <div className="p-6 bg-slate-100/50 rounded-3xl border border-slate-200 flex flex-col gap-4">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <Pill className="w-4 h-4 text-blue-700" />
                                                    <span className="text-[11px] font-black text-slate-800 uppercase tracking-widest">Available verified Stock</span>
                                                </div>
                                                <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-green-600/10 text-green-700 text-[9px] font-black uppercase tracking-tighter">
                                                    <div className="w-1 h-1 bg-green-600 rounded-full animate-pulse" /> Live Now
                                                </div>
                                            </div>
                                            <div className="flex flex-wrap gap-2">
                                                <AnimatePresence>
                                                    {filteredBrands.map((brand, idx) => (
                                                        <motion.button
                                                            key={brand}
                                                            initial={{ opacity: 0, y: 5 }}
                                                            animate={{ opacity: 1, y: 0 }}
                                                            transition={{ delay: idx * 0.03 }}
                                                            onClick={() => selectBrand(brand)}
                                                            className={cn(
                                                                "px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-wider transition-all border-2 shadow-sm",
                                                                currentEntry.name === brand 
                                                                    ? "bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-600/30" 
                                                                    : "bg-white text-slate-800 border-slate-200 hover:border-slate-400 hover:text-blue-700 hover:bg-slate-50"
                                                            )}
                                                        >
                                                            {brand}
                                                        </motion.button>
                                                    ))}
                                                </AnimatePresence>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="lg:col-span-5 flex flex-col pt-2">
                                     <div className="flex items-center gap-3 mb-6">
                                        <div className="w-1.5 h-6 bg-blue-700/30 rounded-full" />
                                        <h3 className="text-lg font-black text-slate-900 tracking-tight uppercase">Medical Verification</h3>
                                    </div>
                                    <div 
                                        className="flex-1 min-h-[180px] bg-slate-50 rounded-[32px] border-2 border-dashed border-slate-300 flex flex-col items-center justify-center gap-4 group cursor-pointer hover:border-blue-600 hover:bg-blue-50/20 transition-all p-8 relative shadow-sm"
                                        onClick={() => fileInputRef.current?.click()}
                                    >
                                        <input type="file" ref={fileInputRef} onChange={handlePrescriptionUpload} className="hidden" accept="image/*,.pdf" />
                                        
                                        {generalMedDetails.prescriptionFile ? (
                                            <div className="flex flex-col items-center gap-3 text-center">
                                                <div className="w-14 h-14 bg-green-200 rounded-2xl flex items-center justify-center text-green-700 shadow-md">
                                                    <CheckCircle2 className="w-8 h-8" />
                                                </div>
                                                <div>
                                                    <p className="text-xs font-black uppercase tracking-widest text-slate-900">Document Attached</p>
                                                    <p className="text-[10px] font-bold text-slate-600 mt-1 truncate max-w-[180px]">
                                                        {generalMedDetails.prescriptionFile.name}
                                                    </p>
                                                </div>
                                            </div>
                                        ) : (
                                            <>
                                                <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-slate-600 group-hover:text-blue-700 group-hover:scale-105 shadow-md transition-all border border-slate-100">
                                                    <Upload className="w-7 h-7" />
                                                </div>
                                                <div className="text-center">
                                                    <p className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-900">Upload Prescription</p>
                                                    <p className="text-[10px] font-bold text-slate-500 uppercase mt-2">IMAGE OR PDF • MAX 10MB</p>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                {/* Section III: FULL REQUISITION LOG */}
                <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.5 }} className="lg:col-span-12 space-y-10 pt-16">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                         <div className="flex items-center gap-4">
                            <div className="w-2.5 h-10 bg-blue-600 rounded-sm" />
                            <h3 className="text-4xl font-black text-slate-900 tracking-tighter uppercase">III. Requisition Items</h3>
                        </div>
                        <div className="flex items-center gap-4 shrink-0 bg-white p-2 pr-6 rounded-[24px] border border-slate-200">
                             <div className="w-12 h-12 bg-blue-600 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-blue-600/20">
                                <Plus className="w-6 h-6" />
                             </div>
                             <div className="space-y-0.5">
                                 <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Current Status</p>
                                 <p className="text-sm font-black text-slate-900 uppercase tracking-tight">LOG ITEMS: {medicines.length}</p>
                             </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-[40px] border border-slate-200 shadow-ambient overflow-hidden">
                        {/* THE BAR */}
                        <div className="p-10 border-b border-slate-100 bg-[#f8fafc]/50">
                            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-end">
                                <div className="md:col-span-1.5 space-y-2">
                                    <label className={labelCls}>Form</label>
                                    <select name="form" value={currentEntry.form} onChange={handleEntryChange} className={cn(inputCls, "appearance-none pr-10 !py-4")} style={selectIndicatorStyle}>
                                        {MEDICINE_FORMS.map(f => <option key={f} value={f}>{f}</option>)}
                                    </select>
                                </div>
                                <div className="md:col-span-4 space-y-2">
                                    <label className={labelCls}>Medicine / Brand Choice</label>
                                    <input name="name" value={currentEntry.name} onChange={handleEntryChange} placeholder="Search or type brand name" className={cn(inputCls, "!py-4")} />
                                </div>
                                <div className="md:col-span-1.5 space-y-2">
                                    <label className={labelCls}>Strength</label>
                                    <input name="strength" value={currentEntry.strength} onChange={handleEntryChange} placeholder="500mg" className={cn(inputCls, "!py-4")} />
                                </div>
                                <div className="md:col-span-1 space-y-2">
                                    <label className={labelCls}>Qty</label>
                                    <input type="number" name="quantity" value={currentEntry.quantity} onChange={handleEntryChange} placeholder="0" className={cn(inputCls, "!py-4 text-center px-2")} />
                                </div>
                                <div className="md:col-span-1.5 space-y-2">
                                    <label className={labelCls}>Unit</label>
                                    <select name="unit" value={currentEntry.unit} onChange={handleEntryChange} className={cn(inputCls, "appearance-none pr-10 !py-4 text-center")} style={selectIndicatorStyle}>
                                        {MEDICINE_UNITS.map(u => <option key={u} value={u}>{u}</option>)}
                                    </select>
                                </div>
                                <div className="md:col-span-1.5 space-y-2 font-outfit">
                                    <label className={labelCls}>Rate (P/U)</label>
                                    <input type="number" name="rate" value={currentEntry.rate} onChange={handleEntryChange} placeholder="0" className={cn(inputCls, "!py-4")} />
                                </div>
                                <div className="md:col-span-1">
                                    <button
                                        onClick={addMedicine}
                                        className="w-full h-[56px] bg-blue-600 hover:bg-slate-900 text-white rounded-2xl flex items-center justify-center transition-all active:scale-95 shadow-xl shadow-blue-600/20"
                                    >
                                        {isEditingId ? <Edit2 className="w-5 h-5" /> : <Plus className="w-6 h-6 stroke-[2.5]" />}
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* THE LOG */}
                        <div className="overflow-x-auto">
                            <AnimatePresence mode="popLayout">
                                {medicines.length > 0 && (
                                    <table className="w-full text-left border-collapse min-w-[1000px]">
                                        <thead>
                                            <tr className="border-b-2 border-slate-200 bg-slate-50/50">
                                                <th className="px-10 py-6 text-[11px] font-black text-slate-600 uppercase tracking-widest">Form</th>
                                                <th className="px-6 py-6 text-[11px] font-black text-slate-600 uppercase tracking-widest">Description / Brand Choice</th>
                                                <th className="px-6 py-6 text-[11px] font-black text-slate-600 uppercase tracking-widest text-center">Sth.</th>
                                                <th className="px-6 py-6 text-[11px] font-black text-slate-600 uppercase tracking-widest text-center">Volume</th>
                                                <th className="px-6 py-6 text-[11px] font-black text-slate-600 uppercase tracking-widest text-right">Rate</th>
                                                <th className="px-6 py-6 text-[11px] font-black text-slate-600 uppercase tracking-widest text-right">Total</th>
                                                <th className="px-10 py-6 text-[11px] font-black text-slate-600 uppercase tracking-widest text-center">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {medicines.map((med) => (
                                                <motion.tr 
                                                    layout
                                                    initial={{ opacity: 0, x: -10 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    exit={{ opacity: 0, x: 10 }}
                                                    key={med.id} 
                                                    className="group hover:bg-blue-50/50 transition-colors border-b border-slate-100"
                                                >
                                                    <td className="px-10 py-6 font-black text-blue-700 text-sm">{med.form}.</td>
                                                    <td className="px-6 py-6">
                                                        <p className="text-base font-black text-slate-900 uppercase tracking-tight">{med.name}</p>
                                                    </td>
                                                    <td className="px-6 py-6 text-center text-xs font-bold text-slate-600 capitalize">{med.strength}</td>
                                                    <td className="px-6 py-6 text-center">
                                                        <span className="px-4 py-1.5 rounded-full bg-slate-100 text-[11px] font-black text-slate-800 uppercase border border-slate-300">
                                                            {med.quantity} {med.unit}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-6 text-right font-outfit text-sm font-bold text-slate-700">Rs. {med.rate.toLocaleString()}</td>
                                                    <td className="px-6 py-6 text-right font-outfit text-base font-black text-slate-900 border-r-4 border-transparent group-hover:border-blue-600 transition-all">Rs. {(med.quantity * med.rate).toLocaleString()}</td>
                                                    <td className="px-10 py-6">
                                                        <div className="flex items-center justify-center gap-3">
                                                            <button onClick={() => editMedicine(med)} className="p-3 rounded-xl bg-white border border-slate-200 text-slate-700 hover:text-blue-700 hover:border-blue-600 shadow-sm transition-all"><Edit2 className="w-4 h-4" /></button>
                                                            <button onClick={() => deleteMedicine(med.id)} className="p-3 rounded-xl bg-white border border-slate-200 text-red-600 hover:bg-red-50 hover:border-red-600 shadow-sm transition-all"><Trash2 className="w-4 h-4" /></button>
                                                        </div>
                                                    </td>
                                                </motion.tr>
                                            ))}
                                        </tbody>
                                    </table>
                                )}
                            </AnimatePresence>
                        </div>                        {/* SUM ZONE */}
                        <div className="bg-slate-100/50 p-6 lg:p-10 border-t-2 border-slate-200 rounded-b-[40px]">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                                 <div className="space-y-6">
                                     <div className="space-y-2 pt-2 border-b-2 border-slate-200 pb-6">
                                         <div className="flex items-center gap-2">
                                             <CheckCircle2 className="w-4 h-4 text-green-700" />
                                             <span className="text-[12px] font-black text-slate-700 uppercase tracking-widest leading-none">Official Valuation</span>
                                         </div>
                                         <h4 className="text-2xl font-black italic text-slate-900 tracking-tighter capitalize">
                                             {netTotal > 0 ? numberToWords(netTotal) : 'Zero Rupees Only'}
                                         </h4>
                                     </div>
                                     <div className="flex items-start gap-4 p-5 bg-blue-50 rounded-3xl border border-blue-200 shadow-sm max-w-md">
                                         <Info className="w-5 h-5 text-blue-700 shrink-0 mt-0.5" />
                                         <p className="text-[10px] font-bold text-blue-900 uppercase tracking-[0.15em] leading-relaxed">
                                             Note: Preliminary estimate. Final confirmation will be coordinated via the clinical pharmacy desk before final billing.
                                         </p>
                                     </div>
                                 </div>

                                 <div className="bg-white p-8 rounded-[32px] border-2 border-slate-200 shadow-md">
                                     <div className="space-y-6">
                                         <div className="flex items-center justify-between pb-4 border-b border-slate-100 group">
                                             <span className="text-[12px] font-black text-slate-600 uppercase tracking-widest">Gross Subtotal</span>
                                             <span className="text-2xl font-black font-outfit text-slate-950">Rs. {subtotal.toLocaleString()}</span>
                                         </div>
                                         
                                         <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                                             <div className="space-y-1">
                                                 <label className="text-[11px] font-black text-slate-700 uppercase tracking-widest">Round Off</label>
                                                 <input type="number" value={financials.roundOff} onChange={handleFinancialChange} name="roundOff" className={cn(inputCls, "!py-3 text-base")} />
                                             </div>
                                             <div className="space-y-1">
                                                 <label className="text-[11px] font-black text-slate-700 uppercase tracking-widest">Discount</label>
                                                 <input type="number" value={financials.discount} onChange={handleFinancialChange} name="discount" className={cn(inputCls, "!py-3 text-base text-red-700")} />
                                             </div>
                                             <div className="space-y-1">
                                                 <label className="text-[11px] font-black text-slate-700 uppercase tracking-widest">Adjustment</label>
                                                 <input type="number" value={financials.adjustment} onChange={handleFinancialChange} name="adjustment" className={cn(inputCls, "!py-3 text-base text-slate-800")} />
                                             </div>
                                             <div className="space-y-1">
                                                 <label className="text-[11px] font-black text-slate-700 uppercase tracking-widest">Delivery</label>
                                                 <input type="number" value={financials.deliveryCharge} onChange={handleFinancialChange} name="deliveryCharge" className={cn(inputCls, "!py-3 text-base")} />
                                             </div>
                                         </div>

                                         <div className="pt-6 flex items-center justify-between gap-6 border-t-2 border-slate-100">
                                             <div>
                                                 <span className="text-[11px] font-black text-slate-600 uppercase tracking-widest block mb-1">Net Payable</span>
                                                 <div className="flex items-baseline gap-1.5">
                                                     <span className="text-xs font-bold text-slate-400 font-outfit uppercase">NPR</span>
                                                     <span className="text-5xl font-black font-outfit tracking-tighter text-blue-700">
                                                         {netTotal.toLocaleString()}
                                                     </span>
                                                 </div>
                                             </div>
                                             <button
                                                 onClick={handleSubmit} disabled={isLoading}
                                                 className="h-16 px-10 bg-blue-700 hover:bg-slate-900 text-white rounded-[20px] font-black uppercase tracking-[0.2em] text-[11px] shadow-xl shadow-blue-700/30 transition-all flex items-center justify-center gap-4 active:scale-95 group overflow-hidden"
                                             >
                                                 {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <span>Submit Final Requisition</span>}
                                                 {!isLoading && <Send className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
                                             </button>
                                         </div>
                                     </div>
                                 </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>

                <div className="text-center pt-24 pb-12">
                    <p className="text-[12px] text-slate-500 font-black uppercase tracking-[0.5em]">Dwarika Clinical Management Standard • 2026 Verification</p>
                </div>
            </div>
        </div>
    );
};

const SearchIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600">
        <circle cx="11" cy="11" r="8"></circle>
        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
    </svg>
);

export default PharmacyPage;
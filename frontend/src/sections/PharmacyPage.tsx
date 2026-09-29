import { useState, useEffect, useMemo, useRef } from 'react';
import { 
    Pill, Send, Loader2, 
    Plus, Trash2, Edit2, Upload, CheckCircle2, Info, Hash, Phone, User, MapPin,
    Check, X, ArrowDown
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import { cn } from '../lib/utils';
import { 
    PROVINCES, DISTRICTS_BY_PROVINCE, GET_MUNICIPALITIES 
} from '../constants/nepalData';
import { cmsPublic } from '../lib/cmsClient';

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
    stock?: number;
    stockStatus?: string;
    supplierName?: string;
}

const MEDICINE_FORMS = ['Tab.', 'Syp.', 'Inj.', 'Ivf', 'Drop', 'Cap.', 'R/H', 'Blade', 'Gloves', 'Catheter', 'NA'];
const MEDICINE_UNITS = ['Pcs', 'File', 'Bottle', 'Vial', 'Ampoule', 'Box', 'Strip', 'Set'];

export interface CatalogMedicine {
    _id?: string;
    name: string;
    genericName: string;
    brandName?: string;
    companyName?: string;
    supplierName?: string;
    group?: 'Medicine' | 'Surgical' | 'Extra Item' | string;
    form?: string;
    strength?: string;
    unit?: string;
    rate: number;
    rateIC?: number;
    rateType?: 'IC' | 'NC';
    stock: number;
    minStockAlert?: number;
    stockStatus?: 'In Stock' | 'Low Stock' | 'Out of Stock' | string;
    description?: string;
    isNarcotics?: boolean;
}

const FALLBACK_MEDICINES: CatalogMedicine[] = [
    {
        _id: 'm1',
        name: 'Pantop 40',
        genericName: 'Pantoprazole',
        brandName: 'Pantop',
        companyName: 'Aristo Pharmaceuticals',
        supplierName: 'Parul Drug Distributors',
        group: 'Medicine',
        form: 'Tab.',
        strength: '40 mg',
        unit: 'Pcs',
        rate: 8.0,
        stock: 250,
        minStockAlert: 20,
        stockStatus: 'In Stock',
        description: 'Proton-pump inhibitor for acid reflux, GERD, and gastric ulcers.'
    },
    {
        _id: 'm2',
        name: 'Pantocid 40',
        genericName: 'Pantoprazole',
        brandName: 'Pantocid',
        companyName: 'Sun Pharma',
        supplierName: 'Shree Pharma Dist.',
        group: 'Medicine',
        form: 'Tab.',
        strength: '40 mg',
        unit: 'Strip',
        rate: 150.0,
        stock: 85,
        minStockAlert: 15,
        stockStatus: 'In Stock',
        description: 'Gastric acid secretion reducer.'
    },
    {
        _id: 'm3',
        name: 'Pansafe DSR',
        genericName: 'Pantoprazole + Domperidone',
        brandName: 'Pansafe DSR',
        companyName: 'Mankind Pharma',
        supplierName: 'Janakpur Medico',
        group: 'Medicine',
        form: 'Cap.',
        strength: '40 mg + 30 mg',
        unit: 'Strip',
        rate: 195.0,
        stock: 6,
        minStockAlert: 10,
        stockStatus: 'Low Stock',
        description: 'Dual action for acid reflux and nausea.'
    },
    {
        _id: 'm4',
        name: 'Fortiplex Syrup',
        genericName: 'Vitamin B Complex with Zinc',
        brandName: 'Fortiplex',
        companyName: 'Apex Laboratories',
        supplierName: 'Parul Drug Distributors',
        group: 'Medicine',
        form: 'Syp.',
        strength: '200 ml',
        unit: 'Bottle',
        rate: 165.0,
        stock: 45,
        minStockAlert: 10,
        stockStatus: 'In Stock',
        description: 'High potency vitamin B complex supplement.'
    },
    {
        _id: 'm5',
        name: 'Polybion Active',
        genericName: 'Vitamin B Complex with B12',
        brandName: 'Polybion',
        companyName: 'Procter & Gamble Health',
        supplierName: 'Nepal Healthcare Dist.',
        group: 'Medicine',
        form: 'Syp.',
        strength: '300 ml',
        unit: 'Bottle',
        rate: 210.0,
        stock: 0,
        minStockAlert: 5,
        stockStatus: 'Out of Stock',
        description: 'Energy release and vitamin replenishment syrup.'
    },
    {
        _id: 'm6',
        name: 'Livoluk Syrup',
        genericName: 'Lactulose Solution USP',
        brandName: 'Livoluk',
        companyName: 'Panacea Biotec',
        supplierName: 'Shree Pharma Dist.',
        group: 'Medicine',
        form: 'Syp.',
        strength: '200 ml',
        unit: 'Bottle',
        rate: 295.0,
        stock: 18,
        minStockAlert: 8,
        stockStatus: 'In Stock',
        description: 'Osmotic laxative for constipation management.'
    },
    {
        _id: 'm7',
        name: 'Smulac Syrup',
        genericName: 'Lactulose Oral Solution',
        brandName: 'Smulac',
        companyName: 'Macleods Pharma',
        supplierName: 'Parul Drug Distributors',
        group: 'Medicine',
        form: 'Syp.',
        strength: '100 ml',
        unit: 'Bottle',
        rate: 180.0,
        stock: 4,
        minStockAlert: 10,
        stockStatus: 'Low Stock',
        description: 'Gentle laxative syrup.'
    },
    {
        _id: 'm8',
        name: 'Sterilyte-NS (0.9% Normal Saline)',
        genericName: 'Sodium Chloride 0.9% w/v',
        brandName: 'Sterilyte-NS',
        companyName: 'Aculife Healthcare',
        supplierName: 'National Surgical House',
        group: 'Medicine',
        form: 'Ivf',
        strength: '500 ml',
        unit: 'Bottle',
        rate: 75.0,
        stock: 120,
        minStockAlert: 25,
        stockStatus: 'In Stock',
        description: 'Intravenous infusion solution for fluid replacement.'
    },
    {
        _id: 'm9',
        name: 'Centilink Surgical Blade #11',
        genericName: 'Carbon Steel Surgical Blade No. 11',
        brandName: 'Centilink Blades',
        companyName: 'Centilink Medtech',
        supplierName: 'National Surgical House',
        group: 'Surgical',
        form: 'Blade',
        strength: 'Size 11',
        unit: 'Box',
        rate: 420.0,
        stock: 30,
        minStockAlert: 5,
        stockStatus: 'In Stock',
        description: 'Sterile carbon steel surgical scalpel blades.'
    },
    {
        _id: 'm10',
        name: 'Surgicare Sterile Latex Surgical Gloves',
        genericName: 'Powder-free Surgical Gloves 7.5',
        brandName: 'Surgicare',
        companyName: 'Kanam Latex',
        supplierName: 'National Surgical House',
        group: 'Surgical',
        form: 'Gloves',
        strength: 'Size 7.5',
        unit: 'Box',
        rate: 750.0,
        stock: 15,
        minStockAlert: 10,
        stockStatus: 'In Stock',
        description: 'Latex surgical gloves with textured surface.'
    },
    {
        _id: 'm11',
        name: 'Foley Balloon Catheter 2-Way',
        genericName: 'Silicone Coated Latex Catheter 16 Fr',
        brandName: 'Romsons Foley',
        companyName: 'Romsons Group',
        supplierName: 'National Surgical House',
        group: 'Surgical',
        form: 'Catheter',
        strength: '16 Fr',
        unit: 'Pcs',
        rate: 135.0,
        stock: 2,
        minStockAlert: 10,
        stockStatus: 'Low Stock',
        description: 'Smooth silicone coated 2-way catheter for urinary drainage.'
    },
    {
        _id: 'm12',
        name: 'Nestle Cerelac Wheat & Apple',
        genericName: 'Infant Cereal Food',
        brandName: 'Cerelac',
        companyName: 'Nestle Nepal',
        supplierName: 'Central FMCG Stores',
        group: 'Extra Item',
        form: 'NA',
        strength: '300 g',
        unit: 'Box',
        rate: 380.0,
        stock: 40,
        minStockAlert: 5,
        stockStatus: 'In Stock',
        description: 'Fortified baby cereal for stage 1 infants.'
    }
];

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
    const [catalogMedicines, setCatalogMedicines] = useState<CatalogMedicine[]>(FALLBACK_MEDICINES);
    const [selectedMedicine, setSelectedMedicine] = useState<CatalogMedicine | null>(null);
    const [groupFilter, setGroupFilter] = useState<'All' | 'Medicine' | 'Surgical' | 'Extra Item'>('All');
    const [inStockOnly, setInStockOnly] = useState(false);
    const [isBarDropdownOpen, setIsBarDropdownOpen] = useState(false);

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
        // Fetch published medicines from CMS
        cmsPublic.medicines({ limit: 200 })
            .then(res => {
                if (res.items && res.items.length > 0) {
                    setCatalogMedicines(res.items);
                }
            })
            .catch(() => {
                // FALLBACK_MEDICINES is already set
            });
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
        if (name === 'name') {
            setIsBarDropdownOpen(true);
        }
    };

    // Fast keyword & partial matching across Generic Name, Brand Name, Supplier Name, Medicine Name, and Company Name
    const filteredCatalogMedicines = useMemo(() => {
        const query = generalMedDetails.genericName.toLowerCase().trim();
        return catalogMedicines.filter((m) => {
            if (groupFilter !== 'All' && m.group !== groupFilter) return false;
            if (inStockOnly && (m.stockStatus === 'Out of Stock' || m.stock <= 0)) return false;
            if (!query) return true;
            const name = (m.name || '').toLowerCase();
            const generic = (m.genericName || '').toLowerCase();
            const brand = (m.brandName || '').toLowerCase();
            const supplier = (m.supplierName || '').toLowerCase();
            const company = (m.companyName || '').toLowerCase();
            return (
                name.includes(query) ||
                generic.includes(query) ||
                brand.includes(query) ||
                supplier.includes(query) ||
                company.includes(query)
            );
        });
    }, [catalogMedicines, generalMedDetails.genericName, groupFilter, inStockOnly]);

    // Section III dropdown suggestions
    const barSuggestions = useMemo(() => {
        const query = (currentEntry.name || '').toLowerCase().trim();
        if (!query) return [];
        return catalogMedicines.filter((m) => {
            const name = (m.name || '').toLowerCase();
            const generic = (m.genericName || '').toLowerCase();
            const brand = (m.brandName || '').toLowerCase();
            const supplier = (m.supplierName || '').toLowerCase();
            return name.includes(query) || generic.includes(query) || brand.includes(query) || supplier.includes(query);
        }).slice(0, 8);
    }, [catalogMedicines, currentEntry.name]);

    const selectMedicine = (med: CatalogMedicine) => {
        setSelectedMedicine(med);
        setCurrentEntry(prev => ({
            ...prev,
            form: med.form || 'Tab.',
            name: med.name || med.brandName || '',
            strength: med.strength && med.strength !== 'NA' ? med.strength : '',
            unit: med.unit || 'Pcs',
            rate: String(med.rate ?? ''),
            quantity: prev.quantity || '1',
        }));
        setIsBarDropdownOpen(false);
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
            total: qtyNum * rateNum,
            stock: selectedMedicine?.stock,
            stockStatus: selectedMedicine?.stockStatus,
            supplierName: selectedMedicine?.supplierName,
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

                        {/* Section II: Generic Medication & Live Catalog Search */}
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className={cardCls}>
                            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                                <div className="lg:col-span-7 space-y-6">
                                    <div className="flex flex-wrap items-center justify-between gap-3">
                                        <div className="flex items-center gap-3">
                                            <div className="w-1.5 h-8 bg-blue-600 rounded-full" />
                                            <div>
                                                <h3 className="text-2xl font-black text-slate-900 tracking-tight uppercase">II. Medicine Specification</h3>
                                                <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Fast Search by Generic, Brand, Supplier, or Medicine</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-black uppercase tracking-wider border border-emerald-200">
                                            <div className="w-1.5 h-1.5 bg-emerald-600 rounded-full animate-pulse" /> Live CMS Connected
                                        </div>
                                    </div>
                                    
                                    <div className="space-y-4">
                                        <div className="space-y-1.5">
                                            <label className={labelCls}>Search Medicine (Generic, Brand, Supplier, or Medicine Name)</label>
                                            <div className="relative group">
                                                <input 
                                                    value={generalMedDetails.genericName} 
                                                    onChange={(e) => setGeneralMedDetails(prev => ({ ...prev, genericName: e.target.value }))}
                                                    placeholder="Search Generic (e.g. Pantoprazole), Brand (e.g. Pantop), Supplier (e.g. Parul)..." 
                                                    className={cn(inputCls, "pl-14 pr-12 !py-4 text-sm shadow-sm group-hover:border-blue-400 transition-all")} 
                                                />
                                                <div className="absolute left-4 top-1/2 -translate-y-1/2 w-8 h-8 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
                                                    <SearchIcon />
                                                </div>
                                                {generalMedDetails.genericName && (
                                                    <button
                                                        type="button"
                                                        onClick={() => setGeneralMedDetails(prev => ({ ...prev, genericName: '' }))}
                                                        className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                                                    >
                                                        <X className="w-4 h-4" />
                                                    </button>
                                                )}
                                            </div>
                                        </div>

                                        {/* Filter Chips */}
                                        <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                                            <div className="flex flex-wrap items-center gap-1.5">
                                                {(['All', 'Medicine', 'Surgical', 'Extra Item'] as const).map((grp) => (
                                                    <button
                                                        key={grp}
                                                        type="button"
                                                        onClick={() => setGroupFilter(grp)}
                                                        className={cn(
                                                            "px-3 py-1 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all border",
                                                            groupFilter === grp
                                                                ? "bg-slate-900 text-white border-slate-900 shadow-sm"
                                                                : "bg-white text-slate-600 border-slate-200 hover:border-slate-300"
                                                        )}
                                                    >
                                                        {grp === 'All' ? 'All Groups' : grp}
                                                    </button>
                                                ))}
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => setInStockOnly(!inStockOnly)}
                                                className={cn(
                                                    "px-3 py-1 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all border flex items-center gap-1",
                                                    inStockOnly
                                                        ? "bg-emerald-600 text-white border-emerald-600 shadow-sm"
                                                        : "bg-emerald-50 text-emerald-800 border-emerald-200 hover:border-emerald-300"
                                                )}
                                            >
                                                <span className="w-1.5 h-1.5 rounded-full bg-current" />
                                                In-Stock Only
                                            </button>
                                        </div>

                                        {/* Verified Stock Medicines Grid */}
                                        <div className="p-5 bg-slate-50/80 rounded-3xl border border-slate-200/80 flex flex-col gap-3">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <Pill className="w-4 h-4 text-blue-700" />
                                                    <span className="text-[11px] font-black text-slate-800 uppercase tracking-widest">
                                                        Matching Hospital Catalog ({filteredCatalogMedicines.length})
                                                    </span>
                                                </div>
                                                <span className="text-[10px] font-bold text-slate-500 uppercase">
                                                    Click to Select & Auto-Fill
                                                </span>
                                            </div>

                                            {filteredCatalogMedicines.length === 0 ? (
                                                <div className="py-8 text-center bg-white rounded-2xl border border-dashed border-slate-200 p-4">
                                                    <p className="text-xs font-bold text-slate-600">No medicines match &quot;{generalMedDetails.genericName}&quot;</p>
                                                    <p className="text-[10px] text-slate-400 mt-1">Try another keyword or manually enter details in Section III below.</p>
                                                </div>
                                            ) : (
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-[300px] overflow-y-auto pr-1">
                                                    <AnimatePresence>
                                                        {filteredCatalogMedicines.map((med, idx) => {
                                                            const isSelected = selectedMedicine?.name === med.name || currentEntry.name === med.name;
                                                            return (
                                                                <motion.button
                                                                    key={med._id || `${med.name}-${idx}`}
                                                                    initial={{ opacity: 0, y: 4 }}
                                                                    animate={{ opacity: 1, y: 0 }}
                                                                    transition={{ delay: Math.min(idx * 0.02, 0.2) }}
                                                                    onClick={() => selectMedicine(med)}
                                                                    type="button"
                                                                    className={cn(
                                                                        "p-3 rounded-2xl text-left transition-all border-2 flex flex-col justify-between gap-2 shadow-xs group",
                                                                        isSelected
                                                                            ? "bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-600/20"
                                                                            : "bg-white text-slate-800 border-slate-200 hover:border-blue-400 hover:shadow-sm"
                                                                    )}
                                                                >
                                                                    <div>
                                                                        <div className="flex items-start justify-between gap-1.5">
                                                                            <p className={cn("text-xs font-black uppercase tracking-tight line-clamp-1", isSelected ? "text-white" : "text-slate-900 group-hover:text-blue-700")}>
                                                                                {med.name}
                                                                            </p>
                                                                            <span className={cn(
                                                                                "text-[9px] font-bold px-1.5 py-0.5 rounded-md uppercase tracking-wider shrink-0",
                                                                                isSelected ? "bg-white/20 text-white" : "bg-slate-100 text-slate-600"
                                                                            )}>
                                                                                {med.form}
                                                                            </span>
                                                                        </div>
                                                                        <p className={cn("text-[10px] font-semibold truncate mt-0.5", isSelected ? "text-blue-100" : "text-slate-500")}>
                                                                            {med.genericName}
                                                                        </p>
                                                                        {med.supplierName && (
                                                                            <p className={cn("text-[9px] truncate mt-0.5", isSelected ? "text-blue-200" : "text-slate-400")}>
                                                                                Supplier: {med.supplierName}
                                                                            </p>
                                                                        )}
                                                                    </div>

                                                                    <div className="flex items-center justify-between pt-1 border-t border-current/10">
                                                                        <span className={cn("text-[11px] font-black font-mono", isSelected ? "text-white" : "text-blue-700")}>
                                                                            Rs. {Number(med.rate).toFixed(2)}
                                                                        </span>
                                                                        <span className={cn(
                                                                            "text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1",
                                                                            isSelected
                                                                                ? "bg-white text-blue-900 font-extrabold"
                                                                                : med.stockStatus === 'In Stock'
                                                                                    ? "bg-emerald-100 text-emerald-800"
                                                                                    : med.stockStatus === 'Low Stock'
                                                                                        ? "bg-amber-100 text-amber-800"
                                                                                        : "bg-rose-100 text-rose-800"
                                                                        )}>
                                                                            <span className="w-1.5 h-1.5 rounded-full bg-current" />
                                                                            {med.stockStatus === 'In Stock' ? `${med.stock} ${med.unit || 'Pcs'}` : med.stockStatus}
                                                                        </span>
                                                                    </div>
                                                                </motion.button>
                                                            );
                                                        })}
                                                    </AnimatePresence>
                                                </div>
                                            )}
                                        </div>

                                        {/* Selected Medicine Information Card */}
                                        {selectedMedicine && (
                                            <motion.div
                                                initial={{ opacity: 0, scale: 0.98 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                className="rounded-3xl border-2 border-blue-500/40 bg-gradient-to-br from-blue-50/90 to-sky-50/60 p-5 shadow-sm space-y-3.5"
                                            >
                                                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-blue-200/60 pb-3">
                                                    <div className="flex items-center gap-2.5">
                                                        <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-xs">
                                                            <Check className="w-4 h-4 stroke-[3]" />
                                                        </div>
                                                        <div>
                                                            <h4 className="text-sm font-black text-slate-900 uppercase tracking-tight">
                                                                Selected Medicine Details
                                                            </h4>
                                                            <p className="text-[10px] font-bold text-blue-700 uppercase tracking-wider">
                                                                Auto-filled in Section III below
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <span className={cn(
                                                        "px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider shadow-xs border flex items-center gap-1.5",
                                                        selectedMedicine.stockStatus === 'In Stock' ? "bg-emerald-100 text-emerald-800 border-emerald-300" :
                                                        selectedMedicine.stockStatus === 'Low Stock' ? "bg-amber-100 text-amber-800 border-amber-300" :
                                                        "bg-rose-100 text-rose-800 border-rose-300"
                                                    )}>
                                                        <span className="w-1.5 h-1.5 rounded-full bg-current" />
                                                        {selectedMedicine.stockStatus || 'In Stock'} ({selectedMedicine.stock} {selectedMedicine.unit || 'Pcs'} Available)
                                                    </span>
                                                </div>

                                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                                                    <div className="bg-white/80 rounded-2xl p-3 border border-blue-100">
                                                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Medicine Name</span>
                                                        <span className="font-black text-slate-900 block mt-0.5 truncate">{selectedMedicine.name}</span>
                                                    </div>
                                                    <div className="bg-white/80 rounded-2xl p-3 border border-blue-100">
                                                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Generic Name</span>
                                                        <span className="font-bold text-slate-800 block mt-0.5 truncate">{selectedMedicine.genericName}</span>
                                                    </div>
                                                    <div className="bg-white/80 rounded-2xl p-3 border border-blue-100">
                                                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Brand / Company</span>
                                                        <span className="font-bold text-slate-800 block mt-0.5 truncate">{selectedMedicine.brandName || selectedMedicine.companyName || selectedMedicine.name}</span>
                                                    </div>
                                                    <div className="bg-white/80 rounded-2xl p-3 border border-blue-100">
                                                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Supplier Name</span>
                                                        <span className="font-bold text-slate-800 block mt-0.5 truncate">{selectedMedicine.supplierName || 'Hospital Central Store'}</span>
                                                    </div>
                                                    <div className="bg-white/80 rounded-2xl p-3 border border-blue-100">
                                                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Form & Strength</span>
                                                        <span className="font-bold text-slate-800 block mt-0.5">{selectedMedicine.form} {selectedMedicine.strength && selectedMedicine.strength !== 'NA' ? selectedMedicine.strength : ''}</span>
                                                    </div>
                                                    <div className="bg-white/80 rounded-2xl p-3 border border-blue-100">
                                                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Unit</span>
                                                        <span className="font-bold text-slate-800 block mt-0.5">{selectedMedicine.unit}</span>
                                                    </div>
                                                    <div className="bg-white/80 rounded-2xl p-3 border border-blue-100">
                                                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Unit Price (NC)</span>
                                                        <span className="font-black text-blue-700 block mt-0.5 font-mono">Rs. {Number(selectedMedicine.rate).toFixed(2)}</span>
                                                    </div>
                                                    <div className="bg-white/80 rounded-2xl p-3 border border-blue-100">
                                                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Available Stock</span>
                                                        <span className="font-black text-emerald-700 block mt-0.5">{selectedMedicine.stock} {selectedMedicine.unit}</span>
                                                    </div>
                                                </div>

                                                <div className="pt-1 flex items-center justify-end">
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            const el = document.getElementById('requisition-items-section');
                                                            el?.scrollIntoView({ behavior: 'smooth' });
                                                        }}
                                                        className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black text-[11px] uppercase tracking-wider flex items-center gap-2 shadow-xs transition-all"
                                                    >
                                                        <span>Jump to Section III Requisition</span>
                                                        <ArrowDown className="w-3.5 h-3.5" />
                                                    </button>
                                                </div>
                                            </motion.div>
                                        )}
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
                <motion.div id="requisition-items-section" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.5 }} className="lg:col-span-12 space-y-10 pt-16">
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
                        <div className="p-8 md:p-10 border-b border-slate-100 bg-[#f8fafc]/50">
                            <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-end">
                                <div className="md:col-span-1.5 space-y-2">
                                    <label className={labelCls}>Form</label>
                                    <select name="form" value={currentEntry.form} onChange={handleEntryChange} className={cn(inputCls, "appearance-none pr-10 !py-4")} style={selectIndicatorStyle}>
                                        {MEDICINE_FORMS.map(f => <option key={f} value={f}>{f}</option>)}
                                    </select>
                                </div>
                                <div className="md:col-span-4 space-y-2 relative">
                                    <div className="flex items-center justify-between">
                                        <label className={labelCls}>Medicine / Brand Choice</label>
                                        {barSuggestions.length > 0 && isBarDropdownOpen && (
                                            <span className="text-[10px] text-blue-600 font-bold uppercase">{barSuggestions.length} found</span>
                                        )}
                                    </div>
                                    <input 
                                        name="name" 
                                        value={currentEntry.name} 
                                        onChange={handleEntryChange} 
                                        onFocus={() => setIsBarDropdownOpen(true)}
                                        placeholder="Search or type brand name" 
                                        className={cn(inputCls, "!py-4")} 
                                        autoComplete="off"
                                    />

                                    {/* Quick Autocomplete Suggestions Dropdown */}
                                    {isBarDropdownOpen && barSuggestions.length > 0 && (
                                        <div className="absolute left-0 right-0 top-full mt-2 bg-white rounded-2xl border border-slate-200 shadow-2xl z-50 max-h-64 overflow-y-auto divide-y divide-slate-100 p-1">
                                            {barSuggestions.map((sug) => (
                                                <button
                                                    key={sug._id || sug.name}
                                                    type="button"
                                                    onMouseDown={() => selectMedicine(sug)}
                                                    className="w-full p-3 text-left hover:bg-blue-50/80 rounded-xl transition-colors flex items-center justify-between gap-3"
                                                >
                                                    <div className="min-w-0">
                                                        <div className="flex items-center gap-2">
                                                            <p className="text-xs font-black text-slate-900 uppercase truncate">{sug.name}</p>
                                                            <span className="text-[9px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 uppercase font-bold shrink-0">{sug.form}</span>
                                                        </div>
                                                        <p className="text-[10px] text-slate-500 truncate mt-0.5">{sug.genericName} • {sug.supplierName || 'Hospital Supply'}</p>
                                                    </div>
                                                    <div className="text-right shrink-0">
                                                        <p className="text-xs font-black text-blue-700 font-mono">Rs. {Number(sug.rate).toFixed(2)}</p>
                                                        <span className={cn(
                                                            "text-[9px] font-black uppercase px-2 py-0.5 rounded-full inline-block mt-0.5",
                                                            sug.stockStatus === 'In Stock' ? "bg-emerald-100 text-emerald-800" :
                                                            sug.stockStatus === 'Low Stock' ? "bg-amber-100 text-amber-800" :
                                                            "bg-rose-100 text-rose-800"
                                                        )}>
                                                            ● {sug.stockStatus || 'In Stock'} ({sug.stock} {sug.unit})
                                                        </span>
                                                    </div>
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                                <div className="md:col-span-1.5 space-y-2">
                                    <label className={labelCls}>Strength</label>
                                    <input name="strength" value={currentEntry.strength} onChange={handleEntryChange} placeholder="500mg" className={cn(inputCls, "!py-4")} />
                                </div>
                                <div className="md:col-span-1 space-y-2">
                                    <label className={labelCls}>Qty</label>
                                    <input type="number" name="quantity" value={currentEntry.quantity} onChange={handleEntryChange} placeholder="1" className={cn(inputCls, "!py-4 text-center px-2")} />
                                </div>
                                <div className="md:col-span-1.5 space-y-2">
                                    <label className={labelCls}>Unit</label>
                                    <select name="unit" value={currentEntry.unit} onChange={handleEntryChange} className={cn(inputCls, "appearance-none pr-10 !py-4 text-center")} style={selectIndicatorStyle}>
                                        {MEDICINE_UNITS.map(u => <option key={u} value={u}>{u}</option>)}
                                    </select>
                                </div>
                                <div className="md:col-span-1.5 space-y-2 font-outfit">
                                    <label className={labelCls}>Rate (P/U NC)</label>
                                    <input type="number" name="rate" value={currentEntry.rate} onChange={handleEntryChange} placeholder="0" className={cn(inputCls, "!py-4")} />
                                </div>
                                <div className="md:col-span-1">
                                    <button
                                        onClick={addMedicine}
                                        className="w-full h-[56px] bg-blue-600 hover:bg-slate-900 text-white rounded-2xl flex items-center justify-center transition-all active:scale-95 shadow-xl shadow-blue-600/20"
                                        title={isEditingId ? "Save Edit" : "Add Requisition Item"}
                                    >
                                        {isEditingId ? <Edit2 className="w-5 h-5" /> : <Plus className="w-6 h-6 stroke-[2.5]" />}
                                    </button>
                                </div>
                            </div>

                            {/* Live Valuation & Stock Status Strip */}
                            {(currentEntry.name || selectedMedicine) && (
                                <div className="mt-4 pt-4 border-t border-slate-200/70 flex flex-wrap items-center justify-between gap-3 text-xs">
                                    <div className="flex flex-wrap items-center gap-3">
                                        <span className="font-black text-slate-900 flex items-center gap-1.5">
                                            <Pill className="w-3.5 h-3.5 text-blue-600" />
                                            {currentEntry.name || selectedMedicine?.name}
                                            {selectedMedicine?.genericName && (
                                                <span className="text-slate-500 font-normal">({selectedMedicine.genericName})</span>
                                            )}
                                        </span>
                                        {selectedMedicine?.supplierName && (
                                            <span className="text-slate-600 text-[11px]">
                                                Supplier: <strong className="text-slate-800">{selectedMedicine.supplierName}</strong>
                                            </span>
                                        )}
                                        {selectedMedicine && (
                                            <span className={cn(
                                                "px-2.5 py-0.5 rounded-full font-bold text-[10px] uppercase tracking-wider flex items-center gap-1 border",
                                                selectedMedicine.stockStatus === 'In Stock' ? "bg-emerald-100 text-emerald-800 border-emerald-300" :
                                                selectedMedicine.stockStatus === 'Low Stock' ? "bg-amber-100 text-amber-800 border-amber-300" :
                                                "bg-rose-100 text-rose-800 border-rose-300"
                                            )}>
                                                <span className="w-1.5 h-1.5 rounded-full bg-current" />
                                                Available Stock: {selectedMedicine.stock} {selectedMedicine.unit} ({selectedMedicine.stockStatus})
                                            </span>
                                        )}
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <span className="text-[11px] font-bold text-slate-500 uppercase">Valuation:</span>
                                        <span className="text-sm font-black text-blue-700 font-mono">
                                            Rs. {((parseFloat(currentEntry.quantity) || 0) * (parseFloat(currentEntry.rate) || 0)).toFixed(2)}
                                        </span>
                                    </div>
                                </div>
                            )}
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
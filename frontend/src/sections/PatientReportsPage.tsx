import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
    User, Lock, FileText, ArrowLeft, Loader2, Download, LogOut,
    Search, Calendar, Activity, Microscope, Scan, ChevronRight, Eye, EyeOff,
    TrendingUp, CheckCircle
} from 'lucide-react';
import Button from '../components/Button';

interface Report {
    id: string;
    title: string;
    date: string;
    department: string;
    downloadUrl: string;
    status: 'Ready' | 'Draft' | 'Processing';
    priority: 'Normal' | 'Urgent';
}

interface PatientData {
    name: string;
    patientId: string;
    lastVisit: string;
    reports: Report[];
}

const PatientReportsPage = () => {
    const { i18n } = useTranslation();
    const navigate = useNavigate();
    const [patientId, setPatientId] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [patientData, setPatientData] = useState<PatientData | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [sortOrder, setSortOrder] = useState<'date-desc' | 'date-asc' | 'title-asc'>('date-desc');
    const [filterDepartment, setFilterDepartment] = useState<string>('All');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        try {
            const loginRes = await fetch('/api/public/patients/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username: patientId, password }),
            });
            if (!loginRes.ok) {
                const errData = await loginRes.json();
                throw new Error(errData.message || 'Login failed');
            }
            const loginData = await loginRes.json();
            const patientObj = loginData.data;

            const reportsRes = await fetch(`/api/public/patients/${patientObj._id}/reports`);
            if (!reportsRes.ok) {
                throw new Error('Could not fetch patient reports');
            }
            const reportsData = await reportsRes.json();
            const rawReports = reportsData.data || [];

            const currentLang = i18n.language;
            const mappedReports: Report[] = rawReports.map((r: any) => ({
                id: r._id,
                title: (currentLang === 'np' && r.testNameNp) ? r.testNameNp : r.testName,
                date: r.testDate,
                department: r.department || 'Laboratory',
                downloadUrl: r.pdfUrl || '#',
                status: r.status || 'Ready',
                priority: r.priority || 'Normal',
            }));

            const lastVisit = mappedReports.length > 0 ? mappedReports[0].date : new Date().toISOString();

            setPatientData({
                name: patientObj.name,
                patientId: patientObj.username,
                lastVisit,
                reports: mappedReports,
            });
        } catch (err: any) {
            setError(err.message || 'Login failed. Please check your credentials and try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const departments = useMemo(() => {
        if (!patientData) return [];
        return ['All', ...new Set(patientData.reports.map(r => r.department))];
    }, [patientData]);

    const displayedReports = useMemo(() => {
        if (!patientData) return [];

        let reports = [...patientData.reports];

        // Search
        if (searchQuery) {
            reports = reports.filter(r =>
                r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                r.department.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        // Filtering
        if (filterDepartment !== 'All') {
            reports = reports.filter(r => r.department === filterDepartment);
        }

        // Sorting
        switch (sortOrder) {
            case 'date-asc':
                reports.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
                break;
            case 'title-asc':
                reports.sort((a, b) => a.title.localeCompare(b.title));
                break;
            case 'date-desc':
            default:
                reports.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        }
        return reports;
    }, [patientData, searchQuery, sortOrder, filterDepartment]);

    const getDepartmentIcon = (dept: string) => {
        const d = dept.toLowerCase();
        if (d.includes('lab')) return <Microscope className="w-5 h-5" />;
        if (d.includes('radio') || d.includes('scan') || d.includes('x-ray')) return <Scan className="w-5 h-5" />;
        return <Activity className="w-5 h-5" />;
    };

    if (patientData) {
        return (
            <div className="min-h-screen bg-gray-50/50 py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-6xl mx-auto space-y-8">
                    {/* Dashboard Header */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                            <h1 className="text-3xl font-black text-blue-900 uppercase tracking-tight flex items-center gap-3">
                                <FileText className="w-8 h-8 text-blue-600" />
                                Report Dashboard
                            </h1>
                            <p className="text-gray-500 font-medium mt-1">
                                Welcome, <span className="text-blue-900 font-bold">{patientData.name}</span> (ID: {patientData.patientId})
                            </p>
                        </motion.div>
                        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-4">
                            <Button
                                variant="outline"
                                onClick={() => setPatientData(null)}
                                className="bg-white border-gray-200 text-gray-700 font-bold flex items-center gap-2 hover:bg-red-50 hover:text-red-600 hover:border-red-200"
                            >
                                <LogOut className="w-4 h-4" /> Sign Out
                            </Button>
                        </motion.div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                        {/* Stats Sidebar */}
                        <div className="lg:col-span-3 space-y-6">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm"
                            >
                                <div className="space-y-6">
                                    <div className="flex items-center gap-4">
                                        <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
                                            <TrendingUp className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Total Reports</p>
                                            <p className="text-2xl font-black text-blue-900">{patientData.reports.length}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="p-3 bg-green-50 text-green-600 rounded-2xl">
                                            <Calendar className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Last Visit</p>
                                            <p className="text-lg font-black text-blue-900">{new Date(patientData.lastVisit).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>

                            <div className="bg-blue-900 p-8 rounded-3xl text-white relative overflow-hidden group">
                                <div className="relative z-10">
                                    <h4 className="font-black uppercase tracking-tight text-xl mb-2">Need Help?</h4>
                                    <p className="text-blue-100 text-xs font-medium mb-6 opacity-80 leading-relaxed">
                                        If you find any discrepancy in your reports, please contact our support team immediately.
                                    </p>
                                    <Button className="w-full bg-white text-blue-900 text-[10px] font-black uppercase tracking-wider rounded-xl hover:scale-105 transition-all">
                                        Support Hotline
                                    </Button>
                                </div>
                                <Activity className="absolute -bottom-6 -right-6 w-32 h-32 text-white/5 group-hover:rotate-12 transition-transform duration-700" />
                            </div>
                        </div>

                        {/* Main Content: Reports List */}
                        <div className="lg:col-span-9 space-y-6">
                            {/* Controls Bar */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row items-center gap-4"
                            >
                                <div className="relative flex-1 group">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                                    <input
                                        type="text"
                                        placeholder="Search reports by title or department..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-transparent rounded-xl text-sm font-medium focus:outline-none focus:bg-white focus:border-blue-900/10 focus:ring-4 focus:ring-blue-900/5 transition-all"
                                    />
                                </div>
                                <div className="flex items-center gap-3 shrink-0">
                                    <select
                                        value={filterDepartment}
                                        onChange={(e) => setFilterDepartment(e.target.value)}
                                        className="bg-gray-50 border-none rounded-xl px-4 py-2.5 text-xs font-bold text-gray-600 focus:ring-0 cursor-pointer hover:bg-gray-100 transition-colors"
                                    >
                                        {departments.map(dept => <option key={dept} value={dept}>{dept === 'All' ? 'All Dept.' : dept}</option>)}
                                    </select>
                                    <select
                                        value={sortOrder}
                                        onChange={(e) => setSortOrder(e.target.value as 'date-desc' | 'date-asc' | 'title-asc')}
                                        className="bg-gray-50 border-none rounded-xl px-4 py-2.5 text-xs font-bold text-gray-600 focus:ring-0 cursor-pointer hover:bg-gray-100 transition-colors"
                                    >
                                        <option value="date-desc">Newest</option>
                                        <option value="date-asc">Oldest</option>
                                        <option value="title-asc">A-Z</option>
                                    </select>
                                </div>
                            </motion.div>

                            <div className="space-y-4">
                                <AnimatePresence mode="popLayout">
                                    {displayedReports.map((report, index) => (
                                        <motion.div
                                            key={report.id}
                                            layout
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, scale: 0.95 }}
                                            transition={{ delay: index * 0.05 }}
                                            className="group bg-white p-5 rounded-3xl border border-gray-100 items-start md:items-center hover:border-blue-200 hover:shadow-xl hover:shadow-blue-900/5 transition-all flex flex-col md:flex-row gap-6"
                                        >
                                            <div className={`p-4 rounded-2xl shrink-0 group-hover:scale-110 transition-transform ${report.priority === 'Urgent' ? 'bg-red-50 text-red-600 font-bold' : 'bg-blue-50 text-blue-600'}`}>
                                                {getDepartmentIcon(report.department)}
                                            </div>

                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <h3 className="text-lg font-black text-gray-900 truncate uppercase tracking-tight">{report.title}</h3>
                                                    {report.priority === 'Urgent' && (
                                                        <span className="px-2 py-0.5 rounded-full bg-red-100 text-red-600 text-[10px] font-black uppercase">Urgent</span>
                                                    )}
                                                </div>
                                                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs font-bold text-gray-500 uppercase tracking-widest">
                                                    <span className="flex items-center gap-1.5"><Activity className="w-3.5 h-3.5" /> {report.department}</span>
                                                    <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> {new Date(report.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-4 w-full md:w-auto">
                                                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-green-50 text-green-600 text-[10px] font-black uppercase tracking-wider md:ml-auto">
                                                    <CheckCircle className="w-3.5 h-3.5" /> Ready
                                                </div>
                                                <motion.button
                                                    whileHover={{ scale: 1.05 }}
                                                    whileTap={{ scale: 0.95 }}
                                                    onClick={() => window.open(report.downloadUrl, '_blank')}
                                                    className="flex items-center justify-center gap-2 bg-blue-900 text-white text-[10px] font-black uppercase tracking-widest px-6 py-3 rounded-2xl shadow-lg shadow-blue-900/20 hover:bg-blue-800 transition-all flex-1 md:flex-none md:w-auto"
                                                >
                                                    <Eye className="w-4 h-4" /> View
                                                </motion.button>
                                                <motion.a
                                                    whileHover={{ scale: 1.05 }}
                                                    whileTap={{ scale: 0.95 }}
                                                    href={report.downloadUrl}
                                                    download
                                                    className="flex items-center justify-center gap-2 bg-blue-50 text-blue-900 text-[10px] font-black uppercase tracking-widest px-6 py-3 rounded-2xl hover:bg-blue-100 transition-all flex-1 md:flex-none md:w-auto"
                                                >
                                                    <Download className="w-4 h-4" /> Save PDF
                                                </motion.a>
                                            </div>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>

                                {displayedReports.length === 0 && (
                                    <div className="text-center py-20 bg-gray-50/50 rounded-3xl border border-dashed border-gray-200">
                                        <div className="w-16 h-16 bg-white rounded-full p-4 mx-auto mb-4 shadow-sm">
                                            <Search className="w-full h-full text-gray-300" />
                                        </div>
                                        <h3 className="text-gray-900 font-bold">No reports found</h3>
                                        <p className="text-gray-400 text-sm">Try adjusting your search or filters.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-20 relative overflow-hidden">
            {/* Background Decoration */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-900/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-red-600/5 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl pointer-events-none" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white p-8 sm:p-12 rounded-[40px] shadow-2xl max-w-lg w-full border border-gray-100 relative z-10"
            >
                <div className="text-center mb-10">
                    <div className="w-20 h-20 bg-blue-50 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-inner">
                        <FileText className="w-10 h-10 text-blue-900" />
                    </div>
                    <h1 className="text-3xl font-black text-blue-900 uppercase tracking-tight">
                        Patient <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-red-600">Portal</span>
                    </h1>
                    <p className="text-gray-500 mt-2 font-medium">
                        Securely access and download your medical reports from anywhere.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Patient ID / Email</label>
                        <div className="relative group">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300 group-focus-within:text-blue-900 transition-colors" />
                            <input
                                type="text"
                                value={patientId}
                                onChange={(e) => setPatientId(e.target.value)}
                                className="w-full pl-12 pr-4 py-4 bg-gray-50 border-none rounded-2xl focus:outline-none focus:bg-white focus:ring-4 focus:ring-blue-900/5 transition-all text-sm font-bold placeholder:text-gray-300"
                                placeholder="Enter ID or Email"
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <div className="flex items-center justify-between ml-1">
                            <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Password</label>
                            <button type="button" className="text-[10px] font-black text-blue-600 uppercase tracking-widest hover:underline">Forgot?</button>
                        </div>
                        <div className="relative group">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300 group-focus-within:text-blue-900 transition-colors" />
                            <input
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full pl-12 pr-10 py-4 bg-gray-50 border-none rounded-2xl focus:outline-none focus:bg-white focus:ring-4 focus:ring-blue-900/5 transition-all text-sm font-bold placeholder:text-gray-300"
                                placeholder="Enter Password"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-300 hover:text-blue-900 focus:outline-none"
                            >
                                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                        </div>
                    </div>

                    {error && (
                        <motion.p
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="text-xs text-red-500 font-black text-center uppercase tracking-wider"
                        >
                            {error}
                        </motion.p>
                    )}

                    <Button
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-4 rounded-2xl font-black uppercase tracking-[0.2em] shadow-xl shadow-blue-900/20 flex items-center justify-center gap-3 bg-blue-900 hover:bg-blue-800 text-white transition-all hover:-translate-y-1 text-xs"
                    >
                        {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <ChevronRight className="w-5 h-5" />}
                        {isLoading ? "Verifying Access..." : "View Report"}
                    </Button>
                </form>

                <div className="mt-10 pt-8 border-t border-gray-100 text-center">
                    <button
                        onClick={() => navigate('/')}
                        className="text-[10px] text-gray-400 font-black uppercase tracking-widest hover:text-blue-900 transition-colors flex items-center justify-center gap-2 mx-auto"
                    >
                        <ArrowLeft className="w-3.5 h-3.5" /> Back to Homepage
                    </button>
                </div>
            </motion.div>
        </div>
    );
};

export default PatientReportsPage;

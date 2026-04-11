import { useMemo, useState } from 'react';
import { ChevronDown, Loader2, Mail, MapPin, Phone, PhoneCall, Send, Globe } from 'lucide-react';
import { DISTRICTS_BY_PROVINCE, PROVINCES, WARDS, GET_MUNICIPALITIES } from '../constants/nepalData';

const ALL_DISTRICTS = Object.values(DISTRICTS_BY_PROVINCE).flat().sort();

const INITIAL_FORM_DATA = {
    fullName: '',
    age: '',
    gender: '',
    country: 'Nepal',
    province: 'Madhesh Province',
    district: 'Saptari',
    municipality: '',
    wardNo: '',
    placeStreetTole: '',
    email: '',
    phone: '',
    message: '',
};

const ContactUsPage = () => {
    const [formData, setFormData] = useState(INITIAL_FORM_DATA);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isLoading, setIsLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const availableDistricts = useMemo(() => {
        if (!formData.province) {
            return ALL_DISTRICTS;
        }

        return DISTRICTS_BY_PROVINCE[formData.province] || [];
    }, [formData.province]);

    const availableMunicipalities = useMemo(() => {
        if (!formData.district) {
            return [];
        }

        return GET_MUNICIPALITIES(formData.district);
    }, [formData.district]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;

        setFormData(prev => {
            if (name === 'country') {
                const nextCountry = value;
                return {
                    ...prev,
                    country: nextCountry,
                    province: nextCountry === 'Nepal' ? (prev.province || 'Madhesh Province') : '',
                    district: nextCountry === 'Nepal' ? (prev.district || 'Saptari') : '',
                    municipality: nextCountry === 'Nepal' ? prev.municipality : '',
                };
            }

            if (name === 'province') {
                return {
                    ...prev,
                    province: value,
                    district: '',
                    municipality: '',
                };
            }

            if (name === 'district') {
                return {
                    ...prev,
                    district: value,
                    municipality: '',
                };
            }

            return { ...prev, [name]: value };
        });

        setErrors(prev => ({ ...prev, [name]: '' }));
    };

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required.';

        if (!formData.age.trim()) {
            newErrors.age = 'Age is required.';
        } else if (!/^\d+$/.test(formData.age) || Number(formData.age) <= 0 || Number(formData.age) > 120) {
            newErrors.age = 'Please enter a valid age.';
        }

        if (!formData.gender) newErrors.gender = 'Gender is required.';
        if (!formData.country) newErrors.country = 'Country is required.';

        if (formData.country === 'Nepal' && !formData.province) {
            newErrors.province = 'Province is required.';
        }

        if (formData.country === 'Nepal' && !formData.district) {
            newErrors.district = 'District is required.';
        }

        if (!formData.municipality.trim()) newErrors.municipality = 'Municipality is required.';
        if (!formData.wardNo.trim()) newErrors.wardNo = 'Ward number is required.';

        if (!formData.phone.trim()) {
            newErrors.phone = 'Phone number is required.';
        } else if (!/^\+?[0-9\s-]{7,}$/.test(formData.phone)) {
            newErrors.phone = 'Please enter a valid phone number.';
        }

        if (formData.email.trim() && !/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Please enter a valid email.';
        }

        if (!formData.message.trim()) newErrors.message = 'Message or feedback is required.';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm()) return;

        setIsLoading(true);
        await new Promise(resolve => setTimeout(resolve, 1500));
        setIsLoading(false);
        setSubmitted(true);
        setFormData(INITIAL_FORM_DATA);
        setTimeout(() => setSubmitted(false), 4000);
    };

    const fieldClassName = (field: string) =>
        `w-full rounded-xl border bg-white px-4 py-3 text-sm text-slate-700 shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-blue-900/10 ${errors[field] ? 'border-red-400 focus:border-red-400' : 'border-slate-200 focus:border-blue-900'}`;

    const selectClassName = (field: string) => `${fieldClassName(field)} cursor-pointer pr-11`;

    return (
        <div className="min-h-screen bg-slate-50 pt-24 pb-16">
            <div className="mx-auto max-w-7xl px-6">
                <div className="mb-10">
                    <div className="mb-3 inline-flex items-center gap-3 rounded-full bg-white px-4 py-2 shadow-sm ring-1 ring-slate-200">
                        <PhoneCall className="h-5 w-5 text-blue-900" />
                        <span className="text-xs font-black uppercase tracking-[0.28em] text-blue-900">Contact Us</span>
                    </div>
                    <h1 className="max-w-3xl text-4xl font-black text-slate-900">Send your message or feedback and we will get back to you.</h1>
                </div>

                <div className="grid grid-cols-1 gap-8 lg:grid-cols-[0.92fr_1.08fr]">
                    <div className="space-y-8">
                        <div className="rounded-[28px] bg-blue-900 p-8 text-white shadow-xl shadow-blue-900/15">
                            <h2 className="mb-6 text-lg font-black uppercase tracking-[0.24em] !text-white border-b border-white/20 pb-4">Contact Information</h2>

                            <ul className="space-y-6 text-sm">
                                <li className="flex items-start gap-4">
                                    <div className="rounded-xl bg-white/10 p-3">
                                        <MapPin className="h-4 w-4 text-white" />
                                    </div>
                                    <div>
                                        <p className="mb-1 text-xs font-bold uppercase tracking-[0.24em] !text-blue-200">Address</p>
                                        <a
                                            href="https://maps.google.com/?q=Kalyanpur,+Khadak+Municipality,+Saptari,+Nepal"
                                            target="_blank"
                                            rel="noreferrer"
                                            className="font-semibold leading-relaxed !text-white transition-colors hover:text-blue-100"
                                        >
                                            Kalyanpur, Khadak Municipality,
                                            <br />
                                            Ward No.-7, Saptari,
                                            <br />
                                            Madhesh Province, Nepal
                                        </a>
                                    </div>
                                </li>

                                <li className="flex items-start gap-4">
                                    <div className="rounded-xl bg-white/10 p-3">
                                        <Phone className="h-4 w-4 text-white" />
                                    </div>
                                    <div>
                                        <p className="mb-1 text-xs font-bold uppercase tracking-[0.24em] !text-blue-200">Enquiry</p>
                                        <a href="tel:031590123" className="font-semibold !text-white transition-colors hover:text-blue-100">
                                            031-590123
                                        </a>
                                    </div>
                                </li>

                                <li className="flex items-start gap-4">
                                    <div className="rounded-xl bg-white/10 p-3">
                                        <PhoneCall className="h-4 w-4 text-white" />
                                    </div>
                                    <div>
                                        <p className="mb-1 text-xs font-bold uppercase tracking-[0.24em] !text-blue-200">Mobile</p>
                                        <a href="tel:9705490123" className="font-semibold !text-white transition-colors hover:text-blue-100">
                                            9705490123
                                        </a>
                                    </div>
                                </li>

                                <li className="flex items-start gap-4">
                                    <div className="rounded-xl bg-white/10 p-3">
                                        <Mail className="h-4 w-4 text-white" />
                                    </div>
                                    <div>
                                        <p className="mb-1 text-xs font-bold uppercase tracking-[0.24em] !text-blue-200">Email</p>
                                        <a href="mailto:dwarikahospital15@gmail.com" className="font-semibold !text-white transition-colors hover:text-blue-100">
                                            dwarikahospital15@gmail.com
                                        </a>
                                    </div>
                                </li>

                                <li className="flex items-start gap-4">
                                    <div className="rounded-xl bg-white/10 p-3">
                                        <Globe className="h-4 w-4 text-white" />
                                    </div>
                                    <div>
                                        <p className="mb-1 text-xs font-bold uppercase tracking-[0.24em] !text-blue-200">Website</p>
                                        <a
                                            href="https://www.dhama.com.np"
                                            target="_blank"
                                            rel="noreferrer"
                                            className="font-semibold !text-white transition-colors hover:text-blue-100"
                                        >
                                            www.dhama.com.np
                                        </a>
                                    </div>
                                </li>
                            </ul>
                        </div>

                        <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-lg">
                            <iframe
                                title="Dwarika Hospital Location"
                                src="https://maps.google.com/maps?q=Kalyanpur%2C+Khadak+Municipality%2C+Saptari%2C+Nepal&t=&z=14&ie=UTF8&iwloc=&output=embed"
                                width="100%"
                                height="100%"
                                style={{ border: 0, minHeight: '320px' }}
                                allowFullScreen
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                            />
                        </div>
                    </div>

                    <div className="rounded-[30px] border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/70 md:p-8">
                        <div className="mb-6 border-b border-slate-200 pb-5">
                            <h2 className="text-2xl font-black uppercase tracking-[0.18em] text-slate-900">Contact Us</h2>
                            <p className="mt-2 text-sm text-slate-500">Fill in the details below for messages, enquiries, or feedback.</p>
                        </div>

                        {submitted && (
                            <div className="mb-6 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">
                                Your message has been received. Our team will get back to you shortly.
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-[1.6fr_0.7fr_0.9fr]">
                                <div>
                                    <label className="mb-2 block text-xs font-black uppercase tracking-[0.22em] text-slate-700">Full Name*</label>
                                    <input
                                        type="text"
                                        name="fullName"
                                        value={formData.fullName}
                                        onChange={handleChange}
                                        placeholder="Enter full name"
                                        className={fieldClassName('fullName')}
                                    />
                                    {errors.fullName && <p className="mt-1 text-xs text-red-500">{errors.fullName}</p>}
                                </div>

                                <div>
                                    <label className="mb-2 block text-xs font-black uppercase tracking-[0.22em] text-slate-700">Age*</label>
                                    <input
                                        type="number"
                                        name="age"
                                        value={formData.age}
                                        onChange={handleChange}
                                        placeholder="Age"
                                        min="0"
                                        className={fieldClassName('age')}
                                    />
                                    {errors.age && <p className="mt-1 text-xs text-red-500">{errors.age}</p>}
                                </div>

                                <div>
                                    <label className="mb-2 block text-xs font-black uppercase tracking-[0.22em] text-slate-700">Gender*</label>
                                    <div className="relative">
                                        <select
                                            name="gender"
                                            value={formData.gender}
                                            onChange={handleChange}
                                            className={selectClassName('gender')}
                                        >
                                            <option value="">Select</option>
                                            <option value="Male">Male</option>
                                            <option value="Female">Female</option>
                                            <option value="Other">Other</option>
                                        </select>
                                        <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                                    </div>
                                    {errors.gender && <p className="mt-1 text-xs text-red-500">{errors.gender}</p>}
                                </div>
                            </div>

                            <div>
                                <p className="mb-3 text-xs font-black uppercase tracking-[0.22em] text-slate-700">Address</p>
                                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                    <div>
                                        <label className="mb-2 block text-xs font-bold uppercase tracking-[0.18em] text-slate-500">Country*</label>
                                        <div className="relative">
                                            <select
                                                name="country"
                                                value={formData.country}
                                                onChange={handleChange}
                                                className={selectClassName('country')}
                                            >
                                                <option value="Nepal">Nepal</option>
                                                <option value="India">India</option>
                                                <option value="Other">Other</option>
                                            </select>
                                            <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                                        </div>
                                        {errors.country && <p className="mt-1 text-xs text-red-500">{errors.country}</p>}
                                    </div>

                                    <div>
                                        <label className="mb-2 block text-xs font-bold uppercase tracking-[0.18em] text-slate-500">Province*</label>
                                        <div className="relative">
                                            <select
                                                name="province"
                                                value={formData.province}
                                                onChange={handleChange}
                                                className={selectClassName('province')}
                                                disabled={formData.country !== 'Nepal'}
                                            >
                                                <option value="">{formData.country === 'Nepal' ? 'Select province' : 'Not required'}</option>
                                                {PROVINCES.map(province => (
                                                    <option key={province} value={province}>
                                                        {province}
                                                    </option>
                                                ))}
                                            </select>
                                            <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                                        </div>
                                        {errors.province && <p className="mt-1 text-xs text-red-500">{errors.province}</p>}
                                    </div>

                                    <div>
                                        <label className="mb-2 block text-xs font-bold uppercase tracking-[0.18em] text-slate-500">District*</label>
                                        <div className="relative">
                                            <select
                                                name="district"
                                                value={formData.district}
                                                onChange={handleChange}
                                                className={selectClassName('district')}
                                                disabled={formData.country !== 'Nepal'}
                                            >
                                                <option value="">{formData.country === 'Nepal' ? 'Select district' : 'Not required'}</option>
                                                {availableDistricts.map(district => (
                                                    <option key={district} value={district}>
                                                        {district}
                                                    </option>
                                                ))}
                                            </select>
                                            <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                                        </div>
                                        {errors.district && <p className="mt-1 text-xs text-red-500">{errors.district}</p>}
                                    </div>

                                    <div>
                                        <label className="mb-2 block text-xs font-bold uppercase tracking-[0.18em] text-slate-500">Municipality*</label>
                                        <div className="relative">
                                            <select
                                                name="municipality"
                                                value={formData.municipality}
                                                onChange={handleChange}
                                                className={selectClassName('municipality')}
                                                disabled={!formData.district}
                                            >
                                                <option value="">{formData.district ? 'Select municipality' : 'Select district first'}</option>
                                                {availableMunicipalities.map(municipality => (
                                                    <option key={municipality} value={municipality}>
                                                        {municipality}
                                                    </option>
                                                ))}
                                            </select>
                                            <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                                        </div>
                                        {errors.municipality && <p className="mt-1 text-xs text-red-500">{errors.municipality}</p>}
                                    </div>

                                    <div>
                                        <label className="mb-2 block text-xs font-bold uppercase tracking-[0.18em] text-slate-500">Ward No.*</label>
                                        <div className="relative">
                                            <select
                                                name="wardNo"
                                                value={formData.wardNo}
                                                onChange={handleChange}
                                                className={selectClassName('wardNo')}
                                            >
                                                <option value="">Select ward</option>
                                                {WARDS.map(ward => (
                                                    <option key={ward} value={ward}>
                                                        {ward}
                                                    </option>
                                                ))}
                                            </select>
                                            <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                                        </div>
                                        {errors.wardNo && <p className="mt-1 text-xs text-red-500">{errors.wardNo}</p>}
                                    </div>

                                    <div>
                                        <label className="mb-2 block text-xs font-bold uppercase tracking-[0.18em] text-slate-500">Place/Street/Tole</label>
                                        <input
                                            type="text"
                                            name="placeStreetTole"
                                            value={formData.placeStreetTole}
                                            onChange={handleChange}
                                            placeholder="Place, street, or tole"
                                            className={fieldClassName('placeStreetTole')}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 gap-4 md:grid-cols-[1.4fr_0.9fr]">
                                <div>
                                    <label className="mb-2 block text-xs font-black uppercase tracking-[0.22em] text-slate-700">Email ID</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="Enter email address"
                                        className={fieldClassName('email')}
                                    />
                                    {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
                                </div>

                                <div>
                                    <label className="mb-2 block text-xs font-black uppercase tracking-[0.22em] text-slate-700">Phone No.*</label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        placeholder="Enter phone number"
                                        className={fieldClassName('phone')}
                                    />
                                    {errors.phone && <p className="mt-1 text-xs text-red-500">{errors.phone}</p>}
                                </div>
                            </div>

                            <div>
                                <label className="mb-2 block text-xs font-black uppercase tracking-[0.22em] text-slate-700">Message/Feedback</label>
                                <textarea
                                    name="message"
                                    value={formData.message}
                                    onChange={handleChange}
                                    rows={7}
                                    placeholder="Write your message or feedback"
                                    className={`${fieldClassName('message')} resize-none`}
                                />
                                {errors.message && <p className="mt-1 text-xs text-red-500">{errors.message}</p>}
                            </div>

                            <div className="pt-2">
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="inline-flex min-w-40 items-center justify-center gap-2 rounded-xl bg-blue-900 px-6 py-3 text-sm font-black uppercase tracking-[0.2em] text-white shadow-lg shadow-blue-900/20 transition-all hover:-translate-y-0.5 hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-70"
                                >
                                    {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                                    {isLoading ? 'Submitting' : 'Submit'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContactUsPage;

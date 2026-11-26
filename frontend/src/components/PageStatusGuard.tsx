import { createContext, useContext, useEffect, useState, useMemo } from 'react';
import { useLocation, Link } from 'react-router-dom';
import {
  AlertTriangle,
  PhoneCall,
  ArrowLeft,
  Clock,
  Building2,
} from 'lucide-react';

export interface PageStatusData {
  pageKey: string;
  path: string;
  name: string;
  status: 'active' | 'blocked';
  noticeTitle?: string;
  noticeMessage?: string;
}

interface PageStatusContextType {
  pages: PageStatusData[];
  loading: boolean;
  getPage: (pageKey: string) => PageStatusData | undefined;
  refetch: () => Promise<void>;
}

const PageStatusContext = createContext<PageStatusContextType>({
  pages: [],
  loading: false,
  getPage: () => undefined,
  refetch: async () => {},
});

export function usePageStatus() {
  return useContext(PageStatusContext);
}

export function getPageKeyFromPath(pathname: string): string {
  const p = pathname.toLowerCase();
  if (p === '/' || p === '') return 'home';
  if (p.startsWith('/about')) return 'about';
  if (p.startsWith('/academic')) return 'academic';
  if (p.startsWith('/appointment')) return 'appointment';
  if (p.startsWith('/reports')) return 'reports';
  if (p.startsWith('/online-form') || p.startsWith('/online-registration')) return 'online-form';
  if (p.startsWith('/support-form')) return 'support-form';
  if (p.startsWith('/our-story')) return 'our-story';
  if (p.startsWith('/news') || p.startsWith('/notices')) return 'news-events';
  if (p.startsWith('/blog')) return 'blogs';
  if (p.startsWith('/pharmacy')) return 'pharmacy';
  if (p.startsWith('/student-register')) return 'student-register';
  if (p.startsWith('/register')) return 'patient-register';
  if (p.startsWith('/department')) return 'department';
  if (p.startsWith('/videos')) return 'videos';
  if (p.startsWith('/strategic-vision')) return 'strategic-vision';
  if (p.startsWith('/gallery')) return 'gallery';
  if (p.startsWith('/contact')) return 'contact';
  if (p.startsWith('/downloads')) return 'downloads';
  return '';
}

export function PageStatusProvider({ children }: { children: React.ReactNode }) {
  const [pages, setPages] = useState<PageStatusData[]>(() => {
    try {
      const cached = sessionStorage.getItem('dwarika_page_status');
      return cached ? JSON.parse(cached) : [];
    } catch {
      return [];
    }
  });
  const [loading, setLoading] = useState(false);

  const fetchStatus = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/public/page-status');
      if (res.ok) {
        const json = await res.json();
        const items = json?.data?.items || json?.items || [];
        setPages(items);
        sessionStorage.setItem('dwarika_page_status', JSON.stringify(items));
      }
    } catch {
      // Ignore network errors on public front; default to active
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  const getPage = (pageKey: string) => {
    return pages.find((p) => p.pageKey === pageKey);
  };

  return (
    <PageStatusContext.Provider value={{ pages, loading, getPage, refetch: fetchStatus }}>
      {children}
    </PageStatusContext.Provider>
  );
}

export function BlockedPageNotice({ page }: { page?: PageStatusData }) {
  const title =
    page?.noticeTitle?.trim() ||
    `${page?.name || 'This Page'} is Temporarily Unavailable`;

  const message =
    page?.noticeMessage?.trim() ||
    'This section of Dwarika Hospital website has been temporarily suspended by hospital administration for scheduled maintenance or administrative review. Please check back later or contact the hospital reception for assistance.';

  return (
    <div className="min-h-[70vh] flex items-center justify-center py-16 px-4 bg-gradient-to-b from-ink-50/80 via-white to-ink-50/50">
      <div className="max-w-2xl w-full mx-auto">
        {/* Main Hospital Notice Card */}
        <div className="bg-white rounded-3xl border border-amber-200 shadow-xl overflow-hidden text-center relative">
          {/* Top amber accent bar */}
          <div className="h-3 bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600" />

          <div className="p-8 sm:p-12 space-y-6">
            {/* Header Icon */}
            <div className="mx-auto w-20 h-20 rounded-3xl bg-amber-50 border-2 border-amber-200 flex items-center justify-center text-amber-600 shadow-inner">
              <AlertTriangle className="h-10 w-10 animate-pulse" />
            </div>

            {/* Official Notice Pill */}
            <div>
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-100 text-amber-900 text-xs font-black tracking-wider uppercase shadow-xs">
                <Clock className="h-3.5 w-3.5" />
                Hospital Notice / सार्वजनिक सूचना
              </span>
            </div>

            {/* Title & Body */}
            <div className="space-y-3">
              <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-ink-900 tracking-tight">
                {title}
              </h2>
              <p className="text-sm sm:text-base text-ink-600 leading-relaxed max-w-lg mx-auto">
                {message}
              </p>
            </div>

            {/* Emergency & Reception Contact Hotline Card */}
            <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-50/80 to-teal-50/50 border border-emerald-200/90 text-left space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-800">
                <Building2 className="h-4 w-4 text-emerald-600" />
                Direct Hospital Contact & Emergency Help
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <a
                  href="tel:031590123"
                  className="flex items-center gap-3 p-3 rounded-xl bg-white border border-emerald-100 hover:border-emerald-300 transition shadow-xs group"
                >
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 group-hover:bg-emerald-600 group-hover:text-white transition">
                    <PhoneCall className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-[10px] text-ink-400 uppercase font-semibold">Hospital Reception</p>
                    <p className="text-sm font-bold text-ink-900">031-590123</p>
                  </div>
                </a>

                <a
                  href="tel:103"
                  className="flex items-center gap-3 p-3 rounded-xl bg-white border border-red-100 hover:border-red-300 transition shadow-xs group"
                >
                  <div className="w-8 h-8 rounded-lg bg-red-100 text-red-700 flex items-center justify-center shrink-0 group-hover:bg-red-600 group-hover:text-white transition">
                    <AlertTriangle className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-[10px] text-ink-400 uppercase font-semibold">Emergency (24/7)</p>
                    <p className="text-sm font-bold text-red-600">103 / Emergency</p>
                  </div>
                </a>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <Link
                to="/"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#17372f] text-white text-sm font-bold hover:bg-[#1f5144] transition shadow-md"
              >
                <ArrowLeft className="h-4 w-4" />
                Return to Homepage
              </Link>
              <Link
                to="/contact"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-ink-200 bg-white text-ink-800 text-sm font-bold hover:bg-ink-50 transition"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function PageStatusGuard({
  pageKey,
  children,
}: {
  pageKey?: string;
  children: React.ReactNode;
}) {
  const location = useLocation();
  const { getPage } = usePageStatus();

  const resolvedKey = useMemo(() => {
    return pageKey || getPageKeyFromPath(location.pathname);
  }, [pageKey, location.pathname]);

  const page = getPage(resolvedKey);

  // If the page is explicitly blocked in Admin Console, render official notice instead of page content
  if (page && page.status === 'blocked') {
    return <BlockedPageNotice page={page} />;
  }

  return <>{children}</>;
}

import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';

// Code splitting - Lazy loaded routes
const AboutPage = lazy(() => import('./sections/AboutPage'));
const HomePage = lazy(() => import('./sections/HomePage'));
const Academic = lazy(() => import('./sections/Academic'));
const DoctorAppointment = lazy(() => import('./components/DoctorAppointment'));
const PatientReportsPage = lazy(() => import('./sections/PatientReportsPage'));
const OnlineFormPage = lazy(() => import('./sections/OnlineFormPage'));
const NewsDetailPage = lazy(() => import('./sections/NewsDetailPage'));
const LoginPage = lazy(() => import('./sections/LoginPage'));
const HospitalStoryPage = lazy(() => import('./sections/HospitalStoryPage'));
const BlogDetailPage = lazy(() => import('./sections/BlogDetailPage'));
const BlogPage = lazy(() => import('./sections/BlogPage'));
const PharmacyPage = lazy(() => import('./sections/PharmacyPage'));
const DownloadPage = lazy(() => import('./sections/DownloadPage'));
const NewsAndEvents = lazy(() => import('./sections/NewsAndEvents'));
const StudentRegisterPage = lazy(() => import('./sections/StudentRegisterPage'));
const PatientRegisterPage = lazy(() => import('./sections/PatientRegisterPage'));
const DepartmentDetailPage = lazy(() => import('./sections/DepartmentDetailPage'));
const VideosPage = lazy(() => import('./sections/VideosPage'));
const StrategicVisionPage = lazy(() => import('./sections/StrategicVisionPage'));
const ComplexOnlineRegistrationForm = lazy(() => import('./components/ComplexOnlineRegistrationForm'));
const GallerySection = lazy(() => import('./sections/Gallery'));
const ContactUsPage = lazy(() => import('./sections/ContactUsPage'));

// A sleek and simple loading fallback
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-white">
    <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
  </div>
);

function App() {
  return (
    <div className="site-shell min-h-screen selection:bg-primary/20 selection:text-primary flex flex-col">
      <ScrollToTop />
      <Navbar />
      <main className="flex-grow relative">
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/academic" element={<Academic />} />
            <Route path="/downloads" element={<DownloadPage />} />
            <Route path="/appointment" element={<DoctorAppointment />} />
            <Route path="/reports" element={<PatientReportsPage />} />
            <Route path="/online-form" element={<ComplexOnlineRegistrationForm />} />
            <Route path="/support-form" element={<OnlineFormPage />} />
            <Route path="/our-story" element={<HospitalStoryPage />} />
            <Route path="/news/:id" element={<NewsDetailPage />} />
            <Route path="/news-events" element={<NewsAndEvents />} />
            <Route path="/notices" element={<NewsAndEvents />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/blogs" element={<BlogPage />} />
            <Route path="/blog/:id" element={<BlogDetailPage />} />
            <Route path="/pharmacy" element={<PharmacyPage />} />
            <Route path="/student-register" element={<StudentRegisterPage />} />
            <Route path="/register" element={<PatientRegisterPage />} />
            <Route path="/department/:slug" element={<DepartmentDetailPage />} />
            <Route path="/videos" element={<VideosPage />} />
            <Route path="/strategic-vision" element={<StrategicVisionPage />} />
            <Route path="/online-registration" element={<ComplexOnlineRegistrationForm />} />
            <Route path="/gallery" element={<GallerySection />} />
            <Route path="/contact" element={<ContactUsPage />} />
          </Routes>
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}

export default App;

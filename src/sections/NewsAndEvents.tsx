import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Newspaper, Calendar, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import Button from "../components/Button";
import { cn } from "../lib/utils";

// eslint-disable-next-line react-refresh/only-export-components
export const articles = [
    {
        id: 1,
        type: "Event",
        category: "Event",
        date: "2026-03-15",
        title: "Free Health Camp for Senior Citizens",
        description: "Join us for a comprehensive health check-up camp dedicated to our senior community members. Specialists will be available for consultation.",
        fullContent: "Dwarika Hospital is proud to announce a free health camp for senior citizens on March 15, 2026. This initiative is part of our commitment to community well-being. The camp will offer free consultations with specialists in cardiology, neurology, and orthopedics. Additionally, basic diagnostic tests such as blood pressure and sugar level checks will be conducted free of charge. We encourage all senior members of our community to take advantage of this opportunity.",
        image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80&w=1470",
    },
    {
        id: 2,
        type: "News",
        category: "News",
        date: "2026-12-30",
        title: "Dwarika Hospital Inaugurates New Cardiology Wing",
        description: "Our new state-of-the-art cardiology wing is now open, equipped with the latest technology for advanced heart care.",
        fullContent: "The new cardiology wing at Dwarika Hospital was inaugurated on December 30, 2026. This state-of-the-art facility is equipped with the latest advancements in cardiac care technology, including a new catheterization laboratory (Cath Lab) and a dedicated cardiac intensive care unit (CICU). 'This expansion allows us to provide world-class cardiac care to more patients, reducing wait times and improving outcomes,' said our Chairman during the inauguration ceremony.",
        image: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=1500",
    },
    {
        id: 3,
        type: "News",
        category: "News",
        date: "2026-02-28",
        title: "Dr. Sandeep Sharma Awarded for Excellence",
        description: "Our very own Dr. Sandeep Sharma has been recognized nationally for his contributions to interventional cardiology.",
        fullContent: "We are thrilled to announce that Dr. Sandeep Sharma, our Senior Interventional Cardiologist, has been awarded the 'National Award for Excellence in Medicine' for his pioneering work in interventional cardiology. The award recognizes his dedication to patient care and his significant contributions to advancing cardiac treatment methodologies in the country. The entire Dwarika Hospital family congratulates Dr. Sharma on this prestigious achievement.",
        image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=1000",
    },
    {
        id: 4,
        type: "Event",
        category: "Event",
        date: "2026-04-05",
        title: "Blood Donation Drive 2026",
        description: "Be a hero, save a life. Join our annual blood donation drive in collaboration with Red Cross Society.",
        fullContent: "Every drop counts! Dwarika Hospital invites you to our annual Blood Donation Drive on April 5, 2026. In collaboration with the Red Cross Society, we aim to collect over 500 units of blood to support emergency services in the region. Donors will receive a certificate of appreciation and refreshments. Your contribution can save up to three lives.",
        image: "https://images.unsplash.com/photo-1615461066841-6116e61058f4?auto=format&fit=crop&q=80&w=1000",
    },
    {
        id: 5,
        type: "News",
        category: "News",
        date: "2026-01-15",
        title: "Introduction of Robotic Surgery",
        description: "We are proud to introduce advanced robotic surgery systems for precise and minimally invasive procedures.",
        fullContent: "Dwarika Hospital takes a giant leap in surgical precision with the introduction of the Da Vinci Robotic Surgical System. This technology allows our surgeons to perform complex procedures with more precision, flexibility, and control than is possible with conventional techniques. Benefits for patients include smaller incisions, less pain, reduced risk of infection, and faster recovery times.",
        image: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=1000",
    },
    {
        id: 6,
        type: "News",
        category: "News",
        date: "2026-04-15",
        title: "Pediatric Ward Renovation Complete",
        description: "Our newly renovated pediatric ward offers a child-friendly environment for our youngest patients.",
        fullContent: "The pediatric ward at Dwarika Hospital has been completely renovated to create a more comfortable and welcoming space for children and their families. The new design features colorful murals, play areas, and updated medical equipment to ensure the highest standard of care in a child-friendly atmosphere.",
        image: "https://images.unsplash.com/photo-1527613426441-4da17471b66d?auto=format&fit=crop&q=80&w=1000",
    },
    {
        id: 7,
        type: "Event",
        category: "Event",
        date: "2026-12-01",
        title: "Maternal Health Workshop",
        description: "An informative workshop for expectant mothers covering prenatal care, nutrition, and delivery options.",
        fullContent: "Join our expert gynecologists and nutritionists for a free workshop on maternal health. This session will cover essential topics for a healthy pregnancy, including diet planning, exercises, and understanding the stages of labor. The workshop will be held in the hospital auditorium on May 1, 2026. Seats are limited.",
        image: "https://images.unsplash.com/photo-1516574187841-cb9cc2ca948b?auto=format&fit=crop&q=80&w=1500",
    },
    {
        id: 8,
        type: "Event",
        category: "Event",
        date: "2026-12-15",
        title: "World Heart Day Seminar",
        description: "Join our leading cardiologists for an insightful seminar on preventive heart care and modern treatment options.",
        fullContent: "In observance of World Heart Day, Dwarika Hospital is hosting a free public seminar. Our expert cardiologists will discuss the importance of a heart-healthy lifestyle, risk factors for cardiovascular diseases, and the latest advancements in treatment. The session will include a Q&A segment. All are welcome.",
        image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=1500",
    },
    {
        id: 9,
        type: "Event",
        category: "Event",
        date: "2026-12-25",
        title: "Free Dental Check-up Camp",
        description: "Get a free dental consultation and screening from our expert dental team. Promoting oral hygiene for a healthier life.",
        fullContent: "Dwarika Hospital's Department of Dental Sciences is organizing a free dental check-up camp. Services include general dental examination, oral hygiene education, and counseling on dental treatments. The camp is open to all age groups. Pre-registration is encouraged but not mandatory.",
        image: "https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&q=80&w=1500",
    },
    {
        id: 10,
        type: "News",
        category: "Strategic",
        date: "2025-10-15",
        title: "Global Footprint: UK Hospital Acquisition",
        description: "Strategically acquired UK-based Practice Plus Group Hospitals to expand our specialty care reach into the European market.",
        fullContent: "In a landmark move, Dwarika Hospital has completed the acquisition of Practice Plus Group Hospitals, one of the UK's leading independent healthcare providers. This strategic acquisition marks our first major international expansion and is a significant step towards becoming a global healthcare leader. The move will allow for knowledge sharing, and bringing international standards of care to Nepal.",
        image: "/C:/Users/ADMIN/.gemini/antigravity/brain/13a5c68d-be8b-4121-8f4f-cab5e6ffa019/uk_hospital_acquisition_strategic_1773915258109.png",
        isSpecial: true,
    },
    {
        id: 11,
        type: "Result",
        category: "Notice",
        date: "2026-03-20",
        title: "Entrance Exam Results for Nursing Batch 2026 Published",
        description: "The results for the Nursing Batch 2026 entrance examination have been officially published. Candidates can check their scores online.",
        fullContent: "Dwarika Hospital & Medical Academy is pleased to announce that the results for the B.Sc. Nursing Entrance Examination for the 2026 academic session have been published today, March 20, 2026. \n\nAll candidates who appeared for the examination can now view their results on our official website or at the academy's notice board. Successful candidates will be notified individually via email regarding the counseling and admission process. \n\nWe congratulate all the successful candidates and look forward to welcoming them to our institution.",
        image: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&q=80&w=1000",
    },
    {
        id: 12,
        type: "Admission",
        category: "Notice",
        date: "2026-03-10",
        title: "Call for Applications: MBBS Programme 2026",
        description: "Applications are now open for the prestigious MBBS Programme for the academic year 2026. Apply now to start your medical journey.",
        fullContent: "Dwarika Hospital & Medical Academy invites applications from eligible and motivated candidates for admission to the MBBS Programme for the 2026 session. \n\nOur MBBS programme is designed to provide comprehensive medical education, combining theoretical knowledge with extensive clinical practice at Dwarika Hospital. \n\nEligibility: Candidates must have completed 10+2 with Science (Biology, Physics, Chemistry) and met the minimum score requirements specified by the Medical Education Commission. \n\nLast date for submission: April 15, 2026.",
        image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=1000",
    },
    {
        id: 13,
        type: "Notice",
        category: "Notice",
        date: "2026-03-05",
        title: "Revised Academic Calendar for Paramedical Courses",
        description: "The academic calendar for all paramedical courses for the current semester has been revised. Please check the updated schedule.",
        fullContent: "The Office of the Dean, Dwarika Hospital & Medical Academy, has released a revised academic calendar for all paramedical programmes for the Spring 2026 semester. \n\nThis revision includes updated dates for mid-term assessments, practical workshops, and the final semester examinations. All students are advised to download the updated calendar from the student portal and plan their studies accordingly. \n\nThe changes were necessary to accommodate the upcoming National Medical Conference in April.",
        image: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&q=80&w=1000",
    },
    {
        id: 14,
        type: "Scholarship",
        category: "Notice",
        date: "2026-02-28",
        title: "Scholarship Application Deadline Extended – Apply Now",
        description: "The deadline for the Merit-based and Need-based Academic Scholarships for 2026 has been extended. Don't miss this opportunity.",
        fullContent: "To ensure that all eligible students have a chance to apply for financial assistance, Dwarika Hospital & Medical Academy has extended the deadline for the 2026 Scholarship Program. \n\nAvailable Scholarships: \n1. Merit-based Scholarship: For students with exceptional academic performance in previous years. \n2. Need-based Scholarship: For students who require financial support to continue their medical education. \n\nNew Deadline: March 31, 2026. \n\nForms are available on the Online Registration portal.",
        image: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&q=80&w=1000",
    },
    {
        id: 15,
        type: "Event",
        category: "Academic",
        date: "2026-02-20",
        title: "Annual Medical Conference Registration Open",
        description: "Register now for the Annual Medical Conference 2026. A platform for sharing knowledge and networking with industry leaders.",
        fullContent: "Dwarika Hospital is excited to host its Annual Medical Conference (AMC) on April 15, 2026. The theme for this year is 'Innovations in Specialized Healthcare'. \n\nThe conference will feature keynote speakers from renowned international medical institutions, panel discussions on emerging health trends, and paper presentations from our residents and faculty. \n\nRegistration is now open for students, faculty, and healthcare professionals from across the country. Early bird discounts are available until March 25.",
        image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=1000",
    },
];

// Sort articles by date descending (Latest first)
const sortedArticles = [...articles].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

const NewsAndEvents = () => {
    const location = useLocation();
    const [filter, setFilter] = useState(location.pathname === "/notices" ? "Notice" : "All");
    const [currentPage, setCurrentPage] = useState(1);
    const navigate = useNavigate();

    // Update filter if path changes (e.g., navigating between /news-events and /notices)
    useEffect(() => {
        if (location.pathname === "/notices") {
            setFilter("Notice");
        } else if (location.pathname === "/news-events" && filter === "Notice" && !location.state?.fromNotices) {
             // Only reset if we're explicitly coming to news-events and not just clicking the filter
             // However, for simplicity, let's just sync with path on mount/path change
             setFilter("All");
        }
    }, [location.pathname]);

    const filteredArticles =
        filter === "All"
            ? sortedArticles
            : sortedArticles.filter((article) => article.category === filter);

    // Reset to page 1 when filter changes
    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setCurrentPage(1);
    }, [filter]);

    const itemsPerPage = 3;
    const totalPages = Math.ceil(filteredArticles.length / itemsPerPage);
    const displayedArticles = filteredArticles.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    const filters = ["All", "News", "Event", "Notice", "Academic", "Strategic"];
    const isNoticeOnly = location.pathname === "/notices";

    return (
        <section id="news" className="bg-gray-50 px-6 py-20">
            <div className="max-w-7xl mx-auto">
                <div className="mb-16">
                    <div className="flex items-center gap-3 mb-4">
                        <Newspaper className="w-8 h-8 text-primary" />
                        <h1 className="text-3xl font-black text-primary uppercase">
                            {isNoticeOnly ? "Official Notices & Results" : "News & Events"}
                        </h1>
                    </div>
                    <p className="text-gray-600 font-medium max-w-3xl">
                        {isNoticeOnly 
                            ? "Stay updated with the latest institutional notices, entrance results, and academic announcements from Dwarika Hospital & Medical Academy."
                            : "Follow our latest updates, stories, and upcoming events to stay connected with the Dwarika Hospital community."}
                    </p>
                </div>

                {!isNoticeOnly && (
                    <div className="flex justify-center gap-2 mb-12">
                        {filters.map((item) => (
                            <button
                                key={item}
                                onClick={() => setFilter(item)}
                                className={cn(
                                    "px-6 py-2 rounded-full text-sm font-bold transition-all duration-300 border-2",
                                    filter === item
                                        ? "bg-[#1E3A8A] text-white border-[#1E3A8A] shadow-md"
                                        : "bg-white text-gray-700 border-gray-200 hover:bg-gray-100 hover:border-gray-300"
                                )}
                            >
                                {item === "Event" ? "Events" : item}
                            </button>
                        ))}
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <AnimatePresence mode="popLayout">
                        {displayedArticles.map((article) => (
                            <motion.div
                                key={article.title}
                                layout
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -30 }}
                                transition={{ duration: 0.3 }}
                                onClick={() => navigate(article.isSpecial ? '/strategic-vision' : `/news/${article.id}`)}
                                className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl overflow-hidden border border-gray-100 flex flex-col transition-all duration-300 hover:-translate-y-2 cursor-pointer"
                            >
                                <div className="relative h-48 overflow-hidden">
                                    <img
                                        src={article.image}
                                        alt={article.title}
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                    />
                                    <div className={`absolute top-4 right-4 px-3 py-1 text-xs font-bold text-white rounded-full shadow-md ${article.isSpecial ? 'bg-orange-500' : (article.type === 'News' ? 'bg-blue-600' : 'bg-red-600')}`}>
                                        {article.type}
                                    </div>
                                </div>
                                <div className="p-5 flex flex-col flex-grow">
                                    <div className="flex items-center gap-2 text-gray-500 text-xs font-semibold mb-3">
                                        <Calendar className="w-4 h-4" />
                                        <span>{new Date(article.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                                    </div>
                                    <h3 className="text-lg font-black text-primary mb-3 leading-tight flex-grow">{article.title}</h3>
                                    <p className="text-sm text-gray-600 mb-6 font-medium leading-relaxed">{article.description}</p>
                                    <Button
                                        variant="ghost"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            navigate(article.isSpecial ? '/strategic-vision' : `/news/${article.id}`);
                                        }}
                                        className="p-0 h-auto text-sm font-bold text-accent hover:text-primary hover:bg-transparent flex items-center gap-2 mt-auto self-start"
                                    >
                                        {article.isSpecial ? 'View Strategic Vision' : 'Read More'} <ArrowRight className="w-4 h-4" />
                                    </Button>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
                <div className="mt-12 flex justify-center items-center gap-3">
                    <button
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                        className="p-2 rounded-full border border-gray-200 text-gray-600 hover:bg-blue-900 hover:text-white hover:border-blue-900 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </button>

                    <div className="flex gap-2">
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                            <button
                                key={page}
                                onClick={() => setCurrentPage(page)}
                                className={cn(
                                    "w-10 h-10 rounded-full font-bold text-sm transition-all border",
                                    currentPage === page
                                        ? "bg-blue-900 text-white border-blue-900 shadow-lg scale-110"
                                        : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50 hover:border-gray-300"
                                )}
                            >
                                {page}
                            </button>
                        ))}
                    </div>

                    <button
                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                        className="p-2 rounded-full border border-gray-200 text-gray-600 hover:bg-blue-900 hover:text-white hover:border-blue-900 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                        <ChevronRight className="w-5 h-5" />
                    </button>
                </div>
            )}
        </section>
    );
};

export default NewsAndEvents;
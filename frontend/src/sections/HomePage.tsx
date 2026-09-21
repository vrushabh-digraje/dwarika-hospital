import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import DepartmentSection from "../sections/DepartmentSection";
import Doctors from "../sections/Doctors";
import HeroSection from "../sections/HeroSection";
import LiveConsultation from "../sections/LiveConsultation";
import NewsEventsSection from "../sections/NewsEventsSection";
import HealthTipsSection from "./HealthTipsSection";
import PatientExperience from "./PatientExperience";
import Services from "../sections/Services";
import CtaSection from "./CtaSection";

const HomePage = () => {
    const location = useLocation();

    useEffect(() => {
        const state = location.state as { scrollTo?: string } | null;
        if (state?.scrollTo) {
            const element = document.getElementById(state.scrollTo);
            if (element) {
                setTimeout(() => {
                    element.scrollIntoView({ behavior: "smooth" });
                }, 50);
            }
        }
    }, [location]);

    return (
        <div className="home-flow">
            <div className="home-band">
                <HeroSection />
            </div>
            <div className="home-band">
                <DepartmentSection />
            </div>
            <div className="home-band">
                <Services />
            </div>
            <div className="home-band">
                <NewsEventsSection />
            </div>
            <div className="home-band">
                <Doctors />
            </div>
            <div className="home-band">
                <LiveConsultation />
            </div>
            <div className="home-band">
                <PatientExperience />
            </div>
            <div className="home-band">
                <HealthTipsSection />
            </div>
            <div className="home-band">
                <CtaSection />
            </div>
        </div>
    );
};

export default HomePage;

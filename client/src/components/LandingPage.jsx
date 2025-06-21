import LandingPageNavbar from "./LandingPageNavbar";
import LandingPageHero from "./LandingPageHero";
import FAQ from "./FAQ"
import Footer  from "./Footer";
import LandingPageFeatures from "./LandingPageFeatures";

export default function LandingPage(){
    return(
        <>
        <div className="min-h-screen">
            <div id="landing-hero">
            <LandingPageNavbar />
            <LandingPageHero />
            </div>
            <LandingPageFeatures/>
        </div>
        <FAQ />
        <Footer />
        </>
    );
}
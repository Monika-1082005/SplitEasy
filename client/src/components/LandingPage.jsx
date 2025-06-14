import LandingPageNavbar from "./LandingPageNavbar";
import LandingPageHero from "./LandingPageHero";
import FAQ from "./FAQ"
import Footer  from "./Footer";
import LandingPageFeatures from "./LandingPageFeatures";

export default function LandingPage(){
    return(
        <>
        <div className="min-h-screen">
            <LandingPageNavbar />
            <LandingPageHero />
            <LandingPageFeatures/>
        </div>
        <FAQ />
        <Footer />
        </>
    );
}
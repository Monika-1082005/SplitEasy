import LandingPageNavbar from "./LandingPageNavbar";
import LandingPageHero from "./LandingPageHero";
import FAQ from "./FAQ";
import Footer from "./Footer";
import LandingPageFeatures from "./LandingPageFeatures";

export default function LandingPage() {
  return (
    <>
      <div className="min-h-screen">
        <div id="landing-home">
          <LandingPageNavbar />
          <LandingPageHero />
        </div>
        <LandingPageFeatures />
        <FAQ />
      </div>
      {/* <FAQ /> */}
      <Footer />
    </>
  );
}

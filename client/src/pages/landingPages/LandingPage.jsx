import Navbar from "../../components/landing/Navbar";
import Hero from "../../components/landing/Hero";
import TrustStrip from "../../components/landing/TrustStrip";
import Features from "../../components/landing/Features";
import HowItWorks from "../../components/landing/HowItWorks";
import CtaBanner from "../../components/landing/CtaBanner";
import Footer from "../../components/landing/Footer";

export default function LandingPage() {

  return (
    <div className="min-h-screen w-full bg-white font-sans">
      <Navbar/>

      <main>
        <Hero/>
        <TrustStrip />
        <Features />
        <HowItWorks />
        <CtaBanner/>
      </main>

      <Footer />

      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.6s ease-out both;
        }
      `}</style>
    </div>
  );
}
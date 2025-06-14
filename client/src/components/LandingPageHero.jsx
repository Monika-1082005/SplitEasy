import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function LandingPageHero() {
  const [userCount, setUserCount] = useState(null);
  const apiUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    fetch(`${apiUrl}/user-count`) // replace with your actual endpoint
      .then((res) => res.json())
      .then((data) => setUserCount(data.count))
      .catch((err) => {
        console.error("Failed to fetch user count:", err);
        setUserCount(50000); // fallback if API fails
      });
  }, [apiUrl]);

  return (
    <motion.section
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1.5 }}
      className="min-h-screen flex flex-col justify-center items-center text-center px-6 md:px-20"
    >
      {/* Dynamic Trust Badge */}
      <div className="flex justify-center items-center space-x-2 text-sm font-medium text-[#1D214B] mb-4">
        <span className="bg-white px-3 py-1 rounded-full shadow-sm">
          ✅ {userCount ? userCount.toLocaleString() : "…"}+ users trust
          SplitEasy
        </span>
      </div>

      {/* Headline */}
      <h1 className="text-4xl md:text-5xl font-extrabold text-[#1D214B] leading-tight mb-4">
        Say Goodbye to Confusing Expenses <br />
        <span className="text-[#1F3C9A]">Split Bills with Clarity</span>
      </h1>

      {/* Subtext */}
      <p className="text-base md:text-lg text-[#1D214B] max-w-2xl mx-auto mt-4">
        SplitEasy helps you track, split, and settle expenses in groups—no more
        awkward reminders or lost receipts.
      </p>

      {/* CTA Links */}
      <div className="mt-8 flex flex-col sm:flex-row justify-center items-center gap-4">
        <a
          href="#features"
          className="bg-[#1F3C9A] hover:bg-[#1d214b] text-white px-6 py-3 rounded-full font-semibold transition-all text-center"
        >
          Explore Features
        </a>
        <a
          href="#faq"
          className="border border-[#1F3C9A] text-[#1F3C9A] hover:bg-[#1F3C9A] hover:text-white px-6 py-3 rounded-full font-semibold transition-all text-center"
        >
          Read FAQs
        </a>
      </div>
    </motion.section>
  );
}

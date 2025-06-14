import { FaGithub } from "react-icons/fa";

export default function Footer() {
  return (
    <footer
      className="bg-white
                 shadow-[0_-5px_10px_rgba(0,0,0,0.14)]
                 text-[#1D214B]
                 py-14 px-6"
    >
      <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-12 items-start">
        {/* Brand Info */}
        <div>
          <h3 className="text-2xl font-bold text-[#1F3C9A]">SplitEasy</h3>
          <p className="text-sm mt-4 text-gray-600 leading-relaxed">
            Simplifying group expenses with smart reminders and effortless
            tracking.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
          <ul className="text-sm space-y-2 text-gray-700">
            <li>
              <a href="#features" className="hover:text-[#1F3C9A] transition">
                Features
              </a>
            </li>
            <li>
              <a
                href="#how-it-works"
                className="hover:text-[#1F3C9A] transition"
              >
                How It Works
              </a>
            </li>
            <li>
              <a href="#faq" className="hover:text-[#1F3C9A] transition">
                FAQs
              </a>
            </li>
            <li>
              <a href="#contact" className="hover:text-[#1F3C9A] transition">
                Contact
              </a>
            </li>
          </ul>
        </div>

        {/* Feedback & Social */}
        <div className="text-sm text-gray-700 space-y-4">
          <div>
            <h4 className="text-lg font-semibold mb-2">Share Your Thoughts</h4>
            <a
              href="#feedback"
              className="inline-block mt-1 px-4 py-2 text-sm bg-[#1F3C9A] text-white rounded-md shadow hover:bg-[#1D214B] transition"
            >
              Write a Review
            </a>
          </div>
          <div className="flex items-center gap-2 pt-2">
            <FaGithub className="text-2xl text-[#1F3C9A]" />
            <a
              href="https://github.com/Monika-1082005/SplitEasy"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline"
            >
              View on GitHub
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Line */}
      <div className="mt-12 text-center text-xs text-gray-500">
        Made with 💙 by Jyoti & Monika &middot; &copy; 2025 SplitEasy. All
        rights reserved.
      </div>
    </footer>
  );
}

import { FaGithub, FaTimes } from "react-icons/fa";
import axios from "axios";
import { useState, useEffect } from "react";

export default function Footer() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [reviewText, setReviewText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState(null);
  const apiUrl = import.meta.env.VITE_API_URL;

  const openModal = () => {
    setIsModalOpen(true);
    setReviewText("");
    setSubmitMessage(null);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSubmitMessage(null);
  };

  useEffect(() => {
    if (submitMessage === "Thank you for your feedback!") {
      const timer = setTimeout(() => {
        setSubmitMessage(null);
        closeModal();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [submitMessage]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!reviewText.trim()) {
      setSubmitMessage("Please enter a review before submitting.");
      return;
    }
    setIsSubmitting(true);
    setSubmitMessage(null);

    try {
      await axios.post(`${apiUrl}/reviews`, { review: reviewText.trim() });
      setSubmitMessage("Thank you for your feedback!");
      setReviewText("");
    } catch (error) {
      setSubmitMessage("Failed to submit review. Please try again later.");
      console.error(error);
    }
    setIsSubmitting(false);
  };

  const handleSmoothScroll = (e) => {
    e.preventDefault();
    const targetId = e.currentTarget.getAttribute("href").slice(1); // remove '#'
    const targetElement = document.getElementById(targetId);
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <>
      <footer
        className="bg-[#9DC3ED]
                 shadow-[0_-5px_10px_rgba(0,0,0,0.14)]
                 text-[#1D214B]
                 py-14 px-6 "
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
                <a
                  href="#landing-hero"
                  className="hover:text-[#1F3C9A] transition"
                  onClick={handleSmoothScroll}
                >
                  Home
                </a>
              </li>
              <li>
                <a
                  href="#features"
                  className="hover:text-[#1F3C9A] transition"
                  onClick={handleSmoothScroll}
                >
                  Features
                </a>
              </li>
              <li>
                <a
                  href="#faq"
                  className="hover:text-[#1F3C9A] transition"
                  onClick={handleSmoothScroll}
                >
                  FAQs
                </a>
              </li>
            </ul>
          </div>

          {/* Feedback & Social */}
          <div className="text-sm text-gray-700 space-y-4">
            <div>
              <h4 className="text-lg font-semibold mb-2">
                Your Opinion Matters
              </h4>
              <button
                href="#feedback"
                className="mt-1 px-4 py-2 text-sm bg-[#1F3C9A] text-white rounded-md shadow hover:bg-[#1D214B] transition cursor-pointer"
                onClick={openModal}
              >
                Write a Review
              </button>
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

      {/* Inline Modal */}
      {isModalOpen && (
        <div
          className="fixed bottom-5 right-5 z-50 w-[90%] sm:w-96 bg-white rounded-lg p-4 sm:p-6 shadow-lg border border-gray-300"
          role="dialog"
          aria-modal="true"
        >
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold text-[#1F3C9A]">
              Write a Review
            </h3>
            <button
              onClick={closeModal}
              aria-label="Close review modal"
              className="text-2xl text-gray-500 hover:text-gray-900 transition cursor-pointer"
            >
              <FaTimes />
            </button>
          </div>
          <form onSubmit={handleSubmit}>
            <textarea
              className="w-full border border-gray-300 rounded-md p-3 resize-none focus:outline-none focus:ring-2 focus:ring-[#1F3C9A]"
              rows={4}
              placeholder="Share your thoughts here..."
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              maxLength={300}
            />
            {submitMessage && (
              <p
                className={`mt-2 text-sm ${
                  submitMessage.startsWith("Thank")
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {submitMessage}
              </p>
            )}
            <div className="mt-4 flex justify-end space-x-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 bg-[#1F3C9A] text-white rounded-md hover:bg-[#1D214B] transition disabled:opacity-50 cursor-pointer"
              >
                {isSubmitting ? "Submitting..." : "Submit"}
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}

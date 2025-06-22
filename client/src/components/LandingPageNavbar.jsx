import logo from "../../public/logo.jpg";
import { useNavigate } from "react-router-dom";

export default function LandingPageNavbar() {
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem("userId");
  const handleSmoothScroll = (e) => {
    e.preventDefault();
    const targetId = e.currentTarget.getAttribute("href").slice(1); // remove '#'
    const targetElement = document.getElementById(targetId);
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: "smooth" });
    }
  };
  return (
    <nav className="flex justify-between items-center w-full px-3 py-1 md:px-6 md:py-1.5 bg-white shadow-[0_5px_10px_rgba(0,0,0,0.14)]">
      {/* Left Section */}
      <div className="flex items-center gap-3 ">
        <img
          src={logo}
          alt="website-logo"
          className="h-10 w-10 md:h-20 md:w-20"
        />
        <h3 className="text-lg md:text-2xl font-bold">SplitEasy</h3>
      </div>
      {/* Center Section - Nav Links */}
      <ul className="hidden md:flex gap-10 text-[#1d214b] font-bold text-sm md:text-lg">
        <li>
          <a
            href="#landing-home"
            className="hover:text-[#1F3C9A] cursor-pointer"
            onClick={handleSmoothScroll}
          >
            Home
          </a>
        </li>
        <li>
          <a
            href="#features"
            className="hover:text-[#1F3C9A] cursor-pointer"
            onClick={handleSmoothScroll}
          >
            Features
          </a>
        </li>
        <li>
          <a
            href="#faq"
            className="hover:text-[#1F3C9A] cursor-pointer"
            onClick={handleSmoothScroll}
          >
            FAQ
          </a>
        </li>
        <li>
          <a
            href="#about"
            className="hover:text-[#1F3C9A] cursor-pointer"
            onClick={handleSmoothScroll}
          >
            About Us
          </a>
        </li>
      </ul>

      {/* Right Section */}
      <div className="flex gap-3">
        {isLoggedIn ? (
          <button
            className="text-xs md:text-base px-2 py-1 md:px-4 md:py-2.5 font-normal md:font-semibold bg-[#1d214b] text-white rounded-sm md:rounded-lg cursor-pointer"
            onClick={() => navigate("/dashboard")}
          >
            Go to Dashboard
          </button>
        ) : (
          <>
            <button
              className="text-[#1d214b] cursor-pointer text-xs md:text-base transition-transform duration-200 hover:opacity-90"
              onClick={() => navigate("/login")}
            >
              Login
            </button>
            <button
              className="px-2 py-1 md:px-3 md:py-1.5 text-xs md:text-base font-medium bg-[#1d214b] text-white rounded-lg transition-normal duration-200 hover:scale-105 cursor-pointer"
              onClick={() => navigate("/signup")}
            >
              Sign Up
            </button>
          </>
        )}
      </div>
    </nav>
  );
}

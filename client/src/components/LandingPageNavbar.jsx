import logo from "../../public/logo.jpg";
import { useNavigate } from "react-router-dom";

export default function LandingPageNavbar(){
  const navigate = useNavigate();
    return (
          <nav className="flex justify-between items-center w-full px-3 py-1 md:px-6 md:py-1.5 bg-white shadow-[0_5px_10px_rgba(0,0,0,0.14)]">
            {/* Left Section */}
            <div className="flex items-center gap-3 ">
              <img src={logo} alt="website-logo" className="h-10 w-10 md:h-20 md:w-20" />
              <h3 className="text-lg md:text-2xl font-bold">SpiltEasy</h3>
            </div>
    
            {/* Right Section */}
            <div className="flex gap-3">
              <button className=" text-[#1d214b] cursor-pointer text-xs md:text-lg transition-transform duration-200 hover:scale-120 hover:underline" onClick={() => navigate("/login")} >
                Login
              </button>
              <button className="px-2 py-1 md:px-4 md:py-2 text-xs md:text-xl bg-[#1d214b] text-white rounded-lg cursor-pointer transition-transform duration-200 hover:scale-105" onClick={() => navigate("/signup")} >
                Sign Up
              </button>
            </div>
          </nav>
    );
}
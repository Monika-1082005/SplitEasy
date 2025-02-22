import signUpImage from "../assets/signup.jpeg";
import { Link } from "react-router-dom";

export default function Signup() {
  return (
    <section className="min-h-screen flex items-center justify-center font-mono bg-gradient-to-r from-[#9DC3ED] via-[#F3E9D3] to-[#9DC3ED]">
      <div className="flex flex-col xl:flex-row shadow-2xl bg-white rounded-2xl overflow-hidden max-w-[900px] w-full">
        {/* Left Side - Login Form */}
        <div className="flex flex-col items-center justify-center text-center px-12 py-16 gap-6 bg-[#1F3C9A] text-white flex-1 max-w-[450px] w-full">
          <h1 className="text-4xl font-bold text-[#F3E9D3]">Sign Up</h1>
          <form className="flex flex-col text-lg text-left gap-4 w-full">
            <label className="text-lg text-[#F3E9D3]">Username</label>
            <input
              type="text"
              className="p-2 border border-gray-300 rounded-lg placeholder-gray-400 focus:border-[#9DC3ED] focus:bg-white text-[#1d214b] focus:outline-none"
              placeholder="Enter your username"
            />
            <label className="text-lg text-[#F3E9D3]">Phone No.</label>
            <input
              type="text"
              className="p-2 border border-gray-300 rounded-lg placeholder-gray-400 focus:border-[#9DC3ED] focus:bg-white text-[#1d214b] focus:outline-none"
              placeholder="Enter your phone no."
            />
            <label className="text-lg text-[#F3E9D3]">OTP</label>
            <input
              type="password"
              className="p-2 border border-gray-300 rounded-lg placeholder-gray-400 focus:border-[#9DC3ED] focus:bg-white focus:text-[#1d214b] focus:outline-none"
              placeholder="******"
            />
            <div className="flex gap-2 items-center">
              <input type="checkbox" className="accent-[#9DC3ED]" />
              <span className="text-sm">Remember me</span>
            </div>
            <button className="px-10 py-3 text-lg rounded-lg bg-[#1D214B] text-white hover:bg-[#9DC3ED] hover:text-[#1d214b] transition">
              Login
            </button>
          </form>
          <div className="flex flex-col items-center gap-0">
            <p className="text-sm font-medium">Already have an account?</p>
            <Link
              to="/login"
              className="text-sm text-[#9DC3ED] hover:underline"
            >
              Sign In
            </Link>
          </div>
        </div>
        {/* Right Side - Image (Hidden on Small Screens) */}
        <div className="hidden xl:flex flex-1 items-center justify-center overflow-hidden">
          <img
            src={signUpImage}
            alt="Login"
            className="w-full h-full object-contain rounded-tr-2xl rounded-br-2xl"
          />
        </div>
      </div>
    </section>
  );
}

import signUpImage from "../assets/signup.jpeg";
import { Link } from "react-router-dom";

export default function Signup() {
  return (
    <section className="min-h-screen flex items-center justify-center bg-[url('../../src/assets/bg.png')] bg-cover">
      <div className="flex shadow-2xl">
        {/* Left Side - Sign Up Form */}
        <div className="flex flex-col items-center justify-center text-center w-[300px] px-8 py-7 sm:w-[450px] sm:p-14 gap-0 sm:gap-6 bg-[#1F3C9A] rounded-2xl text-white lg:rounded-tr-none lg:rounded-br-none lg:p-16">
          <h1 className=" text-2xl sm:text-4xl font-bold text-[#F3E9D3]">
            Sign Up
          </h1>
          <form className="flex flex-col text-lg text-left w-full">
            <label className="text-lg text-[#F3E9D3] mb-1 mt-4">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              className="p-2 border border-gray-300 rounded-lg placeholder-gray-400 focus:border-[#9DC3ED] focus:bg-white text-[#1d214b] focus:outline-none"
              placeholder="Enter your username"
            />
            <label className="text-lg text-[#F3E9D3] mb-1 mt-4">
              Phone No.
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              pattern="[0-9]{3}-[0-9]{2}-[0-9]{3}"
              className="p-2 border border-gray-300 rounded-lg placeholder-gray-400 focus:border-[#9DC3ED] focus:bg-white text-[#1d214b] focus:outline-none"
              placeholder="Enter your phone no."
            />
            <label className="text-lg text-[#F3E9D3] mb-1 mt-4">OTP</label>
            <input
              type="text"
              inputMode="numeric"
              id="otp"
              name="otp"
              className="p-2 border border-gray-300 rounded-lg placeholder-gray-400 focus:border-[#9DC3ED] focus:bg-white focus:text-[#1d214b] focus:outline-none"
              placeholder="******"
            />
            <div className="flex mt-4 items-center">
              <input type="checkbox" className="accent-[#9DC3ED]" />
              <span className="text-sm">Remember me</span>
            </div>
            <button className="px-6 py-3 mt-4 mb-4 text-lg rounded-lg bg-[#1D214B] text-white hover:bg-[#9DC3ED] hover:text-[#1d214b] transition">
              Sign Up
            </button>
          </form>
          <div className="flex flex-col items-center gap-0">
            <p className="text-sm font-medium">Already have an account?</p>
            <Link
              to="/login"
              className="text-sm text-[#9DC3ED] hover:underline"
            >
              Login
            </Link>
          </div>
        </div>

        {/* Right Side - Image (Hidden on Small Screens) */}
        <img
          src={signUpImage}
          alt="Sign Up"
          className="w-[490px] lg:rounded-tr-2xl lg:rounded-br-2xl lg:block hidden"
        />
      </div>
    </section>
  );
}

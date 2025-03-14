import loginImage from "../../src/assets/login_form_img.jpeg";

import { Link } from "react-router-dom";

export default function Login() {
  return (
    <section className="min-h-screen flex items-center justify-center bg-[url('../../src/assets/bg.png')] bg-cover">
      <div className="flex shadow-2xl">
        {/* Left Side - Login Form */}
        <div className="flex flex-col items-center justify-center text-center w-[300px] px-8 py-7 sm:w-[450px] sm:p-14 gap-6 bg-[#1F3C9A] rounded-2xl text-white lg:rounded-tr-none lg:rounded-br-none lg:p-16">
          <h1 className="text-4xl font-bold text-[#F3E9D3]">Welcome</h1>
          <form className="flex flex-col text-lg text-left w-full">
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
            <div className="flex gap-2 items-center mb-1 mt-4">
              <input type="checkbox" className="accent-[#9DC3ED] " />
              <span className="text-sm ">Remember me</span>
            </div>
            <button className="mb-1 mt-4 px-10 py-3 text-lg rounded-lg bg-[#1D214B] text-white hover:bg-[#9DC3ED] hover:text-[#1d214b] transition">
              Login
            </button>
          </form>
          <div className="flex flex-col items-center gap-0">
            <p className="text-sm font-medium">Don&apos;t have an account?</p>
            <Link
              to="/signup"
              className="text-sm text-[#9DC3ED] hover:underline"
            >
              Sign Up
            </Link>
          </div>
        </div>

        <img
          src={loginImage}
          alt="Login"
          className="w-[480px] object-cover lg:rounded-tr-2xl lg:rounded-br-2xl lg:block hidden"
        />
      </div>
    </section>
  );
}

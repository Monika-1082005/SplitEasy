import loginImage from "../../src/assets/login_form_img.jpeg";
import { Link } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_API_URL;

  const validateField = (fieldName, value) => {
    let message = "";

    switch (fieldName) {
      case "email":
        if (!value.trim()) {
          message = "Email is required";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          message = "Invalid email format";
        }
        break;

      case "password":
        if (!value) {
          message = "Password is required";
        } else if (value.length < 6) {
          message = "Password must be at least 6 characters";
        }
        break;

      default:
        break;
    }

    setErrors((prevErrors) => ({ ...prevErrors, [fieldName]: message }));
  };

  const validateForm = () => {
    const newErrors = {};

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(email)) {
      newErrors.email = "Invalid email format";
    }

    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    axios
      .post(`${apiUrl}/login`, { email, password })
      .then((result) => {
        const { userId, message } = result.data;

        if (message === "Login successful") {
          localStorage.setItem("userId", userId);
          navigate("/dashboard");
        } else {
          toast.error(message || "Login failed");
        }
      })
      .catch((err) => {
        if (err.response && err.response.status === 404) {
          toast.error(
            "User not found. Please check your credentials or register if you're a new user."
          );
        } else if (err.response && err.response.status === 403) {
          toast.error("Please verify your email before logging in.");
        } else if (err.response && err.response.status === 401) {
          toast.error("Incorrect password. Please try again.");
        } else {
          toast.error("An error occurred. Please try again later.");
        }
        console.log(err);
      });
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-[url('/bg.png')] bg-cover">
      <div className="flex shadow-2xl">
        {/* Left Side - Login Form */}
        <div className="flex flex-col items-center justify-center text-center w-[300px] px-8 py-7 sm:w-[450px] sm:p-14 gap-6 bg-[#1F3C9A] rounded-2xl text-white lg:rounded-tr-none lg:rounded-br-none lg:p-16">
          <h1 className="text-4xl font-bold text-[#F3E9D3]">Welcome</h1>
          <form
            className="flex flex-col text-lg text-left w-full"
            onSubmit={handleSubmit}
          >
            <label className="text-lg text-[#F3E9D3] mb-1 mt-4">Email</label>
            <input
              type="email"
              className="p-2 border border-gray-300 rounded-lg placeholder-gray-400 focus:border-[#9DC3ED] focus:bg-white text-[#1d214b] focus:outline-none"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                validateField("email", e.target.value);
              }}
              required
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-[3px] mb-2">
                {errors.email}
              </p>
            )}

            <label className="text-lg text-[#F3E9D3] mb-1 mt-4">Password</label>
            <input
              type="password"
              className="p-2 border border-gray-300 rounded-lg placeholder-gray-400 focus:border-[#9DC3ED] focus:bg-white text-[#1d214b] focus:outline-none"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                validateField("password", e.target.value);
              }}
              required
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-[3px] mb-2">
                {errors.password}
              </p>
            )}

            <div className="flex gap-2 items-center mb-1 mt-4">
              <input type="checkbox" className="accent-[#9DC3ED]" />
              <span className="text-sm">Remember me</span>
            </div>
            <button className="mb-1 mt-4 px-10 py-3 text-lg rounded-lg bg-[#1D214B] text-white hover:bg-[#9DC3ED] hover:text-[#1d214b] transition cursor-pointer">
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
      <ToastContainer />
    </section>
  );
}

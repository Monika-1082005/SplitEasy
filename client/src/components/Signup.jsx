import signUpImage from "../assets/signup_form_img.jpeg";
import { Link } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";

export default function Signup() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const validateField = (fieldName, value) => {
    let message = "";

    switch (fieldName) {
      case "username":
        if (!value.trim()) message = "Username is required";
        break;

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

      case "confirmPassword":
        if (!value) {
          message = "Please confirm your password";
        } else if (value !== password) {
          message = "Passwords do not match";
        }
        break;

      default:
        break;
    }

    setErrors((prevErrors) => ({ ...prevErrors, [fieldName]: message }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!username.trim()) {
      newErrors.username = "Username is required";
    }

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

    if (!confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    axios
      .post("http://localhost:3001/sign_up", {
        username,
        email,
        password,
      })
      .then((result) => {
        if (
          result.data.message ===
          "Signup successful. Please check your email to verify your account."
        ) {
          toast.success("Signup successful. Please verify your email.", {
            autoClose: 2500,
          });
          setTimeout(() => {
            navigate("/login");
          }, 4000);
        } else {
          toast.error(result.data.message || "Signup failed");
        }
      })
      .catch((err) => {
        console.log(err);
        toast.error("Something went wrong during signup.");
      });
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-[url('../../src/assets/bg.png')] bg-cover">
      <div className="flex shadow-2xl">
        {/* Left Side - Sign Up Form */}
        <div className="flex flex-col items-center justify-center text-center w-[300px] px-8 py-4 sm:w-[450px] sm:py-10 gap-3 bg-[#1F3C9A] rounded-2xl text-white lg:rounded-tr-none lg:rounded-br-none lg:px-16">
          <h1 className="text-2xl sm:text-4xl font-bold text-[#F3E9D3]">
            Sign Up
          </h1>
          <form
            className="flex flex-col text-lg text-left w-full"
            onSubmit={handleSubmit}
          >
            <label className="text-lg text-[#F3E9D3] mb-1 mt-4">Username</label>
            <input
              type="text"
              className="p-2 border border-gray-300 rounded-lg placeholder-gray-400 focus:border-[#9DC3ED] focus:bg-white text-[#1d214b] focus:outline-none"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                validateField("username", e.target.value);
              }}
              required
            />
            {errors.username && (
              <p className="text-red-500 text-sm mt-[3px] mb-2">
                {errors.username}
              </p>
            )}

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

            <label className="text-lg text-[#F3E9D3] mb-1 mt-4">
              Confirm Password
            </label>
            <input
              type="password"
              className="p-2 border border-gray-300 rounded-lg placeholder-gray-400 focus:border-[#9DC3ED] focus:bg-white text-[#1d214b] focus:outline-none"
              placeholder="Re-enter your password"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                validateField("confirmPassword", e.target.value);
              }}
              required
            />
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm mt-[3px] mb-2">
                {errors.confirmPassword}
              </p>
            )}

            <div className="flex gap-2 mt-4 items-center">
              <input type="checkbox" className="accent-[#9DC3ED]" />
              <span className="text-sm">Remember me</span>
            </div>

            <button className="px-6 py-3 mt-4 mb-4 text-lg rounded-lg bg-[#1D214B] text-white hover:bg-[#9DC3ED] hover:text-[#1d214b] transition cursor-pointer">
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

        <ToastContainer />

        {/* Right Side - Image */}
        <img
          src={signUpImage}
          alt="Sign Up"
          className="w-[490px] lg:rounded-tr-2xl lg:rounded-br-2xl lg:block hidden"
        />
      </div>
    </section>
  );
}

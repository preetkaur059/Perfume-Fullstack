import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../../api/client";

const Signup = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    terms: false,
  });

  const [errors, setErrors] = useState({});

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });

    // remove error when the user type
    setErrors({
      ...errors,
      [name]: "",
    });
  };

  // Validation
  const validateForm = () => {
    let newErrors = {};

    // Full Name validation
    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full Name is required";
    } else if (formData.fullName.trim().length < 3) {
      newErrors.fullName = "Full Name must be at least 3 characters";
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)
    ) {
      newErrors.email = "Please enter a valid email address";
    }

    // Password validation
    if (!formData.password.trim()) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    // Confirm Password validation
    if (!formData.confirmPassword.trim()) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    // Terms validation
    if (!formData.terms) {
      newErrors.terms = "You must agree to Terms & Conditions";
    }

    setErrors(newErrors);

    // No errors = true
    return Object.keys(newErrors).length === 0;
  };

  // Create Account
 const handleSignup = async (e) => {
  e.preventDefault();

  const isValid = validateForm();

  if (!isValid) {
    return;
  }

  try {
    const { data } = await api.post("/users/register", formData);

    if (data.success) {
    toast.success("Account created successfully!");

    navigate("/login");

    } else {
      toast.error(data.msg || "Something went wrong");

      setErrors({
        email: data.msg || "Something went wrong",
      });
    }
  } catch (error) {
    setErrors({
      email: error.response?.data?.msg || "Server error. Please try again.",
    });
  }
};
  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4 py-30">
      <div className="w-full max-w-md">

        {/* Signup Card */}
        <div className="bg-[#111111] border border-white/10 rounded-2xl p-6 md:p-8 shadow-2xl">

          <h2 className="text-3xl mb-5 font-bold text-white text-center">
            Create Account
          </h2>

          {/* Full Name */}
          <div className="mb-5">
            <label className="block text-white mb-2">
              Full Name
            </label>

            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Enter your full name"
              className={`w-full bg-black border ${
                errors.fullName
                  ? "border-red-500"
                  : "border-gray-700"
              }
              rounded-lg px-4 py-3 text-white
              placeholder-gray-500 outline-none
              focus:border-[#e2f2b0] transition duration-300`}
            />

            {errors.fullName && (
              <p className="text-red-500 text-sm mt-1">
                {errors.fullName}
              </p>
            )}
          </div>

          {/* Email */}
          <div className="mb-5">
            <label className="block text-white mb-2">
              Email Address
            </label>

            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className={`w-full bg-black border ${
                errors.email
                  ? "border-red-500"
                  : "border-gray-700"
              }
              rounded-lg px-4 py-3 text-white
              placeholder-gray-500 outline-none
              focus:border-[#e2f2b0] transition duration-300`}
            />

            {errors.email && (
              <p className="text-red-500 text-sm mt-1">
                {errors.email}
              </p>
            )}
          </div>

          {/* Password */}
          <div className="mb-5">
            <label className="block text-white mb-2">
              Password
            </label>

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Create a password"
                className={`w-full bg-black border ${
                  errors.password
                    ? "border-red-500"
                    : "border-gray-700"
                }
                rounded-lg px-4 py-3 pr-16 text-white
                placeholder-gray-500 outline-none
                focus:border-[#e2f2b0] transition duration-300`}
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2
                -translate-y-1/2 text-sm
                text-[#e2f2b0] cursor-pointer"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>

            {errors.password && (
              <p className="text-red-500 text-sm mt-1">
                {errors.password}
              </p>
            )}
          </div>

          {/* Confirm Password */}
          <div className="mb-5">
            <label className="block text-white mb-2">
              Confirm Password
            </label>

            <div className="relative">
              <input
                type={
                  showConfirmPassword ? "text" : "password"
                }
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm your password"
                className={`w-full bg-black border ${
                  errors.confirmPassword
                    ? "border-red-500"
                    : "border-gray-700"
                }
                rounded-lg px-4 py-3 pr-16 text-white
                placeholder-gray-500 outline-none
                focus:border-[#e2f2b0] transition duration-300`}
              />

              <button
                type="button"
                onClick={() =>
                  setShowConfirmPassword(!showConfirmPassword)
                }
                className="absolute right-4 top-1/2
                -translate-y-1/2 text-sm
                text-[#e2f2b0] cursor-pointer"
              >
                {showConfirmPassword ? "Hide" : "Show"}
              </button>
            </div>

            {errors.confirmPassword && (
              <p className="text-red-500 text-sm mt-1">
                {errors.confirmPassword}
              </p>
            )}
          </div>

          {/* Terms */}
          <div className="mb-6">
            <div className="flex gap-2 items-start">
              <input
                type="checkbox"
                name="terms"
                checked={formData.terms}
                onChange={handleChange}
                className="mt-1 accent-lime-300"
              />

              <p className="text-gray-400 text-sm leading-5">
                I agree to{" "}
                <span className="text-[#e2f2b0] cursor-pointer">
                  Terms & Conditions
                </span>{" "}
                and Privacy Policy.
              </p>
            </div>

            {errors.terms && (
              <p className="text-red-500 text-sm mt-1">
                {errors.terms}
              </p>
            )}
          </div>

          {/* Signup Button */}
          <button
            type="button"
            onClick={handleSignup}
            className="w-full py-3 rounded-lg
            bg-gradient-to-b from-lime-200 to-lime-300
            text-black font-bold text-lg
            cursor-pointer
            transition duration-300
            hover:scale-[1.02]"
          >
            Create Account
          </button>

          {/* Login */}
          <p className="text-gray-400 text-center mt-7">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-[#e2f2b0] font-semibold
              hover:text-[#efc3c5] transition"
            >
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;

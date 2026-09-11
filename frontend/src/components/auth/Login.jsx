import React, { useState } from "react";
import { Link, useNavigate  } from "react-router-dom";
import { toast } from "react-toastify";
import { useLogin } from "@/hooks/auth/useAuth";

const Login = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  // Form Data
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  // Errors
  const [errors, setErrors] = useState({});
  const login = useLogin();

  // Handle Input Change
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
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
      newErrors.password =
        "Password must be at least 6 characters";
    }

    setErrors(newErrors);

    // true = no errors
    return Object.keys(newErrors).length === 0;
  };

  // Login Submit
  const handleLogin = async (e) => {
  e.preventDefault();

  const isValid = validateForm();

  if (!isValid) {
    return;
  }

  try {
    const data = await login.mutateAsync(formData);

    if (data.success) {
      toast.success("Login successful!");

      navigate("/admin", { replace: true });
    } else {
      toast.error(data.msg || "Invalid email or password");
    }

  } catch (error) {
    setErrors({
      email: error.response?.data?.msg || "Server error. Please try again.",
    });
  }
};

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4 py-10 pt-30">
      <div className="w-full max-w-md">

        {/* Login Card */}
        <div className="bg-[#111111] border border-[#f5f5dc]/20 rounded-2xl p-8 shadow-2xl">

          <h2 className="text-3xl font-bold text-white text-center">
            Welcome Back
          </h2>

          <p className="text-gray-400 text-center mt-2 mb-8">
            Login to continue your fragrance journey
          </p>

          {/* Email */}
          <div className="mb-5">
            <label className="block text-white mb-2 font-medium">
              Email Address
            </label>

            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className={`w-full px-4 py-3 bg-black border
                ${
                  errors.email
                    ? "border-red-500"
                    : "border-gray-700"
                }
                rounded-lg text-white placeholder-gray-500
                outline-none focus:border-[#e2f2b0]
                transition duration-300`}
            />

            {/* Email Error */}
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">
                {errors.email}
              </p>
            )}
          </div>

          {/* Password */}
          <div className="mb-6">
            <label className="block text-white mb-2 font-medium">
              Password
            </label>

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                className={`w-full px-4 py-3 pr-16 bg-black border
                  ${
                    errors.password
                      ? "border-red-500"
                      : "border-gray-700"
                  }
                  rounded-lg text-white placeholder-gray-500
                  outline-none focus:border-[#e2f2b0]
                  transition duration-300`}
              />

              {/* Show / Hide */}
              <button
                type="button"
                onClick={() =>
                  setShowPassword(!showPassword)
                }
                  className="absolute right-4 top-1/2
                -translate-y-1/2 text-[#e2f2b0]
                text-sm cursor-pointer"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>

            {/* Password Error */}
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">
                {errors.password}
              </p>
            )}
          </div>

          {/* Forgot Password */}
          <div className="flex justify-end mb-6">
            <Link
              to="/forgot-password"
              className="text-[#e2f2b0] text-sm
              hover:text-[#efc3c5] transition"
            >
              Forgot Password?
            </Link>
          </div>

          {/* Login Button */}
          <button
            type="button"
            onClick={handleLogin}
            disabled={login.isPending}
            className="w-full py-3
            bg-gradient-to-b from-lime-200 to-lime-300
            text-black font-bold text-lg rounded-lg
            cursor-pointer transition duration-300
            hover:scale-[1.02]
            hover:bg-gradient-to-b
            hover:from-lime-300 hover:to-lime-200"
          >
            {login.isPending ? "Logging in..." : "Login"}
          </button>

          {/* Signup */}
          <p className="text-gray-400 text-center mt-7">
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="text-[#e2f2b0] font-semibold
              hover:text-[#efc3c5] transition"
            >
              Create Account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;

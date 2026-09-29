import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useLogin } from "@/hooks/auth/useAuth";

const loginValidationSchema = Yup.object({
  email: Yup.string()
    .email("Please enter a valid email address")
    .required("Email is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showPassword, setShowPassword] = useState(false);
  const login = useLogin();

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: loginValidationSchema,
    onSubmit: async (values, { setFieldError }) => {
      try {
        const data = await login.mutateAsync(values);

        if (data.success) {
          toast.success("Login successful!");

          const destination =
            location.state?.from?.pathname ||
            (data.user?.isAdmin ? "/admin" : "/");

          navigate(destination, { replace: true });
        } else {
          toast.error(data.msg || "Invalid email or password");
          setFieldError("email", data.msg || "Invalid email or password");
        }
      } catch (error) {
        setFieldError(
          "email",
          error.response?.data?.msg || "Server error. Please try again."
        );
      }
    },
  });

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

          <form onSubmit={formik.handleSubmit}>
            {/* Email */}
            <div className="mb-5">
              <label className="block text-white mb-2 font-medium">
                Email Address
              </label>

              <input
                type="email"
                name="email"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Enter your email"
                className={`w-full px-4 py-3 bg-black border ${
                  formik.touched.email && formik.errors.email
                    ? "border-red-500"
                    : "border-gray-700"
                } rounded-lg text-white placeholder-gray-500 outline-none focus:border-[#e2f2b0] transition duration-300`}
              />

              {/* Email Error */}
              {formik.touched.email && formik.errors.email && (
                <p className="text-red-500 text-sm mt-1">
                  {formik.errors.email}
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
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder="Enter your password"
                  className={`w-full px-4 py-3 pr-16 bg-black border ${
                    formik.touched.password && formik.errors.password
                      ? "border-red-500"
                      : "border-gray-700"
                  } rounded-lg text-white placeholder-gray-500 outline-none focus:border-[#e2f2b0] transition duration-300`}
                />

                {/* Show / Hide */}
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#e2f2b0] text-sm cursor-pointer"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>

              {/* Password Error */}
              {formik.touched.password && formik.errors.password && (
                <p className="text-red-500 text-sm mt-1">
                  {formik.errors.password}
                </p>
              )}
            </div>

            {/* Forgot Password */}
            <div className="flex justify-end mb-6">
              <Link
                to="/forgot-password"
                className="text-[#e2f2b0] text-sm hover:text-[#efc3c5] transition"
              >
                Forgot Password?
              </Link>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={login.isPending}
              className="w-full py-3 bg-gradient-to-b from-lime-200 to-lime-300 text-black font-bold text-lg rounded-lg cursor-pointer transition duration-300 hover:scale-[1.02] hover:bg-gradient-to-b hover:from-lime-300 hover:to-lime-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {login.isPending ? "Logging in..." : "Login"}
            </button>
          </form>

          {/* Signup */}
          <p className="text-gray-400 text-center mt-7">
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="text-[#e2f2b0] font-semibold hover:text-[#efc3c5] transition"
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

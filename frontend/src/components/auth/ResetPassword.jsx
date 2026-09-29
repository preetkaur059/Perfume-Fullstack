import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";

const resetPasswordSchema = Yup.object({
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords do not match")
    .required("Please confirm your password"),
});

function ResetPassword() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const formik = useFormik({
    initialValues: {
      password: "",
      confirmPassword: "",
    },
    validationSchema: resetPasswordSchema,
    onSubmit: () => {
      console.log("Password reset successfully");
      toast.success("Password reset successfully!");
      navigate("/login");
    },
  });

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">

      <div className="w-full max-w-md bg-[#111111] border border-gray-800 rounded-2xl p-8 shadow-2xl">

        {/* Heading */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-semibold text-white tracking-wide">
            Reset Password
          </h1>

          <p className="text-gray-400 mt-3 text-sm leading-6">
            Create a new password for your account.
          </p>
        </div>

        <form onSubmit={formik.handleSubmit}>

          {/* New Password */}
          <div className="mb-5">
            <label className="block text-gray-300 text-sm mb-2">
              New Password
            </label>

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Enter new password"
                className={`w-full bg-black border ${
                  formik.touched.password && formik.errors.password
                    ? "border-red-500"
                    : "border-gray-700"
                } rounded-lg px-4 py-3 pr-16 text-white placeholder-gray-600 outline-none focus:border-white transition`}
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white text-sm cursor-pointer"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>

            {formik.touched.password && formik.errors.password && (
              <p className="text-red-500 text-sm mt-1">
                {formik.errors.password}
              </p>
            )}
          </div>

          {/* Confirm Password */}
          <div className="mb-6">
            <label className="block text-gray-300 text-sm mb-2">
              Confirm Password
            </label>

            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={formik.values.confirmPassword}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Confirm new password"
                className={`w-full bg-black border ${
                  formik.touched.confirmPassword && formik.errors.confirmPassword
                    ? "border-red-500"
                    : "border-gray-700"
                } rounded-lg px-4 py-3 pr-16 text-white placeholder-gray-600 outline-none focus:border-white transition`}
              />

              <button
                type="button"
                onClick={() =>
                  setShowConfirmPassword(!showConfirmPassword)
                }
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white text-sm cursor-pointer"
              >
                {showConfirmPassword ? "Hide" : "Show"}
              </button>
            </div>

            {formik.touched.confirmPassword && formik.errors.confirmPassword && (
              <p className="text-red-500 text-sm mt-1">
                {formik.errors.confirmPassword}
              </p>
            )}
          </div>

          {/* Reset Button */}
          <button
            type="submit"
            className="w-full bg-white text-black py-3 rounded-lg font-medium hover:bg-gray-200 transition duration-300 cursor-pointer"
          >
            Reset Password
          </button>

        </form>

        {/* Back to Login */}
        <div className="text-center mt-6">
          <Link
            to="/login"
            className="text-gray-400 hover:text-white text-sm transition"
          >
            ← Back to Login
          </Link>
        </div>

      </div>
    </div>
  );
}

export default ResetPassword;
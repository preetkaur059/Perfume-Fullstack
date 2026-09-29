import React from "react";
import { Link } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";

const forgotPasswordSchema = Yup.object({
  email: Yup.string()
    .trim()
    .email("Please enter a valid email address")
    .required("Email is required"),
});

function ForgotPassword() {
  const formik = useFormik({
    initialValues: {
      email: "",
    },
    validationSchema: forgotPasswordSchema,
    onSubmit: (values) => {
      console.log("Reset password link sent to:", values.email);
      toast.success("Reset password link sent to your email!");
    },
  });

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">

      <div className="w-full max-w-md bg-[#111111] border border-gray-800 rounded-2xl p-8 shadow-2xl">

        {/* Heading */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-semibold text-white tracking-wide">
            Forgot Password?
          </h1>

          <p className="text-gray-400 mt-3 text-sm leading-6">
            Enter your email address and we'll send you a link to reset
            your password.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={formik.handleSubmit}>

          <div className="mb-6">
            <label className="block text-gray-300 text-sm mb-2">
              Email Address
            </label>

            <input
              type="email"
              name="email"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="Enter your email"
              className={`w-full bg-black border ${
                formik.touched.email && formik.errors.email
                  ? "border-red-500"
                  : "border-gray-700"
              } rounded-lg px-4 py-3 text-white placeholder-gray-600 outline-none focus:border-white transition`}
            />

            {formik.touched.email && formik.errors.email && (
              <p className="text-red-500 text-sm mt-1">
                {formik.errors.email}
              </p>
            )}
          </div>

          {/* Button */}
          <button
            type="submit"
            className="w-full bg-white text-black py-3 rounded-lg font-medium hover:bg-gray-200 transition duration-300 cursor-pointer"
          >
            Send Reset Link
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

export default ForgotPassword;
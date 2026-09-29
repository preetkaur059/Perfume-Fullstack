import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useFormik } from "formik";
import * as Yup from "yup";
import api from "../../api/client";

const Signup = () => {
    const navigate = useNavigate();

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    // OTP step
    const [otpSent, setOtpSent] = useState(false);
    const [otp, setOtp] = useState("");
    const [otpLoading, setOtpLoading] = useState(false);
    const [verifyLoading, setVerifyLoading] = useState(false);

    // Yup validation
    const validationSchema = Yup.object({
        fullName: Yup.string()
            .trim()
            .min(3, "Full Name must be at least 3 characters")
            .required("Full Name is required"),

        email: Yup.string()
            .trim()
            .email("Please enter a valid email address")
            .required("Email is required"),

        password: Yup.string()
            .min(6, "Password must be at least 6 characters")
            .required("Password is required"),

        confirmPassword: Yup.string()
            .oneOf(
                [Yup.ref("password")],
                "Passwords do not match"
            )
            .required("Please confirm your password"),

        terms: Yup.boolean()
            .oneOf(
                [true],
                "You must agree to Terms & Conditions"
            ),
    });

    const formik = useFormik({
        initialValues: {
            fullName: "",
            email: "",
            password: "",
            confirmPassword: "",
            terms: false,
        },

        validationSchema,

        onSubmit: async () => {
            await sendOTP();
        },
    });

    // =========================
    // SEND OTP
    // =========================

    const sendOTP = async () => {
        // Validate signup form first
        const errors = await formik.validateForm();

        formik.setTouched({
            fullName: true,
            email: true,
            password: true,
            confirmPassword: true,
            terms: true,
        });

        if (Object.keys(errors).length > 0) {
            return;
        }

        try {
            setOtpLoading(true);

            const { data } = await api.post(
                "/users/send-signup-otp",
                {
                    email: formik.values.email,
                }
            );

            toast.success(
                data.message || "OTP sent successfully!"
            );

            setOtpSent(true);
        } catch (error) {
            console.log("SEND OTP ERROR:", error);
            console.log(
                "SERVER RESPONSE:",
                error.response?.data
            );

            toast.error(
                error.response?.data?.message ||
                "Failed to send OTP"
            );
        } finally {
            setOtpLoading(false);
        }
    };

    // =========================
    // VERIFY OTP
    // =========================

    const verifyOTP = async () => {
        if (!otp.trim()) {
            toast.error("Please enter OTP");
            return;
        }

        if (otp.length !== 6) {
            toast.error("OTP must be 6 digits");
            return;
        }

        try {
            setVerifyLoading(true);

            const { data } = await api.post(
                "/users/verify-signup-otp",
                {
                    email: formik.values.email,
                    otp: otp,
                    fullName: formik.values.fullName,
                    password: formik.values.password,
                }
            );

            if (data.user) {
                toast.success(
                    data.message || "Signup successful!"
                );

                navigate("/login");
            }
        } catch (error) {
            toast.error(
                error.response?.data?.message ||
                "Invalid or expired OTP"
            );
        } finally {
            setVerifyLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-black flex items-center justify-center px-4 py-30">

            <div className="w-full max-w-md">

                <div className="bg-[#111111] border border-white/10 rounded-2xl p-6 md:p-8 shadow-2xl">

                    <h2 className="text-3xl mb-5 font-bold text-white text-center">
                        {otpSent
                            ? "Verify Your Email"
                            : "Create Account"}
                    </h2>

                    {!otpSent ? (

                        /* =========================
                           SIGNUP FORM
                        ========================= */

                        <form onSubmit={formik.handleSubmit}>

                            {/* Full Name */}

                            <div className="mb-5">

                                <label className="block text-white mb-2">
                                    Full Name
                                </label>

                                <input
                                    type="text"
                                    name="fullName"
                                    value={formik.values.fullName}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    placeholder="Enter your full name"
                                    className={`w-full bg-black border ${formik.touched.fullName &&
                                        formik.errors.fullName
                                        ? "border-red-500"
                                        : "border-gray-700"
                                        } rounded-lg px-4 py-3 text-white
                                    placeholder-gray-500 outline-none
                                    focus:border-[#e2f2b0]`}
                                />

                                {formik.touched.fullName &&
                                    formik.errors.fullName && (
                                        <p className="text-red-500 text-sm mt-1">
                                            {formik.errors.fullName}
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
                                    value={formik.values.email}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    placeholder="Enter your email"
                                    className={`w-full bg-black border ${formik.touched.email &&
                                        formik.errors.email
                                        ? "border-red-500"
                                        : "border-gray-700"
                                        } rounded-lg px-4 py-3 text-white
                                    placeholder-gray-500 outline-none
                                    focus:border-[#e2f2b0]`}
                                />

                                {formik.touched.email &&
                                    formik.errors.email && (
                                        <p className="text-red-500 text-sm mt-1">
                                            {formik.errors.email}
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
                                        type={
                                            showPassword
                                                ? "text"
                                                : "password"
                                        }
                                        name="password"
                                        value={formik.values.password}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        placeholder="Create a password"
                                        className={`w-full bg-black border ${formik.touched.password &&
                                            formik.errors.password
                                            ? "border-red-500"
                                            : "border-gray-700"
                                            } rounded-lg px-4 py-3 pr-16 text-white
                                        placeholder-gray-500 outline-none
                                        focus:border-[#e2f2b0]`}
                                    />

                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowPassword(
                                                !showPassword
                                            )
                                        }
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-[#e2f2b0] cursor-pointer"
                                    >
                                        {showPassword
                                            ? "Hide"
                                            : "Show"}
                                    </button>

                                </div>

                                {formik.touched.password &&
                                    formik.errors.password && (
                                        <p className="text-red-500 text-sm mt-1">
                                            {formik.errors.password}
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
                                            showConfirmPassword
                                                ? "text"
                                                : "password"
                                        }
                                        name="confirmPassword"
                                        value={
                                            formik.values
                                                .confirmPassword
                                        }
                                        onChange={
                                            formik.handleChange
                                        }
                                        onBlur={
                                            formik.handleBlur
                                        }
                                        placeholder="Confirm your password"
                                        className={`w-full bg-black border ${formik.touched
                                            .confirmPassword &&
                                            formik.errors
                                                .confirmPassword
                                            ? "border-red-500"
                                            : "border-gray-700"
                                            } rounded-lg px-4 py-3 pr-16 text-white
                                        placeholder-gray-500 outline-none
                                        focus:border-[#e2f2b0]`}
                                    />

                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowConfirmPassword(
                                                !showConfirmPassword
                                            )
                                        }
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-[#e2f2b0] cursor-pointer"
                                    >
                                        {showConfirmPassword
                                            ? "Hide"
                                            : "Show"}
                                    </button>

                                </div>

                                {formik.touched.confirmPassword &&
                                    formik.errors.confirmPassword && (
                                        <p className="text-red-500 text-sm mt-1">
                                            {
                                                formik.errors
                                                    .confirmPassword
                                            }
                                        </p>
                                    )}

                            </div>

                            {/* Terms */}

                            <div className="mb-6">

                                <div className="flex gap-2 items-start">

                                    <input
                                        type="checkbox"
                                        name="terms"
                                        checked={
                                            formik.values.terms
                                        }
                                        onChange={
                                            formik.handleChange
                                        }
                                        onBlur={
                                            formik.handleBlur
                                        }
                                        className="mt-1 accent-lime-300"
                                    />

                                    <p className="text-gray-400 text-sm leading-5">

                                        I agree to{" "}

                                        <span className="text-[#e2f2b0]">
                                            Terms & Conditions
                                        </span>{" "}

                                        and Privacy Policy.

                                    </p>

                                </div>

                                {formik.touched.terms &&
                                    formik.errors.terms && (
                                        <p className="text-red-500 text-sm mt-1">
                                            {formik.errors.terms}
                                        </p>
                                    )}

                            </div>

                            {/* Send OTP */}

                            <button
                                type="submit"
                                disabled={otpLoading}
                                className="w-full py-3 rounded-lg
                                bg-gradient-to-b from-lime-200 to-lime-300
                                text-black font-bold text-lg
                                cursor-pointer
                                hover:scale-[1.02]
                                transition duration-300
                                disabled:opacity-50"
                            >
                                {otpLoading
                                    ? "Sending OTP..."
                                    : "Send OTP"}
                            </button>

                        </form>

                    ) : (

                        /* =========================
                           OTP FORM
                        ========================= */

                        <div>

                            <p className="text-gray-400 text-center mb-6">

                                We have sent a 6-digit OTP to

                                <br />

                                <span className="text-[#e2f2b0]">
                                    {formik.values.email}
                                </span>

                            </p>

                            <div className="mb-5">

                                <label className="block text-white mb-2">
                                    Enter OTP
                                </label>

                                <input
                                    type="text"
                                    value={otp}
                                    onChange={(e) => {

                                        const value =
                                            e.target.value.replace(
                                                /\D/g,
                                                ""
                                            );

                                        if (value.length <= 6) {
                                            setOtp(value);
                                        }

                                    }}
                                    placeholder="Enter 6-digit OTP"
                                    maxLength={6}
                                    className="w-full bg-black border border-gray-700
                                    rounded-lg px-4 py-3 text-white
                                    placeholder-gray-500 outline-none
                                    focus:border-[#e2f2b0]
                                    text-center tracking-[8px] text-xl"
                                />

                            </div>

                            {/* Verify OTP */}

                            <button
                                type="button"
                                onClick={verifyOTP}
                                disabled={verifyLoading}
                                className="w-full py-3 rounded-lg
                                bg-gradient-to-b from-lime-200 to-lime-300
                                text-black font-bold text-lg
                                cursor-pointer
                                hover:scale-[1.02]
                                transition duration-300
                                disabled:opacity-50"
                            >
                                {verifyLoading
                                    ? "Verifying..."
                                    : "Verify OTP"}
                            </button>

                            {/* Change Email */}

                            <button
                                type="button"
                                onClick={() => {
                                    setOtpSent(false);
                                    setOtp("");
                                }}
                                className="w-full mt-4 text-[#e2f2b0] text-sm cursor-pointer"
                            >
                                Change Email
                            </button>

                            {/* Resend OTP */}

                            <button
                                type="button"
                                onClick={sendOTP}
                                disabled={otpLoading}
                                className="w-full mt-3 text-gray-400 text-sm cursor-pointer hover:text-white"
                            >
                                {otpLoading
                                    ? "Sending..."
                                    : "Resend OTP"}
                            </button>

                        </div>
                    )}

                    {/* Login */}

                    {!otpSent && (

                        <p className="text-gray-400 text-center mt-7">

                            Already have an account?{" "}

                            <Link
                                to="/login"
                                className="text-[#e2f2b0] font-semibold hover:text-[#efc3c5] transition"
                            >
                                Login
                            </Link>

                        </p>

                    )}

                </div>

            </div>

        </div>
    );
};

export default Signup;
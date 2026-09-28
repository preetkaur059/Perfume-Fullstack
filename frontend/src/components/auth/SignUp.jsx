import React, { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../../api/client";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");

  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);

  // Send OTP
  const handleSendOTP = async () => {
    if (!email.trim()) {
      toast.error("Email is required");
      return;
    }

    try {
      setLoading(true);

      const { data } = await api.post(
        "/users/send-signup-otp",
        {
          email,
        }
      );

      // Backend returns { message: "OTP sent successfully" }
      toast.success(data.message);

      setOtpSent(true);
    } catch (error) {
      console.error(error);

      const message =
        error.response?.data?.message ||
        "Failed to send OTP. Please try again.";

      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  // Verify OTP
  const handleVerifyOTP = async () => {
    if (!otp.trim()) {
      toast.error("Please enter OTP");
      return;
    }

    if (otp.length !== 6) {
      toast.error("OTP must be 6 digits");
      return;
    }

    try {
      setLoading(true);

      const { data } = await api.post(
        "/users/verify-signup-otp",
        {
          email,
          otp,
        }
      );

      toast.success(data.message);

      console.log("OTP verified successfully");

      // Later you can continue signup here
      // Example:
      // navigate("/complete-signup");

    } catch (error) {
      console.error(error);

      const message =
        error.response?.data?.message ||
        "Invalid or expired OTP";

      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">

      <div className="w-full max-w-md">

        <div className="bg-[#111111] border border-white/10 rounded-2xl p-6 md:p-8 shadow-2xl">

          <h2 className="text-3xl mb-6 font-bold text-white text-center">
            Create Account
          </h2>

          {/* Email */}
          <div className="mb-6">

            <label className="block text-white mb-2">
              Email Address
            </label>

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              disabled={otpSent}
              className="
                w-full bg-black border border-gray-700
                rounded-lg px-4 py-3 text-white
                placeholder-gray-500 outline-none
                focus:border-[#e2f2b0]
                transition duration-300
                disabled:opacity-50
              "
            />

          </div>

          {/* OTP */}
          {otpSent && (
            <div className="mb-6">

              <label className="block text-white mb-2">
                Enter OTP
              </label>

              <input
                type="text"
                inputMode="numeric"
                maxLength={6}
                value={otp}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, "");
                  setOtp(value);
                }}
                placeholder="Enter 6-digit OTP"
                className="
                  w-full bg-black border border-gray-700
                  rounded-lg px-4 py-3 text-white
                  placeholder-gray-500 outline-none
                  focus:border-[#e2f2b0]
                  transition duration-300
                  tracking-[0.3em]
                "
              />

              <p className="text-gray-400 text-sm mt-2">
                OTP has been sent to{" "}
                <span className="text-[#e2f2b0]">
                  {email}
                </span>
              </p>

            </div>
          )}

          {/* Button */}
          {!otpSent ? (

            <button
              type="button"
              onClick={handleSendOTP}
              disabled={loading}
              className="
                w-full py-3 rounded-lg
                bg-gradient-to-b from-lime-200 to-lime-300
                text-black font-bold text-lg
                cursor-pointer
                transition duration-300
                hover:scale-[1.02]
                disabled:opacity-50
                disabled:cursor-not-allowed
              "
            >
              {loading ? "Sending OTP..." : "Send OTP"}
            </button>

          ) : (

            <button
              type="button"
              onClick={handleVerifyOTP}
              disabled={loading}
              className="
                w-full py-3 rounded-lg
                bg-gradient-to-b from-lime-200 to-lime-300
                text-black font-bold text-lg
                cursor-pointer
                transition duration-300
                hover:scale-[1.02]
                disabled:opacity-50
                disabled:cursor-not-allowed
              "
            >
              {loading
                ? "Verifying..."
                : "Verify OTP"}
            </button>

          )}

          {/* Login */}
          <p className="text-gray-400 text-center mt-7">

            Already have an account?{" "}

            <Link
              to="/login"
              className="
                text-[#e2f2b0]
                font-semibold
                hover:text-[#efc3c5]
                transition
              "
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
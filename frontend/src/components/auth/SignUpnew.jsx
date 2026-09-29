import React, { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../../api/client";

const Signups = () => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  // Send OTP
  const handleSendOTP = async (e) => {
    e.preventDefault();

    if (!email.trim()) {
      toast.error("Please enter your email");
      return;
    }

    try {
      setLoading(true);

      const { data } = await api.post("/users/send-signup", {
        email,
      });

      toast.success(data.message || "OTP sent successfully");

      setStep(2);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to send OTP"
      );
    } finally {
      setLoading(false);
    }
  };

  // Verify OTP
  const handleVerifyOTP = async (e) => {
    e.preventDefault();

    if (!otp.trim()) {
      toast.error("Please enter OTP");
      return;
    }

    try {
      setLoading(true);

      const { data } = await api.post("/users/verify-signup", {
        email,
        otp,
      });

      toast.success(data.message || "Email verified successfully");

      console.log("Verified user:", data.user);

      // You can navigate to the next signup step here
      // navigate("/signup/details");

    } catch (error) {
      toast.error(
        error.response?.data?.message || "Invalid OTP"
      );
    } finally {
      setLoading(false);
    }
  };

  // Resend OTP
  const handleResendOTP = async () => {
    try {
      setLoading(true);

      const { data } = await api.post("/users/send-signup", {
        email,
      });

      toast.success(data.message || "OTP resent successfully");

      setOtp("");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to resend OTP"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4 py-20">
      <div className="w-full max-w-md">

        <div className="bg-[#111111] border border-white/10 rounded-2xl p-6 md:p-8 shadow-2xl">

          <h2 className="text-3xl mb-2 font-bold text-white text-center">
            Create Account
          </h2>

          <p className="text-gray-400 text-center mb-8">
            {step === 1
              ? "Enter your email to continue"
              : "Enter the OTP sent to your email"}
          </p>

          {/* STEP 1 - EMAIL */}
          {step === 1 && (
            <form onSubmit={handleSendOTP}>

              <div className="mb-6">
                <label className="block text-white mb-2">
                  Email Address
                </label>

                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full bg-black border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 outline-none focus:border-[#e2f2b0] transition duration-300"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-lg bg-gradient-to-b from-lime-200 to-lime-300 text-black font-bold text-lg cursor-pointer transition duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Sending OTP..." : "Send OTP"}
              </button>

            </form>
          )}

          {/* STEP 2 - OTP */}
          {step === 2 && (
            <form onSubmit={handleVerifyOTP}>

              <div className="mb-6">
                <label className="block text-white mb-2">
                  Enter OTP
                </label>

                <input
                  type="text"
                  value={otp}
                  onChange={(e) => {
                    const value = e.target.value
                      .replace(/\D/g, "")
                      .slice(0, 6);

                    setOtp(value);
                  }}
                  placeholder="Enter 6 digit OTP"
                  maxLength={6}
                  className="w-full bg-black border border-gray-700 rounded-lg px-4 py-3 text-white text-center tracking-[8px] placeholder-gray-500 placeholder:tracking-normal outline-none focus:border-[#e2f2b0] transition duration-300"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-lg bg-gradient-to-b from-lime-200 to-lime-300 text-black font-bold text-lg cursor-pointer transition duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Verifying..." : "Verify OTP"}
              </button>

              <div className="flex justify-between items-center mt-5">

                <button
                  type="button"
                  onClick={() => {
                    setStep(1);
                    setOtp("");
                  }}
                  className="text-gray-400 hover:text-white text-sm cursor-pointer"
                >
                  Change Email
                </button>

                <button
                  type="button"
                  onClick={handleResendOTP}
                  disabled={loading}
                  className="text-[#e2f2b0] hover:text-lime-300 text-sm cursor-pointer"
                >
                  Resend OTP
                </button>

              </div>

            </form>
          )}

          <p className="text-gray-400 text-center mt-7">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-[#e2f2b0] font-semibold hover:text-lime-300 transition"
            >
              Login
            </Link>
          </p>

        </div>
      </div>
    </div>
  );
};

export default Signups;
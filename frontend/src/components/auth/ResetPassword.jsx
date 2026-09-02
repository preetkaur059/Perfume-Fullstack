import React, { useState } from "react";

function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!password || !confirmPassword) {
      alert("Please fill in all fields");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    console.log("Password reset successfully");
  };

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

        <form onSubmit={handleSubmit}>

          {/* New Password */}
          <div className="mb-5">
            <label className="block text-gray-300 text-sm mb-2">
              New Password
            </label>

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter new password"
                className="w-full bg-black border border-gray-700 rounded-lg
                px-4 py-3 pr-16 text-white placeholder-gray-600
                outline-none focus:border-white transition"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2
                text-gray-400 hover:text-white text-sm"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div className="mb-6">
            <label className="block text-gray-300 text-sm mb-2">
              Confirm Password
            </label>

            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
                className="w-full bg-black border border-gray-700 rounded-lg
                px-4 py-3 pr-16 text-white placeholder-gray-600
                outline-none focus:border-white transition"
              />

              <button
                type="button"
                onClick={() =>
                  setShowConfirmPassword(!showConfirmPassword)
                }
                className="absolute right-4 top-1/2 -translate-y-1/2
                text-gray-400 hover:text-white text-sm"
              >
                {showConfirmPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          {/* Reset Button */}
          <button
            type="submit"
            className="w-full bg-white text-black py-3 rounded-lg
            font-medium hover:bg-gray-200 transition duration-300"
          >
            Reset Password
          </button>

        </form>

        {/* Back to Login */}
        <div className="text-center mt-6">
          <a
            href="/login"
            className="text-gray-400 hover:text-white text-sm transition"
          >
            ← Back to Login
          </a>
        </div>

      </div>
    </div>
  );
}

export default ResetPassword;
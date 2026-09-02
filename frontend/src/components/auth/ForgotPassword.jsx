import React, { useState } from "react";

function ForgotPassword() {
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!email) {
      alert("Please enter your email address");
      return;
    }

    console.log("Reset password link sent to:", email);
  };

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
        <form onSubmit={handleSubmit}>

          <div className="mb-6">
            <label className="block text-gray-300 text-sm mb-2">
              Email Address
            </label>

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full bg-black border border-gray-700 rounded-lg
              px-4 py-3 text-white placeholder-gray-600
              outline-none focus:border-white transition"
            />
          </div>

          {/* Button */}
          <button
            type="submit"
            className="w-full bg-white text-black py-3 rounded-lg
            font-medium hover:bg-gray-200 transition duration-300"
          >
            Send Reset Link
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

export default ForgotPassword;
import React, { useState } from "react";
import { FaCreditCard, FaMoneyBillWave, FaLock } from "react-icons/fa";
import { Link } from "react-router-dom";

const Payment = () => {

  const [method, setMethod] = useState("card");

  return (
    <div className="min-h-screen bg-[#0d0d0d] text-white px-6 md:px-20 py-12">

      {/* Heading */}
      <h1 className="text-4xl font-bold text-center mb-12 tracking-wider">
        Payment Method
      </h1>

      <div className="grid lg:grid-cols-3 gap-10">

        {/* Payment Options */}
        <div className="lg:col-span-2 bg-[#111] border border-[#222] p-8 rounded-xl">

          {/* Method Selection */}
          <div className="space-y-4 mb-8">

            <div
              onClick={() => setMethod("card")}
              className={`p-4 border rounded-lg cursor-pointer flex items-center gap-4 transition
              ${method === "card"
                  ? "border-lime-300 bg-[#161616]"
                  : "border-[#222] hover:border-lime-300"}`}
            >
              <FaCreditCard className="text-lime-300 text-xl" />
              <span>Credit / Debit Card</span>
            </div>

            <div
              onClick={() => setMethod("cod")}
              className={`p-4 border rounded-lg cursor-pointer flex items-center gap-4 transition
              ${method === "cod"
                  ? "border-lime-300 bg-[#161616]"
                  : "border-[#222] hover:border-lime-300"}`}
            >
              <FaMoneyBillWave className="text-lime-300 text-xl" />
              <span>Cash On Delivery</span>
            </div>

          </div>

          {/* Card Form */}
          {method === "card" && (
            <div className="space-y-6">

              <div>
                <label className="block mb-2 text-sm text-gray-400">
                  Card Holder Name
                </label>
                <input
                  type="text"
                  placeholder="Name on card"
                  className="w-full p-3 bg-[#0d0d0d] border border-[#222] rounded-lg focus:outline-none focus:border-lime-300 transition"
                />
              </div>

              <div>
                <label className="block mb-2 text-sm text-gray-400">
                  Card Number
                </label>
                <input
                  type="text"
                  placeholder="1234 5678 9012 3456"
                  className="w-full p-3 bg-[#0d0d0d] border border-[#222] rounded-lg focus:outline-none focus:border-lime-300 transition"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block mb-2 text-sm text-gray-400">
                    Expiry Date
                  </label>
                  <input
                    type="text"
                    placeholder="MM/YY"
                    className="w-full p-3 bg-[#0d0d0d] border border-[#222] rounded-lg focus:outline-none focus:border-lime-300 transition"
                  />
                </div>

                <div>
                  <label className="block mb-2 text-sm text-gray-400">
                    CVV
                  </label>
                  <input
                    type="password"
                    placeholder="123"
                    className="w-full p-3 bg-[#0d0d0d] border border-[#222] rounded-lg focus:outline-none focus:border-lime-300 transition"
                  />
                </div>
              </div>

            </div>
          )}

          {/* COD Info */}
          {method === "cod" && (
            <div className="bg-[#161616] p-6 rounded-lg border border-[#222]">
              <p className="text-gray-300">
                You will pay in cash at the time of delivery.
              </p>
            </div>
          )}

        </div>

        {/* Order Summary */}
        <div className="bg-[#111] border border-[#222] p-8 rounded-xl h-fit sticky top-24">

          <h2 className="text-2xl font-semibold mb-6 border-b border-[#222] pb-4">
            Order Summary
          </h2>

          <div className="flex justify-between mb-4">
            <span>Subtotal</span>
            <span className="text-lime-300 font-bold">$310.00</span>
          </div>

          <div className="flex justify-between mb-4">
            <span>Shipping</span>
            <span>Free</span>
          </div>

          <div className="flex justify-between text-xl font-bold border-t border-[#222] pt-4">
            <span>Total</span>
            <span className="text-lime-300">$310.00</span>
          </div>

          <Link to= '/OrderSuccess' className="w-full mt-8 py-3 rounded-lg bg-gradient-to-r 
                             from-lime-200 to-lime-300 text-black font-bold 
                             hover:from-lime-300 hover:to-lime-400 
                             transition duration-300 flex items-center justify-center gap-2">
            <FaLock />
            Pay Securely
          </Link>

        </div>

      </div>

    </div>
  );
};

export default Payment;
import React, { useContext } from "react";
import { FaCheckCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { StoreContext } from "../../context/StoreContext";

const OrderSuccess = () => {

  const navigate = useNavigate();

  const { deliveryInfo, orderNumber, orderTotal } = useContext(StoreContext);
  
  const orderId = "PRF" + Math.floor(100000 + Math.random() * 900000);

  return (
    <div className="min-h-screen pt-30 bg-[#0d0d0d] flex items-center justify-center px-6">

      <div className="bg-[#111] border border-[#222] p-10 rounded-2xl 
      max-w-xl w-full hover:shadow-2xl hover:shadow-lime-300/20 transition duration-500">

        {/* Success Icon */}
        <div className="flex justify-center mb-6">
          <FaCheckCircle className="text-lime-300 text-5xl animate-bounce" />
        </div>

        {/* Title */}
        <h1 className="text-3xl text-white font-bold text-center mb-3">
          Order Placed Successfully!
        </h1>

        <p className="text-white text-center mb-8">
         Thank you for shopping with us. Your perfume is being prepared and will be delivered soon.
        </p>

        {/* Order Details */}
        <div className="bg-[#161616] border border-[#222] rounded-xl p-6 space-y-4">

          <div className="flex justify-between">
            <span className="text-white">Order ID</span>
            <span className="text-lime-300 font-semibold">{orderId}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-white">Customer Name</span>
            <span className = 'text-lime-200'>{deliveryInfo.firstName}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-white">Email</span>
            <span className = 'text-lime-200'>{deliveryInfo.email}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-white">Phone</span>
            <span className = 'text-lime-200'>{deliveryInfo.phone}</span>
          </div>

          <div className="flex gap-1 justify-between">
            <span className="text-white">Shipping Address</span>
            <span className = 'text-lime-200 text-right'>
              {deliveryInfo.street}, {deliveryInfo.city}, {deliveryInfo.state}, {deliveryInfo.postalCode}
            </span>
          </div>

          <div className="flex justify-between border-t border-[#222] pt-4 text-lg font-semibold">
            <span className="text-white">Total Paid</span>
            <span className="text-lime-300">${orderTotal.toFixed(2)}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-white">Delivery Status</span>
            <span className="text-lime-300">Processing</span>
          </div>

        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">

          <button
            onClick={() => navigate("/")}
            className="px-6 py-3 rounded-lg bg-gradient-to-r 
            from-lime-300 to-lime-400 text-black font-bold
            hover:scale-105 transition duration-300">

            Continue Shopping

          </button>

          <button
            onClick={() => navigate("/orders")}
            className="px-6 py-3 rounded-lg border border-lime-300 
            text-lime-300 hover:bg-lime-300 hover:text-black transition">

            View Orders

          </button>

        </div>

      </div>

    </div>
  );
};

export default OrderSuccess;
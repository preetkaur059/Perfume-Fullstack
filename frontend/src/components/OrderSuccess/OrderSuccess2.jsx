import React, { useEffect, useState } from "react";
import { FaCheckCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Heading from "../Heading/Heading";

const OrderSuccess2 = () => {

  const navigate = useNavigate();
  const [order, setOrder] = useState(null);

  useEffect(() => {

    const orders = JSON.parse(localStorage.getItem("orders")) || [];

    if (orders.length > 0) {
      const lastOrder = orders[orders.length - 1];
      setOrder(lastOrder);
    }

  }, []);

  if (!order) {
    return (
      <div className="min-h-screen  bg-[#0d0d0d] flex items-center justify-center text-white">
        No Order Found
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-30 bg-[#0d0d0d] flex items-center justify-center px-6 py-10">

      <div className="bg-[#111] border border-[#222] p-2 md:p-8 rounded-2xl text-center 
                      max-w-xl w-full hover:shadow-xl hover:shadow-lime-300/20 
                      transition duration-500">

        {/* Success Icon */}
        <div className="flex justify-center mb-2">
          <FaCheckCircle className="text-lime-300 text-4xl animate-bounce" />
        </div>

        {/* Title */}
        <h1 className="text-3xl text-white font-bold mb-4 tracking-wide">
          Order Placed Successfully!
        </h1>

        <p className="text-gray-300 mb-6">
          Thank you for shopping with us. Your perfume is being prepared and will be delivered soon.
        </p>

        {/* Order Details */}
        <div className="bg-[#161616] border border-[#222] p-6 rounded-lg text-left space-y-3 mb-6">

          <div className="flex justify-between">
            <span className="text-white">Order ID</span>
            <span className="text-lime-300 font-semibold">{order.id}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-white">Date</span>
            <span className="text-white">{order.date}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-white">Name</span>
            <span className="text-white">{order.customer.firstName}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-white">Email</span>
            <span className="text-white">{order.customer.email}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-white">Address</span>
            <span className="text-white text-right">
              {order.customer.street}
            </span>
          </div>

        </div>

        {/* Items */}
        <div className="bg-[#161616] border border-[#222] p-6 rounded-lg mb-6 text-left">

          <h2 className="text-white font-semibold mb-4">
            Ordered Items
          </h2>

          <div className="space-y-2">

            {order.items.map((item, index) => (
              <div
                key={index}
                className="flex justify-between text-white text-sm"
              >
                <span>{item.name}</span>
                <span>${item.price}</span>
              </div>
            ))}

          </div>

        </div>

        {/* Total */}
        <div className="bg-[#161616] border border-[#222] p-4 rounded-lg mb-6 flex justify-between">

          <span className="text-white">Total Paid</span>
          <span className="text-lime-300 font-bold text-lg">
            ${order.total}
          </span>

        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">

          <button
            onClick={() => navigate("/")}
            className="px-6 py-3 rounded-lg bg-lime-300 text-black font-bold 
                       hover:bg-lime-400 transform hover:scale-105 
                       transition duration-300 cursor-pointer">
            Continue Shopping
          </button>

          <button
            onClick={() => navigate("/orders")}
            className="px-6 py-3 rounded-lg border border-lime-300 
                       text-lime-300 hover:bg-lime-300 hover:text-black 
                       transition duration-300 cursor-pointer">
            View Orders
          </button>

        </div>

      </div>

    </div>
  );
};

export default OrderSuccess2;
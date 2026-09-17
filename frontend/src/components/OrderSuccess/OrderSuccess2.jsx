import React from "react";
import { FaCheckCircle } from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";

const OrderSuccess2 = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const order = location.state?.order;
  const deliveryInfo = location.state?.deliveryInfo;

  if (!order) {
    return (
      <div className="min-h-screen bg-[#0d0d0d] flex flex-col items-center justify-center text-white px-6">

        <h2 className="text-2xl mb-5">
          No Order Found
        </h2>

        <button
          type="button"
          onClick={() => navigate("/orders")}
          className="px-6 py-3 rounded-lg bg-lime-300 text-black font-bold hover:bg-lime-400 transition cursor-pointer"
        >
          View Orders
        </button>

      </div>
    );
  }

  const orderItems = order.orderItems || [];

  const total = orderItems.reduce((sum, item) => {
    const price = Number(item.product?.price || 0);
    const quantity = Number(item.quantity || 0);

    return sum + price * quantity;
  }, 0);

  const formattedDate = order.createdAt
    ? new Date(order.createdAt).toLocaleDateString()
    : "N/A";

  return (
    <div className="min-h-screen pt-30 bg-[#0d0d0d] flex items-center justify-center px-6 py-10">

      <div
        className="bg-[#111] border border-[#222] p-4 md:p-8
        rounded-2xl text-center max-w-xl w-full
        hover:shadow-xl hover:shadow-lime-300/20
        transition duration-500"
      >

        {/* Success Icon */}
        <div className="flex justify-center mb-4">
          <FaCheckCircle className="text-lime-300 text-5xl animate-bounce" />
        </div>

        {/* Title */}
        <h1 className="text-3xl text-white font-bold mb-4 tracking-wide">
          Order Placed Successfully!
        </h1>

        <p className="text-gray-300 mb-6">
          Thank you for shopping with us. Your perfume is being prepared
          and will be delivered soon.
        </p>

        {/* Order Details */}
        <div className="bg-[#161616] border border-[#222] p-6 rounded-lg text-left space-y-4 mb-6">

          <div className="flex justify-between gap-4">
            <span className="text-gray-400">
              Order ID
            </span>

            <span className="text-lime-300 font-semibold text-right break-all">
              {order._id}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-400">
              Date
            </span>

            <span className="text-white">
              {formattedDate}
            </span>
          </div>

          {deliveryInfo?.firstName && (
            <div className="flex justify-between">
              <span className="text-gray-400">
                Name
              </span>

              <span className="text-white">
                {deliveryInfo.firstName}
              </span>
            </div>
          )}

          {deliveryInfo?.email && (
            <div className="flex justify-between gap-4">
              <span className="text-gray-400">
                Email
              </span>

              <span className="text-white text-right">
                {deliveryInfo.email}
              </span>
            </div>
          )}

          {deliveryInfo?.street && (
            <div className="flex justify-between gap-4">
              <span className="text-gray-400">
                Address
              </span>

              <span className="text-white text-right">
                {deliveryInfo.street}
                {deliveryInfo.city && `, ${deliveryInfo.city}`}
                {deliveryInfo.state && `, ${deliveryInfo.state}`}
                {deliveryInfo.postalCode &&
                  `, ${deliveryInfo.postalCode}`}
              </span>
            </div>
          )}

        </div>

        {/* Ordered Items */}
        <div className="bg-[#161616] border border-[#222] p-6 rounded-lg mb-6 text-left">

          <h2 className="text-white font-semibold mb-4">
            Ordered Items
          </h2>

          <div className="space-y-4">

            {orderItems.map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between gap-4 text-white"
              >

                <div className="flex items-center gap-3">

                  {item.product?.image && (
                    <img
                      src={item.product.image}
                      alt={item.product?.productName}
                      className="w-12 h-12 object-cover rounded-md"
                    />
                  )}

                  <div>
                    <p className="font-medium">
                      {item.product?.productName || "Product"}
                    </p>

                    <p className="text-gray-400 text-sm">
                      Qty: {item.quantity}
                    </p>
                  </div>

                </div>

                <span className="text-lime-300 font-semibold">
                  $
                  {(
                    Number(item.product?.price || 0) *
                    Number(item.quantity || 0)
                  ).toFixed(2)}
                </span>

              </div>
            ))}

          </div>

        </div>

        {/* Total */}
        <div className="bg-[#161616] border border-[#222] p-4 rounded-lg mb-6 flex justify-between">

          <span className="text-white">
            Total
          </span>

          <span className="text-lime-300 font-bold text-lg">
            ${total.toFixed(2)}
          </span>

        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">

          <button
            type="button"
            onClick={() => navigate("/")}
            className="px-6 py-3 rounded-lg bg-lime-300
            text-black font-bold hover:bg-lime-400
            transform hover:scale-105 transition duration-300 cursor-pointer"
          >
            Continue Shopping
          </button>

          <button
            type="button"
            onClick={() => navigate("/orders")}
            className="px-6 py-3 rounded-lg border border-lime-300
            text-lime-300 hover:bg-lime-300 hover:text-black
            transition duration-300 cursor-pointer"
          >
            View Orders
          </button>

        </div>

      </div>
    </div>
  );
};

export default OrderSuccess2;
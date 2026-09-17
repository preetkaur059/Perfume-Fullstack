import React from "react";
import {
  FaBoxOpen,
  FaTruck,
  FaCheckCircle,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

import Heading from "../Heading/Heading";
import { useOrders } from "@/hooks/orders/useOrders";

const Orders = () => {
  const navigate = useNavigate();

  const {
    data: orders = [],
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useOrders();

  const getStatusIcon = () => {
    return <FaBoxOpen className="text-yellow-400" />;
  };

  const calculateOrderTotal = (orderItems = []) => {
    return orderItems.reduce((total, item) => {
      const price = Number(item.product?.price || 0);
      const quantity = Number(item.quantity || 0);

      return total + price * quantity;
    }, 0);
  };

  const formatDate = (date) => {
    if (!date) {
      return "N/A";
    }

    return new Date(date).toLocaleDateString();
  };

  return (
    <div className="min-h-screen bg-[#0d0d0d] text-white px-6 md:px-20 pt-28">

      {/* Heading */}
      <div className="text-center">
        <Heading highlight="Your Orders" />
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="text-center mt-20">
          <div className="inline-block w-10 h-10 border-4 border-lime-300 border-t-transparent rounded-full animate-spin" />

          <p className="text-gray-400 mt-4">
            Loading your orders...
          </p>
        </div>
      )}

      {/* Error */}
      {isError && !isLoading && (
        <div className="text-center mt-20">

          <h2 className="text-2xl mb-3 text-red-400">
            Failed to Load Orders
          </h2>

          <p className="text-gray-400 mb-5">
            {error?.response?.data?.message ||
              "Something went wrong while loading your orders."}
          </p>

          <button
            type="button"
            onClick={() => refetch()}
            className="px-6 py-3 bg-lime-300 text-black font-bold rounded-lg hover:bg-lime-400 transition cursor-pointer"
          >
            Try Again
          </button>

        </div>
      )}

      {/* Empty */}
      {!isLoading && !isError && orders.length === 0 && (
        <div className="text-center mt-20">

          <h2 className="text-2xl mb-4">
            No Orders Yet 📦
          </h2>

          <p className="text-gray-400 mb-6">
            Looks like you haven't placed any orders.
          </p>

          <button
            type="button"
            onClick={() => navigate("/Allproducts")}
            className="px-6 py-3 bg-lime-300 text-black font-bold rounded-lg hover:bg-lime-400 transition cursor-pointer"
          >
            Start Shopping
          </button>

        </div>
      )}

      {/* Orders */}
      {!isLoading && !isError && orders.length > 0 && (
        <div className="space-y-8 pb-10">

          {/* Refresh */}
          <div className="flex justify-end">

            <button
              type="button"
              onClick={() => refetch()}
              disabled={isFetching}
              className="px-5 py-2 border border-lime-300
              text-lime-300 rounded-lg
              hover:bg-lime-300 hover:text-black
              transition cursor-pointer
              disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isFetching ? "Refreshing..." : "Refresh Orders"}
            </button>

          </div>

          {orders.map((order) => {

            const orderItems = order.orderItems || [];

            const total = calculateOrderTotal(orderItems);

            return (
              <div
                key={order._id}
                className="bg-[#111] border border-[#222]
                rounded-2xl p-6 md:p-8
                hover:shadow-xl hover:shadow-lime-300/10
                transition duration-500"
              >

                {/* Top Row */}
                <div className="grid md:grid-cols-3 gap-6 mb-6">

                  {/* Order ID */}
                  <div>
                    <p className="text-gray-400 text-sm">
                      Order ID
                    </p>

                    <p className="text-lime-300 font-bold text-sm md:text-base break-all">
                      {order._id}
                    </p>
                  </div>

                  {/* Order Date */}
                  <div>
                    <p className="text-gray-400 text-sm">
                      Order Date
                    </p>

                    <p>
                      {formatDate(order.createdAt)}
                    </p>
                  </div>

                  {/* Status */}
                  <div className="flex items-center gap-2 text-sm font-semibold">

                    {getStatusIcon()}

                    <span>
                      Processing
                    </span>

                  </div>

                </div>

                {/* Items */}
                <div className="border-t border-[#222] pt-5">

                  <p className="text-gray-400 text-sm mb-4">
                    Ordered Items
                  </p>

                  <div className="space-y-4">

                    {orderItems.map((item, index) => {

                      const product = item.product;

                      const itemTotal =
                        Number(product?.price || 0) *
                        Number(item.quantity || 0);

                      return (
                        <div
                          key={index}
                          className="flex flex-col md:flex-row
                          md:items-center md:justify-between
                          gap-4 bg-[#161616]
                          border border-[#222]
                          p-4 rounded-lg"
                        >

                          {/* Product */}
                          <div className="flex items-center gap-4">

                            {product?.image && (
                              <img
                                src={product.image}
                                alt={product.productName}
                                className="w-16 h-16 object-cover rounded-lg"
                              />
                            )}

                            <div>

                              <h3 className="font-semibold text-white">
                                {product?.productName || "Product"}
                              </h3>

                              <p className="text-gray-400 text-sm">
                                Category:{" "}
                                {product?.category || "N/A"}
                              </p>

                              <p className="text-gray-400 text-sm">
                                Quantity: {item.quantity}
                              </p>

                            </div>

                          </div>

                          {/* Price */}
                          <div className="text-right">

                            <p className="text-gray-400 text-sm">
                              Price
                            </p>

                            <p className="text-lime-300 font-bold">
                              $
                              {Number(
                                product?.price || 0
                              ).toFixed(2)}
                            </p>

                            <p className="text-white text-sm">
                              Total: ${itemTotal.toFixed(2)}
                            </p>

                          </div>

                        </div>
                      );
                    })}

                  </div>

                </div>

                {/* Order Total */}
                <div className="border-t border-[#222] mt-6 pt-5 flex justify-between items-center">

                  <span className="text-lg font-semibold">
                    Order Total
                  </span>

                  <span className="text-lime-300 text-2xl font-bold">
                    ${total.toFixed(2)}
                  </span>

                </div>

              </div>
            );
          })}

        </div>
      )}

    </div>
  );
};

export default Orders;
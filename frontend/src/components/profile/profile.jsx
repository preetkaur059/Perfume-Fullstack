import React from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useCurrentUser, useLogout } from "@/hooks/auth/useAuth";
import { useOrders } from "@/hooks/orders/useOrders";

const Profile = () => {
  const navigate = useNavigate();

  const { data: user, isLoading, isError } = useCurrentUser();
  const logout = useLogout();

  const {
    data: orders,
    isLoading: ordersLoading,
    isError: ordersError,
    error: ordersRequestError,
    refetch: refetchOrders,
  } = useOrders();

  if (isError) {
    navigate("/login", { replace: true });
  }

  const handleLogout = async () => {
    try {
      await logout.mutateAsync();

      toast.success("Logged out successfully!");
      navigate("/login");
    } catch {
      toast.error("Unable to log out. Please try again.");
    }
  };

  if (isLoading || !user) return null;

  return (
    <div className="min-h-screen bg-black text-white px-4 py-32">
      <div className="max-w-4xl mx-auto">

        {/* Heading */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold">
            My Profile
          </h1>

          <p className="text-gray-400 mt-2">
            Manage your account details
          </p>
        </div>

        {/* Profile Card */}
        <div className="bg-[#111111] border border-white/10 rounded-2xl p-6 md:p-10 shadow-2xl">

          {/* Account Information */}
          <div>
            <h3 className="text-xl font-semibold mb-5">
              Account Information
            </h3>

            {/* Full Name */}
            <div className="mb-5">
              <label className="block text-gray-400 text-sm mb-2">
                Full Name
              </label>

              <div className="bg-black border border-gray-700 rounded-lg px-4 py-3">
                {user.fullName}
              </div>
            </div>

            {/* Email */}
            <div className="mb-6">
              <label className="block text-gray-400 text-sm mb-2">
                Email Address
              </label>

              <div className="bg-black border border-gray-700 rounded-lg px-4 py-3">
                {user.email}
              </div>
            </div>
          </div>

          {/* My Orders */}
          <div className="border-t border-white/10 pt-8 mt-8">

            <div className="flex items-center justify-between mb-5">
              <h3 className="text-xl font-semibold">
                My Orders
              </h3>

              <span className="text-sm text-gray-400">
                {orders?.length || 0} Orders
              </span>
            </div>

            {ordersLoading ? (
              <div className="text-center py-8 text-gray-400">
                Loading orders...
              </div>
            ) : ordersError ? (
              <div className="text-center py-8 border border-red-400/20 rounded-xl">
                <p className="text-red-300">
                  {ordersRequestError?.response?.data?.message || "Unable to load your orders."}
                </p>
                <button
                  type="button"
                  onClick={() => refetchOrders()}
                  className="mt-4 px-5 py-2 rounded-lg border border-lime-300 text-lime-200 hover:bg-lime-300 hover:text-black transition duration-300 cursor-pointer"
                >
                  Try Again
                </button>
              </div>
            ) : !orders || orders.length === 0 ? (
              <div className="text-center py-8 border border-white/10 rounded-xl">
                <p className="text-gray-400">
                  You haven't placed any orders yet.
                </p>

                <button
                  onClick={() => navigate("/")}
                  className="mt-4 px-5 py-2 rounded-lg
                  bg-gradient-to-b from-lime-200 to-lime-300
                  text-black font-semibold
                  hover:scale-[1.02]
                  transition duration-300 cursor-pointer"
                >
                  Start Shopping
                </button>
              </div>
            ) : (
              <div className="space-y-5">

                {orders.map((order) => (
                  <div
                    key={order._id}
                    className="bg-black border border-white/10 rounded-xl p-5"
                  >

                    Order Header
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">

                      <div>
                        <p className="text-sm text-gray-400">
                          Order ID
                        </p>

                        <p className="text-sm font-medium">
                          #{order._id}
                        </p>
                      </div>

                      <div>
                        <p className="text-sm text-gray-400">
                          Date
                        </p>

                        <p className="text-sm">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </p>
                      </div>

                      <div>
                        <p className="text-sm text-gray-400">
                          Status
                        </p>

                        <span className="inline-block mt-1 px-3 py-1 rounded-full text-xs
                          bg-lime-400/10 text-lime-300 border border-lime-400/20"
                        >
                          {order.status || "Processing"}
                        </span>
                      </div>

                    </div>

                    {/* Products */}
                    <div className="border-t border-white/10 pt-4 space-y-4">

                      {order.orderItems?.map((item) => (
                        <div
                          key={item._id}
                          className="flex items-center gap-4"
                        >

                          {/* Product Image */}
                          <div className="w-16 h-16 rounded-lg overflow-hidden bg-[#111] shrink-0">
                            {item.product?.image ? (
                              <img
                                src={item.product.image}
                                alt={item.product.productName}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-gray-500 text-xs">
                                No Image
                              </div>
                            )}
                          </div>

                          {/* Product Details */}
                          <div className="flex-1">
                            <h4 className="font-medium">
                              {item.product?.productName}
                            </h4>

                            <p className="text-sm text-gray-400">
                              Quantity: {item.quantity}
                            </p>
                          </div>

                          {/* Price */}
                          <div className="text-right">
                            <p className="font-medium">
                              ₹{item.product?.price}
                            </p>
                          </div>

                        </div>
                      ))}

                    </div>

                    {/* Order Total */}
                    <div className="border-t border-white/10 mt-5 pt-4 flex justify-between">
                      <span className="text-gray-400">
                        Total
                      </span>

                      <span className="font-bold text-lime-300">
                        ₹
                        {order.orderItems?.reduce(
                          (total, item) =>
                            total +
                            (item.product?.price || 0) * item.quantity,
                          0
                        )}
                      </span>
                    </div>

                  </div>
                ))}

              </div>
            )}

          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mt-8">

            <button
              onClick={() => navigate("/")}
              className="flex-1 py-3 rounded-lg
              bg-gradient-to-b from-lime-200 to-lime-300
              text-black font-bold
              hover:scale-[1.02]
              transition duration-300 cursor-pointer"
            >
              Continue Shopping
            </button>

            <button
              onClick={handleLogout}
              disabled={logout.isPending}
              className="flex-1 py-3 rounded-lg
              border border-red-500/50
              text-red-400 font-semibold
              hover:bg-red-500/10
              transition duration-300 cursor-pointer"
            >
              {logout.isPending ? "Logging out..." : "Logout"}
            </button>

          </div>

        </div>
      </div>
    </div>
  );
};

export default Profile;

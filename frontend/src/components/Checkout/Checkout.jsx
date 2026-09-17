import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { StoreContext } from "../../context/StoreContext";
import Heading from "../Heading/Heading";
import { useCreateOrder } from "@/hooks/orders/useOrders";

const Checkout = () => {
  const navigate = useNavigate();

  const {
    cart,
    subTotal,
    shippingFee,
    orderTotal,
    clearCart,
    deliveryInfo,
    setDeliveryInfo,
  } = useContext(StoreContext);

  const [errors, setErrors] = useState({});

  const { mutate: createOrder, isPending } = useCreateOrder();

  const validateForm = () => {
    const newErrors = {};

    if (!deliveryInfo.firstName?.trim()) {
      newErrors.firstName = "Full name is required";
    }

    if (!deliveryInfo.email?.trim()) {
      newErrors.email = "Email is required";
    }

    if (!deliveryInfo.phone?.trim()) {
      newErrors.phone = "Phone number is required";
    }

    if (!deliveryInfo.street?.trim()) {
      newErrors.street = "Address is required";
    }

    if (!deliveryInfo.city?.trim()) {
      newErrors.city = "City is required";
    }

    if (!deliveryInfo.postalCode?.trim()) {
      newErrors.postalCode = "Postal code is required";
    }

    if (!deliveryInfo.state?.trim()) {
      newErrors.state = "State is required";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleProceed = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    if (cart.length === 0) {
      toast.error("Your cart is empty.");
      return;
    }

    /*
      Backend expects:

      {
        orderItems: [
          {
            product: "PRODUCT_ID",
            quantity: 2
          }
        ]
      }
    */

    const orderItems = cart.map((item) => ({
      product: item._id ?? item.id,
      quantity: Number(item.quantity) || 1,
    }));

    // Make sure every cart item has a product ID
    const hasInvalidProduct = orderItems.some(
      (item) => !item.product
    );

    if (hasInvalidProduct) {
      toast.error("One or more products have an invalid ID.");
      return;
    }

    createOrder(orderItems, {
      onSuccess: (response) => {
        /*
          Save the backend order temporarily so
          OrderSuccess2 can display it after navigation.
        */

        const createdOrder = response?.data;

        // Clear cart only after successful API request
        clearCart();

        // Pass backend order to success page
        navigate("/OrderSuccess2", {
          state: {
            order: createdOrder,
            deliveryInfo,
          },
        });
      },
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setDeliveryInfo({
      ...deliveryInfo,
      [name]: value,
    });

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  return (
    <div className="min-h-screen pt-28 bg-[#0d0d0d] text-white px-6 md:px-20 py-12">

      {/* Heading */}
      <div className="text-center">
        <Heading highlight="Delivery Information" />
      </div>

      <div className="grid lg:grid-cols-3 gap-10">

        {/* Form */}
        <div className="lg:col-span-2 bg-[#111] border border-[#222] p-8 rounded-xl">

          <form
            onSubmit={handleProceed}
            className="space-y-6"
          >

            {/* Full Name */}
            <div>
              <label className="block mb-2 text-sm">
                Full Name
              </label>

              <input
                type="text"
                name="firstName"
                value={deliveryInfo.firstName || ""}
                onChange={handleChange}
                placeholder="Enter your full name"
                className={`w-full p-3 bg-[#0d0d0d] border rounded-lg outline-none
                focus:border-lime-300
                ${
                  errors.firstName
                    ? "border-red-500"
                    : "border-[#222]"
                }`}
              />

              {errors.firstName && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.firstName}
                </p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block mb-2 text-sm">
                Email Address
              </label>

              <input
                type="email"
                name="email"
                value={deliveryInfo.email || ""}
                onChange={handleChange}
                placeholder="Enter your email"
                className={`w-full p-3 bg-[#0d0d0d] border rounded-lg outline-none
                focus:border-lime-300
                ${
                  errors.email
                    ? "border-red-500"
                    : "border-[#222]"
                }`}
              />

              {errors.email && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.email}
                </p>
              )}
            </div>

            {/* Phone */}
            <div>
              <label className="block mb-2 text-sm">
                Phone Number
              </label>

              <input
                type="text"
                name="phone"
                value={deliveryInfo.phone || ""}
                onChange={handleChange}
                placeholder="Enter your phone number"
                className={`w-full p-3 bg-[#0d0d0d] border rounded-lg outline-none
                focus:border-lime-300
                ${
                  errors.phone
                    ? "border-red-500"
                    : "border-[#222]"
                }`}
              />

              {errors.phone && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.phone}
                </p>
              )}
            </div>

            {/* Address */}
            <div>
              <label className="block mb-2 text-sm">
                Address
              </label>

              <input
                type="text"
                name="street"
                value={deliveryInfo.street || ""}
                onChange={handleChange}
                placeholder="Street address"
                className={`w-full p-3 bg-[#0d0d0d] border rounded-lg outline-none
                focus:border-lime-300
                ${
                  errors.street
                    ? "border-red-500"
                    : "border-[#222]"
                }`}
              />

              {errors.street && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.street}
                </p>
              )}
            </div>

            {/* City + Postal */}
            <div className="grid md:grid-cols-2 gap-6">

              {/* City */}
              <div>
                <label className="block mb-2 text-sm">
                  City
                </label>

                <input
                  type="text"
                  name="city"
                  value={deliveryInfo.city || ""}
                  onChange={handleChange}
                  placeholder="City"
                  className={`w-full p-3 bg-[#0d0d0d] border rounded-lg outline-none
                  focus:border-lime-300
                  ${
                    errors.city
                      ? "border-red-500"
                      : "border-[#222]"
                  }`}
                />

                {errors.city && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.city}
                  </p>
                )}
              </div>

              {/* Postal */}
              <div>
                <label className="block mb-2 text-sm">
                  Postal Code
                </label>

                <input
                  type="text"
                  name="postalCode"
                  value={deliveryInfo.postalCode || ""}
                  onChange={handleChange}
                  placeholder="Postal code"
                  className={`w-full p-3 bg-[#0d0d0d] border rounded-lg outline-none
                  focus:border-lime-300
                  ${
                    errors.postalCode
                      ? "border-red-500"
                      : "border-[#222]"
                  }`}
                />

                {errors.postalCode && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.postalCode}
                  </p>
                )}
              </div>

            </div>

            {/* State */}
            <div>
              <label className="block mb-2 text-sm">
                State
              </label>

              <input
                type="text"
                name="state"
                value={deliveryInfo.state || ""}
                onChange={handleChange}
                placeholder="State"
                className={`w-full p-3 bg-[#0d0d0d] border rounded-lg outline-none
                focus:border-lime-300
                ${
                  errors.state
                    ? "border-red-500"
                    : "border-[#222]"
                }`}
              />

              {errors.state && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.state}
                </p>
              )}
            </div>

          </form>
        </div>

        {/* Order Summary */}
        <div className="bg-[#111] border border-[#222] p-8 rounded-xl h-fit sticky top-24">

          <h2 className="text-2xl font-semibold mb-6 border-b border-[#222] pb-4">
            Order Summary
          </h2>

          <div className="flex justify-between mb-4">
            <span>Subtotal</span>

            <span className="text-lime-300 font-bold">
              ${Number(subTotal || 0).toFixed(2)}
            </span>
          </div>

          <div className="flex justify-between mb-4">
            <span>Shipping</span>
            <span>FREE</span>
          </div>

          <div className="flex justify-between text-xl font-bold border-t border-[#222] pt-4">
            <span>Total</span>

            <span className="text-lime-300">
              ${Number(orderTotal || 0).toFixed(2)}
            </span>
          </div>

          <button
            type="button"
            onClick={handleProceed}
            disabled={cart.length === 0 || isPending}
            className="w-full cursor-pointer mt-8 py-3 rounded-lg
            bg-gradient-to-r from-lime-200 to-lime-300
            text-black font-bold
            hover:scale-105
            hover:from-lime-300 hover:to-lime-400
            transition duration-300
            disabled:opacity-50 disabled:cursor-not-allowed
            disabled:hover:scale-100"
          >
            {isPending
              ? "Placing Order..."
              : "Place Order"}
          </button>

        </div>
      </div>
    </div>
  );
};

export default Checkout;
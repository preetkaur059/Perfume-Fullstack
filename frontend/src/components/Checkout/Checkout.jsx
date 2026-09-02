import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { StoreContext } from "../../context/StoreContext";
import Heading from "../Heading/Heading";

const Checkout = () => {

  const navigate = useNavigate();

  const { cart, subTotal, shippingFee, orderTotal, clearCart  } =
    useContext(StoreContext);

  const { deliveryInfo, setDeliveryInfo } = useContext(StoreContext);

  const [errors, setErrors] = useState({});

  const handleProceed = (e) => {
  e.preventDefault();

  if (!deliveryInfo.firstName) {
    setErrors({ firstName: "First name is required" });
    return;
  }

  if (!deliveryInfo.email) {
    setErrors({ email: "Email is required" });
    return;
  }

  if (!deliveryInfo.phone) {
    setErrors({ phone: "Phone number is required" });
    return;
  }

  if (!deliveryInfo.street) {
    setErrors({ street: "Address is required" });
    return;
  }

  if (!deliveryInfo.city) {
    setErrors({ city: "City is required" });
    return;
  }

  if (!deliveryInfo.postalCode) {
    setErrors({ postalCode: "Postal code is required" });
    return;
  }

  if (!deliveryInfo.state) {
    setErrors({ state: "State is required" });
    return;
  }

  if (cart.length === 0) {
    alert("Your cart is empty.");
    return;
  }

  // ⭐ generate order id
  const newOrderId = "#PRF" + Math.floor(10000 + Math.random() * 90000);
  // setOrderNumber(newOrderId);

  const newOrder = {
    id: newOrderId,
    date: new Date().toLocaleDateString(),
    customer: deliveryInfo,
    items: cart,
    subtotal: subTotal,
    shipping: shippingFee,
    total: orderTotal,
    status: "Processing"
  };

  // ⭐ get existing orders
  const existingOrders =
    JSON.parse(localStorage.getItem("orders")) || [];

  // ⭐ add new order
  existingOrders.push(newOrder);

  // ⭐ save orders
  localStorage.setItem("orders", JSON.stringify(existingOrders));

  // ⭐ clear cart
  clearCart();

  navigate("/OrderSuccess2");
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

      {/* <h1 className="text-4xl font-bold text-center mb-12 tracking-wider">
        Delivery Information
      </h1> */}
      <div className="text-center">
        <Heading highlight='Delivery Information'/>
      </div>

      <div className="grid lg:grid-cols-3 gap-10">

        {/* Form Section */}
        <div className="lg:col-span-2 bg-[#111] border border-[#222] p-8 rounded-xl">

          <form className="space-y-6">

            {/* First Name */}
            <div>
              <label className="block mb-2 text-sm">Full Name</label>

              <input
                type="text"
                name="firstName"
                value={deliveryInfo.firstName}
                onChange={handleChange}
                placeholder="Enter your full name"
                className={`w-full p-3 bg-[#0d0d0d] border rounded-lg
                ${errors.firstName ? "border-red-500" : "border-[#222]"}`}
              />

              {errors.firstName && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.firstName}
                </p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block mb-2 text-sm">Email Address</label>

              <input
                type="email"
                name="email"
                value={deliveryInfo.email}
                onChange={handleChange}
                placeholder="Enter your email"
                className={`w-full p-3 bg-[#0d0d0d] border rounded-lg
                ${errors.email ? "border-red-500" : "border-[#222]"}`}
              />

              {errors.email && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.email}
                </p>
              )}
            </div>

            {/* Phone */}
            <div>
              <label className="block mb-2 text-sm">Phone Number</label>

              <input
                type="text"
                name="phone"
                value={deliveryInfo.phone}
                onChange={handleChange}
                placeholder="Enter your phone number"
                className={`w-full p-3 bg-[#0d0d0d] border rounded-lg
                ${errors.phone ? "border-red-500" : "border-[#222]"}`}
              />

              {errors.phone && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.phone}
                </p>
              )}
            </div>

            {/* Address */}
            <div>
              <label className="block mb-2 text-sm">Address</label>

              <input
                type="text"
                name="street"
                value={deliveryInfo.street}
                onChange={handleChange}
                placeholder="Street address"
                className={`w-full p-3 bg-[#0d0d0d] border rounded-lg
                ${errors.street ? "border-red-500" : "border-[#222]"}`}
              />

              {errors.street && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.street}
                </p>
              )}
            </div>

            {/* City + Postal */}
            <div className="grid md:grid-cols-2 gap-6">

              <div>
                <label className="block mb-2 text-sm">City</label>

                <input
                  type="text"
                  name="city"
                  value={deliveryInfo.city}
                  onChange={handleChange}
                  placeholder="City"
                  className={`w-full p-3 bg-[#0d0d0d] border rounded-lg
                  ${errors.city ? "border-red-500" : "border-[#222]"}`}
                />

                {errors.city && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.city}
                  </p>
                )}
              </div>

              <div>
                <label className="block mb-2 text-sm">Postal Code</label>

                <input
                  type="text"
                  name="postalCode"
                  value={deliveryInfo.postalCode}
                  onChange={handleChange}
                  placeholder="Postal code"
                  className={`w-full p-3 bg-[#0d0d0d] border rounded-lg
                  ${errors.postalCode ? "border-red-500" : "border-[#222]"}`}
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
              <label className="block mb-2 text-sm">State</label>

              <input
                type="text"
                name="state"
                value={deliveryInfo.state}
                onChange={handleChange}
                placeholder="State"
                className={`w-full p-3 bg-[#0d0d0d] border rounded-lg
                ${errors.state ? "border-red-500" : "border-[#222]"}`}
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
              ${subTotal.toFixed(2)}
            </span>
          </div>

          <div className="flex justify-between mb-4">
            <span>Shipping</span>
            <span>FREE</span>
          </div>

          <div className="flex justify-between text-xl font-bold border-t border-[#222] pt-4">
            <span>Total</span>
            <span className="text-lime-300">
              ${orderTotal.toFixed(2)}
            </span>
          </div>

          <button
            onClick={handleProceed}
            disabled={cart.length === 0}
            className="w-full cursor-pointer mt-8 py-3 rounded-lg bg-gradient-to-r 
            from-lime-200 to-lime-300 text-black font-bold hover:scale-105
            hover:from-lime-300 hover:to-lime-400 transition duration-300">

            Continue To Payment

          </button>

        </div>

      </div>

    </div>
  );
};

export default Checkout;
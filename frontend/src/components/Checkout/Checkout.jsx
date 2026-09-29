import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useFormik } from "formik";
import * as Yup from "yup";

import { StoreContext } from "../../context/StoreContext";
import Heading from "../Heading/Heading";
import { useCreateOrder } from "@/hooks/orders/useOrders";
import { useCurrentUser } from "@/hooks/auth/useAuth";

const checkoutValidationSchema = Yup.object({
  firstName: Yup.string().trim().required("Full name is required"),
  email: Yup.string()
    .trim()
    .email("Please enter a valid email address")
    .required("Email is required"),
  phone: Yup.string().trim().required("Phone number is required"),
  street: Yup.string().trim().required("Address is required"),
  city: Yup.string().trim().required("City is required"),
  postalCode: Yup.string().trim().required("Postal code is required"),
  state: Yup.string().trim().required("State is required"),
});

const Checkout = () => {
  const navigate = useNavigate();

  const {
    cart,
    clearCart,
    buyNowItem,
    clearBuyNow,
    deliveryInfo,
    setDeliveryInfo,
  } = useContext(StoreContext);

  // A Buy Now visit checks out exactly one item. All other visits retain the
  // existing cart-based checkout behaviour.
  const checkoutItems = buyNowItem ? [buyNowItem] : cart;
  const subTotal = checkoutItems.reduce(
    (total, item) => total + Number(item.price || 0) * Number(item.quantity || 0),
    0,
  );
  const orderTotal = subTotal;

  const { mutate: createOrder, isPending } = useCreateOrder();
  const { data: user } = useCurrentUser();

  useEffect(() => () => {
    clearBuyNow();
  }, [clearBuyNow]);

  const formik = useFormik({
    initialValues: {
      firstName: deliveryInfo?.firstName || "",
      email: deliveryInfo?.email || "",
      phone: deliveryInfo?.phone || "",
      street: deliveryInfo?.street || "",
      city: deliveryInfo?.city || "",
      postalCode: deliveryInfo?.postalCode || "",
      state: deliveryInfo?.state || "",
    },
    enableReinitialize: true,
    validationSchema: checkoutValidationSchema,
    onSubmit: (values) => {
      if (checkoutItems.length === 0) {
        toast.error("Your cart is empty.");
        return;
      }

      if (!user?.id) {
        toast.error("Please log in to place an order.");
        return;
      }

      const orderItems = checkoutItems.map((item) => ({
        // Cart entries are product objects. Only send their MongoDB ID, not the object.
        product: item._id ?? item.id,
        quantity: Number(item.quantity),
      }));

      const hasInvalidOrderItem = orderItems.some(
        (item) =>
          !item.product ||
          typeof item.product === "object" ||
          !Number.isInteger(item.quantity) ||
          item.quantity < 1,
      );

      if (hasInvalidOrderItem) {
        toast.error("One or more cart items are invalid.");
        return;
      }

      setDeliveryInfo(values);

      createOrder(
        {
          user: user?.id,
          orderItems,
          status: "Processing",
        },
        {
          onSuccess: (response) => {
            const createdOrder = response?.data;

            // Only cart checkout clears the cart. A Buy Now order leaves the
            // shopper's existing cart unchanged.
            if (buyNowItem) {
              clearBuyNow();
            } else {
              clearCart();
            }

            // Pass backend order to success page
            navigate("/OrderSuccess2", {
              state: {
                order: createdOrder,
                deliveryInfo: values,
              },
            });
          },
        }
      );
    },
  });

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
            id="checkout-form"
            onSubmit={formik.handleSubmit}
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
                value={formik.values.firstName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Enter your full name"
                className={`w-full p-3 bg-[#0d0d0d] border rounded-lg outline-none focus:border-lime-300 ${
                  formik.touched.firstName && formik.errors.firstName
                    ? "border-red-500"
                    : "border-[#222]"
                }`}
              />

              {formik.touched.firstName && formik.errors.firstName && (
                <p className="text-red-500 text-sm mt-1">
                  {formik.errors.firstName}
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
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Enter your email"
                className={`w-full p-3 bg-[#0d0d0d] border rounded-lg outline-none focus:border-lime-300 ${
                  formik.touched.email && formik.errors.email
                    ? "border-red-500"
                    : "border-[#222]"
                }`}
              />

              {formik.touched.email && formik.errors.email && (
                <p className="text-red-500 text-sm mt-1">
                  {formik.errors.email}
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
                value={formik.values.phone}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Enter your phone number"
                className={`w-full p-3 bg-[#0d0d0d] border rounded-lg outline-none focus:border-lime-300 ${
                  formik.touched.phone && formik.errors.phone
                    ? "border-red-500"
                    : "border-[#222]"
                }`}
              />

              {formik.touched.phone && formik.errors.phone && (
                <p className="text-red-500 text-sm mt-1">
                  {formik.errors.phone}
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
                value={formik.values.street}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Street address"
                className={`w-full p-3 bg-[#0d0d0d] border rounded-lg outline-none focus:border-lime-300 ${
                  formik.touched.street && formik.errors.street
                    ? "border-red-500"
                    : "border-[#222]"
                }`}
              />

              {formik.touched.street && formik.errors.street && (
                <p className="text-red-500 text-sm mt-1">
                  {formik.errors.street}
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
                  value={formik.values.city}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder="City"
                  className={`w-full p-3 bg-[#0d0d0d] border rounded-lg outline-none focus:border-lime-300 ${
                    formik.touched.city && formik.errors.city
                      ? "border-red-500"
                      : "border-[#222]"
                  }`}
                />

                {formik.touched.city && formik.errors.city && (
                  <p className="text-red-500 text-sm mt-1">
                    {formik.errors.city}
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
                  value={formik.values.postalCode}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder="Postal code"
                  className={`w-full p-3 bg-[#0d0d0d] border rounded-lg outline-none focus:border-lime-300 ${
                    formik.touched.postalCode && formik.errors.postalCode
                      ? "border-red-500"
                      : "border-[#222]"
                  }`}
                />

                {formik.touched.postalCode && formik.errors.postalCode && (
                  <p className="text-red-500 text-sm mt-1">
                    {formik.errors.postalCode}
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
                value={formik.values.state}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="State"
                className={`w-full p-3 bg-[#0d0d0d] border rounded-lg outline-none focus:border-lime-300 ${
                  formik.touched.state && formik.errors.state
                    ? "border-red-500"
                    : "border-[#222]"
                }`}
              />

              {formik.touched.state && formik.errors.state && (
                <p className="text-red-500 text-sm mt-1">
                  {formik.errors.state}
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

          <div className="mb-6 space-y-3 border-b border-[#222] pb-4">
            {checkoutItems.map((item) => (
              <div
                key={item._id ?? item.id}
                className="flex items-center justify-between gap-3 text-sm"
              >
                <div className="min-w-0">
                  <p className="truncate font-medium text-white">
                    {item.productName}
                  </p>
                  <p className="text-gray-400">Quantity: {item.quantity}</p>
                </div>
                <p className="shrink-0 font-semibold text-lime-300">
                  ${Number(item.price || 0).toFixed(2)}
                </p>
              </div>
            ))}
          </div>

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
            onClick={formik.handleSubmit}
            disabled={checkoutItems.length === 0 || isPending}
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

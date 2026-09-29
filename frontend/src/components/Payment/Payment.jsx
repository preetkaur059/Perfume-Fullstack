import React from "react";
import { FaCreditCard, FaMoneyBillWave, FaLock } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";

const paymentValidationSchema = Yup.object({
  method: Yup.string().required(),
  cardHolderName: Yup.string().when("method", {
    is: "card",
    then: (schema) => schema.trim().required("Card holder name is required"),
    otherwise: (schema) => schema.optional(),
  }),
  cardNumber: Yup.string().when("method", {
    is: "card",
    then: (schema) =>
      schema
        .trim()
        .matches(/^[0-9\s]{13,19}$/, "Please enter a valid card number")
        .required("Card number is required"),
    otherwise: (schema) => schema.optional(),
  }),
  expiryDate: Yup.string().when("method", {
    is: "card",
    then: (schema) =>
      schema
        .trim()
        .matches(/^(0[1-9]|1[0-2])\/?([0-9]{2})$/, "Expiry must be MM/YY")
        .required("Expiry date is required"),
    otherwise: (schema) => schema.optional(),
  }),
  cvv: Yup.string().when("method", {
    is: "card",
    then: (schema) =>
      schema
        .trim()
        .matches(/^[0-9]{3,4}$/, "CVV must be 3 or 4 digits")
        .required("CVV is required"),
    otherwise: (schema) => schema.optional(),
  }),
});

const Payment = () => {
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      method: "card",
      cardHolderName: "",
      cardNumber: "",
      expiryDate: "",
      cvv: "",
    },
    validationSchema: paymentValidationSchema,
    onSubmit: () => {
      toast.success("Payment processed successfully!");
      navigate("/OrderSuccess2");
    },
  });

  return (
    <div className="min-h-screen bg-[#0d0d0d] text-white px-6 md:px-20 py-12 pt-28">

      {/* Heading */}
      <h1 className="text-4xl font-bold text-center mb-12 tracking-wider">
        Payment Method
      </h1>

      <form onSubmit={formik.handleSubmit}>
        <div className="grid lg:grid-cols-3 gap-10">

          {/* Payment Options */}
          <div className="lg:col-span-2 bg-[#111] border border-[#222] p-8 rounded-xl">

            {/* Method Selection */}
            <div className="space-y-4 mb-8">

              <div
                onClick={() => formik.setFieldValue("method", "card")}
                className={`p-4 border rounded-lg cursor-pointer flex items-center gap-4 transition ${
                  formik.values.method === "card"
                    ? "border-lime-300 bg-[#161616]"
                    : "border-[#222] hover:border-lime-300"
                }`}
              >
                <FaCreditCard className="text-lime-300 text-xl" />
                <span>Credit / Debit Card</span>
              </div>

              <div
                onClick={() => formik.setFieldValue("method", "cod")}
                className={`p-4 border rounded-lg cursor-pointer flex items-center gap-4 transition ${
                  formik.values.method === "cod"
                    ? "border-lime-300 bg-[#161616]"
                    : "border-[#222] hover:border-lime-300"
                }`}
              >
                <FaMoneyBillWave className="text-lime-300 text-xl" />
                <span>Cash On Delivery</span>
              </div>

            </div>

            {/* Card Form */}
            {formik.values.method === "card" && (
              <div className="space-y-6">

                <div>
                  <label className="block mb-2 text-sm text-gray-400">
                    Card Holder Name
                  </label>
                  <input
                    type="text"
                    name="cardHolderName"
                    value={formik.values.cardHolderName}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder="Name on card"
                    className={`w-full p-3 bg-[#0d0d0d] border ${
                      formik.touched.cardHolderName && formik.errors.cardHolderName
                        ? "border-red-500"
                        : "border-[#222]"
                    } rounded-lg focus:outline-none focus:border-lime-300 transition`}
                  />
                  {formik.touched.cardHolderName && formik.errors.cardHolderName && (
                    <p className="text-red-500 text-sm mt-1">{formik.errors.cardHolderName}</p>
                  )}
                </div>

                <div>
                  <label className="block mb-2 text-sm text-gray-400">
                    Card Number
                  </label>
                  <input
                    type="text"
                    name="cardNumber"
                    value={formik.values.cardNumber}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder="1234 5678 9012 3456"
                    className={`w-full p-3 bg-[#0d0d0d] border ${
                      formik.touched.cardNumber && formik.errors.cardNumber
                        ? "border-red-500"
                        : "border-[#222]"
                    } rounded-lg focus:outline-none focus:border-lime-300 transition`}
                  />
                  {formik.touched.cardNumber && formik.errors.cardNumber && (
                    <p className="text-red-500 text-sm mt-1">{formik.errors.cardNumber}</p>
                  )}
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block mb-2 text-sm text-gray-400">
                      Expiry Date
                    </label>
                    <input
                      type="text"
                      name="expiryDate"
                      value={formik.values.expiryDate}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      placeholder="MM/YY"
                      className={`w-full p-3 bg-[#0d0d0d] border ${
                        formik.touched.expiryDate && formik.errors.expiryDate
                          ? "border-red-500"
                          : "border-[#222]"
                      } rounded-lg focus:outline-none focus:border-lime-300 transition`}
                    />
                    {formik.touched.expiryDate && formik.errors.expiryDate && (
                      <p className="text-red-500 text-sm mt-1">{formik.errors.expiryDate}</p>
                    )}
                  </div>

                  <div>
                    <label className="block mb-2 text-sm text-gray-400">
                      CVV
                    </label>
                    <input
                      type="password"
                      name="cvv"
                      maxLength={4}
                      value={formik.values.cvv}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      placeholder="123"
                      className={`w-full p-3 bg-[#0d0d0d] border ${
                        formik.touched.cvv && formik.errors.cvv
                          ? "border-red-500"
                          : "border-[#222]"
                      } rounded-lg focus:outline-none focus:border-lime-300 transition`}
                    />
                    {formik.touched.cvv && formik.errors.cvv && (
                      <p className="text-red-500 text-sm mt-1">{formik.errors.cvv}</p>
                    )}
                  </div>
                </div>

              </div>
            )}

            {/* COD Info */}
            {formik.values.method === "cod" && (
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

            <button
              type="submit"
              className="w-full mt-8 py-3 rounded-lg bg-gradient-to-r from-lime-200 to-lime-300 text-black font-bold hover:from-lime-300 hover:to-lime-400 transition duration-300 flex items-center justify-center gap-2 cursor-pointer"
            >
              <FaLock />
              Pay Securely
            </button>

          </div>

        </div>
      </form>

    </div>
  );
};

export default Payment;
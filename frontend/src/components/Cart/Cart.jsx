import React, { useContext } from "react";
import { FaTrash, FaPlus, FaMinus } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { StoreContext } from "../../context/StoreContext";
import Heading from "../Heading/Heading";

const Cart = () => {
  const {
    cart,
    removeFromCart,
    quantityIncrement,
    quantityDecrease,
    subTotal,
    orderTotal,
  } = useContext(StoreContext);

  const navigate = useNavigate();

  const handleCheckout = () => {
    if (cart.length === 0) {
      toast.error("Your cart is empty.");
      return;
    }

    navigate("/checkout");
  };

  return (
    <div className="min-h-screen pt-28 bg-[#0d0d0d] text-white px-6 md:px-20 py-12">

      {/* Heading */}
      <div className="text-center mb-3">
        <Heading highlight="Your Shopping Cart" />
      </div>

      <div className="grid lg:grid-cols-3 gap-10">

        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-6">

          {cart.length === 0 ? (
            <div className="bg-[#111] border border-[#222] rounded-xl p-10 text-center">
              <h2 className="text-2xl font-semibold mb-3">
                Your Cart is Empty
              </h2>

              <button
                type="button"
                onClick={() => navigate("/Allproducts")}
                className="mt-4 px-6 py-3 bg-lime-300 text-black font-bold rounded-lg hover:bg-lime-400 transition cursor-pointer"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            cart.map((product) => {
              const productId = product._id ?? product.id;

              return (
                <div
                  key={productId}
                  className="flex flex-col md:flex-row items-center bg-[#111]
                  border border-[#222] p-3 rounded-xl
                  hover:shadow-xl hover:shadow-lime-300/10 transition"
                >

                  {/* Image */}
                  <img
                    src={product.image}
                    alt={product.productName}
                    className="w-22 h-22 object-cover rounded-lg"
                  />

                  {/* Details */}
                  <div className="flex-1 md:ml-6 mt-4 md:mt-0 text-center md:text-left">
                    <h3 className="text-xl font-semibold mb-2">
                      {product.productName}
                    </h3>

                    <p className="text-lime-300 text-lg font-bold">
                      ${Number(product.price || 0).toFixed(2)}
                    </p>
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex items-center gap-4 mt-4 md:mt-0">

                    <button
                      type="button"
                      onClick={() => quantityDecrease(productId)}
                      className="bg-[#222] p-2 rounded-md cursor-pointer
                      hover:bg-lime-300 hover:text-black transition"
                    >
                      <FaMinus />
                    </button>

                    <span className="text-lg font-semibold min-w-[25px] text-center">
                      {product.quantity}
                    </span>

                    <button
                      type="button"
                      onClick={() => quantityIncrement(productId)}
                      className="bg-[#222] p-2 rounded-md cursor-pointer
                      hover:bg-lime-300 hover:text-black transition"
                    >
                      <FaPlus />
                    </button>

                  </div>

                  {/* Remove Button */}
                  <button
                    type="button"
                    onClick={() => {
                      removeFromCart(productId);
                      toast.error(
                        `${product.productName} removed from cart 🛒`
                      );
                    }}
                    className="ml-6 mr-5 cursor-pointer text-2xl
                    text-red-400 hover:text-red-600 transition
                    mt-4 md:mt-0"
                    aria-label="Remove product"
                  >
                    <FaTrash />
                  </button>

                </div>
              );
            })
          )}

        </div>

        {/* Order Summary */}
        <div className="bg-[#111] border border-[#222] p-8 rounded-xl h-fit sticky top-24">

          <h2 className="text-2xl font-semibold mb-6 border-b border-[#222] pb-4">
            Order Summary
          </h2>

          <div className="flex justify-between mb-4 text-lg">
            <span>Subtotal</span>

            <span className="text-lime-300 font-bold">
              ${Number(subTotal || 0).toFixed(2)}
            </span>
          </div>

          <div className="flex justify-between mb-4 text-lg">
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
            onClick={handleCheckout}
            disabled={cart.length === 0}
            className="w-full cursor-pointer mt-8 py-3 rounded-lg
            bg-gradient-to-r from-lime-200 to-lime-300
            text-black font-bold
            hover:from-lime-300 hover:to-lime-400
            hover:scale-105 transition duration-300
            disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Proceed To Checkout
          </button>

        </div>

      </div>
    </div>
  );
};

export default Cart;
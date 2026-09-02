import React from "react";
import { FaTrash, FaPlus, FaMinus } from "react-icons/fa";
import { useContext } from "react";
import { StoreContext } from "../../context/StoreContext";
import { MdOutlineDelete } from 'react-icons/md';
import { Link } from 'react-router-dom';
import img2 from "../../assets/2.jpg";
import { useNavigate } from "react-router-dom";
import Heading from "../Heading/Heading";
import { toast } from "react-toastify";


const Cart = () => {
  const { cart, removeFromCart, quantityIncrement, quantityDecrease, subTotal, orderTotal } = useContext(StoreContext);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen pt-28 bg-[#0d0d0d] text-white px-6 md:px-20 py-12">

      {/* Heading */}
      {/* <h1 className="text-4xl font-bold mb-10 text-center tracking-wider">
        Your Shopping Cart
      </h1> */}
      <div className="text-center mb-3">
        <Heading highlight='Your Shopping Cart' />
      </div>

      <div className="grid lg:grid-cols-3 gap-10">

        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-6">

          {cart.map((product, index) => (
            <div key={product.id}
              className="flex flex-col md:flex-row items-center bg-[#111] border border-[#222] p-1 rounded-xl hover:shadow-xl hover:shadow-lime-300/10 transition">

              {/* Image */}
              <img
                src={product.image}
                alt={product.name}
                className="w-22 h-22 object-cover rounded-lg" />

              {/* Details */}
              <div className="flex-1 md:ml-6 mt-4 md:mt-0 text-center md:text-left">
                <h3 className="text-xl font-semibold mb-2">{product.name}</h3>
                <p className="text-lime-300 text-lg font-bold">
                  ${product.price.toFixed(2)}
                </p>
              </div>

              {/* Quantity Controls */}
              <div className="flex items-center gap-4 mt-4 md:mt-0">

                <button onClick={() => quantityDecrease(product.id)}
                  className="bg-[#222] p-2 rounded-md cursor-pointer hover:bg-lime-300 hover:text-black transition">
                  <FaMinus />
                </button>

                <span className="text-lg font-semibold">
                  {product.quantity}
                </span>

                <button onClick={() => quantityIncrement(product.id)}
                  className="bg-[#222] p-2 rounded-md cursor-pointer hover:bg-lime-300 hover:text-black transition">
                  <FaPlus />
                </button>

              </div>

              {/* Remove Button */}
              <button onClick={() => {
                removeFromCart(product.id);
                toast.error(`${product.name} removed from cart 🛒`);
              }}
                className="ml-6 mr-5 cursor-pointer text-2xl text-red-400 hover:text-red-600 transition mt-4 md:mt-0">
                <FaTrash />
              </button>

            </div>
          ))}

        </div>

        {/* Order Summary */}
        <div className="bg-[#111] border border-[#222] p-8 rounded-xl h-fit sticky top-24">

          <h2 className="text-2xl font-semibold mb-6 border-b border-[#222] pb-4">
            Order Summary
          </h2>

          <div className="flex justify-between mb-4 text-lg">
            <span>Subtotal</span>
            <span className="text-lime-300 font-bold">
              ${subTotal.toFixed(2)}
            </span>
          </div>

          <div className="flex justify-between mb-4 text-lg">
            <span>Shipping</span>
            <span>FREE</span>
          </div>

          <div className="flex justify-between text-xl font-bold border-t border-[#222] pt-4">
            <span>Total</span>
            <span className="text-lime-300">
              ${orderTotal.toFixed(2)}
            </span>
          </div>

          <button onClick={() => navigate("/checkout")}
            className="w-full cursor-pointer mt-8 py-3 rounded-lg bg-gradient-to-r 
                             from-lime-200 to-lime-300 text-black font-bold 
                             hover:from-lime-300 hover:to-lime-400 hover:scale-105
                             transition duration-300">
            Proceed To Checkout
          </button >

        </div>

      </div>
    </div>
  );
};

export default Cart;
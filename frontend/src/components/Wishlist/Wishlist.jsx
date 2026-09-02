import React from "react";
import { FaTrash, FaShoppingCart } from "react-icons/fa";
import { useContext } from "react";
import { StoreContext } from "../../context/StoreContext";
import { NavLink } from "react-router-dom";
import { toast } from "react-toastify";

const Wishlist = () => {

  const { wishlist, addToCart, removeFromWishlist } = useContext(StoreContext);

  return (
    <div className="min-h-screen pt-30 bg-[#0d0d0d] text-white px-6 md:px-16 py-10">

      {/* Heading */}
      <h1 className="text-3xl font-bold text-center mb-10 tracking-wider">
        Your Wishlist
      </h1>

      {wishlist.length === 0 ? (
        <div className="text-center mt-20">
          <h2 className="text-xl mb-4">Your wishlist is empty 💔</h2>
          <NavLink to="/Allproducts" className="px-5 py-2 bg-lime-300 text-black rounded-lg font-semibold hover:bg-lime-400 transition">
            Continue Shopping
          </NavLink>
        </div>
      ) : (

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">

          {wishlist.map((item) => (
            <div
              key={item.id}
              className="bg-[#111] border border-[#222] rounded-lg overflow-hidden 
                         hover:-translate-y-1 hover:shadow-lg hover:shadow-lime-300/20 
                         transition duration-300">

              {/* Image */}
              <div className="relative overflow-hidden">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-62 object-cover hover:scale-110 transition duration-500" />

                {/* Remove Icon */}
                <button
                  onClick={() => {
                    removeFromWishlist(item.id);
                    toast.error("Removed from wishlist 💔");
                  }}
                  className="absolute cursor-pointer top-2 right-2 bg-black/70 p-1.5 rounded-full text-red-400 hover:text-red-600 transition">
                  <FaTrash size={14} />
                </button>
              </div>

              {/* Content */}
              <div className="p-3 text-center">
                <h3 className="text-sm font-semibold mb-1">
                  {item.name}
                </h3>

                <p className="text-lime-300 text-lg font-bold mb-3">
                  ${item.price.toFixed(2)}
                </p>

                {/* Add To Cart Button */}
                <button
                  onClick={() => {
                    addToCart(item);
                    toast.success("Item added to cart 🛒");
                  }}
                  className="w-full cursor-pointer py-2 rounded-md bg-gradient-to-r 
                             from-lime-200 to-lime-300 text-black  font-semibold
                             hover:from-lime-300 hover:to-lime-400 
                             transition duration-300 flex items-center justify-center gap-2">
                  <FaShoppingCart size={14} />
                  Add To Cart
                </button>

              </div>

            </div>
          ))}

        </div>
      )}

    </div>
  );
};

export default Wishlist;
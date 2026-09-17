import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { FaHeart, FaPlus, FaStar } from "react-icons/fa";
import { toast } from "react-toastify";

import { StoreContext } from "../../context/StoreContext";

const Cards = ({ product }) => {
  const {
    wishlist,
    addToWishlist,
    addToCart,
  } = useContext(StoreContext);

  // Support MongoDB _id and normal id
  const productId = product?._id ?? product?.id;

  // Check whether product is already in wishlist
  const isInWishlist = wishlist.some(
    (item) => (item._id ?? item.id) === productId
  );

  const handleWishlist = () => {
    addToWishlist(product);

    if (isInWishlist) {
      toast.error("Removed from wishlist 💔");
    } else {
      toast.success("Added to wishlist ❤️");
    }
  };

  const handleAddToCart = () => {
    addToCart(product);
    toast.success("Item added to cart 🛒");
  };

  return (
    <div
      className="group md:m-0 m-5 bg-[#111] overflow-hidden border border-[#222]
      transition-all duration-500 hover:-translate-y-2
      hover:shadow-2xl hover:shadow-lime-300/20 relative"
    >
      {/* Top Buttons */}
      <div
        className="flex justify-between items-center p-2 md:p-4
        absolute top-2 left-0 px-3 w-full z-10
        opacity-100 md:opacity-0 md:group-hover:opacity-100
        transition duration-300"
      >
        {/* Wishlist */}
        <button
          type="button"
          onClick={handleWishlist}
          aria-label={
            isInWishlist
              ? "Remove from wishlist"
              : "Add to wishlist"
          }
          className={`text-xl hover:scale-110 cursor-pointer
          hover:text-lime-400 transition ${
            isInWishlist ? "text-lime-300" : "text-white"
          }`}
        >
          <FaHeart />
        </button>

        {/* Add to Cart */}
        <button
          type="button"
          onClick={handleAddToCart}
          aria-label="Add to cart"
          className="bg-lime-200 text-black cursor-pointer p-2 mr-3
          border-2 border-[#f5f5dc]
          hover:bg-[#efc3c5] hover:scale-110 transition"
        >
          <FaPlus />
        </button>
      </div>

      {/* Product Image */}
      <Link to={`/product/${productId}`}>
        <div className="relative w-full h-52 md:h-62 overflow-hidden">
          <img
            src={product?.image}
            alt={product?.productName || "Product"}
            loading="lazy"
            className="w-full h-full object-cover hover:scale-110 transition duration-700"
          />
        </div>
      </Link>

      {/* Product Information */}
      <div className="text-center pt-5 pb-4">
        <h3 className="text-white md:text-lg mb-2 tracking-wide">
          {product?.productName}
        </h3>

        <div className="flex justify-around items-center">
          {/* Price */}
          <p className="text-[#e2f2b0] text-xl md:text-2xl font-bold mb-4">
            ${Number(product?.price || 0).toFixed(2)}
          </p>

          {/* Rating */}
          <div className="flex text-yellow-400 mt-1 text-lg md:text-xl gap-1">
            {Array.from({
              length: Number(product?.rating || 0),
            }).map((_, index) => (
              <FaStar key={index} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cards;
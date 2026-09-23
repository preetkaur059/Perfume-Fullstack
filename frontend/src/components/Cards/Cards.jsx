import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaHeart, FaPlus, FaStar } from "react-icons/fa";
import { toast } from "react-toastify";

import { StoreContext } from "../../context/StoreContext";

const Cards = ({ product }) => {
  const { wishlist, addToWishlist, addToCart, startBuyNow } =
    useContext(StoreContext);
  const navigate = useNavigate();

  // Support MongoDB _id and normal id
  const productId = product?._id ?? product?.id;

  // Check whether product is already in wishlist
  const isInWishlist = wishlist.some(
    (item) => (item._id ?? item.id) === productId,
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

  const handleBuyNow = () => {
    startBuyNow(product);
    navigate("/checkout");
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
          aria-label={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
          className={`text-xl hover:scale-110 cursor-pointer
          hover:text-lime-400 transition ${isInWishlist ? "text-lime-300" : "text-white"
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
        <div className="relative w-full h-72 md:h-72 overflow-hidden">
          <img
            src={product?.image}
            alt={product?.productName || "Product"}
            loading="lazy"
            className="w-full h-full object-cover hover:scale-110 transition duration-700"
          />
        </div>
      </Link>

      {/* Product Information */}
      <div className="text-center pt-5 pb-5">
        {/* Product Name */}
        <h3 className="text-white text-base md:text-lg font-medium mb-3 tracking-wide line-clamp-1">
          {product?.productName}
        </h3>

        {/* Price + Rating */}
        <div className="flex items-center justify-center gap-6 mb-5">
          {/* Price */}
          <p className="text-[#e2f2b0] text-xl md:text-2xl font-bold">
            ${Number(product?.price || 0).toFixed(2)}
          </p>

          {/* Rating */}
          <div className="flex items-center text-yellow-400 text-sm md:text-base gap-1">
            {Array.from({
              length: Number(product?.rating || 0),
            }).map((_, index) => (
              <FaStar key={index} />
            ))}
          </div>
        </div>

        {/* Buy Now */}

        <div className="px-4">
          <button
            type="button"
            onClick={handleBuyNow}
            className="group w-full cursor-pointer rounded-sm bg-gradient-to-r from-lime-200 via-lime-300 to-lime-400 
              px-5 py-3 text-sm md:text-base font-bold text-black shadow-[0_0_20px_rgba(190,242,100,0.15)] transition-all 
              duration-300 hover:scale-[1.02] hover:shadow-[0_0_28px_rgba(190,242,100,0.35)] active:scale-[0.98]"
          >
            <span className="flex items-center justify-center gap-2">
              Buy Now
              <span className="text-base transition-transform duration-300 group-hover:translate-x-1">
                →
              </span>
            </span>
          </button>
        </div>

      </div>
    </div>
  );
};

export default Cards;

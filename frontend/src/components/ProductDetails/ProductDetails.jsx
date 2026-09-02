import React, { useContext } from "react";
import { useParams } from "react-router-dom";
import productList from "../Temp/Temp";
import { StoreContext } from "../../context/StoreContext";
import { FaHeart, FaStar } from "react-icons/fa";
import { toast } from "react-toastify";

const ProductDetails = () => {

    const { id } = useParams();

    const { wishlist, addToWishlist, addToCart } = useContext(StoreContext);

    const product = productList.find((p) => p.id === parseInt(id));

    if (!product) {
        return <p className="text-white text-center mt-20">Product not found</p>;
    }

    return (
        <div className="bg-black min-h-screen pt-35 text-white py-20">
            <div className="max-w-[1200px] mx-auto grid md:grid-cols-2 gap-12 px-6">

                {/* Image */}
                <div>
                    <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-[420px] object-cover border border-[#222]"
                    />
                </div>

                {/* Details */}
                <div>

                    {/* Name */}
                    <h1 className="text-3xl font-bold mb-3">{product.name}</h1>

                    {/* Category */}
                    <p className="text-gray-400 mb-2">
                        Category: <span className="text-white">{product.category}</span>
                    </p>

                    {/* Rating */}
                    <div className="flex text-yellow-400 text-xl gap-1 mb-4">
                        {Array(product.rating).fill().map((_, i) => (
                            <FaStar key={i} />
                        ))}
                    </div>

                    {/* Price */}
                    <p className="text-lime-300 text-2xl font-bold mb-6">
                        ${product.price.toFixed(2)}
                    </p>

                    {/* Description */}
                    <p className="text-gray-300 mb-8">
                        {product.description}
                    </p>

                    {/* Buttons */}
                    <div className="flex gap-5">

                        {/* Add To Cart */}
                        <button
                            onClick={() => {
                                addToCart(product);
                                toast.success("Item added to cart 🛒");
                            }}
                            className="px-6 py-3 cursor-pointer bg-lime-200 text-black font-bold hover:bg-lime-300 transition"
                        >
                            Add To Cart
                        </button>

                        {/* Wishlist */}
                        <button
                            onClick={() => {

                                const isInWishlist = wishlist.some(item => item.id === product.id);

                                addToWishlist(product);

                                if (isInWishlist) {
                                    toast.error("Removed from wishlist 💔");
                                } else {
                                    toast.success("Added to wishlist ❤️");
                                }

                            }}
                            className={`text-2xl cursor-pointer transition hover:scale-110
              ${wishlist.some(item => item.id === product.id)
                                    ? "text-lime-300"
                                    : "text-white"
                                }`}
                        >
                            <FaHeart />
                        </button>

                    </div>

                </div>

            </div>
        </div>
    );
};

export default ProductDetails;
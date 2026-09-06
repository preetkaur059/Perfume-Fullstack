import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
// import productList from "../Temp/Temp";
import { StoreContext } from "../../context/StoreContext";
import { FaHeart, FaStar } from "react-icons/fa";
import { toast } from "react-toastify";
import api from "@/api/client";

const ProductDetails = () => {

    const { id } = useParams();

    const { wishlist, addToWishlist, addToCart } = useContext(StoreContext);

    const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getProduct = async () => {
      setLoading(true);
      setProduct(null);

      try {
        const { data } = await api.get(`/products/${id}`);
        setProduct(data.product);
      } catch (error) {
        console.error("Error getting product:", error);
      } finally {
        setLoading(false);
      }
    };

    getProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="bg-black min-h-screen text-white flex justify-center items-center">
        Loading product...
      </div>
    );
  }

  if (!product) {
    return (
      <div className="bg-black min-h-screen text-white flex justify-center items-center">
        Product not found
      </div>
    );
  }

    const productId = product._id ?? product.id;
    const isInWishlist = wishlist.some((item) => (item._id ?? item.id) === productId);

    return (
        <div className="bg-black min-h-screen pt-35 text-white py-20">
            <div className="max-w-[1200px] mx-auto grid md:grid-cols-2 gap-12 px-6">

                {/* Image */}
                <div>
                    <img
                        src={product.image}
                        alt={product.productName}
                        className="w-full h-[420px] object-cover border border-[#222]"
                    />
                </div>

                {/* Details */}
                <div>

                    {/* Name */}
                    <h1 className="text-3xl font-bold mb-3">{product.productName}</h1>

                    {/* Category */}
                    <p className="text-gray-400 mb-2">
                        Category: <span className="text-white">{product.category}</span>
                    </p>

                    {/* Rating */}
                    <div className="flex text-yellow-400 text-xl gap-1 mb-4">
                        {Array(Number(product.rating) || 0).fill().map((_, i) => (
                            <FaStar key={i} />
                        ))}
                    </div>

                    {/* Price */}
                    <p className="text-lime-300 text-2xl font-bold mb-6">
                        ${Number(product.price).toFixed(2)}
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

                                addToWishlist(product);

                                if (isInWishlist) {
                                    toast.error("Removed from wishlist 💔");
                                } else {
                                    toast.success("Added to wishlist ❤️");
                                }

                            }}
                            className={`text-2xl cursor-pointer transition hover:scale-110
                                ${isInWishlist
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

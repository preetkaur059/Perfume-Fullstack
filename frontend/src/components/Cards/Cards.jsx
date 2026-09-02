import React from 'react'
import { FaHeart, FaPlus, FaStar } from 'react-icons/fa'
import { Link } from 'react-router-dom'
import { useContext } from "react";
import { StoreContext } from "../../context/StoreContext";
import { toast } from "react-toastify";

const Cards = ({ product }) => {
    const { wishlist, addToWishlist, addToCart } = useContext(StoreContext);

    return (
        <div className="group md:m-0 m-5 bg-[#111] overflow-hidden border border-[#222] 
                transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-lime-300/20 relative">

            {/* Top Icons */}
            <div className="flex justify-between items-center p-2 md:p-4 absolute top-2 left-0 px-3 w-full z-10 
                    opacity-100 md:opacity-0 md:group-hover:opacity-100 transition duration-300">

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
                    className={`text-xl hover:scale-110 cursor-pointer hover:text-lime-400 transition 
        ${wishlist.some(item => item.id === product.id) ? 'text-lime-300' : 'text-white'}`}>
                    <FaHeart />
                </button>

                <button
                    onClick={() => {
                        addToCart(product);
                        toast.success("Item added to cart 🛒");
                    }}
                    className="bg-lime-200 text-black cursor-pointer p-2 mr-3 border-2 border-[#f5f5dc]
                   hover:bg-[#efc3c5] hover:scale-110 transition">
                    <FaPlus />
                </button>
            </div>

            {/* Image Section */}
            <Link to={`/product/${product.id}`}>
                <div className=" relative w-full h-52 md:h-62 overflow-hidden">
                    <img
                        src={product.image}
                        alt={product.name}
                        loading="lazy"
                        className="w-full h-full object-cover hover:scale-110 transition duration-700"
                    />
                </div>
            </Link>

            {/* Content */}
            <div className="text-center pt-5">
                <h3 className="text-white md:text-lg mb-2 tracking-wide">
                    {product.name}
                </h3>


                <p className='flex justify-around'>
                    <p className="text-[#e2f2b0] text-xl md:text-2xl font-bold mb-4">${product.price.toFixed(2)}</p>
                    <span className="flex text-yellow-400 mt-1 text-lg md:text-xl gap-1">{Array(product.rating).fill().map((_, i) => (<FaStar key={i} />))} </span>
                </p>


                {/* <button className="w-full py-3 rounded-lg bg-gradient-to-r 
                                   from-lime-200 to-lime-300 text-black font-bold 
                                   hover:from-lime-300 hover:to-lime-400 
                                   transition duration-300">
                    Add To Cart
                </button> */}
                {/* <span>{product.rating}</span> */}
            </div>

        </div>
    )
}

export default Cards
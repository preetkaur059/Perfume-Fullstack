import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";

import Heading from "../Heading/Heading";
import Cards from "../Cards/Cards";

import { StoreContext } from "../../context/StoreContext";
import { useProducts } from "@/hooks/products/useProducts";

const SellingProducts = () => {
  const categories = ["All", "Men", "Women", "Unisex"];

  const [activeTab, setActiveTab] = useState("All");

  const { data: products = [] } = useProducts();

  const { searchItem, addToCart } = useContext(StoreContext);

  const navigate = useNavigate();

  // Filter products according to selected category
  const filteredItems =
    activeTab === "All"
      ? products
      : products.filter(
          (item) =>
            item.category?.toLowerCase() === activeTab.toLowerCase()
        );

  // Filter products according to search
  const searchedItems = filteredItems.filter((product) =>
    product.productName
      ?.toLowerCase()
      .includes((searchItem || "").toLowerCase())
  );

  // Show only first 20 products
  const renderProducts = searchedItems.slice(0, 20).map((product, index) => (
    <div
      key={product._id}
      data-aos="fade-up"
      data-aos-delay={index * 200}
    >
      <Cards
        product={product}
        addToCart={addToCart}
      />
    </div>
  ));

  return (
    <div className="bg-black pt-10">
      <div
        id="product-section"
        className="max-w-[1300px] mx-auto"
      >
        {/* Heading */}
        <div
          data-aos="fade-up"
          data-aos-delay="200"
          className="text-center"
        >
          <Heading highlight="Best Selling Products" />
        </div>

        {/* Categories */}
        <div
          data-aos="fade-up"
          data-aos-delay="300"
          className="flex mx-auto justify-center mt-5 gap-4 flex-wrap"
        >
          {categories.map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => setActiveTab(category)}
              className={`transform transition duration-500 hover:scale-105 cursor-pointer px-5 py-2 md:text-lg ${
                activeTab === category
                  ? "bg-gradient-to-b from-lime-200 to-lime-300 font-bold text-black"
                  : "bg-white font-medium text-black"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Products */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-2 md:gap-10 mt-10 md:mt-20">
          {searchedItems.length === 0 ? (
            <p className="col-span-full text-white text-3xl flex justify-center items-center py-10">
              NO PRODUCT FOUND
            </p>
          ) : (
            renderProducts
          )}
        </div>

        {/* Explore Collection */}
        <div className="w-fit pb-20 mx-auto mt-10">
          <button
            type="button"
            data-aos="fade-up"
            data-aos-delay="100"
            onClick={() => navigate("/Allproducts")}
            className="text-center cursor-pointer mt-4 px-4 py-2 bg-[#e2f2b0] text-black border-2 border-[#f5f5dc] text-[1.3rem] font-bold transition-transform duration-200 hover:scale-[1.03] hover:bg-[#efc3c5]"
          >
            Explore Collection →
          </button>
        </div>
      </div>
    </div>
  );
};

export default SellingProducts;
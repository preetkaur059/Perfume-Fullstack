import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import { ChevronLeft, ChevronRight } from "lucide-react";

import Heading from "../Heading/Heading";
import Cards from "../Cards/Cards";

import { StoreContext } from "../../context/StoreContext";
import { useProducts } from "@/hooks/products/useProducts";

const SellingProducts = () => {
  const categories = ["All", "Men", "Women", "Unisex"];

  const [activeTab, setActiveTab] = useState("All");
  const [productSwiper, setProductSwiper] = useState(null);
  const [activeSlide, setActiveSlide] = useState(0);

  const { data: productsResponse } = useProducts();
  const products = productsResponse?.data ?? [];

  const { searchItem } = useContext(StoreContext);

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

  // Keep this section focused on eight products. The complete catalogue is
  // still available from the "Explore Collection" button below.
  const bestSellingProducts = searchedItems.slice(0, 8);

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
        <div className="mt-10 md:mt-10">
          {searchedItems.length === 0 ? (
            <p className="text-white text-3xl flex justify-center items-center py-10">
              NO PRODUCT FOUND
            </p>
          ) : (
            <>
              <div className="mb-5 flex items-center justify-end gap-3 px-5 md:px-0">
                <button
                  type="button"
                  onClick={() => productSwiper?.slidePrev()}
                  disabled={!productSwiper || activeSlide === 0}
                  aria-label="Show previous products"
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-lime-300/60 text-lime-200 transition hover:bg-lime-300 hover:text-black disabled:opacity-40"
                >
                  <ChevronLeft size={22} />
                </button>
                <button
                  type="button"
                  onClick={() => productSwiper?.slideNext()}
                  disabled={!productSwiper || productSwiper.isEnd}
                  aria-label="Show next products"
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-lime-300/60 text-lime-200 transition hover:bg-lime-300 hover:text-black disabled:opacity-40"
                >
                  <ChevronRight size={22} />
                </button>
              </div>

              <Swiper
                key={`${activeTab}-${searchItem}`}
                modules={[Pagination]}
                onSwiper={(swiper) => {
                  setProductSwiper(swiper);
                  setActiveSlide(swiper.activeIndex);
                }}
                onSlideChange={(swiper) => setActiveSlide(swiper.activeIndex)}
                spaceBetween={16}
                slidesPerView={1.1}
                slidesPerGroup={1}
                speed={550}
                grabCursor
                watchOverflow
                pagination={{ clickable: true }}
                breakpoints={{
                  640: { slidesPerView: 2, spaceBetween: 20 },
                  768: { slidesPerView: 3, spaceBetween: 24 },
                  1024: { slidesPerView: 4, spaceBetween: 32 },
                }}
                className="best-selling-swiper !px-0 md:!px-1"
              >
                {bestSellingProducts.map((product) => (
                  <SwiperSlide
                    key={product._id ?? product.id}
                    className="!h-auto"
                  >
                    <Cards product={product} showBuyNow />
                  </SwiperSlide>
                ))}
              </Swiper>
            </>
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

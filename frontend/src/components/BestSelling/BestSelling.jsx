import React from "react";
import img2 from "../../assets/perfume2.png";
import img3 from "../../assets/perfume3.png";
import img4 from "../../assets/perfume4.png";
import img5 from "../../assets/perfume5.png";
import img6 from "../../assets/perfume6.png";
import img7 from "../../assets/perfume7.png";

const BestSelling = () => {
  const products = [
    { id: 1, img: img2 },
    { id: 2, img: img3 },
    { id: 3, img: img4 },
    { id: 4, img: img5 },
    { id: 5, img: img6 },
    { id: 6, img: img7 },
  ];

  return (
    <section className="bg-black py-20">
      <div className="max-w-[1300px] mx-auto px-4 flex flex-col items-center gap-12 text-center">

        {/* Heading */}
        <h1 className="text-[#e2f2b0] text-[4.5rem] font-allura md:text-[4.5rem] text-[3rem]">
          Best Selling Products
        </h1>

        {/* Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-12 w-full">
          {products.map((item) => (
            <div
              key={item.id}
              className="bg-[#101010] border border-[#333] pt-6 transition-transform duration-300 hover:scale-105 hover:bg-[#333]"
            >
              {/* Product Image */}
              <div>
                <img
                  src={item.img}
                  alt="product"
                  className="h-60 mx-auto"
                />
              </div>

              {/* Info */}
              <div className="mt-2">
                <h4 className="text-white text-2xl my-1">
                  Perfume
                </h4>

                <p className="text-white text-2xl">
                  $20.00
                </p>

                <a
                  href="#"
                  className="block mt-4 mb-8 px-4 py-2 bg-[#e2f2b0] text-black text-xl font-bold border-2 border-beige hover:bg-[#efc3c5] transition"
                >
                  Add to Cart
                </a>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default BestSelling;
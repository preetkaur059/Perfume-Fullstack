import React from "react";
import products from "../Temp/Temp";
import Heading from "../Heading/Heading";
import Cards from "../Cards/Cards";

const Category = ({ type }) => {

 const filteredProducts =
    type === "All"
      ? products
      : products.filter(
          (item) => item.category.toLowerCase() === type.toLowerCase()
        );

  // Heading text change
  const headingText =
    type === "Men"
      ? "Men's Fragrance Collection"
      : type === "Women"
      ? "Women's Fragrance Collection"
      : type === "Unisex"
      ? "Unisex Fragrance Collection"
      : "Our Fragrance Collection";
  
  const renderProduct = filteredProducts.map((product) => {
    return (
      <Cards key={product.id}
        product={product} />
    )
  })


  return (
    <div className="bg-black pb-3 pt-28">
      <div className="max-w-[1300px] mx-auto">

        <div className="text-center">
          <Heading highlight={headingText} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-2 md:gap-10 mt-8">
          {filteredProducts.length === 0 ?
            <p className='col-span-full text-white text-3xl flex justify-center items-center'>NO PRODUCT FOUND</p>
            : (renderProduct)}
        </div>

      </div>
    </div>

  );
};

export default Category;
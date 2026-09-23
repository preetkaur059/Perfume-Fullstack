import React, { useContext, useEffect, useMemo, useState } from "react";

import Heading from "../Heading/Heading";
import Cards from "../Cards/Cards";
import { useProducts } from "@/hooks/products/useProducts";
import { StoreContext } from "../../context/StoreContext";
import Pagination from "../Pagination/Pagination";

const Category = ({ type }) => {
  const [page, setPage] = useState(1);
  const { searchItem } = useContext(StoreContext);

  // A new search or category should always start from the first result page.
  useEffect(() => {
    setPage(1);
  }, [type, searchItem]);

  const queryParams = useMemo(
    () => ({
      page,
      limit: 12,
      search: searchItem.trim() || undefined,
      category: type === "All" ? undefined : type,
    }),
    [page, searchItem, type]
  );

  const { data: productsResponse } = useProducts(queryParams);
  const products = productsResponse?.data ?? [];
  const pagination = productsResponse?.pagination;

  // Heading text change
  const headingText =
    type === "Men"
      ? "Men's Fragrance Collection"
      : type === "Women"
        ? "Women's Fragrance Collection"
        : type === "Unisex"
          ? "Unisex Fragrance Collection"
          : "Our Fragrance Collection";

  const renderProduct = products.map((product) => {
    return (
      <Cards key={product._id ?? product.id}
        product={product} />
    )
  })


  return (
    <div className="bg-black pb-3 pt-28">
      <div className="max-w-[1300px] mx-auto">

        <div className="text-center">
          <Heading highlight={headingText} />
        </div> 
      <Pagination className="cursor-pointer" pagination={pagination} onPageChange={setPage} />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-2 md:gap-10 mt-8">
          {products.length === 0 ?
            <p className='col-span-full text-white text-3xl flex justify-center items-center'>NO PRODUCT FOUND</p>
            : (renderProduct)}
        </div>

      </div>
    </div>

  );
};

export default Category;

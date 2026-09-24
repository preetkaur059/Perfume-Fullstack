 import React, { useContext, useEffect, useMemo, useState } from "react";

import Heading from "../Heading/Heading";
import Cards from "../Cards/Cards";
import { useProducts } from "@/hooks/products/useProducts";
import { StoreContext } from "../../context/StoreContext";
import Pagination from "../Pagination/Pagination";

const Category = ({ type }) => {
  const [page, setPage] = useState(1);
  const [category, setCategory] = useState(type);
  const [sort, setSort] = useState("newest");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const { searchItem } = useContext(StoreContext);

  // Keep the filter in sync when navigating from one category page to another.
  useEffect(() => {
    setCategory(type);
  }, [type]);

  // A new search, filter, or sort should always start from the first result page.
  useEffect(() => {
    setPage(1);
  }, [category, sort, minPrice, maxPrice, searchItem]);

  const queryParams = useMemo(
    () => ({
      page,
      limit: 10,
      search: searchItem.trim() || undefined,
      category: category === "All" ? undefined : category,
      sort,
      minPrice,
      maxPrice,
    }),
    [page, searchItem, category, sort, minPrice, maxPrice]
  );

  const { data: productsResponse } = useProducts(queryParams);
  const products = productsResponse?.data ?? [];
  const pagination = productsResponse?.pagination;

  // Heading text change
  const headingText =
    category === "Men"
      ? "Men's Fragrance Collection"
      : category === "Women"
        ? "Women's Fragrance Collection"
        : category === "Unisex"
          ? "Unisex Fragrance Collection"
          : "Our Fragrance Collection";

  const handleClearFilters = () => {
    setCategory("All");
    setSort("newest");
    setMinPrice("");
    setMaxPrice("");
  };

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
          {/* <Heading highlight={headingText} /> */}
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <select
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            className="border border-zinc-700 bg-black px-3 py-2 text-white focus:outline-none"
            aria-label="Filter products by category"
          >
            <option value="All">All</option>
            <option value="Men">Men</option>
            <option value="Women">Women</option>
            <option value="Unisex">Unisex</option>
          </select>

          <select
            value={sort}
            onChange={(event) => setSort(event.target.value)}
            className="border border-zinc-700 bg-black px-3 py-2 text-white focus:outline-none"
            aria-label="Sort products"
          >
            <option value="newest">Newest products</option>
            <option value="oldest">Oldest products</option>
            <option value="lowest_price">Price: Low to High</option>
            <option value="highest_price">Price: High to Low</option>
            <option value="name_asc">Product name: A to Z</option>
            <option value="name_desc">Product name: Z to A</option>
            <option value="highest_rating">Rating: Highest to Lowest</option>
            <option value="lowest_rating">Rating: Lowest to Highest</option>
          </select>

          <input
            type="number"
            min="0"
            value={minPrice}
            onChange={(event) => setMinPrice(event.target.value)}
            placeholder="Min price"
            className="w-28 border border-zinc-700 bg-black px-3 py-2 text-white placeholder:text-zinc-500 focus:outline-none"
          />
          <input
            type="number"
            min="0"
            value={maxPrice}
            onChange={(event) => setMaxPrice(event.target.value)}
            placeholder="Max price"
            className="w-28 border border-zinc-700 bg-black px-3 py-2 text-white placeholder:text-zinc-500 focus:outline-none"
          />
          <button
            type="button"
            onClick={handleClearFilters}
            className="border border-zinc-700 px-3 py-2 text-white transition hover:border-lime-400 hover:text-lime-400"
          >
            Clear filters
          </button>
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

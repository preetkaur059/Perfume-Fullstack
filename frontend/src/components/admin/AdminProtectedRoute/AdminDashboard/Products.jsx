import React, { useState, useEffect, useMemo } from "react";
import {
  Package,
  Trash2,
  RefreshCw,
  Loader2,
  ShoppingBag,
  Pencil,
  Plus,
  X,
  User,
  Sparkles,
  Layers,
  CalendarDays,
  Eye,
  Star,
  Search,
  ArrowUpDown,
  AlertCircle,
  Copy,
  Check,
  RotateCcw,
  Image as ImageIcon,
} from "lucide-react";
import { toast } from "react-toastify";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import {
  useProducts,
  useProductStats,
  useCreateProduct,
  useUpdateProduct,
  useDeleteProduct,
} from "@/hooks/products/useProducts";

import { SidebarTrigger } from "@/components/ui/sidebar";
import Pagination from "@/components/Pagination/Pagination";
import uploadToCloudinary from "@/utils/uploadToCloudinary";

const CATEGORY_OPTIONS = [
  { value: "All", label: "All Categories" },
  { value: "Men", label: "Men" },
  { value: "Women", label: "Women" },
  { value: "Unisex", label: "Unisex" },
];

const SORT_OPTIONS = [
  { value: "newest", label: "Newest First" },
  { value: "oldest", label: "Oldest First" },
  { value: "lowest_price", label: "Price: Low to High" },
  { value: "highest_price", label: "Price: High to Low" },
  { value: "highest_rating", label: "Highest Rating" },
  { value: "name_asc", label: "Name: A to Z" },
  { value: "name_desc", label: "Name: Z to A" },
];

const initialForm = {
  productName: "",
  price: "",
  category: "Unisex",
  rating: "4.5",
  description: "",
  image: "",
};

const Products = () => {
  // ===============================
  // FILTER & PAGINATION STATES
  // ===============================
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [sortOption, setSortOption] = useState("newest");
  const [copiedId, setCopiedId] = useState(null);

  // Form & Dialog states
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [viewingProduct, setViewingProduct] = useState(null);
  const [deleteProductTarget, setDeleteProductTarget] = useState(null);

  const [form, setForm] = useState(initialForm);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [uploadingImage, setUploadingImage] = useState(false);

  // Debounce search input (350ms)
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchInput.trim());
      setPage(1);
    }, 350);

    return () => clearTimeout(handler);
  }, [searchInput]);

  // Clean up blob URL preview
  useEffect(() => {
    return () => {
      if (imagePreview?.startsWith("blob:")) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  // Handle filter changes
  const handleCategoryChange = (val) => {
    setCategoryFilter(val);
    setPage(1);
  };

  const handleSortChange = (val) => {
    setSortOption(val);
    setPage(1);
  };

  const handleClearFilters = () => {
    setSearchInput("");
    setDebouncedSearch("");
    setCategoryFilter("All");
    setSortOption("newest");
    setPage(1);
  };

  const isFiltered =
    Boolean(debouncedSearch) ||
    categoryFilter !== "All" ||
    sortOption !== "newest";

  // ===============================
  // QUERIES
  // ===============================
  const queryParams = useMemo(
    () => ({
      page,
      limit: 10,
      search: debouncedSearch || undefined,
      category: categoryFilter !== "All" ? categoryFilter : undefined,
      sort: sortOption,
    }),
    [page, debouncedSearch, categoryFilter, sortOption]
  );

  const {
    data: productsResponse,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useProducts(queryParams);

  const products = productsResponse?.data ?? [];
  const pagination = productsResponse?.pagination;

  // Product Statistics Query
  const {
    data: statsResponse,
    isLoading: statsLoading,
    refetch: refetchStats,
  } = useProductStats();

  const stats = statsResponse?.data ?? {
    totalProducts: 0,
    menProducts: 0,
    womenProducts: 0,
    unisexProducts: 0,
  };

  // ===============================
  // MUTATIONS
  // ===============================
  const createProductMutation = useCreateProduct();
  const updateProductMutation = useUpdateProduct();
  const deleteProductMutation = useDeleteProduct();

  const isSaving =
    createProductMutation.isPending || updateProductMutation.isPending;
  const isSubmitting = isSaving || uploadingImage;

  // Copy helper
  const handleCopyId = (id) => {
    if (!id) return;
    navigator.clipboard.writeText(id);
    setCopiedId(id);
    toast.info("Product ID copied to clipboard");
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Refresh all data
  const handleRefresh = async () => {
    await Promise.all([refetch(), refetchStats()]);
  };

  // ===============================
  // DIALOG HANDLERS
  // ===============================
  const openAddForm = () => {
    setEditingProduct(null);
    setForm(initialForm);
    setSelectedImage(null);
    setImagePreview("");
    setIsDialogOpen(true);
  };

  const openEditForm = (product) => {
    setEditingProduct(product);
    setForm({
      productName: product.productName || "",
      price: product.price || "",
      category: product.category || "Unisex",
      rating: product.rating ?? "4.5",
      description: product.description || "",
      image: product.image || "",
    });
    setSelectedImage(null);
    setImagePreview(product.image || "");
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    setEditingProduct(null);
    setForm(initialForm);
    setSelectedImage(null);
    setImagePreview("");
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const previousImage = form.image;
    const localPreview = URL.createObjectURL(file);
    setSelectedImage(file);
    setImagePreview(localPreview);
    setUploadingImage(true);

    try {
      const imageUrl = await uploadToCloudinary(file);
      setForm((currentForm) => ({ ...currentForm, image: imageUrl }));
      setImagePreview(imageUrl);
      setSelectedImage(null);
      toast.success("Image uploaded successfully");
    } catch (uploadError) {
      setImagePreview(previousImage);
      setSelectedImage(null);
      toast.error(uploadError.message || "Failed to upload image");
    } finally {
      setUploadingImage(false);
      event.target.value = "";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.productName.trim() || !form.price || !form.category.trim()) {
      toast.warning("Product name, price, and category are required");
      return;
    }

    if (Number(form.price) <= 0) {
      toast.warning("Price must be greater than zero");
      return;
    }

    if (!editingProduct && !form.image) {
      toast.warning("Please upload a product image");
      return;
    }

    const productPayload = {
      productName: form.productName.trim(),
      price: Number(form.price),
      category: form.category.trim(),
      rating: form.rating ? Number(form.rating) : 0,
      description: form.description?.trim() || "",
      image: form.image,
    };

    if (editingProduct) {
      updateProductMutation.mutate(
        {
          productId: editingProduct._id,
          productData: productPayload,
        },
        {
          onSuccess: async () => {
            toast.success("Product updated successfully");
            closeDialog();
            await handleRefresh();
          },
          onError: (err) => {
            toast.error(
              err.response?.data?.message || "Failed to update product"
            );
          },
        }
      );
    } else {
      createProductMutation.mutate(productPayload, {
        onSuccess: async () => {
          toast.success("Product created successfully");
          closeDialog();
          setPage(1);
          await handleRefresh();
        },
        onError: (err) => {
          toast.error(
            err.response?.data?.message || "Failed to create product"
          );
        },
      });
    }
  };

  const confirmDelete = () => {
    if (!deleteProductTarget?._id) return;

    deleteProductMutation.mutate(deleteProductTarget._id, {
      onSuccess: async () => {
        toast.success("Product deleted successfully");
        setDeleteProductTarget(null);
        await handleRefresh();
      },
      onError: (err) => {
        toast.error(
          err.response?.data?.message || "Failed to delete product"
        );
      },
    });
  };

  // Helper date
  const getCreatedDate = (item) => {
    if (!item) return "N/A";
    if (item.createdAt) {
      return new Date(item.createdAt).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    }
    if (item._id && item._id.length >= 8) {
      const timestamp = parseInt(item._id.substring(0, 8), 16) * 1000;
      if (!isNaN(timestamp)) {
        return new Date(timestamp).toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        });
      }
    }
    return "N/A";
  };

  const getCategoryBadgeStyle = (category) => {
    const c = category?.toLowerCase();
    if (c === "men") {
      return "border-blue-400/20 bg-blue-400/10 text-blue-300";
    }
    if (c === "women") {
      return "border-pink-400/20 bg-pink-400/10 text-pink-300";
    }
    return "border-lime-400/20 bg-lime-400/10 text-lime-300";
  };

  return (
    <div className="min-h-screen bg-black p-4 text-white sm:p-6 lg:p-8">
      {/* ==================================================
          1. HEADER SECTION
      ================================================== */}
      <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <div className="flex items-center gap-3">
            <SidebarTrigger className="h-9 w-9 rounded-xl border border-[#222] bg-[#111] text-gray-400 transition hover:border-lime-400/40 hover:text-lime-300" />
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
                  Products
                </h1>
                <span className="rounded-full border border-lime-400/30 bg-lime-400/10 px-2.5 py-0.5 text-xs font-semibold text-lime-300">
                  Fragrance Catalog
                </span>
              </div>
              <p className="mt-1 text-sm text-gray-400">
                Manage, curate, and adjust prices for all perfumes in your store.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleRefresh}
            disabled={isFetching || statsLoading}
            className="inline-flex items-center gap-2 rounded-xl border border-[#222] bg-[#111] px-4 py-2.5 text-sm font-medium text-gray-300 transition hover:border-lime-400/30 hover:text-lime-300 disabled:opacity-50"
            title="Refresh product data"
          >
            <RefreshCw
              size={16}
              className={isFetching || statsLoading ? "animate-spin text-lime-400" : ""}
            />
            <span>Refresh</span>
          </button>

          <button
            type="button"
            onClick={openAddForm}
            className="inline-flex items-center gap-2 rounded-xl bg-lime-400 px-4 py-2.5 text-sm font-semibold text-black shadow-lg shadow-lime-400/10 transition hover:bg-lime-300 hover:shadow-lime-400/20 active:scale-95"
          >
            <Plus size={18} />
            <span>Add Product</span>
          </button>
        </div>
      </div>

      {/* ==================================================
          2. STATISTICS CARDS SECTION
      ================================================== */}
      <div className="mb-6 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
        {/* Total Products */}
        <div className="rounded-2xl border border-[#222] bg-[#0b0b0b] p-4 transition-all hover:border-lime-400/30">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium uppercase tracking-wider text-gray-400">
              Total Products
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-lime-400/10 text-lime-400">
              <ShoppingBag size={16} />
            </div>
          </div>
          <p className="mt-2 text-xl font-bold tracking-tight text-lime-300 sm:text-2xl">
            {stats.totalProducts}
          </p>
          <p className="mt-1 text-xs text-gray-500">Live in store catalog</p>
        </div>

        {/* Men Fragrances */}
        <div className="rounded-2xl border border-[#222] bg-[#0b0b0b] p-4 transition-all hover:border-lime-400/30">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium uppercase tracking-wider text-gray-400">
              Men
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-400/10 text-blue-400">
              <User size={16} />
            </div>
          </div>
          <p className="mt-2 text-xl font-bold text-white sm:text-2xl">
            {stats.menProducts}
          </p>
          <p className="mt-1 text-xs text-gray-500">Men's collection</p>
        </div>

        {/* Women Fragrances */}
        <div className="rounded-2xl border border-[#222] bg-[#0b0b0b] p-4 transition-all hover:border-lime-400/30">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium uppercase tracking-wider text-gray-400">
              Women
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-pink-400/10 text-pink-400">
              <Sparkles size={16} />
            </div>
          </div>
          <p className="mt-2 text-xl font-bold text-white sm:text-2xl">
            {stats.womenProducts}
          </p>
          <p className="mt-1 text-xs text-gray-500">Women's collection</p>
        </div>

        {/* Unisex Fragrances */}
        <div className="rounded-2xl border border-[#222] bg-[#0b0b0b] p-4 transition-all hover:border-lime-400/30">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium uppercase tracking-wider text-gray-400">
              Unisex
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-400/10 text-purple-400">
              <Layers size={16} />
            </div>
          </div>
          <p className="mt-2 text-xl font-bold text-white sm:text-2xl">
            {stats.unisexProducts}
          </p>
          <p className="mt-1 text-xs text-gray-500">Universal fragrances</p>
        </div>
      </div>

      {/* ==================================================
          3. SEARCH & FILTERS BAR
      ================================================== */}
      <div className="mb-4 rounded-2xl border border-[#222] bg-[#0b0b0b] p-4">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-12 lg:items-center">
          {/* Search Input */}
          <div className="relative sm:col-span-2 lg:col-span-5">
            <Search
              size={16}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
            />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search perfumes by name..."
              className="w-full rounded-xl border border-[#292929] bg-[#111] py-2.5 pl-9 pr-9 text-sm text-white placeholder-gray-500 outline-none transition focus:border-lime-400 focus:ring-1 focus:ring-lime-400/30"
            />
            {searchInput && (
              <button
                type="button"
                onClick={() => setSearchInput("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"
              >
                <X size={15} />
              </button>
            )}
          </div>

          {/* Category Filter */}
          <div className="lg:col-span-4">
            <select
              value={categoryFilter}
              onChange={(e) => handleCategoryChange(e.target.value)}
              className="w-full rounded-xl border border-[#292929] bg-[#111] px-3 py-2.5 text-sm text-white outline-none transition focus:border-lime-400 focus:ring-1 focus:ring-lime-400/30"
            >
              {CATEGORY_OPTIONS.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>

          {/* Sort By */}
          <div className="lg:col-span-3">
            <div className="relative">
              <select
                value={sortOption}
                onChange={(e) => handleSortChange(e.target.value)}
                className="w-full appearance-none rounded-xl border border-[#292929] bg-[#111] px-3 py-2.5 pr-8 text-sm text-white outline-none transition focus:border-lime-400 focus:ring-1 focus:ring-lime-400/30"
              >
                {SORT_OPTIONS.map((sort) => (
                  <option key={sort.value} value={sort.value}>
                    {sort.label}
                  </option>
                ))}
              </select>
              <ArrowUpDown
                size={14}
                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
              />
            </div>
          </div>
        </div>

        {/* Active Filters Summary & Reset */}
        {isFiltered && (
          <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-[#1a1a1a] pt-3 text-xs text-gray-400">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-medium text-gray-500">Filtered by:</span>
              {debouncedSearch && (
                <span className="inline-flex items-center gap-1 rounded-md bg-[#181818] px-2 py-0.5 text-gray-300">
                  Search: <strong className="text-white">"{debouncedSearch}"</strong>
                </span>
              )}
              {categoryFilter !== "All" && (
                <span className="inline-flex items-center gap-1 rounded-md bg-[#181818] px-2 py-0.5 text-gray-300">
                  Category: <strong className="text-white">{categoryFilter}</strong>
                </span>
              )}
              {sortOption !== "newest" && (
                <span className="inline-flex items-center gap-1 rounded-md bg-[#181818] px-2 py-0.5 text-gray-300">
                  Sort:{" "}
                  <strong className="text-white">
                    {SORT_OPTIONS.find((s) => s.value === sortOption)?.label}
                  </strong>
                </span>
              )}
            </div>

            <button
              type="button"
              onClick={handleClearFilters}
              className="inline-flex items-center gap-1 rounded-lg px-2 py-1 font-medium text-lime-400 transition hover:bg-lime-400/10"
            >
              <RotateCcw size={13} />
              <span>Reset Filters</span>
            </button>
          </div>
        )}
      </div>

      {/* ==================================================
          4. PAGINATION SECTION (ABOVE THE TABLE)
      ================================================== */}
      <div className="mb-3 flex flex-col items-center justify-between gap-3 sm:flex-row">
        <div className="text-xs text-gray-400">
          {pagination ? (
            <span>
              Showing{" "}
              <strong className="text-white">
                {products.length > 0
                  ? (pagination.page - 1) * pagination.limit + 1
                  : 0}
              </strong>{" "}
              to{" "}
              <strong className="text-white">
                {Math.min(pagination.page * pagination.limit, pagination.total)}
              </strong>{" "}
              of <strong className="text-white">{pagination.total}</strong> products
            </span>
          ) : (
            <span>Loading count...</span>
          )}
        </div>

        {/* Existing Reusable Pagination Component */}
        <div className="w-full sm:w-auto [&>div]:mt-0">
          <Pagination pagination={pagination} onPageChange={setPage} />
        </div>
      </div>

      {/* ==================================================
          5. PRODUCTS LIST / TABLE LAYOUT
      ================================================== */}
      {isLoading ? (
        <div className="flex min-h-[360px] flex-col items-center justify-center rounded-2xl border border-[#222] bg-[#0b0b0b] p-12">
          <Loader2 size={36} className="animate-spin text-lime-400" />
          <p className="mt-4 text-sm text-gray-400">Loading products...</p>
        </div>
      ) : isError ? (
        <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-8 text-center">
          <AlertCircle size={36} className="mx-auto mb-3 text-red-400" />
          <h3 className="text-lg font-semibold text-white">Failed to load products</h3>
          <p className="mt-1 text-sm text-red-400">
            {error?.response?.data?.message || "An unexpected error occurred."}
          </p>
          <button
            type="button"
            onClick={handleRefresh}
            className="mt-4 inline-flex items-center gap-2 rounded-xl bg-lime-400 px-4 py-2 font-semibold text-black transition hover:bg-lime-300"
          >
            <RefreshCw size={16} />
            Try Again
          </button>
        </div>
      ) : products.length === 0 ? (
        <div className="rounded-2xl border border-[#222] bg-[#0b0b0b] p-12 text-center">
          <ShoppingBag size={48} className="mx-auto mb-4 text-gray-600" />
          <h2 className="text-lg font-semibold text-white">No Products Found</h2>
          <p className="mt-1 text-sm text-gray-400">
            {isFiltered
              ? "No perfumes match your filter criteria. Try adjusting your search or filters."
              : "No products added to the catalog yet. Click 'Add Product' to create one."}
          </p>
          {isFiltered && (
            <button
              type="button"
              onClick={handleClearFilters}
              className="mt-4 inline-flex items-center gap-2 rounded-xl border border-lime-400/30 bg-lime-400/10 px-4 py-2 text-sm font-semibold text-lime-300 transition hover:bg-lime-400/20"
            >
              <RotateCcw size={15} />
              Clear All Filters
            </button>
          )}
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-[#222] bg-[#0b0b0b] shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-300">
              <thead className="border-b border-[#222] bg-[#111] text-xs uppercase tracking-wider text-gray-400">
                <tr>
                  <th scope="col" className="px-5 py-4 font-semibold">
                    Product
                  </th>
                  <th scope="col" className="px-5 py-4 font-semibold">
                    Category
                  </th>
                  <th scope="col" className="px-5 py-4 font-semibold">
                    Price
                  </th>
                  <th scope="col" className="px-5 py-4 font-semibold">
                    Rating
                  </th>
                  <th scope="col" className="px-5 py-4 font-semibold">
                    Description
                  </th>
                  <th scope="col" className="px-5 py-4 font-semibold">
                    Created Date
                  </th>
                  <th scope="col" className="px-5 py-4 text-right font-semibold">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1a1a1a]">
                {products.map((product) => {
                  return (
                    <tr
                      key={product._id}
                      className="transition-colors hover:bg-[#131313]"
                    >
                      {/* Product Image & Name */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-12 w-12 shrink-0 overflow-hidden rounded-xl border border-[#222] bg-[#161616]">
                            {product.image ? (
                              <img
                                src={product.image}
                                alt={product.productName}
                                className="h-full w-full object-cover transition-transform duration-300 hover:scale-110"
                              />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center text-gray-600">
                                <ImageIcon size={18} />
                              </div>
                            )}
                          </div>
                          <div className="min-w-0">
                            <p className="truncate font-semibold text-white">
                              {product.productName}
                            </p>
                            <div className="flex items-center gap-1.5 font-mono text-xs text-gray-500">
                              <span>#{product._id?.slice(-6)}</span>
                              <button
                                type="button"
                                onClick={() => handleCopyId(product._id)}
                                className="text-gray-500 transition hover:text-lime-300"
                                title="Copy ID"
                              >
                                {copiedId === product._id ? (
                                  <Check size={12} className="text-lime-400" />
                                ) : (
                                  <Copy size={12} />
                                )}
                              </button>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="whitespace-nowrap px-5 py-4">
                        <span
                          className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${getCategoryBadgeStyle(
                            product.category
                          )}`}
                        >
                          {product.category || "Unisex"}
                        </span>
                      </td>

                      {/* Price */}
                      <td className="whitespace-nowrap px-5 py-4">
                        <span className="font-semibold text-lime-300">
                          ₹{Number(product.price).toLocaleString("en-IN")}
                        </span>
                      </td>

                      {/* Rating */}
                      <td className="whitespace-nowrap px-5 py-4">
                        <div className="inline-flex items-center gap-1 rounded-md bg-[#161616] px-2 py-1 text-xs font-medium text-yellow-300">
                          <Star size={13} className="fill-yellow-400 text-yellow-400" />
                          <span>{product.rating ? Number(product.rating).toFixed(1) : "0.0"}</span>
                        </div>
                      </td>

                      {/* Description */}
                      <td className="px-5 py-4">
                        <p className="line-clamp-2 max-w-[240px] text-xs text-gray-400">
                          {product.description || "No description provided."}
                        </p>
                      </td>

                      {/* Created Date */}
                      <td className="whitespace-nowrap px-5 py-4 text-xs text-gray-400">
                        <div className="flex items-center gap-1.5">
                          <CalendarDays size={13} className="text-gray-500" />
                          <span>{getCreatedDate(product)}</span>
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="whitespace-nowrap px-5 py-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* View Details */}
                          <button
                            type="button"
                            onClick={() => setViewingProduct(product)}
                            className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-[#292929] bg-[#111] text-gray-300 transition hover:border-lime-400/40 hover:text-lime-300"
                            title="View product details"
                          >
                            <Eye size={15} />
                          </button>

                          {/* Edit */}
                          <button
                            type="button"
                            onClick={() => openEditForm(product)}
                            className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-[#292929] bg-[#111] text-gray-300 transition hover:border-lime-400/40 hover:text-lime-300"
                            title="Edit product"
                          >
                            <Pencil size={15} />
                          </button>

                          {/* Delete */}
                          <button
                            type="button"
                            onClick={() => setDeleteProductTarget(product)}
                            disabled={deleteProductMutation.isPending}
                            className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-red-500/20 bg-red-500/5 text-red-400 transition hover:bg-red-500/10 disabled:opacity-50"
                            title="Delete product"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ==================================================
          6. CREATE / EDIT PRODUCT DIALOG
      ================================================== */}
      <Dialog
        open={isDialogOpen}
        onOpenChange={(open) => {
          if (!open) {
            closeDialog();
          } else {
            setIsDialogOpen(true);
          }
        }}
      >
        <DialogContent className="max-h-[90vh] overflow-y-auto border-[#222] bg-[#0b0b0b] text-white sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold tracking-tight text-white">
              {editingProduct ? "Edit Product" : "Add New Fragrance"}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="mt-4 space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              {/* Product Name */}
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-gray-400">
                  Product Name <span className="text-lime-400">*</span>
                </label>
                <input
                  type="text"
                  name="productName"
                  value={form.productName}
                  onChange={handleFormChange}
                  placeholder="e.g. Amber Oud Noir"
                  className="w-full rounded-xl border border-[#292929] bg-[#111] px-3.5 py-2.5 text-sm text-white placeholder-gray-600 outline-none transition focus:border-lime-400 focus:ring-1 focus:ring-lime-400/30"
                  required
                />
              </div>

              {/* Price */}
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-gray-400">
                  Price (₹) <span className="text-lime-400">*</span>
                </label>
                <input
                  type="number"
                  name="price"
                  min="1"
                  step="1"
                  value={form.price}
                  onChange={handleFormChange}
                  placeholder="e.g. 2499"
                  className="w-full rounded-xl border border-[#292929] bg-[#111] px-3.5 py-2.5 text-sm text-white placeholder-gray-600 outline-none transition focus:border-lime-400 focus:ring-1 focus:ring-lime-400/30"
                  required
                />
              </div>

              {/* Category */}
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-gray-400">
                  Category <span className="text-lime-400">*</span>
                </label>
                <select
                  name="category"
                  value={form.category}
                  onChange={handleFormChange}
                  className="w-full rounded-xl border border-[#292929] bg-[#111] px-3.5 py-2.5 text-sm text-white outline-none transition focus:border-lime-400 focus:ring-1 focus:ring-lime-400/30"
                >
                  <option value="Men">Men</option>
                  <option value="Women">Women</option>
                  <option value="Unisex">Unisex</option>
                </select>
              </div>

              {/* Rating */}
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-gray-400">
                  Rating (0 to 5)
                </label>
                <input
                  type="number"
                  name="rating"
                  min="0"
                  max="5"
                  step="0.1"
                  value={form.rating}
                  onChange={handleFormChange}
                  placeholder="e.g. 4.8"
                  className="w-full rounded-xl border border-[#292929] bg-[#111] px-3.5 py-2.5 text-sm text-white placeholder-gray-600 outline-none transition focus:border-lime-400 focus:ring-1 focus:ring-lime-400/30"
                />
              </div>
            </div>

            {/* Product Image Upload */}
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-gray-400">
                Product Image {!editingProduct && <span className="text-lime-400">*</span>}
              </label>

              <div className="rounded-xl border border-dashed border-[#333] bg-[#111] p-4 transition hover:border-lime-400/40">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                  <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-[#222] bg-[#181818]">
                    {imagePreview ? (
                      <img
                        src={imagePreview}
                        alt="Product preview"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <ImageIcon size={24} className="text-gray-600" />
                    )}
                  </div>

                  <div className="min-w-0 flex-1 space-y-2">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      disabled={uploadingImage || isSaving}
                      className="block w-full text-xs text-gray-400 file:mr-3 file:rounded-lg file:border-0 file:bg-lime-400 file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-black hover:file:bg-lime-300"
                    />
                    <p className="text-xs text-gray-500">
                      {uploadingImage ? (
                        <span className="flex items-center gap-1.5 text-lime-400">
                          <Loader2 size={12} className="animate-spin" />
                          Uploading image to Cloudinary...
                        </span>
                      ) : selectedImage ? (
                        "Image selected, uploading..."
                      ) : (
                        "Supported: JPG, PNG, WEBP up to 5MB"
                      )}
                    </p>
                    {editingProduct && !uploadingImage && (
                      <p className="text-xs text-gray-500">
                        Leave empty to keep the existing fragrance image.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-gray-400">
                Description
              </label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleFormChange}
                placeholder="Fragrance notes, ingredients, mood, and olfactory description..."
                rows={3}
                className="w-full resize-none rounded-xl border border-[#292929] bg-[#111] p-3 text-sm text-white placeholder-gray-600 outline-none transition focus:border-lime-400 focus:ring-1 focus:ring-lime-400/30"
              />
            </div>

            {/* Dialog Footer Actions */}
            <div className="flex items-center justify-end gap-3 border-t border-[#222] pt-4">
              <button
                type="button"
                onClick={closeDialog}
                disabled={isSubmitting}
                className="rounded-xl border border-[#292929] bg-[#111] px-4 py-2.5 text-sm font-medium text-gray-300 transition hover:bg-[#181818] hover:text-white"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center gap-2 rounded-xl bg-lime-400 px-5 py-2.5 text-sm font-semibold text-black transition hover:bg-lime-300 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    <span>
                      {uploadingImage
                        ? "Uploading..."
                        : editingProduct
                          ? "Updating..."
                          : "Creating..."}
                    </span>
                  </>
                ) : (
                  <span>{editingProduct ? "Update Product" : "Create Product"}</span>
                )}
              </button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* ==================================================
          7. VIEW PRODUCT DETAILS DIALOG
      ================================================== */}
      <Dialog
        open={Boolean(viewingProduct)}
        onOpenChange={(open) => {
          if (!open) setViewingProduct(null);
        }}
      >
        <DialogContent className="max-h-[90vh] overflow-y-auto border-[#222] bg-[#0b0b0b] text-white sm:max-w-xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold tracking-tight text-white">
              Product Overview
            </DialogTitle>
          </DialogHeader>

          {viewingProduct && (
            <div className="mt-4 space-y-5">
              {/* Image banner */}
              <div className="relative aspect-video w-full overflow-hidden rounded-2xl border border-[#222] bg-[#141414]">
                {viewingProduct.image ? (
                  <img
                    src={viewingProduct.image}
                    alt={viewingProduct.productName}
                    className="h-full w-full object-contain"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-gray-600">
                    <ImageIcon size={48} />
                  </div>
                )}
                <div className="absolute right-3 top-3">
                  <span
                    className={`rounded-full border px-3 py-1 text-xs font-semibold shadow-lg backdrop-blur-md ${getCategoryBadgeStyle(
                      viewingProduct.category
                    )}`}
                  >
                    {viewingProduct.category}
                  </span>
                </div>
              </div>

              {/* Title & Price */}
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-xl font-bold text-white">
                    {viewingProduct.productName}
                  </h3>
                  <div className="mt-1 flex items-center gap-2 text-xs text-gray-400">
                    <span className="font-mono">#{viewingProduct._id}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <CalendarDays size={13} />
                      {getCreatedDate(viewingProduct)}
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-2xl font-bold text-lime-300">
                    ₹{Number(viewingProduct.price).toLocaleString("en-IN")}
                  </p>
                  <div className="mt-1 flex items-center justify-end gap-1 text-xs font-semibold text-yellow-300">
                    <Star size={13} className="fill-yellow-400 text-yellow-400" />
                    <span>{Number(viewingProduct.rating || 0).toFixed(1)} / 5.0</span>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="rounded-xl border border-[#222] bg-[#111] p-4">
                <p className="text-xs uppercase tracking-wider text-gray-500 font-semibold">
                  Olfactory Notes & Description
                </p>
                <p className="mt-2 text-sm leading-relaxed text-gray-300">
                  {viewingProduct.description ||
                    "No description provided for this fragrance item."}
                </p>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    const p = viewingProduct;
                    setViewingProduct(null);
                    openEditForm(p);
                  }}
                  className="inline-flex items-center gap-2 rounded-xl bg-lime-400 px-4 py-2 text-sm font-semibold text-black transition hover:bg-lime-300"
                >
                  <Pencil size={15} />
                  <span>Edit Fragrance</span>
                </button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* ==================================================
          8. DELETE CONFIRMATION DIALOG
      ================================================== */}
      <Dialog
        open={Boolean(deleteProductTarget)}
        onOpenChange={(open) => {
          if (!open) setDeleteProductTarget(null);
        }}
      >
        <DialogContent className="border-[#222] bg-[#0b0b0b] text-white sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-white">
              Delete This Product?
            </DialogTitle>
          </DialogHeader>

          <div className="mt-3">
            <p className="text-sm text-gray-400">
              Are you sure you want to permanently remove{" "}
              <strong className="text-white">
                "{deleteProductTarget?.productName}"
              </strong>{" "}
              from your catalog? This will delete the product record.
            </p>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setDeleteProductTarget(null)}
                disabled={deleteProductMutation.isPending}
                className="rounded-xl border border-[#292929] bg-[#111] px-4 py-2.5 text-sm font-medium text-gray-300 transition hover:bg-[#181818] hover:text-white"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={confirmDelete}
                disabled={deleteProductMutation.isPending}
                className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-500 disabled:opacity-50"
              >
                {deleteProductMutation.isPending ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    <span>Deleting...</span>
                  </>
                ) : (
                  <>
                    <Trash2 size={16} />
                    <span>Delete</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Products;

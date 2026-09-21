import React, { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, Search,  Loader2 } from "lucide-react";
import { toast } from "react-toastify";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

import {
  useCreateProduct,
  useDeleteProduct,
  useProducts,
  useUpdateProduct,
} from "@/hooks/products/useProducts";

import { Card, CardContent } from "@/components/ui/card";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import uploadToCloudinary from "@/utils/uploadToCloudinary";
import Pagination from "@/components/Pagination/Pagination";

const initialForm = {
  productName: "",
  price: "",
  category: "",
  rating: "",
  description: "",
  image: "",
};

const Products = () => {
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [uploadingImage, setUploadingImage] = useState(false);
  const { data: productsResponse, isLoading, isError, error } = useProducts({ page, search });
  const products = productsResponse?.data ?? [];
  const pagination = productsResponse?.pagination;
  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();
  const deleteProduct = useDeleteProduct();
  const isSaving = createProduct.isPending || updateProduct.isPending;
  const isSubmitting = isSaving || uploadingImage;

  useEffect(
    () => () => {
      if (imagePreview.startsWith("blob:")) {
        URL.revokeObjectURL(imagePreview);
      }
    },
    [imagePreview],
  );

  useEffect(() => {
    setPage(1);
  }, [search]);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const openAddForm = () => {
    setEditingId(null);
    setForm(initialForm);
    setSelectedImage(null);
    setImagePreview("");
    setShowForm(true);
  };

  const openEditForm = (product) => {
    setEditingId(product._id);

    setForm({
      productName: product.productName || "",
      price: product.price || "",
      category: product.category || "",
      rating: product.rating || "",
      description: product.description || "",
      image: product.image || "",
    });
    setSelectedImage(null);
    setImagePreview(product.image || "");

    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingId(null);
    setForm(initialForm);
    setSelectedImage(null);
    setImagePreview("");
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
      toast.error("Product name, price and category are required");
      return;
    }

    if (Number(form.price) <= 0) {
      toast.error("Price must be greater than zero");
      return;
    }

    if (!editingId && !form.image) {
      toast.error("Please select an image");
      return;
    }

    const productData = {
      productName: form.productName,
      price: Number(form.price),
      category: form.category,
      rating: form.rating ? Number(form.rating) : 0,
      description: form.description,
      image: form.image,
    };

    const mutation = editingId ? updateProduct : createProduct;
    const variables = editingId
      ? { productId: editingId, productData }
      : productData;

    mutation.mutate(variables, {
      onSuccess: () => {
        toast.success(
          editingId
            ? "Product updated successfully"
            : "Product created successfully",
        );
        closeForm();
        if (!editingId) setPage(1);
      },
      onError: (mutationError) => {
        if (mutationError.response?.status === 401) {
          toast.error("Please login first");
        } else if (mutationError.response?.status === 403) {
          toast.error("Admin access required");
        } else {
          toast.error(
            mutationError.response?.data?.message || "Something went wrong",
          );
        }
      },
    });
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this product?",
    );

    if (!confirmed) return;

    deleteProduct.mutate(id, {
      onSuccess: () => {
        toast.success("Product deleted successfully");
        setPage(1);
      },
      onError: (mutationError) => {
        if (mutationError.response?.status === 403) {
          toast.error("Admin access required");
        } else {
          toast.error(
            mutationError.response?.data?.message || "Failed to delete product",
          );
        }
      },
    });
  };

  const filteredProducts = products;

  return (
    <div className=" space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-2xl font-bold">Products</h2>
          <p className="text-sm text-gray-500">Manage your perfume products</p>
        </div>

        <Button
          onClick={openAddForm}
          disabled={isLoading}
          className="bg-lime-400 text-black hover:bg-lime-300 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isLoading ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              Loading...
            </>
          ) : (
            <>
              <Plus size={18} />
              Add Product
            </>
          )}
        </Button>
      </div>

      <div className="relative">
        <Search
          size={18}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
        />

        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          disabled={isLoading}
          placeholder="Search products..."
          className="border-white/10 bg-white/5 pl-10 text-white placeholder:text-gray-600 disabled:cursor-not-allowed disabled:opacity-50"
        />
      </div>

      {showForm && (
        <Dialog open={showForm} onOpenChange={(open) => !open && closeForm()}>
          <DialogContent className="w-[40vw] max-w-none sm:max-w-none md:max-w-none lg:max-w-none xl:max-w-none
             border border-white/10 bg-[#111] px-8 py-6 text-white">
            <DialogHeader>
              <DialogTitle className="font-serif text-2xl font-medium tracking-wide text-white">
                {editingId ? "Edit Product" : "Add Product"}
              </DialogTitle>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-sm text-gray-400">
                    Product Name
                  </label>

                  <Input
                    name="productName"
                    value={form.productName}
                    onChange={handleChange}
                    placeholder="Enter product name"
                    className="border-white/10 bg-black text-white"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm text-gray-400">
                    Price
                  </label>

                  <Input
                    name="price"
                    type="number"
                    value={form.price}
                    onChange={handleChange}
                    placeholder="Enter price"
                    className="border-white/10 bg-black text-white"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm text-gray-400">
                    Category
                  </label>

                  <Input
                    name="category"
                    value={form.category}
                    onChange={handleChange}
                    placeholder="e.g. Men, Women, Unisex"
                    className="border-white/10 bg-black text-white"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm text-gray-400">
                    Rating
                  </label>

                  <Input
                    name="rating"
                    type="number"
                    step="0.1"
                    min="0"
                    max="5"
                    value={form.rating}
                    onChange={handleChange}
                    placeholder="0 - 5"
                    className="border-white/10 bg-black text-white"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-sm text-gray-400">
                  Product Image
                </label>

                <div className="rounded-md border border-dashed border-white/15 bg-black p-4">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                    <div className="flex size-20 min-h-20 min-w-20 max-h-20 max-w-20 shrink-0 aspect-square items-center justify-center overflow-hidden rounded-md bg-white/5 text-center text-xs text-gray-500">
                      {imagePreview ? (
                        <img
                          src={imagePreview}
                          alt="Product preview"
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        "No image selected"
                      )}
                    </div>

                    <div className="min-w-0 space-y-2">
                      <Input
                        name="image"
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        disabled={uploadingImage || isSaving}
                        className="border-white/10 bg-black text-white file:mr-3 file:border-0 file:bg-lime-400 file:px-3 file:py-1 file:text-sm file:font-medium file:text-black"
                      />
                      <p className="text-xs text-gray-500">
                        {uploadingImage
                          ? "Uploading image to Cloudinary..."
                          : selectedImage
                            ? "Image selected"
                            : "PNG, JPG, WEBP, or GIF up to 5 MB"}
                      </p>
                      {editingId && !uploadingImage && (
                        <p className="text-xs text-gray-500">
                          Leave unchanged to keep the current image.
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-sm text-gray-400">
                  Description
                </label>

                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  placeholder="Enter product description..."
                  rows={4}
                  className="w-full resize-none rounded-md border border-white/10 bg-black p-3 text-sm text-white outline-none placeholder:text-gray-600 focus:border-lime-400"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={closeForm}
                  disabled={isSubmitting}
                  className="border-white/10 bg-transparent text-white hover:bg-white/5"
                >
                  Cancel
                </Button>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-lime-400 text-black hover:bg-lime-300"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 size={17} className="mr-2 animate-spin" />
                      {uploadingImage
                        ? "Uploading image..."
                        : editingId
                          ? "Updating..."
                          : "Creating..."}
                    </>
                  ) : editingId ? (
                    "Update Product"
                  ) : (
                    "Create Product"
                  )}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      )}

      <Card className="border-white/10 bg-white/5 text-white">
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex min-h-[300px] flex-col items-center justify-center gap-4">
              <div className="relative flex h-16 w-16 items-center justify-center">
                <div className="absolute inset-0 rounded-full border-4 border-white/10" />

                <div className="absolute inset-0 animate-spin rounded-full border-4 border-transparent border-t-lime-400" />

                <Loader2 size={24} className="animate-spin text-lime-400" />
              </div>

              <div className="text-center">
                <p className="font-medium text-white">Loading products</p>

                <p className="mt-1 text-sm text-gray-500">
                  Please wait while we fetch your products...
                </p>
              </div>

              <div className="flex gap-1">
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-lime-400" />
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-lime-400 [animation-delay:150ms]" />
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-lime-400 [animation-delay:300ms]" />
              </div>
            </div>
          ) : isError ? (
            <div className="p-8 text-center text-red-400">
              {error.response?.data?.message || "Failed to fetch products"}
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              No products found
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-white/10">
                  <tr className="text-left text-sm text-gray-400">
                    <th className="px-5 py-4">Product</th>
                    <th className="px-5 py-4">Category</th>
                    <th className="px-5 py-4">Price</th>
                    <th className="px-5 py-4">Rating</th>
                    <th className="px-5 py-4 text-right">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredProducts.map((product) => (
                    <tr key={product._id} className="border-b border-white/5">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          {product.image ? (
                            <img
                              src={product.image}
                              alt={product.productName}
                              className="h-12 w-12 rounded-lg object-cover"
                            />
                          ) : (
                            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-white/5 text-xs text-gray-500">
                              No image
                            </div>
                          )}

                          <span className="font-medium">
                            {product.productName}
                          </span>
                        </div>
                      </td>

                      <td className="px-5 py-4 text-gray-400">
                        {product.category}
                      </td>

                      <td className="px-5 py-4">₹{product.price}</td>

                      <td className="px-5 py-4 text-lime-400">
                        {product.rating || 0}
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex justify-end gap-2">
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => openEditForm(product)}
                            className="text-gray-400 hover:bg-white/5 hover:text-white"
                          >
                            <Pencil size={17} />
                          </Button>

                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => handleDelete(product._id)}
                            disabled={deleteProduct.isPending}
                            className="text-red-400 hover:bg-red-500/10 hover:text-red-300"
                          >
                            <Trash2 size={17} />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      <Pagination pagination={pagination} onPageChange={setPage} />
    </div>
  );
};

export default Products;

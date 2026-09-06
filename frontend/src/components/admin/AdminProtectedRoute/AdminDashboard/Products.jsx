import React, { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, Search, X } from "lucide-react";
import { toast } from "react-toastify";

import api from "../../../../api/client"

import { Card, CardContent, } from "@/components/ui/card";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const initialForm = {
  productName: "",
  price: "",
  category: "",
  rating: "",
  description: "",
  image: "",
};

const Products = () => {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);

  const fetchProducts = async () => {
    try {
      setLoading(true);

      const response = await api.get("/products/all");
      const productList = Array.isArray(response.data)
        ? response.data
        : response.data.data ?? response.data.products ?? [];

      setProducts(productList);
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const openAddForm = () => {
    setEditingId(null);
    setForm(initialForm);
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

    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingId(null);
    setForm(initialForm);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.productName || !form.price || !form.category) {
      toast.error("Product name, price and category are required");
      return;
    }

    try {
      setSaving(true);

      const data = {
        productName: form.productName,
        price: Number(form.price),
        category: form.category,
        rating: form.rating ? Number(form.rating) : 0,
        description: form.description,
        image: form.image,
      };

      if (editingId) {
        const response = await api.patch(
          `/products/${editingId}`,
          data
        );

        if (response.data.success) {
          toast.success("Product updated successfully");

          setProducts((prev) =>
            prev.map((product) =>
              product._id === editingId
                ? response.data.data
                : product
            )
          );
        }
      } else {
        const response = await api.post("/products", data);

        if (response.data.success) {
          toast.success("Product created successfully");

          setProducts((prev) => [
            response.data.data,
            ...prev,
          ]);
        }
      }

      closeForm();
    } catch (error) {
      console.error(error);

      if (error.response?.status === 401) {
        toast.error("Please login first");
      } else if (error.response?.status === 403) {
        toast.error("Admin access required");
      } else {
        toast.error(
          error.response?.data?.message ||
            "Something went wrong"
        );
      }
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (!confirmed) return;

    try {
      const response = await api.delete(`/products/${id}`);

      if (response.data.success) {
        setProducts((prev) =>
          prev.filter((product) => product._id !== id)
        );

        toast.success("Product deleted successfully");
      }
    } catch (error) {
      console.error(error);

      if (error.response?.status === 403) {
        toast.error("Admin access required");
      } else {
        toast.error(
          error.response?.data?.message ||
            "Failed to delete product"
        );
      }
    }
  };

  const filteredProducts = products.filter((product) =>
    product.productName
      ?.toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div className=" space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-2xl font-bold">Products</h2>
          <p className="text-sm text-gray-500">
            Manage your perfume products
          </p>
        </div>

        <Button
          onClick={openAddForm}
          className="bg-lime-400 text-black hover:bg-lime-300"
        >
          <Plus size={18} />
          Add Product
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
          placeholder="Search products..."
          className="border-white/10 bg-white/5 pl-10 text-white placeholder:text-gray-600"
        />
      </div>

      {showForm && (
        <Card className="border-white/10 bg-white/5 text-white">
          <CardContent className="p-5">
            <div className="mb-5 flex items-center justify-between">
              <h3 className="text-lg font-semibold">
                {editingId ? "Edit Product" : "Add Product"}
              </h3>

              <button
                onClick={closeForm}
                className="text-gray-400 hover:text-white"
              >
                <X size={20} />
              </button>
            </div>

            <form
              onSubmit={handleSubmit}
              className="grid gap-4 md:grid-cols-2"
            >
              <Input
                name="productName"
                value={form.productName}
                onChange={handleChange}
                placeholder="Product name"
                className="border-white/10 bg-black text-white"
              />

              <Input
                name="price"
                type="number"
                value={form.price}
                onChange={handleChange}
                placeholder="Price"
                className="border-white/10 bg-black text-white"
              />

              <Input
                name="category"
                value={form.category}
                onChange={handleChange}
                placeholder="Category"
                className="border-white/10 bg-black text-white"
              />

              <Input
                name="rating"
                type="number"
                step="0.1"
                min="0"
                max="5"
                value={form.rating}
                onChange={handleChange}
                placeholder="Rating"
                className="border-white/10 bg-black text-white"
              />

              <Input
                name="image"
                value={form.image}
                onChange={handleChange}
                placeholder="Image URL"
                className="border-white/10 bg-black text-white md:col-span-2"
              />

              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Description"
                rows="4"
                className="rounded-md border border-white/10 bg-black p-3 text-sm text-white outline-none md:col-span-2"
              />

              <div className="flex gap-3 md:col-span-2">
                <Button
                  type="submit"
                  disabled={saving}
                  className="bg-lime-400 text-black hover:bg-lime-300"
                >
                  {saving
                    ? "Saving..."
                    : editingId
                    ? "Update Product"
                    : "Create Product"}
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  onClick={closeForm}
                  className="border-white/10 bg-transparent text-white hover:bg-white/5"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <Card className="border-white/10 bg-white/5 text-white">
        <CardContent className="p-0">
          {loading ? (
            <div className="p-8 text-center text-gray-500">
              Loading products...
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
                    <tr
                      key={product._id}
                      className="border-b border-white/5"
                    >
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

                      <td className="px-5 py-4">
                        ₹{product.price}
                      </td>

                      <td className="px-5 py-4 text-lime-400">
                        {product.rating || 0}
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex justify-end gap-2">
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() =>
                              openEditForm(product)
                            }
                            className="text-gray-400 hover:bg-white/5 hover:text-white"
                          >
                            <Pencil size={17} />
                          </Button>

                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() =>
                              handleDelete(product._id)
                            }
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
    </div>
  );
};

export default Products;

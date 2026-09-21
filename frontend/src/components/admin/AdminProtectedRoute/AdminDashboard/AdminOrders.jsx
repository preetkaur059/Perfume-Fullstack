import React, { useState } from "react";
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
  CalendarDays,
  Eye,
  CheckCircle,
  Truck,
  Box,
} from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import {
  useAdminOrders,
  useCreateOrder,
  useUpdateOrder,
  useDeleteOrder,
} from "@/hooks/orders/useOrders";

import { useUsers } from "@/hooks/users/useUsers";
import { useProducts } from "@/hooks/products/useProducts";
import Pagination from "@/components/Pagination/Pagination";

const STATUS_OPTIONS = [
  {
    value: "Processing",
    label: "Processing",
  },
  {
    value: "Confirmed",
    label: "Confirmed",
  },
  {
    value: "Shipped",
    label: "Shipped",
  },
  {
    value: "Delivered",
    label: "Delivered",
  },
  {
    value: "Cancelled",
    label: "Cancelled",
  },
];

const Orders = () => {
  const [page, setPage] = useState(1);
  // ===============================
  // ORDERS
  // ===============================

  const {
    data: ordersResponse,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useAdminOrders({ page });
  const orders = ordersResponse?.data ?? [];
  const pagination = ordersResponse?.pagination;

  // ===============================
  // USERS
  // ===============================

  const { data: usersResponse, isLoading: usersLoading } = useUsers({ limit: 100 });
  const users = usersResponse?.data ?? [];

  // ===============================
  // PRODUCTS
  // ===============================

  const { data: productsResponse, isLoading: productsLoading } = useProducts({ limit: 100 });
  const products = productsResponse?.data ?? [];

  // ===============================
  // MUTATIONS
  // ===============================

  const createOrderMutation = useCreateOrder();
  const updateOrderMutation = useUpdateOrder();
  const deleteOrderMutation = useDeleteOrder();

  // ===============================
  // DIALOG STATES
  // ===============================

  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const [editingOrder, setEditingOrder] = useState(null);

  const [viewingOrder, setViewingOrder] = useState(null);

  const [deleteOrder, setDeleteOrder] = useState(null);

  // ===============================
  // CREATE ORDER STATES
  // ===============================

  const [selectedCustomer, setSelectedCustomer] = useState("");

  const [selectedProduct, setSelectedProduct] = useState("");

  const [newItemQuantity, setNewItemQuantity] = useState(1);

  // ===============================
  // FORM DATA
  // ===============================

  const [formData, setFormData] = useState({
    status: "Processing",
    orderItems: [],
  });

  // ===============================
  // OPEN CREATE DIALOG
  // ===============================

  const openCreateDialog = () => {
    setEditingOrder(null);

    setFormData({
      status: "Processing",
      orderItems: [],
    });

    setSelectedCustomer("");
    setSelectedProduct("");
    setNewItemQuantity(1);

    setIsDialogOpen(true);
  };

  // ===============================
  // OPEN EDIT DIALOG
  // ===============================

  const openEditDialog = (order) => {
    setEditingOrder(order);

    setFormData({
      status: order.status || "Processing",

      orderItems:
        order.orderItems?.map((item) => ({
          product: item.product?._id || item.product || "",

          quantity: item.quantity || 1,
        })) || [],
    });

    setSelectedCustomer("");
    setSelectedProduct("");
    setNewItemQuantity(1);

    setIsDialogOpen(true);
  };

  // ===============================
  // CLOSE DIALOG
  // ===============================

  const closeDialog = () => {
    setIsDialogOpen(false);
    setEditingOrder(null);

    setSelectedCustomer("");
    setSelectedProduct("");
    setNewItemQuantity(1);

    setFormData({
      status: "Processing",
      orderItems: [],
    });
  };

  // ===============================
  // ADD PRODUCT TO ORDER
  // ===============================

  const handleAddItem = () => {
    if (!selectedProduct) {
      alert("Please select a product.");
      return;
    }

    const quantity = Number(newItemQuantity);

    if (!Number.isInteger(quantity) || quantity < 1) {
      alert("Quantity must be at least 1.");
      return;
    }

    setFormData((prev) => {
      const existingItem = prev.orderItems.find(
        (item) => item.product === selectedProduct,
      );

      // If product already exists,
      // increase its quantity
      if (existingItem) {
        return {
          ...prev,

          orderItems: prev.orderItems.map((item) =>
            item.product === selectedProduct
              ? {
                  ...item,
                  quantity: item.quantity + quantity,
                }
              : item,
          ),
        };
      }

      // Add new product
      return {
        ...prev,

        orderItems: [
          ...prev.orderItems,
          {
            product: selectedProduct,
            quantity,
          },
        ],
      };
    });

    setSelectedProduct("");
    setNewItemQuantity(1);
  };

  // ===============================
  // REMOVE PRODUCT FROM ORDER
  // ===============================

  const handleRemoveItem = (productId) => {
    setFormData((prev) => ({
      ...prev,

      orderItems: prev.orderItems.filter((item) => item.product !== productId),
    }));
  };

  // ===============================
  // CREATE ORDER
  // ===============================

  const handleCreateOrder = () => {
    if (!selectedCustomer) {
      alert("Please select a customer.");
      return;
    }

    if (formData.orderItems.length === 0) {
      alert("Please add at least one product.");
      return;
    }

    createOrderMutation.mutate(
      {
        user: selectedCustomer,

        orderItems: formData.orderItems,

        status: formData.status,
      },
      {
        onSuccess: async () => {
          closeDialog();
          setPage(1);

          // Make sure latest orders are displayed
          await refetch();
        },
      },
    );
  };

  // ===============================
  // UPDATE ORDER
  // ===============================

  const handleUpdateOrder = () => {
    if (formData.orderItems.length === 0) {
      alert("Order must contain at least one product.");
      return;
    }

    updateOrderMutation.mutate(
      {
        id: editingOrder._id,

        orderItems: formData.orderItems,

        status: formData.status,
      },
      {
        onSuccess: async () => {
          closeDialog();

          await refetch();
        },
      },
    );
  };

  // ===============================
  // SAVE
  // ===============================

  const handleSave = () => {
    if (editingOrder) {
      handleUpdateOrder();
    } else {
      handleCreateOrder();
    }
  };

  // ===============================
  // DELETE ORDER
  // ===============================

  const handleDeleteOrder = (order) => {
    setDeleteOrder(order);
  };
  const confirmDeleteOrder = () => {
    if (!deleteOrder?._id) return;

    deleteOrderMutation.mutate(deleteOrder._id, {
      onSuccess: async () => {
        setDeleteOrder(null);
        setPage(1);
        await refetch();
      },
    });
  };

  // ===============================
  // STATUS ICON
  // ===============================

  const getStatusIcon = (status) => {
    switch (status) {
      case "Confirmed":
        return <CheckCircle size={17} className="text-purple-400" />;

      case "Shipped":
        return <Truck size={17} className="text-blue-400" />;

      case "Delivered":
        return <CheckCircle size={17} className="text-lime-400" />;

      case "Cancelled":
        return <X size={17} className="text-red-400" />;

      case "Processing":
      default:
        return <Box size={17} className="text-yellow-400" />;
    }
  };

  // ===============================
  // STATUS STYLE
  // ===============================

  const getStatusStyle = (status) => {
    switch (status) {
      case "Confirmed":
        return "border-purple-400/20 bg-purple-400/10 text-purple-300";

      case "Shipped":
        return "border-blue-400/20 bg-blue-400/10 text-blue-300";

      case "Delivered":
        return "border-lime-400/20 bg-lime-400/10 text-lime-300";

      case "Cancelled":
        return "border-red-400/20 bg-red-400/10 text-red-300";

      case "Processing":
      default:
        return "border-yellow-400/20 bg-yellow-400/10 text-yellow-300";
    }
  };

  // ===============================
  // GET PRODUCT
  // ===============================

  const getProductById = (productId) => {
    return products.find((product) => product._id === productId);
  };

  // ===============================
  // FORMAT DATE
  // ===============================

  const formatDate = (date) => {
    if (!date) return "N/A";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // ===============================
  // CALCULATE TOTAL
  // ===============================

  const calculateTotal = (order) => {
    return (
      order.orderItems?.reduce((total, item) => {
        const product = item.product;

        const price = Number(product?.price || 0);

        return total + price * Number(item.quantity || 0);
      }, 0) || 0
    );
  };

  // ===============================
  // LOADING
  // ===============================

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center bg-black">
        <Loader2 size={35} className="animate-spin text-lime-400" />
      </div>
    );
  }

  // ===============================
  // ERROR
  // ===============================

  if (isError) {
    return (
      <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-8 text-center">
        <p className="mb-4 text-red-400">
          {error?.response?.data?.message || "Failed to load orders."}
        </p>

        <button
          onClick={() => refetch()}
          className="inline-flex items-center gap-2 rounded-lg bg-lime-400 px-4 py-2 font-semibold text-black hover:bg-lime-300"
        >
          <RefreshCw size={17} />
          Try Again
        </button>
      </div>
    );
  }

  // ===============================
  // MAIN UI
  // ===============================

  return (
    <div className="min-h-screen bg-black p-6 text-white">
      {/* ===============================
          HEADER
      =============================== */}

      <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-2xl font-bold">Orders</h1>

          <p className="mt-1 text-sm text-gray-400">Manage customer orders</p>
        </div>

        <div className="flex gap-3">
          {/* Refresh */}

          <button
            onClick={() => refetch()}
            disabled={isFetching}
            className="inline-flex items-center gap-2 rounded-lg border border-[#222] bg-[#111] px-4 py-2 text-sm font-medium text-gray-300 transition hover:border-lime-400/30 hover:text-lime-300 disabled:opacity-50"
          >
            <RefreshCw size={17} className={isFetching ? "animate-spin" : ""} />
            Refresh
          </button>

          {/* Create */}

          <button
            onClick={openCreateDialog}
            className="inline-flex items-center gap-2 rounded-lg bg-lime-400 px-4 py-2 text-sm font-semibold text-black transition hover:bg-lime-300"
          >
            <Plus size={18} />
            Create Order
          </button>
        </div>
      </div>

      {/* ===============================
          EMPTY STATE
      =============================== */}

      {orders.length === 0 ? (
        <div className="rounded-2xl border border-[#222] bg-[#0b0b0b] p-12 text-center">
          <ShoppingBag size={45} className="mx-auto mb-4 text-gray-600" />

          <h2 className="text-lg font-semibold">No Orders Found</h2>

          <p className="mt-2 text-sm text-gray-500">
            There are no orders available.
          </p>
        </div>
      ) : (
        /* ===============================
           ORDERS GRID
        =============================== */

        <div className="grid gap-5 xl:grid-cols-2">
          {orders.map((order) => {
            const customer = order.user;

            const total = calculateTotal(order);

            return (
              <div
                key={order._id}
                className="rounded-2xl border border-[#222] bg-[#0b0b0b] p-5 transition hover:border-lime-400/20"
              >
                {/* Top */}

                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs uppercase tracking-wider text-gray-500">
                      Order ID
                    </p>

                    <p className="mt-1 font-mono text-sm text-gray-300">
                      #{order._id?.slice(-8)}
                    </p>
                  </div>

                  <div
                    className={`flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold ${getStatusStyle(
                      order.status,
                    )}`}
                  >
                    {getStatusIcon(order.status)}

                    {order.status || "Processing"}
                  </div>
                </div>

                {/* Customer */}

                <div className="mt-5 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#161616]">
                    <User size={18} className="text-lime-400" />
                  </div>

                  <div>
                    <p className="text-sm font-semibold">
                      {customer?.fullName || "Unknown Customer"}
                    </p>

                    <p className="text-xs text-gray-500">
                      {customer?.email || "No email"}
                    </p>
                  </div>
                </div>

                {/* Date + Total */}

                <div className="mt-5 grid grid-cols-2 gap-3">
                  <div className="rounded-xl border border-[#222] bg-[#111] p-3">
                    <div className="mb-1 flex items-center gap-2 text-xs text-gray-500">
                      <CalendarDays size={14} />
                      Date
                    </div>

                    <p className="text-sm font-medium">
                      {formatDate(order.createdAt)}
                    </p>
                  </div>

                  <div className="rounded-xl border border-[#222] bg-[#111] p-3">
                    <div className="mb-1 flex items-center gap-2 text-xs text-gray-500">
                      <Package size={14} />
                      Total
                    </div>

                    <p className="text-sm font-semibold text-lime-300">
                      ₹{total.toLocaleString("en-IN")}
                    </p>
                  </div>
                </div>

                {/* Items Count */}

                <div className="mt-4 flex items-center justify-between text-sm">
                  <span className="text-gray-500">Products</span>

                  <span className="font-medium text-gray-300">
                    {order.orderItems?.length || 0} item
                    {order.orderItems?.length === 1 ? "" : "s"}
                  </span>
                </div>

                {/* Actions */}

                <div className="mt-5 flex flex-wrap gap-2 border-t border-[#222] pt-4">
                  {/* Edit */}

                  <button
                    onClick={() => openEditDialog(order)}
                    className="inline-flex items-center gap-2 rounded-lg border border-[#292929] bg-[#111] px-3 py-2 text-sm text-gray-300 transition hover:border-lime-400/30 hover:text-lime-300"
                  >
                    <Pencil size={16} />
                    Edit
                  </button>

                  {/* View Details */}

                  <button
                    onClick={() => setViewingOrder(order)}
                    className="inline-flex items-center gap-2 rounded-lg border border-[#292929] bg-[#111] px-3 py-2 text-sm text-gray-300 transition hover:border-lime-400/30 hover:text-lime-300"
                  >
                    <Eye size={16} />
                    View Details
                  </button>

                  {/* Delete */}

                  <button
                    onClick={() => handleDeleteOrder(order)}
                    disabled={deleteOrderMutation.isPending}
                    className="ml-auto inline-flex items-center gap-2 rounded-lg border border-red-500/20 bg-red-500/5 px-3 py-2 text-sm text-red-400 transition hover:bg-red-500/10 disabled:opacity-50"
                  >
                    {deleteOrderMutation.isPending ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : (
                      <Trash2 size={16} />
                    )}
                    Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <Pagination pagination={pagination} onPageChange={setPage} />

      {/* ==================================================
          CREATE / EDIT DIALOG
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
            <DialogTitle className="text-xl font-serif tracking-wide">
              {editingOrder ? "Edit Order" : "Create Order"}
            </DialogTitle>
          </DialogHeader>

          <div className="mt-4 space-y-5">
            {/* ==========================================
                CREATE ONLY - CUSTOMER
            ========================================== */}

            {!editingOrder && (
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-300">
                  Customer
                </label>

                <select
                  value={selectedCustomer}
                  onChange={(e) => setSelectedCustomer(e.target.value)}
                  disabled={usersLoading}
                  className="w-full rounded-lg border border-[#292929] bg-[#111] px-3 py-3 text-sm text-white outline-none focus:border-lime-400"
                >
                  <option value="">
                    {usersLoading ? "Loading customers..." : "Select Customer"}
                  </option>

                  {users
                    .filter((user) => !user.isAdmin)
                    .map((user) => (
                      <option key={user._id} value={user._id}>
                        {user.fullName} - {user.email}
                      </option>
                    ))}
                </select>
              </div>
            )}

            {/* ==========================================
                PRODUCT SELECT
            ========================================== */}

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-300">
                Product
              </label>

              <div className="flex gap-2">
                <select
                  value={selectedProduct}
                  onChange={(e) => setSelectedProduct(e.target.value)}
                  disabled={productsLoading}
                  className="min-w-0 flex-1 rounded-lg border border-[#292929] bg-[#111] px-3 py-3 text-sm text-white outline-none focus:border-lime-400"
                >
                  <option value="">
                    {productsLoading ? "Loading products..." : "Select Product"}
                  </option>

                  {products.map((product) => (
                    <option key={product._id} value={product._id}>
                      {product.productName} - ₹{product.price}
                    </option>
                  ))}
                </select>

                {/* Quantity */}

                <input
                  type="number"
                  min="1"
                  value={newItemQuantity}
                  onChange={(e) => setNewItemQuantity(e.target.value)}
                  className="w-24 rounded-lg border border-[#292929] bg-[#111] px-3 py-3 text-sm text-white outline-none focus:border-lime-400"
                />

                <button
                  type="button"
                  onClick={handleAddItem}
                  className="inline-flex items-center gap-2 rounded-lg bg-lime-400 px-4 py-2 font-semibold text-black transition hover:bg-lime-300"
                >
                  <Plus size={18} />
                  Add
                </button>
              </div>

              <p className="mt-2 text-xs text-gray-500">
                Select a product, enter quantity, then click Add.
              </p>
            </div>

            {/* ==========================================
                ORDER ITEMS
            ========================================== */}

            <div>
              <div className="mb-3 flex items-center justify-between">
                <h3 className="text-sm font-semibold">Order Items</h3>

                <span className="text-xs text-gray-500">
                  {formData.orderItems.length} item
                  {formData.orderItems.length === 1 ? "" : "s"}
                </span>
              </div>

              {formData.orderItems.length === 0 ? (
                <div className="rounded-xl border border-dashed border-[#292929] bg-[#111] p-6 text-center">
                  <ShoppingBag
                    size={30}
                    className="mx-auto mb-2 text-gray-600"
                  />

                  <p className="text-sm text-gray-500">
                    No products added yet.
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  {formData.orderItems.map((item) => {
                    const product = getProductById(item.product);

                    return (
                      <div
                        key={item.product}
                        className="flex items-center justify-between gap-3 rounded-xl border border-[#222] bg-[#111] p-3"
                      >
                        <div className="flex min-w-0 items-center gap-3">
                          {/* Image */}

                          <div className="h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-[#181818]">
                            {product?.image ? (
                              <img
                                src={product.image}
                                alt={product.productName}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <div className="flex h-full items-center justify-center">
                                <Package size={18} className="text-gray-600" />
                              </div>
                            )}
                          </div>

                          <div className="min-w-0">
                            <p className="truncate text-sm font-medium">
                              {product?.productName || "Product"}
                            </p>

                            <p className="mt-1 text-xs text-gray-500">
                              ₹{product?.price || 0} × {item.quantity}
                            </p>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleRemoveItem(item.product)}
                          className="shrink-0 rounded-lg p-2 text-red-400 transition hover:bg-red-500/10"
                        >
                          <X size={18} />
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* ==========================================
                STATUS
            ========================================== */}

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-300">
                Status
              </label>

              <select
                value={formData.status}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    status: e.target.value,
                  }))
                }
                className="w-full rounded-lg border border-[#292929] bg-[#111] px-3 py-3 text-sm text-white outline-none focus:border-lime-400"
              >
                {STATUS_OPTIONS.map((status) => (
                  <option key={status.value} value={status.value}>
                    {status.label}
                  </option>
                ))}
              </select>
            </div>

            {/* ==========================================
                BUTTONS
            ========================================== */}

            <div className="flex justify-end gap-3 border-t border-[#222] pt-5">
              <button
                type="button"
                onClick={closeDialog}
                className="rounded-lg border border-[#292929] bg-[#111] px-5 py-2.5 text-sm font-medium text-gray-300 hover:text-white"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleSave}
                disabled={
                  createOrderMutation.isPending || updateOrderMutation.isPending
                }
                className="inline-flex items-center gap-2 rounded-lg bg-lime-400 px-5 py-2.5 text-sm font-semibold text-black transition hover:bg-lime-300 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {createOrderMutation.isPending ||
                updateOrderMutation.isPending ? (
                  <>
                    <Loader2 size={17} className="animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>{editingOrder ? "Update Order" : "Create Order"}</>
                )}
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* ==================================================
          VIEW DETAILS DIALOG
      ================================================== */}

      <Dialog
        open={Boolean(viewingOrder)}
        onOpenChange={(open) => {
          if (!open) {
            setViewingOrder(null);
          }
        }}
      >
        <DialogContent className="max-h-[90vh] overflow-y-auto border-[#222] bg-[#0b0b0b] text-white sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-serif tracking-wide">Order Details</DialogTitle>
          </DialogHeader>

          {viewingOrder && (
            <div className="mt-4 space-y-5">
              {/* Order Info */}

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-xl border border-[#222] bg-[#111] p-4">
                  <p className="text-xs text-gray-500">Order ID</p>

                  <p className="mt-1 font-mono text-sm text-gray-300">
                    #{viewingOrder._id}
                  </p>
                </div>

                <div className="rounded-xl border border-[#222] bg-[#111] p-4">
                  <p className="text-xs text-gray-500">Order Date</p>

                  <p className="mt-1 text-sm text-gray-300">
                    {formatDate(viewingOrder.createdAt)}
                  </p>
                </div>
              </div>

              {/* Customer */}

              <div className="rounded-xl border border-[#222] bg-[#111] p-4">
                <div className="mb-3 flex items-center gap-2">
                  <User size={17} className="text-lime-400" />

                  <h3 className="text-sm font-semibold">Customer</h3>
                </div>

                <p className="text-sm font-medium">
                  {viewingOrder.user?.fullName || "Unknown Customer"}
                </p>

                <p className="mt-1 text-xs text-gray-500">
                  {viewingOrder.user?.email || "No email"}
                </p>
              </div>

              {/* Status */}

              <div className="rounded-xl border border-[#222] bg-[#111] p-4">
                <p className="mb-2 text-xs text-gray-500">Status</p>

                <div
                  className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold ${getStatusStyle(
                    viewingOrder.status,
                  )}`}
                >
                  {getStatusIcon(viewingOrder.status)}

                  {viewingOrder.status || "Processing"}
                </div>
              </div>

              {/* Products */}

              <div>
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="text-sm font-semibold">Products</h3>

                  <span className="text-xs text-gray-500">
                    {viewingOrder.orderItems?.length || 0} items
                  </span>
                </div>

                <div className="space-y-3">
                  {viewingOrder.orderItems?.map((item, index) => {
                    const product = item.product;

                    return (
                      <div
                        key={`${item.product?._id || item.product}-${index}`}
                        className="flex items-center justify-between gap-4 rounded-xl border border-[#222] bg-[#111] p-4"
                      >
                        <div className="flex min-w-0 items-center gap-3">
                          <div className="h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-[#181818]">
                            {product?.image ? (
                              <img
                                src={product.image}
                                alt={product.productName || "Product"}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <div className="flex h-full items-center justify-center">
                                <Package size={20} className="text-gray-600" />
                              </div>
                            )}
                          </div>

                          <div className="min-w-0">
                            <p className="truncate text-sm font-medium">
                              {product?.productName || "Product"}
                            </p>

                            <p className="mt-1 text-xs text-gray-500">
                              Category: {product?.category || "N/A"}
                            </p>

                            <p className="mt-1 text-xs text-gray-500">
                              ₹{product?.price || 0} × {item.quantity}
                            </p>
                          </div>
                        </div>

                        <p className="shrink-0 text-sm font-semibold text-lime-300">
                          ₹
                          {(
                            Number(product?.price || 0) *
                            Number(item.quantity || 0)
                          ).toLocaleString("en-IN")}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Total */}

              <div className="flex items-center justify-between border-t border-[#222] pt-5">
                <span className="font-medium text-gray-400">Total Amount</span>

                <span className="text-xl font-bold text-lime-300">
                  ₹{calculateTotal(viewingOrder).toLocaleString("en-IN")}
                </span>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog
        open={Boolean(deleteOrder)}
        onOpenChange={(open) => {
          if (!open) {
            setDeleteOrder(null);
          }
        }}
      >
        <DialogContent className="border-[#222] bg-[#0b0b0b] text-white sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-serif tracking-wide">Delete This Order?</DialogTitle>
          </DialogHeader>

          <div className="mt-4">
            <p className="text-sm text-gray-400">
              Are you sure you want to delete this order?
            </p>

            <div className="mt-5 flex justify-end gap-3">
              <button
                onClick={() => setDeleteOrder(null)}
                disabled={deleteOrderMutation.isPending}
                className="rounded-lg border border-[#292929] bg-[#111] px-4 py-2 text-sm text-gray-300 hover:text-white"
              >
                Cancel
              </button>

              <button
                onClick={confirmDeleteOrder}
                disabled={deleteOrderMutation.isPending}
                className="inline-flex items-center gap-2 rounded-lg bg-red-500 px-4 py-2 text-sm font-semibold text-white hover:bg-red-400 disabled:opacity-50"
              >
                {deleteOrderMutation.isPending ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 size={16} />
                    Delete
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

export default Orders;

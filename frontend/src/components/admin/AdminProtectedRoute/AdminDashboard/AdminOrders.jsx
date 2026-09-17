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
  ChevronDown,
  Eye
} from "lucide-react";

import {
  useOrders,
  useCreateOrder,
  useUpdateOrder,
  useDeleteOrder,
} from "@/hooks/orders/useOrders";


const STATUS_OPTIONS = [
  "Processing",
  "Confirmed",
  "Shipped",
  "Delivered",
  "Cancelled",
];

const Orders = () => {
  const {
    data: orders = [],
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useOrders();
  
  const createOrderMutation = useCreateOrder();
  const updateOrderMutation = useUpdateOrder();
  const deleteOrderMutation = useDeleteOrder();
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingOrder, setEditingOrder] = useState(null);
  const [viewingOrder, setViewingOrder] = useState(null);

  const openViewDialog = (order) => {
  setViewingOrder(order);
};

const closeViewDialog = () => {
  setViewingOrder(null);
};

  const [formData, setFormData] = useState({
    status: "Processing",
    orderItems: [],
  });

  const openCreateDialog = () => {
    setEditingOrder(null);

    setFormData({
      status: "Processing",
      orderItems: [],
    });

    setIsDialogOpen(true);
  };

  const openEditDialog = (order) => {
    setEditingOrder(order);

    setFormData({
      status: order.status || "Processing",

      orderItems: order.orderItems.map((item) => ({
        product:
          item.product?._id ||
          item.product ||
          "",

        quantity: item.quantity || 1,
      })),
    });

    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    if (
      updateOrderMutation.isPending ||
      createOrderMutation.isPending
    ) {
      return;
    }

    setIsDialogOpen(false);
  };

  const handleStatusChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      status: e.target.value,
    }));
  };

  const handleQuantityChange = (index, value) => {
    setFormData((prev) => ({
      ...prev,

      orderItems: prev.orderItems.map((item, i) =>
        i === index
          ? {
              ...item,
              quantity: Math.max(
                1,
                Number(value) || 1
              ),
            }
          : item
      ),
    }));
  };

  const handleRemoveItem = (index) => {
    setFormData((prev) => ({
      ...prev,

      orderItems: prev.orderItems.filter(
        (_, i) => i !== index
      ),
    }));
  };

  const handleSave = () => {
    if (!editingOrder) {
      return;
    }

    if (formData.orderItems.length === 0) {
      alert("Order must contain at least one item.");
      return;
    }

    updateOrderMutation.mutate(
      {
        id: editingOrder._id,
        orderItems: formData.orderItems,
        status: formData.status,
      },
      {
        onSuccess: () => {
          setIsDialogOpen(false);
        },
      }
    );
  };

  const handleDelete = (orderId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this order?"
    );

    if (!confirmed) return;

    deleteOrderMutation.mutate(orderId);
  };

  const calculateTotal = (items = []) => {
    return items.reduce((total, item) => {
      const price = Number(item.product?.price || 0);
      const quantity = Number(item.quantity || 0);

      return total + price * quantity;
    }, 0);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "Delivered":
        return "bg-lime-400/10 text-lime-400 border-lime-400/20";

      case "Shipped":
        return "bg-blue-400/10 text-blue-400 border-blue-400/20";

      case "Confirmed":
        return "bg-purple-400/10 text-purple-400 border-purple-400/20";

      case "Cancelled":
        return "bg-red-400/10 text-red-400 border-red-400/20";

      default:
        return "bg-yellow-400/10 text-yellow-400 border-yellow-400/20";
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-lime-400 animate-spin" />

          <p className="text-gray-500 text-sm">
            Loading orders...
          </p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center px-4">
        <div className="text-center bg-[#111] border border-[#222] rounded-2xl p-8">
          <p className="text-red-400 mb-5">
            {error?.response?.data?.message ||
              "Failed to load orders."}
          </p>

          <button
            onClick={() => refetch()}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-lime-400 text-black font-semibold hover:bg-lime-300 transition"
          >
            <RefreshCw size={17} />
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const totalItems = orders.reduce(
    (total, order) =>
      total +
      (order.orderItems || []).reduce(
        (sum, item) =>
          sum + Number(item.quantity || 0),
        0
      ),
    0
  );

  const totalSales = orders.reduce(
    (total, order) =>
      total +
      calculateTotal(order.orderItems),
    0
  );

  return (
    <div className="min-h-screen bg-black text-white p-4 md:p-6 lg:p-8">

      {/* HEADER */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5 mb-8">

        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-lime-400/10 border border-lime-400/20 flex items-center justify-center">
            <Package
              size={24}
              className="text-lime-400"
            />
          </div>

          <div>
            <h1 className="text-2xl md:text-3xl font-semibold">
              Orders
            </h1>

            <p className="text-sm text-gray-500 mt-1">
              Manage and track customer orders
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">

          <button
            onClick={() => refetch()}
            disabled={isFetching}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#111] border border-[#222] text-gray-300 hover:text-lime-400 hover:border-lime-400/30 transition disabled:opacity-50"
          >
            <RefreshCw
              size={17}
              className={
                isFetching
                  ? "animate-spin"
                  : ""
              }
            />

            Refresh
          </button>

          <button
            onClick={openCreateDialog}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-lime-400 text-black font-semibold hover:bg-lime-300 transition"
          >
            <Plus size={18} />
            Create Order
          </button>

        </div>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">

        <div className="relative overflow-hidden bg-[#111] border border-[#222] rounded-2xl p-5">
          <div className="absolute -right-6 -top-6 w-24 h-24 bg-lime-400/5 rounded-full" />

          <p className="text-xs uppercase tracking-wider text-gray-500">
            Total Orders
          </p>

          <p className="text-3xl font-semibold mt-2">
            {orders.length}
          </p>
        </div>

        <div className="relative overflow-hidden bg-[#111] border border-[#222] rounded-2xl p-5">
          <div className="absolute -right-6 -top-6 w-24 h-24 bg-lime-400/5 rounded-full" />

          <p className="text-xs uppercase tracking-wider text-gray-500">
            Total Items
          </p>

          <p className="text-3xl font-semibold mt-2">
            {totalItems}
          </p>
        </div>

        <div className="relative overflow-hidden bg-[#111] border border-[#222] rounded-2xl p-5">
          <div className="absolute -right-6 -top-6 w-24 h-24 bg-lime-400/5 rounded-full" />

          <p className="text-xs uppercase tracking-wider text-gray-500">
            Total Sales
          </p>

          <p className="text-3xl font-semibold text-lime-400 mt-2">
            ₹{totalSales.toLocaleString("en-IN")}
          </p>
        </div>

      </div>

      {/* EMPTY */}
      {orders.length === 0 ? (
        <div className="bg-[#111] border border-[#222] rounded-2xl py-24 flex flex-col items-center justify-center">

          <div className="w-16 h-16 rounded-2xl bg-black border border-[#222] flex items-center justify-center mb-5">
            <ShoppingBag
              size={28}
              className="text-gray-600"
            />
          </div>

          <h2 className="text-lg font-semibold text-gray-300">
            No orders yet
          </h2>

          <p className="text-sm text-gray-500 mt-2">
            Customer orders will appear here.
          </p>

          <button
            onClick={openCreateDialog}
            className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 bg-lime-400 text-black rounded-xl font-semibold hover:bg-lime-300 transition"
          >
            <Plus size={18} />
            Create Order
          </button>

        </div>
      ) : (

        /* ORDER LIST */
        <div className="space-y-5">

          {orders.map((order) => {

            const total = calculateTotal(
              order.orderItems
            );

            return (
              <div
                key={order._id}
                className="group bg-[#111] border border-[#222] rounded-2xl overflow-hidden hover:border-lime-400/20 transition-all duration-300"
              >

                {/* ORDER TOP */}
                <div className="p-5 border-b border-[#222]">

                  <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-5">

                    <div className="flex items-start gap-4">

                      <div className="w-11 h-11 rounded-xl bg-black border border-[#222] flex items-center justify-center shrink-0">
                        <Package
                          size={20}
                          className="text-lime-400"
                        />
                      </div>

                      <div>

                        <div className="flex flex-wrap items-center gap-2">

                          <span className="text-xs uppercase tracking-wider text-gray-500">
                            Order ID
                          </span>

                          <span className="font-mono text-sm text-lime-300 bg-lime-400/5 px-2 py-1 rounded-md">
                            #{order._id}
                          </span>

                        </div>

                        <div className="flex flex-wrap items-center gap-4 mt-2 text-xs text-gray-500">

                          <span className="flex items-center gap-1.5">
                            <CalendarDays size={14} />
                            {formatDate(order.createdAt)}
                          </span>

                          <span className="flex items-center gap-1.5">
                            <User size={14} />
                            {order.user?.fullName ||
                              "Unknown User"}
                          </span>

                        </div>

                      </div>

                    </div>

                    <div className="flex items-center gap-3">

                      <span
                        className={`px-3 py-1.5 rounded-full border text-xs font-medium ${getStatusClass(
                          order.status
                        )}`}
                      >
                        {order.status ||
                          "Processing"}
                      </span>

                      <div className="h-9 w-px bg-[#222]" />

                      <div className="text-right">
                        <p className="text-xs text-gray-500">
                          Order Total
                        </p>

                        <p className="text-xl font-semibold text-lime-400">
                          ₹
                          {total.toLocaleString(
                            "en-IN"
                          )}
                        </p>
                      </div>

                      <button
                        onClick={() =>
                          openEditDialog(order)
                        }
                        className="w-10 h-10 rounded-xl border border-[#222] bg-black flex items-center justify-center text-gray-400 hover:text-lime-400 hover:border-lime-400/30 transition"
                        title="Edit Order"
                      >
                        <Pencil size={17} />
                      </button>

                      <button
                        onClick={() =>
                          handleDelete(order._id)
                        }
                        disabled={
                          deleteOrderMutation.isPending
                        }
                        className="w-10 h-10 rounded-xl border border-red-500/20 bg-black flex items-center justify-center text-red-400 hover:bg-red-500/10 hover:border-red-500/40 transition disabled:opacity-50"
                        title="Delete Order"
                      >
                        {deleteOrderMutation.isPending ? (
                          <Loader2
                            size={17}
                            className="animate-spin"
                          />
                        ) : (
                          <Trash2 size={17} />
                        )}
                      </button>

                    </div>

                  </div>
                </div>

                {/* CUSTOMER */}
                <div className="px-5 py-4 bg-black/30 border-b border-[#222]">

                  <p className="text-[11px] uppercase tracking-widest text-gray-600 mb-2">
                    Customer
                  </p>

                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">

                    <p className="text-sm font-medium text-gray-200">
                      {order.user?.fullName ||
                        "Unknown User"}
                    </p>

                    <p className="text-xs text-gray-500">
                      {order.user?.email ||
                        "No email"}
                    </p>

                  </div>

                </div>

                {/* ITEMS */}
                <div className="p-5">

                  <div className="flex items-center justify-between mb-4">

                    <p className="text-[11px] uppercase tracking-widest text-gray-600">
                      Order Items
                    </p>

                    <span className="text-xs text-gray-500">
                      {order.orderItems.length}{" "}
                      {order.orderItems.length === 1
                        ? "Product"
                        : "Products"}
                    </span>

                  </div>

                  <div className="grid gap-3">

                    {order.orderItems.map(
                      (item, index) => {

                        const product =
                          item.product;

                        const itemTotal =
                          Number(
                            product?.price || 0
                          ) *
                          Number(
                            item.quantity || 0
                          );

                        return (
                          <div
                            key={`${order._id}-${index}`}
                            className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-black border border-[#222] rounded-xl p-3 hover:border-[#333] transition"
                          >

                            <div className="flex items-center gap-3 min-w-0">

                              {product?.image ? (
                                <img
                                  src={product.image}
                                  alt={
                                    product.productName ||
                                    "Product"
                                  }
                                  className="w-16 h-16 rounded-xl object-cover border border-[#222]"
                                />
                              ) : (
                                <div className="w-16 h-16 rounded-xl bg-[#151515] border border-[#222] flex items-center justify-center">
                                  <Package
                                    size={20}
                                    className="text-gray-600"
                                  />
                                </div>
                              )}

                              <div className="min-w-0">

                                <p className="text-sm font-medium text-gray-200 truncate">
                                  {product?.productName ||
                                    "Product unavailable"}
                                </p>

                                <p className="text-xs text-gray-500 mt-1">
                                  {product?.category ||
                                    "N/A"}
                                </p>

                                <p className="text-xs text-gray-600 mt-1">
                                  Qty:{" "}
                                  {item.quantity}
                                </p>

                              </div>

                            </div>

                            <div className="text-left sm:text-right">

                              <p className="text-xs text-gray-500">
                                ₹
                                {Number(
                                  product?.price || 0
                                ).toLocaleString(
                                  "en-IN"
                                )}{" "}
                                × {item.quantity}
                              </p>

                              <p className="text-base font-semibold text-lime-400 mt-1">
                                ₹
                                {itemTotal.toLocaleString(
                                  "en-IN"
                                )}
                              </p>

                            </div>

                          </div>
                        );
                      }
                    )}

                  </div>

                </div> 

              </div>
            );
          })}

        </div>
      )}

      {/* EDIT DIALOG */}
      {isDialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">

          <div
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={closeDialog}
          />

          <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-[#111] border border-[#2a2a2a] rounded-2xl shadow-2xl">

            {/* DIALOG HEADER */}
            <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-5 bg-[#111] border-b border-[#222]">

              <div>
                <h2 className="text-xl font-semibold">
                  {editingOrder
                    ? "Edit Order"
                    : "Create Order"}
                </h2>

                <p className="text-xs text-gray-500 mt-1">
                  {editingOrder
                    ? `Order #${editingOrder._id}`
                    : "Create a new customer order"}
                </p>
              </div>

              <button
                onClick={closeDialog}
                className="w-9 h-9 rounded-lg flex items-center justify-center text-gray-400 hover:text-white hover:bg-black transition"
              >
                <X size={19} />
              </button>

            </div>

            {/* DIALOG BODY */}
            <div className="p-6">

              {editingOrder && (
                <>

                  {/* STATUS */}
                  <div className="mb-6">

                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Order Status
                    </label>

                    <div className="relative">

                      <select
                        value={formData.status}
                        onChange={
                          handleStatusChange
                        }
                        className="w-full appearance-none bg-black border border-[#2a2a2a] rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-lime-400 transition"
                      >
                        {STATUS_OPTIONS.map(
                          (status) => (
                            <option
                              key={status}
                              value={status}
                              className="bg-black"
                            >
                              {status}
                            </option>
                          )
                        )}
                      </select>

                      <ChevronDown
                        size={17}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
                      />

                    </div>

                  </div>

                  {/* PRODUCTS */}
                  <div>

                    <div className="flex items-center justify-between mb-3">

                      <label className="text-sm font-medium text-gray-300">
                        Order Items
                      </label>

                      <span className="text-xs text-gray-500">
                        {formData.orderItems.length} items
                      </span>

                    </div>

                    <div className="space-y-3">

                      {formData.orderItems.map(
                        (item, index) => {

                          const product =
                            editingOrder.orderItems[
                              index
                            ]?.product;

                          return (
                            <div
                              key={index}
                              className="flex items-center gap-3 bg-black border border-[#222] rounded-xl p-3"
                            >

                              {product?.image && (
                                <img
                                  src={product.image}
                                  alt=""
                                  className="w-12 h-12 rounded-lg object-cover"
                                />
                              )}

                              <div className="flex-1 min-w-0">

                                <p className="text-sm text-gray-200 truncate">
                                  {product?.productName ||
                                    "Product"}
                                </p>

                                <p className="text-xs text-gray-600 mt-1">
                                  Product ID:{" "}
                                  {product?._id}
                                </p>

                              </div>

                              <input
                                type="number"
                                min="1"
                                value={
                                  item.quantity
                                }
                                onChange={(e) =>
                                  handleQuantityChange(
                                    index,
                                    e.target.value
                                  )
                                }
                                className="w-20 bg-[#111] border border-[#2a2a2a] rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-lime-400"
                              />

                              <button
                                onClick={() =>
                                  handleRemoveItem(
                                    index
                                  )
                                }
                                className="w-9 h-9 rounded-lg flex items-center justify-center text-red-400 hover:bg-red-500/10"
                              >
                                <Trash2 size={16} />
                              </button>

                            </div>
                          );
                        }
                      )}

                    </div>

                  </div>

                </>
              )}

              {!editingOrder && (
                <div className="text-center py-10">

                  <ShoppingBag
                    size={40}
                    className="mx-auto text-gray-600 mb-4"
                  />

                  <p className="text-gray-400">
                    Create Order requires selecting a
                    customer and products.
                  </p>

                  <p className="text-xs text-gray-600 mt-2">
                    We can add a customer/product
                    selector here next.
                  </p>

                </div>
              )}

            </div>

            {/* FOOTER */}
            <div className="flex justify-end gap-3 px-6 py-4 border-t border-[#222]">

              <button
                onClick={closeDialog}
                className="px-5 py-2.5 rounded-xl bg-black border border-[#2a2a2a] text-gray-400 hover:text-white transition"
              >
                Cancel
              </button>

              {editingOrder && (
                <button
                  onClick={handleSave}
                  disabled={
                    updateOrderMutation.isPending
                  }
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-lime-400 text-black font-semibold hover:bg-lime-300 transition disabled:opacity-50"
                >
                  {updateOrderMutation.isPending && (
                    <Loader2
                      size={17}
                      className="animate-spin"
                    />
                  )}

                  Save Changes
                </button>
              )}

            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;
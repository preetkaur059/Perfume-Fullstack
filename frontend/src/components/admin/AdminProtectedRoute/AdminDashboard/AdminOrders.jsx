import React, { useState, useEffect, useMemo } from "react";
import {
  Package, Trash2, RefreshCw, Loader2, ShoppingBag, Pencil, Plus, X, User, Users, CalendarDays, Eye, CheckCircle, Truck, Box, Search, ArrowUpDown, DollarSign, AlertCircle, Copy, Check, RotateCcw,
} from "lucide-react";
import { toast } from "react-toastify";

import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";

import {
  useAdminOrders,
  useAdminOrderStats,
  useCreateAdminOrder,
  useUpdateOrder,
  useDeleteOrder,
} from "@/hooks/orders/useOrders";

import { useUsers } from "@/hooks/users/useUsers";
import { useProducts } from "@/hooks/products/useProducts";
import Pagination from "@/components/Pagination/Pagination";
import { SidebarTrigger } from "@/components/ui/sidebar";

const STATUS_OPTIONS = [
  { value: "Processing", label: "Processing" },
  { value: "Confirmed", label: "Confirmed" },
  { value: "Shipped", label: "Shipped" },
  { value: "Delivered", label: "Delivered" },
  { value: "Cancelled", label: "Cancelled" },
];

const SORT_OPTIONS = [
  { value: "newest", label: "Newest First" },
  { value: "oldest", label: "Oldest First" },
  { value: "highest_amount", label: "Highest Amount" },
  { value: "lowest_amount", label: "Lowest Amount" },
];

const Orders = () => {
  // ===============================
  // FILTER & PAGINATION STATES
  // ===============================
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [customerFilter, setCustomerFilter] = useState("All");
  const [sortOption, setSortOption] = useState("newest");
  const [copiedId, setCopiedId] = useState(null);

  // Debounce search input (350ms)
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchInput.trim());
      setPage(1);
    }, 350);

    return () => clearTimeout(handler);
  }, [searchInput]);

  // Reset page when filter changes
  const handleStatusChange = (val) => {
    setStatusFilter(val);
    setPage(1);
  };

  const handleCustomerChange = (val) => {
    setCustomerFilter(val);
    setPage(1);
  };

  const handleSortChange = (val) => {
    setSortOption(val);
    setPage(1);
  };

  const handleClearFilters = () => {
    setSearchInput("");
    setDebouncedSearch("");
    setStatusFilter("All");
    setCustomerFilter("All");
    setSortOption("newest");
    setPage(1);
  };

  const isFiltered =
    Boolean(debouncedSearch) ||
    statusFilter !== "All" ||
    customerFilter !== "All" ||
    sortOption !== "newest";

  // ===============================
  // QUERIES
  // ===============================
  const queryParams = useMemo(
    () => ({
      page,
      limit: 10,
      search: debouncedSearch || undefined,
      status: statusFilter !== "All" ? statusFilter : undefined,
      customer: customerFilter !== "All" ? customerFilter : undefined,
      sort: sortOption,
    }),
    [page, debouncedSearch, statusFilter, customerFilter, sortOption]
  );

  const {
    data: ordersResponse,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useAdminOrders(queryParams);

  const orders = ordersResponse?.data ?? [];
  const pagination = ordersResponse?.pagination;

  // Statistics
  const { data: statsResponse, isLoading: statsLoading, refetch: refetchStats } =
    useAdminOrderStats();
  const stats = statsResponse?.data ?? {
    totalOrders: 0,
    totalSales: 0,
    deliveredSales: 0,
    totalCustomers: 0,
    pendingOrders: 0,
    deliveredOrders: 0,
    cancelledOrders: 0,
    averageOrderValue: 0,
  };

  // Customers & Products
  const { data: usersResponse, isLoading: usersLoading } = useUsers({ limit: 100 });
  const users = useMemo(() => usersResponse?.data ?? [], [usersResponse?.data]);

  const { data: productsResponse, isLoading: productsLoading } = useProducts({ limit: 100 });
  const products = useMemo(() => productsResponse?.data ?? [], [productsResponse?.data]);

  // ===============================
  // MUTATIONS
  // ===============================
  const createOrderMutation = useCreateAdminOrder();
  const updateOrderMutation = useUpdateOrder();
  const deleteOrderMutation = useDeleteOrder();

  // ===============================
  // DIALOG STATES
  // ===============================
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingOrder, setEditingOrder] = useState(null);
  const [viewingOrder, setViewingOrder] = useState(null);
  const [deleteOrder, setDeleteOrder] = useState(null);

  // Form states
  const [selectedCustomer, setSelectedCustomer] = useState("");
  const [selectedProduct, setSelectedProduct] = useState("");
  const [newItemQuantity, setNewItemQuantity] = useState(1);
  const [formData, setFormData] = useState({
    status: "Processing",
    orderItems: [],
  });

  // Copy Order ID helper
  const handleCopyOrderId = (id) => {
    if (!id) return;
    navigator.clipboard.writeText(id);
    setCopiedId(id);
    toast.info("Order ID copied to clipboard");
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Refresh all data
  const handleRefresh = async () => {
    await Promise.all([refetch(), refetchStats()]);
  };

  // ===============================
  // DIALOG ACTIONS
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

  const handleAddItem = () => {
    if (!selectedProduct) {
      toast.warning("Please select a product.");
      return;
    }

    const quantity = Number(newItemQuantity);
    if (!Number.isInteger(quantity) || quantity < 1) {
      toast.warning("Quantity must be at least 1.");
      return;
    }

    setFormData((prev) => {
      const existingItem = prev.orderItems.find(
        (item) => item.product === selectedProduct
      );

      if (existingItem) {
        return {
          ...prev,
          orderItems: prev.orderItems.map((item) =>
            item.product === selectedProduct
              ? { ...item, quantity: item.quantity + quantity }
              : item
          ),
        };
      }

      return {
        ...prev,
        orderItems: [
          ...prev.orderItems,
          { product: selectedProduct, quantity },
        ],
      };
    });

    setSelectedProduct("");
    setNewItemQuantity(1);
  };

  const handleRemoveItem = (productId) => {
    setFormData((prev) => ({
      ...prev,
      orderItems: prev.orderItems.filter((item) => item.product !== productId),
    }));
  };

  const handleCreateOrder = () => {
    if (!selectedCustomer) {
      toast.warning("Please select a customer.");
      return;
    }

    if (formData.orderItems.length === 0) {
      toast.warning("Please add at least one product.");
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
          await handleRefresh();
        },
      }
    );
  };

  const handleUpdateOrder = () => {
    if (formData.orderItems.length === 0) {
      toast.warning("Order must contain at least one product.");
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
          await handleRefresh();
        },
      }
    );
  };

  const handleSave = () => {
    if (editingOrder) {
      handleUpdateOrder();
    } else {
      handleCreateOrder();
    }
  };

  const handleDeleteOrder = (order) => {
    setDeleteOrder(order);
  };

  const confirmDeleteOrder = () => {
    if (!deleteOrder?._id) return;

    deleteOrderMutation.mutate(deleteOrder._id, {
      onSuccess: async () => {
        setDeleteOrder(null);
        await handleRefresh();
      },
    });
  };

  // ===============================
  // HELPERS
  // ===============================
  const getProductById = (productId) => {
    return products.find((product) => product._id === productId);
  };

  const formatDate = (date) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const calculateTotal = (order) => {
    if (!order) return 0;
    if (typeof order.totalAmount === "number" && order.totalAmount > 0) {
      return order.totalAmount;
    }
    return (
      order.orderItems?.reduce((total, item) => {
        const product = item.product;
        const price = Number(product?.price || 0);
        return total + price * Number(item.quantity || 0);
      }, 0) || 0
    );
  };

  const calculateFormTotal = () => {
    return formData.orderItems.reduce((acc, item) => {
      const prod = getProductById(item.product);
      return acc + (Number(prod?.price) || 0) * Number(item.quantity || 1);
    }, 0);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Confirmed":
        return <CheckCircle size={14} className="text-purple-400" />;
      case "Shipped":
        return <Truck size={14} className="text-blue-400" />;
      case "Delivered":
        return <CheckCircle size={14} className="text-lime-400" />;
      case "Cancelled":
        return <X size={14} className="text-red-400" />;
      case "Processing":
      default:
        return <Box size={14} className="text-yellow-400" />;
    }
  };

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

  // Customers filtered to exclude admin accounts for order assignment
  const customerList = useMemo(
    () => users.filter((u) => !u.isAdmin),
    [users]
  );

  return (
    <div className="min-h-screen bg-black p-4 text-white sm:p-6 lg:p-8">
      {/* ==================================================
          1. HEADER SECTION
      ================================================== */}
      <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <div className="flex items-center gap-3">
            <SidebarTrigger className="h-9 w-9 rounded-xl border border-[#222] bg-[#111] text-gray-400 hover:border-lime-400/40 hover:text-lime-300 transition" />
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
                  Admin Orders
                </h1>
                <span className="rounded-full border border-lime-400/30 bg-lime-400/10 px-2.5 py-0.5 text-xs font-semibold text-lime-300">
                  Management Dashboard
                </span>
              </div>
              <p className="mt-1 text-sm text-gray-400">
                Monitor, inspect, and fulfill all customer orders across the platform.
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
            title="Refresh order data"
          >
            <RefreshCw
              size={16}
              className={isFetching || statsLoading ? "animate-spin text-lime-400" : ""}
            />
            <span>Refresh</span>
          </button>

          <button
            type="button"
            onClick={openCreateDialog}
            className="inline-flex items-center gap-2 rounded-xl bg-lime-400 px-4 py-2.5 text-sm font-semibold text-black shadow-lg shadow-lime-400/10 transition hover:bg-lime-300 hover:shadow-lime-400/20 active:scale-95"
          >
            <Plus size={18} />
            <span>Create Order</span>
          </button>
        </div>
      </div>

      {/* ==================================================
          2. STATISTICS / SALES SECTION
      ================================================== */}
      <div className="mb-6 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-6">
        {/* Total Sales */}
        <div className="rounded-2xl border border-[#222] bg-[#0b0b0b] p-4 transition-all hover:border-lime-400/30">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">
              Total Sales
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-lime-400/10 text-lime-400">
              <DollarSign size={16} />
            </div>
          </div>
          <p className="mt-2 text-xl font-bold tracking-tight text-lime-300 sm:text-2xl">
            ₹{stats.totalSales.toLocaleString("en-IN")}
          </p>
          <p className="mt-1 text-xs text-gray-500">
            Delivered: ₹{stats.deliveredSales.toLocaleString("en-IN")}
          </p>
        </div>

        {/* Total Orders */}
        <div className="rounded-2xl border border-[#222] bg-[#0b0b0b] p-4 transition-all hover:border-lime-400/30">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">
              Total Orders
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#181818] text-gray-300">
              <ShoppingBag size={16} />
            </div>
          </div>
          <p className="mt-2 text-xl font-bold text-white sm:text-2xl">
            {stats.totalOrders}
          </p>
          <p className="mt-1 text-xs text-gray-500">All registered orders</p>
        </div>

        {/* Total Customers */}
        <div className="rounded-2xl border border-[#222] bg-[#0b0b0b] p-4 transition-all hover:border-lime-400/30">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">
              Customers
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#181818] text-purple-400">
              <Users size={16} />
            </div>
          </div>
          <p className="mt-2 text-xl font-bold text-white sm:text-2xl">
            {stats.totalCustomers}
          </p>
          <p className="mt-1 text-xs text-gray-500">Registered users</p>
        </div>

        {/* Pending Orders */}
        <div className="rounded-2xl border border-[#222] bg-[#0b0b0b] p-4 transition-all hover:border-lime-400/30">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">
              Pending Orders
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-yellow-400/10 text-yellow-400">
              <Box size={16} />
            </div>
          </div>
          <p className="mt-2 text-xl font-bold text-yellow-300 sm:text-2xl">
            {stats.pendingOrders}
          </p>
          <p className="mt-1 text-xs text-gray-500">Processing / Shipped</p>
        </div>

        {/* Delivered Orders */}
        <div className="rounded-2xl border border-[#222] bg-[#0b0b0b] p-4 transition-all hover:border-lime-400/30">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">
              Delivered
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-lime-400/10 text-lime-400">
              <CheckCircle size={16} />
            </div>
          </div>
          <p className="mt-2 text-xl font-bold text-lime-300 sm:text-2xl">
            {stats.deliveredOrders}
          </p>
          <p className="mt-1 text-xs text-gray-500">Completed shipments</p>
        </div>

        {/* Cancelled Orders */}
        <div className="rounded-2xl border border-[#222] bg-[#0b0b0b] p-4 transition-all hover:border-lime-400/30">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">
              Cancelled
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-400/10 text-red-400">
              <X size={16} />
            </div>
          </div>
          <p className="mt-2 text-xl font-bold text-red-400 sm:text-2xl">
            {stats.cancelledOrders}
          </p>
          <p className="mt-1 text-xs text-gray-500">Voided orders</p>
        </div>
      </div>

      {/* ==================================================
          3. SEARCH & FILTERS BAR
      ================================================== */}
      <div className="mb-4 rounded-2xl border border-[#222] bg-[#0b0b0b] p-4">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-12 lg:items-center">
          {/* Search Input */}
          <div className="relative sm:col-span-2 lg:col-span-4">
            <Search
              size={16}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
            />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search by customer, email, or order ID..."
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

          {/* Status Filter */}
          <div className="lg:col-span-3">
            <select
              value={statusFilter}
              onChange={(e) => handleStatusChange(e.target.value)}
              className="w-full rounded-xl border border-[#292929] bg-[#111] px-3 py-2.5 text-sm text-white outline-none transition focus:border-lime-400 focus:ring-1 focus:ring-lime-400/30"
            >
              <option value="All">All Statuses</option>
              {STATUS_OPTIONS.map((status) => (
                <option key={status.value} value={status.value}>
                  {status.label}
                </option>
              ))}
            </select>
          </div>

          {/* Customer Filter */}
          <div className="lg:col-span-3">
            <select
              value={customerFilter}
              onChange={(e) => handleCustomerChange(e.target.value)}
              disabled={usersLoading}
              className="w-full rounded-xl border border-[#292929] bg-[#111] px-3 py-2.5 text-sm text-white outline-none transition focus:border-lime-400 focus:ring-1 focus:ring-lime-400/30"
            >
              <option value="All">
                {usersLoading ? "Loading customers..." : "All Customers"}
              </option>
              {customerList.map((customer) => (
                <option key={customer._id} value={customer._id}>
                  {customer.fullName} ({customer.email})
                </option>
              ))}
            </select>
          </div>

          {/* Sort By */}
          <div className="lg:col-span-2">
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
              {statusFilter !== "All" && (
                <span className="inline-flex items-center gap-1 rounded-md bg-[#181818] px-2 py-0.5 text-gray-300">
                  Status: <strong className="text-white">{statusFilter}</strong>
                </span>
              )}
              {customerFilter !== "All" && (
                <span className="inline-flex items-center gap-1 rounded-md bg-[#181818] px-2 py-0.5 text-gray-300">
                  Customer:{" "}
                  <strong className="text-white">
                    {customerList.find((c) => c._id === customerFilter)?.fullName ||
                      "Selected"}
                  </strong>
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
                {orders.length > 0
                  ? (pagination.page - 1) * pagination.limit + 1
                  : 0}
              </strong>{" "}
              to{" "}
              <strong className="text-white">
                {Math.min(pagination.page * pagination.limit, pagination.total)}
              </strong>{" "}
              of <strong className="text-white">{pagination.total}</strong> orders
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
          5. ORDERS LIST / TABLE LAYOUT
      ================================================== */}
      {isLoading ? (
        <div className="flex min-h-[360px] flex-col items-center justify-center rounded-2xl border border-[#222] bg-[#0b0b0b] p-12">
          <Loader2 size={36} className="animate-spin text-lime-400" />
          <p className="mt-4 text-sm text-gray-400">Loading orders...</p>
        </div>
      ) : isError ? (
        <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-8 text-center">
          <AlertCircle size={36} className="mx-auto mb-3 text-red-400" />
          <h3 className="text-lg font-semibold text-white">Failed to load orders</h3>
          <p className="mt-1 text-sm text-red-400">
            {error?.response?.data?.message || "An unexpected error occurred while fetching orders."}
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
      ) : orders.length === 0 ? (
        <div className="rounded-2xl border border-[#222] bg-[#0b0b0b] p-12 text-center">
          <ShoppingBag size={48} className="mx-auto mb-4 text-gray-600" />
          <h2 className="text-lg font-semibold text-white">No Orders Found</h2>
          <p className="mt-1 text-sm text-gray-400">
            {isFiltered
              ? "No orders match your filter criteria. Try adjusting your search or filters."
              : "No orders have been recorded in the platform yet."}
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
                    Order ID
                  </th>
                  <th scope="col" className="px-5 py-4 font-semibold">
                    Customer
                  </th>
                  <th scope="col" className="px-5 py-4 font-semibold">
                    Products / Items
                  </th>
                  <th scope="col" className="px-5 py-4 font-semibold">
                    Total Amount
                  </th>
                  <th scope="col" className="px-5 py-4 font-semibold">
                    Order Date
                  </th>
                  <th scope="col" className="px-5 py-4 font-semibold">
                    Status
                  </th>
                  <th scope="col" className="px-5 py-4 text-right font-semibold">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1a1a1a]">
                {orders.map((order) => {
                  const customer = order.user;
                  const total = calculateTotal(order);
                  const itemsCount =
                    order.orderItems?.reduce(
                      (acc, item) => acc + (Number(item.quantity) || 1),
                      0
                    ) || 0;

                  return (
                    <tr
                      key={order._id}
                      className="transition-colors hover:bg-[#131313]"
                    >
                      {/* Order ID */}
                      <td className="whitespace-nowrap px-5 py-4">
                        <div className="flex items-center gap-2">
                          <span
                            className="font-mono text-xs font-semibold text-zinc-300"
                            title={order._id}
                          >
                            #{order._id?.slice(-8)}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleCopyOrderId(order._id)}
                            className="text-gray-500 transition hover:text-lime-300"
                            title="Copy full Order ID"
                          >
                            {copiedId === order._id ? (
                              <Check size={13} className="text-lime-400" />
                            ) : (
                              <Copy size={13} />
                            )}
                          </button>
                        </div>
                      </td>

                      {/* Customer */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#181818] text-lime-400">
                            <User size={16} />
                          </div>
                          <div className="min-w-0">
                            <p className="truncate font-medium text-white">
                              {customer?.fullName || "Unknown Customer"}
                            </p>
                            <p className="truncate text-xs text-gray-500">
                              {customer?.email || "No email available"}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Products / Items */}
                      <td className="px-5 py-4">
                        <div>
                          <div className="flex items-center gap-1.5 font-medium text-white">
                            <Package size={14} className="text-gray-400" />
                            <span>
                              {itemsCount} {itemsCount === 1 ? "item" : "items"}
                            </span>
                          </div>
                          <p className="mt-0.5 line-clamp-1 max-w-[200px] text-xs text-gray-500">
                            {order.orderItems
                              ?.map(
                                (item) =>
                                  item.product?.productName || "Product"
                              )
                              .join(", ") || "No items listed"}
                          </p>
                        </div>
                      </td>

                      {/* Total Amount */}
                      <td className="whitespace-nowrap px-5 py-4">
                        <span className="font-semibold text-lime-300">
                          ₹{total.toLocaleString("en-IN")}
                        </span>
                      </td>

                      {/* Order Date */}
                      <td className="whitespace-nowrap px-5 py-4 text-xs text-gray-400">
                        <div className="flex items-center gap-1.5">
                          <CalendarDays size={13} className="text-gray-500" />
                          <span>{formatDate(order.createdAt)}</span>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="whitespace-nowrap px-5 py-4">
                        <div
                          className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold ${getStatusStyle(
                            order.status
                          )}`}
                        >
                          {getStatusIcon(order.status)}
                          <span>{order.status || "Processing"}</span>
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="whitespace-nowrap px-5 py-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* View Details */}
                          <button
                            type="button"
                            onClick={() => setViewingOrder(order)}
                            className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-[#292929] bg-[#111] text-gray-300 transition hover:border-lime-400/40 hover:text-lime-300"
                            title="View order details"
                          >
                            <Eye size={15} />
                          </button>

                          {/* Edit */}
                          <button
                            type="button"
                            onClick={() => openEditDialog(order)}
                            className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-[#292929] bg-[#111] text-gray-300 transition hover:border-lime-400/40 hover:text-lime-300"
                            title="Edit order"
                          >
                            <Pencil size={15} />
                          </button>

                          {/* Delete */}
                          <button
                            type="button"
                            onClick={() => handleDeleteOrder(order)}
                            disabled={deleteOrderMutation.isPending}
                            className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-red-500/20 bg-red-500/5 text-red-400 transition hover:bg-red-500/10 disabled:opacity-50"
                            title="Delete order"
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
          6. CREATE / EDIT ORDER DIALOG
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
              {editingOrder ? "Edit Order" : "Create Order"}
            </DialogTitle>
          </DialogHeader>

          <div className="mt-4 space-y-5">
            {/* Customer (Create Only) */}
            {!editingOrder ? (
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-300">
                  Select Customer <span className="text-lime-400">*</span>
                </label>
                <select
                  value={selectedCustomer}
                  onChange={(e) => setSelectedCustomer(e.target.value)}
                  disabled={usersLoading}
                  className="w-full rounded-xl border border-[#292929] bg-[#111] px-3.5 py-3 text-sm text-white outline-none transition focus:border-lime-400 focus:ring-1 focus:ring-lime-400/30"
                >
                  <option value="">
                    {usersLoading ? "Loading customers..." : "Choose a customer..."}
                  </option>
                  {customerList.map((user) => (
                    <option key={user._id} value={user._id}>
                      {user.fullName} — {user.email}
                    </option>
                  ))}
                </select>
                <p className="mt-1.5 text-xs text-gray-500">
                  The order will be permanently assigned to this customer's account.
                </p>
              </div>
            ) : (
              <div className="rounded-xl border border-[#222] bg-[#111] p-3.5">
                <p className="text-xs uppercase tracking-wider text-gray-500">Customer</p>
                <p className="mt-1 text-sm font-semibold text-white">
                  {editingOrder.user?.fullName || "Customer"}
                </p>
                <p className="text-xs text-gray-400">{editingOrder.user?.email}</p>
              </div>
            )}

            {/* Product Selector */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-300">
                Add Products <span className="text-lime-400">*</span>
              </label>

              <div className="flex flex-col gap-2 sm:flex-row">
                <select
                  value={selectedProduct}
                  onChange={(e) => setSelectedProduct(e.target.value)}
                  disabled={productsLoading}
                  className="min-w-0 flex-1 rounded-xl border border-[#292929] bg-[#111] px-3.5 py-3 text-sm text-white outline-none transition focus:border-lime-400 focus:ring-1 focus:ring-lime-400/30"
                >
                  <option value="">
                    {productsLoading ? "Loading products..." : "Select a perfume/product..."}
                  </option>
                  {products.map((product) => (
                    <option key={product._id} value={product._id}>
                      {product.productName} — ₹{Number(product.price).toLocaleString("en-IN")}
                    </option>
                  ))}
                </select>

                <div className="flex gap-2">
                  <input
                    type="number"
                    min="1"
                    value={newItemQuantity}
                    onChange={(e) => setNewItemQuantity(e.target.value)}
                    placeholder="Qty"
                    className="w-20 rounded-xl border border-[#292929] bg-[#111] px-3 py-3 text-center text-sm text-white outline-none transition focus:border-lime-400 focus:ring-1 focus:ring-lime-400/30"
                  />

                  <button
                    type="button"
                    onClick={handleAddItem}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-lime-400 px-4 py-3 text-sm font-semibold text-black transition hover:bg-lime-300"
                  >
                    <Plus size={16} />
                    <span>Add</span>
                  </button>
                </div>
              </div>
              <p className="mt-1.5 text-xs text-gray-500">
                Pick a fragrance, specify quantity, and click Add.
              </p>
            </div>

            {/* Order Items List */}
            <div>
              <div className="mb-2.5 flex items-center justify-between">
                <h4 className="text-sm font-semibold text-gray-300">
                  Order Items ({formData.orderItems.length})
                </h4>
                {formData.orderItems.length > 0 && (
                  <span className="text-xs text-lime-400 font-semibold">
                    Subtotal: ₹{calculateFormTotal().toLocaleString("en-IN")}
                  </span>
                )}
              </div>

              {formData.orderItems.length === 0 ? (
                <div className="rounded-xl border border-dashed border-[#292929] bg-[#111] p-6 text-center">
                  <ShoppingBag size={28} className="mx-auto mb-2 text-gray-600" />
                  <p className="text-sm text-gray-500">No products added to this order yet.</p>
                </div>
              ) : (
                <div className="max-h-60 space-y-2 overflow-y-auto pr-1">
                  {formData.orderItems.map((item) => {
                    const product = getProductById(item.product);
                    const itemTotal =
                      (Number(product?.price) || 0) * Number(item.quantity || 1);

                    return (
                      <div
                        key={item.product}
                        className="flex items-center justify-between gap-3 rounded-xl border border-[#222] bg-[#111] p-3 transition hover:border-[#333]"
                      >
                        <div className="flex min-w-0 items-center gap-3">
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
                            <p className="truncate text-sm font-medium text-white">
                              {product?.productName || "Product"}
                            </p>
                            <p className="text-xs text-gray-500">
                              ₹{Number(product?.price || 0).toLocaleString("en-IN")} ×{" "}
                              {item.quantity} ={" "}
                              <span className="text-lime-300">
                                ₹{itemTotal.toLocaleString("en-IN")}
                              </span>
                            </p>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleRemoveItem(item.product)}
                          className="shrink-0 rounded-lg p-1.5 text-gray-400 transition hover:bg-red-500/10 hover:text-red-400"
                          title="Remove item"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Status Selector */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-300">
                Order Status
              </label>
              <select
                value={formData.status}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    status: e.target.value,
                  }))
                }
                className="w-full rounded-xl border border-[#292929] bg-[#111] px-3.5 py-3 text-sm text-white outline-none transition focus:border-lime-400 focus:ring-1 focus:ring-lime-400/30"
              >
                {STATUS_OPTIONS.map((status) => (
                  <option key={status.value} value={status.value}>
                    {status.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Dialog Footer Actions */}
            <div className="flex items-center justify-between border-t border-[#222] pt-4">
              <div>
                <span className="text-xs text-gray-500">Estimated Total:</span>
                <p className="text-lg font-bold text-lime-300">
                  ₹{calculateFormTotal().toLocaleString("en-IN")}
                </p>
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={closeDialog}
                  className="rounded-xl border border-[#292929] bg-[#111] px-4 py-2.5 text-sm font-medium text-gray-300 transition hover:bg-[#181818] hover:text-white"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={handleSave}
                  disabled={
                    createOrderMutation.isPending || updateOrderMutation.isPending
                  }
                  className="inline-flex items-center gap-2 rounded-xl bg-lime-400 px-5 py-2.5 text-sm font-semibold text-black transition hover:bg-lime-300 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {createOrderMutation.isPending || updateOrderMutation.isPending ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <span>{editingOrder ? "Update Order" : "Create Order"}</span>
                  )}
                </button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* ==================================================
          7. VIEW ORDER DETAILS DIALOG
      ================================================== */}
      <Dialog
        open={Boolean(viewingOrder)}
        onOpenChange={(open) => {
          if (!open) setViewingOrder(null);
        }}
      >
        <DialogContent className="max-h-[90vh] overflow-y-auto border-[#222] bg-[#0b0b0b] text-white sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold tracking-tight text-white">
              Order Details
            </DialogTitle>
          </DialogHeader>

          {viewingOrder && (
            <div className="mt-4 space-y-5">
              {/* Order Info & Date */}
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-xl border border-[#222] bg-[#111] p-4">
                  <p className="text-xs uppercase tracking-wider text-gray-500">Order ID</p>
                  <p className="mt-1 font-mono text-sm font-medium text-white">
                    #{viewingOrder._id}
                  </p>
                </div>

                <div className="rounded-xl border border-[#222] bg-[#111] p-4">
                  <p className="text-xs uppercase tracking-wider text-gray-500">Placed On</p>
                  <p className="mt-1 text-sm font-medium text-white">
                    {formatDate(viewingOrder.createdAt)}
                  </p>
                </div>
              </div>

              {/* Customer & Status */}
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-xl border border-[#222] bg-[#111] p-4">
                  <div className="mb-2 flex items-center gap-2 text-xs uppercase tracking-wider text-gray-500">
                    <User size={14} className="text-lime-400" />
                    <span>Customer Information</span>
                  </div>
                  <p className="text-sm font-semibold text-white">
                    {viewingOrder.user?.fullName || "Unknown Customer"}
                  </p>
                  <p className="text-xs text-gray-400">
                    {viewingOrder.user?.email || "No email available"}
                  </p>
                </div>

                <div className="rounded-xl border border-[#222] bg-[#111] p-4">
                  <p className="mb-2 text-xs uppercase tracking-wider text-gray-500">
                    Current Status
                  </p>
                  <div
                    className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold ${getStatusStyle(
                      viewingOrder.status
                    )}`}
                  >
                    {getStatusIcon(viewingOrder.status)}
                    <span>{viewingOrder.status || "Processing"}</span>
                  </div>
                </div>
              </div>

              {/* Products Table */}
              <div>
                <h4 className="mb-3 text-sm font-semibold text-gray-300">
                  Purchased Fragrances ({viewingOrder.orderItems?.length || 0})
                </h4>

                <div className="space-y-2.5">
                  {viewingOrder.orderItems?.map((item, index) => {
                    const product = item.product;
                    const itemSubtotal =
                      (Number(product?.price) || 0) * (Number(item.quantity) || 1);

                    return (
                      <div
                        key={`${item.product?._id || item.product}-${index}`}
                        className="flex items-center justify-between gap-4 rounded-xl border border-[#222] bg-[#111] p-3.5"
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
                            <p className="truncate text-sm font-semibold text-white">
                              {product?.productName || "Perfume Product"}
                            </p>
                            <p className="text-xs text-gray-500">
                              Category: {product?.category || "Fragrance"}
                            </p>
                            <p className="mt-0.5 text-xs text-gray-400">
                              ₹{Number(product?.price || 0).toLocaleString("en-IN")} ×{" "}
                              {item.quantity}
                            </p>
                          </div>
                        </div>

                        <div className="text-right">
                          <p className="text-sm font-bold text-lime-300">
                            ₹{itemSubtotal.toLocaleString("en-IN")}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Grand Total */}
              <div className="flex items-center justify-between border-t border-[#222] pt-4">
                <span className="text-sm font-medium text-gray-400">
                  Total Order Amount
                </span>
                <span className="text-2xl font-bold text-lime-300">
                  ₹{calculateTotal(viewingOrder).toLocaleString("en-IN")}
                </span>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* ==================================================
          8. DELETE CONFIRMATION DIALOG
      ================================================== */}
      <Dialog
        open={Boolean(deleteOrder)}
        onOpenChange={(open) => {
          if (!open) setDeleteOrder(null);
        }}
      >
        <DialogContent className="border-[#222] bg-[#0b0b0b] text-white sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-white">
              Delete This Order?
            </DialogTitle>
          </DialogHeader>

          <div className="mt-3">
            <p className="text-sm text-gray-400">
              Are you sure you want to permanently delete order{" "}
              <strong className="text-white">#{deleteOrder?._id?.slice(-8)}</strong> for{" "}
              <strong className="text-white">
                {deleteOrder?.user?.fullName || "customer"}
              </strong>
              ? This action cannot be undone.
            </p>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setDeleteOrder(null)}
                disabled={deleteOrderMutation.isPending}
                className="rounded-xl border border-[#292929] bg-[#111] px-4 py-2.5 text-sm font-medium text-gray-300 transition hover:bg-[#181818] hover:text-white"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={confirmDeleteOrder}
                disabled={deleteOrderMutation.isPending}
                className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-500 disabled:opacity-50"
              >
                {deleteOrderMutation.isPending ? (
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

export default Orders;

import React, { useState, useEffect, useMemo } from "react";
import {
  Users as UsersIcon,
  Trash2,
  RefreshCw,
  Loader2,
  Pencil,
  Eye,
  Search,
  ArrowUpDown,
  AlertCircle,
  Copy,
  Check,
  RotateCcw,
  ShieldCheck,
  ShoppingBag,
  UserCheck,
  UserPlus,
  CalendarDays,
  Mail,
  User as UserIcon,
} from "lucide-react";
import { toast } from "react-toastify";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import {
  useUsers,
  useUserStats,
  useUpdateUser,
  useDeleteUser,
} from "@/hooks/users/useUsers";

import { SidebarTrigger } from "@/components/ui/sidebar";
import Pagination from "@/components/Pagination/Pagination";

const ROLE_OPTIONS = [
  { value: "All", label: "All Roles" },
  { value: "customer", label: "Customers Only" },
  { value: "admin", label: "Administrators Only" },
];

const SORT_OPTIONS = [
  { value: "newest", label: "Newest First" },
  { value: "oldest", label: "Oldest First" },
  { value: "name_asc", label: "Name: A to Z" },
  { value: "name_desc", label: "Name: Z to A" },
  { value: "most_orders", label: "Most Orders" },
];

const Users = () => {
  // ===============================
  // FILTER & PAGINATION STATES
  // ===============================
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");
  const [sortOption, setSortOption] = useState("newest");
  const [copiedId, setCopiedId] = useState(null);

  // Dialog states
  const [editingUser, setEditingUser] = useState(null);
  const [viewingUser, setViewingUser] = useState(null);
  const [deleteUserTarget, setDeleteUserTarget] = useState(null);

  const [editForm, setEditForm] = useState({
    fullName: "",
    email: "",
    isAdmin: false,
  });

  // Debounce search input (350ms)
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchInput.trim());
      setPage(1);
    }, 350);

    return () => clearTimeout(handler);
  }, [searchInput]);

  // Handle filter changes
  const handleRoleChange = (val) => {
    setRoleFilter(val);
    setPage(1);
  };

  const handleSortChange = (val) => {
    setSortOption(val);
    setPage(1);
  };

  const handleClearFilters = () => {
    setSearchInput("");
    setDebouncedSearch("");
    setRoleFilter("All");
    setSortOption("newest");
    setPage(1);
  };

  const isFiltered =
    Boolean(debouncedSearch) ||
    roleFilter !== "All" ||
    sortOption !== "newest";

  // ===============================
  // QUERIES
  // ===============================
  const queryParams = useMemo(
    () => ({
      page,
      limit: 10,
      search: debouncedSearch || undefined,
      role: roleFilter !== "All" ? roleFilter : undefined,
      sort: sortOption,
    }),
    [page, debouncedSearch, roleFilter, sortOption]
  );

  const {
    data: usersResponse,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useUsers(queryParams);

  const users = usersResponse?.data ?? [];
  const pagination = usersResponse?.pagination;

  // User Statistics Query
  const {
    data: statsResponse,
    isLoading: statsLoading,
    refetch: refetchStats,
  } = useUserStats();

  const stats = statsResponse?.data ?? {
    totalUsers: usersResponse?.summary?.totalUsers ?? pagination?.total ?? 0,
    customerCount: usersResponse?.summary?.customerCount ?? 0,
    adminCount: usersResponse?.summary?.adminCount ?? 0,
    newUsersCount: 0,
  };

  // ===============================
  // MUTATIONS
  // ===============================
  const updateUserMutation = useUpdateUser();
  const deleteUserMutation = useDeleteUser();

  // Copy helper
  const handleCopyId = (id) => {
    if (!id) return;
    navigator.clipboard.writeText(id);
    setCopiedId(id);
    toast.info("User ID copied to clipboard");
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Refresh all data
  const handleRefresh = async () => {
    await Promise.all([refetch(), refetchStats()]);
  };

  // ===============================
  // DIALOG ACTIONS
  // ===============================
  const openEditDialog = (user) => {
    setEditingUser(user);
    setEditForm({
      fullName: user.fullName || "",
      email: user.email || "",
      isAdmin: Boolean(user.isAdmin),
    });
  };

  const closeEditDialog = () => {
    setEditingUser(null);
    setEditForm({
      fullName: "",
      email: "",
      isAdmin: false,
    });
  };

  const handleUpdate = (e) => {
    e.preventDefault();

    if (!editingUser?._id) return;

    if (!editForm.fullName.trim() || !editForm.email.trim()) {
      toast.warning("Full name and email are required");
      return;
    }

    updateUserMutation.mutate(
      {
        id: editingUser._id,
        userData: {
          fullName: editForm.fullName.trim(),
          email: editForm.email.trim(),
          isAdmin: editForm.isAdmin,
        },
      },
      {
        onSuccess: async () => {
          toast.success("User updated successfully");
          closeEditDialog();
          await handleRefresh();
        },
        onError: (err) => {
          toast.error(
            err?.response?.data?.msg ||
              err?.response?.data?.message ||
              "Failed to update user"
          );
        },
      }
    );
  };

  const confirmDelete = () => {
    if (!deleteUserTarget?._id) return;

    deleteUserMutation.mutate(deleteUserTarget._id, {
      onSuccess: async () => {
        toast.success("User removed successfully");
        setDeleteUserTarget(null);
        await handleRefresh();
      },
      onError: (err) => {
        toast.error(
          err?.response?.data?.msg ||
            err?.response?.data?.message ||
            "Failed to delete user"
        );
      },
    });
  };

  // Date helper
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
                  Users & Customers
                </h1>
                <span className="rounded-full border border-lime-400/30 bg-lime-400/10 px-2.5 py-0.5 text-xs font-semibold text-lime-300">
                  User Management
                </span>
              </div>
              <p className="mt-1 text-sm text-gray-400">
                Manage registered customer profiles, orders summary, and admin access.
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
            title="Refresh users data"
          >
            <RefreshCw
              size={16}
              className={isFetching || statsLoading ? "animate-spin text-lime-400" : ""}
            />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* ==================================================
          2. STATISTICS CARDS SECTION
      ================================================== */}
      <div className="mb-6 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
        {/* Total Users */}
        <div className="rounded-2xl border border-[#222] bg-[#0b0b0b] p-4 transition-all hover:border-lime-400/30">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium uppercase tracking-wider text-gray-400">
              Total Users
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-lime-400/10 text-lime-400">
              <UsersIcon size={16} />
            </div>
          </div>
          <p className="mt-2 text-xl font-bold tracking-tight text-lime-300 sm:text-2xl">
            {stats.totalUsers}
          </p>
          <p className="mt-1 text-xs text-gray-500">Registered platform accounts</p>
        </div>

        {/* Customers */}
        <div className="rounded-2xl border border-[#222] bg-[#0b0b0b] p-4 transition-all hover:border-lime-400/30">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium uppercase tracking-wider text-gray-400">
              Customers
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-400/10 text-blue-400">
              <ShoppingBag size={16} />
            </div>
          </div>
          <p className="mt-2 text-xl font-bold text-white sm:text-2xl">
            {stats.customerCount}
          </p>
          <p className="mt-1 text-xs text-gray-500">Active shoppers</p>
        </div>

        {/* Administrators */}
        <div className="rounded-2xl border border-[#222] bg-[#0b0b0b] p-4 transition-all hover:border-lime-400/30">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium uppercase tracking-wider text-gray-400">
              Admins
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-400/10 text-purple-400">
              <ShieldCheck size={16} />
            </div>
          </div>
          <p className="mt-2 text-xl font-bold text-purple-300 sm:text-2xl">
            {stats.adminCount}
          </p>
          <p className="mt-1 text-xs text-gray-500">Privileged accounts</p>
        </div>

        {/* New Users */}
        <div className="rounded-2xl border border-[#222] bg-[#0b0b0b] p-4 transition-all hover:border-lime-400/30">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium uppercase tracking-wider text-gray-400">
              New Users
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-yellow-400/10 text-yellow-400">
              <UserPlus size={16} />
            </div>
          </div>
          <p className="mt-2 text-xl font-bold text-yellow-300 sm:text-2xl">
            {stats.newUsersCount}
          </p>
          <p className="mt-1 text-xs text-gray-500">Joined in last 30 days</p>
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
              placeholder="Search by full name or email address..."
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

          {/* Role Filter */}
          <div className="lg:col-span-4">
            <select
              value={roleFilter}
              onChange={(e) => handleRoleChange(e.target.value)}
              className="w-full rounded-xl border border-[#292929] bg-[#111] px-3 py-2.5 text-sm text-white outline-none transition focus:border-lime-400 focus:ring-1 focus:ring-lime-400/30"
            >
              {ROLE_OPTIONS.map((r) => (
                <option key={r.value} value={r.value}>
                  {r.label}
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
                {SORT_OPTIONS.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
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
              {roleFilter !== "All" && (
                <span className="inline-flex items-center gap-1 rounded-md bg-[#181818] px-2 py-0.5 text-gray-300">
                  Role:{" "}
                  <strong className="text-white">
                    {ROLE_OPTIONS.find((r) => r.value === roleFilter)?.label}
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
                {users.length > 0
                  ? (pagination.page - 1) * pagination.limit + 1
                  : 0}
              </strong>{" "}
              to{" "}
              <strong className="text-white">
                {Math.min(pagination.page * pagination.limit, pagination.total)}
              </strong>{" "}
              of <strong className="text-white">{pagination.total}</strong> users
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
          5. USERS LIST / TABLE LAYOUT
      ================================================== */}
      {isLoading ? (
        <div className="flex min-h-[360px] flex-col items-center justify-center rounded-2xl border border-[#222] bg-[#0b0b0b] p-12">
          <Loader2 size={36} className="animate-spin text-lime-400" />
          <p className="mt-4 text-sm text-gray-400">Loading user records...</p>
        </div>
      ) : isError ? (
        <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-8 text-center">
          <AlertCircle size={36} className="mx-auto mb-3 text-red-400" />
          <h3 className="text-lg font-semibold text-white">Failed to load users</h3>
          <p className="mt-1 text-sm text-red-400">
            {error?.response?.data?.msg ||
              error?.response?.data?.message ||
              "An unexpected error occurred while fetching users."}
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
      ) : users.length === 0 ? (
        <div className="rounded-2xl border border-[#222] bg-[#0b0b0b] p-12 text-center">
          <UsersIcon size={48} className="mx-auto mb-4 text-gray-600" />
          <h2 className="text-lg font-semibold text-white">No Users Found</h2>
          <p className="mt-1 text-sm text-gray-400">
            {isFiltered
              ? "No accounts match your filter criteria. Try adjusting your search query or role filter."
              : "No user accounts have registered yet."}
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
                    #
                  </th>
                  <th scope="col" className="px-5 py-4 font-semibold">
                    Customer / User
                  </th>
                  <th scope="col" className="px-5 py-4 font-semibold">
                    Role
                  </th>
                  <th scope="col" className="px-5 py-4 font-semibold">
                    Orders
                  </th>
                  <th scope="col" className="px-5 py-4 font-semibold">
                    User ID
                  </th>
                  <th scope="col" className="px-5 py-4 font-semibold">
                    Registered
                  </th>
                  <th scope="col" className="px-5 py-4 text-right font-semibold">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1a1a1a]">
                {users.map((user, index) => {
                  const initials = user.fullName
                    ? user.fullName
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .substring(0, 2)
                        .toUpperCase()
                    : "U";

                  const orderCount = user.orderCount || 0;

                  return (
                    <tr
                      key={user._id}
                      className="transition-colors hover:bg-[#131313]"
                    >
                      {/* Row Index */}
                      <td className="whitespace-nowrap px-5 py-4 text-xs font-mono text-gray-500">
                        {(pagination?.page - 1) * (pagination?.limit || 10) + index + 1}
                      </td>

                      {/* Customer Info */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div
                            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border text-sm font-bold ${
                              user.isAdmin
                                ? "border-purple-400/30 bg-purple-400/10 text-purple-300"
                                : "border-lime-400/30 bg-lime-400/10 text-lime-400"
                            }`}
                          >
                            {initials}
                          </div>
                          <div className="min-w-0">
                            <p className="truncate font-semibold text-white">
                              {user.fullName || "Unnamed User"}
                            </p>
                            <p className="truncate text-xs text-gray-400">
                              {user.email}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Role */}
                      <td className="whitespace-nowrap px-5 py-4">
                        {user.isAdmin ? (
                          <span className="inline-flex items-center gap-1.5 rounded-full border border-purple-400/20 bg-purple-400/10 px-2.5 py-0.5 text-xs font-semibold text-purple-300">
                            <ShieldCheck size={12} />
                            <span>Administrator</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 rounded-full border border-lime-400/20 bg-lime-400/10 px-2.5 py-0.5 text-xs font-semibold text-lime-300">
                            <UserCheck size={12} />
                            <span>Customer</span>
                          </span>
                        )}
                      </td>

                      {/* Orders Count */}
                      <td className="whitespace-nowrap px-5 py-4">
                        <div className="inline-flex items-center gap-1.5 rounded-lg bg-[#141414] px-2.5 py-1 text-xs font-medium text-white border border-[#222]">
                          <ShoppingBag size={13} className="text-gray-400" />
                          <span>
                            {orderCount} {orderCount === 1 ? "order" : "orders"}
                          </span>
                        </div>
                      </td>

                      {/* User ID */}
                      <td className="whitespace-nowrap px-5 py-4">
                        <div className="flex items-center gap-2">
                          <span
                            className="font-mono text-xs text-gray-400"
                            title={user._id}
                          >
                            #{user._id?.slice(-8)}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleCopyId(user._id)}
                            className="text-gray-500 transition hover:text-lime-300"
                            title="Copy full User ID"
                          >
                            {copiedId === user._id ? (
                              <Check size={13} className="text-lime-400" />
                            ) : (
                              <Copy size={13} />
                            )}
                          </button>
                        </div>
                      </td>

                      {/* Registered Date */}
                      <td className="whitespace-nowrap px-5 py-4 text-xs text-gray-400">
                        <div className="flex items-center gap-1.5">
                          <CalendarDays size={13} className="text-gray-500" />
                          <span>{getCreatedDate(user)}</span>
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="whitespace-nowrap px-5 py-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* View Details */}
                          <button
                            type="button"
                            onClick={() => setViewingUser(user)}
                            className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-[#292929] bg-[#111] text-gray-300 transition hover:border-lime-400/40 hover:text-lime-300"
                            title="View user details"
                          >
                            <Eye size={15} />
                          </button>

                          {/* Edit */}
                          <button
                            type="button"
                            onClick={() => openEditDialog(user)}
                            className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-[#292929] bg-[#111] text-gray-300 transition hover:border-lime-400/40 hover:text-lime-300"
                            title="Edit user role & details"
                          >
                            <Pencil size={15} />
                          </button>

                          {/* Delete */}
                          <button
                            type="button"
                            onClick={() => setDeleteUserTarget(user)}
                            disabled={deleteUserMutation.isPending}
                            className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-red-500/20 bg-red-500/5 text-red-400 transition hover:bg-red-500/10 disabled:opacity-50"
                            title="Delete user"
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
          6. EDIT USER DIALOG
      ================================================== */}
      <Dialog
        open={Boolean(editingUser)}
        onOpenChange={(open) => {
          if (!open) closeEditDialog();
        }}
      >
        <DialogContent className="border-[#222] bg-[#0b0b0b] text-white sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold tracking-tight text-white">
              Edit User Profile
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleUpdate} className="mt-4 space-y-4">
            {/* Full Name */}
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-gray-400">
                Full Name <span className="text-lime-400">*</span>
              </label>
              <input
                type="text"
                value={editForm.fullName}
                onChange={(e) =>
                  setEditForm((prev) => ({ ...prev, fullName: e.target.value }))
                }
                placeholder="Full Name"
                className="w-full rounded-xl border border-[#292929] bg-[#111] px-3.5 py-2.5 text-sm text-white placeholder-gray-600 outline-none transition focus:border-lime-400 focus:ring-1 focus:ring-lime-400/30"
                required
              />
            </div>

            {/* Email */}
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-gray-400">
                Email Address <span className="text-lime-400">*</span>
              </label>
              <input
                type="email"
                value={editForm.email}
                onChange={(e) =>
                  setEditForm((prev) => ({ ...prev, email: e.target.value }))
                }
                placeholder="customer@domain.com"
                className="w-full rounded-xl border border-[#292929] bg-[#111] px-3.5 py-2.5 text-sm text-white placeholder-gray-600 outline-none transition focus:border-lime-400 focus:ring-1 focus:ring-lime-400/30"
                required
              />
            </div>

            {/* Role Select */}
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-gray-400">
                Access Role
              </label>
              <select
                value={editForm.isAdmin ? "admin" : "customer"}
                onChange={(e) =>
                  setEditForm((prev) => ({
                    ...prev,
                    isAdmin: e.target.value === "admin",
                  }))
                }
                className="w-full rounded-xl border border-[#292929] bg-[#111] px-3.5 py-2.5 text-sm text-white outline-none transition focus:border-lime-400 focus:ring-1 focus:ring-lime-400/30"
              >
                <option value="customer">Customer (Standard User)</option>
                <option value="admin">Administrator (Full Dashboard Access)</option>
              </select>
              <p className="mt-1.5 text-xs text-gray-500">
                Granting Administrator role enables full store management privileges.
              </p>
            </div>

            {/* Dialog Footer Actions */}
            <div className="flex items-center justify-end gap-3 border-t border-[#222] pt-4">
              <button
                type="button"
                onClick={closeEditDialog}
                disabled={updateUserMutation.isPending}
                className="rounded-xl border border-[#292929] bg-[#111] px-4 py-2.5 text-sm font-medium text-gray-300 transition hover:bg-[#181818] hover:text-white"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={updateUserMutation.isPending}
                className="inline-flex items-center gap-2 rounded-xl bg-lime-400 px-5 py-2.5 text-sm font-semibold text-black transition hover:bg-lime-300 disabled:opacity-50"
              >
                {updateUserMutation.isPending ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <span>Update Profile</span>
                )}
              </button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* ==================================================
          7. VIEW USER DETAILS DIALOG
      ================================================== */}
      <Dialog
        open={Boolean(viewingUser)}
        onOpenChange={(open) => {
          if (!open) setViewingUser(null);
        }}
      >
        <DialogContent className="max-h-[90vh] overflow-y-auto border-[#222] bg-[#0b0b0b] text-white sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold tracking-tight text-white">
              Customer Details
            </DialogTitle>
          </DialogHeader>

          {viewingUser && (
            <div className="mt-4 space-y-4">
              {/* Profile Card */}
              <div className="flex items-center gap-4 rounded-2xl border border-[#222] bg-[#111] p-4">
                <div
                  className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border text-lg font-bold ${
                    viewingUser.isAdmin
                      ? "border-purple-400/30 bg-purple-400/10 text-purple-300"
                      : "border-lime-400/30 bg-lime-400/10 text-lime-400"
                  }`}
                >
                  {viewingUser.fullName
                    ? viewingUser.fullName
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .substring(0, 2)
                        .toUpperCase()
                    : "U"}
                </div>
                <div className="min-w-0">
                  <h3 className="truncate text-base font-bold text-white">
                    {viewingUser.fullName || "Unnamed User"}
                  </h3>
                  <div className="mt-1 flex items-center gap-2">
                    {viewingUser.isAdmin ? (
                      <span className="inline-flex items-center gap-1 rounded-full border border-purple-400/20 bg-purple-400/10 px-2 py-0.5 text-xs font-semibold text-purple-300">
                        <ShieldCheck size={11} /> Administrator
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-full border border-lime-400/20 bg-lime-400/10 px-2 py-0.5 text-xs font-semibold text-lime-300">
                        <UserCheck size={11} /> Customer
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Info Grid */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between rounded-xl border border-[#222] bg-[#111] p-3 text-sm">
                  <span className="flex items-center gap-2 text-xs text-gray-400 uppercase tracking-wider">
                    <Mail size={13} className="text-gray-500" /> Email
                  </span>
                  <span className="font-medium text-white">{viewingUser.email}</span>
                </div>

                <div className="flex items-center justify-between rounded-xl border border-[#222] bg-[#111] p-3 text-sm">
                  <span className="flex items-center gap-2 text-xs text-gray-400 uppercase tracking-wider">
                    <ShoppingBag size={13} className="text-gray-500" /> Orders Placed
                  </span>
                  <span className="font-semibold text-lime-300">
                    {viewingUser.orderCount || 0}
                  </span>
                </div>

                <div className="flex items-center justify-between rounded-xl border border-[#222] bg-[#111] p-3 text-sm">
                  <span className="flex items-center gap-2 text-xs text-gray-400 uppercase tracking-wider">
                    <CalendarDays size={13} className="text-gray-500" /> Member Since
                  </span>
                  <span className="text-gray-300">
                    {getCreatedDate(viewingUser)}
                  </span>
                </div>

                <div className="flex items-center justify-between rounded-xl border border-[#222] bg-[#111] p-3 text-sm">
                  <span className="flex items-center gap-2 text-xs text-gray-400 uppercase tracking-wider">
                    <UserIcon size={13} className="text-gray-500" /> User ID
                  </span>
                  <span className="font-mono text-xs text-gray-400">
                    {viewingUser._id}
                  </span>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    const u = viewingUser;
                    setViewingUser(null);
                    openEditDialog(u);
                  }}
                  className="inline-flex items-center gap-2 rounded-xl bg-lime-400 px-4 py-2 text-sm font-semibold text-black transition hover:bg-lime-300"
                >
                  <Pencil size={15} />
                  <span>Edit Profile</span>
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
        open={Boolean(deleteUserTarget)}
        onOpenChange={(open) => {
          if (!open) setDeleteUserTarget(null);
        }}
      >
        <DialogContent className="border-[#222] bg-[#0b0b0b] text-white sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-white">
              Delete This User?
            </DialogTitle>
          </DialogHeader>

          <div className="mt-3">
            <p className="text-sm text-gray-400">
              Are you sure you want to permanently delete account for{" "}
              <strong className="text-white">
                {deleteUserTarget?.fullName || "customer"}
              </strong>{" "}
              ({deleteUserTarget?.email})? This action cannot be undone.
            </p>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setDeleteUserTarget(null)}
                disabled={deleteUserMutation.isPending}
                className="rounded-xl border border-[#292929] bg-[#111] px-4 py-2.5 text-sm font-medium text-gray-300 transition hover:bg-[#181818] hover:text-white"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={confirmDelete}
                disabled={deleteUserMutation.isPending}
                className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-500 disabled:opacity-50"
              >
                {deleteUserMutation.isPending ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    <span>Deleting...</span>
                  </>
                ) : (
                  <>
                    <Trash2 size={16} />
                    <span>Delete User</span>
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

export default Users;

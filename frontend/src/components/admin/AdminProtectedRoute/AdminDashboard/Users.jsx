import React, { useState } from "react";
import { toast } from "react-toastify";

import { useUpdateUser, useUsers } from "@/hooks/users/useUsers";
import Pagination from "@/components/Pagination/Pagination";

const Users = () => {
  const [page, setPage] = useState(1);
  // =========================
  // FETCH USERS
  // =========================
  const {
    data: usersResponse,
    isLoading,
    isError,
    error,
  } = useUsers({ page });
  const users = usersResponse?.data ?? [];
  const pagination = usersResponse?.pagination;
  const summary = usersResponse?.summary;

  // =========================
  // UPDATE USER MUTATION
  // =========================
  const updateUserMutation = useUpdateUser();

  // =========================
  // EDIT USER STATE
  // =========================
  const [editingUser, setEditingUser] = useState(null);

  const [editForm, setEditForm] = useState({
    fullName: "",
    email: "",
    isAdmin: false,
  });

  // =========================
  // OPEN EDIT MODAL
  // =========================
  const handleEdit = (user) => {
    setEditingUser(user);

    setEditForm({
      fullName: user.fullName || "",
      email: user.email || "",
      isAdmin: user.isAdmin || false,
    });
  };

  // =========================
  // HANDLE INPUT CHANGE
  // =========================
  const handleChange = (e) => {
    const { name, value } = e.target;

    setEditForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =========================
  // HANDLE ROLE CHANGE
  // =========================
  const handleRoleChange = (e) => {
    setEditForm((prev) => ({
      ...prev,
      isAdmin: e.target.value === "admin",
    }));
  };

  // =========================
  // UPDATE USER
  // =========================
  const handleUpdate = (e) => {
    e.preventDefault();

    if (!editingUser?._id) {
      toast.error("User ID is missing");
      return;
    }

    updateUserMutation.mutate(
      {
        id: editingUser._id,
        userData: editForm,
      },
      {
        onSuccess: () => {
          toast.success("User updated successfully!");

          setEditingUser(null);

          setEditForm({
            fullName: "",
            email: "",
            isAdmin: false,
          });
        },

        onError: (error) => {
          console.error("UPDATE ERROR:", error);

          toast.error(
            error?.response?.data?.msg ||
              error?.response?.data?.message ||
              "Failed to update user"
          );
        },
      }
    );
  };

  // =========================
  // STATISTICS
  // =========================
  const totalUsers = pagination?.total ?? 0;
  const adminUsers = summary?.adminCount ?? 0;
  const normalUsers = summary?.customerCount ?? 0;

  // =========================
  // LOADING STATE
  // =========================
  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-white p-6">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="w-10 h-10 border-4 border-zinc-700 border-t-lime-400 rounded-full animate-spin mx-auto mb-4" />

            <p className="text-zinc-400">
              Loading users...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-4 md:p-6">

      {/* =========================
          HEADER
      ========================= */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold">
          Users
        </h1>

        <p className="text-zinc-400 mt-1">
          Manage registered users and administrators
        </p>
      </div>

      {/* =========================
          ERROR MESSAGE
      ========================= */}
      {isError && (
        <div className="mb-6 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-red-400">
          {error?.response?.data?.msg ||
            error?.response?.data?.message ||
            error?.message ||
            "Failed to fetch users"}
        </div>
      )}

      {/* =========================
          STATS
      ========================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">

        {/* TOTAL USERS */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 hover:border-lime-400/40 transition">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-zinc-400">
                Total Users
              </p>

              <h2 className="text-3xl font-bold mt-2">
                {totalUsers}
              </h2>
            </div>

            <div className="w-12 h-12 rounded-xl bg-lime-400/10 flex items-center justify-center">
              <span className="text-lime-400 text-xl">
                👥
              </span>
            </div>
          </div>
        </div>

        {/* CUSTOMERS */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 hover:border-lime-400/40 transition">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-zinc-400">
                Customers
              </p>

              <h2 className="text-3xl font-bold mt-2">
                {normalUsers}
              </h2>
            </div>

            <div className="w-12 h-12 rounded-xl bg-lime-400/10 flex items-center justify-center">
              <span className="text-lime-400 text-xl">
                🛍️
              </span>
            </div>
          </div>
        </div>

        {/* ADMINISTRATORS */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 hover:border-lime-400/40 transition">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-zinc-400">
                Administrators
              </p>

              <h2 className="text-3xl font-bold mt-2">
                {adminUsers}
              </h2>
            </div>

            <div className="w-12 h-12 rounded-xl bg-lime-400/10 flex items-center justify-center">
              <span className="text-lime-400 text-xl">
                🛡️
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* =========================
          USERS TABLE
      ========================= */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">

        {/* TABLE HEADER */}
        <div className="px-5 py-4 border-b border-zinc-800 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">
              All Users
            </h2>

            <p className="text-sm text-zinc-500 mt-1">
              {totalUsers} registered users
            </p>
          </div>

          <div className="px-3 py-1.5 rounded-lg bg-lime-400/10 border border-lime-400/20">
            <span className="text-lime-400 text-sm font-medium">
              {totalUsers} Users
            </span>
          </div>
        </div>

        {/* RESPONSIVE TABLE */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px]">

            <thead>
              <tr className="border-b border-zinc-800 text-left">

                <th className="px-5 py-4 text-xs uppercase tracking-wider text-zinc-500">
                  #
                </th>

                <th className="px-5 py-4 text-xs uppercase tracking-wider text-zinc-500">
                  User
                </th>

                <th className="px-5 py-4 text-xs uppercase tracking-wider text-zinc-500">
                  Email
                </th>

                <th className="px-5 py-4 text-xs uppercase tracking-wider text-zinc-500">
                  Role
                </th>

                <th className="px-5 py-4 text-xs uppercase tracking-wider text-zinc-500">
                  User ID
                </th>

                <th className="px-5 py-4 text-xs uppercase tracking-wider text-zinc-500 text-right">
                  Action
                </th>

              </tr>
            </thead>

            <tbody>
              {users.length === 0 ? (
                <tr>
                  <td
                    colSpan="6"
                    className="px-5 py-12 text-center text-zinc-500"
                  >
                    No users found
                  </td>
                </tr>
              ) : (
                users.map((user, index) => (
                  <tr
                    key={user._id}
                    className="border-b border-zinc-800/70 hover:bg-zinc-800/40 transition"
                  >

                    {/* NUMBER */}
                    <td className="px-5 py-4 text-zinc-500">
                      {(pagination?.page - 1) * (pagination?.limit || 10) + index + 1}
                    </td>

                    {/* USER */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">

                        <div className="w-10 h-10 rounded-full bg-lime-400/10 border border-lime-400/20 flex items-center justify-center">
                          <span className="text-lime-400 font-semibold">
                            {user.fullName
                              ?.charAt(0)
                              ?.toUpperCase() || "U"}
                          </span>
                        </div>

                        <div>
                          <p className="font-medium text-white">
                            {user.fullName}
                          </p>

                          <p className="text-xs text-zinc-500">
                            User
                          </p>
                        </div>

                      </div>
                    </td>

                    {/* EMAIL */}
                    <td className="px-5 py-4 text-zinc-400">
                      {user.email}
                    </td>

                    {/* ROLE */}
                    <td className="px-5 py-4">
                      {user.isAdmin ? (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-lime-400/10 text-lime-400 border border-lime-400/20">
                          Admin
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-zinc-800 text-zinc-300 border border-zinc-700">
                          User
                        </span>
                      )}
                    </td>

                    {/* USER ID */}
                    <td className="px-5 py-4">
                      <span className="text-xs text-zinc-500 font-mono">
                        {user._id}
                      </span>
                    </td>

                    {/* ACTION */}
                    <td className="px-5 py-4 text-right">
                      <button
                        type="button"
                        onClick={() => handleEdit(user)}
                        className="px-4 py-2 rounded-lg border border-lime-400/30 text-lime-400 hover:bg-lime-400 hover:text-black transition font-medium text-sm"
                      >
                        Edit
                      </button>
                    </td>

                  </tr>
                ))
              )}
            </tbody>

          </table>
        </div>

        <div className="px-5 pb-5">
          <Pagination pagination={pagination} onPageChange={setPage} />
        </div>
      </div>

      {/* =========================
          EDIT USER MODAL
      ========================= */}
      {editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">

          <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl">

            {/* MODAL HEADER */}
            <div className="px-6 py-5 border-b border-zinc-800 flex items-center justify-between">

              <div>
                <h2 className="text-xl font-semibold">
                  Edit User
                </h2>

                <p className="text-sm text-zinc-500 mt-1">
                  Update user information
                </p>
              </div>

              <button
                type="button"
                onClick={() => setEditingUser(null)}
                className="text-zinc-500 hover:text-white text-xl"
              >
                ✕
              </button>

            </div>

            {/* FORM */}
            <form
              onSubmit={handleUpdate}
              className="p-6 space-y-5"
            >

              {/* FULL NAME */}
              <div>
                <label className="block text-sm text-zinc-400 mb-2">
                  Full Name
                </label>

                <input
                  type="text"
                  name="fullName"
                  value={editForm.fullName}
                  onChange={handleChange}
                  className="w-full bg-black border border-zinc-800 rounded-lg px-4 py-3 text-white outline-none focus:border-lime-400 transition"
                  placeholder="Enter full name"
                  required
                />
              </div>

              {/* EMAIL */}
              <div>
                <label className="block text-sm text-zinc-400 mb-2">
                  Email
                </label>

                <input
                  type="email"
                  name="email"
                  value={editForm.email}
                  onChange={handleChange}
                  className="w-full bg-black border border-zinc-800 rounded-lg px-4 py-3 text-white outline-none focus:border-lime-400 transition"
                  placeholder="Enter email"
                  required
                />
              </div>

              {/* ROLE */}
              <div>
                <label className="block text-sm text-zinc-400 mb-2">
                  Role
                </label>

                <select
                  name="isAdmin"
                  value={editForm.isAdmin ? "admin" : "user"}
                  onChange={handleRoleChange}
                  className="w-full bg-black border border-zinc-800 rounded-lg px-4 py-3 text-white outline-none focus:border-lime-400 transition"
                >
                  <option value="user">
                    User
                  </option>

                  <option value="admin">
                    Admin
                  </option>
                </select>
              </div>

              {/* BUTTONS */}
              <div className="flex gap-3 pt-2">

                {/* CANCEL */}
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  disabled={updateUserMutation.isPending}
                  className="flex-1 px-4 py-3 rounded-lg border border-zinc-700 text-zinc-300 hover:bg-zinc-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>

                {/* UPDATE */}
                <button
                  type="submit"
                  disabled={updateUserMutation.isPending}
                  className="flex-1 px-4 py-3 rounded-lg bg-lime-400 text-black font-semibold hover:bg-lime-300 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {updateUserMutation.isPending
                    ? "Updating..."
                    : "Update User"}
                </button>

              </div>

            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;

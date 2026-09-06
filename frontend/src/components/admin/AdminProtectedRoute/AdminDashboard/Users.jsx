import React, { useEffect, useState } from "react";
import api from "@/api/client";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Edit modal
  const [editingUser, setEditingUser] = useState(null);
  const [editForm, setEditForm] = useState({
    fullName: "",
    email: "",
    isAdmin: false,
  });
  const [updating, setUpdating] = useState(false);

  // FETCH USERS
  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/users/all");

      console.log("USERS API RESPONSE:", response.data);

      setUsers(response.data.users || []);
    } catch (error) {
      console.log("FULL ERROR:", error);
      console.log("STATUS:", error.response?.status);
      console.log("DATA:", error.response?.data);

      setError(
        error.response?.data?.msg ||
          error.message ||
          "Failed to fetch users"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // OPEN EDIT MODAL
  const handleEdit = (user) => {
    setEditingUser(user);

    setEditForm({
      fullName: user.fullName || "",
      email: user.email || "",
      isAdmin: user.isAdmin || false,
    });
  };

  // UPDATE INPUT
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setEditForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // UPDATE USER
  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      setUpdating(true);

      const response = await api.patch(
        `/users/${editingUser._id}`,
        editForm
      );

      console.log("UPDATE RESPONSE:", response.data);

      // Update user in table
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user._id === editingUser._id
            ? response.data.user
            : user
        )
      );

      setEditingUser(null);
    } catch (error) {
      console.log("UPDATE ERROR:", error);

      alert(
        error.response?.data?.msg ||
          "Failed to update user"
      );
    } finally {
      setUpdating(false);
    }
  };

  // STATS
  const totalUsers = users.length;

  const adminUsers = users.filter(
    (user) => user.isAdmin
  ).length;

  const normalUsers = users.filter(
    (user) => !user.isAdmin
  ).length;

  // LOADING
  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white p-6">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="w-10 h-10 border-4 border-zinc-700 border-t-lime-400 rounded-full animate-spin mx-auto mb-4"></div>

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
          {/* HEADER  */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold">
          Users
        </h1>

        <p className="text-zinc-400 mt-1">
          Manage registered users and administrators
        </p>
      </div>

    
          {/* ERROR  */}
      {error && (
        <div className="mb-6 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-red-400">
          {error}
        </div>
      )}

    
          {/* STATS  */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">

        {/* Total Users */}
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

        {/* Customers */}
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

        {/* Administrators */}
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

    
          {/* USERS TABLE  */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">

        {/* Table Header */}
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

        {/* Responsive Table */}
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

                    {/* Number */}
                    <td className="px-5 py-4 text-zinc-500">
                      {index + 1}
                    </td>

                    {/* User */}
                    <td className="px-5 py-4">

                      <div className="flex items-center gap-3">

                        <div className="w-10 h-10 rounded-full bg-lime-400/10 border border-lime-400/20 flex items-center justify-center">

                          <span className="text-lime-400 font-semibold">
                            {user.fullName
                              ?.charAt(0)
                              ?.toUpperCase()}
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

                    {/* Email */}
                    <td className="px-5 py-4 text-zinc-400">
                      {user.email}
                    </td>

                    {/* Role */}
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

                    {/* User ID */}
                    <td className="px-5 py-4">

                      <span className="text-xs text-zinc-500 font-mono">
                        {user._id}
                      </span>

                    </td>

                    {/* Action */}
                    <td className="px-5 py-4 text-right">

                      <button
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

      </div>

    
          {/* EDIT MODAL  */}
      {editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">

          <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl">

            {/* Modal Header */}
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
                onClick={() => setEditingUser(null)}
                className="text-zinc-500 hover:text-white text-xl"
              >
                ✕
              </button>

            </div>

            {/* Form */}
            <form
              onSubmit={handleUpdate}
              className="p-6 space-y-5"
            >

              {/* Full Name */}
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
                  required
                />
              </div>

              {/* Email */}
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
                  required
                />
              </div>

              {/* Role */}
              <div>
                <label className="block text-sm text-zinc-400 mb-2">
                  Role
                </label>

                <select
                  name="isAdmin"
                  value={editForm.isAdmin ? "admin" : "user"}
                  onChange={(e) =>
                    setEditForm((prev) => ({
                      ...prev,
                      isAdmin: e.target.value === "admin",
                    }))
                  }
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

              {/* Buttons */}
              <div className="flex gap-3 pt-2">

                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="flex-1 px-4 py-3 rounded-lg border border-zinc-700 text-zinc-300 hover:bg-zinc-800 transition"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={updating}
                  className="flex-1 px-4 py-3 rounded-lg bg-lime-400 text-black font-semibold hover:bg-lime-300 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {updating ? "Updating..." : "Update User"}
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
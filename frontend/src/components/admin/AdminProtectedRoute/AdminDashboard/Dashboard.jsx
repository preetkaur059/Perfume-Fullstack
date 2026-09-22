import React from "react";
import { Link } from "react-router-dom";
import {
  ShoppingBag,
  Package,
  Users,
  DollarSign,
  TrendingUp,
  ArrowRight,
  Truck,
  CheckCircle,
  Box,
  RefreshCw,
  ExternalLink,
  ShieldAlert,
} from "lucide-react";

import { useAdminOrderStats, useAdminOrders } from "@/hooks/orders/useOrders";
import { useProductStats } from "@/hooks/products/useProducts";
import { useUserStats } from "@/hooks/users/useUsers";
import { SidebarTrigger } from "@/components/ui/sidebar";

const Dashboard = () => {
  const {
    data: orderStatsResponse,
    isLoading: orderStatsLoading,
    refetch: refetchOrderStats,
  } = useAdminOrderStats();

  const {
    data: productStatsResponse,
    isLoading: productStatsLoading,
    refetch: refetchProductStats,
  } = useProductStats();

  const {
    data: userStatsResponse,
    isLoading: userStatsLoading,
    refetch: refetchUserStats,
  } = useUserStats();

  const { data: recentOrdersResponse } = useAdminOrders({ limit: 5 });

  const orderStats = orderStatsResponse?.data ?? {
    totalOrders: 0,
    totalSales: 0,
    deliveredSales: 0,
    totalCustomers: 0,
    pendingOrders: 0,
    deliveredOrders: 0,
  };

  const productStats = productStatsResponse?.data ?? {
    totalProducts: 0,
    menProducts: 0,
    womenProducts: 0,
    unisexProducts: 0,
  };

  const userStats = userStatsResponse?.data ?? {
    totalUsers: 0,
    customerCount: 0,
    adminCount: 0,
    newUsersCount: 0,
  };

  const recentOrders = recentOrdersResponse?.data ?? [];
  const isRefreshing = orderStatsLoading || productStatsLoading || userStatsLoading;

  const handleRefresh = async () => {
    await Promise.all([
      refetchOrderStats(),
      refetchProductStats(),
      refetchUserStats(),
    ]);
  };

  return (
    <div className="min-h-screen bg-black p-4 text-white sm:p-6 lg:p-8">
      {/* ==================================================
          1. HEADER SECTION
      ================================================== */}
      <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <div className="flex items-center gap-3">
            <SidebarTrigger className="h-9 w-9 rounded-xl border border-[#222] bg-[#111] text-gray-400 transition hover:border-lime-400/40 hover:text-lime-300" />
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
                  Dashboard
                </h1>
                <span className="rounded-full border border-lime-400/30 bg-lime-400/10 px-2.5 py-0.5 text-xs font-semibold text-lime-300">
                  Store Overview
                </span>
              </div>
              <p className="mt-1 text-sm text-gray-400">
                Key performance metrics, live order statuses, and catalog analytics.
              </p>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="inline-flex items-center gap-2 self-start rounded-xl border border-[#222] bg-[#111] px-4 py-2.5 text-sm font-medium text-gray-300 transition hover:border-lime-400/30 hover:text-lime-300 disabled:opacity-50 md:self-auto"
        >
          <RefreshCw
            size={16}
            className={isRefreshing ? "animate-spin text-lime-400" : ""}
          />
          <span>Refresh All</span>
        </button>
      </div>

      {/* ==================================================
          2. CORE METRICS
      ================================================== */}
      <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {/* Total Sales */}
        <div className="rounded-2xl border border-[#222] bg-[#0b0b0b] p-5 transition hover:border-lime-400/30">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium uppercase tracking-wider text-gray-400">
              Total Revenue
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-lime-400/10 text-lime-400">
              <DollarSign size={18} />
            </div>
          </div>
          <p className="mt-3 text-2xl font-bold tracking-tight text-lime-300 sm:text-3xl">
            ₹{orderStats.totalSales.toLocaleString("en-IN")}
          </p>
          <p className="mt-1 text-xs text-gray-500">
            Delivered: ₹{orderStats.deliveredSales.toLocaleString("en-IN")}
          </p>
        </div>

        {/* Total Orders */}
        <div className="rounded-2xl border border-[#222] bg-[#0b0b0b] p-5 transition hover:border-lime-400/30">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium uppercase tracking-wider text-gray-400">
              Total Orders
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-400/10 text-blue-400">
              <ShoppingBag size={18} />
            </div>
          </div>
          <p className="mt-3 text-2xl font-bold tracking-tight text-white sm:text-3xl">
            {orderStats.totalOrders}
          </p>
          <p className="mt-1 text-xs text-gray-500">
            Pending: {orderStats.pendingOrders}
          </p>
        </div>

        {/* Total Products */}
        <div className="rounded-2xl border border-[#222] bg-[#0b0b0b] p-5 transition hover:border-lime-400/30">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium uppercase tracking-wider text-gray-400">
              Fragrance Catalog
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-400/10 text-purple-400">
              <Package size={18} />
            </div>
          </div>
          <p className="mt-3 text-2xl font-bold tracking-tight text-white sm:text-3xl">
            {productStats.totalProducts}
          </p>
          <p className="mt-1 text-xs text-gray-500">
            {productStats.menProducts} Men • {productStats.womenProducts} Women • {productStats.unisexProducts} Unisex
          </p>
        </div>

        {/* Total Users */}
        <div className="rounded-2xl border border-[#222] bg-[#0b0b0b] p-5 transition hover:border-lime-400/30">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium uppercase tracking-wider text-gray-400">
              Registered Users
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-yellow-400/10 text-yellow-400">
              <Users size={18} />
            </div>
          </div>
          <p className="mt-3 text-2xl font-bold tracking-tight text-white sm:text-3xl">
            {userStats.totalUsers}
          </p>
          <p className="mt-1 text-xs text-gray-500">
            {userStats.customerCount} Customers • {userStats.adminCount} Admins
          </p>
        </div>
      </div>

      {/* ==================================================
          3. QUICK ACCESS & RECENT ACTIVITY
      ================================================== */}
      <div className="grid gap-6 lg:grid-cols-12">
        {/* Quick Links Card */}
        <div className="space-y-4 lg:col-span-5">
          <h2 className="text-base font-semibold text-white">Management Sections</h2>

          <div className="space-y-3">
            <Link
              to="/admin/products"
              className="flex items-center justify-between rounded-2xl border border-[#222] bg-[#0b0b0b] p-4 transition hover:border-lime-400/40 hover:bg-[#121212]"
            >
              <div className="flex items-center gap-3.5">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-lime-400/10 text-lime-400">
                  <Package size={20} />
                </div>
                <div>
                  <h4 className="font-semibold text-white">Products Management</h4>
                  <p className="text-xs text-gray-400">
                    Add new perfumes, modify prices, update catalog
                  </p>
                </div>
              </div>
              <ArrowRight size={18} className="text-gray-500 transition group-hover:text-white" />
            </Link>

            <Link
              to="/admin/AdminOrders"
              className="flex items-center justify-between rounded-2xl border border-[#222] bg-[#0b0b0b] p-4 transition hover:border-lime-400/40 hover:bg-[#121212]"
            >
              <div className="flex items-center gap-3.5">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-400/10 text-blue-400">
                  <ShoppingBag size={20} />
                </div>
                <div>
                  <h4 className="font-semibold text-white">Orders & Shipments</h4>
                  <p className="text-xs text-gray-400">
                    Fulfill customer orders, track statuses, handle refunds
                  </p>
                </div>
              </div>
              <ArrowRight size={18} className="text-gray-500 transition group-hover:text-white" />
            </Link>

            <Link
              to="/admin/users"
              className="flex items-center justify-between rounded-2xl border border-[#222] bg-[#0b0b0b] p-4 transition hover:border-lime-400/40 hover:bg-[#121212]"
            >
              <div className="flex items-center gap-3.5">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-400/10 text-purple-400">
                  <Users size={20} />
                </div>
                <div>
                  <h4 className="font-semibold text-white">Users & Customers</h4>
                  <p className="text-xs text-gray-400">
                    Customer database, order counts, admin privileges
                  </p>
                </div>
              </div>
              <ArrowRight size={18} className="text-gray-500 transition group-hover:text-white" />
            </Link>
          </div>
        </div>

        {/* Recent Orders Overview */}
        <div className="space-y-4 lg:col-span-7">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-white">Recent Orders</h2>
            <Link
              to="/admin/AdminOrders"
              className="text-xs font-semibold text-lime-400 transition hover:underline"
            >
              View All Orders →
            </Link>
          </div>

          <div className="overflow-hidden rounded-2xl border border-[#222] bg-[#0b0b0b]">
            {recentOrders.length === 0 ? (
              <div className="p-8 text-center text-sm text-gray-500">
                No orders recorded yet.
              </div>
            ) : (
              <div className="divide-y divide-[#1a1a1a]">
                {recentOrders.map((order) => (
                  <div
                    key={order._id}
                    className="flex items-center justify-between p-4 transition hover:bg-[#121212]"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-semibold text-gray-300">
                          #{order._id?.slice(-8)}
                        </span>
                        <span className="text-xs text-gray-500">•</span>
                        <span className="text-xs text-white">
                          {order.user?.fullName || "Customer"}
                        </span>
                      </div>
                      <p className="mt-0.5 text-xs text-gray-500">
                        {order.orderItems?.length || 0} fragrance items
                      </p>
                    </div>

                    <div className="text-right">
                      <span className="font-semibold text-lime-300">
                        ₹{Number(order.totalAmount || 0).toLocaleString("en-IN")}
                      </span>
                      <p className="mt-0.5 text-xs text-gray-400">{order.status}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

import React, { useState } from "react";
import {
  Settings as SettingsIcon,
  Shield,
  Bell,
  Store,
  CreditCard,
  Save,
  CheckCircle,
} from "lucide-react";
import { toast } from "react-toastify";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useCurrentUser } from "@/hooks/auth/useAuth";

const Settings = () => {
  const { data: user } = useCurrentUser();
  const [storeName, setStoreName] = useState("ZIVARA Perfumes");
  const [supportEmail, setSupportEmail] = useState("support@zivara.com");
  const [currency, setCurrency] = useState("INR");
  const [lowStockAlert, setLowStockAlert] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);

  const handleSave = (e) => {
    e.preventDefault();
    toast.success("Store settings updated successfully");
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
                  Settings
                </h1>
                <span className="rounded-full border border-lime-400/30 bg-lime-400/10 px-2.5 py-0.5 text-xs font-semibold text-lime-300">
                  Store Preferences
                </span>
              </div>
              <p className="mt-1 text-sm text-gray-400">
                Configure your store details, alerts, and administrator profile.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl space-y-6">
        {/* Current Admin Info */}
        <div className="rounded-2xl border border-[#222] bg-[#0b0b0b] p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-lime-400/10 text-lime-400">
              <Shield size={18} />
            </div>
            <h2 className="text-lg font-bold text-white">Administrator Account</h2>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-[#222] bg-[#111] p-4">
              <p className="text-xs uppercase tracking-wider text-gray-500">Logged In As</p>
              <p className="mt-1 font-semibold text-white">{user?.fullName || "Administrator"}</p>
              <p className="text-xs text-gray-400">{user?.email}</p>
            </div>

            <div className="rounded-xl border border-[#222] bg-[#111] p-4">
              <p className="text-xs uppercase tracking-wider text-gray-500">Role Status</p>
              <p className="mt-1 font-semibold text-lime-300">Super Administrator</p>
              <p className="text-xs text-gray-400">Full platform management access</p>
            </div>
          </div>
        </div>

        {/* General Store Settings */}
        <form onSubmit={handleSave} className="rounded-2xl border border-[#222] bg-[#0b0b0b] p-6 space-y-5">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-400/10 text-blue-400">
              <Store size={18} />
            </div>
            <h2 className="text-lg font-bold text-white">General Store Details</h2>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-gray-400">
                Store Name
              </label>
              <input
                type="text"
                value={storeName}
                onChange={(e) => setStoreName(e.target.value)}
                className="w-full rounded-xl border border-[#292929] bg-[#111] px-3.5 py-2.5 text-sm text-white outline-none focus:border-lime-400"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-gray-400">
                Customer Support Email
              </label>
              <input
                type="email"
                value={supportEmail}
                onChange={(e) => setSupportEmail(e.target.value)}
                className="w-full rounded-xl border border-[#292929] bg-[#111] px-3.5 py-2.5 text-sm text-white outline-none focus:border-lime-400"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-gray-400">
                Primary Currency
              </label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full rounded-xl border border-[#292929] bg-[#111] px-3.5 py-2.5 text-sm text-white outline-none focus:border-lime-400"
              >
                <option value="INR">INR (₹ - Indian Rupee)</option>
                <option value="USD">USD ($ - US Dollar)</option>
                <option value="EUR">EUR (€ - Euro)</option>
              </select>
            </div>
          </div>

          {/* Preferences */}
          <div className="border-t border-[#1a1a1a] pt-5 space-y-4">
            <h3 className="text-sm font-semibold text-gray-300">Notifications & Alerts</h3>

            <div className="flex items-center justify-between rounded-xl border border-[#222] bg-[#111] p-4">
              <div>
                <p className="text-sm font-medium text-white">Order Email Notifications</p>
                <p className="text-xs text-gray-500">Receive alert when customer places a new order</p>
              </div>
              <input
                type="checkbox"
                checked={emailNotifications}
                onChange={(e) => setEmailNotifications(e.target.checked)}
                className="h-5 w-5 accent-lime-400"
              />
            </div>

            <div className="flex items-center justify-between rounded-xl border border-[#222] bg-[#111] p-4">
              <div>
                <p className="text-sm font-medium text-white">Inventory Stock Alerts</p>
                <p className="text-xs text-gray-500">Highlight perfumes when inventory is low</p>
              </div>
              <input
                type="checkbox"
                checked={lowStockAlert}
                onChange={(e) => setLowStockAlert(e.target.checked)}
                className="h-5 w-5 accent-lime-400"
              />
            </div>
          </div>

          <div className="flex justify-end pt-3">
            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-xl bg-lime-400 px-5 py-2.5 text-sm font-semibold text-black transition hover:bg-lime-300"
            >
              <Save size={16} />
              <span>Save Changes</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Settings;

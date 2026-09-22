import React from "react";
import { Outlet } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import AdminSidebar from "./AdminSidebar";

const AdminDashboard = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen w-full bg-[#050505] text-white flex">

        <AdminSidebar />

        <main className="flex-1 min-w-0 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </SidebarProvider>
  );
};

export default AdminDashboard;
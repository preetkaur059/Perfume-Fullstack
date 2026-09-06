import React from "react";
import { Outlet } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import AdminSidebar from "./AdminSidebar";

const AdminDashboard = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen w-full bg-[#050505] text-white flex">
        
        <AdminSidebar />

        <main className="flex-1">
          
          <header className="flex h-16 items-center border-b border-white/10 bg-[#050505] px-4">
            <SidebarTrigger />

            <div className="ml-4">
              <h1 className="font-semibold">ZIVARA Admin</h1>
              <p className="text-xs text-gray-500">
                Store Management
              </p>
            </div>
          </header>

          <div className="p-4 md:p-6">
            <Outlet />
          </div>

        </main>
      </div>
    </SidebarProvider>
  );
};

export default AdminDashboard;
import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Settings,
  LogOut,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const AdminSidebar = () => {
  const navigate = useNavigate();

  const items = [
    {
      title: "Dashboard",
      url: "/admin",
      icon: LayoutDashboard,
    },
    {
      title: "Products",
      url: "/admin/products",
      icon: Package,
    },
    {
      title: "Orders",
      url: "/admin/orders",
      icon: ShoppingCart,
    },
    {
      title: "Users",
      url: "/admin/users",
      icon: Users,
    },
    {
      title: "Settings",
      url: "/admin/settings",
      icon: Settings,
    },
  ];

  const handleLogout = () => {

    navigate("/login");
  };

  return (
    <Sidebar className="border-r border-white/10">
      <SidebarContent className="bg-[#090909] text-white">

        <SidebarGroup>
          <SidebarGroupLabel className="px-4 py-5">
            <div>
              <h1 className="text-xl font-bold tracking-[0.3em] text-lime-400">
                ZIVARA
              </h1>

              <p className="mt-1 text-xs text-gray-500">
                ADMIN PANEL
              </p>
            </div>
          </SidebarGroupLabel>

          <SidebarGroupContent className="mt-5">
            <SidebarMenu>
              {items.map((item) => {
                const Icon = item.icon;

                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <NavLink
                        to={item.url}
                        end={item.url === "/admin"}
                        className={({ isActive }) =>
                          `flex items-center gap-3 rounded-lg px-3 py-2 ${
                            isActive
                              ? "bg-lime-400 text-black hover:bg-lime-300"
                              : "text-gray-400  "
                          }`
                        }
                      >
                        <Icon size={18} />
                        <span>{item.title}</span>
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="mt-auto">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                onClick={handleLogout}
                className="text-red-400 hover:bg-red-500/10 hover:text-red-300"
              >
                <LogOut size={18} />
                <span>Logout</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>

      </SidebarContent>
    </Sidebar>
  );
};

export default AdminSidebar;
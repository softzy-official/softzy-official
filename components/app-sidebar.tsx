"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { LayoutDashboard, ShoppingCart, Users, PackageSearch, LogOut, Store } from "lucide-react";
import { signOut } from "next-auth/react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

// E-commerce Admin Menu
const items = [
  {
    title: "Dashboard",
    url: "/admin",
    icon: LayoutDashboard,
  },
  {
    title: "Orders",
    url: "/admin/orders",
    icon: ShoppingCart,
  },
  {
    title: "Customers",
    url: "/admin/users",
    icon: Users,
  },
  {
    title: "Products", 
    url: "/admin/products",
    icon: PackageSearch,
  },
];

export function AppSidebar() {
  const pathname = usePathname();

  const handleLogout = async () => {
    // Sign out and redirect firmly to the admin login specifically
    await signOut({ callbackUrl: "/auth/admin-login" });
  };

  const isActive = (url: string) => {
    // Exact match for dashboard root, otherwise startsWith for nested routes
    if (url === "/admin") return pathname === "/admin";
    return pathname.startsWith(url);
  };

  return (
    <Sidebar variant="sidebar" className="border-r shadow-sm">
      <SidebarHeader className="h-16 px-6 border-b flex items-center justify-center">
        <Link href="/admin" className="flex items-center gap-2 mt-2 w-full justify-start transition-opacity hover:opacity-80">
          <div className="flex bg-primary/10 p-1.5 rounded-lg">
             <Store className="h-5 w-5 text-primary" />
          </div>
          <span className="font-bold text-lg tracking-tight playfair text-primary">Softzy Admin</span>
        </Link>
      </SidebarHeader>
      
      <SidebarContent className="px-3 pt-6">
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
            Overview
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-2">
              {items.map((item) => {
                const active = isActive(item.url);
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton 
                      asChild 
                      tooltip={item.title}
                      isActive={active}
                      className={`transition-all duration-200 group h-11 px-3 ${
                        active 
                          ? "bg-primary text-primary-foreground font-medium shadow-sm hover:bg-primary/90 hover:text-primary-foreground" 
                          : "text-muted-foreground hover:bg-muted font-normal hover:text-foreground"
                      }`}
                    >
                      <Link href={item.url} className="flex items-center gap-3 w-full">
                        <item.icon className={`h-5 w-5 ${active ? "text-primary-foreground" : "text-muted-foreground group-hover:text-foreground"} transition-colors`} />
                        <span className="text-[15px]">{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      
      {/* Logout Footer */}
      <SidebarFooter className="p-4 border-t">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton 
              onClick={handleLogout} 
              className="h-11 px-3 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/20 transition-all font-medium rounded-lg"
            >
              <LogOut className="h-5 w-5" />
              <span className="text-[15px]">Log out</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
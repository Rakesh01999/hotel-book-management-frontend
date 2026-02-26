"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  BedDouble, 
  CalendarCheck, 
  Users, 
  Folders,
  LogOut,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/useAuthStore";
import { useState } from "react";
import { toast } from "sonner";
import api from "@/lib/axios";
import { useRouter } from "next/navigation";

const AdminSidebar = () => {
  const pathname = usePathname();
  const { user, logout } = useAuthStore();
  const [collapsed, setCollapsed] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await api.post("/auth/logout");
      logout();
      toast.success("Logged out successfully");
      router.push("/");
    } catch (error) {
      logout();
      router.push("/");
    }
  };

  const navItems = [
    { name: "Overview", href: "/admin", icon: LayoutDashboard },
    { name: "Bookings", href: "/admin/bookings", icon: CalendarCheck },
    { name: "Room Categories", href: "/admin/room-types", icon: Folders },
    { name: "Rooms", href: "/admin/rooms", icon: BedDouble },
    { name: "Users", href: "/admin/users", icon: Users },
  ];

  return (
    <div 
      className={cn(
        "relative hidden md:flex flex-col h-[calc(100vh-4rem)] border-r transition-all duration-300 ease-in-out z-10",
        "dark:bg-slate-900 dark:text-slate-100 bg-white text-slate-900",
        collapsed ? "w-16" : "w-64"
      )}
    >
      <div className="flex-1 overflow-y-auto py-4">
        <nav className="px-3 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-4 px-3 py-3 rounded-lg text-base font-medium transition-colors group",
                  isActive 
                    ? "bg-primary text-primary-foreground shadow-sm" 
                    : "dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                )}
              >
                <item.icon className={cn("h-5 w-5 shrink-0", !isActive && "group-hover:scale-110 transition-transform")} />
                {!collapsed && <span>{item.name}</span>}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="p-4 border-t dark:border-slate-800 border-slate-200">
        <Button
          variant="ghost"
          size="lg"
          className={cn(
            "w-full flex items-center gap-4 px-3 py-3 text-base text-red-400 dark:hover:bg-red-950 dark:hover:text-red-300 hover:bg-red-50 hover:text-red-600",
            collapsed ? "justify-center" : "justify-start"
          )}
          onClick={handleLogout}
        >
          <LogOut className="h-5 w-5 shrink-0" />
          {!collapsed && <span>Logout</span>}
        </Button>
      </div>

      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-1/2 -translate-y-1/2 h-6 w-6 rounded-full border dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200 bg-white text-slate-600 flex items-center justify-center hover:bg-slate-50 transition-colors shadow-sm"
      >
        {collapsed ? <ChevronRight className="h-3 w-3" /> : <ChevronLeft className="h-3 w-3" />}
      </button>
    </div>
  );
};

export default AdminSidebar;

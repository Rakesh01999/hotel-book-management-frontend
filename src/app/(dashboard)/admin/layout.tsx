"use client";

import AdminSidebar from "@/components/layout/AdminSidebar";
import DashboardMobileNav from "@/components/layout/DashboardMobileNav";
import { useAuthStore } from "@/store/useAuthStore";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { 
  LayoutDashboard, 
  BedDouble, 
  CalendarCheck, 
  Users, 
  Folders
} from "lucide-react";

const navItems = [
  { name: "Overview", href: "/admin", icon: LayoutDashboard },
  { name: "Bookings", href: "/admin/bookings", icon: CalendarCheck },
  { name: "Room Categories", href: "/admin/room-types", icon: Folders },
  { name: "Rooms", href: "/admin/rooms", icon: BedDouble },
  { name: "Users", href: "/admin/users", icon: Users },
];

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, user } = useAuthStore();
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient && !isAuthenticated) {
      router.push("/login");
    } else if (isClient && isAuthenticated && user?.role !== "ADMIN") {
      router.push("/user");
    }
  }, [isClient, isAuthenticated, user, router]);

  if (!isClient || !isAuthenticated || user?.role !== "ADMIN") {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-8 w-8 rounded-full border-4 border-primary border-t-transparent animate-spin mb-4"></div>
          <p className="text-muted-foreground">Authenticating Admin Access...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row h-screen md:h-[calc(100vh-4rem)] bg-muted/10">
      <DashboardMobileNav navItems={navItems} title="Admin Dashboard" role="ADMIN" />
      <AdminSidebar />
      <main className="flex-1 overflow-y-auto p-4 md:p-10">
        <div className="max-w-7xl mx-auto h-full">
            {children}
        </div>
      </main>
    </div>
  );
}

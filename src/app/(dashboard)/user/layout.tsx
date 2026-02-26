"use client";

import DashboardSidebar from "@/components/layout/DashboardSidebar";
import DashboardMobileNav from "@/components/layout/DashboardMobileNav";
import { useAuthStore } from "@/store/useAuthStore";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { 
  LayoutDashboard, 
  Settings, 
  Calendar, 
  User
} from "lucide-react";

const navItems = [
  { name: "Overview", href: "/user", icon: LayoutDashboard },
  { name: "My Bookings", href: "/user/bookings", icon: Calendar },
  { name: "Profile", href: "/user/profile", icon: User },
  { name: "Settings", href: "/user/settings", icon: Settings },
];

export default function UserDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) return null;

  return (
    <div className="flex flex-col md:flex-row h-screen md:h-[calc(100vh-4rem)] bg-muted/20">
      <DashboardMobileNav navItems={navItems} title="User Dashboard" role="USER" />
      <DashboardSidebar />
      <main className="flex-1 overflow-y-auto p-4 md:p-10">
        <div className="max-w-7xl mx-auto h-full">
            {children}
        </div>
      </main>
    </div>
  );
}

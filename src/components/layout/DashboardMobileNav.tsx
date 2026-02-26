"use client";

import Link from "next/link";
import { Menu, LayoutDashboard, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import api from "@/lib/axios";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { LucideIcon } from "lucide-react";

interface NavItem {
  name: string;
  href: string;
  icon: LucideIcon;
}

interface DashboardMobileNavProps {
  navItems: NavItem[];
  title?: string;
  role?: "ADMIN" | "USER";
}

const DashboardMobileNav = ({ navItems, title = "Menu", role = "USER" }: DashboardMobileNavProps) => {
  const pathname = usePathname();
  const { logout } = useAuthStore();
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

  return (
    <div className="md:hidden flex items-center justify-between p-4 border-b bg-background sticky top-0 z-40">
      <div className="flex items-center gap-2">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className={cn("w-72 p-0", role === "ADMIN" ? "bg-slate-900" : "bg-card")}>
            <SheetHeader className={cn("p-6 border-b", role === "ADMIN" ? "bg-slate-900 border-slate-800" : "bg-card")}>
              <SheetTitle className={cn("flex items-center gap-3 text-lg font-bold", role === "ADMIN" ? "text-white" : "text-foreground")}>
                <LayoutDashboard className="h-6 w-6" />
                {role === "ADMIN" ? "Admin Panel" : "Dashboard"}
              </SheetTitle>
            </SheetHeader>
            <div className={cn("flex flex-col h-full", role === "ADMIN" ? "bg-slate-900 text-slate-100" : "bg-card text-foreground")}>
               <nav className="flex-1 px-4 py-6 space-y-2">
                {navItems.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        "flex items-center gap-4 px-4 py-3 rounded-xl text-base font-semibold transition-all",
                        isActive 
                          ? "bg-primary text-primary-foreground shadow-md scale-[1.02]" 
                          : role === "ADMIN" 
                            ? "text-slate-400 hover:bg-slate-800 hover:text-white"
                            : "text-muted-foreground hover:bg-muted hover:text-foreground"
                      )}
                    >
                      <item.icon className="h-5 w-5 shrink-0" />
                      <span>{item.name}</span>
                    </Link>
                  );
                })}
              </nav>
              <div className={cn("p-6 border-t mb-8", role === "ADMIN" ? "border-slate-800" : "border-border")}>
                <Button
                  variant="ghost"
                  size="lg"
                  className={cn(
                    "w-full flex items-center justify-start gap-4 px-4 py-3 text-base font-semibold",
                    role === "ADMIN" ? "text-red-400 hover:bg-red-950 hover:text-red-300" : "text-destructive hover:bg-destructive/10"
                  )}
                  onClick={handleLogout}
                >
                  <LogOut className="h-5 w-5 shrink-0" />
                  <span>Logout</span>
                </Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>
        <span className="font-semibold text-lg">{title}</span>
      </div>
    </div>
  );
};

export default DashboardMobileNav;

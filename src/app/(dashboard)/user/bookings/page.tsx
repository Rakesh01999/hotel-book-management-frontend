"use client";

import * as React from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { useBookingStore } from "@/store/useBookingStore";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Calendar, 
  MapPin, 
  Users, 
  Clock, 
  ArrowRight, 
  ChevronRight,
  Search,
  PackageOpen,
  CreditCard,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Sparkles,
  Receipt
} from "lucide-react";
import { format } from "date-fns";
import Image from "next/image";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const StatusBadge = ({ status }: { status: string }) => {
  const statusStyles = {
    CONFIRMED: "bg-emerald-500/10 text-emerald-600 border-emerald-200/50 shadow-[0_0_10px_rgba(16,185,129,0.1)]",
    PENDING_PAYMENT: "bg-amber-500/10 text-amber-600 border-amber-200/50 shadow-[0_0_10px_rgba(245,158,11,0.1)]",
    CANCELLED: "bg-destructive/10 text-destructive border-destructive/20 shadow-[0_0_10px_rgba(239,68,68,0.05)]",
  };

  const statusIcons = {
    CONFIRMED: <CheckCircle2 className="h-3 w-3 mr-1.5" />,
    PENDING_PAYMENT: <Clock className="h-3 w-3 mr-1.5" />,
    CANCELLED: <XCircle className="h-3 w-3 mr-1.5" />,
  };

  const style = statusStyles[status as keyof typeof statusStyles] || "bg-muted text-muted-foreground";
  const icon = statusIcons[status as keyof typeof statusIcons] || <AlertCircle className="h-3 w-3 mr-1.5" />;

  return (
    <Badge variant="outline" className={cn("flex items-center backdrop-blur-md px-3 py-1 text-[10px] font-bold tracking-wider uppercase border", style)}>
      {icon}
      {status.replace("_", " ")}
    </Badge>
  );
};

export default function MyBookingsPage() {
  const { user } = useAuthStore();
  const { userBookings, fetchUserBookings, isLoading } = useBookingStore();
  const [searchTerm, setSearchTerm] = React.useState("");
  const [activeFilter, setActiveFilter] = React.useState("ALL");

  React.useEffect(() => {
    if (user?.id) {
      fetchUserBookings(user.id);
    }
  }, [user?.id, fetchUserBookings]);

  const filteredBookings = userBookings?.filter(booking => {
    const matchesSearch = (booking.id?.toString() || "").includes(searchTerm) || 
                         (booking.rooms?.[0]?.room?.roomType?.name?.toLowerCase() || "").includes(searchTerm.toLowerCase());
    const matchesFilter = activeFilter === "ALL" || booking.status === activeFilter;
    return matchesSearch && matchesFilter;
  }) || [];

  return (
    <div className="max-w-6xl mx-auto px-4 pb-20 space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-1000">
      {/* Hero Header */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary/5 via-background to-primary/10 border border-primary/10 p-8 md:p-12">
        <div className="absolute top-0 right-0 -uht-20 -uh-20 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 -uht-20 -uh-20 w-64 h-64 bg-primary/10 rounded-full blur-3xl opacity-50" />
        
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-4 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Exclusive Access</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
              My Collections
            </h1>
            <p className="text-muted-foreground text-lg max-w-md leading-relaxed">
              Your curated list of premium stays and upcoming luxury experiences.
            </p>
          </div>
          <Link href="/rooms">
            <Button size="lg" className="h-14 px-8 text-md font-bold rounded-2xl shadow-2xl shadow-primary/30 hover:scale-105 transition-all group">
              Plan New Escape
              <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Filter Bar */}
      <div className="sticky top-4 z-30">
        <Card className="backdrop-blur-xl bg-background/80 border-primary/10 shadow-2xl shadow-black/5 rounded-2xl overflow-hidden">
          <CardContent className="p-3 flex flex-col lg:flex-row items-stretch lg:items-center gap-4">
            <div className="relative flex-1 group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <Input 
                placeholder="Search stays..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="h-12 pl-12 bg-transparent border-none focus-visible:ring-0 text-md placeholder:text-muted-foreground/50"
              />
            </div>
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0 scrollbar-none">
              {["ALL", "CONFIRMED", "PENDING_PAYMENT", "CANCELLED"].map(filter => (
                <Button
                  key={filter}
                  variant="ghost"
                  size="sm"
                  onClick={() => setActiveFilter(filter)}
                  className={cn(
                    "h-10 px-5 rounded-xl text-sm font-semibold transition-all shrink-0",
                    activeFilter === filter 
                      ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20 hover:bg-primary" 
                      : "hover:bg-primary/5 text-muted-foreground hover:text-foreground"
                  )}
                >
                  {filter === "ALL" ? "Everything" : filter.replace("_", " ")}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 gap-8">
          {[1, 2].map(i => (
            <div key={i} className="flex flex-col md:flex-row gap-6 p-4 rounded-3xl border border-muted animate-pulse">
              <div className="w-full md:w-80 h-56 bg-muted rounded-2xl" />
              <div className="flex-1 space-y-6 py-4">
                <div className="h-8 w-1/3 bg-muted rounded-lg" />
                <div className="h-24 w-full bg-muted/50 rounded-lg" />
              </div>
            </div>
          ))}
        </div>
      ) : filteredBookings.length > 0 ? (
        <div className="grid grid-cols-1 gap-10">
          {filteredBookings.map((booking) => (
            <div key={booking.id} className="group relative flex flex-col md:flex-row bg-card border border-primary/5 rounded-[2.5rem] overflow-hidden hover:shadow-2xl hover:shadow-primary/5 hover:border-primary/10 transition-all duration-700">
              {/* Image Section */}
              <div className="relative w-full md:w-[26rem] h-64 md:h-auto overflow-hidden">
                <Image
                  src={booking.rooms?.[0]?.room?.roomType?.images?.[0] || "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=2070&auto=format&fit=crop"}
                  alt="Room Image"
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-1000 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent md:hidden" />
                <div className="absolute top-6 left-6 z-10 scale-110">
                  <StatusBadge status={booking.status} />
                </div>
              </div>

              {/* Content Section */}
              <div className="flex-1 p-8 md:p-10 flex flex-col justify-between">
                <div>
                  <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-8">
                    <div className="space-y-2">
                       <div className="flex items-center gap-2 text-primary/80">
                         <MapPin className="h-4 w-4" />
                         <span className="text-[11px] font-black uppercase tracking-[0.2em]">Luxury Oasis • Hotel Mobarauk Al Madinah</span>
                       </div>
                       <h3 className="text-3xl font-black tracking-tight leading-tight group-hover:text-primary transition-colors duration-500">
                        {booking.rooms?.[0]?.room?.roomType?.name || "Premium Sanctuary"}
                       </h3>
                       <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-muted/50 text-muted-foreground font-mono text-xs">
                         <Receipt className="h-3 w-3" />
                         BK-{booking.id.toString().padStart(6, '0')}
                       </div>
                    </div>
                    <div className="text-left sm:text-right">
                      <div className="text-3xl font-black tracking-tight text-primary flex items-baseline gap-1">
                        <span className="text-lg opacity-50">$</span>
                        {booking.totalAmount}
                      </div>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mt-1">Confirmed Rate</p>
                    </div>
                  </div>

                  {/* Grid Stats */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 p-6 rounded-3xl bg-muted/30 border border-primary/5 group-hover:bg-primary/[0.02] transition-colors">
                    {[
                      { icon: Calendar, label: "Check In", value: format(new Date(booking.checkIn), "MMM dd, yyyy") },
                      { icon: Calendar, label: "Check Out", value: format(new Date(booking.checkOut), "MMM dd, yyyy") },
                      { icon: Users, label: "Stay Party", value: `${booking.adults} Adults, ${booking.children} Child` },
                      { icon: CreditCard, label: "Payment", value: booking.status === 'CONFIRMED' ? "Settled" : "Pending" }
                    ].map((stat, idx) => (
                      <div key={idx} className="space-y-1.5">
                        <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/70">{stat.label}</span>
                        <div className="flex items-center gap-2 font-bold text-sm">
                          <stat.icon className="h-4 w-4 text-primary/60 shrink-0" />
                          <span className="truncate">{stat.value}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mt-8 pt-4">
                   <div className="flex items-center gap-3">
                      <div className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                      <span className="text-xs font-semibold text-muted-foreground">Ready for your visit</span>
                   </div>
                   <div className="flex items-center gap-3">
                    {booking.status === 'PENDING_PAYMENT' && (
                       <Button className="h-12 px-6 bg-primary text-primary-foreground font-bold rounded-xl shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all">
                         Settle Dues
                         <CreditCard className="h-4 w-4 ml-2" />
                       </Button>
                    )}
                    <Button variant="outline" className="h-12 px-6 rounded-xl border-primary/10 hover:bg-primary/5 hover:border-primary/20 font-bold transition-all group/btn">
                      Dashboard View
                      <ChevronRight className="h-4 w-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                    </Button>
                   </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <Card className="border-2 border-dashed border-primary/10 bg-transparent rounded-[2.5rem] py-24">
          <CardContent className="flex flex-col items-center justify-center text-center space-y-8">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/20 blur-[50px] rounded-full" />
              <div className="relative h-32 w-32 rounded-[2rem] bg-gradient-to-br from-primary/10 to-transparent flex items-center justify-center border border-primary/10">
                <PackageOpen className="h-16 w-16 text-primary/40" />
              </div>
            </div>
            <div className="space-y-3 px-6">
              <h3 className="text-3xl font-black tracking-tight italic">Silent Horizon</h3>
              <p className="text-muted-foreground max-w-md text-lg leading-relaxed">
                {searchTerm || activeFilter !== "ALL" 
                  ? "We couldn't find any journeys matching your current lens. Try expanding your search."
                  : "No stories written yet. Where will your next chapter take you?"}
              </p>
            </div>
            <Link href="/rooms">
              <Button size="lg" className="h-14 px-10 rounded-2xl font-black uppercase tracking-widest shadow-2xl shadow-primary/20">
                Begin Exploration
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

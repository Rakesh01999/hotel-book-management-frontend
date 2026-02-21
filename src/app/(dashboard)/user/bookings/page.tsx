"use client";

import * as React from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { useBookingStore } from "@/store/useBookingStore";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
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
  Filter,
  PackageOpen,
  CreditCard,
  CheckCircle2,
  XCircle,
  AlertCircle
} from "lucide-react";
import { format } from "date-fns";
import Image from "next/image";
import Link from "next/link";
import { Input } from "@/components/ui/input";

const StatusBadge = ({ status }: { status: string }) => {
  const statusStyles = {
    CONFIRMED: "bg-emerald-500/10 text-emerald-600 border-emerald-200",
    PENDING_PAYMENT: "bg-amber-500/10 text-amber-600 border-amber-200",
    CANCELLED: "bg-destructive/10 text-destructive border-destructive/20",
  };

  const statusIcons = {
    CONFIRMED: <CheckCircle2 className="h-3 w-3 mr-1" />,
    PENDING_PAYMENT: <Clock className="h-3 w-3 mr-1" />,
    CANCELLED: <XCircle className="h-3 w-3 mr-1" />,
  };

  const style = statusStyles[status as keyof typeof statusStyles] || "bg-muted text-muted-foreground";
  const icon = statusIcons[status as keyof typeof statusIcons] || <AlertCircle className="h-3 w-3 mr-1" />;

  return (
    <Badge variant="outline" className={`${style} flex items-center py-1`}>
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
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">My Bookings</h1>
          <p className="text-muted-foreground">Manage your stay reservations and payment status.</p>
        </div>
        <Link href="/rooms">
          <Button className="shadow-lg shadow-primary/20">
            Book New Stay
          </Button>
        </Link>
      </div>

      <Card className="border-none shadow-sm bg-muted/30">
        <CardContent className="p-4 flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search by Booking ID or Room Type..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-background"
            />
          </div>
          <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0">
            {["ALL", "CONFIRMED", "PENDING_PAYMENT", "CANCELLED"].map(filter => (
              <Button
                key={filter}
                variant={activeFilter === filter ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveFilter(filter)}
                className="whitespace-nowrap transition-all"
              >
                {filter === "ALL" ? "All Bookings" : filter.replace("_", " ")}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {isLoading ? (
        <div className="grid grid-cols-1 gap-6">
          {[1, 2, 3].map(i => (
            <Card key={i} className="overflow-hidden border-none shadow-sm h-48 animate-pulse">
              <div className="flex flex-col md:flex-row h-full">
                <div className="w-full md:w-64 bg-muted h-32 md:h-full" />
                <div className="flex-1 p-6 space-y-4">
                  <div className="h-6 w-1/3 bg-muted rounded" />
                  <div className="h-4 w-2/3 bg-muted rounded" />
                  <div className="h-8 w-1/4 bg-muted rounded" />
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : filteredBookings.length > 0 ? (
        <div className="grid grid-cols-1 gap-6">
          {filteredBookings.map((booking) => (
            <Card key={booking.id} className="overflow-hidden border-none shadow-sm hover:shadow-md transition-all group">
              <div className="flex flex-col md:flex-row">
                <div className="relative w-full md:w-64 h-48 md:h-auto overflow-hidden">
                  <Image
                    src={booking.rooms?.[0]?.room?.roomType?.images?.[0] || "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=2070&auto=format&fit=crop"}
                    alt="Room Image"
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4">
                    <StatusBadge status={booking.status} />
                  </div>
                </div>
                <div className="flex-1 p-6 flex flex-col justify-between">
                  <div className="space-y-4">
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-primary font-semibold text-sm uppercase tracking-wider">
                          <PackageOpen className="h-4 w-4" />
                          <span>Luxury Stay</span>
                        </div>
                        <h3 className="text-2xl font-bold tracking-tight">
                          {booking.rooms?.[0]?.room?.roomType?.name || "Premium Suite"}
                        </h3>
                        <p className="text-muted-foreground text-sm flex items-center gap-1 font-mono">
                          #BK-{booking.id.toString().padStart(6, '0')}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-black text-primary">${booking.totalAmount}</p>
                        <p className="text-xs text-muted-foreground">Total inclusive tax</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-4 border-y border-dashed">
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest">Check In</span>
                        <div className="flex items-center gap-2 font-medium text-sm">
                          <Calendar className="h-3.5 w-3.5 text-primary" />
                          {format(new Date(booking.checkIn), "MMM dd, yyyy")}
                        </div>
                      </div>
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest">Check Out</span>
                        <div className="flex items-center gap-2 font-medium text-sm">
                          <Calendar className="h-3.5 w-3.5 text-primary" />
                          {format(new Date(booking.checkOut), "MMM dd, yyyy")}
                        </div>
                      </div>
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest">Guests</span>
                        <div className="flex items-center gap-2 font-medium text-sm">
                          <Users className="h-3.5 w-3.5 text-primary" />
                          {booking.adults} Adults, {booking.children} Child
                        </div>
                      </div>
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest">Payment</span>
                        <div className="flex items-center gap-2 font-medium text-sm">
                          <CreditCard className="h-3.5 w-3.5 text-primary" />
                          {booking.status === 'CONFIRMED' ? "Paid" : "Pending"}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-6">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <MapPin className="h-3 w-3" />
                      <span>Antigravity Luxury Hotel & Spa</span>
                    </div>
                    {booking.status === 'PENDING_PAYMENT' && (
                       <Button size="sm" className="gap-2 bg-amber-500 hover:bg-amber-600 text-white border-none">
                         Complete Payment
                         <ArrowRight className="h-4 w-4" />
                       </Button>
                    )}
                    <Button variant="ghost" size="sm" className="text-primary hover:bg-primary/5 hover:text-primary group/btn">
                      View Details
                      <ChevronRight className="h-4 w-4 ml-1 group-hover/btn:translate-x-1 transition-transform" />
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="border-dashed border-2 bg-transparent">
          <CardContent className="flex flex-col items-center justify-center py-20 text-center space-y-6">
            <div className="h-24 w-24 rounded-full bg-muted/50 flex items-center justify-center">
              <PackageOpen className="h-12 w-12 text-muted-foreground/50" />
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-bold">No bookings found</h3>
              <p className="text-muted-foreground max-w-sm">
                {searchTerm || activeFilter !== "ALL" 
                  ? "We couldn't find any bookings matching your current filters. Try adjusting your search."
                  : "You haven't made any reservations yet. Start planning your luxury getaway today!"}
              </p>
            </div>
            {(searchTerm || activeFilter !== "ALL") ? (
              <Button variant="outline" onClick={() => { setSearchTerm(""); setActiveFilter("ALL"); }}>
                Clear All Filters
              </Button>
            ) : (
              <Link href="/rooms">
                <Button className="h-12 px-8 text-lg font-semibold shadow-xl shadow-primary/20">
                  Explore Luxury Rooms
                </Button>
              </Link>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

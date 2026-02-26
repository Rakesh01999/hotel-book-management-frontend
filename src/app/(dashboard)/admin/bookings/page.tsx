"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, XCircle, AlertCircle } from "lucide-react";
import api from "@/lib/axios";
import { toast } from "sonner";
import { Booking } from "@/types/booking"; // Central type
import { ActionConfirmModal } from "@/components/modals/ActionConfirmModal";


/* Removed local Booking interface */


export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchName, setSearchName] = useState("");
  const [searchEmail, setSearchEmail] = useState("");
  const [searchDate, setSearchDate] = useState("");
  const [searchCheckIn, setSearchCheckIn] = useState("");
  const [searchCheckOut, setSearchCheckOut] = useState("");
  const [searchTerm, setSearchTerm] = useState(""); // Kept for general or ID search if needed
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const limit = 10;
  const [isCancelling, setIsCancelling] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState<number | null>(null);

  const fetchBookings = async (page: number = currentPage) => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      params.append('page', page.toString());
      params.append('limit', limit.toString());
      if (searchName) params.append('name', searchName);
      if (searchEmail) params.append('email', searchEmail);
      if (searchDate) params.append('date', searchDate);
      if (searchCheckIn) params.append('checkIn', searchCheckIn);
      if (searchCheckOut) params.append('checkOut', searchCheckOut);
      if (searchTerm) params.append('searchTerm', searchTerm);

      const response = await api.get(`/book?${params.toString()}`);
      const responseData = response.data?.data;
      setBookings(responseData?.data || []);
      setTotalPages(Math.ceil((responseData?.meta?.total || 0) / limit));
      setTotalItems(responseData?.meta?.total || 0);
    } catch (error: unknown) {
      console.error("Failed to fetch bookings:", error);
      const message = error instanceof Error ? error.message : "Failed to load bookings";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings(1);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchBookings(1);
  };

  const clearSearch = () => {
    setSearchName("");
    setSearchEmail("");
    setSearchDate("");
    setSearchCheckIn("");
    setSearchCheckOut("");
    setSearchTerm("");
    setCurrentPage(1);
    setIsLoading(true);
    api.get(`/book?page=1&limit=${limit}`).then((response) => {
      const responseData = response.data?.data;
      setBookings(responseData?.data || []);
      setTotalPages(Math.ceil((responseData?.meta?.total || 0) / limit));
      setTotalItems(responseData?.meta?.total || 0);
      setIsLoading(false);
    });
  };

  const handleCancelBooking = (id: number) => {
    setSelectedBookingId(id);
    setIsModalOpen(true);
  };

  const confirmCancel = async () => {
    if (!selectedBookingId) return;
    
    setIsCancelling(selectedBookingId);
    try {
      await api.patch(`/book/cancel/${selectedBookingId}`);
      toast.success("Booking cancelled successfully");
      fetchBookings(); // Refresh the list
      setIsModalOpen(false);
    } catch (error: unknown) {
      console.error("Failed to cancel booking:", error);
      const message = error instanceof Error ? error.message : "Failed to cancel booking";
      toast.error(message);
    } finally {
      setIsCancelling(null);
      setSelectedBookingId(null);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "CONFIRMED":
      case "COMPLETED":
        return <Badge className="bg-green-500 hover:bg-green-600">{status}</Badge>;
      case "PENDING":
      case "PENDING_PAYMENT":
        return <Badge className="bg-yellow-500 hover:bg-yellow-600">{status}</Badge>;
      case "CANCELLED":
        return <Badge variant="destructive">{status}</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-bold">Bookings Management</h1>
      </div>

      <Card className="border-none shadow-md">
        <CardHeader className="bg-muted/30 border-b flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-4">
          <CardTitle className="text-lg">All Reservations</CardTitle>
          <form onSubmit={handleSearch} className="flex flex-col gap-4 w-full">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Guest Name..."
                  className="pl-8 bg-background h-9 text-sm"
                  value={searchName}
                  onChange={(e) => setSearchName(e.target.value)}
                />
              </div>
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Guest Email..."
                  className="bg-background h-9 text-sm"
                  value={searchEmail}
                  onChange={(e) => setSearchEmail(e.target.value)}
                />
              </div>
              <div className="flex flex-col">
                <Input
                  type="date"
                  className="bg-background h-9 text-xs"
                  value={searchDate}
                  onChange={(e) => setSearchDate(e.target.value)}
                  title="Any date overlapping"
                />
                <span className="text-[10px] text-muted-foreground mt-0.5 px-1">Overlapping Date</span>
              </div>
              <div className="flex flex-col">
                <Input
                  type="date"
                  className="bg-background h-9 text-xs"
                  value={searchCheckIn}
                  onChange={(e) => setSearchCheckIn(e.target.value)}
                  title="Check-In from"
                />
                <span className="text-[10px] text-muted-foreground mt-0.5 px-1">Check-In From</span>
              </div>
              <div className="flex flex-col">
                <Input
                  type="date"
                  className="bg-background h-9 text-xs"
                  value={searchCheckOut}
                  onChange={(e) => setSearchCheckOut(e.target.value)}
                  title="Check-Out until"
                />
                <span className="text-[10px] text-muted-foreground mt-0.5 px-1">Check-Out Until</span>
              </div>
              <div className="flex gap-2">
                <Button type="submit" size="sm" className="flex-1 h-9">Search</Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm" 
                  onClick={clearSearch}
                  className="px-2 h-9"
                >
                  <XCircle className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </form>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50 hover:bg-muted/50">
                  <TableHead className="w-[80px]">ID</TableHead>
                  <TableHead>Guest</TableHead>
                  <TableHead>Dates</TableHead>
                  <TableHead>Rooms</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell><Skeleton className="h-4 w-8" /></TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-24 mb-2" />
                        <Skeleton className="h-3 w-32" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-20 mb-2" />
                        <Skeleton className="h-3 w-16" />
                      </TableCell>
                      <TableCell><Skeleton className="h-4 w-12" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                      <TableCell><Skeleton className="h-6 w-20 rounded-full" /></TableCell>
                      <TableCell><Skeleton className="h-8 w-20 ml-auto" /></TableCell>
                    </TableRow>
                  ))
                ) : bookings.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-48 text-center text-muted-foreground">
                      <div className="flex flex-col items-center justify-center space-y-2">
                        <AlertCircle className="h-8 w-8 text-muted-foreground/50" />
                        <p>No bookings found.</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  bookings.map((booking) => (
                    <TableRow key={booking.id} className="cursor-default hover:bg-muted/30">
                      <TableCell className="font-medium">#{booking.id}</TableCell>
                      <TableCell>
                        <div className="font-medium">{booking.user?.name || "Unknown"}</div>
                        <div className="text-xs text-muted-foreground">{booking.user?.email}</div>
                        <div className="text-xs text-muted-foreground">ID: {booking.user?.id}</div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <span className="text-muted-foreground">In:</span> {format(new Date(booking.checkIn), "MMM dd, yyyy")}
                        </div>
                        <div className="text-sm">
                          <span className="text-muted-foreground">Out:</span> {format(new Date(booking.checkOut), "MMM dd, yyyy")}
                        </div>
                      </TableCell>
                      <TableCell className="text-sm">
                        {booking.rooms?.length || 0} Room(s)
                        <div className="text-xs text-muted-foreground">
                          {booking.adults}A, {booking.children}C
                        </div>
                      </TableCell>
                      <TableCell className="font-bold">
                        ${booking.totalAmount?.toLocaleString()}
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(booking.status)}
                      </TableCell>
                      <TableCell className="text-right">
                        {booking.status !== "CANCELLED" && (
                          <Button 
                            variant="destructive" 
                            size="sm" 
                            onClick={() => handleCancelBooking(booking.id)}
                            disabled={isCancelling === booking.id}
                            className="bg-red-500/10 text-red-600 hover:bg-red-500 hover:text-white border-transparent"
                          >
                            {isCancelling === booking.id ? "..." : "Cancel"}
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
          
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 p-6 border-t bg-muted/10">
            <div className="text-sm text-muted-foreground">
              Showing <span className="font-medium">{bookings.length}</span> of <span className="font-medium">{totalItems}</span> bookings
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground mr-2">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const newPage = currentPage - 1;
                  setCurrentPage(newPage);
                  fetchBookings(newPage);
                }}
                disabled={currentPage <= 1 || isLoading}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const newPage = currentPage + 1;
                  setCurrentPage(newPage);
                  fetchBookings(newPage);
                }}
                disabled={currentPage >= totalPages || isLoading}
              >
                Next
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <ActionConfirmModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={confirmCancel}
        title="Cancel Booking"
        description="Are you sure you want to cancel this booking? This action will notify the guest and cannot be undone."
        confirmText="Yes, Cancel Booking"
        isLoading={isCancelling !== null}
      />
    </div>
  );
}

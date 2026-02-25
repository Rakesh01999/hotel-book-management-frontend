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
  const [searchTerm, setSearchTerm] = useState("");
  const [isCancelling, setIsCancelling] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState<number | null>(null);

  const fetchBookings = async (search?: string) => {
    setIsLoading(true);
    try {
      const url = search ? `/book?searchTerm=${search}` : '/book?page=1&limit=100';
      const response = await api.get(url);
      setBookings(response.data?.data?.data || []);
    } catch (error: unknown) {
      console.error("Failed to fetch bookings:", error);
      const message = error instanceof Error ? error.message : "Failed to load bookings";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchBookings(searchTerm);
  };

  const clearSearch = () => {
    setSearchTerm("");
    fetchBookings();
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
      fetchBookings(searchTerm); // Refresh the list
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
          <form onSubmit={handleSearch} className="flex w-full sm:max-w-sm items-center space-x-2">
            <div className="relative w-full">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search by User ID..."
                className="pl-8 bg-background"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <button 
                  type="button" 
                  onClick={clearSearch}
                  className="absolute right-2.5 top-2.5 text-muted-foreground hover:text-foreground"
                >
                  <XCircle className="h-4 w-4" />
                </button>
              )}
            </div>
            <Button type="submit" size="sm" variant="secondary">Filter</Button>
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

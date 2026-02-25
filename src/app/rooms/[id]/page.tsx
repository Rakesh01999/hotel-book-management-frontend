"use client";

import * as React from "react";
import { useParams } from "next/navigation";
import { useRoomStore } from "@/store/useRoomStore";
import { useBookingStore } from "@/store/useBookingStore";
import { useAuthStore } from "@/store/useAuthStore";
import { useTranslation } from "@/hooks/useTranslation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Check, Star, Coffee, Wifi, Tv, MapPin, Users, Maximize, Calendar as CalendarIcon, Info, ArrowRight, Key } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function RoomDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const { t } = useTranslation();
  const { currentRoomType, isLoading, fetchRoomTypeById } = useRoomStore();
  const { createBooking, isLoading: isBookingLoading } = useBookingStore();
  const { user, isAuthenticated } = useAuthStore();
  
  const [activeImage, setActiveImage] = React.useState(0);
  const [isBookingModalOpen, setIsBookingModalOpen] = React.useState(false);
  const [availableRoomsCount, setAvailableRoomsCount] = React.useState<number | null>(null);
  const [isCheckingAvailability, setIsCheckingAvailability] = React.useState(false);
  const [bookedRoomIds, setBookedRoomIds] = React.useState<number[]>([]);
  const [availableRoomsList, setAvailableRoomsList] = React.useState<any[]>([]);
  const [selectedRoomIds, setSelectedRoomIds] = React.useState<number[]>([]);
  
  // Booking Form State
  const [checkIn, setCheckIn] = React.useState("");
  const [checkOut, setCheckOut] = React.useState("");
  const [adults, setAdults] = React.useState("1");
  const [children, setChildren] = React.useState("0");

  React.useEffect(() => {
    if (id) {
      fetchRoomTypeById(Number(id));
    }
  }, [id, fetchRoomTypeById]);

  const handleOpenBookingModal = () => {
    if (!isAuthenticated) {
      toast.error("Please login to book a room");
      router.push("/login?redirect=" + (typeof window !== 'undefined' ? window.location.pathname : ''));
      return;
    }
    // reset state
    setCheckIn("");
    setCheckOut("");
    setAvailableRoomsCount(null);
    setBookedRoomIds([]);
    setSelectedRoomIds([]);
    setIsBookingModalOpen(true);
  };

  React.useEffect(() => {
    const checkRoomAvailability = async () => {
      if (checkIn && checkOut) {
        setIsCheckingAvailability(true);
        try {
          const { useBookingStore } = await import("@/store/useBookingStore");
          const store = useBookingStore.getState();
          const result = await store.checkAvailability(checkIn, checkOut);
          const specificRoomsResult = await store.checkSpecificRoomsStatus(checkIn, checkOut);
          
          if (result.success && result.data) {
            const roomData = result.data.find((r: any) => r.roomTypeId === Number(id));
            if (roomData) {
              setAvailableRoomsCount(roomData.availableRooms);
            } else {
              setAvailableRoomsCount(0); // If not found, assume 0
            }
          }

          if (specificRoomsResult.success && specificRoomsResult.data && specificRoomsResult.data.booked) {
              setBookedRoomIds(specificRoomsResult.data.booked.map((r: any) => r.roomId));
          } else {
              setBookedRoomIds([]);
          }

          if (specificRoomsResult.success && specificRoomsResult.data && specificRoomsResult.data.available) {
              const { useRoomStore } = await import("@/store/useRoomStore");
              const currentTypeRooms = useRoomStore.getState().currentRoomType?.rooms || [];
              const validRoomIds = new Set(currentTypeRooms.map((r: any) => r.id));
              const filteredAvailableRooms = specificRoomsResult.data.available.filter((r: any) => validRoomIds.has(r.roomId));
              setAvailableRoomsList(filteredAvailableRooms);
          } else {
              setAvailableRoomsList([]);
          }
          // Clear selections when dates change
          setSelectedRoomIds([]);
        } catch (error) {
          console.error("Error checking availability:", error);
          setAvailableRoomsCount(0);
          setBookedRoomIds([]);
          setAvailableRoomsList([]);
          setSelectedRoomIds([]);
        } finally {
          setIsCheckingAvailability(false);
        }
      } else {
        setAvailableRoomsCount(null);
        setBookedRoomIds([]);
        setAvailableRoomsList([]);
        setSelectedRoomIds([]);
      }
    };

    checkRoomAvailability();
  }, [checkIn, checkOut, id]);

  const handleBooking = async () => {
    if (!checkIn || !checkOut) {
      toast.error("Please select check-in and check-out dates");
      return;
    }

    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);

    if (checkOutDate <= checkInDate) {
      toast.error("Check-out date must be after check-in date");
      return;
    }
    
    if (selectedRoomIds.length === 0) {
      toast.error("Please select at least one available room");
      return;
    }

    const bookingData = {
      userId: user?.id,
      roomRequests: [
        { roomTypeId: Number(id), quantity: selectedRoomIds.length }
      ],
      checkIn: checkInDate.toISOString(),
      checkOut: checkOutDate.toISOString(),
      adults: Number(adults),
      children: Number(children)
    };

    const result = await createBooking(bookingData);
    
    if (result.success && result.url) {
      toast.success("Redirecting to payment...");
      window.location.href = result.url;
    } else if (result.success) {
      toast.success("Booking successful!");
      setIsBookingModalOpen(false);
      router.push("/user/bookings");
    } else {
      const { useBookingStore } = await import("@/store/useBookingStore");
      toast.error(useBookingStore.getState().error || "Booking failed. Please try again.");
    }
  };

  if (isLoading) {
    return (
      <div className="container py-12 space-y-8 animate-pulse">
        <Skeleton className="h-[60vh] w-full rounded-2xl" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            <Skeleton className="h-10 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>
          <div className="space-y-4">
            <Skeleton className="h-[300px] w-full rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  if (!currentRoomType) {
    return (
      <div className="container py-20 text-center space-y-4">
        <h2 className="text-3xl font-bold">Room not found</h2>
        <p className="text-muted-foreground">We couldn't find the room you're looking for.</p>
        <Link href="/rooms">
          <Button>Back to Rooms</Button>
        </Link>
      </div>
    );
  }

  const images = currentRoomType.images?.length > 0 
    ? currentRoomType.images 
    : ["https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=2070&auto=format&fit=crop"];

  return (
    <div className="container py-12 space-y-12">
      {/* Gallery Section */}
      <div className="space-y-4 animate-in fade-in duration-700">
        <div className="relative h-[60vh] rounded-2xl overflow-hidden shadow-2xl">
          <Image
            src={images[activeImage]}
            alt={currentRoomType.name}
            fill
            className="object-cover"
            priority
          />
        </div>
        {images.length > 1 && (
          <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
            {images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setActiveImage(idx)}
                className={`relative h-24 w-40 flex-shrink-0 rounded-lg overflow-hidden transition-all ${
                  activeImage === idx ? "ring-2 ring-primary scale-95" : "opacity-70 hover:opacity-100"
                }`}
              >
                <Image src={img} alt={`${currentRoomType.name} ${idx + 1}`} fill className="object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8 animate-in slide-in-from-left duration-700">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-primary font-medium">
              <Star className="h-4 w-4 fill-primary" />
              <span>Premium Luxury Selection</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight">{currentRoomType.name}</h1>
            <div className="flex flex-wrap gap-6 text-muted-foreground">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                <span>Up to 2 Adults</span>
              </div>
              <div className="flex items-center gap-2">
                <Maximize className="h-5 w-5" />
                <span>45 m² / 484 ft²</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                <span>Ocean View</span>
              </div>
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <h2 className="text-2xl font-bold">About this room</h2>
            <p className="text-lg text-muted-foreground leading-relaxed text-justify">
              {currentRoomType.description}
            </p>
          </div>

          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Room Amenities</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {currentRoomType.facilities.map((fac, idx) => (
                <div key={idx} className="flex items-center gap-3 p-4 bg-muted/30 rounded-xl hover:bg-muted/50 transition-colors border border-transparent hover:border-primary/20">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <Check className="h-4 w-4" />
                  </div>
                  <span className="font-medium text-sm">{fac}</span>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Specific Rooms</h2>
            {currentRoomType.rooms && currentRoomType.rooms.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {currentRoomType.rooms.map((room) => {
                  const isBooked = bookedRoomIds.includes(room.id);
                  const isAvailableChecked = availableRoomsCount !== null; // True if dates are fully selected
                  
                  return (
                    <div 
                      key={room.id} 
                      className={`flex flex-col items-center justify-center p-4 rounded-xl transition-colors border shadow-sm group ${
                        !isAvailableChecked 
                          ? "bg-muted/30 border-transparent hover:bg-muted/50 hover:border-primary/20" 
                          : isBooked 
                            ? "bg-destructive/10 border-destructive/20 text-destructive"
                            : "bg-green-500/10 border-green-500/20 text-green-600"
                      }`}
                    >
                      <div className={`h-10 w-10 rounded-full flex items-center justify-center mb-2 transition-transform ${
                        !isAvailableChecked ? "bg-primary/10 group-hover:scale-110" : isBooked ? "bg-destructive/20 opacity-50" : "bg-green-500/20 group-hover:scale-110"
                      }`}>
                        <Key className={`h-5 w-5 ${!isAvailableChecked ? "text-primary" : isBooked ? "text-destructive" : "text-green-600"}`} />
                      </div>
                      <span className="font-semibold text-md">Room {room.roomNumber}</span>
                      {isAvailableChecked && (
                        <span className="text-[10px] uppercase tracking-wider font-bold mt-1 opacity-80">
                          {isBooked ? "Booked" : "Available"}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="p-6 bg-muted/20 rounded-xl text-center border border-dashed border-muted-foreground/30">
                <p className="text-muted-foreground">No specific rooms currently available for this category.</p>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar / Booking Card */}
        <div className="space-y-6 animate-in slide-in-from-right duration-700">
          <Card className="sticky top-24 border-none shadow-2xl bg-card overflow-hidden">
            <div className="h-2 bg-primary w-full" />
            <CardContent className="p-8 space-y-6">
              <div className="space-y-2">
                <p className="text-muted-foreground">Starting from</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold text-primary">${currentRoomType.price}</span>
                  <span className="text-muted-foreground">{t("rooms.perNight")}</span>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="font-bold">Includes for Guests:</h3>
                <ul className="space-y-3">
                  <li className="flex items-center gap-3 text-sm">
                    <Coffee className="h-4 w-4 text-primary" />
                    <span>Complimentary Gourmet Breakfast</span>
                  </li>
                  <li className="flex items-center gap-3 text-sm">
                    <Wifi className="h-4 w-4 text-primary" />
                    <span>Free Ultrafast WiFi (1Gbps)</span>
                  </li>
                  <li className="flex items-center gap-3 text-sm">
                    <Tv className="h-4 w-4 text-primary" />
                    <span>Premium Entertainment System</span>
                  </li>
                </ul>
              </div>

              <Button 
                onClick={handleOpenBookingModal}
                className="w-full h-12 text-lg font-semibold shadow-lg shadow-primary/20 hover:scale-[1.02] transition-transform active:scale-95 group"
              >
                Book This Room
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              
              <p className="text-center text-xs text-muted-foreground italic flex items-center justify-center gap-1">
                <Info className="h-3 w-3" />
                Free cancellation up to 48 hours.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Booking Modal */}
      <Dialog open={isBookingModalOpen} onOpenChange={setIsBookingModalOpen}>
        <DialogContent className="sm:max-w-[450px] p-0 overflow-hidden border-none shadow-2xl glassmorphism">
          <div className="h-2 bg-primary w-full" />
          <DialogHeader className="p-6 pb-0">
            <DialogTitle className="text-2xl font-bold">Complete Your Booking</DialogTitle>
            <DialogDescription>
              Experience the luxury of {currentRoomType.name}. Fill in your details below.
            </DialogDescription>
          </DialogHeader>
          
          <div className="p-6 space-y-6">
            {availableRoomsCount !== null && (
              <div className={`p-3 rounded-lg text-sm font-medium text-center ${
                availableRoomsCount > 0 
                  ? "bg-green-500/10 text-green-600 border border-green-500/20" 
                  : "bg-destructive/10 text-destructive border border-destructive/20"
              }`}>
                {availableRoomsCount > 0 
                  ? `${availableRoomsCount} room(s) available for these dates!` 
                  : "Sold Out for the selected dates."}
              </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="checkIn" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Check In</Label>
                <div className="relative">
                  <CalendarIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input 
                    id="checkIn" 
                    type="date" 
                    min={new Date().toISOString().split('T')[0]}
                    value={checkIn}
                    onChange={(e) => setCheckIn(e.target.value)}
                    className="pl-10 h-10 bg-muted/30 focus-visible:bg-background transition-colors" 
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="checkOut" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Check Out</Label>
                <div className="relative">
                  <CalendarIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input 
                    id="checkOut" 
                    type="date" 
                    min={checkIn || new Date().toISOString().split('T')[0]}
                    value={checkOut}
                    onChange={(e) => setCheckOut(e.target.value)}
                    className="pl-10 h-10 bg-muted/30 focus-visible:bg-background transition-colors" 
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Adults</Label>
                <Select value={adults} onValueChange={setAdults}>
                  <SelectTrigger className="bg-muted/30">
                    <SelectValue placeholder="Adults" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 Adult</SelectItem>
                    <SelectItem value="2">2 Adults</SelectItem>
                    <SelectItem value="3">3 Adults</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Children</Label>
                <Select value={children} onValueChange={setChildren}>
                  <SelectTrigger className="bg-muted/30">
                    <SelectValue placeholder="Children" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">0 Children</SelectItem>
                    <SelectItem value="1">1 Child</SelectItem>
                    <SelectItem value="2">2 Children</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            {availableRoomsList.length > 0 && checkIn && checkOut && (
              <div className="space-y-3 pt-2">
                <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center justify-between">
                  <span>Select Specific Rooms</span>
                  <span className="text-xs text-primary bg-primary/10 px-2 py-0.5 rounded-full">{selectedRoomIds.length} Selected</span>
                </Label>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 max-h-[120px] overflow-y-auto p-1 scrollbar-thin scrollbar-thumb-primary/20">
                  {availableRoomsList.map((room) => {
                    const isSelected = selectedRoomIds.includes(room.roomId);
                    return (
                      <button
                        key={room.roomId}
                        onClick={() => {
                          if (isSelected) {
                            setSelectedRoomIds(selectedRoomIds.filter(id => id !== room.roomId));
                          } else {
                            setSelectedRoomIds([...selectedRoomIds, room.roomId]);
                          }
                        }}
                        className={`flex items-center justify-center py-2 px-1 text-xs font-medium rounded-lg border transition-all ${
                          isSelected 
                            ? "bg-primary text-primary-foreground border-primary shadow-sm" 
                            : "bg-muted/30 border-transparent hover:border-primary/30 hover:bg-muted/50 text-muted-foreground"
                        }`}
                      >
                        Room {room.roomNumber}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="p-4 rounded-xl bg-primary/5 border border-primary/10 space-y-2">
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Price per night</span>
                <span className="font-bold">${currentRoomType.price}</span>
              </div>
              {checkIn && checkOut && selectedRoomIds.length > 0 && (
                <div className="flex justify-between items-center text-base border-t border-primary/10 pt-2">
                  <span className="font-semibold text-primary">Total Amount</span>
                  <span className="text-xl font-bold text-primary">
                    ${currentRoomType.price * selectedRoomIds.length * Math.max(1, Math.ceil((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 3600 * 24)))}
                  </span>
                </div>
              )}
            </div>

            <Button 
              onClick={handleBooking} 
              disabled={availableRoomsCount === 0 || isCheckingAvailability || selectedRoomIds.length === 0}
              isLoading={isBookingLoading || isCheckingAvailability}
              className="w-full h-12 text-lg font-semibold shadow-lg shadow-primary/20"
            >
              {availableRoomsCount === 0 ? "Sold Out" : selectedRoomIds.length === 0 ? "Select a Room" : "Confirm & Book Now"}
            </Button>
            
            <p className="text-center text-[10px] text-muted-foreground italic leading-tight">
              By confirming, you will be redirected to our secure payment gateway to finalize your luxury experience.
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

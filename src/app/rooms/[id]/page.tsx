"use client";

import * as React from "react";
import { useParams } from "next/navigation";
import { useRoomStore } from "@/store/useRoomStore";
import { useTranslation } from "@/hooks/useTranslation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { Check, Star, Coffee, Wifi, Tv, MapPin, Users, Maximize } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function RoomDetailsPage() {
  const { id } = useParams();
  const { t } = useTranslation();
  const { currentRoomType, isLoading, fetchRoomTypeById } = useRoomStore();
  const [activeImage, setActiveImage] = React.useState(0);

  React.useEffect(() => {
    if (id) {
      fetchRoomTypeById(Number(id));
    }
  }, [id, fetchRoomTypeById]);

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
      <div className="space-y-4">
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
        <div className="lg:col-span-2 space-y-8">
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
            <p className="text-lg text-muted-foreground leading-relaxed">
              {currentRoomType.description}
            </p>
          </div>

          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Room Amenities</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {currentRoomType.facilities.map((fac, idx) => (
                <div key={idx} className="flex items-center gap-3 p-4 bg-muted/30 rounded-xl">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <Check className="h-4 w-4" />
                  </div>
                  <span className="font-medium text-sm">{fac}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar / Booking Card */}
        <div className="space-y-6">
          <Card className="sticky top-24 border-none shadow-2xl bg-card">
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
                <h3 className="font-bold">Includes:</h3>
                <ul className="space-y-3">
                  <li className="flex items-center gap-3 text-sm">
                    <Coffee className="h-4 w-4 text-primary" />
                    <span>Complimentary Breakfast</span>
                  </li>
                  <li className="flex items-center gap-3 text-sm">
                    <Wifi className="h-4 w-4 text-primary" />
                    <span>High-Speed WiFi</span>
                  </li>
                  <li className="flex items-center gap-3 text-sm">
                    <Tv className="h-4 w-4 text-primary" />
                    <span>Smart TV with Streaming</span>
                  </li>
                </ul>
              </div>

              <Button className="w-full h-12 text-lg font-semibold shadow-lg shadow-primary/20">
                Book This Room
              </Button>
              
              <p className="text-center text-xs text-muted-foreground italic">
                Free cancellation up to 48 hours before check-in.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

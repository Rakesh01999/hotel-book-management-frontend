"use client";

import * as React from "react";
import { useRoomStore } from "@/store/useRoomStore";
import { useTranslation } from "@/hooks/useTranslation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";

export default function RoomsPage() {
  const { t } = useTranslation();
  const { roomTypes, isLoading, fetchRoomTypes } = useRoomStore();

  React.useEffect(() => {
    fetchRoomTypes();
  }, [fetchRoomTypes]);

  return (
    <div className="container py-12 space-y-10">
      <div className="space-y-4 text-center max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold tracking-tight">{t("rooms.title")}</h1>
        <p className="text-muted-foreground text-lg">
          {t("rooms.description")}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {isLoading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="overflow-hidden">
              <Skeleton className="h-64 w-full" />
              <CardHeader className="space-y-2">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-10 w-full" />
              </CardContent>
            </Card>
          ))
        ) : roomTypes.length > 0 ? (
          roomTypes.map((type) => (
            <Card key={type.id} className="overflow-hidden hover:shadow-xl transition-all border-none shadow-lg bg-card group">
              <div className="h-64 relative overflow-hidden">
                <Image
                  src={type.images?.[0] || "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=2070&auto=format&fit=crop"}
                  alt={type.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-xl">{type.name}</CardTitle>
                    <CardDescription>
                      {type.rooms?.length || 0} {type.rooms?.length === 1 ? "Room" : "Rooms"} Available
                    </CardDescription>
                  </div>
                  <div className="text-right">
                    <span className="text-xl font-bold text-primary">${type.price}</span>
                    <p className="text-xs text-muted-foreground">{t("rooms.perNight")}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground line-clamp-3">
                  {type.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  {type.facilities.slice(0, 3).map((facility, idx) => (
                    <span key={idx} className="text-xs bg-muted px-2 py-1 rounded-md">
                      {facility}
                    </span>
                  ))}
                  {type.facilities.length > 3 && (
                    <span className="text-xs text-muted-foreground">
                      +{type.facilities.length - 3} more
                    </span>
                  )}
                </div>
                <Link href={`/rooms/${type.id}`}>
                  <Button className="w-full">{t("rooms.viewDetail")}</Button>
                </Link>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="col-span-full text-center py-20 space-y-4">
            <h3 className="text-2xl font-semibold">No rooms found</h3>
            <p className="text-muted-foreground">Please check back later or contact us for assistance.</p>
          </div>
        )}
      </div>
    </div>
  );
}

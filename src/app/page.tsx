"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowRight, MapPin, Coffee, HelpCircle, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
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
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useTranslation } from "@/hooks/useTranslation";
import { useRoomStore } from "@/store/useRoomStore";
import Image from "next/image";

export default function Home() {
  const { t } = useTranslation();
  const { rooms, isLoading, fetchRooms } = useRoomStore();

  React.useEffect(() => {
    fetchRooms();
  }, [fetchRooms]);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[90vh] flex items-center justify-center bg-slate-900 text-white overflow-hidden">
        <div 
          className="absolute inset-0 z-0 opacity-50 bg-cover bg-center"
          style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=2070&auto=format&fit=crop")' }}
        />
        <div className="absolute inset-0 bg-black/40 z-0" />
        
        <div className="relative z-10 container text-center space-y-6">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight animate-fade-in-up">
            {t("hero.title")}
          </h1>
          <p className="text-lg md:text-xl text-gray-200 max-w-2xl mx-auto">
            {t("hero.description")}
          </p>
          
          <Card className="max-w-4xl mx-auto mt-8 bg-white/10 backdrop-blur-md border-white/20 text-left">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label className="text-white">Check In</Label>
                  <Input type="date" className="bg-transparent border-white/50 focus-visible:ring-white text-white placeholder:text-gray-400" />
                </div>
                <div className="space-y-2">
                  <Label className="text-white">Check Out</Label>
                  <Input type="date" className="bg-transparent border-white/50 focus-visible:ring-white text-white placeholder:text-gray-400" />
                </div>
                <div className="space-y-2">
                  <Label className="text-white">Guests</Label>
                  <Select>
                    <SelectTrigger className="bg-transparent border-white/50 focus:ring-white text-white">
                      <SelectValue placeholder="Select guests" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 Adult, 0 Children</SelectItem>
                      <SelectItem value="2">2 Adults, 0 Children</SelectItem>
                      <SelectItem value="3">2 Adults, 1 Child</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-end">
                  <Button size="lg" className="w-full bg-white text-black hover:bg-gray-200">
                    {t("hero.cta")}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Introduction */}
      <section className="py-20 bg-background">
        <div className="container text-center space-y-8">
          <h2 className="text-3xl font-bold tracking-tight">Welcome to LuxeStay</h2>
          <Separator className="w-24 mx-auto bg-primary h-1 rounded-full" />
          <p className="text-muted-foreground max-w-3xl mx-auto text-lg leading-relaxed">
            Nestled in the heart of the city, LuxeStay offers a sanctuary of tranquility and sophistication. 
            Whether you are traveling for business or leisure, our world-class amenities and impeccable service 
            ensure a memorable stay.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            {[
              { icon: Star, title: "5-Star Rating", desc: "Award-winning service and hospitality." },
              { icon: MapPin, title: "Prime Location", desc: "Steps away from major attractions." },
              { icon: Coffee, title: "Luxury Dining", desc: "Exquisite culinary experiences." },
            ].map((feature, i) => (
              <Card key={i} className="hover:shadow-lg transition-shadow border-none bg-muted/30">
                <CardContent className="p-6 text-center pt-8">
                  <feature.icon className="h-10 w-10 text-primary mx-auto mb-4" />
                  <h3 className="font-semibold text-xl mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Rooms Preview */}
      <section className="py-20 bg-muted/20">
        <div className="container">
          <div className="flex justify-between items-center mb-10">
            <h2 className="text-3xl font-bold">{t("rooms.title")}</h2>
            <Link href="/rooms">
              <Button variant="ghost" className="gap-2 group">
                View All <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
             {isLoading ? (
               [1, 2, 3].map((i) => (
                 <Card key={i} className="overflow-hidden animate-pulse">
                   <div className="h-64 bg-slate-200" />
                   <CardHeader className="space-y-2">
                     <div className="h-6 bg-slate-200 w-3/4 rounded" />
                     <div className="h-4 bg-slate-200 w-1/2 rounded" />
                   </CardHeader>
                   <CardContent>
                     <div className="h-10 bg-slate-200 rounded" />
                   </CardContent>
                 </Card>
               ))
             ) : (
               rooms.slice(0, 3).map((room) => (
                 <Card key={room.id} className="overflow-hidden hover:shadow-xl transition-all border-none shadow-md bg-background">
                   <div className="h-64 relative overflow-hidden group">
                      <Image 
                        src={room.roomType.images?.[0] || "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=2070&auto=format&fit=crop"} 
                        alt={room.roomType.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                   </div>
                   <CardHeader>
                     <CardTitle>{room.roomType.name} (Room {room.roomNumber})</CardTitle>
                     <CardDescription className="line-clamp-2">{room.roomType.description}</CardDescription>
                   </CardHeader>
                   <CardContent>
                     <div className="flex justify-between items-center">
                       <span className="text-lg font-bold text-primary">
                         ${room.roomType.price} <span className="text-sm font-normal text-muted-foreground">{t("rooms.perNight")}</span>
                       </span>
                       <Button size="sm">{t("rooms.viewDetail")}</Button>
                     </div>
                   </CardContent>
                 </Card>
               ))
             )}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-background">
        <div className="container max-w-4xl">
           <div className="text-center mb-12">
             <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
             <p className="text-muted-foreground">Everything you need to know about your stay.</p>
           </div>
           
           <div className="space-y-4">
             {[
               "What are the check-in and check-out times?",
               "Do you offer airport transfer services?",
               "Is breakfast included in the room rate?",
               "What is your cancellation policy?"
             ].map((q, i) => (
               <Card key={i} className="cursor-pointer hover:bg-muted/50 transition-colors">
                 <CardContent className="p-4 flex justify-between items-center">
                   <span className="font-medium">{q}</span>
                   <HelpCircle className="h-5 w-5 text-muted-foreground" />
                 </CardContent>
               </Card>
             ))}
           </div>
        </div>
      </section>
    </div>
  );
}

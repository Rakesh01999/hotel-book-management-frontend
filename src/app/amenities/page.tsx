"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Loader2, Waves, Zap, Wifi, Wine, Snowflake, Tv, ShieldCheck, Coffee, Bath, DoorOpen, Utensils, Smartphone, Info } from "lucide-react";
import api from "@/lib/axios";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { amenityMapping } from "@/lib/amenityUtils";

interface RoomType {
  id: number;
  name: string;
  description: string;
  facilities: string[];
  images: string[];
}

export default function AmenitiesPage() {
  const [roomTypes, setRoomTypes] = useState<RoomType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [uniqueFacilities, setUniqueFacilities] = useState<string[]>([]);

  useEffect(() => {
    const fetchRoomTypes = async () => {
      try {
        const response = await api.get("/room-category");
        const data = response.data?.data || [];
        setRoomTypes(data);
        
        // Extract unique facilities
        const allFacilities = data.flatMap((rt: RoomType) => rt.facilities || []);
        const unique = Array.from(new Set(allFacilities.map((f: string) => String(f).toLowerCase()))) as string[];
        setUniqueFacilities(unique);
      } catch (error) {
        console.error("Failed to fetch amenities:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRoomTypes();
  }, []);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="text-muted-foreground font-medium animate-pulse">Designing your experience...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1540541338287-41700207dee6?q=80&w=2070&auto=format&fit=crop"
            alt="Luxury Amenities"
            fill
            className="object-cover brightness-50"
            priority
          />
        </div>
        <div className="relative z-10 text-center text-white px-4">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-bold tracking-tight mb-4"
          >
            The Art of <span className="bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">Living</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg md:text-xl max-w-2xl mx-auto text-blue-50/80 font-light"
          >
            Discover a world where every detail is curated for your comfort. From high-speed connectivity to indulgent spa treatments, LuxeStay redefines modern hospitality.
          </motion.p>
        </div>
        <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-background to-transparent" />
      </section>

      {/* Unique Design Selection */}
      <section className="container py-24">
        <div className="text-center mb-20">
          <Badge variant="outline" className="mb-4 px-4 py-1 text-sm font-medium border-primary/20 bg-primary/5 text-primary">
            Curated Excellence
          </Badge>
          <h2 className="text-4xl font-bold tracking-tight sm:text-5xl mb-6">Experience the Extraordinary</h2>
          <div className="h-1 w-24 bg-primary mx-auto rounded-full mb-8" />
          <p className="text-muted-foreground max-w-3xl mx-auto text-lg">
            Our commitment to excellence is reflected in every service we provide. Whether you're here for business or leisure, our amenities are designed to exceed your expectations.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {uniqueFacilities.map((facility, index) => {
            const mapping = amenityMapping[facility.toLowerCase()] || { 
              icon: Info, 
              description: "High-quality service provided to ensure your stay is comfortable and memorable." 
            };
            const Icon = mapping.icon;

            return (
              <motion.div
                key={facility}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="group relative overflow-hidden border-none shadow-xl hover:shadow-2xl transition-all duration-500 bg-card/50 backdrop-blur-sm">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent group-hover:from-primary/10 transition-colors" />
                  <CardContent className="p-8 relative z-10">
                    <div className="mb-6 inline-flex p-4 rounded-2xl bg-primary/10 text-primary group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500">
                      <Icon className="h-8 w-8" />
                    </div>
                    <h3 className="text-2xl font-bold mb-3 capitalize">{facility}</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {mapping.description}
                    </p>
                    <div className="mt-8 flex items-center gap-2 text-sm font-semibold text-primary/60 group-hover:text-primary transition-colors cursor-default">
                      <span>Premium Amenity</span>
                      <div className="h-px flex-1 bg-primary/20" />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Featured Section */}
      <section className="py-24 bg-muted/30">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="relative">
              <motion.div 
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="relative z-10 rounded-3xl overflow-hidden shadow-2xl aspect-[4/5]"
              >
                <Image
                  src="https://i.postimg.cc/Vk0sSSvP/amenities.jpg"
                  alt="Spa Service"
                  fill
                  className="object-cover"
                />
              </motion.div>
              <div className="absolute -bottom-8 -right-8 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
              <div className="absolute -top-8 -left-8 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl" />
            </div>
            
            <div className="space-y-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <h2 className="text-4xl font-bold tracking-tight mb-6">World-Class Wellness</h2>
                <p className="text-xl text-muted-foreground leading-relaxed">
                  Beyond the basic comforts, we offer specialty wellness services designed to restore harmony to your life. Our spa and fitness facilities are open around the clock to cater to your schedule.
                </p>
              </motion.div>
              
              <div className="grid sm:grid-cols-2 gap-6">
                 {[
                   { label: "Signature Spa", icon: Waves, color: "text-blue-500" },
                   { label: "Elite Fitness", icon: Zap, color: "text-orange-500" },
                   { label: "Private Cinema", icon: Tv, color: "text-purple-500" },
                   { label: "Concierge 24/7", icon: ShieldCheck, color: "text-emerald-500" }
                 ].map((item, i) => (
                   <motion.div 
                    key={item.label}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-center gap-4 p-4 rounded-xl bg-background shadow-sm"
                   >
                     <item.icon className={`h-6 w-6 ${item.color}`} />
                     <span className="font-semibold">{item.label}</span>
                   </motion.div>
                 ))}
              </div>

              <div className="pt-4">
                <Button size="lg" className="px-8 rounded-full shadow-lg hover:shadow-primary/20 transition-all">
                  Book Your Experience
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container py-24 text-center">
        <div className="max-w-4xl mx-auto rounded-[3rem] bg-foreground text-background p-16 md:p-24 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-blue-500/20 via-transparent to-transparent" />
          <div className="relative z-10">
            <h2 className="text-4xl md:text-5xl font-bold mb-8">Ready for an Unforgettable Stay?</h2>
            <p className="text-lg md:text-xl text-background/60 mb-12 max-w-2xl mx-auto">
              Choose from our selection of premium rooms and gain access to all these world-class amenities and more.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" className="rounded-full px-12 h-14" onClick={() => (window.location.href = '/rooms')}>
                View Our Rooms
              </Button>
              <Button size="lg" variant="secondary" className="rounded-full px-12 h-14" onClick={() => (window.location.href = '/contact')}>
                Contact Concierge
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

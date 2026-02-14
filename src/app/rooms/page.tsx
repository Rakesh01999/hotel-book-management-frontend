import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardTitle,
} from "@/components/ui/card";
import { Wifi, Tv, Coffee, Users } from "lucide-react";
import Link from "next/link";

export default function RoomsPage() {
  const rooms = [
    { id: 1, name: "Deluxe King Suite", price: 250, capacity: 2, size: "45m²" },
    { id: 2, name: "Ocean View Twin", price: 300, capacity: 2, size: "50m²" },
    { id: 3, name: "Presidential Suite", price: 800, capacity: 4, size: "120m²" },
    { id: 4, name: "Standard Queen", price: 150, capacity: 2, size: "30m²" },
    { id: 5, name: "Family Room", price: 400, capacity: 4, size: "60m²" },
    { id: 6, name: "Executive Suite", price: 550, capacity: 2, size: "75m²" },
  ];

  return (
    <div className="container py-12">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Our Rooms & Suites</h1>
          <p className="text-muted-foreground mt-2">Find your perfect sanctuary.</p>
        </div>
        
        {/* Filter Placeholder */}
        <div className="flex gap-2">
           <Button variant="outline">Filter by Price</Button>
           <Button variant="outline">Filter by Capacity</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {rooms.map((room) => (
          <Card key={room.id} className="overflow-hidden group hover:shadow-xl transition-all border-none shadow-md">
            <div className="h-64 bg-muted relative">
               <div className="absolute inset-0 bg-slate-300 animate-pulse flex items-center justify-center text-slate-400 group-hover:scale-105 transition-transform duration-500">
                  Image {room.id}
               </div>
            </div>
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-2">
                <CardTitle className="text-xl font-bold">{room.name}</CardTitle>
                <Badge variant="secondary">Available</Badge>
              </div>
              
              <div className="flex gap-4 text-sm text-muted-foreground mb-4">
                 <div className="flex items-center gap-1"><Users className="h-4 w-4"/> {room.capacity} Guests</div>
                 <div className="flex items-center gap-1">Size: {room.size}</div>
              </div>

              <div className="flex gap-3 mb-6">
                 <Wifi className="h-4 w-4 text-muted-foreground" />
                 <Tv className="h-4 w-4 text-muted-foreground" />
                 <Coffee className="h-4 w-4 text-muted-foreground" />
              </div>

              <div className="flex items-center justify-between pt-4 border-t">
                <div>
                   <span className="text-2xl font-bold">${room.price}</span>
                   <span className="text-sm text-muted-foreground"> / night</span>
                </div>
                <Link href={`/rooms/${room.id}`}>
                  <Button>View Details</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

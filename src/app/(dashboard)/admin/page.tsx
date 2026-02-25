"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAdminStore } from "@/store/useAdminStore";
import { useEffect } from "react";
import { Activity, CreditCard, Users, DoorClosed } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function AdminDashboardPage() {
  const { stats, isLoading, fetchDashboardStats } = useAdminStore();

  useEffect(() => {
    fetchDashboardStats();
  }, [fetchDashboardStats]);

  const kpiData = [
    { 
      label: "Total Revenue", 
      val: stats ? `$${stats.revenue.toLocaleString()}` : "0", 
      icon: CreditCard 
    },
    { 
       label: "Total Bookings", 
       val: stats ? stats.totalBookings.toString() : "0", 
       icon: Activity 
    },
    { 
      label: "Active Users", 
      val: stats ? stats.activeUsers.toString() : "0", 
      icon: Users 
    },
    { 
      label: "Total Rooms", 
      val: stats ? stats.totalRooms.toString() : "0", 
      icon: DoorClosed 
    }
  ];

  return (
    <div className="space-y-8">
       <h1 className="text-3xl font-bold">Dashboard Overview</h1>
       
       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {kpiData.map((stat, i) => (
             <Card key={i} className="border-none shadow-md bg-card">
               <CardContent className="p-6">
                  {isLoading ? (
                    <div className="space-y-2">
                       <Skeleton className="h-4 w-24" />
                       <Skeleton className="h-8 w-16" />
                    </div>
                  ) : (
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground mb-1">{stat.label}</p>
                        <p className="text-3xl font-bold">{stat.val}</p>
                      </div>
                      <div className="p-3 bg-primary/10 rounded-full text-primary">
                        <stat.icon className="w-6 h-6" />
                      </div>
                    </div>
                  )}
               </CardContent>
             </Card>
          ))}
       </div>

       <Card className="min-h-[400px] border-none shadow-md">
          <CardHeader className="bg-muted/30 border-b">
            <CardTitle className="text-lg">Recent Bookings (Coming Soon)</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="flex flex-col items-center justify-center text-center h-48 space-y-3">
              <Activity className="w-10 h-10 text-muted-foreground/30" />
              <p className="text-muted-foreground text-sm max-w-sm">
                Detailed booking management table will be implemented in the next phase.
              </p>
            </div>
          </CardContent>
       </Card>
    </div>
  );
}

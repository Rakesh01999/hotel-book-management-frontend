import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminDashboardPage() {
  return (
    <div className="container py-12">
       <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
       
       <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          {[
             { label: "Total Bookings", val: "124" },
             { label: "Revenue", val: "$12,450" },
             { label: "Active Users", val: "540" },
             { label: "Rooms Occupied", val: "12/45" }
          ].map((stat, i) => (
             <Card key={i}>
               <CardContent className="p-6">
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="text-2xl font-bold">{stat.val}</p>
               </CardContent>
             </Card>
          ))}
       </div>

       <Card className="min-h-[400px]">
          <CardHeader>
            <CardTitle>Recent Bookings</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Table placeholder...</p>
          </CardContent>
       </Card>
    </div>
  );
}

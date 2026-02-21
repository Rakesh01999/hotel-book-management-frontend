"use client";

import { useAuthStore } from "@/store/useAuthStore";
import { useState } from "react";
import { 
  User, 
  Phone, 
  ShieldCheck, 
  Save, 
  X,
  CreditCard,
  Bell,
  Lock,
  MessageSquare
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function SettingsPage() {
  const { user, updateUser } = useAuthStore();
  const [loading, setLoading] = useState(false);
  
  // Form State
  const [formData, setFormData] = useState({
    name: user?.name || "",
    contactNumber: user?.contactNumber || "",
  });

  if (!user) return null;

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Simulation for now - in real app call backend API
      await new Promise(resolve => setTimeout(resolve, 800));
      
      updateUser(formData);
      toast.success("Settings updated successfully!");
    } catch (error) {
      toast.error("Failed to update settings. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight">Account Settings</h1>
        <p className="text-muted-foreground">Manage your account preferences and security settings.</p>
      </div>

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="bg-muted/50 p-1 mb-8">
          <TabsTrigger value="general" className="gap-2">
            <User className="h-4 w-4" />
            General
          </TabsTrigger>
          <TabsTrigger value="security" className="gap-2">
            <Lock className="h-4 w-4" />
            Security
          </TabsTrigger>
          <TabsTrigger value="notifications" className="gap-2">
            <Bell className="h-4 w-4" />
            Notifications
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <Card className="lg:col-span-2 border-none shadow-sm h-fit">
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>Update your name and contact details used across the platform.</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleUpdate} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input 
                          id="name" 
                          value={formData.name} 
                          onChange={(e) => setFormData({...formData, name: e.target.value})}
                          className="pl-10 h-11 bg-muted/30 focus-visible:bg-background transition-colors"
                          placeholder="Your full name"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Contact Number</Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input 
                          id="phone" 
                          value={formData.contactNumber} 
                          onChange={(e) => setFormData({...formData, contactNumber: e.target.value})}
                          className="pl-10 h-11 bg-muted/30 focus-visible:bg-background transition-colors"
                          placeholder="+1 (555) 000-0000"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="pt-4 flex justify-end">
                    <Button type="submit" isLoading={loading} className="gap-2 px-8 h-11 shadow-lg shadow-primary/20">
                      <Save className="h-4 w-4" />
                      Save Changes
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>

            <div className="space-y-6">
              <Card className="border-none shadow-sm h-fit">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Quick Tips</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-4">
                    <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                        <ShieldCheck className="h-5 w-5 text-primary" />
                    </div>
                    <p className="text-sm text-muted-foreground">Keep your contact number updated to receive important stay alerts.</p>
                  </div>
                  <div className="flex gap-4">
                    <div className="h-8 w-8 rounded-lg bg-emerald-500/10 flex items-center justify-center shrink-0">
                        <CreditCard className="h-5 w-5 text-emerald-600" />
                    </div>
                    <p className="text-sm text-muted-foreground">Verify your internal account ID #USR-{user.id.toString().padStart(6, '0')} for support.</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-none shadow-sm bg-primary/5 h-fit">
                <CardContent className="p-6 space-y-4 text-center">
                    <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center mx-auto text-primary">
                        <MessageSquare className="h-6 w-6" />
                    </div>
                    <div className="space-y-1">
                        <h4 className="font-bold">Need Help?</h4>
                        <p className="text-xs text-muted-foreground">Our concierge team is available 24/7 for account assistance.</p>
                    </div>
                    <Button variant="outline" size="sm" className="w-full bg-background">Contact Support</Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="security" className="animate-in fade-in slide-in-from-right duration-500">
           <Card className="border-none shadow-sm">
             <CardHeader>
               <CardTitle>Security Settings</CardTitle>
               <CardDescription>Manage your password and two-factor authentication.</CardDescription>
             </CardHeader>
             <CardContent className="py-12 flex flex-col items-center justify-center text-center space-y-4">
                <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center">
                    <Lock className="h-8 w-8 text-muted-foreground" />
                </div>
                <div className="space-y-1">
                    <h3 className="font-semibold text-lg">Advanced Security coming soon</h3>
                    <p className="text-muted-foreground text-sm max-w-xs mx-auto">
                        We are working on advanced security features to keep your luxury experience safe.
                    </p>
                </div>
             </CardContent>
           </Card>
        </TabsContent>

        <TabsContent value="notifications" className="animate-in fade-in slide-in-from-right duration-500">
           {/* Notification settings placeholder */}
           <Card className="border-none shadow-sm">
             <CardHeader>
               <CardTitle>Notification Preferences</CardTitle>
               <CardDescription>Control how you receive alerts and updates.</CardDescription>
             </CardHeader>
             <CardContent className="py-12 text-center text-muted-foreground italic">
                Notification center is under construction.
             </CardContent>
           </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

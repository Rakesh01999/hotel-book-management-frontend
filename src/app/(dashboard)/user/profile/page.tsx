"use client";

import { useAuthStore } from "@/store/useAuthStore";
import { useState } from "react";
import { 
  User, 
  Mail, 
  Phone, 
  ShieldCheck, 
  Camera, 
  Save, 
  X,
  BadgeCheck,
  Calendar,
  Settings
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import api from "@/lib/axios";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

export default function ProfilePage() {
  const { user, updateUser } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
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
      // In a real app, you'd send this to your backend
      // const response = await api.patch("/user/profile", formData);
      // For now, we'll simulate the update
      await new Promise(resolve => setTimeout(resolve, 800));
      
      updateUser(formData);
      toast.success("Profile updated successfully!");
      setIsEditing(false);
    } catch (error) {
      toast.error("Failed to update profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header Profile Section */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-6">
          <div className="relative group">
            <Avatar className="h-24 w-24 border-4 border-background shadow-xl">
              <AvatarImage src={user.profilePhoto || ""} />
              <AvatarFallback className="text-3xl bg-primary/10 text-primary">
                {user.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <button className="absolute bottom-0 right-0 p-2 rounded-full bg-primary text-white shadow-lg hover:scale-110 transition-transform">
              <Camera className="h-4 w-4" />
            </button>
          </div>
          <div className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
              {user.name}
              {user.verified && <BadgeCheck className="h-6 w-6 text-blue-500 fill-blue-500/10" />}
            </h1>
            <p className="text-muted-foreground flex items-center gap-2 text-sm">
              <Mail className="h-3 w-3" />
              {user.email}
            </p>
            <div className="flex gap-2 pt-2">
              <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20">
                {user.role}
              </Badge>
              <Badge variant="outline" className="bg-emerald-500/5 text-emerald-600 border-emerald-500/20">
                {user.status}
              </Badge>
            </div>
          </div>
        </div>
        <div className="flex gap-3">
          {!isEditing ? (
            <Button onClick={() => setIsEditing(true)} className="gap-2">
              <Settings className="h-4 w-4" />
              Edit Profile
            </Button>
          ) : (
            <>
              <Button variant="ghost" onClick={() => setIsEditing(false)} className="gap-2">
                <X className="h-4 w-4" />
                Cancel
              </Button>
              <Button onClick={handleUpdate} isLoading={loading} className="gap-2">
                <Save className="h-4 w-4" />
                Save Changes
              </Button>
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Personal Details Card */}
        <Card className="lg:col-span-2 border-none shadow-sm">
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
            <CardDescription>Update your personal details and contact information.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <form onSubmit={handleUpdate} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input 
                      id="name" 
                      value={formData.name} 
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      disabled={!isEditing}
                      className="pl-10 h-10 bg-muted/30 focus-visible:bg-background transition-colors"
                      placeholder="Enter your full name"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input 
                      id="email" 
                      value={user.email} 
                      disabled 
                      className="pl-10 h-10 bg-muted/10 opacity-70"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Contact Number</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input 
                      id="phone" 
                      value={formData.contactNumber} 
                      onChange={(e) => setFormData({...formData, contactNumber: e.target.value})}
                      disabled={!isEditing}
                      className="pl-10 h-10 bg-muted/30 focus-visible:bg-background transition-colors"
                      placeholder="+1 (555) 000-0000"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Account Created</Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input 
                      value={format(new Date(user.createdAt), "MMMM dd, yyyy")} 
                      disabled 
                      className="pl-10 h-10 bg-muted/10 opacity-70"
                    />
                  </div>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Status & Verification Card */}
        <div className="space-y-6">
          <Card className="border-none shadow-sm overflow-hidden">
            <CardHeader className="bg-muted/30">
              <CardTitle className="text-lg">Account Verification</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center gap-4">
                <div className={cn(
                  "h-12 w-12 rounded-full flex items-center justify-center",
                  user.verified ? "bg-emerald-500/10 text-emerald-600" : "bg-amber-500/10 text-amber-600"
                )}>
                  <ShieldCheck className="h-6 w-6" />
                </div>
                <div>
                  <p className="font-bold">{user.verified ? "Verified Account" : "Unverified"}</p>
                  <p className="text-xs text-muted-foreground">
                    {user.verified 
                      ? "Your identity has been successfully verified." 
                      : "Verification is required for premium features."}
                  </p>
                </div>
              </div>
              {!user.verified && (
                <Button variant="outline" className="w-full text-xs h-8">Verify Identity</Button>
              )}
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm overflow-hidden bg-gradient-to-br from-background to-muted/20">
            <CardHeader>
              <CardTitle className="text-lg">Member Benefits</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-3">
                {[
                  "Early check-in (subject to availability)",
                  "Complimentary welcome drinks",
                  "10% discount on spa services",
                  "Priority support line"
                ].map((benefit, i) => (
                  <li key={i} className="flex gap-2 text-sm text-muted-foreground">
                    <div className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                    {benefit}
                  </li>
                ))}
              </ul>
              <Button variant="secondary" className="w-full mt-4" size="sm">Explore Premium</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

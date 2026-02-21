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
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function ProfilePage() {
  const { user } = useAuthStore();
  
  if (!user) return null;

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
          <Link href="/user/settings">
            <Button className="gap-2 shadow-lg shadow-primary/20">
              <Settings className="h-4 w-4" />
              Account Settings
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Personal Details Card */}
        <Card className="lg:col-span-2 border-none shadow-sm">
          <CardHeader>
            <CardTitle>Detailed Profile Information</CardTitle>
            <CardDescription>Comprehensive overview of your personal and account details.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="space-y-1">
                  <Label className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest">Full Name</Label>
                  <p className="text-lg font-semibold flex items-center gap-2">
                    <User className="h-4 w-4 text-primary" />
                    {user.name}
                  </p>
                </div>
                <div className="space-y-1">
                  <Label className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest">Email Address</Label>
                  <p className="text-lg font-semibold flex items-center gap-2">
                    <Mail className="h-4 w-4 text-primary" />
                    {user.email}
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-1">
                  <Label className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest">Contact Number</Label>
                  <p className="text-lg font-semibold flex items-center gap-2">
                    <Phone className="h-4 w-4 text-primary" />
                    {user.contactNumber || "Not provided"}
                  </p>
                </div>
                <div className="space-y-1">
                  <Label className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest">Member Since</Label>
                  <p className="text-lg font-semibold flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-primary" />
                    {format(new Date(user.createdAt), "MMMM dd, yyyy")}
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-dashed grid grid-cols-2 md:grid-cols-3 gap-6">
              <div className="space-y-1">
                <Label className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest">Account ID</Label>
                <p className="font-mono text-sm">#USR-{user.id.toString().padStart(6, '0')}</p>
              </div>
              <div className="space-y-1">
                <Label className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest">Verification</Label>
                <div className="flex items-center gap-2">
                  <Badge variant={user.verified ? "default" : "secondary"} className={cn("text-[10px]", user.verified && "bg-emerald-500/10 text-emerald-600 border-none")}>
                    {user.verified ? "VERIFIED" : "PENDING"}
                  </Badge>
                </div>
              </div>
              <div className="space-y-1">
                <Label className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest">Status</Label>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-[10px] bg-blue-500/5 text-blue-600 border-blue-200 uppercase">
                    {user.status}
                  </Badge>
                </div>
              </div>
            </div>
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

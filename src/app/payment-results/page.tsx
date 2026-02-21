"use client";

import * as React from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle2, XCircle, ArrowRight, Home, Calendar, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export default function PaymentResultsPage() {
  const searchParams = useSearchParams();
  const status = searchParams.get("status");
  const bookingId = searchParams.get("bookingId");

  const isSuccess = status === "CAPTURED";
  const isPending = status === "INITIATED" || status === "IN_PROGRESS";
  const isFailed = status === "DECLINED" || status === "CANCELLED" || status === "error";

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4 bg-muted/30">
      <Card className="w-full max-w-lg border-none shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-500">
        <div className={`h-2 w-full ${isSuccess ? "bg-emerald-500" : isFailed ? "bg-destructive" : "bg-amber-500"}`} />
        
        <CardHeader className="text-center pb-2">
          <div className="flex justify-center mb-4">
            {isSuccess ? (
              <div className="h-20 w-20 rounded-full bg-emerald-50 flex items-center justify-center animate-bounce-short">
                <CheckCircle2 className="h-12 w-12 text-emerald-500" />
              </div>
            ) : isFailed ? (
              <div className="h-20 w-20 rounded-full bg-destructive/5 flex items-center justify-center">
                <XCircle className="h-12 w-12 text-destructive" />
              </div>
            ) : (
              <div className="h-20 w-20 rounded-full bg-amber-50 flex items-center justify-center animate-pulse">
                <CreditCard className="h-12 w-12 text-amber-500" />
              </div>
            )}
          </div>
          <CardTitle className="text-3xl font-bold tracking-tight">
            {isSuccess ? "Payment Successful!" : isFailed ? "Payment Failed" : "Payment Status"}
          </CardTitle>
          <p className="text-muted-foreground mt-2">
            {isSuccess 
              ? "Your luxury stay has been confirmed. Get ready for an unforgettable experience."
              : isFailed 
              ? "We couldn't process your payment. Please try again or contact support."
              : "Your payment is currently being processed."}
          </p>
        </CardHeader>

        <CardContent className="space-y-6 pt-6 px-8">
          {bookingId && (
            <div className="p-4 rounded-xl bg-muted/50 border border-border space-y-3">
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground flex items-center gap-2">
                  <ArrowRight className="h-4 w-4" />
                  Booking ID
                </span>
                <span className="font-mono font-bold">#{bookingId}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Reservation Status
                </span>
                <span className={`font-semibold ${isSuccess ? "text-emerald-600" : "text-amber-600"}`}>
                  {isSuccess ? "Confirmed" : "Pending Payment"}
                </span>
              </div>
            </div>
          )}

          <div className="text-center space-y-2">
            <h4 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">What's Next?</h4>
            <p className="text-sm">
              {isSuccess 
                ? "A confirmation email has been sent to your inbox with all stay details."
                : "You can find this booking in your dashboard to try paying again."}
            </p>
          </div>
        </CardContent>

        <CardFooter className="flex flex-col gap-3 p-8 pt-4">
          <Link href="/user/bookings" className="w-full">
            <Button className="w-full h-12 text-lg font-semibold shadow-lg shadow-primary/20">
              {isSuccess ? "View My Bookings" : "View Dashboard"}
            </Button>
          </Link>
          
          <Link href="/" className="w-full">
            <Button variant="outline" className="w-full h-12 text-lg font-semibold hover:bg-primary/5">
              <Home className="mr-2 h-5 w-5" />
              Back to Home
            </Button>
          </Link>
        </CardFooter>
      </Card>
      
      <style jsx>{`
        @keyframes bounce-short {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        .animate-bounce-short {
          animation: bounce-short 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}

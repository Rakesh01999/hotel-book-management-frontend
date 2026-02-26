"use client";

import { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Cookies from "js-cookie";
import { toast } from "sonner";

function GoogleAuthCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const accessToken = searchParams.get("accessToken");
    const redirectTo = searchParams.get("redirectTo") || "/";

    if (accessToken) {
      // Set the token in a client-side accessible cookie for the middleware
      Cookies.set("accessToken", accessToken, { expires: 7 });
      
      toast.success("Logged in with Google successfully!");
      
      // Redirect to the intended destination (or home)
      router.push(redirectTo.startsWith("/") ? redirectTo : `/${redirectTo}`);
    } else {
      toast.error("Google authentication failed. No token received.");
      router.push("/login");
    }
  }, [router, searchParams]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      <p className="text-muted-foreground animate-pulse">Completing authentication...</p>
    </div>
  );
}

export default function GoogleAuthCallback() {
  return (
    <Suspense fallback={
        <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            <p className="text-muted-foreground animate-pulse">Loading...</p>
        </div>
    }>
      <GoogleAuthCallbackContent />
    </Suspense>
  );
}

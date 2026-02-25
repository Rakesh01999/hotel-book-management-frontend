"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import api from "@/lib/axios";

export default function AuthProvider({ children }: { children: React.ReactNode }) {
    const { login, logout, user, isAuthenticated } = useAuthStore();
    const [isLoading, setIsLoading] = useState(true);
    const [hasChecked, setHasChecked] = useState(false);

    useEffect(() => {
        const fetchProfile = async () => {
            console.log("AuthProvider: Checking session...");
            try {
                const response = await api.get("/auth/me");
                console.log("AuthProvider: Profile response success:", response.data.success);
                if (response.data.success) {
                    login(response.data.data, ""); 
                    console.log("AuthProvider: Logged in as:", response.data.data.email);
                }
            } catch (error: unknown) {
                console.log("AuthProvider: session check failed");
                // Only logout if explicitly unauthorized
                if (error && typeof error === 'object' && 'response' in error) {
                    const axiosError = error as { response?: { status: number } };
                    if (axiosError.response?.status === 401 || axiosError.response?.status === 403) {
                        if (isAuthenticated) logout();
                    }
                }
            } finally {
                setIsLoading(false);
                setHasChecked(true);
            }
        };

        // If we already have a user fromzustand persist, we don't need to block UI
        if (user && !hasChecked) {
            setIsLoading(false);
            fetchProfile(); // but still verify in background
        } else if (!hasChecked) {
            fetchProfile();
        }
    }, [login, logout, isAuthenticated, hasChecked, user]);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        );
    }

    return <>{children}</>;
}

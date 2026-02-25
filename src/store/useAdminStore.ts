import { create } from 'zustand';
import api from '@/lib/axios';
import { Booking } from '@/types/booking';
import { User } from '@/types/auth';

interface DashboardStats {
    totalBookings: number;
    revenue: number;
    activeUsers: number;
    totalRooms: number;
}

interface AdminState {
    stats: DashboardStats | null;
    isLoading: boolean;
    error: string | null;
    fetchDashboardStats: () => Promise<void>;
}

export const useAdminStore = create<AdminState>((set) => ({
    stats: null,
    isLoading: false,
    error: null,

    fetchDashboardStats: async () => {
        set({ isLoading: true, error: null });
        try {
            // Execute all fetches concurrently
            const [bookingsRes, usersRes, roomsRes] = await Promise.all([
                api.get('/book?page=1&limit=1000'),
                api.get('/auth'),
                api.get('/room')
            ]);

            const allBookings: Booking[] = bookingsRes.data?.data?.data || [];
            const totalBookings = bookingsRes.data?.data?.meta?.total || 0;

            const revenue = allBookings.reduce((sum: number, booking: Booking) => {
                if (booking.status !== 'CANCELLED') {
                    return sum + (booking.totalAmount || 0);
                }
                return sum;
            }, 0);

            const activeUsers = Array.isArray(usersRes.data?.data)
                ? (usersRes.data.data as User[]).filter((u: User) => u.status === 'ACTIVE').length
                : (usersRes.data?.data?.length || 0);

            const totalRooms = Array.isArray(roomsRes.data?.data)
                ? roomsRes.data.data.length
                : 0;

            set({
                stats: {
                    totalBookings,
                    revenue,
                    activeUsers,
                    totalRooms
                },
                isLoading: false
            });
        } catch (error: unknown) {
            console.error('Failed to fetch admin dashboard stats:', error);
            const message = error instanceof Error ? error.message : 'Failed to load dashboard statistics';
            set({
                error: message,
                isLoading: false
            });
        }
    },
}));

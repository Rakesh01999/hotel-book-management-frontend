import { create } from 'zustand';
import axios from '@/lib/axios';
import { Booking } from '@/types/booking';

interface BookingState {
    dates: { from: Date | undefined; to: Date | undefined };
    guests: { adults: number; children: number };
    userBookings: Booking[];
    isLoading: boolean;
    error: string | null;
    setDates: (dates: { from: Date | undefined; to: Date | undefined }) => void;
    setGuests: (guests: { adults: number; children: number }) => void;
    fetchUserBookings: (userId: number) => Promise<void>;
    resetBooking: () => void;
}

export const useBookingStore = create<BookingState>((set) => ({
    dates: { from: undefined, to: undefined },
    guests: { adults: 1, children: 0 },
    userBookings: [],
    isLoading: false,
    error: null,
    setDates: (dates) => set({ dates }),
    setGuests: (guests) => set({ guests }),

    fetchUserBookings: async (userId: number) => {
        set({ isLoading: true, error: null });
        try {
            // Using the endpoint discovered in backend: /api/booking?searchTerm=userId
            const response = await axios.get(`/booking?searchTerm=${userId}`);
            // The backend returns { data: { data: Booking[] } } based on my analysis
            set({ userBookings: response.data.data.data, isLoading: false });
        } catch (error: any) {
            set({ error: error.message || "Failed to fetch bookings", isLoading: false });
        }
    },

    resetBooking: () =>
        set({
            dates: { from: undefined, to: undefined },
            guests: { adults: 1, children: 0 },
        }),
}));

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
    createBooking: (bookingData: any) => Promise<{ url?: string; success: boolean }>;
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
            const response = await axios.get(`/book?searchTerm=${userId}`);
            set({ userBookings: response.data.data.data, isLoading: false });
        } catch (error: any) {
            set({ error: error.message || "Failed to fetch bookings", isLoading: false });
        }
    },

    createBooking: async (bookingData) => {
        set({ isLoading: true, error: null });
        try {
            // Using the Online booking endpoint (with payment)
            const response = await axios.post('/book/online-book', bookingData);
            set({ isLoading: false });
            return {
                url: response.data.data.url,
                success: true
            };
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || error.message || "Booking failed";
            set({ error: errorMessage, isLoading: false });
            return { success: false };
        }
    },

    resetBooking: () =>
        set({
            dates: { from: undefined, to: undefined },
            guests: { adults: 1, children: 0 },
        }),
}));

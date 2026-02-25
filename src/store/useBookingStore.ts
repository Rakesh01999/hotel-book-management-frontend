import { create } from 'zustand';
import axios from '@/lib/axios';
import { Booking, BookingRequest } from '@/types/booking';


interface BookingState {
    dates: { from: Date | undefined; to: Date | undefined };
    guests: { adults: number; children: number };
    userBookings: Booking[];
    isLoading: boolean;
    error: string | null;
    setDates: (dates: { from: Date | undefined; to: Date | undefined }) => void;
    setGuests: (guests: { adults: number; children: number }) => void;
    fetchUserBookings: (userId: number) => Promise<void>;
    createBooking: (bookingData: BookingRequest) => Promise<{ url?: string; success: boolean }>;
    checkAvailability: (checkIn: string, checkOut: string) => Promise<{
        success: boolean;
        data?: Array<{
            roomTypeId: number;
            totalRooms: number;
            availableRooms: number;
        }>;
    }>;
    checkSpecificRoomsStatus: (checkIn: string, checkOut: string) => Promise<{
        success: boolean;
        data?: {
            available: Array<{ roomId: number, roomNumber: number }>;
            booked: Array<{ roomId: number, roomNumber: number }>;
        };
    }>;
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
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : "Failed to fetch bookings";
            set({ error: message, isLoading: false });
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
        } catch (error: unknown) {
            console.error("Booking error:", error);
            const message = error instanceof Error ? error.message : "Booking failed";
            set({ error: message, isLoading: false });
            return { success: false };
        }
    },

    checkAvailability: async (checkIn: string, checkOut: string) => {
        try {
            const response = await axios.get('/book/available-rooms', {
                params: { checkIn, checkOut }
            });
            return { success: true, data: response.data.data };
        } catch (error: unknown) {
            console.error("Failed to check availability:", error);
            return { success: false };
        }
    },

    checkSpecificRoomsStatus: async (checkIn: string, checkOut: string) => {
        try {
            const response = await axios.get('/book/roomsDate', {
                params: { checkIn, checkOut }
            });
            return { success: true, data: response.data.data };
        } catch (error: unknown) {
            console.error("Failed to check specific rooms status:", error);
            return { success: false };
        }
    },

    resetBooking: () =>
        set({
            dates: { from: undefined, to: undefined },
            guests: { adults: 1, children: 0 },
        }),
}));

import { create } from 'zustand';

interface BookingState {
    dates: { from: Date | undefined; to: Date | undefined };
    guests: { adults: number; children: number };
    setDates: (dates: { from: Date | undefined; to: Date | undefined }) => void;
    setGuests: (guests: { adults: number; children: number }) => void;
    resetBooking: () => void;
}

export const useBookingStore = create<BookingState>((set) => ({
    dates: { from: undefined, to: undefined },
    guests: { adults: 1, children: 0 },
    setDates: (dates) => set({ dates }),
    setGuests: (guests) => set({ guests }),
    resetBooking: () =>
        set({
            dates: { from: undefined, to: undefined },
            guests: { adults: 1, children: 0 },
        }),
}));

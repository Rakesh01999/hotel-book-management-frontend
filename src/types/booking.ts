import { Room } from "./room";

export interface BookingRoom {
    id: number;
    bookingId: number;
    roomId: number;
    room: Room;
}

export interface Booking {
    id: number;
    userId: number;
    checkIn: string;
    checkOut: string;
    totalAmount: number;
    status: 'PENDING_PAYMENT' | 'CONFIRMED' | 'CANCELLED';
    adults: number;
    children: number;
    currency: string;
    paymentId?: string;
    createdAt: string;
    rooms: BookingRoom[];
}

export interface BookingApiResponse {
    success: boolean;
    message: string;
    data: {
        meta: {
            page: number;
            limit: number;
            total: number;
        };
        data: Booking[];
    };
}

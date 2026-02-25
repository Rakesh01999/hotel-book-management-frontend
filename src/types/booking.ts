import { User } from "./auth";
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
    status: 'PENDING_PAYMENT' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED' | 'PENDING';
    adults: number;
    children: number;
    currency: string;
    paymentId?: string;
    createdAt: string;
    rooms?: BookingRoom[];
    user?: User;
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

export interface RoomRequest {
    roomTypeId: number;
    quantity: number;
}

export interface BookingRequest {
    userId?: number;
    roomRequests: RoomRequest[];
    checkIn: string;
    checkOut: string;
    adults: number;
    children: number;
}


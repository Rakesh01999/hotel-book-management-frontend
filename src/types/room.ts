export interface Room {
    id: number;
    roomNumber: number;
    roomTypeId: number;
    roomType: RoomType;
    bookings?: any[];
}

export interface RoomType {
    id: number;
    name: string;
    description: string;
    price: number;
    images: string[];
    facilities: string[];
    rooms?: Room[];
}

export interface RoomApiResponse {
    success: boolean;
    message: string;
    data: Room[];
}

export interface RoomTypeApiResponse {
    success: boolean;
    message: string;
    data: RoomType[];
}

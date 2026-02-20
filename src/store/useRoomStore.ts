import { create } from "zustand";
import axios from "@/lib/axios";
import { Room, RoomType } from "@/types/room";

interface RoomState {
    rooms: Room[];
    roomTypes: RoomType[];
    isLoading: boolean;
    error: string | null;
    fetchRooms: () => Promise<void>;
    fetchRoomTypes: () => Promise<void>;
}

export const useRoomStore = create<RoomState>((set) => ({
    rooms: [],
    roomTypes: [],
    isLoading: false,
    error: null,

    fetchRooms: async () => {
        set({ isLoading: true, error: null });
        try {
            const response = await axios.get("/api/room");
            set({ rooms: response.data.data, isLoading: false });
        } catch (error: any) {
            set({ error: error.message || "Failed to fetch rooms", isLoading: false });
        }
    },

    fetchRoomTypes: async () => {
        set({ isLoading: true, error: null });
        try {
            const response = await axios.get("/api/roomCategory");
            set({ roomTypes: response.data.data, isLoading: false });
        } catch (error: any) {
            set({ error: error.message || "Failed to fetch room categories", isLoading: false });
        }
    },
}));

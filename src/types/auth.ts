export interface User {
    id: number;
    name: string;
    email: string;
    role: "USER" | "ADMIN";
    verified: boolean;
    status: "ACTIVE" | "BLOCKED" | "DELETED";
    profilePhoto?: string | null;
    contactNumber?: string | null;
    createdAt: string;
}

export interface AuthApiResponse {
    success: boolean;
    message: string;
    data: User;
}

export interface AuthListApiResponse {
    success: boolean;
    message: string;
    data: User[];
}

"use client";

import { useEffect, useState } from "react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, UserMinus, ShieldAlert, Mail, Ban, CheckCircle } from "lucide-react";
import api from "@/lib/axios";
import { toast } from "sonner";
import { User } from "@/types/auth"; // Central type
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ActionConfirmModal } from "@/components/modals/ActionConfirmModal";


/* Removed local User interface */


export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [statusAction, setStatusAction] = useState<{ id: number, status: 'ACTIVE' | 'BLOCKED' } | null>(null);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const response = await api.get("/auth");
      // The backend returns a list of users directly in data or data.data
      const userData = response.data?.data || [];
      setUsers(Array.isArray(userData) ? userData : []);
    } catch (error: unknown) {
      console.error("Failed to fetch users:", error);
      const message = error instanceof Error ? error.message : "Failed to load users";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDeleteUser = (id: number) => {
    setUserToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!userToDelete) return;

    setIsDeleting(true);
    try {
      await api.delete(`/auth/${userToDelete}`);
      toast.success("User removed successfully");
      fetchUsers();
      setIsDeleteModalOpen(false);
    } catch (error: unknown) {
      console.error("Delete error:", error);
      const message = error instanceof Error ? error.message : "Failed to remove user";
      toast.error(message);
    } finally {
      setIsDeleting(false);
      setUserToDelete(null);
    }
  };

  const handleToggleStatus = (id: number, currentStatus: string) => {
    setStatusAction({ 
      id, 
      status: currentStatus === 'ACTIVE' ? 'BLOCKED' : 'ACTIVE' 
    });
    setIsStatusModalOpen(true);
  };

  const confirmStatusChange = async () => {
    if (!statusAction) return;

    setIsUpdatingStatus(true);
    try {
      await api.patch(`/auth/${statusAction.id}/status`, { status: statusAction.status });
      toast.success(`User ${statusAction.status.toLowerCase()}ed successfully`);
      fetchUsers();
      setIsStatusModalOpen(false);
    } catch (error: unknown) {
      console.error("Status update error:", error);
      toast.error("Failed to update user status");
    } finally {
      setIsUpdatingStatus(false);
      setStatusAction(null);
    }
  };

  const filteredUsers = users.filter(u => 
    u.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">User Management</h1>

      <Card className="border-none shadow-md">
        <CardHeader className="bg-muted/30 border-b flex flex-row items-center justify-between py-4">
          <CardTitle className="text-lg flex items-center gap-2">
            <ShieldAlert className="h-5 w-5 text-primary" />
            Registered Members
          </CardTitle>
          <div className="relative w-full max-w-xs">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name or email..."
              className="pl-8 bg-background"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50 hover:bg-muted/50">
                <TableHead>User Information</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Skeleton className="h-10 w-10 rounded-full" />
                        <div className="space-y-2">
                          <Skeleton className="h-4 w-24" />
                          <Skeleton className="h-3 w-32" />
                        </div>
                      </div>
                    </TableCell>
                    <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-8 w-24 ml-auto" /></TableCell>
                  </TableRow>
                ))
              ) : filteredUsers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                    No users found matching your search.
                  </TableCell>
                </TableRow>
              ) : (
                filteredUsers.map((user) => (
                  <TableRow key={user.id} className="hover:bg-muted/20">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={user.profilePhoto || ""} />
                          <AvatarFallback>{(user.name || user.email).charAt(0).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{user.name || "N/A"}</div>
                          <div className="text-xs text-muted-foreground flex items-center gap-1">
                            <Mail className="h-3 w-3" /> {user.email}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={user.role === "ADMIN" ? "default" : "secondary"}>
                        {user.role}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        <Badge variant={user.status === "ACTIVE" ? "outline" : "destructive"} className={user.status === "ACTIVE" ? "text-green-600 border-green-200 bg-green-50" : ""}>
                          {user.status}
                        </Badge>
                        {user.verified && (
                          <span className="text-[10px] text-blue-500 font-medium">Verified Email</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      {user.role !== "ADMIN" && (
                        <div className="flex justify-end gap-2">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleToggleStatus(user.id, user.status)}
                            className={user.status === 'ACTIVE' ? "text-orange-600 hover:text-orange-700 hover:bg-orange-50" : "text-green-600 hover:text-green-700 hover:bg-green-50"}
                          >
                            {user.status === 'ACTIVE' ? (
                              <><Ban className="h-4 w-4 mr-2" /> Block</>
                            ) : (
                              <><CheckCircle className="h-4 w-4 mr-2" /> Unblock</>
                            )}
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleDeleteUser(user.id)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <UserMinus className="h-4 w-4 mr-2" />
                            Remove
                          </Button>
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <ActionConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        title="Remove User Account"
        description="Are you sure you want to remove this user? This action will mark their account as deleted. This cannot be undone."
        confirmText="Remove User"
        isLoading={isDeleting}
      />

      <ActionConfirmModal
        isOpen={isStatusModalOpen}
        onClose={() => setIsStatusModalOpen(false)}
        onConfirm={confirmStatusChange}
        title={statusAction?.status === 'BLOCKED' ? "Block User Account" : "Unblock User Account"}
        description={statusAction?.status === 'BLOCKED' 
          ? "Are you sure you want to block this user? They will not be able to log in to the system." 
          : "Are you sure you want to unblock this user? They will regain access to the system."
        }
        confirmText={statusAction?.status === 'BLOCKED' ? "Block User" : "Unblock User"}
        isLoading={isUpdatingStatus}
      />
    </div>
  );
}

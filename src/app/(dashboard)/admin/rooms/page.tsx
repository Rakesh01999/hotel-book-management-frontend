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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Plus, 
  Pencil, 
  Trash2, 
  Search, 
  Loader2,
  BedDouble
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import api from "@/lib/axios";
import { toast } from "sonner";
import { Room, RoomType } from "@/types/room"; // Central types
import { ActionConfirmModal } from "@/components/modals/ActionConfirmModal";


/* Removed local Room and RoomType interfaces */


export default function AdminRoomsPage() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [roomTypes, setRoomTypes] = useState<RoomType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [roomToDelete, setRoomToDelete] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Form states
  const [formData, setFormData] = useState({
    roomNumber: "",
    roomTypeId: "",
  });

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [roomsRes, typesRes] = await Promise.all([
        api.get("/room"),
        api.get("/roomCategory")
      ]);
      setRooms(roomsRes.data?.data || []);
      setRoomTypes(typesRes.data?.data || []);
    } catch (error: unknown) {
      console.error("Failed to fetch data:", error);
      const message = error instanceof Error ? error.message : "Failed to load rooms";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenCreate = () => {
    setEditingRoom(null);
    setFormData({ roomNumber: "", roomTypeId: "" });
    setIsDialogOpen(true);
  };

  const handleOpenEdit = (room: Room) => {
    setEditingRoom(room);
    setFormData({
      roomNumber: room.roomNumber.toString(),
      roomTypeId: room.roomTypeId.toString(),
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    setRoomToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!roomToDelete) return;
    
    setIsDeleting(true);
    try {
      await api.delete(`/room/${roomToDelete}`);
      toast.success("Room deleted");
      fetchData();
      setIsDeleteModalOpen(false);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Failed to delete room";
      toast.error(message);
    } finally {
      setIsDeleting(false);
      setRoomToDelete(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (editingRoom) {
        await api.patch(`/room/${editingRoom.id}`, {
          roomNumber: Number(formData.roomNumber),
          roomTypeId: Number(formData.roomTypeId),
        });
        toast.success("Room updated");
      } else {
        // Backend createRoom expects { roomNumbers: number[], roomTypeId: number }
        await api.post("/room", {
          roomNumbers: [Number(formData.roomNumber)],
          roomTypeId: Number(formData.roomTypeId),
        });
        toast.success("Room created");
      }
      
      setIsDialogOpen(false);
      fetchData();
    } catch (error: unknown) {
      console.error("Submission error:", error);
      const message = error instanceof Error ? error.message : "Failed to save room";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredRooms = rooms.filter(r => 
    r.roomNumber.toString().includes(searchTerm) ||
    r.roomType.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Physical Rooms</h1>
        <Button onClick={handleOpenCreate} className="flex items-center gap-2">
          <Plus className="h-4 w-4" /> Add Room
        </Button>
      </div>

      <Card className="border-none shadow-md">
        <CardHeader className="bg-muted/30 border-b flex flex-row items-center justify-between py-4">
          <CardTitle className="text-lg text-foreground flex items-center gap-2">
            <BedDouble className="h-5 w-5 text-primary" />
            Inventory List
          </CardTitle>
          <div className="relative w-full max-w-xs">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search room number or type..."
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
                <TableHead>Room Number</TableHead>
                <TableHead>Category Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                    <TableCell><Skeleton className="h-8 w-24 ml-auto" /></TableCell>
                  </TableRow>
                ))
              ) : filteredRooms.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                    No physical rooms found.
                  </TableCell>
                </TableRow>
              ) : (
                filteredRooms.map((room) => (
                  <TableRow key={room.id} className="hover:bg-muted/20">
                    <TableCell className="font-bold text-lg">
                      Room {room.roomNumber}
                    </TableCell>
                    <TableCell>
                      <span className="text-sm bg-muted px-2 py-1 rounded text-muted-foreground">
                        {room.roomType.name}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                        Active
                      </span>
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button variant="ghost" size="icon" onClick={() => handleOpenEdit(room)}>
                        <Pencil className="h-4 w-4 text-primary" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(room.id)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{editingRoom ? "Edit Room" : "Add Physical Room"}</DialogTitle>
            <DialogDescription>
              Assign a unique room number to a category.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="roomNumber" className="text-right">No.</Label>
              <Input 
                id="roomNumber" 
                type="number"
                className="col-span-3" 
                placeholder="e.g. 101"
                value={formData.roomNumber}
                onChange={(e) => setFormData({...formData, roomNumber: e.target.value})}
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="roomTypeId" className="text-right">Category</Label>
              <div className="col-span-3">
                <Select 
                  value={formData.roomTypeId} 
                  onValueChange={(val) => setFormData({...formData, roomTypeId: val})}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Category" />
                  </SelectTrigger>
                  <SelectContent>
                    {roomTypes.map((type) => (
                      <SelectItem key={type.id} value={type.id.toString()}>
                        {type.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" disabled={isSubmitting} className="w-full">
                {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                {editingRoom ? "Save Changes" : "Create Room"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <ActionConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        title="Remove Physical Room"
        description="Are you sure you want to remove this physical room from inventory? This action cannot be undone."
        confirmText="Remove Room"
        isLoading={isDeleting}
      />
    </div>
  );
}

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
  X, 
  Image as ImageIcon,
  Loader2
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
import { Textarea } from "@/components/ui/textarea";
import api from "@/lib/axios";
import { toast } from "sonner";
import { RoomType } from "@/types/room"; // Central type
import { ActionConfirmModal } from "@/components/modals/ActionConfirmModal";


/* Removed local RoomCategory interface */


export default function RoomCategoriesPage() {
  const [categories, setCategories] = useState<RoomType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingCategory, setEditingCategory] = useState<RoomType | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);


  // Form states
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    facilities: "",
  });
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const fetchCategories = async () => {
    setIsLoading(true);
    try {
      const response = await api.get("/roomCategory");
      setCategories(response.data?.data || []);
    } catch (error: unknown) {
      console.error("Failed to fetch categories:", error);
      const message = error instanceof Error ? error.message : "Failed to load room categories";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleOpenCreate = () => {
    setEditingCategory(null);
    setFormData({ name: "", description: "", price: "", facilities: "" });
    setSelectedFiles([]);
    setIsDialogOpen(true);
  };

  const handleOpenEdit = (category: RoomType) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      description: category.description,
      price: category.price.toString(),
      facilities: category.facilities.join(", "),
    });
    setSelectedFiles([]);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    setCategoryToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!categoryToDelete) return;
    
    setIsDeleting(true);
    try {
      await api.delete(`/roomCategory/${categoryToDelete}`);
      toast.success("Category deleted");
      fetchCategories();
      setIsDeleteModalOpen(false);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Failed to delete category";
      toast.error(message);
    } finally {
      setIsDeleting(false);
      setCategoryToDelete(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const facilitiesArray = formData.facilities.split(",").map(f => f.trim()).filter(f => f !== "");
      
      const payload = new FormData();
      payload.append("name", formData.name);
      payload.append("description", formData.description);
      payload.append("price", formData.price);
      payload.append("facilities", JSON.stringify(facilitiesArray));
      
      selectedFiles.forEach((file) => {
        payload.append("images", file);
      });

      if (editingCategory) {
        // Special case: update might not support FormData in some backends if using PATCH
        // Let's check backend controller logic for update
        await api.patch(`/roomCategory/${editingCategory.id}`, {
            name: formData.name,
            description: formData.description,
            price: Number(formData.price),
            facilities: facilitiesArray
        });
        toast.success("Category updated");
      } else {
        await api.post("/roomCategory", payload, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("Category created");
      }
      
      setIsDialogOpen(false);
      fetchCategories();
    } catch (error: unknown) {
      console.error("Submission error:", error);
      const message = error instanceof Error ? error.message : "Failed to save category";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredCategories = categories.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Room Categories</h1>
        <Button onClick={handleOpenCreate} className="flex items-center gap-2">
          <Plus className="h-4 w-4" /> Add Category
        </Button>
      </div>

      <Card className="border-none shadow-md">
        <CardHeader className="bg-muted/30 border-b flex flex-row items-center justify-between py-4">
          <CardTitle className="text-lg">Manage Types</CardTitle>
          <div className="relative w-full max-w-xs">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search categories..."
              className="pl-8 bg-background"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead>Category Name</TableHead>
                <TableHead>Price / Night</TableHead>
                <TableHead>Facilities</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-48" /></TableCell>
                    <TableCell><Skeleton className="h-8 w-24 ml-auto" /></TableCell>
                  </TableRow>
                ))
              ) : filteredCategories.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                    No categories found.
                  </TableCell>
                </TableRow>
              ) : (
                filteredCategories.map((type) => (
                  <TableRow key={type.id}>
                    <TableCell className="font-medium">{type.name}</TableCell>
                    <TableCell>${type.price}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {type.facilities.slice(0, 3).map((f, idx) => (
                          <span key={idx} className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded">
                            {f}
                          </span>
                        ))}
                        {type.facilities.length > 3 && (
                          <span className="text-xs text-muted-foreground">+{type.facilities.length - 3} more</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button variant="ghost" size="icon" onClick={() => handleOpenEdit(type)}>
                        <Pencil className="h-4 w-4 text-blue-500" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(type.id)}>
                        <Trash2 className="h-4 w-4 text-red-500" />
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
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{editingCategory ? "Edit Category" : "Add New Category"}</DialogTitle>
            <DialogDescription>
              Provide details for the room type. Images are required for new categories.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">Name</Label>
              <Input 
                id="name" 
                className="col-span-3" 
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="price" className="text-right">Price</Label>
              <Input 
                id="price" 
                type="number"
                className="col-span-3" 
                value={formData.price}
                onChange={(e) => setFormData({...formData, price: e.target.value})}
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="facilities" className="text-right">Facilities</Label>
              <Input 
                id="facilities" 
                placeholder="WiFi, TV, AC (comma separated)"
                className="col-span-3" 
                value={formData.facilities}
                onChange={(e) => setFormData({...formData, facilities: e.target.value})}
                required
              />
            </div>
            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="description" className="text-right mt-2">Description</Label>
              <Textarea 
                id="description" 
                className="col-span-3 min-h-[100px]" 
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                required
              />
            </div>
            {!editingCategory && (
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Images</Label>
                <div className="col-span-3">
                   <Label 
                     htmlFor="images" 
                     className="flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-4 cursor-pointer hover:bg-muted/50"
                   >
                     <ImageIcon className="h-8 w-8 text-muted-foreground mb-2" />
                     <span className="text-sm text-muted-foreground">Click to upload images</span>
                     <input 
                       id="images" 
                       type="file" 
                       multiple 
                       accept="image/*" 
                       className="hidden" 
                       onChange={(e) => setSelectedFiles(Array.from(e.target.files || []))}
                     />
                   </Label>
                   {selectedFiles.length > 0 && (
                     <p className="text-xs text-primary mt-2 font-medium">{selectedFiles.length} files selected</p>
                   )}
                </div>
              </div>
            )}
            <DialogFooter>
              <Button type="submit" disabled={isSubmitting} className="w-full">
                {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                {editingCategory ? "Update Category" : "Create Category"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <ActionConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        title="Delete Category"
        description="Are you sure? This will delete all rooms associated with this category. This action is irreversible."
        confirmText="Delete Category"
        isLoading={isDeleting}
      />
    </div>
  );
}

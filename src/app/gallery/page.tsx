"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, Maximize2, X, ChevronLeft, ChevronRight, ImageIcon } from "lucide-react";
import api from "@/lib/axios";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";

interface RoomType {
  id: number;
  name: string;
  images: string[];
}

interface GalleryImage {
  url: string;
  roomName: string;
  id: string;
}

export default function GalleryPage() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);

  useEffect(() => {
    const fetchGalleryImages = async () => {
      try {
        const response = await api.get("/roomCategory");
        const roomTypes: RoomType[] = response.data?.data || [];
        
        // Flatten all images from all room types
        const allImages: GalleryImage[] = roomTypes.flatMap((rt) => 
          (rt.images || []).map((url, index) => ({
            url,
            roomName: rt.name,
            id: `${rt.id}-${index}`
          }))
        );
        
        setImages(allImages);
      } catch (error) {
        console.error("Failed to fetch gallery images:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchGalleryImages();
  }, []);

  const openLightbox = (index: number) => setSelectedImageIndex(index);
  const closeLightbox = () => setSelectedImageIndex(null);
  
  const showNext = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (selectedImageIndex !== null) {
      setSelectedImageIndex((selectedImageIndex + 1) % images.length);
    }
  };

  const showPrev = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (selectedImageIndex !== null) {
      setSelectedImageIndex((selectedImageIndex - 1 + images.length) % images.length);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="text-muted-foreground font-medium animate-pulse">Curating your visual journey...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Hero Section */}
      <section className="relative h-[45vh] flex items-center justify-center overflow-hidden mb-12">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=2070&auto=format&fit=crop"
            alt="Gallery Cover"
            fill
            className="object-cover brightness-[0.4]"
            priority
          />
        </div>
        <div className="relative z-10 text-center text-white px-4">
          <motion.h1 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-5xl md:text-7xl font-bold tracking-tighter mb-4"
          >
            Visual <span className="bg-gradient-to-r from-amber-200 to-yellow-500 bg-clip-text text-transparent">Heritage</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg md:text-xl max-w-xl mx-auto text-white/70 font-light"
          >
            A curated look into the timeless elegance and sophisticated architecture of LuxeStay.
          </motion.p>
        </div>
        <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-background to-transparent" />
      </section>

      <div className="container px-4 sm:px-6">
        {/* Gallery Info */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div className="max-w-2xl">
            <Badge className="mb-4 bg-primary/10 text-primary border-none text-xs tracking-widest uppercase py-1 px-3">
              The Collection
            </Badge>
            <h2 className="text-4xl font-bold tracking-tight mb-4">Our Premium Spaces</h2>
            <p className="text-muted-foreground text-lg">
              Explore our diverse range of suites and common areas, each designed with meticulous attention to detail and a commitment to luxury.
            </p>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground bg-muted/30 px-4 py-2 rounded-full border border-border/50">
            <ImageIcon className="h-4 w-4" />
            <span className="text-sm font-medium">{images.length} Captures</span>
          </div>
        </div>

        {/* Masonry-style Grid */}
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
          {images.map((image, index) => (
            <motion.div
              key={image.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index % 10 * 0.1 }}
              className="relative group cursor-pointer break-inside-avoid overflow-hidden rounded-2xl shadow-sm hover:shadow-2xl transition-all duration-500 bg-muted"
              onClick={() => openLightbox(index)}
            >
              <Image
                src={image.url}
                alt={image.roomName}
                width={800}
                height={600}
                className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-110"
              />
              
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                <p className="text-white/60 text-xs font-medium tracking-widest uppercase mb-1">{image.roomName}</p>
                <div className="flex items-center justify-between">
                  <h3 className="text-white text-xl font-bold">Luxe View</h3>
                  <div className="bg-white/20 backdrop-blur-md p-2 rounded-full border border-white/30 transform transition-transform duration-300 group-hover:rotate-12">
                    <Maximize2 className="h-5 w-5 text-white" />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {images.length === 0 && !isLoading && (
          <div className="text-center py-24 border-2 border-dashed rounded-[3rem] border-muted">
            <div className="bg-muted p-6 rounded-full inline-block mb-4">
              <ImageIcon className="h-12 w-12 text-muted-foreground/50" />
            </div>
            <h3 className="text-xl font-semibold mb-2">The gallery is currently being curated</h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              We're currently gathering the finest captures of our spaces. Please check back soon for the full visual experience.
            </p>
          </div>
        )}
      </div>

      {/* Lightbox Rendering via shadcn-ui Dialog */}
      <Dialog open={selectedImageIndex !== null} onOpenChange={closeLightbox}>
        <DialogContent className="max-w-[95vw] max-h-[95vh] p-0 overflow-hidden bg-black/95 border-none">
          <DialogTitle className="sr-only">Image Preview</DialogTitle>
          <DialogDescription className="sr-only">Full screen view of the selected image</DialogDescription>
          
          <div className="relative w-full h-[85vh] flex items-center justify-center p-4 md:p-12">
            <AnimatePresence mode="wait">
              {selectedImageIndex !== null && (
                <motion.div
                  key={selectedImageIndex}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.05 }}
                  transition={{ duration: 0.3 }}
                  className="relative w-full h-full flex items-center justify-center"
                >
                  <Image
                    src={images[selectedImageIndex].url}
                    alt={images[selectedImageIndex].roomName}
                    fill
                    className="object-contain"
                    quality={100}
                    priority
                  />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Navigation Buttons */}
            <div className="absolute inset-0 flex items-center justify-between p-4 z-50 pointer-events-none">
              <Button
                variant="ghost"
                size="icon"
                className="h-12 w-12 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-md border border-white/20 pointer-events-auto transition-transform active:scale-90"
                onClick={showPrev}
              >
                <ChevronLeft className="h-8 w-8" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-12 w-12 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-md border border-white/20 pointer-events-auto transition-transform active:scale-90"
                onClick={showNext}
              >
                <ChevronRight className="h-8 w-8" />
              </Button>
            </div>

            {/* Close Button */}
            <button
              onClick={closeLightbox}
              className="absolute top-6 right-6 h-12 w-12 bg-white/10 hover:bg-white/20 text-white rounded-full flex items-center justify-center backdrop-blur-md transition-all z-50 border border-white/10 active:rotate-90"
            >
              <X className="h-6 w-6" />
            </button>
            
            {/* Info Overlay */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-white/10 backdrop-blur-xl px-8 py-3 rounded-full border border-white/20 z-50 text-center">
               <p className="text-white/60 text-[10px] tracking-[0.2em] uppercase font-bold mb-0.5">Luxestay Curated</p>
               <h4 className="text-white font-semibold">{selectedImageIndex !== null && images[selectedImageIndex].roomName}</h4>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

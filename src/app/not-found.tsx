import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Home, Map, Search } from "lucide-react";
import Image from "next/image";

export default function NotFound() {
  return (
    <div className="flex flex-col min-h-screen items-center justify-center relative overflow-hidden bg-slate-950">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <Image
          src="https://images.unsplash.com/photo-1571896349842-33c89424de2d?q=80&w=2080&auto=format&fit=crop"
          alt="Luxury Bedroom"
          fill
          className="object-cover opacity-40 grayscale"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent" />
      </div>

      <div className="container relative z-10 px-4 text-center space-y-8 max-w-2xl">
        <div className="space-y-2">
          <h1 className="text-8xl md:text-9xl font-extrabold tracking-tighter text-white opacity-20 select-none">
            404
          </h1>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white mt-[-2rem] md:mt-[-3rem]">
            Lost in Luxury?
          </h2>
        </div>

        <p className="text-lg md:text-xl text-slate-300 leading-relaxed">
          It seems you&apos;ve wandered into an uncharted suite. This page doesn&apos;t exist, but your dream stay is still waiting for you.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
          <Button asChild size="lg" className="h-12 px-8 text-lg shadow-xl shadow-primary/20 group">
            <Link href="/">
              <Home className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
              Return Home
            </Link>
          </Button>
          
          <Button asChild variant="outline" size="lg" className="h-12 px-8 text-lg border-white/20 text-white hover:bg-white/10 backdrop-blur-sm">
            <Link href="/rooms">
              <Search className="mr-2 h-5 w-5" />
              Browse Rooms
            </Link>
          </Button>
        </div>

        <div className="pt-12 flex items-center justify-center gap-2 text-slate-400 text-sm">
          <Map className="h-4 w-4" />
          <span>Need directions? <Link href="/contact" className="text-primary hover:underline">Contact Concierge</Link></span>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute bottom-0 left-0 w-full h-1/3 bg-gradient-to-t from-slate-950 to-transparent pointer-events-none" />
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary/10 rounded-full blur-3xl opacity-50" />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl opacity-50" />
    </div>
  );
}

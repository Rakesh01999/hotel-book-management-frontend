import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-50 border-t border-slate-900">
      <div className="container py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="space-y-6">
            <Link href="/" className="inline-block transition-transform hover:scale-105">
              <Image 
                src="/hotel_logo.png" 
                alt="LuxeStay Logo" 
                width={160} 
                height={45} 
                className="h-10 w-auto brightness-110"
              />
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed">
              Experience luxury and comfort in the heart of the city. We provide a seamless booking experience for the world's most premium stays.
            </p>
          </div>
          <div>
            <h4 className="font-bold text-white mb-6 uppercase tracking-wider text-xs">Quick Links</h4>
            <ul className="space-y-3 text-sm text-slate-400">
              <li><Link href="/about" className="hover:text-amber-400 transition-colors">About Us</Link></li>
              <li><Link href="/rooms" className="hover:text-amber-400 transition-colors">Rooms</Link></li>
              <li><Link href="/contact" className="hover:text-amber-400 transition-colors">Contact</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-white mb-6 uppercase tracking-wider text-xs">Support</h4>
            <ul className="space-y-3 text-sm text-slate-400">
              <li><Link href="/faq" className="hover:text-amber-400 transition-colors">FAQ</Link></li>
              <li><Link href="/policy" className="hover:text-amber-400 transition-colors">Policy</Link></li>
              <li><Link href="/privacy" className="hover:text-amber-400 transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-white mb-6 uppercase tracking-wider text-xs">Connect</h4>
            <div className="space-y-3 text-sm text-slate-400">
              <p>123 Hotel Street, City, Country</p>
              <p className="text-white font-medium">+1 234 567 890</p>
              <div className="pt-4 flex gap-4">
                {/* Social placeholders could go here */}
              </div>
            </div>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-slate-900 text-center text-xs text-slate-500 tracking-wide uppercase">
          &copy; {new Date().getFullYear()} LuxeStay. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Mail, Phone, MapPin, Globe, History, Target, Users } from "lucide-react";
import Image from "next/image";

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[400px] flex items-center justify-center overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=2070&auto=format&fit=crop"
          alt="Luxury Hotel"
          fill
          className="object-cover brightness-50"
          priority
        />
        <div className="relative z-10 text-center text-white px-4">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">About LuxeStay</h1>
          <p className="text-lg md:text-xl max-w-2xl mx-auto font-light">
            Redefining luxury hospitality with passion, elegance, and unparalleled service.
          </p>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-16 bg-background">
        <div className="container px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
                <History className="h-4 w-4" />
                <span>Our Journey</span>
              </div>
              <h2 className="text-3xl font-bold">A Legacy of Excellence</h2>
              <p className="text-muted-foreground leading-relaxed">
                Founded in 2010, LuxeStay began with a simple vision: to create a sanctuary where luxury meets comfort. What started as a single boutique hotel has grown into a prestigious collection of properties known for their distinctive character and exceptional standards.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Over the decade, we have hosted thousands of guests, each contributing to our rich history of hospitality. Our commitment to innovation and tradition ensures that every stay is more than just a visit—it's an experience to remember.
              </p>
            </div>
            <div className="relative h-[350px] rounded-2xl overflow-hidden shadow-2xl">
              <Image
                src="https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2070&auto=format&fit=crop"
                alt="Hotel Lobby"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 bg-muted/30">
        <div className="container px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="border-none shadow-sm bg-background">
              <CardContent className="pt-8 text-center space-y-4">
                <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto text-primary">
                  <Target className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold">Our Mission</h3>
                <p className="text-muted-foreground text-sm">
                  To provide an unforgettable luxury experience through meticulous attention to detail and personalized service that exceeds guest expectations.
                </p>
              </CardContent>
            </Card>

            <Card className="border-none shadow-sm bg-background">
              <CardContent className="pt-8 text-center space-y-4">
                <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto text-primary">
                  <Globe className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold">Our Vision</h3>
                <p className="text-muted-foreground text-sm">
                  To be the global benchmark for luxury hospitality, setting standards for sustainability, innovation, and timeless elegance across the world.
                </p>
              </CardContent>
            </Card>

            <Card className="border-none shadow-sm bg-background">
              <CardContent className="pt-8 text-center space-y-4">
                <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto text-primary">
                  <Users className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold">Our Values</h3>
                <p className="text-muted-foreground text-sm">
                  Integrity, respect, and a passion for excellence guide everything we do, ensuring a culture of hospitality that feels like home.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Team CTA */}
      <section className="py-20 bg-background text-center">
        <div className="container px-4 space-y-8">
          <h2 className="text-3xl md:text-4xl font-bold">Ready to Experience Luxury?</h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Book your stay today and discover why LuxeStay is the preferred choice for discerning travelers worldwide.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="px-8 shadow-lg shadow-primary/20">
              Browse Rooms
            </Button>
            <Button size="lg" variant="outline" className="px-8">
              Contact Sales
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}

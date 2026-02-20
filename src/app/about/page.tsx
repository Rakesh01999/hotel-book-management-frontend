"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Mail, Phone, MapPin, Globe, History, Target, Users } from "lucide-react";
import Image from "next/image";
import { useTranslation } from "@/hooks/useTranslation";
import Link from "next/link";

export default function AboutPage() {
  const { t } = useTranslation();

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
          <h1 className="text-4xl md:text-6xl font-bold mb-4">{t("about.title")}</h1>
          <p className="text-lg md:text-xl max-w-2xl mx-auto font-light">
            {t("about.subtitle")}
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
                <span>{t("about.badge")}</span>
              </div>
              <h2 className="text-3xl font-bold">{t("about.legacyTitle")}</h2>
              <p className="text-muted-foreground leading-relaxed">
                {t("about.legacyText1")}
              </p>
              <p className="text-muted-foreground leading-relaxed">
                {t("about.legacyText2")}
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
                <h3 className="text-xl font-bold">{t("about.mission.title")}</h3>
                <p className="text-muted-foreground text-sm">
                   {t("about.mission.desc")}
                </p>
              </CardContent>
            </Card>

            <Card className="border-none shadow-sm bg-background">
              <CardContent className="pt-8 text-center space-y-4">
                <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto text-primary">
                  <Globe className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold">{t("about.vision.title")}</h3>
                <p className="text-muted-foreground text-sm">
                  {t("about.vision.desc")}
                </p>
              </CardContent>
            </Card>

            <Card className="border-none shadow-sm bg-background">
              <CardContent className="pt-8 text-center space-y-4">
                <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto text-primary">
                  <Users className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold">{t("about.values.title")}</h3>
                <p className="text-muted-foreground text-sm">
                  {t("about.values.desc")}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Team CTA */}
      <section className="py-20 bg-background text-center">
        <div className="container px-4 space-y-8">
          <h2 className="text-3xl md:text-4xl font-bold">{t("about.cta.title")}</h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            {t("about.cta.desc")}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/rooms">
              <Button size="lg" className="px-8 shadow-lg shadow-primary/20 w-full sm:w-auto">
                {t("about.cta.browse")}
              </Button>
            </Link>
            <Link href="/contact">
              <Button size="lg" variant="outline" className="px-8 w-full sm:w-auto">
                {t("about.cta.contact")}
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

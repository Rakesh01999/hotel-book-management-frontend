"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Phone, MapPin, Send, Clock, MessageSquare } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";

export default function ContactPage() {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="bg-primary/5 py-12 md:py-20">
        <div className="container px-4 text-center space-y-4">
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight">{t("contact.title")}</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            {t("contact.subtitle")}
          </p>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Information */}
            <div className="space-y-8">
              <div className="space-y-4">
                <h2 className="text-2xl font-bold">{t("contact.info.title")}</h2>
                <p className="text-muted-foreground">
                  {t("contact.info.desc")}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <Card className="border-none shadow-sm bg-muted/30">
                  <CardContent className="pt-6 space-y-3">
                    <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                      <Phone className="h-5 w-5" />
                    </div>
                    <h3 className="font-semibold">{t("contact.info.phone")}</h3>
                    <p className="text-sm text-muted-foreground">+1 (234) 567-890<br />+1 (234) 567-891</p>
                  </CardContent>
                </Card>

                <Card className="border-none shadow-sm bg-muted/30">
                  <CardContent className="pt-6 space-y-3">
                    <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                      <Mail className="h-5 w-5" />
                    </div>
                    <h3 className="font-semibold">{t("contact.info.email")}</h3>
                    <p className="text-sm text-muted-foreground">info@luxestay.com<br />support@luxestay.com</p>
                  </CardContent>
                </Card>

                <Card className="border-none shadow-sm bg-muted/30">
                  <CardContent className="pt-6 space-y-3">
                    <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                      <MapPin className="h-5 w-5" />
                    </div>
                    <h3 className="font-semibold">{t("contact.info.address")}</h3>
                    <p className="text-sm text-muted-foreground">123 Luxury Avenue,<br />Grand City, GC 10001</p>
                  </CardContent>
                </Card>

                <Card className="border-none shadow-sm bg-muted/30">
                  <CardContent className="pt-6 space-y-3">
                    <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                      <Clock className="h-5 w-5" />
                    </div>
                    <h3 className="font-semibold">{t("contact.info.hours")}</h3>
                    <p className="text-sm text-muted-foreground">{t("contact.info.hoursVal")}<br />Reception: 24h</p>
                  </CardContent>
                </Card>
              </div>

              <div className="p-6 bg-primary/5 rounded-2xl border border-primary/10 flex items-start gap-4">
                <MessageSquare className="h-6 w-6 text-primary mt-1" />
                <div>
                  <h4 className="font-semibold">{t("contact.info.liveChat")}</h4>
                  <p className="text-sm text-muted-foreground mb-4">
                    {t("contact.info.liveChatDesc")}
                  </p>
                  <Button variant="link" className="p-0 h-auto text-primary font-semibold">
                    {t("contact.info.startChat")} →
                  </Button>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <Card className="shadow-xl border-muted/20">
              <CardHeader>
                <CardTitle className="text-2xl font-bold">{t("contact.form.title")}</CardTitle>
                <CardDescription>
                  {t("contact.form.desc")}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label htmlFor="first-name" className="text-sm font-medium">{t("contact.form.firstName")}</label>
                      <Input id="first-name" placeholder="John" />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="last-name" className="text-sm font-medium">{t("contact.form.lastName")}</label>
                      <Input id="last-name" placeholder="Doe" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium">{t("contact.form.email")}</label>
                    <Input id="email" type="email" placeholder="john@example.com" />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="subject" className="text-sm font-medium">{t("contact.form.subject")}</label>
                    <Input id="subject" placeholder="General Inquiry" />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="message" className="text-sm font-medium">{t("contact.form.message")}</label>
                    <Textarea id="message" placeholder={t("contact.form.messagePlaceholder")} className="min-h-[150px] resize-none" />
                  </div>
                  <Button className="w-full h-12 text-lg shadow-lg shadow-primary/20" type="submit">
                    <Send className="h-4 w-4 mr-2" />
                    {t("contact.form.send")}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Map Section (Placeholder Image) */}
      <section className="h-[400px] relative">
         <Image 
          src="https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=2074&auto=format&fit=crop"
          alt="Map Location"
          fill
          className="object-cover grayscale active:grayscale-0 transition-all duration-500 cursor-pointer"
         />
         <div className="absolute inset-0 bg-primary/10 pointer-events-none"></div>
      </section>
    </div>
  );
}

import { ScrollArea } from "@/components/ui/scroll-area";
import { ShieldCheck, Lock, Eye, FileText, Bell, Globe } from "lucide-react";

export default function PrivacyPolicyPage() {
  const sections = [
    {
      title: "Data We Collect",
      icon: <Eye className="h-6 w-6" />,
      content: "We collect information you provide directly to us when you book a room, create an account, or contact us. This includes your name, email address, phone number, and payment information."
    },
    {
      title: "How We Use Data",
      icon: <ShieldCheck className="h-6 w-6" />,
      content: "Your data is used to process bookings, provide customer support, and improve our services. We may also send you promotional offers if you've opted into our newsletter."
    },
    {
      title: "Data Security",
      icon: <Lock className="h-6 w-6" />,
      content: "We implement industry-standard security measures to protect your personal information from unauthorized access, disclosure, or alteration."
    },
    {
      title: "Cookies Policy",
      icon: <Globe className="h-6 w-6" />,
      content: "Our website uses cookies to enhance your browsing experience and analyze site traffic. You can manage your cookie preferences in your browser settings."
    },
    {
      title: "Changes to Policy",
      icon: <Bell className="h-6 w-6" />,
      content: "We may update this Privacy Policy from time to time. Any changes will be posted on this page with an updated effective date."
    }
  ];

  return (
    <div className="container mx-auto px-4 py-16 md:py-24 max-w-4xl">
      <div className="flex flex-col items-center text-center space-y-6 mb-16">
        <div className="h-16 w-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
          <FileText className="h-8 w-8" />
        </div>
        <h1 className="text-3xl md:text-5xl font-bold tracking-tight">Privacy Policy</h1>
        <p className="text-muted-foreground text-lg max-w-2xl">
          At LuxeStay, we value your privacy and are committed to protecting your personal information.
        </p>
        <div className="text-sm text-muted-foreground bg-muted px-4 py-2 rounded-full">
          Last Updated: February 20, 2026
        </div>
      </div>

      <div className="space-y-12">
        <section className="prose prose-slate dark:prose-invert max-w-none">
          <h2 className="text-2xl font-bold mb-4">Introduction</h2>
          <p className="text-muted-foreground leading-relaxed">
            Welcome to LuxeStay. This Privacy Policy explains how we collect, use, and protect your information when you use our website and services. By accessing LuxeStay, you agree to the terms outlined in this policy.
          </p>
        </section>

        <div className="grid gap-8">
          {sections.map((section, index) => (
            <div key={index} className="flex gap-6 items-start p-6 rounded-2xl border border-muted-foreground/10 hover:border-primary/20 transition-colors">
              <div className="h-12 w-12 rounded-xl bg-primary/5 flex items-center justify-center text-primary shrink-0">
                {section.icon}
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold">{section.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{section.content}</p>
              </div>
            </div>
          ))}
        </div>

        <section className="bg-primary/5 p-8 rounded-3xl border border-primary/10 text-center space-y-4">
          <h2 className="text-2xl font-bold">Contact Us Regarding Privacy</h2>
          <p className="text-muted-foreground">
            If you have any questions or concerns about our Privacy Policy or data handling, please contact our Data Protection Officer.
          </p>
          <p className="font-semibold text-primary">privacy@luxestay.com</p>
        </section>
      </div>
    </div>
  );
}

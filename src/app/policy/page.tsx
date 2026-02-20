import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Info, CheckCircle2, AlertCircle, Clock, CreditCard, Ban } from "lucide-react";

export default function PolicyPage() {
  const policies = [
    {
      id: "item-1",
      title: "Check-in & Check-out",
      icon: <Clock className="h-5 w-5 mr-3 text-primary" />,
      content: "Check-in time is from 2:00 PM onwards, and Check-out time is by 11:00 AM. Early check-in or late check-out is subject to availability and may incur additional charges."
    },
    {
      id: "item-2",
      title: "Cancellation Policy",
      icon: <Ban className="h-5 w-5 mr-3 text-primary" />,
      content: "Cancellations made 48 hours prior to arrival are free of charge. Cancellations within 48 hours or no-shows will be charged for the first night's stay including taxes."
    },
    {
      id: "item-3",
      title: "Payment Policy",
      icon: <CreditCard className="h-5 w-5 mr-3 text-primary" />,
      content: "A valid credit card is required to guarantee your booking. Full payment is usually taken upon check-in. We accept major credit cards and digital payments."
    },
    {
      id: "item-4",
      title: "No-Smoking Policy",
      icon: <AlertCircle className="h-5 w-5 mr-3 text-primary" />,
      content: "All our rooms and public spaces are strictly non-smoking. A cleaning fee of $250 will be applied to the guest's account if smoking is detected in the room."
    },
    {
      id: "item-5",
      title: "Pet Policy",
      icon: <Info className="h-5 w-5 mr-3 text-primary" />,
      content: "Small pets (under 10kg) are welcome in designated pet-friendly rooms. An additional cleaning fee of $50 per stay applies."
    }
  ];

  return (
    <div className="container mx-auto px-4 py-16 md:py-24 max-w-4xl">
      <div className="space-y-4 text-center mb-16">
        <h1 className="text-3xl md:text-5xl font-bold tracking-tight">Our Policies</h1>
        <p className="text-muted-foreground text-lg">
          Please review our general stay and booking policies to ensure a smooth and pleasant experience.
        </p>
      </div>

      <div className="grid gap-12">
        <section className="space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-semibold">
            <CheckCircle2 className="h-4 w-4" />
            <span>Standard Guest Policies</span>
          </div>
          
          <Accordion type="single" collapsible className="w-full border rounded-2xl overflow-hidden bg-background shadow-sm">
            {policies.map((policy) => (
              <AccordionItem key={policy.id} value={policy.id} className="border-b last:border-0 px-6">
                <AccordionTrigger className="hover:no-underline py-6">
                  <span className="flex items-center text-lg font-semibold text-left">
                    {policy.icon}
                    {policy.title}
                  </span>
                </AccordionTrigger>
                <AccordionContent className="pb-6 text-muted-foreground leading-relaxed text-base">
                  {policy.content}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </section>

        <section className="bg-muted/40 p-8 rounded-3xl space-y-4">
          <h3 className="text-xl font-bold">Additional Information</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Special requests are subject to availability upon check-in and may incur additional charges. Special requests cannot be guaranteed. Guests are required to show a photo identification and credit card upon check-in. Please note that all Special Requests are subject to availability and additional charges may apply.
          </p>
        </section>
      </div>
    </div>
  );
}

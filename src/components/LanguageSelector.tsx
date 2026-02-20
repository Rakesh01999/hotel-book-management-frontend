"use client";

import * as React from "react";
import { Globe, Check } from "lucide-react";
import { useLanguageStore, languages } from "@/store/useLanguageStore";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function LanguageSelector() {
  const { currentLanguage, setLanguage } = useLanguageStore();
  const [open, setOpen] = React.useState(false);

  const handleSelect = (code: string) => {
    setLanguage(code);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" title="Choose Language">
          <Globe className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Choose Your Preferred Language</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-1 gap-2">
            {languages.map((lang) => (
              <Button
                key={lang.code}
                variant="ghost"
                className={cn(
                  "w-full justify-between items-center h-12 px-4 hover:bg-muted font-medium",
                  currentLanguage.code === lang.code && "bg-primary/5 text-primary hover:bg-primary/10"
                )}
                onClick={() => handleSelect(lang.code)}
              >
                <div className="flex flex-col items-start">
                  <span>{lang.name}</span>
                  <span className="text-xs text-muted-foreground font-normal">{lang.nativeName}</span>
                </div>
                {currentLanguage.code === lang.code && (
                  <Check className="h-4 w-4" />
                )}
              </Button>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

"use client";

import { useLanguageStore } from "@/store/useLanguageStore";
import { translations, TranslationKeys } from "@/lib/translations";

export function useTranslation() {
    const { currentLanguage } = useLanguageStore();
    const code = (currentLanguage?.code || "en") as keyof TranslationKeys;

    const t = (path: string) => {
        const keys = path.split(".");
        let result: any = translations[code];

        for (const key of keys) {
            if (result && result[key]) {
                result = result[key];
            } else {
                return path; // Fallback to key if not found
            }
        }

        return result as string;
    };

    return { t, currentLanguage };
}

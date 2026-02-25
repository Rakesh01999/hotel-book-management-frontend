"use client";

import { useLanguageStore } from "@/store/useLanguageStore";
import { translations, TranslationKeys } from "@/lib/translations";

export function useTranslation() {
    const { currentLanguage } = useLanguageStore();
    const code = (currentLanguage?.code || "en") as keyof TranslationKeys;

    const t = (path: string) => {
        const keys = path.split(".");
        let result = translations[code] as unknown;

        for (const key of keys) {
            if (result && typeof result === 'object' && (result as Record<string, unknown>)[key]) {
                result = (result as Record<string, unknown>)[key];
            } else {
                return path; // Fallback to key if not found
            }
        }

        return result as string;
    };

    return { t, currentLanguage };
}

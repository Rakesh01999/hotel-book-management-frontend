import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Language = {
    code: string;
    name: string;
    nativeName: string;
};

export const languages: Language[] = [
    { code: "en", name: "English", nativeName: "English" },
    { code: "id", name: "Indonesia", nativeName: "Bahasa Indonesia" },
    { code: "ms", name: "Melayu", nativeName: "Bahasa Melayu" },
    { code: "tr", name: "Turkish", nativeName: "Türkçe" },
    { code: "ar", name: "Arabic", nativeName: "العربية" },
];

interface LanguageState {
    currentLanguage: Language;
    setLanguage: (code: string) => void;
}

export const useLanguageStore = create<LanguageState>()(
    persist(
        (set) => ({
            currentLanguage: languages[0], // English default
            setLanguage: (code) => {
                const lang = languages.find((l) => l.code === code) || languages[0];
                set({ currentLanguage: lang });
            },
        }),
        {
            name: "language-storage",
        }
    )
);

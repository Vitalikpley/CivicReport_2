import { createContext, useEffect, useMemo, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Localization from "expo-localization";
import i18n, { initI18n, languages } from "./locales/languages";

const STORAGE_KEY = "app_language";

export const LanguageContext = createContext({
    language: "en",
    setLanguage: async () => {},
    isReady: false,
});

function normalizeLang(lang) {
    const short = (lang || "").split("-")[0];
    return languages[short] ? short : "en";
}

export function LanguageProvider({ children }) {
    const [language, setLanguageState] = useState("en");
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        (async () => {
            try {
                const saved = await AsyncStorage.getItem(STORAGE_KEY);
                const device = normalizeLang(Localization.getLocales?.()?.[0]?.languageTag);
                const initial = normalizeLang(saved || device || "en");

                initI18n(initial);
                await i18n.changeLanguage(initial);

                setLanguageState(initial);
            } finally {
                setIsReady(true);
            }
        })();
    }, []);

    const setLanguage = async (lang) => {
        const next = normalizeLang(lang);
        setLanguageState(next);
        await i18n.changeLanguage(next);
        await AsyncStorage.setItem(STORAGE_KEY, next);
    };

    const value = useMemo(
        () => ({ language, setLanguage, isReady }),
        [language, isReady]
    );

    return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}
import { createContext, useEffect, useMemo, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { THEMES } from "./themes";

const STORAGE_KEY = "app_theme";

export const ThemeContext = createContext({
    themeKey: "light",
    theme: THEMES.light,
    setThemeKey: () => {},
    toggleTheme: () => {},
    isReady: false,
});

export function ThemeProvider({ children }) {
    const [themeKey, setThemeKeyState] = useState("light");
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        (async () => {
            try {
                const saved = await AsyncStorage.getItem(STORAGE_KEY);
                if (saved && THEMES[saved]) setThemeKeyState(saved);
            } finally {
                setIsReady(true);
            }
        })();
    }, []);

    const setThemeKey = async (key) => {
        if (!THEMES[key]) return;
        setThemeKeyState(key);
        await AsyncStorage.setItem(STORAGE_KEY, key);
    };

    const toggleTheme = async () => {
        const next = themeKey === "light" ? "dark" : "light";
        await setThemeKey(next);
    };

    const value = useMemo(() => {
        return {
            themeKey,
            theme: THEMES[themeKey],
            setThemeKey,
            toggleTheme,
            isReady,
        };
    }, [themeKey, isReady]);

    return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}
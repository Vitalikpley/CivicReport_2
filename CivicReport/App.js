import { useContext, useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import { NavigationContainer, DefaultTheme, DarkTheme } from "@react-navigation/native";
import { ThemeProvider, ThemeContext } from "./src/theme/ThemeProvider";
import { LanguageProvider, LanguageContext } from "./src/i18n/languageProvider";
import { AuthProvider, useAuth } from "./src/auth/AuthProvider";
import { initDb } from "./src/db/sqlite";
import { syncOfflineViolations } from "./src/services/sync";
import { FilterProvider } from "./src/services/FilterProvider";
import DrawerNavigator from "./src/navigation/DrawersNavigator";

function AppInnerWithAuth() {
    const { theme, isReady } = useContext(ThemeContext);
    const { isReady: isLangReady } = useContext(LanguageContext);
    const { isAuthenticated, isReady: isAuthReady } = useAuth();

    useEffect(() => {
        initDb().catch((e) => console.warn("SQLite init:", e));
    }, []);

    useEffect(() => {
        if (isAuthReady && isAuthenticated) {
            const timer = setTimeout(() => {
                syncOfflineViolations()
                    .then((result) => {
                        if (result.synced > 0) {
                            console.log(`[App] Synced ${result.synced} violations on startup`);
                        }
                    })
                    .catch((e) => console.warn("[App] Sync error on startup:", e));
            }, 2000);

            return () => clearTimeout(timer);
        }
    }, [isAuthReady, isAuthenticated]);

    if (!isReady || !isLangReady) return null;

    const navTheme =
        theme.mode === "dark"
            ? { ...DarkTheme, colors: { ...DarkTheme.colors, ...theme.colors } }
            : { ...DefaultTheme, colors: { ...DefaultTheme.colors, ...theme.colors } };

    const isDark = theme.mode === "dark";

    return (
        <>
            <StatusBar style={isDark ? "light" : "dark"} />
            <NavigationContainer theme={navTheme}>
                <DrawerNavigator />
            </NavigationContainer>
        </>
    );
}


export default function App() {
    return (
        <LanguageProvider>
            <ThemeProvider>
                <AuthProvider>
                    <FilterProvider>
                        <AppInnerWithAuth />
                    </FilterProvider>
                </AuthProvider>
            </ThemeProvider>
        </LanguageProvider>
    );
}

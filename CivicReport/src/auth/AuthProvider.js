import { createContext, useContext, useEffect, useState, useMemo } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { authAPI, isOnline } from "../services/api";

const AUTH_TOKEN_KEY = "auth_token";
const USER_DATA_KEY = "user_data";

export const AuthContext = createContext({
    isAuthenticated: false,
    user: null,
    login: async () => {},
    register: async () => {},
    logout: async () => {},
    isReady: false,
});

export function AuthProvider({ children }) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null);
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        (async () => {
            try {
                const token = await AsyncStorage.getItem(AUTH_TOKEN_KEY);
                const userData = await AsyncStorage.getItem(USER_DATA_KEY);
                if (token && userData) {
                    setIsAuthenticated(true);
                    setUser(JSON.parse(userData));
                }
            } catch (e) {
                console.warn("Auth init error:", e);
            } finally {
                setIsReady(true);
            }
        })();
    }, []);

    const login = async (email, password) => {
        try {
            const online = await isOnline();
            if (!online) {
                return { success: false, error: "Немає інтернет-з'єднання" };
            }

            const response = await authAPI.login(email, password);

            await AsyncStorage.setItem(AUTH_TOKEN_KEY, response.token);
            await AsyncStorage.setItem(USER_DATA_KEY, JSON.stringify(response.user));

            setIsAuthenticated(true);
            setUser(response.user);

            return { success: true };
        } catch (error) {
            console.error("[Auth] Login error:", error);
            const errorMessage = error.response?.data?.error || "Помилка входу";
            return { success: false, error: errorMessage };
        }
    };

    const register = async (firstName, lastName, email, password) => {
        try {
            const online = await isOnline();
            if (!online) {
                return { success: false, error: "Немає інтернет-з'єднання" };
            }

            await authAPI.register(firstName, lastName, email, password);
            const loginResponse = await authAPI.login(email, password);

            await AsyncStorage.setItem(AUTH_TOKEN_KEY, loginResponse.token);
            await AsyncStorage.setItem(USER_DATA_KEY, JSON.stringify(loginResponse.user));

            setIsAuthenticated(true);
            setUser(loginResponse.user);

            return { success: true };
        } catch (error) {
            console.error("[Auth] Register error:", error);
            const errorMessage = error.response?.data?.error || "Помилка реєстрації";
            return { success: false, error: errorMessage };
        }
    };

    const logout = async () => {
        await AsyncStorage.removeItem(AUTH_TOKEN_KEY);
        await AsyncStorage.removeItem(USER_DATA_KEY);
        setIsAuthenticated(false);
        setUser(null);
    };

    const value = useMemo(
        () => ({
            isAuthenticated,
            user,
            login,
            register,
            logout,
            isReady,
        }),
        [isAuthenticated, user, isReady]
    );

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    return useContext(AuthContext);
}

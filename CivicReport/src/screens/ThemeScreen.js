import { useContext } from "react";
import { View, Text, Pressable } from "react-native";
import { useTranslation } from "react-i18next";
import { ThemeContext } from "../Theme/ThemeProvider";

export default function ThemeScreen() {
    const { t } = useTranslation();
    const { themeKey, toggleTheme, theme } = useContext(ThemeContext);

    return (
        <View style={{ flex: 1, padding: 16, backgroundColor: theme.colors.background }}>
            <Text style={{ color: theme.colors.text, fontSize: 18, marginBottom: 12 }}>
                {t("theme.current")}: {themeKey}
            </Text>

            <Pressable
                onPress={toggleTheme}
                style={{
                    paddingVertical: 12,
                    paddingHorizontal: 16,
                    backgroundColor: theme.colors.primary,
                    borderRadius: 12,
                    alignSelf: "flex-start",
                }}
            >
                <Text style={{ color: "#fff", fontWeight: "600" }}>{t("theme.toggle")}</Text>
            </Pressable>
        </View>
    );
}
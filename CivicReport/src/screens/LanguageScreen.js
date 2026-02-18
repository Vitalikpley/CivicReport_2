import { useContext } from "react";
import { View, Text, Pressable } from "react-native";
import { useTranslation } from "react-i18next";
import { LanguageContext } from "../i18n/languageProvider";
import { ThemeContext } from "../Theme/ThemeProvider";

export default function LanguageScreen() {
    const { t } = useTranslation();
    const { language, setLanguage } = useContext(LanguageContext);
    const { theme } = useContext(ThemeContext);

    return (
        <View style={{ flex: 1, padding: 16, backgroundColor: theme.colors.background }}>
            <Text style={{ color: theme.colors.text, fontSize: 18, marginBottom: 12 }}>
                {t("language.current")}: {language}
            </Text>

            <Pressable
                onPress={() => setLanguage("uk")}
                style={{ padding: 12, borderRadius: 12, marginBottom: 10, backgroundColor: theme.colors.surface }}
            >
                <Text style={{ color: theme.colors.text }}>{t("language.ukrainian")}</Text>
            </Pressable>

            <Pressable
                onPress={() => setLanguage("en")}
                style={{ padding: 12, borderRadius: 12, backgroundColor: theme.colors.surface }}
            >
                <Text style={{ color: theme.colors.text }}>{t("language.english")}</Text>
            </Pressable>
        </View>
    );
}

import { useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    Pressable,
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
} from "react-native";
import { useTheme } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../auth/AuthProvider";

export default function RegisterScreen({ navigation }) {
    const { colors } = useTheme();
    const { t } = useTranslation();
    const { register } = useAuth();
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);


    const handleRegister = async () => {
        if (password !== confirmPassword) {
            Alert.alert("", t("auth.passwordMismatch") || "Паролі не збігаються.");
            return;
        }
        setLoading(true);
        try {
            const result = await register(firstName.trim(), lastName.trim(), email.trim(), password);
            if (result.success) {
                Alert.alert(t("common.success") || "Успішно", t("auth.registerSuccess") || "Реєстрація успішна! Автоматичний вхід...");
                // Navigation handled by auth state
            } else {
                Alert.alert("", result.error || "Помилка реєстрації. Спробуйте ще раз.");
            }
        } catch (e) {
            console.warn("Register error:", e);
            Alert.alert("", "Помилка реєстрації. Спробуйте ще раз.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView
            style={[styles.container, { backgroundColor: colors.background }]}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                keyboardShouldPersistTaps="handled"
            >
                <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                    <Text style={[styles.title, { color: colors.text }]}>{t("auth.register")}</Text>

                    <View style={styles.row}>
                        <View style={[styles.inputContainer, styles.halfWidth]}>
                            <Text style={[styles.label, { color: colors.text }]}>{t("auth.firstName")}</Text>
                            <TextInput
                                value={firstName}
                                onChangeText={setFirstName}
                                placeholder="Іван"
                                placeholderTextColor={colors.border}
                                style={[styles.input, { backgroundColor: colors.background, borderColor: colors.border, color: colors.text }]}
                                autoCapitalize="words"
                            />
                        </View>
                        <View style={[styles.inputContainer, styles.halfWidth]}>
                            <Text style={[styles.label, { color: colors.text }]}>{t("auth.lastName")}</Text>
                            <TextInput
                                value={lastName}
                                onChangeText={setLastName}
                                placeholder="Іванов"
                                placeholderTextColor={colors.border}
                                style={[styles.input, { backgroundColor: colors.background, borderColor: colors.border, color: colors.text }]}
                                autoCapitalize="words"
                            />
                        </View>
                    </View>

                    <View style={styles.inputContainer}>
                        <Text style={[styles.label, { color: colors.text }]}>{t("auth.email")}</Text>
                        <TextInput
                            value={email}
                            onChangeText={setEmail}
                            placeholder="example@email.com"
                            placeholderTextColor={colors.border}
                            style={[styles.input, { backgroundColor: colors.background, borderColor: colors.border, color: colors.text }]}
                            keyboardType="email-address"
                            autoCapitalize="none"
                            autoCorrect={false}
                        />
                    </View>

                    <View style={styles.inputContainer}>
                        <Text style={[styles.label, { color: colors.text }]}>{t("auth.password")}</Text>
                        <View style={styles.passwordContainer}>
                            <TextInput
                                value={password}
                                onChangeText={setPassword}
                                placeholder="••••••••"
                                placeholderTextColor={colors.border}
                                style={[styles.input, styles.passwordInput, { backgroundColor: colors.background, borderColor: colors.border, color: colors.text }]}
                                secureTextEntry={!showPassword}
                                autoCapitalize="none"
                            />
                            <Pressable
                                onPress={() => setShowPassword(!showPassword)}
                                style={styles.eyeButton}
                            >
                                <Ionicons
                                    name={showPassword ? "eye-off" : "eye"}
                                    size={20}
                                    color={colors.text}
                                />
                            </Pressable>
                        </View>
                    </View>

                    <View style={styles.inputContainer}>
                        <Text style={[styles.label, { color: colors.text }]}>{t("auth.confirmPassword")}</Text>
                        <View style={styles.passwordContainer}>
                            <TextInput
                                value={confirmPassword}
                                onChangeText={setConfirmPassword}
                                placeholder="••••••••"
                                placeholderTextColor={colors.border}
                                style={[styles.input, styles.passwordInput, { backgroundColor: colors.background, borderColor: colors.border, color: colors.text }]}
                                secureTextEntry={!showConfirmPassword}
                                autoCapitalize="none"
                            />
                            <Pressable
                                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                                style={styles.eyeButton}
                            >
                                <Ionicons
                                    name={showConfirmPassword ? "eye-off" : "eye"}
                                    size={20}
                                    color={colors.text}
                                />
                            </Pressable>
                        </View>
                    </View>

                    <Pressable
                        onPress={handleRegister}
                        disabled={loading}
                        style={[styles.button, { backgroundColor: colors.primary, opacity: loading ? 0.6 : 1 }]}
                    >
                        <Text style={styles.buttonText}>{loading ? "..." : t("auth.registerButton")}</Text>
                    </Pressable>

                    <View style={styles.footer}>
                        <Text style={[styles.footerText, { color: colors.text }]}>{t("auth.haveAccount")} </Text>
                        <Pressable onPress={() => navigation.navigate("Login")}>
                            <Text style={[styles.footerLink, { color: colors.primary }]}>
                                {t("auth.goToLogin")}
                            </Text>
                        </Pressable>
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
        justifyContent: "center",
        padding: 24,
    },
    card: {
        borderRadius: 16,
        padding: 24,
        borderWidth: 1,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
    },
    title: {
        fontSize: 28,
        fontWeight: "700",
        marginBottom: 32,
        textAlign: "center",
    },
    row: {
        flexDirection: "row",
        gap: 12,
    },
    inputContainer: {
        marginBottom: 20,
    },
    halfWidth: {
        flex: 1,
    },
    label: {
        fontSize: 14,
        fontWeight: "600",
        marginBottom: 8,
    },
    input: {
        borderWidth: 1,
        borderRadius: 12,
        padding: 14,
        fontSize: 16,
    },
    passwordContainer: {
        position: "relative",
    },
    passwordInput: {
        paddingRight: 50,
    },
    eyeButton: {
        position: "absolute",
        right: 14,
        top: 14,
        padding: 4,
    },
    button: {
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: "center",
        marginTop: 8,
    },
    buttonText: {
        color: "#fff",
        fontWeight: "600",
        fontSize: 16,
    },
    footer: {
        flexDirection: "row",
        justifyContent: "center",
        marginTop: 24,
    },
    footerText: {
        fontSize: 14,
    },
    footerLink: {
        fontSize: 14,
        fontWeight: "600",
    },
});

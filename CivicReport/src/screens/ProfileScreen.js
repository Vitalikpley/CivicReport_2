import { View, Text, StyleSheet } from "react-native";
import { useTheme } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import { useAuth } from "../auth/AuthProvider";

export default function ProfileScreen() {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated || !user) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Text style={{ color: colors.text }}>{t("auth.notLoggedIn")}</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <Text style={[styles.label, { color: colors.text }]}>{t("auth.firstName")}:</Text>
        <Text style={[styles.value, { color: colors.text }]}>{user.firstName}</Text>

        <Text style={[styles.label, { color: colors.text }]}>{t("auth.lastName")}:</Text>
        <Text style={[styles.value, { color: colors.text }]}>{user.lastName}</Text>

        <Text style={[styles.label, { color: colors.text }]}>{t("auth.email")}:</Text>
        <Text style={[styles.value, { color: colors.text }]}>{user.email}</Text>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignItems: "center",
    justifyContent: "flex-start",
  },
  card: {
    width: '100%',
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    marginTop: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: "bold",
    marginTop: 10,
    opacity: 0.7,
  },
  value: {
    fontSize: 18,
    marginBottom: 10,
  }
});
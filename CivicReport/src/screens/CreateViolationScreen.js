import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  Alert,
  ScrollView,
  Image,
  useWindowDimensions,
} from "react-native";
import { useTheme, useNavigation } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import { insertOfflineViolation } from "../db/sqlite";
import { uploadImage } from "../services/cloudinary";
import { violationsAPI, isOnline } from "../services/api";
import { useAuth } from "../auth/AuthProvider";


const VIOLATION_CATEGORY_KEYS = [
    "road_damage",
    "illegal_parking",
    "garbage",
    "lighting",
    "other",
];

export default function CreateViolationScreen() {
  const { colors } = useTheme();
  const navigation = useNavigation();
  const { t } = useTranslation();
  const { isAuthenticated } = useAuth();
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState(VIOLATION_CATEGORY_KEYS[0]);
  const [photoBase64, setPhotoBase64] = useState(null);
  const [photoMime, setPhotoMime] = useState(null);

  const [photoUri, setPhotoUri] = useState(null);
  const [photoFileName, setPhotoFileName] = useState(null);

  const [saving, setSaving] = useState(false);

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(t("violation.takePhoto"), "Дозвіл камери потрібен для зйомки.");
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      base64: true,
    });
    if (!result.canceled && result.assets?.[0]) {
      const asset = result.assets[0];
      setPhotoBase64(asset.base64 ?? null);
      setPhotoMime(asset.mimeType ?? "image/jpeg");

      setPhotoUri(asset.uri ?? null);
      setPhotoFileName(asset.fileName || asset.uri?.split("/").pop() || "photo.jpg");

    }
  };

  const save = async () => {
        if (!description.trim()) {
            Alert.alert("", "Введіть опис.");
            return;
        }
        if (!photoBase64) {
            Alert.alert("", "Зробіть фото.");
            return;
        }

        setSaving(true);

        const datetime = new Date().toISOString();
        const trimmedDesc = description.trim();
        const mime = photoMime ?? "image/jpeg";

        let latitude = null;
        let longitude = null;
        try {
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status === "granted") {
                const currentLocation = await Location.getCurrentPositionAsync({});
                latitude = currentLocation.coords.latitude;
                longitude = currentLocation.coords.longitude;
                console.log("Geolocation:", latitude, longitude);
            }
        } catch (locErr) {
            console.warn("Location error:", locErr);
        }

        try {
            // Завжди спочатку зберігаємо локально в SQLite
            const localId = await insertOfflineViolation({
                description: trimmedDesc,
                category,
                datetime,
                photoBase64,
                photoMime: mime,
                latitude,
                longitude,
            });

            console.log("[SQLite] Порушення збережено локально з ID:", localId);

            // Перевіряємо інтернет
            const online = await isOnline();
            
            if (online) {
                try {
                    // Завантажуємо фото в Cloudinary
                    let photoUrl = null;
                    if (photoUri) {
                        try {
                            photoUrl = await uploadImage(photoUri, photoFileName, mime);
                            console.log("[Cloudinary] Фото завантажено:", photoUrl);
                        } catch (uploadErr) {
                            console.warn("[Cloudinary] Помилка завантаження:", uploadErr);
                            Alert.alert("", "Порушення збережено локально, але фото не завантажено.");
                        }
                    }

                    // Відправляємо на сервер
                    if (photoUrl) {
                        const violationData = {
                            description: trimmedDesc,
                            category,
                            dateTime: datetime,
                            photoUrl,
                            latitude: latitude || 0,
                            longitude: longitude || 0,
                        };

                        await violationsAPI.create(violationData);
                        console.log("[API] Порушення відправлено на сервер");

                        // Видаляємо з локальної БД після успішної відправки
                        if (localId) {
                            const { deleteViolation } = require("../db/sqlite");
                            await deleteViolation(localId);
                            console.log("[SQLite] Локальний запис видалено після синхронізації");
                        }

                        Alert.alert("", t("violation.saved"));
                    } else {
                        Alert.alert("", "Порушення збережено локально. Спробуйте пізніше.");
                    }
                } catch (apiErr) {
                    console.warn("[API] Помилка відправки на сервер:", apiErr);
                    Alert.alert("", "Порушення збережено локально. Воно буде синхронізовано пізніше.");
                }
            } else {
                // Офлайн режим - тільки локальне збереження
                Alert.alert("", "Порушення збережено локально. Воно буде синхронізовано при відновленні інтернету.");
            }

            // Очищаємо форму
            setDescription("");
            setCategory(VIOLATION_CATEGORY_KEYS[0]);
            setPhotoBase64(null);
            setPhotoMime(null);
            setPhotoUri(null);
            setPhotoFileName(null);
        } catch (e) {
            console.warn("Save violation error:", e);
            Alert.alert("", "Помилка збереження.");
        } finally {
            setSaving(false);
        }
    };

  const { width } = useWindowDimensions();
  const thumbSize = Math.min(width - 32, 120);

  if (!isAuthenticated) {
    return (
      <View style={[styles.lockedContainer, { backgroundColor: colors.background }]}>
          <Text style={[styles.lockedTitle, { color: colors.text }]}>
              {t("auth.loginRequiredTitle")}
          </Text>

          <Text style={[styles.lockedText, { color: colors.text }]}>
              {t("auth.loginRequiredText")}
          </Text>
        <Pressable
          onPress={() => navigation.getParent()?.navigate("Auth")}
          style={[styles.lockedButton, { backgroundColor: colors.primary }]}
        >
          <Text style={styles.lockedButtonText}>{t("auth.loginButton")}</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
    >
      <Pressable
        onPress={takePhoto}
        style={[styles.photoBox, { backgroundColor: colors.surface, borderColor: colors.border }]}
      >
        {photoBase64 ? (
          <Image
            source={{ uri: `data:${photoMime ?? "image/jpeg"};base64,${photoBase64}` }}
            style={{ width: thumbSize, height: thumbSize, borderRadius: 8 }}
            resizeMode="cover"
          />
        ) : (
          <Text style={{ color: colors.text }}>{t("violation.takePhoto")}</Text>
        )}
      </Pressable>

      <Text style={[styles.label, { color: colors.text }]}>{t("violation.description")}</Text>
      <TextInput
        value={description}
        onChangeText={setDescription}
        placeholderTextColor={colors.border}
        style={[styles.input, { backgroundColor: colors.surface, borderColor: colors.border, color: colors.text }]}
        placeholder="..."
        multiline
        numberOfLines={3}
      />

      <Text style={[styles.label, { color: colors.text }]}>{t("violation.category")}</Text>
      <View style={styles.categoryRow}>
        {VIOLATION_CATEGORY_KEYS.map((key) => (
          <Pressable
            key={key}
            onPress={() => setCategory(key)}
            style={[
              styles.categoryChip,
              { backgroundColor: category === key ? colors.primary : colors.surface, borderColor: colors.border },
            ]}
          >
            <Text style={[styles.categoryText, { color: category === key ? "#fff" : colors.text }]}>
              {t(`categories.${key}`)}
            </Text>
          </Pressable>
        ))}
      </View>

      <Pressable
        onPress={save}
        disabled={saving}
        style={[styles.saveBtn, { backgroundColor: colors.primary }]}
      >
        <Text style={styles.saveBtnText}>{saving ? "..." : t("violation.save")}</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 16, paddingBottom: 32 },
  photoBox: {
    width: "100%",
    minHeight: 120,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  label: { fontSize: 14, fontWeight: "600", marginBottom: 6 },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
    minHeight: 80,
    marginBottom: 16,
  },
  categoryRow: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 24 },
  categoryChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  categoryText: { fontSize: 14 },
  saveBtn: { paddingVertical: 14, borderRadius: 12, alignItems: "center" },
  saveBtnText: { color: "#fff", fontWeight: "600", fontSize: 16 },
  lockedContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  lockedTitle: {
    fontSize: 18,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 12,
  },
  lockedText: {
    fontSize: 14,
    textAlign: "center",
    marginBottom: 24,
  },
  lockedButton: {
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 12,
  },
  lockedButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
});

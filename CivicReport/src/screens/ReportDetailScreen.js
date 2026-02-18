import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Image,
    ActivityIndicator,
} from "react-native";
import { useTheme, useRoute } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";
import { violationsAPI } from "../services/api";
import MapView, { Marker } from "react-native-maps";

export default function ReportDetailScreen() {
    const { colors } = useTheme();
    const { t } = useTranslation();
    const route = useRoute();
    const { violation: initialViolation } = route.params || {};

    const [violation, setViolation] = useState(initialViolation);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!initialViolation?.id) return;

        const fetchDetails = async () => {
            setLoading(true);
            try {
                const data = await violationsAPI.getById(initialViolation.id);

                if (data) {
                    setViolation(data);
                }

            } catch (e) {
                console.warn("Error fetching violation details:", e);
            } finally {
                setLoading(false);
            }
        };

        if (!initialViolation.description || !initialViolation.photo) {
            fetchDetails();
        }
    }, [initialViolation]);

    if (loading) {
        return (
            <View
                style={[
                    styles.loaderContainer,
                    { backgroundColor: colors.background },
                ]}
            >
                <ActivityIndicator size="large" color={colors.primary} />
            </View>
        );
    }

    if (!violation) {
        return (
            <View
                style={[
                    styles.loaderContainer,
                    { backgroundColor: colors.background },
                ]}
            >
                <Text style={{ color: colors.text }}>
                    {t("common.noData")}
                </Text>
            </View>
        );
    }

    const imageSource = violation.photoUrl
        ? { uri: violation.photoUrl }
        : null;

    return (
        <ScrollView
            style={[styles.container, { backgroundColor: colors.background }]}
            contentContainerStyle={{ paddingBottom: 40 }}
        >
            {imageSource ? (
                <Image source={imageSource} style={styles.image} resizeMode="cover" />
            ) : (
                <View
                    style={[
                        styles.imagePlaceholder,
                        { backgroundColor: colors.card },
                    ]}
                >
                    <Text style={{ color: colors.text, opacity: 0.6 }}>
                        {t("common.noPhoto")}
                    </Text>
                </View>
            )}

            {/* Контент */}
            <View style={styles.content}>
                <Text style={[styles.category, { color: colors.primary }]}>
                    {t(`categories.${violation.category}`) || violation.category}
                </Text>

                <Text style={[styles.date, { color: colors.text }]}>
                    {new Date(
                        violation.dateTime || violation.date
                    ).toLocaleString()}
                </Text>

                <View style={styles.section}>
                    <Text style={[styles.label, { color: colors.text }]}>
                        {t("violation.description") || "Опис"}
                    </Text>
                    <Text style={[styles.description, { color: colors.text }]}>
                        {violation.description ||
                            t("common.noDescription") ||
                            "Немає опису"}
                    </Text>
                </View>

                {violation.location && (
                    <View style={styles.section}>
                        <Text style={[styles.label, { color: colors.text }]}>
                            {t("violation.location")}
                        </Text>

                        <MapView
                            style={styles.miniMap}
                            //pointerEvents="none" // щоб карта не скролилась
                            initialRegion={{
                                latitude: violation.location.latitude,
                                longitude: violation.location.longitude,
                                latitudeDelta: 0.01,
                                longitudeDelta: 0.01,
                            }}
                        >
                            <Marker
                                coordinate={{
                                    latitude: violation.location.latitude,
                                    longitude: violation.location.longitude,
                                }}
                            />
                        </MapView>
                    </View>
                )}

                {violation.status && (
                    <View style={styles.section}>
                        <Text style={[styles.label, { color: colors.text }]}>
                            {t("violation.status") || "Статус"}
                        </Text>
                        <Text style={[styles.description, { color: colors.text }]}>
                            {violation.status}
                        </Text>
                    </View>
                )}
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    loaderContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    image: {
        width: "100%",
        height: 260,
    },
    imagePlaceholder: {
        width: "100%",
        height: 260,
        justifyContent: "center",
        alignItems: "center",
    },
    content: {
        padding: 20,
    },
    category: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 8,
    },
    date: {
        fontSize: 14,
        marginBottom: 20,
        opacity: 0.7,
    },
    section: {
        marginBottom: 18,
    },
    label: {
        fontSize: 15,
        fontWeight: "600",
        marginBottom: 6,
    },
    description: {
        fontSize: 16,
        lineHeight: 24,
    },
    miniMap: {
        width: "100%",
        height: 200,
        borderRadius: 12,
        marginTop: 8,
    },
});

import { useState, useEffect, useCallback } from "react";
import { View, Text, StyleSheet, ActivityIndicator, Alert } from "react-native";
import { useTheme, useNavigation } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import { useFocusEffect } from "@react-navigation/native";
import MapView, { Marker, Callout } from "react-native-maps";
import * as Location from "expo-location";
import { violationsAPI, isOnline } from "../services/api";
import { fetchViolations } from "../db/sqlite";

export default function MapScreen() {
    const { colors } = useTheme();
    const { t } = useTranslation();
    const navigation = useNavigation();
    const [violations, setViolations] = useState([]);
    const [userLocation, setUserLocation] = useState(null);
    const [loading, setLoading] = useState(true);

    const loadViolations = useCallback(async () => {
        setLoading(true);
        try {
            const online = await isOnline();

            if (!online) {
                // Офлайн
                setViolations([]);
                return;
            }

            try {
                // Отримуємо геолокації з бекенду
                const locations = await violationsAPI.getAll();
                console.log("[Map] Locations from API:", locations.length);

                const violationsData = locations.map((loc) => ({
                    id: loc.id,
                    latitude: loc.location.latitude,
                    longitude: loc.location.longitude
                }));

                setViolations(violationsData);
            } catch (apiErr) {
                console.warn("[Map] API error:", apiErr);
                Alert.alert('Помилка', 'Сервер не доступний. Неможливо завантажити геолокації.');
                setViolations([]);
            }
        } catch (e) {
            console.warn("Load violations error:", e);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        const getCurrentLocation = async () => {
            try {
                const { status } = await Location.requestForegroundPermissionsAsync();
                if (status === "granted") {
                    const currentLocation = await Location.getCurrentPositionAsync({});
                    setUserLocation(currentLocation);
                }
            } catch (e) {
                console.warn("Location error:", e);
            }
        };
        getCurrentLocation();
    }, []);

    useFocusEffect(
        useCallback(() => {
            loadViolations();
        }, [loadViolations])
    );

    if (loading) {
        return (
            <View style={[styles.container, { backgroundColor: colors.background }]}>
                <ActivityIndicator size="large" color={colors.primary} />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <MapView
                style={styles.map}
                initialRegion={{
                    latitude: 49.0,
                    longitude: 30.0,
                    latitudeDelta: 7,
                    longitudeDelta: 7,
                }}
                showsUserLocation={false} //userLocation != null
            >
                {violations.map((violation) => (
                    <Marker
                        key={violation.id}
                        coordinate={{
                            latitude: violation.latitude,
                            longitude: violation.longitude,
                        }}
                        onPress={() => navigation.navigate("ReportDetail", { violation: violation })}
                    >
                        <View style={styles.marker}>
                            <View style={styles.markerDot} />
                        </View>
                    </Marker>
                ))}
            </MapView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    map: {
        width: "100%",
        height: "100%",
    },
    marker: {
        alignItems: "center",
        justifyContent: "center",
    },
    markerDot: {
        width: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: "#FF0000",
        borderWidth: 2,
        borderColor: "#FFFFFF",
    },
});

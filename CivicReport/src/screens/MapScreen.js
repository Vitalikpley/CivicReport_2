import { useState, useEffect, useCallback } from "react";
import { View, StyleSheet, ActivityIndicator, Alert } from "react-native";
import { useTheme, useNavigation } from "@react-navigation/native";
import { useFocusEffect } from "@react-navigation/native";
import { Marker } from "react-native-maps";
import * as Location from "expo-location";
import { violationsAPI, isOnline } from "../services/api";
import { useFilter } from "../services/FilterProvider";
import MapView from 'react-native-map-clustering';

export default function MapScreen() {
    const { colors } = useTheme();
    const navigation = useNavigation();
    const [violations, setViolations] = useState([]);
    const [loading, setLoading] = useState(true);
    const { selectedCategory } = useFilter();

    const loadViolations = useCallback(async () => {
        setLoading(true);
        try {
            const online = await isOnline();

            if (!online) {
                setViolations([]);
                return;
            }

            try {
                const locations = await violationsAPI.getAll();
                console.log("[Map] Locations from API:", locations.length);

                const violationsData = locations.map((loc) => ({
                    id: loc.id,
                    latitude: loc.location.latitude,
                    longitude: loc.location.longitude,
                    category: loc.category
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
                showsUserLocation={false}
            >
                {violations
                    .filter(v => !selectedCategory || v.category === selectedCategory)
                    .map((violation) => (
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

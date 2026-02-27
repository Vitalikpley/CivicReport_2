import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { useTheme, useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { useFilter } from '../services/FilterProvider';
import Categories from '../components/Categories';

export default function FilterScreen() {
    const { colors } = useTheme();
    const { t } = useTranslation();
    const navigation = useNavigation();
    const { selectedCategory, setSelectedCategory, resetFilter } = useFilter();

    // Local state to hold the selection until "Apply" is pressed
    const [localCategory, setLocalCategory] = useState(selectedCategory);

    const handleApply = () => {
        setSelectedCategory(localCategory);
        navigation.navigate("Home");
    };

    const handleReset = () => {
        resetFilter();
        setLocalCategory(null);
        navigation.navigate("Home");
    };

    return (
        <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
            <View style={styles.content}>
                <Text style={[styles.title, { color: colors.text }]}>
                    {t("filter.title")}
                </Text>

                <Categories
                    selectedCategory={localCategory}
                    onSelect={setLocalCategory}
                    showAllOption={true}
                />

                <View style={styles.buttonRow}>
                    <Pressable
                        style={[styles.button, styles.resetButton, { borderColor: colors.border }]}
                        onPress={handleReset}
                    >
                        <Text style={[styles.buttonText, { color: colors.text }]}>
                            {t("filter.reset")}
                        </Text>
                    </Pressable>

                    <Pressable
                        style={[styles.button, styles.applyButton, { backgroundColor: colors.primary }]}
                        onPress={handleApply}
                    >
                        <Text style={[styles.buttonText, { color: "#fff" }]}>
                            {t("filter.apply")}
                        </Text>
                    </Pressable>
                </View>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        padding: 20,
    },
    title: {
        fontSize: 20,
        fontWeight: '700',
        marginBottom: 24,
    },
    buttonRow: {
        flexDirection: 'row',
        gap: 12,
        marginTop: 24,
    },
    button: {
        flex: 1,
        height: 50,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
    },
    resetButton: {
        backgroundColor: 'transparent',
    },
    applyButton: {
        borderWidth: 0,
    },
    buttonText: {
        fontSize: 16,
        fontWeight: '600',
    }
});

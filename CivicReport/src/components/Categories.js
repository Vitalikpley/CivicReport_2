import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { Picker } from '@react-native-picker/picker';

const VIOLATION_CATEGORY_KEYS = [
    "road_damage",
    "illegal_parking",
    "garbage",
    "lighting",
    "other",
    "sda",
    "sda",
];

const Categories = ({ selectedCategory, onSelect, showAllOption = false }) => {
    const { colors } = useTheme();
    const { t } = useTranslation();

    const categories = VIOLATION_CATEGORY_KEYS

    const handleSelect = (value) => {
        if (value === "all") {
            onSelect(null);
        } else {
            onSelect(value);
        }
    };

    if (categories.length > 6) {
        return (
            <View style={[styles.pickerContainer, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                <Picker
                    selectedValue={selectedCategory || "all"}
                    onValueChange={(itemValue) => handleSelect(itemValue)}
                    style={{ color: colors.text }}
                    dropdownIconColor={colors.text}
                >
                    {categories.map((key) => (
                        <Picker.Item
                            key={key}
                            label={key === "all" ? t("categories.all") : t(`categories.${key}`)}
                            value={key}
                        />
                    ))}
                </Picker>
            </View>
        );
    }

    return (
        <View style={styles.categoryRow}>
            {categories.map((key) => {
                const isSelected = (key === "all" && selectedCategory === null) || (selectedCategory === key);
                return (
                    <Pressable
                        key={key}
                        onPress={() => handleSelect(key)}
                        style={[
                            styles.categoryChip,
                            {
                                backgroundColor: isSelected ? colors.primary : colors.surface,
                                borderColor: colors.border
                            },
                        ]}
                    >
                        <Text style={[styles.categoryText, { color: isSelected ? "#fff" : colors.text }]}>
                            {key === "all" ? t("categories.all") : t(`categories.${key}`)}
                        </Text>
                    </Pressable>
                );
            })}
        </View>
    );
};

const styles = StyleSheet.create({
    categoryRow: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 8,
        marginBottom: 16
    },
    categoryChip: {
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 20,
        borderWidth: 1,
    },
    categoryText: {
        fontSize: 14
    },
    pickerContainer: {
        borderWidth: 1,
        borderRadius: 12,
        marginBottom: 16,
        overflow: 'hidden',
    }
});

export default Categories;
export { VIOLATION_CATEGORY_KEYS };

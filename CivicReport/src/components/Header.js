import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';

const Header = ({ currentDate, onPrev, onNext, onToday, isLandscape }) => {
    const { colors } = useTheme();
    const { i18n } = useTranslation();

    const formatDate = (date) => {
        const locale = i18n.language === 'uk' ? 'uk-UA' : 'en-US';
        const formatter = new Intl.DateTimeFormat(locale, {
            month: 'long',
            year: 'numeric',
        });
        const str = formatter.format(date);
        return str.charAt(0).toUpperCase() + str.slice(1);
    };

    const todayLabel = i18n.language === 'uk' ? 'Сьогодні' : 'Today';

    return (
        <View style={[
            styles.container,
            isLandscape && styles.containerLandscape,
            { backgroundColor: colors.card }
        ]}>
            <TouchableOpacity
                onPress={onToday}
                style={[styles.todayButton, isLandscape && styles.todayButtonLandscape, { backgroundColor: colors.surface }]}
            >
                <Text
                    style={[
                        styles.todayText,
                        isLandscape && styles.todayTextLandscape,
                        { color: colors.primary }
                    ]}
                >
                    {todayLabel}
                </Text>
            </TouchableOpacity>

            <View style={styles.navigation}>
                <TouchableOpacity
                    onPress={onPrev}
                    style={[styles.arrowButton, isLandscape && styles.arrowButtonLandscape]}
                >
                    <Text
                        style={[
                            styles.arrowText,
                            isLandscape && styles.arrowTextLandscape,
                            { color: colors.primary }
                        ]}
                    >
                        {'<'}
                    </Text>
                </TouchableOpacity>

                <Text
                    style={[
                        styles.title,
                        isLandscape && styles.titleLandscape,
                        { color: colors.text }
                    ]}
                >
                    {formatDate(currentDate)}
                </Text>

                <TouchableOpacity
                    onPress={onNext}
                    style={[styles.arrowButton, isLandscape && styles.arrowButtonLandscape]}
                >
                    <Text
                        style={[
                            styles.arrowText,
                            isLandscape && styles.arrowTextLandscape,
                            { color: colors.primary }
                        ]}
                    >
                        {'>'}
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 15,
        paddingVertical: 10,
    },
    containerLandscape: {
        paddingVertical: 8,
        paddingHorizontal: 10,
    },
    todayButton: {
        paddingVertical: 5,
        paddingHorizontal: 10,
        borderRadius: 5,
    },
    todayButtonLandscape: {
        paddingVertical: 4,
        paddingHorizontal: 8,
    },
    todayText: {
        fontWeight: '600',
        fontSize: 14,
    },
    todayTextLandscape: {
        fontSize: 12,
    },
    navigation: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold',
        marginHorizontal: 15,
        minWidth: 120,
        textAlign: 'center',
    },
    titleLandscape: {
        fontSize: 14,
        marginHorizontal: 10,
        minWidth: 100,
    },
    arrowButton: {
        padding: 10,
    },
    arrowButtonLandscape: {
        padding: 6,
    },
    arrowText: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    arrowTextLandscape: {
        fontSize: 18,
    },
});

export default Header;
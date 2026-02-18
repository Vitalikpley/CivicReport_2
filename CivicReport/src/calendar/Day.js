import React from 'react';
import { View, Text, StyleSheet, useWindowDimensions, TouchableOpacity } from 'react-native';
import { useTheme } from '@react-navigation/native';

const Day = ({ day, isLandscape, hasTodos, onPress, calendarWidth }) => {
    const { number, isCurrentMonth, isToday } = day;
    const { colors } = useTheme();
    const { width, height } = useWindowDimensions();
    const effectiveWidth = calendarWidth || width;
    const cellSize = effectiveWidth / 7;
    const circleSize = isLandscape ? 22 : 32;
    const fontSize = isLandscape ? 11 : 16;
    const dotSize = isLandscape ? 5 : 7;

    const textColor = colors.text;
    const disabledColor = colors.text + '80'; // 50% opacity

    return (
        <TouchableOpacity
            style={[styles.container, { width: cellSize, height: isLandscape ? Math.min(cellSize * 0.55, (height || 300) / 8) : cellSize * 0.8 }]}
            onPress={() => onPress && onPress()}
            activeOpacity={0.7}
        >
            <View style={[
                styles.circle,
                { width: circleSize, height: circleSize, borderRadius: circleSize / 2 },
                isToday && { backgroundColor: colors.primary }
            ]}>
                <Text style={[
                    { fontSize, color: isCurrentMonth ? textColor : disabledColor },
                    isToday && styles.todayText
                ]}>
                    {number}
                </Text>
                {hasTodos && isCurrentMonth && (
                    <View style={[
                        styles.todoDot,
                        {
                            width: dotSize,
                            height: dotSize,
                            borderRadius: dotSize / 2,
                            bottom: isLandscape ? 2 : 3,
                        }
                    ]} />
                )}
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    circle: {
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
    },
    todayText: {
        color: '#fff',
    },
    todoDot: {
        position: 'absolute',
        backgroundColor: '#FF3B30',
    },
});

export default Day;


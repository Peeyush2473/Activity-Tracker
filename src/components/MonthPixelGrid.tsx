import React from 'react';
import { View, StyleSheet } from 'react-native';

interface MonthPixelGridProps {
    completionRates: number[]; // Array of completion rates (0-100) for each day
    color: string;
    days: number;
}

export default function MonthPixelGrid({ completionRates, color, days }: MonthPixelGridProps) {
    // Convert hex color to RGB for opacity calculation
    const hexToRgb = (hex: string) => {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : { r: 16, g: 185, b: 129 };
    };

    const rgb = hexToRgb(color);

    // Get current month info
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    // Create calendar grid - just the days without leading empty spaces
    const calendarDays: (number | null)[] = [];

    // Add actual days (1 to current day or end of month)
    for (let day = 1; day <= days; day++) {
        calendarDays.push(day);
    }

    // Add remaining days of month as future (dimmed)
    for (let day = days + 1; day <= daysInMonth; day++) {
        calendarDays.push(day);
    }

    // Arrange in weeks (7 days per row)
    const weeks: (number | null)[][] = [];
    for (let i = 0; i < calendarDays.length; i += 7) {
        weeks.push(calendarDays.slice(i, i + 7));
    }

    // Pad the last week with nulls if it's incomplete (this puts empty boxes at the end/bottom)
    const lastWeek = weeks[weeks.length - 1];
    if (lastWeek && lastWeek.length < 7) {
        while (lastWeek.length < 7) {
            lastWeek.push(null);
        }
    }

    return (
        <View style={styles.container}>
            {weeks.map((week, weekIndex) => (
                <View key={weekIndex} style={styles.weekRow}>
                    {week.map((day, dayIndex) => {
                        if (day === null) {
                            return <View key={dayIndex} style={styles.dayBox} />;
                        }

                        const isFuture = day > days;
                        const completionRate = isFuture ? 0 : completionRates[day - 1] || 0;

                        let backgroundColor;
                        if (isFuture) {
                            backgroundColor = 'rgba(100, 100, 100, 0.15)';
                        } else if (completionRate === 0) {
                            backgroundColor = 'rgba(255, 255, 255, 0.15)';
                        } else {
                            const opacity = 0.4 + (completionRate / 100) * 0.6;
                            backgroundColor = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${opacity})`;
                        }

                        return (
                            <View
                                key={dayIndex}
                                style={[styles.dayBox, { backgroundColor }]}
                            />
                        );
                    })}
                </View>
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginTop: 16,
        marginBottom: 16,
        paddingHorizontal: 16,
    },
    weekRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 6,
    },
    dayBox: {
        width: 30,
        height: 30,
        marginHorizontal: 3,
        borderRadius: 6,
    },
});

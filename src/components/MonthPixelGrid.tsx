import React from 'react';
import { View, StyleSheet, Text } from 'react-native';

interface MonthPixelGridProps {
    completionRates: number[]; // Array of completion rates (0-100) for each day
    color: string;
    days: number;
    selectedMonth?: Date; // Optional: defaults to current month
}

export default function MonthPixelGrid({ completionRates, color, days, selectedMonth }: MonthPixelGridProps) {
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

    // Get month info from selectedMonth or current date
    const monthDate = selectedMonth || new Date();
    const year = monthDate.getFullYear();
    const month = monthDate.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = new Date(year, month, 1).getDay(); // 0 = Sunday

    // Create calendar grid with proper weekday alignment
    const calendarDays: (number | null)[] = [];

    // Add empty spaces for days before the 1st (to align with correct weekday)
    for (let i = 0; i < firstDayOfMonth; i++) {
        calendarDays.push(null);
    }

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

    // Pad the last week with nulls if it's incomplete
    const lastWeek = weeks[weeks.length - 1];
    if (lastWeek && lastWeek.length < 7) {
        while (lastWeek.length < 7) {
            lastWeek.push(null);
        }
    }

    const dayLabels = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

    return (
        <View style={styles.container}>
            {/* Day labels */}
            <View style={styles.weekRow}>
                {dayLabels.map((label, index) => (
                    <View key={index} style={styles.dayLabelContainer}>
                        <Text style={styles.dayLabel}>{label}</Text>
                    </View>
                ))}
            </View>

            {/* Calendar grid */}
            {weeks.map((week, weekIndex) => (
                <View key={weekIndex} style={styles.weekRow}>
                    {week.map((day, dayIndex) => {
                        if (day === null) {
                            return (
                                <View
                                    key={dayIndex}
                                    style={[styles.dayBox, { backgroundColor: 'transparent' }]}
                                />
                            );
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
                            >
                                <Text style={[styles.dateNumber, isFuture && styles.futureDateNumber]}>
                                    {day}
                                </Text>
                            </View>
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
    dayLabelContainer: {
        width: 30,
        height: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 3,
    },
    dayLabel: {
        fontSize: 11,
        fontWeight: '600',
        color: '#666',
    },
    dayBox: {
        width: 30,
        height: 30,
        marginHorizontal: 3,
        borderRadius: 8,
        overflow: 'hidden',
        justifyContent: 'center',
        alignItems: 'center',
    },
    dateNumber: {
        fontSize: 11,
        fontWeight: '700',
        color: '#FFF',
    },
    futureDateNumber: {
        color: '#555',
    },
});

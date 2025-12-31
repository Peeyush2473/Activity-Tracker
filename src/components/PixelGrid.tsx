import React from 'react';
import { View, StyleSheet } from 'react-native';

interface PixelGridProps {
    history: { [date: string]: boolean };
    color: string;
}

export default function PixelGrid({ history, color }: PixelGridProps) {
    const getDateKey = (date: Date): string => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    // Generate grid for current month
    const generateMonthGrid = () => {
        const today = new Date();
        const year = today.getFullYear();
        const month = today.getMonth();

        // Get number of days in current month
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        // Create array of all dates in current month
        const monthDays = [];
        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(year, month, day);
            const dateKey = getDateKey(date);
            const isCompleted = history[dateKey] || false;
            const isFuture = date > today;
            monthDays.push({ isCompleted, isFuture });
        }

        return monthDays;
    };

    const monthData = generateMonthGrid();

    // Arrange in rows - aim for roughly square grid
    const pixelsPerRow = Math.ceil(Math.sqrt(monthData.length * 1.5)); // Wider than tall
    const rows: Array<{ isCompleted: boolean; isFuture: boolean }[]> = [];

    for (let i = 0; i < monthData.length; i += pixelsPerRow) {
        rows.push(monthData.slice(i, i + pixelsPerRow));
    }

    return (
        <View style={styles.container}>
            {rows.map((row, rowIndex) => (
                <View key={rowIndex} style={styles.row}>
                    {row.map((day, colIndex) => (
                        <View
                            key={colIndex}
                            style={[
                                styles.pixel,
                                {
                                    backgroundColor: day.isFuture
                                        ? 'rgba(255, 255, 255, 0.08)'
                                        : day.isCompleted
                                            ? color
                                            : 'rgba(255, 255, 255, 0.2)',
                                    opacity: day.isFuture ? 0.4 : 1,
                                },
                            ]}
                        />
                    ))}
                </View>
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginTop: 12,
        marginBottom: 8,
    },
    row: {
        flexDirection: 'row',
        marginBottom: 3,
    },
    pixel: {
        width: 10,
        height: 10,
        borderRadius: 2,
        marginRight: 3,
    },
});

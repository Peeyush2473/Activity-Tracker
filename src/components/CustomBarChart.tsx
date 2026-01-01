import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

interface CustomBarChartProps {
    data: number[];
    labels: string[];
    color: string;
    maxValue?: number;
}

export default function CustomBarChart({ data, labels, color, maxValue = 100 }: CustomBarChartProps) {
    const barWidth = 30;
    const chartHeight = 170;
    const spacing = 20;

    return (
        <View style={styles.container}>
            {/* Y-Axis Labels */}
            <View style={styles.yAxisContainer}>
                {['100%', '75%', '50%', '25%', '0%'].map((label, index) => (
                    <Text key={index} style={styles.yAxisLabel}>
                        {label}
                    </Text>
                ))}
            </View>

            {/* Scrollable Bars */}
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                <View style={styles.barsContainer}>
                    {/* Grid Lines */}
                    <View style={styles.gridLinesContainer}>
                        {[0, 1, 2, 3, 4].map((index) => (
                            <View
                                key={index}
                                style={[
                                    styles.gridLine,
                                    {
                                        top: (chartHeight / 4) * index,
                                        width: Math.max(data.length * (barWidth + spacing), 300)
                                    }
                                ]}
                            />
                        ))}
                    </View>

                    {/* Bars */}
                    {data.map((value, index) => {
                        const barContainerHeight = 200;
                        const barHeight = (value / maxValue) * barContainerHeight;
                        return (
                            <View key={index} style={styles.barWrapper}>
                                <View style={styles.barContainer}>
                                    {/* Value on top */}
                                    <Text style={styles.valueText}>
                                        {Math.round(value)}%
                                    </Text>
                                    {/* Bar */}
                                    <View
                                        style={[
                                            styles.bar,
                                            {
                                                height: Math.max(barHeight, 2),
                                                backgroundColor: color,
                                                width: barWidth,
                                            },
                                        ]}
                                    />
                                </View>
                                {/* Label */}
                                <Text style={styles.label}>{labels[index]}</Text>
                            </View>
                        );
                    })}
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        height: 260,
        marginVertical: 10,
    },
    yAxisContainer: {
        width: 40,
        height: 220,
        justifyContent: 'space-between',
        paddingTop: 10,
        paddingBottom: 30,
    },
    yAxisLabel: {
        color: '#8E8E93',
        fontSize: 12,
        textAlign: 'right',
        marginRight: 5,
    },
    scrollContent: {
        marginTop: 8,
        paddingRight: 20,
    },
    barsContainer: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        height: 220,
        paddingBottom: 15,
        position: 'relative',
    },
    gridLinesContainer: {
        position: 'absolute',
        top: 10,
        left: 0,
        right: 0,
        height: 200,
    },
    gridLine: {
        position: 'absolute',
        height: 1.5,
        backgroundColor: '#444',
        opacity: 0.3,
    },
    barWrapper: {
        alignItems: 'center',
        marginHorizontal: 10,
    },
    barContainer: {
        height: 200,
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    bar: {
        borderRadius: 8,
        minHeight: 2,
    },
    valueText: {
        color: '#FFF',
        fontSize: 12,
        fontWeight: '600',
        marginBottom: 4,
    },
    label: {
        color: '#8E8E93',
        fontSize: 12,
        marginTop: 8,
        fontWeight: '500',
    },
});

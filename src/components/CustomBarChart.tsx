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

    const allMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const displayData = allMonths.map((month, index) => {
        const dataIndex = labels.indexOf(month);
        return dataIndex !== -1 ? data[dataIndex] : null;
    });

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
                                        width: Math.max(allMonths.length * (barWidth + spacing), 300)
                                    }
                                ]}
                            />
                        ))}
                    </View>

                    {/* Bars */}
                    {displayData.map((value, index) => {
                        const barContainerHeight = 170;
                        const barHeight = value !== null ? (value / maxValue) * barContainerHeight : 0;
                        const hasData = value !== null;

                        return (
                            <View key={index} style={styles.barWrapper}>
                                <View style={styles.barContainer}>
                                    {/* Value on top - show above the bar */}
                                    {hasData && (
                                        <Text style={styles.valueText}>
                                            {Math.round(value)}%
                                        </Text>
                                    )}

                                    {/* Bar - height is exactly the percentage */}
                                    {hasData ? (
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
                                    ) : (
                                        <View style={{ height: 0 }} />
                                    )}
                                </View>

                                {/* Label - always show */}
                                <Text style={[styles.label, !hasData && styles.labelInactive]}>
                                    {allMonths[index]}
                                </Text>
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
        height: 225,
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
        height: 210,
        paddingBottom: 5,
        position: 'relative'
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
        height: 170,
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
    labelInactive: {
        color: '#4A4A4A',
        opacity: 0.5,
    },
});

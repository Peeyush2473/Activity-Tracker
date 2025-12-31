import React, { useContext, useEffect, useState } from 'react';
import { View, Text, StyleSheet, Dimensions, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LineChart } from 'react-native-chart-kit';
import { HabitContext } from '../context/HabitContext';

const screenWidth = Dimensions.get('window').width;

export default function StatsScreen() {
    const { getCompletionRate, habits } = useContext(HabitContext);
    const [data, setData] = useState<number[]>([]);

    // Update data when context changes
    useEffect(() => {
        setData(getCompletionRate(7));
    }, [habits]);

    const chartConfig = {
        backgroundGradientFrom: '#fff',
        backgroundGradientTo: '#fff',
        color: (opacity = 1) => `rgba(108, 99, 255, ${opacity})`,
        strokeWidth: 3,
        barPercentage: 0.5,
        decimalPlaces: 0,
        propsForDots: {
            r: '6',
            strokeWidth: '2',
            stroke: '#6C63FF',
        },
    };

    const getLabels = () => {
        const labels = [];
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        for (let i = 6; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            labels.push(days[d.getDay()]);
        }
        return labels;
    };

    const average = data.length > 0 ? (data.reduce((a, b) => a + b, 0) / data.length).toFixed(0) : 0;

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.header}>Your Progress</Text>

            <ScrollView contentContainerStyle={styles.content}>
                <View style={styles.card}>
                    <Text style={styles.cardTitle}>Last 7 Days</Text>
                    {data.length > 0 ? (
                        <LineChart
                            data={{
                                labels: getLabels(),
                                datasets: [
                                    {
                                        data: data,
                                    },
                                ],
                            }}
                            width={screenWidth - 40}
                            height={220}
                            yAxisSuffix="%"
                            yAxisInterval={1}
                            chartConfig={chartConfig}
                            bezier
                            style={{
                                marginVertical: 8,
                                borderRadius: 16,
                            }}
                        />
                    ) : (
                        <Text>No data yet</Text>
                    )}
                </View>

                <View style={styles.statsRow}>
                    <View style={styles.statCard}>
                        <Text style={styles.statValue}>{average}%</Text>
                        <Text style={styles.statLabel}>Consistency</Text>
                    </View>
                    <View style={styles.statCard}>
                        <Text style={styles.statValue}>{habits.length}</Text>
                        <Text style={styles.statLabel}>Active Habits</Text>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F7F7F7',
    },
    header: {
        fontSize: 28,
        fontWeight: 'bold',
        padding: 20,
        color: '#333',
    },
    content: {
        padding: 20,
        paddingTop: 0,
    },
    card: {
        backgroundColor: '#FFF',
        borderRadius: 16,
        padding: 16,
        marginBottom: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 3.84,
        elevation: 2,
        alignItems: 'center',
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 10,
        alignSelf: 'flex-start',
        color: '#444',
    },
    statsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 15,
    },
    statCard: {
        flex: 1,
        backgroundColor: '#FFF',
        padding: 20,
        borderRadius: 16,
        alignItems: 'center',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 3.84,
        elevation: 2,
    },
    statValue: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#6C63FF',
    },
    statLabel: {
        fontSize: 14,
        color: '#888',
        marginTop: 4,
    },
});

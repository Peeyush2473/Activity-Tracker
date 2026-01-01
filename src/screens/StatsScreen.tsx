import React, { useContext, useEffect, useState } from 'react';
import { View, Text, StyleSheet, Dimensions, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LineChart } from 'react-native-chart-kit';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { ActivityContext } from '../context/ActivityContext';
import { ThemeContext } from '../context/ThemeContext';
import MonthPixelGrid from '../components/MonthPixelGrid';
import CustomBarChart from '../components/CustomBarChart';

const screenWidth = Dimensions.get('window').width;

export default function StatsScreen() {
    const { getCompletionRate, getYearlyCompletionRate, activities } = useContext(ActivityContext);
    const { theme } = useContext(ThemeContext);
    const navigation = useNavigation();
    const [data, setData] = useState<number[]>([]);
    const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year'>('week');
    const [selectedMonth, setSelectedMonth] = useState(new Date());

    // Update data when context changes or time range changes
    useEffect(() => {
        if (timeRange === 'week') {
            setData(getCompletionRate(7));
        } else if (timeRange === 'month') {
            // Get selected month data
            const year = selectedMonth.getFullYear();
            const month = selectedMonth.getMonth();
            const today = new Date();

            // Determine how many days to show
            const isCurrentMonth = year === today.getFullYear() && month === today.getMonth();
            const daysInMonth = new Date(year, month + 1, 0).getDate();
            const daysToShow = isCurrentMonth ? today.getDate() : daysInMonth;

            // Get completion rates for days 1 to current day of this month
            const monthData: number[] = [];
            for (let day = 1; day <= daysToShow; day++) {
                const date = new Date(year, month, day);
                const dateKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

                let completedCount = 0;
                let totalActivities = activities.length;

                activities.forEach(activity => {
                    if (activity.history[dateKey]) {
                        completedCount++;
                    }
                });

                monthData.push(totalActivities > 0 ? (completedCount / totalActivities) * 100 : 0);
            }

            setData(monthData);
        } else {
            setData(getYearlyCompletionRate());
        }
    }, [activities, timeRange, selectedMonth]);

    const chartConfig = {
        backgroundGradientFrom: '#1C1C1E',
        backgroundGradientTo: '#1C1C1E',
        color: (opacity = 1) => {
            const hex = theme.primary.replace('#', '');
            const r = parseInt(hex.substring(0, 2), 16);
            const g = parseInt(hex.substring(2, 4), 16);
            const b = parseInt(hex.substring(4, 6), 16);
            return `rgba(${r}, ${g}, ${b}, ${opacity})`;
        },
        strokeWidth: 3,
        barPercentage: 0.5,
        decimalPlaces: 0,
        propsForDots: {
            r: timeRange === 'month' ? '2' : '6',
            strokeWidth: timeRange === 'month' ? '1' : '2',
            stroke: theme.primary,
        },
        fillShadowGradient: theme.primary,
        fillShadowGradientOpacity: 1,
    };

    const getLabels = () => {
        const labels = [];
        const today = new Date();

        if (timeRange === 'week') {
            const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
            for (let i = 6; i >= 0; i--) {
                const d = new Date();
                d.setDate(d.getDate() - i);
                labels.push(days[d.getDay()]);
            }
        } else if (timeRange === 'month') {
            const oneMonthAgo = new Date();
            oneMonthAgo.setMonth(today.getMonth() - 1);
            const diffTime = Math.abs(today.getTime() - oneMonthAgo.getTime());
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

            const interval = Math.ceil(diffDays / 6);
            for (let i = diffDays - 1; i >= 0; i--) {
                const d = new Date();
                d.setDate(d.getDate() - i);
                if (i % interval === 0) {
                    labels.push(d.getDate().toString());
                } else {
                    labels.push('');
                }
            }
        } else {
            // Year view - generate labels based on data length
            const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            // Return labels for months 0 to (data.length - 1)
            for (let i = 0; i < data.length; i++) {
                labels.push(monthNames[i]);
            }
            return labels;
        }
        return labels;
    };

    const average = data.length > 0 ? (data.reduce((a, b) => a + b, 0) / data.length).toFixed(0) : 0;

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={28} color="#FFF" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Your Progress</Text>
                <View style={{ width: 28 }} />
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                <View style={styles.card}>
                    <View style={styles.rangeSelector}>
                        <TouchableOpacity
                            style={[styles.rangeBtn, timeRange === 'week' && styles.rangeBtnActive]}
                            onPress={() => setTimeRange('week')}
                        >
                            <Text style={[styles.rangeBtnText, timeRange === 'week' && { color: theme.primary, fontWeight: '700' }]}>Week</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.rangeBtn, timeRange === 'month' && styles.rangeBtnActive]}
                            onPress={() => setTimeRange('month')}
                        >
                            <Text style={[styles.rangeBtnText, timeRange === 'month' && { color: theme.primary, fontWeight: '700' }]}>Month</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.rangeBtn, timeRange === 'year' && styles.rangeBtnActive]}
                            onPress={() => setTimeRange('year')}
                        >
                            <Text style={[styles.rangeBtnText, timeRange === 'year' && { color: theme.primary, fontWeight: '700' }]}>Year</Text>
                        </TouchableOpacity>
                    </View>

                    {timeRange === 'month' && (
                        <View style={styles.monthNavigation}>
                            <TouchableOpacity
                                style={styles.monthNavButton}
                                onPress={() => {
                                    const newMonth = new Date(selectedMonth);
                                    newMonth.setMonth(newMonth.getMonth() - 1);
                                    setSelectedMonth(newMonth);
                                }}
                            >
                                <Ionicons name="chevron-back" size={24} color={theme.primary} />
                            </TouchableOpacity>
                            <View style={styles.monthNavTextContainer}>
                                <Text style={styles.monthNavText}>
                                    {selectedMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                                </Text>
                            </View>
                            <TouchableOpacity
                                style={styles.monthNavButton}
                                onPress={() => {
                                    const newMonth = new Date(selectedMonth);
                                    newMonth.setMonth(newMonth.getMonth() + 1);
                                    const today = new Date();
                                    // Don't allow navigating to future months
                                    if (newMonth <= today) {
                                        setSelectedMonth(newMonth);
                                    }
                                }}
                            >
                                <Ionicons name="chevron-forward" size={24} color={theme.primary} />
                            </TouchableOpacity>
                        </View>
                    )}

                    {timeRange !== 'month' && (
                        <Text style={styles.cardTitle}>
                            {timeRange === 'week'
                                ? 'Last 7 Days'
                                : `Year ${new Date().getFullYear()}`
                            }
                        </Text>
                    )}
                    {timeRange === 'week' ? (
                        data.length > 0 ? (
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
                            <Text style={styles.noData}>No data yet. Start tracking activities to see your progress!</Text>
                        )
                    ) : timeRange === 'month' ? (
                        data.length > 0 ? (
                            <MonthPixelGrid
                                completionRates={data}
                                color={theme.primary}
                                days={data.length}
                                selectedMonth={selectedMonth}
                            />
                        ) : (
                            <Text style={styles.noData}>No data yet. Start tracking activities to see your progress!</Text>
                        )
                    ) : (
                        data.length > 0 ? (
                            <CustomBarChart
                                data={data}
                                labels={getLabels()}
                                color={theme.primary}
                                maxValue={100}
                            />
                        ) : (
                            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', height: 260 }}>
                                <Text style={styles.noData}>No data yet. Start tracking activities!</Text>
                            </View>
                        )
                    )}
                </View>

                <View style={styles.statsRow}>
                    <View style={styles.statCard}>
                        <Text style={[styles.statValue, { color: theme.primary }]}>{average}%</Text>
                        <Text style={styles.statLabel}>Consistency</Text>
                    </View>
                    <View style={styles.statCard}>
                        <Text style={[styles.statValue, { color: theme.primary }]}>{activities.length}</Text>
                        <Text style={styles.statLabel}>Active Activities</Text>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000000',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 15,
    },
    backButton: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#FFF',
    },
    content: {
        padding: 20,
        paddingTop: 0,
    },
    card: {
        backgroundColor: '#1C1C1E',
        borderRadius: 16,
        padding: 16,
        marginBottom: 20,
        alignItems: 'center',
        minHeight: 450,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 10,
        alignSelf: 'flex-start',
        color: '#FFF',
    },
    statsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 15,
    },
    statCard: {
        flex: 1,
        backgroundColor: '#1C1C1E',
        padding: 20,
        borderRadius: 16,
        alignItems: 'center',
    },
    statValue: {
        fontSize: 32,
        fontWeight: 'bold',
    },
    statLabel: {
        fontSize: 14,
        color: '#8E8E93',
        marginTop: 4,
    },
    rangeSelector: {
        flexDirection: 'row',
        backgroundColor: '#000000',
        borderRadius: 20,
        padding: 4,
        marginBottom: 16,
        alignSelf: 'stretch',
    },
    rangeBtn: {
        flex: 1,
        paddingVertical: 8,
        alignItems: 'center',
        borderRadius: 16,
    },
    rangeBtnActive: {
        backgroundColor: '#2C2C2E',
    },
    rangeBtnText: {
        fontSize: 14,
        color: '#666',
        fontWeight: '500',
    },
    rangeBtnTextActive: {
        color: '#10B981',
        fontWeight: '700',
    },
    noData: {
        color: '#8E8E93',
        fontSize: 16,
        marginVertical: 20,
    },
    monthNavigation: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 16,
        paddingHorizontal: 20,
    },
    monthNavButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    monthNavTextContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: 16,
    },
    monthNavText: {
        fontSize: 18,
        fontWeight: '600',
        color: '#FFF',
        textAlign: 'center',
    },
});

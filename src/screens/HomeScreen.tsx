import React, { useContext } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { ActivityContext } from '../context/ActivityContext';
import { ThemeContext } from '../context/ThemeContext';
import PixelGrid from '../components/PixelGrid';
import { getTodayKey } from '../utils/date';

export default function HomeScreen() {
    const { activities, toggleActivity, deleteActivity } = useContext(ActivityContext);
    const { theme } = useContext(ThemeContext);
    const navigation = useNavigation<any>();

    const today = new Date();
    const dateKey = getTodayKey();

    const handleToggle = (id: string) => {
        toggleActivity(id, dateKey);
    };

    const handleDelete = (id: string) => {
        Alert.alert(
            "Delete Activity",
            "Are you sure you want to delete this activity?",
            [
                { text: "Cancel", style: "cancel" },
                { text: "Delete", style: "destructive", onPress: () => deleteActivity(id) }
            ]
        );
    };

    const renderItem = ({ item }: { item: any }) => {
        const isCompleted = item.history[dateKey] || false;
        const activityColor = item.color || '#6C63FF';

        return (
            <TouchableOpacity
                style={styles.card}
                onLongPress={() => handleDelete(item.id)}
                activeOpacity={0.7}
            >
                <View style={styles.cardContent}>
                    {/* Icon Section */}
                    <View style={[styles.iconContainer, { backgroundColor: `${activityColor}20` }]}>
                        <Text style={styles.icon}>{item.icon || '📝'}</Text>
                    </View>

                    {/* Text and Grid Section */}
                    <View style={styles.textSection}>
                        <Text style={styles.activityName}>{item.name}</Text>
                        {item.description && (
                            <Text style={styles.activityDescription}>{item.description}</Text>
                        )}
                        <PixelGrid history={item.history} color={activityColor} />
                    </View>

                    {/* Action Button */}
                    <TouchableOpacity
                        style={[
                            styles.actionButton,
                            { backgroundColor: isCompleted ? activityColor : `${activityColor}40` }
                        ]}
                        onPress={() => handleToggle(item.id)}
                    >
                        <Ionicons
                            name={isCompleted ? "checkmark" : "add"}
                            size={24}
                            color="#FFF"
                        />
                    </TouchableOpacity>
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.headerIcon}
                    onPress={() => navigation.navigate('Settings')}
                >
                    <Ionicons name="settings-outline" size={24} color="#FFF" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>ActivityTracker</Text>
                <TouchableOpacity
                    style={styles.headerIcon}
                    onPress={() => navigation.navigate('Stats')}
                >
                    <Ionicons name="stats-chart-outline" size={24} color="#FFF" />
                </TouchableOpacity>
            </View>

            <FlatList
                data={activities}
                keyExtractor={item => item.id}
                renderItem={renderItem}
                contentContainerStyle={styles.listContent}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyText}>No activities yet. Start by adding one!</Text>
                    </View>
                }
            />

            {/* Floating Action Button */}
            <TouchableOpacity
                style={[styles.fab, { backgroundColor: theme.primary }]}
                onPress={() => navigation.navigate('AddActivity')}
            >
                <Ionicons name="add" size={28} color="#FFF" />
            </TouchableOpacity>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000000',
    },
    header: {
        paddingHorizontal: 20,
        paddingVertical: 15,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    headerIcon: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#FFF',
        letterSpacing: 0.5,
    },
    fab: {
        position: 'absolute',
        bottom: 24,
        right: 24,
        width: 60,
        height: 60,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
    },
    listContent: {
        padding: 20,
        paddingTop: 10,
    },
    card: {
        backgroundColor: '#1C1C1E',
        borderRadius: 20,
        marginBottom: 16,
        overflow: 'hidden',
    },
    cardContent: {
        flexDirection: 'row',
        padding: 16,
        alignItems: 'flex-start',
    },
    iconContainer: {
        width: 50,
        height: 50,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    icon: {
        fontSize: 28,
    },
    textSection: {
        flex: 1,
        marginRight: 12,
    },
    activityName: {
        fontSize: 17,
        fontWeight: '600',
        color: '#FFF',
        marginBottom: 4,
    },
    activityDescription: {
        fontSize: 14,
        color: '#8E8E93',
        marginBottom: 4,
    },
    actionButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 4,
    },
    emptyContainer: {
        marginTop: 100,
        alignItems: 'center',
    },
    emptyText: {
        color: '#8E8E93',
        fontSize: 16,
    },
});

import React, { useContext } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { HabitContext } from '../context/HabitContext';

import { getTodayKey } from '../utils/date';

export default function HomeScreen() {
    const { habits, toggleHabit, deleteHabit } = useContext(HabitContext);
    const navigation = useNavigation<any>();

    const today = new Date();
    const dateKey = getTodayKey();
    const dateDisplay = today.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

    const handleToggle = (id: string) => {
        toggleHabit(id, dateKey);
    };

    const handleDelete = (id: string) => {
        Alert.alert(
            "Delete Habit",
            "Are you sure you want to delete this habit?",
            [
                { text: "Cancel", style: "cancel" },
                { text: "Delete", style: "destructive", onPress: () => deleteHabit(id) }
            ]
        );
    };

    const renderItem = ({ item }: { item: any }) => {
        const isCompleted = item.history[dateKey] || false;

        return (
            <TouchableOpacity
                style={[styles.card, isCompleted && styles.cardCompleted]}
                onPress={() => handleToggle(item.id)}
                onLongPress={() => handleDelete(item.id)}
            >
                <View style={styles.textContainer}>
                    <Text style={[styles.habitName, isCompleted && styles.textCompleted]}>{item.name}</Text>
                </View>
                <Ionicons
                    name={isCompleted ? "checkbox" : "square-outline"}
                    size={28}
                    color={isCompleted ? (item.color || "#6C63FF") : "#888"}
                />
            </TouchableOpacity>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <View>
                    <Text style={styles.greeting}>Hello!</Text>
                    <Text style={styles.date}>{dateDisplay}</Text>
                </View>
                <TouchableOpacity onPress={() => navigation.navigate('AddHabit')} style={styles.addButton}>
                    <Ionicons name="add" size={24} color="#FFF" />
                </TouchableOpacity>
            </View>

            <FlatList
                data={habits}
                keyExtractor={item => item.id}
                renderItem={renderItem}
                contentContainerStyle={styles.listContent}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyText}>No habits yet. Start by adding one!</Text>
                    </View>
                }
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F7F7F7',
    },
    header: {
        paddingHorizontal: 20,
        paddingVertical: 15,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    greeting: {
        fontSize: 16,
        color: '#888',
        fontWeight: '600',
    },
    date: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
    },
    addButton: {
        backgroundColor: '#2947f0ff',
        width: 60,
        height: 60,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: "#3150ffff",
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 4.65,
        elevation: 8,
    },
    listContent: {
        padding: 20,
    },
    card: {
        backgroundColor: '#FFF',
        padding: 20,
        borderRadius: 16,
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.05,
        shadowRadius: 3.84,
        elevation: 2,
    },
    cardCompleted: {
        opacity: 0.8,
    },
    textContainer: {
        flex: 1,
    },
    habitName: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
    },
    textCompleted: {
        textDecorationLine: 'line-through',
        color: '#AAA',
    },
    emptyContainer: {
        marginTop: 50,
        alignItems: 'center',
    },
    emptyText: {
        color: '#888',
        fontSize: 16,
    },
});

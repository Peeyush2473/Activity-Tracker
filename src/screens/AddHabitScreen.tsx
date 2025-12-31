import React, { useState, useContext } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { HabitContext } from '../context/HabitContext';

const COLORS = ['#6C63FF', '#FF6584', '#FFC75F', '#45B7D1', '#29C7AC'];

export default function AddHabitScreen() {
    const [name, setName] = useState('');
    const [selectedColor, setSelectedColor] = useState(COLORS[0]);
    const { addHabit } = useContext(HabitContext);
    const navigation = useNavigation();

    const handleSave = () => {
        if (name.trim()) {
            addHabit(name, selectedColor);
            navigation.goBack();
        }
    };

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.container}
            >
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Ionicons name="close" size={28} color="#333" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>New Habit</Text>
                    <View style={{ width: 28 }} />
                </View>

                <View style={styles.content}>
                    <Text style={styles.label}>What do you want to track?</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="e.g., Drink Water, Read a Book"
                        value={name}
                        onChangeText={setName}
                        autoFocus
                        maxLength={30}
                    />

                    <Text style={[styles.label, { marginTop: 30 }]}>Pick a color</Text>
                    <View style={styles.colorsContainer}>
                        {COLORS.map((color) => (
                            <TouchableOpacity
                                key={color}
                                style={[
                                    styles.colorCircle,
                                    { backgroundColor: color },
                                    selectedColor === color && styles.selectedColor
                                ]}
                                onPress={() => setSelectedColor(color)}
                            >
                                {selectedColor === color && <Ionicons name="checkmark" size={16} color="#FFF" />}
                            </TouchableOpacity>
                        ))}
                    </View>

                    <TouchableOpacity
                        style={[styles.saveButton, !name.trim() && styles.disabledButton]}
                        onPress={handleSave}
                        disabled={!name.trim()}
                    >
                        <Text style={styles.saveButtonText}>Create Habit</Text>
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFF',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 10,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '600',
    },
    content: {
        flex: 1,
        padding: 24,
    },
    label: {
        fontSize: 16,
        color: '#666',
        marginBottom: 10,
    },
    input: {
        fontSize: 24,
        borderBottomWidth: 2,
        borderBottomColor: '#EEE',
        paddingVertical: 10,
        color: '#333',
    },
    colorsContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        gap: 15,
    },
    colorCircle: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    selectedColor: {
        borderWidth: 3,
        borderColor: '#E0E0E0',
        // Usually you'd want a ring around it, but this is simple enough
        transform: [{ scale: 1.1 }],
    },
    saveButton: {
        backgroundColor: '#6C63FF',
        marginTop: 50,
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: 'center',
    },
    disabledButton: {
        backgroundColor: '#CCC',
    },
    saveButtonText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

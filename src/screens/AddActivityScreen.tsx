import React, { useState, useContext } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { ActivityContext } from '../context/ActivityContext';
import { ThemeContext } from '../context/ThemeContext';

const COLORS = ['#10B981', '#8B5CF6', '#EF4444', '#F59E0B', '#06B6D4'];
const ICONS = ['🚶', '📚', '🍎', '🧘', '💧', '🏃', '✍️', '🎯', '💪', '🌱', '🎨', '🧠'];

export default function AddActivityScreen() {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [selectedIcon, setSelectedIcon] = useState(ICONS[0]);
    const [selectedColor, setSelectedColor] = useState(COLORS[0]);
    const { addActivity } = useContext(ActivityContext);
    const { theme } = useContext(ThemeContext);
    const navigation = useNavigation();

    const handleSave = () => {
        if (name.trim()) {
            addActivity(name, description, selectedIcon, selectedColor);
            navigation.goBack();
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={styles.flex}
                >
                    <View style={styles.header}>
                        <TouchableOpacity onPress={() => navigation.goBack()}>
                            <Ionicons name="close" size={28} color="#FFF" />
                        </TouchableOpacity>
                        <Text style={styles.headerTitle}>New Activity</Text>
                        <View style={{ width: 28 }} />
                    </View>

                    <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                        <Text style={styles.label}>Activity Name</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="e.g., Walk around the block"
                            placeholderTextColor="#666"
                            value={name}
                            onChangeText={setName}
                            autoFocus
                            maxLength={40}
                        />

                        <Text style={[styles.label, { marginTop: 24 }]}>Description (Optional)</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="e.g., Go for a short walk to clear the mind"
                            placeholderTextColor="#666"
                            value={description}
                            onChangeText={setDescription}
                            maxLength={60}
                        />

                        <Text style={[styles.label, { marginTop: 24 }]}>Pick an Icon</Text>
                        <View style={styles.iconsContainer}>
                            {ICONS.map((icon) => (
                                <TouchableOpacity
                                    key={icon}
                                    style={[
                                        styles.iconCircle,
                                        selectedIcon === icon && styles.selectedIcon
                                    ]}
                                    onPress={() => setSelectedIcon(icon)}
                                >
                                    <Text style={styles.iconText}>{icon}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>

                        <Text style={[styles.label, { marginTop: 24 }]}>Pick a Color</Text>
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
                                    {selectedColor === color && <Ionicons name="checkmark" size={20} color="#FFF" />}
                                </TouchableOpacity>
                            ))}
                        </View>

                        <TouchableOpacity
                            style={[styles.saveButton, { backgroundColor: theme.primary }, !name.trim() && styles.disabledButton]}
                            onPress={handleSave}
                            disabled={!name.trim()}
                        >
                            <Text style={styles.saveButtonText}>Create Activity</Text>
                        </TouchableOpacity>
                    </ScrollView>
                </KeyboardAvoidingView>
            </TouchableWithoutFeedback>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000000',
    },
    flex: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 15,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#FFF',
    },
    content: {
        flex: 1,
        padding: 24,
    },
    label: {
        fontSize: 14,
        color: '#8E8E93',
        marginBottom: 12,
        fontWeight: '500',
    },
    input: {
        fontSize: 18,
        borderBottomWidth: 1,
        borderBottomColor: '#333',
        paddingVertical: 12,
        color: '#FFF',
    },
    iconsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
    },
    iconCircle: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#1C1C1E',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: 'transparent',
    },
    selectedIcon: {
        borderColor: '#FFF',
        backgroundColor: '#2C2C2E',
    },
    iconText: {
        fontSize: 24,
    },
    colorsContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        gap: 15,
    },
    colorCircle: {
        width: 50,
        height: 50,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
    },
    selectedColor: {
        borderWidth: 3,
        borderColor: '#FFF',
        transform: [{ scale: 1.1 }],
    },
    saveButton: {
        marginTop: 40,
        marginBottom: 40,
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: 'center',
    },
    disabledButton: {
        backgroundColor: '#333',
    },
    saveButtonText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

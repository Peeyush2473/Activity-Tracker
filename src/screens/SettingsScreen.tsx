import React, { useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { ActivityContext } from '../context/ActivityContext';
import { ThemeContext, THEMES } from '../context/ThemeContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function SettingsScreen() {
    const navigation = useNavigation();
    const { activities } = useContext(ActivityContext);
    const { theme, setTheme } = useContext(ThemeContext);

    const handleClearAllData = () => {
        Alert.alert(
            "Clear All Data",
            "Are you sure you want to delete all activity data and history? This action cannot be undone.",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Delete All",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            await AsyncStorage.removeItem('@activities_v1');
                            Alert.alert("Success", "All data has been cleared. Please restart the app.");
                        } catch (error) {
                            Alert.alert("Error", "Failed to clear data");
                        }
                    }
                }
            ]
        );
    };

    const handleExportData = () => {
        Alert.alert(
            "Export Data",
            `You have ${activities.length} activities. Export functionality will be available in a future update.`,
            [{ text: "OK" }]
        );
    };

    const SettingItem = ({ icon, title, subtitle, onPress, color = "#FFF", danger = false }: any) => (
        <TouchableOpacity style={styles.settingItem} onPress={onPress}>
            <View style={styles.settingLeft}>
                <View style={[styles.iconContainer, danger && { backgroundColor: 'rgba(239, 68, 68, 0.2)' }]}>
                    <Ionicons name={icon} size={22} color={danger ? "#EF4444" : color} />
                </View>
                <View style={styles.textContainer}>
                    <Text style={[styles.settingTitle, danger && { color: '#EF4444' }]}>{title}</Text>
                    {subtitle && <Text style={styles.settingSubtitle}>{subtitle}</Text>}
                </View>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#666" />
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={28} color="#FFF" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Settings</Text>
                <View style={{ width: 28 }} />
            </View>

            <ScrollView style={styles.content}>
                {/* App Info */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>APP INFO</Text>
                    <View style={styles.card}>
                        <View style={styles.appInfo}>
                            <Text style={styles.appName}>ActivityTracker</Text>
                            <Text style={styles.appVersion}>Version 1.0.0</Text>
                        </View>
                        <View style={styles.statsRow}>
                            <View style={styles.statItem}>
                                <Text style={[styles.statValue, { color: theme.primary }]}>{activities.length}</Text>
                                <Text style={styles.statLabel}>Active Activities</Text>
                            </View>
                            <View style={styles.statDivider} />
                            <View style={styles.statItem}>
                                <Text style={[styles.statValue, { color: theme.primary }]}>
                                    {activities.reduce((sum, h) => sum + Object.keys(h.history).length, 0)}
                                </Text>
                                <Text style={styles.statLabel}>Total Completions</Text>
                            </View>
                        </View>
                    </View>
                </View>

                {/* Theme Customization */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>APPEARANCE</Text>
                    <View style={styles.card}>
                        <View style={styles.themeSection}>
                            <Text style={styles.themeSectionTitle}>Accent Color</Text>
                            <Text style={styles.themeSectionSubtitle}>Choose your preferred theme color</Text>
                            <View style={styles.colorGrid}>
                                {THEMES.map((t) => (
                                    <TouchableOpacity
                                        key={t.name}
                                        style={styles.colorOption}
                                        onPress={() => setTheme(t)}
                                    >
                                        <View
                                            style={[
                                                styles.colorCircle,
                                                { backgroundColor: t.primary },
                                                theme.name === t.name && styles.selectedColorCircle
                                            ]}
                                        >
                                            {theme.name === t.name && (
                                                <Ionicons name="checkmark" size={20} color="#FFF" />
                                            )}
                                        </View>
                                        <Text style={styles.colorName}>{t.name}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>
                    </View>
                </View>

                {/* Data Management */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>DATA</Text>
                    <View style={styles.card}>
                        <SettingItem
                            icon="download-outline"
                            title="Export Data"
                            subtitle="Backup your activities and history"
                            onPress={handleExportData}
                        />
                        <View style={styles.divider} />
                        <SettingItem
                            icon="trash-outline"
                            title="Clear All Data"
                            subtitle="Delete all activities and history"
                            onPress={handleClearAllData}
                            danger
                        />
                    </View>
                </View>

                {/* About */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>ABOUT</Text>
                    <View style={styles.card}>
                        <SettingItem
                            icon="information-circle-outline"
                            title="About ActivityTracker"
                            subtitle="Learn more about this app"
                            onPress={() => Alert.alert("ActivityTracker", "A simple and beautiful activity tracker to help you build better habits.")}
                        />
                    </View>
                </View>

                <View style={styles.footer}>
                    <Text style={styles.footerText}>Made with ❤️ for better habits</Text>
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
    headerTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#FFF',
    },
    content: {
        flex: 1,
    },
    section: {
        marginTop: 24,
        paddingHorizontal: 20,
    },
    sectionTitle: {
        fontSize: 13,
        fontWeight: '600',
        color: '#666',
        marginBottom: 12,
        letterSpacing: 0.5,
    },
    card: {
        backgroundColor: '#1C1C1E',
        borderRadius: 16,
        overflow: 'hidden',
    },
    appInfo: {
        padding: 20,
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#2C2C2E',
    },
    appName: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#FFF',
        marginBottom: 4,
    },
    appVersion: {
        fontSize: 14,
        color: '#8E8E93',
    },
    statsRow: {
        flexDirection: 'row',
        padding: 20,
    },
    statItem: {
        flex: 1,
        alignItems: 'center',
    },
    statDivider: {
        width: 1,
        backgroundColor: '#2C2C2E',
    },
    statValue: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#10B981',
        marginBottom: 4,
    },
    statLabel: {
        fontSize: 12,
        color: '#8E8E93',
        textAlign: 'center',
    },
    settingItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
    },
    settingLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    textContainer: {
        flex: 1,
    },
    settingTitle: {
        fontSize: 16,
        fontWeight: '500',
        color: '#FFF',
        marginBottom: 2,
    },
    settingSubtitle: {
        fontSize: 13,
        color: '#8E8E93',
    },
    divider: {
        height: 1,
        backgroundColor: '#2C2C2E',
        marginLeft: 68,
    },
    footer: {
        padding: 40,
        alignItems: 'center',
    },
    footerText: {
        fontSize: 14,
        color: '#666',
    },
    themeSection: {
        padding: 20,
    },
    themeSectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#FFF',
        marginBottom: 4,
    },
    themeSectionSubtitle: {
        fontSize: 13,
        color: '#8E8E93',
        marginBottom: 16,
    },
    colorGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginHorizontal: -8,
    },
    colorOption: {
        alignItems: 'center',
        width: '20%', // 5 items per row
        paddingHorizontal: 8,
        marginBottom: 16,
    },
    colorCircle: {
        width: 50,
        height: 50,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
    },
    selectedColorCircle: {
        borderWidth: 3,
        borderColor: '#FFF',
        transform: [{ scale: 1.1 }],
    },
    colorName: {
        fontSize: 12,
        color: '#8E8E93',
        textAlign: 'center',
    },
});

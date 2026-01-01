import React from 'react';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen from '../screens/HomeScreen';
import StatsScreen from '../screens/StatsScreen';
import AddActivityScreen from '../screens/AddActivityScreen';
import SettingsScreen from '../screens/SettingsScreen';

const Stack = createNativeStackNavigator();

// Custom dark theme to prevent white flash
const CustomDarkTheme = {
    ...DarkTheme,
    colors: {
        ...DarkTheme.colors,
        primary: '#10B981',
        background: '#000000',
        card: '#1C1C1E',
        text: '#FFFFFF',
        border: '#2C2C2E',
        notification: '#10B981',
    },
};

export default function AppNavigator() {
    return (
        <NavigationContainer theme={CustomDarkTheme}>
            <Stack.Navigator
                screenOptions={{
                    contentStyle: { backgroundColor: '#000000' },
                    headerShown: false,
                    gestureEnabled: true,
                    fullScreenGestureEnabled: true,
                    animation: 'simple_push',
                }}
            >
                <Stack.Screen
                    name="Home"
                    component={HomeScreen}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="Stats"
                    component={StatsScreen}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="Settings"
                    component={SettingsScreen}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="AddActivity"
                    component={AddActivityScreen}
                    options={{
                        presentation: 'modal',
                        headerShown: false,
                    }}
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
}

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';

import HomeScreen from '../screens/HomeScreen';
import StatsScreen from '../screens/StatsScreen';
import AddHabitScreen from '../screens/AddHabitScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function MainTabs() {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName: keyof typeof Ionicons.glyphMap = 'help';

                    if (route.name === 'Home') {
                        iconName = focused ? 'file-tray-full' : 'file-tray-outline'; // Changed to checkmark-circle in real implementation maybe
                    } else if (route.name === 'Stats') {
                        iconName = focused ? 'bar-chart' : 'bar-chart-outline';
                    }

                    return <Ionicons name={iconName} size={size} color={color} />;
                },
                tabBarActiveTintColor: '#6C63FF',
                tabBarInactiveTintColor: 'gray',
                headerShown: false,
            })}
        >
            <Tab.Screen name="Home" component={HomeScreen} />
            <Tab.Screen name="Stats" component={StatsScreen} />
        </Tab.Navigator>
    );
}

export default function AppNavigator() {
    return (
        <NavigationContainer>
            <Stack.Navigator>
                <Stack.Screen
                    name="Main"
                    component={MainTabs}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="AddHabit"
                    component={AddHabitScreen}
                    options={{ presentation: 'modal', title: 'New Habit' }}
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
}

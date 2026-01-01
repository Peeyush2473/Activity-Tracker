import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen from '../screens/HomeScreen';
import StatsScreen from '../screens/StatsScreen';
import AddActivityScreen from '../screens/AddActivityScreen';
import SettingsScreen from '../screens/SettingsScreen';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
    return (
        <NavigationContainer>
            <Stack.Navigator>
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
                    options={{ presentation: 'modal', headerShown: false }}
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
}

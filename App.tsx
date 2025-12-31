import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { HabitProvider } from './src/context/HabitContext';
import AppNavigator from './src/navigation/AppNavigator';

export default function App() {
  return (
    <SafeAreaProvider>
      <HabitProvider>
        <AppNavigator />
        <StatusBar style="auto" />
      </HabitProvider>
    </SafeAreaProvider>
  );
}

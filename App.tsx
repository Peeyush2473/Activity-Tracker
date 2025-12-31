import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { HabitProvider } from './src/context/HabitContext';
import { ThemeProvider } from './src/context/ThemeContext';
import AppNavigator from './src/navigation/AppNavigator';

export default function App() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <HabitProvider>
          <AppNavigator />
          <StatusBar style="light" />
        </HabitProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}

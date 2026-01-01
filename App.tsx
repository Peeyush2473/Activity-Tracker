import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ActivityProvider } from './src/context/ActivityContext';
import { ThemeProvider } from './src/context/ThemeContext';
import AppNavigator from './src/navigation/AppNavigator';

export default function App() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <ActivityProvider>
          <AppNavigator />
          <StatusBar style="light" />
        </ActivityProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}

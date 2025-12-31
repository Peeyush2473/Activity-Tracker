import React, { createContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Theme {
    primary: string;
    name: string;
}

export const THEMES: Theme[] = [
    { name: 'Green', primary: '#10B981' },
    { name: 'Purple', primary: '#8B5CF6' },
    { name: 'Blue', primary: '#3B82F6' },
    { name: 'Red', primary: '#EF4444' },
    { name: 'Orange', primary: '#F59E0B' },
    { name: 'Pink', primary: '#EC4899' },
    { name: 'Cyan', primary: '#06B6D4' },
    { name: 'Indigo', primary: '#6366F1' },
];

interface ThemeContextType {
    theme: Theme;
    setTheme: (theme: Theme) => void;
}

export const ThemeContext = createContext<ThemeContextType>({
    theme: THEMES[0],
    setTheme: () => { },
});

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
    const [theme, setThemeState] = useState<Theme>(THEMES[0]);

    useEffect(() => {
        loadTheme();
    }, []);

    const loadTheme = async () => {
        try {
            const savedTheme = await AsyncStorage.getItem('appTheme');
            if (savedTheme) {
                const parsed = JSON.parse(savedTheme);
                setThemeState(parsed);
            }
        } catch (error) {
            console.error('Failed to load theme:', error);
        }
    };

    const setTheme = async (newTheme: Theme) => {
        try {
            await AsyncStorage.setItem('appTheme', JSON.stringify(newTheme));
            setThemeState(newTheme);
        } catch (error) {
            console.error('Failed to save theme:', error);
        }
    };

    return (
        <ThemeContext.Provider value={{ theme, setTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

import AsyncStorage from '@react-native-async-storage/async-storage';
import { Habit } from '../types';

const HABITS_KEY = '@habits_v2'; // Changed key to avoid conflicts with old data structure

export const saveHabits = async (habits: Habit[]) => {
    try {
        await AsyncStorage.setItem(HABITS_KEY, JSON.stringify(habits));
    } catch (e) {
        console.error('Failed to save habits', e);
    }
};

export const loadHabits = async (): Promise<Habit[]> => {
    try {
        const jsonValue = await AsyncStorage.getItem(HABITS_KEY);
        return jsonValue != null ? JSON.parse(jsonValue) : [];
    } catch (e) {
        console.error('Failed to load habits', e);
        return [];
    }
};

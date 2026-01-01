import AsyncStorage from '@react-native-async-storage/async-storage';
import { Activity } from '../types';

const ACTIVITIES_KEY = '@activities_v1';

export const saveActivities = async (activities: Activity[]) => {
    try {
        await AsyncStorage.setItem(ACTIVITIES_KEY, JSON.stringify(activities));
    } catch (e) {
        console.error('Failed to save activities', e);
    }
};

export const loadActivities = async (): Promise<Activity[]> => {
    try {
        const jsonValue = await AsyncStorage.getItem(ACTIVITIES_KEY);
        return jsonValue != null ? JSON.parse(jsonValue) : [];
    } catch (e) {
        console.error('Failed to load activities', e);
        return [];
    }
};

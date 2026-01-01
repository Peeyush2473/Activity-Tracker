import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { Activity, ActivityContextType } from '../types';
import { loadActivities, saveActivities } from '../utils/storage';
import { getDateKey } from '../utils/date';

export const ActivityContext = createContext<ActivityContextType>({
    activities: [],
    addActivity: () => { },
    deleteActivity: () => { },
    toggleActivity: () => { },
    getCompletionRate: () => [],
    getYearlyCompletionRate: () => [],
});

export const ActivityProvider = ({ children }: { children: ReactNode }) => {
    const [activities, setActivities] = useState<Activity[]>([]);

    useEffect(() => {
        const init = async () => {
            const loadedActivities = await loadActivities();
            setActivities(loadedActivities);
        };
        init();
    }, []);

    const addActivity = (name: string, description?: string, icon?: string, color?: string) => {
        const newActivity: Activity = {
            id: Date.now().toString(),
            name,
            description,
            icon,
            color,
            createdAt: new Date().toISOString(),
            history: {},
        };
        const updatedActivities = [...activities, newActivity];
        setActivities(updatedActivities);
        saveActivities(updatedActivities);
    };

    const deleteActivity = (id: string) => {
        const updatedActivities = activities.filter((h) => h.id !== id);
        setActivities(updatedActivities);
        saveActivities(updatedActivities);
    };

    const toggleActivity = (id: string, date: string) => {
        const updatedActivities = activities.map((activity) => {
            if (activity.id === id) {
                const isCompleted = !!activity.history[date];
                const newHistory = { ...activity.history };
                if (isCompleted) {
                    // Optional: delete key to save space if false, or just set to false
                    delete newHistory[date];
                } else {
                    newHistory[date] = true;
                }
                return { ...activity, history: newHistory };
            }
            return activity;
        });

        setActivities(updatedActivities);
        saveActivities(updatedActivities);
    };

    const getCompletionRate = (days: number = 7): number[] => {
        const rates: number[] = [];
        const today = new Date();

        for (let i = days - 1; i >= 0; i--) {
            const d = new Date();
            d.setDate(today.getDate() - i);
            const dateStr = getDateKey(d);

            let completedCount = 0;
            let totalActivities = activities.length;

            // Filter out activities that didn't exist yet on that date?
            // For simplicity, we assume all current activities are relevant to the denominator 
            // or we only check created date.
            // Let's stick to simple "Active Activities" count.

            activities.forEach(activity => {
                if (activity.history[dateStr]) {
                    completedCount++;
                }
            });

            rates.push(totalActivities > 0 ? (completedCount / totalActivities) * 100 : 0);
        }
        return rates;
    };

    const getYearlyCompletionRate = (): number[] => {
        const rates: number[] = [];
        const today = new Date();

        // Last 12 months including current month
        for (let i = 11; i >= 0; i--) {
            const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
            const monthKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;

            // Get number of days in this month
            const daysInMonth = new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();

            let totalPossibleCompletions = 0;
            let totalActualCompletions = 0;

            // Iterate through every day of the month
            for (let day = 1; day <= daysInMonth; day++) {
                // Build date string YYYY-MM-DD
                const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

                // If date is in future, skip (optional, but good for accuracy)
                if (new Date(dateStr) > today) continue;

                totalPossibleCompletions += activities.length;

                activities.forEach(activity => {
                    if (activity.history[dateStr]) {
                        totalActualCompletions++;
                    }
                });
            }

            rates.push(totalPossibleCompletions > 0 ? (totalActualCompletions / totalPossibleCompletions) * 100 : 0);
        }
        return rates;
    };


    return (
        <ActivityContext.Provider value={{ activities, addActivity, deleteActivity, toggleActivity, getCompletionRate, getYearlyCompletionRate }}>
            {children}
        </ActivityContext.Provider>
    );
};

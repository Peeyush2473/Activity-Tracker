import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { Habit, HabitContextType } from '../types';
import { loadHabits, saveHabits } from '../utils/storage';
import { getDateKey } from '../utils/date';

export const HabitContext = createContext<HabitContextType>({
    habits: [],
    addHabit: () => { },
    deleteHabit: () => { },
    toggleHabit: () => { },
    getCompletionRate: () => [],
    getYearlyCompletionRate: () => [],
});

export const HabitProvider = ({ children }: { children: ReactNode }) => {
    const [habits, setHabits] = useState<Habit[]>([]);

    useEffect(() => {
        const init = async () => {
            const loadedHabits = await loadHabits();
            setHabits(loadedHabits);
        };
        init();
    }, []);

    const addHabit = (name: string, description?: string, icon?: string, color?: string) => {
        const newHabit: Habit = {
            id: Date.now().toString(),
            name,
            description,
            icon,
            color,
            createdAt: new Date().toISOString(),
            history: {},
        };
        const updatedHabits = [...habits, newHabit];
        setHabits(updatedHabits);
        saveHabits(updatedHabits);
    };

    const deleteHabit = (id: string) => {
        const updatedHabits = habits.filter((h) => h.id !== id);
        setHabits(updatedHabits);
        saveHabits(updatedHabits);
    };

    const toggleHabit = (id: string, date: string) => {
        const updatedHabits = habits.map((habit) => {
            if (habit.id === id) {
                const isCompleted = !!habit.history[date];
                const newHistory = { ...habit.history };
                if (isCompleted) {
                    // Optional: delete key to save space if false, or just set to false
                    delete newHistory[date];
                } else {
                    newHistory[date] = true;
                }
                return { ...habit, history: newHistory };
            }
            return habit;
        });

        setHabits(updatedHabits);
        saveHabits(updatedHabits);
    };

    const getCompletionRate = (days: number = 7): number[] => {
        const rates: number[] = [];
        const today = new Date();

        for (let i = days - 1; i >= 0; i--) {
            const d = new Date();
            d.setDate(today.getDate() - i);
            const dateStr = getDateKey(d);

            let completedCount = 0;
            let totalHabits = habits.length;

            // Filter out habits that didn't exist yet on that date?
            // For simplicity, we assume all current habits are relevant to the denominator 
            // or we only check created date.
            // Let's stick to simple "Active Habits" count.

            habits.forEach(habit => {
                if (habit.history[dateStr]) {
                    completedCount++;
                }
            });

            rates.push(totalHabits > 0 ? (completedCount / totalHabits) * 100 : 0);
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

                totalPossibleCompletions += habits.length;

                habits.forEach(habit => {
                    if (habit.history[dateStr]) {
                        totalActualCompletions++;
                    }
                });
            }

            rates.push(totalPossibleCompletions > 0 ? (totalActualCompletions / totalPossibleCompletions) * 100 : 0);
        }
        return rates;
    };


    return (
        <HabitContext.Provider value={{ habits, addHabit, deleteHabit, toggleHabit, getCompletionRate, getYearlyCompletionRate }}>
            {children}
        </HabitContext.Provider>
    );
};

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

    const addHabit = (name: string, color?: string) => {
        const newHabit: Habit = {
            id: Date.now().toString(),
            name,
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

    return (
        <HabitContext.Provider value={{ habits, addHabit, deleteHabit, toggleHabit, getCompletionRate }}>
            {children}
        </HabitContext.Provider>
    );
};

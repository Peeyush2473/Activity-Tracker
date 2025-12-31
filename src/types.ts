export interface Habit {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  color?: string;
  createdAt: string;
  history: {
    [date: string]: boolean;
  };
}

export interface HabitContextType {
  habits: Habit[];
  addHabit: (name: string, description?: string, icon?: string, color?: string) => void;
  deleteHabit: (id: string) => void;
  toggleHabit: (id: string, date: string) => void;
  getCompletionRate: (days?: number) => number[];
  getYearlyCompletionRate: () => number[];
}

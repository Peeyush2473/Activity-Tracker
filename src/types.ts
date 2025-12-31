export interface Habit {
  id: string;
  name: string;
  color?: string;
  createdAt: string;
  history: {
    [date: string]: boolean;
  };
}

export interface HabitContextType {
  habits: Habit[];
  addHabit: (name: string, color?: string) => void;
  deleteHabit: (id: string) => void;
  toggleHabit: (id: string, date: string) => void;
  getCompletionRate: (days?: number) => number[];
}

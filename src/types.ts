export interface Activity {
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

export interface ActivityContextType {
  activities: Activity[];
  addActivity: (name: string, description?: string, icon?: string, color?: string) => void;
  deleteActivity: (id: string) => void;
  toggleActivity: (id: string, date: string) => void;
  getCompletionRate: (days?: number) => number[];
  getYearlyCompletionRate: () => number[];
}

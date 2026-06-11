import { create } from "zustand";
import { getFromStore, putInStore } from "@/lib/cache";
import { formatDateKey, getTodayKey } from "@/lib/date";

export type GoalPeriod = "daily" | "weekly" | "monthly";
export type GoalMetric = "surahs" | "juz" | "pages" | "minutes";

export interface ReadingGoal {
  id: string;
  metric: GoalMetric;
  target: number;
  period: GoalPeriod;
  label: string;
  createdAt: string;
  reminderTime: string | null;
  reminderEnabled: boolean;
}

interface ReadingGoalsState {
  goals: ReadingGoal[];
  loaded: boolean;
  load: () => Promise<void>;
  addGoal: (goal: Omit<ReadingGoal, "id" | "createdAt">) => Promise<void>;
  updateGoal: (id: string, patch: Partial<ReadingGoal>) => Promise<void>;
  deleteGoal: (id: string) => Promise<void>;
}

function todaysDate(): string {
  return getTodayKey();
}

export function computeStreak(records: { date: string }[]): number {
  if (!records.length) return 0;
  const unique = [...new Set(records.map((r) => r.date))].sort().reverse();
  let streak = 0;
  const today = todaysDate();
  let check = today;
  for (const date of unique) {
    if (date === check) {
      streak++;
      const d = new Date(check);
      d.setDate(d.getDate() - 1);
      check = formatDateKey(d);
    } else if (date < check) {
      break;
    }
  }
  return streak;
}

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

export const useReadingGoalsStore = create<ReadingGoalsState>((set, get) => ({
  goals: [],
  loaded: false,

  load: async () => {
    const stored = await getFromStore<ReadingGoal[]>("reading-goals", "all");
    set({ goals: stored ?? [], loaded: true });
  },

  addGoal: async (goal) => {
    const newGoal: ReadingGoal = {
      ...goal,
      id: generateId(),
      createdAt: todaysDate(),
    };
    const next = [...get().goals, newGoal];
    await putInStore("reading-goals", "all", next);
    set({ goals: next });
  },

  updateGoal: async (id, patch) => {
    const next = get().goals.map((g) => (g.id === id ? { ...g, ...patch } : g));
    await putInStore("reading-goals", "all", next);
    set({ goals: next });
  },

  deleteGoal: async (id) => {
    const next = get().goals.filter((g) => g.id !== id);
    await putInStore("reading-goals", "all", next);
    set({ goals: next });
  },
}));

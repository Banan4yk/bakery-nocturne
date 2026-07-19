import { create } from 'zustand';
import type { DashboardData, MonthData, StaffData } from '../types';
import { fetchDashboardData, fetchMonthData, fetchStaffData } from '../utils/api';

export type View = 'day' | 'month' | 'staff' | 'calc';

interface AppState {
  view: View;
  liteMode: boolean;
  theme: 'dark' | 'light';
  dashData: DashboardData | null;
  monthData: MonthData | null;
  staffData: StaffData | null;
  loading: boolean;
  error: string | null;
  offline: boolean;

  setView: (view: View) => void;
  toggleLiteMode: () => void;
  toggleTheme: () => void;
  loadData: () => Promise<void>;
}

export const useStore = create<AppState>((set) => {
  const savedTheme = localStorage.getItem('bakery-theme') as 'dark' | 'light' | null;
  const initialTheme = savedTheme || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const savedLiteMode = localStorage.getItem('bakery-lite');
  const initialLiteMode = savedLiteMode ? savedLiteMode === 'true' : prefersReducedMotion;

  return {
    view: 'day',
    liteMode: initialLiteMode,
    theme: initialTheme,
    dashData: null,
    monthData: null,
    staffData: null,
    loading: true,
    error: null,
    offline: false,

    setView: (view) => set({ view }),

    toggleLiteMode: () => set((state) => {
      const newLite = !state.liteMode;
      localStorage.setItem('bakery-lite', String(newLite));
      return { liteMode: newLite };
    }),

    toggleTheme: () => set((state) => {
      const newTheme = state.theme === 'dark' ? 'light' : 'dark';
      localStorage.setItem('bakery-theme', newTheme);
      document.documentElement.classList.toggle('dark', newTheme === 'dark');
      return { theme: newTheme };
    }),

    loadData: async () => {
      set({ loading: true, error: null });
      try {
        const [dash, month, staff] = await Promise.all([
          fetchDashboardData(),
          fetchMonthData(),
          fetchStaffData().catch(() => null),
        ]);
        set({ dashData: dash, monthData: month, staffData: staff, loading: false, offline: false });
      } catch (err) {
        set({ error: (err as Error).message || 'Failed to load data', loading: false, offline: true });
      }
    },
  };
});

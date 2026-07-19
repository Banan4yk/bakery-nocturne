import type { DashboardData, MonthData, StaffData } from '../types';

// URL бекенда — НЕ секрет (без ключа нічого не віддасть). Живе в бандлі.
const API_URL = import.meta.env.VITE_API_ENDPOINT as string | undefined;

// Ключ береться з URL-хеша (#k=...) або localStorage — НЕ запікається в бандл.
function getKey(): string {
  try {
    const h = new URLSearchParams(location.hash.replace(/^#/, '')).get('k');
    if (h) { localStorage.setItem('bakery-key', h); return h; }
    return localStorage.getItem('bakery-key') || '';
  } catch { return ''; }
}

async function fetchJson<T>(page: string, mockPath: string, cacheKey: string): Promise<T> {
  const key = getKey();
  if (API_URL && key) {
    try {
      const res = await fetch(`${API_URL}?page=${page}&json=1&k=${encodeURIComponent(key)}`);
      if (!res.ok) throw new Error('Network response was not ok');
      const data = await res.json();
      try { localStorage.setItem(cacheKey, JSON.stringify(data)); } catch { /* noop */ }
      return data as T;
    } catch (error) {
      console.warn('Fetch failed, trying localStorage cache', error);
      const cached = localStorage.getItem(cacheKey);
      if (cached) return JSON.parse(cached) as T;
      throw error;
    }
  }
  // Dev / без ключа — мок
  const res = await fetch(mockPath);
  if (!res.ok) throw new Error('Failed to load mock data');
  return res.json() as Promise<T>;
}

export const fetchDashboardData = (): Promise<DashboardData> => fetchJson('dash', '/mock/dash.json', 'bakery-dash-data');
export const fetchMonthData = (): Promise<MonthData> => fetchJson('month', '/mock/month.json', 'bakery-month-data');
export const fetchStaffData = (): Promise<StaffData> => fetchJson('staff', '/mock/staff.json', 'bakery-staff-data');

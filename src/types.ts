export interface ShiftData {
  value: number;
  hours: number;
  kpd: number | null;
}

export interface OutletData {
  name: string;
  d1: number;
  d2: number;
  total: number;
}

export interface WavesData {
  d1: number;
  d2: number;
}

export interface HistoryDay {
  date: string;
  total: number;
}

export interface DashboardData {
  date: string;
  sheet: string;
  ready: boolean;
  reason: string;
  ratesDefault: boolean;
  targetKpd: number;
  updated: string;
  total: number;
  plannedH: number;
  neededH: number;
  gap: number;
  night: ShiftData;
  day: ShiftData;
  dayKZero: boolean;
  outlets: OutletData[];
  waves: WavesData;
  shiftSum: number;
  deliverySum: number;
  history: HistoryDay[];
  settings?: { rateK: number; rateP: number; headK: number; headP: number; shift: number; splitK: number };
}

export interface MonthSummary {
  month: string;
  sum: number;
  days: number;
  avg: number;
  median: number;
  min: number;
  max: number;
}

export interface DowNorm {
  median: number;
  avg: number;
  n: number;
}

export interface DayRecord {
  date: string;
  dow: string;
  total: number;
}

export interface MonthData {
  updated: string;
  months: MonthSummary[];
  dow: Record<string, DowNorm>;
  days: DayRecord[];
}

export interface StaffCell {
  label: string;
  zl: number;
  rate: number | null;
  n: number;
  source: string;
  needH: number;
  bodies: number;
}

export interface StaffData {
  date: string;
  sheet: string;
  ready: boolean;
  reason?: string;
  updated: string;
  target: number;
  anyCalibrated: boolean;
  cells: StaffCell[];
  recent: { n: number; nightKpd: number | null; dayKpd: number | null; nightBias: number | null; dayBias: number | null };
  factConfigured: boolean;
  factLatest: string | null;
}

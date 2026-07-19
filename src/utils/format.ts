export const formatNumber = (num: number): string => {
  return new Intl.NumberFormat('pl-PL').format(num);
};

export const getStatusColorClass = (kpd: number | null, target: number): string => {
  if (kpd === null) return 'text-secondary';
  if (kpd >= target * 0.9) return 'text-ok';
  if (kpd >= target * 0.5) return 'text-warn';
  return 'text-crit';
};

export const getGapStatus = (gap: number, planned: number) => {
  if (Math.abs(gap) <= 0.15 * planned || planned === 0) {
    return { text: 'Штат у нормі', color: 'text-ok' };
  }
  if (gap > 0) {
    return { text: `Зайві: ${gap} год`, color: 'text-crit' };
  }
  return { text: `Бракує: ${Math.abs(gap)} год`, color: 'text-warn' };
};

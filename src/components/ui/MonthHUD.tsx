import React from 'react';
import { useStore } from '../../store/useStore';
import { formatNumber } from '../../utils/format';

const DOW_ORDER = ['Pon', 'Wt', 'Sr', 'Czt', 'Pt', 'sob', 'Nd Narutowicza'];
const DOW_LABEL: Record<string, string> = { Pon: 'Пн', Wt: 'Вт', Sr: 'Ср', Czt: 'Чт', Pt: 'Пт', sob: 'Сб', 'Nd Narutowicza': 'Нд' };

const Bar: React.FC<{ label: string; pct: number; value: string; sub?: string }> = ({ label, pct, value, sub }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 10, margin: '10px 0' }}>
    <span style={{ width: 96, fontWeight: 700, fontSize: 13, flex: '0 0 auto', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{label}</span>
    <span style={{ flex: 1, height: 22, borderRadius: 7, background: 'rgba(124,92,255,0.12)', overflow: 'hidden', display: 'block' }}>
      <span style={{ display: 'block', height: '100%', width: `${Math.max(3, pct)}%`, borderRadius: 7, background: 'linear-gradient(90deg,var(--accent-1),var(--accent-2))' }} />
    </span>
    <span className="tabular-nums" style={{ width: 88, textAlign: 'right', fontWeight: 800, fontSize: 13, flex: '0 0 auto' }}>
      {value}{sub && <><br /><small style={{ color: 'var(--text-secondary)', fontWeight: 600, fontSize: 11 }}>{sub}</small></>}
    </span>
  </div>
);

export const MonthHUD: React.FC = () => {
  const { monthData } = useStore();
  if (!monthData) return <div className="view-scroll"><div className="glass-panel">Завантаження…</div></div>;
  const months = monthData.months || [];
  const dow = monthData.dow || {};

  if (!months.length) {
    return (
      <div className="view-scroll">
        <div className="text-xl font-bold">📆 Місячна історія</div>
        <div className="glass-panel"><div className="text-secondary">Історія ще накопичується — підсумки з'являться, щойно буде кілька днів.</div></div>
      </div>
    );
  }

  const totalAll = months.reduce((a, m) => a + m.sum, 0);
  const daysAll = months.reduce((a, m) => a + m.days, 0);
  const mMax = Math.max(...months.map((m) => m.sum), 1);
  const dk = [...DOW_ORDER.filter((k) => dow[k]), ...Object.keys(dow).filter((k) => !DOW_ORDER.includes(k))];
  const dMax = Math.max(...dk.map((k) => dow[k].median), 1);

  return (
    <div className="view-scroll">
      <div>
        <div className="text-xl font-bold">📆 Місячна історія</div>
        <div className="text-sm text-secondary">виробництво · оновлено {monthData.updated}</div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 12 }}>
        {[['Місяців', String(months.length)], ['Днів', String(daysAll)], ['Разом', `${formatNumber(totalAll)} zł`], ['Сер./день', `${formatNumber(Math.round(daysAll ? totalAll / daysAll : 0))} zł`]].map(([l, v]) => (
          <div key={l} className="glass-panel">
            <div className="text-xs text-secondary" style={{ textTransform: 'uppercase', letterSpacing: '.05em', fontWeight: 700 }}>{l}</div>
            <div className="text-2xl tabular-nums" style={{ marginTop: 6 }}>{v}</div>
          </div>
        ))}
      </div>

      <div className="glass-panel">
        <div className="text-sm text-secondary" style={{ fontWeight: 700, marginBottom: 8 }}>📊 Обсяг по місяцях</div>
        {months.map((m) => (
          <Bar key={m.month} label={m.month} pct={(m.sum / mMax) * 100} value={`${formatNumber(Math.round(m.sum))}`} sub={`${m.days} дн · сер ${formatNumber(Math.round(m.avg))}`} />
        ))}
      </div>

      <div className="glass-panel">
        <div className="text-sm text-secondary" style={{ fontWeight: 700, marginBottom: 8 }}>📅 Норма по днях тижня (медіана)</div>
        {dk.map((k) => (
          <Bar key={k} label={DOW_LABEL[k] || k} pct={(dow[k].median / dMax) * 100} value={`${formatNumber(Math.round(dow[k].median))}`} sub={`n=${dow[k].n}`} />
        ))}
        <div className="text-xs text-secondary" style={{ marginTop: 6 }}>Субота ≠ понеділок — порівнюй день із його ж нормою.</div>
      </div>
    </div>
  );
};

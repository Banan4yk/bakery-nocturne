import React from 'react';
import { useStore } from '../../store/useStore';

export const StaffHUD: React.FC = () => {
  const { staffData } = useStore();
  if (!staffData) return <div className="view-scroll"><div className="glass-panel">Завантаження…</div></div>;
  if (!staffData.ready) {
    return (
      <div className="view-scroll">
        <div className="text-xl font-bold">🎯 Штат</div>
        <div className="glass-panel"><div className="text-warn">Дані не готові: {staffData.reason || ''}</div></div>
      </div>
    );
  }
  const cells = (staffData.cells || []).filter((c) => c.zl > 0);
  const srcLabel = (c: { source: string; n: number }) =>
    c.source === 'calibrated' ? `факт·${c.n}дн` : c.source === 'blended' ? `змішано·${c.n}` : 'план';
  const rec = staffData.recent;

  return (
    <div className="view-scroll">
      <div>
        <div className="text-xl font-bold">🎯 Штат на завтра</div>
        <div className="text-sm text-secondary">{staffData.date} · {staffData.sheet} · ставка {staffData.anyCalibrated ? 'калібрована' : 'орієнтир'}</div>
      </div>

      <div className="glass-panel">
        <div className="text-sm text-secondary" style={{ fontWeight: 700, marginBottom: 10 }}>👥 Рекомендація по ролях</div>
        {cells.length === 0 && <div className="text-secondary">Немає замовлень по змінах на завтра.</div>}
        {cells.map((c) => (
          <div key={c.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', margin: '11px 0' }}>
            <span style={{ fontWeight: 700, fontSize: 14 }}>{c.label}</span>
            <span style={{ textAlign: 'right' }} className="tabular-nums">
              <b style={{ fontSize: 17 }}>{c.bodies} ос</b> · {String(c.needH).replace('.', ',')} год
              <br /><small style={{ color: 'var(--text-secondary)', fontSize: 11 }}>@{c.rate} zł/год ({srcLabel(c)})</small>
            </span>
          </div>
        ))}
        <div className="text-xs text-secondary" style={{ marginTop: 8 }}>📏 Ціль-орієнтир: {staffData.target} zł/год (мета, не дільник). Люди округлені у безпечний бік.</div>
      </div>

      <div className="glass-panel">
        <div className="text-sm text-secondary" style={{ fontWeight: 700, marginBottom: 8 }}>📅 Реальний КПД (останні дні)</div>
        {rec && rec.n > 0 ? (
          <div className="text-sm" style={{ lineHeight: 1.7 }}>
            🌙 Нічна: <b>{rec.nightKpd ? Math.round(rec.nightKpd) : '—'}</b> zł/год · ☀️ Денна: <b>{rec.dayKpd ? Math.round(rec.dayKpd) : '—'}</b> zł/год
            <br /><small style={{ color: 'var(--text-secondary)' }}>за {rec.n} дн{rec.nightBias != null ? ` · похибка ніч ${rec.nightBias >= 0 ? '+' : ''}${Math.round(rec.nightBias)} год` : ''}</small>
          </div>
        ) : (
          <div className="text-secondary text-sm">
            Реальні години з maka накопичуються (backfill щоранку). {staffData.factConfigured ? `maka увімкнено${staffData.factLatest ? `, остання ${staffData.factLatest}` : ''}.` : 'maka ще не під\'єднано.'}
          </div>
        )}
      </div>
    </div>
  );
};

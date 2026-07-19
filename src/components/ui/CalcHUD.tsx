import React, { useState } from 'react';
import { useStore } from '../../store/useStore';
import { formatNumber } from '../../utils/format';

const h1 = (n: number) => (Math.round(n * 10) / 10).toString().replace('.', ',');
const pnum = (v: string) => {
  const t = v.replace(/[\s ]/g, '').replace(',', '.');
  const n = parseFloat(t);
  return isFinite(n) ? n : NaN;
};

export const CalcHUD: React.FC = () => {
  const { dashData } = useStore();
  const s = dashData?.settings || { rateK: 47, rateP: 30, headK: 12, headP: 12, shift: 8, splitK: 0.5 };
  const [mode, setMode] = useState<'sum' | 'hours'>('sum');
  const [val, setVal] = useState('');
  const [res, setRes] = useState<React.ReactNode>(null);

  const calc = () => {
    const v = pnum(val);
    if (isNaN(v) || v < 0) { setRes(<span className="text-crit">Введи число.</span>); return; }
    if (mode === 'sum') {
      const splitK = s.splitK > 0 && s.splitK < 1 ? s.splitK : 0.5;
      const vK = v * splitK, vP = v - vK;
      const hK = s.rateK > 0 ? vK / s.rateK : 0, hP = s.rateP > 0 ? vP / s.rateP : 0;
      setRes(<>При {formatNumber(v)} zł:<br />🍰 Кондитер: <b>{h1(hK)}</b> люд·год<br />🥖 Пекар: <b>{h1(hP)}</b> люд·год<br />Разом: <b>{h1(hK + hP)}</b> люд·год</>);
    } else {
      const vvK = s.rateK * v * s.headK, vvP = s.rateP * v * s.headP;
      setRes(<>При {h1(v)} год/особу:<br />🍰 Кондитери ({s.headK}): <b>{formatNumber(Math.round(vvK))} zł</b><br />🥖 Пекарі ({s.headP}): <b>{formatNumber(Math.round(vvP))} zł</b><br />РАЗОМ: <b>{formatNumber(Math.round(vvK + vvP))} zł</b></>);
    }
  };

  const segBtn = (m: 'sum' | 'hours', label: string) => (
    <button onClick={() => { setMode(m); setRes(null); }}
      style={{ flex: 1, padding: 10, borderRadius: 9999, fontSize: 13, fontWeight: 700,
        color: mode === m ? '#fff' : 'var(--text-secondary)',
        background: mode === m ? 'linear-gradient(135deg,var(--accent-1),var(--accent-2))' : 'transparent' }}>
      {label}
    </button>
  );

  return (
    <div className="view-scroll">
      <div>
        <div className="text-xl font-bold">🧮 Розрахунок</div>
        <div className="text-sm text-secondary">продуктивність: кондитер {Math.round(s.rateK)} · пекар {Math.round(s.rateP)} zł/год (не зарплата)</div>
      </div>
      <div className="glass-panel">
        <div style={{ display: 'flex', gap: 5, padding: 5, borderRadius: 9999, background: 'rgba(124,92,255,0.1)', marginBottom: 14 }}>
          {segBtn('sum', 'Сума → Години')}
          {segBtn('hours', 'Години → Сума')}
        </div>
        <div className="text-xs text-secondary" style={{ fontWeight: 700 }}>{mode === 'sum' ? 'Скільки замовлень (zł)?' : 'Скільки годин на особу?'}</div>
        <input
          value={val}
          onChange={(e) => setVal(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') calc(); }}
          inputMode="decimal"
          placeholder={mode === 'sum' ? 'напр. 7000' : 'напр. 8'}
          style={{ width: '100%', fontSize: 17, fontWeight: 700, color: 'var(--text-primary)', background: 'rgba(124,92,255,0.08)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, padding: '13px 15px', marginTop: 8, outline: 'none' }}
        />
        <button onClick={calc}
          style={{ display: 'block', width: '100%', marginTop: 12, fontSize: 15, fontWeight: 800, color: '#fff', padding: 14, borderRadius: 14, background: 'linear-gradient(135deg,var(--accent-1),var(--accent-2))' }}>
          Порахувати
        </button>
        {res && <div className="text-base" style={{ marginTop: 14, lineHeight: 1.7 }}>{res}</div>}
      </div>
    </div>
  );
};

import React, { useEffect, useRef } from 'react';
import { useStore } from '../../store/useStore';
import { formatNumber, getGapStatus, getStatusColorClass } from '../../utils/format';
import { Moon, Sun, Zap, ZapOff, CloudOff } from 'lucide-react';
import gsap from 'gsap';

export const HUD: React.FC = () => {
  const { dashData, loading, toggleTheme, theme, toggleLiteMode, liteMode, offline } = useStore();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      gsap.fromTo(
        containerRef.current.children,
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, stagger: 0.1, duration: 0.6, ease: 'power2.out' }
      );
    }
  }, [dashData]);

  if (loading || !dashData) {
    return (
      <div className="hud-container flex items-center justify-center">
        <div className="glass-panel text-xl">Loading data...</div>
      </div>
    );
  }

  if (!dashData.ready) {
    return (
      <div className="hud-container flex items-center justify-center">
        <div className="glass-panel text-center">
          <div className="text-2xl mb-2 text-warn">Дані ще не готові</div>
          <div className="text-secondary">{dashData.reason || 'Зачекайте оновлення'}</div>
        </div>
      </div>
    );
  }

  const gapStatus = getGapStatus(dashData.gap, dashData.plannedH);

  return (
    <div className="hud-container" ref={containerRef}>
      {/* Top Bar */}
      <div className="flex justify-between items-center w-full mb-4">
        <div>
          <div className="text-xl font-bold">{dashData.sheet}</div>
          <div className="text-sm text-secondary flex gap-2 items-center">
            {dashData.date} • Оновлено: {dashData.updated}
            {offline && <span className="text-warn flex items-center gap-1"><CloudOff size={14}/> Офлайн</span>}
          </div>
        </div>
        <div className="flex gap-2">
          <button onClick={toggleLiteMode} title="Toggle Lite Mode">
            {liteMode ? <ZapOff size={20} /> : <Zap size={20} />}
          </button>
          <button onClick={toggleTheme} title="Toggle Theme">
            {theme === 'dark' ? <Moon size={20} /> : <Sun size={20} />}
          </button>
        </div>
      </div>

      {/* Main Metrics (Top Left) */}
      <div className="glass-panel" style={{ maxWidth: '280px' }}>
        <div className="text-sm text-secondary mb-1">Замовлено на завтра</div>
        <div className="text-4xl tabular-nums mb-4">{formatNumber(dashData.total)} zł</div>
        
        <div className="flex justify-between text-sm mb-2">
          <span className="text-secondary">Треба годин:</span>
          <span className="tabular-nums font-bold">{dashData.neededH}</span>
        </div>
        <div className="flex justify-between text-sm mb-2">
          <span className="text-secondary">Заплановано:</span>
          <span className="tabular-nums font-bold">{dashData.plannedH}</span>
        </div>
        <div className={`text-sm font-bold ${gapStatus.color}`}>
          {gapStatus.text}
        </div>
        {dashData.ratesDefault && (
          <div className="mt-2 text-xs bg-[rgba(247,144,9,0.2)] text-warn px-2 py-1 rounded">
            Ставки орієнтовні
          </div>
        )}
      </div>

      {/* Bottom Area */}
      <div className="mt-auto flex justify-between items-end w-full">
        {/* Deliveries */}
        <div className="glass-panel" style={{ minWidth: '200px' }}>
          <div className="text-sm text-secondary mb-2">Точки доставки</div>
          <div className="flex flex-col gap-1">
            {dashData.outlets.map(o => (
              <div key={o.name} className="flex justify-between text-sm">
                <span className="text-secondary">{o.name}</span>
                <span className="tabular-nums font-bold">
                  {dashData.sheet === 'Nd Narutowicza' && o.name !== 'Narutowicza' ? '—' : formatNumber(o.total)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Waves & Shifts HUD Data */}
        <div className="flex flex-col items-end gap-4">
          <div className="glass-panel text-right">
             <div className="text-sm text-secondary">Хвилі</div>
             <div className="flex gap-4 mt-1 text-sm font-bold">
               <div><span className="text-accent-1">D1 5:20</span> {formatNumber(dashData.waves.d1)}</div>
               <div><span className="text-accent-2">D2 10:30</span> {formatNumber(dashData.waves.d2)}</div>
             </div>
          </div>
          
          <div className="flex gap-4">
            <div className="glass-panel text-center">
              <div className="text-xs text-[var(--shift-night)] font-bold mb-1">НІЧНА</div>
              <div className="text-sm tabular-nums">{formatNumber(dashData.night.value)} zł</div>
              <div className={`text-lg font-bold ${getStatusColorClass(dashData.night.kpd, dashData.targetKpd)}`}>
                {dashData.night.kpd ?? '—'}
              </div>
            </div>
            <div className="glass-panel text-center">
              <div className="text-xs text-[var(--shift-day)] font-bold mb-1">ДЕННА</div>
              <div className="text-sm tabular-nums">{formatNumber(dashData.day.value)} zł</div>
              <div className={`text-lg font-bold ${getStatusColorClass(dashData.day.kpd, dashData.targetKpd)}`}>
                {dashData.day.kpd ?? '—'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

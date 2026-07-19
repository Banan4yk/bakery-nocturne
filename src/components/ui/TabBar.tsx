import React from 'react';
import { useStore } from '../../store/useStore';
import type { View } from '../../store/useStore';

const TABS: { id: View; icon: string; label: string }[] = [
  { id: 'day', icon: '🥖', label: 'День' },
  { id: 'month', icon: '📆', label: 'Місяць' },
  { id: 'staff', icon: '🎯', label: 'Штат' },
  { id: 'calc', icon: '🧮', label: 'Розрах.' },
];

export const TabBar: React.FC = () => {
  const { view, setView } = useStore();
  return (
    <nav
      style={{
        position: 'fixed',
        left: '50%',
        bottom: 'calc(env(safe-area-inset-bottom, 0px) + 16px)',
        transform: 'translateX(-50%)',
        zIndex: 100,
        display: 'flex',
        gap: 4,
        padding: 5,
        borderRadius: 9999,
        background: 'var(--panel-bg)',
        backdropFilter: 'blur(18px)',
        WebkitBackdropFilter: 'blur(18px)',
        border: '1px solid rgba(255,255,255,0.08)',
        boxShadow: '0 12px 40px rgba(0,0,0,0.4)',
      }}
    >
      {TABS.map((t) => {
        const on = view === t.id;
        return (
          <button
            key={t.id}
            onClick={() => setView(t.id)}
            style={{
              padding: '10px 15px',
              borderRadius: 9999,
              fontSize: 13,
              fontWeight: 700,
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              color: on ? '#fff' : 'var(--text-secondary)',
              background: on ? 'linear-gradient(135deg, var(--accent-1), var(--accent-2))' : 'transparent',
              boxShadow: on ? '0 6px 16px rgba(124,92,255,0.45)' : 'none',
              transition: 'color .25s, background .25s',
            }}
          >
            <span style={{ fontSize: 16 }}>{t.icon}</span>
            <span className="tab-label">{t.label}</span>
          </button>
        );
      })}
    </nav>
  );
};

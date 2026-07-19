import React, { useEffect } from 'react';
import { useStore } from '../../store/useStore';
import { HUD } from '../ui/HUD';
import { MonthHUD } from '../ui/MonthHUD';
import { StaffHUD } from '../ui/StaffHUD';
import { CalcHUD } from '../ui/CalcHUD';
import { TabBar } from '../ui/TabBar';
import { Scene } from '../3d/Scene';

export const DashboardView: React.FC = () => {
  const { loadData, theme, view } = useStore();

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [loadData]);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    document.documentElement.classList.toggle('light', theme === 'light');
  }, [theme]);

  return (
    <>
      {/* 3D-сцена — фон для всіх вкладок */}
      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: -10 }}>
        <Scene />
      </div>

      {view === 'day' && <HUD />}
      {view === 'month' && <MonthHUD />}
      {view === 'staff' && <StaffHUD />}
      {view === 'calc' && <CalcHUD />}

      <TabBar />
    </>
  );
};

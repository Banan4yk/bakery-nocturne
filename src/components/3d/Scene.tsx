import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment, Float, OrbitControls } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import { HeroBatch } from './HeroBatch';
import { ShiftGauge } from './ShiftGauge';
import { useStore } from '../../store/useStore';

export const Scene: React.FC = () => {
  const { dashData, liteMode } = useStore();

  if (!dashData) return null;

  return (
    <Canvas camera={{ position: [0, 0, 10], fov: 45 }}>
      <color attach="background" args={['#0a0b12']} />
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      
      <Suspense fallback={null}>
        <Environment preset="city" />
        
        <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
          <HeroBatch />
        </Float>

        <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.5}>
          <ShiftGauge 
            position={[-4, 0, -2]} 
            kpd={dashData.night.kpd} 
            targetKpd={dashData.targetKpd}
            color="#5eb4ff"
          />
        </Float>

        <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.5}>
          <ShiftGauge 
            position={[4, 0, -2]} 
            kpd={dashData.day.kpd} 
            targetKpd={dashData.targetKpd}
            color="#f79009"
          />
        </Float>

        {/* Postprocessing - disabled in lite mode */}
        {!liteMode && (
          <EffectComposer>
            <Bloom luminanceThreshold={0.2} luminanceSmoothing={0.9} height={300} />
          </EffectComposer>
        )}
      </Suspense>

      <OrbitControls 
        enableZoom={false} 
        enablePan={false}
        maxPolarAngle={Math.PI / 2 + 0.2}
        minPolarAngle={Math.PI / 2 - 0.2}
        maxAzimuthAngle={0.2}
        minAzimuthAngle={-0.2}
      />
    </Canvas>
  );
};

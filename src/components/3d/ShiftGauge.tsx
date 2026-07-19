import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface ShiftGaugeProps {
  position: [number, number, number];
  kpd: number | null;
  targetKpd: number;
  color: string;
}

export const ShiftGauge: React.FC<ShiftGaugeProps> = ({ position, kpd, targetKpd, color }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame(({ clock }) => {
    if (meshRef.current) {
      meshRef.current.rotation.z = clock.getElapsedTime() * -0.2;
    }
  });

  const fillRatio = kpd ? Math.min(kpd / targetKpd, 1) : 0;
  const angle = fillRatio * Math.PI * 2;

  return (
    <group position={position}>
      {/* Background track */}
      <mesh>
        <torusGeometry args={[1.5, 0.1, 16, 100]} />
        <meshStandardMaterial color="#333333" transparent opacity={0.3} />
      </mesh>
      
      {/* Fill */}
      {kpd !== null && (
        <mesh ref={meshRef}>
          <torusGeometry args={[1.5, 0.12, 16, 100, angle]} />
          <meshStandardMaterial 
            color={color} 
            emissive={color}
            emissiveIntensity={0.8}
            roughness={0.2}
            metalness={0.8}
          />
        </mesh>
      )}
    </group>
  );
};

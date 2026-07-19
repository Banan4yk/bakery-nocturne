import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere, MeshDistortMaterial } from '@react-three/drei';
import { useStore } from '../../store/useStore';
import * as THREE from 'three';

export const HeroBatch: React.FC = () => {
  const { dashData } = useStore();
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = clock.getElapsedTime() * 0.1;
      meshRef.current.rotation.x = clock.getElapsedTime() * 0.05;
    }
  });

  if (!dashData) return null;

  // Size proportional to total orders
  const scale = Math.max(1, Math.min(3, dashData.total / 1000));
  
  // Color based on gap
  let color = '#12b76a'; // ok
  const planned = dashData.plannedH;
  const gap = dashData.gap;
  if (Math.abs(gap) > 0.15 * planned && planned > 0) {
    if (gap > 0) color = '#f04463'; // crit (too many)
    else color = '#f79009'; // warn (not enough)
  }

  return (
    <Sphere ref={meshRef} args={[1, 64, 64]} scale={scale} position={[0, 0, 0]}>
      <MeshDistortMaterial
        color={color}
        envMapIntensity={1}
        clearcoat={1}
        clearcoatRoughness={0.1}
        metalness={0.1}
        roughness={0.4}
        distort={0.3}
        speed={2}
        emissive={color}
        emissiveIntensity={0.5}
      />
    </Sphere>
  );
};

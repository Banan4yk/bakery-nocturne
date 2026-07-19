import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, Points, PointMaterial } from '@react-three/drei';
import { EffectComposer, Bloom, Noise } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';
import * as THREE from 'three';
import { random, easing } from 'maath';

interface SceneProps {
  isIntro: boolean;
}

// Mouse Parallax for the camera
const CameraParallax: React.FC<{ isIntro: boolean }> = ({ isIntro }) => {
  useFrame((state, delta) => {
    if (!isIntro) {
      // Smoothly move the camera based on mouse position
      const targetX = (state.pointer.x * 2);
      const targetY = (state.pointer.y * 2);
      
      easing.damp3(state.camera.position, [targetX, targetY, 10], 0.5, delta);
      state.camera.lookAt(0, 0, 0);
    }
  });
  return null;
};

// Bread Logo Component
const BreadLogo: React.FC<{ isIntro: boolean }> = ({ isIntro }) => {
  const meshRef = useRef<THREE.Mesh>(null);

  // Create a stylized bread shape
  const breadShape = useMemo(() => {
    const shape = new THREE.Shape();
    shape.moveTo(-1, -1);
    shape.lineTo(-1, 0.5);
    shape.bezierCurveTo(-1.5, 2, 1.5, 2, 1, 0.5);
    shape.lineTo(1, -1);
    shape.quadraticCurveTo(0, -1.2, -1, -1);
    return shape;
  }, []);

  useFrame((_state, delta) => {
    if (meshRef.current) {
      if (isIntro) {
        meshRef.current.rotation.y += delta * 5.0;
        meshRef.current.position.z = THREE.MathUtils.lerp(meshRef.current.position.z, 0, 0.1);
      } else {
        if (!meshRef.current.userData.normalized) {
           meshRef.current.rotation.x %= (Math.PI * 2);
           meshRef.current.rotation.y %= (Math.PI * 2);
           meshRef.current.rotation.z %= (Math.PI * 2);

           if (meshRef.current.rotation.x > Math.PI) meshRef.current.rotation.x -= Math.PI * 2;
           if (meshRef.current.rotation.x < -Math.PI) meshRef.current.rotation.x += Math.PI * 2;
           if (meshRef.current.rotation.y > Math.PI) meshRef.current.rotation.y -= Math.PI * 2;
           if (meshRef.current.rotation.y < -Math.PI) meshRef.current.rotation.y += Math.PI * 2;
           if (meshRef.current.rotation.z > Math.PI) meshRef.current.rotation.z -= Math.PI * 2;
           if (meshRef.current.rotation.z < -Math.PI) meshRef.current.rotation.z += Math.PI * 2;

           meshRef.current.userData.normalized = true;
        }

        easing.dampE(meshRef.current.rotation, [0, 0, 0], 0.6, delta);
        easing.damp3(meshRef.current.position, [0, 2.5, 0], 0.4, delta);
        easing.damp3(meshRef.current.scale, [0.6, 0.6, 0.6], 0.8, delta);
      }
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
      <mesh ref={meshRef} position={[0, 0, 5]} scale={[10.0, 10.0, 10.0]}>
        <extrudeGeometry args={[breadShape, { depth: 0.2, bevelEnabled: true, bevelSegments: 3, steps: 2, bevelSize: 0.1, bevelThickness: 0.1 }]} />
        <meshStandardMaterial 
          color="#ffffff" 
          emissive="#ffffff" 
          emissiveIntensity={2} 
          wireframe={true} 
          transparent
          opacity={0.9}
        />
      </mesh>
    </Float>
  );
};

// Flour Particles Component
const FlourParticles: React.FC<{ isIntro: boolean }> = ({ isIntro }) => {
  const ref = useRef<THREE.Points>(null);
  const sphere = useMemo(() => random.inSphere(new Float32Array(3000), { radius: 10 }) as Float32Array, []);

  useFrame((_state, delta) => {
    if (ref.current) {
      // Particles move faster during intro
      const speed = isIntro ? 1 : 0.2;
      ref.current.rotation.x -= (delta / 10) * speed;
      ref.current.rotation.y -= (delta / 15) * speed;
    }
  });

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points ref={ref} positions={sphere} stride={3} frustumCulled={false}>
        <PointMaterial 
          transparent 
          color="#ffffff" 
          size={0.05} 
          sizeAttenuation={true} 
          depthWrite={false} 
          opacity={0.8}
        />
      </Points>
    </group>
  );
};

export const LoginScene: React.FC<SceneProps> = ({ isIntro }) => {
  return (
    <>
      <CameraParallax isIntro={isIntro} />
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1.5} color="#ffffff" />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#ffffff" />
      
      <BreadLogo isIntro={isIntro} />
      <FlourParticles isIntro={isIntro} />

      {/* Advanced Modern Postprocessing */}
      <EffectComposer>
        <Bloom luminanceThreshold={0.2} luminanceSmoothing={0.9} height={300} intensity={1.5} />
        {/* Subtle film grain noise for cinematic texture */}
        <Noise opacity={0.025} blendFunction={BlendFunction.OVERLAY} />
      </EffectComposer>
    </>
  );
};

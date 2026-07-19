import React, { useState, useEffect, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Loader } from '@react-three/drei';
import { LoginScene } from './LoginScene';
import { LoginForm } from './LoginForm';
import './login.css';

export const LoginView: React.FC = () => {
  const [isIntro, setIsIntro] = useState(true);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    // Cinematic timing: Logo spins fast, then slows down, then form drops
    const introTimer = setTimeout(() => {
      setIsIntro(false);
    }, 1000); // Intro lasts 1 second

    const formTimer = setTimeout(() => {
      setShowForm(true);
    }, 1300); // Form starts appearing after 1.3s

    return () => {
      clearTimeout(introTimer);
      clearTimeout(formTimer);
    };
  }, []);

  return (
    <div className="login-root">
      <div className="login-canvas-container">
        <Canvas camera={{ position: [0, 0, 10], fov: 45 }}>
          <color attach="background" args={['#050505']} />
          <Suspense fallback={null}>
            <LoginScene isIntro={isIntro} />
          </Suspense>
        </Canvas>
      </div>
      
      <LoginForm show={showForm} />
      <Loader />
    </div>
  );
};

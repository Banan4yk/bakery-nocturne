import React, { useState } from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import { User, Lock, ArrowRight } from 'lucide-react';

interface LoginFormProps {
  show: boolean;
}

export const LoginForm: React.FC<LoginFormProps> = ({ show }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Interactive 3D tilt logic for the form panel
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    x.set(e.clientX - centerX);
    y.set(e.clientY - centerY);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  // Convert mouse position to subtle 3D rotation angles
  const rotateX = useTransform(y, [-200, 200], [8, -8]);
  const rotateY = useTransform(x, [-200, 200], [-8, 8]);

  if (!show) return null;

  return (
    <motion.div 
      initial={{ opacity: 0, y: -300, scale: 0.2, rotateX: 60, rotateZ: -10 }} 
      animate={{ opacity: 1, y: 0, scale: 1, rotateX: 0, rotateZ: 0 }}
      transition={{ 
        type: "spring",
        stiffness: 150,
        damping: 15,
        mass: 1.5,
        delay: 0.1 
      }}
      className="login-form-container"
      style={{ top: '15%', perspective: '1200px' }}
    >
      <motion.div 
        className="login-glass-panel login-form-box"
        style={{ rotateX, rotateY }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="login-form-header"
        >
          <h2 className="login-form-title">
            M<span className="login-logo-accent">Ą<span className="login-logo-accent-mark"></span></span>KA
          </h2>
          <p className="login-form-subtitle">Piekarnia Rzemieślnicza</p>
        </motion.div>

        <form className="login-form-body" onSubmit={(e) => e.preventDefault()}>
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.0, duration: 0.5 }}
            whileHover={{ scale: 1.02, x: 5 }}
            className="login-input-group"
          >
            <div className="login-input-icon">
              <User size={20} className="login-icon" />
            </div>
            <input
              type="email"
              className="login-glass-input"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.1, duration: 0.5 }}
            whileHover={{ scale: 1.02, x: 5 }}
            className="login-input-group"
          >
            <div className="login-input-icon">
              <Lock size={20} className="login-icon" />
            </div>
            <input
              type="password"
              className="login-glass-input"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.3, duration: 0.5 }}
          >
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit" 
              className="login-glow-button"
            >
              <span>Sign In</span>
              <ArrowRight size={16} />
            </motion.button>
          </motion.div>
        </form>
        
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5, duration: 0.5 }}
            className="login-form-footer"
        >
            Forgot password?
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

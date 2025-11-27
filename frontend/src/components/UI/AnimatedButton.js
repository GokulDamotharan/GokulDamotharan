import React from 'react';
import { motion } from 'framer-motion';

const AnimatedButton = ({ 
  children, 
  variant = 'primary', // primary, secondary, outline
  size = 'md', // sm, md, lg
  icon,
  onClick,
  className = '',
  disabled = false,
  ...props 
}) => {
  const getVariantClass = () => {
    switch (variant) {
      case 'primary':
        return 'btn-gradient-primary';
      case 'secondary':
        return 'btn-gradient-secondary';
      case 'outline':
        return 'btn-outline';
      default:
        return 'btn-gradient-primary';
    }
  };

  const getSizeClass = () => {
    switch (size) {
      case 'sm':
        return 'px-4 py-2 text-sm';
      case 'lg':
        return 'px-8 py-4 text-lg';
      default:
        return 'px-6 py-3';
    }
  };

  return (
    <motion.button
      whileHover={{ scale: disabled ? 1 : 1.02, y: disabled ? 0 : -2 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      className={`${getVariantClass()} ${getSizeClass()} ripple ${className} ${
        disabled ? 'opacity-50 cursor-not-allowed' : ''
      }`}
      onClick={disabled ? null : onClick}
      disabled={disabled}
      {...props}
    >
      <span className="d-flex align-items-center justify-content-center gap-2">
        {icon && <span>{icon}</span>}
        {children}
      </span>
    </motion.button>
  );
};

export default AnimatedButton;

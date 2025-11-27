import React from 'react';
import { motion } from 'framer-motion';

const GlassCard = ({ 
  children, 
  className = '', 
  hover = true,
  delay = 0,
  ...props 
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className={`glass-card ${hover ? 'hover-lift' : ''} ${className}`}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export default GlassCard;

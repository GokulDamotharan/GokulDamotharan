import React from 'react';
import { motion } from 'framer-motion';

const ModernInput = ({ 
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  icon,
  error,
  className = '',
  ...props 
}) => {
  return (
    <div className={`mb-3 ${className}`}>
      {label && (
        <label className="d-block mb-2 font-weight-600" style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem' }}>
          {label}
        </label>
      )}
      <div className="position-relative">
        {icon && (
          <div className="position-absolute" style={{ left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-light)' }}>
            {icon}
          </div>
        )}
        <motion.input
          whileFocus={{ scale: 1.01 }}
          type={type}
          className={`input-modern ${icon ? 'pl-5' : ''} ${error ? 'border-danger' : ''}`}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          {...props}
        />
      </div>
      {error && (
        <motion.small 
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-danger mt-1 d-block"
        >
          {error}
        </motion.small>
      )}
    </div>
  );
};

export default ModernInput;

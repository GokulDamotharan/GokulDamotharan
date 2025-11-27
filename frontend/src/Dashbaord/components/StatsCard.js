import React from 'react';
import { motion } from 'framer-motion';

const StatsCard = ({ title, value, icon: Icon, trend, color, delay }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: delay }}
      className="glass-card p-4 h-100 position-relative overflow-hidden"
    >
      <div className="position-absolute" style={{
        top: -20,
        right: -20,
        width: 100,
        height: 100,
        background: `radial-gradient(circle, ${color}20 0%, transparent 70%)`,
        borderRadius: '50%',
        filter: 'blur(20px)'
      }}></div>

      <div className="d-flex justify-content-between align-items-start mb-3">
        <div className="p-3 rounded-xl" style={{ background: `${color}15`, borderRadius: '16px' }}>
          <Icon size={24} style={{ color: color }} />
        </div>
        {trend && (
          <span className="badge badge-pill py-2 px-3" style={{ 
            background: trend > 0 ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
            color: trend > 0 ? 'var(--color-success)' : 'var(--color-danger)',
            fontWeight: 600
          }}>
            {trend > 0 ? '+' : ''}{trend}%
          </span>
        )}
      </div>

      <h3 className="font-weight-bold mb-1 text-dark">{value}</h3>
      <p className="text-secondary mb-0 font-weight-medium" style={{ fontSize: '0.9rem' }}>{title}</p>
    </motion.div>
  );
};

export default StatsCard;

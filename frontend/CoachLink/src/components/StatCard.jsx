import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown } from 'lucide-react';

/**
 * StatCard - reusable stat card for the dashboard.
 * Supports a label, value, icon, trend indicator.
 */
const StatCard = ({ label, value, icon: Icon, iconBg, trend, trendLabel, className = '' }) => {
  const isPositive = trend >= 0;

  return (
    <motion.div
      whileHover={{ y: -3 }}
      className={`bg-white dark:bg-dark-card rounded-2xl p-5 border border-slate-100 dark:border-dark-border shadow-sm ${className}`}
    >
      <div className="flex items-start justify-between mb-4">
        <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">{label}</p>
        <div className={`w-9 h-9 rounded-xl ${iconBg} flex items-center justify-center`}>
          <Icon size={18} className="text-white" />
        </div>
      </div>
      <p className="text-2xl font-black text-primary-orange dark:text-primary-orange mb-2 leading-none">{value}</p>
      {trendLabel && (
        <div className={`flex items-center space-x-1 text-xs font-semibold ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
          {isPositive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
          <span>{trendLabel}</span>
        </div>
      )}
    </motion.div>
  );
};

export default StatCard;

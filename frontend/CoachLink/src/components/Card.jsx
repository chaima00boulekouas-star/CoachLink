import React from 'react';
import { motion } from 'framer-motion';

const Card = ({ children, className = "", onClick, noHover = false }) => {
  return (
    <motion.div
      whileHover={noHover || !onClick ? {} : { y: -5, shadow: "0 20px 25px -5px rgb(0 0 0 / 0.1)" }}
      onClick={onClick}
      className={`
        bg-white dark:bg-dark-card rounded-3xl p-6 border border-slate-100 dark:border-dark-border
        shadow-premium dark:shadow-premium-dark transition-all duration-300
        ${onClick ? 'cursor-pointer' : ''}
        ${className}
      `}
    >
      {children}
    </motion.div>
  );
};

export default Card;

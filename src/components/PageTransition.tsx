import React from 'react';
import { motion } from 'framer-motion';

interface PageTransitionProps {
  children: React.ReactNode;
}

export const PageTransition: React.FC<PageTransitionProps> = ({ children }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{
        type: "spring",
        stiffness: 1000, // Increased significantly for much faster movement
        damping: 50,     // Increased for quick settling without bounce
        duration: 0.03   // Reduced dramatically for very fast transition
      }}
    >
      {children}
    </motion.div>
  );
};
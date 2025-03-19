import React from 'react';
import { motion } from 'framer-motion';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const letterVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0 },
};

const ComingSoon: React.FC = () => {
  const letters = 'COMING SOON'.split('');

  return (
    <div className="flex items-center justify-center min-h-screen bg-white">
      <motion.div
        className="text-black text-6xl font-bold flex space-x-2"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {letters.map((letter, index) => (
          <motion.span key={index} variants={letterVariants}>
            {letter === ' ' ? '\u00A0' : letter}
          </motion.span>
        ))}
      </motion.div>
    </div>
  );
};

export default ComingSoon;

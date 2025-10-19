import { motion, Variants } from 'framer-motion';
import { cn } from '@/lib/utils';
import React from 'react';

interface AnimatedGradientTextProps {
  text: string;
  className?: string;
  style?: React.CSSProperties;
}

const AnimatedGradientText: React.FC<AnimatedGradientTextProps> = ({ text, className, style }) => {
  const words = text.split(' ');

  const container: Variants = {
    hidden: { opacity: 0 },
    visible: (i: number = 1) => ({
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.04 * i },
    }),
  };

  const child: Variants = {
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        damping: 12,
        stiffness: 100,
      },
    },
    hidden: {
      opacity: 0,
      y: 20,
      transition: {
        type: 'spring',
        damping: 12,
        stiffness: 100,
      },
    },
  };

  return (
    <motion.div
      style={{ display: 'flex', flexWrap: 'wrap', ...style }}
      variants={container}
      initial="hidden"
      animate="visible"
      className={cn('gradient-text', className)}
    >
      {words.map((word, index) => (
        <motion.span
          variants={child}
          style={{ marginRight: '5px' }}
          key={index}
        >
          {word}
        </motion.span>
      ))}
    </motion.div>
  );
};

export default AnimatedGradientText;
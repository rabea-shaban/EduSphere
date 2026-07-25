import type { Variants } from "framer-motion";

export const illustrationFloatVariants: Variants = {
  initial: { y: 0 },
  animate: {
    y: [-6, 6, -6],
    transition: {
      duration: 5,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

export const starPulseVariants: Variants = {
  initial: { scale: 0.8, opacity: 0.7 },
  animate: {
    scale: [0.8, 1.2, 0.8],
    opacity: [0.7, 1, 0.7],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

export const fadeUpVariants: Variants = {
  hidden: { opacity: 0, y: 25 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};
